import { useEffect, useRef, useState } from 'react'
import { about } from '../content'
import { useReveal } from '../hooks/useReveal'
import { useInView } from '../hooks/useInView'
import { CornerSweep } from '../components/SCurve'

function Counter({ value, suffix }: { value: number; suffix: string }) {
  const [ref, inView] = useInView<HTMLSpanElement>('0px', true)
  const [n, setN] = useState(0)
  const started = useRef(false)
  useEffect(() => {
    if (!inView || started.current) return
    started.current = true
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return setN(value)
    const t0 = performance.now()
    const dur = 1600
    let raf = 0
    const step = (t: number) => {
      const k = Math.min(1, (t - t0) / dur)
      setN(Math.round(value * (1 - Math.pow(1 - k, 3))))
      if (k < 1) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [inView, value])
  return (
    <span ref={ref} className="tabular-nums">
      {n.toLocaleString('en-IN')}
      {suffix}
    </span>
  )
}

export default function About() {
  const ref = useReveal<HTMLElement>()
  return (
    <section id="about" ref={ref} className="section grain overflow-hidden bg-ivory">
      <div className="container-x relative grid items-center gap-14 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <p className="eyebrow" data-reveal>
            {about.eyebrow}
          </p>
          <h2 className="h2 mt-4" data-reveal="0.05">
            {about.title}
          </h2>
          <p className="mt-6 text-lg" data-reveal="0.1">
            {about.body}
          </p>
          <div className="mt-8 flex flex-wrap gap-2" data-reveal="0.15">
            {['Montmorillonite bentonite', 'Controlled acid activation', 'Batch-to-batch consistency'].map((t) => (
              <span key={t} className="badge">
                {t}
              </span>
            ))}
          </div>
        </div>
        <dl className="grid grid-cols-2 gap-4 sm:gap-6 lg:col-span-6">
          {about.stats.map((s, i) => (
            <div key={s.label} data-reveal={i * 0.08} className="card card-hover relative overflow-hidden p-6 sm:p-8">
              <CornerSweep className="right-3 top-3 h-10 w-10" />
              <dd className="font-display text-[clamp(32px,4vw,48px)] font-extrabold tracking-tight text-blue-deep">
                <Counter value={s.value} suffix={s.suffix} />
              </dd>
              <dt className="mt-2 text-sm font-medium uppercase tracking-[0.12em] text-stone">{s.label}</dt>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
