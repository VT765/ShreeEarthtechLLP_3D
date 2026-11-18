import { lazy, useState } from 'react'
import { MapPin, Mountain } from 'lucide-react'
import { rawMaterial } from '../content'
import { useReveal } from '../hooks/useReveal'
import LazyCanvas from '../components/LazyCanvas'

const GujaratMap = lazy(() => import('../scenes/GujaratMap'))
const Montmorillonite = lazy(() => import('../scenes/Montmorillonite'))

export default function RawMaterial() {
  const ref = useReveal<HTMLElement>()
  const [active, setActive] = useState(rawMaterial.sources[0].id)
  const [exploded, setExploded] = useState(false)
  const src = rawMaterial.sources.find((s) => s.id === active)!

  return (
    <section id="raw-material" ref={ref} className="section grain overflow-hidden bg-sand">
      <div className="container-x relative">
        <header className="max-w-3xl">
          <p className="eyebrow" data-reveal>{rawMaterial.eyebrow}</p>
          <h2 className="h2 mt-4" data-reveal="0.05">{rawMaterial.title}</h2>
          <p className="mt-5 text-lg" data-reveal="0.1">{rawMaterial.body}</p>
        </header>

        <div className="mt-14 grid gap-8 lg:grid-cols-2">
          {/* Map */}
          <div data-reveal className="card relative overflow-hidden bg-gradient-to-b from-[#0A3A68] to-[#071F3A] !border-navy">
            <LazyCanvas label="3D map of Gujarat with Bhavnagar and Kutch bentonite sources" className="h-[360px] md:h-[440px]" camera={{ position: [0, 0.3, 6.2], fov: 40 }}>
              <GujaratMap pins={rawMaterial.sources} active={active} onHover={setActive} />
            </LazyCanvas>
            <div className="absolute left-5 top-5 flex gap-2" role="tablist" aria-label="Bentonite source">
              {rawMaterial.sources.map((s) => (
                <button
                  key={s.id}
                  role="tab"
                  aria-selected={active === s.id}
                  onClick={() => setActive(s.id)}
                  onMouseEnter={() => setActive(s.id)}
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                    active === s.id ? 'bg-gold-light text-midnight' : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  <MapPin className="h-3.5 w-3.5" strokeWidth={1.75} /> {s.name}
                </button>
              ))}
            </div>
            <div className="on-dark card-dark absolute inset-x-4 bottom-4 p-5 sm:left-auto sm:w-80" aria-live="polite">
              <p className="flex items-center gap-2 font-display text-lg font-bold text-white">
                <Mountain className="h-5 w-5 text-gold-light" strokeWidth={1.75} /> {src.name} bentonite
              </p>
              <p className="mt-2 text-sm text-white/80">{src.detail}</p>
            </div>
          </div>

          {/* Structure */}
          <div
            data-reveal="0.1"
            className="card relative grid overflow-hidden md:grid-cols-[1fr_1fr] lg:grid-cols-1 xl:grid-cols-[1.1fr_1fr]"
            onMouseEnter={() => setExploded(true)}
            onMouseLeave={() => setExploded(false)}
          >
            <LazyCanvas label="Exploded 3D model of montmorillonite layered silicate sheets" className="h-[320px] bg-gradient-to-br from-sky-tint to-white md:h-full lg:h-[280px] xl:h-full" camera={{ position: [0, 0.4, 6.8], fov: 38 }}>
              <Montmorillonite exploded={exploded} />
            </LazyCanvas>
            <div className="p-6 md:p-8">
              <h3 className="text-2xl">{rawMaterial.structure.title}</h3>
              <p className="mt-3 text-[15px]">{rawMaterial.structure.body}</p>
              <ul className="mt-5 space-y-3 text-sm">
                {rawMaterial.structure.points.map((p, i) => (
                  <li key={p} className="flex items-center gap-3">
                    <span className={`h-3 w-3 shrink-0 rounded-sm ${['bg-brand-blue', 'bg-brand-gold', 'bg-teal'][i]}`} />
                    <span className="text-ink">{p}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => setExploded((e) => !e)}
                className="btn btn-secondary mt-6 h-11 text-sm"
                aria-pressed={exploded}
              >
                {exploded ? 'Collapse layers' : 'Explode layers'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
