/**
 * SAVE THE SAHYADRI — MOVEMENT & CONSERVATION STATISTICS
 * Official UNESCO World Heritage verified ecological data & live citizen movement counters.
 * 
 * Mobile Experience:
 * - Premium auto-sliding horizontal carousel with touch swipe gestures (pan-y preserved).
 * - Active card width: ~90–91% of available container with subtle 12–20px next-card preview.
 * - Compact balanced vertical padding, 14px readable body text, and clamped titles.
 * - Top-aligned cards with natural content-adaptive heights.
 * - Autoplay every 3.5s with pause on touch/interaction and automatic reset on manual swipe.
 * - Smooth infinite seamless looping and 4 interactive pagination dots with emerald glow.
 * 
 * Desktop & Tablet Experience:
 * - 4-column desktop layout & 2-column tablet layout preserved exactly as specified.
 * - Zero autoplay on desktop/tablet.
 */

export function renderMovementCounter(container, stats = {}) {
  const total = typeof stats.total === 'number' ? stats.total : 0;
  const uniqueCities = typeof stats.uniqueCities === 'number' ? stats.uniqueCities : 0;
  const isLive = stats.isLive !== false;
  const isFallback = stats.fallbackMode === true;

  // Cleanup any previous carousel instance if container is re-rendered
  if (container._cleanupCarousel) {
    try { container._cleanupCarousel(); } catch (_) {}
    container._cleanupCarousel = null;
  }

  container.innerHTML = `
    <section class="relative py-12 sm:py-16 lg:py-20 bg-[#040C07] border-b border-emerald-500/15 overflow-hidden">
      
      <!-- Subtle Ambient Forest Lighting -->
      <div class="absolute inset-0 bg-radial-gradient pointer-events-none">
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-48 bg-emerald-500/5 rounded-full blur-[100px]"></div>
      </div>

      <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-10">
        
        <!-- Section Header -->
        <div class="text-center max-w-3xl mx-auto space-y-3 sm:space-y-4 reveal-on-scroll">
          <h2 class="font-heading font-black text-2xl sm:text-4xl lg:text-5xl text-white tracking-tight leading-tight">
            ONE MOVEMENT. MANY <span class="text-[#00FF87]">VOICES.</span>
          </h2>
          
          <p class="text-xs sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed font-sans">
            Verified ecological metrics from the Sahyadri Western Ghats — an irreplaceable global biodiversity sanctuary whose critical corridors demand urgent protection.
          </p>
        </div>

        <!-- Carousel Container (Mobile: Horizontally sliding with peek, Desktop/Tablet: Preserved Grid) -->
        <div class="relative w-full overflow-hidden sm:overflow-visible py-1">
          <div 
            id="stats-carousel-track" 
            class="relative flex sm:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 items-start sm:items-stretch transition-transform duration-500 ease-out will-change-transform"
            style="touch-action: pan-y;"
          >
            
            <!-- Card 1: 325+ Threatened Species -->
            <div class="stat-carousel-card w-[90%] xs:w-[91%] sm:w-auto shrink-0 sm:shrink p-3.5 sm:p-5 rounded-2xl bg-[#06150E] border border-emerald-500/20 hover:border-emerald-400/40 hover:bg-[#07190F] transition-all duration-300 text-left group shadow-md flex flex-col justify-between h-auto sm:h-full reveal-on-scroll stagger-1 hover-lift cursor-pointer sm:cursor-default" data-card-index="0">
              <div class="space-y-2.5 sm:space-y-3.5">
                <!-- Photo Container -->
                <div class="relative w-full aspect-[16/9] sm:aspect-[5/3] overflow-hidden rounded-xl border border-emerald-500/15 bg-emerald-950/60 shrink-0">
                  <img 
                    src="/images/unesco/threatened-species.png" 
                    alt="Lion-tailed Macaque - Globally Threatened Species in Western Ghats" 
                    class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>

                <!-- Stat Number -->
                <div class="font-heading font-black text-2xl xs:text-3xl sm:text-4xl text-emerald-400 tracking-tight leading-none">
                  325+
                </div>

                <!-- Stat Title -->
                <div class="text-[11px] xs:text-xs sm:text-sm font-bold text-white uppercase tracking-wider leading-snug line-clamp-2">
                  THREATENED SPECIES
                </div>

                <!-- Description (14px comfortable reading on mobile) -->
                <p class="text-[13.5px] xs:text-[14px] sm:text-sm text-slate-300 leading-[1.6] sm:leading-relaxed pt-0.5 sm:pt-1 font-sans">
                  Globally threatened species recorded in the Western Ghats, according to UNESCO's listing information.
                </p>
              </div>
            </div>

            <!-- Card 2: 54% Endemic Tree Species -->
            <div class="stat-carousel-card w-[90%] xs:w-[91%] sm:w-auto shrink-0 sm:shrink p-3.5 sm:p-5 rounded-2xl bg-[#06150E] border border-emerald-500/20 hover:border-emerald-400/40 hover:bg-[#07190F] transition-all duration-300 text-left group shadow-md flex flex-col justify-between h-auto sm:h-full reveal-on-scroll stagger-2 hover-lift cursor-pointer sm:cursor-default" data-card-index="1">
              <div class="space-y-2.5 sm:space-y-3.5">
                <!-- Photo Container -->
                <div class="relative w-full aspect-[16/9] sm:aspect-[5/3] overflow-hidden rounded-xl border border-emerald-500/15 bg-emerald-950/60 shrink-0">
                  <img 
                    src="/images/unesco/endemic-trees.png" 
                    alt="Ancient Rainforest Canopy - Endemic Tree Species in Sahyadri" 
                    class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>

                <!-- Stat Number -->
                <div class="font-heading font-black text-2xl xs:text-3xl sm:text-4xl text-emerald-400 tracking-tight leading-none">
                  54%
                </div>

                <!-- Stat Title -->
                <div class="text-[11px] xs:text-xs sm:text-sm font-bold text-white uppercase tracking-wider leading-snug line-clamp-2">
                  ENDEMIC TREE SPECIES
                </div>

                <!-- Description (14px comfortable reading on mobile) -->
                <p class="text-[13.5px] xs:text-[14px] sm:text-sm text-slate-300 leading-[1.6] sm:leading-relaxed pt-0.5 sm:pt-1 font-sans">
                  352 of nearly 650 tree species cited by UNESCO's description are endemic.
                </p>
              </div>
            </div>

            <!-- Card 3: 8 Biodiversity Hotspots -->
            <div class="stat-carousel-card w-[90%] xs:w-[91%] sm:w-auto shrink-0 sm:shrink p-3.5 sm:p-5 rounded-2xl bg-[#06150E] border border-emerald-500/20 hover:border-emerald-400/40 hover:bg-[#07190F] transition-all duration-300 text-left group shadow-md flex flex-col justify-between h-auto sm:h-full reveal-on-scroll stagger-3 hover-lift cursor-pointer sm:cursor-default" data-card-index="2">
              <div class="space-y-2.5 sm:space-y-3.5">
                <!-- Photo Container -->
                <div class="relative w-full aspect-[16/9] sm:aspect-[5/3] overflow-hidden rounded-xl border border-emerald-500/15 bg-emerald-950/60 shrink-0">
                  <img 
                    src="/images/unesco/biodiversity-hotspots.png" 
                    alt="Misty Mountain Forest - World Biodiversity Hotspots" 
                    class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>

                <!-- Stat Number -->
                <div class="font-heading font-black text-2xl xs:text-3xl sm:text-4xl text-emerald-400 tracking-tight leading-none">
                  8
                </div>

                <!-- Stat Title -->
                <div class="text-[11px] xs:text-xs sm:text-sm font-bold text-white uppercase tracking-wider leading-snug line-clamp-2">
                  BIODIVERSITY HOTSPOTS
                </div>

                <!-- Description (14px comfortable reading on mobile) -->
                <p class="text-[13.5px] xs:text-[14px] sm:text-sm text-slate-300 leading-[1.6] sm:leading-relaxed pt-0.5 sm:pt-1 font-sans">
                  The Western Ghats–Sri Lanka region is recognised as one of the world's eight biodiversity hotspots.
                </p>
              </div>
            </div>

            <!-- Card 4: 2012 UNESCO World Heritage -->
            <div class="stat-carousel-card w-[90%] xs:w-[91%] sm:w-auto shrink-0 sm:shrink p-3.5 sm:p-5 rounded-2xl bg-[#06150E] border border-emerald-500/20 hover:border-emerald-400/40 hover:bg-[#07190F] transition-all duration-300 text-left group shadow-md flex flex-col justify-between h-auto sm:h-full reveal-on-scroll stagger-4 hover-lift cursor-pointer sm:cursor-default" data-card-index="3">
              <div class="space-y-2.5 sm:space-y-3.5">
                <!-- Photo Container -->
                <div class="relative w-full aspect-[16/9] sm:aspect-[5/3] overflow-hidden rounded-xl border border-emerald-500/15 bg-emerald-950/60 shrink-0">
                  <img 
                    src="/images/unesco/unesco-heritage.png" 
                    alt="Western Ghats River Valley Gorge - UNESCO World Heritage Site" 
                    class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>

                <!-- Stat Number -->
                <div class="font-heading font-black text-2xl xs:text-3xl sm:text-4xl text-emerald-400 tracking-tight leading-none">
                  2012
                </div>

                <!-- Stat Title -->
                <div class="text-[11px] xs:text-xs sm:text-sm font-bold text-white uppercase tracking-wider leading-snug line-clamp-2">
                  UNESCO WORLD HERITAGE
                </div>

                <!-- Description (14px comfortable reading on mobile) -->
                <p class="text-[13.5px] xs:text-[14px] sm:text-sm text-slate-300 leading-[1.6] sm:leading-relaxed pt-0.5 sm:pt-1 font-sans">
                  The Western Ghats property was inscribed on the UNESCO World Heritage List in 2012.
                </p>
              </div>
            </div>

          </div>
        </div>

        <!-- Mobile Pagination Dots (sm:hidden) -->
        <div 
          id="stats-carousel-dots" 
          class="flex sm:hidden items-center justify-center gap-2 pt-2"
          aria-label="Stat cards pagination"
        >
          <button 
            type="button" 
            data-index="0" 
            class="stat-dot h-2 rounded-full transition-all duration-300 w-6 bg-[#00FF87] shadow-[0_0_10px_rgba(0,255,135,0.4)]" 
            aria-label="Go to card 1: 325+ Threatened Species"
            aria-current="true"
          ></button>
          <button 
            type="button" 
            data-index="1" 
            class="stat-dot h-2 rounded-full transition-all duration-300 w-2 bg-emerald-950/80 border border-emerald-500/30 hover:border-emerald-400/60" 
            aria-label="Go to card 2: 54% Endemic Tree Species"
          ></button>
          <button 
            type="button" 
            data-index="2" 
            class="stat-dot h-2 rounded-full transition-all duration-300 w-2 bg-emerald-950/80 border border-emerald-500/30 hover:border-emerald-400/60" 
            aria-label="Go to card 3: 8 Biodiversity Hotspots"
          ></button>
          <button 
            type="button" 
            data-index="3" 
            class="stat-dot h-2 rounded-full transition-all duration-300 w-2 bg-emerald-950/80 border border-emerald-500/30 hover:border-emerald-400/60" 
            aria-label="Go to card 4: 2012 UNESCO World Heritage"
          ></button>
        </div>

        <!-- Official Source Link (Matches reference styling) -->
        <div class="pt-2">
          <a 
            href="https://whc.unesco.org/en/list/1342/" 
            target="_blank" 
            rel="noopener noreferrer" 
            class="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-emerald-400 font-medium transition-colors"
          >
            <span>Source: UNESCO — Western Ghats</span>
            <svg class="w-3.5 h-3.5 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
          </a>
        </div>

      </div>
    </section>
  `;

  // Initialize mobile auto-sliding carousel & touch handlers
  initMobileCarousel(container);
}

