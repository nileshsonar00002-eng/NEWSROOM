/**
 * SAVE THE SAHYADRI — THE 32,490 TREES AT RISK (EDITORIAL FEATURE)
 * Redesigned single-panel editorial feature combining the emotional tree-age concept
 * with forest protection, cinematic imagery, and verified context.
 */

import { t } from '../utils/i18n.js';

export function renderIssueSection(container) {
  container.innerHTML = `
    <section id="issue" class="relative py-12 sm:py-16 lg:py-20 bg-[#030805]">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-12">
        
        <!-- Section Header -->
        <div class="relative text-center max-w-3xl mx-auto space-y-3 sm:space-y-4 reveal-on-scroll">
          <!-- HEADING -->
          <h2 class="font-heading font-black text-2xl sm:text-4xl lg:text-5xl text-white tracking-tight leading-tight">
            <span id="issue-tree-counter" data-target="32490">32,490</span> ${t('issue.headlinePrefix').replace(/(?:32,490|३२,४९०)\s*/, '')} <span class="text-[#00FF87]">${t('issue.headlineHighlight')}</span>
          </h2>
          
          <!-- SHORT FACTUAL DESCRIPTION -->
          <p class="text-xs sm:text-base text-slate-200 leading-relaxed max-w-2xl mx-auto font-sans">
            ${t('issue.description')}
          </p>

        </div>

        <!-- Cohesive Editorial-Style Panel -->
        <div id="news" class="relative p-5 sm:p-8 lg:p-12 rounded-2xl sm:rounded-3xl bg-[#06150E] border border-emerald-500/20 text-center space-y-6 sm:space-y-8 overflow-hidden shadow-2xl reveal-on-scroll hover-lift">
          
          <!-- Ambient Radial Emerald Lighting -->
          <div class="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,255,135,0.06)_0,transparent_70%)] pointer-events-none"></div>

          <!-- Wide Cinematic Image of a Person Hugging a Majestic Mature Tree in Lush Sahyadri Forest -->
          <div class="relative z-10 w-full overflow-hidden rounded-xl sm:rounded-2xl border border-emerald-500/25 shadow-xl group">
            <div class="relative aspect-[16/10] sm:aspect-[21/9] w-full overflow-hidden bg-black/60">
              <!-- Location Badge (Safe from corner crop & responsive) -->
              <div class="absolute top-3 left-3 sm:top-4 sm:left-4 z-10 inline-flex items-center gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1 rounded-full bg-[#030905]/85 backdrop-blur-md text-[10px] sm:text-xs font-bold text-emerald-300 border border-emerald-500/40 shadow-lg pointer-events-none tracking-wider">
                <svg class="w-3.5 h-3.5 text-emerald-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
                <span>${t('issue.locationBadge')}</span>
              </div>
              <img 
                src="/images/sahyadri-tree-hug.jpg" 
                alt="A concerned citizen hugging an ancient mature tree in the lush misty canopy of the Sahyadri Western Ghats" 
                class="w-full h-full object-cover object-center transform transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
              <!-- Cinematic Vignette & Bottom Shadow Overlay -->
              <div class="absolute inset-0 bg-gradient-to-t from-[#06150E] via-transparent to-black/20 pointer-events-none"></div>
            </div>
          </div>

          <!-- Emotional Message Block -->
          <div class="relative z-10 max-w-3xl mx-auto space-y-4 sm:space-y-5">
            
            <!-- Emotional Headline -->
            <div class="space-y-1 sm:space-y-2">
              <div class="font-heading font-black text-xl sm:text-3xl lg:text-4xl text-white tracking-tight leading-tight">
                ${t('issue.yearsToGrow')}
              </div>
              <div class="font-heading font-black text-xl sm:text-3xl lg:text-4xl text-[#00FF87] tracking-tight leading-tight drop-shadow-[0_0_20px_rgba(0,255,135,0.35)]">
                ${t('issue.minutesToCut')}
              </div>
            </div>

            <!-- Supporting Message -->
            <p class="text-xs sm:text-base lg:text-lg text-slate-200 leading-relaxed max-w-2xl mx-auto font-sans">
              ${t('issue.emotionalBody')}
            </p>

            <!-- Subtle Leaf Divider -->
            <div class="flex items-center justify-center gap-3 pt-1">
              <div class="h-px bg-emerald-500/30 w-16 sm:w-24"></div>
              <svg class="w-4 h-4 text-emerald-400 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 0 0 8 20C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75C7 8 17 8 17 8z"/>
              </svg>
              <div class="h-px bg-emerald-500/30 w-16 sm:w-24"></div>
            </div>

            <!-- Strong Closing Statement in Neon Green -->
            <div class="pt-1">
              <span class="font-heading font-black text-xs sm:text-base lg:text-lg text-[#00FF87] tracking-wider uppercase drop-shadow-[0_0_15px_rgba(0,255,135,0.25)]">
                ${t('issue.closingCallout')}
              </span>
            </div>

          </div>

          <!-- Readable Factual Disclaimer Footnote -->
          <div class="relative z-10 pt-3 sm:pt-4 flex items-center justify-center gap-2 text-[11px] sm:text-xs text-slate-400 max-w-2xl mx-auto text-center leading-normal">
            <span>${t('issue.factualDisclaimer')}</span>
          </div>

        </div>

        <!-- Regional Ecological Watershed Context -->
        <div class="p-4 sm:p-6 lg:p-7 rounded-2xl sm:rounded-3xl bg-[#06150E] border border-emerald-500/20 space-y-2.5 shadow-lg reveal-on-scroll hover-lift">
          <div class="flex items-center gap-2 text-emerald-400 font-bold text-xs sm:text-sm tracking-wider uppercase">
            <svg class="w-4 h-4 text-emerald-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
            <span>${t('issue.watershedBadge')}</span>
          </div>
          <p class="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
            ${t('issue.watershedBody')}
          </p>
        </div>

      </div>
    </section>
  `;
}

export function openNewsSection() {
  const newsEl = document.getElementById('news') || document.getElementById('issue');
  if (newsEl) {
    newsEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

export function closeNewsSection() {}
export function toggleNewsSection() { openNewsSection(); }
