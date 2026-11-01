import { t } from '../utils/i18n.js';
/**
 * SAVE THE SAHYADRI — FOOTER
 * Clean, transparent footer with movement links, privacy policy, and campaign disclaimer.
 */

import { openPrivacyModal } from './InfoModals.js';

export function renderFooter(container, onJoinClick) {
  container.innerHTML = `
    <footer class="bg-[#020603] border-t border-emerald-500/20 text-slate-400 text-xs sm:text-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-12">
        
        <!-- Top Row: Brand & Links -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          <!-- Column 1: Brand & Manifesto (2 cols wide on desktop) -->
          <div class="lg:col-span-2 space-y-4">
            <div class="flex items-center gap-3">
              <div class="w-9 h-9 sm:w-10 sm:h-10 rounded-xl overflow-hidden bg-[#05392e] border border-emerald-500/30 flex items-center justify-center shrink-0 shadow-emerald-glow-sm">
                <img 
                  src="/images/logo.png" 
                  alt="Save the Sahyadri Logo" 
                  class="w-full h-full object-cover" 
                  loading="lazy"
                />
              </div>
              <span class="font-heading font-black text-xl text-white tracking-tight">
                SAVE THE SAHYADRI
              </span>
            </div>

            <p class="text-xs text-slate-300 leading-relaxed max-w-sm">
              ${t('footer.manifesto')}
            </p>

            <div class="pt-1">
              <button 
                id="footer-join-btn" 
                class="px-5 py-2.5 rounded-full text-xs font-heading font-bold text-black bg-gradient-to-r from-emerald-400 to-emerald-300 hover:from-emerald-300 shadow-emerald-glow transition-all cursor-pointer"
              >
                ${t('footer.standBtn')}
              </button>
            </div>
          </div>

          <!-- Column 2: Quick Navigation -->
          <div class="space-y-3">
            <h4 class="font-heading font-bold text-xs uppercase tracking-wider text-emerald-400">
              Movement
            </h4>
            <ul class="space-y-2 text-xs">
              <li><a href="#hero" class="hover:text-emerald-300 transition-colors">${t('footer.homeOverview')}</a></li>
              <li><a href="#issue" id="footer-issue-link" class="hover:text-emerald-300 transition-colors cursor-pointer">${t('footer.issueKarjat')}</a></li>
              <li><a href="#story" class="hover:text-emerald-300 transition-colors">${t('footer.whySahyadri')}</a></li>
            </ul>
          </div>

          <!-- Column 3: Transparency -->
          <div class="space-y-3">
            <h4 class="font-heading font-bold text-xs uppercase tracking-wider text-emerald-400">
              Transparency
            </h4>
            <ul class="space-y-2 text-xs">
              <li><button id="footer-link-privacy" class="hover:text-emerald-300 transition-colors cursor-pointer text-left">${t('footer.privacyPolicy')}</button></li>
            </ul>
          </div>

        </div>

        <!-- Mandatory Independent Awareness Disclaimer -->
        <div class="p-4 sm:p-5 rounded-2xl bg-[#06150E] border border-emerald-500/20 text-[11px] text-slate-300 leading-relaxed space-y-2">
          <div class="font-bold text-slate-300 uppercase tracking-wider text-[10px] text-emerald-400">
            ${t('footer.disclaimerHeading')}
          </div>
          <p>
            ${t('footer.disclaimerText')}
          </p>
        </div>

        <!-- Desktop Total Visitors Counter (Shifted above copyright line, faint/subtle) -->
        <div class="hidden md:flex items-center justify-center -mb-2">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/25 border border-emerald-500/15 text-[11px] text-slate-400/80 hover:text-slate-300 opacity-65 hover:opacity-90 transition-all">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-400/60 animate-pulse"></span>
            <span class="font-heading font-medium text-[9px] tracking-wider uppercase text-slate-400/70">${t('footer.totalVisitorsLabel')}</span>
            <strong id="footer-total-visitors-desktop" class="footer-total-visitors-val text-emerald-400/75 font-mono font-medium text-xs">...</strong>
          </div>
        </div>

        <!-- Bottom Copyright, Mobile Visitors & Credit -->
        <div class="pt-6 border-t border-emerald-500/15 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>${t('footer.copyrightText', { year: new Date().getFullYear() })}</p>

          <!-- Mobile Live Total Visitors Counter (Position preserved for mobile view, faint/subtle) -->
          <div class="md:hidden inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/25 border border-emerald-500/15 text-[11px] text-slate-400/80 opacity-65">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-400/60 animate-pulse"></span>
            <span class="font-heading font-medium text-[9px] tracking-wider uppercase text-slate-400/70">${t('footer.totalVisitorsLabel')}</span>
            <strong id="footer-total-visitors" class="footer-total-visitors-val text-emerald-400/75 font-mono font-medium text-xs">...</strong>
          </div>

          <p class="text-emerald-500/70 font-mono text-[11px]">${t('footer.tagline')}</p>
        </div>

      </div>
    </footer>
  `;

  // Attach event handlers
  const joinBtn = container.querySelector('#footer-join-btn');
  if (joinBtn) joinBtn.addEventListener('click', () => { if (onJoinClick) onJoinClick(); });

  const privacyBtn = container.querySelector('#footer-link-privacy');
  if (privacyBtn) privacyBtn.addEventListener('click', openPrivacyModal);

  // Wire footer links to open news section if clicked
  const footerIssueLink = container.querySelector('#footer-issue-link');
  const handleFooterNewsClick = (e) => {
    e.preventDefault();
    if (window.__sahyadriOpenNewsSection) {
      window.__sahyadriOpenNewsSection();
    }
  };
  if (footerIssueLink) footerIssueLink.addEventListener('click', handleFooterNewsClick);
}

/**
 * Dynamically updates the Total Visitors counter in the footer
 */
export function updateFooterVisitorCount(container, count) {
  if (!container && typeof document === 'undefined') return;
  const formatted = typeof count === 'number' ? count.toLocaleString('en-IN') : String(count);
  const elements = [
    ...(container && container.querySelectorAll ? container.querySelectorAll('.footer-total-visitors-val, #footer-total-visitors, #footer-total-visitors-desktop') : []),
    ...(typeof document !== 'undefined' ? document.querySelectorAll('.footer-total-visitors-val, #footer-total-visitors, #footer-total-visitors-desktop') : [])
  ];
  const uniqueElements = Array.from(new Set(elements));
  uniqueElements.forEach((el) => {
    el.textContent = formatted;
  });
}
