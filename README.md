# Portfolio Serah Aouate — Architecture Frontend Senior

Portfolio photographique moderne, sobre et performant, architecturé selon les standards industriels d'un développeur frontend senior.

---

## 🏛️ Architecture du Projet

```text
Portfolio/
├── img/                        # Assets photographiques & médias optimisés (WebP)
│   └── web/                    # Formats responsives (@800, HD)
├── src/
│   ├── styles/                 # Architecture CSS Modulaire (ITCSS / Tokens)
│   │   ├── tokens.css          # Design Tokens (Couleurs, typographie, courbes de transition, z-index)
│   │   ├── reset.css           # Modern CSS Reset & normalisation
│   │   ├── base.css            # Primitives de base (.dsp, .meta, .arrow-link)
│   │   ├── layout.css          # Structure globale (.wrap, .nav, footer)
│   │   ├── animations.css      # Animations de reveal & support prefers-reduced-motion
│   │   ├── components/         # Styles isolés par composant
│   │   │   ├── hero.css        # Animation du médaillon scrollable
│   │   │   ├── series.css      # Disposition éditoriale des séries
│   │   │   ├── gallery.css     # Grille masonry & filtres interactifs
│   │   │   ├── propos.css      # Section À propos & spécifications
│   │   │   ├── contact.css     # Section de contact & liens
│   │   │   ├── lightbox.css    # Modale visionneuse photo
│   │   │   └── menu.css        # Menu mobile plein écran
│   │   └── main.css            # Point d'entrée CSS
│   │
│   ├── scripts/                # Architecture JavaScript Modulaire (ESM)
│   │   ├── utils/              # Fonctions transverses pures
│   │   │   ├── dom.js          # Sélecteurs ($, $$), interpolation (clamp, span), debounce
│   │   │   └── a11y.js         # Gestionnaires d'accessibilité (scroll lock, reduced motion)
│   │   ├── modules/            # Classes & contrôleurs d'interface
│   │   │   ├── hero-scroll.js  # Calcul du morphing médaillon via requestAnimationFrame
│   │   │   ├── mobile-menu.js  # Menu mobile accessible avec piège à focus & Escape key
│   │   │   ├── scroll-reveal.js# Révélation au défilement via IntersectionObserver
│   │   │   ├── filter.js       # Système de filtrage avec gestion ARIA & compteurs
│   │   │   └── lightbox.js     # Visionneuse accessible (navigation clavier, déduplication)
│   │   └── main.js             # Bootstrap & initialisation de l'application
│   │
├── index.html                  # HTML5 sémantique, SEO & OpenGraph
├── serah-strategie.html        # Note de cadrage stratégique
├── vite.config.js              # Configuration du bundler & dev server Vite
├── package.json                # Gestion des dépendances et scripts npm
└── README.md                   # Documentation technique
```

---

## 🚀 Démarrage Rapide

### Prérequis
- [Node.js](https://nodejs.org/) (v18+ ou supérieur)
- npm

### Installation
```bash
npm install
```

### Développement local (Hot Module Reload)
```bash
npm run dev
```
Le serveur local démarre instantanément sur `http://localhost:5173`.

### Construction pour la production (Bundle optimisé)
```bash
npm run build
```
Les fichiers minifiés et optimisés pour la production sont générés dans le dossier `dist/`.

### Prévisualisation du build de production
```bash
npm run preview
```

---

## ♿ Accessibilité (A11y) & Performances

- **Prefers-Reduced-Motion** : Désactive automatiquement les animations lourdes (zoom médaillon, transitions) pour les utilisateurs sensibles.
- **WAI-ARIA** : Prise en charge des attributs `aria-expanded`, `aria-pressed`, `aria-modal`, `role="dialog"`, `role="status"`.
- **Navigation Clavier** : Support complet des touches `Escape`, `Flèche Gauche`, `Flèche Droite` dans la lightbox et le menu.
- **Performances d'affichage** : `fetchpriority="high"` sur le LCP, `loading="lazy"` et `decoding="async"` sur les galeries, formats WebP avec `srcset` responsive.
