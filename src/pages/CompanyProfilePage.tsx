import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { companyProfile } from '../data/about'
import { products } from '../data/products'
import { routes } from '../data/routes'
import PageHero from '../components/PageHero'
import GlobalReach from '../sections/GlobalReach'

export default function CompanyProfilePage() {
  const c = companyProfile
  return (
    <>
      <PageHero eyebrow={c.eyebrow} title={c.title} body={c.intro} crumbs={[{ label: 'About' }, { label: c.title }]} />

      <section className="section bg-cream" aria-labelledby="profile-title">
        <div className="container-x grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <h2 id="profile-title" className="h2">
              {c.heading}
            </h2>
            <div className="mt-6 space-y-4 text-lg">
              {c.body.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to={routes.visionMission} className="btn btn-primary">
                Vision &amp; Mission <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
              <Link to={routes.certificates} className="btn btn-secondary">
                Certifications
              </Link>
            </div>
          </div>

          <aside className="lg:col-span-5" aria-labelledby="profile-products">
            <div className="card p-6">
              <h2 id="profile-products" className="text-xl">
                What we make
              </h2>
              <ul className="mt-4 divide-y divide-clay">
                {products.map((p) => (
                  <li key={p.id}>
                    <Link to={routes.product(p.slug)} className="group flex items-center justify-between gap-4 py-4">
                      <span>
                        <span className="block font-semibold text-ink group-hover:text-sky">{p.name}</span>
                        <span className="block text-sm text-stone">{p.grade}</span>
                      </span>
                      <ArrowRight className="h-4 w-4 shrink-0 text-sky transition-transform group-hover:translate-x-1" aria-hidden />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </section>

      <GlobalReach variant="full" />
    </>
  )
}
