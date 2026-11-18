import { useEffect, useRef } from 'react'

/** Drifting clay-dust motes over the plant layer (lightweight 2D canvas). */
export default function DustParticles({ count = 60 }: { count?: number }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const c = ref.current!
    const ctx = c.getContext('2d')!
    let w = 0, h = 0, raf = 0, visible = true
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
    const resize = () => {
      w = c.clientWidth
      h = c.clientHeight
      c.width = w * dpr
      c.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    const ps = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: h * (0.45 + Math.random() * 0.5),
      r: 0.6 + Math.random() * 1.8,
      vx: 0.1 + Math.random() * 0.35,
      vy: -0.05 - Math.random() * 0.2,
      a: 0.15 + Math.random() * 0.45,
      gold: Math.random() < 0.3,
    }))
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting))
    io.observe(c)
    const tick = () => {
      raf = requestAnimationFrame(tick)
      if (!visible) return
      ctx.clearRect(0, 0, w, h)
      for (const p of ps) {
        p.x += p.vx
        p.y += p.vy
        if (p.x > w + 10 || p.y < h * 0.35) {
          p.x = -10
          p.y = h * (0.55 + Math.random() * 0.4)
        }
        ctx.globalAlpha = p.a
        ctx.fillStyle = p.gold ? '#E0B04A' : '#E6D8C0'
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fill()
      }
    }
    raf = requestAnimationFrame(tick)
    window.addEventListener('resize', resize)
    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
      window.removeEventListener('resize', resize)
    }
  }, [count])
  return <canvas ref={ref} className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden />
}
