import { useCallback, useEffect, useRef, useState } from 'react'
import { RADIO } from './data.js'

/*
 * STITCHY RADIO
 *
 * Compact by default (one slim bar) and expandable for the full controls.
 * Audio only: tracks are individual Spotify embeds driven through Spotify's official iFrame API,
 * so Next / Previous / shuffle are genuine track-level controls. Nothing is downloaded or bundled.
 *
 *  - The queue is shuffled once per browser session (sessionStorage); a new session reshuffles and
 *    avoids opening with the track the previous session opened with.
 *  - Nothing plays until the visitor presses play (or Next / Previous / a track in the list).
 *  - Spotify is only contacted after that first interaction.
 *
 * Limits that come from Spotify, not from this site: only logged-in Spotify users hear full songs
 * (everyone else gets 30-second previews) and Spotify exposes no volume control to web pages.
 */

const API_SRC = 'https://open.spotify.com/embed/iframe-api/v1'
const SESSION_KEY = 'stitchy-radio-queue'
const LAST_KEY = 'stitchy-radio-last-opener'
const TRACKS = RADIO.tracks || []
const IDS = TRACKS.map((t) => t.id)
const byId = (id) => TRACKS.find((t) => t.id === id)

function freshOrder(avoidFirst) {
  const a = [...IDS]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  if (a.length > 1 && a[0] === avoidFirst) {
    const k = 1 + Math.floor(Math.random() * (a.length - 1));
    [a[0], a[k]] = [a[k], a[0]]
  }
  return a
}

function initialQueue() {
  try {
    const raw = JSON.parse(sessionStorage.getItem(SESSION_KEY) || 'null')
    if (raw && Array.isArray(raw.order) && raw.order.length === IDS.length && raw.order.every((i) => IDS.includes(i)) && Number.isInteger(raw.pos) && raw.pos >= 0 && raw.pos < IDS.length) return raw
  } catch { /* storage unavailable */ }
  let last = null
  try { last = localStorage.getItem(LAST_KEY) } catch { /* storage unavailable */ }
  const order = freshOrder(last)
  try { if (order[0]) localStorage.setItem(LAST_KEY, order[0]) } catch { /* storage unavailable */ }
  return { order, pos: 0 }
}

// Loads Spotify's iFrame API once.
let apiPromise = null
function loadSpotifyApi() {
  if (apiPromise) return apiPromise
  apiPromise = new Promise((resolve, reject) => {
    if (window.SpotifyIframeApi) return resolve(window.SpotifyIframeApi)
    const timer = setTimeout(() => { apiPromise = null; reject(new Error('timeout')) }, 12000)
    window.onSpotifyIframeApiReady = (api) => { clearTimeout(timer); window.SpotifyIframeApi = api; resolve(api) }
    const s = document.createElement('script')
    s.src = API_SRC
    s.async = true
    s.onerror = () => { clearTimeout(timer); apiPromise = null; reject(new Error('blocked')) }
    document.body.appendChild(s)
  })
  return apiPromise
}

const Icon = {
  prev: <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true"><path d="M6 5v14M19 5v14l-11-7z" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" /></svg>,
  next: <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true"><path d="M18 5v14M5 5v14l11-7z" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" /></svg>,
  play: <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M7 4.5v15l12-7.5z" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" /></svg>,
  pause: <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M7 5v14M17 5v14" stroke="currentColor" strokeWidth="4" strokeLinecap="round" /></svg>,
  shuffle: <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7h3c5 0 6 10 11 10h4M3 17h3c1.8 0 3-1.2 4-2.6M14 9.6C15 8.2 16 7 17 7h4M18 4l3 3-3 3M18 14l3 3-3 3" /></svg>,
}

