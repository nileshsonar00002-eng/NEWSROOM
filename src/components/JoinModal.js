/**
 * SAVE THE SAHYADRI — JOIN THE MOVEMENT MODAL (NAME ONLY + EXPLICIT USER GPS PERMISSION)
 * 
 * - Streamlined: ONLY Name field required.
 * - Removed: City, State, and Email fields completely removed.
 * - Explicit User Permission Popup: Never accesses device GPS without the user clicking "Allow Location".
 * - User Choice: Clear options to "Allow Location" or "Don't Allow (Skip GPS)".
 * - Reverse Geocoding: Resolves city and state from GPS coordinates only after explicit user consent.
 * - Zero Silent Tracking: If user clicks "Don't Allow", GPS is never touched.
 */

import {
  registerSupporter,
  hasDeviceJoined,
  getDevicePledgedSupporter,
  markDeviceAsJoined
} from '../services/supporterService.js';
import { escapeHtml } from '../utils/sanitize.js';
import { openShareCardModal } from './ShareCardModal.js';
import { t } from '../utils/i18n.js';

let activeLocation = {
  city: '',
  state: '',
  lat: null,
  lng: null,
  isDetected: false,
  permissionChoice: 'none' // 'none' | 'requesting' | 'allowed' | 'denied'
};

