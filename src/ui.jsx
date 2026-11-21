import { useEffect } from 'react'
import { motion, useSpring, useMotionValue, useReducedMotion } from 'framer-motion'

export function Reveal({ children, delay = 0, className = '' }) {
  const rm = useReducedMotion()
  return (
    <motion.div className={className} initial={rm ? false : { opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }} transition={{ duration: 0.65, delay, ease: [0.2, 0.7, 0.2, 1] }}>
      {children}
    </motion.div>
  )
}

export function Magnetic({ children }) {
  const rm = useReducedMotion()
  const x = useSpring(useMotionValue(0), { stiffness: 200, damping: 16 })
  const y = useSpring(useMotionValue(0), { stiffness: 200, damping: 16 })
  const move = (e) => {
    if (rm) return
    const r = e.currentTarget.getBoundingClientRect()
    x.set((e.clientX - r.left - r.width / 2) * 0.22); y.set((e.clientY - r.top - r.height / 2) * 0.22)
  }
  return <motion.span style={{ x, y, display: 'inline-block' }} onMouseMove={move} onMouseLeave={() => { x.set(0); y.set(0) }}>{children}</motion.span>
}

export function Marquee({ text, className = '' }) {
  const row = Array.from({ length: 8 }, (_, i) => <span key={i}>{text} <b>✺</b> </span>)
  return <div className={`marquee ${className}`} aria-hidden="true"><div className="track">{row}{row}</div></div>
}

// A small, quiet ring that trails the pointer. The native cursor stays visible.
export function Cursor() {
  const rm = useReducedMotion()
  const x = useSpring(useMotionValue(-100), { stiffness: 320, damping: 30 })
  const y = useSpring(useMotionValue(-100), { stiffness: 320, damping: 30 })
  const fine = typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches
  useEffect(() => {
    if (!fine || rm) return
    const mv = (e) => { x.set(e.clientX); y.set(e.clientY) }
    window.addEventListener('mousemove', mv)
    return () => window.removeEventListener('mousemove', mv)
  }, [fine, rm, x, y])
  if (!fine || rm) return null
  return <motion.div className="cursor" style={{ x, y }} aria-hidden="true" />
}

// Locks page scroll while a modal / drawer is open.
export function useLockBody(locked) {
  useEffect(() => {
    if (!locked) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [locked])
}

export function useEscape(active, handler) {
  useEffect(() => {
    if (!active) return
    const k = (e) => { if (e.key === 'Escape') handler() }
    window.addEventListener('keydown', k)
    return () => window.removeEventListener('keydown', k)
  }, [active, handler])
}
