/**
 * Clipboard utilities
 */

import { VENUE, ICONS } from './config.js';
import { showToast } from './toast.js';

/**
 * Copy text to clipboard with optional feedback
 */
export async function copyToClipboard(text, options = {}) {
  const { successMessage, iconElement, successIcon, defaultIcon } = options;

  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
    } else {
      fallbackCopy(text);
    }

    if (iconElement && successIcon && defaultIcon) {
      iconElement.src = successIcon;
      setTimeout(() => (iconElement.src = defaultIcon), 2000);
    }
    
    if (successMessage) {
      showToast(successMessage);
    }
  } catch (err) {
    console.error('Failed to copy:', err);
    showToast('복사에 실패했습니다');
  }
}

/**
 * Fallback copy for older browsers
 */
function fallbackCopy(text) {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  Object.assign(textarea.style, { position: 'fixed', opacity: '0' });
  document.body.appendChild(textarea);
  textarea.select();

  try {
    document.execCommand('copy');
  } finally {
    document.body.removeChild(textarea);
  }
}

/**
 * Copy venue address
 */
export function copyAddress() {
  copyToClipboard(VENUE.address, {
    successMessage: '주소가 복사되었습니다',
  });
}

/**
 * Copy address with icon feedback
 */
export function copyAddressWithIcon() {
  const icon = document.getElementById('copyAddressIcon');
  copyToClipboard(VENUE.address, {
    iconElement: icon,
    successIcon: ICONS.copied,
    defaultIcon: ICONS.copy,
    successMessage: '주소가 복사되었습니다',
  });
}

/**
 * Copy account number
 */
export function copyAccount(accountInfo) {
  copyToClipboard(accountInfo, {
    successMessage: '계좌번호가 복사되었습니다',
  });
}
