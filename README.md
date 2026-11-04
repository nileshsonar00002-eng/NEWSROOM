# NEWSORA • News That Moves You
> Premium, Mobile-First Multilingual Digital News Publishing Platform

NEWSORA is an editorial digital news publishing platform engineered with React, TypeScript, Tailwind CSS, Vite, and Firebase. It provides verified journalism across **English**, **Hindi (हिंदी)**, and **Marathi (मराठी)** with independent translation workflows and a smartphone-optimized Admin Studio.

---

## 🚀 Key Features

### 1. Mobile-First Editorial Experience
- **Optimized for all viewports**: Tested on 320px, 360px, 375px, 390px, 412px, 430px mobile, 768px tablet, 1024px laptop, and 1440px desktop.
- **Compact Header**: NEWSORA text branding, quick segmented language switcher (`EN` | `हिं` | `मरा`), mobile hamburger drawer, and search bar.
- **Horizontally Scrollable Category Bar**: Smooth, drag-friendly navigation across all 14 news beats with zero horizontal overflow of the webpage.
- **Breaking News Ticker**: Top priority red/brand ticker with pulsing indicator, auto-cycle, and tap-to-read functionality.
- **Editorial Cards**: Large hero presentation, compact horizontal thumbnail cards for fast mobile thumb scrolling, and numbered trending lists.
- **Article Reader**: Comfortable paragraph spacing, 17–18px body font, 1.75 line height, real-time scroll reading progress bar, WhatsApp & Facebook sharing, and related stories.

### 2. True Multilingual Architecture (English, Hindi, Marathi)
- **Independent Translation Lifecycle**: Each article holds separate data for English (`en`), Hindi (`hi`), and Marathi (`mr`).
- **Individual Publishing Status**: You can publish English and Hindi while keeping Marathi in Draft, without blocking the article.
- **Unique Slugs & SEO**: Each language has its own URL slug (`/en/news/article-slug`, `/hi/news/article-slug`, `/mr/news/article-slug`), SEO title, and meta description.
- **Translation Fallback Alert**: If an article is not yet translated into the visitor's selected language, a friendly banner informs them and provides one-click links to available translations.
- **Hreflang Tags**: Injects `link rel="alternate" hreflang="..."` for search engine indexing.

### 3. Secure Admin Studio (Smartphone-Ready)
- **Operate 100% from Smartphone**: Cards instead of wide tables, minimum 44px touch targets, zero clipped elements.
- **WYSIWYG Rich Text Editor**: H1, H2, H3 headings, bold, italic, underline, bullet lists, numbered lists, blockquotes, hyperlinks, and raw HTML toggle.
- **Image Upload**: Upload directly to Firebase Storage with progress tracking, file type validation (JPEG, PNG, WebP), and 10MB limits.
- **Category Manager**: Add, edit, delete, and reorder categories with custom English, Hindi, and Marathi names.
- **Breaking News Manager**: Create urgent tickers, link to stories, toggle active status, and reorder.
- **Author Roster**: Manage correspondents, roles, bios, and profile avatars.
- **AdSense & Monetization Settings**: Configure Google AdSense publisher ID (`ca-pub-...`) and slot IDs across 5 key positions (Home Top, Article Intro, Article Mid, Article Bottom, Sidebar).

---

## 🛠️ Technology Stack

| Technology | Purpose |
| :--- | :--- |
| **React 19** | Modular UI component architecture |
| **TypeScript** | Type-safe data contracts and schema integrity |
| **Vite 6** | Fast development server and optimized chunk bundling |
| **Tailwind CSS 3** | Editorial design system with dark/light theme support |
| **React Router 7** | Multilingual dynamic client-side routing |
| **Firebase Auth** | Secure email/password admin authentication |
| **Cloud Firestore** | NoSQL document storage with composite indexes |
| **Firebase Storage** | High-performance media and image hosting |
| **Lucide Icons** | Lightweight SVG iconography |

---

## 📁 Project Structure

