import { Link } from 'react-router-dom'
import { Mail, MapPin, Phone } from 'lucide-react'
import { certifications, company, nav, products } from '../content'
import Logo from './Logo'
import { SWatermark } from './SCurve'
import SocialIcon from './Social'

export default function Footer() {
  return (
    <footer className="on-dark relative overflow-hidden text-white/70" style={{ background: 'linear-gradient(180deg, #050F1E 0%, #071F3A 100%)' }}>
      <SWatermark className="absolute -right-24 -top-10 h-[620px] w-[520px] text-white/[0.035]" />
      <div className="container-x relative grid gap-12 py-20 md:grid-cols-2 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <Logo variant="dark" />
          <p className="mt-6 max-w-sm">
            <span className="font-display text-lg font-bold text-white">Purity, Engineered from the Earth.</span>
            <br />
            High-efficiency Activated Bleaching Earth for edible, industrial and waste oils — made in Gujarat, trusted worldwide.
          </p>
          <div className="mt-6 flex gap-3">
            {company.social.map((s) => (
              <a key={s.name} href={s.href} aria-label={s.name} className="grid h-10 w-10 place-items-center rounded-full border border-white/15 text-gold-light transition-colors hover:border-gold-light hover:bg-gold-light hover:text-midnight">
                <SocialIcon name={s.name} className="h-[18px] w-[18px]" />
              </a>
            ))}
          </div>
        </div>
        <FooterCol title="Quick links" className="lg:col-span-2">
          {nav.slice(1).map((n) => (
            <li key={n.id}>
              <Link to={`/#${n.id}`} className="hover:text-gold-light">{n.label}</Link>
            </li>
          ))}
        </FooterCol>
        <FooterCol title="Products" className="lg:col-span-2">
          {products.map((p) => (
            <li key={p.id}>
              <Link to="/products" className="hover:text-gold-light">{p.short}</Link>
            </li>
          ))}
          <li><Link to="/products#specs" className="hover:text-gold-light">Technical specs</Link></li>
          <li><Link to="/contact" className="hover:text-gold-light">Request a quote</Link></li>
        </FooterCol>
        <FooterCol title="Contact" className="lg:col-span-4">
          <li className="flex gap-3"><MapPin className="mt-1 h-4 w-4 shrink-0 text-gold-light" strokeWidth={1.75} /><span><strong className="block font-semibold text-white">{company.addressLabel}</strong>{company.address}</span></li>
          <li className="flex gap-3"><Phone className="mt-1 h-4 w-4 shrink-0 text-gold-light" strokeWidth={1.75} />{company.phones.join(' / ')}</li>
          <li className="flex gap-3"><Mail className="mt-1 h-4 w-4 shrink-0 text-gold-light" strokeWidth={1.75} />{company.emails.join(' · ')}</li>
        </FooterCol>
      </div>
      <div className="container-x relative flex flex-wrap gap-2 pb-10">
        {certifications.map((c) => (
          <span key={c.id} className="rounded-full border border-gold-light/30 px-3 py-1 font-mono text-xs text-gold-light">{c.title}</span>
        ))}
      </div>
      <div className="relative border-t border-white/10">
        <div className="container-x flex flex-col justify-between gap-2 py-6 text-sm sm:flex-row">
          <p>© 2026 Shree Earthtech LLP. All rights reserved.</p>
          <p>{company.website}</p>
        </div>
      </div>
    </footer>
  )
}

function FooterCol({ title, children, className = '' }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={className}>
      <h3 className="font-display text-sm font-bold uppercase tracking-[0.15em] !text-gold-light">{title}</h3>
      <ul className="mt-5 space-y-3 text-[15px]">{children}</ul>
    </div>
  )
}
