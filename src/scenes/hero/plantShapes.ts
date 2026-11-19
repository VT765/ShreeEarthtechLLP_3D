import * as THREE from 'three'
import { BELT_A, lerp3, plantEdges, Sketch, type Edge, type V3 } from './plantModel'

// Shapes for the hero point cloud. Every point lives twice: on the outline of a small hexagonal crystal
// (stage A, slide 1) and on an edge of the miniature plant (stage B, slide 2). Both sets are sampled as
// evenly spaced dots and stored in one buffer, so the shader just lerps per point by scroll progress.


export type PlantDetail = {
  /** Total dots (crystals and plant share them). */
  points: number
  crystals: number
  /** Squeezes the crystal scatter (x, y) to fit a narrow band on phones. */
  spread: [number, number]
}

/** Point budget: well under the 1800 (desktop) / 700 (mobile) caps. */
export const PLANT_DETAIL = {
  desktop: { points: 1600, crystals: 20, spread: [1, 1] },
  mobile: { points: 640, crystals: 14, spread: [0.72, 0.5] },
} satisfies Record<string, PlantDetail>

/** Shrinks the plant model so the finished setup stays a miniature, about the size of the old photo card. */
export const PLANT_SCALE = 0.8

/** Deterministic PRNG so the scene is the same on every visit. */
function mulberry32(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const len = (e: Edge) => Math.hypot(e.b[0] - e.a[0], e.b[1] - e.a[1], e.b[2] - e.a[2])

/** Sample `n` dots spread over the edges by (weighted) length; edges are walked in order. */
function sample(edges: Edge[], n: number) {
  const weights = edges.map((e) => len(e) * e.density)
  const total = weights.reduce((s, w) => s + w, 0)
  const out: { p: V3; kind: number }[] = []
  let acc = 0
  edges.forEach((e, i) => {
    // Carry the rounding so the counts add up to exactly n.
    const from = Math.round((acc / total) * n)
    acc += weights[i]
    const count = Math.round((acc / total) * n) - from
    for (let j = 0; j < count; j++) out.push({ p: lerp3(e.a, e.b, (j + 0.5) / count), kind: e.kind })
  })
  return out
}

// ---------- Stage A: the crystals ----------

/** Hexagonal platelet (prism) outline around the origin, tilted at random. */
function crystalEdges(rand: () => number, radius: number): Edge[] {
  const h = radius * (0.3 + rand() * 0.2)
  const rot = new THREE.Euler(rand() * Math.PI, rand() * Math.PI, rand() * Math.PI)
  const v = new THREE.Vector3()
  const hex = (y: number) =>
    Array.from({ length: 6 }, (_, k) => {
      const th = (k * Math.PI) / 3
      v.set(Math.cos(th) * radius, y, Math.sin(th) * radius).applyEuler(rot)
      return [v.x, v.y, v.z] as V3
    })
  const s = new Sketch()
  const top = hex(h / 2)
  const bot = hex(-h / 2)
  s.path(top, true)
  s.path(bot, true)
  top.forEach((p, i) => s.line(p, bot[i]))
  return s.edges
}

/** Crystal centres scattered over a loose box, kept apart so each reads as its own crystal. */
function crystalCentres(rand: () => number, n: number) {
  const out: V3[] = []
  for (let tries = 0; out.length < n && tries < 5000; tries++) {
    const c: V3 = [-1.7 + rand() * 3.6, -1.15 + rand() * 2.4, -0.9 + rand() * 1.8]
    const gap = tries < 3000 ? 0.62 : 0.4
    if (out.every((o) => Math.hypot(o[0] - c[0], o[1] - c[1], o[2] - c[2]) > gap)) out.push(c)
  }
  return out
}

/**
 * One buffer for the whole assembly. Attributes per point:
 * position = dot offset inside its crystal, aCrystal = (crystal centre, phase), aTarget = plant dot,
 * aMeta = (assembly stagger 0–1, crystal accent 0/1, plant kind 0/1/2, random).
 * Crystal k turns into the k-th consecutive run of plant edges, so each one flies in and becomes a part.
 */
export function buildPlantGeometry({ points, crystals, spread }: PlantDetail) {
  const rand = mulberry32(11)
  // A few dots ride the conveyor instead of sitting on an edge; they come last, from the last crystal,
  // so material starts moving once the plant stands.
  const flowCount = Math.round(points * 0.015)
  const plantPts = sample(plantEdges(), points - flowCount)
  for (let i = 0; i < flowCount; i++) plantPts.push({ p: [...BELT_A] as V3, kind: 2 })

  const centres = crystalCentres(rand, crystals).map(([x, y, z]): V3 => [x * spread[0], y * spread[1], z])
  const pos = new Float32Array(points * 3)
  const crystal = new Float32Array(points * 4)
  const target = new Float32Array(points * 3)
  const meta = new Float32Array(points * 4)

  let i = 0
  centres.forEach((c, k) => {
    const end = Math.round(((k + 1) / centres.length) * points)
    const count = end - i
    const local = sample(crystalEdges(rand, 0.15 + rand() * 0.12), count)
    const phase = rand()
    for (const { p } of local) {
      pos.set(p, i * 3)
      crystal.set([...c, phase], i * 4)
      target.set(plantPts[i].p.map((v) => v * PLANT_SCALE), i * 3)
      const kind = plantPts[i].kind
      meta.set([k / Math.max(1, centres.length - 1), rand() < 0.07 ? 1 : 0, kind, kind === 2 ? (i % flowCount) / flowCount : rand()], i * 4)
      i++
    }
  })

  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
  geo.setAttribute('aCrystal', new THREE.BufferAttribute(crystal, 4))
  geo.setAttribute('aTarget', new THREE.BufferAttribute(target, 3))
  geo.setAttribute('aMeta', new THREE.BufferAttribute(meta, 4))
  geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 4)
  return geo
}
