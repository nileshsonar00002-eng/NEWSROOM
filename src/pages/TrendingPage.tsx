import React, { useEffect, useState } from 'react';
import { Flame, TrendingUp } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { getArticles } from '../services/articleService';
import { Article } from '../types';
import { SEOHead } from '../components/common/SEOHead';
import { CategoryBar } from '../components/common/CategoryBar';
import { NewsCard } from '../components/common/NewsCard';
import { AdBanner } from '../components/common/AdBanner';

export const TrendingPage: React.FC = () => {
  const { language, t } = useLanguage();
  const [trendingArticles, setTrendingArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    setLoading(true);

    getArticles({ lang: language }).then((arts) => {
      if (mounted) {
        // Prioritize isTrending flag or high view count
        const sorted = [...arts].sort((a, b) => {
          if (a.isTrending && !b.isTrending) return -1;
          if (!a.isTrending && b.isTrending) return 1;
          return (b.viewCount || 0) - (a.viewCount || 0);
        });
        setTrendingArticles(sorted.slice(0, 10));
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
    };
  }, [language]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-navy-950 text-navy-900 dark:text-slate-100 transition-colors pb-16">
      <SEOHead
        title={t.trendingNews}
        description="Top 10 trending news stories, viral discussions, and high-engagement journalism on NEWSORA."
      />

      <CategoryBar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex items-center gap-3 pb-4 mb-6 border-b-2 border-brand-500">
          <div className="w-10 h-10 rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center">
            <Flame className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-headline font-black text-2xl sm:text-3xl text-navy-950 dark:text-white">
              {t.trendingNews}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              The top 10 most-read, high-impact stories across India and the globe.
            </p>
          </div>
        </div>

        <AdBanner placement="home-top" />

        <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 rounded-xl overflow-hidden shadow-sm divide-y divide-slate-100 dark:divide-navy-800">
          {loading ? (
            <div className="p-8 space-y-4 animate-pulse">
              {[1, 2, 3, 4, 5].map((n) => (
                <div key={n} className="h-16 bg-slate-100 dark:bg-navy-800 rounded"></div>
              ))}
            </div>
          ) : trendingArticles.length > 0 ? (
            trendingArticles.map((art, idx) => (
              <NewsCard
                key={art.id}
                article={art}
                variant="trending"
                trendingIndex={idx + 1}
              />
            ))
          ) : (
            <div className="text-center py-12 text-slate-500">
              <p>{t.noArticlesFound}</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
