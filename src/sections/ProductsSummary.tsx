import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { sections } from '../data/nav'
import { products } from '../data/products'
import { routes } from '../data/routes'
import { sectionCopy } from '../data/sections'
import { asset } from '../lib/asset'
import { useReveal } from '../hooks/useReveal'
import SectionHeader from '../components/SectionHeader'

const copy = sectionCopy.productsSummary

/** Home: one compact card per grade. Full gallery, 3D bags, specs and TDS live on /products and /products/:slug. */
export default function ProductsSummary() {
  const ref = useReveal<HTMLElement>()
  return (
    <section id={sections.products} ref={ref} className="section bg-cream" aria-labelledby="products-title">
      <div className="container-x">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHeader eyebrow={copy.eyebrow} title={<span id="products-title">{copy.title}</span>} body={copy.body} />
          <Link to={routes.products} className="btn btn-secondary shrink-0" data-reveal="0.1">
            {copy.cta} <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
        <ul className="mt-12 grid gap-6 md:grid-cols-3">
          {products.map((p, i) => (
            <li key={p.id} data-reveal={i * 0.08}>
              <Link to={routes.product(p.slug)} className="card card-hover group flex h-full flex-col overflow-hidden">
                <span className="block aspect-[4/3] bg-beige">
                  <img src={asset(p.image.src)} alt="" width={400} height={300} loading="lazy" decoding="async" className="h-full w-full object-contain p-6" />
                </span>
                <span className="flex flex-1 flex-col p-6">
                  <span className="text-xs font-semibold uppercase tracking-[0.15em] text-orange-deep">{p.grade}</span>
                  <span className="mt-2 font-display text-2xl font-extrabold text-ink">{p.name}</span>
                  <span className="mt-2 text-[15px]">{p.body}</span>
                  <span className="mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-semibold text-sky group-hover:text-sky-deep">
                    View product <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
