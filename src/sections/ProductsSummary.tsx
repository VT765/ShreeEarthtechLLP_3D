import type { RefObject } from 'react'
import { Link } from 'react-router-dom'
import { sections } from '../data/nav'
import { compareRows, products, type Product } from '../data/products'
import { routes } from '../data/routes'
import { sectionCopy } from '../data/sections'
import { asset } from '../lib/asset'
import SectionHeader from '../components/SectionHeader'
import { useBagViews } from './products/useBagViews'

const copy = sectionCopy.productsSummary

/**
 * Home: one card per grade with its 3D pouch and the same four comparison rows. The cards share their grid
 * rows (subgrid), so each spec row lines up across all three. Full specs and TDS live on /products/:slug.
 */
export default function ProductsSummary() {
  const { areaRef, slots, live, portal } = useBagViews<HTMLUListElement>(products)
  return (
    <section id={sections.products} className="section section-continues bg-cream" aria-labelledby="products-title">
      <div className="container-x">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHeader id="products-title" title={copy.title} body={copy.body} />
          <Link to={routes.products} className="btn btn-secondary shrink-0">
            {copy.cta}
          </Link>
        </div>
        <ul ref={areaRef} className="mt-12 grid gap-6 md:grid-cols-3 md:gap-y-0">
          {products.map((p) => (
            <li key={p.id} className="md:row-span-7 md:grid md:grid-rows-subgrid">
              <SummaryCard p={p} slotRef={slots?.[p.id]} live={live} />
            </li>
          ))}
        </ul>
      </div>
      {portal}
    </section>
  )
}

type CardProps = { p: Product; slotRef?: RefObject<HTMLSpanElement | null>; live: boolean }

function SummaryCard({ p, slotRef, live }: CardProps) {
  return (
    <article className="card group relative flex flex-col overflow-hidden hover:border-accent md:row-span-7 md:grid md:grid-rows-subgrid md:gap-0">
      <span ref={slotRef} className="bag-stage relative block aspect-[4/3]">
        <img
          src={asset(p.image.src)}
          alt={p.image.alt}
          width={400}
          height={300}
          loading="lazy"
          decoding="async"
          className={`h-full w-full object-contain p-4 transition-opacity duration-500 ${live ? 'opacity-0' : 'opacity-100'}`}
        />
      </span>
      <div className="px-6 pt-6">
        <p className="text-sm font-semibold text-orange-deep">{p.grade}</p>
        <h3 className="mt-1 text-2xl">
          {/* Stretched link: the whole card is clickable, but only the name is announced as the link. */}
          <Link to={routes.product(p.slug)} className="after:absolute after:inset-0 after:content-['']">
            {p.name}
          </Link>
        </h3>
        <p className="mt-2 pb-5 text-[15px]">{p.body}</p>
      </div>
      <dl className="mx-6 md:row-span-4 md:grid md:grid-rows-subgrid">
        {compareRows.map((r) => (
          <div key={r.key} className="flex items-baseline justify-between gap-4 border-t border-clay py-2.5 text-sm">
            <dt className="shrink-0 text-stone">{r.label}</dt>
            <dd className="text-right font-medium text-ink">{p.compare[r.key]}</dd>
          </div>
        ))}
      </dl>
      <span className="px-6 pb-6 pt-3 text-sm font-semibold text-accent-text group-hover:underline" aria-hidden>
        View product
      </span>
    </article>
  )
}
