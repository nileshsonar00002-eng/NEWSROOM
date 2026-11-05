import React, { useEffect, useState } from 'react';
import { Rss, Copy, Check, ExternalLink } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { getArticles } from '../services/articleService';
import { Article } from '../types';
import { SEOHead } from '../components/common/SEOHead';
import { CategoryBar } from '../components/common/CategoryBar';

export const RssFeedPage: React.FC = () => {
  const { language, t } = useLanguage();
  const [articles, setArticles] = useState<Article[]>([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    getArticles({ lang: language, limitCount: 20 }).then(setArticles);
  }, [language]);

  const rssFeedUrl = `https://newsora.in/${language}/rss.xml`;

  // Generate XML string representation
  const generateRssXml = () => {
    const itemsXml = articles
      .map((a) => {
        const trans = a.translations?.[language] || a.translations?.en;
        return `    <item>
      <title><![CDATA[${trans?.title || ''}]]></title>
      <link>https://newsora.in/${language}/news/${trans?.slug || a.id}</link>
      <guid isPermaLink="true">https://newsora.in/${language}/news/${trans?.slug || a.id}</guid>
      <pubDate>${new Date(trans?.publishedAt || a.createdAt).toUTCString()}</pubDate>
      <description><![CDATA[${trans?.description || ''}]]></description>
      <category>${a.categoryId}</category>
    </item>`;
      })
      .join('\n');

    return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>NEWSORA • News That Moves You (${language.toUpperCase()})</title>
    <link>https://newsora.in/${language}</link>
    <description>Verified, in-depth digital news publication in English and Hindi.</description>
    <language>${language}</language>
    <atom:link href="${rssFeedUrl}" rel="self" type="application/rss+xml" />
${itemsXml}
  </channel>
</rss>`;
  };

  const xmlContent = generateRssXml();

  const handleCopyXml = () => {
    navigator.clipboard.writeText(xmlContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-navy-950 text-navy-900 dark:text-slate-100 transition-colors pb-16">
      <SEOHead
        title="RSS Feeds & Syndication"
        description="Subscribe to NEWSORA RSS 2.0 Feeds in English and Hindi for live headline delivery to RSS readers."
      />

      <CategoryBar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-200 dark:border-navy-800">
          <div className="w-10 h-10 rounded-xl bg-brand-500/10 text-brand-500 flex items-center justify-center">
            <Rss className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-headline font-black text-2xl sm:text-3xl text-navy-950 dark:text-white">
              NEWSORA RSS Feeds & Syndication
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Standard RSS 2.0 formatted XML feed for news readers, aggregators, and automated syndication.
            </p>
          </div>
        </div>

        {/* Feed URL Options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { lang: 'en', label: 'English Feed', url: 'https://newsora.in/en/rss.xml' },
            { lang: 'hi', label: 'Hindi Feed (हिंदी)', url: 'https://newsora.in/hi/rss.xml' }
          ].map((item) => (
            <div
              key={item.lang}
              className={`p-4 rounded-xl border transition ${
                language === item.lang
                  ? 'bg-brand-50/50 dark:bg-navy-900 border-brand-500'
                  : 'bg-white dark:bg-navy-900 border-slate-200 dark:border-navy-800'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-headline font-bold text-sm text-navy-950 dark:text-white">
                  {item.label}
                </span>
                <Rss className="w-4 h-4 text-brand-500" />
              </div>
              <div className="font-mono text-xs text-slate-500 dark:text-slate-400 break-all select-all">
                {item.url}
              </div>
            </div>
          ))}
        </div>

        {/* Live Feed Output Box */}
        <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 rounded-xl overflow-hidden shadow-sm">
          <div className="p-4 bg-slate-50 dark:bg-navy-850 border-b border-slate-200 dark:border-navy-800 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Live XML Feed Preview ({language.toUpperCase()})
            </span>
            <button
              type="button"
              onClick={handleCopyXml}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-700 hover:bg-slate-100 transition min-h-[36px]"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Copied XML</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy XML</span>
                </>
              )}
            </button>
          </div>
          <pre className="p-4 text-xs font-mono text-slate-700 dark:text-slate-300 overflow-x-auto max-h-96 bg-slate-50/50 dark:bg-navy-950/50">
            {xmlContent}
          </pre>
        </div>
      </main>
    </div>
  );
};
