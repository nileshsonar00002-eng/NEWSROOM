import React from 'react';
import { ShieldCheck, CheckSquare, AlertTriangle, FileText, RefreshCw } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { SEOHead } from '../components/common/SEOHead';
import { CategoryBar } from '../components/common/CategoryBar';
import { Breadcrumbs } from '../components/common/Breadcrumbs';

export const EditorialPolicyPage: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-navy-950 text-navy-900 dark:text-slate-100 transition-colors pb-16">
      <SEOHead
        title={t.editorialPolicy}
        description="NEWSORA Editorial Policy: Fact-checking standards, anti-scraping guidelines, correction policies, and source attribution ethics."
      />

      <CategoryBar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
        <Breadcrumbs items={[{ label: t.editorialPolicy }]} />

        <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 rounded-2xl p-6 sm:p-10 shadow-sm mt-4 space-y-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-brand-500">
              Standards & Ethics
            </span>
            <h1 className="font-headline font-black text-2xl sm:text-4xl text-navy-950 dark:text-white mt-1">
              NEWSORA Editorial & Correction Policy
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2">
              Last updated: November 2026 • Verified Standards Compliance
            </p>
          </div>

          <div className="space-y-6 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            <section className="space-y-2">
              <h2 className="font-headline font-bold text-lg text-navy-950 dark:text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-brand-500" />
                1. Core Commitment to Truth & Independence
              </h2>
              <p>
                NEWSORA adheres strictly to the highest standards of digital journalism. We report facts without distortion, favor, or ideological bias. Every published article undergoes thorough fact-checking, and assertions are verified through multiple independent primary records or official government communiqués.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-headline font-bold text-lg text-navy-950 dark:text-white flex items-center gap-2">
                <CheckSquare className="w-5 h-5 text-brand-500" />
                2. Prohibition on Web Scraping and Copyright Infringement
              </h2>
              <p>
                NEWSORA never engages in automated web scraping or unauthorized re-publishing of third-party copyrighted work. Every story is either:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Original on-ground reporting conducted by our credentialed correspondents.</li>
                <li>Carefully written editorial summaries based on press conferences, legal hearings, government gazettes, and official research releases, with explicit attribution and links to the source.</li>
              </ul>
            </section>

            <section className="space-y-2">
              <h2 className="font-headline font-bold text-lg text-navy-950 dark:text-white flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-brand-500" />
                3. Non-Fabrication and Artificial Intelligence Disclosure
              </h2>
              <p>
                We do not publish fabricated quotes, pseudo-scientific claims, or computer-hallucinated statistics. Automated artificial intelligence tools may assist in research and grammatical drafting, but all published articles are authored, reviewed, and approved exclusively by human editorial staff.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-headline font-bold text-lg text-navy-950 dark:text-white flex items-center gap-2">
                <RefreshCw className="w-5 h-5 text-brand-500" />
                4. Corrections & Clarifications Policy
              </h2>
              <p>
                When factual errors or inaccuracies occur, NEWSORA corrects them promptly and transparently. We believe admitting and correcting errors reinforces reader trust rather than undermining it.
              </p>
              <p>
                Any correction made to an article after initial publication is clearly noted with a timestamped correction notice at the bottom or top of the report. Readers can submit correction requests directly through our Contact & Grievance Desk.
              </p>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};