```
├── public/
│   ├── favicon.svg             # NEWSORA text/emblem favicon
│   ├── robots.txt              # Search engine crawler directives
│   └── sitemap.xml             # XML sitemap structure
├── src/
│   ├── components/
│   │   ├── admin/              # AdminLayout & AdminCard (mobile-optimized)
│   │   ├── common/             # Header, Footer, CategoryBar, BreakingNewsTicker,
│   │   │                       # NewsCard, AdBanner, Breadcrumbs, SEOHead,
│   │   │                       # ShareButtons, ReadingProgress
│   │   └── editor/             # Mobile-friendly RichTextEditor
│   ├── context/
│   │   ├── AuthContext.tsx     # Firebase admin auth session state
│   │   ├── LanguageContext.tsx # Language selector & i18n dictionary state
│   │   └── ThemeContext.tsx    # Light / Dark theme toggling
│   ├── i18n/
│   │   └── index.ts            # Complete UI strings in EN, HI, MR
│   ├── pages/
│   │   ├── admin/              # Dashboard, Articles, Editor, Categories,
│   │   │                       # Breaking News, Authors, Settings, Login
│   │   ├── HomePage.tsx        # 25-section complete editorial homepage
│   │   ├── ArticleDetailPage.tsx # Rich article reader with social share
│   │   ├── CategoryPage.tsx    # Dedicated category news archive
│   │   ├── LatestNewsPage.tsx  # Chronological news feed with filters
│   │   ├── TrendingPage.tsx    # Top 10 numbered trending stories
│   │   ├── SearchResultsPage.tsx # Keyword and topic search
│   │   ├── AboutUsPage.tsx     # Newsroom ethics and mission
│   │   ├── ContactUsPage.tsx   # News tip submission & grievance officer
│   │   ├── EditorialPolicyPage.tsx # Anti-scraping, fact-checking, correction policy
│   │   ├── PrivacyPolicyPage.tsx # Privacy & DPDP Act compliance
│   │   ├── TermsPage.tsx       # Terms of service
│   │   ├── DisclaimerPage.tsx  # Legal disclaimers
│   │   ├── RssFeedPage.tsx     # Live RSS 2.0 XML generator & reader
│   │   └── NotFoundPage.tsx    # Sleek 404 error page
│   ├── services/
│   │   ├── firebase.ts         # Firebase app, db, auth, and storage init
│   │   ├── authService.ts      # Admin login and session management
│   │   ├── articleService.ts   # Article CRUD, slug generation & uniqueness
│   │   ├── categoryService.ts  # Category management & seeding
│   │   ├── breakingNewsService.ts # Breaking news ticker service
│   │   ├── authorService.ts    # Author roster service
│   │   ├── storageService.ts   # Storage upload with progress
│   │   ├── settingsService.ts  # Site & AdSense configuration
│   │   ├── analyticsService.ts # Privacy-conscious view counters
│   │   └── seedService.ts      # Initial high-quality multilingual news
│   ├── types/
│   │   └── index.ts            # TypeScript interfaces
│   ├── App.tsx                 # Central routing configuration
│   ├── main.tsx                # React root mount
│   └── style.css               # Typography & Tailwind directives
├── firebase.json               # Firebase hosting & security configuration
├── firestore.rules             # Production Cloud Firestore security rules
├── storage.rules               # Production Firebase Storage security rules
├── firestore.indexes.json      # Composite Firestore query indexes
└── vite.config.js              # Vite configuration with chunk splitting
```

---

## ⚡ Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Ensure your Firebase configuration values are filled:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
VITE_SITE_URL=https://newsora.in
VITE_DEFAULT_LANGUAGE=en
VITE_ADMIN_PASSCODE=newsora2026
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:5174](http://localhost:5174) in your browser.

### 4. Build for Production
```bash
npm run build
```
Production assets are generated in the `dist/` directory.

---

## 🔐 Administrator Account Setup

1. Navigate to `/admin/login`.
2. To sign in with default administrator credentials during initial setup:
   - **Email**: `admin@newsora.in`
   - **Password**: `newsora2026`
3. In the Firebase Console under **Authentication**:
   - Enable the **Email/Password** sign-in provider.
   - Create an admin user with your production email and secure password.
   - In Firestore under `adminUsers/{uid}`, assign `role: "superadmin"`.

---

## 🌐 Firebase Hosting & Custom Domain Deployment

### 1. Deploy Security Rules & Hosting via Firebase CLI
```bash
firebase deploy --only firestore:rules,storage,hosting
```

### 2. Connecting a Custom Domain (e.g. `newsora.in`)
1. Go to the [Firebase Console](https://console.firebase.google.com/) > **Hosting**.
2. Click **Add Custom Domain** and enter `newsora.in` (and `www.newsora.in`).
3. Add the provided `A` records and `TXT` ownership verification records to your DNS registrar (GoDaddy, Namecheap, Cloudflare, etc.).
4. Firebase will automatically provision and renew a free **SSL certificate** within a few hours.

---

## 📜 Editorial & Legal Policies
NEWSORA includes full policy pages compliant with Indian IT Rules and international digital media transparency standards:
- `/en/editorial-policy`: Strict prohibition on scraping, fact-checking workflows, and corrections.
- `/en/privacy`: Privacy-first telemetry, no cross-site profiling.
- `/en/terms`: Terms and conditions of digital access.
- `/en/disclaimer`: Statutory non-liability and corrections contact.
- `/en/rss`: Live RSS 2.0 syndication feed.

---

© 2026 NEWSORA Digital Media. "News That Moves You."