export default function Radio() {
  const [expanded, setExpanded] = useState(false)
  const [queue, setQueue] = useState(initialQueue)
  const [embedWanted, setEmbedWanted] = useState(false) // true after the first user interaction
  const [status, setStatus] = useState('idle') // idle | loading | ready | error
  const [playing, setPlaying] = useState(false)

  const hostRef = useRef(null)
  const ctrlRef = useRef(null)
  const loadedRef = useRef(null) // track id currently loaded in the embed
  const wantPlayRef = useRef(false) // the visitor asked for sound (play / next / previous / ended while playing)
  const lastPosRef = useRef(0)
  const endedRef = useRef(false)
  const stepRef = useRef(null)

  const trackId = queue.order[queue.pos]
  const track = byId(trackId)
  const many = TRACKS.length > 1

  useEffect(() => {
    try { sessionStorage.setItem(SESSION_KEY, JSON.stringify(queue)) } catch { /* storage unavailable */ }
  }, [queue])

  // ----- queue moves -----
  const step = useCallback((dir) => {
    wantPlayRef.current = true
    setEmbedWanted(true)
    setQueue((q) => {
      if (dir > 0) {
        if (q.pos + 1 < q.order.length) return { order: q.order, pos: q.pos + 1 }
        return { order: freshOrder(q.order[q.pos]), pos: 0 } // new cycle, never the same track twice in a row
      }
      return { order: q.order, pos: q.pos > 0 ? q.pos - 1 : q.order.length - 1 }
    })
  }, [])
  stepRef.current = step

  const jump = (pos) => {
    wantPlayRef.current = true
    setEmbedWanted(true)
    setQueue((q) => ({ order: q.order, pos }))
  }

  // Reshuffle what is coming up; the current song keeps playing.
  const reshuffle = () => {
    setQueue((q) => {
      const cur = q.order[q.pos]
      const rest = freshOrder(null).filter((i) => i !== cur)
      return { order: [cur, ...rest], pos: 0 }
    })
  }

  // ----- Spotify embed -----
  useEffect(() => {
    if (!embedWanted || ctrlRef.current || !hostRef.current || !TRACKS.length) return
    let cancelled = false
    setStatus('loading')
    loadSpotifyApi().then((api) => {
      if (cancelled || !hostRef.current) return
      const el = document.createElement('div')
      hostRef.current.appendChild(el)
      loadedRef.current = trackId
      api.createController(el, { uri: `spotify:track:${trackId}`, width: '100%', height: 80, theme: 0 }, (ctrl) => {
        if (cancelled) return
        ctrlRef.current = ctrl
        ctrl.addListener('ready', () => {
          setStatus('ready')
          if (wantPlayRef.current) ctrl.play()
        })
        ctrl.addListener('playback_update', (e) => {
          const { isPaused, isBuffering, position = 0, duration = 0 } = e.data || {}
          setPlaying(!isPaused || !!isBuffering)
          if (!isPaused && position > 0) wantPlayRef.current = true
          // A finished song reports paused at 0 after having been near its end: move on.
          if (isPaused && position === 0 && lastPosRef.current > 0 && duration > 0 && lastPosRef.current >= duration - 2500 && !endedRef.current) {
            endedRef.current = true
            if (wantPlayRef.current) stepRef.current(1)
          }
          lastPosRef.current = position
        })
        setStatus('ready')
      })
    }).catch(() => { if (!cancelled) setStatus('error') })
    return () => { cancelled = true }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [embedWanted])

  // Load the new song whenever the queue moves.
  useEffect(() => {
    const ctrl = ctrlRef.current
    if (!ctrl || !trackId || loadedRef.current === trackId) return
    loadedRef.current = trackId
    endedRef.current = false
    lastPosRef.current = 0
    try {
      ctrl.loadUri(`spotify:track:${trackId}`)
      if (wantPlayRef.current) ctrl.play()
    } catch { setStatus('error') }
  }, [trackId, status])

  const toggle = () => {
    if (!TRACKS.length) return
    const ctrl = ctrlRef.current
    if (!ctrl) { wantPlayRef.current = true; setEmbedWanted(true); return }
    wantPlayRef.current = !playing
    try { ctrl.togglePlay() } catch { setStatus('error') }
  }

  const expand = () => { setExpanded((v) => !v); setEmbedWanted(true) }

  const busy = status === 'loading'
  const err = status === 'error'
  const artistLine = err ? 'SPOTIFY UNAVAILABLE' : busy ? 'LOADING…' : track ? track.artist : 'NO TRACKS ADDED'
  const upNext = queue.order.map((id, i) => ({ id, i, t: byId(id) })).filter((x) => x.t)

  return (
    <aside className={`radio ${expanded ? 'radio-expanded' : 'radio-collapsed'} ${playing ? 'is-playing' : ''}`} aria-label="Stitchy Radio">
      <div className="radio-bar">
        <div className="radio-disc" aria-hidden="true">
          <svg viewBox="0 0 48 48">
            <circle cx="24" cy="24" r="22" fill="#0b0b10" stroke="#d6ff3f" strokeWidth="2" />
            <circle cx="24" cy="24" r="15" fill="none" stroke="#fff" strokeOpacity=".12" />
            <circle cx="24" cy="24" r="9" fill="none" stroke="#fff" strokeOpacity=".12" />
            <path d="M24 14 L27 21 L34 24 L27 27 L24 34 L21 27 L14 24 L21 21 Z" fill="#ff4fa3" />
          </svg>
        </div>
        <div className="radio-meta" aria-live="polite">
          <span className="radio-kicker">
            STITCHY RADIO
            <span className={`eq ${playing ? 'on' : ''}`} aria-hidden="true">{[0, 1, 2, 3].map((i) => <i key={i} style={{ '--i': i }} />)}</span>
          </span>
          <b className="radio-title" title={track ? `${track.title} — ${track.artist}` : undefined}>{track ? track.title : 'AFTER HOURS ROTATION'}</b>
          <span className="radio-artist">{artistLine}</span>
        </div>
        <div className="radio-ctrls">
          {many && <button type="button" className="rbtn" onClick={() => step(-1)} aria-label="Previous track" title="Previous">{Icon.prev}</button>}
          <button type="button" className="rbtn rbtn-main" onClick={toggle} disabled={!TRACKS.length || err} aria-label={playing ? 'Pause' : 'Play'} aria-pressed={playing} title={playing ? 'Pause' : 'Play'}>{playing ? Icon.pause : Icon.play}</button>
          {many && <button type="button" className="rbtn" onClick={() => step(1)} aria-label="Next track" title="Next">{Icon.next}</button>}
          <button type="button" className="radio-toggle" onClick={expand} aria-expanded={expanded} aria-label={expanded ? 'Minimise music player' : 'Expand music player'} title={expanded ? 'Minimise player' : 'More controls'}>{expanded ? '−' : '+'}</button>
        </div>
      </div>

      {/* The Spotify embed stays mounted (so music keeps playing) and is only shown while expanded. */}
      <div className={`radio-embed ${expanded ? 'show' : ''}`} aria-hidden={!expanded}>
        <div ref={hostRef} className="radio-player-wrap" />
        {!embedWanted && expanded && <p className="radio-note">Press play to load the player.</p>}
      </div>

      {expanded && (
        <div className="radio-more">
          {err && <p className="radio-note warn" role="status">Spotify could not load (blocked or offline). You can still <a href={track ? `https://open.spotify.com/track/${track.id}` : RADIO.playlistUrl} target="_blank" rel="noopener noreferrer">open it on Spotify</a>.</p>}
          <div className="radio-row">
            <span className="radio-count">{track ? `${queue.pos + 1} / ${upNext.length} • ${track.genre.toUpperCase()}` : ''}</span>
            {many && <button type="button" className="rbtn wide" onClick={reshuffle} title="Reshuffle the queue">{Icon.shuffle}<span>SHUFFLE</span></button>}
          </div>
          {many && (
            <ol className="radio-list" aria-label="Queue">
              {upNext.map(({ id, i, t }) => (
                <li key={id}>
                  <button type="button" className={i === queue.pos ? 'on' : ''} aria-current={i === queue.pos ? 'true' : undefined} onClick={() => jump(i)}>
                    <span>{String(i + 1).padStart(2, '0')}</span><b>{t.title}</b><em>{t.artist}</em>
                  </button>
                </li>
              ))}
            </ol>
          )}
          <div className="radio-foot">
            <span>VOLUME: USE YOUR DEVICE</span>
            <a href={track ? `https://open.spotify.com/track/${track.id}` : RADIO.playlistUrl} target="_blank" rel="noopener noreferrer" className="radio-spotify">OPEN ON SPOTIFY ↗</a>
          </div>
        </div>
      )}
    </aside>
  )
}
