// All editable copy, specs and contact details live here.

export const company = {
  name: 'Shree Earthtech LLP',
  tagline: 'Purity, Engineered from the Earth.',
  address: 'Plot No. 12, GIDC Industrial Estate, Bhavnagar, Gujarat 364001, India',
  phones: ['+91 98765 43210', '+91 91234 56789'],
  emails: ['info@shreeearthtech.com', 'sales@shreeearthtech.com'],
  website: 'www.shreeearthtech.com',
  hours: 'Mon–Sat, 9:30 AM – 6:30 PM IST',
  whatsapp: '919876543210',
  mapEmbed:
    'https://www.google.com/maps?q=GIDC+Industrial+Estate+Bhavnagar+Gujarat&output=embed',
  social: [
    { name: 'LinkedIn', href: '#' },
    { name: 'Instagram', href: '#' },
    { name: 'YouTube', href: '#' },
  ],
}

export const nav = [
  { label: 'Home', id: 'home' },
  { label: 'About', id: 'about' },
  { label: 'Process', id: 'process' },
  { label: 'Products', id: 'products' },
  { label: 'Applications', id: 'applications' },
  { label: 'Quality', id: 'quality' },
  { label: 'Certifications', id: 'certifications' },
  { label: 'Contact', id: 'contact' },
]

export const hero = {
  eyebrow: 'Activated Bleaching Earth Manufacturer',
  title: ['Purity, Engineered', 'from the Earth.'],
  subhead:
    'High-efficiency Activated Bleaching Earth from premium Bhavnagar & Kutch bentonite — for cleaner, brighter, safer oils.',
  hotspots: [
    { label: 'Bentonite Quarry', x: 12, y: 74 },
    { label: 'Acid Activation', x: 52, y: 60 },
    { label: 'Rotary Dryer', x: 64, y: 66 },
    { label: 'Silos & Packaging', x: 86, y: 62 },
  ],
}

export const certifications = [
  { id: 'iso9001', title: 'ISO 9001:2015', caption: 'Quality Management' },
  { id: 'iso14001', title: 'ISO 14001:2015', caption: 'Environmental Management' },
  { id: 'iso22000', title: 'ISO 22000:2018', caption: 'Food Safety Management' },
  { id: 'iso45001', title: 'ISO 45001:2018', caption: 'Occupational Health & Safety' },
  { id: 'kosher', title: 'Kosher', caption: 'Kosher Certified' },
  { id: 'halal', title: 'Halal', caption: 'Halal Certified' },
]

export const about = {
  eyebrow: 'About Shree Earthtech',
  title: 'Refinery-grade adsorbents, born in Gujarat.',
  body:
    'Shree Earthtech LLP manufactures highly efficient activated bleaching earth for purifying edible, industrial and waste oils. We source high-quality bentonite (montmorillonite) from the mineral-rich reserves of Bhavnagar and Kutch, Gujarat, and turn it into a high-surface-area adsorbent through controlled acid activation — trusted by refineries for consistent, batch-to-batch performance.',
  stats: [
    { value: 15, suffix: '+', label: 'Years Experience' },
    { value: 3000, suffix: ' MT', label: 'Monthly Capacity' },
    { value: 250, suffix: '+', label: 'Clients' },
    { value: 12, suffix: '+', label: 'Export Countries' },
  ],
}

export const rawMaterial = {
  eyebrow: 'Raw Material',
  title: "From Gujarat's Earth",
  body:
    'Our bentonite is mined from two of India’s richest montmorillonite belts. Each lot is assayed for clay content, swelling index and trace metals before it enters the plant.',
  sources: [
    {
      id: 'kutch',
      name: 'Kutch',
      lon: 69.67,
      lat: 23.25,
      detail:
        'High-montmorillonite calcium bentonite with fine, uniform platelets — ideal for high-activity acidic grades.',
    },
    {
      id: 'bhavnagar',
      name: 'Bhavnagar',
      lon: 72.15,
      lat: 21.76,
      detail:
        'Low-grit bentonite with excellent swelling behaviour and consistent mineralogy — the backbone of our balanced grades.',
    },
  ],
  structure: {
    title: 'Why layers matter',
    body:
      'Montmorillonite is built from stacked silicate sheets — an octahedral alumina layer sandwiched between two tetrahedral silica layers. Acid activation opens the gaps between those sheets, exposing a vast internal surface where pigments, gums and trace metals are captured.',
    points: [
      'Tetrahedral silica (SiO₄) outer layers',
      'Octahedral alumina (AlO₆) core layer',
      'Expandable interlayer — where adsorption happens',
    ],
  },
}

