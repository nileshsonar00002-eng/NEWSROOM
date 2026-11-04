import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Flame, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { getActiveBreakingNews, DEFAULT_BREAKING_NEWS } from '../../services/breakingNewsService';
import { BreakingNewsItem } from '../../types';

export const BreakingNewsTicker: React.FC = () => {
  const { language, t } = useLanguage();
  const [items, setItems] = useState<BreakingNewsItem[]>(DEFAULT_BREAKING_NEWS);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    let mounted = true;

    const loadBreaking = () => {
      getActiveBreakingNews(language).then((res) => {
        if (mounted && res && res.length > 0) {
          setItems(res);
        }
      });
    };

    loadBreaking();

    const handleUpdate = () => {
      loadBreaking();
    };

    window.addEventListener('newsora_breaking_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      mounted = false;
      window.removeEventListener('newsora_breaking_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, [language]);

  // Auto-cycle through items
  useEffect(() => {
    if (items.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [items]);

  if (!items.length) return null;

  const currentItem = items[currentIndex] || items[0];
  const headlineText =
    currentItem.headline?.[language] ||
    currentItem.headline?.en ||
    '';

  const linkTarget = currentItem.articleSlug
    ? `/${language}/news/${currentItem.articleSlug}`
    : `/${language}/latest`;

  return (
    <div className="bg-gradient-to-r from-red-600 via-brand-600 to-red-700 text-white shadow-sm overflow-hidden border-b border-red-700">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2 flex items-center justify-between gap-3">
        {/* Left: Compact Breaking Label */}
        <div className="flex items-center gap-1.5 shrink-0 bg-white/20 backdrop-blur-sm px-2.5 py-1 rounded-md">
          <Flame className="w-4 h-4 text-amber-300 animate-pulse" />
          <span className="font-black text-xs tracking-wider uppercase">
            {t.breakingNews}
          </span>
        </div>

        {/* Center: Headline Ticker */}
        <div className="flex-1 min-w-0 overflow-hidden">
          <Link
            to={linkTarget}
            className="block text-xs sm:text-sm font-semibold truncate hover:underline hover:text-amber-100 transition"
            title={headlineText}
          >
            <span className="animate-fadeIn inline-block">{headlineText}</span>
          </Link>
        </div>

        {/* Right: Cycle Controls (Desktop & Mobile) */}
        {items.length > 1 && (
          <div className="flex items-center gap-1 shrink-0">
            <span className="text-[11px] text-white/80 hidden sm:inline mr-1">
              {currentIndex + 1} / {items.length}
            </span>
            <button
              type="button"
              onClick={() => setCurrentIndex((prev) => (prev === 0 ? items.length - 1 : prev - 1))}
              className="p-1 rounded hover:bg-white/20 transition min-w-[28px] min-h-[28px] flex items-center justify-center"
              aria-label="Previous headline"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setCurrentIndex((prev) => (prev + 1) % items.length)}
              className="p-1 rounded hover:bg-white/20 transition min-w-[28px] min-h-[28px] flex items-center justify-center"
              aria-label="Next headline"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
