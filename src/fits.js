// ─────────────────────────────────────────────────────────────
// FIT OF THE DAY: outfit recipes + the daily / random pickers.
//
// Each piece is { slot, label, art, tone, product? }.
//  - `product` is a real id from PRODUCTS in data.js. Only those pieces get a "view in shop" link,
//    and their art/tone must match the shop item (checked in dev by `validateFits`).
//  - Pieces without `product` are style ideas only: they are shown as "not in the shop".
// slots: top | bottom | shoes | head | acc
// ─────────────────────────────────────────────────────────────
import { PRODUCTS } from './data.js'

export const FITS = [
  { id: 'midnight-drip', name: 'MIDNIGHT DRIP', vibe: 'ALT R&B / NIGHT MODE', colours: ['Ink black', 'Acid green', 'Lilac'], pieces: [
    { slot: 'top', label: 'Zip-up graphic hoodie', art: 'zip', tone: 'ink', product: 'zip-up-hoodie' },
    { slot: 'bottom', label: 'Utility cargo pants', art: 'cargo', tone: 'acid', product: 'utility-cargos' },
    { slot: 'shoes', label: 'Chunky sneakers', art: 'sneaker', tone: 'ink' },
    { slot: 'head', label: 'Everyday beanie', art: 'beanie', tone: 'ink', product: 'everyday-beanie' },
    { slot: 'acc', label: 'Crossbody sling bag', art: 'sling', tone: 'lilac', product: 'crossbody-sling' },
  ] },
  { id: 'retro-chaos', name: 'RETRO CHAOS', vibe: 'Y2K / THROWBACK', colours: ['Hot pink', 'Sage green', 'Bone'], pieces: [
    { slot: 'top', label: 'Y2K baby tee', art: 'croptee', tone: 'pink', product: 'y2k-baby-tee' },
    { slot: 'bottom', label: 'Baggy wide-leg denim', art: 'wide', tone: 'sage', product: 'baggy-wide-leg' },
    { slot: 'shoes', label: 'Chunky sneakers', art: 'sneaker', tone: 'bone' },
    { slot: 'head', label: 'Graphic bucket hat', art: 'bucket', tone: 'pink', product: 'graphic-bucket-hat' },
    { slot: 'acc', label: 'Mini everyday wallet', art: 'wallet', tone: 'sand', product: 'mini-wallet' },
  ] },
  { id: 'urban-rebel', name: 'URBAN REBEL', vibe: 'STREET UTILITY', colours: ['Rust orange', 'Acid green', 'Ink'], pieces: [
    { slot: 'top', label: 'Statement bomber', art: 'bomber', tone: 'rust', product: 'statement-bomber' },
    { slot: 'bottom', label: 'Utility cargo pants', art: 'cargo', tone: 'acid', product: 'utility-cargos' },
    { slot: 'shoes', label: 'Chunky sneakers', art: 'sneaker', tone: 'ink' },
    { slot: 'head', label: 'Six-panel cap', art: 'cap', tone: 'ink' },
    { slot: 'acc', label: 'Everyday graphic tote', art: 'tote', tone: 'rust', product: 'everyday-tote' },
  ] },
  { id: 'denim-after-dark', name: 'DENIM AFTER DARK', vibe: 'DOUBLE DENIM', colours: ['Washed blue', 'Ink', 'Acid green'], pieces: [
    { slot: 'top', label: 'Denim street jacket', art: 'jacket', tone: 'denim', product: 'denim-jacket' },
    { slot: 'bottom', label: 'Baggy stacked jeans', art: 'jeans', tone: 'denim' },
    { slot: 'shoes', label: 'Chunky sneakers', art: 'sneaker', tone: 'ink' },
    { slot: 'head', label: 'Everyday beanie', art: 'beanie', tone: 'ink', product: 'everyday-beanie' },
    { slot: 'acc', label: 'Denim teddy', art: 'teddy', tone: 'denim', product: 'denim-teddy' },
  ] },
  { id: 'off-duty-energy', name: 'OFF-DUTY ENERGY', vibe: 'RELAXED WEEKEND', colours: ['Bone', 'Sand', 'Electric blue'], pieces: [
    { slot: 'top', label: 'Box-fit graphic tee', art: 'tee', tone: 'bone', product: 'box-fit-graphic-tee' },
    { slot: 'bottom', label: 'Relaxed denim shorts', art: 'shorts', tone: 'sand' },
    { slot: 'shoes', label: 'Chunky sneakers', art: 'sneaker', tone: 'bone' },
    { slot: 'head', label: 'Six-panel cap', art: 'cap', tone: 'volt' },
    { slot: 'acc', label: 'Mini everyday wallet', art: 'wallet', tone: 'sand', product: 'mini-wallet' },
  ] },
  { id: 'graphic-grind', name: 'GRAPHIC GRIND', vibe: 'OVERSIZED EVERYTHING', colours: ['Electric blue', 'Washed blue', 'Acid green'], pieces: [
    { slot: 'top', label: 'Oversized hoodie', art: 'hoodie', tone: 'volt', product: 'oversized-hoodie' },
    { slot: 'bottom', label: 'Baggy stacked jeans', art: 'jeans', tone: 'denim' },
    { slot: 'shoes', label: 'Chunky sneakers', art: 'sneaker', tone: 'bone' },
    { slot: 'head', label: 'Printed bandana', art: 'bandana', tone: 'volt', product: 'streetwear-bandana' },
    { slot: 'acc', label: 'Crossbody sling bag', art: 'sling', tone: 'lilac', product: 'crossbody-sling' },
  ] },
  { id: 'soft-launch', name: 'SOFT LAUNCH', vibe: 'CLEAN & LAYERED', colours: ['Sand', 'Sage green', 'Lilac'], pieces: [
    { slot: 'top', label: 'Utility overshirt', art: 'shirt', tone: 'sand', product: 'reworked-utility-shirt' },
    { slot: 'bottom', label: 'Baggy wide-leg denim', art: 'wide', tone: 'sage', product: 'baggy-wide-leg' },
    { slot: 'shoes', label: 'Chunky sneakers', art: 'sneaker', tone: 'bone' },
    { slot: 'head', label: 'Everyday beanie', art: 'beanie', tone: 'ink', product: 'everyday-beanie' },
    { slot: 'acc', label: 'Crossbody sling bag', art: 'sling', tone: 'lilac', product: 'crossbody-sling' },
  ] },
  { id: 'neon-club-kid', name: 'NEON CLUB KID', vibe: 'HYPERPOP / AFTER PARTY', colours: ['Hot pink', 'Washed blue', 'Acid green'], pieces: [
    { slot: 'top', label: 'Y2K baby tee', art: 'croptee', tone: 'pink', product: 'y2k-baby-tee' },
    { slot: 'bottom', label: 'Relaxed denim shorts', art: 'shorts', tone: 'denim' },
    { slot: 'shoes', label: 'Chunky sneakers', art: 'sneaker', tone: 'pink' },
    { slot: 'head', label: 'Six-panel cap', art: 'cap', tone: 'acid' },
    { slot: 'acc', label: 'Denim teddy', art: 'teddy', tone: 'denim', product: 'denim-teddy' },
  ] },
  { id: 'subway-static', name: 'SUBWAY STATIC', vibe: 'STREETWEAR SHIRT + SHORTS', colours: ['Sand', 'Washed blue', 'Rust orange'], pieces: [
    { slot: 'top', label: 'Utility overshirt', art: 'shirt', tone: 'sand', product: 'reworked-utility-shirt' },
    { slot: 'bottom', label: 'Relaxed denim shorts', art: 'shorts', tone: 'denim' },
    { slot: 'shoes', label: 'Chunky sneakers', art: 'sneaker', tone: 'ink' },
    { slot: 'head', label: 'Six-panel cap', art: 'cap', tone: 'rust' },
    { slot: 'acc', label: 'Printed bandana', art: 'bandana', tone: 'volt', product: 'streetwear-bandana' },
  ] },
  { id: 'teddy-season', name: 'TEDDY SEASON', vibe: 'SOFT BUT LOUD', colours: ['Bone', 'Washed blue', 'Acid green'], pieces: [
    { slot: 'top', label: 'Box-fit graphic tee', art: 'tee', tone: 'bone', product: 'box-fit-graphic-tee' },
    { slot: 'bottom', label: 'Baggy stacked jeans', art: 'jeans', tone: 'denim' },
    { slot: 'shoes', label: 'Chunky sneakers', art: 'sneaker', tone: 'bone' },
    { slot: 'head', label: 'Graphic bucket hat', art: 'bucket', tone: 'pink', product: 'graphic-bucket-hat' },
    { slot: 'acc', label: 'Denim teddy', art: 'teddy', tone: 'denim', product: 'denim-teddy' },
  ] },
  { id: 'heavy-rotation', name: 'HEAVY ROTATION', vibe: 'TRAP / TOUR MERCH', colours: ['Ink black', 'Rust orange', 'Bone'], pieces: [
    { slot: 'top', label: 'Zip-up graphic hoodie', art: 'zip', tone: 'ink', product: 'zip-up-hoodie' },
    { slot: 'bottom', label: 'Baggy wide-leg denim', art: 'wide', tone: 'sage', product: 'baggy-wide-leg' },
    { slot: 'shoes', label: 'Chunky sneakers', art: 'sneaker', tone: 'bone' },
    { slot: 'head', label: 'Six-panel cap', art: 'cap', tone: 'rust' },
    { slot: 'acc', label: 'Everyday graphic tote', art: 'tote', tone: 'rust', product: 'everyday-tote' },
  ] },
  { id: 'golden-hour', name: 'GOLDEN HOUR', vibe: 'OUTERWEAR SEASON', colours: ['Washed blue', 'Sand', 'Acid green'], pieces: [
    { slot: 'top', label: 'Denim street jacket', art: 'jacket', tone: 'denim', product: 'denim-jacket' },
    { slot: 'bottom', label: 'Baggy wide-leg denim', art: 'wide', tone: 'sage', product: 'baggy-wide-leg' },
    { slot: 'shoes', label: 'Chunky sneakers', art: 'sneaker', tone: 'bone' },
    { slot: 'head', label: 'Graphic bucket hat', art: 'bucket', tone: 'pink', product: 'graphic-bucket-hat' },
    { slot: 'acc', label: 'Mini everyday wallet', art: 'wallet', tone: 'sand', product: 'mini-wallet' },
  ] },
  { id: 'acid-reflux', name: 'ACID REFLUX', vibe: 'LOUD & LAYERED', colours: ['Acid green', 'Ink', 'Hot pink'], pieces: [
    { slot: 'top', label: 'Oversized hoodie', art: 'hoodie', tone: 'volt', product: 'oversized-hoodie' },
    { slot: 'bottom', label: 'Utility cargo pants', art: 'cargo', tone: 'acid', product: 'utility-cargos' },
    { slot: 'shoes', label: 'Chunky sneakers', art: 'sneaker', tone: 'pink' },
    { slot: 'head', label: 'Printed bandana', art: 'bandana', tone: 'volt', product: 'streetwear-bandana' },
    { slot: 'acc', label: 'Crossbody sling bag', art: 'sling', tone: 'lilac', product: 'crossbody-sling' },
  ] },
]

