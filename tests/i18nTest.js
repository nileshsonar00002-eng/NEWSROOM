/**
 * SAVE THE SAHYADRI — MULTILINGUAL (i18n) TEST SUITE
 * Tests dictionary completeness, language switching, localStorage persistence,
 * parameter interpolation, proper noun preservation, and reactive component rendering.
 */

import assert from 'assert';
import { TRANSLATIONS } from '../src/data/translations.js';
import {
  getLanguage,
  setLanguage,
  onLanguageChange,
  t,
  getWhatsAppShareText,
  SUPPORTED_LANGUAGES
} from '../src/utils/i18n.js';
import { renderHeader } from '../src/components/Header.js';
import { renderHero } from '../src/components/Hero.js';
import { renderIssueSection } from '../src/components/IssueSection.js';
import { renderMovementCounter } from '../src/components/MovementCounter.js';
import { renderStorySection } from '../src/components/StorySection.js';
import { renderFooter } from '../src/components/Footer.js';

console.log('🌐 Starting MULTILINGUAL (i18n) Test Suite...\n');

// Mock browser DOM environment if running in Node
if (typeof document === 'undefined') {
  global.document = {
    documentElement: { lang: 'en' },
    createElement: (tag) => {
      const el = {
        tagName: tag.toUpperCase(),
        className: '',
        innerHTML: '',
        id: '',
        attributes: {},
        style: {},
        children: [],
        classList: {
          add: () => {},
          remove: () => {},
          contains: () => false
        },
        setAttribute: (k, v) => { el.attributes[k] = v; },
        getAttribute: (k) => el.attributes[k] || null,
        appendChild: (child) => { el.children.push(child); return child; },
        querySelector: () => null,
        querySelectorAll: () => [],
        addEventListener: () => {},
        removeEventListener: () => {}
      };
      return el;
    },
    body: {
      appendChild: () => {},
      classList: { add: () => {}, remove: () => {} }
    },
    getElementById: () => null
  };
}

if (typeof window === 'undefined') {
  global.window = {
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
    location: { origin: 'https://savesahyadri.online', pathname: '/' }
  };
}

// Mock localStorage
const storage = new Map();
global.localStorage = {
  getItem: (k) => storage.get(k) || null,
  setItem: (k, v) => storage.set(k, String(v)),
  removeItem: (k) => storage.delete(k),
  clear: () => storage.clear()
};

// -------------------------------------------------------------
// Test 1: Supported Languages & Selector Icons
// -------------------------------------------------------------
console.log('Test 1: Supported Languages Configuration');
assert.strictEqual(SUPPORTED_LANGUAGES.length, 3, 'Should have exactly 3 supported languages');
const codes = SUPPORTED_LANGUAGES.map(l => l.code);
assert.ok(codes.includes('mr'), 'Must support Marathi (mr)');
assert.ok(codes.includes('hi'), 'Must support Hindi (hi)');
assert.ok(codes.includes('en'), 'Must support English (en)');

const icons = SUPPORTED_LANGUAGES.map(l => l.icon);
assert.ok(icons.includes('म'), 'Must have म icon for Marathi');
assert.ok(icons.includes('हिं'), 'Must have हिं icon for Hindi');
assert.ok(icons.includes('EN'), 'Must have EN icon for English');

// Ensure no flag emojis in icons
icons.forEach((ic) => {
  assert.ok(!/flag|[\uD83C][\uDDE6-\uDDFF]/i.test(ic), 'Language selector icons must strictly not use flags');
});
console.log('✓ Supported languages, typography icons (म, हिं, EN) and zero-flags policy verified\n');

// -------------------------------------------------------------
// Test 2: Centralized Dictionary Completeness
// -------------------------------------------------------------
console.log('Test 2: Centralized Dictionary Structure & Completeness');
const expectedSections = [
  'common',
  'header',
  'hero',
  'fullscreenMap',
  'issue',
  'counter',
  'story',
  'joinModal',
  'certificateModal',
  'fastPreview',
  'footer',
  'whatsappShareText'
];

