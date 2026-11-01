/**
 * SAVE THE SAHYADRI — FAST EVIDENCE PREVIEW MODAL (32,490 TREES AT RISK)
 * 
 * - Fast view of on-ground documentation photos from the Karjat corridor.
 * - Strictly square format (1:1 aspect ratio).
 * - Cycles rapidly through 12 verified photos.
 * - Auto-finishes and closes in exactly 10 seconds.
 * - Prominent heading: "32,490 TREES AT RISK".
 */

export const AT_RISK_IMAGES = [
  '/images/at-risk/1.PNG',
  '/images/at-risk/2.PNG',
  '/images/at-risk/3.PNG',
  '/images/at-risk/4.PNG',
  '/images/at-risk/5.PNG',
  '/images/at-risk/6.PNG',
  '/images/at-risk/7.PNG',
  '/images/at-risk/8.PNG',
  '/images/at-risk/9.PNG',
  '/images/at-risk/10.PNG',
  '/images/at-risk/11.PNG',
  '/images/at-risk/12.PNG'
];

import { t } from '../utils/i18n.js';

let previewTimeout = null;
let cycleInterval = null;
let countdownInterval = null;
let keydownHandler = null;

/**
 * Preload all at-risk images in browser memory for instant, lag-free cycling
 */
export function preloadAtRiskImages() {
  if (typeof window === 'undefined') return;
  AT_RISK_IMAGES.forEach((src) => {
    const img = new Image();
    img.src = src;
  });
}

/**
 * Closes and destroys the fast preview modal cleanly, resetting all timers
 */
export function closeFastPreviewModal() {
  if (previewTimeout) {
    clearTimeout(previewTimeout);
    previewTimeout = null;
  }
  if (cycleInterval) {
    clearInterval(cycleInterval);
    cycleInterval = null;
  }
  if (countdownInterval) {
    clearInterval(countdownInterval);
    countdownInterval = null;
  }
  if (keydownHandler) {
    window.removeEventListener('keydown', keydownHandler);
    keydownHandler = null;
  }

  const existing = document.getElementById('sahyadri-fast-preview-modal-root');
  if (existing) {
    existing.classList.add('opacity-0', 'transition-opacity', 'duration-300');
    setTimeout(() => {
      if (existing.parentNode) existing.parentNode.removeChild(existing);
      document.body.classList.remove('overflow-hidden');
    }, 300);
  }
}

/**
 * Opens the 10-second fast square photo preview modal
 */
