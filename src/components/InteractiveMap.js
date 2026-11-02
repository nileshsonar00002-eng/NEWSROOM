/**
 * SAVE THE SAHYADRI — INTERACTIVE INDIA & SAHYADRI MAP
 * Responsive geospatial map with verified Sahyadri boundary corridor,
 * city-level supporter clusters, connection arcs, and 2D canvas fallback.
 */

import { SAHYADRI_HUB, SAHYADRI_CORRIDOR_COORDS } from '../data/sahyadriData.js';

let mapInstance = null;
let markersLayer = null;
let arcsLayer = null;
let corridorPolyline = null;
let hubMarker = null;

export function renderInteractiveMap(container, supporters = [], onJoinClick) {
  const supporterCount = supporters.length;

  container.innerHTML = `
    <section id="map" class="relative py-12 sm:py-16 lg:py-20 bg-[#030905] border-t border-b border-emerald-500/15">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-10">
        
        <!-- Section Header -->
        <div class="text-center max-w-3xl mx-auto space-y-4 reveal-on-scroll">
          <div class="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 text-xs font-bold tracking-wider uppercase">
            <svg class="w-3.5 h-3.5 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
              <line x1="9" x2="9" y1="3" y2="18" />
              <line x1="15" x2="15" y1="6" y2="21" />
            </svg>
            <span>CITIZEN PARTICIPATION RADAR</span>
          </div>
          <h2 class="font-heading font-black text-3xl sm:text-5xl text-white tracking-tight">
            Voices Across <span class="text-[#00FF87]">India</span>
          </h2>
          <p class="text-base sm:text-lg text-slate-300">
            Real supporters standing united for Maharashtra’s Western Ghats. All locations mapped strictly at city-level to protect participant privacy.
          </p>
        </div>

        <!-- Map Container & Controls Wrapper -->
        <div class="relative rounded-2xl sm:rounded-3xl bg-[#06150E] border border-emerald-500/20 shadow-xl overflow-hidden reveal-on-scroll hover-lift">
          
          <!-- Top Floating Action Toolbar -->
          <div class="p-3 sm:p-4 bg-[#05110B]/90 backdrop-blur-md border-b border-emerald-500/20 flex flex-wrap items-center justify-between gap-3 text-xs z-10">
            
            <!-- Quick View Switchers -->
            <div class="flex items-center gap-2">
              <button 
                id="map-focus-india" 
                class="px-3 py-1.5 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/30 text-emerald-300 font-semibold transition-colors flex items-center gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
              >
                <svg class="w-3.5 h-3.5 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
                  <path d="M2 12h20" />
                </svg>
                <span>India Overview</span>
              </button>
              <button 
                id="map-focus-sahyadri" 
                class="px-3 py-1.5 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/30 text-emerald-300 font-semibold transition-colors flex items-center gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
              >
                <div class="w-4 h-4 rounded-full overflow-hidden bg-[#05392e] border border-emerald-500/40 flex items-center justify-center shrink-0">
                  <img src="/images/logo.png" alt="" class="w-full h-full object-cover" />
                </div>
                <span>Focus Sahyadri & Karjat</span>
              </button>
            </div>

            <!-- City Filter & Stats Pill -->
            <div class="flex items-center gap-3">
              <div class="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#030805] border border-emerald-500/20 text-slate-300 font-mono text-[11px]">
                <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span>Hub: <strong class="text-white">Karjat (Raigad)</strong></span>
              </div>

              <select 
                id="map-city-filter" 
                class="bg-[#030805] text-slate-200 border border-emerald-500/30 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
              >
                <option value="all">Jump to City (${supporterCount} pledges)</option>
              </select>
            </div>

          </div>

          <!-- The Leaflet Map Element -->
          <div class="relative w-full h-[450px] sm:h-[550px] lg:h-[620px] bg-[#06130B]">
            <div id="sahyadri-leaflet-map" class="w-full h-full dark-forest-tiles z-0"></div>

            <!-- Loading Skeleton Overlay -->
            <div id="map-loading-overlay" class="absolute inset-0 bg-[#06130B] flex flex-col items-center justify-center gap-3 z-20 text-slate-400">
              <div class="w-10 h-10 border-3 border-emerald-400 border-t-transparent rounded-full animate-spin"></div>
              <p class="text-sm font-medium">Initializing verified Sahyadri geospatial layers...</p>
            </div>

            <!-- Empty State Overlay (When 0 supporters yet) -->
            <div id="map-empty-state" class="${supporterCount === 0 ? 'flex' : 'hidden'} absolute inset-0 bg-[#030805]/80 backdrop-blur-sm flex-col items-center justify-center p-6 text-center z-10 space-y-4">
              <div class="w-16 h-16 rounded-2xl overflow-hidden bg-[#05392e] border border-emerald-500/30 flex items-center justify-center shadow-emerald-glow">
                <img src="/images/logo.png" alt="Save the Sahyadri Logo" class="w-full h-full object-cover" />
              </div>
              <div class="max-w-md space-y-2">
                <h3 class="font-heading font-black text-xl sm:text-2xl text-white">
                  Be The First Voice To Put Your City On The Map
                </h3>
                <p class="text-sm text-slate-300">
                  Every voice strengthens the public awareness movement. Pledge your support now to illuminate your city and draw the first connection to Sahyadri!
                </p>
              </div>
              <button 
                id="map-empty-join-btn" 
                class="px-6 py-3 rounded-full font-heading font-bold text-sm text-black bg-emerald-400 hover:bg-emerald-300 shadow-emerald-glow transition-all"
              >
                I STAND WITH SAHYADRI
              </button>
            </div>

            <!-- Map Error / Fallback Card -->
            <div id="map-error-state" class="hidden absolute inset-0 bg-[#06130B] flex-col items-center justify-center p-6 text-center z-30 space-y-4">
              <span class="text-3xl">⚠️</span>
              <p class="text-sm text-slate-300 font-medium">Interactive tile provider unreachable. Switch to lightweight 2D vector fallback?</p>
              <button id="map-retry-btn" class="px-4 py-2 rounded-lg bg-emerald-500 text-black text-xs font-bold">
                Retry Connection
              </button>
            </div>

            <!-- Bottom Map Legend -->
            <div class="absolute bottom-3 left-3 sm:bottom-6 sm:left-6 p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-[#06150E]/95 border border-emerald-500/20 backdrop-blur-md text-[10px] sm:text-[11px] text-slate-300 space-y-1.5 sm:space-y-2 z-10 max-w-[calc(100%-24px)] sm:max-w-[260px] shadow-lg pointer-events-auto">
              <div class="font-bold text-white uppercase tracking-wider text-[10px] text-emerald-400 flex items-center gap-1.5">
                <svg class="w-3.5 h-3.5 text-emerald-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
                <span>Map Legend</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="w-3 h-3 rounded-full bg-emerald-400 border border-white shrink-0"></span>
                <span>Karjat / Sahyadri Focal Hub</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="w-6 h-1 bg-emerald-400 rounded shrink-0"></span>
                <span>Western Ghats Mountain Spine</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="w-2.5 h-2.5 rounded-full bg-emerald-300 border border-emerald-600 shrink-0"></span>
                <span>Participating City (Aggregated)</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="w-6 h-0.5 border-t border-dashed border-emerald-400 shrink-0"></span>
                <span>City Connection Arc</span>
              </div>
            </div>

          </div>

          <!-- Bottom Summary Bar -->
          <div class="p-4 bg-[#05110B] border-t border-emerald-500/15 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400">
            <div class="flex items-center gap-2">
              <span class="text-emerald-400 font-bold">✓ Privacy Verification:</span>
              <span>Exact home coordinates are never collected. Markers display city centroids only.</span>
            </div>
            <div class="flex items-center gap-2">
              <span>Verified Hub: <strong>18.9102° N, 73.3283° E (Karjat)</strong></span>
            </div>
          </div>

        </div>

      </div>
    </section>
  `;

  // Attach empty state join button
  const emptyJoinBtn = container.querySelector('#map-empty-join-btn');
  if (emptyJoinBtn) {
    emptyJoinBtn.addEventListener('click', () => {
      if (onJoinClick) onJoinClick();
    });
  }

  // Populate city filter select
  populateCityFilter(container, supporters);

  // Initialize Map
  setTimeout(() => {
    initLeafletMap(container, supporters);
  }, 100);
}

