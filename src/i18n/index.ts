import { Language } from '../types';

export interface TranslationDictionary {
  brandName: string;
  tagline: string;
  breakingNews: string;
  search: string;
  searchPlaceholder: string;
  latestNews: string;
  trendingNews: string;
  featuredNews: string;
  viewAll: string;
  readMore: string;
  minuteRead: string;
  publishedOn: string;
  byAuthor: string;
  sourceCredit: string;
  shareStory: string;
  whatsappShare: string;
  facebookShare: string;
  copyLink: string;
  linkCopied: string;
  relatedArticles: string;
  noArticlesFound: string;
  translationUnavailable: string;
  availableLanguagesNotice: string;
  readIn: string;
  filterByCategory: string;
  allCategories: string;
  footerAboutText: string;
  quickLinks: string;
  categoriesTitle: string;
  legalTitle: string;
  editorialPolicy: string;
  privacyPolicy: string;
  termsConditions: string;
  disclaimer: string;
  aboutUs: string;
  contactUs: string;
  copyrightNotice: string;
  adminPortal: string;
  login: string;
  logout: string;
  dashboard: string;
  articles: string;
  newArticle: string;
  manageCategories: string;
  breakingNewsManager: string;
  authors: string;
  settings: string;
  loadMore: string;
  loading: string;
  themeToggle: string;
}

export const translations: Record<Language, TranslationDictionary> = {
  en: {
    brandName: 'NEWSORA',
    tagline: 'News That Moves You.',
    breakingNews: 'BREAKING',
    search: 'Search',
    searchPlaceholder: 'Search headlines, topics, politics, tech...',
    latestNews: 'Latest News',
    trendingNews: 'Trending Now',
    featuredNews: 'Featured Stories',
    viewAll: 'View All',
    readMore: 'Read Full Story',
    minuteRead: 'min read',
    publishedOn: 'Published',
    byAuthor: 'By',
    sourceCredit: 'Source / Attribution',
    shareStory: 'Share this story',
    whatsappShare: 'WhatsApp',
    facebookShare: 'Facebook',
    copyLink: 'Copy Link',
    linkCopied: 'Link copied to clipboard!',
    relatedArticles: 'Related Stories',
    noArticlesFound: 'No articles found matching your criteria.',
    translationUnavailable: 'This story is not yet available in English.',
    availableLanguagesNotice: 'You can read this verified report in:',
    readIn: 'Read in',
    filterByCategory: 'Filter by Category',
    allCategories: 'All Categories',
    footerAboutText: 'NEWSORA delivers unbiased, mobile-first journalism across India and the World in English and Hindi.',
    quickLinks: 'Quick Links',
    categoriesTitle: 'News Categories',
    legalTitle: 'Policies & Transparency',
    editorialPolicy: 'Editorial Policy',
    privacyPolicy: 'Privacy Policy',
    termsConditions: 'Terms & Conditions',
    disclaimer: 'Disclaimer & Corrections',
    aboutUs: 'About NEWSORA',
    contactUs: 'Contact Newsroom',
    copyrightNotice: '© 2026 NEWSORA Digital Media. All rights reserved.',
    adminPortal: 'Admin Studio',
    login: 'Login',
    logout: 'Logout',
    dashboard: 'Dashboard',
    articles: 'Articles',
    newArticle: 'Write Article',
    manageCategories: 'Categories',
    breakingNewsManager: 'Breaking Ticker',
    authors: 'Authors',
    settings: 'Site Settings',
    loadMore: 'Load More News',
    loading: 'Loading updates...',
    themeToggle: 'Toggle Theme'
  },
  hi: {
    brandName: 'NEWSORA',
    tagline: 'वह खबर जो आपको प्रेरित करे।',
    breakingNews: 'ताज़ा ख़बर',
    search: 'खोजें',
    searchPlaceholder: 'शीर्षक, राजनीति, तकनीक, खेल खोजें...',
    latestNews: 'ताज़ा खबरें',
    trendingNews: 'ट्रेंडिंग न्यूज़',
    featuredNews: 'प्रमुख समाचार',
    viewAll: 'सभी देखें',
    readMore: 'पूरी खबर पढ़ें',
    minuteRead: 'मिनट पठन',
    publishedOn: 'प्रकाशित',
    byAuthor: 'लेखक',
    sourceCredit: 'स्रोत / संदर्भ',
    shareStory: 'इस खबर को साझा करें',
    whatsappShare: 'व्हाट्सएप',
    facebookShare: 'फेसबुक',
    copyLink: 'लिंक कॉपी करें',
    linkCopied: 'लिंक कॉपी हो गया!',
    relatedArticles: 'संबंधित ख़बरें',
    noArticlesFound: 'आपकी खोज के अनुसार कोई खबर नहीं मिली।',
    translationUnavailable: 'यह समाचार अभी हिंदी में उपलब्ध नहीं है।',
    availableLanguagesNotice: 'आप इस खबर को अन्य भाषाओं में पढ़ सकते हैं:',
    readIn: 'में पढ़ें',
    filterByCategory: 'श्रेणी अनुसार चुनें',
    allCategories: 'सभी श्रेणियां',
    footerAboutText: 'NEWSORA भारत और विश्व भर की निष्पक्ष, तथ्य-सत्यापित पत्रकारिता हिंदी और अंग्रेज़ी में प्रस्तुत करता है।',
    quickLinks: 'महत्वपूर्ण लिंक्स',
    categoriesTitle: 'समाचार श्रेणियां',
    legalTitle: 'नीतियां एवं पारदर्शिता',
    editorialPolicy: 'संपादकीय नीति',
    privacyPolicy: 'गोपनीयता नीति',
    termsConditions: 'नियम एवं शर्तें',
    disclaimer: 'अस्वीकरण एवं सुधार',
    aboutUs: 'हमारे बारे में',
    contactUs: 'न्यूज़रूम से संपर्क',
    copyrightNotice: '© 2026 NEWSORA डिजिटल मीडिया। सर्वाधिकार सुरक्षित।',
    adminPortal: 'एडमिन पोर्टल',
    login: 'लॉग इन',
    logout: 'लॉग आउट',
    dashboard: 'डैशबोर्ड',
    articles: 'लेख / समाचार',
    newArticle: 'नया समाचार लिखें',
    manageCategories: 'श्रेणियां',
    breakingNewsManager: 'ब्रेकिंग टिकर',
    authors: 'संपादक व लेखक',
    settings: 'सेटिंग्स',
    loadMore: 'और समाचार लोड करें',
    loading: 'समाचार लोड हो रहे हैं...',
    themeToggle: 'थीम बदलें'
  }
};
