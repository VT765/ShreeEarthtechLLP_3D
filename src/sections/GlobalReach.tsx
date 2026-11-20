import { lazy, Suspense, useState } from 'react'
import { sectionCopy } from '../data/sections'
import { sections } from '../data/nav'
import { exportCountries, origin, regions } from '../data/exportCountries'
import SectionHeader from '../components/SectionHeader'
import { useInView } from '../hooks/useInView'
import { useIsMobile, useReducedMotion } from '../hooks/useMedia'
import { useSceneActive } from '../hooks/useSceneActive'
import { tightPunct } from '../lib/tightPunct'
import StaticMap, { hasWebGL } from './globe/StaticMap'
import '../styles/global-reach.css'

// cobe (WebGL) lives in its own chunk and only loads when the globe nears the viewport.
const Globe = lazy(() => import('./globe/Globe'))

const total = exportCountries.length
const byRegion = regions.map((r) => ({ region: r, countries: exportCountries.filter((c) => c.region === r).map((c) => c.name) }))

/**
 * Export markets: the count, the regions and countries behind it, and the globe. On home (`summary`) the
 * section slides over the dark About block with rounded corners.
 */
export default function GlobalReach({ variant = 'full' }: { variant?: 'summary' | 'full' }) {
  const reduced = useReducedMotion()
  const mobile = useIsMobile()
  const [webgl] = useState(hasWebGL)
  const copy = sectionCopy.reach

  // Near the viewport → mount (latched); the most visible scene on the page → render.
  const [globeRef, near] = useInView<HTMLDivElement>('150px', true)
  const active = useSceneActive(globeRef)

  return (
    <section
      id={sections.reach}
      className={`section gr-section overflow-hidden ${variant === 'summary' ? 'section-sheet' : ''}`}
      aria-labelledby="global-reach-title"
    >
      <div className="container-x grid items-center gap-12 lg:grid-cols-[1fr_1.05fr] lg:gap-16">
        <div>
          <SectionHeader
            id="global-reach-title"
            title={
              <>
                {copy.titleLead} <span className="text-accent-text">{tightPunct(copy.titleAccent)}</span>
              </>
            }
            body={copy.body}
          />

          <p className="mt-6 flex items-end gap-4">
            <span className="font-display text-[clamp(56px,8vw,96px)] font-extrabold leading-none tracking-tight text-charcoal">
              {total}
              <span className="text-orange">+</span>
            </span>
            <span className="pb-2 text-sm font-semibold leading-snug text-stone">
              countries
              <br />
              served
            </span>
          </p>

          <dl className="mt-8 grid gap-x-8 gap-y-4 sm:grid-cols-2" aria-label={`Export markets supplied from ${origin.name}`}>
            {byRegion.map(({ region, countries }) => (
              <div key={region} className="border-t border-clay pt-3">
                <dt className="text-sm font-semibold text-ink">{region}</dt>
                <dd className="mt-1 text-sm text-stone">{countries.join(', ')}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div ref={globeRef} className="relative mx-auto w-full max-w-[340px] sm:max-w-[460px] lg:max-w-[580px]">
          {webgl ? (
            <div className="gr-globe-frame">
              <div className="gr-halo" aria-hidden="true" />
              {near ? (
                <Suspense fallback={<GlobeSkeleton />}>
                  <Globe active={active} reduced={reduced} mobile={mobile} />
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
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-orange-light ring-2 ring-[#FFE3C2]" />
            {copy.dispatch}
          </p>
        </div>
      </div>
    </section>
  )
}

function GlobeSkeleton() {
  return <div className="gr-globe-skeleton" aria-hidden="true" />
}
