import { useEffect, useState } from 'react'
import { Award, X } from 'lucide-react'
import { certifications } from '../content'
import { useReveal } from '../hooks/useReveal'
import Logo from '../components/Logo'

function Seal({ title, small }: { title: string; small?: boolean }) {
  const isIso = title.startsWith('ISO')
  const [code, year] = isIso ? title.replace('ISO ', '').split(':') : [title, '']
  return (
    <div className={`relative grid aspect-square place-items-center rounded-full ${small ? 'w-28' : 'w-36'}`} style={{ background: 'conic-gradient(from 210deg, #8F620C, #E0B04A, #FFF3C4, #E0B04A, #BF8311, #8F620C)' }}>
      <div className="absolute inset-[6px] rounded-full bg-[radial-gradient(circle_at_35%_30%,#0C71C7,#0A3A68_70%)] shadow-[inset_0_4px_12px_rgba(0,0,0,0.4)]" />
      <div className="absolute inset-[12px] rounded-full border border-dashed border-gold-light/50" />
      <div className="relative text-center">
        {isIso && <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gold-light">ISO</p>}
        <p className="font-display text-xl font-extrabold leading-none text-white">{code}</p>
        {year && <p className="mt-1 font-mono text-xs text-gold-light">{year}</p>}
      </div>
    </div>
  )
}

export default function Certifications() {
  const ref = useReveal<HTMLElement>()
  const [open, setOpen] = useState<(typeof certifications)[number] | null>(null)
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(null)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <section id="certifications" ref={ref} className="section grain bg-sand">
      <div className="container-x relative">
        <header className="mx-auto max-w-3xl text-center">
          <p className="eyebrow" data-reveal>Certifications</p>
          <h2 className="h2 mt-4" data-reveal="0.05">Certified to global standards.</h2>
          <p className="mt-5 text-lg" data-reveal="0.1">Quality, environment, food safety and occupational health — independently audited.</p>
        </header>
        <ul className="mt-14 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-6">
          {certifications.map((c, i) => (
            <li key={c.id} data-reveal={i * 0.06}>
              <button
                onClick={() => setOpen(c)}
                className="group flex w-full flex-col items-center gap-4 rounded-2xl p-4 [perspective:800px]"
                aria-label={`View ${c.title} certificate`}
              >
                <div className="float-y transition-transform duration-700 ease-out-soft group-hover:[transform:rotateY(25deg)_scale(1.06)]" style={{ animationDelay: `${i * 0.5}s` }}>
                  <div className="drop-shadow-[0_18px_24px_rgba(7,31,58,0.25)]">
                    <Seal title={c.title} small />
                  </div>
                </div>
                <span className="text-center">
                  <span className="block font-display font-bold text-ink">{c.title}</span>
                  <span className="text-sm text-stone">{c.caption}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {open && (
        <div className="fixed inset-0 z-[150] grid place-items-center bg-ink-deep/80 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label={`${open.title} certificate`} onClick={() => setOpen(null)}>
          <div className="relative w-full max-w-lg rounded-2xl bg-white p-3 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <button autoFocus onClick={() => setOpen(null)} className="absolute -right-3 -top-3 grid h-10 w-10 place-items-center rounded-full bg-gold-light text-midnight shadow" aria-label="Close">
              <X className="h-5 w-5" />
            </button>
            {/* PLACEHOLDER certificate — replace with /public/certificates/<id>.jpg */}
            <div className="relative aspect-[1/1.3] overflow-hidden rounded-xl border-[10px] border-double border-brand-gold/60 bg-ivory p-8 text-center">
              <Logo className="mx-auto h-12" />
              <p className="mt-6 text-xs uppercase tracking-[0.3em] text-gold-dark">Certificate of Registration</p>
              <h3 className="mt-3 text-3xl">{open.title}</h3>
              <p className="mt-1 text-stone">{open.caption}</p>
              <p className="mx-auto mt-6 max-w-xs text-sm">This is to certify that the management system of <strong>Shree Earthtech LLP</strong>, Bhavnagar, Gujarat, India has been assessed and found to conform to the requirements of the above standard.</p>
              <div className="mt-8 flex justify-center">
                <Seal title={open.title} />
              </div>
              <p className="absolute inset-x-0 bottom-4 flex items-center justify-center gap-1.5 text-xs text-stone">
                <Award className="h-3.5 w-3.5" /> Placeholder — original certificate image to be supplied
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
