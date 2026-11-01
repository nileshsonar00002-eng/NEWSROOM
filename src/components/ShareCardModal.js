/**
 * SAVE THE SAHYADRI — SHAREABLE SUPPORT CARD GENERATOR
 * High-resolution HTML5 Canvas generator for 1:1 Square and 9:16 Story formats.
 * Web Share API, WhatsApp share, PNG download, and copy link support.
 */

export function openShareCardModal(supporter = {}) {
  closeShareCardModal();

  const displayName = supporter.displayName || 'Citizen Supporter';
  const city = supporter.city || 'India';
  const state = supporter.state || 'Maharashtra';

  const modalContainer = document.createElement('div');
  modalContainer.id = 'sahyadri-share-modal-root';
  modalContainer.className = 'fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto';

  modalContainer.innerHTML = `
    <!-- Backdrop Blur -->
    <div id="share-modal-backdrop" class="fixed inset-0 bg-black/85 backdrop-blur-md"></div>

    <!-- Modal Dialog (Compact on Mobile) -->
    <div 
      class="relative w-full max-w-xl rounded-2xl sm:rounded-3xl bg-[#06150E] border border-emerald-500/30 shadow-2xl p-4 sm:p-8 z-10 my-auto text-left transform transition-all overflow-hidden"
      role="dialog"
      aria-modal="true"
      aria-labelledby="share-modal-title"
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
        id="share-modal-close-btn" 
        aria-label="Close modal" 
        class="absolute top-3.5 right-3.5 sm:top-5 sm:right-5 p-1.5 sm:p-2 rounded-lg sm:rounded-xl text-slate-400 hover:text-white bg-emerald-950/60 hover:bg-emerald-900/80 border border-emerald-500/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 cursor-pointer z-20 transition-colors"
      >
        <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <div class="relative z-10 space-y-3.5 sm:space-y-6">

      <!-- Modal Header -->
      <div class="space-y-1 pr-8">
        <div class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-400 text-[10px] sm:text-xs font-bold border border-emerald-500/30">
          <svg class="w-3.5 h-3.5 text-emerald-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <path d="m3 11 18-5v12L3 14v-3z" />
            <path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" />
          </svg>
          <span>AMPLIFY THE MOVEMENT</span>
        </div>
        <h2 id="share-modal-title" class="font-heading font-black text-xl sm:text-3xl text-white">
          Your Shareable Support <span class="text-[#00FF87]">Card</span>
        </h2>
        <p class="text-[11px] sm:text-sm text-slate-300">
          Download and share this card to inspire friends, family, and communities across India.
        </p>
      </div>

      <!-- Canvas Preview Wrapper -->
      <div class="relative w-full max-h-[380px] flex items-center justify-center p-3 rounded-2xl bg-[#030905] border border-emerald-500/20 overflow-hidden shadow-inner">
        <canvas id="support-card-canvas" class="max-h-[350px] w-auto h-auto rounded-xl shadow-2xl"></canvas>
      </div>

      <!-- Sharing Action Buttons -->
      <div class="space-y-3 pt-2">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          
          <!-- Download Button -->
          <button 
            id="btn-download-card" 
            class="py-3.5 px-4 rounded-xl font-heading font-bold text-sm text-black bg-gradient-to-r from-emerald-400 to-emerald-300 hover:from-emerald-300 shadow-emerald-glow flex items-center justify-center gap-2 cursor-pointer transition-transform hover:-translate-y-0.5"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span>Download High-Res Card</span>
          </button>

          <!-- WhatsApp Share Button -->
          <button 
            id="btn-whatsapp-share" 
            class="py-3.5 px-4 rounded-xl font-heading font-bold text-sm text-white bg-[#25D366] hover:bg-[#20ba59] shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-transform hover:-translate-y-0.5"
          >
            <svg class="w-4 h-4 text-white shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <path d="M3 21l1.65 -3.8a9 9 0 1 1 3.4 2.9l-5.05 .9" />
              <path d="M9.5 9.5a1.5 1.5 0 0 1 1.8 -.4l1.2 .8a1 1 0 0 1 .3 1.1l-.4 .8a7 7 0 0 0 2.8 2.8l.8 -.4a1 1 0 0 1 1.1 .3l.8 1.2a1.5 1.5 0 0 1 -.4 1.8c-.8 .6 -1.8 .8 -2.7 .4c-2.8 -1.2 -5.2 -3.6 -6.4 -6.4c-.4 -.9 -.2 -1.9 .4 -2.7z" />
            </svg>
            <span>Share on WhatsApp</span>
          </button>

        </div>
      </div>

      </div>

    </div>
  `;

  document.body.appendChild(modalContainer);
  document.body.classList.add('overflow-hidden');

  const closeBtn = modalContainer.querySelector('#share-modal-close-btn');
  const backdrop = modalContainer.querySelector('#share-modal-backdrop');
  const canvas = modalContainer.querySelector('#support-card-canvas');
  const btnDownload = modalContainer.querySelector('#btn-download-card');
  const btnWhatsApp = modalContainer.querySelector('#btn-whatsapp-share');

  const currentFormat = 'square'; // Always default square 1:1 format

  // Preload atmospheric tree photo background for the canvas card
  const bgTreeImage = new Image();
  bgTreeImage.src = '/images/sahyadri-tree-hero.jpg';
  bgTreeImage.onload = () => {
    renderCard();
  };

  // Preload transparent mountain peaks emblem for the canvas card
  const mountainImage = new Image();
  mountainImage.src = '/images/mountain-peaks.png';
  mountainImage.onload = () => {
    renderCard();
  };

  // Preload tree of life illustration for the supporter card box
  const treeImage = new Image();
  treeImage.src = '/images/tree-of-life.png';
  treeImage.onload = () => {
    renderCard();
  };

  closeBtn.addEventListener('click', closeShareCardModal);
  backdrop.addEventListener('click', closeShareCardModal);

  // ESC key listener
  const onKeyDown = (e) => {
    if (e.key === 'Escape') closeShareCardModal();
  };
  window.addEventListener('keydown', onKeyDown);
  modalContainer._escListener = onKeyDown;

  function renderCard() {
    const isSquare = currentFormat === 'square';
    const width = 1080;
    const height = isSquare ? 1080 : 1920;
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 1. Deep Forest Base Fill
    ctx.fillStyle = '#030805';
    ctx.fillRect(0, 0, width, height);

    // 1b. Atmospheric Tree Photo Background (Cover scaling adjusted to card)
    if (bgTreeImage.complete && bgTreeImage.naturalWidth > 0) {
      ctx.save();
      const imgRatio = bgTreeImage.naturalWidth / bgTreeImage.naturalHeight;
      const canvasRatio = width / height;
      let drawW, drawH, drawX, drawY;

      if (imgRatio > canvasRatio) {
        drawH = height;
        drawW = height * imgRatio;
        drawX = (width - drawW) / 2;
        drawY = 0;
      } else {
        drawW = width;
        drawH = width / imgRatio;
        drawX = 0;
        drawY = (height - drawH) / 2;
      }

      ctx.globalAlpha = 0.35;
      ctx.drawImage(bgTreeImage, drawX, drawY, drawW, drawH);
      ctx.restore();
    }

    // 1c. Deep Forest Tint Overlay with Atmospheric Vignette
    const bgGrad = ctx.createLinearGradient(0, 0, width, height);
    bgGrad.addColorStop(0, 'rgba(3, 8, 5, 0.72)');
    bgGrad.addColorStop(0.35, 'rgba(7, 26, 14, 0.76)');
    bgGrad.addColorStop(0.7, 'rgba(12, 43, 24, 0.78)');
    bgGrad.addColorStop(1, 'rgba(2, 7, 4, 0.88)');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // 2. Ambient Emerald Radial Glow
    const glowGrad = ctx.createRadialGradient(width / 2, height * 0.4, 80, width / 2, height * 0.4, width * 0.7);
    glowGrad.addColorStop(0, 'rgba(0, 255, 135, 0.18)');
    glowGrad.addColorStop(0.6, 'rgba(16, 185, 129, 0.05)');
    glowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = glowGrad;
    ctx.fillRect(0, 0, width, height);

    // 3. Mountain Silhouette Layers
    drawMountainSilhouette(ctx, width, height, isSquare);

    // 4. Subtle Border Frame
    ctx.strokeStyle = 'rgba(52, 211, 153, 0.35)';
    ctx.lineWidth = 6;
    ctx.strokeRect(40, 40, width - 80, height - 80);

    // Corner decorative markers
    drawCornerBrackets(ctx, 40, 40, width - 80, height - 80);

    // 5. Header Branding — Pure Mountain Peaks Silhouette (Circle removed)
    const mountainW = isSquare ? 190 : 230;
    const mountainH = Math.round(mountainW * (420 / 780)); // maintain exact aspect ratio
    const mountainX = (width - mountainW) / 2;
    const mountainY = isSquare ? 90 : 145;

    if (mountainImage.complete && mountainImage.naturalWidth > 0) {
      ctx.save();
      ctx.drawImage(mountainImage, mountainX, mountainY, mountainW, mountainH);
      ctx.restore();
    } else {
      ctx.font = '72px sans-serif';
      ctx.fillText('⛰️', width / 2, mountainY + mountainH / 2 + 10);
    }

    // Subtitle Line (Only "MAHARASHTRA WESTERN GHATS", "SAVE THE SAHYADRI" and "INITIATIVE" removed per request)
    const subheadY = isSquare ? 228 : 318;
    ctx.textAlign = 'center';
    ctx.font = isSquare ? '600 21px Inter, sans-serif' : '600 25px Inter, sans-serif';
    ctx.fillStyle = '#6EE7B7';
    ctx.letterSpacing = isSquare ? '3px' : '4px';
    ctx.fillText('MAHARASHTRA WESTERN GHATS', width / 2, subheadY);

    // 6. Main Bold Headline
    const headlineY = isSquare ? 336 : 486;
    ctx.font = '900 66px Outfit, Inter, sans-serif';
    ctx.fillStyle = '#FFFFFF';
    ctx.letterSpacing = '-1px';
    ctx.fillText('I STAND WITH', width / 2, headlineY);

    ctx.font = '900 80px Outfit, Inter, sans-serif';
    ctx.fillStyle = '#00FF87';
    ctx.shadowColor = '#00FF87';
    ctx.shadowBlur = 24;
    ctx.fillText('SAHYADRI', width / 2, headlineY + 84);
    ctx.shadowBlur = 0; // reset

    // 7. Supporter Card Box (Updated to Attached Image Style)
    const boxY = isSquare ? 476 : 716;
    const boxW = width - 160; // 920px wide
    const boxH = isSquare ? 360 : 430;
    const boxX = (width - boxW) / 2; // 80px

    // Box Background
    ctx.fillStyle = 'rgba(4, 18, 11, 0.9)';
    roundRect(ctx, boxX, boxY, boxW, boxH, 24);
    ctx.fill();
    ctx.strokeStyle = 'rgba(52, 211, 153, 0.45)';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    const innerLeft = boxX + 44;
    const maxTextWidth = isSquare ? 530 : 540;

    // A. PROUD SUPPORTER Pill Badge
    const badgeY = boxY + 32;
    const badgeW = 236;
    const badgeH = 38;
    const badgeR = 19;
    
    // Pill background & border
    ctx.fillStyle = 'rgba(6, 32, 22, 0.95)';
    roundRect(ctx, innerLeft, badgeY, badgeW, badgeH, badgeR);
    ctx.fill();
    ctx.strokeStyle = 'rgba(0, 255, 135, 0.55)';
    ctx.lineWidth = 1.8;
    ctx.stroke();

    // User Profile Icon
    ctx.save();
    ctx.strokeStyle = '#00FF87';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    // Head circle
    ctx.beginPath();
    ctx.arc(innerLeft + 22, badgeY + 14, 5.5, 0, Math.PI * 2);
    ctx.stroke();
    // Shoulder curve
    ctx.beginPath();
    ctx.arc(innerLeft + 22, badgeY + 28, 9, Math.PI * 1.25, Math.PI * 1.75);
    ctx.stroke();
    ctx.restore();

    // Badge Text
    ctx.textAlign = 'left';
    ctx.font = 'bold 15px Outfit, Inter, sans-serif';
    ctx.fillStyle = '#00FF87';
    ctx.letterSpacing = '1.8px';
    ctx.fillText('PROUD SUPPORTER', innerLeft + 44, badgeY + 24);

    // B. Supporter Name (Large bold white)
    const nameY = badgeY + 84;
    ctx.textAlign = 'left';
    ctx.font = '900 52px Outfit, Inter, sans-serif';
    ctx.fillStyle = '#FFFFFF';
    ctx.letterSpacing = '-0.5px';

    let renderedName = displayName;
    if (ctx.measureText(renderedName).width > maxTextWidth) {
      while (renderedName.length > 3 && ctx.measureText(renderedName + '...').width > maxTextWidth) {
        renderedName = renderedName.slice(0, -1);
      }
      renderedName += '...';
    }
    ctx.fillText(renderedName, innerLeft, nameY);

    // C. Location Line with Pin Icon
    const locY = nameY + 40;
    
    // Green Location Pin Icon
    ctx.save();
    ctx.fillStyle = '#00FF87';
    ctx.beginPath();
    ctx.arc(innerLeft + 7, locY - 14, 6, Math.PI * 0.8, Math.PI * 0.2, true);
    ctx.lineTo(innerLeft + 7, locY - 3);
    ctx.closePath();
    ctx.fill();
    // Pin center dot
    ctx.fillStyle = '#04180F';
    ctx.beginPath();
    ctx.arc(innerLeft + 7, locY - 14, 2.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Location Text
    ctx.textAlign = 'left';
    ctx.font = '600 24px Inter, sans-serif';
    ctx.fillStyle = '#00FF87';
    ctx.letterSpacing = '0.5px';
    ctx.fillText(`${city}, ${state}`, innerLeft + 24, locY - 5);

    // D. Horizontal Divider Line
    const divY = locY + 18;
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(innerLeft, divY);
    ctx.lineTo(innerLeft + maxTextWidth, divY);
    ctx.strokeStyle = 'rgba(52, 211, 153, 0.35)';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.restore();

    // E. Pledge Statement Quote
    const quoteY = divY + 30;
    ctx.textAlign = 'left';
    ctx.font = '400 19px Inter, sans-serif';
    ctx.fillStyle = '#CBD5E1';
    ctx.letterSpacing = '0.3px';
    ctx.fillText('I stand for the protection of forests,', innerLeft, quoteY);
    ctx.fillText('wildlife and biodiversity of the Western Ghats.', innerLeft, quoteY + 28);

    // F. Tree of Life Illustration on Right Side
    const treeW = isSquare ? 280 : 300;
    const treeH = isSquare ? 262 : 281;
    const treeX = boxX + boxW - treeW - 25;
    const treeY = boxY + (boxH - treeH) / 2;

    if (treeImage.complete && treeImage.naturalWidth > 0) {
      ctx.save();
      ctx.drawImage(treeImage, treeX, treeY, treeW, treeH);
      ctx.restore();
    }

    // 8. Key Quote & Website URL Footer
    const footerY = isSquare ? 950 : 1620;
    ctx.textAlign = 'center';
    
    if (!isSquare) {
      // Extra Quote for Story format
      ctx.font = 'italic 28px Inter, sans-serif';
      ctx.fillStyle = '#E2E8F0';
      ctx.fillText('“Protecting nature is not just about today.', width / 2, footerY - 130);
      ctx.fillText('It is about what we leave behind.”', width / 2, footerY - 88);
    }

    ctx.font = 'bold 30px Outfit, Inter, sans-serif';
    ctx.fillStyle = '#00FF87';
    ctx.letterSpacing = '1px';
    ctx.fillText('Join the movement: savethesahyadri.org', width / 2, footerY);

    ctx.font = '400 18px Inter, sans-serif';
    ctx.fillStyle = '#64748B';
    ctx.letterSpacing = '0.5px';
    ctx.fillText('Independent Citizen Public Awareness Movement • Non-commercial', width / 2, footerY + 36);
  }

  // Download Handler
  btnDownload.addEventListener('click', () => {
    const link = document.createElement('a');
    link.download = `save-the-sahyadri-${displayName.toLowerCase().replace(/\s+/g, '-')}-${currentFormat}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  });

  // WhatsApp Handler
  btnWhatsApp.addEventListener('click', () => {
    const siteUrl = (typeof window !== 'undefined' && window.location)
      ? (window.location.origin + window.location.pathname)
      : 'https://savethesahyadri.org/';

    const text = encodeURIComponent(
      `💔🌳 *सह्याद्री के जंगलों पर संकट है… क्या हम चुप रहेंगे?*\n\n` +
      `महाराष्ट्र के कर्जत में 32,490 पेड़ों को हटाने की खबर ने हर प्रकृति प्रेमी को सोचने पर मजबूर कर दिया है। 💔\n\n` +
      `ये सिर्फ पेड़ों की गिनती नहीं है…\n` +
      `🌳 ये किसी पक्षी का घर है।\n` +
      `🐾 ये बेज़ुबान जानवरों का आशियाना है।\n` +
      `💧 ये हमारी नदियों और पानी के भविष्य का सवाल है।\n` +
      `🌱 और ये हमारी आने वाली पीढ़ियों की विरासत है।\n\n` +
      `🙏 *विकास ज़रूरी है, लेकिन प्रकृति की कीमत पर हर फैसला सवालों से परे नहीं हो सकता।* 💚\n\n` +
      `🌿 *Save the Sahyadri*\n` +
      `🤝 आइए, जागरूकता फैलाएँ। इस आवाज़ को और लोगों तक पहुँचाएँ।\n\n` +
      `💚 *मैं सह्याद्री के साथ खड़ा हूँ… क्या आप भी?*\n` +
      `🌐 हमारी मुहिम से जुड़ें:\n` +
      `${siteUrl}\n\n` +
      `📢 *इस संदेश को शेयर करें। सह्याद्री की आवाज़ दूर तक पहुँचनी चाहिए।*`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  });

  // Initial Card Render
  renderCard();
}

export function closeShareCardModal() {
  const modal = document.getElementById('sahyadri-share-modal-root');
  if (modal) {
    if (modal._escListener) {
      window.removeEventListener('keydown', modal._escListener);
    }
    modal.remove();
    document.body.classList.remove('overflow-hidden');
  }
}

// Helper to draw mountain silhouette in canvas
function drawMountainSilhouette(ctx, width, height, isSquare) {
  const baseH = isSquare ? height * 0.75 : height * 0.8;

  // Background Ridge
  ctx.beginPath();
  ctx.moveTo(0, height);
  ctx.lineTo(0, baseH - 40);
  ctx.lineTo(width * 0.2, baseH - 140);
  ctx.lineTo(width * 0.45, baseH - 60);
  ctx.lineTo(width * 0.7, baseH - 180);
  ctx.lineTo(width * 0.9, baseH - 80);
  ctx.lineTo(width, baseH - 120);
  ctx.lineTo(width, height);
  ctx.closePath();
  ctx.fillStyle = 'rgba(7, 28, 16, 0.4)';
  ctx.fill();

  // Foreground Ridge
  ctx.beginPath();
  ctx.moveTo(0, height);
  ctx.lineTo(0, baseH + 40);
  ctx.lineTo(width * 0.28, baseH - 80);
  ctx.lineTo(width * 0.55, baseH + 10);
  ctx.lineTo(width * 0.82, baseH - 90);
  ctx.lineTo(width, baseH - 10);
  ctx.lineTo(width, height);
  ctx.closePath();
  ctx.fillStyle = 'rgba(4, 16, 9, 0.75)';
  ctx.fill();
}

function drawCornerBrackets(ctx, x, y, w, h) {
  const len = 30;
  ctx.strokeStyle = '#00FF87';
  ctx.lineWidth = 4;

  // Top Left
  ctx.beginPath();
  ctx.moveTo(x, y + len); ctx.lineTo(x, y); ctx.lineTo(x + len, y);
  ctx.stroke();

  // Top Right
  ctx.beginPath();
  ctx.moveTo(x + w - len, y); ctx.lineTo(x + w, y); ctx.lineTo(x + w, y + len);
  ctx.stroke();

  // Bottom Left
  ctx.beginPath();
  ctx.moveTo(x, y + h - len); ctx.lineTo(x, y + h); ctx.lineTo(x + len, y + h);
  ctx.stroke();

  // Bottom Right
  ctx.beginPath();
  ctx.moveTo(x + w - len, y + h); ctx.lineTo(x + w, y + h); ctx.lineTo(x + w, y + h - len);
  ctx.stroke();
}

function roundRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}
