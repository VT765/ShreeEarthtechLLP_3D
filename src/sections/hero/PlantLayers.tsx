/*
 * PLACEHOLDER hero illustration — procedurally drawn SVG panorama in the brand palette.
 * Replace with /public/hero/layer-0-sky.webp … layer-3-foreground.webp when real artwork is ready
 * (Hero.tsx switches to the images automatically once they exist).
 * All four layers share one 2400×1000 viewBox so they stay aligned while scaling.
 */
import type { ReactNode } from 'react'

export const VB_W = 2400
export const VB_H = 1000

const C = {
  steel: '#0C5A9E',
  steelHi: '#0C71C7',
  steelLo: '#08467C',
  gold: '#BF8311',
  goldHi: '#E0B04A',
  ivory: '#FAF7F2',
  ivoryShade: '#DCD3C4',
  ivorySide: '#C9BFAE',
  clay: '#E6D8C0',
  clayShade: '#CFB98F',
  clayDeep: '#B39C70',
  ground: '#3A3D47',
  road: '#2C2F38',
  tree: '#2E4A5C',
  treeHi: '#3F6272',
}

const DX = 0.55
const DY = 0.32

function Svg({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <svg
      viewBox={`0 0 ${VB_W} ${VB_H}`}
      preserveAspectRatio="xMidYMax slice"
      className={`absolute inset-0 h-full w-full ${className ?? ''}`}
      aria-hidden
    >
      {children}
    </svg>
  )
}

/** Oblique box: front face at (x, base-h)…(x+w, base), receding by depth d. */
function Box({ x, base, w, h, d, top, front, side }: { x: number; base: number; w: number; h: number; d: number; top: string; front: string; side: string }) {
  const dx = d * DX
  const dy = d * DY
  const t = base - h
  return (
    <g>
      <polygon points={`${x},${t} ${x + dx},${t - dy} ${x + w + dx},${t - dy} ${x + w},${t}`} fill={top} />
      <rect x={x} y={t} width={w} height={h} fill={front} />
      <polygon points={`${x + w},${base} ${x + w},${t} ${x + w + dx},${t - dy} ${x + w + dx},${base - dy}`} fill={side} />
    </g>
  )
}

/** Gable roof over a box footprint. */
function Gable({ x, top, w, d, rise, color, shade }: { x: number; top: number; w: number; d: number; rise: number; color: string; shade: string }) {
  const dx = d * DX
  const dy = d * DY
  const mx = x + dx / 2
  const my = top - dy / 2 - rise
  return (
    <g>
      <polygon points={`${x},${top} ${mx},${my} ${mx + w},${my} ${x + w},${top}`} fill={color} />
      <polygon points={`${mx},${my} ${x + dx},${top - dy} ${x + w + dx},${top - dy} ${mx + w},${my}`} fill={shade} />
      <polygon points={`${x + w},${top} ${mx + w},${my} ${x + w + dx},${top - dy}`} fill={shade} opacity="0.85" />
    </g>
  )
}

function VCyl({ cx, base, r, h, id, cap = C.ivory }: { cx: number; base: number; r: number; h: number; id: string; cap?: string }) {
  const ry = r * 0.32
  return (
    <g>
      <defs>
        <linearGradient id={id} x1="0" x2="1">
          <stop offset="0" stopColor={C.ivoryShade} />
          <stop offset="0.35" stopColor={C.ivory} />
          <stop offset="1" stopColor={C.ivorySide} />
        </linearGradient>
      </defs>
      <ellipse cx={cx} cy={base} rx={r} ry={ry} fill={C.ivorySide} />
      <rect x={cx - r} y={base - h} width={r * 2} height={h} fill={`url(#${id})`} />
      <ellipse cx={cx} cy={base - h} rx={r} ry={ry} fill={cap} />
    </g>
  )
}

function Railing({ x1, x2, y, color = C.goldHi }: { x1: number; x2: number; y: number; color?: string }) {
  const posts = []
  for (let x = x1; x <= x2; x += 18) posts.push(<line key={x} x1={x} y1={y} x2={x} y2={y + 16} stroke={color} strokeWidth="2" />)
  return (
    <g>
      <line x1={x1} y1={y} x2={x2} y2={y} stroke={color} strokeWidth="2.5" />
      <line x1={x1} y1={y + 8} x2={x2} y2={y + 8} stroke={color} strokeWidth="1.5" opacity="0.8" />
      {posts}
    </g>
  )
}

