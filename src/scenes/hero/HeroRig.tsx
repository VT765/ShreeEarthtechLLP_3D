import { useEffect, useRef, type ReactNode, type RefObject } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

type Props = { progress: RefObject<number>; children: ReactNode }

/**
 * Scroll-driven camera dolly/orbit, idle spin + float, and a pointer parallax tilt.
 * The object sits at the origin; a view offset pushes it right of the copy (desktop) or below it (mobile).
 */
export default function HeroRig({ progress, children }: Props) {
  const { camera, size } = useThree()
  const tilt = useRef<THREE.Group>(null)
  const spin = useRef<THREE.Group>(null)
  const pointer = useRef({ x: 0, y: 0 })
  const side = size.width >= 1024
  const baseDist = side ? 7 : size.width >= 768 ? 8.6 : 9.6

  useEffect(() => {
    const cam = camera as THREE.PerspectiveCamera
    const { width: w, height: h } = size
    if (side) cam.setViewOffset(w, h, -w * 0.24, 0, w, h)
    else cam.setViewOffset(w, h, 0, -h * 0.17, w, h)
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
    const s = spin.current
    if (!g || !s) return
    // Spin a little faster mid-activation.
    s.rotation.y += dt * (0.14 + 0.22 * Math.sin(t * Math.PI))
    const k = Math.min(1, dt * 2.5)
    g.rotation.x += (pointer.current.y * 0.12 - g.rotation.x) * k
    g.rotation.z += (-pointer.current.x * 0.08 - g.rotation.z) * k
    g.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.08

    const ang = -0.28 + t * 0.56
    const dist = baseDist * (1 - 0.12 * t)
    camera.position.set(Math.sin(ang) * dist, 1.1 * (1 - t) + 0.15, Math.cos(ang) * dist)
    camera.lookAt(0, 0, 0)
  })

  return (
    <group ref={tilt}>
      <group ref={spin}>{children}</group>
    </group>
  )
}
