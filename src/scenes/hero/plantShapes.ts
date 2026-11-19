import * as THREE from 'three'
import { BELT_A, lerp3, plantEdges, type Edge, type V3 } from './plantModel'

// Shapes for the hero point cloud. Every dot lives twice: somewhere in a field of tiny crystals that fills
// the whole hero and slowly revolves (stage A, slide 1), and on an edge of the plant (stage B, About).
// Both are stored in one buffer, so the shader just lerps per dot by scroll progress. A share of the dots
// never joins the plant and keeps drifting behind it as ambient dust.

export type PlantDetail = {
  /** Dots that assemble into the plant (a few of them ride the conveyor). */
  plant: number
  /** Dots that stay in the background field. */
  dust: number
}

/** Point budget. Phones get fewer, larger dots (see CrystalPlant). */
export const PLANT_DETAIL = {
  desktop: { plant: 5600, dust: 1600 },
  mobile: { plant: 2100, dust: 700 },
} satisfies Record<string, PlantDetail>

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

/**
 * One buffer for the whole scene. Attributes per dot:
 * position = plant dot (model space),
 * aField = (anchor in the unit disc x, y, depth 0–1, phase) for the revolving background field,
 * aOrbit = (orbit radius, angular speed, crystal sprite 0/1, orange 0/1),
 * aMeta = (build order 0–1, kind 0–3, random, unused).
 * Plant dots are in edge order, so the plant builds ground first, then left to right, the stack last.
 */
export function buildPlantGeometry({ plant, dust }: PlantDetail) {
  const rand = mulberry32(11)
  // A few dots ride the conveyor instead of sitting on an edge; they come last, so material starts moving
  // once the plant stands.
  const flowCount = Math.round(plant * 0.012)
  const pts = sample(plantEdges(), plant - flowCount)
  for (let i = 0; i < flowCount; i++) pts.push({ p: [...BELT_A] as V3, kind: 2 })
  for (let i = 0; i < dust; i++) pts.push({ p: [0, 0, 0], kind: 3 })

  const n = pts.length
  const pos = new Float32Array(n * 3)
  const field = new Float32Array(n * 4)
  const orbit = new Float32Array(n * 4)
  const meta = new Float32Array(n * 4)

  pts.forEach(({ p, kind }, i) => {
    // Uniform over the disc; the shader stretches it to cover the canvas corners at any aspect.
    const r = Math.sqrt(rand())
    const th = rand() * Math.PI * 2
    const flowIdx = i - (plant - flowCount)
    pos.set(p, i * 3)
    field.set([Math.cos(th) * r, Math.sin(th) * r, rand(), rand()], i * 4)
    orbit.set([0.01 + rand() * 0.07, (0.15 + rand() * 0.45) * (rand() < 0.5 ? -1 : 1), rand() < 0.12 ? 1 : 0, rand() < 0.08 ? 1 : 0], i * 4)
    meta.set([Math.min(i, plant) / plant, kind, kind === 2 ? flowIdx / flowCount : rand(), 0], i * 4)
  })

  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
  geo.setAttribute('aField', new THREE.BufferAttribute(field, 4))
  geo.setAttribute('aOrbit', new THREE.BufferAttribute(orbit, 4))
  geo.setAttribute('aMeta', new THREE.BufferAttribute(meta, 4))
  geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 12)
  return geo
}
