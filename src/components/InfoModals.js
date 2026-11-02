/**
 * SAVE THE SAHYADRI — TRANSPARENCY & LEGAL MODALS
 * Privacy Policy, Terms of Use, Sources Policy, and Data Correction / Removal Form.
 */

import { t, getLanguage } from '../utils/i18n.js';

export function openPrivacyModal() {
  renderInfoModal({
    tag: 'PRIVACY & DATA PROTECTION',
    title: 'Privacy Policy',
    contentHtml: `
      <div class="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
        <div class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-950/70 text-emerald-400 text-[11px] font-mono border border-emerald-500/20">
          <span>Last Updated:</span>
          <span class="text-white font-semibold">30 October 2026</span>
        </div>

        <p>
          <strong>SAVE THE SAHYADRI</strong> (accessible via <a href="https://www.savesahyadri.online" target="_blank" rel="noopener noreferrer" class="text-emerald-400 hover:text-emerald-300 underline font-medium">www.savesahyadri.online</a>) is a public, independent environmental awareness initiative focused on protecting the forests, wildlife, ecosystems, and ancient canopy of the Sahyadri (Western Ghats) region.
        </p>

        <p>
          We are committed to a strict, privacy-first architecture. Our platform does not collect personal contact identifiers, email addresses, or manual location entries. Participation is focused entirely on voluntary, generalized geographic mapping to display nationwide community solidarity.
        </p>

        <h4 class="font-heading font-bold text-sm sm:text-base text-white pt-2 text-emerald-400">1. Independent Civic Initiative:</h4>
        <p>
          This platform (<a href="https://www.savesahyadri.online" target="_blank" rel="noopener noreferrer" class="text-emerald-400 hover:text-emerald-300 underline font-medium">www.savesahyadri.online</a>) is entirely an independent, non-governmental, and non-political civic awareness project. We are not affiliated with, authorized by, sponsored by, or in any way officially connected to any political party, government body, or state forest department.
        </p>

        <h4 class="font-heading font-bold text-sm sm:text-base text-white pt-2 text-emerald-400">2. Information We Process and Handle:</h4>
        <p>
          To protect user anonymity while maintaining an interactive movement map, we handle only the following information:
        </p>
        <ul class="list-disc pl-5 space-y-1.5 text-slate-300">
          <li><strong class="text-white">Anonymous Member Count:</strong> When you interact with the platform, a unique session identifier or non-personal incremental counter updates your presence on the map. We do not link this counter to your physical identity.</li>
          <li><strong class="text-white">GPS-Based Regional Coordinates:</strong> If you choose to join the movement by granting browser/device location permission, we process your temporary GPS coordinates.</li>
          <li><strong class="text-white">What We Do NOT Collect:</strong> We strictly do not collect, request, or store your email address, phone number, name, or any manual address inputs.</li>
        </ul>

        <h4 class="font-heading font-bold text-sm sm:text-base text-white pt-2 text-emerald-400">3. How Your GPS Data is Handled and Protected:</h4>
        <p>
          We apply strict technical safeguards to your geographic data to ensure your private spaces remain completely protected:
        </p>
        <ul class="list-disc pl-5 space-y-1.5 text-slate-300">
          <li><strong class="text-white">Immediate Generalization:</strong> Your precise home, street, or building coordinates are never displayed publicly on the live map.</li>
          <li><strong class="text-white">City-Level Clustering:</strong> Your GPS input is instantly converted into generalized regional or city-center coordinates. The map only draws animated pulse lines connecting your broad metropolitan or rural district region to the Sahyadri connection hub.</li>
          <li><strong class="text-white">Optional Consent:</strong> Providing GPS location is entirely optional. You can explore the interactive map without sharing your device's location.</li>
        </ul>

        <h4 class="font-heading font-bold text-sm sm:text-base text-white pt-2 text-emerald-400">4. Third-Party Infrastructure:</h4>
        <p>
          We utilize trusted, standard cloud infrastructure service providers to host our open-access platform:
        </p>
        <ul class="list-disc pl-5 space-y-1.5 text-slate-300">
          <li><strong class="text-white">Hosting and Database:</strong> We use secure cloud database solutions (such as Firebase/Vercel environments) to store the total aggregated member count and generalized regional node coordinates.</li>
          <li><strong class="text-white">Google Maps API Integration:</strong> Interactive maps and geographic rendering are powered entirely via Google Maps Platform services. When you allow location access, your browser communicates with Google Maps APIs to safely load vector maps and display generalized geographic representations. These operations are conducted in strict alignment with Google’s official privacy guidelines and industry web security rules.</li>
        </ul>

        <h4 class="font-heading font-bold text-sm sm:text-base text-white pt-2 text-emerald-400">5. Shareable Digital Cards (WhatsApp Status):</h4>
        <p>
          When you choose to generate a digital member card to share on WhatsApp or other social networks, the card image is assembled entirely on your local device client-side (using html2canvas and the native Web Share API). No personal data or generated images are uploaded back to our servers during this process.
        </p>

        <h4 class="font-heading font-bold text-sm sm:text-base text-white pt-2 text-emerald-400">6. Your Choices and Contact Details:</h4>
        <p>
          Since we do not store emails or precise identities, we have no personal data profiles to modify or sell. If you wish to withdraw your generalized node from the map counter or have questions about our structural encryption setup, you may reach out to our privacy management team:
        </p>
        <div class="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/20 text-slate-300 space-y-1.5 font-sans text-xs">
          <div><span class="text-slate-400">Website URL:</span> <a href="https://savesahyadri.online" target="_blank" rel="noopener noreferrer" class="text-emerald-400 hover:text-emerald-300 underline font-mono">savesahyadri.online</a></div>
          <div><span class="text-slate-400">Contact Email:</span> <a href="mailto:infosavesahyadri@gmail.com" class="text-emerald-400 hover:text-emerald-300 underline font-mono">infosavesahyadri@gmail.com</a></div>
        </div>
      </div>
    `
  });
}