export const process = {
  eyebrow: 'Manufacturing Process',
  title: 'Six controlled stages. One consistent grade.',
  badge: 'PLC-based automation with SCADA process control.',
  steps: [
    {
      title: 'Raw Material Selection',
      body: 'Premium bentonite from Bhavnagar & Kutch reserves.',
      meta: 'Lot assay · Clay content · Trace metals',
    },
    {
      title: 'Granulation',
      body: 'Lumps converted to wet granules; every batch quality-checked.',
      meta: 'Uniform granule size for even activation',
    },
    {
      title: 'Acid Activation',
      body: '~10-hour acid treatment, then ~12-hour washing to remove impurities and heavy metals.',
      meta: '≈10 h activation · ≈12 h washing',
    },
    {
      title: 'Neutralization & Recycling',
      body: 'Spent acid and water neutralized with lime; water filtered and RO-treated for reuse; gypsum by-product supplied to the cement industry.',
      meta: 'Lime neutralization · RO reuse · Gypsum',
    },
    {
      title: 'Drying',
      body: 'High-capacity driers bring moisture to target level.',
      meta: 'Moisture ≤ 15%',
    },
    {
      title: 'Milling & Packaging',
      body: 'Fine milling for controlled particle size, then packing.',
      meta: '≥ 80% passing 90 µm',
    },
  ],
}

export type GradeId = 'crystal' | 'hyper' | 'pure'

export const products: {
  id: GradeId
  name: string
  short: string
  line: string
  body: string
  color: string
  highlights: string[]
}[] = [
  {
    id: 'crystal',
    name: 'Earthtech Crystal Brite',
    short: 'Crystal Brite',
    line: 'High-activity acidic grade',
    body: 'For tough pigments and dark oils — rice bran, palm and heavily coloured crude.',
    color: '#0C71C7',
    highlights: ['pH 2.5 – 3.5', 'Bleaching efficiency ≥ 95%', 'Avg. particle 23 µm'],
  },
  {
    id: 'hyper',
    name: 'Earthtech Hyper Clean',
    short: 'Hyper Clean',
    line: 'Balanced all-round grade',
    body: 'For most edible and industrial oils — dependable colour and gum removal at moderate dosage.',
    color: '#BF8311',
    highlights: ['pH 4 – 5', 'Bleaching efficiency ≥ 95%', 'Avg. particle 21 µm'],
  },
  {
    id: 'pure',
    name: 'Earthtech Pure Choice',
    short: 'Pure Choice',
    line: 'Near-neutral grade',
    body: 'For sensitive, premium edible oils where flavour stability and low acidity matter most.',
    color: '#1E8C7E',
    highlights: ['pH 5 – 7', 'Bleaching efficiency ≥ 95%', 'Avg. particle 25 µm'],
  },
]

export const specs: { parameter: string; values: [string, string, string] }[] = [
  { parameter: 'Moisture Content (%)', values: ['15 Max', '15 Max', '15 Max'] },
  { parameter: 'pH (10% Suspension)', values: ['2.5 to 3.5', '4 to 5', '5 to 7'] },
  { parameter: 'Particle Size Passing (90 micron)', values: ['80 Min', '80 Min', '80 Min'] },
  { parameter: 'Average Particle Size (micron)', values: ['23 Min', '21 Min', '25 Min'] },
  {
    parameter: 'Bleaching Efficiency % (against lab standard sample)',
    values: ['95 Min', '95 Min', '95 Min'],
  },
  { parameter: 'Acidity as H₂SO₄ %', values: ['0.4 Max', '0.4 Max', '0.4 Max'] },
  { parameter: 'Residual Acidity (mg KOH/g)', values: ['2.5 (±1)', '2.5 (±1)', '2.5 (±1)'] },
  { parameter: 'Absolute Bulk Density (g/litre) DE 6', values: ['650 Max', '650 Max', '750 Max'] },
  { parameter: 'BET Surface Area (m²/g)', values: ['300 Max', '300 Max', '300 Max'] },
]

