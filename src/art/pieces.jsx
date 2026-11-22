import { createContext, useContext } from 'react'

/* ─────────────────────────────────────────────────────────────
   SNITCHY STYLE — garment drawing library (pure SVG, no motion code).
   Every piece is drawn in a 200×200 box and coloured from a TONE.
   Direction: modern Gen-Z streetwear. Clean cuts, bold prints, colour
   blocking and soft 3D shading. No patches, scraps or craft details.
   ───────────────────────────────────────────────────────────── */

export const INK = '#151515'
export const BONE = '#f3efe7'
const ACID = '#d6ff3f'
const FONT = "Anton, Impact, 'Arial Black', sans-serif"

/* fill = main fabric · b = contrast panels/trims · a = print colour · c = second print colour
   bg = card backdrop · kind = backdrop pattern */
export const TONES = {
  denim: { fill: '#5b7fb5', b: '#27406b', a: ACID, c: BONE, bg: '#ffc4e1', kind: 'burst' },
  bone: { fill: '#f3efe7', b: INK, a: '#ff4f1f', c: '#2f4bff', bg: ACID, kind: 'dots' },
  sage: { fill: '#7fa06a', b: '#21382a', a: '#ffd23f', c: BONE, bg: '#ff9f4a', kind: 'grid' },
  sand: { fill: '#eadcbf', b: INK, a: '#2f4bff', c: '#ff4f1f', bg: '#9fd0ff', kind: 'blob' },
  rust: { fill: '#ff4f1f', b: INK, a: BONE, c: ACID, bg: '#d6c8ff', kind: 'burst' },
  ink: { fill: '#1d1d22', b: '#ff4fa3', a: ACID, c: BONE, bg: '#ff8fc5', kind: 'dots' },
  acid: { fill: ACID, b: INK, a: '#ff4fa3', c: '#2f4bff', bg: '#1d1d22', kind: 'grid', dark: true },
  volt: { fill: '#2f4bff', b: INK, a: ACID, c: BONE, bg: '#ffe3b8', kind: 'blob' },
  pink: { fill: '#ff5fa8', b: INK, a: BONE, c: ACID, bg: '#c9f23d', kind: 'dots' },
  lilac: { fill: '#b9a6ff', b: INK, a: '#ff4f1f', c: BONE, bg: '#1d1d22', kind: 'burst', dark: true },
  faded: { fill: '#b8b3a6', b: '#9b9689', a: '#9b9689', c: '#a9a498', bg: '#d8d3c6', kind: 'none' },
}

/* unique gradient ids per illustration */
export const Gid = createContext('g')

const ol = (sw = 3) => ({ fill: 'none', stroke: INK, strokeWidth: sw, strokeLinejoin: 'round', strokeLinecap: 'round' })

/* ---------- primitives ---------- */
export function Cloth({ d, fill, sw = 3, vert = true }) {
  const u = useContext(Gid)
  return (
    <g>
      <path d={d} fill={fill} />
      <path d={d} fill={`url(#${u}h)`} />
      {vert && <path d={d} fill={`url(#${u}v)`} />}
      <path d={d} {...ol(sw)} />
    </g>
  )
}
const Fold = ({ d }) => <path d={d} fill="none" stroke={INK} strokeOpacity=".16" strokeWidth="2" strokeLinecap="round" />
const Band = ({ d, c, w = 6 }) => (
  <g fill="none" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} stroke={INK} strokeWidth={w + 3.5} />
    <path d={d} stroke={c} strokeWidth={w} />
  </g>
)
const Txt = ({ x, y, size = 20, fill = INK, rot = 0, anchor = 'middle', stroke, sw = 3, children }) => (
  <text x={x} y={y} fontSize={size} fill={fill} textAnchor={anchor} transform={rot ? `rotate(${rot} ${x} ${y})` : undefined}
    stroke={stroke} strokeWidth={stroke ? sw : undefined} paintOrder="stroke" strokeLinejoin="round"
    style={{ fontFamily: FONT, letterSpacing: '.02em' }}>{children}</text>
)

