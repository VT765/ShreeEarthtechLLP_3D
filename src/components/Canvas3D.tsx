import { Canvas, type CanvasProps } from '@react-three/fiber'

/** Separate module so three.js + R3F load only when the first 3D scene is needed. */
export default function Canvas3D(props: CanvasProps) {
  return <Canvas {...props} />
}
