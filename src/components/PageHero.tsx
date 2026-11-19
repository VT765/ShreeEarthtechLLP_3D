import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { routes } from '../data/routes'
import { SWatermark } from './SCurve'

type Crumb = { label: string; to?: string }
type Props = { eyebrow: string; title: ReactNode; body?: ReactNode; crumbs?: Crumb[]; children?: ReactNode }

/** Dark title band at the top of every inner page (clears the fixed 76px navbar). */
export default function PageHero({ eyebrow, title, body, crumbs = [], children }: Props) {
  return (
    <header className="on-dark relative overflow-hidden bg-charcoal pb-14 pt-[132px] lg:pb-20 lg:pt-[160px]">
      <SWatermark className="absolute -right-20 -top-10 h-[420px] w-auto text-orange/[0.08]" />
      <div className="container-x relative">
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-1.5 text-sm text-white/65">
            {[{ label: 'Home', to: routes.home }, ...crumbs].map((c, i, all) => (
              <li key={c.label} className="flex items-center gap-1.5">
                {c.to && i < all.length - 1 ? (
                  <Link to={c.to} className="hover:text-orange-light">
                    {c.label}
                  </Link>
                ) : (
                  <span aria-current="page">{c.label}</span>
                )}
                {i < all.length - 1 && <ChevronRight className="h-3.5 w-3.5" aria-hidden />}
              </li>
            ))}
          </ol>
        </nav>
        <p className="eyebrow mt-8">{eyebrow}</p>
        <h1 className="mt-4 max-w-4xl text-[clamp(2.2rem,5vw,3.6rem)]">{title}</h1>
        {body && <p className="mt-5 max-w-2xl text-lg text-white/75">{body}</p>}
        {children}
      </div>
    </header>
  )
}
