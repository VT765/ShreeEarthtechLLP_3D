import { useLayoutEffect, useRef, useState } from 'react'
import { Cpu } from 'lucide-react'
import { process } from '../content'
import { gsap, ScrollTrigger } from '../lib/gsap'
import { useIsMobile, useReducedMotion } from '../hooks/useMedia'
import { SWatermark } from '../components/SCurve'
import ProcessArt from './ProcessArt'

export default function Process() {
  const root = useRef<HTMLElement>(null)
  const [step, setStep] = useState(0)
  const isMobile = useIsMobile()
  const reduced = useReducedMotion()
  const pinned = !isMobile && !reduced

  useLayoutEffect(() => {
    const el = root.current
    if (!el || !pinned) return
    const ctx = gsap.context(() => {
      const n = process.steps.length
      ScrollTrigger.create({
        trigger: el,
        start: 'top top',
        end: `+=${n * 55}%`,
        pin: true,
        scrub: true,
        onUpdate: (self) => {
          setStep(Math.min(n - 1, Math.floor(self.progress * n)))
          el.style.setProperty('--progress', String(self.progress))
        },
      })
    }, el)
    return () => ctx.revert()
  }, [pinned])

  return (
    <section id="process" ref={root} className="on-dark bg-dark-hero relative overflow-hidden" style={{ ['--progress' as string]: 0 }}>
      <SWatermark className="absolute -left-24 top-10 h-[700px] w-[560px] text-white/[0.03]" />
      <div className={`container-x relative grid gap-10 lg:grid-cols-12 ${pinned ? 'h-screen content-center py-20' : 'section'}`}>
        <div className="lg:col-span-5">
          <p className="eyebrow">{process.eyebrow}</p>
          <h2 className="h2 mt-4">{process.title}</h2>
          <p className="mt-5 inline-flex items-center gap-2 rounded-full border border-gold-light/30 bg-white/5 px-4 py-2 text-sm text-gold-light">
            <Cpu className="h-4 w-4" strokeWidth={1.75} /> {process.badge}
          </p>

          <ol className="relative mt-10 space-y-1" aria-label="Process steps">
            {pinned && (
              <span className="absolute bottom-3 left-[19px] top-3 w-0.5 bg-white/10" aria-hidden>
                <span className="block h-full w-full origin-top bg-gradient-to-b from-gold-dark to-gold-light" style={{ transform: 'scaleY(var(--progress))' }} />
              </span>
            )}
            {process.steps.map((s, i) => {
              const on = !pinned || i === step
              return (
                <li key={s.title} className={`relative flex gap-5 rounded-xl p-3 transition-all duration-500 ${pinned && i === step ? 'bg-white/[0.06]' : ''}`}>
                  <span
                    className={`relative z-10 grid h-10 w-10 shrink-0 place-items-center rounded-full border font-mono text-sm transition-colors duration-500 ${
                      pinned && i <= step ? 'border-gold-light bg-gold-light text-midnight' : 'border-white/25 bg-midnight text-white/70'
                    } ${!pinned ? '!border-gold-light !text-gold-light' : ''}`}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <h3 className={`text-lg transition-opacity duration-500 ${on ? 'opacity-100' : 'opacity-50'}`}>{s.title}</h3>
                    <div className={`grid transition-all duration-500 ${on ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                      <p className="overflow-hidden text-[15px] text-white/75">
                        {s.body}
                        <span className="mt-1 block font-mono text-xs text-gold-light">{s.meta}</span>
                      </p>
                    </div>
                  </div>
                </li>
              )
            })}
          </ol>
        </div>

        {pinned && (
          <div className="relative hidden lg:col-span-7 lg:block" aria-hidden>
            <div className="card-dark relative aspect-[4/3] overflow-hidden !bg-[#0A2E52]">
              {process.steps.map((s, i) => (
                <div key={s.title} className={`absolute inset-0 transition-all duration-700 ease-out-soft ${i === step ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
                  <ProcessArt step={i} />
                </div>
              ))}
              <div className="absolute bottom-5 left-6 font-mono text-sm text-gold-light">
                Stage {step + 1} / {process.steps.length} · {process.steps[step].title}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
