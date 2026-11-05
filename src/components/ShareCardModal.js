/**
 * SAVE THE SAHYADRI — SHAREABLE SUPPORT CERTIFICATE GENERATOR
 * High-resolution canvas renderer & download manager for the official Certificate of Support.
 * Supports pristine 1024x1024 high-resolution display, PNG download, and WhatsApp movement sharing.
 */

import { t, getLanguage } from '../utils/i18n.js';

export function openShareCardModal(supporter = {}) {
  closeShareCardModal();

  const displayName = supporter.displayName || 'Citizen Supporter';
  const city = supporter.city || 'India';
  const state = supporter.state || 'Maharashtra';

  const modalContainer = document.createElement('div');
  modalContainer.id = 'sahyadri-share-modal-root';
  modalContainer.className = 'fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fadeIn';

  modalContainer.innerHTML = `
    <!-- Backdrop Blur -->
    <div id="share-modal-backdrop" class="fixed inset-0 bg-black/85 backdrop-blur-md"></div>

    <!-- Modal Dialog (Compact & Centered) -->
    <div 
      class="relative w-full max-w-lg rounded-2xl sm:rounded-3xl bg-[#06150E] border border-emerald-500/30 shadow-2xl p-4 sm:p-6 z-10 my-auto text-left transform transition-all overflow-hidden"
      role="dialog"
      aria-modal="true"
      aria-labelledby="share-modal-title"
    >
      <!-- Atmospheric Background Layer with Subtle Vignette -->
      <div class="absolute inset-0 z-0 pointer-events-none select-none overflow-hidden">
        <img 
          src="/images/certificate-of-support.jpg" 
          alt="" 
          class="w-full h-full object-cover object-center opacity-10 transform scale-110 filter blur-md brightness-75" 
          loading="eager"
        />
        <div class="absolute inset-0 bg-gradient-to-b from-[#06150E]/90 via-[#06150E]/95 to-[#06150E]"></div>
        <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.15)_0%,transparent_70%)]"></div>
        <div class="absolute inset-0 ring-1 ring-inset ring-emerald-500/20 rounded-2xl sm:rounded-3xl pointer-events-none"></div>
      </div>
      
      <!-- Close Button -->
      <button 
        id="share-modal-close-btn" 
        aria-label="Close modal" 
        class="absolute top-3.5 right-3.5 sm:top-5 sm:right-5 p-1.5 sm:p-2 rounded-lg sm:rounded-xl text-slate-400 hover:text-white bg-emerald-950/60 hover:bg-emerald-900/80 border border-emerald-500/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 cursor-pointer z-20 transition-colors"
      >
        <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <div class="relative z-10 space-y-3 sm:space-y-4">

        <!-- Modal Header -->
        <div class="space-y-1 pr-8">
          <div class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-400 text-[10px] sm:text-xs font-bold border border-emerald-500/30">
            <svg class="w-3.5 h-3.5 text-emerald-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
            <span>${t('certificateModal.badge', 'OFFICIAL CERTIFICATE')}</span>
          </div>
          <h2 id="share-modal-title" class="font-heading font-black text-xl sm:text-2xl text-white">
            ${t('certificateModal.titlePrefix', 'Certificate of')} <span class="text-[#00FF87]">${t('certificateModal.titleHighlight', 'Support')}</span>
          </h2>
          <p class="text-[11px] sm:text-xs text-slate-300">
            ${t('certificateModal.subtitle', 'Official verified certificate honoring your pledge for the Western Ghats & Sahyadri forests.')}
          </p>
        </div>

        <!-- Canvas / Certificate Preview Wrapper (Aspect 1:1 Square) -->
        <div class="relative w-full aspect-square max-h-[380px] sm:max-h-[440px] mx-auto flex items-center justify-center p-1 sm:p-1.5 rounded-2xl bg-[#030905] border border-emerald-500/30 overflow-hidden shadow-2xl">
          <canvas id="support-card-canvas" class="w-full h-full object-contain rounded-xl shadow-2xl cursor-pointer" title="Certificate of Support"></canvas>
          <div id="support-card-loading" class="absolute inset-0 flex items-center justify-center bg-[#04120A] rounded-xl transition-opacity duration-300">
            <div class="flex flex-col items-center gap-2">
              <div class="w-8 h-8 border-2 border-emerald-500/30 border-t-emerald-400 rounded-full animate-spin"></div>
              <span class="text-[11px] font-mono text-emerald-400">${t('certificateModal.loadingText', 'Loading Certificate...')}</span>
            </div>
          </div>
        </div>

        <!-- Sharing Action Buttons -->
        <div class="space-y-2.5 pt-1">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
            
            <!-- Download Button -->
            <button 
              id="btn-download-card" 
              class="py-3 px-4 rounded-xl font-heading font-bold text-xs sm:text-sm text-black bg-gradient-to-r from-emerald-400 to-emerald-300 hover:from-emerald-300 shadow-emerald-glow flex items-center justify-center gap-2 cursor-pointer transition-transform hover:-translate-y-0.5 active:scale-95"
            >
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              <span>${t('certificateModal.downloadBtn', 'Download Certificate')}</span>
            </button>

            <!-- WhatsApp Share Button -->
            <button 
              id="btn-whatsapp-share" 
              class="py-3 px-4 rounded-xl font-heading font-bold text-xs sm:text-sm text-white bg-[#25D366] hover:bg-[#20ba59] shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-transform hover:-translate-y-0.5 active:scale-95"
            >
              <svg class="w-4 h-4 text-white shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                <path d="M3 21l1.65 -3.8a9 9 0 1 1 3.4 2.9l-5.05 .9" />
                <path d="M9.5 9.5a1.5 1.5 0 0 1 1.8 -.4l1.2 .8a1 1 0 0 1 .3 1.1l-.4 .8a7 7 0 0 0 2.8 2.8l.8 -.4a1 1 0 0 1 1.1 .3l.8 1.2a1.5 1.5 0 0 1 -.4 1.8c-.8 .6 -1.8 .8 -2.7 .4c-2.8 -1.2 -5.2 -3.6 -6.4 -6.4c-.4 -.9 -.2 -1.9 .4 -2.7z" />
              </svg>
              <span>${t('certificateModal.whatsappBtn', 'Share on WhatsApp')}</span>
            </button>

          </div>
        </div>

      </div>

    </div>
  `;

  document.body.appendChild(modalContainer);
  document.body.classList.add('overflow-hidden');

  const closeBtn = modalContainer.querySelector('#share-modal-close-btn');
  const backdrop = modalContainer.querySelector('#share-modal-backdrop');
  const canvas = modalContainer.querySelector('#support-card-canvas');
  const loadingOverlay = modalContainer.querySelector('#support-card-loading');
  const btnDownload = modalContainer.querySelector('#btn-download-card');
  const btnWhatsApp = modalContainer.querySelector('#btn-whatsapp-share');

  // Preload Certificate Image for the canvas card
  const certImage = new Image();
  certImage.src = '/images/certificate-of-support.jpg';

  function renderCard() {
    if (!canvas) return;
    const width = 1024;
    const height = 1024;
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext ? canvas.getContext('2d') : null;
    if (!ctx) return;

    if (certImage.complete && certImage.naturalWidth > 0) {
      ctx.drawImage(certImage, 0, 0, width, height);
      if (loadingOverlay) loadingOverlay.classList.add('hidden');
    } else {
      ctx.fillStyle = '#06150E';
      ctx.fillRect(0, 0, width, height);
    }
  }

  certImage.onload = () => {
    renderCard();
  };

  if (certImage.complete) {
    renderCard();
  }

  closeBtn?.addEventListener('click', closeShareCardModal);
  backdrop?.addEventListener('click', closeShareCardModal);

  // ESC key listener
  const onKeyDown = (e) => {
    if (e.key === 'Escape') closeShareCardModal();
  };
  window.addEventListener('keydown', onKeyDown);
  modalContainer._escListener = onKeyDown;

  // Download Handler
  btnDownload?.addEventListener('click', () => {
    try {
      const link = document.createElement('a');
      link.download = `save-the-sahyadri-certificate-of-support.png`;
      link.href = canvas.toDataURL ? canvas.toDataURL('image/png') : '/images/certificate-of-support.jpg';
      link.click();
    } catch {
      const link = document.createElement('a');
      link.download = 'save-the-sahyadri-certificate-of-support.jpg';
      link.href = '/images/certificate-of-support.jpg';
      link.click();
    }
  });

  // WhatsApp Handler
  btnWhatsApp?.addEventListener('click', () => {
    const siteUrl = (typeof window !== 'undefined' && window.location)
      ? (window.location.origin + window.location.pathname)
      : 'https://savesahyadri.online/';

    const lang = getLanguage();
    let msgBody = '';
    if (lang === 'hi') {
      msgBody = `🌿 *Save the Sahyadri — Certificate of Support* 📜\n\n` +
        `मैंने सह्याद्री के जंगलों, वन्यजीवों और जैव विविधता की रक्षा के लिए अपना संकल्प दर्ज किया है। 💚🌳\n\n` +
        `32,490 पेड़ों और हमारे पश्चिमी घाटों को बचाने की इस मुहिम से जुड़ें और अपना Certificate of Support प्राप्त करें:\n\n` +
        `🌐 *Visit & Join the Movement:*\n` +
        `${siteUrl}\n\n` +
        `🚩 *हर हर महादेव!* • Save the Sahyadri Movement`;
    } else {
      msgBody = `🌿 *Save the Sahyadri — Certificate of Support* 📜\n\n` +
        `I have pledged to stand for the protection of forests, wildlife and the rich biodiversity of the Sahyadri. 💚🌳\n\n` +
        `Join the movement to protect 32,490 trees and our Western Ghats and receive your Certificate of Support:\n\n` +
        `🌐 *Visit & Join the Movement:*\n` +
        `${siteUrl}\n\n` +
        `🚩 *Har Har Mahadev!* • Save the Sahyadri Movement`;
    }

    const text = encodeURIComponent(msgBody);
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  });

  // Initial Card Render attempt
  renderCard();
}

export function closeShareCardModal() {
  const modal = document.getElementById('sahyadri-share-modal-root');
  if (modal) {
    if (modal._escListener) {
      window.removeEventListener('keydown', modal._escListener);
    }
    modal.remove();
    document.body.classList.remove('overflow-hidden');
  }
}
