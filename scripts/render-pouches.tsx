// Poster renderer: /scripts/render-pouches.html?grade=<slug> draws one still pouch and sets
// window.pouchReady once the print (mark + fonts) is in and a few frames have landed.
import { createRoot } from 'react-dom/client'
import { Canvas } from '@react-three/fiber'
import ProductPouch from '../src/scenes/ProductPouch'
import { productBySlug } from '../src/data/products'

const product = productBySlug(new URLSearchParams(location.search).get('grade') ?? '')!

createRoot(document.getElementById('root')!).render(
  <Canvas
    dpr={1}
    gl={{ antialias: true, alpha: true, preserveDrawingBuffer: true }}
    camera={{ position: [0, 0.1, 3.85], fov: 38 }}
    onCreated={() => document.fonts.ready.then(() => setTimeout(() => ((window as unknown as { pouchReady: boolean }).pouchReady = true), 2500))}
  >
    <ProductPouch product={product} still />
  </Canvas>,
)
