import type { ReactNode } from 'react'
import { tightPunct } from '../lib/tightPunct'

type Props = {
  /** Id of the h2, for the section's aria-labelledby. */
  id?: string
  /** Optional short label above the title; only where it adds information. */
  eyebrow?: string
  /** Plain strings get the punctuation fix; pass nodes for mixed styling. */
  title: ReactNode
  body?: ReactNode
  center?: boolean
  className?: string
}

export default function SectionHeader({ id, eyebrow, title, body, center, className = '' }: Props) {
  return (
    <header className={`max-w-3xl ${center ? 'mx-auto text-center' : ''} ${className}`}>
      {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
      <h2 id={id} className="h2">
        {typeof title === 'string' ? tightPunct(title) : title}
      </h2>
      {body && <p className="mt-5 text-lg">{body}</p>}
    </header>
  )
}
