/**
 * Main entry point - Wedding Invitation
 * Orchestrates all modules and initializes the application
 */

// Import modules
import { loadKakaoMapScript, initKakaoMap, openKakaoMap, openNaverMap, openTmap, openKakaoNavi } from './modules/map.js';
import { initKakaoSDK, shareKakao } from './modules/share.js';
import { initGallery } from './modules/gallery.js';
import { copyAddress, copyAddressWithIcon, copyAccount } from './modules/clipboard.js';
import { contactModal, giftModal } from './modules/modal.js';
import { initMusic, toggleMusic } from './modules/music.js';
import { fixHeroHeight, initDdayCounter, logWelcome } from './modules/utils.js';
import { initScrollReveal } from './modules/scroll-reveal.js';

/**
 * Initialize application
 */
async function init() {
  // UI setup
  fixHeroHeight();
  initDdayCounter();
  initGallery();
  initScrollReveal();
  initMusic();

  // Kakao SDK
  initKakaoSDK();

  // Kakao Map
  try {
    await loadKakaoMapScript();
    initKakaoMap();
  } catch (error) {
    console.error('Map init failed:', error);
  }

  // Setup event listeners
  setupEventListeners();

  logWelcome();
}

/**
 * Setup all event listeners (replacing inline onclick handlers)
 */
function setupEventListeners() {
  // Music toggle
  document.getElementById('musicToggle')?.addEventListener('click', toggleMusic);

  // Contact modal
  document.querySelector('[data-action="open-contact"]')?.addEventListener('click', contactModal.open);

  // Gift modal buttons
  document.querySelectorAll('[data-action="open-gift"]').forEach(btn => {
    btn.addEventListener('click', () => giftModal.open(btn.dataset.side));
  });

  // Modal close buttons
  document.querySelectorAll('[data-action="close-contact"]').forEach(el => {
    el.addEventListener('click', contactModal.close);
  });
  document.querySelectorAll('[data-action="close-gift"]').forEach(el => {
    el.addEventListener('click', giftModal.close);
  });

  // Copy address
  document.getElementById('copyAddressIcon')?.addEventListener('click', copyAddressWithIcon);

  // Navigation apps
  document.querySelector('[data-nav="kakao-map"]')?.addEventListener('click', e => { e.preventDefault(); openKakaoMap(); });
  document.querySelector('[data-nav="naver-map"]')?.addEventListener('click', e => { e.preventDefault(); openNaverMap(); });
  document.querySelector('[data-nav="tmap"]')?.addEventListener('click', e => { e.preventDefault(); openTmap(); });
  document.querySelector('[data-nav="kakao-navi"]')?.addEventListener('click', e => { e.preventDefault(); openKakaoNavi(); });

  // Account copy buttons
  document.querySelectorAll('[data-account]').forEach(btn => {
    btn.addEventListener('click', () => copyAccount(btn.dataset.account));
  });

  // Share button
  document.querySelector('[data-action="share-kakao"]')?.addEventListener('click', shareKakao);
}

// Expose to global scope for any remaining inline handlers during transition
window.toggleMusic = toggleMusic;
window.copyAddress = copyAddress;
window.copyAddressWithIcon = copyAddressWithIcon;
window.copyAccount = copyAccount;
window.openKakaoMap = openKakaoMap;
window.openNaverMap = openNaverMap;
window.openTmap = openTmap;
window.openKakaoNavi = openKakaoNavi;
window.shareKakao = shareKakao;
window.openContactModal = contactModal.open;
window.closeContactModal = contactModal.close;
window.openGiftModal = giftModal.open;
window.closeGiftModal = giftModal.close;

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
