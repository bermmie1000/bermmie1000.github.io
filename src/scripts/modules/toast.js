/**
 * Toast notification module
 */

let toastTimeout;

/**
 * Show a toast message
 * @param {string} message - Message to display
 * @param {number} duration - Duration in ms (default 2000)
 */
export function showToast(message, duration = 2000) {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  
  let toast = container.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    container.appendChild(toast);
  }
  
  // Clear existing timeout
  clearTimeout(toastTimeout);
  
  // Update message and show
  toast.textContent = message;
  
  // Force reflow for animation restart
  toast.classList.remove('show');
  void toast.offsetWidth;
  toast.classList.add('show');
  
  // Auto hide
  toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, duration);
}
