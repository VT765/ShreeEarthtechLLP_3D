import { useEffect, useRef, type KeyboardEvent } from 'react'
import { ChevronDown } from 'lucide-react'
import type { NavMenu } from '../data/nav'
import NavItemLink from './NavItemLink'

type Props = {
  menu: NavMenu
  open: boolean
  active: boolean
  onOpenChange: (open: boolean) => void
}

const CLOSE_DELAY = 160

/**
 * Disclosure-style dropdown (button + list of links). Opens on mouse hover, on click/tap and from the
 * keyboard (Enter/Space/ArrowDown); closes on Esc (focus returns to the button), outside click or
 * when focus leaves it.
 */
export default function NavDropdown({ menu, open, active, onOpenChange }: Props) {
  const root = useRef<HTMLLIElement>(null)
  const button = useRef<HTMLButtonElement>(null)
  const list = useRef<HTMLUListElement>(null)
  const closeTimer = useRef(0)
  // A click right after a hover-open shouldn't immediately close the menu again.
  const hoverOpened = useRef(false)
  const listId = `${menu.id}-list`

  useEffect(() => {
    if (!open) return
    const onDown = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) onOpenChange(false)
    }
    document.addEventListener('pointerdown', onDown)
    return () => document.removeEventListener('pointerdown', onDown)
  }, [open, onOpenChange])

  useEffect(() => () => window.clearTimeout(closeTimer.current), [])

  const links = () => Array.from(list.current?.querySelectorAll<HTMLAnchorElement>('a') ?? [])

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && open) {
      e.stopPropagation()
      onOpenChange(false)
      button.current?.focus()
      return
    }
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return
    e.preventDefault()
    if (!open) onOpenChange(true)
    // Wait a frame so the list is visible before moving focus into it.
    requestAnimationFrame(() => {
      const items = links()
      const i = items.indexOf(document.activeElement as HTMLAnchorElement)
      const next = e.key === 'ArrowDown' ? (i + 1) % items.length : i <= 0 ? items.length - 1 : i - 1
      items[next]?.focus()
    })
  }

  return (
    <li
      ref={root}
      className="relative"
      onKeyDown={onKeyDown}
      onPointerEnter={(e) => {
        if (e.pointerType !== 'mouse') return
        window.clearTimeout(closeTimer.current)
        if (!open) hoverOpened.current = true
        onOpenChange(true)
      }}
      onPointerLeave={(e) => {
        if (e.pointerType !== 'mouse') return
        hoverOpened.current = false
        closeTimer.current = window.setTimeout(() => onOpenChange(false), CLOSE_DELAY)
      }}
      onBlur={(e) => {
        if (!root.current?.contains(e.relatedTarget as Node)) onOpenChange(false)
      }}
    >
      <button
        ref={button}
        type="button"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => {
          onOpenChange(hoverOpened.current || !open)
          hoverOpened.current = false
        }}
        className={`nav-link inline-flex items-center gap-1 ${active ? 'is-active' : ''}`}
      >
        {menu.label}
        <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} aria-hidden />
      </button>
      <div className={`nav-menu ${open ? 'is-open' : ''}`}>
        <ul ref={list} id={listId} aria-label={menu.label} className="nav-menu-list">
          {menu.items.map((item) => (
            <li key={item.to}>
              <NavItemLink to={item.to} className="nav-menu-link" onNavigate={() => onOpenChange(false)}>
                <span className="block font-semibold text-ink">{item.label}</span>
                {item.description && <span className="mt-0.5 block text-xs text-stone">{item.description}</span>}
              </NavItemLink>
            </li>
          ))}
        </ul>
      </div>
    </li>
  )
}
