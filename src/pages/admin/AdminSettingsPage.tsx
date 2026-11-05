import React, { useEffect, useState } from 'react';
import { Save, CheckCircle, Sparkles, DollarSign, Globe, Mail, Share2 } from 'lucide-react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { AdminCard } from '../../components/admin/AdminCard';
import { getSiteSettings, updateSiteSettings, DEFAULT_SITE_SETTINGS } from '../../services/settingsService';
import { SiteSettings } from '../../types';

export const AdminSettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SITE_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    getSiteSettings().then((s) => {
      setSettings(s);
      setLoading(false);
    });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSavedSuccess(false);

    try {
      await updateSiteSettings(settings);
      setSaving(false);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      setSaving(false);
      alert('Error updating settings');
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-4xl pb-16">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-headline font-black text-2xl sm:text-3xl text-navy-950 dark:text-white">
              Platform & AdSense Settings
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Configure brand identity, Google AdSense units, and social newsroom integrations.
            </p>
          </div>

          <button
            type="submit"
            form="settingsForm"
            disabled={saving}
            className="px-5 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider transition shadow-sm flex items-center justify-center gap-2 min-h-[44px]"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save Settings'}</span>
          </button>
        </div>

        {savedSuccess && (
          <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-700 dark:text-emerald-300 flex items-center gap-2 animate-fadeIn">
            <CheckCircle className="w-4 h-4 text-emerald-500" />
            <span>Settings successfully saved and synchronized across the platform!</span>
          </div>
        )}

        <form id="settingsForm" onSubmit={handleSave} className="space-y-6">
          {/* 1. General Brand Settings */}
          <AdminCard title="Brand Identity" subtitle="Core platform branding visible to visitors">
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 block mb-1">
                    Platform Name
                  </label>
                  <input
                    type="text"
                    value={settings.siteName}
                    onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-navy-950 border border-slate-300 dark:border-navy-700 rounded-lg min-h-[44px]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 block mb-1">
                    Brand Tagline
                  </label>
                  <input
                    type="text"
                    value={settings.tagline}
                    onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-navy-950 border border-slate-300 dark:border-navy-700 rounded-lg min-h-[44px]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 block mb-1">
                  Default Platform Language
                </label>
                <select
                  value={settings.defaultLang}
                  onChange={(e) => setSettings({ ...settings, defaultLang: e.target.value as any })}
                  className="w-full sm:w-1/2 px-3 py-2 text-sm bg-slate-50 dark:bg-navy-950 border border-slate-300 dark:border-navy-700 rounded-lg min-h-[44px]"
                >
                  <option value="en">English (en)</option>
                  <option value="hi">Hindi (hi)</option>
                </select>
              </div>
            </div>
          </AdminCard>

          {/* 2. Google AdSense Monetization */}
          <AdminCard
            title="Google AdSense Configuration"
            subtitle="Configure advertisement slots across homepage and article pages"
          >
            <div className="space-y-4">
              <div className="flex items-center gap-2 p-3 bg-slate-50 dark:bg-navy-950 rounded-lg border border-slate-200 dark:border-navy-800">
                <input
                  type="checkbox"
                  id="enableAdsToggle"
                  checked={settings.enableAds}
                  onChange={(e) => setSettings({ ...settings, enableAds: e.target.checked })}
                  className="w-4 h-4 text-brand-500 rounded"
                />
                <label htmlFor="enableAdsToggle" className="text-xs font-bold text-navy-950 dark:text-white cursor-pointer">
                  Enable Ad Placements on Website (Shows placeholders when slot IDs are testing)
                </label>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 block mb-1">
                  AdSense Publisher ID
                </label>
                <input
                  type="text"
                  value={settings.adsensePublisherId}
                  onChange={(e) => setSettings({ ...settings, adsensePublisherId: e.target.value })}
                  placeholder="ca-pub-9876543210123456"
                  className="w-full px-3 py-2 text-sm font-mono bg-slate-50 dark:bg-navy-950 border border-slate-300 dark:border-navy-700 rounded-lg min-h-[44px]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Homepage Top Leaderboard Slot ID
                  </label>
                  <input
                    type="text"
                    value={settings.adSlotHomeTop}
                    onChange={(e) => setSettings({ ...settings, adSlotHomeTop: e.target.value })}
                    placeholder="1234567890"
                    className="w-full px-3 py-2 text-xs font-mono bg-slate-50 dark:bg-navy-950 border border-slate-300 dark:border-navy-700 rounded-lg min-h-[44px]"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Article Intro Header Slot ID
                  </label>
                  <input
                    type="text"
                    value={settings.adSlotArticleIntro}
                    onChange={(e) => setSettings({ ...settings, adSlotArticleIntro: e.target.value })}
                    placeholder="2345678901"
                    className="w-full px-3 py-2 text-xs font-mono bg-slate-50 dark:bg-navy-950 border border-slate-300 dark:border-navy-700 rounded-lg min-h-[44px]"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Article In-Content Mid Slot ID
                  </label>
                  <input
                    type="text"
                    value={settings.adSlotArticleMid}
                    onChange={(e) => setSettings({ ...settings, adSlotArticleMid: e.target.value })}
                    placeholder="3456789012"
                    className="w-full px-3 py-2 text-xs font-mono bg-slate-50 dark:bg-navy-950 border border-slate-300 dark:border-navy-700 rounded-lg min-h-[44px]"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Article Bottom Unit Slot ID
                  </label>
                  <input
                    type="text"
                    value={settings.adSlotArticleBottom}
                    onChange={(e) => setSettings({ ...settings, adSlotArticleBottom: e.target.value })}
                    placeholder="4567890123"
                    className="w-full px-3 py-2 text-xs font-mono bg-slate-50 dark:bg-navy-950 border border-slate-300 dark:border-navy-700 rounded-lg min-h-[44px]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Desktop Sidebar Unit Slot ID
                  </label>
                  <input
                    type="text"
                    value={settings.adSlotSidebar}
                    onChange={(e) => setSettings({ ...settings, adSlotSidebar: e.target.value })}
                    placeholder="5678901234"
                    className="w-full px-3 py-2 text-xs font-mono bg-slate-50 dark:bg-navy-950 border border-slate-300 dark:border-navy-700 rounded-lg min-h-[44px]"
                  />
                </div>
              </div>
            </div>
          </AdminCard>

          {/* 3. Newsroom Contact & Socials */}
          <AdminCard title="Newsroom Contact & Social Profiles">
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Public Newsroom Email
                  </label>
                  <input
                    type="email"
                    value={settings.contactEmail}
                    onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-navy-950 border border-slate-300 dark:border-navy-700 rounded-lg min-h-[44px]"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    WhatsApp News Tip Line
                  </label>
                  <input
                    type="text"
                    value={settings.whatsappNumber}
                    onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-navy-950 border border-slate-300 dark:border-navy-700 rounded-lg min-h-[44px]"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Twitter / X Profile URL
                  </label>
                  <input
                    type="url"
                    value={settings.twitterUrl}
                    onChange={(e) => setSettings({ ...settings, twitterUrl: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-navy-950 border border-slate-300 dark:border-navy-700 rounded-lg min-h-[44px]"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Facebook Page URL
                  </label>
                  <input
                    type="url"
                    value={settings.facebookUrl}
                    onChange={(e) => setSettings({ ...settings, facebookUrl: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-navy-950 border border-slate-300 dark:border-navy-700 rounded-lg min-h-[44px]"
                  />
                </div>
              </div>
            </div>
          </AdminCard>
        </form>
      </div>
    </AdminLayout>
  );
};
