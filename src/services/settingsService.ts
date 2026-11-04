import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from './firebase';
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

export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const docRef = doc(db, 'siteSettings', 'global');
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return { ...DEFAULT_SITE_SETTINGS, ...snap.data() } as SiteSettings;
    }
    return DEFAULT_SITE_SETTINGS;
  } catch (err) {
    return DEFAULT_SITE_SETTINGS;
  }
}

export async function updateSiteSettings(settings: Partial<SiteSettings>): Promise<void> {
  const docRef = doc(db, 'siteSettings', 'global');
  await setDoc(docRef, settings, { merge: true });
}
