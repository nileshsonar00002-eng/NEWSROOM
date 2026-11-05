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

const ALLOWED_CATEGORY_SLUGS = new Set(['india', 'business', 'technology', 'entertainment', 'sports']);

const LOCAL_STORAGE_CATEGORIES_KEY = 'newsora_categories_store_v2';

function loadStoredCategories(): Category[] {
  if (typeof window === 'undefined') return DEFAULT_CATEGORIES;
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_CATEGORIES_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Enforce only the 5 allowed categories
        const filtered = parsed.filter(
          (c) => ALLOWED_CATEGORY_SLUGS.has(c.slug) || ALLOWED_CATEGORY_SLUGS.has(c.id)
        );
        if (filtered.length === DEFAULT_CATEGORIES.length) {
          return filtered;
        }
      }
    }
  } catch (e) {
    console.warn('[Categories] Error reading localStorage:', e);
  }

  try {
    localStorage.setItem(LOCAL_STORAGE_CATEGORIES_KEY, JSON.stringify(DEFAULT_CATEGORIES));
  } catch (e) {}
  return DEFAULT_CATEGORIES;
}

function saveStoredCategories(categories: Category[]): void {
  if (typeof window !== 'undefined') {
    try {
      // Filter strictly to allowed categories
      const cleanCategories = categories.filter(
        (c) => ALLOWED_CATEGORY_SLUGS.has(c.slug) || ALLOWED_CATEGORY_SLUGS.has(c.id)
      );
      localStorage.setItem(LOCAL_STORAGE_CATEGORIES_KEY, JSON.stringify(cleanCategories));
      window.dispatchEvent(
        new CustomEvent('newsora_categories_updated', {
          detail: { count: cleanCategories.length, timestamp: Date.now() }
        })
      );
    } catch (e) {
      console.warn('[Categories] Error writing to localStorage:', e);
    }
  }
}

export async function getCategories(): Promise<Category[]> {
  const localList = loadStoredCategories();

  try {
    const colRef = collection(db, 'categories');
    const q = query(colRef, orderBy('order', 'asc'));
    const snap = await getDocs(q);

    if (!snap.empty) {
      const remoteList: Category[] = [];
      snap.forEach((d) => {
        const cat = { id: d.id, ...d.data() } as Category;
        if (ALLOWED_CATEGORY_SLUGS.has(cat.slug) || ALLOWED_CATEGORY_SLUGS.has(cat.id)) {
          remoteList.push(cat);
        }
      });
      if (remoteList.length > 0) {
        saveStoredCategories(remoteList);
        return remoteList;
      }
    }
  } catch (err) {
    console.warn('[Categories] Using persistent categories store:', err);
  }

  return localList;
}

export async function saveCategory(category: Category): Promise<void> {
  if (!ALLOWED_CATEGORY_SLUGS.has(category.slug) && !ALLOWED_CATEGORY_SLUGS.has(category.id)) {
    console.warn(`[Categories] Category ${category.slug} is not in allowed list.`);
    return;
  }
  const current = loadStoredCategories();
  const idx = current.findIndex((c) => c.id === category.id);
  let updated: Category[];
  if (idx >= 0) {
    updated = [...current];
    updated[idx] = category;
  } else {
    updated = [...current, category];
  }
  saveStoredCategories(updated);

  try {
    const docRef = doc(db, 'categories', category.id);
    await setDoc(docRef, category, { merge: true });
  } catch (e) {
    console.warn('[Categories] Firestore save error (saved locally):', e);
  }
}

export async function deleteCategory(categoryId: string): Promise<void> {
  const current = loadStoredCategories();
  const updated = current.filter((c) => c.id !== categoryId);
  saveStoredCategories(updated);

  try {
    const docRef = doc(db, 'categories', categoryId);
    await deleteDoc(docRef);
  } catch (e) {
    console.warn('[Categories] Firestore delete error (deleted locally):', e);
  }
}

export async function seedDefaultCategories(): Promise<void> {
  saveStoredCategories(DEFAULT_CATEGORIES);
  try {
    for (const cat of DEFAULT_CATEGORIES) {
      const docRef = doc(db, 'categories', cat.id);
      await setDoc(docRef, cat, { merge: true });
    }
  } catch (e) {
    console.warn('Could not seed default categories to firestore:', e);
  }
}