function Light({ x, y, delay = 0 }: { x: number; y: number; delay?: number }) {
  return (
    <g className="blink" style={{ animationDelay: `${delay}s` }}>
      <circle cx={x} cy={y} r="9" fill={C.goldHi} opacity="0.25" />
      <circle cx={x} cy={y} r="3.2" fill="#FFF3C4" />
    </g>
  )
}

function Tree({ x, base, s = 1 }: { x: number; base: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${base}) scale(${s})`}>
      <rect x="-3" y="-30" width="6" height="30" fill="#24323F" />
      <ellipse cx="0" cy="-58" rx="26" ry="36" fill={C.tree} />
      <ellipse cx="-8" cy="-66" rx="14" ry="20" fill={C.treeHi} opacity="0.8" />
    </g>
  )
}

/* ------------------------------------------------------------------ */

export function SkyLayer() {
  const stars = Array.from({ length: 70 }, (_, i) => {
    const x = (i * 337) % VB_W
    const y = (i * 151) % 420
    return <circle key={i} cx={x} cy={y + 10} r={i % 7 === 0 ? 1.8 : 1} fill="#fff" opacity={0.15 + ((i * 13) % 10) / 30} />
  })
  return (
    <Svg>
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#050F1E" />
          <stop offset="0.45" stopColor="#071F3A" />
          <stop offset="0.72" stopColor="#0A3A68" />
          <stop offset="1" stopColor="#0A3A68" />
        </linearGradient>
        <radialGradient id="glow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#E0B04A" stopOpacity="0.55" />
          <stop offset="1" stopColor="#E0B04A" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width={VB_W} height={VB_H} fill="url(#sky)" />
      {stars}
      <ellipse cx="1500" cy="640" rx="1300" ry="130" fill="url(#glow)" />
    </Svg>
  )
}

export function HillsLayer() {
  return (
    <Svg>
      <path d="M0 610 C 200 520, 380 560, 560 530 S 900 470, 1120 540 S 1500 500, 1700 520 S 2100 470, 2400 540 L2400 1000 L0 1000Z" fill={C.steel} opacity="0.28" />
      <path d="M0 650 C 260 590, 420 620, 700 585 S 1160 600, 1400 575 S 1900 610, 2120 580 S 2320 600, 2400 595 L2400 1000 L0 1000Z" fill={C.steel} opacity="0.42" />
      <path d="M0 680 C 300 650, 640 670, 980 645 S 1700 665, 2400 650 L2400 1000 L0 1000Z" fill="#0A3A68" opacity="0.9" />
    </Svg>
  )
}

export function PlantLayer() {
  const base = 800
  return (
    <Svg>
      <defs>
        <linearGradient id="ground" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1E3350" />
          <stop offset="1" stopColor={C.ground} />
        </linearGradient>
        <linearGradient id="dryer" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={C.steelHi} />
          <stop offset="0.45" stopColor={C.steel} />
          <stop offset="1" stopColor={C.steelLo} />
        </linearGradient>
        <linearGradient id="chimney" x1="0" x2="1">
          <stop offset="0" stopColor={C.ivoryShade} />
          <stop offset="0.4" stopColor={C.ivory} />
          <stop offset="1" stopColor={C.ivorySide} />
        </linearGradient>
      </defs>

      {/* Ground plane */}
      <path d="M0 690 C 500 676, 1200 690, 2400 680 L2400 1000 L0 1000Z" fill="url(#ground)" />
      <path d="M0 812 L2400 812" stroke="#5B6170" strokeWidth="2" opacity="0.4" />

      {/* 1 · Terraced bentonite quarry */}
      <g>
        {[0, 1, 2, 3].map((i) => {
          const y = base - i * 40
          const x1 = 40 + i * 55
          const x2 = 560 - i * 45
          return (
            <g key={i}>
              <polygon points={`${x1},${y} ${x1 + 22},${y - 40} ${x2 - 18},${y - 40} ${x2},${y}`} fill={i % 2 ? C.clayShade : C.clayDeep} />
              <polygon points={`${x1 + 22},${y - 40} ${x1 + 40},${y - 50} ${x2 - 4},${y - 50} ${x2 - 18},${y - 40}`} fill={C.clay} />
            </g>
          )
        })}
        {/* Excavator */}
        <g transform="translate(250 666)">
          <rect x="-34" y="-6" width="70" height="12" rx="6" fill="#24323F" />
          <rect x="-28" y="-34" width="48" height="28" rx="3" fill={C.gold} />
          <rect x="-4" y="-50" width="24" height="18" rx="2" fill={C.goldHi} />
          <rect x="0" y="-46" width="14" height="10" fill="#0A3A68" />
          <path d="M18 -30 L62 -64 L92 -38" stroke={C.gold} strokeWidth="8" fill="none" strokeLinecap="round" />
          <path d="M86 -42 l16 4 l-4 18 l-18 -6z" fill={C.goldHi} />
        </g>
        {/* Haul truck on the bench */}
        <g transform="translate(410 715)">
          <polygon points="-40,-30 30,-30 40,-8 -40,-8" fill={C.goldHi} />
          <rect x="30" y="-26" width="22" height="18" fill={C.gold} />
          <circle cx="-24" cy="-4" r="8" fill="#1A1D24" />
          <circle cx="36" cy="-4" r="8" fill="#1A1D24" />
          <path d="M-36 -30 q 30 -16 62 0" fill={C.clay} />
        </g>
        <Light x={120} y={702} delay={0.3} />
      </g>

      {/* 2 · Clay stockpiles */}
      <g>
        <polygon points="560,800 650,660 740,800" fill={C.clay} />
        <polygon points="650,660 740,800 690,800" fill={C.clayShade} />
        <polygon points="700,800 760,712 820,800" fill={C.clay} />
        <polygon points="760,712 820,800 790,800" fill={C.clayShade} />
      </g>

      {/* 3 · Inclined conveyor */}
      <g>
        {[760, 830, 900].map((x, i) => (
          <line key={x} x1={x} y1={800} x2={x} y2={780 - (i + 1) * 46} stroke={C.steel} strokeWidth="5" />
        ))}
        <path d="M700 788 L1000 612" stroke={C.steel} strokeWidth="10" strokeLinecap="round" />
        <path d="M700 800 L1000 624" stroke={C.steelLo} strokeWidth="3" />
        {Array.from({ length: 10 }, (_, i) => {
          const t = i / 10
          const x = 700 + t * 300
          const y = 788 - t * 176
          return <line key={i} x1={x} y1={y} x2={x + 30} y2={y - 6} stroke={C.steelHi} strokeWidth="1.5" opacity="0.7" />
        })}
        <path className="belt" d="M700 781 L1000 605" stroke={C.clayShade} strokeWidth="5" strokeDasharray="12 8" />
      </g>

      {/* 4 · Open-sided storage shed */}
      <g>
        <polygon points="985,800 1012,786 1130,786 1103,800" fill="#2A3B52" />
        <path d="M1000 790 q 40 -50 80 0z" fill={C.clay} />
        {[990, 1050, 1105].map((x) => (
          <rect key={x} x={x} y={656} width="6" height={144} fill={C.steel} />
        ))}
        <Gable x={975} top={660} w={140} d={60} rise={30} color={C.steelHi} shade={C.steel} />
      </g>

      {/* 5 · Activation tanks & reactors */}
      <g>
        <Box x={1140} base={806} w={260} h={14} d={70} top="#5B6170" front="#3A3D47" side="#2C2F38" />
        <VCyl cx={1190} base={792} r={36} h={160} id="t1" />
        <VCyl cx={1272} base={792} r={36} h={190} id="t2" />
        <VCyl cx={1354} base={792} r={36} h={160} id="t3" />
        {/* tank bands */}
        {[1190, 1272, 1354].map((cx, i) => (
          <g key={cx}>
            <rect x={cx - 36} y={792 - (i === 1 ? 140 : 110)} width="72" height="4" fill={C.gold} opacity="0.8" />
            <rect x={cx - 36} y={792 - 60} width="72" height="4" fill={C.gold} opacity="0.8" />
          </g>
        ))}
        {/* pipework */}
        <path d="M1190 640 L1190 610 L1354 610 L1354 640" stroke={C.steelHi} strokeWidth="6" fill="none" />
        <path d="M1272 610 L1272 602" stroke={C.steelHi} strokeWidth="6" />
        <path d="M1226 720 L1236 720 M1308 720 L1318 720" stroke={C.steel} strokeWidth="8" />
        {/* catwalk */}
        <rect x={1150} y={628} width={240} height={5} fill={C.steel} />
        <Railing x1={1150} x2={1390} y={612} />
        <line x1={1140} y1={800} x2={1150} y2={630} stroke={C.goldHi} strokeWidth="2" />
        <line x1={1128} y1={800} x2={1138} y2={630} stroke={C.goldHi} strokeWidth="2" />
        <Light x={1160} y={612} delay={0.8} />
        <Light x={1380} y={612} delay={1.6} />
      </g>

      {/* 6 · Rotary dryer (zoom focus) */}
      <g transform="rotate(-3 1550 700)">
        <Box x={1460} base={800} w={26} h={74} d={30} top={C.ivory} front={C.ivoryShade} side={C.ivorySide} />
        <Box x={1610} base={800} w={26} h={84} d={30} top={C.ivory} front={C.ivoryShade} side={C.ivorySide} />
        <rect x={1420} y={676} width={290} height={64} fill="url(#dryer)" />
        <ellipse cx={1420} cy={708} rx={14} ry={32} fill={C.steelLo} />
        <ellipse cx={1710} cy={708} rx={14} ry={32} fill={C.steelHi} />
        {[1470, 1622].map((x) => (
          <rect key={x} x={x - 6} y={672} width={16} height={72} rx={4} fill={C.goldHi} />
        ))}
        <rect x={1536} y={674} width={12} height={68} fill={C.gold} />
        {/* burner */}
        <Box x={1366} base={760} w={44} h={60} d={34} top={C.ivory} front={C.ivoryShade} side={C.ivorySide} />
        <rect x={1374} y={716} width={18} height={12} fill={C.goldHi} className="blink" />
        {/* cyclone & duct */}
        <path d="M1716 700 L1750 700 L1750 610" stroke={C.steel} strokeWidth="14" fill="none" />
        <path d="M1735 610 L1785 610 L1774 650 L1760 668 L1750 650Z" fill={C.ivory} />
      </g>
      <Light x={1550} y={666} delay={0.4} />

      {/* 7 · Process building + chimney */}
      <g>
        <Box x={1790} base={800} w={150} h={170} d={60} top="#C9BFAE" front={C.ivory} side={C.ivoryShade} />
        <Gable x={1790} top={630} w={150} d={60} rise={0} color={C.steel} shade={C.steelHi} />
        {[0, 1, 2].map((r) =>
          [0, 1, 2].map((c) => (
            <rect
              key={`${r}${c}`}
              x={1806 + c * 44}
              y={656 + r * 44}
              width="24"
              height="20"
              rx="2"
              fill={(r + c) % 3 === 0 ? C.goldHi : '#0A3A68'}
              className={(r + c) % 3 === 0 ? 'blink' : ''}
              style={{ animationDelay: `${r * 0.7 + c * 0.3}s` }}
            />
          )),
        )}
        <rect x={1952} y={410} width={30} height={380} fill="url(#chimney)" />
        <rect x={1950} y={430} width={34} height={10} fill={C.gold} />
        <rect x={1950} y={520} width={34} height={8} fill={C.gold} />
        <Light x={1967} y={404} delay={1.1} />
        {[0, 1, 2, 3].map((i) => (
          <circle key={i} cx={1967} cy={400} r={20} fill="#DCD3C4" opacity="0" className="smoke-puff" style={{ animationDelay: `${i * 1.75}s` }} />
        ))}
      </g>

      {/* 8 · Silos on steel platform */}
      <g>
        <Box x={1996} base={800} w={170} h={12} d={50} top={C.steelHi} front={C.steel} side={C.steelLo} />
        {[2022, 2081, 2140].map((cx) => (
          <g key={cx}>
            <line x1={cx - 20} y1={788} x2={cx - 20} y2={720} stroke={C.steel} strokeWidth="5" />
            <line x1={cx + 20} y1={788} x2={cx + 20} y2={720} stroke={C.steel} strokeWidth="5" />
            <polygon points={`${cx - 28},700 ${cx + 28},700 ${cx + 6},736 ${cx - 6},736`} fill={C.ivorySide} />
            <VCyl cx={cx} base={700} r={28} h={130} id={`s${cx}`} />
            <polygon points={`${cx - 28},570 ${cx},548 ${cx + 28},570`} fill={C.steelHi} />
          </g>
        ))}
        <Railing x1={1990} x2={2172} y={540} />
        <Light x={2172} y={540} delay={2} />
      </g>

      {/* 9 · Packaging warehouse */}
      <g>
        <Box x={2190} base={800} w={190} h={120} d={70} top="#C9BFAE" front={C.ivory} side={C.ivoryShade} />
        <Gable x={2190} top={680} w={190} d={70} rise={26} color={C.steelHi} shade={C.steel} />
        <rect x={2222} y={722} width={70} height={78} fill="#0A3A68" />
        {[0, 1, 2].map((r) =>
          [0, 1].map((c) => <rect key={`${r}${c}`} x={2230 + c * 28} y={780 - r * 16} width="24" height="14" rx="3" fill={C.ivory} />),
        )}
        <rect x={2310} y={700} width={52} height={10} fill={C.gold} />
        {/* forklift */}
        <g transform="translate(2150 800)">
          <rect x="-28" y="-30" width="34" height="22" rx="3" fill={C.gold} />
          <rect x="-24" y="-48" width="22" height="18" fill="none" stroke={C.goldHi} strokeWidth="3" />
          <line x1="8" y1="-52" x2="8" y2="-4" stroke="#24323F" strokeWidth="4" />
          <line x1="8" y1="-6" x2="26" y2="-6" stroke="#24323F" strokeWidth="3" />
          <rect x="10" y="-26" width="20" height="16" rx="3" fill={C.ivory} />
          <circle cx="-18" cy="-6" r="7" fill="#1A1D24" />
          <circle cx="0" cy="-6" r="6" fill="#1A1D24" />
        </g>
      </g>

      {/* Mid-ground trees */}
      <Tree x={880} base={800} s={0.8} />
      <Tree x={1765} base={800} s={0.75} />
      <Tree x={2395} base={800} s={0.85} />
    </Svg>
  )
}

export function ForegroundLayer() {
  return (
    <Svg>
      <path d="M0 880 L2400 868 L2400 1000 L0 1000Z" fill="#2A2D36" />
      <path d="M0 900 L2400 888 L2400 952 L0 964Z" fill={C.road} />
      <path d="M0 932 L2400 920" stroke="#E0B04A" strokeWidth="3" strokeDasharray="40 36" opacity="0.6" />
      {/* fence */}
      {Array.from({ length: 60 }, (_, i) => (
        <line key={i} x1={i * 40} y1={884 - i * 0.2} x2={i * 40} y2={862 - i * 0.2} stroke="#5B6170" strokeWidth="2" />
      ))}
      <line x1="0" y1="866" x2="2400" y2="854" stroke="#5B6170" strokeWidth="1.5" />

      {/* tipper truck */}
      <g transform="translate(360 942)">
        <polygon points="-90,-58 40,-58 52,-18 -90,-18" fill={C.goldHi} />
        <rect x="52" y="-50" width="46" height="32" rx="4" fill={C.gold} />
        <rect x="64" y="-44" width="24" height="14" fill="#0A3A68" />
        <rect x="-90" y="-20" width="190" height="8" fill="#24323F" />
        {[-60, -26, 72].map((x) => (
          <circle key={x} cx={x} cy="-6" r="14" fill="#1A1D24" />
        ))}
        <path d="M-84 -58 q 60 -30 118 0" fill={C.clay} />
      </g>

      {/* tanker truck */}
      <g transform="translate(1980 932)">
        <rect x="-110" y="-62" width="150" height="46" rx="23" fill={C.ivory} />
        <rect x="-110" y="-44" width="150" height="6" fill={C.gold} />
        <rect x="44" y="-56" width="48" height="40" rx="5" fill={C.steelHi} />
        <rect x="58" y="-50" width="26" height="14" fill="#071F3A" />
        <rect x="-110" y="-18" width="204" height="8" fill="#24323F" />
        {[-84, -50, 70].map((x) => (
          <circle key={x} cx={x} cy="-4" r="14" fill="#1A1D24" />
        ))}
      </g>

      {/* foreground trees & bushes */}
      <Tree x={60} base={900} s={1.6} />
      <Tree x={150} base={905} s={1.2} />
      <Tree x={1150} base={890} s={1.3} />
      <Tree x={2260} base={895} s={1.5} />
      <Tree x={2350} base={900} s={1.1} />
      {[700, 1500, 1680].map((x) => (
        <ellipse key={x} cx={x} cy={884} rx={60} ry={20} fill={C.tree} />
      ))}
    </Svg>
  )
}