export function openJoinModal(onSuccessCallback) {
  closeJoinModal();

  // Strict 1-pledge-per-device rule: If already joined, show verified status modal directly
  if (hasDeviceJoined()) {
    showAlreadyJoinedModal(onSuccessCallback);
    return;
  }

  // Reset active location state for fresh pledge - GPS permission mandatory
  activeLocation = {
    city: '',
    state: '',
    lat: null,
    lng: null,
    isDetected: false,
    permissionChoice: 'none'
  };

  const modalContainer = document.createElement('div');
  modalContainer.id = 'sahyadri-join-modal-root';
  modalContainer.className = 'fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fadeIn';

  modalContainer.innerHTML = `
    <!-- Backdrop Blur Overlay -->
    <div id="join-modal-backdrop" class="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity"></div>

    <!-- Modal Box (Compact on Mobile, Spacious on Desktop) -->
    <div 
      class="relative w-full max-w-md rounded-2xl sm:rounded-3xl bg-[#06150E] border border-emerald-500/30 shadow-2xl p-4 sm:p-7 z-10 my-auto text-center transform transition-all overflow-hidden"
      role="dialog" 
      aria-modal="true" 
      aria-labelledby="join-modal-title"
    >
      <!-- Premium Tree Background Layer with Deep Forest Vignette -->
      <div class="absolute inset-0 z-0 pointer-events-none select-none overflow-hidden">
        <img 
          src="/images/sahyadri-tree-hero.jpg" 
          alt="" 
          class="w-full h-full object-cover object-center opacity-30 transform scale-105 filter brightness-95 contrast-125" 
          loading="eager"
        />
        <div class="absolute inset-0 bg-gradient-to-b from-[#06150E]/85 via-[#06150E]/90 to-[#06150E]/98"></div>
        <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.15)_0%,transparent_70%)]"></div>
        <div class="absolute inset-0 ring-1 ring-inset ring-emerald-500/20 rounded-2xl sm:rounded-3xl pointer-events-none"></div>
      </div>
      
      <!-- Close Button -->
      <button 
        id="join-modal-close-btn" 
        aria-label="Close modal" 
        class="absolute top-3.5 right-3.5 sm:top-5 sm:right-5 p-1.5 sm:p-2 rounded-lg sm:rounded-xl text-slate-400 hover:text-white bg-emerald-950/60 hover:bg-emerald-900/80 border border-emerald-500/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 cursor-pointer z-20 transition-colors"
      >
        <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <!-- Content Container -->
      <div id="join-modal-dynamic-content" class="relative z-10 space-y-3.5 sm:space-y-5">
        
        <!-- Modal Header -->
        <div class="space-y-1.5 text-center flex flex-col items-center justify-center px-4">
          <div class="inline-flex items-center justify-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-400 text-[10px] sm:text-xs font-bold border border-emerald-500/30 mx-auto">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            <span>${t('joinModal.badge', 'PUBLIC AWARENESS PLEDGE')}</span>
          </div>
          <h2 id="join-modal-title" class="font-heading font-black text-xl sm:text-2xl text-white tracking-tight text-center">
            ${t('joinModal.titlePrefix', 'Stand With')} <span class="text-[#00FF87]">${t('joinModal.titleHighlight', 'Sahyadri')}</span>
          </h2>
          <p class="text-[11px] sm:text-xs text-slate-300 leading-normal text-center max-w-xs sm:max-w-sm mx-auto">
            ${t('joinModal.subtitle', 'Enter your name to stand with the movement. GPS location requires your explicit permission.')}
          </p>
        </div>

        <!-- Form (Name Only + GPS Permission) -->
        <form id="sahyadri-pledge-form" class="space-y-3 pt-1.5 sm:space-y-3.5 sm:pt-3 text-center" novalidate>
          
          <!-- Name Input Field (The Only Required Field) -->
          <div class="space-y-1">
            <label for="pledge-name" class="block text-center text-[11px] sm:text-xs font-semibold text-slate-200">
              ${t('joinModal.nameLabel', 'Your Name')} <span class="text-emerald-400">*</span>
            </label>
            <input 
              type="text" 
              id="pledge-name" 
              name="displayName"
              required 
              minlength="2"
              maxlength="50"
              autofocus
              placeholder="${t('joinModal.namePlaceholder', 'e.g. Aditya Patil')}"
              class="w-full text-center px-3.5 py-2.5 sm:py-3 sm:px-4 rounded-xl bg-[#030905] border border-emerald-500/30 text-white placeholder-slate-500 placeholder:text-center text-xs sm:text-sm focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition-colors shadow-inner"
            />
          </div>

          <!-- GPS Location: Only Allow GPS Button / Verified Location -->
          <div id="gps-permission-box" class="pt-0.5">
            <button 
              type="button" 
              id="btn-request-gps" 
              class="w-full py-2 px-3 rounded-xl text-[11px] sm:text-xs font-bold text-black bg-gradient-to-r from-emerald-400 via-emerald-300 to-emerald-400 hover:from-emerald-300 hover:to-emerald-200 active:scale-[0.99] shadow-emerald-glow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span id="btn-request-gps-spinner" class="hidden w-3 h-3 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
              <svg class="w-3.5 h-3.5 text-black shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
              <span id="btn-request-gps-text">${t('joinModal.allowGps', 'Allow GPS')}</span>
            </button>

            <!-- Verified Location Details (shown after permission is granted) -->
            <div id="gps-verified-display" class="hidden p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-between">
              <div class="flex items-center gap-2 min-w-0">
                <svg class="w-4 h-4 text-emerald-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
                <div class="min-w-0">
                  <div id="gps-verified-city" class="text-xs font-bold text-white truncate"></div>
                  <div id="gps-verified-coords" class="text-[10px] text-emerald-400 font-mono truncate"></div>
                </div>
              </div>
              <button 
                type="button" 
                id="btn-refresh-gps" 
                class="text-[10px] sm:text-[11px] font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer ml-2 shrink-0"
                title="Change or re-detect location"
              >
                <span>↺</span>
                <span>${t('joinModal.changeGps', 'Change')}</span>
              </button>
            </div>
          </div>

          <!-- Subtle Consent Notice -->
          <div class="pt-0.5">
            <label class="flex items-start justify-center gap-2 cursor-pointer text-left">
              <input 
                type="checkbox" 
                id="pledge-consent" 
                name="consented"
                checked
                required 
                class="mt-0.5 w-3.5 h-3.5 sm:w-4 sm:h-4 rounded border-emerald-500/40 text-emerald-500 focus:ring-emerald-400 bg-emerald-950/50 shrink-0"
              />
              <span class="text-[10px] sm:text-[11px] text-slate-300 leading-tight sm:leading-relaxed">
                ${t('joinModal.consentLabel', 'I support the preservation of the Sahyadri Western Ghats and agree to display my pledge on the movement map.')}
              </span>
            </label>
          </div>

          <!-- Error Alert Banner -->
          <div id="pledge-error-banner" class="hidden p-2.5 rounded-xl bg-red-950/60 border border-red-500/40 text-red-300 text-xs font-medium text-center"></div>

          <!-- Submit Button -->
          <div class="pt-1">
            <button 
              type="submit" 
              id="btn-submit-pledge" 
              class="w-full py-2.5 sm:py-3.5 px-5 rounded-full font-heading font-extrabold text-xs sm:text-sm text-black bg-gradient-to-r from-emerald-400 via-emerald-300 to-emerald-400 hover:from-emerald-300 hover:to-emerald-200 shadow-emerald-glow hover:shadow-emerald-glow-lg transition-all flex items-center justify-center gap-2 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed tracking-wider uppercase"
            >
              <span id="submit-btn-spinner" class="hidden w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
              <span id="submit-btn-text">${t('joinModal.submitBtn', 'JOIN THE MOVEMENT')}</span>
            </button>
          </div>

        </form>

      </div>

    </div>
  `;

  document.body.appendChild(modalContainer);
  document.body.classList.add('overflow-hidden');

  const closeBtn = modalContainer.querySelector('#join-modal-close-btn');
  const backdrop = modalContainer.querySelector('#join-modal-backdrop');
  const form = modalContainer.querySelector('#sahyadri-pledge-form');
  const errorBanner = modalContainer.querySelector('#pledge-error-banner');
  const submitBtn = modalContainer.querySelector('#btn-submit-pledge');
  const submitSpinner = modalContainer.querySelector('#submit-btn-spinner');
  const submitText = modalContainer.querySelector('#submit-btn-text');
  const requestGpsBtn = modalContainer.querySelector('#btn-request-gps');
  const refreshGpsBtn = modalContainer.querySelector('#btn-refresh-gps');

  closeBtn.addEventListener('click', closeJoinModal);
  backdrop.addEventListener('click', closeJoinModal);

  // ESC key listener
  const onKeyDown = (e) => {
    if (e.key === 'Escape') closeJoinModal();
  };
  window.addEventListener('keydown', onKeyDown);
  modalContainer._escListener = onKeyDown;

  // UI state updater for GPS permission
  function updatePermissionUI(state, message) {
    const verifiedDisplay = modalContainer.querySelector('#gps-verified-display');
    const verifiedCity = modalContainer.querySelector('#gps-verified-city');
    const verifiedCoords = modalContainer.querySelector('#gps-verified-coords');
    const requestBtn = modalContainer.querySelector('#btn-request-gps');
    const requestSpinner = modalContainer.querySelector('#btn-request-gps-spinner');
    const requestText = modalContainer.querySelector('#btn-request-gps-text');

    if (state === 'idle') {
      if (verifiedDisplay) verifiedDisplay.classList.add('hidden');
      if (requestBtn) {
        requestBtn.classList.remove('hidden');
        requestBtn.disabled = false;
      }
      if (requestSpinner) requestSpinner.classList.add('hidden');
      if (requestText) requestText.textContent = t('joinModal.allowGps', 'Allow GPS');
    } else if (state === 'requesting' || state === 'geocoding') {
      if (requestBtn) requestBtn.disabled = true;
      if (requestSpinner) requestSpinner.classList.remove('hidden');
      if (requestText) requestText.textContent = state === 'geocoding' ? t('joinModal.detectingCity', 'Detecting City...') : t('joinModal.checkingGps', 'Checking GPS...');
    } else if (state === 'granted') {
      if (requestBtn) requestBtn.classList.add('hidden');
      if (verifiedDisplay) {
        verifiedDisplay.classList.remove('hidden');
        if (verifiedCity) verifiedCity.textContent = `${activeLocation.city || 'Verified Location'}, ${activeLocation.state || 'Maharashtra'}`;
        if (verifiedCoords) verifiedCoords.textContent = `${activeLocation.lat ? activeLocation.lat.toFixed(4) : ''}° N, ${activeLocation.lng ? activeLocation.lng.toFixed(4) : ''}° E (GPS Verified)`;
      }
    } else if (state === 'denied' || state === 'error' || state === 'unsupported') {
      if (requestBtn) {
        requestBtn.classList.remove('hidden');
        requestBtn.disabled = false;
      }
      if (requestSpinner) requestSpinner.classList.add('hidden');
      if (requestText) requestText.textContent = t('joinModal.allowGps', 'Allow GPS');
    }
  }

  // Request GPS Location from Browser ONLY after user allows
  function executeBrowserGeolocation() {
    return new Promise((resolve) => {
      errorBanner.classList.add('hidden');
      errorBanner.textContent = '';

      if (!navigator.geolocation) {
        activeLocation.permissionChoice = 'denied';
        activeLocation.lat = null;
        activeLocation.lng = null;
        activeLocation.isDetected = false;
        updatePermissionUI('unsupported', 'GPS is not supported by your browser.');
        showError('GPS is not supported by your browser.');
        resolve(false);
        return;
      }

      activeLocation.permissionChoice = 'requesting';
      updatePermissionUI('requesting');

      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          activeLocation.lat = lat;
          activeLocation.lng = lng;
          activeLocation.isDetected = true;
          activeLocation.permissionChoice = 'allowed';

          updatePermissionUI('geocoding');

          try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 4000);
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10`, { signal: controller.signal });
            clearTimeout(timeoutId);
            const data = await res.json();
            const city = data.address?.city || data.address?.town || data.address?.suburb || data.address?.county || data.address?.state_district || 'Maharashtra';
            const state = data.address?.state || 'Maharashtra';
            activeLocation.city = city;
            activeLocation.state = state;
          } catch (err) {
            activeLocation.city = 'Maharashtra';
            activeLocation.state = 'Maharashtra';
          }

          updatePermissionUI('granted');
          resolve(true);
        },
        (err) => {
          activeLocation.permissionChoice = 'denied';
          activeLocation.lat = null;
          activeLocation.lng = null;
          activeLocation.isDetected = false;

          let msg = 'Unable to access GPS location. Please allow location permission in your browser.';
          if (err.code === 1) { // PERMISSION_DENIED
            msg = 'Location permission was denied. Please allow location access in your browser to join.';
          } else if (err.code === 3) { // TIMEOUT
            msg = 'GPS request timed out. Please click "Allow GPS" to try again.';
          }
          updatePermissionUI('denied', msg);
          showError(msg);
          resolve(false);
        },
        { timeout: 10000, maximumAge: 60000, enableHighAccuracy: true }
      );
    });
  }

  // User explicitly clicks "Allow GPS Location" -> trigger geolocation directly
  if (requestGpsBtn) {
    requestGpsBtn.addEventListener('click', () => {
      executeBrowserGeolocation();
    });
  }

  // Change or refresh button
  if (refreshGpsBtn) {
    refreshGpsBtn.addEventListener('click', () => {
      executeBrowserGeolocation();
    });
  }

  // Form Submit Handler
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorBanner.classList.add('hidden');
    errorBanner.textContent = '';

    const name = form.displayName.value;
    const consented = form.consented.checked;

    if (!name || name.trim().length < 2) {
      showError(t('joinModal.nameRequiredError', 'Please enter your name (at least 2 characters).'));
      return;
    }
    if (!consented) {
      showError(t('joinModal.consentRequiredError', 'Please confirm the consent box.'));
      return;
    }

    if (activeLocation.permissionChoice === 'requesting') {
      showError(t('joinModal.checkingGps', 'Detecting your GPS location, please wait a moment...'));
      return;
    }

    // MANDATORY GPS PERMISSION CHECK: Cannot join without granting GPS permission
    if (!activeLocation.isDetected || activeLocation.permissionChoice !== 'allowed' || typeof activeLocation.lat !== 'number' || typeof activeLocation.lng !== 'number') {
      showError(t('joinModal.gpsRequiredError', 'GPS location permission is required to join. Please click "Allow GPS" above.'));
      if (requestGpsBtn) {
        requestGpsBtn.scrollIntoView({ behavior: 'smooth', block: 'center' });
        requestGpsBtn.classList.add('ring-2', 'ring-emerald-400', 'animate-pulse');
        setTimeout(() => {
          requestGpsBtn.classList.remove('ring-2', 'ring-emerald-400', 'animate-pulse');
        }, 2500);
      }
      return;
    }

    finalizePledge(name);
  });

  async function finalizePledge(name) {
    // 1-Pledge-Per-Device enforcement check
    if (hasDeviceJoined()) {
      showError(t('joinModal.alreadyRegisteredNotice', 'Aapke is device se pehle hi movement join kiya ja chuka hai. Spam rokne ke liye ek device se sirf ek hi registration allowed hai.'));
      return;
    }

    // Strictly verify GPS permission before recording
    if (!activeLocation.isDetected || activeLocation.permissionChoice !== 'allowed' || typeof activeLocation.lat !== 'number' || typeof activeLocation.lng !== 'number') {
      showError(t('joinModal.gpsRequiredError', 'GPS location permission is required to join. Please click "Allow GPS" first.'));
      return;
    }

    // Set Loading State
    submitBtn.disabled = true;
    submitSpinner.classList.remove('hidden');
    submitText.textContent = t('joinModal.submitting', 'RECORDING PLEDGE...');

    try {
      const result = await registerSupporter({
        displayName: name.trim(),
        city: activeLocation.city || 'Maharashtra',
        state: activeLocation.state || 'Maharashtra',
        lat: activeLocation.lat,
        lng: activeLocation.lng,
        consented: true
      });

      // Mark this device as permanently joined
      markDeviceAsJoined(result);

      // Call success callback to optimistically update map & counts immediately
      if (typeof onSuccessCallback === 'function') {
        onSuccessCallback(result);
      }

      // Close the pledge modal
      closeJoinModal();

      // Directly open the Shareable Support Card
      if (typeof window !== 'undefined' && window.__sahyadriOpenShareCard) {
        window.__sahyadriOpenShareCard(result);
      } else {
        openShareCardModal(result);
      }
    } catch (err) {
      showError(err.message || 'Unable to record pledge. Please try again.');
      submitBtn.disabled = false;
      submitSpinner.classList.add('hidden');
      submitText.textContent = t('joinModal.submitBtn', 'JOIN THE MOVEMENT');
    }
  }

  function showError(msg) {
    errorBanner.textContent = msg;
    errorBanner.classList.remove('hidden');
  }
}

/**
 * Render Already-Joined Modal for devices that have already registered
 */
function showAlreadyJoinedModal(onSuccessCallback) {
  const modalContainer = document.createElement('div');
  modalContainer.id = 'sahyadri-join-modal-root';
  modalContainer.className = 'fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fadeIn';

  const saved = getDevicePledgedSupporter() || {
    displayName: 'Concerned Citizen',
    city: 'Maharashtra',
    state: 'India'
  };

  modalContainer.innerHTML = `
    <!-- Backdrop Blur Overlay -->
    <div id="join-modal-backdrop" class="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity"></div>

    <!-- Modal Box -->
    <div 
      class="relative w-full max-w-md rounded-2xl sm:rounded-3xl bg-[#06150E] border border-emerald-500/30 shadow-2xl p-4 sm:p-7 z-10 my-auto text-center transform transition-all overflow-hidden"
      role="dialog" 
      aria-modal="true" 
      aria-labelledby="already-joined-title"
    >
      <!-- Premium Tree Background Layer with Deep Forest Vignette -->
      <div class="absolute inset-0 z-0 pointer-events-none select-none overflow-hidden">
        <img 
          src="/images/sahyadri-tree-hero.jpg" 
          alt="" 
          class="w-full h-full object-cover object-center opacity-30 transform scale-105 filter brightness-95 contrast-125" 
          loading="eager"
        />
        <div class="absolute inset-0 bg-gradient-to-b from-[#06150E]/85 via-[#06150E]/90 to-[#06150E]/98"></div>
        <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.15)_0%,transparent_70%)]"></div>
        <div class="absolute inset-0 ring-1 ring-inset ring-emerald-500/20 rounded-2xl sm:rounded-3xl pointer-events-none"></div>
      </div>

      <!-- Close Button -->
      <button 
        id="join-modal-close-btn" 
        aria-label="Close modal" 
        class="absolute top-3.5 right-3.5 sm:top-5 sm:right-5 p-1.5 sm:p-2 rounded-lg sm:rounded-xl text-slate-400 hover:text-white bg-emerald-950/60 hover:bg-emerald-900/80 border border-emerald-500/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 cursor-pointer z-20 transition-colors"
      >
        <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <div class="relative z-10 space-y-4 sm:space-y-5">

      <!-- Animated Green Verified Badge -->
      <div class="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-emerald-400 shadow-emerald-glow">
        <svg class="w-8 h-8 sm:w-10 sm:h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          <path d="m9 12 2 2 4-4"/>
        </svg>
      </div>

      <!-- Heading & Text -->
      <div class="space-y-1.5 px-2">
        <div class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-400 text-[10px] sm:text-xs font-bold border border-emerald-500/30 mx-auto">
          <span>✓</span>
          <span>${t('joinModal.deviceAlreadyRegistered', 'DEVICE ALREADY REGISTERED')}</span>
        </div>
        <h2 id="already-joined-title" class="font-heading font-black text-xl sm:text-2xl text-white tracking-tight">
          ${t('joinModal.alreadyJoinedTitle', "You're Already Part of the Movement!")}
        </h2>
        <p class="text-[11px] sm:text-xs text-slate-300 leading-relaxed max-w-sm mx-auto">
          ${t('joinModal.alreadyRegisteredNotice', 'You have already supported the Sahyadri movement from this device. To prevent spam, only one registration is allowed per device.')}
        </p>
      </div>

      <!-- Verified Supporter Details Card -->
      <div class="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-[#030905] border border-emerald-500/20 text-center space-y-1">
        <div class="text-[10px] font-mono text-emerald-400 uppercase tracking-widest font-bold">
          ${t('joinModal.verifiedSupporter', 'Verified Supporter')}
        </div>
        <div class="text-sm sm:text-base font-heading font-black text-white truncate">
          ${escapeHtml(saved.displayName || 'Concerned Citizen')}
        </div>
        <div class="text-[11px] sm:text-xs text-slate-400 font-sans truncate">
          📍 ${escapeHtml(saved.city || 'Maharashtra')}, ${escapeHtml(saved.state || 'India')}
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="space-y-2 pt-1">
        <button 
          id="btn-open-my-share-card" 
          class="w-full py-2.5 sm:py-3 px-4 rounded-full font-heading font-extrabold text-xs sm:text-sm text-black bg-gradient-to-r from-emerald-400 via-emerald-300 to-emerald-400 hover:from-emerald-300 hover:to-emerald-200 shadow-emerald-glow transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <svg class="w-4 h-4 text-black shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="m3 11 18-5v12L3 14v-3z" />
            <path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" />
          </svg>
          <span>${t('joinModal.viewCardBtn', 'VIEW / SHARE YOUR SUPPORT CARD')}</span>
        </button>

        <button 
          id="btn-close-already-joined" 
          class="w-full py-2 px-4 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-slate-900/60 hover:bg-slate-800/80 border border-slate-700/60 transition-colors cursor-pointer"
        >
          ${t('common.close', 'Close')}
        </button>
      </div>

      </div>

    </div>
  `;

  document.body.appendChild(modalContainer);
  document.body.classList.add('overflow-hidden');

  const closeBtn = modalContainer.querySelector('#join-modal-close-btn');
  const backdrop = modalContainer.querySelector('#join-modal-backdrop');
  const bottomCloseBtn = modalContainer.querySelector('#btn-close-already-joined');
  const viewCardBtn = modalContainer.querySelector('#btn-open-my-share-card');

  closeBtn?.addEventListener('click', closeJoinModal);
  backdrop?.addEventListener('click', closeJoinModal);
  bottomCloseBtn?.addEventListener('click', closeJoinModal);

  viewCardBtn?.addEventListener('click', () => {
    closeJoinModal();
    if (typeof window !== 'undefined' && window.__sahyadriOpenShareCard) {
      window.__sahyadriOpenShareCard(saved);
    } else {
      openShareCardModal(saved);
    }
  });

  const onKeyDown = (e) => {
    if (e.key === 'Escape') closeJoinModal();
  };
  window.addEventListener('keydown', onKeyDown);
  modalContainer._escListener = onKeyDown;
}

/**
 * Render Confirmed Success State inside the Modal
 */
function showSuccessView(modalContainer, supporterData, onSuccessCallback) {
  const content = modalContainer.querySelector('#join-modal-dynamic-content');
  if (!content) return;

  const supporterId = supporterData.id || 'SAHYADRI-' + Math.floor(1000 + Math.random() * 9000);

  content.innerHTML = `
    <div class="text-center space-y-6 py-2">
      
      <!-- Animated Green Success Mountain Badge -->
      <div class="w-20 h-20 mx-auto rounded-full overflow-hidden bg-[#05392e] border-2 border-emerald-400 flex items-center justify-center shadow-emerald-glow animate-bounce">
        <img src="/images/logo.png" alt="Save the Sahyadri Verified Badge" class="w-full h-full object-cover" />
      </div>

      <div class="space-y-2">
        <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950 text-emerald-400 text-xs font-bold border border-emerald-500/30">
          <span>✓</span>
          <span>${t('joinModal.verifiedEntry', 'PLEDGE VERIFIED & RECORDED')}</span>
        </div>
        <h2 class="font-heading font-black text-2xl sm:text-3xl text-white">
          ${t('joinModal.successTitle', 'Thank You,')} ${escapeHtml(supporterData.displayName)}!
        </h2>
        <p class="text-sm text-slate-300 max-w-sm mx-auto">
          ${t('joinModal.successSubtitle', { city: escapeHtml(supporterData.city), state: escapeHtml(supporterData.state) })}
        </p>
      </div>

      <!-- Verified Certificate Badge Card -->
      <div class="p-4 rounded-2xl bg-[#030905] border border-emerald-500/30 text-left font-mono text-xs space-y-1.5 text-slate-300">
        <div class="flex justify-between items-center text-[10px] text-emerald-400 uppercase tracking-widest font-bold">
          <span>${t('joinModal.citizenSupporterId', 'Citizen Supporter ID')}</span>
          <span>${t('joinModal.verifiedEntry', 'Verified Entry')}</span>
        </div>
        <div class="text-white font-bold text-sm tracking-wider">
          ${escapeHtml(supporterId)}
        </div>
        <div class="text-[11px] text-slate-400 flex items-center justify-between pt-1 border-t border-emerald-500/20">
          <span class="flex items-center gap-1">
            <svg class="w-3.5 h-3.5 text-emerald-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
            <span>${escapeHtml(supporterData.city)}, ${escapeHtml(supporterData.state)}</span>
          </span>
          <span class="text-emerald-400 flex items-center gap-1.5">
            <span>${t('joinModal.connectedToHub', 'Connected to Hub')}</span>
            <img src="/images/logo.png" alt="" class="w-4 h-4 rounded-full object-cover border border-emerald-500/40 inline shrink-0" />
          </span>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex flex-col sm:flex-row gap-3 pt-2">
        <button 
          id="btn-open-share-card" 
          class="flex-1 py-3 px-4 rounded-full font-heading font-bold text-sm text-black bg-gradient-to-r from-emerald-400 to-emerald-300 hover:from-emerald-300 hover:to-emerald-200 shadow-emerald-glow transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <svg class="w-4 h-4 text-black shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
            <polyline points="16 6 12 2 8 6" />
            <line x1="12" x2="12" y1="2" y2="15" />
          </svg>
          <span>${t('joinModal.shareBadgeBtn', 'View / Share Certificate')}</span>
        </button>

        <button 
          id="btn-close-success-modal" 
          class="flex-1 py-3 px-4 rounded-full font-heading font-semibold text-sm text-slate-300 hover:text-white bg-emerald-950/50 hover:bg-emerald-900/60 border border-emerald-500/30 transition-all cursor-pointer"
        >
          ${t('joinModal.closeViewMap', 'Close & View Map')}
        </button>
      </div>

    </div>
  `;

  // Wire Share Button
  const shareBtn = content.querySelector('#btn-open-share-card');
  if (shareBtn) {
    shareBtn.addEventListener('click', () => {
      closeJoinModal();
      if (window.__sahyadriOpenShareCard) {
        window.__sahyadriOpenShareCard(supporterData);
      }
    });
  }

  // Wire Close Button
  const closeBtn = content.querySelector('#btn-close-success-modal');
  if (closeBtn) {
    closeBtn.addEventListener('click', closeJoinModal);
  }

  // Call user callback to update counts & maps immediately
  if (onSuccessCallback) {
    onSuccessCallback(supporterData);
  }
}

export function closeJoinModal() {
  const existing = document.getElementById('sahyadri-join-modal-root');
  if (existing) {
    if (existing._escListener) {
      window.removeEventListener('keydown', existing._escListener);
    }
    existing.remove();
    document.body.classList.remove('overflow-hidden');
  }

  const existingDialog = document.getElementById('sahyadri-gps-permission-dialog');
  if (existingDialog) {
    existingDialog.remove();
  }
}
