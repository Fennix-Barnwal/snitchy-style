// Browser-side helpers for THREADI. The AI itself runs on the server (/api/threadi); no key lives here.

const MAX_RAW = 15 * 1024 * 1024 // raw upload limit before we shrink the photo
export const MAX_PHOTOS = 4

// Shrinks a photo in the browser so several fit in one request (Vercel's body limit is ~4.5 MB).
export async function prepareImage(file) {
  if (!file || !file.type.startsWith('image/')) throw new Error('That file is not an image.')
  if (file.size > MAX_RAW) throw new Error('That photo is over 15 MB. Please pick a smaller one.')
  const bitmap = await createImageBitmap(file).catch(() => null)
  if (!bitmap) throw new Error("We couldn't read that image. Try a JPG or PNG.")
  const scale = Math.min(1, 1280 / Math.max(bitmap.width, bitmap.height))
  const w = Math.max(1, Math.round(bitmap.width * scale)); const h = Math.max(1, Math.round(bitmap.height * scale))
  const canvas = document.createElement('canvas'); canvas.width = w; canvas.height = h
  const ctx = canvas.getContext('2d')
  ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, w, h) // flatten transparent PNGs
  ctx.drawImage(bitmap, 0, 0, w, h)
  bitmap.close?.()
  const blob = await new Promise((res) => canvas.toBlob(res, 'image/jpeg', 0.82))
  if (!blob) throw new Error("We couldn't process that image.")
  const name = (file.name || 'photo').replace(/\.[^.]+$/, '') + '.jpg'
  const out = new File([blob], name, { type: 'image/jpeg' })
  const data = await new Promise((res, rej) => { const r = new FileReader(); r.onload = () => res(String(r.result).split(',')[1]); r.onerror = rej; r.readAsDataURL(out) })
  return { file: out, data, mediaType: 'image/jpeg' }
}

// 'checking' states are handled by the component; this returns 'ready' | 'not_configured' | 'unreachable'.
export async function checkThreadi() {
  try {
    const res = await fetch('/api/threadi', { cache: 'no-store' })
    if (!res.ok) return 'unreachable'
    const json = await res.json()
    return json.configured ? 'ready' : 'not_configured'
  } catch { return 'unreachable' }
}

export async function callThreadi(payload) {
  const ctrl = new AbortController()
  const timer = setTimeout(() => ctrl.abort(), 65000)
  try {
    const res = await fetch('/api/threadi', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload), signal: ctrl.signal })
    let json = null
    try { json = await res.json() } catch { /* not JSON */ }
    if (!res.ok || !json?.ok) {
      const err = new Error(json?.message || (res.status === 413 ? 'Those photos are too large. Try fewer or smaller photos.' : 'THREADI could not answer right now. Please try again.'))
      err.code = json?.code || (res.status === 404 ? 'unreachable' : 'error')
      throw err
    }
    return json
  } catch (e) {
    if (e.code) throw e
    const err = new Error(e.name === 'AbortError' ? 'THREADI took too long to answer. Please try again.' : "Couldn't reach THREADI. Check your connection and try again.")
    err.code = 'network'
    throw err
  } finally { clearTimeout(timer) }
}

// Maps THREADI's free-text garment type onto the Custom Re-Make form's dropdown.
export function mapGarment(type = '') {
  const t = type.toLowerCase()
  if (/hood|sweat|jumper|sweater|pullover|fleece/.test(t)) return 'Hoodie / sweater'
  if (/jacket|coat|bomber|blazer|windbreaker|parka/.test(t)) return 'Jacket'
  if (/jean|denim pant|trouser|pant|cargo|short|skirt|legging|jogger/.test(t)) return 'Jeans / trousers'
  if (/t-?shirt|tee|tank|top/.test(t)) return 'T-shirt'
  if (/shirt|blouse|flannel/.test(t)) return 'Shirt'
  if (/bag|tote|backpack|purse/.test(t)) return 'Bag'
  if (/cap|hat|beanie/.test(t)) return 'Cap / hat'
  return 'Other'
}
