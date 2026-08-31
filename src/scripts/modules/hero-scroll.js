/**
 * Hero Scroll Animation Module
 * Controls the smooth zooming & morphing of the medallion on scroll
 */

import { $, clamp, span } from '../utils/dom.js';
import { prefersReducedMotion } from '../utils/a11y.js';

export class HeroScroll {
  constructor() {
    this.hero = $('.hero');
    this.med = $('#medallion');
    this.act1 = $('#act1');
    this.act2 = $('#act2');
    this.scrim = $('#scrim');
    this.aside = $('.hero__aside');
    this.year = $('.hero__year');

    this.medImg = this.med ? this.med.querySelector('img') : null;
    this.target = 3.4;
    this.ticking = false;

    this.init();
  }

  init() {
    if (prefersReducedMotion() || !this.hero || !this.med) {
      if (this.act2) {
        this.act2.style.opacity = '1';
        this.act2.style.pointerEvents = 'auto';
      }
      return;
    }

    this.measure();
    this.render();
    this.bindEvents();
  }

  /** Largeur/hauteur de mise en page du viewport, hors barre de defilement. */
  static viewport() {
    return {
      w: document.documentElement.clientWidth,
      h: document.documentElement.clientHeight,
    };
  }

  measure() {
    if (!this.med) return;

    // offsetWidth/Height : taille de mise en page, NON affectee par le transform
    // en cours. getBoundingClientRect renverrait la taille deja zoomee et
    // fausserait la cible a chaque resize pendant le scroll.
    const w = this.med.offsetWidth;
    const h = this.med.offsetHeight;
    if (!w || !h) return;

    const vp = HeroScroll.viewport();
    let target = Math.max(vp.w / w, vp.h / h) * 1.04;

    // Bridage : ne jamais agrandir la photo au-dela de ses pixels reels.
    // Le medaillon est carre et en object-fit:cover, donc le nombre de pixels
    // source disponibles sur sa largeur est le petit cote de l'image.
    // DPR plafonne a 2 : au-dela, personne ne compte les pixels d'un hero.
    //   sources basse def  -> le zoom s'arrete en grande plaque centree
    //   sources haute def  -> maxScale depasse la couverture, plein ecran
    const srcPx = this.medImg
      ? Math.min(this.medImg.naturalWidth, this.medImg.naturalHeight)
      : 0;
    if (srcPx > 0) {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      target = Math.min(target, Math.max(srcPx / (w * dpr), 1.05));
    }

    this.target = target;
  }

  render() {
    this.ticking = false;
    if (!this.hero || !this.med) return;

    const vp = HeroScroll.viewport();
    const range = this.hero.offsetHeight - vp.h;
    if (range <= 0) return;

    const p = clamp((window.scrollY - this.hero.offsetTop) / range, 0, 1);

    // Medallion Scale & Border Radius
    const scale = 1 + (this.target - 1) * span(p, 0, 0.82);
    const radius = 50 - 50 * span(p, 0.05, 0.72);
    this.med.style.transform = `scale(${scale.toFixed(4)})`;
    this.med.style.borderRadius = `${radius.toFixed(2)}%`;

    // Act 1 Title Fade & Translation
    const o1 = 1 - span(p, 0, 0.34);
    if (this.act1) {
      this.act1.style.opacity = String(o1);
      this.act1.style.transform = `translateY(${(-40 * span(p, 0, 0.34)).toFixed(1)}px)`;
    }

    // Scrim overlay
    if (this.scrim) {
      this.scrim.style.opacity = String(span(p, 0.3, 0.72));
    }

    // Act 2 Content Reveal
    const o2 = span(p, 0.58, 0.9);
    if (this.act2) {
      this.act2.style.opacity = String(o2);
      this.act2.style.transform = `translateY(${(26 * (1 - o2)).toFixed(1)}px)`;
      this.act2.style.pointerEvents = o2 > 0.6 ? 'auto' : 'none';

      // Le texte du 2e temps est clair : il doit rester sur la photo. Si le
      // zoom est bride, la plaque ne couvre pas tout l'ecran - on cale donc le
      // bloc sur son emprise reelle plutot que sur le viewport.
      const side = this.med.offsetWidth * scale;
      this.act2.style.left = `${Math.max(0, (vp.w - side) / 2)}px`;
      this.act2.style.right = 'auto';
      this.act2.style.width = `${Math.min(side, vp.w)}px`;
      this.act2.style.bottom = `${Math.max(0, (vp.h - side) / 2)}px`;
    }

    // Aside scroll indicator & year stamp
    if (this.aside) {
      this.aside.style.opacity = String(1 - span(p, 0, 0.26));
    }
    if (this.year) {
      this.year.style.opacity = String((1 - span(p, 0, 0.26)) * 0.5);
    }
  }

  onScroll = () => {
    if (!this.ticking) {
      this.ticking = true;
      requestAnimationFrame(() => this.render());
    }
  };

  onResize = () => {
    this.measure();
    this.render();
  };

  bindEvents() {
    window.addEventListener('scroll', this.onScroll, { passive: true });
    window.addEventListener('resize', this.onResize, { passive: true });
    window.addEventListener('load', this.onResize, { passive: true });

    // naturalWidth n'existe qu'une fois la photo decodee, et le srcset peut
    // changer de fichier au resize : on recalcule le bridage a chaque charge.
    if (this.medImg) {
      this.medImg.addEventListener('load', this.onResize);
      if (this.medImg.complete && this.medImg.naturalWidth) this.onResize();
    }
  }
}
