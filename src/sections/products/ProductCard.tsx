import { forwardRef, type RefObject } from 'react'
import { Download, Send, Sparkles } from 'lucide-react'
import type { Product } from '../../data/products'
import type { BagPointer } from '../../scenes/ProductBag'
import { asset } from '../../lib/asset'
import { enquireAbout } from '../../lib/events'
import Tilt from '../../components/Tilt'
import { CornerSweep } from '../../components/SCurve'

/** Grade line colours with AA contrast on white (the raw brand colours are too light for small text). */
const gradeText: Record<Product['id'], string> = {
  crystal: 'var(--blue-deep)',
  hyper: 'var(--gold-dark)',
  pure: '#176B60',
}

type Props = {
  p: Product
  index: number
  highlighted: boolean
  /** When set, the bag is drawn by the shared WebGL canvas into `slotRef`; the image stays as a poster until `live`. */
  slotRef?: RefObject<HTMLDivElement | null>
  live: boolean
  pointer?: BagPointer
  reveal: boolean
}

const ProductCard = forwardRef<HTMLElement, Props>(function ProductCard({ p, index, highlighted, slotRef, live, pointer, reveal }, ref) {
  const titleId = `product-${p.id}-title`
  return (
    <Tilt max={5} className="h-full" data-reveal={reveal ? index * 0.08 : undefined}>
      <article
        ref={ref}
        tabIndex={-1}
        aria-labelledby={titleId}
        className={`product-card card card-hover relative flex h-full flex-col overflow-hidden ${highlighted ? 'is-highlighted' : ''}`}
        onPointerMove={(e) => {
          if (!pointer || e.pointerType !== 'mouse') return
          const r = e.currentTarget.getBoundingClientRect()
          pointer.x = (e.clientX - r.left) / r.width - 0.5
          pointer.y = (e.clientY - r.top) / r.height - 0.5
          pointer.active = true
        }}
        onPointerLeave={() => {
          if (pointer) pointer.active = false
        }}
      >
        <CornerSweep className="right-3 top-3 z-[1] h-12 w-12" />
        <div ref={slotRef} className="bag-stage relative h-[260px] sm:h-[280px]">
          <img
            src={asset(p.image.src)}
            alt={p.image.alt}
            width={400}
            height={400}
            loading="lazy"
            decoding="async"
            className={`absolute inset-0 h-full w-full object-contain p-6 transition-opacity duration-500 ${live ? 'opacity-0' : 'opacity-100'}`}
          />
          {highlighted && (
            <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-gold-light px-3 py-1 text-xs font-bold text-midnight">
              <Sparkles className="h-3.5 w-3.5" strokeWidth={2} aria-hidden /> Recommended
            </span>
          )}
        </div>

        <div className="flex flex-1 flex-col p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: gradeText[p.id] }}>
            {p.grade}
          </p>
          <h3 id={titleId} className="mt-2 text-2xl">
            {p.name}
          </h3>
          <p className="mt-2 text-[15px]">{p.body}</p>

          <dl className="mt-5 grid grid-cols-3 gap-2 border-t border-clay pt-4">
            {p.keySpecs.map((s) => (
              <div key={s.label} className="min-w-0">
                <dt className="text-[11px] font-medium uppercase leading-tight tracking-wide text-stone">{s.label}</dt>
                <dd className="mt-1 font-mono text-sm font-medium text-ink">{s.value}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-auto flex flex-wrap gap-3 pt-6">
            <a href={asset(p.tds)} download className="btn btn-secondary h-11 flex-1 text-sm" aria-label={`Download ${p.short} technical data sheet (PDF)`}>
              <Download className="h-4 w-4" aria-hidden /> Download TDS
            </a>
            <button type="button" onClick={() => enquireAbout(p.id)} className="btn btn-primary h-11 flex-1 text-sm" aria-label={`Enquire about ${p.short}`}>
              <Send className="h-4 w-4" aria-hidden /> Enquire
            </button>
          </div>
        </div>
      </article>
    </Tilt>
  )
})

export default ProductCard