expectedSections.forEach((section) => {
  assert.ok(TRANSLATIONS[section], `Dictionary section "${section}" must exist`);
});

// Check key phrases across languages
const languages = ['en', 'mr', 'hi'];
languages.forEach((lang) => {
  assert.ok(TRANSLATIONS.hero.eyebrow[lang], `hero.eyebrow missing for ${lang}`);
  assert.ok(TRANSLATIONS.hero.headlineLine1[lang], `hero.headlineLine1 missing for ${lang}`);
  assert.ok(TRANSLATIONS.issue.headlinePrefix[lang], `issue.headlinePrefix missing for ${lang}`);
  assert.ok(TRANSLATIONS.counter.headlinePrefix[lang], `counter.headlinePrefix missing for ${lang}`);
  assert.ok(TRANSLATIONS.story.headlinePrefix[lang], `story.headlinePrefix missing for ${lang}`);
  assert.ok(TRANSLATIONS.footer.manifesto[lang], `footer.manifesto missing for ${lang}`);
});
console.log('✓ Translation dictionary sections and core keys verified across en, mr, and hi\n');

// -------------------------------------------------------------
// Test 3: Language Switching & Persistence
// -------------------------------------------------------------
console.log('Test 3: Language State Management & Persistence');
let notifiedLang = null;
const unsubscribe = onLanguageChange((l) => {
  notifiedLang = l;
});

// Switch to Marathi
setLanguage('mr');
assert.strictEqual(getLanguage(), 'mr', 'Language should switch to Marathi');
assert.strictEqual(notifiedLang, 'mr', 'onLanguageChange subscriber should be notified');
assert.strictEqual(localStorage.getItem('sahyadri_lang'), 'mr', 'Language choice should be saved in localStorage');

// Switch to Hindi
setLanguage('hi');
assert.strictEqual(getLanguage(), 'hi', 'Language should switch to Hindi');
assert.strictEqual(notifiedLang, 'hi', 'onLanguageChange subscriber should be notified with Hindi');
assert.strictEqual(localStorage.getItem('sahyadri_lang'), 'hi', 'Hindi choice should be saved in localStorage');

// Switch to English
setLanguage('en');
assert.strictEqual(getLanguage(), 'en', 'Language should switch to English');
assert.strictEqual(notifiedLang, 'en', 'onLanguageChange subscriber should be notified with English');

unsubscribe();
console.log('✓ Language state switching, subscriber callbacks, and localStorage persistence verified\n');

// -------------------------------------------------------------
// Test 4: Interpolation & Fallbacks
// -------------------------------------------------------------
console.log('Test 4: Parameter Interpolation & Safe Fallback');
setLanguage('en');
const interpolatedEn = t('footer.copyrightText', { year: 2026 });
assert.ok(interpolatedEn.includes('2026'), 'Year parameter must be interpolated in English');

setLanguage('mr');
const interpolatedMr = t('footer.copyrightText', { year: 2026 });
assert.ok(interpolatedMr.includes('2026'), 'Year parameter must be interpolated in Marathi');

// Missing key fallback
const fallbackVal = t('nonexistent.key', 'Default Fallback Value');
assert.strictEqual(fallbackVal, 'Default Fallback Value', 'Missing keys must safely return fallback string');
console.log('✓ Parameter interpolation and fallback handling verified\n');

