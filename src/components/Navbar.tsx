import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Menu, Phone, X } from 'lucide-react'
import { nav, sections } from '../data/nav'
import { company, telHref } from '../data/company'
import Logo from './Logo'
import Magnetic from './Magnetic'
import { scrollToId } from './SmoothScroll'

/** Placed right after the hero; the bar turns solid once this reaches it. */
export const HERO_END_ID = 'hero-end'
const BAR_H = 76

export default function Navbar() {
  const [pastHero, setPastHero] = useState(false)
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState<string>(sections.home)
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const isHome = pathname === '/'
  const solid = pastHero || !isHome || open

  useEffect(() => {
    const onScroll = () => {
      const end = document.getElementById(HERO_END_ID)
      setPastHero(!end || end.getBoundingClientRect().top <= BAR_H)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [pathname])

  useEffect(() => {
    if (!isHome) return
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-45% 0px -50% 0px' },
    )
    // Observe every section (not just linked ones) so an unlinked section clears the highlight.
    document.querySelectorAll('main section[id], footer section[id], #about').forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [isHome])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const go = (id: string) => {
    setOpen(false)
    if (isHome) scrollToId(id)
    else navigate(`/#${id}`)
  }

  const phone = company.phones[0]

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-out-soft ${
        solid ? 'bg-midnight/90 shadow-[0_8px_30px_rgba(5,15,30,0.35)] backdrop-blur-xl' : 'bg-transparent'
      }`}
    >
      <nav className="container-x flex h-[76px] items-center justify-between gap-6" aria-label="Primary">
        <Link to="/" onClick={() => go(sections.home)} className="shrink-0" title="Home">
          <Logo variant="dark" />
        </Link>

        <ul className="hidden items-center gap-1 lg:flex">
          {nav.map(({ label, id }) => {
            const isActive = isHome && active === id
            return (
              <li key={id}>
                <a
                  href={`#${id}`}
                  onClick={(e) => {
                    e.preventDefault()
                    go(id)
                  }}
                  aria-current={isActive ? 'true' : undefined}
                  className={`relative rounded-md px-3 py-2 text-[14px] font-medium text-white/80 transition-colors hover:text-white ${
                    isActive ? '!text-gold-light' : ''
                  }`}
                >
                  {label}
                  <span
                    className={`absolute inset-x-3 -bottom-0.5 h-0.5 origin-left rounded bg-brand-gold transition-transform duration-500 ${
                      isActive ? 'scale-x-100' : 'scale-x-0'
                    }`}
                  />
                </a>
              </li>
            )
          })}
        </ul>

        <div className="flex items-center gap-3">
          <Magnetic>
            <a href={telHref(phone)} className="btn btn-gold hidden h-11 sm:inline-flex" aria-label={`Call now: ${phone}`}>
              <Phone className="h-4 w-4" /> Call Now
            </a>
          </Magnetic>
          <button
            className="grid h-11 w-11 place-items-center rounded-lg text-white lg:hidden"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      <div
        id="mobile-menu"
        className={`overflow-hidden border-t border-white/10 transition-[max-height] duration-500 ease-out-soft lg:hidden ${
          open ? 'max-h-[600px]' : 'invisible max-h-0 border-t-0'
        }`}
      >
        <ul className="container-x grid gap-1 py-4">
          {nav.map(({ label, id }) => (
            <li key={id}>
              <button onClick={() => go(id)} className="w-full rounded-lg px-3 py-3 text-left font-medium text-white/90 hover:bg-white/10">
                {label}
              </button>
            </li>
          ))}
          <li className="pt-2 sm:hidden">
            <a href={telHref(phone)} className="btn btn-gold w-full">
              <Phone className="h-4 w-4" /> Call Now
            </a>
          </li>
        </ul>
      </div>
    </header>
  )
}
