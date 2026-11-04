import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './firebase';
import { AdminUser } from '../types';

const ADMIN_STORAGE_KEY = 'newsora_admin_session';

export const ACCEPTED_PASSCODES = [
  'newsora2026',
  'khadda2026',
  (import.meta.env.VITE_ADMIN_PASSCODE || '').toLowerCase()
].filter(Boolean);

export async function loginAdmin(email: string, pass: string): Promise<AdminUser> {
  const cleanEmail = email.trim().toLowerCase();
  const cleanPass = pass.trim();

  if (!cleanEmail || !cleanPass) {
    throw new Error('Please enter both email and password.');
  }

  // 1. Check Master Setup Passcodes (Accepts newsora2026 or khadda2026)
  const isMasterPass = ACCEPTED_PASSCODES.some(
    (code) => code === cleanPass.toLowerCase()
  );

  if (isMasterPass && cleanEmail.includes('@')) {
    const adminUser: AdminUser = {
      uid: 'admin_' + btoa(cleanEmail).replace(/[^a-zA-Z0-9]/g, '').substring(0, 14),
      email: cleanEmail,
      displayName: cleanEmail.split('@')[0],
      role: 'superadmin'
    };

    localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(adminUser));

    // Optional firestore write (non-blocking)
    try {
      const docRef = doc(db, 'adminUsers', adminUser.uid);
      setDoc(
        docRef,
        {
          uid: adminUser.uid,
          email: cleanEmail,
          displayName: adminUser.displayName,
          role: 'superadmin',
          lastLoginAt: serverTimestamp()
        },
        { merge: true }
      ).catch(() => {});
    } catch {
      // ignore
    }

    return adminUser;
  }

  // 2. Firebase Authentication Check
  try {
    const cred = await signInWithEmailAndPassword(auth, cleanEmail, cleanPass);
    const user = cred.user;

    const adminUser: AdminUser = {
      uid: user.uid,
      email: cleanEmail,
      displayName: user.displayName || cleanEmail.split('@')[0],
      role: 'superadmin'
    };

    try {
      const adminDocRef = doc(db, 'adminUsers', user.uid);
      const adminSnap = await getDoc(adminDocRef);
      if (adminSnap.exists()) {
        const data = adminSnap.data();
        adminUser.role = data.role || 'superadmin';
        adminUser.displayName = data.displayName || adminUser.displayName;
      } else {
        await setDoc(
          adminDocRef,
          {
            uid: user.uid,
            email: cleanEmail,
            displayName: adminUser.displayName,
            role: 'superadmin',
            createdAt: serverTimestamp(),
            lastLoginAt: serverTimestamp()
          },
          { merge: true }
        );
      }
    } catch (e) {
      console.warn('Firestore admin doc notice:', e);
    }

    localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(adminUser));
    return adminUser;
  } catch (err: any) {
    if (
      err.code === 'auth/invalid-credential' ||
      err.code === 'auth/user-not-found' ||
      err.code === 'auth/wrong-password'
    ) {
      throw new Error(
        'Invalid credentials. Use Email: admin@newsora.in with Passcode: newsora2026'
      );
    }
    throw new Error(err.message || 'Authentication error. Please check your credentials.');
  }
}

export async function logoutAdmin(): Promise<void> {
  try {
    await signOut(auth);
  } catch (e) {
    // ignore
  }
  localStorage.removeItem(ADMIN_STORAGE_KEY);
}

export function getCachedAdmin(): AdminUser | null {
  try {
    const raw = localStorage.getItem(ADMIN_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore
  }
  return null;
}

export function subscribeToAuthChanges(callback: (user: AdminUser | null) => void) {
  return onAuthStateChanged(auth, async (firebaseUser: User | null) => {
    if (firebaseUser && firebaseUser.email) {
      try {
        const adminDocRef = doc(db, 'adminUsers', firebaseUser.uid);
        const adminSnap = await getDoc(adminDocRef);
        const role = adminSnap.exists() ? adminSnap.data().role : 'superadmin';
        const adminUser: AdminUser = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName || firebaseUser.email.split('@')[0],
          role: role || 'superadmin'
        };
        localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(adminUser));
        callback(adminUser);
        return;
      } catch (err) {
        console.warn('Admin check error:', err);
      }
    }

    const cached = getCachedAdmin();
    callback(cached);
  });
}
