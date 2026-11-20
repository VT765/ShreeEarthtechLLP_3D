import { useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { sectionCopy } from '../data/sections'
import { sections } from '../data/nav'
import { plantGallery } from '../data/plantGallery'
import SectionHeader from '../components/SectionHeader'
import { asset } from '../lib/asset'
import { useReducedMotion } from '../hooks/useMedia'
import '../styles/plant-gallery.css'

// Intrinsic size of the plant images (3:2). Keeps layout stable before they load.
const IMG_W = 1200
const IMG_H = 800

/**
 * Manufacturing steps 01–06. Phones: a vertical stepper. Tablet / desktop: a horizontal row that scrolls
 * natively (trackpad, touch, scrollbar, arrow keys when focused) with snap points and prev / next buttons.
 * Vertical page scrolling is never captured.
 */
export default function PlantGallery() {
  const reduced = useReducedMotion()
  const scroller = useRef<HTMLOListElement>(null)
  const [edge, setEdge] = useState({ start: true, end: false })

  useEffect(() => {
    const el = scroller.current
    if (!el) return
    const update = () => setEdge({ start: el.scrollLeft <= 4, end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 4 })
    update()
    el.addEventListener('scroll', update, { passive: true })
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => {
      el.removeEventListener('scroll', update)
      ro.disconnect()
    }
  }, [])

  const step = (dir: 1 | -1) => {
    const el = scroller.current
    const slide = el?.querySelector('li')
    if (!el || !slide) return
    const gap = parseFloat(getComputedStyle(el).columnGap) || 0
    el.scrollBy({ left: dir * (slide.getBoundingClientRect().width + gap), behavior: reduced ? 'auto' : 'smooth' })
  }

  return (
    <section id={sections.plant} className="section pg-section" aria-labelledby="plant-gallery-title">
      <div className="container-x flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <SectionHeader id="plant-gallery-title" title={sectionCopy.plant.title} body={sectionCopy.plant.body} />
        <div className="hidden shrink-0 gap-2 md:flex">
          <button type="button" className="pg-nav" onClick={() => step(-1)} disabled={edge.start} aria-controls="plant-steps" aria-label="Previous step">
            <ChevronLeft className="h-5 w-5" aria-hidden />
          </button>
          <button type="button" className="pg-nav" onClick={() => step(1)} disabled={edge.end} aria-controls="plant-steps" aria-label="Next step">
            <ChevronRight className="h-5 w-5" aria-hidden />
          </button>
        </div>
      </div>

      {/* Focusable so arrow keys scroll it; horizontal gestures inside are left to the browser, not Lenis. */}
      <ol id="plant-steps" ref={scroller} className="pg-track" tabIndex={0} aria-label="Manufacturing steps" data-lenis-prevent-horizontal>
        {plantGallery.map((item, i) => (
          <li key={item.src} className="pg-slide">
            <figure className="card pg-card h-full overflow-hidden">
              <div className="pg-frame">
                <img className="pg-img" src={asset(item.src)} alt={item.alt} width={IMG_W} height={IMG_H} loading="lazy" decoding="async" draggable={false} />
              </div>
              <figcaption className="flex gap-4 p-5 md:p-6">
                <span className="pg-num" aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div>
                  <h3 className="text-lg">
                    <span className="sr-only">Step {i + 1}: </span>
                    {item.title}
                  </h3>
                  <p className="mt-1 text-[15px] leading-relaxed">{item.caption}</p>
                </div>
              </figcaption>
            </figure>
          </li>
        ))}
      </ol>
    </section>
  )
}
