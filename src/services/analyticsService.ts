import {
  doc,
  setDoc,
  updateDoc,
  increment,
  serverTimestamp,
  collection,
  getDocs,
  getDoc,
  query,
  orderBy,
  limit,
  onSnapshot
} from 'firebase/firestore';
import { db } from './firebase';
import { Language } from '../types';

export interface SiteTrafficData {
  totalVisitors: number;
  totalViews: number;
  lastVisitedAt?: any;
}

const SITE_TRAFFIC_DOC = 'site_traffic';

/**
 * Tracks a site visitor when anyone opens the website.
 * Increments unique visitors (deduplicated per browser session)
 * and total page views in Cloud Firestore.
 */
export async function trackSiteVisitor(pagePath?: string): Promise<void> {
  if (typeof window === 'undefined') return;

  // Don't track admin panel visits as public traffic
  if (window.location.pathname.startsWith('/admin')) {
    return;
  }

  const sessionKey = 'newsora_visitor_session_recorded';
  const isNewVisitor = !sessionStorage.getItem(sessionKey);

  try {
    const trafficDocRef = doc(db, 'analytics', SITE_TRAFFIC_DOC);

    if (isNewVisitor) {
      sessionStorage.setItem(sessionKey, Date.now().toString());
      // Increment both total unique visitors and total views
      await setDoc(
        trafficDocRef,
        {
          totalVisitors: increment(1),
          totalViews: increment(1),
          lastVisitedAt: serverTimestamp()
        },
        { merge: true }
      );
    } else {
      // Return visitor within session - record pageview
      await setDoc(
        trafficDocRef,
        {
          totalViews: increment(1),
          lastVisitedAt: serverTimestamp()
        },
        { merge: true }
      );
    }
  } catch (err) {
    console.debug('[Analytics] Visitor tracking notice:', err);
  }
}

/**
 * Real-time listener for site visitor and traffic stats
 */
export function subscribeToSiteTraffic(
  onUpdate: (traffic: SiteTrafficData) => void
): () => void {
  const trafficDocRef = doc(db, 'analytics', SITE_TRAFFIC_DOC);

  const unsubscribe = onSnapshot(
    trafficDocRef,
    (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        onUpdate({
          totalVisitors: data.totalVisitors || 0,
          totalViews: data.totalViews || 0,
          lastVisitedAt: data.lastVisitedAt
        });
      } else {
        onUpdate({ totalVisitors: 0, totalViews: 0 });
      }
    },
    (err) => {
      console.debug('[Analytics] Traffic listener notice:', err);
    }
  );

  return unsubscribe;
}

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

    // Also update existing article document viewCount
    const articleDoc = doc(db, 'articles', articleId);
    await updateDoc(articleDoc, {
      viewCount: increment(1)
    });
  } catch (err) {
    console.debug('[Analytics] View log notice:', err);
  }
}

export interface AnalyticsSummary {
  totalVisitors: number;
  totalViews: number;
  totalArticles: number;
  totalCategories: number;
  mostViewedArticles: { articleId: string; views: number }[];
  categoryPerformance: Record<string, number>;
}

export async function getAnalyticsSummary(): Promise<AnalyticsSummary> {
  try {
    // 1. Fetch site traffic document
    let totalVisitors = 0;
    let siteTrafficViews = 0;

    try {
      const trafficDoc = await getDoc(doc(db, 'analytics', SITE_TRAFFIC_DOC));
      if (trafficDoc.exists()) {
        const tData = trafficDoc.data();
        totalVisitors = tData.totalVisitors || 0;
        siteTrafficViews = tData.totalViews || 0;
      }
    } catch {}

    // 2. Fetch top viewed articles
    const analyticsCol = collection(db, 'analytics');
    const q = query(analyticsCol, orderBy('viewsTotal', 'desc'), limit(10));
    const snap = await getDocs(q);

    let articleViewsTotal = 0;
    const mostViewed: { articleId: string; views: number }[] = [];

    snap.forEach((d) => {
      if (d.id === SITE_TRAFFIC_DOC) return;
      const data = d.data();
      const views = data.viewsTotal || 0;
      articleViewsTotal += views;
      mostViewed.push({
        articleId: d.id,
        views
      });
    });

    const combinedViews = Math.max(siteTrafficViews, totalVisitors + articleViewsTotal);

    return {
      totalVisitors,
      totalViews: combinedViews,
      totalArticles: 0,
      totalCategories: 5,
      mostViewedArticles: mostViewed,
      categoryPerformance: {}
    };
  } catch (err) {
    return {
      totalVisitors: 0,
      totalViews: 0,
      totalArticles: 0,
      totalCategories: 5,
      mostViewedArticles: [],
      categoryPerformance: {}
    };
  }
}
