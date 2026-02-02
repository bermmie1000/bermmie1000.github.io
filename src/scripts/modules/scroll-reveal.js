/**
 * Scroll Reveal Animation using Intersection Observer
 */

/**
 * Initialize scroll reveal animations
 */
export function initScrollReveal() {
  const elements = document.querySelectorAll('.scroll-reveal');
  
  if (!elements.length) return;
  
  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    elements.forEach(el => el.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Only animate once
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -30px 0px'
  });
  
  elements.forEach(el => observer.observe(el));
  
  console.log('✅ Scroll reveal initialized:', elements.length, 'elements');
}
