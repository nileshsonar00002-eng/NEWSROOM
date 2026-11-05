import React, { useEffect, useState, useRef } from 'react';
import { NavLink, useParams } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { getCategories, DEFAULT_CATEGORIES } from '../../services/categoryService';
import { Category } from '../../types';

export const CategoryBar: React.FC = () => {
  const { language, t } = useLanguage();
  const { categorySlug } = useParams<{ categorySlug?: string }>();
  const [categories, setCategories] = useState<Category[]>(DEFAULT_CATEGORIES);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let mounted = true;

    const loadCats = () => {
      getCategories().then((cats) => {
        if (mounted && cats && cats.length > 0) {
          setCategories(cats.filter((c) => c.isActive !== false));
        }
      });
    };

    loadCats();

    const handleUpdate = () => {
      loadCats();
    };

    window.addEventListener('newsora_categories_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      mounted = false;
      window.removeEventListener('newsora_categories_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const offset = direction === 'left' ? -220 : 220;
      scrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  return (
    <nav className="relative bg-white dark:bg-navy-950 border-b border-slate-200 dark:border-navy-800 shadow-sm transition-colors">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 flex items-center">
        {/* Scroll Left Button for Desktop */}
        <button
          type="button"
          onClick={() => handleScroll('left')}
          className="hidden md:flex items-center justify-center w-8 h-8 rounded-full text-slate-500 hover:text-navy-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-navy-800 transition z-10 shrink-0"
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Scrollable Container */}
        <div
          ref={scrollRef}
          className="flex items-center gap-1 sm:gap-2 overflow-x-auto no-scrollbar py-2.5 px-1 scroll-smooth w-full"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {/* Home Link */}
          <NavLink
            to={`/${language}`}
            end
            className={({ isActive }) =>
              `whitespace-nowrap px-3 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition shrink-0 min-h-[38px] flex items-center ${
                isActive && !categorySlug
                  ? 'bg-navy-900 dark:bg-white text-white dark:text-navy-950 shadow-sm'
                  : 'text-slate-700 dark:text-slate-300 hover:text-brand-500 hover:bg-slate-100 dark:hover:bg-navy-900'
              }`
            }
          >
            {language === 'hi' ? 'मुखपृष्ठ' : 'Home'}
          </NavLink>

          {/* Latest News Link */}
          <NavLink
            to={`/${language}/latest`}
            className={({ isActive }) =>
              `whitespace-nowrap px-3 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition shrink-0 min-h-[38px] flex items-center ${
                isActive
                  ? 'bg-navy-900 dark:bg-white text-white dark:text-navy-950 shadow-sm'
                  : 'text-slate-700 dark:text-slate-300 hover:text-brand-500 hover:bg-slate-100 dark:hover:bg-navy-900'
              }`
            }
          >
            {t.latestNews}
          </NavLink>

          {/* Category Tabs */}
          {categories.map((cat) => {
            const label = cat.names?.[language] || cat.names?.en || cat.id;
            const isCurrentCategory = categorySlug === cat.slug;

            return (
              <NavLink
                key={cat.id}
                to={`/${language}/category/${cat.slug}`}
                className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition shrink-0 min-h-[38px] flex items-center ${
                  isCurrentCategory
                    ? 'bg-brand-500 text-white shadow-sm'
                    : 'text-slate-700 dark:text-slate-300 hover:text-brand-500 hover:bg-slate-100 dark:hover:bg-navy-900'
                }`}
              >
                {label}
              </NavLink>
            );
          })}
        </div>

        {/* Scroll Right Button for Desktop */}
        <button
          type="button"
          onClick={() => handleScroll('right')}
          className="hidden md:flex items-center justify-center w-8 h-8 rounded-full text-slate-500 hover:text-navy-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-navy-800 transition z-10 shrink-0"
          aria-label="Scroll right"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </nav>
  );
};
