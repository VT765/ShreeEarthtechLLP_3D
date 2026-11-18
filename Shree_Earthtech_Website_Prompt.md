# Shree Earthtech LLP — 3D Corporate Website Prompt

> **Attached:** `logo` (official Shree Earthtech LLP logo — "SE" monogram in blue + ochre gold with wordmark). Use it as the brand anchor for the whole design.

Build a premium, professional, immersive 3D corporate website for **"Shree Earthtech LLP"**, an Indian manufacturer of high-efficiency Activated Bleaching Earth used to purify edible, industrial and waste oils.

---

## 1. TECH STACK & QUALITY BAR
- React + Vite + TypeScript, Tailwind CSS
- Three.js via @react-three/fiber + @react-three/drei for 3D
- GSAP + ScrollTrigger for scroll animation, Lenis for smooth scroll
- Fully responsive (desktop, tablet, mobile). Lighter 3D on mobile / low-end devices.
- Lazy-load 3D scenes with Suspense loaders. Lighthouse performance ≥ 85, accessibility ≥ 95.
- SEO meta tags, Open Graph, semantic HTML, WCAG AA contrast, prefers-reduced-motion support.
- Must look like a global B2B industrial leader (BASF, Clariant, Evonik level) — not a generic startup template.

---

## 2. BRAND IDENTITY & UI SYSTEM

### Logo (attached)
- Save the attached logo as `/public/logo.png` (and `/public/logo.svg` if vectorised).
- Logo colors are the **anchor**, not a hard limit: Brand Blue `#0C71C7`, Brand Gold (ochre) `#BF8311`, bevel shadow `#0C5A9E`, highlight `#4E91CC`. Never recolor the logo itself.
- Light backgrounds → original logo.
- Dark backgrounds (hero, footer) → generate a reversed version: icon in original colors, "Shree" in white, "EarthTech LLP" in light gold `#E0B04A`.
- Clear space = height of the "S" curve on all sides. Min width 120px.

### Design direction — "Earth meets Precision"
The UI should feel like it grew out of the logo: the **blue** stands for science, trust and clean oil; the **ochre gold** stands for bentonite clay, earth and premium quality. You are free to extend the palette with complementary colors that suit the logo and the industry — warm earthy neutrals instead of cold greys, a deep navy for dark sections, and a restrained fresh accent for sustainability — as long as the result stays cohesive, premium and clearly "on-brand".

### Suggested palette (adjust freely if a better harmony works)
**Brand core**
- Brand Blue `#0C71C7` — primary buttons, links, active states
- Blue Deep `#0C5A9E` — hover, table headers, headings
- Brand Gold `#BF8311` — accents, icons, dividers, large headings
- Gold Light `#E0B04A` — gold text/highlights on dark backgrounds
- Gold Dark `#8F620C` — small gold text on light backgrounds

**Dark surfaces**
- Midnight Navy `#071F3A` — hero and dark sections
- Navy `#0A3A68` — dark cards, gradients
- Deep Ink `#050F1E` — footer base

**Warm earthy neutrals (complements the ochre gold)**
- Ivory `#FAF7F2` — main page background
- Sand `#F1E9DC` — alternate section background
- Clay Beige `#E6D8C0` — borders, textures, illustration clay
- Warm Stone `#8A7F72` — muted captions
- Ink `#1A1D24` — headings · Slate `#4F5562` — body text

**Supporting accents (use sparingly)**
- Eco Teal `#1E8C7E` — sustainability section, success states
- Sky Tint `#EAF3FC` — table zebra rows, info callouts
- Warning `#E0A100` · Error `#D64545`

**Gradients**
- Brand: `linear-gradient(135deg, #0C5A9E 0%, #0C71C7 55%, #BF8311 140%)`
- Dark hero: `radial-gradient(circle at 70% 30%, #0A3A68 0%, #071F3A 60%, #050F1E 100%)`
- Oil purification: `#5A3A0C → #8F620C → #BF8311 → #E0B04A → #FFF3C4`
- Gold CTA: `linear-gradient(180deg, #E0B04A 0%, #BF8311 100%)` with `#071F3A` text

**Rules**
- ~60% neutrals (ivory/sand or navy), ~30% blue, ~10% gold.
- Gold is for emphasis only — never large flat backgrounds.
- On light bg, gold text only at ≥ 18px bold; otherwise use Gold Dark.
- All text/background pairs must pass WCAG AA.

