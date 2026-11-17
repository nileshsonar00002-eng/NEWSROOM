import { doc, setDoc, updateDoc, increment, serverTimestamp, collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db } from './firebase';
import { Language } from '../types';

export async function trackArticleView(articleId: string, lang: Language): Promise<void> {
  if (!articleId) return;

  // Session-level deduplication to prevent counting repeated page refreshes
  const sessionKey = `viewed_${articleId}_${lang}`;
  if (sessionStorage.getItem(sessionKey)) {
    return;
  }
  sessionStorage.setItem(sessionKey, '1');

  try {
    const docRef = doc(db, 'analytics', articleId);
    await setDoc(
      docRef,
      {
        articleId,
        viewsTotal: increment(1),
        [`viewsByLang.${lang}`]: increment(1),
        lastViewedAt: serverTimestamp()
      },
      { merge: true }
    );

    // Also update existing article document viewCount (never creates partial shell docs)
    const articleDoc = doc(db, 'articles', articleId);
    await updateDoc(articleDoc, {
      viewCount: increment(1)
    });
  } catch (err) {
    // Non-blocking for reader experience
    console.debug('[Analytics] View log notice:', err);
  }
}

export interface AnalyticsSummary {
  totalViews: number;
  totalArticles: number;
  totalCategories: number;
  mostViewedArticles: { articleId: string; views: number }[];
  categoryPerformance: Record<string, number>;
}

export async function getAnalyticsSummary(): Promise<AnalyticsSummary> {
  try {
    const analyticsCol = collection(db, 'analytics');
    const q = query(analyticsCol, orderBy('viewsTotal', 'desc'), limit(10));
    const snap = await getDocs(q);

    let totalViews = 0;
    const mostViewed: { articleId: string; views: number }[] = [];

    snap.forEach((d) => {
      const data = d.data();
      const views = data.viewsTotal || 0;
      totalViews += views;
      mostViewed.push({
        articleId: d.id,
        views
      });
    });

    return {
      totalViews,
      totalArticles: 0,
      totalCategories: 5,
      mostViewedArticles: mostViewed,
      categoryPerformance: {}
    };
  } catch (err) {
    return {
      totalViews: 0,
      totalArticles: 0,
      totalCategories: 5,
      mostViewedArticles: [],
      categoryPerformance: {}
    };
  }
}