export const gradeFinder: { oil: string; group: string; grade: GradeId; why: string }[] = [
  { oil: 'Rice Bran Oil', group: 'Edible', grade: 'crystal', why: 'High chlorophyll and dark colour need a high-activity grade.' },
  { oil: 'Palm Oil', group: 'Edible', grade: 'crystal', why: 'Strong carotene load bleaches best with acidic activation.' },
  { oil: 'Soybean Oil', group: 'Edible', grade: 'hyper', why: 'Balanced pigment and phosphorus removal at moderate dosage.' },
  { oil: 'Cottonseed Oil', group: 'Edible', grade: 'hyper', why: 'Gossypol and gums respond well to the all-round grade.' },
  { oil: 'Mustard Oil', group: 'Edible', grade: 'hyper', why: 'Effective colour removal while preserving pungency profile.' },
  { oil: 'Castor Oil', group: 'Edible / Industrial', grade: 'hyper', why: 'Reliable clarity for pharma and industrial castor.' },
  { oil: 'Sunflower Oil', group: 'Edible', grade: 'pure', why: 'Light oil — a near-neutral grade protects flavour stability.' },
  { oil: 'Coconut Oil', group: 'Edible', grade: 'pure', why: 'Premium, low-colour oil needing gentle, low-acidity treatment.' },
  { oil: 'Mineral / Lube Oil', group: 'Industrial', grade: 'hyper', why: 'Removes oxidation products and polar impurities.' },
  { oil: 'Used Engine Oil', group: 'Waste Oil', grade: 'crystal', why: 'Heavy contamination needs maximum adsorption capacity.' },
  { oil: 'Used Cooking Oil', group: 'Waste Oil', grade: 'crystal', why: 'Polar compounds and dark colour call for high activity.' },
]

export const properties = [
  { icon: 'FlaskConical', title: 'Acid Activation', body: 'Higher contact surface area with neutralized oil gives superior adsorption of chlorophyll, carotenes and phosphorus, so lower dosage is needed than alternatives.' },
  { icon: 'Sparkles', title: 'Efficient Removal', body: 'Strong adsorption removes gums (phospholipids), free fatty acids and soap content for a cleaner, purer oil.' },
  { icon: 'Filter', title: 'Streamlined Filtration', body: 'Balanced particle size distribution speeds filtration and shortens processing time without compromising quality.' },
  { icon: 'Droplets', title: 'Optimized Oil Retention', body: 'Controlled pore diameter, total pore volume and surface area give lower oil retention without sacrificing throughput.' },
  { icon: 'Scale', title: 'Controlled Bulk Density', body: 'Precise measurement ensures consistent, reproducible quality.' },
  { icon: 'Gauge', title: 'Controlled Residual Acidity', body: 'Balanced acidity removes color effectively without harmful by-products.' },
  { icon: 'ShieldCheck', title: '3-MCPD Reduction', body: 'Helps lower 3-MCPD levels in edible oils for consumer safety.' },
  { icon: 'ClipboardCheck', title: 'Batch-Tested Quality', body: 'Every batch lab-tested before dispatch.' },
] as const

export const applications = [
  {
    title: 'Edible Oil Purification',
    tint: ['#8F620C', '#E0B04A'],
    items: ['Soybean', 'Rice Bran', 'Palm', 'Castor', 'Mustard', 'Cottonseed', 'Sunflower', 'Coconut'],
  },
  {
    title: 'Industrial Oil Refining',
    tint: ['#0C5A9E', '#4E91CC'],
    items: ['Engine Oil', 'Mineral Oil', 'Diesel', 'Lube Oil', 'Paraffin Wax'],
  },
  {
    title: 'Waste Oil Regeneration',
    tint: ['#1E6B60', '#1E8C7E'],
    items: ['Used Engine Oil', 'Used Cooking Oil'],
  },
]

