import { routes } from '../data/routes'
import { sectionCopy } from '../data/sections'
import PageHero from '../components/PageHero'
import ProductGallery from '../sections/ProductGallery'

/** Full product gallery: 3D bags, key specs, TDS downloads and the full spec comparison table. */
export default function ProductsPage() {
  const c = sectionCopy.products
  return (
    <>
      <PageHero eyebrow={c.eyebrow} title={c.title} body={c.body} crumbs={[{ label: 'Products', to: routes.products }]} />
      <ProductGallery />
    </>
  )
}