export function openTermsModal() {
  renderInfoModal({
    tag: 'CAMPAIGN GUIDELINES',
    title: 'Terms of Use & Code of Conduct',
    contentHtml: `
      <div class="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
        <p>
          Welcome to <strong>SAVE THE SAHYADRI</strong>. By accessing this platform and participating in this public awareness initiative, you agree to the following terms:
        </p>

        <h4 class="font-heading font-bold text-base text-white pt-2">1. Nature of the Campaign</h4>
        <p class="text-slate-400">
          This platform is an independent, non-partisan, non-commercial public awareness movement for the conservation of the Western Ghats ecosystem in Maharashtra. It does not constitute a formal legal petition, commercial contract, or guarantee governmental response.
        </p>

        <h4 class="font-heading font-bold text-base text-white pt-2">2. Zero Fundraising Policy</h4>
        <p class="text-slate-400">
          This campaign does NOT solicit donations, collect funds, or operate any payment gateways. Any party soliciting money in the name of this website is unauthorized and fraudulent.
        </p>

        <h4 class="font-heading font-bold text-base text-white pt-2">3. Responsible & Peaceful Discourse</h4>
        <p class="text-slate-400">
          Participants agree to support lawful, non-violent, and constructive environmental dialogue based on verified science, official administrative documents, and judicial precedents.
        </p>
      </div>
    `
  });
}

export function openSourcesModal() {
  renderInfoModal({
    tag: 'VERIFICATION STANDARDS',
    title: 'Sources & Editorial Corrections Policy',
    contentHtml: `
      <div class="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
        <p>
          We uphold strict journalistic integrity. Environmental protection requires credible, verifiable facts rather than unsubstantiated claims.
        </p>

        <h4 class="font-heading font-bold text-base text-white pt-2">1. Hierarchy of Information</h4>
        <ul class="list-disc pl-5 space-y-1 text-slate-400">
          <li><strong>Primary Tier:</strong> Official gazettes, MoEFCC notices, Maharashtra Forest Department circulars, and High Court / Supreme Court orders.</li>
          <li><strong>Secondary Tier:</strong> Peer-reviewed ecological research, university watershed studies, and accredited news outlets.</li>
          <li><strong>Reported Figures:</strong> Clearly tagged as <em>“Reported — verification pending”</em> until supported by official field audits.</li>
        </ul>

        <h4 class="font-heading font-bold text-base text-white pt-2">2. Submitting Corrections</h4>
        <p class="text-slate-400">
          If you are a forest officer, researcher, journalist, or citizen who identifies an error or has official documentation to contribute, please use our feedback channel to submit updates.
        </p>
      </div>
    `
  });
}

