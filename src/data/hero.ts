import { company } from './company'
import { products } from './products'

export const hero = {
  slide1: {
    eyebrow: 'Activated Bleaching Earth Manufacturer',
    title: company.tagline,
    body: company.intro,
    primaryCta: 'Request a Quote',
    secondaryCta: 'Download Brochure',
    /** The 3 rotating image cards. PLACEHOLDER product images — see data/products.ts. */
    cards: products.map((p) => ({ src: p.image.src, alt: p.image.alt, label: p.short })),
  },
  slide2: company.about,
}