const ring = (n, ro, ri) => Array.from({ length: n * 2 }, (_, i) => {
  const a = (Math.PI * i) / n
  const r = i % 2 ? ri : ro
  return `${(Math.cos(a) * r).toFixed(2)},${(Math.sin(a) * r).toFixed(2)}`
}).join(' ')
const B12 = ring(12, 1, 0.76)
export const Burst = ({ x, y, r, fill, sw = 2.4, rot = 0 }) => (
  <polygon points={B12} transform={`translate(${x} ${y}) rotate(${rot}) scale(${r})`} fill={fill} stroke={INK} strokeWidth={sw / r} strokeLinejoin="round" />
)
export const Star = ({ x, y, s = 1, fill }) => (
  <path transform={`translate(${x} ${y}) scale(${s})`} d="M0 -18 L7 -7 L18 0 L7 7 L0 18 L-7 7 L-18 0 L-7 -7 Z" fill={fill} stroke={INK} strokeWidth={2.4 / s} strokeLinejoin="round" />
)
const Bolt = ({ x, y, s = 1, fill, rot = 0 }) => (
  <path transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`} d="M2 -16 L-9 3 L-1 3 L-4 16 L9 -4 L1 -4 Z" fill={fill} stroke={INK} strokeWidth={2.2 / s} strokeLinejoin="round" />
)
const Heart = ({ x, y, s = 1, fill, rot = 0 }) => (
  <path transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`} d="M0 11 C-17 -1 -14 -15 -6 -14 C-2 -14 0 -11 0 -9 C0 -11 2 -14 6 -14 C14 -15 17 -1 0 11 Z" fill={fill} stroke={INK} strokeWidth={2.4 / s} strokeLinejoin="round" />
)
const Smiley = ({ x, y, s = 1, fill }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <circle r="13" fill={fill} stroke={INK} strokeWidth={2.4 / s} />
    <ellipse cx="-4.5" cy="-3.5" rx="1.8" ry="3" fill={INK} /><ellipse cx="4.5" cy="-3.5" rx="1.8" ry="3" fill={INK} />
    <path d="M-7 3 Q0 11 7 3" fill="none" stroke={INK} strokeWidth="2.2" strokeLinecap="round" />
  </g>
)
export const Spark = ({ x, y, s = 1, delay = '0s', fill = INK }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path className="g-spark" style={{ animationDelay: delay }} d="M0 -9 Q1.5 -1.5 9 0 Q1.5 1.5 0 9 Q-1.5 1.5 -9 0 Q-1.5 -1.5 0 -9 Z" fill={fill} />
  </g>
)

/* ═════════ TOPS ═════════ */
const TEE_D = 'M78 24 L44 32 L10 80 L34 102 L52 88 L52 178 L148 178 L148 88 L166 102 L190 80 L156 32 L122 24 Q100 44 78 24 Z'
export const TEE_PATH = TEE_D

/* Oversized drop-shoulder graphic tee */
export function Tee({ t, plain }) {
  return (
    <g>
      <Cloth d={TEE_D} fill={t.fill} />
      <Fold d="M52 100 Q60 130 54 168" /><Fold d="M148 100 Q140 130 146 168" /><Fold d="M22 84 L40 97" /><Fold d="M178 84 L160 97" />
      <Band d="M80 26 Q100 46 120 26" c={t.b} w={6} />
      {!plain && (
        <>
          <Burst x={100} y={112} r={35} fill={t.a} rot={8} />
          <Txt x={100} y={110} size={23} rot={-7}>SNITCH</Txt>
          <Txt x={100} y={131} size={18} rot={-7} fill={t.c} stroke={INK}>IT!</Txt>
          <Txt x={62} y={170} size={7} anchor="start" fill={t.b}>SNITCHY STYLE</Txt>
        </>
      )}
    </g>
  )
}

/* Boxy cropped baby tee, Y2K */
export function CropTee({ t, plain }) {
  const D = 'M80 36 L50 42 L18 86 L42 108 L58 96 L58 150 L142 150 L142 96 L158 108 L182 86 L150 42 L120 36 Q100 56 80 36 Z'
  return (
    <g transform="translate(0 8)">
      <Cloth d={D} fill={t.fill} />
      <Fold d="M58 104 Q64 126 60 144" /><Fold d="M142 104 Q136 126 140 144" />
      <Band d="M81 38 Q100 58 119 38" c={t.a} w={6} />
      <Band d="M26 80 L48 101" c={t.a} w={4.5} /><Band d="M174 80 L152 101" c={t.a} w={4.5} />
      {!plain && (
        <>
          <Heart x={100} y={92} s={2.1} fill={t.a} rot={-6} />
          <Txt x={100} y={132} size={13} fill={t.b === INK ? INK : t.b} rot={-3}>2ND CHANCE</Txt>
          <Bolt x={72} y={78} s={0.7} fill={t.c} rot={-14} />
        </>
      )}
    </g>
  )
}

