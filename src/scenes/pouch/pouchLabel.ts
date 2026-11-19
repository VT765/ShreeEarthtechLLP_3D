// Pouch print, drawn to a canvas: the front follows the real Earthtech packaging (patterned top band, mark +
// wordmark, grade icon, "GRADE: …", a powder window and a colour base, with EARTHTECH running up the right edge).
// No three.js here; ProductPouch wraps the canvases in textures.
import type { GradeId, Product } from '../../data/products'

/** Canvas size, in the pouch's 0.7 : 1 width : height ratio. */
export const LABEL_W = 840
export const LABEL_H = 1200

// Bands, as fractions of the height (top → bottom).
const TOP_BAND = 0.15
const STRIPE = [0.665, 0.69] as const
const WINDOW_END = 0.785

const DISPLAY = '"Plus Jakarta Sans", sans-serif'
const BODY = 'Inter, sans-serif'

type Ctx = CanvasRenderingContext2D

/** Deterministic noise so every visit prints the same grain. */
function seeded(seed: number) {
  return () => {
    seed = (seed * 16807) % 2147483647
    return seed / 2147483647
  }
}

/** The S / E mark recoloured per grade: blue-ish pixels take `s`, the rest take `e`, keeping the shading. */
export function tintMark(img: HTMLImageElement, [s, e]: [string, string]) {
  const c = document.createElement('canvas')
  c.width = img.naturalWidth
  c.height = img.naturalHeight
  const ctx = c.getContext('2d')!
  ctx.drawImage(img, 0, 0)
  const data = ctx.getImageData(0, 0, c.width, c.height)
  const rgb = (hex: string) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16))
  const [cs, ce] = [rgb(s), rgb(e)]
  const px = data.data
  for (let i = 0; i < px.length; i += 4) {
    if (!px[i + 3]) continue
    const [r, g, b] = [px[i], px[i + 1], px[i + 2]]
    const col = b > r ? cs : ce
    // Shade by the source brightness so the mark keeps its bevel.
    const k = 0.55 + (0.6 * (r + g + b)) / 765
    px[i] = Math.min(255, col[0] * k)
    px[i + 1] = Math.min(255, col[1] * k)
    px[i + 2] = Math.min(255, col[2] * k)
  }
  ctx.putImageData(data, 0, 0)
  return c
}

/** Patterned top band: a lattice of diamonds with small four-petal knots, as on the pack. */
function topBand(ctx: Ctx, p: Product['pack'], light: boolean) {
  const h = LABEL_H * TOP_BAND
  ctx.fillStyle = light ? p.light : p.main
  ctx.fillRect(0, 0, LABEL_W, h)
  ctx.save()
  ctx.strokeStyle = light ? p.accent : p.light
  ctx.globalAlpha = 0.55
  ctx.lineWidth = 2
  const step = 42
  for (let x = -h; x < LABEL_W + h; x += step) {
    ctx.beginPath()
    ctx.moveTo(x, 0)
    ctx.lineTo(x + h, h)
    ctx.moveTo(x + h, 0)
    ctx.lineTo(x, h)
    ctx.stroke()
  }
  ctx.globalAlpha = 0.8
  ctx.fillStyle = light ? p.accent : p.light
  for (let y = step / 2; y < h; y += step) {
    for (let x = (y / step) % 2 ? step / 2 : 0; x < LABEL_W; x += step) {
      for (let k = 0; k < 4; k++) {
        ctx.beginPath()
        ctx.ellipse(x + Math.cos((k * Math.PI) / 2) * 5, y + Math.sin((k * Math.PI) / 2) * 5, 4, 2.4, (k * Math.PI) / 2, 0, Math.PI * 2)
        ctx.fill()
      }
    }
  }
  ctx.restore()
  // Heat seal and zip lines.
  ctx.fillStyle = 'rgba(255,255,255,0.35)'
  for (const y of [0.012, 0.024, 0.07]) ctx.fillRect(0, LABEL_H * y, LABEL_W, 3)
  ctx.fillStyle = 'rgba(0,0,0,0.12)'
  ctx.fillRect(0, h - 4, LABEL_W, 4)
}

