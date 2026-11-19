import * as THREE from 'three'

// Target shapes for the hero wireframe morph. Both shapes are lists of line segments; segment i of
// the crystal, a scattered granule i and segment i of the drop share one vertex pair in the GPU buffer,
// so the shader can lerp between them without ever re-uploading geometry.

type V3 = [number, number, number]
/** `accent`: 0 lattice, 1 gold lattice accent, 2 interlayer cation (gold, escapes first). */
type Seg = { a: V3; b: V3; layer: number; accent?: number }

export type MorphDetail = {
  /** T-O-T layers in the stack. */
  layers: number
  /** Honeycomb rings around the centre hexagon on each silica sheet. */
  rings: number
  /** Honeycomb edge length. */
  edge: number
  /** Edge-band points per hexagon side (1 = corners only, 2 = corners + midpoints). */
  perSide: number
  cationsPerGap: number
  /** Ring resolution of the oil drop. */
  ringPts: number
}

/** Deterministic PRNG so the rock is the same on every visit. */
function mulberry32(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** Honeycomb (6-membered silica rings) clipped to `rings` rings around a centre cell, in the xz plane. */
function honeycomb(rings: number, edge: number): [number, number][][] {
  const pitch = Math.sqrt(3) * edge
  const seen = new Set<string>()
  const out: [number, number][][] = []
  const key = (x: number, z: number) => `${x.toFixed(3)},${z.toFixed(3)}`
  // Axial hex-grid cell coordinates within `rings` of the origin.
  for (let q = -rings; q <= rings; q++) {
    for (let r = Math.max(-rings, -q - rings); r <= Math.min(rings, -q + rings); r++) {
      const cx = pitch * (q + r / 2)
      const cz = pitch * r * (Math.sqrt(3) / 2)
      const v = Array.from({ length: 6 }, (_, k) => {
        const th = Math.PI / 6 + (k * Math.PI) / 3
        return [cx + Math.cos(th) * edge, cz + Math.sin(th) * edge] as [number, number]
      })
      for (let k = 0; k < 6; k++) {
        const [a, b] = [v[k], v[(k + 1) % 6]]
        const id = [key(...a), key(...b)].sort().join('|')
        if (!seen.has(id)) {
          seen.add(id)
          out.push([a, b])
        }
      }
    }
  }
  return out
}

/** Points around a hexagon of circumradius `r` (corners first at angle `rot`), `perSide` per side. */
function hexPerimeter(r: number, rot: number, perSide: number): [number, number][] {
  const corner = (k: number) => [Math.cos(rot + (k * Math.PI) / 3) * r, Math.sin(rot + (k * Math.PI) / 3) * r]
  const pts: [number, number][] = []
  for (let k = 0; k < 6; k++) {
    const [a, b] = [corner(k), corner(k + 1)]
    for (let s = 0; s < perSide; s++) {
      const f = s / perSide
      pts.push([a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f])
    }
  }
  return pts
}

/**
 * Montmorillonite crystal: a stack of hexagonal T-O-T platelets, each turned a little (turbostratic
 * stacking). Each layer: a honeycomb silica sheet on top, a triangle band of tetrahedra/octahedra down
 * its edge to the alumina sheet and on to the lower silica sheet. Gold cations sit in the interlayer gaps.
 */
function crystal(rand: () => number, d: MorphDetail): Seg[] {
  const segs: Seg[] = []
  const pitch = 0.7 // layer + interlayer spacing
  const half = 0.13 // silica sheet ↔ alumina sheet
  // Full honeycomb on the top face only; lower faces get a smaller one so the stack doesn't blur together.
  const topLattice = honeycomb(d.rings, d.edge)
  const innerLattice = honeycomb(Math.max(0, d.rings - 1), d.edge)
  const radius = d.rings * Math.sqrt(3) * d.edge + d.edge
  const mid = (d.layers - 1) / 2
  // Tilt the whole stack so its hexagonal faces read from the camera's three-quarter view.
  const tilt = new THREE.Euler(0.12, 0, -0.16)
  const v = new THREE.Vector3()
  const place = (x: number, y: number, z: number, rot: number, ox: number, oz: number): V3 => {
    const [c, s] = [Math.cos(rot), Math.sin(rot)]
    v.set(x * c - z * s + ox, y, x * s + z * c + oz).applyEuler(tilt)
    return [v.x, v.y, v.z]
  }
  const accent = () => (rand() < 0.04 ? 1 : 0)

  for (let i = 0; i < d.layers; i++) {
    const layer = i - mid
    const yc = layer * pitch
    const rot = (rand() - 0.5) * 0.9
    const [ox, oz] = [(rand() - 0.5) * 0.16, (rand() - 0.5) * 0.16]
    const size = 1 - 0.1 * Math.abs(layer) / Math.max(mid, 1) + (rand() - 0.5) * 0.06
    const at = (x: number, y: number, z: number) => place(x * size, y, z * size, rot, ox, oz)

    // Top silica sheet: the honeycomb.
    const lattice = i === d.layers - 1 ? topLattice : innerLattice
    for (const [a, b] of lattice) segs.push({ a: at(a[0], yc + half, a[1]), b: at(b[0], yc + half, b[1]), layer, accent: accent() })

    // Edge band: silica corners → alumina sheet (offset half a step) → lower silica corners.
    const top = hexPerimeter(radius, 0, d.perSide)
    const step = Math.PI / (3 * d.perSide)
    const oct = hexPerimeter(radius * 0.97, step / 2, d.perSide)
    const n = top.length
    for (let j = 0; j < n; j++) {
      const k = (j + 1) % n
      const T = (p: [number, number], y: number) => at(p[0], y, p[1])
      segs.push(
        { a: T(top[j], yc + half), b: T(top[k], yc + half), layer },
        { a: T(oct[j], yc), b: T(oct[k], yc), layer },
        { a: T(top[j], yc - half), b: T(top[k], yc - half), layer },
        { a: T(top[j], yc + half), b: T(oct[j], yc), layer },
        { a: T(oct[j], yc), b: T(top[k], yc + half), layer },
        { a: T(top[j], yc - half), b: T(oct[j], yc), layer, accent: accent() },
        { a: T(oct[j], yc), b: T(top[k], yc - half), layer },
      )
    }

    // Interlayer cations (Na⁺/Ca²⁺) as tiny gold crosses in the gap above this layer.
    if (i === d.layers - 1) continue
    const yg = yc + pitch / 2
    for (let c = 0; c < d.cationsPerGap; c++) {
      const th = (c / d.cationsPerGap) * Math.PI * 2 + rand() * 0.6
      const r = radius * (0.25 + rand() * 0.5)
      const [x, z] = [Math.cos(th) * r, Math.sin(th) * r]
      const s = 0.045
      segs.push(
        { a: at(x - s, yg, z), b: at(x + s, yg, z), layer: layer + 0.5, accent: 2 },
        { a: at(x, yg, z - s), b: at(x, yg, z + s), layer: layer + 0.5, accent: 2 },
      )
    }
  }
  return segs
}

/** Oil drop: latitude rings + meridians, sized to roughly `target` segments. */
function drop(ringPts: number, target: number): Seg[] {
  const rings = Math.max(4, Math.round((target / ringPts - 1) / 2))
  const [H, W, lift] = [1.35, 1.25, 0.28]
  const tip: V3 = [0, H + lift, 0]
  const foot: V3 = [0, -H + lift, 0]
  const pts: V3[][] = []
  for (let k = 1; k <= rings; k++) {
    const u = (Math.PI * k) / (rings + 1)
    const r = W * Math.sin(u) * Math.sin(u / 2)
    const y = H * Math.cos(u) + lift
    pts.push(
      Array.from({ length: ringPts }, (_, j) => {
        const th = (j / ringPts) * Math.PI * 2
        return [Math.cos(th) * r, y, Math.sin(th) * r] as V3
      }),
    )
  }
  const segs: Seg[] = []
  for (let k = 0; k < rings; k++) {
    for (let j = 0; j < ringPts; j++) segs.push({ a: pts[k][j], b: pts[k][(j + 1) % ringPts], layer: 0 })
  }
  for (let j = 0; j < ringPts; j++) {
    segs.push({ a: tip, b: pts[0][j], layer: 0 })
    for (let k = 0; k < rings - 1; k++) segs.push({ a: pts[k][j], b: pts[k + 1][j], layer: 0 })
    segs.push({ a: pts[rings - 1][j], b: foot, layer: 0 })
  }
  return segs
}

/** Repeat segments until the list is `n` long (doubled lines just glow a touch brighter). */
function padTo(segs: Seg[], n: number) {
  const len = segs.length
  for (let i = 0; segs.length < n; i++) segs.push(segs[i % len])
}

/**
 * One merged buffer for the whole morph. Attributes per vertex:
 * position = crystal, aTarget = drop, aScatter = loose granule, aMeta = (random, layer, accent, random2)
 * where accent is 0 lattice, 1 gold lattice line, 2 interlayer cation.
 */
export function buildMorphGeometry(detail: MorphDetail) {
  const rand = mulberry32(7)
  const a = crystal(rand, detail)
  const b = drop(detail.ringPts, a.length)
  // Shuffle the drop so the regroup reads as particles converging, not slabs sliding.
  for (let i = b.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1))
    ;[b[i], b[j]] = [b[j], b[i]]
  }
  const n = Math.max(a.length, b.length)
  padTo(a, n)
  padTo(b, n)

  const pos = new Float32Array(n * 6)
  const target = new Float32Array(n * 6)
  const scatter = new Float32Array(n * 6)
  const meta = new Float32Array(n * 8)
  for (let i = 0; i < n; i++) {
    // Granule centre: random point in a wide ellipsoid around the crystal.
    let sx = 0
    let sy = 0
    let sz = 0
    do {
      ;[sx, sy, sz] = [rand() * 2 - 1, rand() * 2 - 1, rand() * 2 - 1]
    } while (sx * sx + sy * sy + sz * sz > 1)
    sx *= 2.6
    sy *= 1.9
    sz *= 1.8
    const ca = a[i].a.map((v, k) => (v + a[i].b[k]) / 2)
    const r1 = rand()
    const r2 = rand()
    const accent = a[i].accent ?? 0
    ;[a[i].a, a[i].b].forEach((p, e) => {
      const q = b[i][e ? 'b' : 'a']
      const o = (i * 2 + e) * 3
      for (let k = 0; k < 3; k++) {
        pos[o + k] = p[k]
        target[o + k] = q[k]
        // Each segment shrinks to a short dash (a granule) around its scatter centre.
        scatter[o + k] = [sx, sy, sz][k] + (p[k] - ca[k]) * 0.16
      }
      meta.set([r1, a[i].layer, accent, r2], (i * 2 + e) * 4)
    })
  }

  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
  geo.setAttribute('aTarget', new THREE.BufferAttribute(target, 3))
  geo.setAttribute('aScatter', new THREE.BufferAttribute(scatter, 3))
  geo.setAttribute('aMeta', new THREE.BufferAttribute(meta, 4))
  geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 4)
  return geo
}