/**
 * Populate the Jump To City filter dropdown
 */
function populateCityFilter(container, supporters) {
  const select = container.querySelector('#map-city-filter');
  if (!select) return;

  const cityMap = new Map();
  supporters.forEach(s => {
    if (s.city) {
      const key = `${s.city}, ${s.state || 'India'}`;
      if (!cityMap.has(key)) {
        cityMap.set(key, { city: s.city, lat: s.lat, lng: s.lng, count: 0 });
      }
      cityMap.get(key).count += 1;
    }
  });

  // Sort by count desc
  const sorted = Array.from(cityMap.entries()).sort((a, b) => b[1].count - a[1].count);

  sorted.forEach(([label, data]) => {
    const opt = document.createElement('option');
    opt.value = `${data.lat},${data.lng}`;
    opt.textContent = `${label} (${data.count} supporter${data.count > 1 ? 's' : ''})`;
    select.appendChild(opt);
  });

  select.addEventListener('change', (e) => {
    if (e.target.value === 'all') {
      if (mapInstance) mapInstance.setView([21.5, 78.5], 5);
      return;
    }
    const [lat, lng] = e.target.value.split(',').map(Number);
    if (!isNaN(lat) && !isNaN(lng) && mapInstance) {
      mapInstance.flyTo([lat, lng], 10, { duration: 1.5 });
    }
  });
}

