import { useId } from 'react'

/* ─────────────────────────────────────────────────────────────
   Vector clothing illustrations (pure SVG + CSS animation).
   Each garment is drawn in a 200×200 box. Colours come from a tone.
   ───────────────────────────────────────────────────────────── */

export const INK = '#151515'
export const BONE = '#efe9dd'

export const TONES = {
  denim: { fill: '#5d7389', a: '#8aa0b5', b: '#46596b', stitch: BONE, bg: '#e4ddcf' },
  bone: { fill: '#efe9dd', a: '#d9532b', b: INK, stitch: INK, bg: '#cdd5c3' },
  sage: { fill: '#8fa183', a: '#cbd4c0', b: '#5f7054', stitch: INK, bg: '#ece5d6' },
  sand: { fill: '#d8cdb8', a: '#d9532b', b: INK, stitch: INK, bg: '#cdd6dc' },
  rust: { fill: '#d9532b', a: BONE, b: INK, stitch: BONE, bg: '#e9e1d1' },
  ink: { fill: '#242424', a: '#d9532b', b: '#8fa183', stitch: BONE, bg: '#ddd6c7' },
}

const S = { stroke: INK, strokeWidth: 3, strokeLinejoin: 'round', strokeLinecap: 'round' }
const dash = (t) => ({ fill: 'none', stroke: t.stitch, strokeWidth: 1.6, strokeDasharray: '3 3', strokeLinecap: 'round' })

export const Star = ({ x, y, s = 1, fill }) => (
  <path transform={`translate(${x} ${y}) scale(${s})`} d="M0 -18 L7 -7 L18 0 L7 7 L0 18 L-7 7 L-18 0 L-7 -7 Z" fill={fill} stroke={INK} strokeWidth={2.4 / s} strokeLinejoin="round" />
)

export const TEE_PATH = 'M78 26 L50 36 L20 72 L44 94 L62 78 L62 184 L138 184 L138 78 L156 94 L180 72 L150 36 L122 26 Q100 48 78 26 Z'
export const JACKET_PATH = 'M72 28 L44 40 L18 134 L42 142 L62 88 L62 188 L138 188 L138 88 L158 142 L182 134 L156 40 L128 28 L100 56 Z'

export function Tee({ t }) {
  return (
    <g>
      <path d={TEE_PATH} fill={t.fill} {...S} />
      <path d="M80 28 Q100 52 120 28" fill="none" stroke={INK} strokeWidth="5" strokeLinecap="round" />
      <Star x={100} y={112} s={1.1} fill={t.a} />
      <rect x="72" y="148" width="28" height="22" fill={t.b} {...S} strokeWidth="2.4" />
      <rect x="75" y="151" width="22" height="16" {...dash({ stitch: t.b === INK ? BONE : INK })} />
      <path d="M62 176 L138 176" {...dash(t)} />
    </g>
  )
}

export function Shirt({ t }) {
  return (
    <g>
      <path d="M78 26 L50 36 L20 72 L44 94 L62 78 L62 160 L138 160 L138 78 L156 94 L180 72 L150 36 L122 26 L100 54 Z" fill={t.fill} {...S} />
      <path d="M78 26 L91 16 L100 54 Z" fill={t.b} {...S} strokeWidth="2.6" />
      <path d="M122 26 L109 16 L100 54 Z" fill={t.b} {...S} strokeWidth="2.6" />
      <path d="M100 54 L100 160" stroke={INK} strokeWidth="2.4" />
      {[72, 96, 120, 144].map((y) => <circle key={y} cx="100" cy={y} r="3.4" fill={t.stitch} stroke={INK} strokeWidth="1.6" />)}
      <rect x="110" y="78" width="20" height="20" fill="none" stroke={INK} strokeWidth="2.4" />
      <rect x="113" y="81" width="14" height="14" {...dash(t)} />
      <path d="M62 152 L138 152" {...dash(t)} />
    </g>
  )
}

