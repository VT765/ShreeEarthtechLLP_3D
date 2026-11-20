import { Link } from 'react-router-dom'
import { Droplets, Factory, Recycle } from 'lucide-react'
import { sections } from '../data/nav'
import { oilCategories, type OilCategory } from '../data/gradeFinder'
import { routes } from '../data/routes'
import { sectionCopy } from '../data/sections'
import SectionHeader from '../components/SectionHeader'

const copy = sectionCopy.applicationsSummary
const icons: Record<OilCategory['id'], typeof Droplets> = { edible: Droplets, industrial: Factory, waste: Recycle }
const PREVIEW = 3

/** Home: the three oil categories at a glance. The interactive Grade Finder lives on /applications. */
export default function ApplicationsSummary() {
  return (
    <section id={sections.gradeFinder} className="section bg-cream pt-0" aria-labelledby="applications-title">
      <div className="container-x">
        <div className="rounded-3xl border border-clay bg-beige p-6 md:p-10">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <SectionHeader id="applications-title" title={copy.title} body={copy.body} />
            <Link to={routes.applications} className="btn btn-secondary shrink-0">
              {copy.cta}
            </Link>
          </div>
          <ul className="mt-10 grid gap-4 md:grid-cols-3">
            {oilCategories.map((c) => {
              const Icon = icons[c.id]
              const more = c.oils.length - PREVIEW
              return (
                <li key={c.id} className="rounded-2xl border border-clay bg-cream p-5">
                  <Icon className="h-6 w-6 text-orange" strokeWidth={1.75} aria-hidden />
                  <h3 className="mt-3 text-lg">{c.label}</h3>
                  <p className="mt-1 text-sm text-stone">
                    {c.oils.slice(0, PREVIEW).map((o) => o.oil).join(', ')}
                    {more > 0 && ` + ${more} more`}
                  </p>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </section>
  )
}