/**
 * Mobile Auto-Sliding Carousel Controller
 * Enables smooth 3.5s autoplay, touch gestures with vertical scroll protection,
 * 4 pagination dots, subtle active card glow, and seamless looping.
 */
function initMobileCarousel(container) {
  if (typeof window === 'undefined' || typeof document === 'undefined' || !container || !container.querySelector) {
    return;
  }

  const track = container.querySelector('#stats-carousel-track');
  const dotsContainer = container.querySelector('#stats-carousel-dots');
  if (!track) return;

  const cards = Array.from(track.querySelectorAll('.stat-carousel-card'));
  const dots = dotsContainer ? Array.from(dotsContainer.querySelectorAll('.stat-dot')) : [];
  const totalCards = cards.length;
  if (totalCards === 0) return;

  const AUTOPLAY_INTERVAL = 3500;
  let currentIndex = 0;
  let autoplayTimer = null;
  let isTouching = false;
  let startX = 0;
  let startY = 0;
  let currentX = 0;
  let isSwiping = false;
  let isVerticalScroll = false;

  const isMobile = () => window.innerWidth < 640;

  function getCardOffset(index) {
    if (!cards[index]) return 0;
    const card0 = cards[0];
    const cardWidth = card0 ? card0.offsetWidth : 300;
    const gap = 16; // 1rem gap (gap-4)
    if (cards[index].offsetLeft > 0 || index === 0) {
      return cards[index].offsetLeft;
    }
    return index * (cardWidth + gap);
  }

  function updateCarousel(index, withTransition = true) {
    if (!isMobile()) {
      track.style.transform = '';
      track.style.transition = '';
      cards.forEach((card) => {
        card.classList.remove('is-active-card', 'is-inactive-card');
      });
      return;
    }

    const offset = getCardOffset(index);
    track.style.transition = withTransition ? 'transform 500ms cubic-bezier(0.22, 1, 0.36, 1)' : 'none';
    track.style.transform = `translateX(-${offset}px)`;

    // Update active card subtle glow
    cards.forEach((card, i) => {
      if (i === index) {
        card.classList.add('is-active-card');
        card.classList.remove('is-inactive-card');
      } else {
        card.classList.remove('is-active-card');
        card.classList.add('is-inactive-card');
      }
    });

    // Update pagination dots (animate active indicator smoothly)
    dots.forEach((dot, i) => {
      if (i === index) {
        dot.className = 'stat-dot h-2 rounded-full transition-all duration-300 w-6 bg-[#00FF87] shadow-[0_0_10px_rgba(0,255,135,0.4)]';
        dot.setAttribute('aria-current', 'true');
      } else {
        dot.className = 'stat-dot h-2 rounded-full transition-all duration-300 w-2 bg-emerald-950/80 border border-emerald-500/30 hover:border-emerald-400/60';
        dot.removeAttribute('aria-current');
      }
    });
  }

  function goToCard(index, withTransition = true) {
    // Seamless loop: loops cleanly from last back to first, or first back to last
    currentIndex = ((index % totalCards) + totalCards) % totalCards;
    updateCarousel(currentIndex, withTransition);
  }

  function nextCard() {
    goToCard(currentIndex + 1);
  }

  function prevCard() {
    goToCard(currentIndex - 1);
  }

  function startAutoplay() {
    stopAutoplay();
    if (!isMobile()) return;

    // Respect prefers-reduced-motion
    const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    autoplayTimer = setInterval(() => {
      if (!isTouching) {
        nextCard();
      }
    }, AUTOPLAY_INTERVAL);
  }

  function stopAutoplay() {
    if (autoplayTimer) {
      clearInterval(autoplayTimer);
      autoplayTimer = null;
    }
  }

  function resetAutoplay() {
    stopAutoplay();
    if (isMobile()) {
      startAutoplay();
    }
  }

  // --- Touch Gesture Handling without interfering with vertical scroll ---
  const handleTouchStart = (e) => {
    if (!isMobile() || e.touches.length > 1) return;
    isTouching = true;
    stopAutoplay();
    const touch = e.touches[0];
    startX = touch.clientX;
    startY = touch.clientY;
    currentX = startX;
    isSwiping = false;
    isVerticalScroll = false;
  };

  const handleTouchMove = (e) => {
    if (!isMobile() || !isTouching || isVerticalScroll) return;
    const touch = e.touches[0];
    currentX = touch.clientX;
    const deltaX = currentX - startX;
    const deltaY = touch.clientY - startY;

    // Check gesture direction lock
    if (!isSwiping) {
      // If user is scrolling vertically, let the page scroll naturally!
      if (Math.abs(deltaY) > 7 && Math.abs(deltaY) >= Math.abs(deltaX)) {
        isVerticalScroll = true;
        return;
      }
      // If user is intentionally swiping horizontally, take control
      if (Math.abs(deltaX) > 7 && Math.abs(deltaX) > Math.abs(deltaY)) {
        isSwiping = true;
      }
    }

    if (isSwiping) {
      // Direct finger tracking with slight edge resistance
      const currentOffset = getCardOffset(currentIndex);
      const dragTranslate = -currentOffset + (deltaX * 0.9);
      track.style.transition = 'none';
      track.style.transform = `translateX(${dragTranslate}px)`;
    }
  };

  const handleTouchEnd = () => {
    if (!isTouching) return;
    isTouching = false;

    if (isSwiping) {
      const deltaX = currentX - startX;
      const swipeThreshold = 40; // 40px minimum drag to advance
      if (deltaX < -swipeThreshold) {
        nextCard();
      } else if (deltaX > swipeThreshold) {
        prevCard();
      } else {
        goToCard(currentIndex); // Snap back if below threshold
      }
    }

    isSwiping = false;
    isVerticalScroll = false;
    resetAutoplay();
  };

  track.addEventListener('touchstart', handleTouchStart, { passive: true });
  track.addEventListener('touchmove', handleTouchMove, { passive: true });
  track.addEventListener('touchend', handleTouchEnd, { passive: true });
  track.addEventListener('touchcancel', handleTouchEnd, { passive: true });

  // Pause on hover (useful for mobile responsive testing on desktop browsers)
  track.addEventListener('mouseenter', stopAutoplay);
  track.addEventListener('mouseleave', () => {
    if (isMobile()) startAutoplay();
  });

  // Tapping next card peeking on the right navigates to it
  cards.forEach((card, idx) => {
    card.addEventListener('click', () => {
      if (isMobile() && idx !== currentIndex && !isSwiping) {
        goToCard(idx);
        resetAutoplay();
      }
    });
  });

  // Pagination Dot Navigation
  dots.forEach((dot) => {
    dot.addEventListener('click', (e) => {
      e.preventDefault();
      const targetIdx = parseInt(dot.getAttribute('data-index'), 10);
      if (!isNaN(targetIdx)) {
        goToCard(targetIdx);
        resetAutoplay();
      }
    });
  });

  // Window Resize & Orientation Change Handling
  let resizeTimeout = null;
  const onResize = () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      if (isMobile()) {
        updateCarousel(currentIndex, false);
        resetAutoplay();
      } else {
        stopAutoplay();
        track.style.transform = '';
        track.style.transition = '';
        cards.forEach((card) => {
          card.classList.remove('is-active-card', 'is-inactive-card');
        });
      }
    }, 150);
  };
  window.addEventListener('resize', onResize);

  // Tab visibility: pause autoplay when backgrounded to save mobile battery
  const onVisibilityChange = () => {
    if (document.hidden) {
      stopAutoplay();
    } else if (isMobile()) {
      startAutoplay();
    }
  };
  document.addEventListener('visibilitychange', onVisibilityChange);

  // Initialize first state
  if (isMobile()) {
    // Initial delay so that layout and fonts compute widths
    if (typeof requestAnimationFrame !== 'undefined') {
      requestAnimationFrame(() => {
        updateCarousel(0, false);
        startAutoplay();
      });
    } else {
      updateCarousel(0, false);
      startAutoplay();
    }
  }

  // Cleanup reference for re-renders
  container._cleanupCarousel = () => {
    stopAutoplay();
    track.removeEventListener('touchstart', handleTouchStart);
    track.removeEventListener('touchmove', handleTouchMove);
    track.removeEventListener('touchend', handleTouchEnd);
    track.removeEventListener('touchcancel', handleTouchEnd);
    track.removeEventListener('mouseenter', stopAutoplay);
    window.removeEventListener('resize', onResize);
    document.removeEventListener('visibilitychange', onVisibilityChange);
  };
}

/**
 * Animate numbers when new data arrives
 */
export function updateCounterValues(container, total, uniqueCities) {
  const totalEl = container.querySelector('#stat-total-supporters');
  const citiesEl = container.querySelector('#stat-total-cities');

  if (totalEl) totalEl.textContent = Number(total || 0).toLocaleString();
  if (citiesEl) citiesEl.textContent = Number(uniqueCities || 0).toLocaleString();
}
