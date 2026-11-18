import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { hero } from '../../content'
import { gsap } from '../../lib/gsap'
import { useIsMobile, useReducedMotion } from '../../hooks/useMedia'
import Magnetic from '../../components/Magnetic'
import { scrollToId } from '../../components/SmoothScroll'
import { ForegroundLayer, HillsLayer, PlantLayer, SkyLayer, VB_H, VB_W } from './PlantLayers'
import DustParticles from './DustParticles'
import { asset } from '../../lib/asset'


const ORIGIN = { x: 0.62, y: 0.68 } // rotary dryer / activation tanks
const LAYER_FILES = ['layer-0-sky', 'layer-1-hills', 'layer-2-plant', 'layer-3-foreground']

/** Use real WebP artwork from /public/hero when it exists, else the SVG placeholder. */
function useHeroAssets() {
  const [ok, setOk] = useState(false)
  useEffect(() => {
    const img = new Image()
    img.onload = () => setOk(true)
    img.src = asset('hero/layer-2-plant.webp')
  }, [])
  return ok
}

type Spot = { label: string; left: number; top: number; edge: 'left' | 'right' | null }

export default function Hero() {
  const root = useRef<HTMLElement>(null)
  const isMobile = useIsMobile()
  const reduced = useReducedMotion()
  const hasAssets = useHeroAssets()
  const plantScale = isMobile ? 1.6 : 2.4
  const [spots, setSpots] = useState<Spot[]>([])

  // Project hotspot coordinates (viewBox %) through the "slice" fit and final zoom into screen px.
  useEffect(() => {
    const calc = () => {
      const el = root.current
      if (!el) return
      const W = el.clientWidth
      const H = el.clientHeight
      const s = Math.max(W / VB_W, H / VB_H)
      const ox = (W - VB_W * s) / 2
      const oy = H - VB_H * s
      const fx = ORIGIN.x * W
      const fy = ORIGIN.y * H
      const z = reduced ? 1 : plantScale
      setSpots(
        hero.hotspots.map((h) => {
          const sx = ox + (h.x / 100) * VB_W * s
          const sy = oy + (h.y / 100) * VB_H * s
          let left = fx + (sx - fx) * z
          const top = Math.min(H - 80, Math.max(120, fy + (sy - fy) * z))
          let edge: Spot['edge'] = null
          if (left < 90) (left = 24), (edge = 'left')
          else if (left > W - 90) (left = W - 24), (edge = 'right')
          return { label: h.label, left, top, edge }
        }),
      )
    }
    calc()
    window.addEventListener('resize', calc)
    return () => window.removeEventListener('resize', calc)
  }, [plantScale, reduced])

  useLayoutEffect(() => {
    const el = root.current
    if (!el || reduced) return
    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(el)
      const origin = `${ORIGIN.x * 100}% ${ORIGIN.y * 100}%`
      gsap.set(q('[data-layer]'), { transformOrigin: origin })
      gsap.from(q('[data-intro]'), { y: 30, opacity: 0, stagger: 0.1, duration: 0.8, ease: 'power3.out', delay: 1.9 })

      const scales = isMobile ? [1.05, 1.25, 1.6, 1.6] : [1.15, 1.4, 2.4, 3.2]
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: el,
          start: 'top top',
          end: isMobile ? '+=120%' : '+=200%',
          scrub: 1,
          pin: true,
          anticipatePin: 1,
        },
      })
      tl.to(q('[data-copy]'), { y: -60, opacity: 0, duration: 0.3, ease: 'power1.in' }, 0)
        .to(q('[data-cue]'), { opacity: 0, duration: 0.15 }, 0)
        .to(q('[data-layer="0"]'), { scale: scales[0], duration: 1 }, 0)
        .to(q('[data-layer="1"]'), { scale: scales[1], duration: 1 }, 0)
        .to(q('[data-layer="2"]'), { scale: scales[2], duration: 1 }, 0)
        .to(q('[data-layer="3"]'), { scale: scales[3], opacity: 0, duration: 1, ...(isMobile ? {} : { filter: 'blur(6px)' }) }, 0)
        .to(q('[data-vignette]'), { opacity: 1, duration: 0.4 }, 0.6)
        .fromTo(q('[data-spots]'), { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.2 }, 0.68)
        // crossfade to navy so the zoom reads as "entering the plant"
        .to(q('[data-spots]'), { opacity: 0, duration: 0.12 }, 1.08)
        .to(q('[data-fade]'), { opacity: 1, duration: 0.2 }, 1.05)

      // Mouse parallax: layers drift 2–12px at different depths.
      if (!isMobile) {
        const depth = [2, 5, 8, 12]
        const movers = depth.map((d, i) => ({
          d,
          x: gsap.quickTo(q(`[data-parallax="${i}"]`), 'x', { duration: 0.9, ease: 'power3.out' }),
          y: gsap.quickTo(q(`[data-parallax="${i}"]`), 'y', { duration: 0.9, ease: 'power3.out' }),
        }))
        const onMove = (e: PointerEvent) => {
          const nx = e.clientX / window.innerWidth - 0.5
          const ny = e.clientY / window.innerHeight - 0.5
          movers.forEach((m) => {
            m.x(-nx * m.d * 2)
            m.y(-ny * m.d * 2)
          })
        }
        el.addEventListener('pointermove', onMove)
        return () => el.removeEventListener('pointermove', onMove)
      }
    }, el)
    return () => ctx.revert()
  }, [isMobile, reduced])

  const layers: ReactNode[] = hasAssets
    ? LAYER_FILES.map((f) => (
        <img key={f} src={asset(`hero/${f}.webp`)} alt="" className="absolute inset-0 h-full w-full object-cover object-[62%_100%]" fetchPriority="high" />
      ))
    : [<SkyLayer key="0" />, <HillsLayer key="1" />, <PlantLayer key="2" />, <ForegroundLayer key="3" />]

  return (
    <section
      id="home"
      ref={root}
      className="on-dark relative h-[100svh] min-h-[640px] overflow-hidden bg-midnight"
      aria-label="Shree Earthtech — Activated Bleaching Earth manufacturer"
    >
      {/* Panorama layers */}
      <div className="absolute inset-0" aria-hidden>
        {layers.map((layer, i) => (
          <div key={i} data-layer={i} className="absolute inset-0 will-change-transform">
            <div data-parallax={i} className="absolute -inset-4">
              {layer}
            </div>
            {i === 2 && !reduced && <DustParticles count={isMobile ? 24 : 60} />}
          </div>
        ))}
        <div className="absolute inset-x-0 top-0 h-56 bg-gradient-to-b from-ink-deep/70 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_18%_40%,rgba(5,15,30,0.7)_0%,rgba(5,15,30,0.35)_35%,transparent_60%)]" />
      </div>

      {/* Closing navy vignette */}
      <div
        data-vignette
        className="pointer-events-none absolute inset-0 opacity-0"
        style={{ background: 'radial-gradient(ellipse at 62% 62%, transparent 30%, rgba(7,31,58,0.75) 70%, #071F3A 100%)' }}
        aria-hidden
      />

      <div data-fade className="pointer-events-none absolute inset-0 bg-midnight opacity-0" aria-hidden />

      {/* Hotspots revealed at the end of the zoom */}
      <ul data-spots className={`pointer-events-none absolute inset-0 ${reduced ? '' : 'opacity-0'}`} aria-label="Plant areas">
        {spots.map((s) => (
          <li
            key={s.label}
            className={`absolute flex items-center gap-2 ${s.edge === 'right' ? '-translate-x-full flex-row-reverse' : s.edge ? '' : '-translate-x-1/2'}`}
            style={{ left: s.left, top: s.top }}
          >
            {s.edge === 'left' && <ChevronLeft className="h-4 w-4 text-gold-light" />}
            {s.edge === 'right' && <ChevronRight className="h-4 w-4 text-gold-light" />}
            {!s.edge && (
              <span className="relative grid h-4 w-4 place-items-center">
                <span className="pulse-ring absolute inset-0 rounded-full bg-gold-light/60" />
                <span className="h-2 w-2 rounded-full bg-gold-light" />
              </span>
            )}
            <span className="whitespace-nowrap rounded-full border border-gold-light/40 bg-midnight/80 px-3 py-1.5 text-xs font-semibold tracking-wide text-white backdrop-blur">
              {s.label}
            </span>
          </li>
        ))}
      </ul>

      {/* Copy */}
      <div data-copy className="container-x relative z-10 flex h-full flex-col justify-start pt-[16vh] md:pt-[17vh]">
        <p data-intro className="eyebrow">
          {hero.eyebrow}
        </p>
        <h1 data-intro className="mt-5 max-w-4xl text-[clamp(40px,6.4vw,76px)] leading-[1.02]">
          {hero.title[0]}
          <br />
          <span className="text-oil-gradient">{hero.title[1]}</span>
        </h1>
        <p data-intro className="mt-6 max-w-xl text-lg text-white/80 md:text-xl">
          {hero.subhead}
        </p>
        <div data-intro className="mt-9 flex flex-wrap gap-4">
          <Magnetic>
            <Link to="/products" className="btn btn-gold">
              Explore Products <ArrowRight className="h-4 w-4" />
            </Link>
          </Magnetic>
          <Magnetic>
            <Link to="/contact" className="btn btn-ghost-dark">
              Request a Quote
            </Link>
          </Magnetic>
        </div>
      </div>

      {/* Scroll cue */}
      <button
        data-cue
        onClick={() => scrollToId('about')}
        className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 text-xs uppercase tracking-[0.2em] text-white/70"
      >
        Scroll to enter the plant
        <span className="relative h-10 w-6 rounded-full border border-white/40">
          <span className="float-y absolute left-1/2 top-2 h-2 w-1 -translate-x-1/2 rounded bg-gold-light" />
        </span>
      </button>
    </section>
  )
}
