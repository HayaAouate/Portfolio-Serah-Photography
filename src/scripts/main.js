/**
 * Application Bootstrap & Main Entry Point
 * Initialise l'ensemble des modules d'interface de manière modulaire
 */

import { HeroScroll } from './modules/hero-scroll.js';
import { MobileMenu } from './modules/mobile-menu.js';
import { ScrollReveal } from './modules/scroll-reveal.js';
import { PortfolioFilter } from './modules/filter.js';
import { Lightbox } from './modules/lightbox.js';
import { ContactForm } from './modules/contact-form.js';

class App {
  static init() {
    // Initialisation des modules UI
    const hero = new HeroScroll();
    const menu = new MobileMenu();
    const reveal = new ScrollReveal('.rv');
    const filter = new PortfolioFilter();
    const lightbox = new Lightbox();
    const contact = new ContactForm();

    // Export facultatif pour debug ou tests
    if (import.meta.env?.DEV) {
      window.__app = { hero, menu, reveal, filter, lightbox, contact };
    }
  }
}

// Démarrage dès que le DOM est prêt
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', App.init);
} else {
  App.init();
}
