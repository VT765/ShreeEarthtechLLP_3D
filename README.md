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

## Home-page flow

Navbar → pinned wireframe hero (slide 1: tagline + CTAs, slide 2: About) → Global Reach globe →
Product Gallery → Grade Finder → Manufacturing Plant gallery → Footer (enquiry form, contact, map, certifications).
`/products` and `/contact` redirect to the matching home-page sections.

## Where to edit things

| What | Where |
|---|---|
| Company details, about text, brochure path, certifications | `src/data/company.ts` |
| Product grades, key specs, full spec table, TDS paths, product images | `src/data/products.ts` |
| Oil → grade recommendations (Grade Finder) | `src/data/gradeFinder.ts` |
| Export countries (globe) | `src/data/exportCountries.ts` |
| Plant gallery images and captions | `src/data/plantGallery.ts` |
| Hero slides | `src/data/hero.ts` |
| Section headings and intro copy | `src/data/sections.ts` |
| Navbar links and section ids | `src/data/nav.ts` |
| Palette (CSS variables → Tailwind tokens) | `:root` and `@theme` at the top of `src/index.css` |
| Sections | `src/sections/` (hero in `src/sections/hero/`), footer in `src/components/Footer.tsx` |
| 3D scenes (lazy-loaded) | `src/scenes/` |

## Placeholders to replace

All file paths go through `asset()` (`src/lib/asset.ts`) so they work under the GitHub Pages sub-path.

- **Product photos** — `public/placeholders/products/*.svg` (paths in `data/products.ts`).
- **Plant photos** — `public/placeholders/plant/*.svg` (paths in `data/plantGallery.ts`; 3:2, 1200×800 recommended).
- **TDS PDFs** — `public/tds/*.pdf`; **brochure** — `public/brochure.pdf`.
- **Export countries** — `data/exportCountries.ts` (also review the region wording in `data/sections.ts`).
- **Grade Finder mapping** — `data/gradeFinder.ts` (marked TODO; confirm with the technical team).
- **Contact details, social links** — dummy values in `data/company.ts`.
- **Certification marks** — drawn seals in `components/Footer.tsx`; swap for real certificate logos.

## Enquiry form

GitHub Pages has no backend, so the form POSTs JSON to a hosted form service set by `VITE_FORM_ENDPOINT`
(Formspree or Web3Forms; Web3Forms also needs `VITE_FORM_ACCESS_KEY`). See `.env.example`. For the Pages build,
add them as repository **Variables** (Settings → Secrets and variables → Actions → Variables); the workflow passes
them to `vite build`. Without an endpoint the form opens a pre-filled `mailto:` to the sales inbox.

## Logo assets

`public/logo.png` is the original. `public/logo-transparent.png` (light backgrounds) and
`public/logo-icon.png` (monogram; used with a white/gold wordmark on dark backgrounds) were derived from it.

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
