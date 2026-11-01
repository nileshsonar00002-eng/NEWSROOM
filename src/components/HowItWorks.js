/**
 * SAVE THE SAHYADRI — HOW THE MOVEMENT WORKS
 * Clean, three-step action pathway with clickable stages and responsible awareness disclosure.
 */

export function renderHowItWorks(container, onJoinClick, onShareClick) {
  container.innerHTML = `
    <section id="how-it-works" class="relative py-12 sm:py-16 lg:py-20 bg-[#040C07] border-t border-emerald-500/15">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-12">
        
        <!-- Section Header -->
        <div class="text-center max-w-3xl mx-auto space-y-3 sm:space-y-4 reveal-on-scroll">
          <div class="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-950/70 border border-emerald-500/30 text-emerald-400 text-xs font-bold tracking-wider uppercase">
            <svg class="w-3.5 h-3.5 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
            <span>THREE-STEP ACTION</span>
          </div>
          <h2 class="font-heading font-black text-2xl sm:text-4xl lg:text-5xl text-white tracking-tight leading-tight">
            HOW THE MOVEMENT <span class="text-[#00FF87]">WORKS</span>
          </h2>
          <p class="text-xs sm:text-base text-slate-300 leading-relaxed font-sans">
            A peaceful, transparent framework to unite citizens for responsible environmental awareness.
          </p>
        </div>

        <!-- 3 Step Cards (Stacked 1-col on mobile, 3-col on desktop, 16px gap on mobile) -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 items-stretch">
          
          <!-- Step 01: LEARN -->
          <a href="#issue" class="p-4 sm:p-6 lg:p-7 rounded-2xl sm:rounded-3xl bg-[#06150E] border border-emerald-500/20 hover:border-emerald-400/40 transition-all duration-300 space-y-3.5 sm:space-y-4 group hover-lift reveal-on-scroll stagger-1 block shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400">
            <div class="flex items-center justify-between">
              <span class="font-mono text-xl sm:text-2xl font-black text-emerald-400">01</span>
              <span class="w-10 h-10 rounded-xl bg-emerald-950/70 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                </svg>
              </span>
            </div>

            <div class="space-y-1.5">
              <h3 class="font-heading font-black text-xl sm:text-2xl text-white group-hover:text-emerald-300 transition-colors">
                LEARN
              </h3>
              <p class="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                Understand the issue through credible sources, official documents, and verified ecological reporting.
              </p>
            </div>

            <div class="pt-2 text-xs font-semibold text-emerald-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              <span>Read the facts & news</span>
              <span>→</span>
            </div>
          </a>

          <!-- Step 02: JOIN -->
          <div id="step-join-card" class="p-4 sm:p-6 lg:p-7 rounded-2xl sm:rounded-3xl bg-[#06150E] border border-emerald-500/20 hover:border-emerald-400/40 transition-all duration-300 space-y-3.5 sm:space-y-4 group hover-lift reveal-on-scroll stagger-2 cursor-pointer shadow-md">
            <div class="flex items-center justify-between">
              <span class="font-mono text-xl sm:text-2xl font-black text-emerald-400">02</span>
              <span class="w-10 h-10 rounded-xl bg-emerald-950/70 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                  <path d="m9 12 2 2 4-4" />
                </svg>
              </span>
            </div>

            <div class="space-y-1.5">
              <h3 class="font-heading font-black text-xl sm:text-2xl text-white group-hover:text-emerald-300 transition-colors">
                JOIN
              </h3>
              <p class="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                Add your voice to the awareness movement and represent your city on the nationwide map.
              </p>
            </div>

            <div class="pt-2 text-xs font-semibold text-emerald-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              <span>Pledge your support</span>
              <span>→</span>
            </div>
          </div>

          <!-- Step 03: SHARE -->
          <div id="step-share-card" class="p-4 sm:p-6 lg:p-7 rounded-2xl sm:rounded-3xl bg-[#06150E] border border-emerald-500/20 hover:border-emerald-400/40 transition-all duration-300 space-y-3.5 sm:space-y-4 group hover-lift reveal-on-scroll stagger-3 cursor-pointer shadow-md">
            <div class="flex items-center justify-between">
              <span class="font-mono text-xl sm:text-2xl font-black text-emerald-400">03</span>
              <span class="w-10 h-10 rounded-xl bg-emerald-950/70 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                  <path d="m3 11 18-5v12L3 14v-3z" />
                  <path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" />
                </svg>
              </span>
            </div>

            <div class="space-y-1.5">
              <h3 class="font-heading font-black text-xl sm:text-2xl text-white group-hover:text-emerald-300 transition-colors">
                SHARE
              </h3>
              <p class="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                Help others discover the campaign with verified graphic cards for WhatsApp and social media.
              </p>
            </div>

            <div class="pt-2 text-xs font-semibold text-emerald-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              <span>Generate card & share</span>
              <span>→</span>
            </div>
          </div>

        </div>

        <!-- Peaceful Movement Scope Statement -->
        <div class="max-w-3xl mx-auto p-4 sm:p-5 rounded-2xl bg-[#030905] border border-emerald-500/20 text-center text-xs text-slate-400 space-y-1.5 reveal-on-scroll hover-lift">
          <div class="font-semibold text-slate-200 flex items-center justify-center gap-1.5">
            <svg class="w-4 h-4 text-emerald-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <path d="m9 12 2 2 4-4" />
            </svg>
            <span>A Commitment to Peaceful & Lawful Awareness</span>
          </div>
          <p>
            This website is an independent citizen-led public awareness initiative. Adding your voice demonstrates moral solidarity for nature preservation. It does not imply that joining the website directly halts any infrastructure project, constitutes an official legal petition, or guarantees any government intervention.
          </p>
        </div>

      </div>
    </section>
  `;

  // Attach event handlers
  const joinCard = container.querySelector('#step-join-card');
  if (joinCard) {
    joinCard.addEventListener('click', () => {
      if (onJoinClick) onJoinClick();
    });
  }

  const shareCard = container.querySelector('#step-share-card');
  if (shareCard) {
    shareCard.addEventListener('click', () => {
      if (onShareClick) onShareClick();
    });
  }
}
