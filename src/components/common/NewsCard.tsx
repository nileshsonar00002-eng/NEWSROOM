import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Eye, Share2 } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { Article, Language } from '../../types';

interface NewsCardProps {
  article: Article;
  variant?: 'featured' | 'compact' | 'grid' | 'trending';
  trendingIndex?: number;
  categoryName?: string;
  className?: string;
}

export const NewsCard: React.FC<NewsCardProps> = ({
  article,
  variant = 'grid',
  trendingIndex,
  categoryName,
  className = ''
}) => {
  const { language, t } = useLanguage();

  // Pick translation for current language, or fallback to first available
  const trans =
    article.translations?.[language]?.title
      ? article.translations[language]
      : article.translations?.en?.title
      ? article.translations.en
      : article.translations?.hi || article.translations?.mr;

  if (!trans || !trans.title) return null;

  const articleUrl = `/${language}/news/${trans.slug || article.id}`;
  const displayCategory = categoryName || article.categoryId.toUpperCase();

  // Format relative or published date
  const dateStr = trans.publishedAt || article.createdAt;
  const formattedDate = dateStr
    ? new Intl.DateTimeFormat(
        language === 'hi' ? 'hi-IN' : language === 'mr' ? 'mr-IN' : 'en-IN',
        { month: 'short', day: 'numeric' }
      ).format(new Date(dateStr))
    : '';

  // 1. FEATURED HERO VARIANT
  if (variant === 'featured') {
    return (
      <article
        className={`group bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition duration-300 ${className}`}
      >
        <Link to={articleUrl} className="block relative aspect-video sm:aspect-[21/9] overflow-hidden bg-slate-100 dark:bg-navy-950">
          <img
            src={article.imageUrl}
            alt={trans.title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
          <div className="absolute top-3 left-3 sm:top-4 sm:left-4">
            <span className="px-3 py-1 bg-brand-500 text-white font-bold text-xs uppercase tracking-wider rounded-md shadow-md">
              {displayCategory}
            </span>
          </div>
          <div className="absolute bottom-3 left-3 right-3 sm:bottom-6 sm:left-6 sm:right-6 text-white">
            <h1 className="font-headline font-bold text-lg sm:text-2xl md:text-3xl leading-snug line-clamp-3 mb-2 group-hover:text-amber-200 transition">
              {trans.title}
            </h1>
            <div className="flex items-center gap-3 text-xs text-slate-300">
              {formattedDate && <span>{formattedDate}</span>}
              {article.readingTimeMinutes && (
                <>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {article.readingTimeMinutes} {t.minuteRead}
                  </span>
                </>
              )}
            </div>
          </div>
        </Link>
        {trans.description && (
          <div className="p-4 sm:p-5">
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
              {trans.description}
            </p>
          </div>
        )}
      </article>
    );
  }

  // 2. COMPACT MOBILE-FIRST HORIZONTAL CARD
  if (variant === 'compact') {
    return (
      <article
        className={`group flex items-start gap-3 sm:gap-4 p-3 sm:p-4 bg-white dark:bg-navy-900 border border-slate-200/90 dark:border-navy-800 rounded-xl hover:bg-slate-50 dark:hover:bg-navy-850 transition duration-200 ${className}`}
      >
        <Link
          to={articleUrl}
          className="relative w-24 h-24 sm:w-28 sm:h-28 shrink-0 rounded-lg overflow-hidden bg-slate-100 dark:bg-navy-950"
        >
          <img
            src={article.imageUrl}
            alt={trans.title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </Link>

        <div className="flex-1 min-w-0 flex flex-col justify-between self-stretch">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-bold text-brand-600 dark:text-brand-400 uppercase tracking-wider">
                {displayCategory}
              </span>
              {formattedDate && (
                <span className="text-[11px] text-slate-400">• {formattedDate}</span>
              )}
            </div>
            <Link to={articleUrl} className="block">
              <h2 className="font-headline font-semibold text-sm sm:text-base leading-snug text-navy-950 dark:text-white line-clamp-2 group-hover:text-brand-500 transition">
                {trans.title}
              </h2>
            </Link>
          </div>

          <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-2">
            {article.readingTimeMinutes && (
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {article.readingTimeMinutes} {t.minuteRead}
              </span>
            )}
            {article.viewCount !== undefined && article.viewCount > 0 && (
              <span className="flex items-center gap-1">
                <Eye className="w-3 h-3" />
                {article.viewCount}
              </span>
            )}
          </div>
        </div>
      </article>
    );
  }

  // 3. TRENDING NUMBERED CARD
  if (variant === 'trending') {
    return (
      <article
        className={`group flex items-start gap-3 p-3 bg-white dark:bg-navy-900 border-b border-slate-200 dark:border-navy-800 last:border-b-0 hover:bg-slate-50 dark:hover:bg-navy-850 transition ${className}`}
      >
        <div className="shrink-0 w-8 text-center">
          <span className="font-headline font-black text-2xl text-brand-500/80 group-hover:text-brand-500 transition">
            {trendingIndex !== undefined ? String(trendingIndex).padStart(2, '0') : '•'}
          </span>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              {displayCategory}
            </span>
            {formattedDate && (
              <span className="text-[11px] text-slate-400">• {formattedDate}</span>
            )}
          </div>
          <Link to={articleUrl} className="block">
            <h2 className="font-headline font-semibold text-xs sm:text-sm leading-snug text-navy-950 dark:text-white line-clamp-2 group-hover:text-brand-500 transition">
              {trans.title}
            </h2>
          </Link>
        </div>
      </article>
    );
  }

  // 4. STANDARD EDITORIAL GRID CARD
  return (
    <article
      className={`group flex flex-col bg-white dark:bg-navy-900 border border-slate-200/90 dark:border-navy-800 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition duration-300 ${className}`}
    >
      <Link to={articleUrl} className="block relative aspect-video overflow-hidden bg-slate-100 dark:bg-navy-950">
        <img
          src={article.imageUrl}
          alt={trans.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-2.5 left-2.5">
          <span className="px-2.5 py-0.5 bg-navy-950/80 backdrop-blur-sm text-white font-bold text-[10px] uppercase tracking-wider rounded">
            {displayCategory}
          </span>
        </div>
      </Link>

      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
            {formattedDate && <span>{formattedDate}</span>}
            {article.readingTimeMinutes && (
              <>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {article.readingTimeMinutes} {t.minuteRead}
                </span>
              </>
            )}
          </div>
          <Link to={articleUrl} className="block mb-2">
            <h2 className="font-headline font-bold text-base sm:text-lg leading-snug text-navy-950 dark:text-white line-clamp-2 group-hover:text-brand-500 transition">
              {trans.title}
            </h2>
          </Link>
          {trans.description && (
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
              {trans.description}
            </p>
          )}
        </div>

        <div className="pt-3 mt-3 border-t border-slate-100 dark:border-navy-800 flex items-center justify-between">
          <Link
            to={articleUrl}
            className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:text-brand-500 flex items-center gap-1 transition"
          >
            {t.readMore} →
          </Link>
          {article.viewCount !== undefined && article.viewCount > 0 && (
            <span className="text-[11px] text-slate-400 flex items-center gap-1">
              <Eye className="w-3 h-3" />
              {article.viewCount}
            </span>
          )}
        </div>
      </div>
    </article>
  );
};
