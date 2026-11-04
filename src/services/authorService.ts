import { collection, getDocs, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { db } from './firebase';
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

const LOCAL_STORAGE_AUTHORS_KEY = 'newsora_authors_store';

function loadStoredAuthors(): Author[] {
  if (typeof window === 'undefined') return DEFAULT_AUTHORS;
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_AUTHORS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('[Authors] Error reading localStorage:', e);
  }
  try {
    localStorage.setItem(LOCAL_STORAGE_AUTHORS_KEY, JSON.stringify(DEFAULT_AUTHORS));
  } catch (e) {}
  return DEFAULT_AUTHORS;
}

function saveStoredAuthors(authors: Author[]): void {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(LOCAL_STORAGE_AUTHORS_KEY, JSON.stringify(authors));
      window.dispatchEvent(
        new CustomEvent('newsora_authors_updated', {
          detail: { count: authors.length, timestamp: Date.now() }
        })
      );
    } catch (e) {}
  }
}

export async function getAuthors(): Promise<Author[]> {
  const localList = loadStoredAuthors();
  try {
    const colRef = collection(db, 'authors');
    const snap = await getDocs(colRef);
    if (!snap.empty) {
      const list: Author[] = [];
      snap.forEach((d) => list.push({ id: d.id, ...d.data() } as Author));
      saveStoredAuthors(list);
      return list;
    }
  } catch (err) {
    console.warn('[Authors] Using persistent author store:', err);
  }
  return localList;
}

export async function saveAuthor(author: Author): Promise<void> {
  const current = loadStoredAuthors();
  const idx = current.findIndex((a) => a.id === author.id);
  let updated: Author[];
  if (idx >= 0) {
    updated = [...current];
    updated[idx] = author;
  } else {
    updated = [...current, author];
  }
  saveStoredAuthors(updated);

  try {
    const docRef = doc(db, 'authors', author.id);
    await setDoc(docRef, author, { merge: true });
  } catch (e) {
    console.warn('[Authors] Firestore save error (saved locally):', e);
  }
}

export async function deleteAuthor(authorId: string): Promise<void> {
  const current = loadStoredAuthors();
  const updated = current.filter((a) => a.id !== authorId);
  saveStoredAuthors(updated);

  try {
    const docRef = doc(db, 'authors', authorId);
    await deleteDoc(docRef);
  } catch (e) {
    console.warn('[Authors] Firestore delete error (deleted locally):', e);
  }
}
