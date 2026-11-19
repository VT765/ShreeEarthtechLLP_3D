import type { CSSProperties, ReactNode, Ref } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { hero } from '../../data/hero'

type Props = {
  ref?: Ref<HTMLDivElement>
  overlay?: boolean
  inactive?: boolean
  style?: CSSProperties
  /** Right-hand illustration for the static fallback; the pinned hero shows the 3D plant there instead. */
  art?: ReactNode
}

export default function Slide2({ ref, overlay, inactive, style, art }: Props) {
  const s = hero.slide2
  return (
    <div
      ref={ref}
      inert={inactive}
      aria-hidden={inactive || undefined}
      style={style}
      className={overlay ? 'hero-slide absolute inset-0 flex items-center pb-10 pt-[88px]' : 'relative py-16 lg:py-24'}
    >
      <div className="container-x grid items-center gap-8 lg:grid-cols-12 lg:gap-10">
        <div className="min-w-0 lg:col-span-6">
          <h2 id="about-title" className="h2">
            {s.heading}
          </h2>
          <p className="mt-3 font-display text-lg font-semibold text-orange-light sm:text-xl">{s.subheading}</p>
          <div className="mt-5 space-y-4 text-[15px] leading-relaxed text-white/75 sm:text-[17px]">
            {s.body.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
          <Link to={s.profileLink.to} className="hero-text-link mt-6 inline-flex items-center gap-2 font-semibold text-orange-light">
            {s.profileLink.label} <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
        {art && <div className="mx-auto w-full max-w-[460px] lg:col-span-5 lg:col-start-8 lg:max-w-none">{art}</div>}
      </div>
    </div>
  )
}
