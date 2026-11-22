import { useId, useRef } from 'react'
import { motion, useInView, useMotionValue, useReducedMotion, useSpring } from 'framer-motion'
import { Backdrop, Defs, Gid, PIECES, SparkLayer, TONES } from './pieces.jsx'

// Re-export the drawing library so other files can keep importing from here.
export * from './pieces.jsx'

/**
 * Animated clothing illustration (SVG + CSS + Framer Motion).
 * type: teddy | sneaker | shorts | tee | croptee | shirt | hoodie | zip | jacket | bomber | jeans | cargo | wide |
 *       tote | sling | shoulder | cap | bucket | beanie | bandana | wallet | pouch | look
 * still: no motion at all (cart thumbnails)
 * bare:  transparent card, no backdrop (hero collage)
 *
 * Motion: a CSS float loop, plus a pointer-driven 3D tilt on desktop. Loops pause when
 * offscreen, and everything stops for prefers-reduced-motion.
 */
export function GarmentArt({ type = 'tee', tone = 'bone', still = false, bare = false, plain = false, label, delay = '0s', className = '' }) {
  const t = TONES[tone] || TONES.bone
  const Piece = PIECES[type] || PIECES.tee
  const uid = 'g' + useId().replace(/:/g, '')
  const ref = useRef(null)
  const inView = useInView(ref, { margin: '160px' })
  const rm = useReducedMotion()
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const cfg = { stiffness: 140, damping: 15, mass: 0.6 }
  const rotateY = useSpring(mx, cfg)
  const rotateX = useSpring(my, cfg)
  const tilt = !still && !rm

  const move = (e) => {
    if (!tilt || e.pointerType !== 'mouse') return
    const r = e.currentTarget.getBoundingClientRect()
    mx.set(((e.clientX - r.left) / r.width - 0.5) * 26)
    my.set(-((e.clientY - r.top) / r.height - 0.5) * 20)
  }
  const leave = () => { mx.set(0); my.set(0) }

  return (
    <div ref={ref} className={`gart ${still ? 'still' : ''} ${inView ? '' : 'paused'} ${bare ? 'bare' : ''} ${className}`}
      style={{ background: bare ? 'transparent' : t.bg, '--d': delay }} role="img" aria-label={label || `${type} illustration`}
      onPointerMove={move} onPointerLeave={leave}>
      {!bare && <svg className="gart-bg" viewBox="0 0 200 200" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false"><Backdrop t={t} uid={uid} /></svg>}
      <div className="gart-stage">
        <motion.div className="gart-obj" style={tilt ? { rotateX, rotateY } : undefined}>
          <div className={`gart-float ${type === 'look' ? 'static' : ''}`}>
            <svg viewBox="0 0 200 200" aria-hidden="true" focusable="false">
              <Defs uid={uid} />
              <Gid.Provider value={uid}><Piece t={t} plain={plain} /></Gid.Provider>
            </svg>
          </div>
        </motion.div>
      </div>
      {!bare && <i className="gart-shadow" aria-hidden="true" />}
      {!bare && <svg className="gart-fx" viewBox="0 0 200 200" aria-hidden="true" focusable="false"><SparkLayer t={t} delay={delay} /></svg>}
    </div>
  )
}
