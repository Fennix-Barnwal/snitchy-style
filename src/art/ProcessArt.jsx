import { useId } from 'react'
import { INK, BONE, TONES, TEE_PATH, Tee, Jacket, Star, Spark } from './Garments.jsx'

/* Animated graphics for the Custom Re-make journey. SVG + CSS only. */

const dash = (c = INK) => ({ fill: 'none', stroke: c, strokeWidth: 1.6, strokeDasharray: '3 3', strokeLinecap: 'round' })
const S = { stroke: INK, strokeWidth: 3, strokeLinejoin: 'round', strokeLinecap: 'round' }

function Frame({ bg, label, children, className = '' }) {
  return (
    <div className={`gart process ${className}`} style={{ background: bg }} role="img" aria-label={label}>
      <svg viewBox="0 0 200 200" aria-hidden="true" focusable="false">{children}</svg>
    </div>
  )
}

/* 1 — old tee drops into a parcel */
function SceneSend() {
  const old = { fill: '#b9b3a4', a: '#9d978a', b: '#8a8477', stitch: INK }
  return (
    <>
      <ellipse cx="100" cy="188" rx="58" ry="5" fill={INK} opacity=".14" />
      <path d="M50 112 L36 88 L84 88 L100 112 Z" fill="#c9b99a" {...S} strokeWidth="2.6" />
      <path d="M150 112 L164 88 L116 88 L100 112 Z" fill="#b8a785" {...S} strokeWidth="2.6" />
      <g transform="translate(58 4) scale(.42)">
        <g className="p-drop"><Tee t={old} /></g>
      </g>
      <rect x="50" y="112" width="100" height="68" fill="#d8c8a6" {...S} />
      <rect x="86" y="112" width="28" height="68" fill="#efe9dd" opacity=".75" stroke={INK} strokeWidth="2" />
      <path d="M62 140 H78 M62 150 H72" stroke={INK} strokeWidth="2.4" strokeLinecap="round" />
      <path className="p-arrow" d="M100 70 V96 M92 88 L100 98 L108 88" fill="none" stroke="#d9532b" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      <Spark x={162} y={46} delay="-.6s" />
    </>
  )
}

/* 2 — reference photo being uploaded */
function SceneUpload() {
  const t = TONES.sage
  return (
    <>
      <rect x="52" y="28" width="96" height="124" rx="6" fill={BONE} {...S} />
      <rect x="60" y="36" width="80" height="84" fill="#dfe5d6" stroke={INK} strokeWidth="2" />
      <g transform="translate(70 40) scale(.4)"><g className="g-float"><Jacket t={t} patchwork /></g></g>
      <rect className="p-scan" x="60" y="36" width="80" height="4" fill="#d9532b" opacity=".85" />
      <path d="M60 52 V36 H76 M124 36 H140 V52 M140 104 V120 H124 M76 120 H60 V104" fill="none" stroke={INK} strokeWidth="3" strokeLinecap="round" />
      <path d="M62 134 H110 M62 143 H90" stroke={INK} strokeWidth="2.4" strokeLinecap="round" />
      <g className="p-bob">
        <circle cx="146" cy="150" r="20" fill="#d9532b" {...S} />
        <path d="M146 160 V140 M137 148 L146 139 L155 148" fill="none" stroke={BONE} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </>
  )
}

/* 3 — scissors + stitching */
function SceneStitch() {
  return (
    <>
      <g className="p-sway">
        <rect x="24" y="112" width="52" height="40" fill="#8aa0b5" {...S} strokeWidth="2.4" transform="rotate(-8 50 132)" />
        <rect x="30" y="118" width="40" height="28" {...dash()} transform="rotate(-8 50 132)" />
      </g>
      <rect x="84" y="128" width="92" height="46" fill="#d9532b" {...S} strokeWidth="2.4" />
      <path className="p-stitch" d="M84 150 H176" fill="none" stroke={BONE} strokeWidth="2.6" strokeDasharray="7 6" strokeLinecap="round" />
      <path d="M118 128 L118 96" stroke={INK} strokeWidth="1.6" strokeDasharray="3 4" />
      <g className="p-snip a">
        <path d="M100 86 L158 58" stroke={INK} strokeWidth="5.5" strokeLinecap="round" />
        <path d="M100 86 L76 98" stroke={INK} strokeWidth="5.5" strokeLinecap="round" />
        <circle cx="64" cy="104" r="11" fill="none" stroke={INK} strokeWidth="5" />
      </g>
      <g className="p-snip b">
        <path d="M100 86 L158 114" stroke="#5d7389" strokeWidth="5.5" strokeLinecap="round" />
        <path d="M100 86 L76 74" stroke="#5d7389" strokeWidth="5.5" strokeLinecap="round" />
        <circle cx="64" cy="68" r="11" fill="none" stroke="#5d7389" strokeWidth="5" />
      </g>
      <circle cx="100" cy="86" r="5" fill={BONE} stroke={INK} strokeWidth="2.4" />
      <Spark x={150} y={32} delay="-.9s" />
    </>
  )
}

/* 4 — finished piece with a hang tag */
function SceneReceive() {
  return (
    <>
      <ellipse cx="96" cy="190" rx="52" ry="5" fill={INK} opacity=".14" className="g-shadow" />
      <g transform="translate(22 14) scale(.82)"><g className="g-float"><Jacket t={TONES.denim} patchwork /></g></g>
      <g className="p-tag">
        <path d="M150 70 L150 92" stroke={INK} strokeWidth="2" />
        <path d="M138 92 H162 L166 100 V130 H134 V100 Z" fill={BONE} {...S} strokeWidth="2.4" />
        <circle cx="150" cy="99" r="2.6" fill={INK} />
        <Star x={150} y={115} s={0.5} fill="#d9532b" />
      </g>
      <Spark x={170} y={40} s={1.2} />
      <Spark x={26} y={150} s={0.8} delay="-1.2s" />
    </>
  )
}

