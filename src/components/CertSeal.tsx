/**
 * PLACEHOLDER certification mark: a generic seal until the official logo files are supplied.
 * Swap for the certifying body's artwork (respecting their usage guidelines) when available.
 */
export default function CertSeal({ title, className = 'h-20 w-20' }: { title: string; className?: string }) {
  const iso = title.match(/^ISO\s+(\d+)(?::(\d{4}))?/)
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden>
      <circle cx="50" cy="50" r="47" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.9" />
      <circle cx="50" cy="50" r="40" fill="var(--cream)" stroke="currentColor" strokeWidth="0.8" strokeDasharray="2 3" opacity="0.8" />
      {Array.from({ length: 24 }, (_, i) => (
        <line key={i} x1="50" y1="5" x2="50" y2="8.5" stroke="currentColor" strokeWidth="1" opacity="0.5" transform={`rotate(${i * 15} 50 50)`} />
      ))}
      <path d="M50 18 l2.4 4.9 5.4.8-3.9 3.8.9 5.4-4.8-2.6-4.8 2.6.9-5.4-3.9-3.8 5.4-.8z" fill="var(--orange)" />
      {iso ? (
        <>
          <text x="50" y="45" textAnchor="middle" fontSize="9" fontWeight="600" letterSpacing="2" fill="var(--sky-deep)" fontFamily="Inter, sans-serif">
            ISO
          </text>
          <text x="50" y="62" textAnchor="middle" fontSize="17" fontWeight="800" fill="var(--ink)" fontFamily="'Plus Jakarta Sans', sans-serif">
            {iso[1]}
          </text>
          {iso[2] && (
            <text x="50" y="75" textAnchor="middle" fontSize="8" fill="var(--stone)" fontFamily="'JetBrains Mono', monospace">
              {iso[2]}
            </text>
          )}
        </>
      ) : (
        <text x="50" y="60" textAnchor="middle" fontSize="15" fontWeight="800" fill="var(--ink)" fontFamily="'Plus Jakarta Sans', sans-serif">
          {title}
        </text>
      )}
    </svg>
  )
}
