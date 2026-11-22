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

// Shop categories. `type` + `tone` pick the illustration shown for the category (empty states).
export const CATEGORIES = [
  { id: 'tshirts', label: 'T-Shirts', type: 'tee', tone: 'bone' },
  { id: 'shirts', label: 'Shirts', type: 'shirt', tone: 'sand' },
  { id: 'hoodies', label: 'Hoodies', type: 'hoodie', tone: 'volt' },
  { id: 'jackets', label: 'Jackets', type: 'bomber', tone: 'rust' },
  { id: 'bottomwear', label: 'Bottomwear', type: 'cargo', tone: 'sage' },
  { id: 'bags', label: 'Bags', type: 'sling', tone: 'ink' },
  { id: 'headwear', label: 'Headwear', type: 'bucket', tone: 'pink' },
  { id: 'accessories', label: 'Accessories', type: 'wallet', tone: 'lilac' },
  { id: 'looks', label: 'Full Looks', type: 'look', tone: 'ink' },
]

// Illustrated catalogue concepts. These are visual examples for the storefront, not
// confirmation of current stock or finished inventory. Prices remain TBA until supplied.
// `art` selects a purpose-drawn streetwear illustration from src/art/pieces.jsx.
export const PRODUCTS = [
  { id: 'box-fit-graphic-tee', name: 'BOX-FIT GRAPHIC TEE', category: 'tshirts', desc: 'Relaxed oversized fit with a bold front graphic.', price: null, art: 'tee', tone: 'bone' },
  { id: 'y2k-baby-tee', name: 'Y2K BABY TEE', category: 'tshirts', desc: 'A cropped silhouette with a playful throwback graphic.', price: null, art: 'croptee', tone: 'pink' },
  { id: 'reworked-utility-shirt', name: 'UTILITY OVERSHIRT', category: 'shirts', desc: 'An easy layer with a clean shape and contrast details.', price: null, art: 'shirt', tone: 'sand' },
  { id: 'zip-up-hoodie', name: 'ZIP-UP GRAPHIC HOODIE', category: 'hoodies', desc: 'A relaxed zip-up with bold graphic energy.', price: null, art: 'zip', tone: 'ink' },
  { id: 'oversized-hoodie', name: 'OVERSIZED HOODIE', category: 'hoodies', desc: 'Roomy streetwear proportions with a statement print.', price: null, art: 'hoodie', tone: 'volt' },
  { id: 'statement-bomber', name: 'STATEMENT BOMBER', category: 'jackets', desc: 'A bold outer layer with a modern bomber silhouette.', price: null, art: 'bomber', tone: 'rust' },
  { id: 'denim-jacket', name: 'DENIM STREET JACKET', category: 'jackets', desc: 'A relaxed denim layer made for everyday rotation.', price: null, art: 'jacket', tone: 'denim' },
  { id: 'baggy-wide-leg', name: 'BAGGY WIDE-LEG DENIM', category: 'bottomwear', desc: 'Loose, easy proportions with a laid-back fit.', price: null, art: 'wide', tone: 'sage' },
  { id: 'utility-cargos', name: 'UTILITY CARGO PANTS', category: 'bottomwear', desc: 'Roomy cargo styling with a street-ready silhouette.', price: null, art: 'cargo', tone: 'acid' },
  { id: 'everyday-tote', name: 'EVERYDAY GRAPHIC TOTE', category: 'bags', desc: 'A bold carry-all for your daily essentials.', price: null, art: 'tote', tone: 'rust' },
  { id: 'crossbody-sling', name: 'CROSSBODY SLING BAG', category: 'bags', desc: 'Compact hands-free carry with a statement shape.', price: null, art: 'sling', tone: 'lilac' },
  { id: 'graphic-bucket-hat', name: 'GRAPHIC BUCKET HAT', category: 'headwear', desc: 'A laid-back bucket shape with a standout graphic.', price: null, art: 'bucket', tone: 'pink' },
  { id: 'everyday-beanie', name: 'EVERYDAY BEANIE', category: 'headwear', desc: 'A clean, easy-to-style cold-weather essential.', price: null, art: 'beanie', tone: 'ink' },
  { id: 'streetwear-bandana', name: 'PRINTED BANDANA', category: 'accessories', desc: 'A versatile graphic accessory for your rotation.', price: null, art: 'bandana', tone: 'volt' },
  { id: 'mini-wallet', name: 'MINI EVERYDAY WALLET', category: 'accessories', desc: 'A compact everyday carry piece with graphic character.', price: null, art: 'wallet', tone: 'sand' },
  { id: 'layered-street-fit', name: 'LAYERED STREET LOOK', category: 'looks', desc: 'A styled outfit concept combining relaxed streetwear staples.', price: null, art: 'look', tone: 'ink' },
]