export const lab = {
  eyebrow: 'Quality Lab',
  title: 'Every batch tested before dispatch.',
  body: 'Our in-house laboratory verifies colour, moisture, acidity, density and filtration behaviour on every batch — and keeps retained samples for full traceability.',
  instruments: [
    { name: 'UV-Visible Spectrophotometer', kind: 'spectro' },
    { name: 'Colour Measurement Instrument', kind: 'colour' },
    { name: 'Infrared Moisture Balance', kind: 'balance' },
    { name: 'HANNA pH Meter', kind: 'ph' },
    { name: 'Bulk Density Apparatus', kind: 'density' },
    { name: 'High-Pressure Vacuum Pump', kind: 'pump' },
    { name: 'Filtration Unit', kind: 'filter' },
    { name: 'Oil Bath', kind: 'oilbath' },
    { name: 'Water Bath', kind: 'waterbath' },
    { name: 'Magnetic Stirrer', kind: 'stirrer' },
  ],
}

export const sustainability = {
  eyebrow: 'Sustainability',
  title: 'Zero-Waste by Design.',
  body: 'Every stream that leaves activation is captured, treated and returned to use — water to the plant, gypsum to the cement industry, metals out of the cycle.',
  loop: [
    { title: 'RO Water Recycling', body: 'Wash water filtered and RO-treated for reuse in the plant.' },
    { title: 'Lime Neutralization', body: 'Spent acid neutralized with lime before any discharge.' },
    { title: 'Gypsum to Cement', body: 'Neutralization by-product supplied to the cement industry.' },
    { title: 'Heavy-Metal Removal', body: 'Washing strips impurities and heavy metals from the clay.' },
  ],
}

export const packaging = {
  eyebrow: 'Packaging & Supply',
  title: 'Domestic & export supply with reliable lead times.',
  items: [
    { title: '25 kg Paper Bags', body: 'Multi-wall paper with PE liner, branded and batch-coded.' },
    { title: '50 kg Paper Bags', body: 'Palletised and stretch-wrapped for efficient handling.' },
    { title: 'Jumbo Bags (FIBC)', body: '500 kg – 1 MT bulk bags with four lifting loops.' },
    { title: 'Bulk Truck Delivery', body: 'Direct-to-refinery dispatch across India and to ports.' },
  ],
}

export const why = [
  { icon: 'Leaf', title: 'Eco-Friendly', body: 'Closed-loop water, lime neutralization and gypsum reuse.' },
  { icon: 'Lightbulb', title: 'Innovation-Driven', body: 'Continuous R&D on activation chemistry and particle engineering.' },
  { icon: 'Globe2', title: 'Global Reach', body: 'Supplying refiners in 12+ countries through Gujarat’s ports.' },
  { icon: 'HeartHandshake', title: 'Customer-Centric Quality', body: 'Grades tuned to each refinery’s oil and process conditions.' },
  { icon: 'Layers', title: 'Consistent Batch Quality', body: 'PLC/SCADA control and per-batch lab release.' },
  { icon: 'Wrench', title: 'Technical Support for Refiners', body: 'On-site trials, dosage optimisation and troubleshooting.' },
] as const

export const contact = {
  eyebrow: 'Contact / RFQ',
  title: 'Request a quote',
  body: 'Tell us about your oil and monthly requirement — our technical team will recommend a grade and send pricing within one business day.',
  oilTypes: [
    'Soybean', 'Rice Bran', 'Palm', 'Castor', 'Mustard', 'Cottonseed', 'Sunflower', 'Coconut',
    'Engine / Mineral / Lube Oil', 'Paraffin Wax', 'Used Engine Oil', 'Used Cooking Oil', 'Other',
  ],
  grades: ['Crystal Brite', 'Hyper Clean', 'Pure Choice', 'Not sure — recommend one'],
}