/* Boxy camp-collar shirt with a colour-block chest band */
export function Shirt({ t }) {
  const D = 'M76 26 L46 34 L14 76 L38 96 L54 84 L54 152 L146 152 L146 84 L162 96 L186 76 L154 34 L124 26 L100 50 Z'
  return (
    <g>
      <Cloth d={D} fill={t.fill} />
      <Fold d="M54 100 Q60 130 56 146" /><Fold d="M146 100 Q140 130 144 146" />
      <rect x="54" y="94" width="92" height="26" fill={t.a} stroke={INK} strokeWidth="2.6" />
      <path d="M100 50 V94 M100 120 V152" stroke={INK} strokeWidth="2.6" />
      <Txt x={100} y={114} size={17} fill={t.b === INK ? INK : BONE}>NO. 2 ALIKE</Txt>
      <path d="M54 142 H146" stroke={INK} strokeOpacity=".3" strokeWidth="1.6" />
      <path d="M76 26 L92 12 L100 50 Z" {...ol(2.8)} fill={t.b} />
      <path d="M124 26 L108 12 L100 50 Z" {...ol(2.8)} fill={t.b} />
      <Star x={74} y={70} s={0.42} fill={t.a} />
    </g>
  )
}

/* Oversized hoodie */
export function Hoodie({ t }) {
  const D = 'M70 44 L40 54 L12 140 L38 150 L58 100 L58 184 L142 184 L142 100 L162 150 L188 140 L160 54 L130 44 Q100 70 70 44 Z'
  return (
    <g>
      <Cloth d="M62 52 Q54 6 100 6 Q146 6 138 52 Q100 78 62 52 Z" fill={t.fill} />
      <Cloth d={D} fill={t.fill} />
      <path d="M76 46 Q100 70 124 46 Q128 18 100 18 Q72 18 76 46 Z" {...ol(2.8)} fill={t.b} />
      <Fold d="M58 104 Q66 140 60 176" /><Fold d="M142 104 Q134 140 140 176" /><Fold d="M24 132 L42 144" />
      <Band d="M14 137 L40 147" c={t.b} w={7} /><Band d="M186 137 L160 147" c={t.b} w={7} />
      <rect x="58" y="174" width="84" height="10" {...ol(2.6)} fill={t.b} />
      <path d="M93 66 L91 100 M107 66 L109 100" stroke={INK} strokeWidth="5" strokeLinecap="round" />
      <path d="M93 66 L91 100 M107 66 L109 100" stroke={t.c} strokeWidth="2.4" strokeLinecap="round" />
      <rect x="88" y="98" width="7" height="9" rx="2" {...ol(2)} fill={t.a} /><rect x="105" y="98" width="7" height="9" rx="2" {...ol(2)} fill={t.a} />
      <Txt x={100} y={132} size={26} fill={t.a} stroke={INK} sw={4.5} rot={-3}>SNITCHY</Txt>
      <path d="M66 140 L134 140 L142 170 L58 170 Z" {...ol(2.6)} fill={t.fill} />
      <path d="M66 140 L134 140 L142 170 L58 170 Z" fill={`url(#${useContext(Gid)}v)`} />
    </g>
  )
}

/* Zip-up hoodie, colour-blocked sleeves */
export function Zip({ t }) {
  const D = 'M70 44 L40 54 L12 140 L38 150 L58 100 L58 184 L142 184 L142 100 L162 150 L188 140 L160 54 L130 44 Q100 70 70 44 Z'
  return (
    <g>
      <Cloth d="M62 52 Q54 6 100 6 Q146 6 138 52 Q100 78 62 52 Z" fill={t.fill} />
      <Cloth d={D} fill={t.fill} />
      <path d="M76 46 Q100 70 124 46 Q128 18 100 18 Q72 18 76 46 Z" {...ol(2.8)} fill={t.b} />
      <Cloth d="M70 44 L40 54 L12 140 L38 150 L58 100 Z" fill={t.b} />
      <Cloth d="M130 44 L160 54 L188 140 L162 150 L142 100 Z" fill={t.b} />
      <path d="M60 76 L26 138 M140 76 L174 138" stroke={t.a} strokeWidth="4" strokeLinecap="round" />
      <path d="M52 76 L20 136 M148 76 L180 136" stroke={t.c} strokeWidth="2.4" strokeLinecap="round" />
      <rect x="58" y="174" width="84" height="10" {...ol(2.6)} fill={t.b} />
      <path d="M100 66 V184" stroke={INK} strokeWidth="6" />
      <path d="M100 66 V184" stroke={t.c} strokeWidth="2.6" strokeDasharray="2.4 2.4" />
      <rect x="95" y="68" width="10" height="16" rx="3" {...ol(2.2)} fill={t.a} />
      <path d="M92 64 L91 94 M108 64 L109 94" stroke={INK} strokeWidth="4.5" strokeLinecap="round" /><path d="M92 64 L91 94 M108 64 L109 94" stroke={t.c} strokeWidth="2" strokeLinecap="round" />
      <Txt x={78} y={112} size={11} fill={t.a} stroke={INK} sw={3}>SNITCHY</Txt>
      <rect x="64" y="138" width="22" height="22" fill="none" stroke={INK} strokeOpacity=".5" strokeWidth="2" rx="3" />
      <rect x="114" y="138" width="22" height="22" fill="none" stroke={INK} strokeOpacity=".5" strokeWidth="2" rx="3" />
    </g>
  )
}

