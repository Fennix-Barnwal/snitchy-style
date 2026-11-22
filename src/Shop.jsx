import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { CATEGORIES, PRODUCTS } from './data.js'
import { GarmentArt } from './art/Garments.jsx'
import { Reveal, useEscape, useLockBody } from './ui.jsx'
import { categoryLabel, priceText, typeOf, useCart } from './cart.jsx'

const jump = (hash) => setTimeout(() => document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth' }), 150)

function ProductCard({ p, i, onView }) {
  const { add } = useCart()
  return (
    <motion.article className="product" layout initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.97 }} transition={{ duration: 0.25 }}>
      <button className="product-art" onClick={() => onView(p)} aria-label={`View ${p.name}`}>
        <GarmentArt type={typeOf(p)} tone={p.tone} label={`${p.name} illustration`} />
        <span className="tag">{categoryLabel(p)}</span>
        <span className="idx" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
      </button>
      <div className="product-body">
        <div className="product-top"><h3>{p.name}</h3><span className="price">{priceText(p)}</span></div>
        <p>{p.desc}</p>
        <div className="card-actions">
          <button className="btn ghost small" onClick={() => onView(p)}>VIEW PRODUCT</button>
          <button className="btn black small" onClick={() => add(p.id)}>ADD TO CART</button>
        </div>
      </div>
    </motion.article>
  )
}

function ProductModal({ product, onClose }) {
  const { add } = useCart()
  const closeRef = useRef(null)
  useLockBody(!!product)
  useEscape(!!product, onClose)
  useEffect(() => { if (product) closeRef.current?.focus() }, [product])
  return (
    <AnimatePresence>
      {product && (
        <motion.div className="modal-wrap" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
          <motion.div className="modal" role="dialog" aria-modal="true" aria-label={product.name} onClick={(e) => e.stopPropagation()}
            initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 30, opacity: 0 }} transition={{ duration: 0.3, ease: [0.2, 0.7, 0.2, 1] }}>
            <button ref={closeRef} className="icon-btn modal-close" onClick={onClose} aria-label="Close product">✕</button>
            <div className="modal-art"><GarmentArt type={typeOf(product)} tone={product.tone} label={`${product.name} illustration`} /></div>
            <div className="modal-info">
              <span className="tag static">{categoryLabel(product)}</span>
              <h2>{product.name}</h2>
              <p className="price big-price">{priceText(product)}</p>
              <p className="modal-desc">{product.desc}</p>
              <dl className="details">
                <div><dt>CATEGORY</dt><dd>{categoryLabel(product)}</dd></div>
                <div><dt>PRICE</dt><dd>{priceText(product)}</dd></div>
                <div><dt>SIZES</dt><dd>To be announced</dd></div>
                <div><dt>CONCEPT</dt><dd>Illustrative style direction</dd></div>
              </dl>
              <p className="fine">Illustration and listing are style concepts. This is a demo cart, so nothing can be purchased yet.</p>
              <button className="btn black" onClick={() => add(product.id)}>ADD TO CART</button>
              <button className="link-btn" onClick={() => { onClose(); jump('#remake') }}>Want your own version? Try a custom re-make →</button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default function Shop() {
  const [cat, setCat] = useState('all')
  const [viewing, setViewing] = useState(null)
  const list = cat === 'all' ? PRODUCTS : PRODUCTS.filter((p) => p.category === cat)
  const active = CATEGORIES.find((c) => c.id === cat)
  const closeModal = useCallback(() => setViewing(null), [])
  const rm = useReducedMotion()

  // Fit of the Day can open a real product directly.
  useEffect(() => {
    const on = (e) => { const p = PRODUCTS.find((x) => x.id === e.detail?.id); if (p) setViewing(p) }
    window.addEventListener('stitchy:view-product', on)
    return () => window.removeEventListener('stitchy:view-product', on)
  }, [])

  return (
    <section id="shop" className="shop pad">
      <Reveal>
        <p className="label">THE SHOP</p>
        <h2 className="big">SHOP THE <em>FITS</em></h2>
        <p className="lead">Streetwear style concepts, reworked from clothes that already exist. Explore the looks and ask us about a custom version.</p>
      </Reveal>

      <div className="chips" role="group" aria-label="Filter by category">
        {[{ id: 'all', label: 'All' }, ...CATEGORIES].map((c) => {
          const n = c.id === 'all' ? PRODUCTS.length : PRODUCTS.filter((p) => p.category === c.id).length
          return (
            <button key={c.id} className={`chip ${cat === c.id ? 'on' : ''}`} aria-pressed={cat === c.id} onClick={() => setCat(c.id)}>
              {c.label}<span>{n}</span>
            </button>
          )
        })}
      </div>

      <motion.div className="product-grid" layout={!rm}>
        <AnimatePresence mode="popLayout">
          {list.map((p, i) => <ProductCard key={p.id} p={p} i={i} onView={setViewing} />)}
        </AnimatePresence>
      </motion.div>

      {list.length === 0 && (
        <div className="empty" role="status">
          <div className="empty-art"><GarmentArt type={active?.type || 'tee'} tone={active?.tone || 'sand'} label={`${active?.label} illustration`} /></div>
          <div>
            <h3>NO {active?.label.toUpperCase()} IN THE SHOP YET</h3>
            <p>Nothing has been listed in this category. Got an old one at the back of your wardrobe? Let us rework it.</p>
            <a className="btn black small" href="#remake">START A CUSTOM RE-MAKE</a>
            <button className="link-btn" onClick={() => setCat('all')}>Show everything</button>
          </div>
        </div>
      )}

      <ProductModal product={viewing} onClose={closeModal} />
    </section>
  )
}
