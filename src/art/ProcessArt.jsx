import { useId } from 'react'
import { INK, BONE, TONES, Backdrop, Defs, Gid, PIECES, Burst, Spark } from './pieces.jsx'

/* Animated graphics for the Custom Re-make journey. SVG + CSS only.
   The finished pieces are always modern streetwear, never repaired or patched clothing. */

const S = { stroke: INK, strokeWidth: 3, strokeLinejoin: 'round', strokeLinecap: 'round' }
const FONT = "Anton, Impact, 'Arial Black', sans-serif"

function Frame({ t, label, children, className = '' }) {
  const uid = 'f' + useId().replace(/:/g, '')
  return (
    <div className={`gart process ${className}`} style={{ background: t.bg }} role="img" aria-label={label}>
      <svg viewBox="0 0 200 200" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
        <Defs uid={uid} />
        <Backdrop t={t} uid={uid} />
        <Gid.Provider value={uid}>{children}</Gid.Provider>
      </svg>
    </div>
  )
}

const Piece = ({ type, tone, x, y, s, plain, cls = '', style }) => {
  const P = PIECES[type]
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <g className={cls} style={style}><P t={TONES[tone]} plain={plain} /></g>
    </g>
  )
}

/* 1 — an old, faded tee drops into a parcel */
function SceneSend() {
  return (
    <>
      <ellipse cx="100" cy="188" rx="58" ry="5" fill={INK} opacity=".14" />
      <path d="M50 112 L36 88 L84 88 L100 112 Z" fill="#d8b98a" {...S} strokeWidth="2.6" />
      <path d="M150 112 L164 88 L116 88 L100 112 Z" fill="#c9a771" {...S} strokeWidth="2.6" />
      <Piece type="tee" tone="faded" plain x={54} y={2} s={0.46} cls="p-drop" />
      <rect x="50" y="112" width="100" height="68" fill="#e2c496" {...S} />
      <rect x="86" y="112" width="28" height="68" fill={BONE} opacity=".8" stroke={INK} strokeWidth="2" />
      <rect x="56" y="130" width="24" height="24" fill="#d6ff3f" stroke={INK} strokeWidth="2.4" transform="rotate(-6 68 142)" />
      <text x="68" y="148" textAnchor="middle" fontSize="12" fill={INK} style={{ fontFamily: FONT }} transform="rotate(-6 68 142)">SNITCH</text>
      <path className="p-arrow" d="M100 66 V92 M92 84 L100 94 L108 84" fill="none" stroke="#ff4f1f" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      <Spark x={162} y={50} delay="-.6s" />
    </>
  )
}

/* 2 — a reference photo is scanned */
function SceneUpload() {
  return (
    <>
      <rect x="48" y="22" width="104" height="134" rx="6" fill={BONE} {...S} />
      <rect x="56" y="30" width="88" height="94" fill="#ffd3ea" stroke={INK} strokeWidth="2" />
      <Piece type="zip" tone="volt" x={66} y={36} s={0.4} cls="g-float" />
      <rect className="p-scan" x="56" y="30" width="88" height="4" fill="#ff4f1f" opacity=".9" />
      <path d="M56 46 V30 H72 M128 30 H144 V46 M144 108 V124 H128 M72 124 H56 V108" fill="none" stroke={INK} strokeWidth="3" strokeLinecap="round" />
      <path d="M58 138 H112 M58 147 H90" stroke={INK} strokeWidth="2.4" strokeLinecap="round" />
      <g className="p-bob">
        <circle cx="146" cy="152" r="20" fill="#ff4f1f" {...S} />
        <path d="M146 162 V142 M137 150 L146 141 L155 150" fill="none" stroke={BONE} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </>
  )
}

/* 3 — the print goes on: spray + reveal */
function SceneTransform() {
  return (
    <>
      <ellipse cx="100" cy="190" rx="54" ry="5" fill={INK} opacity=".14" className="g-shadow" />
      <Piece type="tee" tone="bone" plain x={30} y={20} s={0.72} />
      <g transform="translate(30 20) scale(.72)" className="p-print">
        <Burst x={100} y={112} r={35} fill="#ff4f1f" rot={8} />
        <text x="100" y="110" textAnchor="middle" fontSize="23" transform="rotate(-7 100 110)" fill={INK} style={{ fontFamily: FONT }}>SNITCH</text>
        <text x="100" y="131" textAnchor="middle" fontSize="18" transform="rotate(-7 100 131)" fill="#2f4bff" stroke={INK} strokeWidth="3" paintOrder="stroke" style={{ fontFamily: FONT }}>IT!</text>
      </g>
      <g className="p-mist" fill="#ff4f1f">
        {[[58, 84], [66, 92], [72, 80], [80, 96], [86, 86], [92, 100], [98, 90]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={1.8 + (i % 3) * 0.6} />)}
      </g>
      <g className="p-sway" style={{ transformOrigin: '34px 70px' }}>
        <rect x="14" y="46" width="30" height="50" rx="6" fill="#d6ff3f" {...S} strokeWidth="2.6" />
        <rect x="21" y="34" width="16" height="14" rx="3" fill={INK} />
        <rect x="19" y="62" width="20" height="16" fill="#ff4fa3" stroke={INK} strokeWidth="2" />
      </g>
      <Spark x={170} y={38} s={1.2} delay="-.4s" />
    </>
  )
}

