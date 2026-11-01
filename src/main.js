// SAVE THE SAHYADRI — MAIN APPLICATION ENTRYPOINT

import './style.css';
import { renderHeader } from './components/Header';
import { renderHero, updateHeroMapSupporters } from './components/Hero';
import { renderMovementCounter, updateCounterValues } from './components/MovementCounter';
import { renderIssueSection, openNewsSection, closeNewsSection, toggleNewsSection } from './components/IssueSection';
import { renderStorySection } from './components/StorySection';
import { renderFooter, updateFooterVisitorCount } from './components/Footer';
import { openJoinModal } from './components/JoinModal';
import { openShareCardModal } from './components/ShareCardModal';
import { openFastPreviewModal, preloadAtRiskImages } from './components/FastPreviewModal';
import { renderLanguageSelector } from './components/LanguageSelector';
import { onLanguageChange } from './utils/i18n';
import { subscribeToSupporters } from './services/supporterService';
import { trackVisitor, subscribeToVisitorCount } from './services/visitorService';
import { initNatureAnimations } from './utils/natureAnimations';

class SahyadriApp {
  constructor() {
    this.appEl = document.getElementById('app');
    this.currentSupportersData = {
      supporters: [],
      total: 0,
      uniqueCities: 0,
      isLive: false
    };
    this.unsubscribeSupporters = null;
    this.unsubscribeVisitors = null;
    this.unsubscribeLang = null;
    this.langSelectorCleanup = null;
    this.lastVisitorCount = 0;
    this.activeAdminApp = null;
  }

  init() {
    // Check initial route
    this.handleRoute();

    // Listen to hash changes (for routing to #admin and section anchors)
    window.addEventListener('hashchange', () => {
      this.handleRoute();
    });
  }

  async handleRoute() {
    const hash = window.location.hash;

    // Check if user requested the admin panel
    if (hash === '#admin') {
      this.tearDownWebsite();
      document.title = 'KHADDA Moderation HQ • Admin Panel';
      const { AdminApp } = await import('./adminApp');
      this.activeAdminApp = new AdminApp(this.appEl);
      this.activeAdminApp.init();
      return;
    }

    // Otherwise, render Save the Sahyadri platform
    if (this.activeAdminApp) {
      this.activeAdminApp.destroy();
      this.activeAdminApp = null;
    }

    document.title = 'SAVE THE SAHYADRI • Protect Maharashtra\'s Natural Heritage';
    this.renderWebsiteLayout();
  }

  tearDownWebsite() {
    if (this.unsubscribeSupporters) {
      try { this.unsubscribeSupporters(); } catch (_) {}
      this.unsubscribeSupporters = null;
    }
    if (this.unsubscribeVisitors) {
      try { this.unsubscribeVisitors(); } catch (_) {}
      this.unsubscribeVisitors = null;
    }
    if (this.unsubscribeLang) {
      try { this.unsubscribeLang(); } catch (_) {}
      this.unsubscribeLang = null;
    }
    if (this.langSelectorCleanup) {
      try { this.langSelectorCleanup.destroy(); } catch (_) {}
      this.langSelectorCleanup = null;
    }
    this.appEl.innerHTML = '';
  }

