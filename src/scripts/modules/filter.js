/**
 * Portfolio Filter System Module
 * Filters photo cards by category with animated transitions and ARIA status updates
 */

import { $, $$ } from '../utils/dom.js';
import { prefersReducedMotion } from '../utils/a11y.js';

export class PortfolioFilter {
  constructor() {
    this.buttons = $$('.filters button');
    this.cards = $$('#masonry .frame');
    this.statusEl = $('#filter-status');

    this.init();
  }

  init() {
    if (!this.buttons.length || !this.cards.length) return;
    this.bindEvents();
  }

  applyFilter(activeBtn) {
    const filter = activeBtn.dataset.filter || 'tout';
    let matchCount = 0;
    const isReduced = prefersReducedMotion();

    // Update ARIA pressed states
    this.buttons.forEach((btn) => {
      btn.setAttribute('aria-pressed', String(btn === activeBtn));
    });

    // Filter card items
    this.cards.forEach((card) => {
      const tags = (card.dataset.tags || '').split(' ');
      const isMatch = filter === 'tout' || tags.includes(filter);

      if (isMatch) matchCount++;

      if (isReduced) {
        card.hidden = !isMatch;
        return;
      }

      if (isMatch) {
        card.hidden = false;
        requestAnimationFrame(() => {
          card.classList.remove('is-out');
        });
      } else {
        card.classList.add('is-out');
        setTimeout(() => {
          if (card.classList.contains('is-out')) {
            card.hidden = true;
          }
        }, 320);
      }
    });

    // Update accessible status text
    if (this.statusEl) {
      this.statusEl.textContent = `${matchCount} ${matchCount > 1 ? 'images' : 'image'}`;
    }
  }

  bindEvents() {
    this.buttons.forEach((btn) => {
      btn.addEventListener('click', () => this.applyFilter(btn));
    });
  }
}