// "Trending silhouettes": illustrated style ideas (NOT products for sale, no prices).
// Each one pre-fills the Custom Re-make form so a customer can ask for that look.
export const TRENDING = [
  { id: 't-oversized', name: 'OVERSIZED GRAPHIC TEE', art: 'tee', tone: 'volt', garment: 'T-shirt', ask: 'Turn my old tee into an oversized, boxy graphic tee with a big chest print.' },
  { id: 't-zip', name: 'COLOUR-BLOCK ZIP HOODIE', art: 'zip', tone: 'ink', garment: 'Hoodie / sweater', ask: 'Rework my old hoodie into a colour-block zip-up with contrast sleeves.' },
  { id: 't-bomber', name: 'STATEMENT BOMBER', art: 'bomber', tone: 'rust', garment: 'Jacket', ask: 'Turn my old jacket into a bomber with rib trims and a bold chest band.' },
  { id: 't-cargo', name: 'BAGGY CARGOS', art: 'cargo', tone: 'sage', garment: 'Jeans / trousers', ask: 'Make my old trousers into baggy cargo pants with big side pockets.' },
  { id: 't-crop', name: 'Y2K BABY TEE', art: 'croptee', tone: 'pink', garment: 'T-shirt', ask: 'Cut my old tee into a boxy cropped Y2K top with a heart graphic.' },
  { id: 't-bucket', name: 'GRAPHIC BUCKET HAT', art: 'bucket', tone: 'acid', garment: 'Cap / hat', ask: 'Turn my old fabric into a bucket hat with a bold band print.' },
  { id: 't-sling', name: 'SLING BAG', art: 'sling', tone: 'lilac', garment: 'Bag', ask: 'Make a crossbody sling bag from my old clothes.' },
]

// Radio: official music video embed (YouTube IFrame API). No audio file is bundled or downloaded.
// If the embed is ever blocked for a region/account, the widget shows "Open on YouTube" instead.
export const RADIO = {
  videoId: '34Na4j8AVgA', // "The Weeknd - Starboy ft. Daft Punk (Official Video)" — please confirm this ID still embeds
  title: 'STARBOY',
  artist: 'THE WEEKND',
  feat: 'DAFT PUNK',
}

// Custom re-make: the four steps from the brief.
export const STEPS = [
  { t: 'SEND US YOUR OLD CLOTHES', d: 'Pack up the pieces you have stopped wearing and send them our way.' },
  { t: 'SHOW US YOUR DESIRED DESIGN', d: 'Upload a reference photo and describe the outfit you want.' },
  { t: 'WE TRANSFORM YOUR GARMENT', d: 'Our team reworks your old piece into the design you showed us.' },
  { t: 'RECEIVE YOUR NEW FIT', d: 'Get your new outfit, made from your own clothes.' },
]

export const GARMENTS = ['T-shirt', 'Shirt', 'Hoodie / sweater', 'Jacket', 'Jeans / trousers', 'Bag', 'Cap / hat', 'Other']
