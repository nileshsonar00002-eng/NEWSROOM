import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Menu,
  X,
  Search,
  Moon,
  Sun,
  ChevronRight
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';
import { Language } from '../../types';

export const Header: React.FC = () => {
  const { language, setLanguage, t, languageNames } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/${language}/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const handleLanguageChange = (lng: Language) => {
    setLanguage(lng);
    // Replace language in current URL path if formatted like /:lang/...
    const parts = location.pathname.split('/');
    if (parts[1] === 'en' || parts[1] === 'hi') {
      parts[1] = lng;
      navigate(parts.join('/') + location.search);
    } else {
      navigate(`/${lng}${location.pathname}`);
    }
    setMobileMenuOpen(false);
  };

  const formattedDate = new Intl.DateTimeFormat(
    language === 'hi' ? 'hi-IN' : 'en-IN',
    {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }
  ).format(new Date());

  return (
    <>
      {/* 1. Top Announcement Bar */}
      <div className="bg-navy-950 text-slate-300 text-xs border-b border-navy-800/80 px-4 py-1.5 transition-colors">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-medium tracking-wide text-slate-200">{formattedDate}</span>
            <span className="hidden sm:inline-block text-slate-500">•</span>
            <span className="hidden sm:inline-block text-slate-400">
              {language === 'hi'
                ? 'राष्ट्रीय एवं वैश्विक संस्करण'
                : 'National & Global Edition'}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Main Header */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-navy-950/95 backdrop-blur-md border-b border-slate-200 dark:border-navy-800 transition-colors shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Left: Mobile Hamburger & Search Trigger */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2.5 rounded-lg text-navy-800 dark:text-navy-100 hover:bg-slate-100 dark:hover:bg-navy-800 transition min-w-[44px] min-h-[44px] flex items-center justify-center"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>

              <button
                type="button"
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2.5 rounded-lg text-navy-800 dark:text-navy-100 hover:bg-slate-100 dark:hover:bg-navy-800 transition min-w-[44px] min-h-[44px] flex items-center justify-center sm:hidden"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>
            </div>

            {/* Center: Brand Logo */}
            <div className="flex flex-col items-center text-center">
              <Link
                to={`/${language}`}
                className="group flex items-baseline gap-1 focus:outline-none"
              >
                <span className="font-headline font-black text-2xl sm:text-3xl md:text-4xl tracking-tighter text-navy-950 dark:text-white transition group-hover:opacity-90">
                  NEWS<span className="text-brand-500">ORA</span>
                </span>
                <span className="w-2 h-2 rounded-full bg-brand-500 mb-1 inline-block animate-pulse"></span>
              </Link>
              <span className="hidden sm:block text-[11px] tracking-widest uppercase font-medium text-slate-500 dark:text-slate-400 -mt-1 font-sans">
                {t.tagline}
              </span>
            </div>

            {/* Right: Language Selector, Theme & Search on Desktop */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Desktop Search Button */}
              <button
                type="button"
                onClick={() => setSearchOpen(!searchOpen)}
                className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-full text-xs text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-navy-900 hover:bg-slate-200 dark:hover:bg-navy-800 border border-slate-200 dark:border-navy-700 transition"
              >
                <Search className="w-4 h-4 text-slate-400" />
                <span className="hidden md:inline">{t.search}...</span>
              </button>

              {/* Language Selector Segmented Pills */}
              <div className="flex items-center p-1 bg-slate-100 dark:bg-navy-900 rounded-lg border border-slate-200 dark:border-navy-800">
                {(['en', 'hi'] as Language[]).map((lng) => {
                  const isActive = language === lng;
                  return (
                    <button
                      key={lng}
                      onClick={() => handleLanguageChange(lng)}
                      className={`px-3 py-1 text-xs font-semibold rounded-md transition min-h-[32px] sm:min-h-[36px] ${
                        isActive
                          ? 'bg-brand-500 text-white shadow-sm'
                          : 'text-slate-600 dark:text-slate-300 hover:text-navy-900 dark:hover:text-white'
                      }`}
                    >
                      {lng === 'en' ? 'EN' : 'हिंदी'}
                    </button>
                  );
                })}
              </div>

              {/* Theme Toggle Button */}
              <button
                type="button"
                onClick={toggleTheme}
                className="p-2.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-navy-800 transition min-w-[44px] min-h-[44px] flex items-center justify-center"
                aria-label={t.themeToggle}
              >
                {theme === 'dark' ? (
                  <Sun className="w-5 h-5 text-amber-400" />
                ) : (
                  <Moon className="w-5 h-5 text-navy-800" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Search Overlay Bar */}
        {searchOpen && (
          <div className="border-t border-slate-200 dark:border-navy-800 bg-slate-50 dark:bg-navy-900 px-4 py-3 animate-fadeIn">
            <div className="max-w-3xl mx-auto">
              <form onSubmit={handleSearchSubmit} className="relative flex items-center">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t.searchPlaceholder}
                  autoFocus
                  className="w-full pl-11 pr-24 py-2.5 bg-white dark:bg-navy-950 border border-slate-300 dark:border-navy-700 rounded-lg text-sm text-navy-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 min-h-[44px]"
                />
                <Search className="w-5 h-5 text-slate-400 absolute left-3.5 pointer-events-none" />
                <div className="absolute right-2 flex items-center gap-1">
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-brand-500 hover:bg-brand-600 text-white rounded text-xs font-medium transition"
                  >
                    {t.search}
                  </button>
                  <button
                    type="button"
                    onClick={() => setSearchOpen(false)}
                    className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </header>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-navy-950/70 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          ></div>

          <div className="relative w-4/5 max-w-sm bg-white dark:bg-navy-950 h-full shadow-2xl flex flex-col z-10 overflow-y-auto">
            {/* Drawer Header */}
            <div className="p-4 border-b border-slate-200 dark:border-navy-800 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="font-headline font-black text-xl text-navy-950 dark:text-white">
                  NEWS<span className="text-brand-500">ORA</span>
                </span>
              </div>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-navy-800 min-w-[44px] min-h-[44px] flex items-center justify-center"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Language Switcher in Drawer */}
            <div className="p-4 bg-slate-50 dark:bg-navy-900 border-b border-slate-200 dark:border-navy-800">
              <span className="text-xs uppercase font-semibold text-slate-400 tracking-wider block mb-2">
                Language / भाषा
              </span>
              <div className="grid grid-cols-2 gap-2">
                {(['en', 'hi'] as Language[]).map((lng) => (
                  <button
                    key={lng}
                    onClick={() => handleLanguageChange(lng)}
                    className={`py-2 rounded-lg text-xs font-semibold text-center transition min-h-[44px] ${
                      language === lng
                        ? 'bg-brand-500 text-white'
                        : 'bg-white dark:bg-navy-950 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-navy-800'
                    }`}
                  >
                    {languageNames[lng].native}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div className="p-4 space-y-1">
              <Link
                to={`/${language}`}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between p-3 rounded-lg font-medium text-sm text-navy-900 dark:text-white hover:bg-slate-100 dark:hover:bg-navy-900 min-h-[44px]"
              >
                <span>{language === 'hi' ? 'मुखपृष्ठ' : 'Home'}</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </Link>
              <Link
                to={`/${language}/latest`}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between p-3 rounded-lg font-medium text-sm text-navy-900 dark:text-white hover:bg-slate-100 dark:hover:bg-navy-900 min-h-[44px]"
              >
                <span>{t.latestNews}</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </Link>
            </div>

            {/* Main Categories in Drawer */}
            <div className="px-4 py-2 border-t border-slate-200 dark:border-navy-800">
              <span className="text-xs uppercase font-semibold text-slate-400 tracking-wider block mb-2">
                {t.categoriesTitle}
              </span>
              <div className="grid grid-cols-2 gap-1">
                {[
                  { slug: 'india', label: language === 'hi' ? 'भारत' : 'India' },
                  { slug: 'business', label: language === 'hi' ? 'व्यापार' : 'Business' },
                  { slug: 'technology', label: language === 'hi' ? 'तकनीक' : 'Technology' },
                  { slug: 'entertainment', label: language === 'hi' ? 'मनोरंजन' : 'Entertainment' },
                  { slug: 'sports', label: language === 'hi' ? 'खेल' : 'Sports' }
                ].map((item) => (
                  <Link
                    key={item.slug}
                    to={`/${language}/category/${item.slug}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2.5 text-sm text-slate-600 dark:text-slate-300 hover:text-brand-500 dark:hover:text-brand-400 rounded-md transition min-h-[44px] flex items-center"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Footer Information in Drawer */}
            <div className="mt-auto p-4 border-t border-slate-200 dark:border-navy-800 bg-slate-50 dark:bg-navy-900/50">
              <div className="text-[11px] text-slate-400">
                {t.copyrightNotice}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
