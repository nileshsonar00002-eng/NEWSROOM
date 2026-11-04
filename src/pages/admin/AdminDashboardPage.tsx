import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  FileEdit,
  FolderTree,
  Eye,
  PlusCircle,
  TrendingUp,
  Clock,
  ArrowUpRight,
  Flame,
  CheckCircle,
  Sparkles
} from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { AdminCard } from '../../components/admin/AdminCard';
import { getAllArticlesForAdmin } from '../../services/articleService';
import { getCategories } from '../../services/categoryService';
import { getAnalyticsSummary, AnalyticsSummary } from '../../services/analyticsService';
import { Article, Category } from '../../types';

export const AdminDashboardPage: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = () => {
      Promise.all([
        getAllArticlesForAdmin(),
        getCategories(),
        getAnalyticsSummary()
      ]).then(([arts, cats, ana]) => {
        setArticles(arts);
        setCategories(cats);
        setAnalytics(ana);
        setLoading(false);
      });
    };

    loadDashboard();

    window.addEventListener('newsora_articles_updated', loadDashboard);
    window.addEventListener('newsora_categories_updated', loadDashboard);
    window.addEventListener('storage', loadDashboard);

    return () => {
      window.removeEventListener('newsora_articles_updated', loadDashboard);
      window.removeEventListener('newsora_categories_updated', loadDashboard);
      window.removeEventListener('storage', loadDashboard);
    };
  }, []);

  const totalPublished = articles.filter(
    (a) =>
      a.translations?.en?.status === 'published' ||
      a.translations?.hi?.status === 'published' ||
      a.translations?.mr?.status === 'published'
  ).length;

  const totalDrafts = articles.filter(
    (a) =>
      a.translations?.en?.status === 'draft' ||
      a.translations?.hi?.status === 'draft' ||
      a.translations?.mr?.status === 'draft'
  ).length;

  const totalViews = articles.reduce((sum, a) => sum + (a.viewCount || 0), 0) + (analytics?.totalViews || 14280);

  const recentArticles = articles.slice(0, 5);

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Welcome & Quick Action Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-navy-900 to-navy-950 p-6 rounded-2xl text-white shadow-sm">
          <div>
            <h1 className="font-headline font-black text-2xl sm:text-3xl tracking-tight">
              Newsroom Command Studio
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Publish news across English, Hindi, and Marathi with full editorial control.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/admin/articles/new"
              className="px-4 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs uppercase tracking-wider transition shadow-md flex items-center gap-2 min-h-[44px]"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Write Article</span>
            </Link>
          </div>
        </div>

        {/* Metric Cards (Touch-friendly responsive grid) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <AdminCard className="border-l-4 border-l-brand-500">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Published
              </span>
              <FileText className="w-4 h-4 text-brand-500" />
            </div>
            <div className="font-headline font-black text-2xl sm:text-3xl text-navy-950 dark:text-white mt-2">
              {loading ? '...' : totalPublished}
            </div>
            <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1 flex items-center gap-1">
              <CheckCircle className="w-3 h-3" />
              Live across portals
            </div>
          </AdminCard>

          <AdminCard className="border-l-4 border-l-amber-500">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Drafts
              </span>
              <FileEdit className="w-4 h-4 text-amber-500" />
            </div>
            <div className="font-headline font-black text-2xl sm:text-3xl text-navy-950 dark:text-white mt-2">
              {loading ? '...' : totalDrafts}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              In editorial review
            </div>
          </AdminCard>

          <AdminCard className="border-l-4 border-l-blue-500">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Categories
              </span>
              <FolderTree className="w-4 h-4 text-blue-500" />
            </div>
            <div className="font-headline font-black text-2xl sm:text-3xl text-navy-950 dark:text-white mt-2">
              {loading ? '...' : categories.length}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              Active beats
            </div>
          </AdminCard>

          <AdminCard className="border-l-4 border-l-emerald-500">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Total Views
              </span>
              <Eye className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="font-headline font-black text-2xl sm:text-3xl text-navy-950 dark:text-white mt-2">
              {loading ? '...' : totalViews.toLocaleString()}
            </div>
            <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              +14% this week
            </div>
          </AdminCard>
        </div>

        {/* Recently Published Articles & Activity (Mobile Card View - No Wide Tables) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Recent Articles List (2 Columns) */}
          <div className="lg:col-span-2 space-y-4">
            <AdminCard
              title="Recently Managed Articles"
              subtitle="Latest editorial updates and translation statuses"
              action={
                <Link
                  to="/admin/articles"
                  className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
                >
                  <span>View All Articles</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              }
            >
              <div className="space-y-3">
                {recentArticles.map((art) => {
                  const title =
                    art.translations?.en?.title ||
                    art.translations?.hi?.title ||
                    art.translations?.mr?.title ||
                    'Untitled Article';

                  return (
                    <div
                      key={art.id}
                      className="p-3 rounded-xl border border-slate-100 dark:border-navy-800 bg-slate-50/50 dark:bg-navy-950/40 hover:bg-slate-100 dark:hover:bg-navy-800 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="flex items-start gap-3 min-w-0">
                        <img
                          src={art.imageUrl}
                          alt=""
                          className="w-12 h-12 rounded-lg object-cover shrink-0 bg-slate-200"
                        />
                        <div className="min-w-0">
                          <h4 className="font-headline font-bold text-xs sm:text-sm text-navy-950 dark:text-white truncate">
                            {title}
                          </h4>
                          <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-1">
                            <span className="uppercase font-semibold text-brand-600 dark:text-brand-400">
                              {art.categoryId}
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Eye className="w-3 h-3" />
                              {art.viewCount || 0}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Language Status Badges */}
                      <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                        {(['en', 'hi', 'mr'] as const).map((lng) => {
                          const isPub = art.translations?.[lng]?.status === 'published';
                          return (
                            <span
                              key={lng}
                              className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                isPub
                                  ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                                  : 'bg-slate-200 dark:bg-navy-800 text-slate-500'
                              }`}
                              title={`${lng.toUpperCase()}: ${isPub ? 'Published' : 'Draft'}`}
                            >
                              {lng}
                            </span>
                          );
                        })}

                        <Link
                          to={`/admin/articles/edit/${art.id}`}
                          className="ml-2 px-2.5 py-1 bg-white dark:bg-navy-900 border border-slate-300 dark:border-navy-700 text-xs font-semibold rounded-lg hover:border-brand-500 min-h-[36px] flex items-center"
                        >
                          Edit
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            </AdminCard>
          </div>

          {/* Right: Quick Tools & Category Performance */}
          <div className="space-y-4">
            <AdminCard title="Quick Management">
              <div className="space-y-2">
                <Link
                  to="/admin/breaking-news"
                  className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-navy-800 hover:border-brand-500 text-xs font-semibold transition min-h-[44px]"
                >
                  <div className="flex items-center gap-2">
                    <Flame className="w-4 h-4 text-red-500" />
                    <span>Manage Breaking Ticker</span>
                  </div>
                  <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
                </Link>

                <Link
                  to="/admin/categories"
                  className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-navy-800 hover:border-brand-500 text-xs font-semibold transition min-h-[44px]"
                >
                  <div className="flex items-center gap-2">
                    <FolderTree className="w-4 h-4 text-blue-500" />
                    <span>Reorder & Add Categories</span>
                  </div>
                  <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
                </Link>

                <Link
                  to="/admin/settings"
                  className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-navy-800 hover:border-brand-500 text-xs font-semibold transition min-h-[44px]"
                >
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span>AdSense & Site Settings</span>
                  </div>
                  <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
                </Link>
              </div>
            </AdminCard>

            {/* Category Performance Breakdown */}
            <AdminCard title="Category Engagement">
              <div className="space-y-2 text-xs">
                {Object.entries(analytics?.categoryPerformance || {}).map(([cat, cnt]) => (
                  <div key={cat} className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-navy-800 last:border-0">
                    <span className="font-semibold uppercase text-slate-600 dark:text-slate-300">
                      {cat}
                    </span>
                    <span className="font-mono text-slate-500">
                      {cnt.toLocaleString()} views
                    </span>
                  </div>
                ))}
              </div>
            </AdminCard>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};
