import React from 'react';
import { Link } from 'react-router-dom';
import { Rss, Mail, Phone, Heart } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const XIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const FacebookIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const YoutubeIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

export const Footer: React.FC = () => {
  const { language, t } = useLanguage();

  const categories = [
    { slug: 'india', label: language === 'hi' ? 'भारत' : 'India' },
    { slug: 'business', label: language === 'hi' ? 'व्यापार' : 'Business' },
    { slug: 'technology', label: language === 'hi' ? 'तकनीक' : 'Technology' },
    { slug: 'entertainment', label: language === 'hi' ? 'मनोरंजन' : 'Entertainment' },
    { slug: 'sports', label: language === 'hi' ? 'खेल' : 'Sports' }
  ];

  return (
    <footer className="bg-navy-950 text-slate-300 border-t border-navy-800 transition-colors pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-10 border-b border-navy-800">
          {/* Column 1: Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to={`/${language}`} className="flex items-baseline gap-1 inline-block">
              <span className="font-headline font-black text-2xl sm:text-3xl tracking-tighter text-white">
                NEWS<span className="text-brand-500">ORA</span>
              </span>
              <span className="w-2 h-2 rounded-full bg-brand-500 mb-0.5"></span>
            </Link>
            <p className="text-sm text-brand-400 font-medium">
              "{t.tagline}"
            </p>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-md">
              {t.footerAboutText}
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://twitter.com/newsoranews"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-navy-900 border border-navy-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-brand-500 transition"
                aria-label="Follow NEWSORA on Twitter/X"
              >
                <XIcon className="w-4 h-4" />
              </a>
              <a
                href="https://facebook.com/newsoranews"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-navy-900 border border-navy-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-brand-500 transition"
                aria-label="Follow NEWSORA on Facebook"
              >
                <FacebookIcon className="w-4 h-4" />
              </a>
              <a
                href="https://youtube.com/@newsoranews"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-navy-900 border border-navy-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-brand-500 transition"
                aria-label="NEWSORA YouTube channel"
              >
                <YoutubeIcon className="w-4 h-4" />
              </a>
              <Link
                to={`/${language}/rss`}
                className="w-9 h-9 rounded-full bg-navy-900 border border-navy-800 flex items-center justify-center text-slate-400 hover:text-brand-400 hover:border-brand-500 transition"
                aria-label="RSS Feed"
              >
                <Rss className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Column 2: Categories (Part 1) */}
          <div>
            <h3 className="font-headline font-bold text-sm uppercase tracking-wider text-white mb-4">
              {t.categoriesTitle}
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm">
              {categories.slice(0, 7).map((c) => (
                <li key={c.slug}>
                  <Link
                    to={`/${language}/category/${c.slug}`}
                    className="text-slate-400 hover:text-white transition block py-1"
                  >
                    {c.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Categories (Part 2) */}
          <div>
            <h3 className="font-headline font-bold text-sm uppercase tracking-wider text-white mb-4">
              {language === 'hi' ? 'विशेष वर्ग' : 'More Beats'}
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm">
              {categories.slice(7).map((c) => (
                <li key={c.slug}>
                  <Link
                    to={`/${language}/category/${c.slug}`}
                    className="text-slate-400 hover:text-white transition block py-1"
                  >
                    {c.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Transparency & Legal */}
          <div>
            <h3 className="font-headline font-bold text-sm uppercase tracking-wider text-white mb-4">
              {t.legalTitle}
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <Link to={`/${language}/about`} className="text-slate-400 hover:text-white transition block py-1">
                  {t.aboutUs}
                </Link>
              </li>
              <li>
                <Link to={`/${language}/contact`} className="text-slate-400 hover:text-white transition block py-1">
                  {t.contactUs}
                </Link>
              </li>
              <li>
                <Link to={`/${language}/editorial-policy`} className="text-slate-400 hover:text-white transition block py-1">
                  {t.editorialPolicy}
                </Link>
              </li>
              <li>
                <Link to={`/${language}/privacy`} className="text-slate-400 hover:text-white transition block py-1">
                  {t.privacyPolicy}
                </Link>
              </li>
              <li>
                <Link to={`/${language}/terms`} className="text-slate-400 hover:text-white transition block py-1">
                  {t.termsConditions}
                </Link>
              </li>
              <li>
                <Link to={`/${language}/disclaimer`} className="text-slate-400 hover:text-white transition block py-1">
                  {t.disclaimer}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <p>{t.copyrightNotice}</p>
          <div className="flex items-center gap-4">
            <Link to={`/${language}/rss`} className="hover:text-slate-300 transition">
              RSS Feed
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