export function openFastPreviewModal(onPledgeClick) {
  closeFastPreviewModal();

  const totalImages = AT_RISK_IMAGES.length;
  const totalDurationMs = 10000; // Exactly 10 seconds
  const slideDurationMs = totalDurationMs / totalImages; // ~833ms per image

  let currentIndex = 0;
  let remainingSec = 10;

  const modalContainer = document.createElement('div');
  modalContainer.id = 'sahyadri-fast-preview-modal-root';
  modalContainer.className = 'fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 animate-fadeIn select-none';
  modalContainer.setAttribute('role', 'dialog');
  modalContainer.setAttribute('aria-modal', 'true');
  modalContainer.setAttribute('aria-label', '32,490 Trees at Risk Fast Preview');

  // Generate 12 top story-segment progress bars
  const storyBarsHtml = AT_RISK_IMAGES.map((_, i) => `
    <div class="flex-1 h-1 sm:h-1.5 rounded-none bg-white/20 overflow-hidden">
      <div id="fast-bar-${i}" class="h-full bg-emerald-400 transition-all duration-300" style="width: ${i === 0 ? '100%' : '0%'}"></div>
    </div>
  `).join('');

  modalContainer.innerHTML = `
    <!-- Dark Backdrop -->
    <div id="fast-preview-backdrop" class="fixed inset-0 bg-black/90 backdrop-blur-md transition-opacity"></div>

    <!-- Modal Card (Sharp Corners, No Curve) -->
    <div class="relative w-full max-w-[360px] sm:max-w-[420px] rounded-none bg-[#05130A] border border-emerald-500/35 shadow-2xl shadow-emerald-950/60 p-3.5 sm:p-5 z-10 flex flex-col items-center text-center overflow-hidden">
      
      <!-- Top Story-Style Segment Bars (10s overall tracking) -->
      <div class="w-full flex items-center gap-1 sm:gap-1.5 mb-2 sm:mb-2.5">
        ${storyBarsHtml}
      </div>

      <!-- Top Action Row (Clean Close Button) -->
      <div class="w-full flex items-center justify-end mb-1">
        <button 
          id="fast-preview-close-btn"
          aria-label="Close fast preview" 
          title="Close (Esc)"
          class="w-7 h-7 rounded-none bg-emerald-950/90 hover:bg-emerald-900 border border-emerald-500/40 text-slate-300 hover:text-white flex items-center justify-center text-xs font-bold transition-all cursor-pointer shadow-sm active:scale-95"
        >
          ✕
        </button>
      </div>

      <!-- Main Heading: 32,490 TREES AT RISK (No gradient, only RISK in solid green) -->
      <div class="mb-2 sm:mb-2.5">
        <h2 class="font-heading font-black text-xl sm:text-2xl text-white tracking-tight uppercase leading-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
          ${t('fastPreview.treesAtRiskPrefix', '32,490 TREES AT')} <span class="text-[#00FF87]">${t('fastPreview.riskHighlight', 'RISK')}</span>
        </h2>
        <p class="text-[11px] sm:text-xs text-slate-400 font-mono mt-0.5">
          ${t('fastPreview.corridorSubtitle', 'Karjat Biodiversity Corridor • Western Ghats')}
        </p>
      </div>

      <!-- SQUARE PHOTO CONTAINER (1:1 Aspect Ratio, Sharp Corners) -->
      <div class="relative w-full aspect-square rounded-none overflow-hidden bg-black/90 border border-emerald-500/30 shadow-inner flex items-center justify-center my-1 group">
        
        <!-- Ambient Blurred Background of current photo -->
        <img 
          id="fast-preview-bg" 
          src="${AT_RISK_IMAGES[0]}" 
          alt="" 
          class="absolute inset-0 w-full h-full object-cover blur-xl opacity-35 scale-110 pointer-events-none transition-all duration-300" 
        />

        <!-- Active Square Photo -->
        <img 
          id="fast-preview-img" 
          src="${AT_RISK_IMAGES[0]}" 
          alt="Documented tree marked for felling in Karjat Sahyadri forest" 
          class="relative z-10 w-full h-full object-cover select-none transition-opacity duration-200"
        />


        <!-- Bottom Description Bar inside Square -->
        <div class="absolute bottom-0 inset-x-0 p-2.5 sm:p-3 bg-gradient-to-t from-black/95 via-black/70 to-transparent z-20 text-left">
          <p class="text-[11px] sm:text-xs text-white font-medium drop-shadow-md flex items-center gap-1.5">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0"></span>
            <span>${t('fastPreview.photoCaption', 'Trees marked for felling in ancient forest zone')}</span>
          </p>
        </div>
      </div>

      <!-- Bottom Actions (Sharp Corners) -->
      <div class="w-full mt-3 flex items-center justify-between gap-2.5">
        <button 
          id="fast-preview-skip-btn"
          class="px-3.5 py-1.5 rounded-none bg-emerald-950/70 hover:bg-emerald-900 border border-emerald-500/25 text-slate-400 hover:text-slate-200 text-xs font-mono transition-all cursor-pointer"
        >
          ${t('fastPreview.skipBtn', 'Skip (Esc)')}
        </button>

        <button 
          id="fast-preview-pledge-btn"
          class="btn-nature-cta flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-none bg-gradient-to-r from-emerald-500 to-emerald-400 hover:from-emerald-400 hover:to-emerald-300 text-black font-heading font-extrabold text-xs tracking-wider uppercase shadow-emerald-glow-sm transition-all cursor-pointer active:scale-95"
        >
          <span>${t('fastPreview.pledgeCta', 'I STAND WITH SAHYADRI')}</span>
          <span>→</span>
        </button>
      </div>

    </div>
  `;

  document.body.appendChild(modalContainer);
  document.body.classList.add('overflow-hidden');

  const backdrop = modalContainer.querySelector('#fast-preview-backdrop');
  const closeBtn = modalContainer.querySelector('#fast-preview-close-btn');
  const skipBtn = modalContainer.querySelector('#fast-preview-skip-btn');
  const pledgeBtn = modalContainer.querySelector('#fast-preview-pledge-btn');
  const imgEl = modalContainer.querySelector('#fast-preview-img');
  const bgEl = modalContainer.querySelector('#fast-preview-bg');
  const numEl = modalContainer.querySelector('#fast-preview-num');
  const countdownEl = modalContainer.querySelector('#fast-preview-countdown');

  // Dismiss listeners
  if (backdrop) backdrop.addEventListener('click', closeFastPreviewModal);
  if (closeBtn) closeBtn.addEventListener('click', closeFastPreviewModal);
  if (skipBtn) skipBtn.addEventListener('click', closeFastPreviewModal);

  // Pledge button
  if (pledgeBtn) {
    pledgeBtn.addEventListener('click', () => {
      closeFastPreviewModal();
      if (typeof onPledgeClick === 'function') {
        onPledgeClick();
      } else if (window.__sahyadriOpenJoinModal) {
        window.__sahyadriOpenJoinModal();
      }
    });
  }

  // Keyboard dismiss (Escape)
  keydownHandler = (e) => {
    if (e.key === 'Escape') closeFastPreviewModal();
  };
  window.addEventListener('keydown', keydownHandler);

  // 1-second countdown clock update
  countdownInterval = setInterval(() => {
    remainingSec -= 1;
    if (countdownEl) {
      countdownEl.textContent = `${Math.max(0, remainingSec)}s`;
    }
  }, 1000);

  // Fast image cycling (~833ms each, completing in 10s)
  cycleInterval = setInterval(() => {
    currentIndex += 1;
    if (currentIndex >= totalImages) {
      // Finished all 12 images
      clearInterval(cycleInterval);
      cycleInterval = null;
      return;
    }

    // Update story segment bars
    const bar = modalContainer.querySelector(`#fast-bar-${currentIndex}`);
    if (bar) bar.style.width = '100%';

    // Update image
    const nextSrc = AT_RISK_IMAGES[currentIndex];
    if (imgEl) {
      imgEl.src = nextSrc;
    }
    if (bgEl) {
      bgEl.src = nextSrc;
    }
    if (numEl) {
      numEl.textContent = String(currentIndex + 1);
    }
  }, slideDurationMs);

  // Auto-finish and close modal at exactly 10 seconds
  previewTimeout = setTimeout(() => {
    closeFastPreviewModal();
  }, totalDurationMs);
}
