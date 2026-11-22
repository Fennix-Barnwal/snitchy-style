// Confirms that every Spotify track ID in RADIO.tracks (src/data.js) is the song it claims to be.
// Uses Spotify's public oEmbed endpoint (no account or key needed). Needs an internet connection.
//   npm run check:radio
import { RADIO } from '../src/data.js'

const norm = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()
let bad = 0
for (const t of RADIO.tracks) {
  const url = `https://open.spotify.com/oembed?url=${encodeURIComponent(`https://open.spotify.com/track/${t.id}`)}`
  try {
    const res = await fetch(url)
    if (!res.ok) { console.log(`✗ ${t.title} (${t.id}): Spotify returned ${res.status}. The ID is probably wrong.`); bad++; continue }
    const { title } = await res.json()
    const ok = norm(title).includes(norm(t.title)) || norm(t.title).includes(norm(title))
    console.log(`${ok ? '✓' : '✗'} listed "${t.title}" → Spotify says "${title}"`)
    if (!ok) bad++
  } catch (e) { console.log(`? ${t.title}: could not reach Spotify (${e.message})`); bad++ }
}
console.log(bad ? `\n${bad} track(s) need attention. Fix the ID or title in src/data.js.` : '\nAll radio tracks match.')
process.exit(bad ? 1 : 0)