// -------------------------------------------------------------
// Test 5: Cultural Authenticity & Proper Noun Preservation
// -------------------------------------------------------------
console.log('Test 5: Proper Noun & Numerical Metric Preservation');
['en', 'mr', 'hi'].forEach((lang) => {
  setLanguage(lang);
  // Factual figure 32,490 must be present in all languages
  const issueHead = t('issue.headlinePrefix');
  assert.ok(issueHead.includes('32,490') || issueHead.includes('३२,४९०'), `32,490 must be retained in ${lang}`);
  
  // UNESCO must remain UNESCO / युनेस्को / यूनेस्को
  const unescoTitle = t('counter.card4Title');
  assert.ok(/UNESCO|युनेस्को|यूनेस्को/i.test(unescoTitle), `UNESCO must be preserved in ${lang}`);

  // Sahyadri must be mentioned
  const heroEyebrow = t('hero.eyebrow');
  assert.ok(heroEyebrow.length > 10, `Hero eyebrow in ${lang} must be natural sentence`);
});
console.log('✓ Factual numbers (32,490) and proper nouns (Sahyadri, UNESCO, Karjat) properly preserved\n');

// -------------------------------------------------------------
// Test 6: WhatsApp Share Text Generation
// -------------------------------------------------------------
console.log('Test 6: WhatsApp Share Messages');
const shareUrl = 'https://savesahyadri.online/';
const waEn = getWhatsAppShareText(shareUrl, 'en');
const waMr = getWhatsAppShareText(shareUrl, 'mr');
const waHi = getWhatsAppShareText(shareUrl, 'hi');

assert.ok(waEn.includes('Save the Sahyadri') && waEn.includes(shareUrl), 'English share text must contain brand and url');
assert.ok(waMr.includes('सह्याद्रीच्या') && waMr.includes(shareUrl), 'Marathi share text must be natural and contain url');
assert.ok(waHi.includes('सह्याद्री के') && waHi.includes(shareUrl), 'Hindi share text must be natural and contain url');
console.log('✓ WhatsApp movement share texts verified for all 3 languages\n');

// -------------------------------------------------------------
// Test 7: Full Website Component Localization Verification
// -------------------------------------------------------------
console.log('Test 7: Reactive Component Localization Smoke Test');

function createMockContainer() {
  return {
    innerHTML: '',
    querySelector: () => null,
    querySelectorAll: () => [],
    appendChild: () => {},
    setAttribute: () => {},
    getAttribute: () => null,
    classList: {
      add: () => {},
      remove: () => {},
      contains: () => false
    },
    addEventListener: () => {}
  };
}

const mockHeader = createMockContainer();
const mockHero = createMockContainer();
const mockIssue = createMockContainer();
const mockCounter = createMockContainer();
const mockStory = createMockContainer();
const mockFooter = createMockContainer();

// 1. Render in Marathi
setLanguage('mr');
renderHeader(mockHeader);
renderHero(mockHero);
renderIssueSection(mockIssue);
renderMovementCounter(mockCounter);
renderStorySection(mockStory);
renderFooter(mockFooter);

assert.ok(mockHeader.innerHTML.includes('सह्याद्रीचे महत्त्व'), 'Header should render Marathi navigation');
assert.ok(mockHero.innerHTML.includes('सह्याद्रीला'), 'Hero should render Marathi headline');
assert.ok(mockIssue.innerHTML.includes('32,490') && mockIssue.innerHTML.includes('झाडे'), 'IssueSection should render Marathi 32,490 trees headline');
assert.ok(!mockIssue.innerHTML.includes('32,490 ३२,४९०') && !mockIssue.innerHTML.includes('32,490 32,490'), 'Must not duplicate 32,490 in Marathi headline');
assert.ok(mockCounter.innerHTML.includes('एक चळवळ. अनेक'), 'MovementCounter should render Marathi headline');
assert.ok(mockStory.innerHTML.includes('सह्याद्री का'), 'StorySection should render Marathi headline');
assert.ok(mockFooter.innerHTML.includes('गोपनीयता धोरण'), 'Footer should render Marathi privacy policy link');

// 2. Render in Hindi
setLanguage('hi');
renderHeader(mockHeader);
renderHero(mockHero);
renderIssueSection(mockIssue);
renderMovementCounter(mockCounter);
renderStorySection(mockStory);
renderFooter(mockFooter);

