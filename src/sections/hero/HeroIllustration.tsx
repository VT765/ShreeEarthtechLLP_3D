// Static stand-in for the 3D assembly (reduced motion / low-power phones / no WebGL): the same plant
// model projected to 2D and drawn as dotted strokes, plus a loose scatter of crystal platelets for slide 1.
import { BELT_A, BELT_B, lerp3, plantEdges, type V3 } from '../../scenes/hero/plantModel'

const SKY = '#8CC3E8'
const ORANGE = '#F2A25C'
const W = 480
const H = 360
const PAD = 24

/** Same three-quarter view the 3D camera settles on: turned by `yaw`, looking down by `pitch`. */
function projector(yaw: number, pitch: number) {
  const [cy, sy, cp, sp] = [Math.cos(yaw), Math.sin(yaw), Math.cos(pitch), Math.sin(pitch)]
  return ([x, y, z]: V3): [number, number] => {
    const rx = x * cy + z * sy
    const rz = -x * sy + z * cy
    return [rx, -(y * cp - rz * sp)]
  }
}

/** Plant edges grouped into one path per style, fitted to the viewBox. Computed once. */
const plant = (() => {
  const project = projector(-0.42, 0.34)
  const edges = plantEdges().map((e) => ({ ...e, a: project(e.a), b: project(e.b) }))
  const xs = edges.flatMap((e) => [e.a[0], e.b[0]])
  const ys = edges.flatMap((e) => [e.a[1], e.b[1]])
  const [x0, y0] = [Math.min(...xs), Math.min(...ys)]
  const scale = Math.min((W - PAD * 2) / (Math.max(...xs) - x0), (H - PAD * 2) / (Math.max(...ys) - y0))
  const fit = ([x, y]: [number, number]) => `${(PAD + (x - x0) * scale).toFixed(1)} ${(PAD + (y - y0) * scale).toFixed(1)}`
  const d = (keep: (e: (typeof edges)[number]) => boolean) =>
    edges
      .filter(keep)
      .map((e) => `M${fit(e.a)}L${fit(e.b)}`)
      .join('')
  const project2 = (p: V3) => fit(project(p)).split(' ').map(Number)
  return {
    structure: d((e) => e.kind === 0 && e.density === 1),
    grid: d((e) => e.density < 1),
    accent: d((e) => e.kind === 1),
    // Material on the conveyor.
    belt: [0.2, 0.45, 0.7].map((f) => project2(lerp3(BELT_A, BELT_B, f))),
  }
})()

/** Hexagonal platelets: centre, radius, in-plane turn, tilt (squash) and whether it carries an orange edge. */
const crystals = [
  [70, 80, 22, 0.2, 0.45, false],
  [150, 45, 16, 0.9, 0.7, false],
  [235, 95, 26, 0.5, 0.35, true],
  [330, 55, 18, 1.4, 0.6, false],
  [410, 110, 24, 0.1, 0.5, false],
  [110, 170, 18, 1.1, 0.55, false],
  [195, 200, 15, 0.3, 0.8, true],
  [300, 170, 22, 0.8, 0.4, false],
  [395, 215, 17, 1.6, 0.65, false],
  [60, 265, 24, 0.6, 0.4, false],
  [150, 290, 19, 1.3, 0.6, false],
  [250, 280, 24, 0.0, 0.45, false],
  [345, 300, 16, 0.7, 0.75, true],
  [430, 290, 20, 1.0, 0.5, false],
] as const

function crystalPath([cx, cy, r, turn, squash]: (typeof crystals)[number]) {
  const h = r * 0.45
  const pts = Array.from({ length: 6 }, (_, k) => {
    const th = turn + (k * Math.PI) / 3
    return [cx + Math.cos(th) * r, cy + Math.sin(th) * r * squash] as const
  })
  const ring = (dy: number) => `M${pts.map(([x, y]) => `${x.toFixed(1)} ${(y + dy).toFixed(1)}`).join('L')}Z`
  const sides = pts.map(([x, y]) => `M${x.toFixed(1)} ${y.toFixed(1)}v${h.toFixed(1)}`).join('')
  return ring(0) + ring(h) + sides
}

// Round caps on zero-length dashes draw dots; the pattern restarts on every subpath, so each edge starts on a dot.
const dots = { fill: 'none', strokeLinecap: 'round', strokeDasharray: '0 6.5', strokeWidth: 2.4 } as const

type Props = { variant: 'crystals' | 'plant'; className?: string }

/** Fixed 4:3 box, so nothing shifts when it paints. */
export default function HeroIllustration({ variant, className = '' }: Props) {
  const box = `aspect-[4/3] w-full ${className}`
  if (variant === 'crystals') {
    return (
      <div className={box}>
        <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" aria-hidden focusable="false">
          {crystals.map((c, i) => (
            <path key={i} d={crystalPath(c)} stroke={c[5] ? ORANGE : SKY} opacity={0.65 + (i % 3) * 0.12} {...dots} />
          ))}
        </svg>
      </div>
    )
  }
  return (
    <div className={box}>
      <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" role="img" aria-label="Illustration of a bleaching earth plant" focusable="false">
        <path d={plant.grid} stroke={SKY} opacity={0.35} {...dots} />
        <path d={plant.structure} stroke={SKY} opacity={0.9} {...dots} />
        <path d={plant.accent} stroke={ORANGE} {...dots} />
        {plant.belt.map(([x, y]) => (
          <circle key={x} cx={x} cy={y - 3} r={2.6} fill={ORANGE} />
        ))}
      </svg>
    </div>
  )
}
