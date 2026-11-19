import type { ReactNode } from 'react'
import { Clock, Download, Mail, MapPin, Phone } from 'lucide-react'
import { sectionCopy } from '../data/sections'
import { sections, nav } from '../data/nav'
import { certifications, company, telHref } from '../data/company'
import { products } from '../data/products'
import { asset } from '../lib/asset'
import { useReveal } from '../hooks/useReveal'
import { scrollToId } from './SmoothScroll'
import EnquiryForm from './EnquiryForm'
import Logo from './Logo'
import SocialIcon from './Social'
import { SWatermark } from './SCurve'
import '../styles/footer.css'

const copy = sectionCopy.contact

const whatsappHref = `https://wa.me/${company.whatsapp}?text=${encodeURIComponent('Hello Shree Earthtech, I would like a quote for activated bleaching earth.')}`

const listFormat = new Intl.ListFormat('en', { style: 'long', type: 'conjunction' })

function ContactRow({ icon, label, children }: { icon: ReactNode; label: string; children: ReactNode }) {
  return (
    <li className="flex gap-4">
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/5 text-orange-light">{icon}</span>
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/55">{label}</p>
        <div className="mt-0.5 text-[15px] text-white/85">{children}</div>
      </div>
    </li>
  )
}

/**
 * PLACEHOLDER certification marks: drawn as generic seals until the official logo files are supplied.
 * Swap each for the certifying body's artwork (respecting their usage guidelines) when available.
 */
function Seal({ title }: { title: string }) {
  const iso = title.match(/^ISO\s+(\d+)(?::(\d{4}))?/)
  return (
    <svg viewBox="0 0 100 100" className="h-20 w-20" aria-hidden>
      <circle cx="50" cy="50" r="47" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.9" />
      <circle cx="50" cy="50" r="40" fill="rgba(255,255,255,0.04)" stroke="currentColor" strokeWidth="0.8" strokeDasharray="2 3" opacity="0.7" />
      {Array.from({ length: 24 }, (_, i) => (
        <line key={i} x1="50" y1="5" x2="50" y2="8.5" stroke="currentColor" strokeWidth="1" opacity="0.5" transform={`rotate(${i * 15} 50 50)`} />
      ))}
      <path d="M50 18 l2.4 4.9 5.4.8-3.9 3.8.9 5.4-4.8-2.6-4.8 2.6.9-5.4-3.9-3.8 5.4-.8z" fill="var(--orange-light)" />
      {iso ? (
        <>
          <text x="50" y="45" textAnchor="middle" fontSize="9" fontWeight="600" letterSpacing="2" fill="currentColor" fontFamily="Inter, sans-serif">
            ISO
          </text>
          <text x="50" y="62" textAnchor="middle" fontSize="17" fontWeight="800" fill="#fff" fontFamily="'Plus Jakarta Sans', sans-serif">
            {iso[1]}
          </text>
          {iso[2] && (
            <text x="50" y="75" textAnchor="middle" fontSize="8" fill="currentColor" fontFamily="'JetBrains Mono', monospace">
              {iso[2]}
            </text>
          )}
        </>
      ) : (
        <text x="50" y="60" textAnchor="middle" fontSize="15" fontWeight="800" fill="#fff" fontFamily="'Plus Jakarta Sans', sans-serif">
          {title}
        </text>
      )}
    </svg>
  )
}

