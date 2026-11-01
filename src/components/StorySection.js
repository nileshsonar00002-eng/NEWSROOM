/**
 * SAVE THE SAHYADRI — WHY THE SAHYADRI MATTERS
 * Refined ecological pillars highlighting hydrology, biodiversity, and cultural heritage
 * with verified facts, elegant landscape banners, and responsive equal-height cards.
 * 
 * Mobile Experience:
 * - Premium auto-sliding horizontal carousel with touch swipe gestures (pan-y preserved).
 * - Active card width: ~90–91% of available container with subtle 12–20px next-card preview.
 * - Compact balanced vertical padding, 14px readable body text, and two-line clamped title.
 * - Non-clipped, compact category badges and natural content-adaptive heights.
 * - Autoplay every 3.5s with pause on touch/interaction and automatic reset on manual swipe.
 * - Smooth infinite seamless looping and interactive pagination dots with emerald glow.
 * 
 * Desktop & Tablet Experience:
 * - 2-column grid layout preserved exactly as specified.
 * - Zero autoplay on desktop/tablet.
 */

import { SAHYADRI_PILLARS } from '../data/sahyadriData.js';

export function renderStorySection(container, onJoinClick) {
  // Cleanup any previous carousel instance if container is re-rendered
  if (container._cleanupStoryCarousel) {
    try { container._cleanupStoryCarousel(); } catch (_) {}
    container._cleanupStoryCarousel = null;
  }

  // Focus on the core pillars: Water, Rivers & Catchments and Natural & Cultural Heritage
  const activePillars = SAHYADRI_PILLARS.slice(2);
  
  const pillarCardsHtml = activePillars.map((pillar, index) => {
    let iconSvg = '';
    if (pillar.icon === 'droplet') {
      // Lucide Droplet line icon
      iconSvg = `
        <svg class="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z" />
        </svg>
      `;
    } else {
      // Official Sahyadri Mountain emblem
      iconSvg = `
        <div class="w-4 h-4 sm:w-5 sm:h-5 rounded-full overflow-hidden bg-[#05392e] border border-emerald-500/40 flex items-center justify-center shrink-0 shadow-sm">
          <img src="/images/logo.png" alt="" class="w-full h-full object-cover" />
        </div>
      `;
    }

    const imageSrc = pillar.image || (pillar.id === 'pillar-water' ? '/images/story/sahyadri-river.jpg' : '/images/story/sahyadri-heritage-fort.jpg');
    const staggerClass = index === 0 ? 'stagger-1' : 'stagger-2';

    return `
      <div class="story-carousel-card w-[90%] xs:w-[91%] sm:w-auto shrink-0 sm:shrink group relative rounded-2xl sm:rounded-3xl bg-[#06150E] border border-emerald-500/20 hover:border-emerald-400/40 transition-all duration-300 flex flex-col justify-between shadow-xl overflow-hidden hover-lift reveal-on-scroll ${staggerClass} cursor-pointer sm:cursor-default h-auto sm:h-full" data-card-index="${index}">
        
        <!-- Top Landscape Image Banner (Compact on mobile to avoid excessive card height) -->
        <div class="relative w-full h-36 xs:h-40 sm:h-52 overflow-hidden bg-emerald-950/40 border-b border-emerald-500/15 shrink-0">
          <img 
            src="${imageSrc}" 
            alt="${pillar.title}" 
            class="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-700 ease-out" 
            loading="lazy" 
          />
          <div class="absolute inset-0 bg-gradient-to-t from-[#06150E] via-[#06150E]/30 to-transparent"></div>
          
          <!-- Icon Floating Badge -->
          <div class="absolute top-2.5 left-2.5 sm:top-4 sm:left-4 w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-black/70 backdrop-blur-md border border-emerald-500/30 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
            ${iconSvg}
          </div>

          <!-- Category Tagline Badge (Compact font, unclipped text) -->
          <div class="absolute bottom-2 left-2.5 right-2.5 sm:bottom-3 sm:left-4 sm:right-4 flex items-center">
            <span class="inline-block text-[9px] xs:text-[10px] sm:text-[11px] font-mono font-semibold text-emerald-300 tracking-wide uppercase bg-[#041209]/95 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full border border-emerald-500/30 backdrop-blur-sm max-w-full leading-normal">
              ${pillar.tagline}
            </span>
          </div>
        </div>

        <!-- Card Body (Reduced vertical padding: p-3.5 sm:p-6 lg:p-7) -->
        <div class="p-3.5 sm:p-6 lg:p-7 flex-1 flex flex-col justify-between space-y-3 sm:space-y-5">
          <div class="space-y-1.5 sm:space-y-3">
            <h3 class="font-heading font-black text-[17px] xs:text-[18px] sm:text-2xl text-white group-hover:text-emerald-300 transition-colors tracking-tight leading-snug line-clamp-2">
              ${pillar.title}
            </h3>
            <p class="text-[14px] sm:text-sm text-slate-300 leading-[1.6] sm:leading-relaxed font-sans">
              ${pillar.description}
            </p>
          </div>

          <!-- 3 Concise Verified Facts with Green Check Icons (Tightened gaps) -->
          <div class="space-y-1.5 sm:space-y-2 pt-2.5 sm:pt-4 border-t border-emerald-500/15">
            <div class="text-[10px] sm:text-[11px] font-mono uppercase tracking-wider text-emerald-400 font-bold flex items-center gap-1.5">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              KEY ECOLOGICAL ATTRIBUTES
            </div>
            <ul class="space-y-1.5 sm:space-y-2">
              ${pillar.keyPoints.map(kp => `
                <li class="flex items-start gap-2 text-xs sm:text-[13px] text-slate-200 leading-relaxed">
                  <span class="inline-flex items-center justify-center w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-emerald-950/90 border border-emerald-400/50 text-emerald-400 font-bold text-[9px] sm:text-[10px] shrink-0 mt-0.5">✓</span>
                  <span>${kp}</span>
                </li>
              `).join('')}
            </ul>
          </div>

          <!-- Card Footer with Accurate Natural Heritage Badge and Source Link -->
          <div class="pt-2.5 sm:pt-4 border-t border-emerald-500/15 flex flex-wrap items-center justify-between gap-1.5 sm:gap-2 text-[10px] sm:text-[11px] font-mono">
            <span class="text-emerald-400 font-semibold tracking-wider flex items-center gap-1.5">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              WESTERN GHATS · NATURAL HERITAGE
            </span>
            <a 
              href="${pillar.sourceUrl || 'https://whc.unesco.org/en/list/1342/'}" 
              target="_blank" 
              rel="noopener noreferrer" 
              class="text-emerald-400 hover:text-emerald-300 underline underline-offset-2 flex items-center gap-1 transition-colors"
              title="Official UNESCO World Heritage documentation"
            >
              <span>Source: UNESCO WHC</span>
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
              </svg>
            </a>
          </div>

        </div>

      </div>
    `;
  }).join('');

  container.innerHTML = `
    <section id="story" class="relative py-12 sm:py-16 lg:py-20 bg-[#030805] overflow-hidden">
      
      <!-- Subtle Western Ghats Forest & Mountain Background Accent with Dark Overlay -->
      <div class="absolute inset-0 pointer-events-none overflow-hidden select-none">
        <img 
          src="/images/story/sahyadri-heritage-fort.jpg" 
          alt="" 
          class="w-full h-full object-cover object-center opacity-[0.06] filter blur-[2px] scale-105" 
          loading="lazy" 
        />
        <div class="absolute inset-0 bg-gradient-to-b from-[#030805] via-[#041208]/95 to-[#030805]"></div>
        <div class="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,rgba(16,185,129,0.08),transparent_80%)]"></div>
      </div>

      <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-12">
        
        <!-- Hero Section Header -->
        <div class="text-center max-w-3xl mx-auto space-y-3 sm:space-y-4 reveal-on-scroll">
          <h2 class="font-heading font-black text-2xl sm:text-4xl lg:text-5xl text-white tracking-tight leading-tight">
            WHY THE SAHYADRI <span class="text-[#00FF87]">MATTERS</span>
          </h2>

          <p class="text-xs sm:text-base text-slate-300 leading-relaxed max-w-2xl mx-auto font-sans">
            From sustaining rivers and influencing regional rainfall to sheltering extraordinary biodiversity, the Sahyadri is vital to life across the Western Ghats.
          </p>
        </div>

        <!-- 2 Visually Balanced Responsive Cards (Mobile: Auto-Sliding Carousel aligned top, Desktop: 2 Col Grid) -->
        <div class="relative w-full overflow-hidden sm:overflow-visible py-1">
          <div 
            id="story-carousel-track" 
            class="relative flex sm:grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 items-start sm:items-stretch transition-transform duration-500 ease-out will-change-transform"
            style="touch-action: pan-y;"
          >
            ${pillarCardsHtml}
          </div>
        </div>

        <!-- Mobile Pagination Dots (sm:hidden) -->
        <div 
          id="story-carousel-dots" 
          class="flex sm:hidden items-center justify-center gap-2 pt-2"
          aria-label="Story cards pagination"
        >
          ${activePillars.map((pillar, i) => `
            <button 
              type="button" 
              data-index="${i}" 
              class="story-dot h-2 rounded-full transition-all duration-300 ${i === 0 ? 'w-6 bg-[#00FF87] shadow-[0_0_10px_rgba(0,255,135,0.4)]' : 'w-2 bg-emerald-950/80 border border-emerald-500/30 hover:border-emerald-400/60'}" 
              aria-label="Go to card ${i + 1}: ${pillar.title}"
              ${i === 0 ? 'aria-current="true"' : ''}
            ></button>
          `).join('')}
        </div>

        <!-- Full-Width Atmospheric Visual Banner with Pledge Quote -->
        <div class="relative rounded-2xl sm:rounded-3xl overflow-hidden border border-emerald-500/25 shadow-xl bg-gradient-to-r from-[#030905] via-[#081B10] to-[#030905] min-h-[300px] sm:min-h-[360px] flex items-center justify-center p-6 sm:p-10 lg:p-14 text-center reveal-on-scroll hover-lift">
          
          <!-- Forest / Mountain Background Overlay Pattern -->
          <div class="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.12)_0,transparent_75%)] pointer-events-none"></div>
          
          <!-- Silhouette Mountain Skyline in SVG -->
          <svg class="absolute bottom-0 left-0 right-0 w-full h-32 text-emerald-950/40 pointer-events-none" viewBox="0 0 1200 240" fill="currentColor" preserveAspectRatio="none">
            <path d="M0,240 L0,180 L140,80 L280,160 L420,60 L580,150 L750,40 L900,140 L1040,70 L1200,160 L1200,240 Z" opacity="0.4"/>
            <path d="M0,240 L0,190 L180,120 L350,170 L520,90 L700,160 L880,100 L1050,150 L1200,180 L1200,240 Z" opacity="0.7"/>
          </svg>

          <div class="relative z-10 max-w-3xl space-y-4 sm:space-y-6">
            <div class="w-12 h-12 sm:w-14 sm:h-14 mx-auto rounded-2xl overflow-hidden bg-[#05392e] border border-emerald-500/30 flex items-center justify-center shadow-emerald-glow">
              <img src="/images/logo.png" alt="Save the Sahyadri Logo" class="w-full h-full object-cover" />
            </div>
            
            <blockquote class="font-heading font-extrabold text-xl sm:text-3xl lg:text-4xl text-white tracking-tight leading-snug">
              “Protecting nature is not just about today. It is about what we leave behind.”
            </blockquote>

            <p class="text-xs sm:text-base text-slate-300 font-medium">
              Join thousands of conscious citizens taking a stand for Maharashtra’s natural heritage.
            </p>

            <div class="pt-2">
              <button 
                id="story-stand-btn" 
                class="btn-nature-cta w-full sm:w-auto px-6 sm:px-8 py-3.5 rounded-full font-heading font-extrabold text-sm sm:text-base text-black bg-gradient-to-r from-emerald-400 via-emerald-300 to-emerald-400 hover:from-emerald-300 hover:to-emerald-200 shadow-emerald-glow hover:shadow-emerald-glow-lg transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 min-h-[44px]"
              >
                STAND FOR THE SAHYADRI
              </button>
            </div>
          </div>

        </div>

      </div>
    </section>
  `;

  const standBtn = container.querySelector('#story-stand-btn');
  if (standBtn) {
    standBtn.addEventListener('click', () => {
      if (onJoinClick) onJoinClick();
    });
  }

  // Initialize mobile auto-sliding carousel & touch handlers
  initStoryMobileCarousel(container);
}

