/**
 * SAVE THE SAHYADRI — INTERNATIONALIZATION (i18n) ENGINE
 * Manages active language state, browser detection, persistence via localStorage,
 * reactive change notifications, and template parameter interpolation.
 */

import { TRANSLATIONS } from '../data/translations.js';

export const SUPPORTED_LANGUAGES = [
  { code: 'mr', icon: 'म', name: 'मराठी', label: 'म (मराठी)' },
  { code: 'hi', icon: 'हिं', name: 'हिंदी', label: 'हिं (हिंदी)' },
  { code: 'en', icon: 'EN', name: 'English', label: 'EN' }
];

const STORAGE_KEY = 'sahyadri_lang';
const listeners = new Set();

/**
 * Detect initial language on startup:
 * 1. Read from localStorage if previously chosen
 * 2. If first visit, inspect navigator.languages / navigator.language for Marathi or Hindi
 * 3. Default to English ('en')
 */
export function detectInitialLanguage() {
  if (typeof window === 'undefined') return 'en';

  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && ['en', 'mr', 'hi'].includes(saved)) {
      return saved;
    }
  } catch (_) {}

  // Check browser language
  try {
    const browserLangs = navigator.languages || [navigator.language || ''];
    for (const raw of browserLangs) {
      const code = (raw || '').toLowerCase().trim();
      if (code.startsWith('mr')) return 'mr';
      if (code.startsWith('hi')) return 'hi';
    }
  } catch (_) {}

  return 'en';
}

let currentLanguage = detectInitialLanguage();

// Ensure <html lang="..."> matches detected language
if (typeof document !== 'undefined' && document.documentElement) {
  document.documentElement.lang = currentLanguage;
}

/**
 * Get current active language code ('en' | 'mr' | 'hi')
 */
export function getLanguage() {
  return currentLanguage;
}

/**
 * Set and switch language instantly across the entire application
 * @param {'en' | 'mr' | 'hi'} lang 
 */
export function setLanguage(lang) {
  if (!['en', 'mr', 'hi'].includes(lang)) return;
  if (currentLanguage === lang) return;

  currentLanguage = lang;

  try {
    localStorage.setItem(STORAGE_KEY, lang);
  } catch (_) {}

  if (typeof document !== 'undefined' && document.documentElement) {
    document.documentElement.lang = lang;
  }

  // Notify registered callbacks
  listeners.forEach((callback) => {
    try {
      callback(currentLanguage);
    } catch (err) {
      console.warn('[i18n Callback Error]', err);
    }
  });

  // Dispatch global window event
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('sahyadri:language-changed', {
      detail: { lang: currentLanguage }
    }));
  }
}

/**
 * Subscribe to language changes
 * @param {Function} callback (lang) => void
 * @returns {Function} unsubscribe function
 */
export function onLanguageChange(callback) {
  if (typeof callback !== 'function') return () => {};
  listeners.add(callback);
  return () => listeners.delete(callback);
}

/**
 * Retrieve translation by dot-notation path with optional parameter substitution or fallback
 * @param {string} path e.g. 'hero.headlineLine1' or 'footer.copyrightText'
 * @param {Object|string} paramsOrFallback e.g. { year: 2026, city: 'Mumbai' } or fallback string 'Exit'
 * @returns {string} translated text with fallback to English or provided fallback
 */
export function t(path, paramsOrFallback = {}) {
  if (!path) return '';

  const fallback = typeof paramsOrFallback === 'string'
    ? paramsOrFallback
    : (paramsOrFallback && paramsOrFallback.fallback ? paramsOrFallback.fallback : path);

  const segments = path.split('.');
  let current = TRANSLATIONS;

  for (const seg of segments) {
    if (current && typeof current === 'object' && seg in current) {
      current = current[seg];
    } else {
      return fallback;
    }
  }

  // If entry is a function (e.g. WhatsApp share text generator)
  if (typeof current === 'function') {
    return current;
  }

  // If entry has language sub-keys { en, mr, hi }
  let result = '';
  if (current && typeof current === 'object') {
    if (current[currentLanguage] !== undefined) {
      result = current[currentLanguage];
    } else if (current['en'] !== undefined) {
      result = current['en'];
    } else {
      return fallback;
    }
  } else if (typeof current === 'string') {
    result = current;
  } else {
    return fallback;
  }

  // Substitute {param} tokens
  if (paramsOrFallback && typeof paramsOrFallback === 'object') {
    Object.keys(paramsOrFallback).forEach((key) => {
      if (key === 'fallback') return;
      const val = paramsOrFallback[key];
      result = result.replace(new RegExp(`\\{${key}\\}`, 'g'), String(val));
    });
  }

  return result;
}

/**
 * Get WhatsApp share message for current language or specified language
 * @param {string} url Website link to share
 * @param {string} [langOverride] Optional language override ('en' | 'mr' | 'hi')
 * @returns {string} Pre-filled message
 */
export function getWhatsAppShareText(url, langOverride = null) {
  const targetLang = langOverride && TRANSLATIONS.whatsappShareText[langOverride]
    ? langOverride
    : currentLanguage;
  const handler = TRANSLATIONS.whatsappShareText[targetLang] || TRANSLATIONS.whatsappShareText.en;
  return handler(url);
}
