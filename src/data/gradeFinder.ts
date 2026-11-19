import type { GradeId } from './products'

// TODO: PLACEHOLDER mapping — have the technical team confirm every oil → grade recommendation.

export type OilCategory = { id: 'edible' | 'industrial' | 'waste'; label: string; oils: { oil: string; grade: GradeId; reason: string }[] }

export const oilCategories: OilCategory[] = [
  {
    id: 'edible',
    label: 'Edible oil',
    oils: [
      { oil: 'Soybean', grade: 'hyper', reason: 'Balanced pigment and phosphorus removal at moderate dosage.' },
      { oil: 'Rice Bran', grade: 'crystal', reason: 'High chlorophyll and dark colour need a high-activity grade.' },
      { oil: 'Palm', grade: 'crystal', reason: 'Strong carotene load bleaches best with acidic activation.' },
      { oil: 'Castor', grade: 'hyper', reason: 'Reliable clarity for pharma and industrial castor.' },
      { oil: 'Mustard', grade: 'hyper', reason: 'Effective colour removal while preserving the pungency profile.' },
      { oil: 'Cottonseed', grade: 'hyper', reason: 'Gossypol and gums respond well to the all-round grade.' },
      { oil: 'Sunflower', grade: 'pure', reason: 'Light oil — a near-neutral grade protects flavour stability.' },
      { oil: 'Coconut', grade: 'pure', reason: 'Premium, low-colour oil needing gentle, low-acidity treatment.' },
    ],
  },
  {
    id: 'industrial',
    label: 'Industrial oil',
    oils: [
      { oil: 'Engine Oil', grade: 'hyper', reason: 'Removes oxidation products and polar impurities.' },
      { oil: 'Mineral Oil', grade: 'hyper', reason: 'Improves colour and stability without over-acidifying.' },
      { oil: 'Diesel', grade: 'hyper', reason: 'Clears gums and colour bodies for a brighter fuel.' },
      { oil: 'Lube Oil', grade: 'hyper', reason: 'Strips sludge precursors and improves colour stability.' },
      { oil: 'Paraffin Wax', grade: 'pure', reason: 'Gentle bleaching keeps wax odourless and white.' },
    ],
  },
  {
    id: 'waste',
    label: 'Waste oil regeneration',
    oils: [
      { oil: 'Used Engine Oil', grade: 'crystal', reason: 'Heavy contamination needs maximum adsorption capacity.' },
      { oil: 'Used Cooking Oil', grade: 'crystal', reason: 'Polar compounds and dark colour call for high activity.' },
    ],
  },
]

/** Flat list of every oil, used by the enquiry form's oil-type dropdown. */
export const allOils = oilCategories.flatMap((c) => c.oils.map((o) => o.oil))
