import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform, useSpring, useMotionValue, useReducedMotion, AnimatePresence } from 'framer-motion'
import { FITS, STEPS, NAV } from './data.js'

/* ---------- helpers ---------- */
function AnimatedArt({ variant = 'default', label = 'REWORK THE RULES' }) {
  return (
    <div className={`animated-art art-${variant}`} aria-label={label} role="img">
      <span className="art-orbit orbit-one" /><span className="art-orbit orbit-two" />
      <span className="art-shape shape-one" /><span className="art-shape shape-two" />
      <span className="art-thread thread-one" /><span className="art-thread thread-two" />
      <span className="art-spark spark-one">✳</span><span className="art-spark spark-two">✦</span>
      <span className="art-word">{variant === 'before' ? 'OLD' : variant === 'after' ? 'NEW' : variant === 'step' ? 'MAKE' : 'RE:MAKE'}</span>
      <span className="art-caption">{label}</span>
    </div>
  )
}

function Reveal({ children, delay = 0, className = '' }) {
  const rm = useReducedMotion()
  return (
    <motion.div className={className} initial={rm ? false : { opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.7, delay, ease: [0.2, 0.7, 0.2, 1] }}>
      {children}
    </motion.div>
  )
}
function Magnetic({ children }) {
  const rm = useReducedMotion()
  const x = useSpring(useMotionValue(0), { stiffness: 200, damping: 15 })
  const y = useSpring(useMotionValue(0), { stiffness: 200, damping: 15 })
  const move = (e) => {
    if (rm) return
    const r = e.currentTarget.getBoundingClientRect()
    x.set((e.clientX - r.left - r.width / 2) * 0.3); y.set((e.clientY - r.top - r.height / 2) * 0.3)
  }
  return <motion.span style={{ x, y, display: 'inline-block' }} onMouseMove={move} onMouseLeave={() => { x.set(0); y.set(0) }}>{children}</motion.span>
}
function Marquee({ text, className = '' }) {
  const row = Array.from({ length: 8 }, (_, i) => <span key={i}>{text} <b>✺</b> </span>)
  return <div className={`marquee ${className}`} aria-hidden="true"><div className="track">{row}{row}</div></div>
}
function Cursor() {
  const rm = useReducedMotion()
  const x = useSpring(useMotionValue(-100), { stiffness: 500, damping: 35 })
  const y = useSpring(useMotionValue(-100), { stiffness: 500, damping: 35 })
  const [big, setBig] = useState(false)
  const fine = typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches
  useEffect(() => {
    if (!fine || rm) return
    const mv = (e) => { x.set(e.clientX); y.set(e.clientY); setBig(!!e.target.closest('a,button,.card,input,select,textarea,label')) }
    window.addEventListener('mousemove', mv); return () => window.removeEventListener('mousemove', mv)
  }, [fine, rm, x, y])
  if (!fine || rm) return null
  return <motion.div className={`cursor ${big ? 'big' : ''}`} style={{ x, y }} aria-hidden="true" />
}

