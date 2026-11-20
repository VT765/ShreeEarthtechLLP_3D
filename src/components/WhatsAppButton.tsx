import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { company } from '../data/company'
import { sections } from '../data/nav'
import SocialIcon from './Social'

/**
 * Floating WhatsApp shortcut, clear of the iOS home bar. It steps aside while the footer or the home enquiry
 * section is on screen, so it never sits on top of form fields or footer text.
 */
export default function WhatsAppButton() {
  const { pathname } = useLocation()
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    const targets = [document.querySelector('footer'), document.getElementById(sections.contact)].filter((el): el is HTMLElement => !!el)
    const onScreen = new Set<Element>()
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => (e.isIntersecting ? onScreen.add(e.target) : onScreen.delete(e.target)))
      setHidden(onScreen.size > 0)
    })
    targets.forEach((t) => io.observe(t))
    return () => io.disconnect()
  }, [pathname])

  return (
    <a
      href={`https://wa.me/${company.whatsapp}?text=${encodeURIComponent('Hello Shree Earthtech, I would like a quote for activated bleaching earth.')}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      aria-hidden={hidden || undefined}
      tabIndex={hidden ? -1 : undefined}
      style={{ bottom: 'max(16px, calc(env(safe-area-inset-bottom) + 12px))', right: 'max(16px, calc(env(safe-area-inset-right) + 12px))' }}
      className={`fixed z-40 grid h-12 w-12 place-items-center rounded-full bg-[#1F9D55] text-white shadow-[0_8px_20px_rgba(27,23,20,0.28)] transition-[opacity,transform] duration-300 hover:-translate-y-0.5 ${
        hidden ? 'pointer-events-none translate-y-2 opacity-0' : 'opacity-100'
      }`}
    >
      <SocialIcon name="WhatsApp" className="h-6 w-6" />
    </a>
  )
}
