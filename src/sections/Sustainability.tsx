import { useEffect, useState } from 'react'
import { Droplets, FlaskConical, Factory, Recycle } from 'lucide-react'
import { sustainability } from '../content'
import { useReveal } from '../hooks/useReveal'
import { useReducedMotion } from '../hooks/useMedia'

const icons = [Droplets, FlaskConical, Factory, Recycle]

export default function Sustainability() {
  const ref = useReveal<HTMLElement>()
  const reduced = useReducedMotion()
  const [active, setActive] = useState(0)
  const n = sustainability.loop.length
  useEffect(() => {
    if (reduced) return
    const t = setInterval(() => setActive((a) => (a + 1) % n), 2600)
    return () => clearInterval(t)
  }, [n, reduced])

  const R = 150
  return (
    <section id="sustainability" ref={ref} className="section relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #F1E9DC 0%, #E7F1EE 100%)' }}>
      <div className="container-x relative grid items-center gap-14 lg:grid-cols-2">
        <div>
          <p className="eyebrow !text-[#176B60] before:!bg-teal" data-reveal>{sustainability.eyebrow}</p>
          <h2 className="h2 mt-4" data-reveal="0.05">
            Zero-Waste <span className="text-teal">by Design.</span>
          </h2>
          <p className="mt-5 text-lg" data-reveal="0.1">{sustainability.body}</p>
          <ol className="mt-8 space-y-3">
            {sustainability.loop.map((s, i) => {
              const I = icons[i]
              return (
                <li key={s.title} data-reveal={i * 0.05}>
                  <button
                    onMouseEnter={() => setActive(i)}
                    onFocus={() => setActive(i)}
                    className={`flex w-full items-start gap-4 rounded-xl border p-4 text-left transition-all duration-500 ${
                      active === i ? 'border-teal bg-white shadow-[0_10px_30px_rgba(30,140,126,0.15)]' : 'border-transparent'
                    }`}
                  >
                    <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-lg transition-colors duration-500 ${active === i ? 'bg-teal text-white' : 'bg-white text-teal'}`}>
                      <I className="h-5 w-5" strokeWidth={1.75} />
                    </span>
                    <span>
                      <strong className="block font-display text-ink">{s.title}</strong>
                      <span className="text-[15px]">{s.body}</span>
                    </span>
                  </button>
                </li>
              )
            })}
          </ol>
        </div>

        <div className="relative mx-auto aspect-square w-full max-w-[460px]" data-reveal="0.1" aria-hidden>
          <svg viewBox="-200 -200 400 400" className="h-full w-full">
            <defs>
              <linearGradient id="eco" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#1E8C7E" />
                <stop offset="1" stopColor="#0C71C7" />
              </linearGradient>
              <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5" orient="auto">
                <path d="M0 0 L10 5 L0 10z" fill="#1E8C7E" />
              </marker>
            </defs>
            <circle r={R} fill="none" stroke="#1E8C7E" strokeOpacity="0.15" strokeWidth="26" />
            <circle r={R} fill="none" stroke="url(#eco)" strokeWidth="4" strokeDasharray="14 12" style={{ animation: reduced ? undefined : 'dash-flow 5s linear infinite' }} />
            {[0, 1, 2, 3].map((i) => {
              const a = (i / n) * Math.PI * 2 - Math.PI / 2 + Math.PI / 4
              return <path key={i} d={`M${Math.cos(a - 0.08) * R} ${Math.sin(a - 0.08) * R} A ${R} ${R} 0 0 1 ${Math.cos(a) * R} ${Math.sin(a) * R}`} fill="none" stroke="#1E8C7E" strokeWidth="4" markerEnd="url(#arrow)" />
            })}
            <circle r="78" fill="#fff" />
            <circle r="78" fill="none" stroke="#1E8C7E" strokeOpacity="0.25" strokeWidth="2" />
            <text textAnchor="middle" y="-6" fontFamily="Plus Jakarta Sans" fontWeight="800" fontSize="30" fill="#176B60">Zero</text>
            <text textAnchor="middle" y="22" fontFamily="Inter" fontWeight="600" fontSize="13" letterSpacing="3" fill="#4F5562">WASTE LOOP</text>
            {sustainability.loop.map((s, i) => {
              const a = (i / n) * Math.PI * 2 - Math.PI / 2
              const x = Math.cos(a) * R
              const y = Math.sin(a) * R
              const on = active === i
              return (
                <g key={s.title} transform={`translate(${x} ${y})`} style={{ transition: 'transform 0.5s' }}>
                  <circle r={on ? 36 : 30} fill={on ? '#1E8C7E' : '#fff'} stroke="#1E8C7E" strokeWidth="3" style={{ transition: 'all 0.5s' }} />
                  <text textAnchor="middle" y="5" fontFamily="JetBrains Mono" fontSize="14" fontWeight="500" fill={on ? '#fff' : '#176B60'}>
                    {String(i + 1).padStart(2, '0')}
                  </text>
                </g>
              )
            })}
          </svg>
        </div>
      </div>
    </section>
  )
}