/* Denim trucker, two-tone */
export function Jacket({ t }) {
  const D = 'M72 26 L42 38 L16 132 L42 142 L60 90 L60 172 L140 172 L140 90 L158 142 L184 132 L158 38 L128 26 L100 54 Z'
  return (
    <g>
      <Cloth d={D} fill={t.fill} />
      <Cloth d="M72 26 L42 38 L16 132 L42 142 L60 90 Z" fill={t.b} />
      <Cloth d="M128 26 L158 38 L184 132 L158 142 L140 90 Z" fill={t.b} />
      <Fold d="M60 100 Q64 136 62 168" /><Fold d="M140 100 Q136 136 138 168" />
      <path d="M66 84 H92 V112 H66 Z" {...ol(2.2)} fill="none" /><path d="M108 84 H134 V112 H108 Z" {...ol(2.2)} fill="none" />
      <path d="M66 84 H92 V95 H66 Z" {...ol(2.2)} fill={t.a} /><path d="M108 84 H134 V95 H108 Z" {...ol(2.2)} fill={t.a} />
      <path d="M100 54 V172" stroke={INK} strokeWidth="2.6" />
      <rect x="60" y="160" width="80" height="12" {...ol(2.6)} fill={t.b} />
      <Burst x={78} y={138} r={12} fill={t.a} rot={6} />
      <Txt x={78} y={142} size={11}>S</Txt>
      <path d="M72 26 L88 12 L100 54 Z" {...ol(2.8)} fill={t.b} /><path d="M128 26 L112 12 L100 54 Z" {...ol(2.8)} fill={t.b} />
      <path d="M26 98 L36 102 M174 98 L164 102" stroke={t.a} strokeWidth="4" strokeLinecap="round" />
    </g>
  )
}

/* Bomber with rib trims */
export function Bomber({ t }) {
  const D = 'M74 30 L46 40 L18 128 L44 136 L60 92 L60 164 L140 164 L140 92 L156 136 L182 128 L154 40 L126 30 Q100 42 74 30 Z'
  return (
    <g>
      <Cloth d={D} fill={t.fill} />
      <Fold d="M60 100 Q66 130 62 158" /><Fold d="M140 100 Q134 130 138 158" /><Fold d="M30 112 L46 120" />
      <rect x="60" y="98" width="80" height="14" fill={t.a} stroke={INK} strokeWidth="2.4" />
      <Txt x={100} y={110} size={13} fill={INK}>NEW DRIP</Txt>
      <path d="M100 42 V164" stroke={INK} strokeWidth="2.6" />
      <rect x="95" y="46" width="10" height="14" rx="3" {...ol(2.2)} fill={t.c} />
      <rect x="60" y="154" width="80" height="18" {...ol(2.6)} fill={t.b} />
      <path d="M72 156 V170 M82 156 V170 M92 156 V170 M108 156 V170 M118 156 V170 M128 156 V170" stroke={BONE} strokeOpacity=".35" strokeWidth="1.6" />
      <Band d="M20 126 L44 134" c={t.b} w={9} /><Band d="M180 126 L156 134" c={t.b} w={9} />
      <path d="M70 26 Q100 44 130 26 L130 42 Q100 58 70 42 Z" {...ol(2.8)} fill={t.b} />
      <Txt x={168} y={92} size={11} rot={80} fill={t.a} stroke={INK} sw={3}>SNITCH</Txt>
      <Bolt x={78} y={136} s={0.8} fill={t.a} rot={-10} />
    </g>
  )
}

/* ═════════ BOTTOMS ═════════ */
function Waist({ t }) {
  return (
    <>
      <rect x="54" y="12" width="92" height="16" {...ol(2.8)} fill={t.b} />
      {[66, 100, 132].map((x) => <rect key={x} x={x - 3} y="9" width="6" height="22" rx="1.5" {...ol(2)} fill={t.b} />)}
    </>
  )
}

