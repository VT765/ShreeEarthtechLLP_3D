// DUMMY contact details — replace with the real ones before launch.

export const company = {
  name: 'Shree Earthtech LLP',
  tagline: 'Purity, Engineered from the Earth.',
  intro:
    'Shree Earthtech LLP manufactures high-efficiency Activated Bleaching Earth that refineries trust for cleaner, brighter, safer oils — consistent from batch to batch, tested before every dispatch.',
  about: {
    heading: 'About Shree Earthtech',
    subheading: "SE's Activated Bleaching Earth",
    body: [
      'We turn premium Indian bentonite (montmorillonite) into a high-surface-area adsorbent through controlled acid activation, washing, drying and fine milling.',
      'Our three grades purify edible, industrial and waste oils — removing colour pigments, gums, soaps and trace metals while keeping oil retention low.',
    ],
  },
  addressLabel: 'Office Address',
  address: 'Office No. 5, Ground Floor, Shah Commercial Centre, Bhuj, Gujarat 370001, India',
  phones: ['+91 98765 43210', '+91 91234 56789'],
  emails: ['info@shreeearthtech.com', 'sales@shreeearthtech.com'],
  website: 'www.shreeearthtech.com',
  hours: 'Mon–Sat, 9:30 AM – 6:30 PM IST',
  whatsapp: '919876543210',
  mapEmbed: 'https://www.google.com/maps?q=Shah+Commercial+Centre,+Bhuj,+Gujarat+370001&output=embed',
  /** PLACEHOLDER — drop the real brochure at public/brochure.pdf. */
  brochure: 'brochure.pdf',
  social: [
    { name: 'LinkedIn', href: '#' },
    { name: 'Instagram', href: '#' },
    { name: 'YouTube', href: '#' },
  ],
}

/** `tel:` href for a display phone number. */
export const telHref = (phone: string) => `tel:${phone.replace(/[^\d+]/g, '')}`

/**
 * Certifications shown on the home page. `image` is a DUMMY certificate for now: put the real scan in
 * public/certificates/ (e.g. iso9001.jpg) and point `image` at it. Confirm every entry before launch.
 */
const DUMMY_CERTIFICATE = 'certificates/placeholder-certificate.svg'

export const certifications = [
  { id: 'iso9001', title: 'ISO 9001:2015', caption: 'Quality Management', image: DUMMY_CERTIFICATE },
  { id: 'iso14001', title: 'ISO 14001:2015', caption: 'Environmental Management', image: DUMMY_CERTIFICATE },
  { id: 'iso22000', title: 'ISO 22000:2018', caption: 'Food Safety Management', image: DUMMY_CERTIFICATE },
  { id: 'iso45001', title: 'ISO 45001:2018', caption: 'Occupational Health & Safety', image: DUMMY_CERTIFICATE },
  { id: 'kosher', title: 'Kosher', caption: 'Kosher Certified', image: DUMMY_CERTIFICATE },
  { id: 'halal', title: 'Halal', caption: 'Halal Certified', image: DUMMY_CERTIFICATE },
]
