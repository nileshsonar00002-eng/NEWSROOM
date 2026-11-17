import {
  collection,
  getDocs,
  getDoc,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  writeBatch
} from 'firebase/firestore';
import { db } from './firebase';
import { stripUndefined, formatFirestoreError } from './firebaseStatus';
import { Article, Language, ArticleStatus } from '../types';
import { SEED_ARTICLES } from './seedService';

export interface QueryArticleOptions {
  lang?: Language;
  status?: ArticleStatus | 'all';
  categoryId?: string;
  isFeatured?: boolean;
  isBreaking?: boolean;
  isTrending?: boolean;
  limitCount?: number;
  searchQuery?: string;
}

const LOCAL_STORAGE_ARTICLES_KEY = 'newsora_articles_store_v3';

const VALID_CATEGORIES = new Set(['india', 'business', 'technology', 'entertainment', 'sports']);

export function sanitizeCategory(catId?: string): string {
  if (catId && VALID_CATEGORIES.has(catId)) return catId;
  if (catId === 'maharashtra' || catId === 'politics' || catId === 'world' || catId === 'crime') return 'india';
  if (catId === 'science' || catId === 'automobile') return 'technology';
  if (catId === 'lifestyle' || catId === 'health' || catId === 'education') return 'entertainment';
  return 'india';
}

function normalizeArticle(id: string, data: any): Article | null {
  if (!data || !data.translations) return null;
  return {
    ...(data as Article),
    id,
    categoryId: sanitizeCategory(data.categoryId)
  };
}

function sortArticlesDesc(list: Article[]): Article[] {
  return [...list].sort(
    (a, b) =>
      new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
  );
}

// Fast local cache (read-through mirror of Firestore, NEVER overrides Firestore)
function loadCachedArticles(): Article[] | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_ARTICLES_KEY);
    if (raw !== null) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed.map((item: Article) => ({
          ...item,
          categoryId: sanitizeCategory(item.categoryId)
        }));
      }
    }
  } catch (e) {
    console.warn('[Articles] Error reading cache:', e);
  }
  return null;
}

function saveCachedArticles(articles: Article[], notify: boolean = false): void {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(LOCAL_STORAGE_ARTICLES_KEY, JSON.stringify(articles));
      if (notify) {
        window.dispatchEvent(
          new CustomEvent('newsora_articles_updated', {
            detail: { count: articles.length, timestamp: Date.now() }
          })
        );
      }
    } catch (e) {
      console.warn('[Articles] Local cache quota warning (data is still safely in Firebase):', e);
    }
  }
}

let bootstrapPromise: Promise<boolean> | null = null;

/**
 * Seeds default starter articles into Cloud Firestore ONCE when a brand new
 * database is completely empty. Once seeded, edits and deletions in Firestore
 * are permanently respected and seed data never resurrects.
 */
async function ensureArticlesBootstrapped(): Promise<boolean> {
  if (bootstrapPromise) return bootstrapPromise;

  bootstrapPromise = (async () => {
    try {
      const metaRef = doc(db, 'siteSettings', 'bootstrap_articles');
      const metaSnap = await getDoc(metaRef);
      if (metaSnap.exists() && metaSnap.data()?.seeded === true) {
        return false; // Already seeded before; empty list is intentional
      }

      const batch = writeBatch(db);
      for (const seed of SEED_ARTICLES) {
        const cleanSeed = stripUndefined({
          ...seed,
          categoryId: sanitizeCategory(seed.categoryId)
        });
        batch.set(doc(db, 'articles', seed.id), cleanSeed);
      }
      batch.set(metaRef, {
        seeded: true,
        seededAt: new Date().toISOString()
      });
      await batch.commit();
      return true;
    } catch (err) {
      console.warn('[Articles] Bootstrap seed skipped:', err);
      return false;
    } finally {
      bootstrapPromise = null;
    }
  })();

  return bootstrapPromise;
}

export function generateSlug(title: string): string {
  if (!title) return `article-${Date.now()}`;
  return (
    title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .substring(0, 90) || `article-${Date.now()}`
  );
}

export async function checkSlugUnique(
  lang: Language,
  slug: string,
  excludeArticleId?: string
): Promise<boolean> {
  const articles = await getAllArticlesForAdmin();
  const duplicate = articles.find(
    (a) =>
      a.id !== excludeArticleId &&
      a.translations &&
      a.translations[lang] &&
      a.translations[lang].slug === slug
  );
  return !duplicate;
}

