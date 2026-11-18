import { useRef, useState } from 'react'
import { ChevronLeft, ChevronRight, ChevronsLeftRight } from 'lucide-react'
import { applications } from '../content'
import { useReveal } from '../hooks/useReveal'
import { SWatermark } from '../components/SCurve'

function Droplet({ from, to, id }: { from: string; to: string; id: string }) {
  return (
    <svg viewBox="0 0 120 160" className="float-y h-40 w-32 drop-shadow-[0_24px_30px_rgba(0,0,0,0.35)]" aria-hidden>
      <defs>
        <radialGradient id={`d-${id}`} cx="0.38" cy="0.6" r="0.75">
          <stop offset="0" stopColor={to} />
          <stop offset="0.7" stopColor={from} />
          <stop offset="1" stopColor="#050F1E" />
        </radialGradient>
        <linearGradient id={`h-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.85" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d="M60 4 C 60 4, 8 70, 8 104 a52 52 0 0 0 104 0 C 112 70, 60 4, 60 4z" fill={`url(#d-${id})`} />
      <ellipse cx="40" cy="96" rx="11" ry="22" fill={`url(#h-${id})`} transform="rotate(18 40 96)" />
      <circle cx="82" cy="128" r="5" fill="#fff" opacity="0.35" />
    </svg>
  )
}

function BeforeAfter() {
  const [pos, setPos] = useState(50)
  const box = useRef<HTMLDivElement>(null)
  const drag = (clientX: number) => {
    const r = box.current!.getBoundingClientRect()
    setPos(Math.max(0, Math.min(100, ((clientX - r.left) / r.width) * 100)))
  }
  const Beaker = ({ oil, label }: { oil: [string, string]; label: string }) => (
    <div className="absolute inset-0 grid place-items-center" style={{ background: 'radial-gradient(circle at 50% 40%, #0A3A68, #071F3A 70%)' }}>
      <svg viewBox="0 0 300 300" className="h-[78%]" aria-hidden>
        <defs>
          <linearGradient id={`oil-${label}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={oil[1]} />
            <stop offset="1" stopColor={oil[0]} />
          </linearGradient>
        </defs>
        <path d="M80 40 L80 250 a20 20 0 0 0 20 20 L200 270 a20 20 0 0 0 20 -20 L220 40" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.55)" strokeWidth="4" />
        <path d="M83 110 Q150 100 217 110 L217 250 a17 17 0 0 1 -17 17 L100 267 a17 17 0 0 1 -17 -17Z" fill={`url(#oil-${label})`} />
        <rect x="96" y="120" width="10" height="130" rx="5" fill="#fff" opacity="0.18" />
        {[150, 180, 210].map((y) => <line key={y} x1="80" x2="104" y1={y} y2={y} stroke="rgba(255,255,255,0.5)" strokeWidth="2" />)}
        <path d="M70 40 L230 40" stroke="rgba(255,255,255,0.55)" strokeWidth="4" strokeLinecap="round" />
      </svg>
      <span className="absolute bottom-4 rounded-full bg-midnight/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-white">{label}</span>
    </div>
  )
  return (
    <div
      ref={box}
      className="relative aspect-[4/3] w-full touch-none select-none overflow-hidden rounded-2xl border-t-[3px] border-brand-gold"
      onPointerDown={(e) => {
        ;(e.target as Element).setPointerCapture?.(e.pointerId)
        drag(e.clientX)
      }}
      onPointerMove={(e) => e.buttons && drag(e.clientX)}
      data-cursor
    >
      <Beaker oil={['#2A1504', '#5A3A0C']} label="Crude oil" />
      <div className="absolute inset-0" style={{ clipPath: `inset(0 0 0 ${pos}%)` }}>
        <Beaker oil={['#E0B04A', '#FFF3C4']} label="Bleached oil" />
      </div>
      <div className="pointer-events-none absolute inset-y-0 w-0.5 bg-gold-light" style={{ left: `${pos}%` }}>
        <span className="absolute left-1/2 top-1/2 grid h-11 w-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-gold-light text-midnight shadow-lg">
          <ChevronsLeftRight className="h-5 w-5" />
        </span>
      </div>
      <label className="sr-only" htmlFor="ba-range">Compare crude and bleached oil</label>
      <input
        id="ba-range"
        type="range"
        min={0}
        max={100}
        value={Math.round(pos)}
        onChange={(e) => setPos(Number(e.target.value))}
        className="absolute inset-x-0 bottom-0 h-8 w-full cursor-pointer opacity-0 focus-visible:opacity-100"
      />
    </div>
  )
}

export default function Applications() {
  const ref = useReveal<HTMLElement>()
  const track = useRef<HTMLDivElement>(null)
  const scroll = (dir: number) => track.current?.scrollBy({ left: dir * track.current.clientWidth * 0.8, behavior: 'smooth' })
  return (
    <section id="applications" ref={ref} className="section on-dark bg-dark-hero relative overflow-hidden">
      <SWatermark className="absolute -right-20 bottom-0 h-[640px] w-[520px] text-white/[0.03]" />
      <div className="container-x relative">
        <header className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <p className="eyebrow" data-reveal>Applications</p>
            <h2 className="h2 mt-4" data-reveal="0.05">From crude to crystal-clear.</h2>
            <p className="mt-5 text-lg text-white/75" data-reveal="0.1">
              Trusted across edible, industrial and waste-oil refining — wherever colour, gums and contaminants need to go.
            </p>
          </div>
          <div className="flex gap-2 xl:hidden" data-reveal>
            <button onClick={() => scroll(-1)} aria-label="Previous application" className="grid h-12 w-12 place-items-center rounded-full border border-white/25 text-white hover:border-gold-light hover:text-gold-light">
              <ChevronLeft />
            </button>
            <button onClick={() => scroll(1)} aria-label="Next application" className="grid h-12 w-12 place-items-center rounded-full border border-white/25 text-white hover:border-gold-light hover:text-gold-light">
              <ChevronRight />
            </button>
          </div>
        </header>

        <div ref={track} className="-mx-5 mt-12 flex snap-x snap-mandatory gap-6 overflow-x-auto px-5 pb-6 [scrollbar-width:none]" data-lenis-prevent-wheel>
          {applications.map((a, i) => (
            <article key={a.title} data-reveal={i * 0.08} className="card-dark group relative flex min-w-[300px] flex-1 snap-start flex-col items-center p-8 text-center sm:min-w-[380px]">
              <div className="transition-transform duration-700 ease-out-soft group-hover:-translate-y-2 group-hover:rotate-6">
                <Droplet from={a.tint[0]} to={a.tint[1]} id={String(i)} />
              </div>
              <h3 className="mt-4 text-2xl">{a.title}</h3>
              <ul className="mt-5 flex flex-wrap justify-center gap-2">
                {a.items.map((it) => (
                  <li key={it} className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-sm text-white/85">{it}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <div className="mt-16 grid items-center gap-10 lg:grid-cols-2">
          <div data-reveal>
            <h3 className="text-[28px]">See the difference</h3>
            <p className="mt-3 text-white/75">
              Drag the slider to compare dark crude oil with oil bleached using Earthtech activated bleaching earth — chlorophyll, carotenes and trace metals adsorbed, leaving a bright, stable oil.
            </p>
            <ul className="mt-6 grid grid-cols-3 gap-4 text-center">
              {[['≥ 95%', 'Bleaching efficiency'], ['Low', 'Oil retention'], ['Fast', 'Filtration']].map(([v, l]) => (
                <li key={l} className="rounded-xl border border-white/10 bg-white/5 p-4">
                  <p className="font-display text-2xl font-extrabold text-gold-light">{v}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.12em] text-white/75">{l}</p>
                </li>
              ))}
            </ul>
          </div>
          <div data-reveal="0.1">
            <BeforeAfter />
          </div>
        </div>
      </div>
    </section>
  )
}
