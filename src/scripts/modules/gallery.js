/**
 * Gallery — Master-Detail Grid with Lightbox
 */

import { GALLERY_IMAGES } from './config.js';

let currentIndex = 0;
let previewElement = null;

// Touch handling (lightbox swipe)
let touchStartX = 0;
let touchStartY = 0;
const SWIPE_THRESHOLD = 50;

/**
 * Initialize gallery
 */
export function initGallery() {
  previewElement = document.getElementById('galleryPreview');
  if (!previewElement) return;

  createGrid();
  createLightbox();

  // Click preview → open lightbox
  previewElement.addEventListener('click', openLightbox);

  console.log('✅ Gallery initialized:', GALLERY_IMAGES.length, 'images (grid mode)');
}

/**
 * Create 3×3 thumbnail grid
 */
function createGrid() {
  const container = document.getElementById('galleryGrid');
  if (!container) return;

  GALLERY_IMAGES.forEach((src, index) => {
    const item = document.createElement('div');
    item.className = `gallery-grid-item${index === 0 ? ' active' : ''}`;
    item.role = 'listitem';
    item.tabIndex = 0;
    item.setAttribute('aria-label', `사진 ${index + 1} / ${GALLERY_IMAGES.length}`);

    const img = document.createElement('img');
    img.src = src;
    img.alt = `Wedding Photo ${index + 1}`;
    img.loading = index < 3 ? 'eager' : 'lazy';
    img.decoding = 'async';

    item.appendChild(img);

    // Click → select
    item.addEventListener('click', () => selectImage(index));

    // Keyboard → Enter/Space to select
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        selectImage(index);
      }
    });

    container.appendChild(item);
  });
}

/**
 * Select image → update preview
 */
function selectImage(index) {
  currentIndex = index;

  if (document.startViewTransition) {
    document.startViewTransition(() => {
      previewElement.src = GALLERY_IMAGES[index];
      updateActiveThumb(index);
    });
  } else {
    // Fallback: CSS opacity transition
    previewElement.style.opacity = '0';
    setTimeout(() => {
      previewElement.src = GALLERY_IMAGES[index];
      previewElement.style.opacity = '1';
      updateActiveThumb(index);
    }, 150);
  }
}

/**
 * Update active thumbnail highlight
 */
function updateActiveThumb(index) {
  document.querySelectorAll('.gallery-grid-item').forEach((item, i) => {
    item.classList.toggle('active', i === index);
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
  updateActiveThumb(currentIndex);
  previewElement.src = GALLERY_IMAGES[currentIndex];
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
