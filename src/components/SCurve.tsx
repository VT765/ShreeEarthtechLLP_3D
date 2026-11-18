/** The logo's sweeping "S" curve, reused as a decorative motif. */
export function SWatermark({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 240" className={`pointer-events-none ${className}`} aria-hidden fill="none">
      <path
        d="M160 40 C 120 6, 40 10, 32 62 C 24 112, 96 116, 132 132 C 176 152, 168 222, 98 228 C 64 231, 40 220, 24 204"
        stroke="currentColor"
        strokeWidth="34"
        strokeLinecap="round"
      />
    </svg>
  )
}

/** Curved section divider; `fill` is the colour of the next section. */
export function CurveDivider({ fill, flip = false, className = '' }: { fill: string; flip?: boolean; className?: string }) {
  return (
    <svg
      viewBox="0 0 1440 80"
      preserveAspectRatio="none"
      className={`pointer-events-none absolute inset-x-0 h-12 w-full md:h-20 ${flip ? 'top-0 rotate-180' : 'bottom-0'} ${className}`}
      aria-hidden
    >
      <path d="M0 80 L0 46 C 360 -10, 760 92, 1100 38 C 1260 12, 1380 24, 1440 34 L1440 80 Z" fill={fill} />
    </svg>
  )
}

/** Small gold corner sweep used on card corners. */
export function CornerSweep({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 60 60" className={`pointer-events-none absolute ${className}`} aria-hidden fill="none">
      <path d="M58 2 C 30 2, 2 18, 2 58" stroke="var(--brand-gold)" strokeWidth="2.5" strokeLinecap="round" opacity="0.7" />
    </svg>
  )
}
