/**
 * Gallery functionality
 */

import { GALLERY_IMAGES } from './config.js';

let currentIndex = 0;
let imageElement = null;

/**
 * Initialize gallery
 */
export function initGallery() {
  imageElement = document.getElementById('galleryImage');
  if (!imageElement) return;

  // Button handlers
  document.getElementById('galleryPrev')?.addEventListener('click', showPrev);
  document.getElementById('galleryNext')?.addEventListener('click', showNext);

  // Create indicators
  createIndicators();

  console.log('✅ Gallery initialized:', GALLERY_IMAGES.length, 'images');
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
