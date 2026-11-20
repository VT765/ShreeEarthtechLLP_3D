import { createRef, lazy, Suspense, useCallback, useMemo, useState, type RefObject } from 'react'
import { createPortal } from 'react-dom'
import type { Product } from '../../data/products'
import { useInView } from '../../hooks/useInView'
import { isLowEnd, useIsMobile, useReducedMotion } from '../../hooks/useMedia'
import { useSceneActive } from '../../hooks/useSceneActive'

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
 * 3D pouches for a set of product slots. Returns per-product slot refs to hand to the
 * cards, `live` once the pouches are drawing (cards fade their poster image out), and the portal to render.
 * Phones, reduced motion, low-end devices and no-WebGL browsers keep the poster images. While another scene
 * is the visible one (see useSceneActive) the canvas stays mounted but hidden and paused, and the posters show.
 */
export function useBagViews<T extends HTMLElement = HTMLDivElement>(items: Product[]) {
  const reduced = useReducedMotion()
  const mobile = useIsMobile()
  const [capable] = useState(() => typeof window !== 'undefined' && !isLowEnd() && hasWebGL())
  const enabled = capable && !reduced && !mobile
  const [areaRef, inView] = useInView<T>('150px')
  const active = useSceneActive(areaRef)
  const [ready, setReady] = useState(false)
  const onReady = useCallback((r: boolean) => setReady(r), [])

  const slots = useMemo(() => Object.fromEntries(items.map((p) => [p.id, createRef<HTMLDivElement>()])) as Record<string, RefObject<HTMLDivElement | null>>, [items])
  const viewItems = useMemo(() => items.map((p) => ({ product: p, track: slots[p.id] })), [items, slots])

  const show = enabled && inView
  const portal = show
    ? createPortal(
        <Suspense fallback={null}>
          <BagViews items={viewItems} active={active} onReady={onReady} />
        </Suspense>,
        document.body,
      )
    : null

  return {
    enabled,
    areaRef,
    /** Per-product 3D slot refs; undefined when the pouches are off (posters only). */
    slots: enabled ? slots : undefined,
    live: show && ready && active,
    portal,
  }
}
