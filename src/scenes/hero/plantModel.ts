// The miniature bleaching-earth plant as a list of 3D edges. No three.js here, so the static SVG
// fallback can project the very same model without pulling three into the main chunk.

export type V3 = [number, number, number]
/** `kind`: 0 structure (sky), 1 accent (orange), 2 conveyor dot (orange, slides along the belt). */
export type Edge = { a: V3; b: V3; kind: number; density: number }

export const lerp3 = (a: V3, b: V3, f: number): V3 => [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f, a[2] + (b[2] - a[2]) * f]

export class Sketch {
  edges: Edge[] = []
  kind = 0
  density = 1
  line(a: V3, b: V3) {
    this.edges.push({ a, b, kind: this.kind, density: this.density })
  }
  /** Polyline through `pts` (closed when `loop`). */
  path(pts: V3[], loop = false) {
    for (let i = 0; i < pts.length - (loop ? 0 : 1); i++) this.line(pts[i], pts[(i + 1) % pts.length])
  }
  /** Horizontal circle (xz plane), returns its vertices for hooking verticals onto. */
  ring(c: V3, r: number, segs = 16) {
    const pts = Array.from({ length: segs }, (_, k) => {
      const th = (k / segs) * Math.PI * 2
      return [c[0] + Math.cos(th) * r, c[1], c[2] + Math.sin(th) * r] as V3
    })
    this.path(pts, true)
    return pts
  }
  /** Axis-aligned box outline. */
  box([x0, y0, z0]: V3, [x1, y1, z1]: V3) {
    const bot: V3[] = [[x0, y0, z0], [x1, y0, z0], [x1, y0, z1], [x0, y0, z1]]
    const top = bot.map(([x, , z]) => [x, y1, z] as V3)
    this.path(bot, true)
    this.path(top, true)
    bot.forEach((p, i) => this.line(p, top[i]))
  }
}

const GROUND = -0.8
/** Conveyor belt, also used by the shader to move the "material" dots up it. */
export const BELT_A: V3 = [-0.86, -0.5, 0.22]
export const BELT_B: V3 = [-0.38, 0.3, -0.02]

/** Hopper → conveyor → activation tanks → rotary dryer → stack, plus a pallet of bags, on a gridded base. */
export function plantEdges(): Edge[] {
  const s = new Sketch()
  const G = GROUND

  // Base platform with a sparse floor grid.
  s.path([[-1.3, G, -0.72], [1.3, G, -0.72], [1.3, G, 0.72], [-1.3, G, 0.72]], true)
  s.density = 0.45
  for (const x of [-0.65, 0, 0.65]) s.line([x, G, -0.72], [x, G, 0.72])
  s.line([-1.3, G, 0], [1.3, G, 0])
  s.density = 1

  // Hopper: cylinder on four legs, cone outlet below, little cap on top.
  const hx = -1.0
  const hz = 0.22
  s.kind = 1
  const hTop = s.ring([hx, 0.42, hz], 0.2, 14)
  s.kind = 0
  const hBot = s.ring([hx, -0.08, hz], 0.2, 14)
  for (const k of [0, 4, 7, 11]) s.line(hBot[k], hTop[k])
  for (const k of [2, 5, 9, 12]) s.line(hBot[k], [hx, -0.36, hz])
  for (const k of [2, 5, 9, 12]) s.line(hBot[k], [hBot[k][0], G, hBot[k][2]])
  for (const k of [0, 4, 7, 11]) s.line(hTop[k], [hx, 0.56, hz])

  // Inclined conveyor: two rails, a couple of trestles, and orange material dots riding it (added below).
  const off: V3 = [0.03, 0, 0.06]
  const side = (p: V3, k: number): V3 => [p[0] + off[0] * k, p[1], p[2] + off[2] * k]
  s.line(side(BELT_A, 1), side(BELT_B, 1))
  s.line(side(BELT_A, -1), side(BELT_B, -1))
  for (const f of [0.15, 0.6]) {
    const p = lerp3(BELT_A, BELT_B, f)
    s.line(side(p, 1), side(p, -1))
    s.line(p, [p[0], G, p[2]])
  }

  // Two activation tanks with orange rims and conical lids.
  for (const tx of [-0.2, 0.2]) {
    const tz = -0.12
    const bot = s.ring([tx, G, tz], 0.16, 14)
    s.ring([tx, -0.3, tz], 0.16, 14)
    s.kind = 1
    const top = s.ring([tx, 0.18, tz], 0.16, 14)
    s.kind = 0
    for (const k of [0, 4, 7, 11]) s.line(bot[k], top[k])
    for (const k of [1, 5, 8, 12]) s.line(top[k], [tx, 0.3, tz])
  }
  // Transfer pipe: tank → dryer inlet.
  s.path([[0.36, -0.12, -0.12], [0.5, -0.12, -0.12], [0.5, -0.12, 0.34], [0.5, -0.3, 0.34]])

  // Rotary dryer: a slightly inclined drum along x with orange riding rings, on two saddles.
  const dA: V3 = [0.42, -0.42, 0.38]
  const dB: V3 = [1.18, -0.5, 0.38]
  const r = 0.15
  const circle = (c: V3, rr: number) =>
    Array.from({ length: 14 }, (_, k) => {
      const th = (k / 14) * Math.PI * 2
      return [c[0], c[1] + Math.cos(th) * rr, c[2] + Math.sin(th) * rr] as V3
    })
  const endA = circle(dA, r)
  const endB = circle(dB, r)
  s.path(endA, true)
  s.path(endB, true)
  for (let k = 0; k < 14; k += 3) s.line(endA[k], endB[k])
  s.kind = 1
  for (const f of [0.25, 0.75]) s.path(circle(lerp3(dA, dB, f), r * 1.15), true)
  s.kind = 0
  for (const f of [0.25, 0.75]) {
    const c = lerp3(dA, dB, f)
    s.line([c[0], c[1] - r * 1.15, c[2] - 0.12], [c[0], G, c[2] - 0.14])
    s.line([c[0], c[1] - r * 1.15, c[2] + 0.12], [c[0], G, c[2] + 0.14])
  }

  // Exhaust duct from the dryer to the stack; the stack has an orange tip.
  const sx = 1.04
  const sz = -0.36
  s.path([[1.18, -0.36, 0.38], [1.18, -0.2, 0.38], [sx, -0.2, sz + 0.07]])
  const sBot = s.ring([sx, G, sz], 0.075, 10)
  s.ring([sx, -0.2, sz], 0.075, 10)
  s.kind = 1
  const sTop = s.ring([sx, 0.48, sz], 0.075, 10)
  s.kind = 0
  for (const k of [0, 3, 6]) s.line(sBot[k], sTop[k])

  // Pallet with two bags of finished product.
  s.box([0.38, G, -0.62], [0.78, G + 0.06, -0.3])
  s.box([0.42, G + 0.06, -0.58], [0.57, G + 0.2, -0.34])
  s.box([0.6, G + 0.06, -0.58], [0.75, G + 0.2, -0.34])
  return s.edges
}
