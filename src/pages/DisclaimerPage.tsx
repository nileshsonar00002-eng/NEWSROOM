import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { SEOHead } from '../components/common/SEOHead';
import { CategoryBar } from '../components/common/CategoryBar';
import { Breadcrumbs } from '../components/common/Breadcrumbs';

export const DisclaimerPage: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-navy-950 text-navy-900 dark:text-slate-100 transition-colors pb-16">
      <SEOHead
        title={t.disclaimer}
        description="NEWSORA Disclaimer: Legal limitations, third-party source references, and transparency statements."
      />

      <CategoryBar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
        <Breadcrumbs items={[{ label: t.disclaimer }]} />

        <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 rounded-2xl p-6 sm:p-10 shadow-sm mt-4 space-y-6 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          <h1 className="font-headline font-black text-2xl sm:text-4xl text-navy-950 dark:text-white">
            Disclaimer & Transparency Statements
          </h1>
          <p className="text-xs text-slate-400">
            Last modified: November 2026
          </p>

          <section className="space-y-2">
            <h2 className="font-headline font-bold text-lg text-navy-950 dark:text-white">
              1. General News Information Only
            </h2>
            <p>
              The reports, analyses, financial digests, and scientific summaries published on NEWSORA are intended exclusively for general informational and educational purposes. Nothing on this website constitutes legal, medical, investment, or statutory financial advice.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-headline font-bold text-lg text-navy-950 dark:text-white">
              2. Third-Party Links & Source References
            </h2>
            <p>
              Our reports frequently contain links to external governmental portals, academic research repositories, and official press releases. NEWSORA is not responsible for the ongoing availability, accuracy, or privacy practices of external web domains.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-headline font-bold text-lg text-navy-950 dark:text-white">
              3. Regulatory Compliance
            </h2>
            <p>
              NEWSORA operates as an independent digital news media publisher adhering to the Code of Ethics under Indian digital media regulations. We do not claim or guarantee search engine placement or external platform endorsements.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
};
