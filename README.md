# Shree Earthtech LLP — Corporate Website

Immersive 3D corporate site for Shree Earthtech LLP, manufacturer of Activated Bleaching Earth.

**Stack:** React 19 · Vite · TypeScript · Tailwind CSS 4 · three.js via @react-three/fiber + drei · GSAP ScrollTrigger · Lenis

## Setup

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # type-check + production build to dist/
npm run preview   # serve the production build
npm run lint      # ESLint (typescript-eslint, react-hooks, react-refresh)
```

Requires Node 20+.

## Pages

| Route | Content |
|---|---|
| `/` | Hero (dotted crystals assemble into a miniature plant; slide 2 = About summary), Global Reach summary, product summary, applications teaser, Certification block, Plant Photo Gallery |
| `/about/company-profile` | Company profile, product list, Global Reach with the full market list |
| `/about/vision-mission` | Vision (`#vision`) and Mission (`#mission`) — placeholders until supplied |
| `/products` | Full gallery: 3D bags, key specs, TDS downloads, spec comparison table |
| `/products/:slug` | One page per grade (`crystal-brite`, `hyper-clean`, `pure-choice`) |
| `/applications` | Interactive Grade Finder |
| `/contact` | Contact details, map and enquiry form (`?grade=crystal` pre-selects a product) |

The navbar's **About** and **Products** items are disclosure dropdowns (hover, click/tap, keyboard; Esc / outside
click close). Pages are lazy-loaded; `vercel.json` and the Pages `404.html` copy serve them on direct visits.

## Where to edit things

| What | Where |
|---|---|
| Company details, about text, brochure path, certifications (+ certificate images) | `src/data/company.ts` |
| Company Profile / Vision & Mission copy | `src/data/about.ts` |
| Product grades, slugs, key specs, full spec table, TDS paths, product images | `src/data/products.ts` |
| Oil → grade recommendations (Grade Finder) | `src/data/gradeFinder.ts` |
| Export countries (globe) | `src/data/exportCountries.ts` |
| Plant gallery images and captions | `src/data/plantGallery.ts` |
| Hero slides | `src/data/hero.ts` |
| Section headings and summary copy | `src/data/sections.ts` |
| Routes | `src/data/routes.ts` (+ `<Routes>` in `src/App.tsx`) |
| Navbar items and dropdowns, home section ids | `src/data/nav.ts` |
| Palette (CSS variables → Tailwind tokens) | `:root` and `@theme` at the top of `src/index.css` |
| Logo colours | `scripts/recolor-logo.py` (re-run after changing the target hues) |
| Sections / pages | `src/sections/`, `src/pages/`; hero in `src/sections/hero/` + `src/scenes/hero/` |

## Colour palette

| Token | Hex | Used for |
|---|---|---|
| `cream` | `#FAF6EE` | Page background, dropdown panels, cards on beige |
| `beige` | `#EFE4D2` | Alternate sections, badges, image stages |
| `clay` | `#DCCBAE` | Borders and dividers |
| `ink` | `#211A15` | Headings |
| `body` | `#4A3F36` | Body text |
| `stone` | `#6B5E50` | Captions, muted text |
| `brown` / `brown-deep` | `#6B4A32` / `#47301F` | Pure Choice accent, earthy accents |
| `charcoal` / `charcoal-2` / `coal` | `#1B1714` / `#2B241E` / `#0E0C0A` | Hero, navbar, page headers / dark cards / footer base |
| `orange` / `orange-light` / `orange-deep` | `#D2691E` / `#F2A25C` / `#A14A0F` | CTAs, eyebrow rules, icons / accents on dark / orange text on light |
| `sky` / `sky-deep` / `sky-light` / `sky-tint` | `#2C6A99` / `#22547A` / `#8CC3E8` / `#E5EFF6` | Links, primary buttons, focus / hover, table headers / wireframe dots on dark / zebra rows |

Every text/background pair used meets WCAG AA (body on cream 9.5:1, stone on beige 5.0:1, orange-deep on cream
5.6:1, white on sky 5.8:1, charcoal on orange 4.9:1, orange-light on charcoal 8.6:1).

## Placeholders to replace

All file paths go through `asset()` (`src/lib/asset.ts`) so they work under the GitHub Pages sub-path.

