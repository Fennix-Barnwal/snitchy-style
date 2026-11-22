// ─────────────────────────────────────────────────────────────
// STITCHY STYLE — content & configuration
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

export const TAGLINE = "Even your clothes deserve a second chance. Don't just throw it, STITCH it!"

export const NAV = [
  ['HOME', '#home'],
  ['SHOP', '#shop'],
  ['FIT OF THE DAY', '#fit'],
  ['THREADI', '#threadi'],
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
  { id: 'denim-teddy', name: 'DENIM TEDDY', category: 'accessories', desc: 'A plush teddy bear made from recycled denim jeans, with topstitch details and a pocket on its belly. Sits on a shelf or clips onto a bag.', price: null, art: 'teddy', tone: 'denim' },
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

// Radio: track-level playback through Spotify's official iFrame API (audio only, no video, nothing
// bundled or downloaded). Tracks are shuffled once per browser session, never autoplay, and the
// player can skip forwards and back because each track is its own authorised Spotify embed.
//
// `id` is the Spotify track ID (the part after open.spotify.com/track/). Add as many tracks as you
// like in any genre. After editing, run `npm run check:radio` (needs internet) to confirm that every
// ID really is the song named here: it asks Spotify's public oEmbed endpoint and prints mismatches.
//   verified: true  = the ID was confirmed against a Spotify link
//   verified: false = entered from memory, NOT yet checked. Run the check script before launch.
// Note: Spotify embeds play the full song only for visitors logged in to Spotify (30-second previews
// otherwise), and Spotify exposes no volume control to websites, so volume stays on the device.
export const RADIO = {
  playlistUrl: 'https://open.spotify.com/playlist/37i9dQZF1EIYf6cItAYzfX',
  tracks: [
    { id: '7MXVkk9YMctZqd1Srtv4MB', title: 'STARBOY', artist: 'THE WEEKND, DAFT PUNK', genre: 'Alt R&B', verified: false },
    { id: '3dhjNA0jGA8vHBQ1VdD6vV', title: 'I FEEL IT COMING', artist: 'THE WEEKND, DAFT PUNK', genre: 'Alt R&B', verified: true },
    { id: '0VjIjW4GlUZAMYd2vXMi3b', title: 'BLINDING LIGHTS', artist: 'THE WEEKND', genre: 'Synth-pop', verified: false },
    { id: '5QO79kh1waicV47BqGRL3g', title: 'SAVE YOUR TEARS', artist: 'THE WEEKND', genre: 'Alt R&B', verified: false },
    { id: '6gBFPUFcJLzWGx4lenP6h2', title: 'GOOSEBUMPS', artist: 'TRAVIS SCOTT', genre: 'Hip-hop', verified: false },
    { id: '2xLMifQCjDGFmkHkpNLD9h', title: 'SICKO MODE', artist: 'TRAVIS SCOTT', genre: 'Trap', verified: false },
    { id: '3eekarcy7kvN4yt5ZFzltW', title: 'HIGHEST IN THE ROOM', artist: 'TRAVIS SCOTT', genre: 'Trap', verified: false },
    { id: '1e1JKLEDKP7hEQzJfNAgPl', title: 'MAGNOLIA', artist: 'PLAYBOI CARTI', genre: 'Underground rap', verified: false },
    // Add Don Toliver, hyperpop, electronic and experimental tracks here, e.g.
    // { id: '<spotify track id>', title: 'SONG NAME', artist: 'ARTIST', genre: 'Hyperpop' },
  ],
}

// Custom re-make: the four steps from the brief.
export const STEPS = [
  { t: 'SEND US YOUR OLD CLOTHES', d: 'Pack up the pieces you have stopped wearing and send them our way.' },
  { t: 'SHOW US YOUR DESIRED DESIGN', d: 'Upload a reference photo and describe the outfit you want.' },
  { t: 'WE TRANSFORM YOUR GARMENT', d: 'Our team reworks your old piece into the design you showed us.' },
  { t: 'RECEIVE YOUR NEW FIT', d: 'Get your new outfit, made from your own clothes.' },
]

export const GARMENTS = ['T-shirt', 'Shirt', 'Hoodie / sweater', 'Jacket', 'Jeans / trousers', 'Bag', 'Cap / hat', 'Other']
