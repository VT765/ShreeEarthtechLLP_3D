/** Section ids on the home page. Every section component renders `<section id={sections.x}>`. */
export const sections = {
  home: 'home',
  about: 'about',
  reach: 'global-reach',
  products: 'products',
  gradeFinder: 'grade-finder',
  plant: 'plant',
  contact: 'contact',
  certificates: 'certificates',
} as const

export const nav = [
  { label: 'Home', id: sections.home },
  { label: 'About Us', id: sections.about },
  { label: 'Products', id: sections.products },
  { label: 'Applications', id: sections.gradeFinder },
  { label: 'Certificates', id: sections.certificates },
  { label: 'Contact', id: sections.contact },
]
