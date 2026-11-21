// ─────────────────────────────────────────────────────────────
// SNITCHY STYLE — content & configuration
// Everything an owner is likely to edit lives in this file.
// ─────────────────────────────────────────────────────────────

// Contact details. Only details that were actually provided are filled in.
// EMAIL: no real address exists in the project yet — add one below and the
// footer will automatically show a clickable mailto link.
export const CONTACT = {
  phoneDisplay: '8287715107',
  phoneHref: 'tel:+918287715107', // assumes an Indian number; remove "+91" if that is wrong
  email: '',
  // Add full profile URLs to show a social link in the footer. Empty = hidden.
  social: { Instagram: '', TikTok: '', Pinterest: '' },
}

export const TAGLINE = "Even your clothes deserve a second chance. Don't just throw it, Snitch it!"

export const NAV = [
  ['HOME', '#home'],
  ['SHOP', '#shop'],
  ['CUSTOM RE-MAKE', '#remake'],
  ['ABOUT', '#about'],
]

// Shop categories. `type` picks the illustration.
export const CATEGORIES = [
  { id: 'tshirts', label: 'T-Shirts', type: 'tee' },
  { id: 'shirts', label: 'Shirts', type: 'shirt' },
  { id: 'hoodies', label: 'Hoodies', type: 'hoodie' },
  { id: 'jackets', label: 'Jackets', type: 'jacket' },
  { id: 'bottomwear', label: 'Bottomwear', type: 'jeans' },
  { id: 'accessories', label: 'Accessories', type: 'tote' },
  { id: 'looks', label: 'Full Looks', type: 'look' },
]

// Products are the pieces that already existed on the site ("THE FITS").
// PRICES: none were supplied, so `price` is null and the UI shows "PRICE TBA".
// Set a number (in ₹) and it will display and add up in the cart automatically.
// `tone` only changes the colour of the illustration.
export const PRODUCTS = [
  { id: 'patchwork-denim-jacket', name: 'PATCHWORK DENIM JACKET', category: 'jackets', desc: 'Seven old jeans, one loud jacket.', price: null, tone: 'denim' },
  { id: 'oversized-graphic-tee', name: 'OVERSIZED GRAPHIC TEE', category: 'tshirts', desc: "Dad's tee, now hand-printed and boxy.", price: null, tone: 'bone' },
  { id: 'wide-leg-reworks', name: 'WIDE-LEG REWORKS', category: 'bottomwear', desc: 'Baggy, bleached, stitched with attitude.', price: null, tone: 'sage' },
  { id: 'y2k-crop-shirt', name: 'Y2K CROP SHIRT', category: 'shirts', desc: 'Office shirt chopped into a crop top.', price: null, tone: 'sand' },
  { id: 'embroidered-tote', name: 'EMBROIDERED TOTE', category: 'accessories', desc: 'Scrap fabric, big pockets, zero waste.', price: null, tone: 'rust' },
  { id: 'layered-street-fit', name: 'LAYERED STREET FIT', category: 'looks', desc: 'Three donated pieces, one outfit.', price: null, tone: 'ink' },
]

// Custom re-make: the four steps from the brief.
export const STEPS = [
  { t: 'SEND US YOUR OLD CLOTHES', d: 'Pack up the pieces you have stopped wearing and send them our way.' },
  { t: 'UPLOAD A REFERENCE', d: 'Show us the outfit you want with a photo or a design.' },
  { t: 'WE REDESIGN IT', d: 'Our makers cut, stitch and remix your clothes by hand to match your vision.' },
  { t: 'RECEIVE YOUR FIT', d: 'Get your customised outfit, made from your own clothes.' },
]

export const GARMENTS = ['T-shirt', 'Shirt', 'Hoodie / sweater', 'Jacket', 'Jeans / trousers', 'Other']
