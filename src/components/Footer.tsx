import { Link } from 'react-router-dom'
import { ArrowRight, Mail, Phone } from 'lucide-react'
import { sectionCopy } from '../data/sections'
import { isMenu, nav } from '../data/nav'
import { company, telHref } from '../data/company'
import { products } from '../data/products'
import { routes } from '../data/routes'
import { asset } from '../lib/asset'
import Logo from './Logo'
import NavItemLink from './NavItemLink'
import SocialIcon from './Social'
import { SWatermark } from './SCurve'
import '../styles/footer.css'

const cta = sectionCopy.contactCta
const listFormat = new Intl.ListFormat('en', { style: 'long', type: 'conjunction' })
/** Every page link in the nav, flattened (dropdown items included). */
const quickLinks = nav.flatMap((n) => (isMenu(n) ? n.items : [n])).filter((l) => !products.some((p) => l.to === routes.product(p.slug)))

/** Slim footer: quote CTA, brand + quick links + product links, legal line. The full contact block is on /contact. */
export default function Footer() {
  const year = new Date().getFullYear()
  const phone = company.phones[0]
  const email = company.emails[0]

  return (
    <footer className="footer-bg on-dark relative overflow-hidden text-white/75">
      <SWatermark className="absolute -left-28 top-10 h-[520px] w-auto text-white/[0.035]" />

      {/* ---------- Quote CTA ---------- */}
      <div className="footer-dark container-x relative border-b border-white/10 py-14">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-center">
          <div className="max-w-2xl">
            <h2 className="h2">{cta.title}</h2>
            <p className="mt-3 text-lg text-white/75">{cta.body}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link to={routes.contact} className="btn btn-orange">
              {cta.cta} <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <a href={telHref(phone)} className="btn btn-ghost-dark">
              <Phone className="h-4 w-4" aria-hidden /> {phone}
            </a>
          </div>
        </div>
      </div>

      {/* ---------- Brand, quick links, products ---------- */}
      <div className="footer-dark container-x relative grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Logo variant="dark" />
          <p className="mt-4 max-w-sm text-sm text-white/65">{company.tagline}</p>
          <a href={`mailto:${email}`} className="footer-link mt-4 inline-flex items-center gap-2 text-sm">
            <Mail className="h-4 w-4" aria-hidden /> {email}
          </a>
          <ul className="mt-6 flex gap-3" aria-label="Social media">
            {company.social.map((s) => (
              <li key={s.name}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${company.name} on ${s.name}`}
                  className="grid h-10 w-10 place-items-center rounded-full border border-white/15 text-white/80 transition-colors hover:border-orange-light hover:text-orange-light"
                >
                  <SocialIcon name={s.name} className="h-[18px] w-[18px]" />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <nav aria-label="Quick links">
          <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-white/60">Quick links</h2>
          <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2.5 text-[15px] md:grid-cols-1">
            {quickLinks.map((l) => (
              <li key={l.to}>
                <NavItemLink to={l.to} className="footer-link">
                  {l.label}
                </NavItemLink>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-white/60">Products</h2>
          <ul className="mt-4 space-y-2.5 text-[15px]">
            {products.map((p) => (
              <li key={p.id}>
                <Link to={routes.product(p.slug)} className="footer-link">
                  {p.name}
                </Link>
              </li>
            ))}
            <li>
              <a href={asset(company.brochure)} download className="footer-link">
                Company brochure<span className="sr-only"> (PDF)</span>
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* ---------- Legal ---------- */}
      <div className="footer-dark relative border-t border-white/10">
        <div className="container-x flex flex-col gap-2 pb-24 pt-6 text-xs text-white/60 md:flex-row md:items-center md:justify-between md:pb-6 md:pr-20">
          <p>
            © {year} {company.name}. All rights reserved.
          </p>
          <p>
            {listFormat.format(products.map((p) => p.name))} are trademarks of {company.name}.
          </p>
        </div>
      </div>
    </footer>
  )
}
