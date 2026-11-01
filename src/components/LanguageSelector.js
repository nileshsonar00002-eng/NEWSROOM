/**
 * SAVE THE SAHYADRI — PREMIUM LANGUAGE SELECTOR
 * Floating compact glassmorphic language switcher with options: म | हिं | EN.
 * Positioned right below the navigation bar in the top-right corner.
 * Highlights the active language with a subtle emerald-green accent.
 * No flags used. Mobile-friendly and instant reactive state switching.
 */

import { getLanguage, setLanguage, onLanguageChange, SUPPORTED_LANGUAGES } from '../utils/i18n.js';

export function renderLanguageSelector(mountContainer = null) {
  // If mountContainer is provided, use it; otherwise create floating fixed container
  let container = mountContainer;

  if (!container) {
    let existing = document.getElementById('sahyadri-lang-selector-root');
    if (!existing) {
      existing = document.createElement('div');
      existing.id = 'sahyadri-lang-selector-root';
      existing.className = 'hidden md:block fixed top-[52px] sm:top-[64px] right-3 sm:right-6 z-40 pointer-events-auto select-none transition-all';
      document.body.appendChild(existing);
    } else {
      existing.className = 'hidden md:block fixed top-[52px] sm:top-[64px] right-3 sm:right-6 z-40 pointer-events-auto select-none transition-all';
    }
    container = existing;
  }

  function updateHtml() {
    const active = getLanguage();

    container.innerHTML = `
      <div 
        class="inline-flex items-center gap-1 p-0.5 sm:p-1 rounded-full bg-[#030905]/95 backdrop-blur-xl border border-emerald-500/30 shadow-[0_4px_20px_rgba(0,0,0,0.7)]"
        role="group"
        aria-label="Language selection"
      >
        ${SUPPORTED_LANGUAGES.map((lang) => {
          const isActive = active === lang.code;
          const activeClasses = 'bg-gradient-to-r from-emerald-500/30 to-emerald-400/20 text-[#00FF87] border-emerald-400/60 shadow-[0_0_10px_rgba(0,255,135,0.35)] font-black scale-[1.03]';
          const inactiveClasses = 'text-slate-400 hover:text-white hover:bg-emerald-950/50 border-transparent font-bold';

          return `
            <button
              type="button"
              data-lang="${lang.code}"
              title="${lang.name} (${lang.code.toUpperCase()})"
              aria-label="Switch language to ${lang.name}"
              aria-pressed="${isActive}"
              class="lang-select-btn min-w-[28px] sm:min-w-[32px] h-6 sm:h-7 px-1.5 sm:px-2 rounded-full text-[11px] sm:text-xs tracking-wider flex items-center justify-center transition-all duration-200 border cursor-pointer ${isActive ? activeClasses : inactiveClasses}"
            >
              <span>${lang.icon}</span>
            </button>
          `;
        }).join('')}
      </div>
    `;

    // Attach click events
    container.querySelectorAll('.lang-select-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const chosen = btn.getAttribute('data-lang');
        if (chosen) {
          setLanguage(chosen);
        }
      });
    });
  }

  updateHtml();

  // Subscribe to changes so it stays in sync
  const unsubscribe = onLanguageChange(() => {
    updateHtml();
  });

  return {
    destroy: () => {
      unsubscribe();
      if (!mountContainer && container) container.remove();
    }
  };
}
