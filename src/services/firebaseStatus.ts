import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from './firebase';

export interface FirebaseHealthStatus {
  checked: boolean;
  connected: boolean;
  permissionDenied: boolean;
  errorMessage?: string;
}

/**
 * Recursively strips `undefined` values from an object so Cloud Firestore
 * never rejects a document write with "Unsupported field value: undefined".
 */
export function stripUndefined<T>(obj: T): T {
  if (obj === null || obj === undefined) return obj;
  if (Array.isArray(obj)) {
    return obj.map((item) => stripUndefined(item)) as unknown as T;
  }
  if (typeof obj === 'object') {
    const clean: Record<string, any> = {};
    for (const [key, value] of Object.entries(obj as Record<string, any>)) {
      if (value !== undefined) {
        clean[key] = stripUndefined(value);
      }
    }
    return clean as T;
  }
  return obj;
}

/**
 * Formats a Firestore error into a clear, actionable message for the Admin UI.
 */
export function formatFirestoreError(err: any, action: string = 'save data'): string {
  const code = err?.code || '';
  const msg = err?.message || '';
  if (code === 'permission-denied' || msg.toLowerCase().includes('missing or insufficient permissions')) {
    return `Firebase Permission Denied: Firestore Rules for project "newsroom-4d2a7" are blocking ${action}. Please publish Firestore Security Rules in Firebase Console.`;
  }
  if (code === 'invalid-argument' && msg.toLowerCase().includes('maximum size')) {
    return `Document too large for Firebase Firestore (1MB limit). Please upload a smaller image or use an image URL.`;
  }
  if (code === 'unavailable' || msg.toLowerCase().includes('offline')) {
    return `Cannot reach Firebase Firestore. Please check your internet connection and try again.`;
  }
  return `Firebase error while trying to ${action}: ${msg || code || 'Unknown error'}`;
}

/**
 * Checks whether Cloud Firestore for newsroom-4d2a7 is readable and writable.
 */
export async function checkFirestoreHealth(): Promise<FirebaseHealthStatus> {
  try {
    const healthRef = doc(db, 'siteSettings', '_connection_check');
    await setDoc(
      healthRef,
      {
        status: 'ok',
        lastCheckedAt: new Date().toISOString()
      },
      { merge: true }
    );
    await getDoc(healthRef);
    return {
      checked: true,
      connected: true,
      permissionDenied: false
    };
  } catch (err: any) {
    const code = err?.code || '';
    const msg = err?.message || '';
    const isPerm =
      code === 'permission-denied' ||
      msg.toLowerCase().includes('missing or insufficient permissions');
    return {
      checked: true,
      connected: false,
      permissionDenied: isPerm,
      errorMessage: formatFirestoreError(err, 'sync with Firebase')
    };
  }
}
