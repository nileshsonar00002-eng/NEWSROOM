/**
 * SAVE THE SAHYADRI — REAL GOOGLE MAPS INTEGRATION (DARK THEME & CUSTOM STYLES)
 * 
 * Features:
 * 1. REAL GOOGLE MAP in the Hero section with a custom, sleek DARK THEME.
 * 2. Dark forest / night styling (#0a1612 land, #041118 water, #10b981 boundaries).
 * 3. Sahyadri / Karjat central hub (18.9102° N, 73.3283° E) highlighted with glowing marker.
 * 4. Curved neon arcs in alternating NEON BLUE (#00E5FF) and NEON GREEN (#00FF87)
 *    connecting participating cities across India to the Sahyadri hub.
 * 5. Animated traveling photon pulses moving along each polyline.
 * 6. Interactive Map Type switcher: Dark Theme (Default) | Satellite | Terrain.
 * 7. "Full View ↗" expanding into a full-screen Dark Theme Google Maps experience.
 * 8. Resilient Vector SVG fallback if offline or loading.
 */

import {
  MAHARASHTRA_BOUNDARY,
  MAHARASHTRA_INTERNAL_DIVISIONS,
  MAHARASHTRA_TARGET,
  INDIA_BOUNDARY_POINTS,
  INDIA_STATE_DIVIDERS,
  REFERENCE_CITIES_DATA,
  projectIndiaGeo,
  projectMaharashtraGeo
} from '../data/maharashtraGeoData.js';
import { SAHYADRI_CORRIDOR_COORDS } from '../data/sahyadriData.js';
import { escapeHtml } from '../utils/sanitize.js';

const SVG_WIDTH = 1000;
const SVG_HEIGHT = 640;

// RoadTok Google Maps API Configuration
const GOOGLE_MAPS_API_KEY = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_GOOGLE_MAPS_API_KEY) || 'AIzaSyCJ0vX19yo_Nqjq-Cny_WisZ7xNaA_Sdzw';
const GOOGLE_MAPS_MAP_ID = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_GOOGLE_MAPS_MAP_ID) || 'b3b06c49ccb18e0372ab5db3';

// POI & Commercial Feature Suppression Styles (Hides shops, businesses, resorts, restaurants while preserving City & State administrative labels)
export const SATELLITE_NO_POI_STYLES = [
  {
    featureType: "poi.business",
    stylers: [{ visibility: "off" }]
  },
  {
    featureType: "poi.attraction",
    stylers: [{ visibility: "off" }]
  },
  {
    featureType: "poi.medical",
    stylers: [{ visibility: "off" }]
  },
  {
    featureType: "poi.school",
    stylers: [{ visibility: "off" }]
  },
  {
    featureType: "poi.sports_complex",
    stylers: [{ visibility: "off" }]
  },
  {
    featureType: "poi.place_of_worship",
    stylers: [{ visibility: "off" }]
  },
  {
    featureType: "poi",
    elementType: "labels",
    stylers: [{ visibility: "off" }]
  },
  {
    featureType: "transit",
    stylers: [{ visibility: "off" }]
  },
  {
    featureType: "administrative.country",
    elementType: "labels",
    stylers: [{ visibility: "on" }]
  },
  {
    featureType: "administrative.province",
    elementType: "labels",
    stylers: [{ visibility: "on" }]
  },
  {
    featureType: "administrative.locality",
    elementType: "labels",
    stylers: [{ visibility: "on" }]
  },
  {
    featureType: "administrative.neighborhood",
    elementType: "labels",
    stylers: [{ visibility: "on" }]
  },
  {
    featureType: "road",
    elementType: "labels",
    stylers: [{ visibility: "on" }]
  }
];

