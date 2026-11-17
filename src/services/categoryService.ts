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
import { Category } from '../types';

export const DEFAULT_CATEGORIES: Category[] = [
  {
    id: 'india',
    slug: 'india',
    order: 1,
    names: { en: 'India', hi: 'भारत' },
    isActive: true
  },
  {
    id: 'business',
    slug: 'business',
    order: 2,
    names: { en: 'Business', hi: 'व्यापार व अर्थव्यवस्था' },
    isActive: true
  },
  {
    id: 'technology',
    slug: 'technology',
    order: 3,
    names: { en: 'Technology', hi: 'तकनीक व विज्ञान' },
    isActive: true
  },
  {
    id: 'entertainment',
    slug: 'entertainment',
    order: 4,
    names: { en: 'Entertainment', hi: 'मनोरंजन व सिनेमा' },
    isActive: true
  },
  {
    id: 'sports',
    slug: 'sports',
    order: 5,
    names: { en: 'Sports', hi: 'खेल' },
    isActive: true
  }
];

const LOCAL_STORAGE_CATEGORIES_KEY = 'newsora_categories_store_v3';

function sortCategories(list: Category[]): Category[] {
  return [...list].sort((a, b) => (a.order || 0) - (b.order || 0));
}

function loadCachedCategories(): Category[] | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_CATEGORIES_KEY);
    if (raw !== null) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.warn('[Categories] Error reading cache:', e);
  }
  return null;
}

function saveCachedCategories(categories: Category[], notify: boolean = false): void {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(LOCAL_STORAGE_CATEGORIES_KEY, JSON.stringify(categories));
      if (notify) {
        window.dispatchEvent(
          new CustomEvent('newsora_categories_updated', {
            detail: { count: categories.length, timestamp: Date.now() }
          })
        );
      }
    } catch (e) {
      console.warn('[Categories] Error writing cache:', e);
    }
  }
}

let catBootstrapPromise: Promise<boolean> | null = null;

async function ensureCategoriesBootstrapped(): Promise<boolean> {
  if (catBootstrapPromise) return catBootstrapPromise;

  catBootstrapPromise = (async () => {
    try {
      const metaRef = doc(db, 'siteSettings', 'bootstrap_categories');
      const metaSnap = await getDoc(metaRef);
      if (metaSnap.exists() && metaSnap.data()?.seeded === true) {
        return false;
      }

      const batch = writeBatch(db);
      for (const cat of DEFAULT_CATEGORIES) {
        batch.set(doc(db, 'categories', cat.id), stripUndefined(cat));
      }
      batch.set(metaRef, { seeded: true, seededAt: new Date().toISOString() });
      await batch.commit();
      return true;
    } catch (err) {
      console.warn('[Categories] Bootstrap skipped:', err);
      return false;
    } finally {
      catBootstrapPromise = null;
    }
  })();

  return catBootstrapPromise;
}

export async function getCategories(): Promise<Category[]> {
  try {
    const colRef = collection(db, 'categories');
    let snap = await getDocs(colRef);

    if (snap.empty) {
      const seeded = await ensureCategoriesBootstrapped();
      if (seeded) {
        snap = await getDocs(colRef);
      }
    }

    const remoteList: Category[] = [];
    snap.forEach((d) => {
      remoteList.push({ id: d.id, ...d.data() } as Category);
    });

    const sorted = sortCategories(remoteList);
    saveCachedCategories(sorted);
    return sorted;
  } catch (err) {
    console.error('[Categories] Firestore read error:', err);
    const cached = loadCachedCategories();
    return cached !== null ? cached : DEFAULT_CATEGORIES;
  }
}

export function subscribeToCategories(
  onUpdate: (categories: Category[]) => void
): () => void {
  const colRef = collection(db, 'categories');

  return onSnapshot(
    colRef,
    async (snap) => {
      if (snap.empty) {
        const seeded = await ensureCategoriesBootstrapped();
        if (seeded) return;
      }

      const remoteList: Category[] = [];
      snap.forEach((d) => {
        remoteList.push({ id: d.id, ...d.data() } as Category);
      });

      const sorted = sortCategories(remoteList);
      saveCachedCategories(sorted);
      onUpdate(sorted);
    },
    (err) => {
      console.error('[Categories] Real-time listener error:', err);
      const cached = loadCachedCategories();
      onUpdate(cached !== null ? cached : DEFAULT_CATEGORIES);
    }
  );
}

export async function saveCategory(category: Category): Promise<void> {
  const cleanCat = stripUndefined(category);
  try {
    const docRef = doc(db, 'categories', cleanCat.id);
    await setDoc(docRef, cleanCat, { merge: true });
    await setDoc(
      doc(db, 'siteSettings', 'bootstrap_categories'),
      { seeded: true },
      { merge: true }
    );
  } catch (err: any) {
    console.error('[Categories] Firestore save FAILED:', err);
    throw new Error(formatFirestoreError(err, 'save category'));
  }

  const current = loadCachedCategories() || [];
  const idx = current.findIndex((c) => c.id === cleanCat.id);
  const updated =
    idx >= 0
      ? current.map((c, i) => (i === idx ? cleanCat : c))
      : [...current, cleanCat];
  saveCachedCategories(sortCategories(updated));
}

export async function deleteCategory(categoryId: string): Promise<void> {
  try {
    const docRef = doc(db, 'categories', categoryId);
    await deleteDoc(docRef);
  } catch (err: any) {
    console.error('[Categories] Firestore delete FAILED:', err);
    throw new Error(formatFirestoreError(err, 'delete category'));
  }

  const current = loadCachedCategories() || [];
  const updated = current.filter((c) => c.id !== categoryId);
  saveCachedCategories(updated);
}

export async function seedDefaultCategoriesIfEmpty(): Promise<void> {
  await ensureCategoriesBootstrapped();
}
