import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform, useReducedMotion, AnimatePresence } from 'framer-motion'
import { CONTACT, NAV, STEPS, TAGLINE } from './data.js'
import { GarmentArt } from './art/Garments.jsx'
import { BeforeAfterArt, StepScene, TransformArt } from './art/ProcessArt.jsx'
import { CartProvider, useCart } from './cart.jsx'
import { Cursor, Magnetic, Marquee, Reveal } from './ui.jsx'
import Shop from './Shop.jsx'
import RemakeForm from './RemakeForm.jsx'

/* ---------- navigation ---------- */
function useActiveSection(ids) {
  const [active, setActive] = useState('home')
  useEffect(() => {
    const els = ids.map((i) => document.getElementById(i)).filter(Boolean)
    const io = new IntersectionObserver((entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)), { rootMargin: '-40% 0px -55% 0px' })
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [ids])
  return active
}

const BagIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 8h14l-1 12H6L5 8Z" /><path d="M9 8a3 3 0 0 1 6 0" />
  </svg>
)

const SECTION_IDS = ['home', 'shop', 'remake', 'about']

function Nav() {
  const [open, setOpen] = useState(false)
  const { count, setOpen: openCart } = useCart()
  const active = useActiveSection(SECTION_IDS)
  const cartBtn = (
    <button className="cart-btn" onClick={() => { setOpen(false); openCart(true) }} aria-label={`Open cart, ${count} item${count === 1 ? '' : 's'}`}>
      <BagIcon />
      <motion.span key={count} className={`badge ${count ? 'on' : ''}`} initial={{ scale: 1.5 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 500, damping: 18 }}>{count}</motion.span>
    </button>
  )
  return (
    <header className="nav">
      <a href="#home" className="logo" onClick={() => setOpen(false)}>SNITCHY<span>STYLE</span></a>
      <nav className="links" aria-label="Main">
        {NAV.map(([l, h]) => <a key={l} href={h} aria-current={active === h.slice(1) ? 'true' : undefined}>{l}</a>)}
      </nav>
      <div className="nav-right">
        <a href="#remake" className="btn accent small hide-m">START A RE-MAKE</a>
        {cartBtn}
        <button className="burger" aria-label="Toggle menu" aria-expanded={open} onClick={() => setOpen(!open)}>{open ? '✕' : '☰'}</button>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div className="mobile-menu" initial={{ clipPath: 'inset(0 0 100% 0)' }} animate={{ clipPath: 'inset(0 0 0% 0)' }} exit={{ clipPath: 'inset(0 0 100% 0)' }} transition={{ duration: 0.4 }}>
            {NAV.map(([l, h], i) => <motion.a key={l} href={h} onClick={() => setOpen(false)} initial={{ x: -30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.1 + i * 0.06 }}>{l}</motion.a>)}
            <button className="btn accent" onClick={() => { setOpen(false); openCart(true) }}>CART ({count})</button>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

/* ---------- home ---------- */
function Hero() {
  const ref = useRef(null)
  const rm = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y1 = useTransform(scrollYProgress, [0, 1], [0, rm ? 0 : -70])
  const y2 = useTransform(scrollYProgress, [0, 1], [0, rm ? 0 : 80])
  const lines = ['YOUR OLD FIT', 'COULD BE', 'YOUR NEXT', 'FAVOURITE.']
  return (
    <section id="home" ref={ref} className="hero">
      <div className="hero-text">
        <h1 aria-label="Your old fit could be your next favourite.">
          {lines.map((l, i) => (
            <span className="line" key={l} aria-hidden="true">
              <motion.span initial={rm ? false : { y: '110%' }} animate={{ y: 0 }} transition={{ duration: 0.8, delay: 0.1 + i * 0.12, ease: [0.2, 0.7, 0.2, 1] }} className={i === 3 ? 'accent-text' : ''}>{l}</motion.span>
            </span>
          ))}
        </h1>
        <p className="script">Don't just throw it. Snitch it!</p>
        <div className="cta-row">
          <Magnetic><a href="#shop" className="btn black">SHOP THE FITS</a></Magnetic>
          <Magnetic><a href="#remake" className="btn outline">CUSTOM RE-MAKE</a></Magnetic>
        </div>
      </div>
      <div className="hero-art">
        <motion.div className="h-img a" style={{ y: y1 }}><GarmentArt type="jacket" tone="denim" label="Patchwork denim jacket illustration" /></motion.div>
        <motion.div className="h-img b" style={{ y: y2 }}><GarmentArt type="hoodie" tone="sage" delay="-2s" label="Hoodie illustration" /></motion.div>
        <motion.div className="h-img c" style={{ y: y1 }}><GarmentArt type="tote" tone="rust" delay="-3.5s" label="Tote bag illustration" /></motion.div>
        <motion.div className="sticker s1" animate={rm ? {} : { rotate: [-10, 6, -10] }} transition={{ repeat: Infinity, duration: 7, ease: 'easeInOut' }}>100%<br />UPCYCLED</motion.div>
        <motion.div className="sticker s2" animate={rm ? {} : { y: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}>NO 2 ALIKE</motion.div>
      </div>
      <Marquee text="SECOND CHANCE SEASON" className="hero-marquee" />
    </section>
  )
}

function Journeys() {
  const cards = [
    { n: '01', t: 'SHOP', d: 'Browse redesigned and upcycled pieces, ready to wear.', cta: 'BROWSE THE SHOP', href: '#shop', art: <GarmentArt type="look" tone="sand" label="A tee, jacket and jeans floating together" /> },
    { n: '02', t: 'CUSTOM RE-MAKE', d: 'Send your old clothes and a reference. We turn them into your outfit.', cta: 'START A RE-MAKE', href: '#remake', art: <StepScene n={3} /> },
  ]
  return (
    <section className="journeys pad">
      <Reveal><p className="label">TWO WAYS IN</p><h2 className="big sm">PICK YOUR <em>ROUTE</em></h2></Reveal>
      <div className="journey-grid">
        {cards.map((c, i) => (
          <Reveal key={c.t} delay={i * 0.1}>
            <a href={c.href} className="journey">
              <div className="journey-art">{c.art}</div>
              <div className="journey-body">
                <span className="num-sm">{c.n}</span>
                <h3>{c.t}</h3>
                <p>{c.d}</p>
                <span className="arrow-link">{c.cta} →</span>
              </div>
            </a>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

/* ---------- custom re-make ---------- */
function HowItWorks() {
  return (
    <div className="steps">
      {STEPS.map((s, i) => (
        <Reveal key={s.t} delay={i * 0.08}>
          <div className="step">
            <span className="num">0{i + 1}</span>
            <StepScene n={i + 1} />
            <h3>{s.t}</h3>
            <p>{s.d}</p>
          </div>
        </Reveal>
      ))}
    </div>
  )
}

function BeforeAfter() {
  const [pos, setPos] = useState(50)
  return (
    <div className="ba-wrap">
      <Reveal><p className="label">BEFORE VS AFTER</p><h3 className="mid">GLOW-UP <em>GUARANTEED</em></h3></Reveal>
      <Reveal>
        <div className="ba-box">
          <div className="ba-after"><BeforeAfterArt after /></div>
          <div className="ba-before" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}><BeforeAfterArt /></div>
          <span className="pill l">BEFORE</span><span className="pill r">AFTER</span>
          <div className="ba-handle" style={{ left: `${pos}%` }} aria-hidden="true">↔</div>
          <input type="range" min="0" max="100" value={pos} onChange={(e) => setPos(+e.target.value)} aria-label="Drag to compare before and after" />
        </div>
        <p className="fine">Drag the slider to compare. Illustration only.</p>
      </Reveal>
    </div>
  )
}

function Remake() {
  return (
    <section id="remake" className="remake pad">
      <Reveal>
        <p className="label">CUSTOM RE-MAKE</p>
        <h2 className="big">YOUR CLOTHES. <em>YOUR RULES.</em></h2>
        <p className="lead">Send us the clothes you no longer wear and show us what you want instead. We redesign them into your outfit.</p>
      </Reveal>
      <HowItWorks />
      <BeforeAfter />
      <div className="request" id="request">
        <div className="request-art">
          <TransformArt />
          <p className="fine">Old pieces in, one-of-a-kind outfit out.</p>
        </div>
        <div>
          <Reveal><p className="label">REQUEST A RE-MAKE</p><h3 className="mid">TELL US WHAT YOU'RE <em>IMAGINING</em></h3></Reveal>
          <RemakeForm />
        </div>
      </div>
    </section>
  )
}

/* ---------- about ---------- */
function About() {
  const stats = [['♻', 'Every piece reused', 'Clothes get a second life instead of a landfill.'], ['✂', 'Less textile waste', 'We work with what already exists.'], ['★', 'Local making jobs', 'Skilled stitchers and designers earn from reworking.']]
  return (
    <section id="about" className="about pad">
      <Reveal><p className="label">ABOUT</p></Reveal>
      <Reveal><h2 className="big">WAIT, <em>THIS</em> IS A CLOTHING BRAND?</h2></Reveal>
      <Reveal delay={0.1}><p className="lead">Snitchy Style takes the stuff sitting at the back of your wardrobe (the jeans that don't fit, the tee you outgrew) and remixes it into one-off streetwear. Fashion first. The planet just happens to win too.</p></Reveal>
      <Reveal delay={0.15}><blockquote>{TAGLINE}</blockquote></Reveal>
      <div className="stats">
        {stats.map(([i, t, d], k) => <Reveal key={t} delay={k * 0.1}><div className="stat"><b aria-hidden="true">{i}</b><h3>{t}</h3><p>{d}</p></div></Reveal>)}
      </div>
    </section>
  )
}

/* ---------- footer ---------- */
function Footer() {
  const socials = Object.entries(CONTACT.social).filter(([, url]) => url)
  return (
    <footer id="contact">
      <Marquee text="DON'T JUST THROW IT, SNITCH IT!" />
      <div className="foot pad">
        <div>
          <div className="logo big-logo">SNITCHY<span>STYLE</span></div>
          <p className="foot-tag">{TAGLINE}</p>
        </div>
        <nav aria-label="Footer"><p className="label">EXPLORE</p>{NAV.map(([l, h]) => <a key={l} href={h}>{l}</a>)}</nav>
        <div>
          <p className="label">CONTACT</p>
          <a href={CONTACT.phoneHref}>Phone: {CONTACT.phoneDisplay}</a><br />
          {CONTACT.email && <><a href={`mailto:${CONTACT.email}`}>Email: {CONTACT.email}</a><br /></>}
          {socials.length > 0 && (
            <div className="social">{socials.map(([n, url]) => <a key={n} href={url} target="_blank" rel="noopener noreferrer">{n.toUpperCase()}</a>)}</div>
          )}
        </div>
      </div>
      <p className="copy">© {new Date().getFullYear()} SNITCHY STYLE. ALL RIGHTS RESERVED.</p>
    </footer>
  )
}

export default function App() {
  return (
    <CartProvider>
      <Cursor />
      <Marquee text="OLD CLOTHES. NEW DRIP. ZERO WASTE." className="announce" />
      <Nav />
      <main><Hero /><Journeys /><Shop /><Remake /><About /></main>
      <Footer />
    </CartProvider>
  )
}