// Custom Dark Forest / Night Theme for Google Maps
export const DARK_FOREST_MAP_STYLES = [
  { elementType: "geometry", stylers: [{ color: "#0a1612" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#040d0a" }, { weight: 3 }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#7ea392" }] },
  {
    featureType: "administrative.country",
    elementType: "geometry.stroke",
    stylers: [{ color: "#10b981" }, { weight: 1.5 }]
  },
  {
    featureType: "administrative.province",
    elementType: "geometry.stroke",
    stylers: [{ color: "#065f46" }, { weight: 1.2 }]
  },
  {
    featureType: "administrative.locality",
    elementType: "labels.text.fill",
    stylers: [{ color: "#34d399" }, { weight: 1 }]
  },
  {
    featureType: "poi",
    stylers: [{ visibility: "off" }]
  },
  {
    featureType: "transit",
    stylers: [{ visibility: "off" }]
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#10231b" }]
  },
  {
    featureType: "road",
    elementType: "geometry.stroke",
    stylers: [{ color: "#081711" }]
  },
  {
    featureType: "road",
    elementType: "labels.text.fill",
    stylers: [{ color: "#618f7a" }]
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [{ color: "#143325" }]
  },
  {
    featureType: "road.highway",
    elementType: "geometry.stroke",
    stylers: [{ color: "#0a1c14" }]
  },
  {
    featureType: "road.highway",
    elementType: "labels.text.fill",
    stylers: [{ color: "#a7f3d0" }]
  },
  {
    featureType: "transit",
    elementType: "geometry",
    stylers: [{ color: "#0e241b" }]
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#041118" }]
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [{ color: "#38bdf8" }]
  },
  {
    featureType: "water",
    elementType: "labels.text.stroke",
    stylers: [{ color: "#02070a" }]
  }
];

let googleMapsScriptPromise = null;
let heroGMapInstance = null;
let heroAnimInterval = null;
let heroPolylines = [];
let heroMarkers = [];

/**
 * Load Google Maps JavaScript API dynamically
 */
export function loadGoogleMapsApi() {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('Window is not defined'));
  }
  if (window.google && window.google.maps) {
    return Promise.resolve(window.google.maps);
  }
  if (googleMapsScriptPromise) {
    return googleMapsScriptPromise;
  }

  googleMapsScriptPromise = new Promise((resolve, reject) => {
    const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
    if (existingScript) {
      existingScript.addEventListener('load', () => resolve(window.google.maps));
      existingScript.addEventListener('error', (err) => reject(err));
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=geometry&region=IN`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      if (window.google && window.google.maps) {
        resolve(window.google.maps);
      } else {
        reject(new Error('Google Maps SDK loaded but window.google.maps not found'));
      }
    };
    script.onerror = (err) => reject(new Error('Failed to load Google Maps script: ' + err));
    document.head.appendChild(script);
  });

  return googleMapsScriptPromise;
}

/**
 * Helper to compute intermediate curved geodesic points between 2 lat/lng points
 * Adaptive curvature: nearby points follow direct, nearly-straight paths with minimal deflection,
 * while distant points follow gentle, proportional arcs without looping or bending back.
 */
export function computeCurvedArcPoints(lat1, lng1, lat2, lng2, numSteps = 35) {
  const points = [];
  const dLat = lat2 - lat1;
  const dLng = lng2 - lng1;
  const dist = Math.sqrt(dLat * dLat + dLng * dLng);

  if (dist < 0.0001) {
    return [{ lat: lat1, lng: lng1 }, { lat: lat2, lng: lng2 }];
  }

  // Distance-adaptive curvature ratio:
  // - Ultra-close (< 0.5 deg / ~50 km): ratio < 1.2%, subtle direct straight line (zero loops)
  // - Medium (1 to 4 deg): ratio 2.5% to 5%, gentle natural arc
  // - Distant (> 5 deg): ratio 7% to 10.5%, smooth sweeping trajectory across India
  // Maximum slope strictly bounded so lines never bend backward or create sharp turns
  const curvatureRatio = Math.min(0.11, 0.13 * Math.pow(dist / (dist + 3.0), 1.25));
  const curvature = dist * curvatureRatio;

  // Normalized orthogonal unit vector
  const normLat = -dLng / dist;
  const normLng = dLat / dist;

  // Smooth adaptive sample steps for fluid polyline interpolation
  const steps = Math.max(20, Math.min(50, Math.round(numSteps || (20 + dist * 3))));

  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    let lat = lat1 + dLat * t;
    let lng = lng1 + dLng * t;

    // Sinusoidal arch offset perpendicular to direction
    const arch = Math.sin(t * Math.PI) * curvature;
    lat += normLat * arch;
    lng += normLng * arch;

    points.push({ lat, lng });
  }

  return points;
}

/**
 * Generate Minimal Holographic Dot SVG icon for Google Maps location/report markers
 * - Tiny neon center dot: 4–5 px in diameter (radius ~2.2px)
 * - Thin semi-transparent outer ring: 8–10 px overall diameter (radius ~4.5px)
 * - Slow, subtle holographic pulse aura breathing smoothly
 * - Minimal, unobtrusive count indicator when multiple reports/supporters cluster (> 1)
 */
export function createHolographicMarkerSvg({
  color = '#00FF87',
  isBlue = false,
  count = 1,
  size = 24
} = {}) {
  const strokeColor = isBlue ? '#00E5FF' : (color || '#00FF87');
  const showCount = count > 1;
  const countLabel = count > 99 ? '99+' : String(count);
  const glowId = isBlue ? 'b' : 'g';

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24">
  <defs>
    <radialGradient id="holo-glow-${glowId}" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="${strokeColor}" stop-opacity="0.35" />
      <stop offset="65%" stop-color="${strokeColor}" stop-opacity="0.10" />
      <stop offset="100%" stop-color="${strokeColor}" stop-opacity="0" />
    </radialGradient>
  </defs>
  <!-- Subtle holographic breathing pulse aura -->
  <circle cx="12" cy="12" r="5" fill="url(#holo-glow-${glowId})">
    <animate attributeName="r" values="4.5;6.4;4.5" dur="3.2s" repeatCount="indefinite" />
    <animate attributeName="opacity" values="0.75;0.2;0.75" dur="3.2s" repeatCount="indefinite" />
  </circle>
  <!-- Thin semi-transparent outer ring (8-10px diameter, radius 4.5px) -->
  <circle cx="12" cy="12" r="4.5" fill="${strokeColor}" fill-opacity="0.08" stroke="${strokeColor}" stroke-opacity="0.45" stroke-width="0.9">
    <animate attributeName="r" values="4.2;4.9;4.2" dur="3.2s" repeatCount="indefinite" />
    <animate attributeName="stroke-opacity" values="0.55;0.25;0.55" dur="3.2s" repeatCount="indefinite" />
  </circle>
  <!-- Tiny neon center dot (4-5px diameter, radius 2.2px) -->
  <circle cx="12" cy="12" r="2.2" fill="${strokeColor}" />
  <!-- Microscopic specular glint -->
  <circle cx="12" cy="12" r="0.8" fill="#FFFFFF" opacity="0.95" />
  ${showCount ? `<rect x="14.5" y="1.5" width="${count > 9 ? 13 : 9.5}" height="8.5" rx="4.25" fill="#04120A" stroke="${strokeColor}" stroke-opacity="0.65" stroke-width="0.75" />
  <text x="${14.5 + (count > 9 ? 6.5 : 4.75)}" y="7.8" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-size="6.5" font-weight="800" fill="${strokeColor}">${countLabel}</text>` : ''}
</svg>`.trim();

  return 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg);
}

/**
 * Display interactive Report Details Card when tapping/clicking a holographic marker.
 * Positioned in the horizontal center of the map viewport, directly below the map heading / pill text.
 */
export function showReportDetailsCard(container, city, strokeColor = '#00FF87') {
  if (!container || !city) return;

  // Locate the map viewport within container (or overlay) so the card is centered inside the map frame
  const mapViewport = container.querySelector ? (container.querySelector('.map-3d-viewport') || container) : container;

  // Remove any previously open details cards
  if (typeof document !== 'undefined') {
    const existing = document.querySelectorAll('.sahyadri-report-details-card');
    existing.forEach((el) => el.remove());
  }

  const isFullscreen = (container.querySelector && !!container.querySelector('#fullview-headline-card')) || container.id === 'maharashtra-fullscreen-overlay';
  const isBlue = strokeColor === '#00E5FF';

  if (typeof document === 'undefined') return;

  const card = document.createElement('div');
  // Placed in horizontal center (left-1/2 -translate-x-1/2) right below map heading / pill text
  card.className = `sahyadri-report-details-card absolute left-1/2 -translate-x-1/2 ${
    isFullscreen ? 'top-[72px] sm:top-[92px]' : 'top-[48px] sm:top-[56px]'
  } z-30 w-auto min-w-[130px] max-w-[90%] sm:max-w-[280px] bg-[#04120A]/95 backdrop-blur-xl border border-emerald-500/35 rounded-2xl px-3.5 py-2.5 shadow-2xl text-white animate-fadeIn-center select-none pointer-events-auto`;

  card.innerHTML = `
    <div class="flex items-center justify-between gap-3">
      <div class="flex items-center gap-2 min-w-0">
        <div class="w-2.5 h-2.5 rounded-full ${isBlue ? 'bg-cyan-400 shadow-[0_0_8px_#00E5FF]' : 'bg-emerald-400 shadow-[0_0_8px_#00FF87]'} animate-pulse shrink-0"></div>
        <h4 class="font-bold text-sm text-white leading-tight truncate">${escapeHtml(city.name || city.cityName || '')}</h4>
      </div>
      <button class="report-card-close text-slate-400 hover:text-white p-1 rounded-lg hover:bg-emerald-950/60 transition-colors cursor-pointer text-xs font-bold leading-none shrink-0" title="Close" aria-label="Close report details">✕</button>
    </div>
  `;

  const closeBtn = card.querySelector('.report-card-close');
  if (closeBtn) closeBtn.onclick = (e) => {
    e.stopPropagation();
    card.remove();
  };

  mapViewport.appendChild(card);
  return card;
}

/**
 * Zoom-adaptive line styling parameters for Google Maps connection polylines & holographic markers
 * - Country/India-level zoom (<= 5.5): 1.0 - 1.5 px stroke, compact 18px marker footprint (3.5px center dot, 7px ring)
 * - Medium zoom (5.5 < zoom <= 7.5): ~2.0 px stroke, 18-22px marker footprint
 * - Close/local zoom (> 7.5): 2.5 - 2.8 px stroke, 22-26px marker footprint (4.8px center dot, 9.8px ring)
 * @param {number} zoom Current Google Maps zoom level
 * @returns {Object} { strokeWeight, strokeOpacity, photonScale, photonStrokeWeight, cityMarkerScale, cityMarkerStrokeWeight, holoMarkerPixelSize }
 */
export function getAdaptiveLineStyle(zoom = 6.8) {
  if (zoom <= 5.5) {
    return {
      strokeWeight: 1.2,
      strokeOpacity: 0.75,
      photonScale: 2.5,
      photonStrokeWeight: 1.2,
      cityMarkerScale: 4.5,
      cityMarkerStrokeWeight: 1.8,
      holoMarkerPixelSize: 18,
      treeMarkerSize: 34
    };
  } else if (zoom <= 7.5) {
    const factor = (zoom - 5.5) / 2.0; // 0.0 to 1.0
    const weight = 1.2 + factor * 0.8; // 1.2 to 2.0 px
    const opacity = 0.75 + factor * 0.15; // 0.75 to 0.90
    return {
      strokeWeight: Math.round(weight * 10) / 10,
      strokeOpacity: Math.round(opacity * 100) / 100,
      photonScale: Math.round((2.5 + factor * 0.8) * 10) / 10,
      photonStrokeWeight: Math.round((1.2 + factor * 0.5) * 10) / 10,
      cityMarkerScale: Math.round((4.5 + factor * 1.0) * 10) / 10,
      cityMarkerStrokeWeight: Math.round((1.8 + factor * 0.5) * 10) / 10,
      holoMarkerPixelSize: Math.round(18 + factor * 4), // 18 to 22 px
      treeMarkerSize: Math.round(34 + factor * 10) // 34 to 44 px
    };
  } else {
    const factor = Math.min(1.0, (zoom - 7.5) / 2.5); // 0.0 to 1.0
    const weight = 2.0 + factor * 0.8; // 2.0 to 2.8 px
    const opacity = 0.90 + factor * 0.05; // 0.90 to 0.95
    return {
      strokeWeight: Math.round(weight * 10) / 10,
      strokeOpacity: Math.round(opacity * 100) / 100,
      photonScale: Math.round((3.3 + factor * 0.7) * 10) / 10,
      photonStrokeWeight: Math.round((1.7 + factor * 0.5) * 10) / 10,
      cityMarkerScale: Math.round((5.5 + factor * 0.5) * 10) / 10,
      cityMarkerStrokeWeight: Math.round((2.3 + factor * 0.2) * 10) / 10,
      holoMarkerPixelSize: Math.round(22 + factor * 4), // 22 to 26 px
      treeMarkerSize: Math.round(44 + factor * 12) // 44 to 56 px
    };
  }
}

/**
 * Render Real Google Map with Dark Theme inside Hero Section
 */
export function renderHeroMaharashtraMap(container, supporters = [], onFullViewClick) {
  if (typeof window === 'undefined') return;

  const gmapDiv = container.querySelector('#hero-google-map-target');
  const svgMount = container.querySelector('#hero-map-mount');
  const loader = container.querySelector('#hero-map-loader');

  // Populate SVG fallback initially so there is zero empty space
  if (svgMount) {
    svgMount.innerHTML = generateMaharashtraSvgHtml(supporters, 'hero-fallback');
  }

  // Update dynamic count on stats card
  updateStatsCard(container, supporters);

  // Wire Hero Map Join Button
  const joinBtn = container.querySelector('#hero-map-join-cta');
  if (joinBtn) {
    joinBtn.onclick = () => {
      if (window.__sahyadriOpenJoinModal) window.__sahyadriOpenJoinModal();
    };
  }

  // Wire Full View Button
  const fullViewBtn = container.querySelector('#hero-map-fullview-btn');
  if (fullViewBtn) {
    fullViewBtn.onclick = () => {
      openMaharashtraFullView(supporters);
      if (onFullViewClick) onFullViewClick();
    };
  }

  if (!gmapDiv) return;

  // Initialize Real Google Map with Dark Theme
  loadGoogleMapsApi()
    .then((maps) => {
      if (loader) loader.classList.add('hidden');
      if (svgMount) svgMount.classList.add('hidden');
      gmapDiv.classList.remove('hidden');

      // Prevent native context menu & browser image magnification gesture triggers on map
      gmapDiv.addEventListener('contextmenu', (e) => e.preventDefault(), { capture: true });

      // Clear any previous interval and polylines
      if (heroAnimInterval) {
        clearInterval(heroAnimInterval);
        heroAnimInterval = null;
      }
      heroPolylines.forEach(p => p.setMap(null));
      heroMarkers.forEach(m => m.setMap(null));
      heroPolylines = [];
      heroMarkers = [];

      // Create Google Map Instance with Authentic Natural Satellite View (Zero commercial POIs/shops/resorts)
      heroGMapInstance = new maps.Map(gmapDiv, {
        center: { lat: 18.9183, lng: 73.4370 },
        zoom: 6.8,
        minZoom: 4,
        maxZoom: 15,
        mapTypeId: maps.MapTypeId.HYBRID, // Satellite imagery with City & State labels (Zero commercial POI clutter)
        styles: SATELLITE_NO_POI_STYLES, // Explicit POI suppression styling rules
        disableDefaultUI: true,
        zoomControl: false,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        rotateControl: true,
        clickableIcons: false, // Strictly prevents all POI place preview popups
        gestureHandling: 'greedy', // Prevents "Use ctrl + scroll" overlay preview box
        scrollwheel: true,
        tilt: 45, // 3D Camera tilt
        heading: 20, // 3D Camera azimuth
        backgroundColor: '#07130C'
      });

      // Sahyadri / Karjat Target Coordinate (Focal Tree Hub)
      const karjatPos = { lat: 18.9183, lng: 73.4370 };

      // Prepare Participating Cities
      const citiesToRender = getCombinedCities(supporters);
      const initialHeroZoom = heroGMapInstance.getZoom() || 6.8;
      const initialHeroStyle = getAdaptiveLineStyle(initialHeroZoom);
      const heroTreeSize = initialHeroStyle.treeMarkerSize || 42;

      // Ancient Sahyadri Tree Hub Marker where all connection lines converge (Zero glow)
      const karjatMarker = new maps.Marker({
        position: karjatPos,
        map: heroGMapInstance,
        zIndex: 1000,
        icon: {
          url: '/images/tree-marker.png',
          scaledSize: new maps.Size(heroTreeSize, heroTreeSize),
          anchor: new maps.Point(heroTreeSize / 2, heroTreeSize / 2)
        }
      });
      heroMarkers.push(karjatMarker);

      // Render Curved Neon Arcs & Markers
      citiesToRender.forEach((city, idx) => {
        if (!city.lat || !city.lng) return;
        const isHub = Math.abs(city.lat - 18.9183) < 0.08 && Math.abs(city.lng - 73.4370) < 0.08;
        if (isHub) return;

        // Alternate colors: Neon Blue (#00E5FF) and Neon Green (#00FF87)
        const isBlue = (idx % 2 === 1);
        const strokeColor = isBlue ? '#00E5FF' : '#00FF87';
        const markerPixelSize = initialHeroStyle.holoMarkerPixelSize || 20;

        // Minimal Holographic Dot Marker:
        // Tiny 4-5px center dot with specular glint, thin semi-transparent 8-10px outer ring,
        // slow subtle pulse animation, and compact cluster indicator for multiple reports.
        const cityMarker = new maps.Marker({
          position: { lat: city.lat, lng: city.lng },
          map: heroGMapInstance,
          cursor: 'pointer',
          zIndex: 500,
          icon: {
            url: createHolographicMarkerSvg({
              color: strokeColor,
              isBlue,
              count: city.count || 1,
              size: 24
            }),
            size: new maps.Size(24, 24),
            scaledSize: new maps.Size(markerPixelSize, markerPixelSize),
            anchor: new maps.Point(markerPixelSize / 2, markerPixelSize / 2)
          }
        });

        // Clicking / tapping report marker opens its report details card
        cityMarker.addListener('click', () => {
          showReportDetailsCard(container, city, strokeColor);
        });

        heroMarkers.push(cityMarker);

        // Compute curved points
        const arcPoints = computeCurvedArcPoints(city.lat, city.lng, 18.9183, 73.4370, 35);

        // Traveling photon symbol on polyline
        const photonSymbol = {
          path: maps.SymbolPath.CIRCLE,
          scale: initialHeroStyle.photonScale,
          fillColor: '#FFFFFF',
          fillOpacity: 1,
          strokeColor: strokeColor,
          strokeWeight: initialHeroStyle.photonStrokeWeight
        };

        // Polyline with adaptive stroke weight & glow
        const polyline = new maps.Polyline({
          path: arcPoints,
          geodesic: false,
          strokeColor: strokeColor,
          strokeOpacity: initialHeroStyle.strokeOpacity,
          strokeWeight: initialHeroStyle.strokeWeight,
          icons: [{
            icon: photonSymbol,
            offset: '0%'
          }],
          map: heroGMapInstance
        });
        heroPolylines.push(polyline);
      });

      // Dynamically update connection line thickness & glow on zoom changes
      heroGMapInstance.addListener('zoom_changed', () => {
        const zoom = heroGMapInstance.getZoom();
        if (typeof zoom !== 'number') return;
        const style = getAdaptiveLineStyle(zoom);
        const newTreeSize = style.treeMarkerSize || 42;

        if (karjatMarker) {
          karjatMarker.setIcon({
            url: '/images/tree-marker.png',
            scaledSize: new maps.Size(newTreeSize, newTreeSize),
            anchor: new maps.Point(newTreeSize / 2, newTreeSize / 2)
          });
        }

        heroPolylines.forEach((poly) => {
          poly.setOptions({
            strokeWeight: style.strokeWeight,
            strokeOpacity: style.strokeOpacity
          });
          const icons = poly.get('icons');
          if (icons && icons[0] && icons[0].icon) {
            icons[0].icon.scale = style.photonScale;
            icons[0].icon.strokeWeight = style.photonStrokeWeight;
            poly.set('icons', icons);
          }
        });

        heroMarkers.forEach((marker, idx) => {
          if (idx === 0) return; // Preserve Karjat focal beacon
          const icon = marker.getIcon();
          if (icon && typeof icon === 'object' && icon.url) {
            const newPixelSize = style.holoMarkerPixelSize || 20;
            marker.setIcon({
              ...icon,
              scaledSize: new maps.Size(newPixelSize, newPixelSize),
              anchor: new maps.Point(newPixelSize / 2, newPixelSize / 2)
            });
          }
        });
      });

      // Dismiss report card when clicking anywhere on the map
      heroGMapInstance.addListener('click', () => {
        const existingCard = container.querySelector('.sahyadri-report-details-card');
        if (existingCard) existingCard.remove();
      });

      // Animate Traveling Light Pulses along the curves
      let animTick = 0;
      heroAnimInterval = setInterval(() => {
        animTick = (animTick + 1) % 100;
        heroPolylines.forEach((poly, i) => {
          const icons = poly.get('icons');
          if (icons && icons[0]) {
            const offset = (animTick * 1.4 + (i * 12)) % 100;
            icons[0].offset = `${offset}%`;
            poly.set('icons', icons);
          }
        });
      }, 35);

      // Permanent 3D Perspective Mode Default
      const heroHorizon = container.querySelector('#hero-map-3d-horizon');
      const isHero3D = true;
      if (gmapDiv) gmapDiv.classList.add('is-3d');
      if (heroHorizon) heroHorizon.style.opacity = '1';
      if (heroGMapInstance && typeof heroGMapInstance.setTilt === 'function') heroGMapInstance.setTilt(45);
      if (heroGMapInstance && typeof heroGMapInstance.setHeading === 'function') heroGMapInstance.setHeading(20);

      // Wire Reset Focus Button
      const resetBtn = container.querySelector('#hero-map-reset-btn');
      if (resetBtn) {
        resetBtn.onclick = () => {
          heroGMapInstance.setCenter(karjatPos);
          heroGMapInstance.setZoom(6.8);
          if (typeof heroGMapInstance.setTilt === 'function') heroGMapInstance.setTilt(45);
          if (typeof heroGMapInstance.setHeading === 'function') heroGMapInstance.setHeading(20);
        };
      }

      // Wire Hero Map Dedicated Zoom Buttons (+ / -)
      const heroZoomIn = container.querySelector('#hero-map-zoom-in');
      const heroZoomOut = container.querySelector('#hero-map-zoom-out');
      if (heroZoomIn) {
        heroZoomIn.onclick = () => {
          heroGMapInstance.setZoom(Math.min(15, (heroGMapInstance.getZoom() || 6.8) + 1));
        };
      }
      if (heroZoomOut) {
        heroZoomOut.onclick = () => {
          heroGMapInstance.setZoom(Math.max(4, (heroGMapInstance.getZoom() || 6.8) - 1));
        };
      }

      // Wire Hero Map Dedicated Fullscreen Button
      const heroFullscreenBtn = container.querySelector('#hero-map-fullscreen-btn');
      if (heroFullscreenBtn) {
        heroFullscreenBtn.onclick = () => {
          openMaharashtraFullView(supporters);
        };
      }
    })
    .catch((err) => {
      console.warn('[HeroMap] Google Maps load notice, using SVG fallback:', err);
      if (loader) loader.classList.add('hidden');
      if (gmapDiv) gmapDiv.classList.add('hidden');
      if (svgMount) svgMount.classList.remove('hidden');
    });
}

/**
 * Open Full View Full-Screen Interactive Google Maps Overlay with Dark Theme
 */
export function openMaharashtraFullView(supporters = []) {
  closeMaharashtraFullView();

  const totalCount = Array.isArray(supporters) ? supporters.length : 0;
  const latestSupporter = (Array.isArray(supporters) && supporters.length > 0) ? supporters[0] : null;
  const lastJoinedText = latestSupporter
    ? `${latestSupporter.city || 'MUMBAI'}, ${latestSupporter.state || 'MAHARASHTRA'}`.toUpperCase()
    : 'MUMBAI, MAHARASHTRA';

  const overlay = document.createElement('div');
  overlay.id = 'maharashtra-fullscreen-overlay';
  overlay.className = 'fixed inset-0 z-50 flex flex-col bg-[#020704]/98 backdrop-blur-2xl text-slate-100 select-none animate-fadeIn';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-label', 'Full-screen Interactive Movement Map');

  overlay.innerHTML = `
    <!-- Top Navigation Header -->
    <header class="h-14 sm:h-16 px-3 sm:px-6 border-b border-emerald-500/20 bg-[#040E07]/95 backdrop-blur-md flex items-center justify-between z-30 shrink-0">
      
      <!-- Left Brand: Pure SAVE SAHYADRI next to Logo -->
      <div class="flex items-center gap-2.5 sm:gap-3">
        <span class="w-8 h-8 sm:w-9 sm:h-9 rounded-xl overflow-hidden bg-[#05392e] border border-emerald-500/40 flex items-center justify-center shrink-0 shadow-emerald-glow-sm">
          <img src="/images/logo.png" alt="Save the Sahyadri Logo" class="w-full h-full object-cover" />
        </span>
        <span class="font-heading font-black text-sm sm:text-base text-white tracking-tight">
          SAVE SAHYADRI
        </span>
        <span id="fullview-provider-badge" class="hidden"></span>
      </div>

      <!-- Header Controls: Pledge & Exit Buttons -->
      <div class="flex items-center justify-end gap-2 sm:gap-3 shrink-0">

        <!-- Pledge Action Button (Always Visible) -->
        <button 
          id="fullview-join-btn"
          class="btn-nature-cta inline-flex items-center gap-1.5 px-4 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-400 hover:from-emerald-400 hover:to-emerald-300 text-black font-heading font-extrabold text-xs tracking-wider uppercase shadow-emerald-glow-sm transition-all cursor-pointer active:scale-95"
        >
          <div class="w-4 h-4 rounded-full overflow-hidden bg-[#05392e] border border-black/20 flex items-center justify-center shrink-0 shadow-sm">
            <img src="/images/logo.png" alt="Save the Sahyadri Logo" class="w-full h-full object-cover" />
          </div>
          <span>PLEDGE</span>
          <span>→</span>
        </button>

        <!-- Exit Button (Always Visible) -->
        <button 
          id="fullview-close-btn" 
          aria-label="Exit full view map" 
          title="Exit Full Screen View"
          class="px-3.5 sm:px-4 py-2 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/35 text-slate-200 hover:text-white text-xs font-heading font-bold flex items-center gap-1.5 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 cursor-pointer active:scale-95 shadow-md"
        >
          <span class="text-sm font-bold text-emerald-400">✕</span>
          <span>Exit</span>
          <span class="hidden sm:inline text-slate-400 font-normal font-sans">(Esc)</span>
        </button>
      </div>
    </header>

    <!-- Main Map Viewport -->
    <div id="fullview-map-viewport" class="relative flex-1 w-full h-full overflow-hidden bg-[#030A06] map-3d-viewport">
      
      <!-- 3D Horizon Atmosphere Gradient -->
      <div id="fullview-map-3d-horizon" class="map-3d-horizon"></div>

      <!-- Floating Campaign Headline in Upper Black Horizon (Line 1 from Left, Line 2 from Right) -->
      <div id="fullview-headline-card" class="absolute top-4 sm:top-6 lg:top-7 inset-x-0 mx-auto w-full max-w-2xl px-4 z-30 pointer-events-none text-center select-none overflow-hidden">
        <div class="inline-flex flex-col items-center justify-center space-y-0.5 sm:space-y-1">
          <div class="map-headline-left font-heading font-black text-sm sm:text-lg lg:text-xl text-white tracking-wider uppercase drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]">
            32,490 TREES AT RISK?
          </div>
          <div class="map-headline-right font-heading font-black text-xs sm:text-sm lg:text-base text-[#00FF87] tracking-wider uppercase drop-shadow-[0_0_16px_rgba(0,255,135,0.45)]">
            INDIA CONNECTS TO SAVE SAHYADRI.
          </div>
        </div>
      </div>

      <!-- Google Maps Target Div -->
      <div id="google-maps-target" class="w-full h-full is-3d"></div>

      <!-- Vector SVG Fallback Container -->
      <div id="vector-svg-fallback" class="hidden w-full h-full max-w-6xl max-h-[85vh] mx-auto p-4 items-center justify-center">
        ${generateMaharashtraSvgHtml(supporters, 'fullview-fallback')}
      </div>

      <!-- Loading Overlay -->
      <div id="fullview-loader" class="absolute inset-0 flex flex-col items-center justify-center bg-[#030905]/90 z-20 transition-opacity duration-300">
        <div class="w-12 h-12 border-3 border-emerald-500/30 border-t-emerald-400 rounded-full animate-spin mb-4"></div>
        <p class="text-sm font-heading font-bold text-emerald-400">Loading Dark Theme Google Map...</p>
        <p class="text-xs text-slate-400 mt-1 font-mono">Deep forest aesthetic & neon arcs</p>
      </div>

      <!-- Floating Live Stats Panel in Fullscreen (Bottom-Left HUD) -->
      <div class="absolute bottom-4 left-3 sm:bottom-6 sm:left-6 p-3 sm:p-4 rounded-2xl bg-[#06150E]/95 border border-emerald-500/25 backdrop-blur-md flex items-stretch gap-3 z-30 shadow-2xl max-w-[calc(100%-24px)] sm:max-w-[280px] pointer-events-auto transition-all animate-fadeIn">
        <!-- Green vertical accent bar -->
        <div class="w-1.5 bg-[#00FF87] rounded-full shrink-0 shadow-emerald-glow"></div>
        
        <div class="space-y-0.5 min-w-0">
          <div class="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-[#00FF87] truncate">
            PEOPLE UNITED FOR SAHYADRI
          </div>
          <div id="fullview-stats-members-count" class="hero-stats-members-count text-2xl sm:text-3xl font-heading font-black text-white tracking-tight leading-tight">
            ${totalCount.toLocaleString('en-IN')}
          </div>
          <div class="text-[9px] sm:text-[10px] text-slate-400 uppercase font-semibold tracking-wider">
            MEMBERS JOINED
          </div>
          
          <div class="pt-1.5 border-t border-emerald-500/20 flex flex-col gap-0.5">
            <div class="flex items-center gap-1.5 text-[8.5px] sm:text-[9px] text-[#00FF87] font-bold">
              <span class="w-1.5 h-1.5 rounded-full bg-[#00FF87] animate-pulse shrink-0"></span>
              <span class="truncate">LAST JOINED:</span>
            </div>
            <div id="fullview-stats-last-city" class="hero-stats-last-city text-[10px] sm:text-[11px] font-bold text-white uppercase tracking-tight truncate">
              ${lastJoinedText}
            </div>
          </div>
        </div>
      </div>

      <!-- Floating Interactive Controls (Bottom-Right) -->
      <div class="absolute bottom-6 right-6 flex flex-col gap-2 z-30 bg-[#040E07]/92 p-2 rounded-2xl border border-emerald-500/30 shadow-2xl backdrop-blur-md">
        <button 
          id="fullview-zoom-in" 
          aria-label="Zoom in map" 
          title="Zoom In (+)"
          class="w-10 h-10 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/25 text-emerald-300 hover:text-white font-bold text-lg flex items-center justify-center transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 cursor-pointer active:scale-95"
        >
          +
        </button>
        <button 
          id="fullview-zoom-out" 
          aria-label="Zoom out map" 
          title="Zoom Out (-)"
          class="w-10 h-10 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/25 text-emerald-300 hover:text-white font-bold text-lg flex items-center justify-center transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 cursor-pointer active:scale-95"
        >
          −
        </button>
        <button 
          id="fullview-reset" 
          aria-label="Reset map view" 
          title="Reset View to Karjat"
          class="w-10 h-10 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/25 text-emerald-300 hover:text-white font-bold text-sm flex items-center justify-center transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 cursor-pointer active:scale-95"
        >
          ↺
        </button>
      </div>

    </div>
  `;

  document.body.appendChild(overlay);
  document.body.classList.add('overflow-hidden');

  // Trigger smooth left/right entrance animations cleanly on mount
  const lineLeft = overlay.querySelector('.map-headline-left');
  const lineRight = overlay.querySelector('.map-headline-right');
  if (lineLeft && lineRight && typeof requestAnimationFrame !== 'undefined') {
    lineLeft.classList.remove('map-headline-left');
    lineRight.classList.remove('map-headline-right');
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        lineLeft.classList.add('map-headline-left');
        lineRight.classList.add('map-headline-right');
      });
    });
  }

  const closeBtn = overlay.querySelector('#fullview-close-btn');
  if (closeBtn) {
    closeBtn.addEventListener('click', closeMaharashtraFullView);
  }

  const joinBtn = overlay.querySelector('#fullview-join-btn');
  if (joinBtn) {
    joinBtn.addEventListener('click', () => {
      closeMaharashtraFullView();
      if (window.__sahyadriOpenJoinModal) window.__sahyadriOpenJoinModal();
    });
  }

  const loader = overlay.querySelector('#fullview-loader');
  const gmapTarget = overlay.querySelector('#google-maps-target');
  const svgFallback = overlay.querySelector('#vector-svg-fallback');
  const providerBadge = overlay.querySelector('#fullview-provider-badge');

  let gmap = null;
  let fvInterval = null;
  const fvPolylines = [];
  const fvMarkers = [];

  loadGoogleMapsApi()
    .then((maps) => {
      if (loader) loader.classList.add('hidden');

      // Prevent native context menu & browser image magnification gesture triggers on fullview map
      if (gmapTarget) {
        gmapTarget.addEventListener('contextmenu', (e) => e.preventDefault(), { capture: true });
      }

      // Initialize with Authentic Natural Satellite View with City & State labels (Zero commercial POIs/shops/resorts)
      gmap = new maps.Map(gmapTarget, {
        center: { lat: 18.9183, lng: 73.4370 },
        zoom: 7.2,
        minZoom: 4,
        maxZoom: 16,
        mapTypeId: maps.MapTypeId.HYBRID, // Satellite imagery with City & State labels (Zero commercial POI clutter)
        styles: SATELLITE_NO_POI_STYLES, // Explicit POI suppression styling rules
        disableDefaultUI: true,
        zoomControl: false,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        rotateControl: true,
        clickableIcons: false, // Prevents all place preview cards
        gestureHandling: 'greedy', // Prevents gesture overlay
        scrollwheel: true,
        tilt: 45, // 3D Camera tilt
        heading: 20, // 3D Camera azimuth
        backgroundColor: '#07130C'
      });

      // Target Coordinates: Karjat Hub (Focal Tree Hub)
      const karjatLatLng = new maps.LatLng(18.9183, 73.4370);

      const cities = getCombinedCities(supporters);
      const initialFvZoom = gmap.getZoom() || 7.2;
      const initialFvStyle = getAdaptiveLineStyle(initialFvZoom);
      const fvTreeSize = initialFvStyle.treeMarkerSize || 44;

      // Ancient Sahyadri Tree Hub Marker where all connection lines converge in Full View (Zero glow)
      const karjatMarker = new maps.Marker({
        position: karjatLatLng,
        map: gmap,
        zIndex: 1000,
        icon: {
          url: '/images/tree-marker.png',
          scaledSize: new maps.Size(fvTreeSize, fvTreeSize),
          anchor: new maps.Point(fvTreeSize / 2, fvTreeSize / 2)
        }
      });

      cities.forEach((city, idx) => {
        if (!city.lat || !city.lng) return;
        const isHub = Math.abs(city.lat - 18.9183) < 0.08 && Math.abs(city.lng - 73.4370) < 0.08;
        if (isHub) return;

        const isBlue = (idx % 2 === 1);
        const strokeColor = isBlue ? '#00E5FF' : '#00FF87';
        const markerPixelSize = initialFvStyle.holoMarkerPixelSize || 22;

        // Minimal Holographic Dot Marker in Full View
        const cityMarker = new maps.Marker({
          position: { lat: city.lat, lng: city.lng },
          map: gmap,
          cursor: 'pointer',
          zIndex: 500,
          icon: {
            url: createHolographicMarkerSvg({
              color: strokeColor,
              isBlue,
              count: city.count || 1,
              size: 24
            }),
            size: new maps.Size(24, 24),
            scaledSize: new maps.Size(markerPixelSize, markerPixelSize),
            anchor: new maps.Point(markerPixelSize / 2, markerPixelSize / 2)
          }
        });

        cityMarker.addListener('click', () => {
          showReportDetailsCard(overlay, city, strokeColor);
        });

        fvMarkers.push(cityMarker);

        // Compute curved arc
        const curvePath = computeCurvedArcPoints(city.lat, city.lng, 18.9183, 73.4370, 35);

        const polyline = new maps.Polyline({
          path: curvePath,
          geodesic: false,
          strokeColor: strokeColor,
          strokeOpacity: initialFvStyle.strokeOpacity,
          strokeWeight: initialFvStyle.strokeWeight,
          icons: [{
            icon: {
              path: maps.SymbolPath.CIRCLE,
              scale: initialFvStyle.photonScale,
              fillColor: '#FFFFFF',
              fillOpacity: 1,
              strokeColor: strokeColor,
              strokeWeight: initialFvStyle.photonStrokeWeight
            },
            offset: '0%'
          }],
          map: gmap
        });
        fvPolylines.push(polyline);
      });

      // Dynamically update connection line thickness & glow on zoom changes in Full View
      gmap.addListener('zoom_changed', () => {
        const zoom = gmap.getZoom();
        if (typeof zoom !== 'number') return;
        const style = getAdaptiveLineStyle(zoom);
        const newTreeSize = style.treeMarkerSize || 44;

        if (karjatMarker) {
          karjatMarker.setIcon({
            url: '/images/tree-marker.png',
            scaledSize: new maps.Size(newTreeSize, newTreeSize),
            anchor: new maps.Point(newTreeSize / 2, newTreeSize / 2)
          });
        }

        fvPolylines.forEach((poly) => {
          poly.setOptions({
            strokeWeight: style.strokeWeight,
            strokeOpacity: style.strokeOpacity
          });
          const icons = poly.get('icons');
          if (icons && icons[0] && icons[0].icon) {
            icons[0].icon.scale = style.photonScale;
            icons[0].icon.strokeWeight = style.photonStrokeWeight;
            poly.set('icons', icons);
          }
        });

        fvMarkers.forEach((marker) => {
          const icon = marker.getIcon();
          if (icon && typeof icon === 'object' && icon.url) {
            const newPixelSize = style.holoMarkerPixelSize || 22;
            marker.setIcon({
              ...icon,
              scaledSize: new maps.Size(newPixelSize, newPixelSize),
              anchor: new maps.Point(newPixelSize / 2, newPixelSize / 2)
            });
          }
        });
      });

      // Dismiss report card when clicking anywhere on the full-screen map
      gmap.addListener('click', () => {
        const existingCard = overlay.querySelector('.sahyadri-report-details-card');
        if (existingCard) existingCard.remove();
      });

      // Animate Traveling Light Pulses
      let tick = 0;
      fvInterval = setInterval(() => {
        tick = (tick + 1) % 100;
        fvPolylines.forEach((poly, i) => {
          const icons = poly.get('icons');
          if (icons && icons[0]) {
            const offset = (tick * 1.4 + (i * 12)) % 100;
            icons[0].offset = `${offset}%`;
            poly.set('icons', icons);
          }
        });
      }, 35);

      // Wire Full View 3D / 2D Perspective Toggle
      // Permanent Full View 3D Perspective Mode Default
      const fvHorizon = overlay.querySelector('#fullview-map-3d-horizon');
      const isFv3D = true;
      if (gmapTarget) gmapTarget.classList.add('is-3d');
      if (fvHorizon) fvHorizon.style.opacity = '1';
      if (gmap && typeof gmap.setTilt === 'function') gmap.setTilt(45);
      if (gmap && typeof gmap.setHeading === 'function') gmap.setHeading(20);

      // Wire Controls
      const zoomInBtn = overlay.querySelector('#fullview-zoom-in');
      const zoomOutBtn = overlay.querySelector('#fullview-zoom-out');
      const resetBtn = overlay.querySelector('#fullview-reset');

      zoomInBtn.addEventListener('click', () => gmap.setZoom(gmap.getZoom() + 1));
      zoomOutBtn.addEventListener('click', () => gmap.setZoom(gmap.getZoom() - 1));
      resetBtn.addEventListener('click', () => {
        gmap.setCenter(karjatLatLng);
        gmap.setZoom(7.2);
        if (typeof gmap.setTilt === 'function') gmap.setTilt(45);
        if (typeof gmap.setHeading === 'function') gmap.setHeading(20);
      });
    })
    .catch((err) => {
      console.warn('[FullView] Falling back to Vector SVG:', err);
      if (loader) loader.classList.add('hidden');
      if (gmapTarget) gmapTarget.classList.add('hidden');
      if (svgFallback) {
        svgFallback.classList.remove('hidden');
        svgFallback.classList.add('flex');
      }
      if (providerBadge) {
        providerBadge.textContent = 'Interactive Vector';
      }
    });

  // ESC key handler
  const onKeyDown = (e) => {
    if (e.key === 'Escape') closeMaharashtraFullView();
  };
  window.addEventListener('keydown', onKeyDown);
  overlay._escListener = onKeyDown;
  overlay._fvInterval = fvInterval;
}

