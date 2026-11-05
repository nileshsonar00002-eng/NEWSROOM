import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, className = '' }) => {
  const { language } = useLanguage();

  return (
    <nav
      aria-label="Breadcrumb"
      className={`flex items-center text-xs text-slate-500 dark:text-slate-400 overflow-x-auto no-scrollbar py-2 ${className}`}
    >
      <Link
        to={`/${language}`}
        className="flex items-center hover:text-brand-500 transition shrink-0 min-h-[32px]"
      >
        <Home className="w-3.5 h-3.5 mr-1" />
        <span>{language === 'hi' ? 'मुखपृष्ठ' : 'Home'}</span>
      </Link>

      {items.map((item, idx) => {
        const isLast = idx === items.length - 1;
        return (
          <React.Fragment key={idx}>
            <ChevronRight className="w-3.5 h-3.5 mx-1.5 text-slate-400 shrink-0" />
            {isLast || !item.path ? (
              <span className="font-semibold text-navy-950 dark:text-white truncate max-w-[200px] sm:max-w-xs">
                {item.label}
              </span>
            ) : (
              <Link
                to={item.path}
                className="hover:text-brand-500 transition shrink-0 whitespace-nowrap"
              >
                {item.label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};