  renderWebsiteLayout() {
    // Scaffold DOM containers for each section
    this.appEl.innerHTML = `
      <div id="sahyadri-header-mount" class="sticky top-0 z-50 w-full pointer-events-none"></div>
      <main id="sahyadri-main-content" class="flex-1">
        <div id="sahyadri-hero-mount"></div>
        <div id="sahyadri-issue-mount"></div>
        <div id="sahyadri-counter-mount"></div>
        <div id="sahyadri-story-mount"></div>
      </main>
      <div id="sahyadri-footer-mount"></div>
    `;

    const mounts = {
      header: document.getElementById('sahyadri-header-mount'),
      hero: document.getElementById('sahyadri-hero-mount'),
      counter: document.getElementById('sahyadri-counter-mount'),
      issue: document.getElementById('sahyadri-issue-mount'),
      story: document.getElementById('sahyadri-story-mount'),
      footer: document.getElementById('sahyadri-footer-mount')
    };

    const handleOpenJoin = () => {
      openJoinModal((newSupporter) => {
        // Optimistically update map and counts
        this.currentSupportersData.supporters.unshift(newSupporter);
        this.currentSupportersData.total += 1;
        updateCounterValues(
          mounts.counter,
          this.currentSupportersData.total,
          this.currentSupportersData.uniqueCities
        );
        updateHeroMapSupporters(this.currentSupportersData.supporters);
      });
    };

    const handleOpenShare = (supporter) => {
      openShareCardModal(supporter || {
        displayName: 'Concerned Citizen',
        city: 'Maharashtra',
        state: 'India'
      });
    };

    // Global hooks
    window.__sahyadriOpenJoinModal = handleOpenJoin;
    window.__sahyadriOpenShareCard = handleOpenShare;
    window.__sahyadriOpenNewsSection = openNewsSection;
    window.__sahyadriCloseNewsSection = closeNewsSection;
    window.__sahyadriToggleNewsSection = toggleNewsSection;
    window.__sahyadriOpenFastPreview = () => openFastPreviewModal(handleOpenJoin);

    // Render static and initial components
    renderHeader(mounts.header, handleOpenJoin);
    renderHero(mounts.hero, handleOpenJoin, this.currentSupportersData);
    renderMovementCounter(mounts.counter, this.currentSupportersData);
    renderIssueSection(mounts.issue);
    renderStorySection(mounts.story, handleOpenJoin);
    renderFooter(mounts.footer, handleOpenJoin);

    // Mount premium floating Language Selector (म | हिं | EN) below navbar in top-right corner
    this.langSelectorCleanup = renderLanguageSelector();

    // Instant reactive language re-render across entire website without page reload
    this.unsubscribeLang = onLanguageChange(() => {
      renderHeader(mounts.header, handleOpenJoin);
      renderHero(mounts.hero, handleOpenJoin, this.currentSupportersData);
      renderMovementCounter(mounts.counter, this.currentSupportersData);
      renderIssueSection(mounts.issue);
      renderStorySection(mounts.story, handleOpenJoin);
      renderFooter(mounts.footer, handleOpenJoin);

      if (typeof this.lastVisitorCount === 'number') {
        updateFooterVisitorCount(mounts.footer, this.lastVisitorCount);
      }

      updateCounterValues(
        mounts.counter,
        this.currentSupportersData.total,
        this.currentSupportersData.uniqueCities
      );

      const heroSupporters = document.getElementById('hero-supporter-count');
      const heroCities = document.getElementById('hero-cities-count');
      if (heroSupporters) {
        heroSupporters.textContent = typeof this.currentSupportersData.total === 'number' ? this.currentSupportersData.total.toLocaleString('en-IN') : '0';
      }
      if (heroCities) {
        heroCities.textContent = this.currentSupportersData.uniqueCities.toString();
      }

      initNatureAnimations();
    });

    // Initialize subtle nature animations & scroll reveals
    initNatureAnimations();

    // Preload at-risk ground evidence photos & show 10-second fast square preview on arrival
    preloadAtRiskImages();
    setTimeout(() => {
      openFastPreviewModal(handleOpenJoin);
    }, 600);

    // Track unique session visitor in Firebase Firestore
    trackVisitor();

    // Subscribe to real-time live visitor counter
    this.unsubscribeVisitors = subscribeToVisitorCount((count) => {
      this.lastVisitorCount = count;
      updateFooterVisitorCount(mounts.footer, count);
    });

    // Subscribe to real-time Firestore database
    this.unsubscribeSupporters = subscribeToSupporters(
      (data) => {
        this.currentSupportersData = data;

        // Update Counter values
        updateCounterValues(mounts.counter, data.total, data.uniqueCities);

        // Update Hero stats badges
        const heroSupporters = document.getElementById('hero-supporter-count');
        const heroCities = document.getElementById('hero-cities-count');
        if (heroSupporters) {
          heroSupporters.textContent = typeof data.total === 'number' ? data.total.toLocaleString('en-IN') : '0';
        }
        if (heroCities) {
          heroCities.textContent = data.uniqueCities.toString();
        }

        // Update Hero Map Markers and connection arcs dynamically
        updateHeroMapSupporters(data.supporters);
      },
      (error) => {
        console.warn('[App] Realtime backend notice:', error.message);
      }
    );
  }
}

// Bootstrap Application
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    const app = new SahyadriApp();
    app.init();
  });
} else {
  const app = new SahyadriApp();
  app.init();
}
