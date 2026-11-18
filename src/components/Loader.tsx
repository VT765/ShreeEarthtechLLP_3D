import { useEffect, useRef, useState } from 'react'
import { asset } from '../lib/asset'

/** Intro: clay particles assemble into the SE monogram (≤ 2s, skippable). */
export default function Loader() {
  const [done, setDone] = useState(false)
  const [hide, setHide] = useState(false)
  const canvas = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setDone(true)
      setHide(true)
      return
    }
    const c = canvas.current!
    const ctx = c.getContext('2d')!
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const size = 220
    c.width = c.height = size * dpr
    ctx.scale(dpr, dpr)

    type P = { x: number; y: number; sx: number; sy: number; tx: number; ty: number; col: string; d: number }
    const parts: P[] = []
    let raf = 0
    let start = 0
    const img = new Image()
    img.src = asset('logo-icon.png')
    img.onload = () => {
      const off = document.createElement('canvas')
      const h = 170
      const w = Math.round((img.width / img.height) * h)
      off.width = w
      off.height = h
      const o = off.getContext('2d')!
      o.drawImage(img, 0, 0, w, h)
      const data = o.getImageData(0, 0, w, h).data
      const ox = (size - w) / 2
      const oy = (size - h) / 2
      const step = 4
      for (let y = 0; y < h; y += step)
        for (let x = 0; x < w; x += step) {
          const i = (y * w + x) * 4
          if (data[i + 3] < 140) continue
          const a = Math.random() * Math.PI * 2
          const r = 120 + Math.random() * 120
          parts.push({
            sx: size / 2 + Math.cos(a) * r,
            sy: size / 2 + Math.sin(a) * r,
            x: 0,
            y: 0,
            tx: ox + x,
            ty: oy + y,
            col: `rgb(${data[i]},${data[i + 1]},${data[i + 2]})`,
            d: Math.random() * 0.35,
          })
        }
      start = performance.now()
      raf = requestAnimationFrame(draw)
    }
    const clay = '#E6D8C0'
    const ease = (t: number) => 1 - Math.pow(1 - t, 3)
    const draw = (now: number) => {
      const t = (now - start) / 1000
      ctx.clearRect(0, 0, size, size)
      for (const p of parts) {
        const k = ease(Math.min(1, Math.max(0, (t - p.d) / 1.05)))
        p.x = p.sx + (p.tx - p.sx) * k
        p.y = p.sy + (p.ty - p.sy) * k
        ctx.fillStyle = k > 0.85 ? p.col : clay
        ctx.globalAlpha = 0.35 + k * 0.65
        ctx.fillRect(p.x, p.y, 3.4, 3.4)
      }
      if (t < 1.55) raf = requestAnimationFrame(draw)
      else finish()
    }
    const finish = () => {
      setDone(true)
      setTimeout(() => setHide(true), 650)
    }
    const failsafe = setTimeout(finish, 2000)
    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(failsafe)
    }
  }, [])

  if (hide) return null
  return (
    <div
      className={`bg-dark-hero fixed inset-0 z-[200] grid place-items-center transition-opacity duration-[600ms] ${done ? 'pointer-events-none opacity-0' : 'opacity-100'}`}
      role="status"
      aria-label="Loading Shree Earthtech"
    >
      <div className="flex flex-col items-center gap-6">
        <canvas ref={canvas} style={{ width: 220, height: 220 }} />
        <p className="font-display text-sm font-semibold uppercase tracking-[0.3em] text-gold-light">Shree Earthtech</p>
      </div>
      <button
        onClick={() => {
          setDone(true)
          setTimeout(() => setHide(true), 500)
        }}
        className="absolute bottom-8 right-8 rounded-full border border-white/25 px-4 py-2 text-sm text-white/80 hover:border-gold-light hover:text-gold-light"
      >
        Skip intro
      </button>
    </div>
  )
}
