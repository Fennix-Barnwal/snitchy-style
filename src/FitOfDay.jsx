import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { FITS, SLOT_LABEL, dailyFit, dayNumber, randomFit } from './fits.js'
import { PRODUCTS } from './data.js'
import OutfitArt from './art/OutfitArt.jsx'
import { Magnetic, Reveal } from './ui.jsx'

const dateLabel = (d) => d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' }).toUpperCase()

// Re-renders when the visitor's local calendar day changes (so a tab left open overnight updates).
function useToday() {
  const [today, setToday] = useState(() => new Date())
  useEffect(() => {
    const next = new Date(); next.setHours(24, 0, 2, 0)
    const t = setTimeout(() => setToday(new Date()), Math.max(1000, next - Date.now()))
    return () => clearTimeout(t)
  }, [today])
  return today
}

export default function FitOfDay() {
  const today = useToday()
  const daily = useMemo(() => dailyFit(today), [dayNumber(today)]) // eslint-disable-line react-hooks/exhaustive-deps
  const [picked, setPicked] = useState(null) // a randomly generated fit, or null = show today's fit
  const fit = picked || daily
  const isDaily = !picked

  const generate = () => setPicked(randomFit(fit.id))
  const viewProduct = (id) => window.dispatchEvent(new CustomEvent('stitchy:view-product', { detail: { id } }))
  const recreate = () => {
    window.dispatchEvent(new CustomEvent('stitchy:threadi-goal', {
      detail: { name: fit.name, vibe: fit.vibe, colours: fit.colours, pieces: fit.pieces.map((p) => `${SLOT_LABEL[p.slot].toLowerCase()}: ${p.label}`) },
    }))
    document.querySelector('#threadi')?.scrollIntoView({ behavior: 'smooth' })
  }

  const accessories = fit.pieces.filter((p) => p.slot === 'head' || p.slot === 'acc' || p.slot === 'shoes')
  const main = fit.pieces.filter((p) => !accessories.includes(p))

  const row = (p) => {
    const shop = p.product && PRODUCTS.some((x) => x.id === p.product)
    return (
      <li key={p.slot} className="fit-piece">
        <span className="fit-slot">{SLOT_LABEL[p.slot]}</span>
        <b>{p.label}</b>
        {shop
          ? <button type="button" className="fit-link" onClick={() => viewProduct(p.product)}>VIEW IN SHOP →</button>
          : <em className="fit-nostock">STYLE IDEA · NOT IN SHOP</em>}
      </li>
    )
  }

  return (
    <section id="fit" className="fit pad">
      <Reveal>
        <p className="label">FIT OF THE DAY</p>
        <h2 className="big">A NEW FIT. <em>EVERY DAY.</em></h2>
      </Reveal>

      <AnimatePresence mode="wait">
        <motion.div key={fit.id + (isDaily ? 'd' : 'r')} className="fit-card" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.35, ease: [0.2, 0.7, 0.2, 1] }}>
          <div className="fit-art"><OutfitArt pieces={fit.pieces} label={`${fit.name} outfit illustration: ${fit.pieces.map((p) => p.label).join(', ')}`} /></div>
          <div className="fit-info">
            <div className="fit-tags">
              <span className={`fit-badge ${isDaily ? 'daily' : ''}`}>{isDaily ? `TODAY · ${dateLabel(today)}` : 'RANDOM FIT'}</span>
              <span className="fit-badge">{fit.vibe}</span>
            </div>
            <h3 className="fit-name">{fit.name}</h3>
            <div className="fit-colours" aria-label="Colour combination">
              {fit.colours.map((c) => <span key={c}>{c.toUpperCase()}</span>)}
            </div>
            <p className="fit-sub">THE PIECES</p>
            <ul className="fit-list">{main.map(row)}</ul>
            <p className="fit-sub">ACCESSORIES</p>
            <ul className="fit-list">{accessories.map(row)}</ul>
            <div className="fit-actions">
              <Magnetic><button type="button" className="btn accent" onClick={generate}>GENERATE ANOTHER FIT</button></Magnetic>
              {!isDaily && <button type="button" className="btn ghost light" onClick={() => setPicked(null)}>BACK TO TODAY'S FIT</button>}
              <button type="button" className="btn light" onClick={recreate}>RECREATE THIS WITH MY OLD CLOTHES</button>
            </div>
            <p className="fine">Outfits are illustrated style ideas. Only pieces marked &ldquo;view in shop&rdquo; are in the catalogue, and the demo cart can&rsquo;t be checked out yet.</p>
          </div>
        </motion.div>
      </AnimatePresence>
      <p className="fit-count" aria-hidden="true">{FITS.length} FITS IN ROTATION</p>
    </section>
  )
}
