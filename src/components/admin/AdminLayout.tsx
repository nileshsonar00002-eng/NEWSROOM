import React, { useEffect, useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  PlusCircle,
  FolderTree,
  Flame,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X,
  Sun,
  Moon,
  ShieldCheck,
  Database,
  AlertTriangle,
  Copy,
  Check,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { checkFirestoreHealth, FirebaseHealthStatus } from '../../services/firebaseStatus';

const FIRESTORE_RULES_SNIPPET = `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /articles/{docId} { allow read, write: if true; }
    match /categories/{docId} { allow read, write: if true; }
    match /breakingNews/{docId} { allow read, write: if true; }
    match /authors/{docId} { allow read, write: if true; }
    match /siteSettings/{docId} { allow read, write: if true; }
    match /adminUsers/{docId} { allow read, write: if true; }
    match /analytics/{docId} { allow read, write: if true; }
  }
}`;

export const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { admin, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [fbHealth, setFbHealth] = useState<FirebaseHealthStatus>({
    checked: false,
    connected: false,
    permissionDenied: false
  });
  const [checkingFb, setCheckingFb] = useState(false);
  const [copiedRules, setCopiedRules] = useState(false);

  const runHealthCheck = async () => {
    setCheckingFb(true);
    const status = await checkFirestoreHealth();
    setFbHealth(status);
    setCheckingFb(false);
  };

  useEffect(() => {
    runHealthCheck();
  }, []);

  const handleCopyRules = () => {
    navigator.clipboard.writeText(FIRESTORE_RULES_SNIPPET);
    setCopiedRules(true);
    setTimeout(() => setCopiedRules(false), 2500);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const navLinks = [
    { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/admin/articles', icon: FileText, label: 'Articles' },
    { to: '/admin/articles/new', icon: PlusCircle, label: 'New Article', highlight: true },
    { to: '/admin/categories', icon: FolderTree, label: 'Categories' },
    { to: '/admin/breaking-news', icon: Flame, label: 'Breaking News' },
    { to: '/admin/settings', icon: Settings, label: 'Settings' }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-navy-950 text-navy-900 dark:text-slate-100 flex flex-col transition-colors pb-16 md:pb-0">
      {/* 1. Admin Header Bar */}
      <header className="sticky top-0 z-30 bg-white dark:bg-navy-900 border-b border-slate-200 dark:border-navy-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-navy-800 md:hidden min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label="Toggle admin navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            <Link to="/admin/dashboard" className="flex items-center gap-2">
              <span className="font-headline font-black text-xl tracking-tight text-navy-950 dark:text-white">
                NEWS<span className="text-brand-500">ORA</span>
              </span>
              <span className="px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20 rounded-md">
                Admin Studio
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Firebase Sync Health Indicator */}
            {fbHealth.checked && (
              <button
                type="button"
                onClick={runHealthCheck}
                disabled={checkingFb}
                className={`hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-bold border transition ${
                  fbHealth.connected
                    ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/50'
                    : 'bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800/50 animate-pulse'
                }`}
                title="Click to re-check Firebase Firestore cloud sync"
              >
                <Database className="w-3.5 h-3.5" />
                <span>{fbHealth.connected ? 'Firebase Synced' : 'Firebase Blocked'}</span>
              </button>
            )}

            {/* View Live Website Link */}
            <Link
              to={`/${language}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-navy-800 hover:bg-slate-200 dark:hover:bg-navy-700 transition min-h-[36px]"
              title="Open public website in new tab"
            >
              <ExternalLink className="w-3.5 h-3.5 text-brand-500" />
              <span className="hidden sm:inline">View Public Site</span>
            </Link>

            {/* Theme Toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-navy-800 transition min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-navy-800" />
              )}
            </button>

            {/* User Profile Badge & Logout (Desktop) */}
            <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-navy-800">
              <div className="w-8 h-8 rounded-full bg-brand-500/20 text-brand-600 dark:text-brand-400 font-bold text-xs flex items-center justify-center">
                {admin?.email ? admin.email.substring(0, 2).toUpperCase() : 'AD'}
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="p-2 text-slate-400 hover:text-red-500 transition min-w-[44px] min-h-[44px] flex items-center justify-center"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 2. Admin Workspace Body */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 flex gap-6">
        {/* Desktop Sidebar Navigation */}
        <aside className="hidden md:block w-56 shrink-0 space-y-1">
          <div className="mb-4 p-3 bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 rounded-xl">
            <div className="text-xs text-slate-400">Signed in as:</div>
            <div className="text-xs font-semibold text-navy-900 dark:text-white truncate">
              {admin?.email || 'admin@newsora.in'}
            </div>
            <div className="text-[10px] text-emerald-500 font-bold uppercase mt-0.5">
              Role: {admin?.role || 'Superadmin'}
            </div>
          </div>

          {navLinks.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/admin/dashboard'}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition min-h-[44px] ${
                    isActive
                      ? 'bg-brand-500 text-white shadow-sm'
                      : item.highlight
                      ? 'text-brand-600 dark:text-brand-400 hover:bg-brand-50 dark:hover:bg-navy-800'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-navy-900 hover:text-navy-950 dark:hover:text-white'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}

          <div className="pt-4 mt-4 border-t border-slate-200 dark:border-navy-800">
            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 transition min-h-[44px]"
            >
              <LogOut className="w-4 h-4 shrink-0" />
              <span>Logout</span>
            </button>
          </div>
        </aside>

        {/* Mobile Full Menu Overlay */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-40 md:hidden bg-navy-950/70 backdrop-blur-sm flex">
            <div className="w-4/5 max-w-xs bg-white dark:bg-navy-900 h-full p-5 flex flex-col shadow-2xl">
              <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-navy-800">
                <span className="font-headline font-bold text-lg text-navy-950 dark:text-white">
                  NEWSORA Admin
                </span>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 text-slate-400 min-w-[44px] min-h-[44px] flex items-center justify-center"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="py-4 space-y-1 flex-1 overflow-y-auto">
                {navLinks.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      onClick={() => setMobileMenuOpen(false)}
                      end={item.to === '/admin/dashboard'}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-semibold transition min-h-[48px] ${
                          isActive
                            ? 'bg-brand-500 text-white'
                            : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-navy-800'
                        }`
                      }
                    >
                      <Icon className="w-5 h-5 shrink-0" />
                      <span>{item.label}</span>
                    </NavLink>
                  );
                })}
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-navy-800 space-y-2">
                <div className="text-xs text-slate-400 truncate">
                  {admin?.email}
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 p-3 rounded-lg text-sm font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 min-h-[44px]"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
            <div className="flex-1" onClick={() => setMobileMenuOpen(false)}></div>
          </div>
        )}

        {/* Main Admin Content Container */}
        <main className="flex-1 min-w-0 overflow-hidden space-y-5">
          {fbHealth.checked && !fbHealth.connected && (
            <div className="p-4 sm:p-5 rounded-2xl bg-red-50 dark:bg-red-950/40 border-2 border-red-300 dark:border-red-800 shadow-sm space-y-3">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
                <div className="flex-1 space-y-1">
                  <h3 className="font-headline font-bold text-sm sm:text-base text-red-900 dark:text-red-200">
                    Firebase Database Permission Blocked (newsroom-4d2a7)
                  </h3>
                  <p className="text-xs text-red-800 dark:text-red-300 leading-relaxed">
                    {fbHealth.permissionDenied
                      ? 'Firebase Firestore Rules are currently blocking saves, so updates cannot be stored in Firebase or shown on the live website. Publish the rules below in Firebase Console (takes 10 seconds):'
                      : fbHealth.errorMessage}
                  </p>
                </div>
              </div>

              {fbHealth.permissionDenied && (
                <div className="space-y-2.5 pl-0 sm:pl-8">
                  <pre className="p-3 rounded-xl bg-navy-950 text-emerald-300 text-[11px] font-mono overflow-x-auto leading-relaxed border border-navy-800">
                    {FIRESTORE_RULES_SNIPPET}
                  </pre>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={handleCopyRules}
                      className="px-3 py-2 rounded-lg bg-navy-950 hover:bg-navy-800 text-white text-xs font-bold flex items-center gap-1.5 min-h-[38px]"
                    >
                      {copiedRules ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedRules ? 'Rules Copied!' : '1. Copy Rules'}</span>
                    </button>

                    <a
                      href="https://console.firebase.google.com/project/newsroom-4d2a7/firestore/rules"
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold flex items-center gap-1.5 min-h-[38px]"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>2. Open Firebase Rules & Publish</span>
                    </a>

                    <button
                      type="button"
                      onClick={runHealthCheck}
                      disabled={checkingFb}
                      className="px-3 py-2 rounded-lg bg-white dark:bg-navy-900 border border-red-300 dark:border-red-700 text-red-800 dark:text-red-200 text-xs font-bold flex items-center gap-1.5 min-h-[38px]"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${checkingFb ? 'animate-spin' : ''}`} />
                      <span>3. Re-check Connection</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {children}
        </main>
      </div>

      {/* 3. Mobile Admin Bottom Navigation Bar (Rapid Thumb Access) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 dark:bg-navy-900/95 backdrop-blur-md border-t border-slate-200 dark:border-navy-800 py-1 px-2 flex items-center justify-around shadow-lg">
        <NavLink
          to="/admin/dashboard"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center p-1 rounded-lg text-[10px] font-semibold transition min-w-[50px] min-h-[48px] ${
              isActive ? 'text-brand-500' : 'text-slate-500 dark:text-slate-400'
            }`
          }
        >
          <LayoutDashboard className="w-5 h-5 mb-0.5" />
          <span>Overview</span>
        </NavLink>

        <NavLink
          to="/admin/articles"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center p-1 rounded-lg text-[10px] font-semibold transition min-w-[50px] min-h-[48px] ${
              isActive ? 'text-brand-500' : 'text-slate-500 dark:text-slate-400'
            }`
          }
        >
          <FileText className="w-5 h-5 mb-0.5" />
          <span>Articles</span>
        </NavLink>

        <NavLink
          to="/admin/articles/new"
          className="flex flex-col items-center justify-center p-1 rounded-full bg-brand-500 text-white shadow-md transform -translate-y-2 min-w-[52px] min-h-[52px]"
          title="Write New Article"
        >
          <PlusCircle className="w-6 h-6" />
        </NavLink>

        <NavLink
          to="/admin/categories"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center p-1 rounded-lg text-[10px] font-semibold transition min-w-[50px] min-h-[48px] ${
              isActive ? 'text-brand-500' : 'text-slate-500 dark:text-slate-400'
            }`
          }
        >
          <FolderTree className="w-5 h-5 mb-0.5" />
          <span>Categories</span>
        </NavLink>

        <button
          type="button"
          onClick={() => setMobileMenuOpen(true)}
          className="flex flex-col items-center justify-center p-1 rounded-lg text-[10px] font-semibold text-slate-500 dark:text-slate-400 min-w-[50px] min-h-[48px]"
        >
          <Menu className="w-5 h-5 mb-0.5" />
          <span>Menu</span>
        </button>
      </div>
    </div>
  );
};
