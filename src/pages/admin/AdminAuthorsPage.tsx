import React, { useEffect, useState, useRef } from 'react';
import { Users, PlusCircle, Edit2, Trash2, Mail, Upload, X } from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { AdminCard } from '../../components/admin/AdminCard';
import { getAuthors, saveAuthor, deleteAuthor } from '../../services/authorService';
import { uploadImageWithProgress, validateImageFile } from '../../services/storageService';
import { Author } from '../../types';

export const AdminAuthorsPage: React.FC = () => {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingAuthor, setEditingAuthor] = useState<Partial<Author> | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);

  const loadAuthors = async () => {
    setLoading(true);
    const data = await getAuthors();
    setAuthors(data);
    setLoading(false);
  };

  useEffect(() => {
    loadAuthors();
  }, []);

  const handleOpenNew = () => {
    setEditingAuthor({
      id: `author-${Date.now()}`,
      name: '',
      role: 'Staff Correspondent',
      bio: '',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      email: ''
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAuthor || !editingAuthor.name) return;

    await saveAuthor(editingAuthor as Author);
    setEditingAuthor(null);
    loadAuthors();
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this author profile?')) return;
    await deleteAuthor(id);
    loadAuthors();
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validateImageFile(file);
    if (!validation.valid) {
      alert(validation.error);
      return;
    }

    setUploadProgress(10);
    try {
      const url = await uploadImageWithProgress(file, 'authors/avatars', (pct) => {
        setUploadProgress(pct);
      });
      setEditingAuthor((prev) => ({ ...prev, avatarUrl: url }));
      setUploadProgress(null);
    } catch (err: any) {
      alert(err.message || 'Avatar upload failed');
      setUploadProgress(null);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-headline font-black text-2xl sm:text-3xl text-navy-950 dark:text-white">
              Authors & Correspondents
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Manage editorial staff, bureau chiefs, and contributing journalists.
            </p>
          </div>

          <button
            type="button"
            onClick={handleOpenNew}
            className="px-4 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs uppercase tracking-wider transition shadow-sm flex items-center justify-center gap-2 min-h-[44px]"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Correspondent</span>
          </button>
        </div>

        <AdminCard title="Editorial Roster" subtitle={`${authors.length} journalists active`}>
          {loading ? (
            <div className="space-y-3 p-4 animate-pulse">
              {[1, 2, 3].map((n) => (
                <div key={n} className="h-20 bg-slate-100 dark:bg-navy-800 rounded-lg"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {authors.map((author) => (
                <div
                  key={author.id}
                  className="p-4 rounded-xl border border-slate-200 dark:border-navy-800 bg-slate-50/50 dark:bg-navy-950/40 hover:bg-slate-100 dark:hover:bg-navy-800 transition flex items-start gap-4"
                >
                  <img
                    src={author.avatarUrl}
                    alt={author.name}
                    className="w-14 h-14 rounded-full object-cover shrink-0 border border-slate-300 dark:border-navy-700 bg-slate-200"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-headline font-bold text-base text-navy-950 dark:text-white truncate">
                      {author.name}
                    </h3>
                    <p className="text-xs font-semibold text-brand-600 dark:text-brand-400">
                      {author.role}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">
                      {author.bio}
                    </p>
                    {author.email && (
                      <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        {author.email}
                      </p>
                    )}

                    <div className="flex items-center gap-2 mt-3 pt-2 border-t border-slate-100 dark:border-navy-800">
                      <button
                        type="button"
                        onClick={() => setEditingAuthor(author)}
                        className="px-3 py-1 bg-white dark:bg-navy-900 border border-slate-300 dark:border-navy-700 rounded-md text-xs font-semibold hover:border-brand-500 transition min-h-[36px] flex items-center gap-1"
                      >
                        <Edit2 className="w-3 h-3 text-brand-500" />
                        <span>Edit</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(author.id)}
                        className="p-1.5 text-slate-400 hover:text-red-500 transition min-w-[36px] min-h-[36px] flex items-center justify-center"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </AdminCard>

        {/* Edit / New Author Modal */}
        {editingAuthor && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/70 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white dark:bg-navy-900 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-navy-800 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-navy-800">
                <h3 className="font-headline font-bold text-base text-navy-950 dark:text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-brand-500" />
                  <span>Author Profile</span>
                </h3>
                <button
                  type="button"
                  onClick={() => setEditingAuthor(null)}
                  className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 block mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={editingAuthor.name || ''}
                    onChange={(e) => setEditingAuthor({ ...editingAuthor, name: e.target.value })}
                    placeholder="e.g. Vikram Joshi"
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-navy-950 border border-slate-300 dark:border-navy-700 rounded-lg min-h-[44px]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 block mb-1">
                    Designation / Beat Role
                  </label>
                  <input
                    type="text"
                    required
                    value={editingAuthor.role || ''}
                    onChange={(e) => setEditingAuthor({ ...editingAuthor, role: e.target.value })}
                    placeholder="e.g. Senior Bureau Chief"
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-navy-950 border border-slate-300 dark:border-navy-700 rounded-lg min-h-[44px]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 block mb-1">
                    Short Bio
                  </label>
                  <textarea
                    rows={2}
                    value={editingAuthor.bio || ''}
                    onChange={(e) => setEditingAuthor({ ...editingAuthor, bio: e.target.value })}
                    placeholder="Journalistic background, areas of expertise..."
                    className="w-full p-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-navy-950 border border-slate-300 dark:border-navy-700 rounded-lg"
                  ></textarea>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 block mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={editingAuthor.email || ''}
                    onChange={(e) => setEditingAuthor({ ...editingAuthor, email: e.target.value })}
                    placeholder="vikram@newsora.in"
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-navy-950 border border-slate-300 dark:border-navy-700 rounded-lg min-h-[44px]"
                  />
                </div>

                {/* Avatar */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 block mb-1">
                    Avatar Image
                  </label>
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="hidden"
                  />
                  <div className="flex items-center gap-3">
                    <img
                      src={editingAuthor.avatarUrl}
                      alt=""
                      className="w-12 h-12 rounded-full object-cover border border-slate-300 shrink-0"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="py-2 px-3 border border-slate-300 dark:border-navy-700 rounded-lg text-xs font-semibold hover:bg-slate-100 flex items-center gap-1.5 min-h-[44px]"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload Avatar</span>
                    </button>
                  </div>
                  {uploadProgress !== null && (
                    <span className="text-[11px] text-brand-500 mt-1 block">
                      Uploading: {uploadProgress}%
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-navy-800">
                  <button
                    type="button"
                    onClick={() => setEditingAuthor(null)}
                    className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 min-h-[44px]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-lg bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold shadow-sm transition min-h-[44px]"
                  >
                    Save Profile
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
