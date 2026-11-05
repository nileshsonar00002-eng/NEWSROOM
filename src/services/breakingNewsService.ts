import {
  collection,
  getDocs,
  doc,
  setDoc,
  deleteDoc,
  query,
  orderBy
} from 'firebase/firestore';
import { db } from './firebase';
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

const LOCAL_STORAGE_BREAKING_KEY = 'newsora_breaking_store';

function loadStoredBreaking(): BreakingNewsItem[] {
  if (typeof window === 'undefined') return DEFAULT_BREAKING_NEWS;
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_BREAKING_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('[Breaking News] Error reading localStorage:', e);
  }
  try {
    localStorage.setItem(LOCAL_STORAGE_BREAKING_KEY, JSON.stringify(DEFAULT_BREAKING_NEWS));
  } catch (e) {}
  return DEFAULT_BREAKING_NEWS;
}

function saveStoredBreaking(items: BreakingNewsItem[]): void {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(LOCAL_STORAGE_BREAKING_KEY, JSON.stringify(items));
      window.dispatchEvent(
        new CustomEvent('newsora_breaking_updated', {
          detail: { count: items.length, timestamp: Date.now() }
        })
      );
    } catch (e) {
      console.warn('[Breaking News] Error writing to localStorage:', e);
    }
  }
}

export async function getActiveBreakingNews(lang: Language = 'en'): Promise<BreakingNewsItem[]> {
  const localList = loadStoredBreaking();

  try {
    const colRef = collection(db, 'breakingNews');
    const q = query(colRef, orderBy('order', 'asc'));
    const snap = await getDocs(q);

    if (!snap.empty) {
      const remoteItems: BreakingNewsItem[] = [];
      snap.forEach((d) => {
        remoteItems.push({ id: d.id, ...d.data() } as BreakingNewsItem);
      });
      saveStoredBreaking(remoteItems);
      const activeRemotes = remoteItems.filter(
        (item) => item.isActive !== false && item.headline && item.headline[lang]
      );
      return activeRemotes.length > 0 ? activeRemotes : remoteItems;
    }
  } catch (err) {
    console.warn('[Breaking News] using persistent breaking store:', err);
  }

  const active = localList.filter(
    (item) => item.isActive !== false && (item.headline?.[lang] || item.headline?.en)
  );
  return active.length > 0 ? active : localList;
}

export async function getAllBreakingNews(): Promise<BreakingNewsItem[]> {
  const localList = loadStoredBreaking();

  try {
    const colRef = collection(db, 'breakingNews');
    const q = query(colRef, orderBy('order', 'asc'));
    const snap = await getDocs(q);

    if (!snap.empty) {
      const items: BreakingNewsItem[] = [];
      snap.forEach((d) => {
        items.push({ id: d.id, ...d.data() } as BreakingNewsItem);
      });
      saveStoredBreaking(items);
      return items;
    }
  } catch (err) {
    console.warn('[Breaking News] using persistent storage:', err);
  }

  return localList;
}

export async function saveBreakingNews(item: BreakingNewsItem): Promise<void> {
  const current = loadStoredBreaking();
  const idx = current.findIndex((b) => b.id === item.id);
  let updated: BreakingNewsItem[];
  if (idx >= 0) {
    updated = [...current];
    updated[idx] = item;
  } else {
    updated = [...current, item];
  }
  saveStoredBreaking(updated);

  try {
    const docRef = doc(db, 'breakingNews', item.id);
    await setDoc(docRef, item, { merge: true });
  } catch (e) {
    console.warn('[Breaking News] Firestore save error (saved locally):', e);
  }
}

export async function deleteBreakingNews(id: string): Promise<void> {
  const current = loadStoredBreaking();
  const updated = current.filter((b) => b.id !== id);
  saveStoredBreaking(updated);

  try {
    const docRef = doc(db, 'breakingNews', id);
    await deleteDoc(docRef);
  } catch (e) {
    console.warn('[Breaking News] Firestore delete error (deleted locally):', e);
  }
}