export const SLOT_LABEL = { top: 'TOP / LAYER', bottom: 'BOTTOMS', shoes: 'SHOES', head: 'HEADWEAR', acc: 'ACCESSORY' }

/* ---------- date → daily pick ---------- */
// Calendar day number in the visitor's own timezone (changes at their local midnight).
export function dayNumber(d = new Date()) {
  return Math.floor(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / 86400000)
}

function mulberry32(a) {
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// Every outfit is used once before any repeats; each cycle has its own shuffle.
function basePermutation(cycle, n) {
  const rnd = mulberry32(0x5717c4 + cycle * 7919)
  const a = Array.from({ length: n }, (_, i) => i)
  for (let i = n - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [a[i], a[j]] = [a[j], a[i]] }
  return a
}

export function dailyFit(date = new Date(), list = FITS) {
  const n = list.length
  const day = dayNumber(date)
  const cycle = Math.floor(day / n)
  const perm = basePermutation(cycle, n)
  // never repeat across the cycle boundary
  if (cycle > 0 && n > 2 && perm[0] === basePermutation(cycle - 1, n)[n - 1]) [perm[0], perm[1]] = [perm[1], perm[0]]
  return list[perm[day % n]]
}

export function randomFit(excludeId, list = FITS) {
  const pool = list.filter((f) => f.id !== excludeId)
  return pool[Math.floor(Math.random() * pool.length)]
}

// Dev guard: linked products must exist and look like the shop item.
export function validateFits() {
  const problems = []
  FITS.forEach((f) => f.pieces.forEach((p) => {
    if (!p.product) return
    const prod = PRODUCTS.find((x) => x.id === p.product)
    if (!prod) problems.push(`${f.id}: unknown product ${p.product}`)
    else if (prod.art !== p.art || prod.tone !== p.tone) problems.push(`${f.id}: ${p.product} art/tone differ from the shop item`)
  }))
  return problems
}
