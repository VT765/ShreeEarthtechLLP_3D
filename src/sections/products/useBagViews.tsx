import { createRef, lazy, Suspense, useCallback, useMemo, useState, type RefObject } from 'react'
import { createPortal } from 'react-dom'
import type { Product } from '../../data/products'
import { useInView } from '../../hooks/useInView'
import { isLowEnd, useIsMobile, useReducedMotion } from '../../hooks/useMedia'
import type { BagPointer } from '../../scenes/ProductPouch'

// three / R3F / drei load only in this lazy chunk, and only on capable desktop devices.
const BagViews = lazy(() => import('./BagViews'))

function hasWebGL() {
  try {
    const gl = document.createElement('canvas').getContext('webgl2') ?? document.createElement('canvas').getContext('webgl')
    gl?.getExtension('WEBGL_lose_context')?.loseContext() // free the probe context straight away
    return !!gl
  } catch {
    return false
  }
}

/**
 * 3D pouches for a set of product slots. Returns per-product slot refs and hover pointers to hand to the
 * cards, `live` once the pouches are drawing (cards fade their poster image out), and the portal to render.
 * Phones, reduced motion, low-end devices and no-WebGL browsers keep the poster images.
 */
export function useBagViews<T extends HTMLElement = HTMLDivElement>(items: Product[]) {
  const reduced = useReducedMotion()
  const mobile = useIsMobile()
  const [capable] = useState(() => typeof window !== 'undefined' && !isLowEnd() && hasWebGL())
  const enabled = capable && !reduced && !mobile
  const [areaRef, inView] = useInView<T>('150px')
  const [ready, setReady] = useState(false)
  const onReady = useCallback((r: boolean) => setReady(r), [])

  const slots = useMemo(() => Object.fromEntries(items.map((p) => [p.id, createRef<HTMLDivElement>()])) as Record<string, RefObject<HTMLDivElement | null>>, [items])
  const pointers = useMemo(() => Object.fromEntries(items.map((p) => [p.id, { x: 0, y: 0, active: false }])) as Record<string, BagPointer>, [items])
  const viewItems = useMemo(() => items.map((p) => ({ product: p, track: slots[p.id], pointer: pointers[p.id] })), [items, slots, pointers])

  const show = enabled && inView
  const portal = show
    ? createPortal(
        <Suspense fallback={null}>
          <BagViews items={viewItems} onReady={onReady} />
        </Suspense>,
        document.body,
      )
    : null

  return {
    enabled,
    areaRef,
    /** Per-product 3D slot refs and hover pointers; undefined when the pouches are off (posters only). */
    slots: enabled ? slots : undefined,
    pointers: enabled ? pointers : undefined,
    live: show && ready,
    portal,
  }
}
