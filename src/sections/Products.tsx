import { lazy, useState } from 'react'
import { Check, Download, RotateCw, Search } from 'lucide-react'
import { gradeFinder, products, specs, type GradeId } from '../content'
import { useReveal } from '../hooks/useReveal'
import { downloadTDS } from '../lib/tds'
import LazyCanvas from '../components/LazyCanvas'
import { CornerSweep } from '../components/SCurve'

const ProductBag = lazy(() => import('../scenes/ProductBag'))

function ProductCard({ p, idx, highlighted }: { p: (typeof products)[number]; idx: number; highlighted: boolean }) {
  const [flipped, setFlipped] = useState(false)
  return (
    <article
      data-reveal={idx * 0.08}
      className={`relative h-[600px] rounded-2xl transition-shadow duration-700 [perspective:1400px] ${
        highlighted ? 'shadow-[0_0_0_3px_#E0B04A,0_0_60px_rgba(224,176,74,0.55)]' : ''
      }`}
      aria-labelledby={`p-${p.id}`}
    >
      <div
        className="relative h-full w-full transition-transform duration-700 ease-out-soft [transform-style:preserve-3d]"
        style={{ transform: flipped ? 'rotateY(180deg)' : 'none' }}
      >
        {/* Front */}
        <div className="card absolute inset-0 flex flex-col overflow-hidden [backface-visibility:hidden]" aria-hidden={flipped}>
          <CornerSweep className="right-3 top-3 h-12 w-12" />
          <div className="relative h-[300px] bg-gradient-to-b from-sand to-white">
            <LazyCanvas label={`3D ${p.name} packaging bag`} className="h-full" camera={{ position: [0, 0.2, 4.4], fov: 38 }}>
              <ProductBag name={p.name} color={p.color} />
            </LazyCanvas>
            {highlighted && (
              <span className="absolute left-4 top-4 inline-flex items-center gap-1 rounded-full bg-gold-light px-3 py-1 text-xs font-bold text-midnight">
                <Check className="h-3.5 w-3.5" /> Recommended
              </span>
            )}
          </div>
          <div className="flex flex-1 flex-col p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: { crystal: 'var(--blue-deep)', hyper: 'var(--gold-dark)', pure: '#176B60' }[p.id] }}>
              {p.line}
            </p>
            <h3 id={`p-${p.id}`} className="mt-2 text-2xl">
              {p.name}
            </h3>
            <p className="mt-2 text-[15px]">{p.body}</p>
            <div className="mt-auto flex flex-wrap gap-3 pt-5">
              <button onClick={() => setFlipped(true)} className="btn btn-secondary h-11 text-sm">
                <RotateCw className="h-4 w-4" /> View specs
              </button>
              <button onClick={() => downloadTDS(p.id)} className="btn btn-primary h-11 text-sm">
                <Download className="h-4 w-4" /> Download TDS
              </button>
            </div>
          </div>
        </div>

        {/* Back */}
        <div className="on-dark card-dark absolute inset-0 flex flex-col overflow-hidden p-6 [backface-visibility:hidden] [transform:rotateY(180deg)]" aria-hidden={!flipped}>
          <p className="eyebrow">Technical specs</p>
          <h3 className="mt-2 text-2xl">{p.name}</h3>
          <dl className="mt-4 divide-y divide-white/10 overflow-auto text-sm">
            {specs.map((s) => (
              <div key={s.parameter} className="flex justify-between gap-4 py-2">
                <dt className="text-white/75">{s.parameter}</dt>
                <dd className="shrink-0 font-mono text-gold-light">{s.values[idx]}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-auto flex flex-wrap gap-3 pt-4">
            <button onClick={() => setFlipped(false)} className="btn btn-ghost-dark h-11 text-sm">
              <RotateCw className="h-4 w-4" /> Back
            </button>
            <button onClick={() => downloadTDS(p.id)} className="btn btn-gold h-11 text-sm">
              <Download className="h-4 w-4" /> Download TDS
            </button>
          </div>
        </div>
      </div>
    </article>
  )
}

export function SpecTable() {
  return (
    <div id="specs" className="mt-20" data-reveal>
      <h3 className="text-[28px]">Technical specifications</h3>
      <div className="mt-6 overflow-x-auto rounded-2xl border border-clay shadow-[0_10px_30px_rgba(7,31,58,0.08)]">
        <table className="spec-table w-full min-w-[680px] border-collapse text-left">
          <caption className="sr-only">Technical specifications of Earthtech activated bleaching earth grades</caption>
          <thead>
            <tr>
              <th scope="col" className="px-5 py-4">Parameter</th>
              {products.map((p) => (
                <th key={p.id} scope="col" className="px-5 py-4">{p.short}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {specs.map((s) => (
              <tr key={s.parameter}>
                <th scope="row" className="px-5 py-3.5">{s.parameter}</th>
                {s.values.map((v, i) => (
                  <td key={i} className="bg-white px-5 py-3.5">{v}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function GradeFinder({ value, onChange }: { value: string; onChange: (oil: string) => void }) {
  const match = gradeFinder.find((g) => g.oil === value)
  const product = match && products.find((p) => p.id === match.grade)
  return (
    <div data-reveal className="card relative mt-14 grid gap-6 overflow-hidden p-6 md:grid-cols-[auto_1fr] md:items-center md:p-8">
      <div className="flex items-center gap-4">
        <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-brand-gradient text-white">
          <Search className="h-6 w-6" strokeWidth={1.75} />
        </span>
        <div>
          <h3 className="text-xl">Grade Finder</h3>
          <p className="text-sm text-stone">Pick your oil — we’ll highlight the best grade.</p>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-[minmax(220px,320px)_1fr] md:items-center">
        <label className="sr-only" htmlFor="oil-select">Oil type</label>
        <select id="oil-select" className="field" value={value} onChange={(e) => onChange(e.target.value)}>
          <option value="">Select oil type…</option>
          {['Edible', 'Edible / Industrial', 'Industrial', 'Waste Oil'].map((grp) => (
            <optgroup key={grp} label={grp}>
              {gradeFinder.filter((g) => g.group === grp).map((g) => (
                <option key={g.oil}>{g.oil}</option>
              ))}
            </optgroup>
          ))}
        </select>
        <p className="text-[15px]" aria-live="polite">
          {product ? (
            <>
              <strong className="text-ink">{product.name}</strong> — {match!.why}
            </>
          ) : (
            <span className="text-stone">Recommendations are a starting point; we validate with lab trials on your oil.</span>
          )}
        </p>
      </div>
    </div>
  )
}

export default function Products({ showTable = true }: { showTable?: boolean }) {
  const ref = useReveal<HTMLElement>()
  const [oil, setOil] = useState('')
  const recommended: GradeId | undefined = gradeFinder.find((g) => g.oil === oil)?.grade
  return (
    <section id="products" ref={ref} className="section grain bg-ivory">
      <div className="container-x relative">
        <header className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <p className="eyebrow" data-reveal>Products</p>
            <h2 className="h2 mt-4" data-reveal="0.05">Three grades. Every oil covered.</h2>
            <p className="mt-5 text-lg" data-reveal="0.1">
              Earthtech activated bleaching earth is engineered for high bleaching efficiency, fast filtration and low oil retention — in three activity levels.
            </p>
          </div>
        </header>
        <GradeFinder value={oil} onChange={setOil} />
        <div className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {products.map((p, i) => (
            <ProductCard key={p.id} p={p} idx={i} highlighted={recommended === p.id} />
          ))}
        </div>
        {showTable && <SpecTable />}
      </div>
    </section>
  )
}
