import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform, useReducedMotion, AnimatePresence } from 'framer-motion'
import { CONTACT, NAV, STEPS, TAGLINE } from './data.js'
import { GarmentArt } from './art/Garments.jsx'
import { BeforeAfterArt, StepScene, TransformArt } from './art/ProcessArt.jsx'
import { CartProvider, useCart } from './cart.jsx'
import { Cursor, Magnetic, Marquee, Reveal, WaveText } from './ui.jsx'
import Trending from './Trending.jsx'
import Radio from './Radio.jsx'
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

const SECTION_IDS = ['home', 'trending', 'shop', 'remake', 'about', 'sustainability']
const NAV_OF = { trending: 'home', sustainability: 'about' }

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
        {NAV.map(([l, h]) => <a key={l} href={h} aria-current={(NAV_OF[active] || active) === h.slice(1) ? 'true' : undefined}>{l}</a>)}
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
  const y1 = useTransform(scrollYProgress, [0, 1], [0, rm ? 0 : -80])
  const y2 = useTransform(scrollYProgress, [0, 1], [0, rm ? 0 : 90])
  const yBg = useTransform(scrollYProgress, [0, 1], [0, rm ? 0 : 140])
  const lines = ['YOUR OLD FIT', 'COULD BE', 'YOUR NEXT', 'FAVOURITE.']
  const cards = [
    { c: 'a', y: y1, type: 'hoodie', tone: 'volt', d: '0s', label: 'Oversized graphic hoodie illustration' },
    { c: 'b', y: y2, type: 'bomber', tone: 'rust', d: '-2s', label: 'Bomber jacket illustration' },
    { c: 'c', y: y1, type: 'cap', tone: 'acid', d: '-3.5s', label: 'Cap illustration' },
    { c: 'd', y: y2, type: 'jeans', tone: 'denim', d: '-1.2s', label: 'Baggy jeans illustration' },
    { c: 'e', y: y1, type: 'sling', tone: 'sand', d: '-4.2s', label: 'Sling bag illustration' },
  ]
  return (
    <section id="home" ref={ref} className="hero">
      <motion.div className="hero-bg" style={{ y: yBg }} aria-hidden="true"><span>SNITCH</span><i className="blob b1" /><i className="blob b2" /></motion.div>
      <div className="hero-text">
        <h1 aria-label="Your old fit could be your next favourite.">
          {lines.map((l, i) => (
            <span className="line" key={l} aria-hidden="true">
              <motion.span initial={rm ? false : { y: '110%' }} animate={{ y: 0 }} transition={{ duration: 0.8, delay: 0.1 + i * 0.12, ease: [0.2, 0.7, 0.2, 1] }} className={i === 3 ? 'accent-text shimmer' : ''}>
                {i === 3 ? <WaveText text={l} /> : l}
              </motion.span>
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
        {cards.map((k) => (
          <motion.div key={k.c} className={`h-img ${k.c}`} style={{ y: k.y }}>
            <GarmentArt type={k.type} tone={k.tone} delay={k.d} label={k.label} />
          </motion.div>
        ))}
        <motion.div className="sticker s1" animate={rm ? {} : { rotate: [-10, 6, -10] }} transition={{ repeat: Infinity, duration: 7, ease: 'easeInOut' }}>REWORKED<br />STYLE</motion.div>
        <motion.div className="sticker s2" animate={rm ? {} : { y: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}>NO 2 ALIKE</motion.div>
        <svg className="sticker s3 spin-slow" viewBox="0 0 120 120" aria-hidden="true">
          <defs><path id="hero-circ" d="M60 60 m-44 0 a44 44 0 1 1 88 0 a44 44 0 1 1 -88 0" /></defs>
          <circle cx="60" cy="60" r="58" fill="#d6ff3f" stroke="#151515" strokeWidth="2.5" />
          <text fontSize="13" letterSpacing="2.6" fill="#151515" style={{ fontFamily: 'Anton, Impact, sans-serif' }}><textPath href="#hero-circ">SNITCH IT • SNITCH IT • SNITCH IT •</textPath></text>
          <path d="M60 40 L66 54 L80 60 L66 66 L60 80 L54 66 L40 60 L54 54 Z" fill="#ff4fa3" stroke="#151515" strokeWidth="2.5" strokeLinejoin="round" />
        </svg>
        <motion.div className="sticker s4" animate={rm ? {} : { rotate: [8, -4, 8] }} transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }}>NEW<br />DRIP</motion.div>
      </div>
      <Marquee text="SECOND CHANCE SEASON" className="hero-marquee" />
    </section>
  )
}

function Journeys() {
  const cards = [
    { n: '01', t: 'SHOP', d: 'Browse redesigned and upcycled pieces, ready to wear.', cta: 'BROWSE THE SHOP', href: '#shop', art: <GarmentArt type="look" tone="ink" label="A hoodie, cargo pants, cap and tote floating together" /> },
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

/* ---------- about + sustainability ---------- */
function About() {
  return (
    <section id="about" className="about pad">
      <div className="about-grid">
        <div>
          <Reveal><p className="label">BRAND STORY</p></Reveal>
          <Reveal><h2 className="big">WAIT, <em>THIS</em> IS A CLOTHING BRAND?</h2></Reveal>
          <Reveal delay={0.1}><p className="lead">Snitchy Style takes the stuff sitting at the back of your wardrobe (the jeans that don't fit, the tee you outgrew) and remixes it into one-off streetwear. Fashion first. The planet just happens to win too.</p></Reveal>
          <Reveal delay={0.15}><blockquote>{TAGLINE}</blockquote></Reveal>
        </div>
        <Reveal delay={0.1}>
          <div className="about-art">
            <GarmentArt type="look" tone="ink" label="A full streetwear look: hoodie, cargo pants, cap and tote" />
          </div>
        </Reveal>
      </div>
    </section>
  )
}

const LoopIcon = () => <svg viewBox="0 0 32 32" width="34" height="34" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M6 14a10 10 0 0 1 17-5l3 3M26 18a10 10 0 0 1-17 5l-3-3" /><path d="M26 5v7h-7M6 27v-7h7" /></svg>
const HangerIcon = () => <svg viewBox="0 0 32 32" width="34" height="34" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M16 11V9a3 3 0 1 0-3-3" /><path d="M16 11L3 21a2 2 0 0 0 1.2 3.6h23.6A2 2 0 0 0 29 21z" /></svg>
const PeopleIcon = () => <svg viewBox="0 0 32 32" width="34" height="34" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="11" r="4.5" /><path d="M3 27c0-5 4-8 9-8s9 3 9 8" /><circle cx="23" cy="12" r="3.5" /><path d="M24 19c3 .5 5 3 5 6" /></svg>

function Sustainability() {
  const stats = [
    [<LoopIcon />, 'Every piece reused', 'Clothes get a second life instead of a landfill.'],
    [<HangerIcon />, 'Less textile waste', 'We work with what already exists.'],
    [<PeopleIcon />, 'Local making jobs', 'Skilled makers and designers earn from reworking.'],
  ]
  return (
    <section id="sustainability" className="sustain pad">
      <Reveal><p className="label">SUSTAINABILITY</p><h2 className="big sm">SECOND CHANCE, <em>ZERO GUILT</em></h2></Reveal>
      <div className="stats">
        {stats.map(([i, t, d], k) => <Reveal key={t} delay={k * 0.1}><div className="stat"><b aria-hidden="true">{i}</b><h3>{t}</h3><p>{d}</p></div></Reveal>)}
      </div>
      <Reveal><a href="#remake" className="btn accent">GIVE YOUR OLD FIT A SECOND CHANCE</a></Reveal>
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
      <main><Hero /><Journeys /><Trending /><Shop /><Remake /><About /><Sustainability /></main>
      <Footer />
      <Radio />
    </CartProvider>
  )
}
