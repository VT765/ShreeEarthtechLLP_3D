import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import Lights, { StudioEnv } from './Lights'

// Simplified Gujarat outline (lon, lat) — stylised, not survey-accurate.
const OUTLINE: [number, number][] = [
  [68.2, 23.6], [68.6, 24.3], [69.6, 24.3], [70.6, 24.4], [71.1, 24.6], [72.0, 24.4], [72.5, 24.5], [73.1, 24.3],
  [73.4, 23.9], [74.0, 23.4], [74.3, 22.9], [74.1, 22.4], [74.0, 21.9], [73.8, 21.4], [73.9, 21.0], [73.6, 20.6],
  [73.4, 20.2], [72.9, 20.2], [72.8, 20.8], [72.7, 21.4], [72.6, 21.9], [72.6, 22.3], [72.3, 22.2], [72.2, 21.8],
  [72.1, 21.4], [71.8, 21.1], [71.4, 20.9], [71.0, 20.75], [70.5, 20.8], [70.0, 21.1], [69.6, 21.5], [69.2, 21.9],
  [68.95, 22.3], [69.1, 22.45], [69.7, 22.5], [70.2, 22.55], [70.5, 22.9], [70.2, 23.0], [69.7, 22.8], [69.2, 22.85],
  [68.7, 23.0], [68.4, 23.3],
]
const CX = 71.2
const CY = 22.4
export const project = (lon: number, lat: number) => new THREE.Vector2((lon - CX) * 0.62, (lat - CY) * 0.68)

type Pin = { id: string; name: string; lon: number; lat: number }

function MapPin({ pin, active, onHover }: { pin: Pin; active: boolean; onHover: (id: string) => void }) {
  const ring = useRef<THREE.Mesh>(null)
  const p = project(pin.lon, pin.lat)
  useFrame(({ clock }) => {
    if (!ring.current) return
    const t = (clock.elapsedTime * 0.8) % 1
    ring.current.scale.setScalar(0.5 + t * 1.6)
    ;(ring.current.material as THREE.MeshBasicMaterial).opacity = (1 - t) * 0.8
  })
  return (
    <group position={[p.x, p.y, 0.16]} onPointerOver={(e) => (e.stopPropagation(), onHover(pin.id))}>
      <mesh ref={ring} position={[0, 0, 0.01]}>
        <ringGeometry args={[0.16, 0.2, 48]} />
        <meshBasicMaterial color="#E0B04A" transparent depthWrite={false} />
      </mesh>
      <mesh position={[0, 0, 0.32]} rotation={[-Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.07, 0.4, 24]} />
        <meshStandardMaterial color="#BF8311" metalness={0.8} roughness={0.35} emissive="#BF8311" emissiveIntensity={active ? 0.6 : 0.15} />
      </mesh>
      <mesh position={[0, 0, 0.56]}>
        <sphereGeometry args={[0.12, 32, 32]} />
        <meshStandardMaterial color="#E0B04A" metalness={0.8} roughness={0.3} emissive="#E0B04A" emissiveIntensity={active ? 0.9 : 0.35} />
      </mesh>
      <Html position={[0.18, 0, 0.62]} center={false} style={{ pointerEvents: 'none' }}>
        <span className={`whitespace-nowrap rounded-full px-2.5 py-1 font-display text-xs font-bold shadow ${active ? 'bg-brand-gold text-midnight' : 'bg-white/90 text-ink'}`}>
          {pin.name}
        </span>
      </Html>
    </group>
  )
}

export default function GujaratMap({ pins, active, onHover }: { pins: Pin[]; active: string; onHover: (id: string) => void }) {
  const g = useRef<THREE.Group>(null)
  const geo = useMemo(() => {
    const shape = new THREE.Shape(OUTLINE.map(([lon, lat]) => project(lon, lat)))
    return new THREE.ExtrudeGeometry(shape, { depth: 0.16, bevelEnabled: true, bevelThickness: 0.03, bevelSize: 0.03, bevelSegments: 3 })
  }, [])
  const edges = useMemo(() => new THREE.EdgesGeometry(geo, 30), [geo])
  useFrame(({ pointer }) => {
    if (!g.current) return
    g.current.rotation.z = THREE.MathUtils.lerp(g.current.rotation.z, pointer.x * 0.08, 0.04)
    g.current.rotation.x = THREE.MathUtils.lerp(g.current.rotation.x, -0.75 + pointer.y * 0.06, 0.04)
  })
  return (
    <>
      <Lights />
      <StudioEnv intensity={0.5} />
      <group ref={g} rotation={[-0.75, 0, 0]} position={[0.1, 0.35, 0]}>
        <mesh geometry={geo}>
          <meshStandardMaterial attach="material-0" color="#E6D8C0" roughness={0.85} metalness={0.05} />
          <meshStandardMaterial attach="material-1" color="#0C71C7" metalness={0.6} roughness={0.25} />
        </mesh>
        <lineSegments geometry={edges} position={[0, 0, 0.001]}>
          <lineBasicMaterial color="#BF8311" transparent opacity={0.35} />
        </lineSegments>
        {/* subtle sea grid */}
        <gridHelper args={[8, 32, '#4E91CC', '#4E91CC']} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, -0.05]}>
          <meshBasicMaterial attach="material" transparent opacity={0.12} />
        </gridHelper>
        {pins.map((p) => (
          <MapPin key={p.id} pin={p} active={active === p.id} onHover={onHover} />
        ))}
      </group>
    </>
  )
}
