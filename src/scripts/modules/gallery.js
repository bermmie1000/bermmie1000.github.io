/**
 * Gallery — Grid with Lightbox
 */

import { GALLERY_IMAGES } from './config.js';

let currentIndex = 0;

// Touch handling (lightbox swipe)
let touchStartX = 0;
let touchStartY = 0;
const SWIPE_THRESHOLD = 50;

/**
 * Initialize gallery
 */
export function initGallery() {
  createGrid();
  createLightbox();

  console.log('✅ Gallery initialized:', GALLERY_IMAGES.length, 'images (grid → lightbox mode)');
}

/**
 * Create 3×3 thumbnail grid
 */
function createGrid() {
  const container = document.getElementById('galleryGrid');
  if (!container) return;

  GALLERY_IMAGES.forEach((src, index) => {
    const item = document.createElement('div');
    item.className = 'gallery-grid-item';
    item.role = 'listitem';
    item.tabIndex = 0;
    item.setAttribute('aria-label', `사진 ${index + 1} / ${GALLERY_IMAGES.length}`);

    const img = document.createElement('img');
    img.src = src;
    img.alt = `Wedding Photo ${index + 1}`;
    img.loading = index < 3 ? 'eager' : 'lazy';
    img.decoding = 'async';

    item.appendChild(img);

    // Click → open lightbox
    item.addEventListener('click', () => {
      currentIndex = index;
      openLightbox();
    });

    // Keyboard → Enter/Space to open lightbox
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        currentIndex = index;
        openLightbox();
      }
    });

    container.appendChild(item);
  });
}

// ── Lightbox ──

function createLightbox() {
  const lightbox = document.createElement('div');
  lightbox.id = 'lightbox';
  lightbox.className = 'lightbox';
  lightbox.innerHTML = `
    <button class="lightbox-close" aria-label="닫기">✕</button>
    <button class="lightbox-nav lightbox-prev" aria-label="이전">‹</button>
    <img id="lightbox-image" src="" alt="Gallery Image">
    <button class="lightbox-nav lightbox-next" aria-label="다음">›</button>
  `;
  document.body.appendChild(lightbox);

  lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
  lightbox.querySelector('.lightbox-prev').addEventListener('click', (e) => {
    e.stopPropagation();
    navigateLightbox(-1);
  });
  lightbox.querySelector('.lightbox-next').addEventListener('click', (e) => {
    e.stopPropagation();
    navigateLightbox(1);
  });
  lightbox.addEventListener('click', closeLightbox);

  // Swipe in lightbox
  lightbox.addEventListener('touchstart', handleTouchStart, { passive: true });
  lightbox.addEventListener('touchend', handleTouchEnd);

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') navigateLightbox(-1);
    if (e.key === 'ArrowRight') navigateLightbox(1);
  });
}

function openLightbox() {
  const lightbox = document.getElementById('lightbox');
  lightbox.classList.add('active');
  updateLightboxImage();
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  const lightbox = document.getElementById('lightbox');
  lightbox.classList.remove('active');
  document.body.style.overflow = '';
}

function navigateLightbox(direction) {
  const len = GALLERY_IMAGES.length;
  currentIndex = (currentIndex + direction + len) % len;
  updateLightboxImage();
}

function updateLightboxImage() {
  const lightboxImg = document.getElementById('lightbox-image');
  if (lightboxImg) {
    lightboxImg.src = GALLERY_IMAGES[currentIndex];
  }
}

// ── Touch helpers (lightbox swipe) ──

function handleTouchStart(e) {
  touchStartX = e.changedTouches[0].screenX;
  touchStartY = e.changedTouches[0].screenY;
}

function handleTouchEnd(e) {
  const diffX = touchStartX - e.changedTouches[0].screenX;
  const diffY = touchStartY - e.changedTouches[0].screenY;

  if (Math.abs(diffX) < SWIPE_THRESHOLD || Math.abs(diffY) > Math.abs(diffX)) return;

  navigateLightbox(diffX > 0 ? 1 : -1);
}
