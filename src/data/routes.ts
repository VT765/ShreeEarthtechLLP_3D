import type { GradeId } from './products'

/** Every page of the site. Inner pages hold the detailed content; the home page links to them. */
export const routes = {
  home: '/',
  companyProfile: '/about/company-profile',
  visionMission: '/about/vision-mission',
  products: '/products',
  product: (slug: string) => `/products/${slug}`,
  applications: '/applications',
  contact: '/contact',
} as const

/** Contact page with the enquiry form's product pre-selected. */
export const enquiryFor = (grade: GradeId) => `${routes.contact}?grade=${grade}`
