import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { SEOHead } from '../components/common/SEOHead';
import { CategoryBar } from '../components/common/CategoryBar';
import { Breadcrumbs } from '../components/common/Breadcrumbs';

export const TermsPage: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-navy-950 text-navy-900 dark:text-slate-100 transition-colors pb-16">
      <SEOHead
        title={t.termsConditions}
        description="Terms and Conditions of use for the NEWSORA digital news publishing platform."
      />

      <CategoryBar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
        <Breadcrumbs items={[{ label: t.termsConditions }]} />

        <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 rounded-2xl p-6 sm:p-10 shadow-sm mt-4 space-y-6 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          <h1 className="font-headline font-black text-2xl sm:text-4xl text-navy-950 dark:text-white">
            Terms & Conditions of Service
          </h1>
          <p className="text-xs text-slate-400">
            Last modified: November 2026
          </p>

          <section className="space-y-2">
            <h2 className="font-headline font-bold text-lg text-navy-950 dark:text-white">
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing, browsing, or utilizing NEWSORA (newsora.in) on mobile, tablet, or desktop devices, you agree to comply with and be bound by these Terms and Conditions.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-headline font-bold text-lg text-navy-950 dark:text-white">
              2. Intellectual Property & Fair Use
            </h2>
            <p>
              All original journalistic content, trademarks, branding, typography, code, and graphics published on NEWSORA are the intellectual property of NEWSORA Digital Media unless attributed to external partners. Readers may share individual article excerpts for non-commercial educational purposes, provided clear attribution and a direct canonical backlink are included.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-headline font-bold text-lg text-navy-950 dark:text-white">
              3. Unlawful Conduct & Automated Crawling
            </h2>
            <p>
              Users agree not to launch scraping bots, automated extractors, or denial-of-service scripts against the platform infrastructure. Any attempt to compromise secure admin interfaces or backend databases is strictly prohibited and subject to legal prosecution.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
};
