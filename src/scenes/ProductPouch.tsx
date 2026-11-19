import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float, ContactShadows } from '@react-three/drei'
import * as THREE from 'three'
import Lights, { StudioEnv } from './Lights'
import { asset } from '../lib/asset'
import type { Product } from '../data/products'
import { buildBase, buildFace, POUCH_H } from './pouch/pouchGeometry'
import { drawBack, drawFront, LABEL_H, LABEL_W, tintMark } from './pouch/pouchLabel'

function canvasTexture() {
  const c = document.createElement('canvas')
  c.width = LABEL_W
  c.height = LABEL_H
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  t.anisotropy = 8
  return t
}

/** Front and back prints; redrawn once the mark and the web fonts are in. */
function usePrints(p: Product) {
  const front = useMemo(() => canvasTexture(), [])
  const back = useMemo(() => canvasTexture(), [])
  // Repainting a canvas texture and flagging it for upload is three.js's intended pattern; it never feeds React rendering.
  /* eslint-disable react-hooks/immutability */
  useEffect(() => {
    const draw = (mark: HTMLCanvasElement | null) => {
      drawFront(front.image as HTMLCanvasElement, p, mark)
      drawBack(back.image as HTMLCanvasElement, p, mark)
      front.needsUpdate = true
      back.needsUpdate = true
    }
    draw(null)
    const img = new Image()
    img.onload = () => document.fonts.ready.then(() => draw(tintMark(img, p.pack.logo)))
    img.src = asset('logo-icon.png')
  }, [front, back, p])
  /* eslint-enable react-hooks/immutability */
  useEffect(() => () => [front, back].forEach((t) => t.dispose()), [front, back])
  return [front, back] as const
}

/** Live pointer state for a pouch (normalised -0.5…0.5), written by the DOM card that hosts it. */
export type BagPointer = { x: number; y: number; active: boolean }

function Pouch({ product, pointer, spin }: { product: Product; pointer?: BagPointer; spin: boolean }) {
  const tilt = useRef<THREE.Group>(null)
  const g = useRef<THREE.Group>(null)
  const [front, back] = usePrints(product)
  const geo = useMemo(() => ({ front: buildFace(1), back: buildFace(-1), base: buildBase() }), [])
  useEffect(() => () => Object.values(geo).forEach((x) => x.dispose()), [geo])

  useFrame((_, dt) => {
    const hover = pointer?.active ?? false
    if (g.current && spin) g.current.rotation.y += dt * (hover ? 0.9 : 0.45)
    if (tilt.current) {
      // Ease toward the pointer while hovered, back to upright otherwise.
      const k = 1 - Math.exp(-dt * 6)
      tilt.current.rotation.x = THREE.MathUtils.lerp(tilt.current.rotation.x, hover ? pointer!.y * 0.5 : 0, k)
      tilt.current.rotation.z = THREE.MathUtils.lerp(tilt.current.rotation.z, hover ? -pointer!.x * 0.35 : 0, k)
    }
  })

  // Glossy printed film.
  const film = { roughness: 0.38, clearcoat: 0.7, clearcoatRoughness: 0.25, side: THREE.DoubleSide }
  return (
    <group ref={tilt}>
      <group ref={g} rotation={[0, spin ? 0 : -0.32, 0]}>
        <mesh geometry={geo.front}>
          <meshPhysicalMaterial map={front} {...film} />
        </mesh>
        <mesh geometry={geo.back}>
          <meshPhysicalMaterial map={back} {...film} />
        </mesh>
        <mesh geometry={geo.base}>
          <meshPhysicalMaterial color={product.pack.main} {...film} />
        </mesh>
      </group>
    </group>
  )
}

type Props = {
  product: Product
  /** Optional hover state from the hosting card; the pouch tilts toward it and spins faster. */
  pointer?: BagPointer
  /** Contact-shadow map size; lower it when several pouches render in one canvas. */
  shadowRes?: number
  /** Still, three-quarter pose with no float (used to render the poster images). */
  still?: boolean
}

/** Earthtech stand-up pouch, printed like the real packaging, on a soft contact shadow. */
export default function ProductPouch({ product, pointer, shadowRes = 512, still = false }: Props) {
  const pouch = <Pouch product={product} pointer={pointer} spin={!still} />
  return (
    <>
      <Lights />
      <StudioEnv intensity={0.6} />
      {still ? (
        pouch
      ) : (
        <Float speed={1.2} rotationIntensity={0.15} floatIntensity={0.4}>
          {pouch}
        </Float>
      )}
      <ContactShadows position={[0, -POUCH_H / 2 - 0.12, 0]} opacity={0.35} scale={5} blur={2.4} far={2} resolution={shadowRes} color="#1B1714" />
    </>
  )
}
