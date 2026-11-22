import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CATEGORIES, PRODUCTS } from './data.js'
import { GarmentArt } from './art/Garments.jsx'
import { useEscape, useLockBody } from './ui.jsx'

const KEY = 'stitchy-demo-cart'
const OLD_KEY = 'snitchy-demo-cart' // carts saved before the rename to STITCHY STYLE
const CartCtx = createContext(null)
export const useCart = () => useContext(CartCtx)

export const typeOf = (p) => p.art || (CATEGORIES.find((c) => c.id === p.category) || CATEGORIES[0]).type
export const categoryLabel = (p) => (CATEGORIES.find((c) => c.id === p.category) || {}).label || ''
const fmt = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })
export const priceText = (p) => (typeof p.price === 'number' ? fmt.format(p.price) : 'PRICE TBA')

function load() {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) || localStorage.getItem(OLD_KEY) || '[]')
    return raw.filter((r) => PRODUCTS.some((p) => p.id === r.id) && r.qty > 0)
  } catch { return [] }
}

export function CartProvider({ children }) {
  const [lines, setLines] = useState(load)
  const [open, setOpen] = useState(false)
  const [toast, setToast] = useState(null)
  const timer = useRef(null)

  useEffect(() => { try { localStorage.setItem(KEY, JSON.stringify(lines)) } catch { /* storage unavailable */ } }, [lines])

  const notify = useCallback((message, action) => {
    setToast({ message, action, id: Date.now() })
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setToast(null), 3200)
  }, [])

  const add = useCallback((id) => {
    const p = PRODUCTS.find((x) => x.id === id)
    if (!p) return
    setLines((ls) => ls.some((l) => l.id === id) ? ls.map((l) => l.id === id ? { ...l, qty: l.qty + 1 } : l) : [...ls, { id, qty: 1 }])
    notify(`${p.name} added to cart`, { label: 'VIEW CART', run: () => setOpen(true) })
  }, [notify])
  const setQty = useCallback((id, qty) => setLines((ls) => qty <= 0 ? ls.filter((l) => l.id !== id) : ls.map((l) => l.id === id ? { ...l, qty: Math.min(qty, 20) } : l)), [])
  const clear = useCallback(() => setLines([]), [])

  const value = useMemo(() => {
    const items = lines.map((l) => ({ ...l, product: PRODUCTS.find((p) => p.id === l.id) }))
    const count = items.reduce((n, i) => n + i.qty, 0)
    const priced = items.filter((i) => typeof i.product.price === 'number')
    const subtotal = priced.reduce((n, i) => n + i.product.price * i.qty, 0)
    const unpriced = items.length - priced.length
    return { items, count, subtotal, unpriced, add, setQty, clear, open, setOpen, notify }
  }, [lines, open, add, setQty, clear, notify])

  return (
    <CartCtx.Provider value={value}>
      {children}
      <CartDrawer />
      <Toast toast={toast} onClose={() => setToast(null)} />
    </CartCtx.Provider>
  )
}

function Toast({ toast, onClose }) {
  return (
    <div className="toast-region" aria-live="polite" role="status">
      <AnimatePresence>
        {toast && (
          <motion.div key={toast.id} className="toast" initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }} transition={{ duration: 0.25 }}>
            <span>{toast.message}</span>
            {toast.action && <button onClick={() => { toast.action.run(); onClose() }}>{toast.action.label}</button>}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function CartDrawer() {
  const { items, count, subtotal, unpriced, setQty, clear, open, setOpen } = useCart()
  const closeRef = useRef(null)
  const close = useCallback(() => setOpen(false), [setOpen])
  useLockBody(open)
  useEscape(open, close)
  useEffect(() => { if (open) closeRef.current?.focus() }, [open])
  const goTo = (hash) => { setOpen(false); setTimeout(() => { document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth' }) }, 200) }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div className="scrim" onClick={close} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
          <motion.aside className="drawer" role="dialog" aria-modal="true" aria-label="Shopping cart"
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'tween', duration: 0.32, ease: [0.2, 0.7, 0.2, 1] }}>
            <div className="drawer-head">
              <h2>YOUR CART <span>({count})</span></h2>
              <button ref={closeRef} className="icon-btn" onClick={close} aria-label="Close cart">✕</button>
            </div>
            <p className="demo-note"><b>DEMO CART.</b> Checkout isn't connected yet, so nothing here can be bought or paid for.</p>

            {items.length === 0 ? (
              <div className="drawer-empty">
                <GarmentArt type="tote" tone="sand" label="Empty tote bag" />
                <h3>NOTHING HERE YET</h3>
                <p>Browse the shop and add a piece you like.</p>
                <button className="btn black" onClick={() => goTo('#shop')}>GO TO SHOP</button>
              </div>
            ) : (
              <>
                <ul className="cart-list">
                  {items.map(({ product: p, qty }) => (
                    <li key={p.id}>
                      <div className="thumb"><GarmentArt type={typeOf(p)} tone={p.tone} still label={p.name} /></div>
                      <div className="cart-info">
                        <h3>{p.name}</h3>
                        <p>{categoryLabel(p)} · {priceText(p)}</p>
                        <div className="qty" role="group" aria-label={`Quantity for ${p.name}`}>
                          <button onClick={() => setQty(p.id, qty - 1)} aria-label="Decrease quantity">−</button>
                          <output aria-live="polite">{qty}</output>
                          <button onClick={() => setQty(p.id, qty + 1)} aria-label="Increase quantity">+</button>
                          <button className="link-btn" onClick={() => setQty(p.id, 0)}>Remove</button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="drawer-foot">
                  <div className="sum">
                    <span>SUBTOTAL</span>
                    <b>{unpriced === items.length ? 'PRICING TBA' : fmt.format(subtotal)}</b>
                  </div>
                  {unpriced > 0 && unpriced < items.length && <small>Excludes {unpriced} item{unpriced > 1 ? 's' : ''} without a price yet.</small>}
                  <button className="btn black" disabled aria-disabled="true">CHECKOUT — COMING SOON</button>
                  <div className="foot-row">
                    <button className="link-btn" onClick={close}>Continue shopping</button>
                    <button className="link-btn" onClick={clear}>Empty cart</button>
                  </div>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
