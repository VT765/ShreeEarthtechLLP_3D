import { forwardRef, type RefObject } from 'react'
import { Link } from 'react-router-dom'
import { Download, Send } from 'lucide-react'
import type { Product } from '../../data/products'
import { asset } from '../../lib/asset'
import { enquiryFor, routes } from '../../data/routes'
import { CornerSweep } from '../../components/SCurve'

/** Grade line colours with AA contrast on white: the accent, or brown for Pure Choice. */
const gradeText: Record<Product['id'], string> = {
  crystal: 'var(--orange-deep)',
  hyper: 'var(--orange-deep)',
  pure: 'var(--brown)',
}

type Props = {
  p: Product
  /** When set, the pouch is drawn by the shared WebGL canvas into `slotRef`; the image stays as a poster until `live`. */
  slotRef?: RefObject<HTMLDivElement | null>
  live: boolean
}

const ProductCard = forwardRef<HTMLElement, Props>(function ProductCard({ p, slotRef, live }, ref) {
  const titleId = `product-${p.id}-title`
  return (
    <article
      ref={ref}
      tabIndex={-1}
      aria-labelledby={titleId}
      className="product-card card relative flex h-full flex-col overflow-hidden hover:border-accent"
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
      </div>

      <div className="flex flex-1 flex-col p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: gradeText[p.id] }}>
          {p.grade}
        </p>
        <h3 id={titleId} className="mt-2 text-2xl">
          <Link to={routes.product(p.slug)} className="hover:text-accent-text">
            {p.name}
          </Link>
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
          <a
            href={asset(p.tds)}
            download
            className="btn btn-secondary h-11 flex-1 text-sm"
            aria-label={`Download ${p.short} technical data sheet (PDF)`}
          >
            <Download className="h-4 w-4" aria-hidden /> Download TDS
          </a>
          <Link to={enquiryFor(p.id)} className="btn btn-primary h-11 flex-1 text-sm" aria-label={`Enquire about ${p.short}`}>
            <Send className="h-4 w-4" aria-hidden /> Enquire
          </Link>
        </div>
        <Link to={routes.product(p.slug)} className="text-link mt-4 inline-block text-sm">
          Full product details
        </Link>
      </div>
    </article>
  )
})

export default ProductCard
