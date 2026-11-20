import { products } from './products'
import { routes } from './routes'

/** Section ids on the home page. Every section component renders `<section id={sections.x}>`. */
export const sections = {
  home: 'home',
  about: 'about',
  reach: 'global-reach',
  products: 'products',
  gradeFinder: 'grade-finder',
  certificates: 'certificates',
  plant: 'plant',
  contact: 'contact',
  vision: 'vision',
  mission: 'mission',
} as const

export type NavLink = { label: string; to: string; description?: string }
export type NavMenu = { label: string; id: string; items: NavLink[] }
export type NavItem = NavLink | NavMenu

export const isMenu = (item: NavItem): item is NavMenu => 'items' in item

export const nav: NavItem[] = [
  { label: 'Home', to: routes.home },
  {
    label: 'About',
    id: 'about-menu',
    items: [
      { label: 'Company Profile', to: routes.companyProfile },
      { label: 'Vision', to: `${routes.visionMission}#${sections.vision}` },
      { label: 'Mission', to: `${routes.visionMission}#${sections.mission}` },
    ],
  },
  {
    label: 'Products',
    id: 'products-menu',
    items: products.map((p) => ({ label: p.name, to: routes.product(p.slug), description: p.grade })),
  },
  { label: 'Applications', to: routes.applications },
  { label: 'Certificates', to: routes.certificates },
  { label: 'Contact', to: routes.contact },
]

/** Home scrollspy: the sections that light up each top-level nav item while they cross the middle of the screen. */
export const navSpy: Record<string, string[]> = {
  Home: [sections.home],
  About: [sections.about, sections.reach, sections.plant],
  Products: [sections.products],
  Applications: [sections.gradeFinder],
  Certificates: [sections.certificates],
  Contact: [sections.contact],
}