export function Hoodie({ t }) {
  return (
    <g>
      <path d="M68 38 Q64 2 100 2 Q136 2 132 38 Z" fill={t.fill} {...S} />
      <path d="M70 38 L44 48 L20 130 L44 138 L62 88 L62 186 L138 186 L138 88 L156 138 L180 130 L156 48 L130 38 Q100 64 70 38 Z" fill={t.fill} {...S} />
      <path d="M77 38 Q100 64 123 38 Q123 14 100 14 Q77 14 77 38 Z" fill={t.b} {...S} strokeWidth="2.6" />
      <path d="M92 58 L90 94 M108 58 L110 94" stroke={t.a} strokeWidth="3" strokeLinecap="round" />
      <circle cx="90" cy="97" r="3.2" fill={t.a} stroke={INK} strokeWidth="1.6" />
      <circle cx="110" cy="97" r="3.2" fill={t.a} stroke={INK} strokeWidth="1.6" />
      <path d="M70 130 L130 130 L138 162 L62 162 Z" fill={t.fill} {...S} strokeWidth="2.6" />
      <path d="M74 136 L126 136" {...dash(t)} />
      <rect x="68" y="104" width="18" height="14" fill={t.a} {...S} strokeWidth="2" transform="rotate(-6 77 111)" />
      <path d="M62 178 L138 178" {...dash(t)} />
    </g>
  )
}

export function Jacket({ t, patchwork = false }) {
  const uid = 'jk' + useId().replace(/:/g, '')
  const base = patchwork ? t.fill : t.fill
  return (
    <g>
      <clipPath id={uid}><path d={JACKET_PATH} /></clipPath>
      <path d={JACKET_PATH} fill={base} />
      <g clipPath={`url(#${uid})`}>
        {patchwork && (
          <>
            <rect x="62" y="54" width="40" height="52" fill={t.a} />
            <rect x="100" y="58" width="40" height="38" fill={t.b} />
            <rect x="62" y="106" width="30" height="44" fill={t.b} />
            <rect x="98" y="96" width="42" height="54" fill={t.a} />
            <rect x="12" y="90" width="34" height="34" fill={t.a} transform="rotate(-16 29 107)" />
            <rect x="150" y="96" width="34" height="34" fill={t.b} transform="rotate(16 167 113)" />
            <rect x="62" y="150" width="76" height="40" fill={t.fill} />
            <g {...dash(t)}>
              <path d="M62 54 H140 M62 106 H140 M100 54 V150 M62 150 H140" />
              <path d="M16 106 L42 118 M158 112 L184 100" />
            </g>
          </>
        )}
      </g>
      <path d={JACKET_PATH} fill="none" {...S} />
      <path d="M72 28 L85 15 L100 56 Z" fill={t.b} {...S} strokeWidth="2.6" />
      <path d="M128 28 L115 15 L100 56 Z" fill={t.b} {...S} strokeWidth="2.6" />
      <path d="M100 56 L100 188" stroke={INK} strokeWidth="2.6" />
      <rect x="96" y="60" width="8" height="12" rx="2" fill={BONE} stroke={INK} strokeWidth="2" />
      <rect x="66" y="156" width="24" height="20" fill="none" stroke={INK} strokeWidth="2.4" />
      <rect x="110" y="156" width="24" height="20" fill="none" stroke={INK} strokeWidth="2.4" />
      <path d="M62 182 L138 182" {...dash(t)} />
    </g>
  )
}

export function Jeans({ t }) {
  return (
    <g>
      <path d="M58 18 L142 18 L168 188 L108 188 L100 78 L92 188 L32 188 Z" fill={t.fill} {...S} />
      <rect x="58" y="18" width="84" height="14" fill={t.b} {...S} strokeWidth="2.6" />
      {[70, 97, 125].map((x) => <rect key={x} x={x} y="14" width="6" height="22" rx="1" fill={t.b} stroke={INK} strokeWidth="2" />)}
      <path d="M100 32 L100 72" stroke={INK} strokeWidth="2.4" />
      <path d="M62 38 Q64 60 86 52" fill="none" stroke={INK} strokeWidth="2.2" />
      <path d="M138 38 Q136 60 114 52" fill="none" stroke={INK} strokeWidth="2.2" />
      <rect x="48" y="108" width="26" height="22" fill={t.a} {...S} strokeWidth="2.2" transform="rotate(-6 61 119)" />
      <rect x="52" y="112" width="18" height="14" {...dash({ stitch: INK })} transform="rotate(-6 61 119)" />
      <rect x="128" y="132" width="24" height="20" fill={t.a} {...S} strokeWidth="2.2" transform="rotate(5 140 142)" />
      <path d="M66 44 L42 182 M134 44 L158 182" {...dash(t)} />
      <path d="M36 176 L90 176 M110 176 L164 176" {...dash(t)} />
    </g>
  )
}

