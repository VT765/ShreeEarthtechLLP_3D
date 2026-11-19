import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { sectionCopy } from '../data/sections'
import { sections } from '../data/nav'
import { exportCountries, origin } from '../data/exportCountries'
import SectionHeader from '../components/SectionHeader'
import { useInView } from '../hooks/useInView'
import { useIsMobile, useReducedMotion } from '../hooks/useMedia'
import { useReveal } from '../hooks/useReveal'
import { gsap } from '../lib/gsap'
import StaticMap, { hasWebGL } from './globe/StaticMap'
import '../styles/global-reach.css'

// cobe (WebGL) lives in its own chunk and only loads when the globe nears the viewport.
const Globe = lazy(() => import('./globe/Globe'))

const total = exportCountries.length

export default function GlobalReach() {
  const sectionRef = useReveal<HTMLElement>()
  const reduced = useReducedMotion()
  const mobile = useIsMobile()
  const [webgl] = useState(hasWebGL)

  // Near the viewport → mount (latched); on screen and tab visible → render.
  const [globeRef, near] = useInView<HTMLDivElement>('150px')
  const [mounted, setMounted] = useState(false)
  const [tabVisible, setTabVisible] = useState(true)
  useEffect(() => {
    if (near) setMounted(true)
  }, [near])
  useEffect(() => {
    const onVis = () => setTabVisible(!document.hidden)
    document.addEventListener('visibilitychange', onVis)
    return () => document.removeEventListener('visibilitychange', onVis)
  }, [])

  // Count up once the stat is in view (instant under reduced motion).
  const [statRef, statInView] = useInView<HTMLDivElement>('0px', true)
  const numRef = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    const el = numRef.current
    if (!el || !statInView) return
    if (reduced) {
      el.textContent = String(total)
      return
    }
    const o = { v: 0 }
    const tw = gsap.to(o, {
      v: total,
      duration: 1.6,
      ease: 'power2.out',
      onUpdate: () => {
        el.textContent = String(Math.round(o.v))
      },
    })
    return () => {
      tw.kill()
      el.textContent = String(total)
    }
  }, [statInView, reduced])

  return (
    <section id={sections.reach} ref={sectionRef} className="section gr-section overflow-hidden" aria-labelledby="global-reach-title">
      <div className="container-x grid items-center gap-12 lg:grid-cols-[1fr_1.05fr] lg:gap-16">
        <div>
          <SectionHeader
            eyebrow={sectionCopy.reach.eyebrow}
            title={
              <span id="global-reach-title">
                {sectionCopy.reach.titleLead} <span className="text-teal">{sectionCopy.reach.titleAccent}</span>
              </span>
            }
            body={sectionCopy.reach.body}
          />

          <div ref={statRef} className="mt-10 flex items-end gap-5" data-reveal="0.15">
            <p className="font-display text-[clamp(64px,9vw,104px)] font-extrabold leading-none tracking-tight text-midnight">
              <span ref={numRef} aria-hidden="true">
                {reduced ? total : 0}
              </span>
              <span className="text-brand-gold" aria-hidden="true">
                +
              </span>
              <span className="sr-only">{total}+ countries served</span>
            </p>
            <p className="pb-2 text-sm font-semibold uppercase leading-snug tracking-[0.14em] text-stone" aria-hidden="true">
              Countries
              <br />
              served
            </p>
          </div>

          <div className="mt-10" data-reveal="0.2">
            <h3 className="text-base font-bold text-ink">Markets we supply</h3>
            <ul className="mt-4 flex flex-wrap gap-2" aria-label={`Export markets supplied from ${origin.name}`}>
              {exportCountries.map((c) => (
                <li key={c.name} className="gr-chip">
                  <span className="gr-chip-dot" aria-hidden="true" />
                  {c.name}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div ref={globeRef} className="relative mx-auto w-full max-w-[340px] sm:max-w-[460px] lg:max-w-[580px]" data-reveal="0.1">
          {webgl ? (
            <div className="gr-globe-frame">
              <div className="gr-halo" aria-hidden="true" />
              {mounted ? (
                <Suspense fallback={<GlobeSkeleton />}>
                  <Globe active={near && tabVisible} reduced={reduced} mobile={mobile} />
                </Suspense>
              ) : (
                <GlobeSkeleton />
              )}
            </div>
          ) : (
            <div className="relative">
              <StaticMap />
            </div>
          )}
          <p className="relative mt-4 flex items-center justify-center gap-2 text-center text-xs font-medium text-stone" aria-hidden="true">
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-gold-light ring-2 ring-[#FFF3C4]" />
            {sectionCopy.reach.dispatch}
          </p>
        </div>
      </div>
    </section>
  )
}

function GlobeSkeleton() {
  return <div className="gr-globe-skeleton" aria-hidden="true" />
}
