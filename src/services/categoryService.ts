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
    names: { en: 'India', hi: 'भारत', mr: 'भारत' },
    isActive: true
  },
  {
    id: 'maharashtra',
    slug: 'maharashtra',
    order: 2,
    names: { en: 'Maharashtra', hi: 'महाराष्ट्र', mr: 'महाराष्ट्र' },
    isActive: true
  },
  {
    id: 'politics',
    slug: 'politics',
    order: 3,
    names: { en: 'Politics', hi: 'राजनीति', mr: 'राजकारण' },
    isActive: true
  },
  {
    id: 'world',
    slug: 'world',
    order: 4,
    names: { en: 'World', hi: 'विदेश', mr: 'आंतरराष्ट्रीय' },
    isActive: true
  },
  {
    id: 'business',
    slug: 'business',
    order: 5,
    names: { en: 'Business', hi: 'व्यापार व अर्थव्यवस्था', mr: 'अर्थकारण व व्यवसाय' },
    isActive: true
  },
  {
    id: 'technology',
    slug: 'technology',
    order: 6,
    names: { en: 'Technology', hi: 'तकनीक व विज्ञान', mr: 'तंत्रज्ञान' },
    isActive: true
  },
  {
    id: 'sports',
    slug: 'sports',
    order: 7,
    names: { en: 'Sports', hi: 'खेल', mr: 'क्रीडा' },
    isActive: true
  },
  {
    id: 'entertainment',
    slug: 'entertainment',
    order: 8,
    names: { en: 'Entertainment', hi: 'मनोरंजन व सिनेमा', mr: 'मनोरंजन' },
    isActive: true
  },
  {
    id: 'education',
    slug: 'education',
    order: 9,
    names: { en: 'Education', hi: 'शिक्षा व करियर', mr: 'शिक्षण व करिअर' },
    isActive: true
  },
  {
    id: 'health',
    slug: 'health',
    order: 10,
    names: { en: 'Health', hi: 'स्वास्थ्य व आरोग्य', mr: 'आरोग्य' },
    isActive: true
  },
  {
    id: 'science',
    slug: 'science',
    order: 11,
    names: { en: 'Science', hi: 'विज्ञान व शोध', mr: 'विज्ञान व संशोधन' },
    isActive: true
  },
  {
    id: 'automobile',
    slug: 'automobile',
    order: 12,
    names: { en: 'Automobile', hi: 'ऑटोमोबाइल', mr: 'ऑटोमोबाईल' },
    isActive: true
  },
  {
    id: 'crime',
    slug: 'crime',
    order: 13,
    names: { en: 'Crime', hi: 'अपराध व सुरक्षा', mr: 'गुन्हेगारी' },
    isActive: true
  },
  {
    id: 'lifestyle',
    slug: 'lifestyle',
    order: 14,
    names: { en: 'Lifestyle', hi: 'जीवनशैली व संस्कृती', mr: 'जीवनशैली' },
    isActive: true
  }
];

const LOCAL_STORAGE_CATEGORIES_KEY = 'newsora_categories_store';

function loadStoredCategories(): Category[] {
  if (typeof window === 'undefined') return DEFAULT_CATEGORIES;
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_CATEGORIES_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
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
      localStorage.setItem(LOCAL_STORAGE_CATEGORIES_KEY, JSON.stringify(categories));
      window.dispatchEvent(
        new CustomEvent('newsora_categories_updated', {
          detail: { count: categories.length, timestamp: Date.now() }
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
        remoteList.push({ id: d.id, ...d.data() } as Category);
      });
      // Prefer remote list if available
      saveStoredCategories(remoteList);
      return remoteList;
    }
  } catch (err) {
    console.warn('[Categories] Using persistent categories store:', err);
  }

  return localList;
}

export async function saveCategory(category: Category): Promise<void> {
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