/* Baggy jeans with stacked hem */
export function Jeans({ t }) {
  const D = 'M54 14 L146 14 L150 40 L176 186 L108 186 L100 84 L92 186 L24 186 L50 40 Z'
  return (
    <g>
      <Cloth d={D} fill={t.fill} />
      <path d="M58 44 L32 186 L24 186 L50 40 Z" {...ol(2.2)} fill={t.a} />
      <path d="M142 44 L168 186 L176 186 L150 40 Z" {...ol(2.2)} fill={t.a} />
      <Waist t={t} />
      <path d="M100 28 V84" stroke={INK} strokeWidth="2.4" />
      <path d="M62 34 Q64 60 86 52" {...ol(2.2)} /><path d="M138 34 Q136 60 114 52" {...ol(2.2)} />
      <Fold d="M62 100 Q72 130 66 170" /><Fold d="M138 100 Q128 130 134 170" />
      <Burst x={70} y={112} r={13} fill={t.c} rot={10} />
      <Txt x={70} y={116} size={11}>S</Txt>
      <path d="M26 176 Q58 184 92 176 M108 176 Q142 184 174 176" fill="none" stroke={INK} strokeOpacity=".3" strokeWidth="2" strokeLinecap="round" />
    </g>
  )
}

/* Cargo pants */
export function Cargo({ t }) {
  const D = 'M54 14 L146 14 L152 44 L170 186 L112 186 L100 80 L88 186 L30 186 L48 44 Z'
  return (
    <g>
      <Cloth d={D} fill={t.fill} />
      <Waist t={t} />
      <path d="M100 28 V80" stroke={INK} strokeWidth="2.4" />
      <Fold d="M70 60 Q74 120 66 176" /><Fold d="M130 60 Q126 120 134 176" />
      {[
        'M44 100 L72 100 L70 136 L40 136 Z',
        'M156 100 L128 100 L130 136 L160 136 Z',
      ].map((d) => <path key={d} d={d} {...ol(2.4)} fill={t.fill} />)}
      <path d="M44 100 L72 100 L72 112 L43 112 Z" {...ol(2.4)} fill={t.b} /><path d="M156 100 L128 100 L128 112 L157 112 Z" {...ol(2.4)} fill={t.b} />
      <rect x="55" y="108" width="6" height="9" rx="1.5" {...ol(1.8)} fill={t.a} /><rect x="139" y="108" width="6" height="9" rx="1.5" {...ol(1.8)} fill={t.a} />
      <Band d="M62 30 Q50 44 52 70" c={t.a} w={4} />
      <rect x="36" y="168" width="16" height="7" rx="2" {...ol(1.8)} fill={t.a} transform="rotate(-6 44 171)" /><rect x="148" y="168" width="16" height="7" rx="2" {...ol(1.8)} fill={t.a} transform="rotate(6 156 171)" />
      <Txt x={78} y={160} size={9} fill={t.b === INK ? INK : BONE}>SNITCHY</Txt>
    </g>
  )
}

/* Wide-leg trousers with side stripes */
export function Wide({ t }) {
  const D = 'M56 14 L144 14 L148 40 L182 186 L108 186 L100 70 L92 186 L18 186 L52 40 Z'
  return (
    <g>
      <Cloth d={D} fill={t.fill} />
      <path d="M58 44 L28 186 L18 186 L52 40 Z" {...ol(2.2)} fill={t.a} /><path d="M142 44 L172 186 L182 186 L148 40 Z" {...ol(2.2)} fill={t.a} />
      <path d="M62 46 L34 186" stroke={t.c} strokeWidth="2.2" strokeLinecap="round" /><path d="M138 46 L166 186" stroke={t.c} strokeWidth="2.2" strokeLinecap="round" />
      <rect x="56" y="12" width="88" height="16" {...ol(2.8)} fill={t.b} />
      <path d="M100 28 V70" stroke={INK} strokeWidth="2.4" />
      <path d="M76 30 L70 100 M124 30 L130 100" {...ol(2)} strokeOpacity=".4" />
      <Fold d="M74 70 Q64 130 58 178" /><Fold d="M126 70 Q136 130 142 178" />
      <Txt x={78} y={50} size={9} fill={t.b === INK ? INK : BONE}>SNITCHY</Txt>
      <path d="M22 178 Q56 186 92 178 M108 178 Q144 186 178 178" fill="none" stroke={INK} strokeOpacity=".3" strokeWidth="2" strokeLinecap="round" />
    </g>
  )
}

/* ═════════ BAGS ═════════ */
export function Tote({ t }) {
  return (
    <g>
      <Band d="M70 82 C62 16 138 16 130 82" c={t.b} w={7} />
      <Cloth d="M38 78 L162 78 L172 186 L28 186 Z" fill={t.fill} />
      <rect x="38" y="78" width="124" height="12" {...ol(2.6)} fill={t.b} />
      <Fold d="M44 96 Q48 140 40 180" /><Fold d="M156 96 Q152 140 160 180" />
      <Burst x={100} y={134} r={36} fill={t.a} rot={4} />
      <Txt x={100} y={134} size={27} rot={-5}>SNITCH</Txt>
      <Txt x={100} y={156} size={18} rot={-5} fill={t.c} stroke={INK}>IT!</Txt>
    </g>
  )
}