/* ---------- sections ---------- */
function Nav() {
  const [open, setOpen] = useState(false)
  return (
    <header className="nav">
      <a href="#home" className="logo">SNITCHY<span>STYLE</span></a>
      <nav className="links" aria-label="Main">{NAV.map(([l, h]) => <a key={l} href={h}>{l}</a>)}</nav>
      <a href="#customise" className="btn orange small hide-m">REWORK YOUR FIT</a>
      <button className="burger" aria-label="Toggle menu" aria-expanded={open} onClick={() => setOpen(!open)}>{open ? '✕' : '☰'}</button>
      <AnimatePresence>
        {open && (
          <motion.div className="mobile-menu" initial={{ clipPath: 'inset(0 0 100% 0)' }} animate={{ clipPath: 'inset(0 0 0% 0)' }} exit={{ clipPath: 'inset(0 0 100% 0)' }} transition={{ duration: 0.4 }}>
            {NAV.map(([l, h], i) => <motion.a key={l} href={h} onClick={() => setOpen(false)} initial={{ x: -40, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.1 + i * 0.06 }}>{l}</motion.a>)}
            <a href="#customise" className="btn orange" onClick={() => setOpen(false)}>REWORK YOUR FIT</a>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

function Hero() {
  const ref = useRef(null)
  const rm = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y1 = useTransform(scrollYProgress, [0, 1], [0, rm ? 0 : -120])
  const y2 = useTransform(scrollYProgress, [0, 1], [0, rm ? 0 : 140])
  const lines = ['YOUR OLD FIT', 'COULD BE', 'YOUR NEXT', 'FAVOURITE.']
  return (
    <section id="home" ref={ref} className="hero">
      <div className="hero-text">
        <h1 aria-label="Your old fit could be your next favourite.">
          {lines.map((l, i) => (
            <span className="line" key={l} aria-hidden="true">
              <motion.span initial={rm ? false : { y: '110%' }} animate={{ y: 0 }} transition={{ duration: 0.8, delay: 0.1 + i * 0.12, ease: [0.2, 0.7, 0.2, 1] }} className={i === 3 ? 'accent' : ''}>{l}</motion.span>
            </span>
          ))}
        </h1>
        <p className="script">Don't just throw it. Snitch it!</p>
        <div className="cta-row">
          <Magnetic><a href="#fits" className="btn black">EXPLORE THE FITS</a></Magnetic>
          <Magnetic><a href="#customise" className="btn orange">REWORK YOUR CLOTHES</a></Magnetic>
        </div>
      </div>
      <div className="hero-art">
        <motion.div className="h-img a" style={{ y: y1 }}><AnimatedArt variant="hero-main" label="OLD THREADS. NEW ENERGY." /></motion.div>
        <motion.div className="h-img b" style={{ y: y2 }}><AnimatedArt variant="hero-side" label="NO RULES" /></motion.div>
        <motion.div className="h-img c" style={{ y: y1 }}><AnimatedArt variant="hero-mini" label="REWORKED" /></motion.div>
        <motion.div className="sticker s1" animate={rm ? {} : { rotate: [-12, 8, -12] }} transition={{ repeat: Infinity, duration: 6 }}>100% UPCYCLED</motion.div>
        <motion.div className="sticker s2" animate={rm ? {} : { y: [0, -14, 0] }} transition={{ repeat: Infinity, duration: 3.5 }}>NO 2 ALIKE</motion.div>
        <motion.div className="sticker s3" animate={rm ? {} : { rotate: 360 }} transition={{ repeat: Infinity, duration: 14, ease: 'linear' }}>✺</motion.div>
      </div>
      <Marquee text="SECOND CHANCE SEASON" className="hero-marquee" />
    </section>
  )
}

function Story() {
  return (
    <section id="story" className="story pad">
      <Reveal><p className="label">THE STORY</p></Reveal>
      <Reveal><h2 className="big">WAIT, <em>THIS</em> IS A CLOTHING BRAND?</h2></Reveal>
      <Reveal delay={0.1}><p className="lead">Snitchy Style takes the stuff sitting at the back of your wardrobe — the jeans that don't fit, the tee you outgrew — and remixes it into one-off streetwear. Fashion first. The planet just happens to win too.</p></Reveal>
    </section>
  )
}

function Fits() {
  return (
    <section id="fits" className="pad">
      <Reveal><p className="label">TRENDING FITS</p><h2 className="big">THE FITS</h2></Reveal>
      <div className="grid">
        {FITS.map((f, i) => (
          <Reveal key={f.name} delay={(i % 3) * 0.08} className={`card c${i}`}>
            <motion.article whileHover={{ y: -8, rotate: i % 2 ? 1 : -1 }} tabIndex={0}>
              <div className="card-img"><AnimatedArt variant={`fit-${i + 1}`} label={f.cat} /><span className="tag">{f.cat}</span></div>
              <h3>{f.name}</h3><p>{f.desc}</p>
            </motion.article>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

function BeforeAfter() {
  const [pos, setPos] = useState(50)
  return (
    <section className="ba pad">
      <Reveal><p className="label">BEFORE VS AFTER</p><h2 className="big">GLOW-UP <em>GUARANTEED</em></h2></Reveal>
      <Reveal>
        <div className="ba-box">
          <div className="ba-after"><AnimatedArt variant="after" label="REWORKED. RELOADED." /></div>
          <div className="ba-before" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}><AnimatedArt variant="before" label="JUST SITTING THERE" /></div>
          <span className="pill l">BEFORE</span><span className="pill r">AFTER</span>
          <div className="ba-handle" style={{ left: `${pos}%` }} aria-hidden="true">↔</div>
          <input type="range" min="0" max="100" value={pos} onChange={(e) => setPos(+e.target.value)} aria-label="Before and after slider" />
        </div>
      </Reveal>
    </section>
  )
}

function How() {
  return (
    <section className="how pad">
      <Reveal><p className="label">HOW IT WORKS</p><h2 className="big">4 STEPS. ZERO BORING.</h2></Reveal>
      <div className="steps">
        {STEPS.map(([t, d], i) => (
          <Reveal key={t} delay={i * 0.1}>
            <div className="step"><span className="num">0{i + 1}</span><AnimatedArt variant={`step-${i + 1}`} label={t} /><h3>{t}</h3><p>{d}</p></div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

const GARMENTS = ['T-shirt', 'Jeans / trousers', 'Jacket', 'Shirt', 'Hoodie / sweater', 'Other']
const REDESIGNS = ['Patchwork', 'Crop / chop', 'Baggy / oversized', 'Embroidery', 'Tote / accessory', 'Surprise me']
function Customise() {
  const [f, setF] = useState({ name: '', contact: '', garment: '', redesign: '', notes: '' })
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [errors, setErrors] = useState({})
  const [done, setDone] = useState(false)
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })
  useEffect(() => () => preview && URL.revokeObjectURL(preview), [preview])
  const onFile = (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (!file.type.startsWith('image/') || file.size > 5 * 1024 * 1024) return setErrors({ ...errors, file: 'Please choose an image under 5MB.' })
    setErrors({ ...errors, file: undefined }); setFile(file); setPreview(URL.createObjectURL(file))
  }
  const submit = (e) => {
    e.preventDefault()
    const er = {}
    if (f.name.trim().length < 2) er.name = 'Tell us your name.'
    if (!/^\S+@\S+\.\S+$/.test(f.contact) && !/^[+\d][\d\s-]{7,}$/.test(f.contact)) er.contact = 'Enter a valid email or phone number.'
    if (!f.garment) er.garment = 'Pick a garment type.'
    if (!f.redesign) er.redesign = 'Pick a redesign style.'
    setErrors(er)
    if (!Object.keys(er).length) setDone(true) // PROTOTYPE: nothing is sent or stored.
  }
  const field = (k, label, el) => <label className={errors[k] ? 'err' : ''}><span>{label}</span>{el}{errors[k] && <em role="alert">{errors[k]}</em>}</label>
  return (
    <section id="customise" className="cust pad">
      <div className="cust-art"><AnimatedArt variant="custom" label="YOUR CLOTHES. YOUR RULES." /></div>
      <div>
        <Reveal><p className="label">CUSTOMISE</p><h2 className="big">YOUR CLOTHES. <em>YOUR RULES.</em></h2>
          <p className="lead">Send a photo of the piece, pick a style, tell us what you're imagining. We'll come back with a plan for your remix.</p></Reveal>
        {done ? (
          <motion.div className="done" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} role="status">
            <h3>NICE ONE, {f.name.split(' ')[0].toUpperCase()}!</h3>
            <p>This is a prototype form — nothing was sent or saved. Connect a backend or form service to take real requests.</p>
            <button className="btn black" onClick={() => { setDone(false); setF({ name: '', contact: '', garment: '', redesign: '', notes: '' }); setPreview(null); setFile(null) }}>START OVER</button>
          </motion.div>
        ) : (
          <form onSubmit={submit} noValidate>
            {field('name', 'CUSTOMER NAME', <input value={f.name} onChange={set('name')} autoComplete="name" />)}
            {field('contact', 'EMAIL OR PHONE', <input value={f.contact} onChange={set('contact')} autoComplete="email" />)}
            <div className="two">
              {field('garment', 'GARMENT TYPE', <select value={f.garment} onChange={set('garment')}><option value="">Select…</option>{GARMENTS.map((g) => <option key={g}>{g}</option>)}</select>)}
              {field('redesign', 'PREFERRED REDESIGN', <select value={f.redesign} onChange={set('redesign')}><option value="">Select…</option>{REDESIGNS.map((g) => <option key={g}>{g}</option>)}</select>)}
            </div>
            {field('notes', 'ADDITIONAL INSTRUCTIONS', <textarea rows="3" value={f.notes} onChange={set('notes')} />)}
            {field('file', 'UPLOAD A PHOTO', <input type="file" accept="image/*" onChange={onFile} />)}
            {preview && <img className="preview" src={preview} alt={`Preview of ${file?.name}`} />}
            <Magnetic><button className="btn orange" type="submit">SEND MY FIT</button></Magnetic>
            <small>Prototype: submissions aren't stored or processed.</small>
          </form>
        )}
      </div>
    </section>
  )
}

function Impact() {
  const stats = [['♻', 'Every piece reused', 'Clothes get a second life instead of a landfill.'], ['✂', 'Less textile waste', 'We work with what already exists.'], ['★', 'Local making jobs', 'Skilled stitchers and designers earn from reworking.']]
  return (
    <section className="impact pad">
      <Reveal><p className="label">THE QUIET FLEX</p><h2 className="big">GOOD FOR THE PLANET. <em>BETTER FOR THE FIT.</em></h2></Reveal>
      <div className="stats">{stats.map(([i, t, d], k) => <Reveal key={t} delay={k * 0.1}><div className="stat"><b>{i}</b><h3>{t}</h3><p>{d}</p></div></Reveal>)}</div>
    </section>
  )
}

function Footer() {
  return (
    <footer id="contact">
      <Marquee text="DON'T JUST THROW IT, SNITCH IT!" />
      <div className="foot pad">
        <div><div className="logo big-logo">SNITCHY<span>STYLE</span></div><p>Even your clothes deserve a second chance.</p></div>
        <nav aria-label="Footer">{NAV.map(([l, h]) => <a key={l} href={h}>{l}</a>)}</nav>
        <div><p className="label">SAY HI</p><a href="mailto:hello@snitchystyle.example">hello@snitchystyle.example</a><br /><a href="tel:+910000000000">+91 00000 00000</a>
          <div className="social">{['INSTAGRAM', 'TIKTOK', 'PINTEREST'].map((s) => <a key={s} href="#home" aria-label={s}>{s}</a>)}</div></div>
      </div>
      <p className="copy">© {new Date().getFullYear()} SNITCHY STYLE. ALL RIGHTS RESERVED.</p>
    </footer>
  )
}

export default function App() {
  return (
    <>
      <Cursor />
      <Marquee text="OLD CLOTHES. NEW DRIP. ZERO WASTE." className="announce" />
      <Nav />
      <main><Hero /><Story /><Fits /><BeforeAfter /><How /><Customise /><Impact /></main>
      <Footer />
    </>
  )
}
