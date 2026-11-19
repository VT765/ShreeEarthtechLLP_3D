import { company } from './company'

// Inner About pages. Only existing company copy is used; anything not yet supplied is a marked PLACEHOLDER.

export const companyProfile = {
  eyebrow: 'About',
  title: 'Company Profile',
  intro: company.intro,
  heading: company.about.subheading,
  body: company.about.body,
}

export const visionMission = {
  eyebrow: 'About',
  title: 'Vision & Mission',
  intro: company.tagline,
  // PLACEHOLDER — the company has not supplied its vision and mission statements yet.
  vision: {
    title: 'Vision',
    body: 'Vision statement to be supplied by Shree Earthtech LLP.',
    placeholder: true,
  },
  mission: {
    title: 'Mission',
    body: 'Mission statement to be supplied by Shree Earthtech LLP.',
    placeholder: true,
  },
}
