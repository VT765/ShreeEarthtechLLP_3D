import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float } from '@react-three/drei'
import * as THREE from 'three'
import Lights, { StudioEnv } from './Lights'

/** Build a closed ribbon shape around a centreline with a varying width profile. */
function ribbon(curve: THREE.Curve<THREE.Vector2>, width: (t: number) => number, samples = 90) {
  const left: THREE.Vector2[] = []
  const right: THREE.Vector2[] = []
  for (let i = 0; i <= samples; i++) {
    const t = i / samples
    const p = curve.getPoint(t)
    const tan = curve.getTangent(t)
    const n = new THREE.Vector2(-tan.y, tan.x).multiplyScalar(width(t) / 2)
    left.push(p.clone().add(n))
    right.push(p.clone().sub(n))
  }
  return new THREE.Shape([...left, ...right.reverse()])
}

function path(...segs: [number, number][][]) {
  const cp = new THREE.CurvePath<THREE.Vector2>()
  segs.forEach((s) => {
    const [a, b, c, d] = s.map(([x, y]) => new THREE.Vector2(x, y))
    cp.add(new THREE.CubicBezierCurve(a, b, c, d))
  })
  return cp
}

const extrude = { depth: 0.22, bevelEnabled: true, bevelThickness: 0.05, bevelSize: 0.04, bevelSegments: 4, curveSegments: 24 }

export function SEMark() {
  const { sGeo, eGeo } = useMemo(() => {
    const s = path(
      [[0.62, 0.78], [0.25, 1.08], [-0.62, 0.98], [-0.5, 0.38]],
      [[-0.5, 0.38], [-0.4, -0.05], [0.42, 0.02], [0.38, -0.38]],
      [[0.38, -0.38], [0.34, -0.8], [-0.28, -0.86], [-0.6, -0.56]],
    )
    const w = (t: number) => 0.07 + 0.26 * Math.sin(Math.PI * Math.min(1, t * 1.05))
    const sGeo = new THREE.ExtrudeGeometry(ribbon(s, w), extrude)

    const bar = (x0: number, y0: number, x1: number, y1: number) => {
      const r = 0.05
      const sh = new THREE.Shape()
      sh.moveTo(x0 + r, y0)
      sh.lineTo(x1 - r, y0)
      sh.quadraticCurveTo(x1, y0, x1, y0 + r)
      sh.lineTo(x1, y1 - r)
      sh.quadraticCurveTo(x1, y1, x1 - r, y1)
      sh.lineTo(x0 + r, y1)
      sh.quadraticCurveTo(x0, y1, x0, y1 - r)
      sh.lineTo(x0, y0 + r)
      sh.quadraticCurveTo(x0, y0, x0 + r, y0)
      return sh
    }
    const swoosh = ribbon(
      path([[0.66, 0.02], [0.82, -0.55], [0.1, -0.98], [-0.52, -0.74]]),
      (t) => 0.05 + 0.13 * Math.sin(Math.PI * t),
    )
    const eGeo = new THREE.ExtrudeGeometry([bar(0.02, 0.4, 0.7, 0.6), bar(0.08, 0.02, 0.66, 0.2), swoosh], extrude)
    sGeo.center()
    eGeo.translate(-0.02, 0.03, 0)
    return { sGeo, eGeo }
  }, [])

  return (
    <group>
      <mesh geometry={sGeo} position={[-0.06, 0, 0.06]}>
        <meshStandardMaterial color="#0C71C7" metalness={0.6} roughness={0.25} />
      </mesh>
      <mesh geometry={eGeo} position={[0, 0, -0.12]}>
        <meshStandardMaterial color="#BF8311" metalness={0.8} roughness={0.35} />
      </mesh>
    </group>
  )
}

export default function SELogo3D() {
  const g = useRef<THREE.Group>(null)
  useFrame((state) => {
    if (!g.current) return
    g.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.6) * 0.75
    g.current.rotation.x = THREE.MathUtils.lerp(g.current.rotation.x, state.pointer.y * 0.25, 0.05)
  })
  return (
    <>
      <Lights />
      <StudioEnv />
      <Float speed={1.4} rotationIntensity={0.2} floatIntensity={0.6}>
        <group ref={g} scale={1.25}>
          <SEMark />
        </group>
      </Float>
    </>
  )
}
