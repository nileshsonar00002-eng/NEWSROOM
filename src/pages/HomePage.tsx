import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Flame, Clock, TrendingUp, Sparkles, AlertCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { getArticles } from '../services/articleService';
import { Article } from '../types';
import { SEOHead } from '../components/common/SEOHead';
import { CategoryBar } from '../components/common/CategoryBar';
import { BreakingNewsTicker } from '../components/common/BreakingNewsTicker';
import { NewsCard } from '../components/common/NewsCard';
import { SectionHeader } from '../components/common/SectionHeader';
import { AdBanner } from '../components/common/AdBanner';

export const HomePage: React.FC = () => {
  const { language, t } = useLanguage();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const fetchArticles = () => {
      setLoading(true);
      getArticles({ lang: language, status: 'published' })
        .then((data) => {
          if (mounted) {
            if (data.length === 0) {
              getArticles({ status: 'published' }).then((fallbackData) => {
                if (mounted) {
                  setArticles(fallbackData);
                  setLoading(false);
                }
              });
            } else {
              setArticles(data);
              setLoading(false);
            }
          }
        })
        .catch((err) => {
          console.warn('Error fetching homepage articles:', err);
          if (mounted) setLoading(false);
        });
    };

    fetchArticles();

    // Real-time listener for instant admin updates across tabs and windows
    const handleUpdate = () => {
      fetchArticles();
    };

    window.addEventListener('newsora_articles_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      mounted = false;
      window.removeEventListener('newsora_articles_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, [language]);

  // Derive specialized sections from loaded articles
  const featuredArticles = articles.filter((a) => a.isFeatured);
  const heroArticle = featuredArticles[0] || articles[0];
  const secondaryFeatured = (featuredArticles.slice(1, 3).length > 0
    ? featuredArticles.slice(1, 3)
    : articles.slice(1, 3));

  const latestArticles = articles.slice(0, 6);
  const trendingArticles = articles.filter((a) => a.isTrending).slice(0, 5);

  const getCategoryArticles = (catId: string, max: number = 3) => {
    const list = articles.filter((a) => a.categoryId === catId);
    if (list.length > 0) return list.slice(0, max);
    // Fallback: return matching or generalized articles so section is never visually broken
    return articles.slice(0, max);
  };

  const categoryNamesMap: Record<string, { en: string; hi: string }> = {
    india: { en: 'India News', hi: 'भारत समाचार' },
    business: { en: 'Business & Economy', hi: 'व्यापार एवं अर्थव्यवस्था' },
    technology: { en: 'Technology & AI', hi: 'तकनीक व नवाचार' },
    sports: { en: 'Sports & Cricket', hi: 'खेल व क्रिकेट' },
    entertainment: { en: 'Entertainment & Cinema', hi: 'मनोरंजन व सिनेमा' }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-navy-950 transition-colors">
      <SEOHead
        title={t.tagline}
        description={t.footerAboutText}
        type="website"
      />

      {/* 5. Category Navigation Bar */}
      <CategoryBar />

      {/* 6. Breaking News Ticker */}
      <BreakingNewsTicker />

      {/* Top Advertisement Placement */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-2">
        <AdBanner placement="home-top" />
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-12">
        {/* 7. FEATURED NEWS SECTION */}
        <section aria-label="Featured News">
          <SectionHeader
            title={t.featuredNews}
            badge={language === 'hi' ? 'विशेष' : 'Top Stories'}
          />

          {loading ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-pulse">
              <div className="lg:col-span-2 aspect-video bg-slate-200 dark:bg-navy-800 rounded-xl"></div>
              <div className="space-y-4">
                <div className="aspect-video bg-slate-200 dark:bg-navy-800 rounded-xl"></div>
                <div className="aspect-video bg-slate-200 dark:bg-navy-800 rounded-xl"></div>
              </div>
            </div>
          ) : heroArticle ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Primary Hero Card */}
              <div className="lg:col-span-2">
                <NewsCard
                  article={heroArticle}
                  variant="featured"
                  categoryName={categoryNamesMap[heroArticle.categoryId]?.[language]}
                />
              </div>

              {/* Secondary Featured Grid */}
              <div className="space-y-4 flex flex-col justify-between">
                {secondaryFeatured.map((art) => (
                  <NewsCard
                    key={art.id}
                    article={art}
                    variant="compact"
                    categoryName={categoryNamesMap[art.categoryId]?.[language]}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-slate-500">
              <p>{t.noArticlesFound}</p>
            </div>
          )}
        </section>

        {/* 8 & 9. LATEST NEWS & TRENDING NEWS (Editorial Two-Column Grid) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Section 8: Latest News (2 Columns on Desktop) */}
          <section className="lg:col-span-2" aria-label="Latest News">
            <SectionHeader
              title={t.latestNews}
              slug="latest"
              badge={language === 'hi' ? 'ताज़ा' : 'Live'}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {latestArticles.map((art) => (
                <NewsCard
                  key={art.id}
                  article={art}
                  variant="grid"
                  categoryName={categoryNamesMap[art.categoryId]?.[language]}
                />
              ))}
            </div>

            <div className="mt-6 text-center">
              <Link
                to={`/${language}/latest`}
                className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-white dark:bg-navy-900 border border-slate-300 dark:border-navy-700 text-sm font-bold text-navy-950 dark:text-white hover:bg-slate-100 dark:hover:bg-navy-800 shadow-sm transition min-h-[44px]"
              >
                {t.loadMore}
              </Link>
            </div>
          </section>

          {/* Section 9: Trending News (Sidebar List) */}
          <aside className="lg:col-span-1" aria-label="Trending News">
            <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 rounded-xl overflow-hidden shadow-sm sticky top-24">
              <div className="p-4 bg-slate-50 dark:bg-navy-850 border-b border-slate-200 dark:border-navy-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Flame className="w-5 h-5 text-brand-500" />
                  <h3 className="font-headline font-bold text-base text-navy-950 dark:text-white">
                    {t.trendingNews}
                  </h3>
                </div>
                <Link
                  to={`/${language}/trending`}
                  className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline"
                >
                  {t.viewAll}
                </Link>
              </div>

              <div className="divide-y divide-slate-100 dark:divide-navy-800">
                {(trendingArticles.length > 0 ? trendingArticles : articles.slice(0, 5)).map(
                  (art, idx) => (
                    <NewsCard
                      key={art.id}
                      article={art}
                      variant="trending"
                      trendingIndex={idx + 1}
                      categoryName={categoryNamesMap[art.categoryId]?.[language]}
                    />
                  )
                )}
              </div>

              {/* Sidebar AdSense Placement */}
              <div className="p-3">
                <AdBanner placement="sidebar" />
              </div>
            </div>
          </aside>
        </div>

        {/* In-Between Content Advertisement */}
        <AdBanner placement="home-between" />

        {/* 10. INDIA NEWS */}
        <section aria-label="India News">
          <SectionHeader
            title={categoryNamesMap['india'][language]}
            slug="india"
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {getCategoryArticles('india', 3).map((art) => (
              <NewsCard
                key={art.id}
                article={art}
                variant="grid"
                categoryName={categoryNamesMap['india'][language]}
              />
            ))}
          </div>
        </section>

        {/* 11. BUSINESS & 12. TECHNOLOGY */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <section aria-label="Business News">
            <SectionHeader
              title={categoryNamesMap['business'][language]}
              slug="business"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {getCategoryArticles('business', 2).map((art) => (
                <NewsCard
                  key={art.id}
                  article={art}
                  variant="grid"
                  categoryName={categoryNamesMap['business'][language]}
                />
              ))}
            </div>
          </section>

          <section aria-label="Technology News">
            <SectionHeader
              title={categoryNamesMap['technology'][language]}
              slug="technology"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {getCategoryArticles('technology', 2).map((art) => (
                <NewsCard
                  key={art.id}
                  article={art}
                  variant="grid"
                  categoryName={categoryNamesMap['technology'][language]}
                />
              ))}
            </div>
          </section>
        </div>

        {/* 13. SPORTS & 14. ENTERTAINMENT */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <section aria-label="Sports News">
            <SectionHeader
              title={categoryNamesMap['sports'][language]}
              slug="sports"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {getCategoryArticles('sports', 2).map((art) => (
                <NewsCard
                  key={art.id}
                  article={art}
                  variant="grid"
                  categoryName={categoryNamesMap['sports'][language]}
                />
              ))}
            </div>
          </section>

          <section aria-label="Entertainment News">
            <SectionHeader
              title={categoryNamesMap['entertainment'][language]}
              slug="entertainment"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {getCategoryArticles('entertainment', 2).map((art) => (
                <NewsCard
                  key={art.id}
                  article={art}
                  variant="grid"
                  categoryName={categoryNamesMap['entertainment'][language]}
                />
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};
