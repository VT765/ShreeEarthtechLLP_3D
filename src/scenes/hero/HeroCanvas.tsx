import type { RefObject } from 'react'
import { Canvas } from '@react-three/fiber'
import { Bloom, EffectComposer } from '@react-three/postprocessing'
import { useIsMobile } from '../../hooks/useMedia'
import HeroRig from './HeroRig'
import WireMorph from './WireMorph'

type Props = {
  progress: RefObject<number>
  /** False while the hero is off-screen: the render loop stops entirely. */
  active: boolean
  onReady: () => void
}

/** Lazy-loaded hero background: keeps three.js, R3F and postprocessing out of the main chunk. */
export default function HeroCanvas({ progress, active, onReady }: Props) {
  const lite = useIsMobile()
  return (
    <Canvas
      dpr={[1, 1.5]}
      frameloop={active ? 'always' : 'never'}
      camera={{ fov: 40, near: 0.1, far: 40, position: [0, 1, 7] }}
      gl={{ antialias: lite, alpha: false, powerPreference: 'high-performance' }}
      onCreated={() => requestAnimationFrame(onReady)}
    >
      <color attach="background" args={['#071F3A']} />
      <HeroRig progress={progress}>
        <WireMorph progress={progress} lite={lite} />
      </HeroRig>
      {/* Bloom is the expensive bit, so phones go without it. */}
      {!lite && (
        <EffectComposer multisampling={4}>
          <Bloom mipmapBlur intensity={0.85} luminanceThreshold={0.08} luminanceSmoothing={0.25} radius={0.65} />
        </EffectComposer>
      )}
    </Canvas>
  )
}
