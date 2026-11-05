import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Clock,
  Calendar,
  User,
  ExternalLink,
  Tag,
  AlertCircle,
  Eye,
  ChevronRight,
  Globe
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { getArticleBySlug, getArticles } from '../services/articleService';
import { getAuthors } from '../services/authorService';
import { trackArticleView } from '../services/analyticsService';
import { Article, Author, Language } from '../types';
import { SEOHead } from '../components/common/SEOHead';
import { CategoryBar } from '../components/common/CategoryBar';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { ReadingProgress } from '../components/common/ReadingProgress';
import { ShareButtons } from '../components/common/ShareButtons';
import { AdBanner } from '../components/common/AdBanner';
import { NewsCard } from '../components/common/NewsCard';

export const ArticleDetailPage: React.FC = () => {
  const { lang, slug } = useParams<{ lang?: string; slug?: string }>();
  const { language, setLanguage, t, languageNames } = useLanguage();
  const navigate = useNavigate();

  const [article, setArticle] = useState<Article | null>(null);
  const [author, setAuthor] = useState<Author | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [translationMissing, setTranslationMissing] = useState(false);

  const activeLang: Language = (lang as Language) || language;

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setTranslationMissing(false);

    if (slug) {
      getArticleBySlug(activeLang, slug).then(async (art) => {
        if (!mounted) return;

        if (art) {
          setArticle(art);

          // Track privacy-conscious view
          trackArticleView(art.id, activeLang);

          // Check if article translation exists for active language
          const trans = art.translations?.[activeLang];
          if (!trans || !trans.title || trans.status !== 'published') {
            setTranslationMissing(true);
          }

          // Fetch author
          getAuthors().then((authors) => {
            if (mounted) {
              const matchedAuthor = authors.find((a) => a.id === art.authorId) || authors[0];
              setAuthor(matchedAuthor);
            }
          });

          // Fetch related articles from same category
          getArticles({ categoryId: art.categoryId, limitCount: 4 }).then((rel) => {
            if (mounted) {
              setRelatedArticles(rel.filter((r) => r.id !== art.id).slice(0, 3));
            }
          });
        } else {
          setArticle(null);
        }
        setLoading(false);
      });
    }

    return () => {
      mounted = false;
    };
  }, [slug, activeLang]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-navy-950 py-12 px-4">
        <CategoryBar />
        <div className="max-w-4xl mx-auto space-y-6 animate-pulse pt-8">
          <div className="h-6 w-1/3 bg-slate-200 dark:bg-navy-800 rounded"></div>
          <div className="h-10 w-4/5 bg-slate-200 dark:bg-navy-800 rounded"></div>
          <div className="aspect-video bg-slate-200 dark:bg-navy-800 rounded-xl"></div>
          <div className="space-y-3">
            <div className="h-4 bg-slate-200 dark:bg-navy-800 rounded"></div>
            <div className="h-4 bg-slate-200 dark:bg-navy-800 rounded"></div>
            <div className="h-4 w-2/3 bg-slate-200 dark:bg-navy-800 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-navy-950 py-16 px-4 text-center">
        <CategoryBar />
        <div className="max-w-md mx-auto py-16 space-y-4">
          <AlertCircle className="w-16 h-16 text-brand-500 mx-auto" />
          <h1 className="font-headline font-bold text-2xl text-navy-950 dark:text-white">
            Article Not Found
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            The article you are looking for may have been moved, renamed, or is currently in draft.
          </p>
          <Link
            to={`/${language}`}
            className="inline-block px-5 py-2.5 bg-brand-500 text-white rounded-xl text-sm font-semibold hover:bg-brand-600 transition"
          >
            Return to Homepage
          </Link>
        </div>
      </div>
    );
  }

  // Active translation or fallback
  const trans =
    article.translations?.[activeLang]?.title
      ? article.translations[activeLang]
      : article.translations?.en?.title
      ? article.translations.en
      : article.translations?.hi;

  const currentUrl = window.location.href;
  const publishedDate = trans?.publishedAt || article.createdAt;
  const formattedDate = publishedDate
    ? new Intl.DateTimeFormat(
        activeLang === 'hi' ? 'hi-IN' : 'en-IN',
        {
          dateStyle: 'full',
          timeStyle: 'short'
        }
      ).format(new Date(publishedDate))
    : '';

  // Available translations for language notice
  const availableLangs = (['en', 'hi'] as Language[]).filter(
    (l) => article.translations?.[l]?.status === 'published' && article.translations?.[l]?.title
  );

  return (
    <div className="min-h-screen bg-white dark:bg-navy-950 text-navy-900 dark:text-slate-100 transition-colors pb-16">
      <SEOHead
        title={trans?.seoTitle || trans?.title}
        description={trans?.seoDescription || trans?.description}
        image={article.imageUrl}
        type="article"
        publishedTime={publishedDate}
        authorName={author?.name}
        categoryName={article.categoryId}
        tags={article.tags}
        articleSlug={trans?.slug}
      />

      {/* Reading Progress Indicator */}
      <ReadingProgress />

      {/* Category Bar */}
      <CategoryBar />

      <article className="max-w-4xl mx-auto px-4 sm:px-6 pt-4 sm:pt-6">
        {/* Breadcrumb Navigation */}
        <Breadcrumbs
          items={[
            {
              label: article.categoryId.toUpperCase(),
              path: `/${activeLang}/category/${article.categoryId}`
            },
            {
              label: trans?.title || 'Article'
            }
          ]}
        />

        {/* Translation Availability Notice */}
        {translationMissing && (
          <div className="my-4 p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-700/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Globe className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
              <div>
                <p className="text-xs font-semibold text-amber-900 dark:text-amber-200">
                  {t.translationUnavailable}
                </p>
                <p className="text-xs text-amber-700 dark:text-amber-400">
                  {t.availableLanguagesNotice}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {availableLangs.map((lng) => {
                const targetSlug = article.translations[lng]?.slug || slug;
                return (
                  <Link
                    key={lng}
                    to={`/${lng}/news/${targetSlug}`}
                    onClick={() => setLanguage(lng)}
                    className="px-3 py-1.5 rounded-lg bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-100 text-xs font-bold hover:bg-amber-300 dark:hover:bg-amber-800 transition min-h-[36px] flex items-center"
                  >
                    {languageNames[lng].native}
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Category Pill & Reading Time */}
        <div className="flex items-center gap-3 my-3">
          <Link
            to={`/${activeLang}/category/${article.categoryId}`}
            className="px-3 py-1 bg-brand-500 text-white font-bold text-xs uppercase tracking-wider rounded-md hover:bg-brand-600 transition"
          >
            {article.categoryId}
          </Link>

          {article.readingTimeMinutes && (
            <span className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
              <Clock className="w-3.5 h-3.5" />
              {article.readingTimeMinutes} {t.minuteRead}
            </span>
          )}

          {article.viewCount !== undefined && article.viewCount > 0 && (
            <span className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
              <Eye className="w-3.5 h-3.5" />
              {article.viewCount} views
            </span>
          )}
        </div>

        {/* Article Headline */}
        <h1 className="font-headline font-black text-2xl sm:text-3xl md:text-4xl lg:text-5xl leading-tight sm:leading-tight text-navy-950 dark:text-white tracking-tight mb-4">
          {trans?.title}
        </h1>

        {/* Short Description / Lead Excerpt */}
        {trans?.description && (
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-sans mb-6 border-l-4 border-brand-500 pl-4 py-1 italic">
            {trans.description}
          </p>
        )}

        {/* Author & Publishing Metadata Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y border-slate-200 dark:border-navy-800 text-xs text-slate-500 dark:text-slate-400 mb-6">
          <div className="flex items-center gap-3">
            {author?.avatarUrl ? (
              <img
                src={author.avatarUrl}
                alt={author.name}
                className="w-10 h-10 rounded-full object-cover border border-slate-300 dark:border-navy-700"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-navy-800 flex items-center justify-center">
                <User className="w-5 h-5 text-slate-500" />
              </div>
            )}
            <div>
              <div className="font-bold text-navy-950 dark:text-white text-sm">
                {author?.name || 'NEWSORA Bureau'}
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">
                {author?.role || 'Staff Correspondent'}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-slate-400" />
            <span>{formattedDate}</span>
          </div>
        </div>

        {/* Social Sharing Buttons */}
        <div className="mb-6">
          <ShareButtons title={trans?.title || 'NEWSORA News'} url={currentUrl} />
        </div>

        {/* Featured Image with Caption & Credit */}
        <figure className="mb-8 rounded-xl overflow-hidden bg-slate-100 dark:bg-navy-900 border border-slate-200 dark:border-navy-800">
          <img
            src={article.imageUrl}
            alt={trans?.title}
            className="w-full h-auto max-h-[520px] object-cover"
          />
          {(article.imageCaption || article.imageCredit) && (
            <figcaption className="p-3 text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-navy-900/90 flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-t border-slate-200 dark:border-navy-800">
              <span>{article.imageCaption}</span>
              {article.imageCredit && (
                <span className="font-semibold text-slate-400 shrink-0">
                  Credit: {article.imageCredit}
                </span>
              )}
            </figcaption>
          )}
        </figure>

        {/* Article Intro Ad Placement */}
        <AdBanner placement="article-intro" />

        {/* Full Article Content (17-18px body, 1.6-1.8 line-height) */}
        <div
          className="article-content prose dark:prose-invert max-w-none text-[17px] sm:text-[18px] leading-[1.75] text-navy-950 dark:text-slate-100 font-sans space-y-6"
          dangerouslySetInnerHTML={{ __html: trans?.content || '<p>Content preview not available.</p>' }}
        ></div>

        {/* Middle Article Ad Placement */}
        <AdBanner placement="article-mid" />

        {/* Tags */}
        {article.tags && article.tags.length > 0 && (
          <div className="mt-8 pt-6 border-t border-slate-200 dark:border-navy-800 flex flex-wrap items-center gap-2">
            <Tag className="w-4 h-4 text-slate-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Tags:
            </span>
            {article.tags.map((tag) => (
              <Link
                key={tag}
                to={`/${activeLang}/search?q=${encodeURIComponent(tag)}`}
                className="px-3 py-1 bg-slate-100 dark:bg-navy-900 hover:bg-slate-200 dark:hover:bg-navy-800 text-xs font-medium text-slate-700 dark:text-slate-300 rounded-full transition"
              >
                #{tag}
              </Link>
            ))}
          </div>
        )}

        {/* Source / Attribution Link */}
        {article.sourceUrl && (
          <div className="mt-4 p-4 rounded-xl bg-slate-50 dark:bg-navy-900 border border-slate-200 dark:border-navy-800 text-xs flex items-center justify-between">
            <div>
              <span className="font-bold text-slate-700 dark:text-slate-300">
                {t.sourceCredit}:
              </span>{' '}
              <span className="text-slate-500">{article.sourceUrl}</span>
            </div>
            <a
              href={article.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-brand-600 dark:text-brand-400 font-bold hover:underline"
            >
              <span>Visit Official Source</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        )}

        {/* Share Story (Bottom) */}
        <div className="my-8 p-6 rounded-xl bg-slate-50 dark:bg-navy-900 border border-slate-200 dark:border-navy-800 text-center space-y-3">
          <h3 className="font-headline font-bold text-base text-navy-950 dark:text-white">
            {t.shareStory}
          </h3>
          <div className="flex justify-center">
            <ShareButtons title={trans?.title || 'NEWSORA News'} url={currentUrl} />
          </div>
        </div>

        {/* Bottom Ad Placement */}
        <AdBanner placement="article-bottom" />

        {/* Related Articles Section */}
        {relatedArticles.length > 0 && (
          <section className="mt-12 pt-8 border-t border-slate-200 dark:border-navy-800">
            <h2 className="font-headline font-bold text-xl sm:text-2xl text-navy-950 dark:text-white mb-6">
              {t.relatedArticles}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {relatedArticles.map((rel) => (
                <NewsCard key={rel.id} article={rel} variant="grid" />
              ))}
            </div>
          </section>
        )}
      </article>
    </div>
  );
};
