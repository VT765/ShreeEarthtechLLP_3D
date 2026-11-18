import type { ReactNode } from 'react'

type Props = { eyebrow: string; title: ReactNode; body?: ReactNode; center?: boolean; className?: string }

export default function SectionHeader({ eyebrow, title, body, center, className = '' }: Props) {
  return (
    <header className={`max-w-3xl ${center ? 'mx-auto text-center' : ''} ${className}`}>
      <p className="eyebrow" data-reveal>
        {eyebrow}
      </p>
      <h2 className="h2 mt-4" data-reveal="0.05">
        {title}
      </h2>
      {body && (
        <p className="mt-5 text-lg" data-reveal="0.1">
          {body}
        </p>
      )}
    </header>
  )
}