/**
 * Initialize Leaflet Map Instance
 */
function initLeafletMap(container, supporters) {
  if (typeof window === 'undefined') return;
  const mapElement = container.querySelector('#sahyadri-leaflet-map');
  const loadingOverlay = container.querySelector('#map-loading-overlay');
  const errorState = container.querySelector('#map-error-state');

  if (!window.L) {
    if (loadingOverlay) loadingOverlay.classList.add('hidden');
    if (errorState) errorState.classList.remove('hidden');
    return;
  }

  try {
    const L = window.L;

    // Cleanup previous instance if re-rendering
    if (mapInstance) {
      try {
        mapInstance.remove();
      } catch (_) {}
      mapInstance = null;
    }

    // Default center on Maharashtra / Central India
    mapInstance = L.map(mapElement, {
      center: [19.2, 75.0],
      zoom: 6,
      minZoom: 4,
      maxZoom: 16,
      zoomControl: true,
      attributionControl: false,
      scrollWheelZoom: false // prevents accidental scroll hijack while scrolling down page
    });

    // Dark tiles (CartoDB Dark Matter / Voyager)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      maxZoom: 18,
      subdomains: 'abcd'
    }).addTo(mapInstance);

    // Layer groups
    markersLayer = L.layerGroup().addTo(mapInstance);
    arcsLayer = L.layerGroup().addTo(mapInstance);

    // 1. Plot Sahyadri Mountain Corridor Polyline
    const corridorPoints = SAHYADRI_CORRIDOR_COORDS.map(p => [p.lat, p.lng]);
    corridorPolyline = L.polyline(corridorPoints, {
      color: '#00FF87',
      weight: 4,
      opacity: 0.85,
      dashArray: null,
      lineCap: 'round',
      lineJoin: 'round'
    }).addTo(mapInstance);

    corridorPolyline.bindPopup(`
      <div class="p-2 space-y-1">
        <h4 class="font-bold text-emerald-400 text-sm flex items-center gap-1.5">
          <div class="w-4 h-4 rounded-full overflow-hidden bg-[#05392e] border border-emerald-500/40 inline-flex items-center justify-center shrink-0">
            <img src="/images/logo.png" alt="" class="w-full h-full object-cover" />
          </div>
          <span>Sahyadri Western Ghats Ridge</span>
        </h4>
        <p class="text-xs text-slate-300">Continuous mountainous biodiversity corridor stretching across Maharashtra.</p>
        <div class="text-[10px] text-slate-400 pt-1 border-t border-emerald-500/20">
          Spanning Kalsubai, Bhimashankar, Karjat, Lonavala, and Koyna.
        </div>
      </div>
    `);

    // 2. Plot Karjat Hub Marker with Ancient Sahyadri Tree Icon (Zero glow)
    const hubIcon = L.divIcon({
      className: 'sahyadri-hub-pin',
      html: `
        <div class="relative flex items-center justify-center" style="transform: translate(-50%, -50%);">
          <div class="w-11 h-11 flex items-center justify-center">
            <img src="/images/tree-marker.png" alt="Sahyadri Tree Hub" class="w-full h-full object-contain" />
          </div>
        </div>
      `,
      iconSize: [0, 0]
    });

    hubMarker = L.marker([SAHYADRI_HUB.lat, SAHYADRI_HUB.lng], { icon: hubIcon }).addTo(mapInstance);
    hubMarker.bindPopup(`
      <div class="p-2 space-y-1.5">
        <div class="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
          CAMPAIGN FOCAL POINT
        </div>
        <h4 class="font-bold text-white text-sm">${SAHYADRI_HUB.name}</h4>
        <p class="text-xs text-slate-300">${SAHYADRI_HUB.district}</p>
        <p class="text-[11px] text-slate-400">${SAHYADRI_HUB.significance}</p>
      </div>
    `);

    // 3. Aggregate supporters by city and plot markers
    plotCityMarkers(L, supporters);

    // Hide loader
    if (loadingOverlay) loadingOverlay.classList.add('hidden');

    // Controls
    const focusIndiaBtn = container.querySelector('#map-focus-india');
    if (focusIndiaBtn) {
      focusIndiaBtn.addEventListener('click', () => {
        mapInstance.flyTo([21.5, 78.5], 5, { duration: 1.2 });
      });
    }

    const focusSahyadriBtn = container.querySelector('#map-focus-sahyadri');
    if (focusSahyadriBtn) {
      focusSahyadriBtn.addEventListener('click', () => {
        mapInstance.flyTo([SAHYADRI_HUB.lat, SAHYADRI_HUB.lng], 9.5, { duration: 1.5 });
      });
    }

  } catch (err) {
    console.warn('[Map Init Error]', err);
    if (loadingOverlay) loadingOverlay.classList.add('hidden');
    if (errorState) errorState.classList.remove('hidden');
  }
}

