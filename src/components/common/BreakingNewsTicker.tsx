import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Flame, Zap } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { getActiveBreakingNews, DEFAULT_BREAKING_NEWS } from '../../services/breakingNewsService';
import { BreakingNewsItem } from '../../types';

export const BreakingNewsTicker: React.FC = () => {
  const { language, t } = useLanguage();
  const [items, setItems] = useState<BreakingNewsItem[]>(DEFAULT_BREAKING_NEWS);

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

  if (!items.length) return null;

  // Extract headlines for the current active language (with English fallback)
  const rawHeadlines = items
    .map((item) => {
      const text = item.headline?.[language] || item.headline?.en || '';
      const link = item.articleSlug
        ? `/${language}/news/${item.articleSlug}`
        : `/${language}/latest`;
      return { id: item.id, text: text.trim(), link };
    })
    .filter((h) => h.text.length > 0);

  if (rawHeadlines.length === 0) return null;

  // Multiply items so the repeating block is wide enough to seamlessly span large screens
  let repeatedList = [...rawHeadlines];
  while (repeatedList.length < 5) {
    repeatedList = [...repeatedList, ...rawHeadlines];
  }

  // Exact 2 identical sets for seamless continuous marquee loop (0% -> -50%)
  const marqueeItems = [...repeatedList, ...repeatedList];

  // Relaxed, calm reading speed (reduced scroll speed)
  const crawlDuration = Math.max(60, repeatedList.length * 13);

  return (
    <div
      className="relative bg-gradient-to-r from-red-900 via-red-700 to-red-850 text-white border-b-2 border-amber-400 shadow-md overflow-hidden select-none"
      role="region"
      aria-label="Breaking News Continuous Ticker"
    >
      <div className="max-w-7xl mx-auto flex items-stretch relative">
        {/* Pinned Left TV Badge */}
        <div className="relative z-20 flex items-center shrink-0 bg-red-950/90 dark:bg-black/90 backdrop-blur-md px-3 sm:px-4 py-2 border-r border-amber-400/30 shadow-2xl">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-400"></span>
            </span>
            <span className="font-headline font-black text-[11px] sm:text-xs tracking-wider uppercase text-amber-300 flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-amber-300 animate-pulse hidden sm:inline" />
              <span>{t.breakingNews}</span>
            </span>
          </div>

          {/* Depth gradient feathering where news text enters/passes behind the badge */}
          <div className="absolute left-full top-0 bottom-0 w-6 bg-gradient-to-r from-red-950/90 dark:from-black/90 to-transparent pointer-events-none"></div>
        </div>

        {/* Continuous Train Ticker Track (Right to Left with Hover Pause) */}
        <div className="flex-1 overflow-hidden relative flex items-center py-2">
          <div
            className="animate-ticker-marquee flex items-center"
            style={{
              animationDuration: `${crawlDuration}s`
            }}
          >
            {marqueeItems.map((item, idx) => (
              <div key={`${item.id}-${idx}`} className="inline-flex items-center shrink-0">
                <Link
                  to={item.link}
                  className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-white hover:text-amber-200 transition py-0.5 hover:underline whitespace-nowrap tracking-wide"
                  title={item.text}
                >
                  <span>{item.text}</span>
                </Link>

                {/* Broadcast News Channel Bullet Separator */}
                <span className="mx-4 sm:mx-6 inline-flex items-center gap-1.5 text-amber-300 select-none">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-sm"></span>
                  <Zap className="w-3 h-3 text-amber-300 opacity-90" />
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-sm"></span>
                </span>
              </div>
            ))}
          </div>

          {/* Right Fade Mask: News emerges smoothly from the right edge */}
          <div className="absolute right-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-l from-red-850 to-transparent pointer-events-none z-10"></div>
        </div>
      </div>
    </div>
  );
};
