import { Maximize2 } from 'lucide-react'
import { certifications } from '../data/company'
import { sectionCopy } from '../data/sections'
import { asset } from '../lib/asset'
import PageHero from '../components/PageHero'
import { useCertLightbox } from '../components/useCertLightbox'

const copy = sectionCopy.certificates

/** Every certificate as an image with a View button; View opens it full size. */
export default function CertificatesPage() {
  const { open, lightbox } = useCertLightbox()
  return (
    <>
      <PageHero eyebrow={copy.eyebrow} title={copy.title} body={copy.body} crumbs={[{ label: 'Certificates' }]} />

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

      {lightbox}
    </>
  )
}