### Typography
- Headings: "Plus Jakarta Sans" 700/800, letter-spacing -0.02em (rounded geometry echoes the logo's curves)
- Body: "Inter" 400/500, 16–18px, line-height 1.6
- Specs/data: "JetBrains Mono"
- Scale: H1 56–72 · H2 40 · H3 28 · H4 20 · Body 16 · Caption 13
- Section eyebrows: uppercase, 12px, letter-spacing 0.15em, Brand Gold

### Layout
- 12-col grid, max-width 1280px, 8px spacing system
- Section padding 120px desktop / 72px mobile
- Alternate sections Ivory → Sand → Midnight Navy for rhythm
- Subtle bentonite/clay grain texture at 4–6% opacity on light sections
- Reuse the logo's sweeping "S" curve as a decorative motif: curved section dividers, card corner accents, a large faint watermark in dark sections

### Components
- **Buttons:** Primary = Brand Blue, white text, 10px radius, soft gold glow on hover. Secondary = 1.5px blue outline. On dark: Gold CTA gradient with navy text.
- **Cards:** white, 16px radius, 1px `#E6D8C0` border, shadow `0 10px 30px rgba(7,31,58,0.08)`, lift 4px + blue border on hover. Dark cards: Navy with 3px gold top border.
- **Spec tables:** Blue Deep header with white uppercase text, first column Midnight Navy with white text, zebra rows Sky Tint, values in mono font, rounded 16px container.
- **Badges:** Sand background + Gold Dark text.
- **Icons:** Lucide, 1.75px stroke — blue on light, gold on dark.
- **Navbar:** transparent over hero → ivory with blur + shadow on scroll. Logo left, links center, Gold CTA "Get Quote" right.
- **Forms:** 48px inputs, 10px radius, blue focus ring `rgba(12,113,199,0.25)`, inline validation.

### 3D & Motion
- 3D materials: Brand Blue glossy metal (metalness 0.6, roughness 0.25) + Brand Gold brushed metal (metalness 0.8, roughness 0.35) — matching the logo's bevel.
- Lighting: cool blue rim light + warm gold key light.
- Motion: smooth, restrained, corporate — 400–700ms ease-out, no bouncy effects.

---

## 3. HERO — ZOOM-ON-SCROLL INDUSTRIAL PANORAMA

**Background:** a wide isometric flat-vector illustration of the Shree Earthtech plant (bentonite quarry → conveyor → activation tanks → rotary dryer → silos → packaging → trucks) in the brand palette: navy sky, blue steel structures, ochre-gold railings and machinery, ivory tanks, sandy-beige clay piles, slate-teal trees. Top 40% is empty navy sky for text.

Assets in `/public/hero/` as layered WebP:
`layer-0-sky.webp`, `layer-1-hills.webp`, `layer-2-plant.webp`, `layer-3-foreground.webp` (fallback: single `hero-plant.webp`). Use a placeholder until real assets are supplied.

**Initial state (scroll = 0)**
- Eyebrow: ACTIVATED BLEACHING EARTH MANUFACTURER
- H1: "Purity, Engineered from the Earth."
- Subhead: "High-efficiency Activated Bleaching Earth from premium Bhavnagar & Kutch bentonite — for cleaner, brighter, safer oils."
- CTAs: [Explore Products] [Request a Quote]
- Small 3D metallic "SE" logo floating top-right, slow rotation.
- Ambient life: drifting clay-dust particles, soft chimney smoke, moving conveyor texture, tiny blinking gold catwalk lights.
- Mouse parallax: layers move 2–12px at different depths.

**Scroll behavior** (GSAP ScrollTrigger, pinned ~200vh, scrub: 1)
- 0–30%: headline and CTAs fade out and rise 60px.
- 0–100%: camera zooms into the plant — sky 1→1.15, hills 1→1.4, plant 1→2.4, foreground 1→3.2. Transform-origin on the rotary dryer / activation tanks (~62% x, 68% y). Foreground blurs 0→6px and fades.
- 60–100%: navy vignette closes in; hotspot labels pop in: "Bentonite Quarry", "Acid Activation", "Rotary Dryer", "Silos & Packaging".
- 100%: crossfade into Section 4.3 (Manufacturing Process) — the zoom reads as "entering the plant".

**Technical:** animate only transform/opacity, `will-change: transform`, responsive srcset (1280/1920/2560/3840), WebP/AVIF, preload hero. Mobile: 120vh pin, max scale 1.6, no blur, no parallax. Reduced motion: static panorama, no pin.

**Trust strip** below the fold: ISO 9001:2015 · ISO 14001:2015 · ISO 22000:2018 · ISO 45001:2018 · Kosher · Halal

---

## 4. PAGE SECTIONS
Routes: Home (all sections), `/products`, `/contact`.

### 4.1 About
"Shree Earthtech LLP manufactures highly efficient activated bleaching earth for purifying edible, industrial and waste oils. We source high-quality bentonite (montmorillonite) from the mineral-rich reserves of Bhavnagar and Kutch, Gujarat, and turn it into a high-surface-area adsorbent through controlled acid activation — trusted by refineries for consistent, batch-to-batch performance."

Animated counters (dummy): **15+** Years Experience · **3,000 MT** Monthly Capacity · **250+** Clients · **12+** Export Countries

### 4.2 Raw Material — "From Gujarat's Earth"
3D map of Gujarat with glowing gold pins on Bhavnagar and Kutch; hover → card on bentonite quality. Beside it, an exploded 3D model of montmorillonite's layered silicate sheets explaining why the layered structure gives high adsorption.

### 4.3 Manufacturing Process — scroll-pinned timeline (same illustration style as hero)
1. **Raw Material Selection** — premium bentonite from Bhavnagar & Kutch reserves.
2. **Granulation** — lumps converted to wet granules; every batch quality-checked.
3. **Acid Activation** — ~10-hour acid treatment, then ~12-hour washing to remove impurities and heavy metals.
4. **Neutralization & Recycling** — spent acid and water neutralized with lime; water filtered and RO-treated for reuse; gypsum by-product supplied to the cement industry.
5. **Drying** — high-capacity driers bring moisture to target level.
6. **Milling & Packaging** — fine milling for controlled particle size, then packing.

Badge: "PLC-based automation with SCADA process control."

### 4.4 Products — 3D rotating packaging bags (branded with the logo)
- **Earthtech Crystal Brite** — high-activity acidic grade for tough pigments and dark oils.
- **Earthtech Hyper Clean** — balanced all-round grade for most edible and industrial oils.
- **Earthtech Pure Choice** — near-neutral grade for sensitive, premium edible oils.

Each card: 3D bag, positioning line, flip-to-reveal specs, "Download TDS" button.

**Technical specifications (render exactly):**

| Parameter | Crystal Brite | Hyper Clean | Pure Choice |
|---|---|---|---|
| Moisture Content (%) | 15 Max | 15 Max | 15 Max |
| pH (10% Suspension) | 2.5 to 3.5 | 4 to 5 | 5 to 7 |
| Particle Size Passing (90 micron) | 80 Min | 80 Min | 80 Min |
| Average Particle Size (micron) | 23 Min | 21 Min | 25 Min |
| Bleaching Efficiency % (against lab standard sample) | 95 Min | 95 Min | 95 Min |
| Acidity as H₂SO₄ % | 0.4 Max | 0.4 Max | 0.4 Max |
| Residual Acidity (mg KOH/g) | 2.5 (±1) | 2.5 (±1) | 2.5 (±1) |
| Absolute Bulk Density (g/litre) DE 6 | 650 Max | 650 Max | 750 Max |
| BET Surface Area (m²/g) | 300 Max | 300 Max | 300 Max |

Interactive **Grade Finder**: user picks oil type → recommended grade card highlights with a gold glow.

### 4.5 Properties & Advantages — 2×4 card grid, 3D icon per card
- **Acid Activation** — higher contact surface area with neutralized oil gives superior adsorption of chlorophyll, carotenes and phosphorus, so lower dosage is needed than alternatives.
- **Efficient Removal** — strong adsorption removes gums (phospholipids), free fatty acids and soap content for a cleaner, purer oil.
- **Streamlined Filtration** — balanced particle size distribution speeds filtration and shortens processing time without compromising quality.
- **Optimized Oil Retention** — controlled pore diameter, total pore volume and surface area give lower oil retention without sacrificing throughput.
- **Controlled Bulk Density** — precise measurement ensures consistent, reproducible quality.
- **Controlled Residual Acidity** — balanced acidity removes color effectively without harmful by-products.
- **3-MCPD Reduction** — helps lower 3-MCPD levels in edible oils for consumer safety.
- **Batch-Tested Quality** — every batch lab-tested before dispatch.

### 4.6 Applications — horizontal 3D carousel of oil droplets
- **Edible Oil Purification:** Soybean, Rice Bran, Palm, Castor, Mustard, Cottonseed, Sunflower, Coconut
- **Industrial Oil Refining:** Engine Oil, Mineral Oil, Diesel, Lube Oil, Paraffin Wax
- **Waste Oil Regeneration:** Used Engine Oil, Used Cooking Oil

Plus a before/after drag slider: dark crude oil vs bleached clear oil.

### 4.7 Quality Lab
Isometric illustrations: UV-Visible Spectrophotometer, Colour Measurement Instrument, Infrared Moisture Balance, HANNA pH Meter, Bulk Density Apparatus, High-Pressure Vacuum Pump, Filtration Unit, Oil Bath, Water Bath, Magnetic Stirrer. Line: "Every batch tested before dispatch."

### 4.8 Sustainability (Eco Teal accent)
Animated circular-economy loop: RO water recycling → lime neutralization → gypsum to cement industry → heavy-metal removal. Headline: "Zero-Waste by Design."

### 4.9 Certifications
3D floating badges: ISO 9001:2015, ISO 14001:2015, ISO 22000:2018, ISO 45001:2018, Kosher, Halal. Click → lightbox with certificate image (placeholder).

### 4.10 Packaging & Supply
3D models: 25 kg / 50 kg paper bags (with logo), Jumbo bags (FIBC), bulk truck delivery. "Domestic & export supply with reliable lead times."

### 4.11 Why Shree Earthtech
Eco-Friendly · Innovation-Driven · Global Reach · Customer-Centric Quality · Consistent Batch Quality · Technical Support for Refiners

### 4.12 Contact / RFQ
Form: Name, Company, Email, Phone, Country, Oil Type (dropdown), Grade Interest, Monthly Requirement (MT), Message → success toast.
Floating WhatsApp button, Google Map embed, gated "Download Catalogue" (email required).

**Dummy details:**
- Address: Plot No. 12, GIDC Industrial Estate, Bhavnagar, Gujarat 364001, India
- Phone: +91 98765 43210 / +91 91234 56789
- Email: info@shreeearthtech.com · sales@shreeearthtech.com
- Website: www.shreeearthtech.com
- Hours: Mon–Sat, 9:30 AM – 6:30 PM IST

### 4.13 Footer
Deep Ink → Midnight Navy gradient, faint large "S" curve watermark. Reversed logo + tagline, quick links, products, contact, certification badges, social icons (Instagram, LinkedIn, YouTube — "#"), "© 2026 Shree Earthtech LLP. All rights reserved."

---

## 5. INTERACTIONS
- Intro loader: clay particles assemble into the SE logo (≤ 2s, skippable).
- Side scroll-progress line filling from crude amber to clear gold.
- Hover tilt on cards, magnetic CTA buttons, subtle oil-droplet cursor on interactive elements (desktop only).
- Sticky navbar: Home, About, Process, Products, Applications, Quality, Certifications, Contact + Gold "Get Quote".

---

## 6. DELIVERABLES
- Componentized code: one component per section, 3D scenes in `/src/scenes`.
- All text, specs and contact details in `/src/content.ts` for easy editing.
- All colors as Tailwind theme tokens / CSS variables (`--brand-blue`, `--brand-gold`, etc.) so the palette can be tuned in one place.
- Placeholder images clearly marked; procedural/generated 3D only (no copyrighted assets).
- README with setup and Vercel deploy steps.

---

## APPENDIX — Hero illustration image-generation prompt
Use with Midjourney / DALL·E / Ideogram / Gemini, then split into 4 layers (sky, hills, plant, foreground):

```
Wide panoramic isometric flat-vector illustration of a bentonite clay mining and activated bleaching earth manufacturing plant, 21:9 aspect ratio, clean corporate infographic style, crisp edges, subtle soft shading, no text, no logos.

Scene left to right: terraced open-pit bentonite quarry with sandy-beige clay benches and an ochre-gold excavator; large conical stockpiles of pale clay; long inclined steel conveyor belt on trusses; open-sided storage shed; vertical cylindrical activation tanks and reactors with pipework and catwalks; a long horizontal rotary dryer; process building; tall chimney; row of storage silos on a steel platform; packaging warehouse with stacked white bags, a forklift, workers in hard hats and hi-vis vests; tipper truck and tanker truck on the road; neat trees around the site.

Color palette:
- Sky: deep navy #071F3A fading to #0A3A68, faint warm gold glow #E0B04A along the horizon
- Distant hills: #0C5A9E at low opacity, layered
- Steel structures, roofs, trusses: #0C5A9E and #0C71C7
- Railings, excavator, forklift, accents: ochre gold #BF8311 with #E0B04A highlights
- Tanks, silos, walls: ivory #FAF7F2
- Bentonite quarry and stockpiles: sandy beige #E6D8C0 with #CFB98F shadows
- Ground and roads: #3A3D47, #5B6170
- Trees: muted slate-teal #2E4A5C with #3F6272 highlights

Leave the top 40% as empty navy sky for headline text. High resolution 4K.
```
