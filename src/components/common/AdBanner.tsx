import React, { useEffect, useState } from 'react';
import { getSiteSettings, DEFAULT_SITE_SETTINGS } from '../../services/settingsService';
import { SiteSettings } from '../../types';

interface AdBannerProps {
  placement:
    | 'home-top'
    | 'home-between'
    | 'article-intro'
    | 'article-mid'
    | 'article-bottom'
    | 'sidebar';
  className?: string;
}

export const AdBanner: React.FC<AdBannerProps> = ({ placement, className = '' }) => {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SITE_SETTINGS);

  useEffect(() => {
    let mounted = true;
    getSiteSettings().then((s) => {
      if (mounted) setSettings(s);
    });
    return () => {
      mounted = false;
    };
  }, []);

  if (!settings.enableAds) {
    return null;
  }

  // Get matching slot ID based on placement
  let slotId = '';
  let formatDesc = 'Responsive Ad Unit';
  let heightClass = 'h-24 sm:h-32';

  if (placement === 'home-top') {
    slotId = settings.adSlotHomeTop;
    formatDesc = 'Top Leaderboard (728x90 / 320x100)';
    heightClass = 'min-h-[90px]';
  } else if (placement === 'article-intro') {
    slotId = settings.adSlotArticleIntro;
    formatDesc = 'In-Article Header Unit';
    heightClass = 'min-h-[100px]';
  } else if (placement === 'article-mid') {
    slotId = settings.adSlotArticleMid;
    formatDesc = 'In-Feed Native Unit (300x250)';
    heightClass = 'min-h-[250px]';
  } else if (placement === 'article-bottom') {
    slotId = settings.adSlotArticleBottom;
    formatDesc = 'End of Article Unit';
    heightClass = 'min-h-[120px]';
  } else if (placement === 'sidebar') {
    slotId = settings.adSlotSidebar;
    formatDesc = 'Sidebar Medium Rectangle (300x600)';
    heightClass = 'min-h-[250px]';
  }

  return (
    <div
      className={`my-6 mx-auto w-full flex flex-col items-center justify-center p-3 rounded-xl border border-dashed border-slate-300 dark:border-navy-800 bg-slate-50 dark:bg-navy-900/60 text-center transition ${heightClass} ${className}`}
    >
      <span className="text-[10px] font-bold tracking-widest uppercase text-slate-400 mb-1">
        ADVERTISEMENT • SPONSORED
      </span>

      {/* When real AdSense script is active on live domain, ins tag renders here */}
      <div className="flex flex-col items-center justify-center text-xs text-slate-500 dark:text-slate-400">
        <span className="font-medium text-slate-600 dark:text-slate-300">
          Google AdSense Placement
        </span>
        <span className="text-[11px] text-slate-400">
          {formatDesc} • Slot: {slotId || 'Configured via Admin'}
        </span>
      </div>
    </div>
  );
};
