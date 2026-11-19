import type { CSSProperties, Ref } from 'react'
import { hero } from '../../data/hero'
import { asset } from '../../lib/asset'

type Props = {
  ref?: Ref<HTMLDivElement>
  overlay?: boolean
  inactive?: boolean
  style?: CSSProperties
}

export default function Slide2({ ref, overlay, inactive, style }: Props) {
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
          <p className="mt-3 font-display text-lg font-semibold text-gold-light sm:text-xl">{s.subheading}</p>
          <div className="mt-5 space-y-4 text-[15px] leading-relaxed text-white/75 sm:text-[17px]">
            {s.body.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </div>
        <figure
          className={`hero-frame relative mx-auto w-full max-w-[460px] lg:col-span-5 lg:col-start-8 lg:mt-28 lg:max-w-[400px] ${
            overlay ? '[@media(max-height:719px)_and_(max-width:1023px)]:hidden' : ''
          }`}
        >
          <img
            src={asset(s.image.src)}
            alt={s.image.alt}
            width={800}
            height={600}
            decoding="async"
            className="aspect-[16/10] w-full rounded-xl object-cover lg:aspect-[4/3]"
          />
        </figure>
      </div>
    </div>
  )
}
