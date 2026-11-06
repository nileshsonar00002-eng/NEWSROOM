import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
  useParams
} from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';

// Public Pages
import { HomePage } from './pages/HomePage';
import { LatestNewsPage } from './pages/LatestNewsPage';
import { CategoryPage } from './pages/CategoryPage';
import { ArticleDetailPage } from './pages/ArticleDetailPage';
import { SearchResultsPage } from './pages/SearchResultsPage';
import { TrendingPage } from './pages/TrendingPage';
import { AboutUsPage } from './pages/AboutUsPage';
import { ContactUsPage } from './pages/ContactUsPage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { TermsPage } from './pages/TermsPage';
import { EditorialPolicyPage } from './pages/EditorialPolicyPage';
import { DisclaimerPage } from './pages/DisclaimerPage';
import { RssFeedPage } from './pages/RssFeedPage';
import { NotFoundPage } from './pages/NotFoundPage';

// Admin Pages
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminArticlesListPage } from './pages/admin/AdminArticlesListPage';
import { AdminArticleEditorPage } from './pages/admin/AdminArticleEditorPage';
import { AdminCategoriesPage } from './pages/admin/AdminCategoriesPage';
import { AdminBreakingNewsPage } from './pages/admin/AdminBreakingNewsPage';
import { AdminAuthorsPage } from './pages/admin/AdminAuthorsPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';

// Protected Route Component for Admin Dashboard
const ProtectedAdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white text-sm">
        Verifying security credentials...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
};

// Root Language Sync Redirector
const RootRedirector: React.FC = () => {
  const { language } = useLanguage();
  return <Navigate to={`/${language}`} replace />;
};

// Language URL Sync Wrapper
const LangRouteWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { lang } = useParams<{ lang?: string }>();
  const { language, setLanguage } = useLanguage();

  React.useEffect(() => {
    if (lang && (lang === 'en' || lang === 'hi') && lang !== language) {
      setLanguage(lang);
    }
  }, [lang, language, setLanguage]);

  return <>{children}</>;
};

