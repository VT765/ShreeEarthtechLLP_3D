import { useEffect, type RefObject } from 'react'
import { Canvas } from '@react-three/fiber'
import { PerspectiveCamera, View } from '@react-three/drei'
import ProductBag, { type BagPointer } from '../../scenes/ProductBag'
import { isLowEnd } from '../../hooks/useMedia'

export type BagViewItem = { id: string; name: string; color: string; track: RefObject<HTMLElement | null>; pointer: BagPointer }

/**
 * ONE WebGL context for every product card. A transparent, click-through canvas is fixed over the
 * viewport and drei `<View track>` scissors each bag into the rect of its card's slot element, so
 * the bags follow the cards (scroll, hover tilt, reveal) without one context per card.
 */
export default function BagViews({ items, onReady }: { items: BagViewItem[]; onReady: (ready: boolean) => void }) {
  useEffect(() => () => onReady(false), [onReady])
  const low = isLowEnd()
  return (
    <Canvas
      aria-hidden
      dpr={low ? [1, 1.25] : [1, 1.75]}
      gl={{ antialias: !low, alpha: true, powerPreference: 'high-performance' }}
      style={{ position: 'fixed', inset: 0, width: '100vw', height: '100vh', pointerEvents: 'none', zIndex: 20 }}
      onCreated={() => onReady(true)}
    >
      {items.map((it) => (
        <View key={it.id} track={it.track as RefObject<HTMLElement>}>
          <PerspectiveCamera makeDefault position={[0, 0.2, 4.4]} fov={38} />
          <ProductBag name={it.name} color={it.color} pointer={it.pointer} shadowRes={256} />
        </View>
      ))}
    </Canvas>
  )
}
