import { company } from './company'

export const hero = {
  slide1: {
    eyebrow: 'Activated bleaching earth manufacturer',
    title: company.tagline,
    body: company.intro,
    primaryCta: 'Request a quote',
    secondaryCta: 'Download brochure',
  },
  slide2: {
    ...company.about,
    profileLink: { label: 'Read company profile', to: '/about/company-profile' },
  },
}
