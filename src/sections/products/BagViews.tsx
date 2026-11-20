import { useEffect, type RefObject } from 'react'
import { Canvas } from '@react-three/fiber'
import { PerspectiveCamera, View } from '@react-three/drei'
import ProductPouch from '../../scenes/ProductPouch'
import type { Product } from '../../data/products'
import { isLowEnd } from '../../hooks/useMedia'

export type BagViewItem = { product: Product; track: RefObject<HTMLElement | null> }

/**
 * ONE WebGL context for every product slot on the page. A transparent, click-through canvas is fixed over
 * the viewport and drei `<View track>` scissors each pouch into the rect of its slot element, so the pouches
 * follow the cards as they scroll, without one context per card.
 */
export default function BagViews({ items, active, onReady }: { items: BagViewItem[]; active: boolean; onReady: (ready: boolean) => void }) {
  useEffect(() => () => onReady(false), [onReady])
  const low = isLowEnd()
  return (
    <Canvas
      aria-hidden
      dpr={low ? [1, 1.25] : [1, 1.75]}
      gl={{ antialias: !low, alpha: true, powerPreference: 'high-performance' }}
      // Paused and hidden while another scene is the active one: a frozen frame would not follow the cards.
      frameloop={active ? 'always' : 'never'}
      style={{ position: 'fixed', inset: 0, width: '100vw', height: '100vh', pointerEvents: 'none', zIndex: 20, visibility: active ? 'visible' : 'hidden' }}
      onCreated={() => onReady(true)}
    >
      {items.map((it) => (
        <View key={it.product.id} track={it.track as RefObject<HTMLElement>}>
          <PerspectiveCamera makeDefault position={[0, 0.15, 4.4]} fov={38} />
          <ProductPouch product={it.product} shadowRes={256} />
        </View>
      ))}
    </Canvas>
  )
}
