import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, ShieldCheck, AlertCircle, ArrowLeft, Zap } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { SEOHead } from '../../components/common/SEOHead';

export const AdminLoginPage: React.FC = () => {
  const { login, isAuthenticated } = useAuth();
  const { language } = useLanguage();
  const navigate = useNavigate();

  const [email, setEmail] = useState('admin@newsora.in');
  const [password, setPassword] = useState('newsora2026');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // If already logged in, redirect to dashboard
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const doLogin = async (loginEmail: string, loginPass: string) => {
    setError(null);
    setLoading(true);

    try {
      await login(loginEmail, loginPass);
      navigate('/admin/dashboard', { replace: true });
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    doLogin(email, password);
  };

  const handleQuickOneClickLogin = () => {
    setEmail('admin@newsora.in');
    setPassword('newsora2026');
    doLogin('admin@newsora.in', 'newsora2026');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-navy-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 transition-colors px-4">
      <SEOHead title="Admin Studio Sign In" description="Secure administrator portal for NEWSORA editors and journalists." />

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link
          to={`/${language}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-navy-950 dark:hover:text-white mb-6 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to NEWSORA Public Website</span>
        </Link>

        <div className="flex items-center justify-center gap-2">
          <span className="font-headline font-black text-3xl tracking-tight text-navy-950 dark:text-white">
            NEWS<span className="text-brand-500">ORA</span>
          </span>
          <span className="px-2 py-0.5 text-xs font-bold tracking-wider uppercase bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20 rounded-md">
            Studio
          </span>
        </div>

        <h1 className="mt-2 text-center text-sm font-medium text-slate-600 dark:text-slate-400">
          Secure Editorial & Publishing Administration
        </h1>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-navy-900 py-8 px-6 shadow-xl rounded-2xl border border-slate-200 dark:border-navy-800 sm:px-10 space-y-6">
          {/* Quick One-Click Access Button */}
          <button
            type="button"
            onClick={handleQuickOneClickLogin}
            disabled={loading}
            className="w-full py-3.5 px-4 bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 text-white rounded-xl font-bold text-xs uppercase tracking-wider shadow-md transition flex items-center justify-center gap-2 min-h-[48px]"
          >
            <Zap className="w-4 h-4 fill-white" />
            <span>{loading ? 'Signing In...' : '⚡ One-Click Admin Sign In'}</span>
          </button>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-slate-200 dark:border-navy-800 w-full"></div>
            <span className="bg-white dark:bg-navy-900 px-3 text-[11px] uppercase font-bold text-slate-400 tracking-wider shrink-0">
              Or Sign In with Email
            </span>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/40 flex items-start gap-3 text-xs text-red-700 dark:text-red-300">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-500" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Authorized Administrator Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@newsora.in"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-navy-950 border border-slate-300 dark:border-navy-700 rounded-xl text-sm text-navy-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 min-h-[44px]"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Password / Secure Passcode
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="newsora2026"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-navy-950 border border-slate-300 dark:border-navy-700 rounded-xl text-sm text-navy-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 min-h-[44px]"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-navy-950 hover:bg-black dark:bg-navy-800 dark:hover:bg-navy-700 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow transition flex items-center justify-center gap-2 min-h-[44px]"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{loading ? 'Authenticating...' : 'Sign In to Studio'}</span>
            </button>
          </form>

          {/* Helper Credentials Box */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-navy-950/60 border border-slate-200 dark:border-navy-800 text-center space-y-1">
            <p className="text-[11px] font-semibold text-slate-600 dark:text-slate-300">
              Verified Administrator Credentials:
            </p>
            <p className="text-xs font-mono text-brand-600 dark:text-brand-400 font-bold select-all">
              admin@newsora.in &nbsp;|&nbsp; newsora2026
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
