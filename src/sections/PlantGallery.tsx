import { useLayoutEffect, useRef } from 'react'
import { sections } from '../data/nav'
import { plantGallery } from '../data/plantGallery'
import SectionHeader from '../components/SectionHeader'
import { asset } from '../lib/asset'
import { gsap, ScrollTrigger } from '../lib/gsap'
import { useFinePointer, useIsMobile, useReducedMotion } from '../hooks/useMedia'
import { useReveal } from '../hooks/useReveal'
import '../styles/plant-gallery.css'

// Intrinsic size of the plant images (3:2). Keeps layout stable before they load.
const IMG_W = 1200
const IMG_H = 800

type Mode = 'pin' | 'swipe' | 'grid'

/**
 * Manufacturing plant gallery.
 * - Desktop (fine pointer): section pins and the track scrolls horizontally with the page.
 * - Touch / small screens: native horizontal swipe with scroll-snap.
 * - Reduced motion: static responsive grid.
 */
export default function PlantGallery() {
  const reduced = useReducedMotion()
  const mobile = useIsMobile()
  const fine = useFinePointer()
  const mode: Mode = reduced ? 'grid' : fine && !mobile ? 'pin' : 'swipe'

  const sectionRef = useReveal<HTMLElement>()
  const viewportRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLOListElement>(null)
  const barRef = useRef<HTMLSpanElement>(null)

  useLayoutEffect(() => {
    if (mode !== 'pin') return
    const section = sectionRef.current
    const viewport = viewportRef.current
    const track = trackRef.current
    if (!section || !viewport || !track) return

    // Distance the track travels; recomputed on every refresh (resize, image load, other pins).
    const distance = () => Math.max(0, track.scrollWidth - viewport.clientWidth)

    const ctx = gsap.context(() => {
      const tween = gsap.to(track, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${distance()}`,
          pin: true,
          pinSpacing: true,
          scrub: 0.6,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          // Refresh after pins that sit above us (e.g. the hero) so our start accounts for their spacing.
          refreshPriority: -1,
          onUpdate: (self) => {
            if (barRef.current) barRef.current.style.transform = `scaleX(${self.progress})`
          },
        },
      })

      // Images drift inside their frames as they cross the screen.
      gsap.utils.toArray<HTMLElement>('.pg-img', track).forEach((img) => {
        gsap.fromTo(
          img,
          { xPercent: -6 },
          {
            xPercent: 6,
            ease: 'none',
            scrollTrigger: {
              trigger: img.parentElement,
              containerAnimation: tween,
              start: 'left right',
              end: 'right left',
              scrub: true,
            },
          },
        )
      })
    }, section)

    // Layout is size-locked by width/height, but refresh once images settle in case fonts/captions shift.
    let raf = 0
    const refresh = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => ScrollTrigger.refresh())
    }
    const imgs = Array.from(track.querySelectorAll('img'))
    imgs.forEach((img) => !img.complete && img.addEventListener('load', refresh, { once: true }))

    return () => {
      cancelAnimationFrame(raf)
      imgs.forEach((img) => img.removeEventListener('load', refresh))
      ctx.revert()
    }
  }, [mode, sectionRef])

  const pin = mode === 'pin'
  const grid = mode === 'grid'

  return (
    <section
      id={sections.plant}
      ref={sectionRef}
      className={`pg-section relative overflow-hidden ${pin ? 'pg-pin' : 'section'}`}
      aria-labelledby="plant-gallery-title"
    >
      <div className="container-x flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <SectionHeader
          eyebrow="Manufacturing Plant"
          title={<span id="plant-gallery-title">Inside the plant, step by step</span>}
          body="From acid activation to the QC bench: a look at the line that turns raw bentonite into high-performance bleaching earth."
        />
        {pin && (
          <div className="hidden shrink-0 items-center gap-3 text-xs font-semibold uppercase tracking-[0.14em] text-stone md:flex" aria-hidden="true">
            Scroll to explore
            <span className="pg-progress">
              <span ref={barRef} className="pg-progress-bar" />
            </span>
          </div>
        )}
      </div>

      {grid ? (
        <ol className="container-x mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {plantGallery.map((item, i) => (
            <li key={item.src}>
              <Card item={item} index={i} />
            </li>
          ))}
        </ol>
      ) : (
        <div
          ref={viewportRef}
          className={pin ? 'pg-viewport' : 'pg-swipe mt-8'}
          {...(pin ? {} : { tabIndex: 0, role: 'region', 'aria-label': 'Plant gallery, scroll horizontally' })}
        >
          <ol ref={trackRef} className="pg-track">
            {plantGallery.map((item, i) => (
              <li key={item.src} className="pg-slide">
                <Card item={item} index={i} />
              </li>
            ))}
          </ol>
        </div>
      )}
    </section>
  )
}

function Card({ item, index }: { item: (typeof plantGallery)[number]; index: number }) {
  return (
    <figure className="card pg-card h-full overflow-hidden">
      <div className="pg-frame">
        <img
          className="pg-img"
          src={asset(item.src)}
          alt={item.alt}
          width={IMG_W}
          height={IMG_H}
          loading="lazy"
          decoding="async"
          draggable={false}
        />
      </div>
      <figcaption className="flex gap-4 p-5 md:p-6">
        <span className="pg-num" aria-hidden="true">
          {String(index + 1).padStart(2, '0')}
        </span>
        <span>
          <span className="block font-display text-lg font-bold text-ink">{item.title}</span>
          <span className="mt-1 block text-[15px] leading-relaxed">{item.caption}</span>
        </span>
      </figcaption>
    </figure>
  )
}
