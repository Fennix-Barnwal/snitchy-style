import { useId, useRef } from 'react'
import { useInView } from 'framer-motion'
import { Backdrop, Defs, Gid, PIECES, SparkLayer, TONES } from './pieces.jsx'

// A whole outfit drawn as one illustration, in the same frame as GarmentArt.
// Layout mirrors the existing "full look" piece: top and bottoms in the middle, extras around them.
const SLOTS = {
  top: { x: 44, y: 2, s: 0.62, d: '0s' },
  bottom: { x: 50, y: 84, s: 0.58, d: '-1.6s' },
  head: { x: -6, y: 4, s: 0.44, d: '-3.1s' },
  shoes: { x: -4, y: 128, s: 0.4, d: '-2.2s' },
  acc: { x: 122, y: 100, s: 0.44, d: '-0.8s' },
}
const ORDER = ['top', 'bottom', 'head', 'shoes', 'acc']

export default function OutfitArt({ pieces, label }) {
  const uid = 'o' + useId().replace(/:/g, '')
  const ref = useRef(null)
  const inView = useInView(ref, { margin: '160px' })
  const top = pieces.find((p) => p.slot === 'top') || pieces[0]
  const t = TONES[top.tone] || TONES.bone
  return (
    <div ref={ref} className={`gart outfit ${inView ? '' : 'paused'}`} style={{ background: t.bg }} role="img" aria-label={label}>
      <svg className="gart-bg" viewBox="0 0 200 200" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false"><Backdrop t={t} uid={uid} /></svg>
      <div className="gart-stage">
        <div className="gart-obj">
          <div className="gart-float static">
            <svg viewBox="0 0 200 200" aria-hidden="true" focusable="false">
              <Defs uid={uid} />
              <Gid.Provider value={uid}>
                {ORDER.map((slot) => {
                  const p = pieces.find((x) => x.slot === slot)
                  const Piece = p && PIECES[p.art]
                  if (!Piece) return null
                  const k = SLOTS[slot]
                  return (
                    <g key={slot} transform={`translate(${k.x} ${k.y}) scale(${k.s})`}>
                      <g className="g-float" style={{ animationDelay: k.d }}><Piece t={TONES[p.tone] || TONES.bone} /></g>
                    </g>
                  )
                })}
              </Gid.Provider>
            </svg>
          </div>
        </div>
      </div>
      <svg className="gart-fx" viewBox="0 0 200 200" aria-hidden="true" focusable="false"><SparkLayer t={t} delay="0s" /></svg>
    </div>
  )
}
