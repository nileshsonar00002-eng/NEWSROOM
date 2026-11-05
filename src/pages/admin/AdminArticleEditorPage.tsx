import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Save,
  CheckCircle,
  Eye,
  Upload,
  ArrowLeft,
  Sparkles,
  AlertCircle,
  Clock,
  Globe,
  ExternalLink
} from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { AdminCard } from '../../components/admin/AdminCard';
import { RichTextEditor } from '../../components/editor/RichTextEditor';
import {
  getArticleById,
  saveArticle,
  generateSlug,
  checkSlugUnique
} from '../../services/articleService';
import { getCategories } from '../../services/categoryService';
import { getAuthors } from '../../services/authorService';
import { uploadImageWithProgress, validateImageFile } from '../../services/storageService';
import { Article, Category, Author, Language, ArticleStatus } from '../../types';

export const AdminArticleEditorPage: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();

  // Active translation tab
  const [activeTab, setActiveTab] = useState<Language>('en');

  // Metadata
  const [categories, setCategories] = useState<Category[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [liveSlug, setLiveSlug] = useState<string | null>(null);

  // Featured Image Upload State
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageUploadProgress, setImageUploadProgress] = useState<number | null>(null);

  // Article Form State - Defaults to published so updates are immediately visible on the live site
  const [article, setArticle] = useState<Partial<Article>>({
    categoryId: 'india',
    authorId: 'author-1',
    imageUrl:
      'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=1200&q=80',
    imageCaption: '',
    imageCredit: 'NEWSORA Media',
    sourceUrl: '',
    tags: ['News', 'India'],
    isFeatured: false,
    isBreaking: false,
    isTrending: false,
    readingTimeMinutes: 3,
    translations: {
      en: {
        title: '',
        description: '',
        content: '',
        slug: '',
        status: 'published',
        seoTitle: '',
        seoDescription: '',
        publishedAt: new Date().toISOString()
      },
      hi: {
        title: '',
        description: '',
        content: '',
        slug: '',
        status: 'published',
        seoTitle: '',
        seoDescription: '',
        publishedAt: new Date().toISOString()
      }
    }
  });

  const [tagInput, setTagInput] = useState('News, India');

  useEffect(() => {
    Promise.all([getCategories(), getAuthors()]).then(([cats, auths]) => {
      setCategories(cats);
      setAuthors(auths);

      if (id) {
        getArticleById(id).then((existing) => {
          if (existing) {
            setArticle(existing);
            setTagInput(existing.tags ? existing.tags.join(', ') : '');
            const initialSlug = existing.translations?.[activeTab]?.slug || existing.id;
            setLiveSlug(initialSlug);
          }
          setLoading(false);
        });
      } else {
        setLoading(false);
      }
    });
  }, [id]);

  // Language translation update helper
  const updateCurrentTrans = (fields: Partial<Article['translations']['en']>) => {
    setArticle((prev) => ({
      ...prev,
      translations: {
        ...prev.translations!,
        [activeTab]: {
          ...prev.translations![activeTab],
          ...fields
        }
      }
    }));
  };

  const handleTitleChange = (val: string) => {
    const currentSlug = article.translations![activeTab]?.slug;
    const shouldAutoSlug =
      !currentSlug || currentSlug === generateSlug(article.translations![activeTab]?.title || '');
    updateCurrentTrans({
      title: val,
      slug: shouldAutoSlug ? generateSlug(val) : currentSlug,
      seoTitle: val
    });
  };

  const handleAutoSlug = () => {
    const currentTitle = article.translations![activeTab]?.title || 'story';
    updateCurrentTrans({ slug: generateSlug(currentTitle) });
  };

  // Image Upload handler for featured image
  const handleFeaturedImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validateImageFile(file);
    if (!validation.valid) {
      setErrorMsg(validation.error || 'Invalid image file.');
      return;
    }

    setErrorMsg(null);
    setImageUploadProgress(10);

    try {
      const downloadUrl = await uploadImageWithProgress(file, 'articles/featured', (pct) => {
        setImageUploadProgress(pct);
      });
      setArticle((prev) => ({ ...prev, imageUrl: downloadUrl }));
      setImageUploadProgress(null);
      setSuccessMsg('Featured image successfully uploaded!');
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Image upload failed. Please try again.');
      setImageUploadProgress(null);
    }
  };

  // Save / Publish
  const handleSave = async (desiredStatus?: ArticleStatus) => {
    setErrorMsg(null);
    setSuccessMsg(null);

    const trans = article.translations![activeTab];
    if (!trans.title.trim()) {
      setErrorMsg(`Please enter a headline for ${activeTab.toUpperCase()} before saving.`);
      return;
    }

    // Slug duplication check
    const currentSlug = trans.slug.trim() || generateSlug(trans.title);
    const isUnique = await checkSlugUnique(activeTab, currentSlug, id);
    if (!isUnique) {
      setErrorMsg(
        `The slug "${currentSlug}" is already in use for another ${activeTab.toUpperCase()} article. Please choose a unique slug.`
      );
      return;
    }

    setSaving(true);

    try {
      const parsedTags = tagInput
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      const statusToApply: ArticleStatus = desiredStatus || trans.status || 'published';

      const updatedArticle: Partial<Article> = {
        ...article,
        id: id || article.id,
        tags: parsedTags,
        translations: {
          ...article.translations!,
          [activeTab]: {
            ...trans,
            slug: currentSlug,
            status: statusToApply,
            publishedAt:
              statusToApply === 'published'
                ? trans.publishedAt || new Date().toISOString()
                : null
          }
        }
      };

      const savedId = await saveArticle(updatedArticle);
      setArticle((prev) => ({ ...prev, id: savedId }));
      setLiveSlug(currentSlug);
      setSaving(false);

      if (statusToApply === 'published') {
        setSuccessMsg(
          `Article published live to Main Website in ${activeTab.toUpperCase()}! Your updates are now visible to readers.`
        );
      } else {
        setSuccessMsg(`Article saved as draft in ${activeTab.toUpperCase()}!`);
      }

      setTimeout(() => {
        setSuccessMsg(null);
        if (!id) {
          navigate(`/admin/articles/edit/${savedId}`);
        }
      }, 4000);
    } catch (err: any) {
      setSaving(false);
      setErrorMsg(err.message || 'Failed to save article.');
    }
  };

  const currentTrans = article.translations?.[activeTab] || {
    title: '',
    description: '',
    content: '',
    slug: '',
    status: 'published',
    seoTitle: '',
    seoDescription: '',
    publishedAt: null
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-8 text-center text-slate-500 animate-pulse">
          Loading article editor...
        </div>
      </AdminLayout>
    );
  }

  const liveArticleUrl = `/${activeTab}/news/${currentTrans.slug || liveSlug || article.id}`;

  return (
    <AdminLayout>
      <div className="space-y-6 pb-12">
        {/* Top Bar with Navigation & Quick Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-navy-800">
          <div className="flex items-center gap-3">
            <Link
              to="/admin/articles"
              className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-navy-800 transition min-w-[44px] min-h-[44px] flex items-center justify-center"
              title="Return to articles list"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="font-headline font-black text-xl sm:text-2xl text-navy-950 dark:text-white">
                {id ? 'Edit Article' : 'Write New Article'}
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Direct publishing to Main Website for English and Hindi.
              </p>
            </div>
          </div>

          {/* Action Buttons (Save Draft / Publish / View Live) */}
          <div className="flex flex-wrap items-center gap-2">
            {liveSlug && (
              <a
                href={liveArticleUrl}
                target="_blank"
                rel="noreferrer"
                className="px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-navy-700 hover:bg-slate-100 dark:hover:bg-navy-800 text-xs font-bold text-navy-900 dark:text-slate-200 transition flex items-center gap-1.5 min-h-[44px]"
                title="Open live article page on main site"
              >
                <ExternalLink className="w-4 h-4 text-brand-500" />
                <span>View on Live Site</span>
              </a>
            )}

            <button
              type="button"
              disabled={saving}
              onClick={() => handleSave('draft')}
              className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-navy-700 hover:bg-slate-100 dark:hover:bg-navy-800 text-xs font-bold text-navy-950 dark:text-white transition flex items-center gap-2 min-h-[44px]"
            >
              <Save className="w-4 h-4" />
              <span>Save as Draft</span>
            </button>

            <button
              type="button"
              disabled={saving}
              onClick={() => handleSave('published')}
              className="px-5 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 disabled:opacity-50 text-white text-xs font-bold uppercase tracking-wider shadow-md hover:shadow-lg transition flex items-center gap-2 min-h-[44px]"
            >
              <CheckCircle className="w-4 h-4" />
              <span>{saving ? 'Saving...' : '🚀 Save & Publish to Main Site'}</span>
            </button>
          </div>
        </div>

        {/* Feedback Alerts */}
        {errorMsg && (
          <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-xs sm:text-sm text-red-700 dark:text-red-300 flex items-start gap-2 animate-fadeIn">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-red-500" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-700 text-xs sm:text-sm text-emerald-800 dark:text-emerald-200 flex items-center justify-between gap-3 animate-fadeIn">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
              <span className="font-medium">{successMsg}</span>
            </div>
            {liveSlug && (
              <a
                href={liveArticleUrl}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 shrink-0 transition"
              >
                <span>Open Live ↗</span>
              </a>
            )}
          </div>
        )}

        {/* 1. Multilingual Tabs Segmented Bar */}
        <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 rounded-xl p-2 shadow-sm flex items-center justify-between overflow-x-auto no-scrollbar gap-2">
          <div className="flex items-center gap-2">
            {[
              { lang: 'en', label: 'English (EN)', native: 'English' },
              { lang: 'hi', label: 'Hindi (हिंदी)', native: 'हिन्दी' }
            ].map((tab) => {
              const tr = article.translations?.[tab.lang as Language];
              const isPublished = tr?.status === 'published';
              const isFilled = !!tr?.title;
              const isActive = activeTab === tab.lang;

              return (
                <button
                  key={tab.lang}
                  type="button"
                  onClick={() => setActiveTab(tab.lang as Language)}
                  className={`px-4 py-2.5 rounded-lg text-xs font-bold transition flex items-center gap-2 min-h-[44px] ${
                    isActive
                      ? 'bg-navy-950 dark:bg-white text-white dark:text-navy-950 shadow-sm'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-navy-800'
                  }`}
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>{tab.native}</span>
                  <span
                    className={`px-1.5 py-0.5 rounded text-[9px] uppercase font-bold ${
                      isPublished
                        ? 'bg-emerald-500 text-white'
                        : isFilled
                        ? 'bg-amber-500 text-white'
                        : 'bg-slate-400 text-white'
                    }`}
                  >
                    {isPublished ? 'Published' : isFilled ? 'Draft' : 'Empty'}
                  </span>
                </button>
              );
            })}
          </div>

          {currentTrans.slug && (
            <a
              href={`/${activeTab}/news/${currentTrans.slug}`}
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-brand-600 dark:text-brand-400 hover:bg-brand-50 dark:hover:bg-navy-800 transition flex items-center gap-1.5 min-h-[40px] shrink-0"
            >
              <Eye className="w-4 h-4" />
              <span className="hidden sm:inline">Preview Live</span>
            </a>
          )}
        </div>

        {/* 2. Publication Status Selector for Current Language */}
        <div className="p-3.5 bg-slate-100 dark:bg-navy-900 border border-slate-200 dark:border-navy-800 rounded-xl flex flex-wrap items-center justify-between gap-3 shadow-xs">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Publication Status ({activeTab.toUpperCase()}):
            </span>
            <button
              type="button"
              onClick={() => updateCurrentTrans({ status: 'published' })}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition min-h-[38px] ${
                currentTrans.status === 'published'
                  ? 'bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-400'
                  : 'bg-white dark:bg-navy-950 text-slate-600 dark:text-slate-400 border border-slate-300 dark:border-navy-700 hover:bg-slate-50'
              }`}
            >
              <CheckCircle className="w-4 h-4" />
              <span>Published (Live on Main Site)</span>
            </button>
            <button
              type="button"
              onClick={() => updateCurrentTrans({ status: 'draft' })}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition min-h-[38px] ${
                currentTrans.status === 'draft'
                  ? 'bg-amber-600 text-white shadow-sm ring-2 ring-amber-400'
                  : 'bg-white dark:bg-navy-950 text-slate-600 dark:text-slate-400 border border-slate-300 dark:border-navy-700 hover:bg-slate-50'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>Draft (Hidden from Public)</span>
            </button>
          </div>

          <div className="text-[11px] text-slate-500 dark:text-slate-400">
            {currentTrans.status === 'published' ? (
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                ● Live on readers homepage
              </span>
            ) : (
              <span className="text-amber-600 dark:text-amber-400 font-semibold flex items-center gap-1">
                ○ Only visible in Admin
              </span>
            )}
          </div>
        </div>

        {/* 3. Main Editor Layout: Left Column (Language Content) + Right Column (Article Metadata) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT: Language-Specific Title, Lead & Rich Text Body (2 Columns) */}
          <div className="lg:col-span-2 space-y-6">
            <AdminCard
              title={`${activeTab.toUpperCase()} Article Content`}
              subtitle={`Drafting edition for: ${
                activeTab === 'hi' ? 'हिंदी' : 'English'
              }`}
            >
              <div className="space-y-4">
                {/* Headline Input */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 block mb-1">
                    Headline / Title ({activeTab.toUpperCase()}) *
                  </label>
                  <input
                    type="text"
                    required
                    value={currentTrans.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder={`Enter compelling ${activeTab.toUpperCase()} news headline...`}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-navy-950 border border-slate-300 dark:border-navy-700 rounded-xl text-base font-bold text-navy-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 min-h-[48px]"
                  />
                </div>

                {/* Short Description */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 block mb-1">
                    Short Description / Lead Excerpt ({activeTab.toUpperCase()})
                  </label>
                  <textarea
                    rows={3}
                    value={currentTrans.description}
                    onChange={(e) => updateCurrentTrans({ description: e.target.value })}
                    placeholder="Summary sentence appearing on homepage cards and search results..."
                    className="w-full p-3 bg-slate-50 dark:bg-navy-950 border border-slate-300 dark:border-navy-700 rounded-xl text-xs sm:text-sm text-navy-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                  ></textarea>
                </div>

                {/* URL Slug & Auto-Generate */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      URL Slug ({activeTab.toUpperCase()})
                    </label>
                    <button
                      type="button"
                      onClick={handleAutoSlug}
                      className="text-[11px] font-semibold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
                    >
                      <Sparkles className="w-3 h-3" />
                      Auto-generate from title
                    </button>
                  </div>
                  <div className="flex items-center bg-slate-50 dark:bg-navy-950 border border-slate-300 dark:border-navy-700 rounded-xl overflow-hidden min-h-[44px]">
                    <span className="px-3 text-xs text-slate-400 font-mono shrink-0">
                      /{activeTab}/news/
                    </span>
                    <input
                      type="text"
                      value={currentTrans.slug}
                      onChange={(e) => updateCurrentTrans({ slug: e.target.value })}
                      placeholder="custom-article-slug"
                      className="w-full py-2.5 pr-3 bg-transparent text-xs sm:text-sm font-mono text-navy-900 dark:text-white focus:outline-none"
                    />
                  </div>
                </div>

                {/* Rich Text Editor Body */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 block mb-1.5">
                    Full Article Body ({activeTab.toUpperCase()})
                  </label>
                  <RichTextEditor
                    value={currentTrans.content}
                    onChange={(html) => updateCurrentTrans({ content: html })}
                    placeholder={`Write or paste full ${activeTab.toUpperCase()} article content here...`}
                    minHeight="380px"
                  />
                </div>
              </div>
            </AdminCard>

            {/* SEO Optimization Box */}
            <AdminCard
              title={`SEO Metadata (${activeTab.toUpperCase()})`}
              subtitle="Fine-tune how this translation appears in Google and social shares"
            >
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    SEO Meta Title (Recommended: 50-60 characters)
                  </label>
                  <input
                    type="text"
                    value={currentTrans.seoTitle || ''}
                    onChange={(e) => updateCurrentTrans({ seoTitle: e.target.value })}
                    placeholder={currentTrans.title || 'SEO Title...'}
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-navy-950 border border-slate-300 dark:border-navy-700 rounded-lg min-h-[44px]"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    SEO Meta Description (Recommended: 120-155 characters)
                  </label>
                  <textarea
                    rows={2}
                    value={currentTrans.seoDescription || ''}
                    onChange={(e) => updateCurrentTrans({ seoDescription: e.target.value })}
                    placeholder={currentTrans.description || 'SEO Description...'}
                    className="w-full p-3 text-xs sm:text-sm bg-slate-50 dark:bg-navy-950 border border-slate-300 dark:border-navy-700 rounded-lg"
                  ></textarea>
                </div>
              </div>
            </AdminCard>
          </div>

          {/* RIGHT: Common Metadata & Featured Image (1 Column) */}
          <div className="space-y-6">
            {/* Featured Image Management */}
            <AdminCard title="Featured News Image">
              <div className="space-y-3">
                {/* Image Preview */}
                <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-100 dark:bg-navy-950 border border-slate-200 dark:border-navy-800">
                  <img
                    src={article.imageUrl}
                    alt="Featured preview"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Upload Button from Phone / Files */}
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleFeaturedImageUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-3 px-4 border-2 border-dashed border-brand-500/50 hover:border-brand-500 rounded-xl text-xs font-bold text-brand-600 dark:text-brand-400 bg-brand-50/50 dark:bg-brand-950/20 flex items-center justify-center gap-2 transition min-h-[44px]"
                >
                  <Upload className="w-4 h-4" />
                  <span>Upload from Phone Gallery</span>
                </button>

                {imageUploadProgress !== null && (
                  <div className="space-y-1">
                    <div className="h-2 w-full bg-slate-200 dark:bg-navy-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-brand-500 transition-all duration-300"
                        style={{ width: `${imageUploadProgress}%` }}
                      ></div>
                    </div>
                    <span className="text-[10px] text-slate-400 block text-right">
                      Uploading: {imageUploadProgress}%
                    </span>
                  </div>
                )}

                {/* Direct Image URL input */}
                <div>
                  <label className="text-[11px] font-semibold text-slate-500 block mb-1">
                    Or Image URL
                  </label>
                  <input
                    type="url"
                    value={article.imageUrl}
                    onChange={(e) => setArticle({ ...article, imageUrl: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-navy-950 border border-slate-300 dark:border-navy-700 rounded-lg min-h-[44px]"
                  />
                </div>

                {/* Caption & Credit */}
                <div>
                  <label className="text-[11px] font-semibold text-slate-500 block mb-1">
                    Image Caption
                  </label>
                  <input
                    type="text"
                    value={article.imageCaption || ''}
                    onChange={(e) => setArticle({ ...article, imageCaption: e.target.value })}
                    placeholder="Brief description of the photo..."
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-navy-950 border border-slate-300 dark:border-navy-700 rounded-lg min-h-[44px]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-500 block mb-1">
                    Image Credit / Source
                  </label>
                  <input
                    type="text"
                    value={article.imageCredit || ''}
                    onChange={(e) => setArticle({ ...article, imageCredit: e.target.value })}
                    placeholder="e.g. NEWSORA Bureau / PTI"
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-navy-950 border border-slate-300 dark:border-navy-700 rounded-lg min-h-[44px]"
                  />
                </div>
              </div>
            </AdminCard>

            {/* Publishing Settings & Beat */}
            <AdminCard title="Publishing Beat & Author">
              <div className="space-y-4">
                {/* Category Selection */}
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    News Category
                  </label>
                  <select
                    value={article.categoryId}
                    onChange={(e) => setArticle({ ...article, categoryId: e.target.value })}
                    className="w-full px-3 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-navy-950 border border-slate-300 dark:border-navy-700 rounded-xl min-h-[44px]"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.slug}>
                        {c.names?.en || c.id} ({c.names?.hi || ''})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Author Selection */}
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Author / Correspondent
                  </label>
                  <select
                    value={article.authorId}
                    onChange={(e) => setArticle({ ...article, authorId: e.target.value })}
                    className="w-full px-3 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-navy-950 border border-slate-300 dark:border-navy-700 rounded-xl min-h-[44px]"
                  >
                    {authors.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.name} ({a.role})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Tags */}
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Tags (Comma Separated)
                  </label>
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    placeholder="Semiconductor, Technology, India"
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-navy-950 border border-slate-300 dark:border-navy-700 rounded-lg min-h-[44px]"
                  />
                </div>

                {/* Source Reference URL */}
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Source Attribution URL (Optional)
                  </label>
                  <input
                    type="url"
                    value={article.sourceUrl || ''}
                    onChange={(e) => setArticle({ ...article, sourceUrl: e.target.value })}
                    placeholder="https://pib.gov.in/..."
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-navy-950 border border-slate-300 dark:border-navy-700 rounded-lg min-h-[44px]"
                  />
                </div>

                {/* Editorial Toggles */}
                <div className="pt-2 space-y-2 border-t border-slate-100 dark:border-navy-800">
                  <label className="flex items-center gap-2 cursor-pointer py-1">
                    <input
                      type="checkbox"
                      checked={!!article.isFeatured}
                      onChange={(e) => setArticle({ ...article, isFeatured: e.target.checked })}
                      className="w-4 h-4 text-brand-500 rounded border-slate-300 focus:ring-brand-500"
                    />
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Feature on Homepage Top Hero
                    </span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer py-1">
                    <input
                      type="checkbox"
                      checked={!!article.isBreaking}
                      onChange={(e) => setArticle({ ...article, isBreaking: e.target.checked })}
                      className="w-4 h-4 text-brand-500 rounded border-slate-300 focus:ring-brand-500"
                    />
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Mark as Breaking Alert
                    </span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer py-1">
                    <input
                      type="checkbox"
                      checked={!!article.isTrending}
                      onChange={(e) => setArticle({ ...article, isTrending: e.target.checked })}
                      className="w-4 h-4 text-brand-500 rounded border-slate-300 focus:ring-brand-500"
                    />
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Add to Trending Now List
                    </span>
                  </label>
                </div>
              </div>
            </AdminCard>
          </div>
        </div>

        {/* Bottom Save Bar (Ergonomic for Mobile Screens) */}
        <div className="p-4 bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 rounded-xl shadow-md flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-slate-500 dark:text-slate-400">
            Publishing edition for: <strong className="text-navy-950 dark:text-white uppercase">{activeTab}</strong>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={saving}
              onClick={() => handleSave('draft')}
              className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-navy-700 hover:bg-slate-100 dark:hover:bg-navy-800 text-xs font-bold text-navy-950 dark:text-white transition flex items-center gap-2 min-h-[44px]"
            >
              <Save className="w-4 h-4" />
              <span>Save as Draft</span>
            </button>

            <button
              type="button"
              disabled={saving}
              onClick={() => handleSave('published')}
              className="px-6 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 disabled:opacity-50 text-white text-xs font-bold uppercase tracking-wider shadow-md hover:shadow-lg transition flex items-center gap-2 min-h-[44px]"
            >
              <CheckCircle className="w-4 h-4" />
              <span>{saving ? 'Publishing...' : '🚀 Save & Publish to Main Site'}</span>
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};