export default function Footer() {
  const ref = useReveal<HTMLElement>()
  const year = new Date().getFullYear()

  return (
    <footer ref={ref} className="footer-bg on-dark relative overflow-hidden text-white/75">
      <SWatermark className="absolute -left-28 top-20 h-[560px] w-auto text-white/[0.035] md:h-[760px]" />
      <SWatermark className="absolute -right-24 bottom-24 hidden h-[420px] w-auto rotate-180 text-orange/[0.06] lg:block" />

      {/* ---------- Contact + enquiry ---------- */}
      <section id={sections.contact} className="section relative" aria-labelledby="contact-title">
        <div className="container-x grid gap-12 lg:grid-cols-12 lg:gap-14">
          <div className="footer-dark lg:col-span-5">
            <p className="eyebrow" data-reveal>
              {copy.eyebrow}
            </p>
            <h2 id="contact-title" className="h2 mt-4" data-reveal="0.05">
              {copy.title}
            </h2>
            <p className="mt-5 text-lg text-white/75" data-reveal="0.1">
              {copy.body}
            </p>

            <address className="not-italic" data-reveal="0.15">
              <ul className="mt-9 space-y-5">
                <ContactRow icon={<Phone className="h-[18px] w-[18px]" strokeWidth={1.75} aria-hidden />} label="Phone">
                  {company.phones.map((p, i) => (
                    <span key={p}>
                      <a href={telHref(p)} className="footer-link">
                        {p}
                      </a>
                      {i < company.phones.length - 1 && <span className="px-2 text-white/30">/</span>}
                    </span>
                  ))}
                </ContactRow>
                <ContactRow icon={<Mail className="h-[18px] w-[18px]" strokeWidth={1.75} aria-hidden />} label="Email">
                  {company.emails.map((m, i) => (
                    <span key={m} className="break-all">
                      <a href={`mailto:${m}`} className="footer-link">
                        {m}
                      </a>
                      {i < company.emails.length - 1 && <span className="px-2 text-white/30">·</span>}
                    </span>
                  ))}
                </ContactRow>
                <ContactRow icon={<SocialIcon name="WhatsApp" className="h-[18px] w-[18px]" />} label="WhatsApp">
                  <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="footer-link">
                    Chat with our sales team<span className="sr-only"> (opens WhatsApp in a new tab)</span>
                  </a>
                </ContactRow>
                <ContactRow icon={<MapPin className="h-[18px] w-[18px]" strokeWidth={1.75} aria-hidden />} label={company.addressLabel}>
                  {company.address}
                </ContactRow>
                <ContactRow icon={<Clock className="h-[18px] w-[18px]" strokeWidth={1.75} aria-hidden />} label="Business hours">
                  {company.hours}
                </ContactRow>
              </ul>
            </address>

            <div className="mt-8 flex flex-wrap gap-3" data-reveal="0.2">
              <a href={asset(company.brochure)} download className="btn btn-orange">
                <Download className="h-4 w-4" aria-hidden /> Download Brochure
              </a>
              <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="btn btn-ghost-dark">
                <SocialIcon name="WhatsApp" className="h-4 w-4" /> WhatsApp us
              </a>
            </div>

            <div className="mt-8 overflow-hidden rounded-2xl border border-white/10 shadow-[0_20px_40px_rgba(0,0,0,0.3)]" data-reveal="0.25">
              <iframe
                title={`Map: ${company.name}, ${company.address}`}
                src={company.mapEmbed}
                className="block h-60 w-full grayscale-[35%] md:h-64"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          <div className="lg:col-span-7" data-reveal="0.1">
            <EnquiryForm />
          </div>
        </div>
      </section>

      {/* ---------- Certifications ---------- */}
      <section id={sections.certificates} className="footer-dark relative border-y border-white/10 bg-white/[0.02] py-14" aria-labelledby="certs-title">
        <div className="container-x">
          <div className="flex flex-col gap-2 text-center">
            <p className="eyebrow mx-auto">{copy.certsEyebrow}</p>
            <h2 id="certs-title" className="text-2xl md:text-3xl">
              {copy.certsTitle}
            </h2>
          </div>
          <ul className="mt-10 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-6">
            {certifications.map((c) => (
              <li key={c.id} className="seal flex flex-col items-center text-center text-orange-light/80">
                <Seal title={c.title} />
                <p className="mt-3 font-display text-sm font-bold text-white">{c.title}</p>
                <p className="text-xs text-white/60">{c.caption}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ---------- Brand, quick links, social ---------- */}
      <div className="footer-dark container-x relative grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Logo variant="dark" />
          <p className="mt-4 max-w-sm text-sm text-white/65">{company.tagline}</p>
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
          <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-white/55">Quick links</h2>
          <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2.5 text-[15px] md:grid-cols-1">
            {nav.map((n) => (
              <li key={n.id}>
                <a
                  href={`#${n.id}`}
                  className="footer-link"
                  onClick={(e) => {
                    e.preventDefault()
                    scrollToId(n.id)
                  }}
                >
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-white/55">Products</h2>
          <ul className="mt-4 space-y-2.5 text-[15px]">
            {products.map((p) => (
              <li key={p.id}>
                <a href={asset(p.tds)} download className="footer-link">
                  {p.short} TDS<span className="sr-only"> (PDF)</span>
                </a>
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
        <div className="container-x flex flex-col gap-2 pb-24 pt-6 text-xs text-white/55 md:pb-6 md:pr-20 md:flex-row md:items-center md:justify-between">
          <p>© {year} {company.name}. All rights reserved.</p>
          <p>{listFormat.format(products.map((p) => p.name))} are trademarks of {company.name}.</p>
        </div>
      </div>
    </footer>
  )
}
