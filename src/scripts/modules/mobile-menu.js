/**
 * Mobile Navigation Drawer Module
 * Handles accessible mobile modal menu, focus management, and escape key listener
 */

import { $, $$ } from '../utils/dom.js';
import { lockScroll, unlockScroll } from '../utils/a11y.js';

export class MobileMenu {
  constructor() {
    this.burger = $('#burger');
    this.menu = $('#menu');
    this.menuClose = $('#menuClose');
    this.links = $$('a', this.menu || document);

    this.isOpen = false;
    this.init();
  }

  init() {
    if (!this.burger || !this.menu) return;
    this.bindEvents();
  }

  setOpen(isOpen) {
    this.isOpen = isOpen;
    this.menu.classList.toggle('is-on', isOpen);
    this.burger.setAttribute('aria-expanded', String(isOpen));

    if (isOpen) {
      lockScroll();
      if (this.menuClose) this.menuClose.focus();
    } else {
      unlockScroll();
      this.burger.focus();
    }
  }

  bindEvents() {
    this.burger.addEventListener('click', () => this.setOpen(true));

    if (this.menuClose) {
      this.menuClose.addEventListener('click', () => this.setOpen(false));
    }

    this.links.forEach((link) => {
      link.addEventListener('click', () => this.setOpen(false));
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.setOpen(false);
      }
    });
  }
}