- **Certificates** — every entry in `certifications` (`data/company.ts`) points at the dummy
  `public/certificates/placeholder-certificate.svg`. Add the real scan (e.g. `public/certificates/iso9001.jpg`) and
  set that entry's `image`. Also confirm the certification list itself.
- **Vision & Mission statements** — `data/about.ts` (marked PLACEHOLDER).
- **Product images** — `public/products/*.webp` are renders of the 3D pouch (`scripts/render-pouches.sh`); pouch print colours live in `data/products.ts` (`pack`).
- **Plant photos** — `public/placeholders/plant/*.svg` (paths in `data/plantGallery.ts`; 3:2, 1200×800 recommended).
- **TDS PDFs** — `public/tds/*.pdf`; **brochure** — `public/brochure.pdf`.
- **Export countries** — `data/exportCountries.ts` (also review the region wording in `data/sections.ts`).
- **Grade Finder mapping** — `data/gradeFinder.ts` (marked TODO; confirm with the technical team).
- **Contact details, social links** — dummy values in `data/company.ts`.
- **Certification marks** — drawn seals in `components/CertSeal.tsx`; swap for the certifying bodies' logos.

## Enquiry form

GitHub Pages has no backend, so the form POSTs JSON to a hosted form service set by `VITE_FORM_ENDPOINT`
(Formspree or Web3Forms; Web3Forms also needs `VITE_FORM_ACCESS_KEY`). See `.env.example`. For the Pages build,
add them as repository **Variables** (Settings → Secrets and variables → Actions → Variables); the workflow passes
them to `vite build`. Without an endpoint the form opens a pre-filled `mailto:` to the sales inbox.

## Logo assets

`public/logo.png` is the original artwork. `public/logo-transparent.png` (light backgrounds) and `public/logo-icon.png`
(monogram; used with a white/orange wordmark on dark backgrounds) are recoloured copies (blue → sky industrial blue,
gold → orange) generated by `scripts/recolor-logo.py` from the originals in `scripts/logo-src/`. The design is unchanged.

## SEO & social sharing

- `VITE_SITE_URL` (default in `.env`: `https://www.shreeearthtech.com`, no trailing slash) builds the absolute
  canonical, Open Graph, Twitter and JSON-LD URLs in `index.html`. The GitHub Pages workflow overrides it with the Pages URL.
- `public/og-image.png` (1200×630) is the share image. Regenerate it with `scripts/og-image.sh` after editing
  `scripts/og-image.html` (uses headless Google Chrome, no project dependencies).
- `public/robots.txt` and `public/sitemap.xml` list the production domain; update them if the domain changes.

## Linting

`eslint.config.js` (flat config). typescript-eslint does not support TypeScript 7 yet, so the ESLint plugins are
installed in the `tools/eslint` npm workspace with their own TypeScript 6.0; the app itself still type-checks with
TS 7. `npm install` sets this up automatically. A few React Compiler rules are set to `warn` until the code is refactored.

## Performance & accessibility notes

- Eager JS is split into long-lived `react` (React, React DOM, router) and `motion` (GSAP, Lenis) vendor chunks plus
  the app chunk (`build.rolldownOptions.output.codeSplitting` in `vite.config.ts`).
- Hero text renders before any 3D: three.js/R3F load after page load (desktop: when idle; touch/small screens: on
  first interaction or after 4 s). The three product bags share one WebGL canvas; the globe (`cobe`) is its own small chunk.
- Fonts load without blocking first paint. Lighthouse mobile (local preview): performance 81–91, accessibility 100.
- Mobile low-power, `prefers-reduced-motion` or no WebGL: static SVG hero with stacked slides, static globe/grid fallbacks.
- Semantic landmarks, skip link, one h1, labelled form controls with inline validation, keyboard-operable grade finder.

## Preview on GitHub Pages

`.github/workflows/deploy-pages.yml` builds and publishes the site on every push to `main`.
One-time setup: repo **Settings → Pages → Build and deployment → Source: GitHub Actions**.
The site is then served at `https://vt765.github.io/ShreeEarthtechLLP_3D/`.

## Deploy to Vercel

1. Push this folder to a GitHub repository.
2. In Vercel → **Add New Project** → import the repo.
3. Framework preset: **Vite** (build command `npm run build`, output directory `dist`).
4. Deploy. `vercel.json` already rewrites all routes to `index.html` (the old `/products` and `/contact` URLs redirect to home-page sections).

Or from the CLI: `npm i -g vercel && vercel --prod`.
