# Atelier · Responsive Frontend Interface

**Full Stack Development · Project 1 · Industrial Training Kit (Batch 2026, DecodeLabs)**

A mobile-first, accessible, framework-free responsive interface built with **HTML5, CSS3 and vanilla JavaScript**. It is the "interface phase" of the Full Stack track: before any backend, master flexible frontends that work on every device.

## Features

- **Semantic HTML5** landmarks: `header`, `nav`, `main`, `section`, `article`, `aside`, `footer`, plus a skip link
- **CSS Grid** for macro page layouts, **Flexbox** for micro components (nav, chips, footer)
- **Container Queries** on library cards
- **Mobile-first** single column, expanding with `min-width` queries at **768px** (tablet) and **1024px** (desktop)
- **Fluid typography** with `clamp()`
- **2025 warm palette**: Mocha Mousse `#A58B6F`, Ethereal Blue `#A0D4E0`, Moonlit Grey `#F2F0EA`
- **Typography**: Montserrat (headlines) + Open Sans (body), 2 families, 3 weights (400/600/700), with system-font fallbacks
- **Vanilla JS state management**: responsive menu, light/dark theme (remembers system preference), searchable and filterable content library with saved items in `localStorage`, accessible form validation
- **Accessibility (WCAG)**: visible focus, 44px touch targets, ARIA states and live regions, `prefers-reduced-motion`, text contrast checked in both themes
- **No frameworks, no build step, no dependencies**

## Project structure

```
responsive-frontend-interface/
├── index.html
├── css/
│   └── styles.css
├── js/
│   └── main.js
├── .github/workflows/pages.yml   # optional auto-deploy to GitHub Pages
├── .gitignore
├── LICENSE
└── README.md
```

## Run locally

No installation needed. Open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Deploy to GitHub Pages

1. Push this repo to GitHub.
2. Go to **Settings → Pages**, set **Source** to **GitHub Actions** (the included workflow deploys on every push to `main`), or choose **Deploy from a branch → main → / (root)**.
3. Your site will be live at `https://<your-username>.github.io/<repo-name>/`.

## Execution roadmap followed

1. **Discovery**: define the "How Might We"
2. **Wireframe**: grayscale, mobile-first
3. **Semantics**: HTML landmarks
4. **Style**: CSS Grid/Flex and the 2025 palette
5. **Logic**: state and interactivity
6. **Audit**: LCP/CLS and accessibility

## Testing checklist

- [ ] Resize from 320px to 1440px: no horizontal scroll
- [ ] Navigate with the keyboard only (Tab, Enter, Esc closes the mobile menu)
- [ ] Toggle dark mode and reload (preference persists)
- [ ] Save items, reload, use "Saved only"
- [ ] Submit the form empty and with valid data
- [ ] Run Lighthouse (Performance, Accessibility, Best Practices, SEO)

## License

MIT, see [LICENSE](LICENSE).
