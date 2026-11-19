// Product grades and specs. TDS PDFs are PLACEHOLDERS — replace the files, keep the paths.
// Product images are renders of the 3D pouch (scripts/render-pouches.sh), so they match the live model.

export type GradeId = 'crystal' | 'hyper' | 'pure'

export type Product = {
  id: GradeId
  /** URL segment of the product page: /products/<slug>. */
  slug: string
  name: string
  short: string
  /** Grade positioning, shown under the name. */
  grade: string
  body: string
  /** Accent colour for the card. */
  color: string
  /** Pouch print: grade name as printed, and colours taken from the real packaging. */
  pack: Pack
  keySpecs: { label: string; value: string }[]
  /** Path under /public (resolve with `asset()`). */
  tds: string
  image: { src: string; alt: string }
}

/**
 * `main` top/bottom bands, `dark` small type and the vertical wordmark, `accent` grade name, `light` pattern lines,
 * `logo` the S / E of the mark, `icon` the grade icon's gradient.
 */
export type Pack = { label: string; main: string; dark: string; accent: string; light: string; logo: [string, string]; icon: [string, string] }

export const products: Product[] = [
  {
    id: 'crystal',
    slug: 'crystal-brite',
    name: 'Earthtech Crystal Brite',
    short: 'Crystal Brite',
    grade: 'High-activity acidic grade',
    body: 'For tough pigments and dark oils — rice bran, palm and heavily coloured crude.',
    color: '#2C6A99',
    pack: { label: 'CRYSTALBRITE', main: '#1FAFB1', dark: '#0E5A63', accent: '#1FA3A6', light: '#BFEBEA', logo: ['#167F88', '#D9A930'], icon: ['#178F94', '#4CCBC6'] },
    keySpecs: [
      { label: 'pH (10% susp.)', value: '2.5 – 3.5' },
      { label: 'Bleaching efficiency', value: '≥ 95%' },
      { label: 'Avg. particle size', value: '23 µm min' },
    ],
    tds: 'tds/crystal-brite.pdf',
    image: { src: 'products/crystal-brite.webp', alt: 'Earthtech Crystal Brite stand-up pouch of Activated Bleaching Earth' },
  },
  {
    id: 'hyper',
    slug: 'hyper-clean',
    name: 'Earthtech Hyper Clean',
    short: 'Hyper Clean',
    grade: 'Balanced all-round grade',
    body: 'For most edible and industrial oils — dependable colour and gum removal at moderate dosage.',
    color: '#D2691E',
    pack: { label: 'HYPERCLEAN', main: '#203E8C', dark: '#1A3478', accent: '#203E8C', light: '#AFC0EA', logo: ['#1E4FA8', '#9EA8B6'], icon: ['#1E4FA8', '#B8C0CC'] },
    keySpecs: [
      { label: 'pH (10% susp.)', value: '4 – 5' },
      { label: 'Bleaching efficiency', value: '≥ 95%' },
      { label: 'Avg. particle size', value: '21 µm min' },
    ],
    tds: 'tds/hyper-clean.pdf',
    image: { src: 'products/hyper-clean.webp', alt: 'Earthtech Hyper Clean stand-up pouch of Activated Bleaching Earth' },
  },
  {
    id: 'pure',
    slug: 'pure-choice',
    name: 'Earthtech Pure Choice',
    short: 'Pure Choice',
    grade: 'Near-neutral grade',
    body: 'For sensitive, premium edible oils where flavour stability and low acidity matter most.',
    color: '#6B4A32',
    pack: { label: 'PURE CHOICE', main: '#2E7B3A', dark: '#245F33', accent: '#76A33A', light: '#DCE5B4', logo: ['#3C8C3C', '#A9B83A'], icon: ['#3E9142', '#C9B23A'] },
    keySpecs: [
      { label: 'pH (10% susp.)', value: '5 – 7' },
      { label: 'Bleaching efficiency', value: '≥ 95%' },
      { label: 'Avg. particle size', value: '25 µm min' },
    ],
    tds: 'tds/pure-choice.pdf',
    image: { src: 'products/pure-choice.webp', alt: 'Earthtech Pure Choice stand-up pouch of Activated Bleaching Earth' },
  },
]

/** Full specification table, values in `products` order. */
export const specs: { parameter: string; values: [string, string, string] }[] = [
  { parameter: 'Moisture Content (%)', values: ['15 Max', '15 Max', '15 Max'] },
  { parameter: 'pH (10% Suspension)', values: ['2.5 to 3.5', '4 to 5', '5 to 7'] },
  { parameter: 'Particle Size Passing (90 micron)', values: ['80 Min', '80 Min', '80 Min'] },
  { parameter: 'Average Particle Size (micron)', values: ['23 Min', '21 Min', '25 Min'] },
  { parameter: 'Bleaching Efficiency % (against lab standard sample)', values: ['95 Min', '95 Min', '95 Min'] },
  { parameter: 'Acidity as H₂SO₄ %', values: ['0.4 Max', '0.4 Max', '0.4 Max'] },
  { parameter: 'Residual Acidity (mg KOH/g)', values: ['2.5 (±1)', '2.5 (±1)', '2.5 (±1)'] },
  { parameter: 'Absolute Bulk Density (g/litre) DE 6', values: ['650 Max', '650 Max', '750 Max'] },
  { parameter: 'BET Surface Area (m²/g)', values: ['300 Max', '300 Max', '300 Max'] },
]

export const productById = (id: GradeId) => products.find((p) => p.id === id)!
export const productBySlug = (slug: string | undefined) => products.find((p) => p.slug === slug)
export const isGradeId = (v: string | null): v is GradeId => products.some((p) => p.id === v)
