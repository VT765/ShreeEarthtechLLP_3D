import { useState, type RefObject } from 'react'
import { Canvas } from '@react-three/fiber'
import { PerformanceMonitor } from '@react-three/drei'
import { Bloom, EffectComposer } from '@react-three/postprocessing'
import { useIsMobile } from '../../hooks/useMedia'
import HeroRig from './HeroRig'
import CrystalPlant from './CrystalPlant'

type Props = {
  progress: RefObject<number>
  /** False while the hero is off-screen: the render loop stops entirely. */
  active: boolean
  onReady: () => void
}

/**
 * Quality steps, best first: pixel-ratio cap and bloom. The PerformanceMonitor steps down when the frame
 * rate sags on this device and back up when it recovers; phones start (and stay at most) one step down,
 * and after repeated flip-flops the scene settles on the lowest step.
 */
const QUALITY = [
  { dpr: 1, bloom: false },
  { dpr: 1.25, bloom: false },
  { dpr: 1.5, bloom: true },
]

/** Lazy-loaded hero background: keeps three.js, R3F and postprocessing out of the main chunk. */
export default function HeroCanvas({ progress, active, onReady }: Props) {
  const lite = useIsMobile()
  const top = lite ? 1 : 2
  const [level, setLevel] = useState(top)
  const q = QUALITY[Math.min(level, top)]
  return (
    <Canvas
      dpr={Math.min(window.devicePixelRatio || 1, q.dpr)}
      frameloop={active ? 'always' : 'never'}
      camera={{ fov: 40, near: 0.1, far: 40, position: [0, 1.5, 7] }}
      // Soft point sprites need no MSAA; skipping it saves a full-resolution resolve every frame.
      gl={{ antialias: false, alpha: false, powerPreference: 'high-performance' }}
      onCreated={() => requestAnimationFrame(onReady)}
    >
      <PerformanceMonitor
        flipflops={3}
        onDecline={() => setLevel((l) => Math.max(0, Math.min(l, top) - 1))}
        onIncline={() => setLevel((l) => Math.min(top, l + 1))}
        onFallback={() => setLevel(0)}
      >
        <color attach="background" args={['#1B1714']} />
        <HeroRig progress={progress}>
          <CrystalPlant progress={progress} lite={lite} />
        </HeroRig>
        {q.bloom && (
          <EffectComposer multisampling={0}>
            <Bloom mipmapBlur intensity={0.85} luminanceThreshold={0.08} luminanceSmoothing={0.25} radius={0.65} />
          </EffectComposer>
        )}
      </PerformanceMonitor>
    </Canvas>
  )
}
