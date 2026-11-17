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
import { BreakingNewsItem, Language } from '../types';

export const DEFAULT_BREAKING_NEWS: BreakingNewsItem[] = [
  {
    id: 'breaking-1',
    headline: {
      en: 'ISRO successfully launches next-generation weather observation satellite from Sriharikota',
      hi: 'इसरो ने श्रीहरिकोटा से अगली पीढ़ी के मौसम उपग्रह का सफल प्रक्षेपण किया'
    },
    articleSlug: 'isro-satellite-launch-sriharikota',
    isActive: true,
    order: 1,
    createdAt: new Date().toISOString()
  },
  {
    id: 'breaking-2',
    headline: {
      en: 'Union Cabinet approves new industrial and green infrastructure corridor connecting key trade hubs',
      hi: 'केंद्रीय मंत्रिमंडल ने प्रमुख व्यापारिक केंद्रों को जोड़ने वाले नए हरित औद्योगिक गलियारे को दी मंजूरी'
    },
    articleSlug: 'green-infrastructure-corridor-approved',
    isActive: true,
    order: 2,
    createdAt: new Date().toISOString()
  },
  {
    id: 'breaking-3',
    headline: {
      en: 'RBI announces revised digital payment security protocols for UPI and online banking transactions',
      hi: 'आरबीआई ने यूपीआई और ऑनलाइन बैंकिंग लेनदेन के लिए संशोधित डिजिटल सुरक्षा प्रोटोकॉल की घोषणा की'
    },
    articleSlug: 'rbi-announces-revised-digital-payment-protocols',
    isActive: true,
    order: 3,
    createdAt: new Date().toISOString()
  }
];

const LOCAL_STORAGE_BREAKING_KEY = 'newsora_breaking_store_v3';

function sortBreaking(items: BreakingNewsItem[]): BreakingNewsItem[] {
  return [...items].sort((a, b) => (a.order || 0) - (b.order || 0));
}

function loadCachedBreaking(): BreakingNewsItem[] | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_BREAKING_KEY);
    if (raw !== null) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.warn('[Breaking News] Error reading cache:', e);
  }
  return null;
}

function saveCachedBreaking(items: BreakingNewsItem[], notify: boolean = false): void {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(LOCAL_STORAGE_BREAKING_KEY, JSON.stringify(items));
      if (notify) {
        window.dispatchEvent(
          new CustomEvent('newsora_breaking_updated', {
            detail: { count: items.length, timestamp: Date.now() }
          })
        );
      }
    } catch (e) {
      console.warn('[Breaking News] Error writing cache:', e);
    }
  }
}

let breakingBootstrapPromise: Promise<boolean> | null = null;

async function ensureBreakingBootstrapped(): Promise<boolean> {
  if (breakingBootstrapPromise) return breakingBootstrapPromise;

  breakingBootstrapPromise = (async () => {
    try {
      const metaRef = doc(db, 'siteSettings', 'bootstrap_breaking');
      const metaSnap = await getDoc(metaRef);
      if (metaSnap.exists() && metaSnap.data()?.seeded === true) {
        return false;
      }

      const batch = writeBatch(db);
      for (const item of DEFAULT_BREAKING_NEWS) {
        batch.set(doc(db, 'breakingNews', item.id), stripUndefined(item));
      }
      batch.set(metaRef, { seeded: true, seededAt: new Date().toISOString() });
      await batch.commit();
      return true;
    } catch (err) {
      console.warn('[Breaking News] Bootstrap skipped:', err);
      return false;
    } finally {
      breakingBootstrapPromise = null;
    }
  })();

  return breakingBootstrapPromise;
}

function filterActiveForLang(items: BreakingNewsItem[], lang: Language): BreakingNewsItem[] {
  return items.filter(
    (item) => item.isActive !== false && (item.headline?.[lang] || item.headline?.en)
  );
}

export async function getAllBreakingNews(): Promise<BreakingNewsItem[]> {
  try {
    const colRef = collection(db, 'breakingNews');
    let snap = await getDocs(colRef);

    if (snap.empty) {
      const seeded = await ensureBreakingBootstrapped();
      if (seeded) {
        snap = await getDocs(colRef);
      }
    }

    const items: BreakingNewsItem[] = [];
    snap.forEach((d) => {
      items.push({ id: d.id, ...d.data() } as BreakingNewsItem);
    });
    const sorted = sortBreaking(items);
    saveCachedBreaking(sorted);
    return sorted;
  } catch (err) {
    console.error('[Breaking News] Firestore read error:', err);
    const cached = loadCachedBreaking();
    return cached !== null ? cached : DEFAULT_BREAKING_NEWS;
  }
}

export async function getActiveBreakingNews(lang: Language = 'en'): Promise<BreakingNewsItem[]> {
  const all = await getAllBreakingNews();
  return filterActiveForLang(all, lang);
}

export function subscribeToActiveBreakingNews(
  lang: Language,
  onUpdate: (items: BreakingNewsItem[]) => void
): () => void {
  const colRef = collection(db, 'breakingNews');

  return onSnapshot(
    colRef,
    async (snap) => {
      if (snap.empty) {
        const seeded = await ensureBreakingBootstrapped();
        if (seeded) return;
      }

      const items: BreakingNewsItem[] = [];
      snap.forEach((d) => {
        items.push({ id: d.id, ...d.data() } as BreakingNewsItem);
      });
      const sorted = sortBreaking(items);
      saveCachedBreaking(sorted);
      onUpdate(filterActiveForLang(sorted, lang));
    },
    (err) => {
      console.error('[Breaking News] Real-time listener error:', err);
      const cached = loadCachedBreaking();
      const fallback = cached !== null ? cached : DEFAULT_BREAKING_NEWS;
      onUpdate(filterActiveForLang(fallback, lang));
    }
  );
}

export async function saveBreakingNews(item: BreakingNewsItem): Promise<void> {
  const cleanItem = stripUndefined(item);
  try {
    const docRef = doc(db, 'breakingNews', cleanItem.id);
    await setDoc(docRef, cleanItem, { merge: true });
    await setDoc(
      doc(db, 'siteSettings', 'bootstrap_breaking'),
      { seeded: true },
      { merge: true }
    );
  } catch (err: any) {
    console.error('[Breaking News] Firestore save FAILED:', err);
    throw new Error(formatFirestoreError(err, 'save breaking news'));
  }

  const current = loadCachedBreaking() || [];
  const idx = current.findIndex((b) => b.id === cleanItem.id);
  const updated =
    idx >= 0
      ? current.map((b, i) => (i === idx ? cleanItem : b))
      : [...current, cleanItem];
  saveCachedBreaking(sortBreaking(updated));
}

export async function deleteBreakingNews(id: string): Promise<void> {
  try {
    const docRef = doc(db, 'breakingNews', id);
    await deleteDoc(docRef);
  } catch (err: any) {
    console.error('[Breaking News] Firestore delete FAILED:', err);
    throw new Error(formatFirestoreError(err, 'delete breaking news'));
  }

  const current = loadCachedBreaking() || [];
  const updated = current.filter((b) => b.id !== id);
  saveCachedBreaking(updated);
}
