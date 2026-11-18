import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float, RoundedBox, ContactShadows } from '@react-three/drei'
import * as THREE from 'three'
import Lights, { StudioEnv } from './Lights'
import { asset } from '../lib/asset'

/** Paper-bag label drawn to a canvas: logo, grade name and a grade-colour band. */
function useLabel(name: string, color: string) {
  const tex = useMemo(() => {
    const c = document.createElement('canvas')
    c.width = 512
    c.height = 720
    const t = new THREE.CanvasTexture(c)
    t.colorSpace = THREE.SRGBColorSpace
    t.anisotropy = 4
    return t
  }, [])
  useEffect(() => {
    const c = tex.image as HTMLCanvasElement
    const ctx = c.getContext('2d')!
    const draw = (logo?: HTMLImageElement) => {
      ctx.fillStyle = '#FAF7F2'
      ctx.fillRect(0, 0, 512, 720)
      // kraft texture
      for (let i = 0; i < 1400; i++) {
        ctx.fillStyle = `rgba(143,98,12,${Math.random() * 0.05})`
        ctx.fillRect(Math.random() * 512, Math.random() * 720, 2, 2)
      }
      if (logo) {
        const w = 360
        ctx.drawImage(logo, (512 - w) / 2, 70, w, (w * logo.height) / logo.width)
      }
      ctx.fillStyle = color
      ctx.fillRect(0, 300, 512, 150)
      ctx.fillStyle = '#BF8311'
      ctx.fillRect(0, 450, 512, 10)
      const [brand, ...rest] = name.split(' ')
      ctx.fillStyle = '#ffffff'
      ctx.textAlign = 'center'
      ctx.font = '600 26px Inter, sans-serif'
      ctx.fillText(brand.toUpperCase(), 256, 345)
      ctx.font = '800 54px "Plus Jakarta Sans", sans-serif'
      ctx.fillText(rest.join(' '), 256, 410)
      ctx.fillStyle = '#1A1D24'
      ctx.font = '600 24px Inter, sans-serif'
      ctx.fillText('ACTIVATED BLEACHING EARTH', 256, 520)
      ctx.fillStyle = '#4F5562'
      ctx.font = '500 20px "JetBrains Mono", monospace'
      ctx.fillText('NET WT. 25 KG  ·  MADE IN INDIA', 256, 570)
      ctx.fillStyle = '#0C5A9E'
      ctx.font = '700 22px Inter, sans-serif'
      ctx.fillText('www.shreeearthtech.com', 256, 660)
      tex.needsUpdate = true
    }
    draw()
    const img = new Image()
    img.onload = () => document.fonts.ready.then(() => draw(img))
    img.src = asset('logo-transparent.png')
  }, [tex, name, color])
  return tex
}

function Bag({ name, color }: { name: string; color: string }) {
  const g = useRef<THREE.Group>(null)
  const label = useLabel(name, color)
  useFrame((_, dt) => {
    if (g.current) g.current.rotation.y += dt * 0.45
  })
  return (
    <group ref={g}>
      <RoundedBox args={[1.5, 2.1, 0.5]} radius={0.14} smoothness={4}>
        <meshStandardMaterial color="#EFE6D6" roughness={0.85} />
      </RoundedBox>
      {[1, -1].map((side) => (
        <mesh key={side} position={[0, 0, side * 0.252]} rotation={[0, side === 1 ? 0 : Math.PI, 0]}>
          <planeGeometry args={[1.32, 1.86]} />
          <meshStandardMaterial map={label} roughness={0.75} />
        </mesh>
      ))}
      {/* stitched top seam */}
      <mesh position={[0, 1.04, 0]}>
        <boxGeometry args={[1.42, 0.06, 0.42]} />
        <meshStandardMaterial color="#BF8311" metalness={0.8} roughness={0.35} />
      </mesh>
    </group>
  )
}

export default function ProductBag({ name, color }: { name: string; color: string }) {
  return (
    <>
      <Lights />
      <StudioEnv intensity={0.5} />
      <Float speed={1.2} rotationIntensity={0.15} floatIntensity={0.4}>
        <Bag name={name} color={color} />
      </Float>
      <ContactShadows position={[0, -1.35, 0]} opacity={0.35} scale={5} blur={2.4} far={2} color="#071F3A" />
    </>
  )
}