// Layout for Public Pages (Includes Sticky Header and Footer)
const PublicLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex-1">{children}</div>
      <Footer />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <Router>
            <Routes>
              {/* Root Redirect to current active language */}
              <Route path="/" element={<RootRedirector />} />

              {/* =========================================
                  MULTILINGUAL PUBLIC ROUTES (/:lang/...)
                  ========================================= */}
              <Route
                path="/:lang"
                element={
                  <LangRouteWrapper>
                    <PublicLayout>
                      <HomePage />
                    </PublicLayout>
                  </LangRouteWrapper>
                }
              />
              <Route
                path="/:lang/latest"
                element={
                  <LangRouteWrapper>
                    <PublicLayout>
                      <LatestNewsPage />
                    </PublicLayout>
                  </LangRouteWrapper>
                }
              />
              <Route
                path="/:lang/category/:categorySlug"
                element={
                  <LangRouteWrapper>
                    <PublicLayout>
                      <CategoryPage />
                    </PublicLayout>
                  </LangRouteWrapper>
                }
              />
              <Route
                path="/:lang/news/:slug"
                element={
                  <LangRouteWrapper>
                    <PublicLayout>
                      <ArticleDetailPage />
                    </PublicLayout>
                  </LangRouteWrapper>
                }
              />
              <Route
                path="/:lang/search"
                element={
                  <LangRouteWrapper>
                    <PublicLayout>
                      <SearchResultsPage />
                    </PublicLayout>
                  </LangRouteWrapper>
                }
              />
              <Route
                path="/:lang/trending"
                element={
                  <LangRouteWrapper>
                    <PublicLayout>
                      <TrendingPage />
                    </PublicLayout>
                  </LangRouteWrapper>
                }
              />
              <Route
                path="/:lang/about"
                element={
                  <LangRouteWrapper>
                    <PublicLayout>
                      <AboutUsPage />
                    </PublicLayout>
                  </LangRouteWrapper>
                }
              />
              <Route
                path="/:lang/contact"
                element={
                  <LangRouteWrapper>
                    <PublicLayout>
                      <ContactUsPage />
                    </PublicLayout>
                  </LangRouteWrapper>
                }
              />
              <Route
                path="/:lang/editorial-policy"
                element={
                  <LangRouteWrapper>
                    <PublicLayout>
                      <EditorialPolicyPage />
                    </PublicLayout>
                  </LangRouteWrapper>
                }
              />
              <Route
                path="/:lang/privacy"
                element={
                  <LangRouteWrapper>
                    <PublicLayout>
                      <PrivacyPolicyPage />
                    </PublicLayout>
                  </LangRouteWrapper>
                }
              />
              <Route
                path="/:lang/terms"
                element={
                  <LangRouteWrapper>
                    <PublicLayout>
                      <TermsPage />
                    </PublicLayout>
                  </LangRouteWrapper>
                }
              />
              <Route
                path="/:lang/disclaimer"
                element={
                  <LangRouteWrapper>
                    <PublicLayout>
                      <DisclaimerPage />
                    </PublicLayout>
                  </LangRouteWrapper>
                }
              />
              <Route
                path="/:lang/rss"
                element={<Navigate to="/" replace />}
              />

              {/* =========================================
                  FALLBACK PUBLIC SHORTHAND REDIRECTS
                  ========================================= */}
              <Route path="/latest" element={<Navigate to="/en/latest" replace />} />
              <Route path="/trending" element={<Navigate to="/en/trending" replace />} />
              <Route path="/search" element={<Navigate to="/en/search" replace />} />
              <Route path="/about" element={<Navigate to="/en/about" replace />} />
              <Route path="/contact" element={<Navigate to="/en/contact" replace />} />
              <Route path="/privacy" element={<Navigate to="/en/privacy" replace />} />
              <Route path="/terms" element={<Navigate to="/en/terms" replace />} />
              <Route path="/editorial-policy" element={<Navigate to="/en/editorial-policy" replace />} />
              <Route path="/disclaimer" element={<Navigate to="/en/disclaimer" replace />} />
              <Route path="/rss" element={<Navigate to="/" replace />} />

              {/* =========================================
                  ADMIN STUDIO ROUTES
                  ========================================= */}
              <Route path="/admin/login" element={<AdminLoginPage />} />

              <Route
                path="/admin"
                element={
                  <ProtectedAdminRoute>
                    <Navigate to="/admin/dashboard" replace />
                  </ProtectedAdminRoute>
                }
              />
              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedAdminRoute>
                    <AdminDashboardPage />
                  </ProtectedAdminRoute>
                }
              />
              <Route
                path="/admin/articles"
                element={
                  <ProtectedAdminRoute>
                    <AdminArticlesListPage />
                  </ProtectedAdminRoute>
                }
              />
              <Route
                path="/admin/articles/new"
                element={
                  <ProtectedAdminRoute>
                    <AdminArticleEditorPage />
                  </ProtectedAdminRoute>
                }
              />
              <Route
                path="/admin/articles/edit/:id"
                element={
                  <ProtectedAdminRoute>
                    <AdminArticleEditorPage />
                  </ProtectedAdminRoute>
                }
              />
              <Route
                path="/admin/categories"
                element={
                  <ProtectedAdminRoute>
                    <AdminCategoriesPage />
                  </ProtectedAdminRoute>
                }
              />
              <Route
                path="/admin/breaking-news"
                element={
                  <ProtectedAdminRoute>
                    <AdminBreakingNewsPage />
                  </ProtectedAdminRoute>
                }
              />
              <Route
                path="/admin/authors"
                element={
                  <ProtectedAdminRoute>
                    <AdminAuthorsPage />
                  </ProtectedAdminRoute>
                }
              />
              <Route
                path="/admin/settings"
                element={
                  <ProtectedAdminRoute>
                    <AdminSettingsPage />
                  </ProtectedAdminRoute>
                }
              />
              <Route
                path="/admin/rss"
                element={
                  <ProtectedAdminRoute>
                    <RssFeedPage />
                  </ProtectedAdminRoute>
                }
              />

              {/* =========================================
                  404 CATCH-ALL
                  ========================================= */}
              <Route
                path="*"
                element={
                  <PublicLayout>
                    <NotFoundPage />
                  </PublicLayout>
                }
              />
            </Routes>
          </Router>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
};
