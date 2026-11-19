import { useEffect, useRef, useState } from 'react'
import { certifications } from '../data/company'
import { sections } from '../data/nav'
import { sectionCopy } from '../data/sections'
import { asset } from '../lib/asset'
import { useReveal } from '../hooks/useReveal'
import SectionHeader from '../components/SectionHeader'
import CertSeal from '../components/CertSeal'
import '../styles/certifications.css'

const copy = sectionCopy.certifications

/**
 * Certification seals with a certificate preview: opens on mouse hover, keyboard focus or tap;
 * closes on leave/blur, a second tap, Esc or an outside tap. Images come from `certifications[].image`.
 */
export default function CertificationBlock() {
  const ref = useReveal<HTMLElement>()
  const list = useRef<HTMLUListElement>(null)
  const [open, setOpen] = useState<string | null>(null)
  const lastPointer = useRef('')

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(null)
    const onDown = (e: PointerEvent) => !list.current?.contains(e.target as Node) && setOpen(null)
    window.addEventListener('keydown', onKey)
    document.addEventListener('pointerdown', onDown)
    return () => {
      window.removeEventListener('keydown', onKey)
      document.removeEventListener('pointerdown', onDown)
    }
  }, [open])

  return (
    <section id={sections.certificates} ref={ref} className="section bg-beige" aria-labelledby="certs-title">
      <div className="container-x">
        <SectionHeader eyebrow={copy.eyebrow} title={<span id="certs-title">{copy.title}</span>} body={copy.body} center />
        <ul ref={list} className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {certifications.map((c) => {
            const isOpen = open === c.id
            const previewId = `cert-preview-${c.id}`
            return (
              <li
                key={c.id}
                className="relative"
                onPointerEnter={(e) => e.pointerType === 'mouse' && setOpen(c.id)}
                onPointerLeave={(e) => e.pointerType === 'mouse' && setOpen((o) => (o === c.id ? null : o))}
              >
                <button
                  type="button"
                  className={`cert-card ${isOpen ? 'is-open' : ''}`}
                  aria-expanded={isOpen}
                  aria-controls={previewId}
                  onPointerDown={(e) => (lastPointer.current = e.pointerType)}
                  // Keyboard focus opens the preview; tap/click focus is handled by onClick.
                  onFocus={(e) => e.currentTarget.matches(':focus-visible') && setOpen(c.id)}
                  onBlur={() => setOpen((o) => (o === c.id ? null : o))}
                  onClick={() => {
                    // Mouse already opened it on hover; touch (and keyboard Enter) toggles.
                    if (lastPointer.current !== 'mouse') setOpen((o) => (o === c.id ? null : c.id))
                    lastPointer.current = ''
                  }}
                >
                  <CertSeal title={c.title} className="h-20 w-20 text-orange" />
                  <span className="mt-3 block font-display text-sm font-bold text-ink">{c.title}</span>
                  <span className="block text-xs text-stone">{c.caption}</span>
                  <span className="sr-only">: show certificate preview</span>
                </button>
                <div id={previewId} role="region" aria-label={`${c.title} certificate preview`} className={`cert-preview ${isOpen ? 'is-open' : ''}`}>
                  {isOpen && (
                    <>
                      <img src={asset(c.image)} alt={`${c.title} certificate (placeholder image)`} width={600} height={800} className="aspect-[3/4] w-full rounded-lg bg-cream object-contain" />
                      <p className="mt-2 text-center text-xs text-stone">{c.title} · {c.caption}</p>
                    </>
                  )}
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
