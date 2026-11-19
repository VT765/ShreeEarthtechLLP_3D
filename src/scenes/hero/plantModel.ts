// The bleaching-earth plant as a list of 3D edges. No three.js here, so the static SVG
// fallback can project the very same model without pulling three into the main chunk.

export type V3 = [number, number, number]
/** `kind`: 0 structure (sky), 1 accent (orange), 2 conveyor dot (orange, slides along the belt), 3 free dust (never joins the plant). */
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

const G = -1.3
/** Conveyor belt (hopper → reactor catwalk), also used by the shader to move the "material" dots up it. */
export const BELT_A: V3 = [-1.18, -1.0, 0.5]
export const BELT_B: V3 = [-0.62, 0.02, -0.08]
/** Rough on-screen size of the plant at the settled three-quarter view, for camera framing. */
export const PLANT_SPAN = { w: 4.8, h: 3.3 }

/** Upright cylinder: rings at each height in `ys`, `verticals` struts top to bottom. Returns the top ring. */
function vessel(s: Sketch, x: number, z: number, r: number, ys: number[], verticals: number[], segs = 16) {
  const rings = ys.map((y) => s.ring([x, y, z], r, segs))
  const [bot, top] = [rings[0], rings[rings.length - 1]]
  for (const k of verticals) s.line(bot[k], top[k])
  return top
}

/** Clay stockpile → hopper → conveyor → activation reactors → filter press → rotary dryer → cyclone → stack,
 * with a saw-tooth shed, product silos and bagged pallets, on a gridded slab. Edges are listed roughly in
 * assembly order (ground first, then left to right), which the shader uses to stagger the build. */
