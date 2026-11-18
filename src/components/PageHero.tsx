import { Link } from 'react-router-dom'
import { SWatermark } from './SCurve'

export default function PageHero({ eyebrow, title, body }: { eyebrow: string; title: string; body: string }) {
  return (
    <section className="on-dark bg-dark-hero relative overflow-hidden pb-20 pt-40">
      <SWatermark className="absolute -right-16 -top-16 h-[520px] w-[420px] text-white/[0.04]" />
      <div className="container-x relative">
        <nav aria-label="Breadcrumb" className="text-sm text-white/60">
          <Link to="/" className="hover:text-gold-light">Home</Link> <span className="mx-2">/</span>
          <span className="text-white/85">{eyebrow}</span>
        </nav>
        <h1 className="mt-6 max-w-3xl text-[clamp(38px,5.5vw,64px)]">{title}</h1>
        <p className="mt-5 max-w-2xl text-lg text-white/75">{body}</p>
      </div>
    </section>
  )
}
