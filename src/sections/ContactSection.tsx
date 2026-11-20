import { Download, Mail, Phone } from 'lucide-react'
import { company, telHref } from '../data/company'
import { sections } from '../data/nav'
import { sectionCopy } from '../data/sections'
import { asset } from '../lib/asset'
import { tightPunct } from '../lib/tightPunct'
import QuickEnquiry from '../components/QuickEnquiry'
import '../styles/footer.css'

const copy = sectionCopy.contactCta

/** Home: the closing quote request, with the short enquiry form. Other pages get the footer's CTA band instead. */
export default function ContactSection() {
  const phone = company.phones[0]
  const email = company.emails[0]
  return (
    <section id={sections.contact} className="section section-sheet footer-bg on-dark" aria-labelledby="contact-title">
      <div className="container-x grid gap-10 lg:grid-cols-12 lg:gap-14">
        <div className="lg:col-span-5">
          <h2 id="contact-title" className="h2">
            {tightPunct(copy.title)}
          </h2>
          <p className="mt-4 text-lg text-white/75">{copy.body}</p>
          <a href={asset(company.brochure)} download className="btn btn-secondary mt-8">
            <Download className="h-4 w-4" aria-hidden /> {copy.brochure}
          </a>
          <ul className="mt-8 space-y-3 text-[15px]">
            <li>
              <a href={telHref(phone)} className="footer-link inline-flex items-center gap-2">
                <Phone className="h-4 w-4" aria-hidden /> {phone}
              </a>
            </li>
            <li>
              <a href={`mailto:${email}`} className="footer-link inline-flex items-center gap-2">
                <Mail className="h-4 w-4" aria-hidden /> {email}
              </a>
            </li>
          </ul>
        </div>
        <div className="lg:col-span-7">
          <QuickEnquiry />
        </div>
      </div>
    </section>
  )
}
