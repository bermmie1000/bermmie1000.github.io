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
  initHeroPetals();

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
 * Hero petals overlay
 * - Creates multiple petal elements with randomized drift/sway/size/duration.
 * - Scoped to the hero section only.
 */
function initHeroPetals() {
  const container = document.querySelector('.hero-sparkles');
  if (!container) return;

  // Respect reduced motion
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // Avoid duplicates on HMR reloads
  container.innerHTML = '';

  const PETAL_COUNT = 22;

  for (let i = 0; i < PETAL_COUNT; i++) {
    const el = document.createElement('i');
    el.className = 'petal';

    const size = rand(12, 22); // px
    const x = rand(-45, 45); // vw-ish using translate var
    const drift = rand(-80, 110); // px
    const sway = rand(12, 32); // px
    const duration = rand(18, 30); // s
    const delay = rand(-30, 0); // s (start mid-animation)
    const swayDuration = rand(2.8, 5.2); // s
    const spinDuration = rand(4.5, 8.5); // s
    const rot = rand(0, 360); // deg
    const opacity = rand(0.45, 0.9);

    el.style.left = `${rand(2, 98)}%`;
    el.style.setProperty('--petal-size', `${size}px`);
    el.style.setProperty('--petal-x', `${x}vw`);
    el.style.setProperty('--petal-drift', `${drift}px`);
    el.style.setProperty('--petal-sway', `${sway}px`);
    el.style.setProperty('--petal-duration', `${duration}s`);
    el.style.setProperty('--petal-sway-duration', `${swayDuration}s`);
    el.style.setProperty('--petal-spin-duration', `${spinDuration}s`);
    el.style.setProperty('--petal-rot', `${rot}deg`);
    el.style.setProperty('--petal-opacity', `${opacity}`);
    el.style.animationDelay = `${delay}s`;

    container.appendChild(el);
  }

  function rand(min, max) {
    return Math.random() * (max - min) + min;
  }
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
  document.querySelectorAll('[data-action="open-gift"]').forEach((btn) => {
    btn.addEventListener('click', () => giftModal.open(btn.dataset.side));
  });

  // Modal close buttons
  document.querySelectorAll('[data-action="close-contact"]').forEach((el) => {
    el.addEventListener('click', contactModal.close);
  });
  document.querySelectorAll('[data-action="close-gift"]').forEach((el) => {
    el.addEventListener('click', giftModal.close);
  });

  // Copy address
  document.getElementById('copyAddressIcon')?.addEventListener('click', copyAddressWithIcon);

  // Navigation apps
  document.querySelector('[data-nav="kakao-map"]')?.addEventListener('click', (e) => {
    e.preventDefault();
    openKakaoMap();
  });
  document.querySelector('[data-nav="naver-map"]')?.addEventListener('click', (e) => {
    e.preventDefault();
    openNaverMap();
  });
  document.querySelector('[data-nav="tmap"]')?.addEventListener('click', (e) => {
    e.preventDefault();
    openTmap();
  });
  document.querySelector('[data-nav="kakao-navi"]')?.addEventListener('click', (e) => {
    e.preventDefault();
    openKakaoNavi();
  });

  // Account copy buttons
  document.querySelectorAll('[data-account]').forEach((btn) => {
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