/** White body with a soft sheen, the colour stripe, powder window and base band. */
function body(ctx: Ctx, p: Product['pack'], rand: () => number) {
  const g = ctx.createLinearGradient(0, 0, LABEL_W, 0)
  g.addColorStop(0, '#E9ECEA')
  g.addColorStop(0.35, '#FBFCFB')
  g.addColorStop(1, '#EEF0EF')
  ctx.fillStyle = g
  ctx.fillRect(0, LABEL_H * TOP_BAND, LABEL_W, LABEL_H * (STRIPE[0] - TOP_BAND))

  ctx.fillStyle = p.main
  ctx.fillRect(0, LABEL_H * STRIPE[0], LABEL_W, LABEL_H * (STRIPE[1] - STRIPE[0]))

  // Window onto the off-white powder inside.
  const [wy, wh] = [LABEL_H * STRIPE[1], LABEL_H * (WINDOW_END - STRIPE[1])]
  const wg = ctx.createLinearGradient(0, wy, 0, wy + wh)
  wg.addColorStop(0, '#C9C0AD')
  wg.addColorStop(0.5, '#DDD6C7')
  wg.addColorStop(1, '#CFC7B5')
  ctx.fillStyle = wg
  ctx.fillRect(0, wy, LABEL_W, wh)
  for (let i = 0; i < 2600; i++) {
    ctx.fillStyle = rand() < 0.5 ? `rgba(120,108,90,${rand() * 0.18})` : `rgba(255,255,255,${rand() * 0.5})`
    ctx.fillRect(rand() * LABEL_W, wy + rand() * wh, 2, 2)
  }

  const by = LABEL_H * WINDOW_END
  ctx.fillStyle = p.main
  ctx.fillRect(0, by, LABEL_W, LABEL_H - by)
  const shade = ctx.createLinearGradient(0, by, 0, LABEL_H)
  shade.addColorStop(0, 'rgba(255,255,255,0.08)')
  shade.addColorStop(1, 'rgba(0,0,0,0.18)')
  ctx.fillStyle = shade
  ctx.fillRect(0, by, LABEL_W, LABEL_H - by)
}

/** Grade icon: a leaf-cradled oil drop, the big mark, or a cut crystal with sparkles. */
function gradeIcon(ctx: Ctx, id: GradeId, p: Product['pack'], mark: HTMLCanvasElement | null, cx: number, cy: number, size: number) {
  const g = ctx.createLinearGradient(cx - size / 2, cy + size / 2, cx + size / 2, cy - size / 2)
  g.addColorStop(0, p.icon[0])
  g.addColorStop(1, p.icon[1])
  ctx.save()
  ctx.strokeStyle = g
  ctx.fillStyle = g
  ctx.lineWidth = size * 0.055
  ctx.lineJoin = 'round'
  ctx.lineCap = 'round'
  const s = size / 2
  if (id === 'pure') {
    // Outer drop.
    ctx.beginPath()
    ctx.moveTo(cx, cy - s)
    ctx.bezierCurveTo(cx + s * 0.25, cy - s * 0.55, cx + s * 0.75, cy - s * 0.1, cx + s * 0.75, cy + s * 0.3)
    ctx.arc(cx, cy + s * 0.3, s * 0.75, 0, Math.PI)
    ctx.bezierCurveTo(cx - s * 0.75, cy - s * 0.1, cx - s * 0.25, cy - s * 0.55, cx, cy - s)
    ctx.stroke()
    // Inner drop.
    ctx.beginPath()
    ctx.moveTo(cx, cy - s * 0.38)
    ctx.bezierCurveTo(cx + s * 0.08, cy - s * 0.25, cx + s * 0.16, cy - s * 0.12, cx + s * 0.16, cy - s * 0.02)
    ctx.arc(cx, cy - s * 0.02, s * 0.16, 0, Math.PI)
    ctx.bezierCurveTo(cx - s * 0.16, cy - s * 0.12, cx - s * 0.08, cy - s * 0.25, cx, cy - s * 0.38)
    ctx.fill()
    // Two leaves cupping it, and the stem.
    for (const k of [-1, 1]) {
      ctx.beginPath()
      ctx.moveTo(cx, cy + s * 0.78)
      ctx.quadraticCurveTo(cx + k * s * 0.05, cy + s * 0.25, cx + k * s * 0.5, cy + s * 0.12)
      ctx.quadraticCurveTo(cx + k * s * 0.5, cy + s * 0.62, cx, cy + s * 0.78)
      ctx.stroke()
    }
    ctx.beginPath()
    ctx.moveTo(cx, cy + s * 0.78)
    ctx.lineTo(cx, cy + s * 0.25)
    ctx.stroke()
  } else if (id === 'hyper') {
    if (mark) {
      const h = size * 1.05
      const w = (h * mark.width) / mark.height
      ctx.shadowColor = 'rgba(20,30,60,0.3)'
      ctx.shadowBlur = 14
      ctx.shadowOffsetY = 6
      ctx.drawImage(mark, cx - w / 2, cy - h / 2, w, h)
    }
  } else {
    // Cut crystal: crown, girdle and pavilion facets.
    const top = cy - s * 0.55
    const gird = cy - s * 0.2
    const tip = cy + s * 0.75
    const [tw, gw] = [s * 0.5, s * 0.85]
    ctx.beginPath()
    ctx.moveTo(cx - tw, top)
    ctx.lineTo(cx + tw, top)
    ctx.lineTo(cx + gw, gird)
    ctx.lineTo(cx, tip)
    ctx.lineTo(cx - gw, gird)
    ctx.closePath()
    ctx.moveTo(cx - gw, gird)
    ctx.lineTo(cx + gw, gird)
    for (const x of [-tw * 0.35, tw * 0.35]) {
      ctx.moveTo(cx + x, top)
      ctx.lineTo(cx + x * 1.8, gird)
      ctx.lineTo(cx, tip)
    }
    ctx.moveTo(cx - tw, top)
    ctx.lineTo(cx - tw * 0.7, gird)
    ctx.lineTo(cx, tip)
    ctx.moveTo(cx + tw, top)
    ctx.lineTo(cx + tw * 0.7, gird)
    ctx.lineTo(cx, tip)
    ctx.stroke()
    // Gold sparkles.
    ctx.fillStyle = '#E0B33A'
    for (const [x, y, r] of [[cx + s * 0.78, cy - s * 0.95, s * 0.2], [cx + s * 0.45, cy - s * 0.82, s * 0.11]]) {
      ctx.beginPath()
      for (let k = 0; k < 8; k++) {
        const a = (k * Math.PI) / 4
        const rr = k % 2 ? r * 0.22 : r
        ctx.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr)
      }
      ctx.closePath()
      ctx.fill()
    }
  }
  ctx.restore()
}

