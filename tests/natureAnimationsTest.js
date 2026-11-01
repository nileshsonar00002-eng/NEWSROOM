// Nature Animations Verification Test Suite

import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { initTreeCounter, initScrollReveals, initHeroHeadlineAnimation } from '../src/utils/natureAnimations.js';

console.log('🌿 Starting NATURE ANIMATIONS Test Suite...');

// Test 1: Verify CSS styles and keyframes in style.css
const styleCssPath = path.resolve(process.cwd(), 'src/style.css');
const cssContent = fs.readFileSync(styleCssPath, 'utf-8');

// Living Forest
assert.ok(cssContent.includes('.forest-mist-1'), 'Must contain forest-mist-1 layer');
assert.ok(cssContent.includes('.forest-mist-2'), 'Must contain forest-mist-2 layer');
assert.ok(cssContent.includes('.forest-sun-shimmer'), 'Must contain forest-sun-shimmer');
assert.ok(cssContent.includes('.nature-spore'), 'Must contain nature-spore particle class');
assert.ok(cssContent.includes('@keyframes mistDrift1'), 'Must contain mistDrift1 keyframe');
assert.ok(cssContent.includes('@keyframes sunShimmer'), 'Must contain sunShimmer keyframe');
assert.ok(cssContent.includes('@keyframes sporeFloat'), 'Must contain sporeFloat keyframe');
console.log('✓ Test 1: Living Forest mist, shimmer & spore CSS keyframes verified');

// Satellite Map Entrance (Line 1 from Left, Line 2 from Right)
assert.ok(cssContent.includes('.map-headline-left'), 'Must contain map-headline-left class');
assert.ok(cssContent.includes('.map-headline-right'), 'Must contain map-headline-right class');
assert.ok(cssContent.includes('@keyframes slideInFromLeft'), 'Must contain slideInFromLeft keyframe');
assert.ok(cssContent.includes('@keyframes slideInFromRight'), 'Must contain slideInFromRight keyframe');
console.log('✓ Test 2: Fullscreen map dual line opposing entrance keyframes (left & right) verified');
assert.ok(cssContent.includes('.hero-line-left'), 'Must contain hero-line-left class');
assert.ok(cssContent.includes('.hero-line-right'), 'Must contain hero-line-right class');
console.log('✓ Test 2b: Hero dual line opposing slide classes (left & right) verified');

// Scroll Reveals & Stagger
assert.ok(cssContent.includes('.reveal-on-scroll'), 'Must contain reveal-on-scroll class');
assert.ok(cssContent.includes('.stagger-1'), 'Must contain stagger-1 delay class');
assert.ok(cssContent.includes('.stagger-2'), 'Must contain stagger-2 delay class');
assert.ok(cssContent.includes('.stagger-3'), 'Must contain stagger-3 delay class');
console.log('✓ Test 3: Scroll-based reveal and stagger delay classes verified');

// Cards & Buttons Interactions
assert.ok(cssContent.includes('.hover-lift'), 'Must contain hover-lift class');
assert.ok(cssContent.includes('.btn-nature-cta'), 'Must contain btn-nature-cta class');
assert.ok(cssContent.includes('@keyframes btnLightSweep'), 'Must contain btnLightSweep keyframe');
console.log('✓ Test 4: Card lift & button light sweep interactions verified');

// Accessibility & Performance
assert.ok(cssContent.includes('prefers-reduced-motion: reduce'), 'Must include prefers-reduced-motion media query');
assert.ok(cssContent.includes('@media (hover: hover) and (pointer: fine)'), 'Must separate desktop hover from touchscreens');
assert.ok(cssContent.includes('@media (hover: none) and (pointer: coarse)'), 'Must provide appropriate tap feedback on touchscreens');
assert.ok(cssContent.includes('@media (max-width: 640px)'), 'Must reduce particles/layers on mobile screens');
console.log('✓ Test 5: Accessibility, reduced-motion & mobile performance safeguards verified');

// Test 6: Nature animation functions execute cleanly in SSR/Node mock
global.document = {
  getElementById: (id) => {
    if (id === 'issue-tree-counter') {
      return {
        textContent: '32,490',
        getAttribute: () => '32490'
      };
    }
    return null;
  },
  querySelectorAll: () => []
};

global.window = {
  matchMedia: () => ({ matches: true })
};

assert.doesNotThrow(() => {
  initTreeCounter();
  initScrollReveals();
  initHeroHeadlineAnimation();
}, 'Nature animation controllers must initialize safely without throwing');
console.log('✓ Test 6: Controllers initialize safely in all environments');

console.log('\n🎉 ALL 6 NATURE ANIMATION TESTS PASSED FLAWLESSLY!\n');
