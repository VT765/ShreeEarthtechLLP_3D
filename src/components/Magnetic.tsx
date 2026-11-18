import { useRef, type ReactNode } from 'react'
import { useFinePointer, useReducedMotion } from '../hooks/useMedia'

/** Gently pulls its child toward the pointer (desktop only). */
export default function Magnetic({ children, strength = 0.25 }: { children: ReactNode; strength?: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const enabled = useFinePointer() && !useReducedMotion()
  return (
    <span
      ref={ref}
      className="inline-block transition-transform duration-500 ease-out-soft"
      onMouseMove={(e) => {
        if (!enabled || !ref.current) return
        const r = ref.current.getBoundingClientRect()
        const x = (e.clientX - r.left - r.width / 2) * strength
        const y = (e.clientY - r.top - r.height / 2) * strength
        ref.current.style.transform = `translate(${x}px, ${y}px)`
      }}
      onMouseLeave={() => {
        if (ref.current) ref.current.style.transform = ''
      }}
    >
      {children}
    </span>
  )
}
