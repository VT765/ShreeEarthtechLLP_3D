/* Flat-vector stage illustrations for the process timeline (same palette as the hero). */
const B = '#0C71C7'
const BD = '#0C5A9E'
const BL = '#08467C'
const G = '#BF8311'
const GL = '#E0B04A'
const IV = '#FAF7F2'
const IVS = '#DCD3C4'
const CL = '#E6D8C0'
const CLS = '#CFB98F'
const GR = '#123A63'

function Ground() {
  return (
    <>
      <path d="M0 470 L800 470 L800 600 L0 600Z" fill={GR} />
      <path d="M0 470 L800 470" stroke="#4E91CC" strokeOpacity="0.3" strokeWidth="2" />
      {Array.from({ length: 14 }, (_, i) => (
        <circle key={i} cx={40 + i * 56} cy={520 + (i % 3) * 18} r="2" fill="#4E91CC" opacity="0.25" />
      ))}
    </>
  )
}

function Tank({ x, y, w, h }: { x: number; y: number; w: number; h: number }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} fill={IV} />
      <rect x={x + w * 0.65} y={y} width={w * 0.35} height={h} fill={IVS} />
      <ellipse cx={x + w / 2} cy={y} rx={w / 2} ry={w * 0.16} fill="#fff" />
      <rect x={x} y={y + h * 0.3} width={w} height="5" fill={G} />
      <rect x={x} y={y + h * 0.7} width={w} height="5" fill={G} />
    </g>
  )
}

function Bag({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x="-30" y="-22" width="60" height="44" rx="8" fill={IV} />
      <rect x="-30" y="-6" width="60" height="10" fill={B} />
      <circle cx="0" cy="-12" r="5" fill={G} />
    </g>
  )
}

