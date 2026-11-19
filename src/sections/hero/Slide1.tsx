import type { ReactNode, Ref } from 'react'
import { ArrowRight, Download } from 'lucide-react'
import { hero } from '../../data/hero'
import { company } from '../../data/company'
import { sections } from '../../data/nav'
import { asset } from '../../lib/asset'
import { scrollToId } from '../../components/SmoothScroll'
import CardStack from './CardStack'

type Props = {
  ref?: Ref<HTMLDivElement>
  /** Layered over the canvas inside the pinned hero (vs. a normal stacked block). */
  overlay?: boolean
  /** Hidden by the scroll swap: removed from tab order and the a11y tree. */
  inactive?: boolean
  /** Right-hand illustration for the static fallback. */
  art?: ReactNode
}

export default function Slide1({ ref, overlay, inactive, art }: Props) {
  const s = hero.slide1
  return (
    <div
      ref={ref}
      inert={inactive}
      aria-hidden={inactive || undefined}
      className={overlay ? 'hero-slide absolute inset-0 flex items-center pb-14 pt-[88px]' : 'relative pb-16 pt-[112px] lg:pb-24 lg:pt-[140px]'}
    >
      <div className="container-x grid items-center gap-10 lg:grid-cols-12">
        <div className="min-w-0 lg:col-span-7 xl:col-span-6">
          <p className="eyebrow">{s.eyebrow}</p>
          <h1 id="hero-title" className="mt-3 text-[clamp(2.1rem,6.2vw,4.5rem)] leading-[1.04] sm:mt-4">
            {s.title}
          </h1>
          <p className="mt-4 max-w-[560px] text-[15px] leading-relaxed text-white/75 sm:mt-5 sm:text-lg">{s.body}</p>
          <div className="mt-6 flex flex-wrap gap-3 sm:mt-8">
            <button type="button" className="btn btn-gold" onClick={() => scrollToId(sections.contact)}>
              {s.primaryCta} <ArrowRight className="h-4 w-4" aria-hidden />
            </button>
            <a href={asset(company.brochure)} download className="btn btn-ghost-dark">
              <Download className="h-4 w-4" aria-hidden /> {s.secondaryCta}
            </a>
          </div>
          <CardStack className="mt-8 sm:mt-10 [@media(max-height:680px)]:hidden" />
        </div>
        {art && <div className="lg:col-span-5 xl:col-start-8">{art}</div>}
      </div>
      {overlay && <ScrollCue />}
    </div>
  )
}

function ScrollCue() {
  return (
    <div className="absolute inset-x-0 bottom-5 flex flex-col items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.25em] text-white/60 [@media(max-height:600px)]:hidden" aria-hidden>
      Scroll
      <span className="hero-scroll-line" />
    </div>
  )
}