export function closeMaharashtraFullView() {
  const overlay = document.getElementById('maharashtra-fullscreen-overlay');
  if (overlay) {
    if (overlay._escListener) {
      window.removeEventListener('keydown', overlay._escListener);
    }
    if (overlay._fvInterval) {
      clearInterval(overlay._fvInterval);
    }
    overlay.remove();
    document.body.classList.remove('overflow-hidden');
  }
}

/**
 * Helper to combine real supporters with design reference cities
 */
function getCombinedCities(supporters = []) {
  const map = new Map();
  if (Array.isArray(supporters)) {
    supporters.forEach((s) => {
      if (!s.city || typeof s.lat !== 'number' || typeof s.lng !== 'number') return;
      const key = s.city.toLowerCase();
      if (!map.has(key)) {
        map.set(key, {
          name: s.city,
          state: s.state || '',
          lat: s.lat,
          lng: s.lng,
          count: 0,
          supporters: []
        });
      }
      const entry = map.get(key);
      entry.count += 1;
      entry.supporters.push(s);
    });
  }

  REFERENCE_CITIES_DATA.forEach((rc) => {
    const k = rc.name.toLowerCase();
    if (!map.has(k)) {
      map.set(k, {
        name: rc.name,
        state: rc.state,
        lat: rc.lat,
        lng: rc.lng,
        count: rc.count,
        supporters: []
      });
    }
  });

  return Array.from(map.values());
}

