import { lazy } from 'react'
import { Package, PackageOpen, Container, Truck } from 'lucide-react'
import { packaging } from '../content'
import { useReveal } from '../hooks/useReveal'
import LazyCanvas from '../components/LazyCanvas'

const PackagingScene = lazy(() => import('../scenes/PackagingScene'))
const icons = [Package, PackageOpen, Container, Truck]

export default function Packaging() {
  const ref = useReveal<HTMLElement>()
  return (
    <section id="packaging" ref={ref} className="section grain bg-ivory">
      <div className="container-x relative grid items-center gap-12 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <p className="eyebrow" data-reveal>{packaging.eyebrow}</p>
          <h2 className="h2 mt-4" data-reveal="0.05">{packaging.title}</h2>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2">
            {packaging.items.map((it, i) => {
              const I = icons[i]
              return (
                <li key={it.title} data-reveal={i * 0.06} className="card card-hover p-5">
                  <I className="h-6 w-6 text-brand-blue" strokeWidth={1.75} />
                  <h3 className="mt-3 text-lg">{it.title}</h3>
                  <p className="mt-1 text-sm">{it.body}</p>
                </li>
              )
            })}
          </ul>
        </div>
        <div className="lg:col-span-7" data-reveal="0.1">
          <div className="card relative overflow-hidden bg-gradient-to-b from-sky-tint to-sand">
            <LazyCanvas label="3D models of paper bags on a pallet, a jumbo FIBC bag and a delivery truck" className="h-[380px] md:h-[460px]" camera={{ position: [0, 3, 9.6], fov: 40 }}>
              <PackagingScene />
            </LazyCanvas>
            <p className="pointer-events-none absolute bottom-4 left-5 text-xs font-medium text-stone">Drag to rotate</p>
          </div>
        </div>
      </div>
    </section>
  )
}