export function Sling({ t }) {
  return (
    <g>
      <Band d="M62 76 Q32 46 52 18" c={t.b === INK ? '#3b3b44' : t.b} w={8} /><Band d="M138 76 Q168 46 148 18" c={t.b === INK ? '#3b3b44' : t.b} w={8} />
      <Cloth d="M44 100 Q44 72 72 72 L128 72 Q156 72 156 100 L156 128 Q156 156 128 156 L72 156 Q44 156 44 128 Z" fill={t.fill} />
      <path d="M52 98 Q100 84 148 98" {...ol(2.4)} />
      <path d="M52 98 Q100 84 148 98" fill="none" stroke={t.c} strokeWidth="1.6" strokeDasharray="2.4 2.4" />
      <rect x="140" y="92" width="10" height="20" rx="3" {...ol(2.2)} fill={t.a} transform="rotate(12 145 102)" />
      <rect x="54" y="62" width="16" height="12" rx="2" {...ol(2.2)} fill={t.a} /><rect x="130" y="62" width="16" height="12" rx="2" {...ol(2.2)} fill={t.a} />
      <Txt x={100} y={138} size={19} fill={t.a} stroke={INK} sw={4}>SNITCHY</Txt>
      <Bolt x={64} y={118} s={0.8} fill={t.c} rot={-12} />
    </g>
  )
}

export function Shoulder({ t }) {
  return (
    <g>
      <Band d="M50 80 Q100 -2 150 80" c={t.b === INK ? '#3b3b44' : t.b} w={7} />
      <Cloth d="M28 96 Q28 76 48 76 L152 76 Q172 76 172 96 L170 142 Q170 158 152 158 L48 158 Q30 158 30 142 Z" fill={t.fill} />
      <path d="M28 96 Q28 76 48 76 L152 76 Q172 76 172 96 L170 112 Q100 132 30 112 Z" {...ol(2.6)} fill={t.b} />
      <circle cx="100" cy="122" r="9" {...ol(2.4)} fill={t.a} />
      <Star x={100} y={122} s={0.36} fill={INK} />
      <Txt x={100} y={150} size={14} fill={t.a} stroke={INK} sw={3.4}>SNITCH IT</Txt>
      <Fold d="M40 120 Q38 140 44 152" />
    </g>
  )
}

/* ═════════ HEADWEAR ═════════ */
export function Cap({ t }) {
  return (
    <g>
      <Cloth d="M44 106 Q40 34 100 34 Q160 34 156 106 Z" fill={t.fill} />
      <path d="M100 34 V106 M72 40 Q68 78 60 106 M128 40 Q132 78 140 106" fill="none" stroke={INK} strokeOpacity=".35" strokeWidth="1.8" />
      <circle cx="100" cy="34" r="5" {...ol(2.2)} fill={t.b} />
      <Cloth d="M34 108 Q100 92 166 108 Q176 136 100 142 Q24 136 34 108 Z" fill={t.b} />
      <path d="M34 108 Q100 92 166 108" fill="none" stroke={t.a} strokeWidth="3.5" strokeLinecap="round" />
      <Txt x={100} y={80} size={20} fill={t.a} stroke={INK} sw={4.5}>SNITCH</Txt>
      <circle cx="70" cy="62" r="2.4" fill={INK} /><circle cx="130" cy="62" r="2.4" fill={INK} />
    </g>
  )
}

export function Bucket({ t }) {
  return (
    <g>
      <Cloth d="M58 108 L66 54 Q100 40 134 54 L142 108 Z" fill={t.fill} />
      <path d="M62 80 L138 80 L140 94 L60 94 Z" {...ol(2.4)} fill={t.a} />
      <Txt x={100} y={91} size={11} fill={INK}>SNITCHY STYLE</Txt>
      <circle cx="72" cy="72" r="2.6" fill={INK} /><circle cx="128" cy="72" r="2.6" fill={INK} />
      <Cloth d="M16 110 Q100 90 184 110 Q178 146 100 150 Q22 146 16 110 Z" fill={t.b} />
      <path d="M16 110 Q100 90 184 110" fill="none" stroke={t.c} strokeWidth="3" strokeLinecap="round" />
      <Fold d="M40 128 Q100 142 160 128" />
    </g>
  )
}

