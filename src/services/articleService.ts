import {
  collection,
  getDocs,
  getDoc,
  doc,
  setDoc,
  deleteDoc,
  query,
  orderBy,
  limit
} from 'firebase/firestore';
import { db } from './firebase';
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

const LOCAL_STORAGE_ARTICLES_KEY = 'newsora_articles_store';

const VALID_CATEGORIES = new Set(['india', 'business', 'technology', 'entertainment', 'sports']);

export function sanitizeCategory(catId?: string): string {
  if (catId && VALID_CATEGORIES.has(catId)) return catId;
  if (catId === 'maharashtra' || catId === 'politics' || catId === 'world' || catId === 'crime') return 'india';
  if (catId === 'science' || catId === 'automobile') return 'technology';
  if (catId === 'lifestyle' || catId === 'health' || catId === 'education') return 'entertainment';
  return 'india';
}

// Helper to safely load articles from localStorage or fallback to SEED_ARTICLES
function loadStoredArticles(): Article[] {
  if (typeof window === 'undefined') {
    return [...SEED_ARTICLES];
  }
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_ARTICLES_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map((item: Article) => ({
          ...item,
          categoryId: sanitizeCategory(item.categoryId)
        }));
      }
    }
  } catch (e) {
    console.warn('[Articles] Error reading localStorage:', e);
  }
  // If not found in localStorage, initialize with seeds
  try {
    localStorage.setItem(LOCAL_STORAGE_ARTICLES_KEY, JSON.stringify(SEED_ARTICLES));
  } catch (e) {
    // Ignore storage quota errors
  }
  return [...SEED_ARTICLES];
}

// Helper to save articles to localStorage and notify all components/tabs
function saveStoredArticles(articles: Article[]): void {
  memoryArticles = [...articles];
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(LOCAL_STORAGE_ARTICLES_KEY, JSON.stringify(articles));
      // Dispatch custom event for same-tab instant sync
      window.dispatchEvent(
        new CustomEvent('newsora_articles_updated', {
          detail: { count: articles.length, timestamp: Date.now() }
        })
      );
    } catch (e) {
      console.warn('[Articles] Error writing to localStorage:', e);
    }
  }
}

// In-memory cache initialized from persistent storage
let memoryArticles: Article[] = loadStoredArticles();

export function generateSlug(title: string): string {
  if (!title) return `article-${Date.now()}`;
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 90) || `article-${Date.now()}`;
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

export async function getAllArticlesForAdmin(): Promise<Article[]> {
  // 1. Immediately read from local persistent storage for instant availability
  const localArticles = loadStoredArticles();

  try {
    const colRef = collection(db, 'articles');
    const q = query(colRef, orderBy('createdAt', 'desc'), limit(100));
    const snap = await getDocs(q);

    if (!snap.empty) {
      const remoteItems: Article[] = [];
      snap.forEach((d) => remoteItems.push({ id: d.id, ...d.data() } as Article));

      // Merge remote items with local items (keep latest version by updatedAt/createdAt)
      const mergedMap = new Map<string, Article>();
      remoteItems.forEach((item) => mergedMap.set(item.id, item));

      localArticles.forEach((localItem) => {
        const remoteItem = mergedMap.get(localItem.id);
        if (!remoteItem) {
          mergedMap.set(localItem.id, localItem);
        } else {
          const localTime = new Date(localItem.updatedAt || localItem.createdAt || 0).getTime();
          const remoteTime = new Date(remoteItem.updatedAt || remoteItem.createdAt || 0).getTime();
          if (localTime >= remoteTime) {
            mergedMap.set(localItem.id, localItem);
          }
        }
      });

      const finalArticles = Array.from(mergedMap.values());
      // Re-sort descending
      finalArticles.sort(
        (a, b) =>
          new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
      );
      saveStoredArticles(finalArticles);
      return finalArticles;
    }
  } catch (err) {
    console.warn('[Articles] Firestore read notice, using persistent store:', err);
  }

  return localArticles;
}

