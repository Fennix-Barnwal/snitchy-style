// Vercel serverless function: /api/threadi
//   GET  -> { configured: boolean }   (lets the page show a setup message instead of faking AI)
//   POST -> THREADI analysis / refinement (see _threadi-core.js)
import { run, status } from './_threadi-core.js'

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store')
  if (req.method === 'GET') return res.status(200).json(status(process.env))
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'GET, POST')
    return res.status(405).json({ ok: false, code: 'method', message: 'Method not allowed' })
  }
  let body = req.body
  if (typeof body === 'string') {
    try { body = JSON.parse(body) } catch { return res.status(400).json({ ok: false, code: 'bad_request', message: 'Invalid JSON.' }) }
  }
  try {
    const out = await run(body, process.env)
    return res.status(out.status).json(out.json)
  } catch {
    return res.status(500).json({ ok: false, code: 'server', message: 'Something went wrong on the server.' })
  }
}
