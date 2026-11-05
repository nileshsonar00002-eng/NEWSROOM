import React, { useEffect, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { getArticles } from '../services/articleService';
import { getCategories } from '../services/categoryService';
import { Article, Category } from '../types';
import { SEOHead } from '../components/common/SEOHead';
import { CategoryBar } from '../components/common/CategoryBar';
import { NewsCard } from '../components/common/NewsCard';
import { SectionHeader } from '../components/common/SectionHeader';
import { AdBanner } from '../components/common/AdBanner';

export const LatestNewsPage: React.FC = () => {
  const { language, t } = useLanguage();
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadData = () => {
      setLoading(true);
      Promise.all([
        getArticles({ lang: language, categoryId: selectedCategory !== 'all' ? selectedCategory : undefined }),
        getCategories()
      ]).then(([arts, cats]) => {
        if (mounted) {
          setArticles(arts);
          setCategories(cats);
          setLoading(false);
        }
      });
    };

    loadData();

    const handleUpdate = () => {
      loadData();
    };

    window.addEventListener('newsora_articles_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      mounted = false;
      window.removeEventListener('newsora_articles_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, [language, selectedCategory]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-navy-950 text-navy-900 dark:text-slate-100 transition-colors pb-16">
      <SEOHead
        title={t.latestNews}
        description="Browse real-time breaking and latest news across India, Business, Technology, Entertainment, and Sports."
      />

      <CategoryBar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-6 border-b border-slate-200 dark:border-navy-800 gap-4">
          <div>
            <h1 className="font-headline font-black text-2xl sm:text-3xl text-navy-950 dark:text-white">
              {t.latestNews}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Verified breaking updates and chronological news reports.
            </p>
          </div>

          {/* Category Filter Pill Bar */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            <button
              type="button"
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold shrink-0 transition min-h-[36px] ${
                selectedCategory === 'all'
                  ? 'bg-brand-500 text-white'
                  : 'bg-white dark:bg-navy-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-navy-800'
              }`}
            >
              {t.allCategories}
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.slug)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold shrink-0 transition min-h-[36px] ${
                  selectedCategory === cat.slug
                    ? 'bg-brand-500 text-white'
                    : 'bg-white dark:bg-navy-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-navy-800'
                }`}
              >
                {cat.names?.[language] || cat.id}
              </button>
            ))}
          </div>
        </div>

        {/* Ad banner */}
        <AdBanner placement="home-top" />

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="h-64 bg-slate-200 dark:bg-navy-800 rounded-xl"></div>
            ))}
          </div>
        ) : articles.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((art) => (
              <NewsCard key={art.id} article={art} variant="grid" />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-slate-500">
            <p>{t.noArticlesFound}</p>
          </div>
        )}
      </main>
    </div>
  );
};
