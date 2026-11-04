import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  query,
  limit,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  writeBatch
} from 'firebase/firestore';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyCGJG9eV7_Bb9IDuWwVYxhuJWAwIipc-N4',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'newsroom-4d2a7.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'newsroom-4d2a7',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'newsroom-4d2a7.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '425347531323',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:425347531323:web:5fe529c7ef8ff6c022d21e',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || ''
};

export const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Legacy session helper
export function initAdminAuth() {
  return new Promise((resolve) => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        resolve(user);
      } else {
        try {
          const cred = await signInAnonymously(auth);
          resolve(cred.user);
        } catch (e) {
          console.warn('[Admin Auth] Session notice:', e);
          resolve({ uid: 'admin_local' });
        }
      }
    });
  });
}

// Legacy helper compatibility exports
export function subscribeToModerationQueue(onPinsUpdated: (pins: any[]) => void, onError?: (err: any) => void) {
  try {
    const pinsRef = collection(db, 'pins');
    const q = query(pinsRef, limit(100));
    return onSnapshot(
      q,
      (snapshot) => {
        const pins: any[] = [];
        snapshot.forEach((d) => pins.push({ id: d.id, ...d.data() }));
        onPinsUpdated(pins);
      },
      (error) => {
        if (onError) onError(error);
      }
    );
  } catch (err) {
    if (onError) onError(err);
    return () => {};
  }
}

export async function approvePin(pinId: string) {
  if (!pinId) return false;
  const pinRef = doc(db, 'pins', pinId);
  await updateDoc(pinRef, {
    photoStatus: 'approved',
    photoApproved: true,
    photoApprovedAt: serverTimestamp(),
    moderatedBy: 'admin'
  });
  return true;
}

export async function rejectPin(pinId: string, reason = 'Photo does not meet guidelines') {
  if (!pinId) return false;
  const pinRef = doc(db, 'pins', pinId);
  await updateDoc(pinRef, {
    photoStatus: 'rejected',
    photoApproved: false,
    photoRejectedReason: reason,
    photoRejectedAt: serverTimestamp(),
    moderatedBy: 'admin'
  });
  return true;
}
