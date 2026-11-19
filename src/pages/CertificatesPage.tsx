import { useRef, useState } from 'react'
import { Maximize2, X } from 'lucide-react'
import { certifications } from '../data/company'
import { asset } from '../lib/asset'
import PageHero from '../components/PageHero'
import '../styles/certifications.css'

type Cert = (typeof certifications)[number]

/** Every certificate as an image with a View button; View opens it full size. */
export default function CertificatesPage() {
  const dialog = useRef<HTMLDialogElement>(null)
  const [viewing, setViewing] = useState<Cert | null>(null)
  const open = (c: Cert) => {
    setViewing(c)
    dialog.current?.showModal()
  }

  return (
    <>
      <PageHero eyebrow="Quality & compliance" title="Our Certificates" crumbs={[{ label: 'Certificates' }]} />

      <div className="section bg-cream">
        <ul className="container-x grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3 lg:gap-8">
          {certifications.map((c) => (
            <li key={c.id}>
              <button type="button" onClick={() => open(c)} className="cert-frame group" aria-label={`View ${c.title} certificate`}>
                <img src={asset(c.image)} alt="" width={600} height={800} loading="lazy" decoding="async" className="aspect-[3/4] w-full rounded-md bg-white object-contain" />
                <span className="cert-frame-view btn btn-primary h-9 px-3.5 text-sm sm:h-12 sm:px-6 sm:text-base" aria-hidden>
                  <Maximize2 className="h-4 w-4" /> View
                </span>
              </button>
              <h2 className="mt-3 text-center font-display text-base font-bold text-ink sm:mt-4 sm:text-xl">{c.title}</h2>
              <p className="text-center text-xs text-stone sm:text-sm">{c.caption}</p>
            </li>
          ))}
        </ul>
      </div>

      <dialog ref={dialog} className="cert-lightbox" aria-label={viewing ? `${viewing.title} certificate` : undefined} onClose={() => setViewing(null)} onClick={(e) => e.target === e.currentTarget && dialog.current?.close()}>
        {viewing && (
          <figure className="relative">
            <img src={asset(viewing.image)} alt={`${viewing.title} certificate`} className="max-h-[86vh] w-auto rounded-lg bg-white object-contain" />
            <figcaption className="mt-3 text-center text-sm text-white/80">
              {viewing.title} · {viewing.caption}
            </figcaption>
            <button type="button" className="cert-lightbox-close" onClick={() => dialog.current?.close()} aria-label="Close certificate" autoFocus>
              <X className="h-5 w-5" aria-hidden />
            </button>
          </figure>
        )}
      </dialog>
    </>
  )
}
