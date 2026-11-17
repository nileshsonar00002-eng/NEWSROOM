import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { db } from './firebase';
import { stripUndefined, formatFirestoreError } from './firebaseStatus';
import { SiteSettings } from '../types';

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  siteName: 'NEWSORA',
  tagline: 'News That Moves You.',
  adsensePublisherId: 'ca-pub-9876543210123456',
  adSlotHomeTop: '1234567890',
  adSlotArticleIntro: '2345678901',
  adSlotArticleMid: '3456789012',
  adSlotArticleBottom: '4567890123',
  adSlotSidebar: '5678901234',
  enableAds: true,
  contactEmail: 'editor@newsora.in',
  whatsappNumber: '+919876543210',
  twitterUrl: 'https://twitter.com/newsoranews',
  facebookUrl: 'https://facebook.com/newsoranews',
  youtubeUrl: 'https://youtube.com/@newsoranews',
  defaultLang: 'en'
};

const LOCAL_STORAGE_SETTINGS_KEY = 'newsora_settings_store_v3';

function loadCachedSettings(): SiteSettings {
  if (typeof window === 'undefined') return DEFAULT_SITE_SETTINGS;
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_SETTINGS_KEY);
    if (raw) {
      return { ...DEFAULT_SITE_SETTINGS, ...JSON.parse(raw) };
    }
  } catch {}
  return DEFAULT_SITE_SETTINGS;
}

function saveCachedSettings(settings: SiteSettings): void {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(LOCAL_STORAGE_SETTINGS_KEY, JSON.stringify(settings));
      window.dispatchEvent(new CustomEvent('newsora_settings_updated', { detail: settings }));
    } catch {}
  }
}

export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const docRef = doc(db, 'siteSettings', 'global');
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      const merged = { ...DEFAULT_SITE_SETTINGS, ...snap.data() } as SiteSettings;
      saveCachedSettings(merged);
      return merged;
    }
    return loadCachedSettings();
  } catch (err) {
    console.error('[Settings] Firestore read error:', err);
    return loadCachedSettings();
  }
}

export function subscribeToSiteSettings(
  onUpdate: (settings: SiteSettings) => void
): () => void {
  const docRef = doc(db, 'siteSettings', 'global');
  return onSnapshot(
    docRef,
    (snap) => {
      if (snap.exists()) {
        const merged = { ...DEFAULT_SITE_SETTINGS, ...snap.data() } as SiteSettings;
        saveCachedSettings(merged);
        onUpdate(merged);
      } else {
        onUpdate(loadCachedSettings());
      }
    },
    (err) => {
      console.error('[Settings] Real-time listener error:', err);
      onUpdate(loadCachedSettings());
    }
  );
}

export async function updateSiteSettings(settings: Partial<SiteSettings>): Promise<void> {
  const clean = stripUndefined(settings);
  try {
    const docRef = doc(db, 'siteSettings', 'global');
    await setDoc(docRef, clean, { merge: true });
    const merged = { ...loadCachedSettings(), ...clean } as SiteSettings;
    saveCachedSettings(merged);
  } catch (err: any) {
    console.error('[Settings] Firestore save FAILED:', err);
    throw new Error(formatFirestoreError(err, 'save site settings'));
  }
}