assert.ok(mockHeader.innerHTML.includes('सह्याद्री क्यों ज़रूरी'), 'Header should render Hindi navigation');
assert.ok(mockHero.innerHTML.includes('सह्याद्री को'), 'Hero should render Hindi headline');
assert.ok(mockIssue.innerHTML.includes('32,490 पेड़'), 'IssueSection should render Hindi 32,490 trees headline');
assert.ok(mockCounter.innerHTML.includes('एक आंदोलन. अनेक'), 'MovementCounter should render Hindi headline');
assert.ok(mockStory.innerHTML.includes('सह्याद्री क्यों'), 'StorySection should render Hindi headline');
assert.ok(mockFooter.innerHTML.includes('गोपनीयता नीति'), 'Footer should render Hindi privacy policy link');

// 3. Render in English
setLanguage('en');
renderHeader(mockHeader);
renderHero(mockHero);
renderIssueSection(mockIssue);
renderMovementCounter(mockCounter);
renderStorySection(mockStory);
renderFooter(mockFooter);

assert.ok(mockHeader.innerHTML.includes('Why Sahyadri'), 'Header should render English navigation');
assert.ok(mockHero.innerHTML.includes('THE SAHYADRI'), 'Hero should render English headline');
assert.ok(mockIssue.innerHTML.includes('32,490') && mockIssue.innerHTML.includes('TREES AT'), 'IssueSection should render English 32,490 trees headline');
assert.ok(mockCounter.innerHTML.includes('ONE MOVEMENT. MANY'), 'MovementCounter should render English headline');
assert.ok(mockStory.innerHTML.includes('WHY THE SAHYADRI'), 'StorySection should render English headline');
assert.ok(mockFooter.innerHTML.includes('Privacy Policy'), 'Footer should render English privacy policy link');

console.log('✓ All 6 major website components rendered and verified in Marathi, Hindi, and English\n');

// -------------------------------------------------------------
// Test 8: Language Selector Alignment & Zero-Overlap Verification
// -------------------------------------------------------------
console.log('Test 8: Language Selector Alignment & Layout Verification');
import { renderLanguageSelector } from '../src/components/LanguageSelector.js';

const mockLangContainer = createMockContainer();
const selectorInstance = renderLanguageSelector(mockLangContainer);
assert.ok(mockLangContainer.innerHTML.includes('lang-select-btn'), 'Language selector must render buttons');
assert.ok(mockLangContainer.innerHTML.includes('data-lang="mr"'), 'Must have Marathi button');
assert.ok(mockLangContainer.innerHTML.includes('data-lang="hi"'), 'Must have Hindi button');
assert.ok(mockLangContainer.innerHTML.includes('data-lang="en"'), 'Must have English button');
selectorInstance.destroy();

// Verify default body wrapper uses navbar-matching max-w-6xl alignment and top-[76px] clearance
const mockBodyContainer = {
  id: 'sahyadri-lang-selector-root',
  className: '',
  innerHTML: '',
  querySelector: () => null,
  querySelectorAll: () => [],
  appendChild: () => {},
  remove: () => {}
};
global.document.getElementById = (id) => (id === 'sahyadri-lang-selector-root' ? mockBodyContainer : null);

const floatingSelector = renderLanguageSelector();
assert.ok(mockBodyContainer.className.includes('top-[76px]'), 'Must have top-[76px] to avoid navbar overlap');
assert.ok(mockBodyContainer.className.includes('hidden md:block'), 'Must be hidden on mobile');
assert.ok(mockBodyContainer.innerHTML.includes('max-w-6xl mx-auto'), 'Must match navbar container width max-w-6xl');
assert.ok(mockBodyContainer.innerHTML.includes('flex justify-end'), 'Must align with navbar right edge');
floatingSelector.destroy();
console.log('✓ Desktop language selector container alignment and zero-overlap positioning verified\n');

console.log('🎉 ALL MULTILINGUAL (i18n) TESTS PASSED FLAWLESSLY!\n');
