import { useEffect, useRef, type ReactNode, type RefObject } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { PLANT_SPAN } from './plantModel'

type Props = { progress: RefObject<number>; children: ReactNode }

/** Half the vertical field of view (camera fov 40°), as a tangent. */
const TAN_HALF_FOV = Math.tan((20 * Math.PI) / 180)

/**
 * Camera distance at which the formed plant fills `fw` of the canvas width and at most `fh` of its height.
 * The background field is pinned to the screen in the shader, so this only frames the plant.
 */
function fitDistance(aspect: number, fw: number, fh: number) {
  return Math.max(PLANT_SPAN.w / fw / (2 * TAN_HALF_FOV * aspect), PLANT_SPAN.h / fh / (2 * TAN_HALF_FOV))
}

/**
 * Scroll-driven camera orbit, gentle idle sway + float, and a pointer parallax tilt.
 * The plant sits at the origin; a view offset pushes it into the right half (desktop) or below the copy (mobile).
 */
export default function HeroRig({ progress, children }: Props) {
  const { camera, size } = useThree()
  const tilt = useRef<THREE.Group>(null)
  const sway = useRef<THREE.Group>(null)
  const pointer = useRef({ x: 0, y: 0 })
  const side = size.width >= 1024
  const aspect = size.width / size.height
  // Framed for the settled camera (t = 1), which sits 10% closer than the start.
  const baseDist = (side ? fitDistance(aspect, 0.47, 0.82) : fitDistance(aspect, 0.84, 0.26)) / 0.9

  useEffect(() => {
    const cam = camera as THREE.PerspectiveCamera
    const { width: w, height: h } = size
    if (side) cam.setViewOffset(w, h, -w * 0.25, 0, w, h)
    // Phones: well below the copy, in the band under the buttons / profile link.
    else cam.setViewOffset(w, h, 0, -h * (size.width >= 768 ? 0.2 : 0.36), w, h)
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
    // Height scales with distance so the plant is seen from the same slight high angle at any framing.
    camera.position.set(Math.sin(ang) * dist, dist * (0.27 - 0.04 * t), Math.cos(ang) * dist)
    camera.lookAt(0, -0.15, 0)
  })

  return (
    <group ref={tilt}>
      <group ref={sway}>{children}</group>
    </group>
  )
}
