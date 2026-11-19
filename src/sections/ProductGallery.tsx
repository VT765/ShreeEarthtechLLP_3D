import { createRef, lazy, Suspense, useCallback, useMemo, useState, type RefObject } from 'react'
import { createPortal } from 'react-dom'
import { sectionCopy } from '../data/sections'
import { sections } from '../data/nav'
import { products, type GradeId } from '../data/products'
import { useReveal } from '../hooks/useReveal'
import { useInView } from '../hooks/useInView'
import { isLowEnd, useIsMobile, useReducedMotion } from '../hooks/useMedia'
import type { BagPointer } from '../scenes/ProductBag'
import SectionHeader from '../components/SectionHeader'
import ProductCard from './products/ProductCard'
import SpecTable from './products/SpecTable'
import '../styles/products.css'

// three / R3F / drei load only in this lazy chunk, and only on capable desktop devices.
const BagViews = lazy(() => import('./products/BagViews'))

const copy = sectionCopy.products

function hasWebGL() {
  try {
    const gl = document.createElement('canvas').getContext('webgl2') ?? document.createElement('canvas').getContext('webgl')
    gl?.getExtension('WEBGL_lose_context')?.loseContext() // free the probe context straight away
    return !!gl
  } catch {
    return false
  }
}

export default function ProductGallery() {
  const ref = useReveal<HTMLElement>()
  const reduced = useReducedMotion()
  const mobile = useIsMobile()
  const [capable] = useState(() => typeof window !== 'undefined' && !isLowEnd() && hasWebGL())
  const use3D = capable && !reduced && !mobile
  const [gridRef, inView] = useInView<HTMLDivElement>('150px')
  const [live, setLive] = useState(false)

  // Stable per-product refs: 3D slot and mutable hover pointer.
  const slots = useMemo(() => Object.fromEntries(products.map((p) => [p.id, createRef<HTMLDivElement>()])) as Record<GradeId, RefObject<HTMLDivElement | null>>, [])
  const pointers = useMemo(() => Object.fromEntries(products.map((p) => [p.id, { x: 0, y: 0, active: false }])) as Record<GradeId, BagPointer>, [])
  const viewItems = useMemo(
    () => products.map((p) => ({ id: p.id, name: p.name, color: p.color, track: slots[p.id], pointer: pointers[p.id] })),
    [slots, pointers],
  )
  const onReady = useCallback((ready: boolean) => setLive(ready), [])


  const show3D = use3D && inView

  return (
    <section id={sections.products} ref={ref} className="section bg-cream" aria-labelledby="products-title">
      <div className="container-x">
        <SectionHeader
          eyebrow={copy.eyebrow}
          title={<span id="products-title">{copy.title}</span>}
          body={copy.body}
        />

        <div ref={gridRef} className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {products.map((p, i) => (
            <ProductCard
              key={p.id}
              p={p}
              index={i}
              slotRef={use3D ? slots[p.id] : undefined}
              pointer={use3D ? pointers[p.id] : undefined}
              live={show3D && live}
              reveal={!use3D}
            />
          ))}
        </div>

        <SpecTable />
      </div>

      {show3D &&
        createPortal(
          <Suspense fallback={null}>
            <BagViews items={viewItems} onReady={onReady} />
          </Suspense>,
          document.body,
        )}
    </section>
  )
}
