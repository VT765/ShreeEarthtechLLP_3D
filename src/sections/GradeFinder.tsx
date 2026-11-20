import { useId, useState, type ReactNode } from 'react'
import { ArrowRight, Droplets, Factory, Recycle, Send } from 'lucide-react'
import { sectionCopy } from '../data/sections'
import { sections } from '../data/nav'
import { oilCategories, type OilCategory } from '../data/gradeFinder'
import { productById } from '../data/products'
import { Link } from 'react-router-dom'
import { enquiryFor, routes } from '../data/routes'
import { asset } from '../lib/asset'
import SectionHeader from '../components/SectionHeader'
import { SWatermark } from '../components/SCurve'
import '../styles/products.css'

const copy = sectionCopy.gradeFinder

const categoryIcon: Record<OilCategory['id'], typeof Droplets> = { edible: Droplets, industrial: Factory, waste: Recycle }

/** Native radio inputs styled as segmented buttons / chips: arrow-key navigation and semantics come for free. */
function RadioOption({ name, value, checked, onChange, children, variant }: {
  name: string
  value: string
  checked: boolean
  onChange: (v: string) => void
  children: ReactNode
  variant: 'segment' | 'chip'
}) {
  const base =
    variant === 'segment'
      ? 'flex h-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition-colors'
      : 'inline-flex items-center rounded-full border px-4 py-2 text-sm font-medium transition-colors'
  const state =
    variant === 'segment'
      ? checked
        ? 'bg-charcoal text-white shadow-[0_8px_20px_rgba(27,23,20,0.2)]'
        : 'text-body hover:bg-white hover:text-ink'
      : checked
        ? 'border-orange bg-orange-light/25 text-charcoal'
        : 'border-clay bg-white text-body hover:border-accent hover:text-ink'
  return (
    <label className="seg-option relative cursor-pointer">
      <input type="radio" name={name} value={value} checked={checked} onChange={() => onChange(value)} className="absolute inset-0 h-full w-full cursor-pointer opacity-0" />
      <span className={`${base} ${state}`}>{children}</span>
    </label>
  )
}

export default function GradeFinder() {
  const uid = useId()
  const [catId, setCatId] = useState<OilCategory['id']>(oilCategories[0].id)
  const category = oilCategories.find((c) => c.id === catId)!
  const [oil, setOil] = useState(category.oils[0].oil)
  const match = category.oils.find((o) => o.oil === oil) ?? category.oils[0]
  const product = productById(match.grade)

  const pickCategory = (id: string) => {
    const next = oilCategories.find((c) => c.id === id)!
    setCatId(next.id)
    setOil(next.oils[0].oil)
  }

  return (
    <section id={sections.gradeFinder} className="section grain overflow-hidden bg-beige" aria-labelledby="grade-finder-title">
      <SWatermark className="absolute -right-16 top-10 hidden h-[420px] w-auto text-clay/70 lg:block" />
      <div className="container-x relative">
        <SectionHeader eyebrow={copy.eyebrow} title={<span id="grade-finder-title">{copy.title}</span>} body={copy.body} />

        <div className="mt-12 grid gap-8 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-7">
            <fieldset>
              <legend className="mb-3 text-sm font-semibold uppercase tracking-[0.12em] text-stone">1. Oil category</legend>
              <div className="grid grid-cols-1 gap-1.5 rounded-2xl border border-clay bg-cream p-1.5 sm:grid-cols-3">
                {oilCategories.map((c) => {
                  const Icon = categoryIcon[c.id]
                  return (
                    <RadioOption key={c.id} name={`${uid}-cat`} value={c.id} checked={c.id === catId} onChange={pickCategory} variant="segment">
                      <Icon className="h-4 w-4 shrink-0" strokeWidth={1.75} aria-hidden />
                      {c.label}
                    </RadioOption>
                  )
                })}
              </div>
            </fieldset>

            <fieldset className="mt-8">
              <legend className="mb-3 text-sm font-semibold uppercase tracking-[0.12em] text-stone">2. Your oil</legend>
              <div className="flex flex-wrap gap-2.5">
                {category.oils.map((o) => (
                  <RadioOption key={o.oil} name={`${uid}-oil`} value={o.oil} checked={o.oil === match.oil} onChange={setOil} variant="chip">
                    {o.oil}
                  </RadioOption>
                ))}
              </div>
            </fieldset>
            <p className="mt-6 text-sm text-stone">{copy.note}</p>
          </div>

          <div className="lg:col-span-5">
            <p className="sr-only" aria-live="polite">
              Recommended for {match.oil}: {product.name}. {match.reason}
            </p>
            <article key={`${catId}-${match.oil}`} className="gf-result on-dark card-dark relative overflow-hidden p-6 md:p-8" aria-labelledby={`${uid}-result`}>
              <p className="eyebrow">Recommended for {match.oil}</p>
              <div className="mt-5 flex items-center gap-5">
                <img src={asset(product.image.src)} alt="" width={96} height={96} className="h-24 w-24 shrink-0 rounded-xl bg-white/5 object-contain p-2" />
                <div className="min-w-0">
                  <h3 id={`${uid}-result`} className="text-2xl">
                    {product.name}
                  </h3>
                  <p className="mt-1 text-sm font-medium text-orange-light">{product.grade}</p>
                </div>
              </div>
              <p className="mt-5 text-[15px] text-white/80">{match.reason}</p>
              <dl className="mt-5 grid grid-cols-3 gap-2 border-t border-white/10 pt-4">
                {product.keySpecs.map((s) => (
                  <div key={s.label} className="min-w-0">
                    <dt className="text-[11px] uppercase leading-tight tracking-wide text-white/60">{s.label}</dt>
                    <dd className="mt-1 font-mono text-sm text-white">{s.value}</dd>
                  </div>
                ))}
              </dl>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link to={routes.product(product.slug)} className="btn btn-orange h-11 flex-1 text-sm">
                  View product <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
                <Link to={enquiryFor(product.id)} className="btn btn-ghost-dark h-11 flex-1 text-sm">
                  <Send className="h-4 w-4" aria-hidden /> Enquire
                </Link>
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>
  )
}
