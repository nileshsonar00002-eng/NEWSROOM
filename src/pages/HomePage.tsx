import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Flame } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { subscribeToArticles } from '../services/articleService';
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
    setLoading(true);
    // Live Cloud Firestore real-time subscription — reflects admin updates immediately across all devices
    const unsubscribe = subscribeToArticles(
      { lang: language, status: 'published' },
      (data) => {
        setArticles(data);
        setLoading(false);
      },
      () => {
        setLoading(false);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [language]);

  // Derive specialized sections strictly from real Firebase articles
  const featuredArticles = articles.filter((a) => a.isFeatured);
  const heroArticle = featuredArticles[0] || articles[0];
  const secondaryFeatured =
    featuredArticles.slice(1, 3).length > 0
      ? featuredArticles.slice(1, 3)
      : articles.slice(1, 3);

  const latestArticles = articles.slice(0, 6);
  const trendingArticles = (
    articles.filter((a) => a.isTrending).length > 0
      ? articles.filter((a) => a.isTrending)
      : articles
  ).slice(0, 5);

  const getCategoryArticles = (catId: string, max: number = 3) => {
    return articles.filter((a) => a.categoryId === catId).slice(0, max);
  };

  const indiaArticles = getCategoryArticles('india', 3);
  const businessArticles = getCategoryArticles('business', 2);
  const technologyArticles = getCategoryArticles('technology', 2);
  const sportsArticles = getCategoryArticles('sports', 2);
  const entertainmentArticles = getCategoryArticles('entertainment', 2);

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

      {/* Category Navigation Bar */}
      <CategoryBar />

      {/* Breaking News Ticker (only visible when active breaking news exists in Firebase) */}
      <BreakingNewsTicker />

      {/* Top Advertisement Placement */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-2">
        <AdBanner placement="home-top" />
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-12">
        {/* LATEST NEWS & TRENDING NEWS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Section: Latest News (2 Columns on Desktop) */}
          <section className="lg:col-span-2" aria-label="Latest News">
            <SectionHeader
              title={t.latestNews}
              slug="latest"
              badge={language === 'hi' ? 'ताज़ा' : 'Live'}
            />

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-pulse">
                {[1, 2, 3, 4].map((n) => (
                  <div key={n} className="h-64 bg-slate-200 dark:bg-navy-800 rounded-xl"></div>
                ))}
              </div>
            ) : latestArticles.length > 0 ? (
              <>
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
              </>
            ) : (
              <div className="text-center py-16 px-4 bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 rounded-2xl text-slate-500 dark:text-slate-400">
                <p className="font-headline font-bold text-base text-navy-950 dark:text-white">
                  {language === 'hi' ? 'अभी कोई समाचार प्रकाशित नहीं हुआ है' : 'No news published yet'}
                </p>
                <p className="text-xs sm:text-sm mt-1">
                  {language === 'hi'
                    ? 'एडमिन पैनल से नई खबर प्रकाशित करते ही वह यहाँ तुरंत दिखाई देगी।'
                    : 'Fresh stories published from the Admin Panel will appear here instantly.'}
                </p>
              </div>
            )}
          </section>

          {/* Section: Trending News (Sidebar List) */}
          <aside className="lg:col-span-1" aria-label="Trending News">
            <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 rounded-xl overflow-hidden shadow-sm sticky top-24">
              <div className="p-4 bg-slate-50 dark:bg-navy-850 border-b border-slate-200 dark:border-navy-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Flame className="w-5 h-5 text-brand-500" />
                  <h3 className="font-headline font-bold text-base text-navy-950 dark:text-white">
                    {t.trendingNews}
                  </h3>
                </div>
                {trendingArticles.length > 0 && (
                  <Link
                    to={`/${language}/trending`}
                    className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline"
                  >
                    {t.viewAll}
                  </Link>
                )}
              </div>

              {trendingArticles.length > 0 ? (
                <div className="divide-y divide-slate-100 dark:divide-navy-800">
                  {trendingArticles.map((art, idx) => (
                    <NewsCard
                      key={art.id}
                      article={art}
                      variant="trending"
                      trendingIndex={idx + 1}
                      categoryName={categoryNamesMap[art.categoryId]?.[language]}
                    />
                  ))}
                </div>
              ) : (
                <div className="p-6 text-center text-xs text-slate-400">
                  {language === 'hi'
                    ? 'अभी कोई ट्रेंडिंग समाचार नहीं है।'
                    : 'No trending stories yet.'}
                </div>
              )}

              {/* Sidebar AdSense Placement */}
              <div className="p-3">
                <AdBanner placement="sidebar" />
              </div>
            </div>
          </aside>
        </div>

        {/* FEATURED NEWS SECTION (Only displayed when stories exist) */}
        {heroArticle && (
          <section aria-label="Featured News">
            <SectionHeader title={t.featuredNews} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Primary Hero Card */}
              <div className={secondaryFeatured.length > 0 ? 'lg:col-span-2' : 'lg:col-span-3'}>
                <NewsCard
                  article={heroArticle}
                  variant="featured"
                  categoryName={categoryNamesMap[heroArticle.categoryId]?.[language]}
                />
              </div>

              {/* Secondary Featured Grid */}
              {secondaryFeatured.length > 0 && (
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
              )}
            </div>
          </section>
        )}

        {/* In-Between Content Advertisement */}
        <AdBanner placement="home-between" />

        {/* INDIA NEWS */}
        {indiaArticles.length > 0 && (
          <section aria-label="India News">
            <SectionHeader title={categoryNamesMap['india'][language]} slug="india" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {indiaArticles.map((art) => (
                <NewsCard
                  key={art.id}
                  article={art}
                  variant="grid"
                  categoryName={categoryNamesMap['india'][language]}
                />
              ))}
            </div>
          </section>
        )}

        {/* BUSINESS & TECHNOLOGY */}
        {(businessArticles.length > 0 || technologyArticles.length > 0) && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {businessArticles.length > 0 && (
              <section aria-label="Business News">
                <SectionHeader title={categoryNamesMap['business'][language]} slug="business" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {businessArticles.map((art) => (
                    <NewsCard
                      key={art.id}
                      article={art}
                      variant="grid"
                      categoryName={categoryNamesMap['business'][language]}
                    />
                  ))}
                </div>
              </section>
            )}

            {technologyArticles.length > 0 && (
              <section aria-label="Technology News">
                <SectionHeader title={categoryNamesMap['technology'][language]} slug="technology" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {technologyArticles.map((art) => (
                    <NewsCard
                      key={art.id}
                      article={art}
                      variant="grid"
                      categoryName={categoryNamesMap['technology'][language]}
                    />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}

        {/* SPORTS & ENTERTAINMENT */}
        {(sportsArticles.length > 0 || entertainmentArticles.length > 0) && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {sportsArticles.length > 0 && (
              <section aria-label="Sports News">
                <SectionHeader title={categoryNamesMap['sports'][language]} slug="sports" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {sportsArticles.map((art) => (
                    <NewsCard
                      key={art.id}
                      article={art}
                      variant="grid"
                      categoryName={categoryNamesMap['sports'][language]}
                    />
                  ))}
                </div>
              </section>
            )}

            {entertainmentArticles.length > 0 && (
              <section aria-label="Entertainment News">
                <SectionHeader
                  title={categoryNamesMap['entertainment'][language]}
                  slug="entertainment"
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {entertainmentArticles.map((art) => (
                    <NewsCard
                      key={art.id}
                      article={art}
                      variant="grid"
                      categoryName={categoryNamesMap['entertainment'][language]}
                    />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </main>
    </div>
  );
};
