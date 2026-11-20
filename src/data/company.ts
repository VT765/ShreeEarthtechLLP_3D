// DUMMY contact details — replace with the real ones before launch.

export const company = {
  name: 'Shree Earthtech LLP',
  tagline: 'Purity, Engineered from the Earth.',
  intro:
    'Activated Bleaching Earth made from select Bhavnagar and Kutch bentonite, engineered for low dosage, fast filtration and low oil retention, and lab-tested batch by batch before it leaves our plant.',
  about: {
    heading: 'About Shree Earthtech',
    subheading: 'Gujarat bentonite, engineered into a precision adsorbent',
    body: [
      'We source montmorillonite-rich bentonite from the reserves of Bhavnagar and Kutch and transform it, through controlled acid activation, washing, drying and fine milling, into a high-surface-area bleaching earth.',
      'Our three grades help refiners of edible, industrial and waste oils remove colour pigments, gums, soaps and trace metals at lower dosage, with less oil lost in the filter cake.',
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
 * Certifications: seals on the home page, full certificates on /certificates. `image` is a DUMMY certificate for now: put the real scan in
 * public/certificates/ (e.g. iso9001.jpg) and point `image` at it. Confirm every entry before launch.
 */
const DUMMY_CERTIFICATE = 'certificates/placeholder-certificate.svg'
// TODO: fill in the certifying body and expiry date of each certificate (shown on the home cards).
const TBC = 'TBC'

export const certifications = [
  { id: 'iso9001', title: 'ISO 9001:2015', caption: 'Quality Management', issuer: TBC, validTill: TBC, image: DUMMY_CERTIFICATE },
  { id: 'iso14001', title: 'ISO 14001:2015', caption: 'Environmental Management', issuer: TBC, validTill: TBC, image: DUMMY_CERTIFICATE },
  { id: 'iso22000', title: 'ISO 22000:2018', caption: 'Food Safety Management', issuer: TBC, validTill: TBC, image: DUMMY_CERTIFICATE },
  { id: 'iso45001', title: 'ISO 45001:2018', caption: 'Occupational Health & Safety', issuer: TBC, validTill: TBC, image: DUMMY_CERTIFICATE },
  { id: 'kosher', title: 'Kosher', caption: 'Kosher Certified', issuer: TBC, validTill: TBC, image: DUMMY_CERTIFICATE },
  { id: 'halal', title: 'Halal', caption: 'Halal Certified', issuer: TBC, validTill: TBC, image: DUMMY_CERTIFICATE },
]
