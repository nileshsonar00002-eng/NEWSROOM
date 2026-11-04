import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface SectionHeaderProps {
  title: string;
  slug?: string;
  badge?: string;
  className?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  slug,
  badge,
  className = ''
}) => {
  const { language, t } = useLanguage();

  return (
    <div className={`flex items-center justify-between pb-3 mb-4 border-b-2 border-navy-950 dark:border-navy-700 ${className}`}>
      <div className="flex items-center gap-2">
        <span className="w-2.5 h-6 bg-brand-500 rounded-sm inline-block"></span>
        <h2 className="font-headline font-black text-xl sm:text-2xl text-navy-950 dark:text-white tracking-tight">
          {title}
        </h2>
        {badge && (
          <span className="ml-2 px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-brand-500/10 text-brand-600 dark:text-brand-400">
            {badge}
          </span>
        )}
      </div>

      {slug && (
        <Link
          to={`/${language}/category/${slug}`}
          className="flex items-center gap-1 text-xs sm:text-sm font-bold text-brand-600 dark:text-brand-400 hover:text-brand-500 transition group"
        >
          <span>{t.viewAll}</span>
          <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </Link>
      )}
    </div>
  );
};
