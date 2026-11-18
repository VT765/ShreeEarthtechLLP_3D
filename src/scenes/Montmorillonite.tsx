import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { RoundedBox } from '@react-three/drei'
import * as THREE from 'three'
import Lights, { StudioEnv } from './Lights'

const N = 6 // atoms per edge
const SIZE = 2.2

/** Exploded TOT (tetrahedral–octahedral–tetrahedral) stack with interlayer cations and captured pigments. */
export default function Montmorillonite({ exploded }: { exploded: boolean }) {
  const layers = useRef<THREE.Group[]>([])
  const pigments = useRef<THREE.InstancedMesh>(null)
  const root = useRef<THREE.Group>(null)
  const gap = useRef(0.25)

  const atomPositions = useMemo(() => {
    const pts: [number, number][] = []
    for (let i = 0; i < N; i++) for (let j = 0; j < N; j++) pts.push([(i / (N - 1) - 0.5) * (SIZE - 0.3), (j / (N - 1) - 0.5) * (SIZE - 0.3)])
    return pts
  }, [])
  const pigmentSeeds = useMemo(
    () => Array.from({ length: 18 }, (_, i) => ({ x: (Math.random() - 0.5) * 1.8, z: (Math.random() - 0.5) * 1.8, layer: i % 2, phase: Math.random() * Math.PI * 2 })),
    [],
  )
  const dummy = useMemo(() => new THREE.Object3D(), [])

  // 3 TOT units → 9 sheets
  const sheets = useMemo(() => {
    const out: { unit: number; kind: 'T' | 'O'; offset: number }[] = []
    for (let u = 0; u < 2; u++) {
      out.push({ unit: u, kind: 'T', offset: -0.17 }, { unit: u, kind: 'O', offset: 0 }, { unit: u, kind: 'T', offset: 0.17 })
    }
    return out
  }, [])

  useFrame((state, dt) => {
    gap.current = THREE.MathUtils.damp(gap.current, exploded ? 0.95 : 0.35, 3, dt)
    const unitY = (u: number) => (u - 0.5) * (0.5 + gap.current)
    sheets.forEach((s, i) => {
      const g = layers.current[i]
      if (g) g.position.y = unitY(s.unit) + s.offset * (exploded ? 1.25 : 1)
    })
    if (root.current) root.current.rotation.y += dt * 0.25
    const pm = pigments.current
    if (pm) {
      const t = state.clock.elapsedTime
      pigmentSeeds.forEach((p, i) => {
        // pigments drift into the interlayer gap and are held there
        const capture = THREE.MathUtils.smoothstep(Math.sin(t * 0.6 + p.phase), -0.2, 0.8)
        const outside = 1.6 + Math.sin(t + p.phase) * 0.2
        dummy.position.set(p.x * (1 + (1 - capture) * 0.9), (1 - capture) * (p.layer ? outside : -outside), p.z * (1 + (1 - capture) * 0.9))
        dummy.scale.setScalar(0.07 + capture * 0.03)
        dummy.updateMatrix()
        pm.setMatrixAt(i, dummy.matrix)
      })
      pm.instanceMatrix.needsUpdate = true
    }
  })

  return (
    <>
      <Lights />
      <StudioEnv intensity={0.7} />
      <group ref={root} rotation={[0.42, 0.6, 0]}>
        {sheets.map((s, i) => (
          <group key={i} ref={(el) => void (el && (layers.current[i] = el))}>
            <RoundedBox args={[SIZE, s.kind === 'O' ? 0.11 : 0.07, SIZE]} radius={0.03} smoothness={3}>
              {s.kind === 'O' ? (
                <meshStandardMaterial color="#BF8311" metalness={0.8} roughness={0.35} />
              ) : (
                <meshPhysicalMaterial color="#0C71C7" metalness={0.6} roughness={0.25} transparent opacity={0.85} clearcoat={0.6} />
              )}
            </RoundedBox>
            <instancedMesh args={[undefined, undefined, atomPositions.length]} ref={(m) => {
              if (!m) return
              atomPositions.forEach(([x, z], k) => {
                dummy.position.set(x, s.kind === 'O' ? 0 : s.offset > 0 ? 0.05 : -0.05, z)
                dummy.scale.setScalar(1)
                dummy.updateMatrix()
                m.setMatrixAt(k, dummy.matrix)
              })
              m.instanceMatrix.needsUpdate = true
            }}>
              <sphereGeometry args={[s.kind === 'O' ? 0.07 : 0.05, 16, 16]} />
              <meshStandardMaterial color={s.kind === 'O' ? '#E0B04A' : '#EAF3FC'} metalness={0.3} roughness={0.3} />
            </instancedMesh>
          </group>
        ))}
        {/* interlayer cations */}
        {Array.from({ length: 10 }, (_, i) => (
          <mesh key={i} position={[((i * 0.37) % 1.8) - 0.9, 0, ((i * 0.61) % 1.8) - 0.9]}>
            <sphereGeometry args={[0.06, 16, 16]} />
            <meshStandardMaterial color="#1E8C7E" emissive="#1E8C7E" emissiveIntensity={0.4} />
          </mesh>
        ))}
        <instancedMesh ref={pigments} args={[undefined, undefined, pigmentSeeds.length]}>
          <icosahedronGeometry args={[1, 1]} />
          <meshStandardMaterial color="#5A3A0C" roughness={0.6} emissive="#8F620C" emissiveIntensity={0.2} />
        </instancedMesh>
      </group>
    </>
  )
}
