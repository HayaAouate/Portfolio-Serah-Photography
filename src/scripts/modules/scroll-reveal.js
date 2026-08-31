/**
 * Scroll Reveal Animation Module
 * Uses IntersectionObserver to trigger smooth entry transitions
 */

import { $$ } from '../utils/dom.js';
import { prefersReducedMotion } from '../utils/a11y.js';

export class ScrollReveal {
  constructor(selector = '.rv') {
    this.elements = $$(selector);
    this.init();
  }

  init() {
    if (!this.elements.length) return;

    if (prefersReducedMotion() || !('IntersectionObserver' in window)) {
      this.elements.forEach((el) => el.classList.add('in'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin: '0px 0px -10% 0px',
        threshold: 0.08,
      }
    );

    this.elements.forEach((el) => observer.observe(el));
  }
}