/** Shrinks `font` (a size in px, then the family) until `text` fits in `max` px. */
function fit(ctx: Ctx, text: string, weight: number, size: number, family: string, max: number) {
  let px = size
  do {
    ctx.font = `${weight} ${px}px ${family}`
  } while (ctx.measureText(text).width > max && --px > 10)
  return px
}

/** Front print. `mark` is the tinted S/E mark (null until the logo image loads). */
export function drawFront(c: HTMLCanvasElement, p: Product, mark: HTMLCanvasElement | null) {
  const ctx = c.getContext('2d')!
  const pk = p.pack
  const rand = seeded(7)
  topBand(ctx, pk, p.id === 'pure')
  body(ctx, pk, rand)

  const x0 = LABEL_W * 0.07
  ctx.textBaseline = 'alphabetic'
  ctx.fillStyle = pk.dark
  ctx.font = `600 ${LABEL_H * 0.024}px ${BODY}`
  ctx.fillText('ACTIVATED BLEACHING EARTH', x0, LABEL_H * 0.195)

  // Mark over the wordmark, left column.
  if (mark) {
    const h = LABEL_H * 0.075
    const w = (h * mark.width) / mark.height
    ctx.drawImage(mark, x0 + LABEL_W * 0.17 - w / 2, LABEL_H * 0.225, w, h)
  }
  ctx.fillStyle = pk.dark
  ctx.font = `800 ${LABEL_H * 0.04}px ${DISPLAY}`
  ctx.fillText('EARTHTECH', x0, LABEL_H * 0.345)

  gradeIcon(ctx, p.id, pk, mark, LABEL_W * 0.6, LABEL_H * 0.455, LABEL_H * 0.15)

  ctx.fillStyle = pk.dark
  ctx.font = `600 ${LABEL_H * 0.036}px ${BODY}`
  ctx.fillText('GRADE:', x0, LABEL_H * 0.585)
  ctx.fillStyle = pk.accent
  fit(ctx, pk.label, 800, LABEL_H * 0.05, DISPLAY, LABEL_W * 0.7)
  ctx.fillText(pk.label, x0, LABEL_H * 0.635)

  // EARTHTECH running up the right edge, over the bands.
  ctx.save()
  ctx.translate(LABEL_W * 0.955, LABEL_H * 0.97)
  ctx.rotate(-Math.PI / 2)
  ctx.fillStyle = pk.dark
  ctx.globalAlpha = 0.92
  fit(ctx, 'EARTHTECH', 800, 200, DISPLAY, LABEL_H * 0.8)
  ctx.fillText('EARTHTECH', 0, 0)
  ctx.restore()
}