/* 4 — the finished fit arrives */
function SceneReceive() {
  return (
    <>
      <ellipse cx="100" cy="190" rx="56" ry="5" fill={INK} opacity=".14" className="g-shadow" />
      <Piece type="zip" tone="volt" x={34} y={2} s={0.66} cls="p-pop" />
      <Piece type="cap" tone="acid" x={112} y={42} s={0.36} cls="g-float" style={{ animationDelay: '-2s' }} />
      <path d="M36 128 L24 108 L76 108 L100 128 Z" fill="#c9a771" {...S} strokeWidth="2.6" />
      <path d="M164 128 L176 108 L124 108 L100 128 Z" fill="#d8b98a" {...S} strokeWidth="2.6" />
      <rect x="36" y="128" width="128" height="52" fill="#e2c496" {...S} />
      <rect x="86" y="128" width="28" height="52" fill={BONE} opacity=".8" stroke={INK} strokeWidth="2" />
      <g className="p-tag">
        <path d="M150 128 L150 150" stroke={INK} strokeWidth="2" />
        <path d="M140 150 H160 L163 157 V176 H137 V157 Z" fill="#d6ff3f" {...S} strokeWidth="2.4" />
        <text x="150" y="171" textAnchor="middle" fontSize="9" fill={INK} style={{ fontFamily: FONT }}>NEW FIT</text>
      </g>
      <Spark x={170} y={40} s={1.3} />
      <Spark x={26} y={70} s={0.9} delay="-1.2s" />
    </>
  )
}

const SCENES = [
  { t: { ...TONES.bone, bg: '#ffd9a8', kind: 'dots' }, el: SceneSend, label: 'An old faded T-shirt dropping into a parcel' },
  { t: { ...TONES.sand, bg: '#ffc4e1', kind: 'burst' }, el: SceneUpload, label: 'A reference outfit photo being scanned and uploaded' },
  { t: { ...TONES.sand, bg: '#c9f23d', kind: 'dots' }, el: SceneTransform, label: 'A bold graphic print being sprayed onto a plain tee' },
  { t: { ...TONES.denim, bg: '#d6c8ff', kind: 'burst' }, el: SceneReceive, label: 'A parcel opening to reveal a zip hoodie and cap' },
]

export function StepScene({ n = 1 }) {
  const { t, el: Scene, label } = SCENES[n - 1]
  return <Frame t={t} label={label}><Scene /></Frame>
}

/* Old faded tee → flash → brand new zip hoodie. */
export function TransformArt({ label = 'An old faded T-shirt transforming into a bold zip hoodie' }) {
  return (
    <Frame t={{ ...TONES.denim, bg: '#ffc4e1', kind: 'burst' }} label={label} className="transform-art">
      <ellipse cx="100" cy="192" rx="52" ry="5" fill={INK} opacity=".14" />
      <g className="tf-old"><Piece type="tee" tone="faded" plain x={20} y={14} s={0.9} /></g>
      <g className="tf-flash"><Burst x={100} y={104} r={70} fill="#d6ff3f" rot={0} sw={3} /></g>
      <g className="tf-new"><Piece type="zip" tone="volt" x={8} y={4} s={0.96} /></g>
      <g className="tf-new"><Spark x={170} y={36} s={1.3} /><Spark x={30} y={60} s={0.9} delay="-1s" /></g>
    </Frame>
  )
}

/* Before / after pair for the slider. */
export function BeforeAfterArt({ after = false }) {
  if (!after) {
    return (
      <Frame t={TONES.faded} label="An old, faded, plain T-shirt" className="ba-art before">
        <ellipse cx="100" cy="194" rx="52" ry="5" fill={INK} opacity=".16" />
        <Piece type="tee" tone="faded" plain x={0} y={0} s={1} cls="g-float" />
        <path d="M84 150 q4 -6 8 0 q4 6 8 0" fill="none" stroke={INK} strokeOpacity=".3" strokeWidth="2" />
      </Frame>
    )
  }
  return (
    <Frame t={{ ...TONES.rust, bg: '#d6ff3f', kind: 'dots' }} label="The same tee reworked into a boxy cropped graphic top" className="ba-art after">
      <ellipse cx="100" cy="194" rx="52" ry="5" fill={INK} opacity=".16" className="g-shadow" />
      <Piece type="croptee" tone="rust" x={0} y={8} s={1} cls="g-float" />
      <Spark x={166} y={34} s={1.2} />
      <Spark x={30} y={150} s={0.8} delay="-1s" />
    </Frame>
  )
}