export function Beanie({ t }) {
  return (
    <g>
      <Cloth d="M42 116 Q40 30 100 30 Q160 30 158 116 Z" fill={t.fill} />
      <Cloth d="M36 108 L164 108 L162 148 Q100 158 38 148 Z" fill={t.b} />
      <path d="M52 112 V150 M66 112 V153 M80 112 V155 M94 112 V156 M108 112 V156 M122 112 V155 M136 112 V153 M150 112 V150" stroke={BONE} strokeOpacity=".28" strokeWidth="2" />
      <rect x="82" y="116" width="36" height="22" rx="3" {...ol(2.4)} fill={t.a} />
      <Txt x={100} y={133} size={12} fill={INK}>SNITCHY</Txt>
      <Fold d="M64 50 Q60 80 62 100" /><Fold d="M136 50 Q140 80 138 100" />
    </g>
  )
}

/* ═════════ ACCESSORIES ═════════ */
export function Bandana({ t }) {
  return (
    <g>
      <path d="M24 100 L6 86 L10 116 Z" {...ol(2.6)} fill={t.b} /><path d="M176 100 L194 86 L190 116 Z" {...ol(2.6)} fill={t.b} />
      <Cloth d="M100 22 L178 100 L100 178 L22 100 Z" fill={t.fill} />
      <path d="M100 38 L162 100 L100 162 L38 100 Z" fill="none" stroke={t.b} strokeWidth="4" strokeLinejoin="round" />
      <path d="M100 48 L152 100 L100 152 L48 100 Z" fill="none" stroke={t.a} strokeWidth="2" strokeDasharray="1 7" strokeLinecap="round" />
      <Burst x={100} y={100} r={26} fill={t.a} rot={5} />
      <Txt x={100} y={108} size={20} rot={-4}>SNITCH</Txt>
      <Star x={100} y={56} s={0.42} fill={t.c} /><Star x={100} y={144} s={0.42} fill={t.c} />
      <Star x={56} y={100} s={0.34} fill={t.c} /><Star x={144} y={100} s={0.34} fill={t.c} />
    </g>
  )
}

export function Wallet({ t }) {
  return (
    <g>
      <path d="M154 76 Q192 46 176 8" fill="none" stroke={INK} strokeWidth="6" strokeDasharray="7 4" strokeLinecap="round" />
      <path d="M154 76 Q192 46 176 8" fill="none" stroke={BONE} strokeWidth="2.4" strokeDasharray="7 4" strokeLinecap="round" />
      <g transform="rotate(-7 100 70)"><rect x="62" y="40" width="64" height="40" rx="5" {...ol(2.6)} fill={t.c} /><rect x="62" y="48" width="64" height="9" fill={INK} /></g>
      <Cloth d="M34 70 Q34 60 46 60 L154 60 Q166 60 166 70 L166 140 Q166 152 154 152 L46 152 Q34 152 34 140 Z" fill={t.fill} />
      <path d="M100 60 V152" stroke={INK} strokeOpacity=".4" strokeWidth="2" />
      <rect x="132" y="96" width="34" height="24" rx="4" {...ol(2.4)} fill={t.b} />
      <circle cx="149" cy="108" r="4" {...ol(1.8)} fill={t.a} />
      <Txt x={68} y={112} size={17} fill={t.a} stroke={INK} sw={4}>SNITCH</Txt>
    </g>
  )
}

export function Pouch({ t }) {
  return (
    <g>
      <path d="M154 70 Q186 36 168 14" fill="none" stroke={INK} strokeWidth="6" strokeLinecap="round" />
      <path d="M154 70 Q186 36 168 14" fill="none" stroke={t.a} strokeWidth="3" strokeLinecap="round" />
      <Cloth d="M30 84 Q30 68 46 68 L154 68 Q170 68 170 84 L176 140 Q176 158 158 158 L42 158 Q24 158 24 140 Z" fill={t.fill} />
      <path d="M36 82 H164" stroke={INK} strokeWidth="6" strokeLinecap="round" />
      <path d="M36 82 H164" stroke={BONE} strokeWidth="2.6" strokeDasharray="2.4 2.4" />
      <rect x="146" y="72" width="16" height="20" rx="4" {...ol(2.4)} fill={t.a} />
      <Smiley x={74} y={122} s={1.9} fill={t.a} />
      <Txt x={130} y={128} size={15} fill={t.b === INK ? INK : BONE}>SMILE</Txt>
      <Txt x={130} y={144} size={9} fill={t.b === INK ? INK : BONE}>IT'S SECOND-HAND</Txt>
    </g>
  )
}

