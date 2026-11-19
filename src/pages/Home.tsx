import Hero from '../sections/hero/Hero'
import GlobalReach from '../sections/GlobalReach'
import ProductGallery from '../sections/ProductGallery'
import GradeFinder from '../sections/GradeFinder'
import PlantGallery from '../sections/PlantGallery'
import { HERO_END_ID } from '../components/Navbar'

// Sections render eagerly so every nav anchor exists; their heavy 3D/globe parts lazy-load on approach.
export default function Home() {
  return (
    <>
      <Hero />
      <div id={HERO_END_ID} aria-hidden />
      <GlobalReach />
      <ProductGallery />
      <GradeFinder />
      <PlantGallery />
    </>
  )
}
