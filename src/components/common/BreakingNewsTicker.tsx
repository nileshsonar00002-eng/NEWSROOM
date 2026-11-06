import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Zap } from 'lucide-react';
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

  // Relaxed, calm reading speed
  const crawlDuration = Math.max(60, repeatedList.length * 13);

  return (
    <div
      className="relative bg-red-600 text-white border-b-2 border-amber-400 shadow-md overflow-hidden select-none"
      role="region"
      aria-label="Breaking News Continuous Ticker"
    >
      <div className="max-w-7xl mx-auto flex items-stretch relative">
        {/* Pinned Left TV Badge */}
        <div className="relative z-20 flex items-center shrink-0 bg-black px-3 sm:px-4 py-2 border-r border-black/30 shadow-md">
          <div className="flex items-center gap-2">
            {/* Live TV Red Pulsing Beacon */}
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-80"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-600"></span>
            </span>
            <span className="font-headline font-black text-[11px] sm:text-xs tracking-wider uppercase text-white">
              {t.breakingNews}
            </span>
          </div>
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
        </div>
      </div>
    </div>
  );
};