/* ═════════ FULL LOOK ═════════ */
function Look({ t }) {
  const parts = [
    { x: 46, y: 4, s: 0.62, d: '0s', el: <Hoodie t={TONES.volt} /> },
    { x: 52, y: 90, s: 0.56, d: '-1.6s', el: <Cargo t={TONES.sage} /> },
    { x: -4, y: 6, s: 0.42, d: '-3.1s', el: <Cap t={TONES.acid} /> },
    { x: 118, y: 108, s: 0.42, d: '-2.2s', el: <Tote t={TONES.bone} /> },
  ]
  return (
    <g>
      {parts.map((p, i) => (
        <g key={i} transform={`translate(${p.x} ${p.y}) scale(${p.s})`}>
          <g className="g-float" style={{ animationDelay: p.d }}>{p.el}</g>
        </g>
      ))}
    </g>
  )
}

export const PIECES = {
  tee: Tee, croptee: CropTee, shirt: Shirt, hoodie: Hoodie, zip: Zip, jacket: Jacket, bomber: Bomber,
  jeans: Jeans, cargo: Cargo, wide: Wide, tote: Tote, sling: Sling, shoulder: Shoulder,
  cap: Cap, bucket: Bucket, beanie: Beanie, bandana: Bandana, wallet: Wallet, pouch: Pouch, look: Look,
}

/* ═════════ backdrops + shading ═════════ */
const RAYS = Array.from({ length: 14 }, (_, i) => {
  const a1 = (i * 2 * Math.PI) / 14
  const a2 = a1 + Math.PI / 14
  const p = (a) => `${(100 + Math.cos(a) * 170).toFixed(0)},${(104 + Math.sin(a) * 170).toFixed(0)}`
  return `100,104 ${p(a1)} ${p(a2)}`
})

export function Backdrop({ t, uid }) {
  const dark = !!t.dark
  const ln = dark ? BONE : INK
  return (
    <>
      {t.kind === 'dots' && (
        <>
          <defs><pattern id={`${uid}d`} width="10" height="10" patternUnits="userSpaceOnUse"><circle cx="5" cy="5" r="1.8" fill={ln} opacity=".2" /></pattern></defs>
          <rect width="200" height="200" fill={`url(#${uid}d)`} />
        </>
      )}
      {t.kind === 'burst' && <g fill={dark ? BONE : '#fff'} opacity={dark ? 0.08 : 0.3}>{RAYS.map((p) => <polygon key={p} points={p} />)}</g>}
      {t.kind === 'grid' && (
        <g stroke={ln} strokeOpacity=".22" strokeWidth="1.2" fill="none">
          {[126, 134, 146, 162, 186].map((y) => <path key={y} d={`M0 ${y} H200`} />)}
          {[-60, -20, 20, 60, 100, 140, 180, 220, 260].map((x) => <path key={x} d={`M100 118 L${x} 200`} />)}
        </g>
      )}
      {t.kind === 'blob' && <path d="M26 66 Q44 10 108 18 T182 72 Q198 130 152 172 T48 164 Q8 124 26 66 Z" fill="#fff" opacity={dark ? 0.08 : 0.38} />}
      <circle cx="100" cy="104" r="74" fill={dark ? 'rgba(255,255,255,.06)' : 'rgba(255,255,255,.32)'} />
      <circle cx="100" cy="104" r="74" fill="none" stroke={ln} strokeOpacity=".2" strokeWidth="1.5" strokeDasharray="2 6" />
      <g fill="none" stroke={ln} strokeWidth="2.4" strokeLinecap="round" opacity=".75">
        <path d="M16 178 q6 -9 12 0 t12 0 t12 0 t12 0" />
        <path d="M172 170 v12 M166 176 h12" />
        <circle cx="26" cy="30" r="6.5" />
      </g>
    </>
  )
}

export function Defs({ uid }) {
  return (
    <defs>
      <linearGradient id={`${uid}h`} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#000" stopOpacity=".22" />
        <stop offset=".24" stopColor="#000" stopOpacity="0" />
        <stop offset=".58" stopColor="#fff" stopOpacity=".14" />
        <stop offset="1" stopColor="#000" stopOpacity=".24" />
      </linearGradient>
      <linearGradient id={`${uid}v`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#fff" stopOpacity=".12" />
        <stop offset=".55" stopColor="#000" stopOpacity="0" />
        <stop offset="1" stopColor="#000" stopOpacity=".2" />
      </linearGradient>
    </defs>
  )
}

export function SparkLayer({ t, delay = '0s' }) {
  const c = t.dark ? BONE : INK
  return (
    <>
      <Spark x={166} y={34} s={1.1} delay={delay} fill={c} />
      <Spark x={32} y={62} s={0.7} delay="-1.4s" fill={c} />
      <Spark x={172} y={150} s={0.55} delay="-2.6s" fill={c} />
    </>
  )
}
