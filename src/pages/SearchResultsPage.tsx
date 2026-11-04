import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { getArticles } from '../services/articleService';
import { getCategories } from '../services/categoryService';
import { Article, Category } from '../types';
import { SEOHead } from '../components/common/SEOHead';
import { CategoryBar } from '../components/common/CategoryBar';
import { NewsCard } from '../components/common/NewsCard';

export const SearchResultsPage: React.FC = () => {
  const { language, t } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const [query, setQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getCategories().then(setCategories);
  }, []);

  useEffect(() => {
    const qParam = searchParams.get('q') || '';
    setQuery(qParam);

    let mounted = true;
    setLoading(true);

    getArticles({
      lang: language,
      categoryId: selectedCategory !== 'all' ? selectedCategory : undefined,
      searchQuery: qParam
    }).then((results) => {
      if (mounted) {
        setArticles(results);
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
    };
  }, [searchParams, selectedCategory, language]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams({ q: query.trim() });
  };

  const handleClear = () => {
    setQuery('');
    setSearchParams({});
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-navy-950 text-navy-900 dark:text-slate-100 transition-colors pb-16">
      <SEOHead
        title={initialQuery ? `Search: "${initialQuery}"` : t.search}
        description="Search verified news reports, topics, keywords, and editorial coverage on NEWSORA."
      />

      <CategoryBar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Search Header Form */}
        <div className="max-w-3xl mx-auto mb-8">
          <form onSubmit={handleSubmit} className="relative flex items-center mb-4">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="w-full pl-12 pr-28 py-3.5 bg-white dark:bg-navy-900 border border-slate-300 dark:border-navy-700 rounded-xl text-base text-navy-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 shadow-sm min-h-[48px]"
            />
            <Search className="w-5 h-5 text-slate-400 absolute left-4 pointer-events-none" />

            {query && (
              <button
                type="button"
                onClick={handleClear}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white absolute right-24"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            <button
              type="submit"
              className="absolute right-2 px-5 py-2.5 bg-brand-500 hover:bg-brand-600 text-white rounded-lg text-xs font-bold transition min-h-[38px]"
            >
              {t.search}
            </button>
          </form>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" />
              Filter:
            </span>
            <button
              type="button"
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1 rounded-full text-xs font-semibold shrink-0 transition min-h-[32px] ${
                selectedCategory === 'all'
                  ? 'bg-navy-900 dark:bg-white text-white dark:text-navy-950'
                  : 'bg-white dark:bg-navy-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-navy-800'
              }`}
            >
              {t.allCategories}
            </button>
            {categories.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setSelectedCategory(c.slug)}
                className={`px-3 py-1 rounded-full text-xs font-semibold shrink-0 transition min-h-[32px] ${
                  selectedCategory === c.slug
                    ? 'bg-brand-500 text-white'
                    : 'bg-white dark:bg-navy-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-navy-800'
                }`}
              >
                {c.names?.[language] || c.id}
              </button>
            ))}
          </div>
        </div>

        {/* Results Header */}
        <div className="pb-3 mb-6 border-b border-slate-200 dark:border-navy-800 flex items-center justify-between text-xs text-slate-500">
          <span>
            {loading ? 'Searching...' : `${articles.length} news stories found`}
            {initialQuery && ` for "${initialQuery}"`}
          </span>
          <span>Sorted by Latest First</span>
        </div>

        {/* Results Stream */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3].map((n) => (
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
          <div className="text-center py-16 text-slate-500 space-y-2">
            <p className="text-base font-semibold">{t.noArticlesFound}</p>
            <p className="text-xs text-slate-400">
              Try searching with broader terms, single keywords, or removing category filters.
            </p>
          </div>
        )}
      </main>
    </div>
  );
};
