import { useEffect, useRef, useState, type PointerEvent } from 'react'
import createGlobe, { type Arc, type Marker } from 'cobe'
import { exportCountries, origin } from '../../data/exportCountries'

type Props = {
  /** Render loop runs only while true (section on screen and tab visible). */
  active: boolean
  reduced: boolean
  mobile: boolean
}

const rgb = (hex: string): [number, number, number] => {
  const n = parseInt(hex.slice(1), 16)
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255]
}

const TEAL = rgb('#2C6A99')
const NAVY = rgb('#2B241E')
const GOLD = rgb('#F2A25C')
const INDIA = rgb('#FFE3C2')

const rad = (d: number) => (d * Math.PI) / 180

// Face the centre of the destination spread (India sits near it), slightly tilted north.
const lngs = exportCountries.map((c) => c.lng).concat(origin.lng)
const centreLng = (Math.min(...lngs) + Math.max(...lngs)) / 2
const BASE_PHI = Math.PI - (rad(centreLng) - Math.PI / 2)
const BASE_THETA = 0.28

const markers: Marker[] = [
  { location: [origin.lat, origin.lng], size: 0.09, color: INDIA, id: 'india' },
  ...exportCountries.map<Marker>((c) => ({ location: [c.lat, c.lng], size: 0.045, color: GOLD })),
]
const arcs: Arc[] = exportCountries.map((c) => ({ from: [origin.lat, origin.lng], to: [c.lat, c.lng] }))

/** cobe globe: navy sphere, teal land dots, gold arcs from India. Renders only when `active`. */
export default function Globe({ active, reduced, mobile }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const globeRef = useRef<ReturnType<typeof createGlobe> | null>(null)
  const sizeRef = useRef(0)
  const drag = useRef({ down: false, x: 0, offset: 0, target: 0 })
  const [ready, setReady] = useState(false)
  const dpr = Math.min(window.devicePixelRatio || 1, mobile ? 1.5 : 2)

  // Create / destroy the WebGL globe.
  useEffect(() => {
    const canvas = canvasRef.current
    const wrap = wrapRef.current
    if (!canvas || !wrap) return
    const size = wrap.clientWidth || 400
    sizeRef.current = size
    const globe = createGlobe(canvas, {
      devicePixelRatio: dpr,
      width: size,
      height: size,
      phi: BASE_PHI,
      theta: BASE_THETA,
      dark: 1,
      diffuse: 1.2,
      mapSamples: mobile ? 12000 : 20000,
      mapBrightness: 5.5,
      mapBaseBrightness: 0.02,
      baseColor: TEAL,
      markerColor: GOLD,
      glowColor: NAVY,
      markers,
      arcs,
      arcColor: GOLD,
      arcWidth: mobile ? 0.6 : 0.5,
      arcHeight: 0.25,
      markerElevation: 0.02,
    })
    globeRef.current = globe
    const raf = requestAnimationFrame(() => setReady(true))

    const ro = new ResizeObserver(() => {
      const s = wrap.clientWidth
      if (!s || s === sizeRef.current) return
      sizeRef.current = s
      globe.update({ width: s, height: s })
    })
    ro.observe(wrap)
    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      globe.destroy()
      globeRef.current = null
    }
  }, [dpr, mobile])

  // Render loop: a gentle sway around the destinations (static under reduced motion).
  useEffect(() => {
    if (!globeRef.current || !active) return
    let raf = 0
    let frames = 0
    const start = performance.now()
    const d = drag.current
    const tick = (now: number) => {
      const t = (now - start) / 1000
      d.offset += (d.target - d.offset) * 0.12
      const sway = reduced ? 0 : Math.sin(t * 0.18) * 0.55
      // Read the ref each frame: the globe is recreated if the mobile/DPR settings change.
      globeRef.current?.update({ phi: BASE_PHI + sway + d.offset, theta: BASE_THETA })
      frames++
      // Reduced motion: draw a handful of frames (map texture loads async), then idle until dragged.
      if (reduced && frames > 90 && Math.abs(d.target - d.offset) < 0.001 && !d.down) return
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    const restart = () => {
      cancelAnimationFrame(raf)
      frames = 0
      raf = requestAnimationFrame(tick)
    }
    const canvas = canvasRef.current!
    canvas.addEventListener('pointerdown', restart)
    return () => {
      cancelAnimationFrame(raf)
      canvas.removeEventListener('pointerdown', restart)
    }
  }, [active, reduced, ready, mobile, dpr])

  const onDown = (e: PointerEvent<HTMLCanvasElement>) => {
    drag.current.down = true
    drag.current.x = e.clientX
    e.currentTarget.setPointerCapture(e.pointerId)
  }
  const onMove = (e: PointerEvent<HTMLCanvasElement>) => {
    const d = drag.current
    if (!d.down) return
    d.target = Math.max(-1.6, Math.min(1.6, d.target + (e.clientX - d.x) / 220))
    d.x = e.clientX
  }
  const onUp = () => {
    drag.current.down = false
  }

  return (
    <div ref={wrapRef} className="relative aspect-square w-full">
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className={`gr-globe-canvas h-full w-full transition-opacity duration-1000 ${ready ? 'opacity-100' : 'opacity-0'}`}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
      />
      <span className="gr-india-label" aria-hidden="true">
        India
      </span>
    </div>
  )
}