export function filterArticles(all: Article[], options: QueryArticleOptions = {}): Article[] {
  const {
    lang,
    status = 'published',
    categoryId,
    isFeatured,
    isBreaking,
    isTrending,
    limitCount,
    searchQuery
  } = options;

  let filtered = all.filter((article) => {
    if (status !== 'all') {
      if (lang) {
        const trans = article.translations?.[lang];
        const isPublishedInLang = trans && trans.title && trans.status === status;

        // Graceful fallback: show news published in either English or Hindi
        const isPublishedInAny = Object.values(article.translations || {}).some(
          (t) => t && t.title && t.status === status
        );

        if (!isPublishedInLang && !isPublishedInAny) {
          return false;
        }
      } else {
        const isMatch = Object.values(article.translations || {}).some(
          (t) => t && t.title && t.status === status
        );
        if (!isMatch) return false;
      }
    }

    if (categoryId && categoryId !== 'all') {
      if (article.categoryId !== categoryId) return false;
    }

    if (isFeatured !== undefined && article.isFeatured !== isFeatured) {
      return false;
    }

    if (isBreaking !== undefined && article.isBreaking !== isBreaking) {
      return false;
    }

    if (isTrending !== undefined && article.isTrending !== isTrending) {
      return false;
    }

    if (searchQuery && searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase().trim();
      const matchTags = article.tags?.some((t) => t.toLowerCase().includes(q));
      const transEn = article.translations?.en;
      const transHi = article.translations?.hi;

      const matchEn =
        transEn &&
        (transEn.title.toLowerCase().includes(q) ||
          transEn.description.toLowerCase().includes(q));
      const matchHi =
        transHi &&
        (transHi.title.toLowerCase().includes(q) ||
          transHi.description.toLowerCase().includes(q));

      if (!matchTags && !matchEn && !matchHi) {
        return false;
      }
    }

    return true;
  });

  if (limitCount && limitCount > 0) {
    filtered = filtered.slice(0, limitCount);
  }

  return filtered;
}

/**
 * Fetches all articles directly from Cloud Firestore (Source of Truth).
 */
export async function getAllArticlesForAdmin(): Promise<Article[]> {
  try {
    const colRef = collection(db, 'articles');
    let snap = await getDocs(colRef);

    if (snap.empty) {
      const seeded = await ensureArticlesBootstrapped();
      if (seeded) {
        snap = await getDocs(colRef);
      }
    }

    const remoteItems: Article[] = [];
    snap.forEach((d) => {
      const normalized = normalizeArticle(d.id, d.data());
      if (normalized) remoteItems.push(normalized);
    });

    const sorted = sortArticlesDesc(remoteItems);
    saveCachedArticles(sorted);
    return sorted;
  } catch (err) {
    console.error('[Articles] Firestore read error:', err);
    const cached = loadCachedArticles();
    return cached !== null ? cached : [...SEED_ARTICLES];
  }
}

/**
 * Real-time Cloud Firestore subscription for articles.
 * Automatically updates the Main Site & Admin Panel whenever ANY change happens in Firebase.
 */
export function subscribeToArticles(
  options: QueryArticleOptions,
  onUpdate: (articles: Article[]) => void,
  onError?: (err: any) => void
): () => void {
  const colRef = collection(db, 'articles');

  const unsubscribe = onSnapshot(
    colRef,
    async (snap) => {
      if (snap.empty) {
        const seeded = await ensureArticlesBootstrapped();
        if (seeded) {
          // Next snapshot will automatically deliver seeded docs
          return;
        }
      }

      const remoteItems: Article[] = [];
      snap.forEach((d) => {
        const normalized = normalizeArticle(d.id, d.data());
        if (normalized) remoteItems.push(normalized);
      });

      const sorted = sortArticlesDesc(remoteItems);
      saveCachedArticles(sorted);
      onUpdate(filterArticles(sorted, options));
    },
    (err) => {
      console.error('[Articles] Firestore real-time listener error:', err);
      if (onError) onError(err);
      const cached = loadCachedArticles();
      const fallback = cached !== null ? cached : [...SEED_ARTICLES];
      onUpdate(filterArticles(fallback, options));
    }
  );

  return unsubscribe;
}

export async function getArticles(options: QueryArticleOptions = {}): Promise<Article[]> {
  const all = await getAllArticlesForAdmin();
  return filterArticles(all, options);
}

export async function getArticleById(id: string): Promise<Article | null> {
  try {
    const docRef = doc(db, 'articles', id);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      const normalized = normalizeArticle(snap.id, snap.data());
      if (normalized) return normalized;
    }
  } catch (err) {
    console.warn('[Articles] Firestore getDoc error:', err);
  }

  const all = await getAllArticlesForAdmin();
  return all.find((a) => a.id === id) || null;
}

export async function getArticleBySlug(lang: Language, slug: string): Promise<Article | null> {
  const all = await getAllArticlesForAdmin();

  let found = all.find((a) => a.translations?.[lang]?.slug === slug);

  if (!found) {
    found = all.find(
      (a) =>
        a.translations?.en?.slug === slug ||
        a.translations?.hi?.slug === slug
    );
  }

  if (!found) {
    found = all.find((a) => a.id === slug);
  }

  return found || null;
}

