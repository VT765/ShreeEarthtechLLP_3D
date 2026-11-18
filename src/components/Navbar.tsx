import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { nav } from '../content'
import Logo from './Logo'
import Magnetic from './Magnetic'
import { scrollToId } from './SmoothScroll'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('home')
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const darkHero = pathname === '/'
  const solid = scrolled || !darkHero || open

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (pathname !== '/') return
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-45% 0px -50% 0px' },
    )
    nav.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) io.observe(el)
    })
    return () => io.disconnect()
  }, [pathname])

  const go = (id: string) => {
    setOpen(false)
    if (pathname === '/') scrollToId(id)
    else navigate(`/#${id}`)
  }

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-out-soft ${
        solid ? 'bg-ivory/95 shadow-[0_8px_30px_rgba(7,31,58,0.08)] backdrop-blur-xl' : 'bg-transparent'
      }`}
    >
      <nav className="container-x flex h-[76px] items-center justify-between gap-6" aria-label="Primary">
        <Link to="/" onClick={() => go('home')} className="shrink-0" aria-label="Shree Earthtech home">
          <Logo variant={solid ? 'light' : 'dark'} />
        </Link>

        <ul className="hidden items-center gap-1 xl:flex">
          {nav.map(({ label, id }) => {
            const isActive = pathname === '/' && active === id
            return (
              <li key={id}>
                <a
                  href={`/#${id}`}
                  onClick={(e) => {
                    e.preventDefault()
                    go(id)
                  }}
                  aria-current={isActive ? 'true' : undefined}
                  className={`relative rounded-md px-3 py-2 text-[14px] font-medium transition-colors ${
                    solid ? 'text-ink hover:text-brand-blue' : 'text-white/85 hover:text-white'
                  } ${isActive ? (solid ? '!text-brand-blue' : '!text-gold-light') : ''}`}
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
            <Link to="/contact" className="btn btn-gold hidden h-11 sm:inline-flex">
              Get Quote
            </Link>
          </Magnetic>
          <button
            className={`grid h-11 w-11 place-items-center rounded-lg xl:hidden ${solid ? 'text-ink' : 'text-white'}`}
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
        className={`overflow-hidden border-t border-clay/70 bg-ivory transition-[max-height] duration-500 ease-out-soft xl:hidden ${
          open ? 'max-h-[600px]' : 'max-h-0 border-t-0'
        }`}
      >
        <ul className="container-x grid gap-1 py-4">
          {nav.map(({ label, id }) => (
            <li key={id}>
              <button onClick={() => go(id)} className="w-full rounded-lg px-3 py-3 text-left font-medium text-ink hover:bg-sand">
                {label}
              </button>
            </li>
          ))}
          <li className="pt-2 sm:hidden">
            <Link to="/contact" onClick={() => setOpen(false)} className="btn btn-gold w-full">
              Get Quote
            </Link>
          </li>
        </ul>
      </div>
    </header>
  )
}
