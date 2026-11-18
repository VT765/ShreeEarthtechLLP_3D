/* Small isometric instrument illustrations for the Quality Lab grid. */
const B = '#0C71C7', BD = '#0C5A9E', G = '#BF8311', GL = '#E0B04A', IV = '#FFFFFF', IVS = '#E6D8C0', IVD = '#CFC3AE', N = '#071F3A'

/** Isometric box: top/left/right faces around (x, y) = top-front corner. */
function IsoBox({ x, y, w, d, h, top = IV, left = IVS, right = IVD }: { x: number; y: number; w: number; d: number; h: number; top?: string; left?: string; right?: string }) {
  const c = 0.866
  const p = (dx: number, dy: number) => `${x + dx},${y + dy}`
  return (
    <g>
      <polygon points={`${p(0, 0)} ${p(-d * c, -d / 2)} ${p(-d * c + w * c, -d / 2 - w / 2)} ${p(w * c, -w / 2)}`} fill={top} />
      <polygon points={`${p(0, 0)} ${p(-d * c, -d / 2)} ${p(-d * c, -d / 2 + h)} ${p(0, h)}`} fill={left} />
      <polygon points={`${p(0, 0)} ${p(w * c, -w / 2)} ${p(w * c, -w / 2 + h)} ${p(0, h)}`} fill={right} />
    </g>
  )
}

const art: Record<string, React.ReactNode> = {
  spectro: (
    <>
      <IsoBox x={60} y={70} w={44} d={30} h={26} />
      <polygon points="60,70 74,63 92,72 78,79" fill={N} />
      <rect x="64" y="84" width="14" height="6" fill={B} transform="skewY(-30) translate(0 47)" />
      <circle cx="88" cy="84" r="3" fill={GL} className="blink" />
    </>
  ),
  colour: (
    <>
      <IsoBox x={60} y={74} w={38} d={30} h={24} />
      {[0, 1, 2].map((i) => <rect key={i} x={40 + i * 10} y={50 - i * 5} width="8" height="18" rx="2" fill={[GL, G, '#8F620C'][i]} />)}
      <polygon points="62,74 80,64 92,70 74,80" fill={B} />
    </>
  ),
  balance: (
    <>
      <IsoBox x={60} y={78} w={40} d={34} h={18} />
      <ellipse cx="58" cy="60" rx="20" ry="10" fill={IVS} stroke={B} strokeWidth="2" />
      <path d="M44 52 Q58 30 72 52" fill="none" stroke={G} strokeWidth="3" />
      <rect x="70" y="80" width="18" height="6" fill={N} transform="skewY(-30) translate(0 40)" />
    </>
  ),
  ph: (
    <>
      <IsoBox x={52} y={82} w={34} d={26} h={14} />
      <rect x="62" y="30" width="5" height="44" rx="2" fill={B} />
      <rect x="54" y="26" width="22" height="10" rx="3" fill={BD} />
      <path d="M44 66 L44 86 a8 8 0 0 0 16 0 L60 66" fill="rgba(12,113,199,0.25)" stroke={B} strokeWidth="2" />
      <text x="72" y="96" fontSize="10" fontFamily="JetBrains Mono" fill={N}>7.0</text>
    </>
  ),
  density: (
    <>
      <IsoBox x={56} y={86} w={36} d={30} h={10} />
      <rect x="46" y="26" width="18" height="52" fill="rgba(255,255,255,0.7)" stroke={B} strokeWidth="2" />
      <rect x="48" y="50" width="14" height="26" fill={IVS} />
      {[36, 46, 56, 66].map((y) => <line key={y} x1="46" x2="52" y1={y} y2={y} stroke={B} />)}
    </>
  ),
  pump: (
    <>
      <IsoBox x={58} y={80} w={44} d={28} h={20} top={B} left={BD} right="#08467C" />
      <ellipse cx="46" cy="60" rx="14" ry="16" fill={BD} />
      <ellipse cx="46" cy="60" rx="8" ry="9" fill={GL} />
      <path d="M90 56 q 10 -20 -6 -26" fill="none" stroke={N} strokeWidth="3" />
    </>
  ),
  filter: (
    <>
      <path d="M40 30 L80 30 L66 56 L54 56 Z" fill="rgba(255,255,255,0.75)" stroke={B} strokeWidth="2" />
      <rect x="56" y="56" width="8" height="12" fill={B} />
      <path d="M44 70 L44 92 a8 8 0 0 0 8 8 L68 100 a8 8 0 0 0 8 -8 L76 70" fill="rgba(224,176,74,0.4)" stroke={B} strokeWidth="2" />
      <path d="M46 36 L74 36 L64 50 L56 50Z" fill="#3A2A10" />
    </>
  ),
  oilbath: (
    <>
      <IsoBox x={60} y={70} w={46} d={34} h={26} />
      <polygon points="60,70 36,58 60,46 84,58" fill={GL} opacity="0.85" />
      <rect x="52" y="34" width="6" height="24" fill="rgba(255,255,255,0.8)" stroke={B} />
      <circle cx="94" cy="80" r="3" fill={G} className="blink" />
    </>
  ),
  waterbath: (
    <>
      <IsoBox x={60} y={70} w={46} d={34} h={26} />
      <polygon points="60,70 36,58 60,46 84,58" fill="#4E91CC" opacity="0.7" />
      {[0, 1, 2].map((i) => <circle key={i} cx={52 + i * 9} cy={56 - i * 2} r="2" fill="#fff" />)}
      <circle cx="94" cy="80" r="3" fill={B} className="blink" />
    </>
  ),
  stirrer: (
    <>
      <IsoBox x={58} y={82} w={40} d={36} h={12} />
      <path d="M46 40 L46 64 a14 6 0 0 0 28 0 L74 40" fill="rgba(224,176,74,0.45)" stroke={B} strokeWidth="2" />
      <ellipse cx="60" cy="40" rx="14" ry="5" fill="none" stroke={B} strokeWidth="2" />
      <rect x="54" y="62" width="12" height="3" rx="1.5" fill={N} style={{ animation: 'spin-slow 1.2s linear infinite', transformOrigin: '60px 63px' }} />
    </>
  ),
}

export default function LabArt({ kind }: { kind: string }) {
  return (
    <svg viewBox="0 0 120 120" className="h-24 w-24" aria-hidden>
      <ellipse cx="60" cy="104" rx="40" ry="8" fill="#071F3A" opacity="0.08" />
      {art[kind]}
    </svg>
  )
}
