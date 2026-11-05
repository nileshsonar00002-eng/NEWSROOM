import React, { useEffect, useState } from 'react';
import {
  FolderTree,
  PlusCircle,
  Edit2,
  Trash2,
  ArrowUp,
  ArrowDown,
  CheckCircle,
  AlertCircle,
  X
} from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { AdminCard } from '../../components/admin/AdminCard';
import {
  getCategories,
  saveCategory,
  deleteCategory,
  DEFAULT_CATEGORIES
} from '../../services/categoryService';
import { Category } from '../../types';

export const AdminCategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCategory, setEditingCategory] = useState<Partial<Category> | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);

  const loadCategories = async () => {
    setLoading(true);
    const cats = await getCategories();
    setCategories(cats);
    setLoading(false);
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleOpenNew = () => {
    setEditingCategory({
      id: `cat-${Date.now()}`,
      slug: '',
      order: categories.length + 1,
      names: { en: '', hi: '' },
      isActive: true
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory || !editingCategory.slug || !editingCategory.names?.en) return;

    await saveCategory(editingCategory as Category);
    setEditingCategory(null);
    loadCategories();
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await deleteCategory(deleteTarget.id);
    setDeleteTarget(null);
    loadCategories();
  };

  const handleMoveOrder = async (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === categories.length - 1) return;

    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    const reordered = [...categories];
    const temp = reordered[index];
    reordered[index] = reordered[targetIdx];
    reordered[targetIdx] = temp;

    // Update orders
    for (let i = 0; i < reordered.length; i++) {
      reordered[i].order = i + 1;
      await saveCategory(reordered[i]);
    }

    setCategories(reordered);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-headline font-black text-2xl sm:text-3xl text-navy-950 dark:text-white">
              Category Management
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Add, rename, reorder, and configure multilingual beats across the platform.
            </p>
          </div>

          <button
            type="button"
            onClick={handleOpenNew}
            className="px-4 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs uppercase tracking-wider transition shadow-sm flex items-center justify-center gap-2 min-h-[44px]"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add New Category</span>
          </button>
        </div>

        {/* Categories Mobile-Friendly Cards List */}
        <AdminCard title="Active Categories" subtitle={`${categories.length} total news beats`}>
          {loading ? (
            <div className="space-y-3 animate-pulse p-4">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="h-16 bg-slate-100 dark:bg-navy-800 rounded-lg"></div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {categories.map((cat, idx) => (
                <div
                  key={cat.id}
                  className="p-3 sm:p-4 rounded-xl border border-slate-200 dark:border-navy-800 bg-slate-50/50 dark:bg-navy-950/40 hover:bg-slate-100 dark:hover:bg-navy-800 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    {/* Order Badge and controls */}
                    <div className="flex flex-col items-center justify-center gap-1 bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 p-1 rounded-lg shrink-0">
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => handleMoveOrder(idx, 'up')}
                        className="p-1 text-slate-400 hover:text-navy-950 dark:hover:text-white disabled:opacity-30"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                        {cat.order || idx + 1}
                      </span>
                      <button
                        type="button"
                        disabled={idx === categories.length - 1}
                        onClick={() => handleMoveOrder(idx, 'down')}
                        className="p-1 text-slate-400 hover:text-navy-950 dark:hover:text-white disabled:opacity-30"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-headline font-bold text-base text-navy-950 dark:text-white">
                          {cat.names?.en || cat.id}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-200 dark:bg-navy-800 text-slate-600 dark:text-slate-400">
                          /{cat.slug}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-1">
                        <span>हिं: {cat.names?.hi || '—'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button
                      type="button"
                      onClick={() => setEditingCategory(cat)}
                      className="px-3 py-1.5 rounded-lg bg-white dark:bg-navy-900 border border-slate-300 dark:border-navy-700 hover:border-brand-500 text-xs font-semibold text-slate-700 dark:text-slate-200 transition min-h-[36px] flex items-center gap-1.5"
                    >
                      <Edit2 className="w-3.5 h-3.5 text-brand-500" />
                      <span>Edit</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setDeleteTarget(cat)}
                      className="p-2 text-slate-400 hover:text-red-500 transition min-w-[36px] min-h-[36px] flex items-center justify-center"
                      title="Delete category"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </AdminCard>

        {/* Edit / New Modal */}
        {editingCategory && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/70 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white dark:bg-navy-900 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-navy-800 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-navy-800">
                <h3 className="font-headline font-bold text-base text-navy-950 dark:text-white flex items-center gap-2">
                  <FolderTree className="w-5 h-5 text-brand-500" />
                  <span>Configure Category</span>
                </h3>
                <button
                  type="button"
                  onClick={() => setEditingCategory(null)}
                  className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 block mb-1">
                    English Name
                  </label>
                  <input
                    type="text"
                    required
                    value={editingCategory.names?.en || ''}
                    onChange={(e) => {
                      const val = e.target.value;
                      setEditingCategory({
                        ...editingCategory,
                        slug: editingCategory.slug || val.toLowerCase().replace(/\s+/g, '-'),
                        names: { ...editingCategory.names!, en: val }
                      });
                    }}
                    placeholder="e.g. Technology"
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-navy-950 border border-slate-300 dark:border-navy-700 rounded-lg min-h-[44px]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 block mb-1">
                    Hindi Name (हिंदी)
                  </label>
                  <input
                    type="text"
                    value={editingCategory.names?.hi || ''}
                    onChange={(e) =>
                      setEditingCategory({
                        ...editingCategory,
                        names: { ...editingCategory.names!, hi: e.target.value }
                      })
                    }
                    placeholder="उदा. तकनीक व विज्ञान"
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-navy-950 border border-slate-300 dark:border-navy-700 rounded-lg min-h-[44px]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 block mb-1">
                    URL Slug
                  </label>
                  <input
                    type="text"
                    required
                    value={editingCategory.slug || ''}
                    onChange={(e) =>
                      setEditingCategory({
                        ...editingCategory,
                        slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '')
                      })
                    }
                    placeholder="technology"
                    className="w-full px-3 py-2 text-xs sm:text-sm font-mono bg-slate-50 dark:bg-navy-950 border border-slate-300 dark:border-navy-700 rounded-lg min-h-[44px]"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-navy-800">
                  <button
                    type="button"
                    onClick={() => setEditingCategory(null)}
                    className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 min-h-[44px]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-lg bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold shadow-sm transition min-h-[44px]"
                  >
                    Save Category
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Modal */}
        {deleteTarget && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/70 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white dark:bg-navy-900 rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 dark:border-navy-800 space-y-4">
              <div className="text-center">
                <h3 className="font-headline font-bold text-lg text-navy-950 dark:text-white">
                  Delete Category?
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Are you sure you want to remove the category "{deleteTarget.names?.en}"?
                </p>
              </div>
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setDeleteTarget(null)}
                  className="flex-1 py-2.5 rounded-lg border border-slate-300 dark:border-navy-700 text-xs font-semibold min-h-[44px]"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  className="flex-1 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold min-h-[44px]"
                >
                  Confirm Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};