export function Tote({ t }) {
  return (
    <g>
      <path d="M72 86 C66 20 134 20 128 86" fill="none" stroke={INK} strokeWidth="9" strokeLinecap="round" />
      <path d="M72 86 C66 20 134 20 128 86" fill="none" stroke={t.b === INK ? '#3a3a3a' : t.b} strokeWidth="4" strokeLinecap="round" />
      <path d="M42 80 L158 80 L168 188 L32 188 Z" fill={t.fill} {...S} />
      <path d="M45 98 L155 98" {...dash(t)} />
      <rect x="58" y="120" width="46" height="42" fill={t.a} {...S} strokeWidth="2.4" />
      <rect x="62" y="124" width="38" height="34" {...dash({ stitch: t.a === BONE ? INK : INK })} />
      <Star x={134} y={132} s={1.15} fill={t.a} />
      <path d="M118 150 Q134 166 150 150" fill="none" stroke={t.stitch} strokeWidth="1.8" strokeDasharray="3 3" strokeLinecap="round" />
    </g>
  )
}

function Look({ t }) {
  const pieces = [
    { x: 36, y: 0, s: 0.62, d: '0s', el: <Jacket t={TONES.denim} patchwork /> },
    { x: 0, y: 94, s: 0.52, d: '-1.6s', el: <Tee t={TONES.bone} /> },
    { x: 100, y: 92, s: 0.52, d: '-3.1s', el: <Jeans t={TONES.sage} /> },
  ]
  return (
    <g>
      {pieces.map((p, i) => (
        <g key={i} transform={`translate(${p.x} ${p.y}) scale(${p.s})`}>
          <g className="g-float" style={{ animationDelay: p.d }}>{p.el}</g>
        </g>
      ))}
    </g>
  )
}

const MAP = { tee: Tee, shirt: Shirt, hoodie: Hoodie, jacket: Jacket, jeans: Jeans, tote: Tote, look: Look }

export const Spark = ({ x, y, s = 1, delay = '0s' }) => (
  // The outer <g> positions it; the inner path animates (CSS transforms would override a transform attribute).
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path className="g-spark" style={{ animationDelay: delay }} d="M0 -9 Q1.5 -1.5 9 0 Q1.5 1.5 0 9 Q-1.5 1.5 -9 0 Q-1.5 -1.5 0 -9 Z" fill={INK} />
  </g>
)

/**
 * Animated clothing illustration.
 * type: tee | shirt | hoodie | jacket | jeans | tote | look
 * still: render without motion (cart thumbnails, etc.)
 */
export function GarmentArt({ type = 'tee', tone = 'bone', still = false, label, delay = '0s', className = '' }) {
  const t = TONES[tone] || TONES.bone
  const Piece = MAP[type] || Tee
  const floating = type !== 'look'
  return (
    <div className={`gart ${still ? 'still' : ''} ${className}`} style={{ background: t.bg }} role="img" aria-label={label || `${type} illustration`}>
      <svg viewBox="0 0 200 200" aria-hidden="true" focusable="false">
        <circle cx="100" cy="104" r="78" fill="rgba(255,255,255,.35)" />
        <circle cx="100" cy="104" r="78" fill="none" stroke={INK} strokeOpacity=".14" strokeWidth="1.5" strokeDasharray="2 6" />
        <ellipse className="g-shadow" cx="100" cy="194" rx="52" ry="5" fill={INK} opacity=".16" style={{ animationDelay: delay }} />
        {floating ? (
          <g className="g-float" style={{ animationDelay: delay }}>
            <Piece t={t} patchwork={type === 'jacket'} />
          </g>
        ) : (
          <Piece t={t} />
        )}
        <Spark x={164} y={34} s={1.1} delay={delay} />
        <Spark x={34} y={58} s={0.7} delay="-1.4s" />
      </svg>
    </div>
  )
}
