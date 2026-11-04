import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { getArticles } from '../services/articleService';
import { getCategories } from '../services/categoryService';
import { Article, Category } from '../types';
import { SEOHead } from '../components/common/SEOHead';
import { CategoryBar } from '../components/common/CategoryBar';
import { NewsCard } from '../components/common/NewsCard';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { AdBanner } from '../components/common/AdBanner';

export const CategoryPage: React.FC = () => {
  const { categorySlug } = useParams<{ categorySlug?: string }>();
  const { language, t } = useLanguage();

  const [category, setCategory] = useState<Category | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadCategoryData = () => {
      setLoading(true);
      if (categorySlug) {
        Promise.all([
          getCategories(),
          getArticles({ lang: language, categoryId: categorySlug })
        ]).then(([cats, arts]) => {
          if (!mounted) return;
          const matched = cats.find((c) => c.slug === categorySlug || c.id === categorySlug);
          setCategory(matched || {
            id: categorySlug,
            slug: categorySlug,
            order: 99,
            names: { en: categorySlug.toUpperCase(), hi: categorySlug, mr: categorySlug },
            isActive: true
          });

          if (arts.length === 0) {
            getArticles({ categoryId: categorySlug }).then((fallbackArts) => {
              if (mounted) {
                setArticles(fallbackArts);
                setLoading(false);
              }
            });
          } else {
            setArticles(arts);
            setLoading(false);
          }
        });
      }
    };

    loadCategoryData();

    const handleUpdate = () => {
      loadCategoryData();
    };

    window.addEventListener('newsora_articles_updated', handleUpdate);
    window.addEventListener('newsora_categories_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      mounted = false;
      window.removeEventListener('newsora_articles_updated', handleUpdate);
      window.removeEventListener('newsora_categories_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, [categorySlug, language]);

  const catTitle =
    category?.names?.[language] ||
    category?.names?.en ||
    categorySlug?.toUpperCase() ||
    'Category';

  const heroArticle = articles[0];
  const remainingArticles = articles.slice(1);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-navy-950 text-navy-900 dark:text-slate-100 transition-colors pb-16">
      <SEOHead
        title={`${catTitle} News`}
        description={`Read the latest verified ${catTitle} news updates, analysis, and breaking stories on NEWSORA.`}
        categoryName={catTitle}
      />

      <CategoryBar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <Breadcrumbs items={[{ label: catTitle }]} />

        {/* Category Header Banner */}
        <div className="py-4 my-2 border-b-2 border-navy-950 dark:border-navy-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-3 h-8 bg-brand-500 rounded-sm inline-block"></span>
            <div>
              <h1 className="font-headline font-black text-2xl sm:text-4xl text-navy-950 dark:text-white tracking-tight">
                {catTitle}
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                {articles.length} verified reports filed in this beat.
              </p>
            </div>
          </div>
        </div>

        <AdBanner placement="home-top" />

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse py-6">
            <div className="md:col-span-2 aspect-video bg-slate-200 dark:bg-navy-800 rounded-xl"></div>
            <div className="space-y-4">
              <div className="h-32 bg-slate-200 dark:bg-navy-800 rounded-xl"></div>
              <div className="h-32 bg-slate-200 dark:bg-navy-800 rounded-xl"></div>
            </div>
          </div>
        ) : articles.length > 0 ? (
          <div className="space-y-8 py-4">
            {/* Featured Story */}
            {heroArticle && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <NewsCard
                    article={heroArticle}
                    variant="featured"
                    categoryName={catTitle}
                  />
                </div>
                {remainingArticles.length > 0 && (
                  <div className="space-y-4">
                    {remainingArticles.slice(0, 3).map((art) => (
                      <NewsCard
                        key={art.id}
                        article={art}
                        variant="compact"
                        categoryName={catTitle}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Grid of Remaining Articles */}
            {remainingArticles.length > 3 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
                {remainingArticles.slice(3).map((art) => (
                  <NewsCard
                    key={art.id}
                    article={art}
                    variant="grid"
                    categoryName={catTitle}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-16 text-slate-500">
            <p>{t.noArticlesFound}</p>
            <Link
              to={`/${language}`}
              className="inline-block mt-4 px-4 py-2 bg-brand-500 text-white text-xs font-semibold rounded-lg"
            >
              Browse All News
            </Link>
          </div>
        )}
      </main>
    </div>
  );
};
