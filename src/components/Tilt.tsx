import { useRef, type HTMLAttributes } from 'react'
import { useFinePointer, useReducedMotion } from '../hooks/useMedia'

/** Subtle 3D hover tilt for cards. */
export default function Tilt({ className = '', children, max = 6, ...rest }: HTMLAttributes<HTMLDivElement> & { max?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const fine = useFinePointer()
  const enabled = !useReducedMotion() && fine
  return (
    <div
      ref={ref}
      className={className}
      style={{ transformStyle: 'preserve-3d' }}
      onMouseMove={(e) => {
        if (!enabled || !ref.current) return
        const r = ref.current.getBoundingClientRect()
        const px = (e.clientX - r.left) / r.width - 0.5
        const py = (e.clientY - r.top) / r.height - 0.5
        ref.current.style.transform = `perspective(900px) rotateX(${-py * max}deg) rotateY(${px * max}deg) translateY(-4px)`
      }}
      onMouseLeave={() => {
        if (ref.current) ref.current.style.transform = ''
      }}
      {...rest}
    >
      {children}
    </div>
  )
}
