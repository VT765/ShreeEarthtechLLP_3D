import { sections } from '../data/nav'
import { sectionCopy } from '../data/sections'
import PageHero from '../components/PageHero'
import ContactDetails from '../components/ContactDetails'
import EnquiryForm from '../components/EnquiryForm'
import '../styles/footer.css'

/** Contact details, map and the enquiry form (pre-selects the product from ?grade=…). */
export default function ContactPage() {
  const c = sectionCopy.contact
  return (
    <>
      <PageHero eyebrow={c.eyebrow} title={c.title} body={c.body} crumbs={[{ label: 'Contact' }]} />
      <section id={sections.contact} className="footer-bg section" aria-label="Contact details and enquiry form">
        <div className="container-x grid gap-12 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-5">
            <ContactDetails />
          </div>
          <div className="lg:col-span-7">
            <EnquiryForm />
          </div>
        </div>
      </section>
    </>
  )
}