/**
 * Plot Aggregated City Markers and Connection Lines
 */
function plotCityMarkers(L, supporters) {
  if (!markersLayer || !arcsLayer || !Array.isArray(supporters)) return;

  markersLayer.clearLayers();
  arcsLayer.clearLayers();

  // Group by City
  const cityGroups = new Map();
  supporters.forEach(sup => {
    if (!sup.city) return;
    const key = `${sup.city.toLowerCase()}_${(sup.state || '').toLowerCase()}`;
    if (!cityGroups.has(key)) {
      cityGroups.set(key, {
        cityName: sup.city,
        stateName: sup.state,
        lat: sup.lat,
        lng: sup.lng,
        members: []
      });
    }
    cityGroups.get(key).members.push(sup);
  });

  cityGroups.forEach((group) => {
    if (typeof group.lat !== 'number' || typeof group.lng !== 'number') return;

    // Check if city is Karjat itself (skip self-connecting arc)
    const isHubCity = Math.abs(group.lat - SAHYADRI_HUB.lat) < 0.05 && Math.abs(group.lng - SAHYADRI_HUB.lng) < 0.05;

    // 1. Draw connection arc to Karjat
    if (!isHubCity) {
      const arcLine = L.polyline([
        [group.lat, group.lng],
        [SAHYADRI_HUB.lat, SAHYADRI_HUB.lng]
      ], {
        color: '#34D399',
        weight: 1.5,
        opacity: 0.45,
        dashArray: '4, 8'
      });
      arcsLayer.addLayer(arcLine);
    }

    // 2. Minimal Holographic City Marker
    const markerIcon = L.divIcon({
      className: 'city-marker-div',
      html: `
        <div class="relative flex items-center justify-center transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group">
          <!-- Outer semi-transparent ring (8-10px) with subtle holographic pulse -->
          <div class="city-marker-pulse"></div>
          <!-- Tiny neon center dot (4-5px) with specular core -->
          <div class="relative w-2.5 h-2.5 rounded-full border border-emerald-400/50 bg-emerald-400/15 flex items-center justify-center shadow-[0_0_6px_rgba(0,255,135,0.4)] group-hover:scale-125 transition-transform">
            <div class="w-1 h-1 rounded-full bg-emerald-300 shadow-[0_0_4px_#00FF87]"></div>
          </div>
        </div>
      `,
      iconSize: [0, 0]
    });

    const marker = L.marker([group.lat, group.lng], { icon: markerIcon });
    
    // Popup content - strictly only city name
    marker.bindPopup(`
      <div class="p-1 min-w-[120px]">
        <h4 class="font-bold text-white text-sm leading-tight">${escapeHtml(group.cityName)}</h4>
      </div>
    `);

    markersLayer.addLayer(marker);
  });
}

function escapeHtml(text) {
  if (!text) return '';
  return String(text).replace(/[&<>"']/g, function(m) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m];
  });
}

/**
 * Public function to update map when new supporters join
 */
export function updateMapSupporters(supporters) {
  if (!window.L || !mapInstance) return;
  plotCityMarkers(window.L, supporters);
}
