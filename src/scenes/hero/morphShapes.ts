import * as THREE from 'three'

// Target shapes for the hero wireframe morph. Both shapes are lists of line segments; segment i of
// the rock, a scattered granule i and segment i of the drop share one vertex pair in the GPU buffer,
// so the shader can lerp between them without ever re-uploading geometry.

type V3 = [number, number, number]
type Seg = { a: V3; b: V3; layer: number }

export type MorphDetail = { plates: number; ringPts: number }

/** Deterministic PRNG so the rock is the same on every visit. */
function mulberry32(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** Layered clay block: stacked, slightly chipped plates (montmorillonite sheets). */
function rock(rand: () => number, { plates, ringPts }: MorphDetail): Seg[] {
  const segs: Seg[] = []
  const gap = 0.27
  const thick = 0.11
  const mid = (plates - 1) / 2
  for (let i = 0; i < plates; i++) {
    const layer = i - mid
    const yc = layer * gap
    const taper = 1 - 0.28 * (Math.abs(layer) / mid) ** 2
    const base = (0.95 + rand() * 0.12) * taper
    const [ph1, ph2] = [rand() * 6.28, rand() * 6.28]
    const [ox, oz] = [(rand() - 0.5) * 0.14, (rand() - 0.5) * 0.14]
    const [tiltX, tiltZ] = [(rand() - 0.5) * 0.08, (rand() - 0.5) * 0.08]
    const top: V3[] = []
    const bot: V3[] = []
    for (let j = 0; j < ringPts; j++) {
      const th = (j / ringPts) * Math.PI * 2
      const r = base * (1 + 0.1 * Math.sin(3 * th + ph1) + 0.06 * Math.sin(5 * th + ph2) + (rand() - 0.5) * 0.05)
      const x = Math.cos(th) * r * 1.3 + ox
      const z = Math.sin(th) * r * 0.95 + oz
      const lift = x * tiltZ + z * tiltX
      top.push([x, yc + thick / 2 + lift + (rand() - 0.5) * 0.02, z])
      bot.push([x * 0.97, yc - thick / 2 + lift, z * 0.97])
    }
    for (let j = 0; j < ringPts; j++) {
      const k = (j + 1) % ringPts
      segs.push({ a: top[j], b: top[k], layer }, { a: bot[j], b: bot[k], layer }, { a: top[j], b: bot[j], layer })
    }
    // A few chords across each top face hint at the crystal lattice.
    const step = Math.max(2, Math.round(ringPts / 4))
    for (let j = 0; j < ringPts; j += step) {
      segs.push({ a: top[j], b: top[(j + Math.round(ringPts / 3)) % ringPts], layer })
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
 * position = rock, aTarget = drop, aScatter = loose granule, aMeta = (random, layer, gold accent, random2).
 */
export function buildMorphGeometry(detail: MorphDetail) {
  const rand = mulberry32(7)
  const a = rock(rand, detail)
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
    // Granule centre: random point in a wide ellipsoid around the rock.
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
    const accent = rand() < 0.06 ? 1 : 0
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