export function openDataRemovalModal() {
  renderInfoModal({
    tag: 'PRIVACY CONTROL',
    title: 'Request Data Correction or Removal',
    contentHtml: `
      <div class="space-y-4 text-xs sm:text-sm text-slate-300">
        <p>
          In accordance with our privacy commitment, you can easily remove or correct your participation record from our live database.
        </p>

        <form id="data-removal-form" class="space-y-4 pt-2">
          <div>
            <label class="block text-xs font-semibold text-slate-200 mb-1">
              Supporter Reference ID (or Registered Display Name) <span class="text-emerald-400">*</span>
            </label>
            <input 
              type="text" 
              id="removal-id" 
              required
              placeholder="e.g. SAHYADRI-4821 or Aditya Patil"
              class="w-full px-4 py-2.5 rounded-xl bg-[#030905] border border-emerald-500/25 text-white text-xs focus:outline-none focus:border-emerald-400"
            />
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-200 mb-1">
              Reason for Request (Optional)
            </label>
            <select id="removal-reason" class="w-full px-4 py-2.5 rounded-xl bg-[#030905] border border-emerald-500/25 text-white text-xs focus:outline-none focus:border-emerald-400">
              <option value="privacy">Desire removal of public map marker</option>
              <option value="typo">Spelling correction needed</option>
              <option value="relocation">City has changed</option>
              <option value="other">Other reason</option>
            </select>
          </div>

          <div id="removal-status-msg" class="hidden p-3 rounded-xl text-xs font-medium"></div>

          <button 
            type="submit" 
            id="btn-confirm-removal" 
            class="w-full py-3 px-4 rounded-xl font-heading font-bold text-xs text-black bg-emerald-400 hover:bg-emerald-300 transition-colors cursor-pointer"
          >
            Confirm Removal from Database
          </button>
        </form>
      </div>
    `
  });

  const form = document.getElementById('data-removal-form');
  const statusMsg = document.getElementById('removal-status-msg');
  const confirmBtn = document.getElementById('btn-confirm-removal');

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const idOrName = document.getElementById('removal-id')?.value;
      const reason = document.getElementById('removal-reason')?.value;

      if (!idOrName || idOrName.trim().length < 2) {
        showMsg('Please enter your Supporter ID or registered name.', false);
        return;
      }

      confirmBtn.disabled = true;
      confirmBtn.textContent = 'Processing...';

      try {
        const { requestSupporterRemoval } = await import('../services/supporterService.js');
        const result = await requestSupporterRemoval({
          supporterId: idOrName.trim(),
          name: idOrName.trim(),
          reason
        });

        showMsg(result.message || 'Participation record scheduled for removal.', true);
        confirmBtn.textContent = '✓ Processed';
      } catch (err) {
        showMsg(err.message || 'Failed to submit request.', false);
        confirmBtn.disabled = false;
        confirmBtn.textContent = 'Confirm Removal from Database';
      }
    });
  }

  function showMsg(text, isSuccess) {
    statusMsg.textContent = text;
    statusMsg.className = `p-3 rounded-xl text-xs font-medium ${isSuccess ? 'bg-emerald-950/80 border border-emerald-500/40 text-emerald-300' : 'bg-red-950/80 border border-red-500/40 text-red-300'}`;
    statusMsg.classList.remove('hidden');
  }
}

/**
 * Reusable modal renderer
 */
function renderInfoModal({ tag, title, contentHtml }) {
  closeInfoModal();

  const modal = document.createElement('div');
  modal.id = 'sahyadri-info-modal-root';
  modal.className = 'fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto';

  modal.innerHTML = `
    <div id="info-modal-backdrop" class="fixed inset-0 bg-black/85 backdrop-blur-md"></div>
    <div 
      class="relative w-full max-w-xl rounded-2xl sm:rounded-3xl bg-[#06150E] border border-emerald-500/25 shadow-2xl p-4 sm:p-8 z-10 space-y-4 sm:space-y-6 my-auto text-left"
      role="dialog"
      aria-modal="true"
    >
      <button 
        id="info-modal-close-btn" 
        class="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white bg-emerald-950/50 hover:bg-emerald-900/60 border border-emerald-500/20 cursor-pointer transition-colors"
      >
        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <div class="space-y-1.5 pr-8">
        <div class="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-950 text-emerald-400 text-xs font-bold border border-emerald-500/30">
          <span>ℹ️</span>
          <span>${tag}</span>
        </div>
        <h2 class="font-heading font-black text-2xl text-white">${title}</h2>
      </div>

      <div class="max-h-[65vh] sm:max-h-[70vh] overflow-y-auto pr-2 space-y-4">
        ${contentHtml}
      </div>

      <div class="pt-4 border-t border-emerald-500/15 flex justify-end">
        <button id="info-modal-done-btn" class="px-5 py-2 rounded-xl font-heading font-bold text-xs text-black bg-emerald-400 hover:bg-emerald-300">
          ${t('common.close', 'Close')}
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);
  document.body.classList.add('overflow-hidden');

  const closeBtn = modal.querySelector('#info-modal-close-btn');
  const doneBtn = modal.querySelector('#info-modal-done-btn');
  const backdrop = modal.querySelector('#info-modal-backdrop');

  if (closeBtn) closeBtn.addEventListener('click', closeInfoModal);
  if (doneBtn) doneBtn.addEventListener('click', closeInfoModal);
  if (backdrop) backdrop.addEventListener('click', closeInfoModal);

  const onKeyDown = (e) => {
    if (e.key === 'Escape') closeInfoModal();
  };
  window.addEventListener('keydown', onKeyDown);
  modal._escListener = onKeyDown;
}

export function closeInfoModal() {
  const modal = document.getElementById('sahyadri-info-modal-root');
  if (modal) {
    if (modal._escListener) {
      window.removeEventListener('keydown', modal._escListener);
    }
    modal.remove();
    document.body.classList.remove('overflow-hidden');
  }
}
