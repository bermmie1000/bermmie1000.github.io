/**
 * Modal utilities
 */

/**
 * Open modal by ID
 */
export function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

/**
 * Close modal by ID
 */
export function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

/**
 * Contact modal handlers
 */
export const contactModal = {
  open: () => openModal('contactModal'),
  close: () => closeModal('contactModal'),
};

/**
 * Gift modal handlers
 */
export const giftModal = {
  open(side) {
    const modal = document.getElementById('giftModal');
    if (!modal) return;

    const sections = modal.querySelectorAll('.contact-section');
    if (sections[0]) sections[0].style.display = side === 'groom' ? 'block' : 'none';
    if (sections[1]) sections[1].style.display = side === 'bride' ? 'block' : 'none';

    openModal('giftModal');
  },
  close: () => closeModal('giftModal'),
};
