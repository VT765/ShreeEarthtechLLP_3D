import { company } from './company'

export const hero = {
  slide1: {
    eyebrow: 'Activated Bleaching Earth Manufacturer',
    title: company.tagline,
    body: company.intro,
    primaryCta: 'Request a Quote',
    secondaryCta: 'Download Brochure',
  },
  slide2: {
    ...company.about,
    profileLink: { label: 'Read company profile', to: '/about/company-profile' },
  },
}