const stages = [
  // 0 · Raw material selection
  <>
    <Ground />
    {[0, 1, 2].map((i) => (
      <polygon key={i} points={`${60 + i * 50},${470 - i * 50} ${90 + i * 50},${420 - i * 50} ${470 - i * 40},${420 - i * 50} ${500 - i * 40},${470 - i * 50}`} fill={i % 2 ? CLS : CL} />
    ))}
    <g transform="translate(250 320)">
      <rect x="-40" y="-10" width="90" height="16" rx="8" fill="#1A1D24" />
      <rect x="-34" y="-46" width="60" height="36" rx="4" fill={G} />
      <rect x="-6" y="-68" width="30" height="24" rx="3" fill={GL} />
      <path d="M24 -40 L84 -86 L120 -52" stroke={G} strokeWidth="10" fill="none" strokeLinecap="round" />
    </g>
    <g transform="translate(610 300)">
      <circle r="90" fill="none" stroke={GL} strokeWidth="10" />
      <line x1="64" y1="64" x2="130" y2="130" stroke={GL} strokeWidth="16" strokeLinecap="round" />
      {[[-30, -20, 22], [20, 10, 28], [-10, 40, 16], [36, -36, 14]].map(([x, y, r], i) => (
        <circle key={i} cx={x} cy={y} r={r} fill={i % 2 ? CL : CLS} />
      ))}
    </g>
  </>,
  // 1 · Granulation
  <>
    <Ground />
    <polygon points="150,140 330,140 280,250 200,250" fill={B} />
    <polygon points="150,140 330,140 320,128 160,128" fill="#4E91CC" />
    <rect x="200" y="250" width="80" height="40" fill={BD} />
    <rect x="300" y="300" width="260" height="110" rx="55" fill={BD} />
    <rect x="300" y="300" width="260" height="40" rx="20" fill={B} />
    {[360, 430, 500].map((x) => <rect key={x} x={x} y="296" width="14" height="118" rx="4" fill={GL} />)}
    <rect x="300" y="410" width="20" height="60" fill={IVS} />
    <rect x="540" y="410" width="20" height="60" fill={IVS} />
    <path d="M560 380 L720 440" stroke="#1A1D24" strokeWidth="14" strokeLinecap="round" />
    {Array.from({ length: 16 }, (_, i) => (
      <circle key={i} cx={580 + (i % 8) * 18} cy={372 + Math.floor(i / 8) * 8 + (i % 8) * 6.5} r="6" fill={i % 3 ? CL : CLS} />
    ))}
    {Array.from({ length: 9 }, (_, i) => (
      <circle key={i} cx={170 + (i % 3) * 50 + 20} cy={110 - Math.floor(i / 3) * 18} r="10" fill={CLS} />
    ))}
  </>,
  // 2 · Acid activation
  <>
    <Ground />
    <Tank x={140} y={200} w={140} h={270} />
    <Tank x={330} y={170} w={140} h={300} />
    <path d="M210 180 L210 140 L400 140 L400 150" stroke={B} strokeWidth="12" fill="none" />
    {Array.from({ length: 10 }, (_, i) => (
      <circle key={i} cx={360 + (i * 23) % 90} cy={360 - (i * 37) % 160} r={4 + (i % 3) * 2} fill={GL} opacity="0.7" className="blink" style={{ animationDelay: `${i * 0.25}s` }} />
    ))}
    {[
      { x: 610, y: 210, t: '≈10 h', l: 'Acid treatment' },
      { x: 610, y: 370, t: '≈12 h', l: 'Washing' },
    ].map((c) => (
      <g key={c.l} transform={`translate(${c.x} ${c.y})`}>
        <circle r="62" fill="#0A3A68" stroke={GL} strokeWidth="4" />
        <circle r="62" fill="none" stroke={GL} strokeWidth="8" strokeDasharray="300 400" transform="rotate(-90)" opacity="0.5" />
        <text textAnchor="middle" y="6" fill="#fff" fontFamily="JetBrains Mono" fontSize="26">{c.t}</text>
        <text textAnchor="middle" y="90" fill={GL} fontFamily="Inter" fontSize="16">{c.l}</text>
      </g>
    ))}
  </>,
  // 3 · Neutralization & recycling
  <>
    <Ground />
    <circle cx="400" cy="290" r="190" fill="none" stroke="#1E8C7E" strokeWidth="6" strokeDasharray="18 14" style={{ animation: 'dash-flow 6s linear infinite' }} />
    {[
      { a: -90, label: 'Lime', c: IV },
      { a: 0, label: 'RO water', c: '#4E91CC' },
      { a: 90, label: 'Gypsum → cement', c: CL },
      { a: 180, label: 'Clean discharge', c: '#1E8C7E' },
    ].map((n) => {
      const x = 400 + Math.cos((n.a * Math.PI) / 180) * 190
      const y = 290 + Math.sin((n.a * Math.PI) / 180) * 190
      return (
        <g key={n.label} transform={`translate(${x} ${y})`}>
          <circle r="46" fill="#0A3A68" stroke={GL} strokeWidth="3" />
          <circle r="22" fill={n.c} />
          <text textAnchor="middle" y="74" fill="#fff" fontFamily="Inter" fontSize="16">{n.label}</text>
        </g>
      )
    })}
    <Tank x={345} y={230} w={110} h={130} />
  </>,
  // 4 · Drying
  <>
    <Ground />
    <g transform="rotate(-4 400 330)">
      <rect x="130" y="280" width="500" height="110" fill={BD} />
      <rect x="130" y="280" width="500" height="40" fill={B} />
      <ellipse cx="130" cy="335" rx="22" ry="55" fill={BL} />
      <ellipse cx="630" cy="335" rx="22" ry="55" fill="#4E91CC" />
      {[230, 520].map((x) => <rect key={x} x={x} y="272" width="26" height="126" rx="6" fill={GL} />)}
      <rect x="220" y="390" width="40" height="90" fill={IVS} />
      <rect x="510" y="390" width="40" height="90" fill={IVS} />
    </g>
    <rect x="60" y="300" width="70" height="90" fill={IV} />
    <rect x="78" y="330" width="34" height="22" fill={GL} className="blink" />
    {[0, 1, 2].map((i) => (
      <path key={i} d={`M${280 + i * 90} 250 q 12 -20 0 -40 q -12 -20 0 -40`} stroke={GL} strokeWidth="5" fill="none" opacity="0.7" className="blink" style={{ animationDelay: `${i * 0.4}s` }} />
    ))}
    <text x="400" y="560" textAnchor="middle" fill={GL} fontFamily="JetBrains Mono" fontSize="20">Moisture → ≤ 15%</text>
  </>,
  // 5 · Milling & packaging
  <>
    <Ground />
    <rect x="120" y="230" width="150" height="240" fill={IV} />
    <rect x="220" y="230" width="50" height="240" fill={IVS} />
    <polygon points="120,230 195,170 270,230" fill={B} />
    <circle cx="195" cy="330" r="40" fill={BD} />
    <circle cx="195" cy="330" r="40" fill="none" stroke={GL} strokeWidth="6" strokeDasharray="20 12" style={{ animation: 'spin-slow 4s linear infinite', transformOrigin: '195px 330px' }} />
    <path d="M270 400 L470 400" stroke="#1A1D24" strokeWidth="14" />
    <Bag x={330} y={378} s={0.8} />
    <Bag x={420} y={378} s={0.8} />
    {[0, 1, 2].map((r) =>
      [0, 1, 2].map((c) => <Bag key={`${r}${c}`} x={540 + c * 66 + (r % 2) * 12} y={445 - r * 46} />),
    )}
    <rect x="500" y="470" width="230" height="10" fill={G} />
  </>,
]

export default function ProcessArt({ step }: { step: number }) {
  return (
    <svg viewBox="0 0 800 600" className="h-full w-full" aria-hidden>
      <defs>
        <radialGradient id="pa-sky" cx="0.7" cy="0.2" r="0.9">
          <stop offset="0" stopColor="#0C5A9E" stopOpacity="0.5" />
          <stop offset="1" stopColor="#0A2E52" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="800" height="600" fill="url(#pa-sky)" />
      {stages[step]}
    </svg>
  )
}
