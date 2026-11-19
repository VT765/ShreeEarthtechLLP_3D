import { sections } from '../data/nav'

// STUB — replaced by the footer + enquiry form implementation.
export default function Footer() {
  return (
    <footer className="bg-ink-deep">
      <section id={sections.contact} aria-label="Contact" />
      <div id={sections.certificates} />
    </footer>
  )
}
