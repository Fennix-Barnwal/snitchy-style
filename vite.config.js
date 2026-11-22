import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// Lets `npm run dev` and `npm run preview` serve /api/threadi the same way Vercel does in production,
// using the same server-side code (api/_threadi-core.js). The API key is read from .env here, on the
// server side of Vite, and is never bundled into the browser code.
function threadiApi(env) {
  const handler = async (req, res) => {
    const { run, status } = await import('./api/_threadi-core.js')
    const send = (code, json) => { res.statusCode = code; res.setHeader('Content-Type', 'application/json'); res.setHeader('Cache-Control', 'no-store'); res.end(JSON.stringify(json)) }
    if (req.method === 'GET') return send(200, status(env))
    if (req.method !== 'POST') return send(405, { ok: false, code: 'method', message: 'Method not allowed' })
    const chunks = []; let size = 0
    for await (const c of req) { size += c.length; if (size > 6_000_000) return send(413, { ok: false, code: 'bad_request', message: 'Request too large.' }); chunks.push(c) }
    let body
    try { body = JSON.parse(Buffer.concat(chunks).toString('utf8')) } catch { return send(400, { ok: false, code: 'bad_request', message: 'Invalid JSON.' }) }
    try { const out = await run(body, env); send(out.status, out.json) } catch { send(500, { ok: false, code: 'server', message: 'Something went wrong on the server.' }) }
  }
  return {
    name: 'threadi-api',
    configureServer(server) { server.middlewares.use('/api/threadi', handler) },
    configurePreviewServer(server) { server.middlewares.use('/api/threadi', handler) },
  }
}

export default defineConfig(({ mode }) => {
  const env = { ...loadEnv(mode, process.cwd(), ''), ...process.env }
  return { plugins: [react(), threadiApi(env)] }
})
