// Custom re-make submission service.
//
// PROTOTYPE BEHAVIOUR: with no endpoint configured nothing is sent or stored and
// the function reports `sent: false`, so the UI can say so honestly.
//
// To go live, set VITE_REMAKE_ENDPOINT (e.g. in Vercel env vars) to a URL that
// accepts a multipart/form-data POST with the fields below, or replace the body
// of this function with a call to your own API / form service.
export const REMAKE_ENDPOINT = import.meta.env.VITE_REMAKE_ENDPOINT || ''

export async function submitRemakeRequest(values, files) {
  if (!REMAKE_ENDPOINT) return { ok: true, sent: false }
  const body = new FormData()
  Object.entries(values).forEach(([k, v]) => body.append(k, v))
  body.append('existingClothing', files.existing)
  body.append('referenceImage', files.reference)
  const res = await fetch(REMAKE_ENDPOINT, { method: 'POST', body })
  if (!res.ok) throw new Error(`Request failed (${res.status})`)
  return { ok: true, sent: true }
}
