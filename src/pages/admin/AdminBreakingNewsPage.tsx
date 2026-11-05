import React, { useEffect, useState } from 'react';
import {
  Flame,
  PlusCircle,
  Edit2,
  Trash2,
  CheckCircle,
  X,
  ExternalLink
} from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { AdminCard } from '../../components/admin/AdminCard';
import {
  getAllBreakingNews,
  saveBreakingNews,
  deleteBreakingNews
} from '../../services/breakingNewsService';
import { getAllArticlesForAdmin } from '../../services/articleService';
import { BreakingNewsItem, Article } from '../../types';

export const AdminBreakingNewsPage: React.FC = () => {
  const [items, setItems] = useState<BreakingNewsItem[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<Partial<BreakingNewsItem> | null>(null);

  const loadData = async () => {
    setLoading(true);
    const [news, arts] = await Promise.all([
      getAllBreakingNews(),
      getAllArticlesForAdmin()
    ]);
    setItems(news);
    setArticles(arts);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenNew = () => {
    setEditingItem({
      id: `breaking-${Date.now()}`,
      headline: { en: '', hi: '' },
      articleSlug: '',
      isActive: true,
      order: items.length + 1,
      createdAt: new Date().toISOString()
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem || !editingItem.headline?.en) return;

    await saveBreakingNews(editingItem as BreakingNewsItem);
    setEditingItem(null);
    loadData();
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this breaking news alert?')) return;
    await deleteBreakingNews(id);
    loadData();
  };

  const handleToggleActive = async (item: BreakingNewsItem) => {
    const updated = { ...item, isActive: !item.isActive };
    await saveBreakingNews(updated);
    loadData();
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-headline font-black text-2xl sm:text-3xl text-navy-950 dark:text-white">
              Breaking News Ticker Management
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Control the top breaking headline ticker across English and Hindi.
            </p>
          </div>

          <button
            type="button"
            onClick={handleOpenNew}
            className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider transition shadow-sm flex items-center justify-center gap-2 min-h-[44px]"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Breaking Alert</span>
          </button>
        </div>

        <AdminCard
          title="Active & Past Breaking Tickers"
          subtitle={`${items.filter((i) => i.isActive).length} active tickers live on website`}
        >
          {loading ? (
            <div className="space-y-3 p-4 animate-pulse">
              {[1, 2, 3].map((n) => (
                <div key={n} className="h-20 bg-slate-100 dark:bg-navy-800 rounded-lg"></div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {items.map((item) => (
                <div
                  key={item.id}
                  className={`p-4 rounded-xl border transition flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                    item.isActive
                      ? 'bg-red-50/40 dark:bg-red-950/20 border-red-200 dark:border-red-900/40'
                      : 'bg-white dark:bg-navy-900 border-slate-200 dark:border-navy-800 opacity-70'
                  }`}
                >
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          item.isActive
                            ? 'bg-red-600 text-white animate-pulse'
                            : 'bg-slate-300 text-slate-700'
                        }`}
                      >
                        {item.isActive ? 'Active Live' : 'Inactive'}
                      </span>
                      {item.articleSlug && (
                        <span className="text-[11px] text-slate-500 font-mono">
                          Linked slug: /{item.articleSlug}
                        </span>
                      )}
                    </div>

                    <p className="font-headline font-bold text-sm sm:text-base text-navy-950 dark:text-white">
                      {item.headline?.en || 'Untitled'}
                    </p>

                    <div className="text-xs text-slate-500 dark:text-slate-400 space-y-0.5">
                      {item.headline?.hi && <p>हिं: {item.headline.hi}</p>}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    <button
                      type="button"
                      onClick={() => handleToggleActive(item)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition min-h-[36px] ${
                        item.isActive
                          ? 'bg-slate-200 dark:bg-navy-800 text-slate-700 dark:text-slate-300'
                          : 'bg-emerald-600 text-white'
                      }`}
                    >
                      {item.isActive ? 'Disable' : 'Enable'}
                    </button>

                    <button
                      type="button"
                      onClick={() => setEditingItem(item)}
                      className="px-3 py-1.5 rounded-lg bg-white dark:bg-navy-900 border border-slate-300 dark:border-navy-700 hover:border-brand-500 text-xs font-semibold transition min-h-[36px] flex items-center gap-1"
                    >
                      <Edit2 className="w-3.5 h-3.5 text-brand-500" />
                      <span>Edit</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(item.id)}
                      className="p-2 text-slate-400 hover:text-red-500 transition min-w-[36px] min-h-[36px] flex items-center justify-center"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </AdminCard>

        {/* Modal for Add / Edit */}
        {editingItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/70 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white dark:bg-navy-900 rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-navy-800 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-navy-800">
                <h3 className="font-headline font-bold text-base text-navy-950 dark:text-white flex items-center gap-2">
                  <Flame className="w-5 h-5 text-red-500" />
                  <span>Configure Breaking Alert</span>
                </h3>
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 block mb-1">
                    English Headline
                  </label>
                  <input
                    type="text"
                    required
                    value={editingItem.headline?.en || ''}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        headline: { ...editingItem.headline!, en: e.target.value }
                      })
                    }
                    placeholder="Enter urgent headline in English..."
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-navy-950 border border-slate-300 dark:border-navy-700 rounded-lg min-h-[44px]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 block mb-1">
                    Hindi Headline (हिंदी)
                  </label>
                  <input
                    type="text"
                    value={editingItem.headline?.hi || ''}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        headline: { ...editingItem.headline!, hi: e.target.value }
                      })
                    }
                    placeholder="हिंदी में ताज़ा समाचार लिखें..."
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-navy-950 border border-slate-300 dark:border-navy-700 rounded-lg min-h-[44px]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 block mb-1">
                    Link to Article (Optional)
                  </label>
                  <select
                    value={editingItem.articleSlug || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, articleSlug: e.target.value })}
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-navy-950 border border-slate-300 dark:border-navy-700 rounded-lg min-h-[44px]"
                  >
                    <option value="">No linked article (ticker text only)</option>
                    {articles.map((a) => {
                      const t = a.translations?.en?.title || a.id;
                      const s = a.translations?.en?.slug || a.id;
                      return (
                        <option key={a.id} value={s}>
                          {t.substring(0, 70)}...
                        </option>
                      );
                    })}
                  </select>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="tickerActive"
                    checked={!!editingItem.isActive}
                    onChange={(e) => setEditingItem({ ...editingItem, isActive: e.target.checked })}
                    className="w-4 h-4 text-brand-500 rounded"
                  />
                  <label htmlFor="tickerActive" className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Enable and display in top breaking ticker
                  </label>
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-navy-800">
                  <button
                    type="button"
                    onClick={() => setEditingItem(null)}
                    className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 min-h-[44px]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-sm transition min-h-[44px]"
                  >
                    Save Breaking Alert
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};
