/**
 * Accessible Lightbox Modal Module
 * Provides keyboard navigation, focus restoration, and deduplicated photo indexing
 */

import { $, $$ } from '../utils/dom.js';
import { lockScroll, unlockScroll } from '../utils/a11y.js';

export class Lightbox {
  constructor() {
    this.lb = $('#lb');
    this.lbImg = $('#lbImg');
    this.lbCap = $('#lbCap');
    this.btnClose = $('#lbClose');
    this.btnPrev = $('#lbPrev');
    this.btnNext = $('#lbNext');

    this.currentIndex = 0;
    this.openerElement = null;
    this.shots = [];
    this.seenMap = new Map();

    this.init();
  }

  init() {
    if (!this.lb) return;
    this.indexShots();
    this.bindEvents();
  }

  indexShots() {
    const hits = $$('.frame__hit');
    hits.forEach((hit) => {
      const src = hit.dataset.src;
      if (!src) return;

      if (!this.seenMap.has(src)) {
        const index = this.shots.length;
        this.seenMap.set(src, index);
        const img = $('img', hit);
        this.shots.push({
          src,
          cap: hit.dataset.cap || '',
          alt: img?.alt || '',
        });
      }

      hit.addEventListener('click', () => {
        const index = this.seenMap.get(src) ?? 0;
        this.open(index, hit);
      });
    });
  }

  show(index) {
    if (!this.shots.length) return;
    this.currentIndex = (index + this.shots.length) % this.shots.length;
    const shot = this.shots[this.currentIndex];

    if (this.lbImg) {
      this.lbImg.src = shot.src;
      this.lbImg.alt = shot.alt;
    }

    if (this.lbCap) {
      this.lbCap.innerHTML = `${shot.cap} &nbsp;&middot;&nbsp; ${this.currentIndex + 1} / ${this.shots.length}`;
    }
  }

  open(index, triggerElement = null) {
    this.openerElement = triggerElement;
    this.show(index);
    this.lb.classList.add('is-on');
    lockScroll();

    if (this.btnClose) {
      this.btnClose.focus();
    }
  }

  close() {
    this.lb.classList.remove('is-on');
    unlockScroll();

    if (this.openerElement) {
      this.openerElement.focus();
    }
  }

  prev() {
    this.show(this.currentIndex - 1);
  }

  next() {
    this.show(this.currentIndex + 1);
  }

  bindEvents() {
    if (this.btnClose) this.btnClose.addEventListener('click', () => this.close());
    if (this.btnPrev) this.btnPrev.addEventListener('click', () => this.prev());
    if (this.btnNext) this.btnNext.addEventListener('click', () => this.next());

    this.lb.addEventListener('click', (e) => {
      if (e.target === this.lb) this.close();
    });

    document.addEventListener('keydown', (e) => {
      if (!this.lb.classList.contains('is-on')) return;

      switch (e.key) {
        case 'Escape':
          this.close();
          break;
        case 'ArrowLeft':
          this.prev();
          break;
        case 'ArrowRight':
          this.next();
          break;
      }
    });
  }
}
