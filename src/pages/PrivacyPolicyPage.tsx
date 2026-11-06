import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { SEOHead } from '../components/common/SEOHead';
import { CategoryBar } from '../components/common/CategoryBar';
import { Breadcrumbs } from '../components/common/Breadcrumbs';

export const PrivacyPolicyPage: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-navy-950 text-navy-900 dark:text-slate-100 transition-colors pb-16">
      <SEOHead
        title={t.privacyPolicy}
        description="NEWSORA Privacy Policy: User privacy, cookie handling, telemetry ethics, and compliance with data protection regulations."
      />

      <CategoryBar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
        <Breadcrumbs items={[{ label: t.privacyPolicy }]} />

        <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 rounded-2xl p-6 sm:p-10 shadow-sm mt-4 space-y-6 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          <h1 className="font-headline font-black text-2xl sm:text-4xl text-navy-950 dark:text-white">
            Privacy Policy
          </h1>
          <p className="text-xs text-slate-400">
            Effective Date: November 4, 2026 • Compliant with Indian IT Act and Digital Personal Data Protection (DPDP) Act.
          </p>

          <section className="space-y-2">
            <h2 className="font-headline font-bold text-lg text-navy-950 dark:text-white">
              1. Information We Collect
            </h2>
            <p>
              NEWSORA is a privacy-conscious digital news platform. We do not sell your personal data. We do not require account creation to read articles. We collect only minimal telemetry required for platform performance and server health, such as anonymous page view counters.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-headline font-bold text-lg text-navy-950 dark:text-white">
              2. Cookies & Local Storage
            </h2>
            <p>
              We use standard browser localStorage solely to remember your preferred reading language (English or Hindi) and your preferred visual theme (Light or Dark mode). We do not deploy invasive third-party cross-site tracking beacons.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-headline font-bold text-lg text-navy-950 dark:text-white">
              3. Advertisements
            </h2>
            <p>
              Advertisements displayed on NEWSORA may be served by Google AdSense or authorized ad networks. These networks may use non-personally identifiable cookies to serve contextual advertisements. Readers may manage ad personalization directly via Google Ad Settings.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-headline font-bold text-lg text-navy-950 dark:text-white">
              4. Contact Our Data Protection Officer
            </h2>
            <p>
              For privacy queries or rights under data protection laws, contact our Compliance & Grievance Desk via our official Contact page.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
};
