import { exportCountries, origin } from '../../data/exportCountries'

// Equirectangular crop around the export corridor (Africa → Southeast Asia).
const LNG0 = -15
const LNG1 = 125
const LAT0 = 55
const LAT1 = -25
const W = 600
const H = (W * (LAT0 - LAT1)) / (LNG1 - LNG0)

const project = (lat: number, lng: number) => [((lng - LNG0) / (LNG1 - LNG0)) * W, ((LAT0 - lat) / (LAT0 - LAT1)) * H] as const

/** No-WebGL fallback: a flat navy chart with dot markers and arcs from India. Decorative only. */
export default function StaticMap() {
  const [ox, oy] = project(origin.lat, origin.lng)
  return (
    <svg viewBox={`0 0 ${W} ${H.toFixed(0)}`} className="h-auto w-full" aria-hidden="true" focusable="false">
      <defs>
        <radialGradient id="gr-static-bg" cx="55%" cy="45%" r="75%">
          <stop offset="0" stopColor="#0A3A68" />
          <stop offset="1" stopColor="#071F3A" />
        </radialGradient>
        <pattern id="gr-static-dots" width="12" height="12" patternUnits="userSpaceOnUse">
          <circle cx="6" cy="6" r="1" fill="#1E8C7E" opacity="0.35" />
        </pattern>
      </defs>
      <rect width={W} height={H} rx="24" fill="url(#gr-static-bg)" />
      <rect width={W} height={H} rx="24" fill="url(#gr-static-dots)" />
      {[0, 20, 40].map((lat) => {
        const [, y] = project(lat, 0)
        return <line key={lat} x1="0" x2={W} y1={y} y2={y} stroke="#FFFFFF" strokeOpacity={lat === 0 ? 0.18 : 0.08} strokeDasharray="2 6" />
      })}
      {exportCountries.map((c) => {
        const [x, y] = project(c.lat, c.lng)
        const mx = (ox + x) / 2
        const my = Math.min(oy, y) - Math.hypot(x - ox, y - oy) * 0.18
        return (
          <g key={c.name}>
            <path d={`M${ox},${oy} Q${mx},${my} ${x},${y}`} fill="none" stroke="#E0B04A" strokeOpacity="0.75" strokeWidth="1.5" />
            <circle cx={x} cy={y} r="4" fill="#E0B04A" />
          </g>
        )
      })}
      <circle cx={ox} cy={oy} r="13" fill="#FFF3C4" opacity="0.2" />
      <circle cx={ox} cy={oy} r="6.5" fill="#FFF3C4" stroke="#BF8311" strokeWidth="2" />
      <text x={ox + 12} y={oy - 12} fill="#FFF3C4" fontSize="14" fontWeight="700" fontFamily="Plus Jakarta Sans, sans-serif">
        India
      </text>
    </svg>
  )
}

/** True when the browser can create a WebGL context. */
export function hasWebGL() {
  try {
    const c = document.createElement('canvas')
    const gl = c.getContext('webgl2') || c.getContext('webgl')
    gl?.getExtension('WEBGL_lose_context')?.loseContext()
    return !!gl
  } catch {
    return false
  }
}
