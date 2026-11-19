import { useEffect, useRef, useState } from 'react'
import { useFinePointer, useReducedMotion } from '../hooks/useMedia'

/** Subtle oil-droplet cursor that appears over interactive elements (desktop only). */
export default function Cursor() {
  const fine = useFinePointer()
  const enabled = !useReducedMotion() && fine
  const ref = useRef<HTMLDivElement>(null)
  const [hot, setHot] = useState(false)

  useEffect(() => {
    if (!enabled) return
    let x = 0, y = 0, cx = 0, cy = 0, raf = 0
    const move = (e: PointerEvent) => {
      x = e.clientX
      y = e.clientY
      const t = e.target as Element | null
      setHot(!!t?.closest('a, button, [role="button"], input, select, textarea, label, [data-cursor]'))
    }
    const loop = () => {
      cx += (x - cx) * 0.22
      cy += (y - cy) * 0.22
      if (ref.current) ref.current.style.transform = `translate(${cx}px, ${cy}px)`
      raf = requestAnimationFrame(loop)
    }
    window.addEventListener('pointermove', move)
    raf = requestAnimationFrame(loop)
    return () => {
      window.removeEventListener('pointermove', move)
      cancelAnimationFrame(raf)
    }
  }, [enabled])

  if (!enabled) return null
  return (
    <div ref={ref} className="pointer-events-none fixed left-0 top-0 z-[100]" aria-hidden>
      <svg
        viewBox="0 0 24 32"
        className={`-ml-3 -mt-5 h-8 w-6 drop-shadow-[0_4px_8px_rgba(191,131,17,0.45)] transition-all duration-300 ease-out-soft ${
          hot ? 'scale-100 opacity-90' : 'scale-50 opacity-0'
        }`}
      >
        <defs>
          <linearGradient id="drop" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#FFE3C2" />
            <stop offset="0.5" stopColor="#F2A25C" />
            <stop offset="1" stopColor="#D2691E" />
          </linearGradient>
        </defs>
        <path d="M12 1 C 12 1, 2 14, 2 21 a10 10 0 0 0 20 0 C 22 14, 12 1, 12 1z" fill="url(#drop)" />
        <ellipse cx="8" cy="20" rx="2" ry="3.5" fill="#fff" opacity="0.6" />
      </svg>
    </div>
  )
}
