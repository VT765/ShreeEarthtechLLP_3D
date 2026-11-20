import { Fragment, type ReactNode } from 'react'

/**
 * Wraps , . : ; ! ? in `.punct` so they sit against the previous word. Plus Jakarta Sans draws them with a
 * wide left side bearing at display weights, which reads as a space before the mark in large headings.
 */
export function tightPunct(text: string): ReactNode {
  return text.split(/([,.:;!?])/).map((part, i) =>
    i % 2 ? (
      <span key={i} className="punct">
        {part}
      </span>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    ),
  )
}
