import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  PlusCircle,
  Search,
  Filter,
  Eye,
  Edit3,
  Trash2,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Globe,
  ExternalLink
} from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { AdminCard } from '../../components/admin/AdminCard';
import {
  getAllArticlesForAdmin,
  deleteArticle,
  toggleLanguagePublishStatus
} from '../../services/articleService';
import { getCategories } from '../../services/categoryService';
import { Article, Category, Language, ArticleStatus } from '../../types';

export const AdminArticlesListPage: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [langFilter, setLangFilter] = useState<Language | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');

  // Deletion modal
  const [deleteTarget, setDeleteTarget] = useState<Article | null>(null);

  const loadData = async () => {
    setLoading(true);
    const [arts, cats] = await Promise.all([
      getAllArticlesForAdmin(),
      getCategories()
    ]);
    setArticles(arts);
    setCategories(cats);
    setLoading(false);
  };

  useEffect(() => {
    loadData();

    const handleUpdate = () => {
      loadData();
    };

    window.addEventListener('newsora_articles_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      window.removeEventListener('newsora_articles_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await deleteArticle(deleteTarget.id);
    setDeleteTarget(null);
    loadData();
  };

  const handleToggleStatus = async (
    articleId: string,
    lang: Language,
    currentStatus: ArticleStatus
  ) => {
    const nextStatus = currentStatus === 'published' ? 'draft' : 'published';
    await toggleLanguagePublishStatus(articleId, lang, nextStatus);
    loadData();
  };

  // Filter logic
  const filtered = articles.filter((art) => {
    if (categoryFilter !== 'all' && art.categoryId !== categoryFilter) return false;

    if (langFilter !== 'all') {
      const trans = art.translations?.[langFilter];
      if (!trans || !trans.title) return false;
      if (statusFilter !== 'all' && trans.status !== statusFilter) return false;
    } else if (statusFilter !== 'all') {
      const hasStatus =
        art.translations?.en?.status === statusFilter ||
        art.translations?.hi?.status === statusFilter ||
        art.translations?.mr?.status === statusFilter;
      if (!hasStatus) return false;
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      const matchEn = art.translations?.en?.title?.toLowerCase().includes(q);
      const matchHi = art.translations?.hi?.title?.toLowerCase().includes(q);
      const matchMr = art.translations?.mr?.title?.toLowerCase().includes(q);
      const matchTag = art.tags?.some((t) => t.toLowerCase().includes(q));
      if (!matchEn && !matchHi && !matchMr && !matchTag) return false;
    }

    return true;
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-headline font-black text-2xl sm:text-3xl text-navy-950 dark:text-white">
              Article Management
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Manage stories across English, Hindi, and Marathi with independent draft & publishing control.
            </p>
          </div>

          <Link
            to="/admin/articles/new"
            className="px-4 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs uppercase tracking-wider transition shadow-sm flex items-center justify-center gap-2 min-h-[44px]"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Write New Article</span>
          </Link>
        </div>

        {/* Filter Controls (Responsive & Mobile Ergonomic) */}
        <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 rounded-xl p-4 shadow-sm space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search headlines or tags..."
                className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-navy-950 border border-slate-300 dark:border-navy-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 min-h-[44px]"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5 pointer-events-none" />
            </div>

            {/* Category Filter */}
            <div>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-navy-950 border border-slate-300 dark:border-navy-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 min-h-[44px]"
              >
                <option value="all">All Categories</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.slug}>
                    {c.names?.en || c.id}
                  </option>
                ))}
              </select>
            </div>

            {/* Language Filter */}
            <div>
              <select
                value={langFilter}
                onChange={(e) => setLangFilter(e.target.value as any)}
                className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-navy-950 border border-slate-300 dark:border-navy-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 min-h-[44px]"
              >
                <option value="all">All Languages</option>
                <option value="en">English (en)</option>
                <option value="hi">Hindi (hi)</option>
                <option value="mr">Marathi (mr)</option>
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-navy-950 border border-slate-300 dark:border-navy-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 min-h-[44px]"
              >
                <option value="all">All Statuses</option>
                <option value="published">Published</option>
                <option value="draft">Drafts</option>
              </select>
            </div>
          </div>
        </div>

        {/* Article Cards (No wide tables! Full mobile responsiveness) */}
        {loading ? (
          <div className="space-y-4 animate-pulse">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="h-32 bg-slate-200 dark:bg-navy-900 rounded-xl"></div>
            ))}
          </div>
        ) : filtered.length > 0 ? (
          <div className="space-y-4">
            {filtered.map((art) => {
              const enTitle = art.translations?.en?.title;
              const hiTitle = art.translations?.hi?.title;
              const mrTitle = art.translations?.mr?.title;
              const primaryTitle = enTitle || hiTitle || mrTitle || 'Untitled Article';

              return (
                <div
                  key={art.id}
                  className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 rounded-xl p-4 sm:p-5 shadow-sm space-y-4 hover:border-slate-300 dark:hover:border-navy-700 transition"
                >
                  {/* Top: Image + Info */}
                  <div className="flex flex-col sm:flex-row items-start gap-4">
                    <img
                      src={art.imageUrl}
                      alt=""
                      className="w-full sm:w-36 h-36 sm:h-24 rounded-lg object-cover bg-slate-100 dark:bg-navy-950 shrink-0"
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-brand-500/10 text-brand-600 dark:text-brand-400">
                          {art.categoryId}
                        </span>
                        {art.isFeatured && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-500/10 text-amber-600">
                            Featured
                          </span>
                        )}
                        {art.isBreaking && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-red-500/10 text-red-600">
                            Breaking
                          </span>
                        )}
                        {art.isTrending && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-purple-500/10 text-purple-600">
                            Trending
                          </span>
                        )}
                        <span className="text-[11px] text-slate-400 ml-auto">
                          ID: {art.id}
                        </span>
                      </div>

                      <h3 className="font-headline font-bold text-base sm:text-lg text-navy-950 dark:text-white leading-snug">
                        {primaryTitle}
                      </h3>

                      <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-2">
                        <span className="flex items-center gap-1">
                          <Eye className="w-3.5 h-3.5" />
                          {art.viewCount || 0} views
                        </span>
                        <span>•</span>
                        <span>{new Date(art.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Middle: Per-Language Status Chips & Quick Publish Toggles */}
                  <div className="p-3 bg-slate-50 dark:bg-navy-950/60 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-slate-100 dark:border-navy-800">
                    <div className="text-xs font-bold uppercase text-slate-400 tracking-wider">
                      Language Editions:
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      {(['en', 'hi', 'mr'] as Language[]).map((lng) => {
                        const tr = art.translations?.[lng];
                        const hasContent = !!tr?.title;
                        const isPublished = tr?.status === 'published';

                        return (
                          <div
                            key={lng}
                            className="flex items-center gap-2 p-1.5 rounded-md bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800"
                          >
                            <span className="text-xs font-bold uppercase w-6 text-center">
                              {lng}
                            </span>

                            {hasContent ? (
                              <button
                                type="button"
                                onClick={() => handleToggleStatus(art.id, lng, tr.status)}
                                className={`px-2 py-1 rounded text-[11px] font-semibold transition min-h-[32px] flex items-center gap-1 ${
                                  isPublished
                                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                    : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                                }`}
                                title="Click to toggle between Published and Draft"
                              >
                                {isPublished ? (
                                  <>
                                    <CheckCircle2 className="w-3 h-3" />
                                    <span>Published</span>
                                  </>
                                ) : (
                                  <>
                                    <Clock className="w-3 h-3" />
                                    <span>Draft</span>
                                  </>
                                )}
                              </button>
                            ) : (
                              <span className="text-[11px] text-slate-400 px-2 py-1">
                                Empty
                              </span>
                            )}

                            {hasContent && tr.slug && (
                              <Link
                                to={`/${lng}/news/${tr.slug}`}
                                target="_blank"
                                rel="noreferrer"
                                className="p-1 text-slate-400 hover:text-brand-500"
                                title="Preview this edition"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                              </Link>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Actions Bar (Min 44px Touch Targets) */}
                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-navy-800">
                    <Link
                      to={`/admin/articles/edit/${art.id}`}
                      className="px-4 py-2 rounded-lg bg-slate-100 dark:bg-navy-800 hover:bg-slate-200 dark:hover:bg-navy-700 text-xs font-bold text-navy-950 dark:text-white transition flex items-center gap-1.5 min-h-[44px]"
                    >
                      <Edit3 className="w-4 h-4 text-brand-500" />
                      <span>Edit & Translate</span>
                    </Link>

                    <button
                      type="button"
                      onClick={() => setDeleteTarget(art)}
                      className="px-3 py-2 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 text-xs font-bold transition flex items-center gap-1.5 min-h-[44px]"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 bg-white dark:bg-navy-900 rounded-xl border border-slate-200 dark:border-navy-800 text-slate-500 space-y-3">
            <p className="text-base font-semibold">No articles match your filter criteria.</p>
            <button
              type="button"
              onClick={() => {
                setSearch('');
                setCategoryFilter('all');
                setLangFilter('all');
                setStatusFilter('all');
              }}
              className="px-4 py-2 bg-slate-100 dark:bg-navy-800 text-xs font-semibold rounded-lg"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteTarget && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/70 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white dark:bg-navy-900 rounded-xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 dark:border-navy-800 space-y-4">
              <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-950/40 text-red-600 flex items-center justify-center mx-auto">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div className="text-center">
                <h3 className="font-headline font-bold text-lg text-navy-950 dark:text-white">
                  Confirm Article Deletion
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Are you sure you want to permanently delete this article across English, Hindi, and Marathi? This action cannot be undone.
                </p>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setDeleteTarget(null)}
                  className="flex-1 py-2.5 rounded-lg border border-slate-300 dark:border-navy-700 text-xs font-semibold hover:bg-slate-100 min-h-[44px]"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  className="flex-1 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-sm min-h-[44px]"
                >
                  Delete Permanently
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};
