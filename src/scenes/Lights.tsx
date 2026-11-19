import { Environment, Lightformer } from '@react-three/drei'

/** Warm gold key light + cool blue rim light, shared by every scene. */
export default function Lights({ intensity = 1 }: { intensity?: number }) {
  return (
    <>
      <ambientLight intensity={0.35 * intensity} />
      <hemisphereLight args={['#E5EFF6', '#3A2414', 0.45 * intensity]} />
      <directionalLight position={[4, 5, 6]} intensity={2.2 * intensity} color="#FFD9AE" />
      <directionalLight position={[-6, 2, -4]} intensity={2.4 * intensity} color="#8CC3E8" />
      <pointLight position={[-3, -2, 4]} intensity={8 * intensity} color="#8CC3E8" distance={20} />
    </>
  )
}

/** Procedural studio reflections (no HDR download): warm gold softbox + cool blue strips. */
export function StudioEnv({ intensity = 0.8 }: { intensity?: number }) {
  return (
    <Environment resolution={128} environmentIntensity={intensity}>
      <Lightformer form="rect" intensity={3} color="#FFD9AE" position={[3, 4, 4]} scale={[6, 3, 1]} />
      <Lightformer form="rect" intensity={2.5} color="#8CC3E8" position={[-5, 1, -2]} scale={[2, 8, 1]} />
      <Lightformer form="ring" intensity={1.5} color="#ffffff" position={[0, 6, 0]} scale={4} />
      <Lightformer form="rect" intensity={1} color="#2C6A99" position={[0, -4, 3]} scale={[10, 1, 1]} />
    </Environment>
  )
}
