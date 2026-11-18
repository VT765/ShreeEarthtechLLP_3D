import { BadgeCheck } from 'lucide-react'
import { certifications } from '../content'

export default function TrustStrip() {
  const items = [...certifications, ...certifications]
  return (
    <section aria-label="Certifications" className="relative overflow-hidden border-y border-white/10 bg-midnight py-6">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-midnight to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-midnight to-transparent" />
      <ul className="marquee flex w-max">
        {items.map((c, i) => (
          <li key={i} aria-hidden={i >= certifications.length} className="flex items-center gap-3 whitespace-nowrap pr-12 font-mono text-sm tracking-wide text-white/85">
            <BadgeCheck className="h-5 w-5 text-gold-light" strokeWidth={1.75} />
            {c.title}
            <span className="ml-9 h-1 w-1 rounded-full bg-brand-gold/60" />
          </li>
        ))}
      </ul>
    </section>
  )
}