export async function saveArticle(article: Partial<Article>): Promise<string> {
  const id = article.id || `news-${Date.now()}`;
  const nowIso = new Date().toISOString();

  const enStatus = article.translations?.en?.status || 'published';
  const hiStatus = article.translations?.hi?.status || 'published';

  const fullData: Article = {
    id,
    categoryId: sanitizeCategory(article.categoryId || 'india'),
    authorId: article.authorId || 'author-1',
    imageUrl:
      article.imageUrl ||
      'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=1200&q=80',
    imageCaption: article.imageCaption || '',
    imageCredit: article.imageCredit || 'NEWSORA Media',
    sourceUrl: article.sourceUrl || '',
    tags: article.tags && article.tags.length > 0 ? article.tags : ['News', 'India'],
    isFeatured: !!article.isFeatured,
    isBreaking: !!article.isBreaking,
    isTrending: !!article.isTrending,
    readingTimeMinutes: article.readingTimeMinutes || 3,
    viewCount: article.viewCount || 0,
    createdAt: article.createdAt || nowIso,
    updatedAt: nowIso,
    translations: {
      en: {
        title: article.translations?.en?.title || '',
        description: article.translations?.en?.description || '',
        content: article.translations?.en?.content || '',
        slug:
          article.translations?.en?.slug ||
          generateSlug(article.translations?.en?.title || 'article'),
        status: enStatus,
        seoTitle: article.translations?.en?.seoTitle || article.translations?.en?.title || '',
        seoDescription:
          article.translations?.en?.seoDescription || article.translations?.en?.description || '',
        publishedAt:
          enStatus === 'published'
            ? article.translations?.en?.publishedAt || nowIso
            : null
      },
      hi: {
        title: article.translations?.hi?.title || '',
        description: article.translations?.hi?.description || '',
        content: article.translations?.hi?.content || '',
        slug:
          article.translations?.hi?.slug ||
          generateSlug(article.translations?.hi?.title || 'article-hi'),
        status: hiStatus,
        seoTitle: article.translations?.hi?.seoTitle || article.translations?.hi?.title || '',
        seoDescription:
          article.translations?.hi?.seoDescription || article.translations?.hi?.description || '',
        publishedAt:
          hiStatus === 'published'
            ? article.translations?.hi?.publishedAt || nowIso
            : null
      }
    }
  };

  const cleanData = stripUndefined(fullData);

  // Save directly to Cloud Firestore (source of truth) — surface errors clearly!
  try {
    const docRef = doc(db, 'articles', id);
    await setDoc(docRef, cleanData);
    // Mark bootstrap done so user-created articles aren't overwritten
    await setDoc(
      doc(db, 'siteSettings', 'bootstrap_articles'),
      { seeded: true, lastUpdatedAt: nowIso },
      { merge: true }
    );
  } catch (err: any) {
    console.error('[Articles] Firestore save FAILED:', err);
    throw new Error(formatFirestoreError(err, 'save article'));
  }

  // Update local cache immediately for instant UI responsiveness
  const currentList = loadCachedArticles() || [];
  const existingIdx = currentList.findIndex((a) => a.id === id);
  let updatedList: Article[];
  if (existingIdx >= 0) {
    updatedList = [...currentList];
    updatedList[existingIdx] = cleanData;
  } else {
    updatedList = [cleanData, ...currentList];
  }
  saveCachedArticles(sortArticlesDesc(updatedList), true);

  return id;
}

export async function deleteArticle(id: string): Promise<void> {
  try {
    const docRef = doc(db, 'articles', id);
    await deleteDoc(docRef);
  } catch (err: any) {
    console.error('[Articles] Firestore delete FAILED:', err);
    throw new Error(formatFirestoreError(err, 'delete article'));
  }

  const currentList = loadCachedArticles() || [];
  const updatedList = currentList.filter((a) => a.id !== id);
  saveCachedArticles(updatedList, true);
}

export async function toggleLanguagePublishStatus(
  articleId: string,
  lang: Language,
  newStatus: ArticleStatus
): Promise<void> {
  const article = await getArticleById(articleId);
  if (!article) return;

  const currentTrans = article.translations[lang] || {
    title: '',
    description: '',
    content: '',
    slug: '',
    status: 'draft',
    seoTitle: '',
    seoDescription: '',
    publishedAt: null
  };

  article.translations[lang] = {
    ...currentTrans,
    status: newStatus,
    publishedAt:
      newStatus === 'published'
        ? currentTrans.publishedAt || new Date().toISOString()
        : null
  };

  await saveArticle(article);
}
