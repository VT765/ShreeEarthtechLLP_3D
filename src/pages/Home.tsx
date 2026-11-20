import Hero from '../sections/hero/Hero'
import GlobalReach from '../sections/GlobalReach'
import ProductsSummary from '../sections/ProductsSummary'
import ApplicationsSummary from '../sections/ApplicationsSummary'
import CertificationBlock from '../sections/CertificationBlock'
import PlantGallery from '../sections/PlantGallery'
import ContactSection from '../sections/ContactSection'

// Home keeps short summaries; each links to the inner page that holds the detail.
// Sections render eagerly so every anchor exists; heavy 3D/globe parts lazy-load on approach.
export default function Home() {
  return (
    <>
      <Hero />
      <GlobalReach variant="summary" />
      <ProductsSummary />
      <ApplicationsSummary />
      <CertificationBlock />
      <PlantGallery />
      <ContactSection />
    </>
  )
}