/**
 * Mobile Auto-Sliding Carousel Controller for Story Section
 */
function initStoryMobileCarousel(container) {
  if (typeof window === 'undefined' || typeof document === 'undefined' || !container || !container.querySelector) {
    return;
  }

  const track = container.querySelector('#story-carousel-track');
  const dotsContainer = container.querySelector('#story-carousel-dots');
  if (!track) return;

  const cards = Array.from(track.querySelectorAll('.story-carousel-card'));
  const dots = dotsContainer ? Array.from(dotsContainer.querySelectorAll('.story-dot')) : [];
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
        dot.className = 'story-dot h-2 rounded-full transition-all duration-300 w-6 bg-[#00FF87] shadow-[0_0_10px_rgba(0,255,135,0.4)]';
        dot.setAttribute('aria-current', 'true');
      } else {
        dot.className = 'story-dot h-2 rounded-full transition-all duration-300 w-2 bg-emerald-950/80 border border-emerald-500/30 hover:border-emerald-400/60';
        dot.removeAttribute('aria-current');
      }
    });
  }

  function goToCard(index, withTransition = true) {
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

    if (!isSwiping) {
      if (Math.abs(deltaY) > 7 && Math.abs(deltaY) >= Math.abs(deltaX)) {
        isVerticalScroll = true;
        return;
      }
      if (Math.abs(deltaX) > 7 && Math.abs(deltaX) > Math.abs(deltaY)) {
        isSwiping = true;
      }
    }

    if (isSwiping) {
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
      const swipeThreshold = 40;
      if (deltaX < -swipeThreshold) {
        nextCard();
      } else if (deltaX > swipeThreshold) {
        prevCard();
      } else {
        goToCard(currentIndex);
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

  track.addEventListener('mouseenter', stopAutoplay);
  track.addEventListener('mouseleave', () => {
    if (isMobile()) startAutoplay();
  });

  cards.forEach((card, idx) => {
    card.addEventListener('click', () => {
      if (isMobile() && idx !== currentIndex && !isSwiping) {
        goToCard(idx);
        resetAutoplay();
      }
    });
  });

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

  const onVisibilityChange = () => {
    if (document.hidden) {
      stopAutoplay();
    } else if (isMobile()) {
      startAutoplay();
    }
  };
  document.addEventListener('visibilitychange', onVisibilityChange);

  if (isMobile()) {
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

  container._cleanupStoryCarousel = () => {
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
