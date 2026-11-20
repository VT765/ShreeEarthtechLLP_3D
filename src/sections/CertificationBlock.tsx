import { certifications } from '../data/company'
import { sections } from '../data/nav'
import { sectionCopy } from '../data/sections'
import SectionHeader from '../components/SectionHeader'
import CertSeal from '../components/CertSeal'
import { useCertLightbox } from '../components/useCertLightbox'

const copy = sectionCopy.certifications

/** Certification cards with the issuer and expiry on show; the button opens the full certificate. */
export default function CertificationBlock() {
  const { open, lightbox } = useCertLightbox()
  return (
    <section id={sections.certificates} className="section bg-beige" aria-labelledby="certs-title">
      <div className="container-x">
        <SectionHeader id="certs-title" title={copy.title} body={copy.body} />
        <ul className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {certifications.map((c) => (
            <li key={c.id}>
              <article className="cert-card">
                <CertSeal title={c.title} className="h-16 w-16 text-orange" />
                <h3 className="mt-3 font-display text-base font-bold text-ink">{c.title}</h3>
                <p className="text-xs text-stone">{c.caption}</p>
                <dl className="mt-3 w-full space-y-1 border-t border-clay pt-3 text-left text-xs">
                  <div className="flex justify-between gap-2">
                    <dt className="text-stone">Issued by</dt>
                    <dd className="text-right font-medium text-ink">{c.issuer}</dd>
                  </div>
                  <div className="flex justify-between gap-2">
                    <dt className="text-stone">Valid till</dt>
                    <dd className="text-right font-medium text-ink">{c.validTill}</dd>
                  </div>
                </dl>
                {/* Stretched over the card, so a tap anywhere opens the certificate. */}
                <button type="button" onClick={() => open(c)} className="text-link mt-auto pt-3 text-sm after:absolute after:inset-0 after:content-['']">
                  View certificate<span className="sr-only">: {c.title}</span>
                </button>
              </article>
            </li>
          ))}
        </ul>
      </div>
      {lightbox}
    </section>
  )
}
