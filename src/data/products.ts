// Product grades and specs. Images and TDS PDFs are PLACEHOLDERS — replace the files, keep the paths.

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
  /** Accent colour for the 3D bag label and card. */
  color: string
  keySpecs: { label: string; value: string }[]
  /** Path under /public (resolve with `asset()`). */
  tds: string
  image: { src: string; alt: string }
}

export const products: Product[] = [
  {
    id: 'crystal',
    slug: 'crystal-brite',
    name: 'Earthtech Crystal Brite',
    short: 'Crystal Brite',
    grade: 'High-activity acidic grade',
    body: 'For tough pigments and dark oils — rice bran, palm and heavily coloured crude.',
    color: '#2C6A99',
    keySpecs: [
      { label: 'pH (10% susp.)', value: '2.5 – 3.5' },
      { label: 'Bleaching efficiency', value: '≥ 95%' },
      { label: 'Avg. particle size', value: '23 µm min' },
    ],
    tds: 'tds/crystal-brite.pdf',
    image: { src: 'placeholders/products/crystal-brite.svg', alt: 'Earthtech Crystal Brite 25 kg bag' },
  },
  {
    id: 'hyper',
    slug: 'hyper-clean',
    name: 'Earthtech Hyper Clean',
    short: 'Hyper Clean',
    grade: 'Balanced all-round grade',
    body: 'For most edible and industrial oils — dependable colour and gum removal at moderate dosage.',
    color: '#D2691E',
    keySpecs: [
      { label: 'pH (10% susp.)', value: '4 – 5' },
      { label: 'Bleaching efficiency', value: '≥ 95%' },
      { label: 'Avg. particle size', value: '21 µm min' },
    ],
    tds: 'tds/hyper-clean.pdf',
    image: { src: 'placeholders/products/hyper-clean.svg', alt: 'Earthtech Hyper Clean 25 kg bag' },
  },
  {
    id: 'pure',
    slug: 'pure-choice',
    name: 'Earthtech Pure Choice',
    short: 'Pure Choice',
    grade: 'Near-neutral grade',
    body: 'For sensitive, premium edible oils where flavour stability and low acidity matter most.',
    color: '#6B4A32',
    keySpecs: [
      { label: 'pH (10% susp.)', value: '5 – 7' },
      { label: 'Bleaching efficiency', value: '≥ 95%' },
      { label: 'Avg. particle size', value: '25 µm min' },
    ],
    tds: 'tds/pure-choice.pdf',
    image: { src: 'placeholders/products/pure-choice.svg', alt: 'Earthtech Pure Choice 25 kg bag' },
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
