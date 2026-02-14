/**
 * Music player functionality
 */

import { ICONS } from './config.js';

/**
 * Auto-play BGM on first user interaction
 */
export function initMusic() {
  const audio = document.getElementById('bgm');
  if (!audio) return;

  // Try autoplay immediately (may be blocked by browser policy)
  const tryPlay = () => {
    audio.play()
      .then(() => {
        cleanup();
      })
      .catch(() => {
        // Blocked — wait for first user interaction
      });
  };

  // On first user interaction, start playback
  const onInteraction = () => {
    audio.play()
      .then(() => cleanup())
      .catch(err => console.error('BGM play failed:', err));
  };

  const cleanup = () => {
    document.removeEventListener('click', onInteraction);
    document.removeEventListener('touchstart', onInteraction);
    document.removeEventListener('scroll', onInteraction);
  };

  document.addEventListener('click', onInteraction, { once: false });
  document.addEventListener('touchstart', onInteraction, { once: false, passive: true });
  document.addEventListener('scroll', onInteraction, { once: false, passive: true });

  tryPlay();
}

/**
 * Toggle background music
 */
export function toggleMusic() {
  const audio = document.getElementById('bgm');
  const button = document.getElementById('musicToggle');
  const icon = button?.querySelector('.music-icon');

  if (!audio || !button || !icon) return;

  if (audio.paused) {
    audio.play()
      .then(() => {
        button.classList.add('playing');
        icon.src = ICONS.volume;
      })
      .catch(err => console.error('Failed to play:', err));
  } else {
    audio.pause();
    button.classList.remove('playing');
    icon.src = ICONS.mute;
  }
}
