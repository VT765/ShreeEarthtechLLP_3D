import { useCallback, useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ChevronDown, Menu, X } from 'lucide-react'
import { isMenu, nav, navSpy, sections, type NavItem, type NavMenu } from '../data/nav'
import { routes } from '../data/routes'
import Logo from './Logo'
import Magnetic from './Magnetic'
import NavDropdown from './NavDropdown'
import NavItemLink from './NavItemLink'
import '../styles/nav.css'

/** The bar turns solid once the page has scrolled this far, so content never shows through it. */
const SOLID_AFTER = 10

/** Which top-level item matches the current page (on home: the section in view). */
function isActive(item: NavItem, pathname: string, homeSection: string) {
  if (pathname === routes.home) return navSpy[item.label]?.includes(homeSection) ?? false
  if (isMenu(item)) return item.items.some((i) => pathname === i.to.split('#')[0])
  const [path, id] = item.to.split('#')
  if (pathname !== path) return false
  return !id || homeSection === id
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState<string | null>(null)
  // Separate from the desktop dropdowns: their outside-click handler must not collapse the accordion.
  const [mobileGroup, setMobileGroup] = useState<string | null>(null)
  const [homeSection, setHomeSection] = useState<string>(sections.home)
  const { pathname } = useLocation()
  const isHome = pathname === routes.home
  const solid = scrolled || !isHome || mobileOpen

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > SOLID_AFTER)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [pathname])

  // Close every menu when the page changes (adjusted during render, not in an effect).
  const [menusFor, setMenusFor] = useState(pathname)
  if (menusFor !== pathname) {
    setMenusFor(pathname)
    setMobileOpen(false)
    setMenuOpen(null)
    setMobileGroup(null)
  }

  // Home only: scrollspy. The section crossing the middle of the screen picks the active item (see navSpy).
  // #about is the pinned hero's About marker (a span), not a section.
  useEffect(() => {
    if (!isHome) return
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setHomeSection(e.target.id)),
      { rootMargin: '-45% 0px -50% 0px' },
    )
    document.querySelectorAll('main section[id], #about').forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [isHome])

  useEffect(() => {
    if (!mobileOpen) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMobileOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [mobileOpen])

  const setOpenFor = useCallback((id: string) => (open: boolean) => setMenuOpen((cur) => (open ? id : cur === id ? null : cur)), [])

  return (
    <header className={`site-nav on-dark fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-out-soft ${solid ? 'is-solid' : ''}`}>
      <nav className="container-x flex h-[76px] items-center justify-between gap-6" aria-label="Primary">
        <Link to={routes.home} className="shrink-0" title="Home">
          <Logo variant="dark" />
        </Link>

        <ul className="hidden items-center gap-1 lg:flex">
          {nav.map((item) => {
            const active = isActive(item, pathname, homeSection)
            return isMenu(item) ? (
              <NavDropdown key={item.id} menu={item} open={menuOpen === item.id} active={active} onOpenChange={setOpenFor(item.id)} />
            ) : (
              <li key={item.to}>
                <NavItemLink to={item.to} className={`nav-link ${active ? 'is-active' : ''}`} aria-current={active ? 'page' : undefined}>
                  {item.label}
                </NavItemLink>
              </li>
            )
          })}
        </ul>

        <div className="flex items-center gap-3">
          <Magnetic>
            <Link to={routes.contact} className="btn btn-primary btn-sm hidden sm:inline-flex">
              Request a quote
            </Link>
          </Magnetic>
          <button
            className="grid h-11 w-11 place-items-center rounded-lg text-white lg:hidden"
            onClick={() => setMobileOpen((o) => !o)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileOpen ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      <div id="mobile-menu" className={`mobile-menu lg:hidden ${mobileOpen ? 'is-open' : ''}`}>
        <ul className="container-x grid gap-1 py-4">
          {nav.map((item) =>
            isMenu(item) ? (
              <MobileGroup
                key={item.id}
                menu={item}
                open={mobileGroup === item.id}
                onToggle={() => setMobileGroup((c) => (c === item.id ? null : item.id))}
                onNavigate={() => setMobileOpen(false)}
              />
            ) : (
              <li key={item.to}>
                <NavItemLink to={item.to} className="mobile-link" onNavigate={() => setMobileOpen(false)}>
                  {item.label}
                </NavItemLink>
              </li>
            ),
          )}
          <li className="pt-2 sm:hidden">
            <Link to={routes.contact} className="btn btn-primary w-full">
              Request a quote
            </Link>
          </li>
        </ul>
      </div>
    </header>
  )
}

/** Mobile: the same menus as tap-to-expand accordions. */
function MobileGroup({ menu, open, onToggle, onNavigate }: { menu: NavMenu; open: boolean; onToggle: () => void; onNavigate: () => void }) {
  const listId = `${menu.id}-mobile`
  return (
    <li>
      <button type="button" className="mobile-link flex w-full items-center justify-between" aria-expanded={open} aria-controls={listId} onClick={onToggle}>
        {menu.label}
        <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} aria-hidden />
      </button>
      <ul id={listId} hidden={!open} className="mb-2 ml-3 grid gap-0.5 border-l border-white/15 pl-3">
        {menu.items.map((i) => (
          <li key={i.to}>
            <NavItemLink to={i.to} className="mobile-link mobile-sublink" onNavigate={onNavigate}>
              {i.label}
            </NavItemLink>
          </li>
        ))}
      </ul>
    </li>
  )
}
