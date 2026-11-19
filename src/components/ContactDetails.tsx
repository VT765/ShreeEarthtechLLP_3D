import type { ReactNode } from 'react'
import { Clock, Download, Mail, MapPin, Phone } from 'lucide-react'
import { company, telHref } from '../data/company'
import { asset } from '../lib/asset'
import SocialIcon from './Social'

export const whatsappHref = `https://wa.me/${company.whatsapp}?text=${encodeURIComponent('Hello Shree Earthtech, I would like a quote for activated bleaching earth.')}`

function ContactRow({ icon, label, children }: { icon: ReactNode; label: string; children: ReactNode }) {
  return (
    <li className="flex gap-4">
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/5 text-orange-light">{icon}</span>
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/60">{label}</p>
        <div className="mt-0.5 text-[15px] text-white/85">{children}</div>
      </div>
    </li>
  )
}

/** Phone, email, WhatsApp, address, hours, brochure and map — on a dark surface (Contact page). */
export default function ContactDetails() {
  return (
    <div className="footer-dark on-dark">
      <address className="not-italic">
        <ul className="space-y-5">
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

      <div className="mt-8 flex flex-wrap gap-3">
        <a href={asset(company.brochure)} download className="btn btn-orange">
          <Download className="h-4 w-4" aria-hidden /> Download Brochure
        </a>
        <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="btn btn-ghost-dark">
          <SocialIcon name="WhatsApp" className="h-4 w-4" /> WhatsApp us
        </a>
      </div>

      <div className="mt-8 overflow-hidden rounded-2xl border border-white/10 shadow-[0_20px_40px_rgba(0,0,0,0.3)]">
        <iframe
          title={`Map: ${company.name}, ${company.address}`}
          src={company.mapEmbed}
          className="block h-60 w-full grayscale-[35%] md:h-64"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </div>
  )
}
