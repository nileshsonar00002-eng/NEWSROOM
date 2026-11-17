import {
  collection,
  getDocs,
  getDoc,
  doc,
  setDoc,
  deleteDoc,
  writeBatch
} from 'firebase/firestore';
import { db } from './firebase';
import { stripUndefined, formatFirestoreError } from './firebaseStatus';
import { Author } from '../types';

export const DEFAULT_AUTHORS: Author[] = [
  {
    id: 'author-1',
    name: 'Vikram Joshi',
    role: 'Senior National Bureau Chief',
    bio: 'Specializing in parliamentary affairs, national security, and governance for over 15 years.',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    email: 'vikram.joshi@newsora.in'
  },
  {
    id: 'author-2',
    name: 'Priyanka Deshmukh',
    role: 'State & Environment Editor (Maharashtra)',
    bio: 'Award-winning investigative reporter focusing on Western Ghats ecology, rural economics, and civic development.',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
    email: 'priyanka.d@newsora.in'
  },
  {
    id: 'author-3',
    name: 'Arjun Rao',
    role: 'Technology & Economy Lead',
    bio: 'Tracking semiconductor supply chains, artificial intelligence policy, and startup ecosystems across Asia.',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    email: 'arjun.rao@newsora.in'
  }
];

const LOCAL_STORAGE_AUTHORS_KEY = 'newsora_authors_store_v3';

function loadCachedAuthors(): Author[] | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_AUTHORS_KEY);
    if (raw !== null) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.warn('[Authors] Error reading cache:', e);
  }
  return null;
}

function saveCachedAuthors(authors: Author[], notify: boolean = false): void {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(LOCAL_STORAGE_AUTHORS_KEY, JSON.stringify(authors));
      if (notify) {
        window.dispatchEvent(
          new CustomEvent('newsora_authors_updated', {
            detail: { count: authors.length, timestamp: Date.now() }
          })
        );
      }
    } catch (e) {}
  }
}

let authorBootstrapPromise: Promise<boolean> | null = null;

async function ensureAuthorsBootstrapped(): Promise<boolean> {
  if (authorBootstrapPromise) return authorBootstrapPromise;

  authorBootstrapPromise = (async () => {
    try {
      const metaRef = doc(db, 'siteSettings', 'bootstrap_authors');
      const metaSnap = await getDoc(metaRef);
      if (metaSnap.exists() && metaSnap.data()?.seeded === true) {
        return false;
      }

      const batch = writeBatch(db);
      for (const a of DEFAULT_AUTHORS) {
        batch.set(doc(db, 'authors', a.id), stripUndefined(a));
      }
      batch.set(metaRef, { seeded: true, seededAt: new Date().toISOString() });
      await batch.commit();
      return true;
    } catch (err) {
      console.warn('[Authors] Bootstrap skipped:', err);
      return false;
    } finally {
      authorBootstrapPromise = null;
    }
  })();

  return authorBootstrapPromise;
}

export async function getAuthors(): Promise<Author[]> {
  try {
    const colRef = collection(db, 'authors');
    let snap = await getDocs(colRef);
    if (snap.empty) {
      const seeded = await ensureAuthorsBootstrapped();
      if (seeded) {
        snap = await getDocs(colRef);
      }
    }

    const list: Author[] = [];
    snap.forEach((d) => list.push({ id: d.id, ...d.data() } as Author));
    saveCachedAuthors(list);
    return list;
  } catch (err) {
    console.error('[Authors] Firestore read error:', err);
    const cached = loadCachedAuthors();
    return cached !== null ? cached : DEFAULT_AUTHORS;
  }
}

export async function saveAuthor(author: Author): Promise<void> {
  const cleanAuthor = stripUndefined(author);
  try {
    const docRef = doc(db, 'authors', cleanAuthor.id);
    await setDoc(docRef, cleanAuthor, { merge: true });
    await setDoc(
      doc(db, 'siteSettings', 'bootstrap_authors'),
      { seeded: true },
      { merge: true }
    );
  } catch (err: any) {
    console.error('[Authors] Firestore save FAILED:', err);
    throw new Error(formatFirestoreError(err, 'save author'));
  }

  const current = loadCachedAuthors() || [];
  const idx = current.findIndex((a) => a.id === cleanAuthor.id);
  const updated =
    idx >= 0
      ? current.map((a, i) => (i === idx ? cleanAuthor : a))
      : [...current, cleanAuthor];
  saveCachedAuthors(updated);
}

export async function deleteAuthor(id: string): Promise<void> {
  try {
    const docRef = doc(db, 'authors', id);
    await deleteDoc(docRef);
  } catch (err: any) {
    console.error('[Authors] Firestore delete FAILED:', err);
    throw new Error(formatFirestoreError(err, 'delete author'));
  }

  const current = loadCachedAuthors() || [];
  const updated = current.filter((a) => a.id !== id);
  saveCachedAuthors(updated);
}
