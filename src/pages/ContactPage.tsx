import PageHero from '../components/PageHero'
import Contact from '../sections/Contact'

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Let’s talk about your oil."
        body="Request a quote, a lab trial or our full catalogue. Our technical sales team responds within one business day."
      />
      <Contact />
    </>
  )
}
