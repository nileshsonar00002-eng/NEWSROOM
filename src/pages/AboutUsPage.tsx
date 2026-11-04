import React from 'react';
import { ShieldCheck, Award, Heart, Globe, Users } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { SEOHead } from '../components/common/SEOHead';
import { CategoryBar } from '../components/common/CategoryBar';
import { Breadcrumbs } from '../components/common/Breadcrumbs';

export const AboutUsPage: React.FC = () => {
  const { language, t } = useLanguage();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-navy-950 text-navy-900 dark:text-slate-100 transition-colors pb-16">
      <SEOHead
        title={t.aboutUs}
        description="Learn about NEWSORA's mission, editorial principles, newsroom integrity, and commitment to multilingual verified journalism."
      />

      <CategoryBar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
        <Breadcrumbs items={[{ label: t.aboutUs }]} />

        <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 rounded-2xl p-6 sm:p-10 shadow-sm mt-4 space-y-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-brand-500">
              Our Mission
            </span>
            <h1 className="font-headline font-black text-2xl sm:text-4xl text-navy-950 dark:text-white mt-1">
              About NEWSORA • News That Moves You
            </h1>
            <p className="text-base text-slate-600 dark:text-slate-300 mt-3 leading-relaxed">
              NEWSORA is an independent digital news publishing platform designed mobile-first from the ground up. Founded on the principle that verified journalism must be immediately accessible to every citizen, NEWSORA provides comprehensive reporting in English, Hindi (हिंदी), and Marathi (मराठी).
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 border-t border-slate-100 dark:border-navy-800">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-navy-850 border border-slate-200/60 dark:border-navy-700/60">
              <ShieldCheck className="w-6 h-6 text-brand-500 mb-2" />
              <h2 className="font-headline font-bold text-base text-navy-950 dark:text-white">
                Verified Sourcing
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Zero tolerance for fabricated claims, unverified hearsay, or sensationalized clickbait. Every piece is human-reviewed.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-navy-850 border border-slate-200/60 dark:border-navy-700/60">
              <Globe className="w-6 h-6 text-brand-500 mb-2" />
              <h2 className="font-headline font-bold text-base text-navy-950 dark:text-white">
                Multilingual Native
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                We reject raw machine translation. Content in Marathi and Hindi is manually reviewed and culturally resonant.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-navy-850 border border-slate-200/60 dark:border-navy-700/60">
              <Users className="w-6 h-6 text-brand-500 mb-2" />
              <h2 className="font-headline font-bold text-base text-navy-950 dark:text-white">
                Mobile-First Focus
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Engineered specifically for smartphone readers across all network speeds, with zero clutter and optimal legibility.
              </p>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-navy-800 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            <h2 className="font-headline font-bold text-xl text-navy-950 dark:text-white">
              Editorial Governance & Integrity
            </h2>
            <p>
              NEWSORA is fully compliant with the Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules of India. Our newsroom operates strictly independent of commercial or partisan interests.
            </p>
            <p>
              Our bureaus in Mumbai, Pune, and New Delhi maintain continuous coverage across governance, the rural-urban economic divide, environmental conservation in the Western Ghats / Sahyadri corridor, and national scientific advancements.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};