const SCENES = [
  { bg: '#e4ddcf', el: SceneSend, label: 'An old T-shirt dropping into a parcel' },
  { bg: '#cdd5c3', el: SceneUpload, label: 'A reference photo being uploaded' },
  { bg: '#e9e1d1', el: SceneStitch, label: 'Scissors cutting and stitching fabric' },
  { bg: '#cdd6dc', el: SceneReceive, label: 'A finished patchwork jacket with a hang tag' },
]

export function StepScene({ n = 1 }) {
  const { bg, el: Scene, label } = SCENES[n - 1]
  return <Frame bg={bg} label={label}><Scene /></Frame>
}

/* Fabric pieces fly together and become a tee. */
const PATCHES = [
  { x: 62, y: 26, w: 42, h: 62, c: '#8aa0b5', dx: -90, dy: -50, r: -50 },
  { x: 104, y: 26, w: 34, h: 52, c: '#d9532b', dx: 80, dy: -70, r: 40 },
  { x: 62, y: 88, w: 36, h: 52, c: '#8fa183', dx: -100, dy: 40, r: 30 },
  { x: 98, y: 78, w: 40, h: 62, c: '#efe9dd', dx: 90, dy: 30, r: -35 },
  { x: 62, y: 140, w: 76, h: 46, c: '#5d7389', dx: 0, dy: 110, r: 20 },
  { x: 8, y: 30, w: 54, h: 74, c: '#d8cdb8', dx: -60, dy: -90, r: -25 },
  { x: 138, y: 30, w: 54, h: 74, c: '#242424', dx: 70, dy: -90, r: 25 },
]

export function TransformArt({ label = 'Fabric pieces joining together to become a T-shirt' }) {
  const uid = 'tf' + useId().replace(/:/g, '')
  return (
    <Frame bg="#e4ddcf" label={label} className="transform-art">
      <circle cx="100" cy="104" r="80" fill="rgba(255,255,255,.35)" />
      <g className="tf-fly-wrap">
        {PATCHES.map((p, i) => (
          <rect key={i} className="tf-fly" x={p.x} y={p.y} width={p.w} height={p.h} fill={p.c} stroke={INK} strokeWidth="2.4"
            style={{ '--dx': `${p.dx}px`, '--dy': `${p.dy}px`, '--r': `${p.r}deg` }} />
        ))}
      </g>
      <g className="tf-done">
        <clipPath id={uid}><path d={TEE_PATH} /></clipPath>
        <g clipPath={`url(#${uid})`}>
          {PATCHES.map((p, i) => <rect key={i} x={p.x} y={p.y} width={p.w} height={p.h} fill={p.c} />)}
          <g {...dash(BONE)} opacity=".9">
            <path d="M62 88 H138 M98 26 V140 M62 140 H138 M104 78 H138" />
          </g>
        </g>
        <path d={TEE_PATH} fill="none" {...S} />
        <path d="M80 28 Q100 52 120 28" fill="none" stroke={INK} strokeWidth="5" strokeLinecap="round" />
        <Star x={118} y={112} s={0.9} fill="#d9532b" />
        <Spark x={168} y={36} s={1.2} />
        <Spark x={30} y={60} s={0.8} delay="-1s" />
      </g>
    </Frame>
  )
}

/* Before / after pair for the slider. */
export function BeforeAfterArt({ after = false }) {
  const uid = 'ba' + useId().replace(/:/g, '')
  if (!after) {
    const old = { fill: '#aaa699', a: '#8f8b7f', b: '#7d796d', stitch: INK }
    return (
      <Frame bg="#cfcabd" label="An old, faded T-shirt" className="ba-art before">
        <ellipse cx="100" cy="194" rx="52" ry="5" fill={INK} opacity=".16" />
        <g className="g-float">
          <path d={TEE_PATH} fill={old.fill} {...S} />
          <path d="M80 28 Q100 52 120 28" fill="none" stroke={INK} strokeWidth="5" strokeLinecap="round" />
          <path d="M62 176 L138 176" {...dash(INK)} strokeOpacity=".4" />
        </g>
        <path d="M84 150 q4 -6 8 0 q4 6 8 0" fill="none" stroke={INK} strokeOpacity=".35" strokeWidth="2" />
      </Frame>
    )
  }
  return (
    <Frame bg="#e4ddcf" label="The same T-shirt, redesigned as patchwork" className="ba-art after">
      <ellipse cx="100" cy="194" rx="52" ry="5" fill={INK} opacity=".16" className="g-shadow" />
      <g className="g-float">
        <clipPath id={uid}><path d={TEE_PATH} /></clipPath>
        <g clipPath={`url(#${uid})`}>
          {PATCHES.map((p, i) => <rect key={i} x={p.x} y={p.y} width={p.w} height={p.h} fill={p.c} />)}
          <g {...dash(BONE)}><path d="M62 88 H138 M98 26 V140 M62 140 H138 M104 78 H138" /></g>
        </g>
        <path d={TEE_PATH} fill="none" {...S} />
        <path d="M80 28 Q100 52 120 28" fill="none" stroke={INK} strokeWidth="5" strokeLinecap="round" />
        <Star x={118} y={112} s={0.9} fill="#d9532b" />
      </g>
      <Spark x={166} y={34} s={1.2} />
    </Frame>
  )
}
