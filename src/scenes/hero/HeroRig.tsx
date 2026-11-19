import { useEffect, useRef, type ReactNode, type RefObject } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

type Props = { progress: RefObject<number>; children: ReactNode }

/**
 * Scroll-driven camera orbit, gentle idle sway + float, and a pointer parallax tilt.
 * The object sits at the origin; a view offset pushes it right of the copy (desktop) or below it (mobile).
 */
export default function HeroRig({ progress, children }: Props) {
  const { camera, size } = useThree()
  const tilt = useRef<THREE.Group>(null)
  const sway = useRef<THREE.Group>(null)
  const pointer = useRef({ x: 0, y: 0 })
  const side = size.width >= 1024
  const baseDist = side ? 7 : size.width >= 768 ? 8.6 : 9.6

  useEffect(() => {
    const cam = camera as THREE.PerspectiveCamera
    const { width: w, height: h } = size
    if (side) cam.setViewOffset(w, h, -w * 0.24, 0, w, h)
    // Phones: well below the copy, in the band under the buttons / profile link.
    else cam.setViewOffset(w, h, 0, -h * (size.width >= 768 ? 0.2 : 0.33), w, h)
    return () => cam.clearViewOffset()
  }, [camera, size, side])

  // Parallax only for a mouse / trackpad; touch scrolling shouldn't wobble the scene.
  useEffect(() => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [])

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05)
    const t = progress.current ?? 0
    const g = tilt.current
    const s = sway.current
    if (!g || !s) return
    const time = state.clock.elapsedTime
    // Slow sway around a three-quarter view rather than a full spin, so the plant always reads.
    s.rotation.y = -0.42 + Math.sin(time * 0.17) * 0.22
    const k = Math.min(1, dt * 2.5)
    g.rotation.x += (pointer.current.y * 0.1 - g.rotation.x) * k
    g.rotation.z += (-pointer.current.x * 0.06 - g.rotation.z) * k
    g.position.y = Math.sin(time * 0.8) * 0.05

    // Ease in a little closer and lower once the plant has formed.
    const ang = -0.12 + t * 0.2
    const dist = baseDist * (1 - 0.1 * t)
    camera.position.set(Math.sin(ang) * dist, 1.9 - 0.4 * t, Math.cos(ang) * dist)
    camera.lookAt(0, -0.1, 0)
  })

  return (
    <group ref={tilt}>
      <group ref={sway}>{children}</group>
    </group>
  )
}
