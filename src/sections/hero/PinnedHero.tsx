import { lazy, Suspense, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { gsap } from '../../lib/gsap'
import { sections } from '../../data/nav'
import { useInView } from '../../hooks/useInView'
import Slide1 from './Slide1'
import Slide2 from './Slide2'

const HeroCanvas = lazy(() => import('../../scenes/hero/HeroCanvas'))

/** scrollToId() lands this many px above its target. */
const NAV_OFFSET = 70

/**
 * Pinned two-slide hero. Scroll progress (0 → 1) drives both the copy swap and the crystal-to-plant assembly;
 * the scene reads `progress` from a ref every frame, so scrolling never re-renders React.
 */
export default function PinnedHero() {
  const wrap = useRef<HTMLDivElement>(null)
  const pin = useRef<HTMLElement>(null)
  const slide1 = useRef<HTMLDivElement>(null)
  const slide2 = useRef<HTMLDivElement>(null)
  const marker = useRef<HTMLSpanElement>(null)
  const progress = useRef(0)
  const [active, setActive] = useState<0 | 1>(0)
  const [stage, inView] = useInView<HTMLDivElement>('0px')
  const [load, setLoad] = useState(false)
  const [ready, setReady] = useState(false)

  // Text paints first; three.js is fetched after page load once the browser is idle. On touch/small
  // screens it also waits for the first interaction (or 4s) so it never competes with first paint.
  useEffect(() => {
    let idle = 0
    let timer = 0
    const events = ['pointerdown', 'wheel', 'touchstart', 'keydown', 'scroll'] as const
    const go = () => {
      cleanup()
      setLoad(true)
    }
    const whenIdle = () => {
      if ('requestIdleCallback' in window) idle = requestIdleCallback(go, { timeout: 1200 })
      else timer = setTimeout(go, 250)
    }
    const onLoad = () => {
      if (!window.matchMedia('(pointer: coarse), (max-width: 767px)').matches) return whenIdle()
      events.forEach((e) => window.addEventListener(e, whenIdle, { once: true, passive: true }))
      timer = window.setTimeout(whenIdle, 4000)
    }
    function cleanup() {
      window.removeEventListener('load', onLoad)
      events.forEach((e) => window.removeEventListener(e, whenIdle))
      if (idle) cancelIdleCallback(idle)
      clearTimeout(timer)
    }
    if (document.readyState === 'complete') onLoad()
    else window.addEventListener('load', onLoad, { once: true })
    return cleanup
  }, [])

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Park the #about marker at the pin-end scroll position (+ the nav offset scrollToId subtracts).
      const placeMarker = (start: number, end: number) => {
        if (marker.current) marker.current.style.top = `${end - start + NAV_OFFSET}px`
      }
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: pin.current,
          pin: true,
          start: 'top top',
          end: '+=220%',
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          // No snap: the plant builds exactly as far as the visitor has scrolled.
          onRefresh: (self) => placeMarker(self.start, self.end),
        },
        onUpdate: () => {
          const p = tl.progress()
          progress.current = p
          setActive(p >= 0.5 ? 1 : 0)
        },
      })
      tl.fromTo(slide1.current, { opacity: 1, y: 0, filter: 'blur(0px)' }, { opacity: 0, y: -40, filter: 'blur(8px)', duration: 0.4 }, 0.1)
        .fromTo(slide2.current, { opacity: 0, y: 40, filter: 'blur(8px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.4 }, 0.5)
        .set({}, {}, 1)
      const st = tl.scrollTrigger
      if (st) placeMarker(st.start, st.end)
    }, wrap)
    return () => ctx.revert()
  }, [])

  return (
    <div ref={wrap} className="hero-root relative">
      <section id={sections.home} ref={pin} aria-labelledby="hero-title" className="on-dark relative h-[100svh] min-h-[560px] overflow-hidden bg-charcoal">
        <div ref={stage} className="absolute inset-0" aria-hidden>
          <div className={`absolute inset-0 transition-opacity duration-1000 ${ready ? 'opacity-100' : 'opacity-0'}`}>
            {load && (
              <Suspense fallback={null}>
                <HeroCanvas progress={progress} active={inView} onReady={() => setReady(true)} />
              </Suspense>
            )}
          </div>
        </div>
        <div className="hero-vignette pointer-events-none absolute inset-0" aria-hidden />
        <Slide1 ref={slide1} overlay inactive={active !== 0} />
        <Slide2 ref={slide2} overlay inactive={active !== 1} style={{ opacity: 0 }} />
      </section>
      {/* Nav target for "About Us": scrolling here shows slide 2 fully and the plant formed (pin end). */}
      <span id={sections.about} ref={marker} className="hero-about-marker" />
    </div>
  )
}
