import * as THREE from 'three'

/** Pouch size in scene units (0.7 : 1, like the label canvas). */
export const POUCH_W = 1.4
export const POUCH_H = 2.0
const DEPTH = 0.3
/** Half the thickness of the flat heat-sealed edges. */
const SEAL = 0.006

/**
 * How far a face bulges at height v (0 bottom → 1 top): the gusset holds the base open, the body is full,
 * and it flattens into the heat seal over the top tenth.
 */
const bulge = (v: number) => (0.82 + 0.18 * THREE.MathUtils.smoothstep(v, 0, 0.28)) * (1 - THREE.MathUtils.smoothstep(v, 0.5, 0.9))

/** Point on one face of the pouch. `side` 1 = front, -1 = back; u runs left → right as seen from that side. */
function facePoint(u: number, v: number, side: 1 | -1, out: THREE.Vector3) {
  const b = bulge(v)
  // A full pouch pulls its side seams in a little.
  const x = (u - 0.5) * POUCH_W * (1 - 0.05 * b)
  const z = SEAL + DEPTH * b * Math.pow(Math.sin(Math.PI * u), 0.55)
  return out.set(side * x, (v - 0.5) * POUCH_H, side * z)
}

/** One printed face as a UV-mapped grid. */
export function buildFace(side: 1 | -1, segU = 36, segV = 56) {
  const pos: number[] = []
  const uv: number[] = []
  const idx: number[] = []
  const p = new THREE.Vector3()
  for (let j = 0; j <= segV; j++) {
    for (let i = 0; i <= segU; i++) {
      const [u, v] = [i / segU, j / segV]
      facePoint(u, v, side, p)
      pos.push(p.x, p.y, p.z)
      uv.push(u, v)
    }
  }
  const row = segU + 1
  for (let j = 0; j < segV; j++) {
    for (let i = 0; i < segU; i++) {
      const a = j * row + i
      idx.push(a, a + 1, a + row, a + 1, a + row + 1, a + row)
    }
  }
  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2))
  geo.setIndex(idx)
  geo.computeVertexNormals()
  return geo
}

/** Flat oval base joining the bottom rows of the two faces. */
export function buildBase(segU = 36) {
  const pos: number[] = []
  const idx: number[] = []
  const p = new THREE.Vector3()
  for (let i = 0; i <= segU; i++) {
    facePoint(i / segU, 0, 1, p)
    pos.push(p.x, p.y, p.z, p.x, p.y, -p.z)
  }
  for (let i = 0; i < segU; i++) {
    const a = i * 2
    idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2)
  }
  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
  geo.setIndex(idx)
  geo.computeVertexNormals()
  return geo
}
