/**
 * Gallery functionality with swipe and lightbox
 */

import { GALLERY_IMAGES } from './config.js';

let currentIndex = 0;
let imageElement = null;
let galleryFrame = null;

// Touch handling
let touchStartX = 0;
let touchStartY = 0;
const SWIPE_THRESHOLD = 50;

/**
 * Initialize gallery
 */
export function initGallery() {
  imageElement = document.getElementById('galleryImage');
  galleryFrame = document.querySelector('.gallery-frame');
  if (!imageElement) return;

  // Button handlers
  document.getElementById('galleryPrev')?.addEventListener('click', showPrev);
  document.getElementById('galleryNext')?.addEventListener('click', showNext);

  // Touch swipe handlers
  if (galleryFrame) {
    galleryFrame.addEventListener('touchstart', handleTouchStart, { passive: true });
    galleryFrame.addEventListener('touchend', handleTouchEnd);
  }

  // Lightbox: click to open
  imageElement.addEventListener('click', openLightbox);

  // Create indicators
  createIndicators();

  // Create lightbox
  createLightbox();

  console.log('✅ Gallery initialized:', GALLERY_IMAGES.length, 'images');
}

/**
 * Touch handlers for swipe
 */
function handleTouchStart(e) {
  touchStartX = e.changedTouches[0].screenX;
  touchStartY = e.changedTouches[0].screenY;
}

function handleTouchEnd(e) {
  const touchEndX = e.changedTouches[0].screenX;
  const touchEndY = e.changedTouches[0].screenY;
  
  const diffX = touchStartX - touchEndX;
  const diffY = touchStartY - touchEndY;
  
  // Only handle horizontal swipes (ignore vertical scrolling)
  if (Math.abs(diffX) < SWIPE_THRESHOLD || Math.abs(diffY) > Math.abs(diffX)) {
    return;
  }
  
  if (diffX > 0) {
    showNext(); // Swipe left → next
  } else {
    showPrev(); // Swipe right → prev
  }
}

/**
 * Create gallery indicators
 */
function createIndicators() {
  const container = document.getElementById('galleryIndicators');
  if (!container) return;

  container.innerHTML = '';
  GALLERY_IMAGES.forEach((_, index) => {
    const indicator = document.createElement('div');
    indicator.className = `gallery-indicator${index === 0 ? ' active' : ''}`;
    indicator.addEventListener('click', () => showImage(index));
    container.appendChild(indicator);
  });
}

/**
 * Create lightbox element
 */
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

  // Lightbox event listeners
  lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
  lightbox.querySelector('.lightbox-prev').addEventListener('click', (e) => { e.stopPropagation(); showPrev(); updateLightboxImage(); });
  lightbox.querySelector('.lightbox-next').addEventListener('click', (e) => { e.stopPropagation(); showNext(); updateLightboxImage(); });
  lightbox.addEventListener('click', closeLightbox);
  
  // Swipe in lightbox
  lightbox.addEventListener('touchstart', handleTouchStart, { passive: true });
  lightbox.addEventListener('touchend', (e) => {
    handleTouchEnd(e);
    updateLightboxImage();
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') { showPrev(); updateLightboxImage(); }
    if (e.key === 'ArrowRight') { showNext(); updateLightboxImage(); }
  });
}

/**
 * Open lightbox
 */
function openLightbox() {
  const lightbox = document.getElementById('lightbox');
  lightbox.classList.add('active');
  updateLightboxImage();
  document.body.style.overflow = 'hidden';
}

/**
 * Close lightbox
 */
function closeLightbox() {
  const lightbox = document.getElementById('lightbox');
  lightbox.classList.remove('active');
  document.body.style.overflow = '';
}

/**
 * Update lightbox image
 */
function updateLightboxImage() {
  const lightboxImg = document.getElementById('lightbox-image');
  if (lightboxImg) {
    lightboxImg.src = GALLERY_IMAGES[currentIndex];
  }
}

/**
 * Show previous image
 */
function showPrev() {
  const newIndex = currentIndex > 0 ? currentIndex - 1 : GALLERY_IMAGES.length - 1;
  showImage(newIndex);
}

/**
 * Show next image
 */
function showNext() {
  const newIndex = currentIndex < GALLERY_IMAGES.length - 1 ? currentIndex + 1 : 0;
  showImage(newIndex);
}

/**
 * Show image by index
 */
function showImage(index) {
  currentIndex = index;
  imageElement.src = GALLERY_IMAGES[index];

  // Update indicators
  document.querySelectorAll('.gallery-indicator').forEach((ind, i) => {
    ind.classList.toggle('active', i === currentIndex);
  });
}
