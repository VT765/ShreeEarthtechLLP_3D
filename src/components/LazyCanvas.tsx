import { lazy, Suspense, type ReactNode } from 'react'
import type { CanvasProps } from '@react-three/fiber'
import { useInView } from '../hooks/useInView'
import { isLowEnd } from '../hooks/useMedia'

const Canvas = lazy(() => import('./Canvas3D'))

type Props = Omit<CanvasProps, 'children'> & { children: ReactNode; className?: string; label: string }

/** Mounts a WebGL canvas only while it is near the viewport; caps DPR on low-end devices. */
export default function LazyCanvas({ children, className = '', label, ...rest }: Props) {
  const [ref, inView] = useInView<HTMLDivElement>('300px')
  const low = typeof navigator !== 'undefined' && isLowEnd()
  return (
    <div ref={ref} className={`relative ${className}`} role="img" aria-label={label}>
      {inView ? (
        <Suspense fallback={<Spinner />}>
          <Canvas dpr={low ? [1, 1.25] : [1, 2]} gl={{ antialias: !low, alpha: true, powerPreference: 'high-performance' }} {...rest}>
            {children}
          </Canvas>
        </Suspense>
      ) : (
        <Spinner />
      )}
    </div>
  )
}

function Spinner() {
  return (
    <div className="absolute inset-0 grid place-items-center">
      <span className="h-8 w-8 animate-spin rounded-full border-2 border-brand-gold/30 border-t-brand-gold" />
    </div>
  )
}