/** Back print: grade, key specs and pack details. */
export function drawBack(c: HTMLCanvasElement, p: Product, mark: HTMLCanvasElement | null) {
  const ctx = c.getContext('2d')!
  const pk = p.pack
  const rand = seeded(13)
  topBand(ctx, pk, p.id === 'pure')
  body(ctx, pk, rand)

  const x0 = LABEL_W * 0.09
  const x1 = LABEL_W * 0.91
  if (mark) {
    const h = LABEL_H * 0.06
    ctx.drawImage(mark, x0, LABEL_H * 0.18, (h * mark.width) / mark.height, h)
  }
  ctx.fillStyle = pk.dark
  ctx.font = `800 ${LABEL_H * 0.032}px ${DISPLAY}`
  ctx.fillText('EARTHTECH', x0 + LABEL_H * 0.065, LABEL_H * 0.225)
  ctx.font = `600 ${LABEL_H * 0.02}px ${BODY}`
  ctx.fillText('ACTIVATED BLEACHING EARTH', x0 + LABEL_H * 0.065, LABEL_H * 0.25)

  ctx.fillStyle = pk.accent
  fit(ctx, pk.label, 800, LABEL_H * 0.04, DISPLAY, x1 - x0)
  ctx.fillText(pk.label, x0, LABEL_H * 0.315)
  ctx.fillStyle = '#4A4F55'
  ctx.font = `500 ${LABEL_H * 0.021}px ${BODY}`
  ctx.fillText(p.grade, x0, LABEL_H * 0.35)

  // Key specs as a ruled table.
  let y = LABEL_H * 0.4
  ctx.strokeStyle = 'rgba(0,0,0,0.15)'
  ctx.lineWidth = 2
  for (const s of p.keySpecs) {
    ctx.fillStyle = '#4A4F55'
    ctx.font = `500 ${LABEL_H * 0.02}px ${BODY}`
    ctx.textAlign = 'left'
    ctx.fillText(s.label, x0, y)
    ctx.fillStyle = pk.dark
    ctx.font = `600 ${LABEL_H * 0.021}px ${BODY}`
    ctx.textAlign = 'right'
    ctx.fillText(s.value, x1, y)
    ctx.beginPath()
    ctx.moveTo(x0, y + LABEL_H * 0.016)
    ctx.lineTo(x1, y + LABEL_H * 0.016)
    ctx.stroke()
    y += LABEL_H * 0.052
  }
  ctx.textAlign = 'left'
  ctx.fillStyle = '#2B2F33'
  ctx.font = `600 ${LABEL_H * 0.022}px ${BODY}`
  ctx.fillText('NET WT. 25 KG', x0, LABEL_H * 0.58)
  ctx.fillStyle = '#4A4F55'
  ctx.font = `500 ${LABEL_H * 0.019}px ${BODY}`
  ctx.fillText('Made in India  ·  Store in a cool, dry place', x0, LABEL_H * 0.615)
  // Batch / date box.
  ctx.strokeStyle = pk.dark
  ctx.strokeRect(x1 - LABEL_W * 0.26, LABEL_H * 0.555, LABEL_W * 0.26, LABEL_H * 0.07)
  ctx.fillStyle = pk.dark
  ctx.font = `600 ${LABEL_H * 0.015}px ${BODY}`
  ctx.fillText('BATCH NO.', x1 - LABEL_W * 0.245, LABEL_H * 0.578)
  ctx.fillText('MFG. DATE', x1 - LABEL_W * 0.245, LABEL_H * 0.612)

  ctx.fillStyle = '#ffffff'
  ctx.textAlign = 'center'
  ctx.font = `600 ${LABEL_H * 0.024}px ${BODY}`
  ctx.fillText('www.shreeearthtech.com', LABEL_W / 2, LABEL_H * 0.9)
  ctx.textAlign = 'left'
}
