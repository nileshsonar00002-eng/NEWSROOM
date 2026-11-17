import {
  collection,
  getDocs,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot
} from 'firebase/firestore';
import { db } from './firebase';
import { stripUndefined, formatFirestoreError } from './firebaseStatus';
import { BreakingNewsItem, Language } from '../types';

export const DEFAULT_BREAKING_NEWS: BreakingNewsItem[] = [];

const LOCAL_STORAGE_BREAKING_KEY = 'newsora_breaking_store_v4';

// Clean up any legacy demo breaking news caches
if (typeof window !== 'undefined') {
  try {
    localStorage.removeItem('newsora_breaking_store');
    localStorage.removeItem('newsora_breaking_store_v2');
    localStorage.removeItem('newsora_breaking_store_v3');
  } catch {}
}

function sortBreaking(items: BreakingNewsItem[]): BreakingNewsItem[] {
  return [...items].sort((a, b) => (a.order || 0) - (b.order || 0));
}

function loadCachedBreaking(): BreakingNewsItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_BREAKING_KEY);
    if (raw !== null) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.warn('[Breaking News] Error reading cache:', e);
  }
  return [];
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

function filterActiveForLang(items: BreakingNewsItem[], lang: Language): BreakingNewsItem[] {
  return items.filter(
    (item) => item.isActive !== false && (item.headline?.[lang] || item.headline?.en || item.headline?.hi)
  );
}

export async function getAllBreakingNews(): Promise<BreakingNewsItem[]> {
  try {
    const colRef = collection(db, 'breakingNews');
    const snap = await getDocs(colRef);

    const items: BreakingNewsItem[] = [];
    snap.forEach((d) => {
      items.push({ id: d.id, ...d.data() } as BreakingNewsItem);
    });
    const sorted = sortBreaking(items);
    saveCachedBreaking(sorted);
    return sorted;
  } catch (err) {
    console.error('[Breaking News] Firestore read error:', err);
    return loadCachedBreaking();
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
    (snap) => {
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
      onUpdate(filterActiveForLang(loadCachedBreaking(), lang));
    }
  );
}

export async function saveBreakingNews(item: BreakingNewsItem): Promise<void> {
  const cleanItem = stripUndefined(item);
  try {
    const docRef = doc(db, 'breakingNews', cleanItem.id);
    await setDoc(docRef, cleanItem, { merge: true });
  } catch (err: any) {
    console.error('[Breaking News] Firestore save FAILED:', err);
    throw new Error(formatFirestoreError(err, 'save breaking news'));
  }

  const current = loadCachedBreaking();
  const idx = current.findIndex((b) => b.id === cleanItem.id);
  const updated =
    idx >= 0
      ? current.map((b, i) => (i === idx ? cleanItem : b))
      : [...current, cleanItem];
  saveCachedBreaking(sortBreaking(updated), true);
}

export async function deleteBreakingNews(id: string): Promise<void> {
  try {
    const docRef = doc(db, 'breakingNews', id);
    await deleteDoc(docRef);
  } catch (err: any) {
    console.error('[Breaking News] Firestore delete FAILED:', err);
    throw new Error(formatFirestoreError(err, 'delete breaking news'));
  }

  const current = loadCachedBreaking();
  const updated = current.filter((b) => b.id !== id);
  saveCachedBreaking(updated, true);
}
