// Static stand-in for the 3D morph (reduced motion / low-power phones / no WebGL):
// layered clay block → loose granules → oil drop, drawn as thin teal and gold strokes.

const TEAL = '#2C6A99'
const GOLD = '#F2A25C'

/** Irregular plate outline, deterministic so it never jitters between renders. */
function plate(cx: number, cy: number, rx: number, seed: number) {
  const pts = Array.from({ length: 10 }, (_, j) => {
    const th = (j / 10) * Math.PI * 2
    const r = 1 + 0.08 * Math.sin(3 * th + seed) + 0.05 * Math.sin(5 * th + seed * 2)
    return [cx + Math.cos(th) * rx * r, cy + Math.sin(th) * rx * 0.32 * r] as const
  })
  return pts
}

const plates = Array.from({ length: 6 }, (_, i) => {
  const taper = 1 - 0.22 * ((i - 2.5) / 2.5) ** 2
  return plate(140 + (i % 2 ? 4 : -4), 300 - i * 30, 92 * taper, i * 1.7)
})

// Granules drifting from the rock towards the drop.
const granules = Array.from({ length: 26 }, (_, i) => {
  const t = (i * 0.6180339) % 1
  return { x: 230 + t * 110, y: 130 + ((i * 37) % 200), r: 1.4 + ((i * 7) % 5) * 0.4, gold: t > 0.6 }
})

// Teardrop: tip at (400, 100), round belly centred on (400, 270).
const drop = 'M400 100 C 400 100 330 200 330 262 A 70 70 0 0 0 470 262 C 470 200 400 100 400 100 Z'
const rings = [
  { y: 175, rx: 30 },
  { y: 215, rx: 50 },
  { y: 255, rx: 68 },
  { y: 295, rx: 64 },
]

export default function HeroIllustration({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 520 400" className={className} fill="none" strokeLinecap="round" strokeLinejoin="round" aria-hidden focusable="false">
      <g stroke={TEAL} strokeWidth={1.4}>
        {plates.map((pts, i) => (
          <g key={i} opacity={0.55 + i * 0.07}>
            <polygon points={pts.map((p) => p.join(',')).join(' ')} />
            {/* plate thickness: verticals on the front half */}
            {pts.slice(0, 6).map(([x, y], j) => (
              <line key={j} x1={x} y1={y} x2={x} y2={y + 12} opacity={0.6} />
            ))}
            {/* lattice chords */}
            <line x1={pts[1][0]} y1={pts[1][1]} x2={pts[5][0]} y2={pts[5][1]} opacity={0.35} />
            <line x1={pts[3][0]} y1={pts[3][1]} x2={pts[8][0]} y2={pts[8][1]} opacity={0.35} />
          </g>
        ))}
      </g>
      <g>
        {granules.map((g, i) => (
          <circle key={i} cx={g.x} cy={g.y} r={g.r} fill={g.gold ? GOLD : TEAL} opacity={0.75} />
        ))}
      </g>
      <g stroke={GOLD} strokeWidth={1.4}>
        <path d={drop} />
        {rings.map((r) => (
          <ellipse key={r.y} cx={400} cy={r.y} rx={r.rx} ry={r.rx * 0.22} opacity={0.55} />
        ))}
        <path d="M400 100 C 400 100 372 200 370 262 C 368 300 382 330 400 332" opacity={0.45} />
        <path d="M400 100 C 400 100 428 200 430 262 C 432 300 418 330 400 332" opacity={0.45} />
        <path d="M400 100 V 332" opacity={0.35} />
      </g>
    </svg>
  )
}
