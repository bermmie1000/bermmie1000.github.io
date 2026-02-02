/**
 * Music player functionality
 */

import { ICONS } from './config.js';

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
