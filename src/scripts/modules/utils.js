/**
 * Utility functions
 */

import { WEDDING } from './config.js';

/**
 * Fix hero height for mobile browsers
 */
export function fixHeroHeight() {
  const hero = document.querySelector('.hero');
  if (!hero) return;

  const height = window.innerHeight;
  hero.style.cssText += `height: ${height}px !important; min-height: ${height}px !important;`;
  console.log('✅ Hero height:', height, 'px');
}

/**
 * Initialize D-day counter
 */
export function initDdayCounter() {
  const today = new Date();
  const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const weddingMidnight = new Date(
    WEDDING.dateObj.getFullYear(),
    WEDDING.dateObj.getMonth(),
    WEDDING.dateObj.getDate()
  );

  const diffDays = Math.ceil((weddingMidnight - todayMidnight) / (1000 * 60 * 60 * 24));

  const element = document.getElementById('dday-count');
  if (element) element.textContent = diffDays;
}

/**
 * Console welcome message
 */
export function logWelcome() {
  console.log(
    '%c💒 Wedding Invitation',
    'font-size: 20px; color: #8b7355; font-weight: bold;'
  );
  console.log('%cMade with ❤️', 'font-size: 12px; color: #6a6a6a;');
}
