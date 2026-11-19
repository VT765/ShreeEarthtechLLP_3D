import { Link, Navigate, useParams } from 'react-router-dom'
import { ArrowRight, Download, Send } from 'lucide-react'
import { oilCategories } from '../data/gradeFinder'
import { productBySlug, products, specs } from '../data/products'
import { enquiryFor, routes } from '../data/routes'
import { asset } from '../lib/asset'
import PageHero from '../components/PageHero'
import '../styles/products.css'

/** One page per grade: key specs, its column of the spec table, recommended oils, TDS and enquiry. */
export default function ProductPage() {
  const { slug } = useParams()
  const p = productBySlug(slug)
  if (!p) return <Navigate to={routes.products} replace />
  const idx = products.indexOf(p)
  const oils = oilCategories.flatMap((c) => c.oils.filter((o) => o.grade === p.id).map((o) => o.oil))
  const others = products.filter((o) => o.id !== p.id)

  return (
    <>
      <PageHero eyebrow={p.grade} title={p.name} body={p.body} crumbs={[{ label: 'Products', to: routes.products }, { label: p.short }]}>
        <div className="mt-8 flex flex-wrap gap-3">
          <a href={asset(p.tds)} download className="btn btn-orange">
            <Download className="h-4 w-4" aria-hidden /> Download TDS
          </a>
          <Link to={enquiryFor(p.id)} className="btn btn-ghost-dark">
            <Send className="h-4 w-4" aria-hidden /> Enquire about {p.short}
          </Link>
        </div>
      </PageHero>

      <section className="section bg-cream" aria-labelledby="spec-title">
        <div className="container-x grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <div className="bag-stage card aspect-square overflow-hidden">
              <img src={asset(p.image.src)} alt={p.image.alt} width={600} height={600} className="h-full w-full object-contain p-10" />
            </div>
            <dl className="mt-6 grid grid-cols-3 gap-3">
              {p.keySpecs.map((s) => (
                <div key={s.label} className="rounded-xl border border-clay bg-white p-3">
                  <dt className="text-[11px] font-medium uppercase leading-tight tracking-wide text-stone">{s.label}</dt>
                  <dd className="mt-1 font-mono text-sm font-medium text-ink">{s.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="lg:col-span-7">
            <h2 id="spec-title" className="h2">
              Technical specification
            </h2>
            <div className="mt-6 overflow-hidden rounded-2xl border border-clay">
              <table className="spec-table w-full text-left">
                <thead>
                  <tr>
                    <th scope="col" className="px-4 py-3">
                      Parameter
                    </th>
                    <th scope="col" className="px-4 py-3">
                      {p.short}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {specs.map((s) => (
                    <tr key={s.parameter}>
                      <th scope="row" className="px-4 py-3">
                        {s.parameter}
                      </th>
                      <td className="bg-white px-4 py-3">{s.values[idx]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {oils.length > 0 && (
              <div className="mt-10">
                <h2 className="text-2xl">Recommended starting grade for</h2>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {oils.map((o) => (
                    <li key={o} className="badge">
                      {o}
                    </li>
                  ))}
                </ul>
                <p className="mt-3 text-sm text-stone">From the Grade Finder; final dosage is confirmed with a lab bleaching trial.</p>
              </div>
            )}

            <div className="mt-10 flex flex-wrap gap-3">
              {others.map((o) => (
                <Link key={o.id} to={routes.product(o.slug)} className="btn btn-secondary">
                  {o.short} <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
              ))}
              <Link to={routes.products} className="btn btn-secondary">
                Compare all grades
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
