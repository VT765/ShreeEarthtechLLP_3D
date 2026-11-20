// PLACEHOLDER export markets — replace with the real list of countries supplied.

export const origin = { name: 'India', lat: 23.25, lng: 69.67 }

export const regions = ['Middle East & Turkey', 'South Asia', 'Southeast Asia', 'Africa'] as const

export const exportCountries: { name: string; region: (typeof regions)[number]; lat: number; lng: number }[] = [
  { name: 'United Arab Emirates', region: 'Middle East & Turkey', lat: 24.47, lng: 54.37 },
  { name: 'Saudi Arabia', region: 'Middle East & Turkey', lat: 24.71, lng: 46.68 },
  { name: 'Oman', region: 'Middle East & Turkey', lat: 23.59, lng: 58.41 },
  { name: 'Bangladesh', region: 'South Asia', lat: 23.81, lng: 90.41 },
  { name: 'Sri Lanka', region: 'South Asia', lat: 6.93, lng: 79.85 },
  { name: 'Nepal', region: 'South Asia', lat: 27.72, lng: 85.32 },
  { name: 'Indonesia', region: 'Southeast Asia', lat: -6.2, lng: 106.85 },
  { name: 'Malaysia', region: 'Southeast Asia', lat: 3.14, lng: 101.69 },
  { name: 'Kenya', region: 'Africa', lat: -1.29, lng: 36.82 },
  { name: 'Nigeria', region: 'Africa', lat: 6.52, lng: 3.38 },
  { name: 'Egypt', region: 'Africa', lat: 30.04, lng: 31.24 },
  { name: 'Turkey', region: 'Middle East & Turkey', lat: 41.01, lng: 28.98 },
]
