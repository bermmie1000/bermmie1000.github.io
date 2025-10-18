/**
 * Main JavaScript for wedding invitation
 * Handles RSVP form, smooth scrolling, and animations
 */

/**
 * Initialize the application when DOM is ready
 */
function init() {
  setupRSVPForm();
  setupSmoothScroll();
  setupScrollAnimations();
  logWelcomeMessage();
}

/**
 * Setup RSVP form submission handler
 */
function setupRSVPForm() {
  const form = document.getElementById('rsvpForm');
  if (!form) {
    return;
  }

  form.addEventListener('submit', handleRSVPSubmit);
}

/**
 * Handle RSVP form submission
 * @param {Event} e - Submit event
 */
function handleRSVPSubmit(e) {
  e.preventDefault();

  const formData = {
    name: document.getElementById('name').value,
    attendance: document.getElementById('attendance').value,
    guests: document.getElementById('guests').value,
    message: document.getElementById('message').value,
    timestamp: new Date().toISOString(),
  };

  // TODO: Google Sheets API integration
  console.warn('[DEV] RSVP Data (Google Sheets integration pending):', formData);

  // Show success message
  alert('참석 여부가 전달되었습니다.\n감사합니다! 💝');

  // Reset form
  e.target.reset();
}

/**
 * Setup smooth scrolling for anchor links
 */
function setupSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }
    });
  });
}

/**
 * Setup scroll-triggered animations using Intersection Observer
 */
function setupScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px',
  };

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);

  // Apply animation to all sections except hero
  document.querySelectorAll('section:not(.hero)').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(30px)';
    section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(section);
  });
}

/**
 * Log welcome message to console (developer Easter egg)
 */
function logWelcomeMessage() {
  console.log(
    '%c💒 Wedding Invitation',
    'font-size: 20px; color: #8b7355; font-weight: bold;'
  );
  console.log(
    '%cMade with ❤️ by Developer',
    'font-size: 12px; color: #6a6a6a;'
  );
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
