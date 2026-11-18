import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { ContactShadows, OrbitControls, RoundedBox } from '@react-three/drei'
import type * as THREE from 'three'
import Lights, { StudioEnv } from './Lights'

function PaperBag({ position, size = 1, rotation = 0 }: { position: [number, number, number]; size?: number; rotation?: number }) {
  return (
    <group position={position} rotation={[0, rotation, 0]} scale={size}>
      <RoundedBox args={[0.9, 0.22, 0.55]} radius={0.08} smoothness={3}>
        <meshStandardMaterial color="#F3EADB" roughness={0.85} />
      </RoundedBox>
      <mesh position={[0, 0.112, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.7, 0.14]} />
        <meshStandardMaterial color="#0C71C7" metalness={0.3} roughness={0.4} />
      </mesh>
      <mesh position={[0.22, 0.113, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.05, 24]} />
        <meshStandardMaterial color="#BF8311" metalness={0.8} roughness={0.35} />
      </mesh>
    </group>
  )
}

function Pallet({ position }: { position: [number, number, number] }) {
  const bags = []
  for (let layer = 0; layer < 4; layer++)
    for (let i = 0; i < 2; i++)
      for (let j = 0; j < 2; j++)
        bags.push(<PaperBag key={`${layer}${i}${j}`} position={[(i - 0.5) * 0.92, 0.22 + layer * 0.23, (j - 0.5) * 0.58]} rotation={layer % 2 ? 0.02 : -0.02} />)
  return (
    <group position={position}>
      <mesh position={[0, 0.05, 0]}>
        <boxGeometry args={[1.9, 0.1, 1.2]} />
        <meshStandardMaterial color="#8F620C" roughness={0.9} />
      </mesh>
      {bags}
    </group>
  )
}

function Jumbo({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <RoundedBox args={[1.2, 1.3, 1.2]} radius={0.18} smoothness={4} position={[0, 0.65, 0]}>
        <meshStandardMaterial color="#FAF7F2" roughness={0.7} />
      </RoundedBox>
      <mesh position={[0, 0.75, 0.601]}>
        <planeGeometry args={[0.8, 0.3]} />
        <meshStandardMaterial color="#0C71C7" />
      </mesh>
      {[[-0.48, -0.48], [0.48, -0.48], [-0.48, 0.48], [0.48, 0.48]].map(([x, z], i) => (
        <mesh key={i} position={[x, 1.38, z]} rotation={[0, Math.PI / 4 + (i % 2 ? Math.PI / 2 : 0), 0]}>
          <torusGeometry args={[0.13, 0.03, 12, 24, Math.PI]} />
          <meshStandardMaterial color="#BF8311" metalness={0.8} roughness={0.35} />
        </mesh>
      ))}
    </group>
  )
}

function Truck({ position }: { position: [number, number, number] }) {
  return (
    <group position={position} rotation={[0, -0.35, 0]}>
      <RoundedBox args={[0.9, 0.9, 1.3]} radius={0.1} position={[1.9, 0.75, 0]}>
        <meshStandardMaterial color="#0C71C7" metalness={0.6} roughness={0.25} />
      </RoundedBox>
      <mesh position={[2.36, 0.95, 0]}>
        <boxGeometry args={[0.02, 0.35, 1.05]} />
        <meshStandardMaterial color="#071F3A" metalness={0.9} roughness={0.1} />
      </mesh>
      <mesh position={[0, 0.42, 0]}>
        <boxGeometry args={[3.2, 0.14, 1.4]} />
        <meshStandardMaterial color="#1A1D24" />
      </mesh>
      <mesh position={[0, 0.6, 0.69]}>
        <boxGeometry args={[3.2, 0.25, 0.04]} />
        <meshStandardMaterial color="#BF8311" metalness={0.8} roughness={0.35} />
      </mesh>
      {[-1.1, 0, 1.0].map((x) => (
        <PaperBag key={x} position={[x - 0.1, 0.62, 0]} size={1.2} />
      ))}
      {[-1.1, 1.0].map((x) => (
        <PaperBag key={`b${x}`} position={[x, 0.88, 0]} size={1.2} />
      ))}
      {[-1.05, 0.2, 1.9].map((x) =>
        [-0.66, 0.66].map((z) => (
          <mesh key={`${x}${z}`} position={[x, 0.25, z]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.25, 0.25, 0.18, 24]} />
            <meshStandardMaterial color="#1A1D24" roughness={0.8} />
          </mesh>
        )),
      )}
    </group>
  )
}

export default function PackagingScene() {
  // Touch devices get a gentle auto-turn instead of drag controls so page scrolling isn't captured.
  const fine = window.matchMedia('(pointer: fine)').matches
  const spin = useRef<THREE.Group>(null)
  useFrame((_, dt) => {
    if (!fine && spin.current) spin.current.rotation.y += dt * 0.15
  })
  return (
    <>
      <Lights />
      <StudioEnv intensity={0.5} />
      <group ref={spin} position={[0, -1, 0]}>
        <Pallet position={[-3.2, 0, 0.4]} />
        <Jumbo position={[-1.1, 0, -1.3]} />
        <Truck position={[0.9, 0, 0.9]} />
      </group>
      <ContactShadows position={[0, -0.99, 0]} opacity={0.4} scale={14} blur={2.5} far={3} color="#071F3A" />
      {fine && <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.6} minPolarAngle={0.9} maxPolarAngle={1.35} />}
    </>
  )
}
