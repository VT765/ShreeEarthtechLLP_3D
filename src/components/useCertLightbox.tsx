import { useRef, useState } from 'react'
import { X } from 'lucide-react'
import { certifications } from '../data/company'
import { asset } from '../lib/asset'
import '../styles/certifications.css'

export type Cert = (typeof certifications)[number]

/** Full-size certificate viewer (native <dialog>: focus trap, Esc and inert page come for free). */
export function useCertLightbox() {
  const dialog = useRef<HTMLDialogElement>(null)
  const [viewing, setViewing] = useState<Cert | null>(null)
  const open = (c: Cert) => {
    setViewing(c)
    dialog.current?.showModal()
  }
  const lightbox = (
    <dialog
      ref={dialog}
      className="cert-lightbox"
      aria-label={viewing ? `${viewing.title} certificate` : undefined}
      onClose={() => setViewing(null)}
      onClick={(e) => e.target === e.currentTarget && dialog.current?.close()}
    >
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
  )
  return { open, lightbox }
}
