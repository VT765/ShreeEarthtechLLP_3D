import type { ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { scrollToId } from './SmoothScroll'

type Props = { to: string; className?: string; children: ReactNode; onNavigate?: () => void; 'aria-current'?: 'page' | undefined }

/** Router link that also scrolls when the target is a `#section` on the page already open. */
export default function NavItemLink({ to, className, children, onNavigate, ...rest }: Props) {
  const { pathname, hash } = useLocation()
  const [path, id] = to.split('#')
  return (
    <Link
      to={to}
      className={className}
      aria-current={rest['aria-current']}
      onClick={(e) => {
        onNavigate?.()
        // Same page + same hash: the router won't fire a change, so scroll ourselves.
        if (id && (path || '/') === pathname && `#${id}` === hash) {
          e.preventDefault()
          scrollToId(id)
        }
      }}
    >
      {children}
    </Link>
  )
}