export function plantEdges(): Edge[] {
  const s = new Sketch()

  // Ground slab with a sparse floor grid.
  s.path([[-2.1, G, -1.1], [2.1, G, -1.1], [2.1, G, 1.1], [-2.1, G, 1.1]], true)
  s.density = 0.35
  for (const x of [-1.4, -0.7, 0, 0.7, 1.4]) s.line([x, G, -1.1], [x, G, 1.1])
  for (const z of [-0.37, 0.37]) s.line([-2.1, G, z], [2.1, G, z])
  s.density = 1

  // Raw clay stockpile: a dotted mound.
  const [mx, mz] = [-1.72, 0.66]
  const base = s.ring([mx, G, mz], 0.34, 14)
  s.ring([mx, G + 0.13, mz], 0.24, 12)
  s.ring([mx, G + 0.24, mz], 0.12, 10)
  for (let k = 0; k < 14; k += 2) s.line(base[k], [mx, G + 0.32, mz])

  // Feed hopper: tapered box on four legs.
  const [hx, hz] = [-1.3, 0.56]
  const sq = (y: number, h: number): V3[] => [[hx - h, y, hz - h], [hx + h, y, hz - h], [hx + h, y, hz + h], [hx - h, y, hz + h]]
  s.kind = 1
  const hTop = sq(-0.52, 0.18)
  s.path(hTop, true)
  s.kind = 0
  const hBot = sq(-0.84, 0.05)
  s.path(hBot, true)
  hTop.forEach((p, i) => s.line(p, hBot[i]))
  for (const p of hTop) s.line(p, [p[0], G, p[2]])

  // Inclined belt conveyor on trestles; orange material dots ride it (added by the geometry builder).
  const off: V3 = [0.05, 0, 0.04]
  const side = (p: V3, k: number): V3 => [p[0] + off[0] * k, p[1], p[2] + off[2] * k]
  s.line(side(BELT_A, 1), side(BELT_B, 1))
  s.line(side(BELT_A, -1), side(BELT_B, -1))
  for (const f of [0.25, 0.6, 0.9]) {
    const p = lerp3(BELT_A, BELT_B, f)
    s.line(side(p, 1), side(p, -1))
    s.line(side(p, 1), [p[0] + off[0], G, p[2] + off[2]])
    s.line(side(p, -1), [p[0] - off[0], G, p[2] - off[2]])
  }

  // Factory shed with a saw-tooth roof (orange ridge lights) and a roller door.
  const [x0, x1, z0, z1, W] = [-2.0, -0.85, -1.0, -0.3, -0.5]
  s.box([x0, G, z0], [x1, W, z1])
  const tooth = (x1 - x0) / 3
  for (let i = 0; i < 3; i++) {
    const [xa, xb] = [x0 + tooth * i, x0 + tooth * (i + 1)]
    for (const z of [z0, z1]) s.path([[xa, W, z], [xb, W + 0.3, z], [xb, W, z]])
    s.kind = 1
    s.line([xb, W + 0.3, z0], [xb, W + 0.3, z1])
    s.kind = 0
  }
  s.path([[-1.62, G, z1], [-1.62, G + 0.45, z1], [-1.24, G + 0.45, z1], [-1.24, G, z1]])

  // Acid activation reactors: tall vessels with domed lids and agitator motors.
  const rz = -0.38
  for (const rx of [-0.55, -0.05, 0.45]) {
    const top = vessel(s, rx, rz, 0.2, [G, -0.6, 0], [0, 4, 8, 12])
    const dome = s.ring([rx, 0.1, rz], 0.13, 12)
    for (let k = 0; k < 4; k++) s.line(top[k * 4], dome[k * 3])
    s.kind = 1
    s.box([rx - 0.05, 0.1, rz - 0.05], [rx + 0.05, 0.24, rz + 0.05])
    s.kind = 0
  }
  // Shared catwalk in front of the lids, orange handrail, ladder at the right end.
  const cz = -0.12
  s.path([[-0.8, -0.02, cz], [0.72, -0.02, cz], [0.72, -0.02, cz + 0.08], [-0.8, -0.02, cz + 0.08]], true)
  s.kind = 1
  s.line([-0.8, 0.14, cz + 0.08], [0.72, 0.14, cz + 0.08])
  s.kind = 0
  for (const x of [-0.8, 0.72]) s.line([x, -0.02, cz + 0.04], [x, G, cz + 0.04])
  for (const x of [-0.8, -0.04, 0.72]) s.line([x, -0.02, cz + 0.08], [x, 0.14, cz + 0.08])
  s.density = 0.7
  for (let y = G + 0.15; y < -0.05; y += 0.16) s.line([0.76, y, cz], [0.76, y, cz + 0.08])
  s.density = 1

  // Filter press: two end heads, side bars and a stack of plates, on legs; fed by a pipe from the reactors.
  const [fx0, fx1, fz0, fz1, fy0, fy1] = [-0.35, 0.45, 0.3, 0.62, G + 0.25, G + 0.62]
  s.box([fx0, fy0, fz0], [fx0 + 0.07, fy1, fz1])
  s.box([fx1 - 0.07, fy0, fz0], [fx1, fy1, fz1])
  for (const z of [fz0, fz1]) s.line([fx0, fy1, z], [fx1, fy1, z])
  s.density = 0.6
  for (let x = fx0 + 0.13; x < fx1 - 0.1; x += 0.07) s.path([[x, fy0 + 0.04, fz0 + 0.03], [x, fy1 - 0.04, fz0 + 0.03], [x, fy1 - 0.04, fz1 - 0.03], [x, fy0 + 0.04, fz1 - 0.03]], true)
  s.density = 1
  for (const x of [fx0 + 0.03, fx1 - 0.03]) for (const z of [fz0, fz1]) s.line([x, fy0, z], [x, G, z])
  s.path([[-0.05, -1.0, -0.18], [-0.05, -1.0, 0.12], [-0.05, fy1 + 0.12, 0.12], [0.05, fy1 + 0.12, 0.46], [0.05, fy1, 0.46]])

  // Rotary dryer: long inclined drum with orange riding rings on saddles, burner box at the inlet.
  const dA: V3 = [0.68, -0.86, 0.6]
  const dB: V3 = [1.6, -1.0, 0.6]
  const r = 0.2
  const circle = (c: V3, rr: number) =>
    Array.from({ length: 16 }, (_, k) => {
      const th = (k / 16) * Math.PI * 2
      return [c[0], c[1] + Math.cos(th) * rr, c[2] + Math.sin(th) * rr] as V3
    })
  const endA = circle(dA, r)
  const endB = circle(dB, r)
  s.path(endA, true)
  s.path(endB, true)
  for (let k = 0; k < 16; k += 2) s.line(endA[k], endB[k])
  s.kind = 1
  for (const f of [0.25, 0.75]) s.path(circle(lerp3(dA, dB, f), r * 1.15), true)
  s.kind = 0
  for (const f of [0.25, 0.75]) {
    const c = lerp3(dA, dB, f)
    for (const dz of [-0.14, 0.14]) s.line([c[0], c[1] - r * 1.1, c[2] + dz], [c[0], G, c[2] + dz * 1.2])
  }
  s.box([0.5, G, 0.46], [0.64, -0.68, 0.74])
  s.line([fx1, fy1, 0.46], [0.72, -0.7, 0.6])

  // Cyclone separator on legs: ducted from the dryer outlet, venting into the stack.
  const [yx, yz] = [1.45, -0.05]
  const cylBot = s.ring([yx, -0.35, yz], 0.16, 16)
  s.kind = 1
  const cylTop = s.ring([yx, 0.05, yz], 0.16, 16)
  s.kind = 0
  const cone = s.ring([yx, -0.75, yz], 0.04, 8)
  for (const k of [0, 4, 8, 12]) s.line(cylBot[k], cylTop[k])
  for (let k = 0; k < 8; k += 2) s.line(cylBot[k * 2], cone[k])
  for (const k of [2, 6, 10, 14]) s.line(cylBot[k], [cylBot[k][0], G, cylBot[k][2]])
  s.path([[1.6, -0.82, 0.6], [1.6, -0.2, 0.6], [1.61, -0.2, yz]])

  // Product silos: cone bottoms on legs, orange roof rings.
  for (const sx of [0.72, 1.12]) {
    const sz = -0.82
    vessel(s, sx, sz, 0.17, [-0.5, 0.1, 0.55], [0, 4, 8, 12], 14)
    s.kind = 1
    const roof = s.ring([sx, 0.56, sz], 0.17, 14)
    s.kind = 0
    for (const k of [0, 4, 7, 11]) s.line(roof[k], [sx, 0.7, sz])
    const bot = s.ring([sx, -0.5, sz], 0.17, 14)
    for (const k of [0, 4, 7, 11]) s.line(bot[k], [sx, -0.85, sz])
    for (const k of [2, 5, 9, 12]) s.line(bot[k], [bot[k][0], G, bot[k][2]])
  }

  // Chimney stack with orange warning bands; the cyclone's vent duct joins it.
  const [kx, kz] = [1.85, -0.75]
  s.path([[yx, 0.05, yz], [yx, 0.3, yz], [kx - 0.1, 0.3, kz]])
  vessel(s, kx, kz, 0.11, [G, -0.4, 0.5], [0, 3, 6, 9], 12)
  s.kind = 1
  const kTop = s.ring([kx, 1.45, kz], 0.09, 12)
  s.ring([kx, 1.28, kz], 0.095, 12)
  s.kind = 0
  const kMid = s.ring([kx, 0.5, kz], 0.11, 12)
  for (const k of [0, 3, 6, 9]) s.line(kMid[k], kTop[k])

  // Pallets of finished bags.
  for (const pz of [0.66, 0.92]) {
    s.box([1.5, G, pz - 0.11], [1.98, G + 0.05, pz + 0.11])
    for (const bx of [1.53, 1.75]) s.box([bx, G + 0.05, pz - 0.09], [bx + 0.2, G + 0.17, pz + 0.09])
    s.box([1.64, G + 0.17, pz - 0.08], [1.84, G + 0.28, pz + 0.08])
  }
  return s.edges
}
