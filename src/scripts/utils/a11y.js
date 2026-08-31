/**
 * Accessibility (a11y) Utilities
 */

/**
 * Checks whether user requested reduced motion
 * @returns {boolean}
 */
export const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Locks page body scroll
 */
export const lockScroll = () => {
  document.body.style.overflow = 'hidden';
};

/**
 * Unlocks page body scroll
 */
export const unlockScroll = () => {
  document.body.style.overflow = '';
};

const FOCUSABLE = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

/**
 * Keeps Tab navigation inside a container (modal, dialog)
 * @param {HTMLElement} container
 * @param {KeyboardEvent} event
 */
export const trapFocus = (container, event) => {
  if (event.key !== 'Tab') return;
  const items = Array.from(container.querySelectorAll(FOCUSABLE))
    .filter((el) => !el.disabled && el.offsetParent !== null);
  if (!items.length) return;

  const first = items[0];
  const last = items[items.length - 1];

  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
};
