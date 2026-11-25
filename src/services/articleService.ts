import {
  collection,
  getDocs,
  getDoc,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot
} from 'firebase/firestore';
import { db } from './firebase';
import { stripUndefined, formatFirestoreError } from './firebaseStatus';
import { translateArticleFields } from './translationService';
import { Article, Language, ArticleStatus } from '../types';

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

const LOCAL_STORAGE_ARTICLES_KEY = 'newsora_articles_store_v4';

// Clean up any legacy demo-article caches so old seed news never lingers in browser storage
if (typeof window !== 'undefined') {
  try {
    localStorage.removeItem('newsora_articles_store');
    localStorage.removeItem('newsora_articles_store_v2');
    localStorage.removeItem('newsora_articles_store_v3');
  } catch {}
}

const VALID_CATEGORIES = new Set(['india', 'business', 'technology', 'entertainment', 'sports']);

export function sanitizeCategory(catId?: string): string {
  if (catId && VALID_CATEGORIES.has(catId)) return catId;
  if (catId === 'maharashtra' || catId === 'politics' || catId === 'world' || catId === 'crime') return 'india';
  if (catId === 'science' || catId === 'automobile') return 'technology';
  if (catId === 'lifestyle' || catId === 'health' || catId === 'education') return 'entertainment';
  return catId || 'india';
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

// Fast local cache (read-through mirror of Firestore; never falls back to fake seed data)
function loadCachedArticles(): Article[] {
  if (typeof window === 'undefined') return [];
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
  return [];
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
 * Returns strictly what exists in Firebase — no demo/seed articles.
 */
export async function getAllArticlesForAdmin(): Promise<Article[]> {
  try {
    const colRef = collection(db, 'articles');
    const snap = await getDocs(colRef);

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
    return loadCachedArticles();
  }
}

/**
 * Real-time Cloud Firestore subscription for articles.
 * Reflects strictly what is published from Admin Panel in Firebase.
 */
export function subscribeToArticles(
  options: QueryArticleOptions,
  onUpdate: (articles: Article[]) => void,
  onError?: (err: any) => void
): () => void {
  const colRef = collection(db, 'articles');

  const unsubscribe = onSnapshot(
    colRef,
    (snap) => {
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
      onUpdate(filterArticles(loadCachedArticles(), options));
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

  let enTitle = article.translations?.en?.title?.trim() || '';
  let enDesc = article.translations?.en?.description?.trim() || '';
  let enContent = article.translations?.en?.content?.trim() || '';

  let hiTitle = article.translations?.hi?.title?.trim() || '';
  let hiDesc = article.translations?.hi?.description?.trim() || '';
  let hiContent = article.translations?.hi?.content?.trim() || '';

  // Automatic cross-language translation if one language is missing
  if (enTitle && !hiTitle) {
    try {
      const transHi = await translateArticleFields(
        { title: enTitle, description: enDesc, content: enContent },
        'en',
        'hi'
      );
      hiTitle = transHi.title;
      hiDesc = transHi.description;
      hiContent = transHi.content;
    } catch (e) {
      console.warn('[Articles] Auto-translation to Hindi warning:', e);
    }
  } else if (hiTitle && !enTitle) {
    try {
      const transEn = await translateArticleFields(
        { title: hiTitle, description: hiDesc, content: hiContent },
        'hi',
        'en'
      );
      enTitle = transEn.title;
      enDesc = transEn.description;
      enContent = transEn.content;
    } catch (e) {
      console.warn('[Articles] Auto-translation to English warning:', e);
    }
  }

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
        title: enTitle,
        description: enDesc,
        content: enContent,
        slug:
          article.translations?.en?.slug ||
          generateSlug(enTitle || 'article'),
        status: enStatus,
        seoTitle: article.translations?.en?.seoTitle || enTitle,
        seoDescription: article.translations?.en?.seoDescription || enDesc,
        publishedAt:
          enStatus === 'published'
            ? article.translations?.en?.publishedAt || nowIso
            : null
      },
      hi: {
        title: hiTitle,
        description: hiDesc,
        content: hiContent,
        slug:
          article.translations?.hi?.slug ||
          generateSlug(hiTitle || enTitle || 'article-hi'),
        status: hiStatus,
        seoTitle: article.translations?.hi?.seoTitle || hiTitle,
        seoDescription: article.translations?.hi?.seoDescription || hiDesc,
        publishedAt:
          hiStatus === 'published'
            ? article.translations?.hi?.publishedAt || nowIso
            : null
      }
    }
  };

  const cleanData = stripUndefined(fullData);

  try {
    const docRef = doc(db, 'articles', id);
    await setDoc(docRef, cleanData);
  } catch (err: any) {
    console.error('[Articles] Firestore save FAILED:', err);
    throw new Error(formatFirestoreError(err, 'save article'));
  }

  const currentList = loadCachedArticles();
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

  const currentList = loadCachedArticles();
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
