# Shree Earthtech LLP — Corporate Website

Immersive 3D corporate site for Shree Earthtech LLP, manufacturer of Activated Bleaching Earth.

**Stack:** React 19 · Vite · TypeScript · Tailwind CSS 4 · three.js via @react-three/fiber + drei · GSAP ScrollTrigger · Lenis

## Setup

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # type-check + production build to dist/
npm run preview   # serve the production build
```

Requires Node 20+.

## Where to edit things

| What | Where |
|---|---|
| All copy, specs, contact details, grade-finder rules | `src/content.ts` |
| Palette (CSS variables → Tailwind tokens) | `:root` and `@theme` at the top of `src/index.css` |
| Page sections (one component each) | `src/sections/` |
| 3D scenes (lazy-loaded) | `src/scenes/` |
| Routes: `/`, `/products`, `/contact` | `src/App.tsx`, `src/pages/` |

## Placeholders to replace

- **Hero artwork** — the hero is a procedurally drawn SVG panorama (`src/sections/hero/PlantLayers.tsx`).
  Drop `layer-0-sky.webp`, `layer-1-hills.webp`, `layer-2-plant.webp`, `layer-3-foreground.webp` into
  `public/hero/` and the hero switches to them automatically (prompt for generating them is in
  `Shree_Earthtech_Website_Prompt.md`, appendix).
- **Certificate images** — the lightbox in `src/sections/Certifications.tsx` renders a placeholder certificate; add images to `public/certificates/` and swap them in.
- **RFQ form & catalogue gate** — both simulate success with a toast. Wire them to your backend / form service where marked `PLACEHOLDER` in `src/sections/Contact.tsx`.
- **TDS download** — generated client-side from `content.ts` (`src/lib/tds.ts`). Replace with real PDFs if preferred.
- **Company details, counters, social links** — dummy values in `src/content.ts`.

## Logo assets

`public/logo.png` is the original. `public/logo-transparent.png` (light backgrounds) and
`public/logo-icon.png` (monogram; used with a white/gold wordmark on dark backgrounds) were derived from it.

## Performance & accessibility notes

- three.js/R3F loads only when the first 3D scene is needed; every scene mounts only near the viewport and caps DPR on low-end devices.
- Mobile: no hero parallax/blur, lighter pin (120vh, max scale 1.6), no pinned process timeline, touch-friendly 3D (no drag capture).
- `prefers-reduced-motion`: no loader, no smooth scroll, no pinning; static panorama.
- Semantic landmarks, skip link, labelled controls, keyboard-operable before/after slider and lightbox (Esc to close).

## Preview on GitHub Pages

`.github/workflows/deploy-pages.yml` builds and publishes the site on every push to `main`.
One-time setup: repo **Settings → Pages → Build and deployment → Source: GitHub Actions**.
The site is then served at `https://vt765.github.io/ShreeEarthtechLLP_3D/`.

## Deploy to Vercel

1. Push this folder to a GitHub repository.
2. In Vercel → **Add New Project** → import the repo.
3. Framework preset: **Vite** (build command `npm run build`, output directory `dist`).
4. Deploy. `vercel.json` already rewrites all routes to `index.html` so `/products` and `/contact` work on refresh.

Or from the CLI: `npm i -g vercel && vercel --prod`.