export async function getArticles(options: QueryArticleOptions = {}): Promise<Article[]> {
  const all = await getAllArticlesForAdmin();
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
    // Status check
    if (status !== 'all') {
      if (lang) {
        const trans = article.translations?.[lang];
        const isPublishedInLang = trans && trans.title && trans.status === status;

        // If not published in requested language, check if it's published in ANY other language
        // This ensures news written in Hindi or Marathi or English appears on the site with graceful translation fallback
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
      const transMr = article.translations?.mr;

      const matchEn =
        transEn &&
        (transEn.title.toLowerCase().includes(q) ||
          transEn.description.toLowerCase().includes(q));
      const matchHi =
        transHi &&
        (transHi.title.toLowerCase().includes(q) ||
          transHi.description.toLowerCase().includes(q));
      const matchMr =
        transMr &&
        (transMr.title.toLowerCase().includes(q) ||
          transMr.description.toLowerCase().includes(q));

      if (!matchTags && !matchEn && !matchHi && !matchMr) {
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

export async function getArticleById(id: string): Promise<Article | null> {
  const all = await getAllArticlesForAdmin();
  const localFound = all.find((a) => a.id === id);
  if (localFound) return localFound;

  try {
    const docRef = doc(db, 'articles', id);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return { id: snap.id, ...snap.data() } as Article;
    }
  } catch (err) {
    console.warn('[Articles] Firestore getDoc notice:', err);
  }

  return null;
}

export async function getArticleBySlug(lang: Language, slug: string): Promise<Article | null> {
  const all = await getAllArticlesForAdmin();

  // Find article matching slug in requested language
  let found = all.find((a) => a.translations?.[lang]?.slug === slug);

  // If not found, check if slug matches any other language of an article
  if (!found) {
    found = all.find(
      (a) =>
        a.translations?.en?.slug === slug ||
        a.translations?.hi?.slug === slug ||
        a.translations?.mr?.slug === slug
    );
  }

  // Also match by id if slug happens to be the ID
  if (!found) {
    found = all.find((a) => a.id === slug);
  }

  return found || null;
}

export async function saveArticle(article: Partial<Article>): Promise<string> {
  const id = article.id || `news-${Date.now()}`;
  const nowIso = new Date().toISOString();

  // Determine language statuses carefully: if a translation has content and status isn't explicitly set, default to published
  const enStatus = article.translations?.en?.status || 'published';
  const hiStatus = article.translations?.hi?.status || 'published';
  const mrStatus = article.translations?.mr?.status || 'published';

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
      },
      mr: {
        title: article.translations?.mr?.title || '',
        description: article.translations?.mr?.description || '',
        content: article.translations?.mr?.content || '',
        slug:
          article.translations?.mr?.slug ||
          generateSlug(article.translations?.mr?.title || 'article-mr'),
        status: mrStatus,
        seoTitle: article.translations?.mr?.seoTitle || article.translations?.mr?.title || '',
        seoDescription:
          article.translations?.mr?.seoDescription || article.translations?.mr?.description || '',
        publishedAt:
          mrStatus === 'published'
            ? article.translations?.mr?.publishedAt || nowIso
            : null
      }
    }
  };

  // 1. Immediately persist locally so changes are visible instantly across tabs and page reloads
  const currentList = loadStoredArticles();
  const existingIdx = currentList.findIndex((a) => a.id === id);
  let updatedList: Article[];
  if (existingIdx >= 0) {
    updatedList = [...currentList];
    updatedList[existingIdx] = fullData;
  } else {
    updatedList = [fullData, ...currentList];
  }
  saveStoredArticles(updatedList);

  // 2. Asynchronously sync to Cloud Firestore
  try {
    const docRef = doc(db, 'articles', id);
    await setDoc(docRef, fullData, { merge: true });
  } catch (e) {
    console.warn('[Articles] Firestore setDoc error (saved to persistent local storage):', e);
  }

  return id;
}

export async function deleteArticle(id: string): Promise<void> {
  // 1. Remove from local store immediately
  const currentList = loadStoredArticles();
  const updatedList = currentList.filter((a) => a.id !== id);
  saveStoredArticles(updatedList);

  // 2. Asynchronously delete from Firestore
  try {
    const docRef = doc(db, 'articles', id);
    await deleteDoc(docRef);
  } catch (e) {
    console.warn('[Articles] Firestore delete notice (deleted locally):', e);
  }
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
