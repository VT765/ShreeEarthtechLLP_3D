import { sectionCopy } from '../data/sections'
import { sections } from '../data/nav'
import { products } from '../data/products'
import SectionHeader from '../components/SectionHeader'
import ProductCard from './products/ProductCard'
import SpecTable from './products/SpecTable'
import { useBagViews } from './products/useBagViews'
import '../styles/products.css'

const copy = sectionCopy.products

export default function ProductGallery() {
  const { areaRef, slots, live, portal } = useBagViews(products)

  return (
    <section id={sections.products} className="section bg-cream" aria-labelledby="products-title">
      <div className="container-x">
        <SectionHeader
          eyebrow={copy.eyebrow}
          title={<span id="products-title">{copy.title}</span>}
          body={copy.body}
        />

        <div ref={areaRef} className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {products.map((p) => (
            <ProductCard key={p.id} p={p} slotRef={slots?.[p.id]} live={live} />
          ))}
        </div>

        <SpecTable />
      </div>
      {portal}
    </section>
  )
}