/**
 * Helper to update dynamic numbers on stats card
 */
function updateStatsCard(container, supporters = []) {
  const statsNumbers = container.querySelectorAll('.hero-stats-members-count, #hero-stats-members-count');
  const statsCities = container.querySelectorAll('.hero-stats-last-city, #hero-stats-last-city');
  const totalCount = Array.isArray(supporters) ? supporters.length : 0;

  const displayCount = totalCount.toLocaleString('en-IN');
  statsNumbers.forEach((el) => {
    el.textContent = displayCount;
  });

  if (Array.isArray(supporters) && supporters.length > 0) {
    const latest = supporters[0];
    const loc = `${latest.city || 'MUMBAI'}, ${latest.state || 'MAHARASHTRA'}`.toUpperCase();
    statsCities.forEach((el) => {
      el.textContent = loc;
    });
  }
}

/**
 * Fallback & Test SVG Generator (preserves all test expectations)
 */
export function generateMaharashtraSvgHtml(supporters = [], uniqueId = 'hero-map') {
  const indiaPoints = INDIA_BOUNDARY_POINTS.map((pt) => {
    const p = projectIndiaGeo(pt.lat, pt.lng, SVG_WIDTH, SVG_HEIGHT);
    return `${p.x},${p.y}`;
  });
  const indiaPathD = `M ${indiaPoints.join(' L ')} Z`;

  const mhPoints = MAHARASHTRA_BOUNDARY.map((pt) => {
    const p = projectIndiaGeo(pt.lat, pt.lng, SVG_WIDTH, SVG_HEIGHT);
    return `${p.x},${p.y}`;
  });
  const mhPathD = `M ${mhPoints.join(' L ')} Z`;

  const stateDividersHtml = INDIA_STATE_DIVIDERS.map((pts) => {
    const coords = pts.map((pt) => {
      const p = projectIndiaGeo(pt.lat, pt.lng, SVG_WIDTH, SVG_HEIGHT);
      return `${p.x},${p.y}`;
    });
    return `<path d="M ${coords.join(' L ')}" fill="none" stroke="rgba(56, 189, 248, 0.16)" stroke-width="1.2" stroke-dasharray="3, 5" />`;
  }).join('');

  const sahyadriPoints = SAHYADRI_CORRIDOR_COORDS.map((pt) => {
    const p = projectIndiaGeo(pt.lat, pt.lng, SVG_WIDTH, SVG_HEIGHT);
    return `${p.x},${p.y}`;
  });
  const sahyadriPathD = `M ${sahyadriPoints.join(' L ')}`;
  const targetPos = projectIndiaGeo(MAHARASHTRA_TARGET.lat, MAHARASHTRA_TARGET.lng, SVG_WIDTH, SVG_HEIGHT);

  const cities = getCombinedCities(supporters);
  const arcs = [];
  const cityNodes = [];

  cities.forEach((city, idx) => {
    const cityPos = projectIndiaGeo(city.lat, city.lng, SVG_WIDTH, SVG_HEIGHT);
    const isBlue = (idx % 2 === 1);
    const strokeColor = isBlue ? '#00E5FF' : '#00FF87';
    
    const dx = targetPos.x - cityPos.x;
    const dy = targetPos.y - cityPos.y;
    const distSvg = Math.sqrt(dx * dx + dy * dy);
    
    // Perpendicular unit vector (points upward/outward)
    const nx = -dy / (distSvg || 1);
    const ny = dx / (distSvg || 1);
    
    // Adaptive curvature for SVG: near points are almost straight, distant points arch gracefully
    const svgCurveRatio = Math.min(0.12, 0.15 * Math.pow(distSvg / (distSvg + 120), 1.25));
    const svgArch = distSvg * svgCurveRatio;
    
    const midX = (cityPos.x + targetPos.x) / 2 + nx * svgArch;
    const midY = (cityPos.y + targetPos.y) / 2 + ny * svgArch;
    const d = `M ${cityPos.x},${cityPos.y} Q ${midX},${midY} ${targetPos.x},${targetPos.y}`;

    arcs.push(`
      <g class="participant-connection-arc curved-connection-arc">
        <path d="${d}" fill="none" stroke="${strokeColor}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="8, 10" opacity="0.9" />
      </g>
    `);

    cityNodes.push(`
      <g class="city-node-marker minimal-holo-marker" transform="translate(${cityPos.x}, ${cityPos.y})">
        <!-- Thin semi-transparent outer ring (8-10px diameter) -->
        <circle r="4.5" fill="${strokeColor}" fill-opacity="0.10" stroke="${strokeColor}" stroke-opacity="0.45" stroke-width="0.85" />
        <!-- Tiny neon center dot (4-5px diameter) -->
        <circle r="2.2" fill="${strokeColor}" />
        <circle r="0.75" fill="#FFFFFF" opacity="0.9" />
        ${city.count > 1 ? `
          <rect x="5" y="-10" width="${city.count > 9 ? 14 : 10}" height="9" rx="4.5" fill="#04120A" stroke="${strokeColor}" stroke-opacity="0.6" stroke-width="0.75" />
          <text x="${5 + (city.count > 9 ? 7 : 5)}" y="-3.5" text-anchor="middle" font-family="monospace, sans-serif" font-size="6.5" font-weight="700" fill="${strokeColor}">${city.count > 99 ? '99+' : city.count}</text>
        ` : ''}
        <text x="8" y="4" fill="#94a3b8" font-family="Inter, sans-serif" font-size="10" font-weight="600">${escapeHtml(city.name)}</text>
      </g>
    `);
  });

  return `
    <svg id="${uniqueId}-svg" viewBox="0 0 ${SVG_WIDTH} ${SVG_HEIGHT}" class="w-full h-full select-none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Map of Maharashtra and India">
      <defs>
        <linearGradient id="${uniqueId}-india-fill" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#121D25" />
          <stop offset="100%" stop-color="#101920" />
        </linearGradient>
      </defs>
      <g id="${uniqueId}-transform-group">
        <path d="${indiaPathD}" fill="url(#${uniqueId}-india-fill)" stroke="#1F3542" stroke-width="1.6" />
        <g id="${uniqueId}-state-dividers">${stateDividersHtml}</g>
        <path d="${mhPathD}" fill="#0A281B" stroke="#10B981" stroke-width="1.8" stroke-opacity="0.85" />
        <g id="${uniqueId}-sahyadri-ridge" aria-label="SAHYADRI WESTERN GHATS RIDGE">
          <title>SAHYADRI WESTERN GHATS RIDGE</title>
          <path d="${sahyadriPathD}" fill="none" stroke="#00FF87" stroke-width="2.5" />
        </g>
        <g id="${uniqueId}-arcs-layer">${arcs.join('')}</g>
        <g id="${uniqueId}-cities-layer">${cityNodes.join('')}</g>
        <g id="${uniqueId}-hub-marker" transform="translate(${targetPos.x}, ${targetPos.y})" aria-label="KARJAT (Target Hub)">
          <title>KARJAT (Target Hub)</title>
          <image href="/images/tree-marker.png" x="-20" y="-20" width="40" height="40" />
        </g>
      </g>
    </svg>
  `;
}
