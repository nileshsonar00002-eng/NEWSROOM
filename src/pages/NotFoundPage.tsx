import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Home, Search } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { SEOHead } from '../components/common/SEOHead';
import { CategoryBar } from '../components/common/CategoryBar';

export const NotFoundPage: React.FC = () => {
  const { language, t } = useLanguage();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-navy-950 text-navy-900 dark:text-slate-100 transition-colors pb-16 flex flex-col">
      <SEOHead title="404 - Page Not Found" description="The page you requested could not be found on NEWSORA." />

      <CategoryBar />

      <main className="flex-1 max-w-lg mx-auto px-4 py-16 text-center flex flex-col items-center justify-center space-y-6">
        <div className="w-20 h-20 rounded-2xl bg-brand-500/10 text-brand-500 flex items-center justify-center animate-bounce">
          <Compass className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <span className="font-headline font-black text-6xl sm:text-7xl text-navy-950 dark:text-white tracking-tighter">
            404
          </span>
          <h1 className="font-headline font-bold text-xl sm:text-2xl text-navy-950 dark:text-white">
            Headline Not Found
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            The story, beat, or page you are looking for has been moved, archived, or does not exist.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2 w-full justify-center">
          <Link
            to={`/${language}`}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold uppercase tracking-wider shadow-sm transition flex items-center justify-center gap-2 min-h-[44px]"
          >
            <Home className="w-4 h-4" />
            <span>Return to Homepage</span>
          </Link>

          <Link
            to={`/${language}/search`}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white dark:bg-navy-900 border border-slate-300 dark:border-navy-700 text-navy-950 dark:text-white text-xs font-bold uppercase tracking-wider hover:bg-slate-100 dark:hover:bg-navy-800 transition flex items-center justify-center gap-2 min-h-[44px]"
          >
            <Search className="w-4 h-4" />
            <span>Search Articles</span>
          </Link>
        </div>
      </main>
    </div>
  );
};
