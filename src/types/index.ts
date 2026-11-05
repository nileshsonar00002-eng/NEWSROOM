export type Language = 'en' | 'hi';

export type ArticleStatus = 'draft' | 'published';

export interface ArticleTranslation {
  title: string;
  description: string;
  content: string; // Formatted HTML content
  slug: string;
  status: ArticleStatus;
  seoTitle: string;
  seoDescription: string;
  publishedAt: any | null;
}

export interface Article {
  id: string;
  categoryId: string;
  authorId: string;
  imageUrl: string;
  imageCaption: string;
  imageCredit: string;
  sourceUrl: string;
  tags: string[];
  isFeatured: boolean;
  isBreaking: boolean;
  isTrending: boolean;
  readingTimeMinutes?: number;
  viewCount?: number;
  createdAt: any;
  updatedAt: any;
  translations: {
    en: ArticleTranslation;
    hi: ArticleTranslation;
    mr?: ArticleTranslation;
  };
}

export interface Category {
  id: string;
  slug: string;
  order: number;
  names: {
    en: string;
    hi: string;
    mr?: string;
  };
  isActive: boolean;
}

export interface BreakingNewsItem {
  id: string;
  headline: {
    en: string;
    hi: string;
    mr?: string;
  };
  articleId?: string;
  articleSlug?: string;
  isActive: boolean;
  order: number;
  createdAt: any;
}

export interface Author {
  id: string;
  name: string;
  role: string;
  bio: string;
  avatarUrl: string;
  email?: string;
}

export interface SiteSettings {
  siteName: string;
  tagline: string;
  adsensePublisherId: string;
  adSlotHomeTop: string;
  adSlotArticleIntro: string;
  adSlotArticleMid: string;
  adSlotArticleBottom: string;
  adSlotSidebar: string;
  enableAds: boolean;
  contactEmail: string;
  whatsappNumber: string;
  twitterUrl: string;
  facebookUrl: string;
  youtubeUrl: string;
  defaultLang: Language;
}

export interface AdminUser {
  uid: string;
  email: string;
  displayName: string;
  role: 'superadmin' | 'editor';
}
