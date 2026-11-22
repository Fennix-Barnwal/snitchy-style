import { useCallback, useEffect, useRef, useState } from 'react'
import { RADIO } from './data.js'

/* SNITCHY RADIO
   Plays the official video through YouTube's own IFrame API. Nothing is downloaded or bundled.
   - Never autoplays: the player is only created after the visitor presses play.
   - Lives at the App root, so playback continues while the visitor moves around the site.
   - While playing, the official video is shown (YouTube requires the embed to stay visible).
   - If the embed can't load or is blocked, the widget says so and links to YouTube. */

const WATCH_URL = `https://www.youtube.com/watch?v=${RADIO.videoId}`
const VOL_KEY = 'snitchy-radio-volume'

let apiPromise = null
function loadYT() {
  if (typeof window === 'undefined') return Promise.reject(new Error('no window'))
  if (window.YT && window.YT.Player) return Promise.resolve(window.YT)
  if (!apiPromise) {
    apiPromise = new Promise((resolve, reject) => {
      const prev = window.onYouTubeIframeAPIReady
      window.onYouTubeIframeAPIReady = () => { if (typeof prev === 'function') prev(); resolve(window.YT) }
      const s = document.createElement('script')
      s.src = 'https://www.youtube.com/iframe_api'
      s.async = true
      s.onerror = () => { apiPromise = null; reject(new Error('blocked')) }
      document.head.appendChild(s)
      setTimeout(() => { if (!(window.YT && window.YT.Player)) { apiPromise = null; reject(new Error('timeout')) } }, 10000)
    })
  }
  return apiPromise
}

const readVol = () => { try { const v = Number(localStorage.getItem(VOL_KEY)); return Number.isFinite(v) && v > 0 ? Math.min(100, v) : 70 } catch { return 70 } }

const Icon = {
  play: <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M7 4.5v15l13-7.5z" fill="currentColor" /></svg>,
  pause: <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M6 4h4.5v16H6zM13.5 4H18v16h-4.5z" fill="currentColor" /></svg>,
  spin: <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" className="radio-spinner"><circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" strokeWidth="3" strokeDasharray="36 20" strokeLinecap="round" /></svg>,
  vol: <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9z" fill="currentColor" /><path d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>,
  mute: <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9z" fill="currentColor" /><path d="M16 9l5 6M21 9l-5 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>,
}

export default function Radio() {
  const host = useRef(null)
  const player = useRef(null)
  const want = useRef(false)
  const watchdog = useRef(null)
  const volRef = useRef(readVol())
  const mutedRef = useRef(false)
  const warmed = useRef(false)
  const [status, setStatus] = useState('idle') // idle | loading | playing | paused | error
  const [volume, setVolume] = useState(volRef.current)
  const [muted, setMuted] = useState(false)
  const [note, setNote] = useState('')

  const playing = status === 'playing'
  const showVideo = status === 'loading' || status === 'playing'

  const warm = useCallback(() => {
    if (warmed.current) return
    warmed.current = true
    loadYT().catch(() => { warmed.current = false })
  }, [])

  const fail = useCallback((msg) => {
    clearTimeout(watchdog.current)
    want.current = false
    setNote(msg)
    setStatus('error')
  }, [])

  const armWatchdog = useCallback(() => {
    clearTimeout(watchdog.current)
    watchdog.current = setTimeout(() => {
      // Browser blocked the start (common on phones when the API loads after the tap): ask for another tap.
      setStatus((s) => (s === 'loading' ? 'paused' : s))
      setNote((n) => n || 'Your browser held back playback. Press play once more.')
    }, 4500)
  }, [])

  const create = useCallback(async () => {
    try {
      const YT = await loadYT()
      if (player.current || !host.current) return
      const mount = document.createElement('div')
      host.current.appendChild(mount)
      player.current = new YT.Player(mount, {
        videoId: RADIO.videoId,
        host: 'https://www.youtube-nocookie.com',
        width: '100%',
        height: '100%',
        playerVars: { autoplay: 1, controls: 0, disablekb: 1, fs: 0, rel: 0, playsinline: 1, modestbranding: 1, iv_load_policy: 3, origin: window.location.origin },
        events: {
          onReady: (e) => {
            e.target.setVolume(volRef.current)
            if (mutedRef.current) e.target.mute()
            if (want.current) e.target.playVideo()
            armWatchdog()
          },
          onStateChange: (e) => {
            const st = e.data
            if (st === 1 || st === 3) { clearTimeout(watchdog.current); setNote(''); setStatus('playing') }
            else if (st === 2) setStatus((s) => (s === 'error' ? s : 'paused'))
            else if (st === 0) { e.target.seekTo(0); e.target.playVideo() } // radio loops
          },
          onError: (e) => fail(e.data === 101 || e.data === 150 ? 'The video owner doesn’t allow embedding here.' : 'This track can’t be played right now.'),
        },
      })
    } catch {
      fail('Snitchy Radio can’t load right now.')
    }
  }, [armWatchdog, fail])

  const play = useCallback(() => {
    setNote('')
    want.current = true
    setStatus('loading')
    if (player.current && player.current.playVideo) { player.current.playVideo(); armWatchdog() } else create()
  }, [armWatchdog, create])

  const pause = useCallback(() => {
    want.current = false
    clearTimeout(watchdog.current)
    if (player.current && player.current.pauseVideo) player.current.pauseVideo()
    setStatus('paused')
  }, [])

  const toggle = () => (playing || status === 'loading' ? pause() : play())

  const onVolume = (e) => {
    const v = Number(e.target.value)
    setVolume(v); volRef.current = v
    try { localStorage.setItem(VOL_KEY, String(v)) } catch { /* storage unavailable */ }
    const p = player.current
    if (p && p.setVolume) { p.setVolume(v); if (v > 0 && mutedRef.current) { p.unMute(); mutedRef.current = false; setMuted(false) } }
  }
  const toggleMute = () => {
    const next = !mutedRef.current
    mutedRef.current = next; setMuted(next)
    const p = player.current
    if (p && p.mute) next ? p.mute() : p.unMute()
  }

  // Lock-screen / headset controls where the browser supports them.
  useEffect(() => {
    if (!('mediaSession' in navigator) || typeof window.MediaMetadata !== 'function') return
    try {
      navigator.mediaSession.metadata = new window.MediaMetadata({ title: RADIO.title, artist: `${RADIO.artist} ft. ${RADIO.feat}`, album: 'Snitchy Radio' })
      navigator.mediaSession.setActionHandler('play', play)
      navigator.mediaSession.setActionHandler('pause', pause)
    } catch { /* unsupported */ }
  }, [play, pause])

  useEffect(() => () => {
    clearTimeout(watchdog.current)
    try { player.current && player.current.destroy && player.current.destroy() } catch { /* already gone */ }
    player.current = null
  }, [])

  const label = status === 'error' ? 'UNAVAILABLE' : status === 'loading' ? 'TUNING IN…' : playing ? 'NOW PLAYING' : 'SNITCHY RADIO'

  return (
    <aside className={`radio ${showVideo ? 'open' : ''} ${status}`} aria-label="Snitchy Radio" onPointerEnter={warm} onFocus={warm} onTouchStart={warm}>
      <div className="radio-screen" aria-hidden={!showVideo}>
        <div ref={host} className="radio-host" />
      </div>
      <div className="radio-bar">
        <div className={`radio-disc ${playing ? 'spin' : ''}`} aria-hidden="true">
          <svg viewBox="0 0 48 48"><circle cx="24" cy="24" r="22" fill="#0b0b10" stroke="#d6ff3f" strokeWidth="2" /><circle cx="24" cy="24" r="15" fill="none" stroke="#fff" strokeOpacity=".12" /><circle cx="24" cy="24" r="9" fill="none" stroke="#fff" strokeOpacity=".12" /><path d="M24 14 L27 21 L34 24 L27 27 L24 34 L21 27 L14 24 L21 21 Z" fill="#ff4fa3" /></svg>
        </div>
        <div className="radio-meta">
          <span className="radio-kicker">{label}</span>
          <b className="radio-title">{RADIO.title}</b>
          <span className="radio-artist" title={`${RADIO.artist} ft. ${RADIO.feat}`}>{RADIO.artist}</span>
        </div>
        <div className={`eq ${playing ? 'on' : ''}`} aria-hidden="true">{[0, 1, 2, 3, 4].map((i) => <i key={i} style={{ '--i': i }} />)}</div>
        <button className="radio-play" onClick={toggle} aria-label={playing || status === 'loading' ? `Pause ${RADIO.title}` : `Play ${RADIO.title}`} disabled={status === 'error'}>
          {status === 'loading' ? Icon.spin : playing ? Icon.pause : Icon.play}
        </button>
      </div>
      <div className="radio-foot">
        <button className="radio-mute" onClick={toggleMute} aria-label={muted ? 'Unmute' : 'Mute'} aria-pressed={muted}>{muted || volume === 0 ? Icon.mute : Icon.vol}</button>
        <input type="range" min="0" max="100" value={muted ? 0 : volume} onChange={onVolume} aria-label="Volume" />
        <a href={WATCH_URL} target="_blank" rel="noopener noreferrer" className="radio-yt">YOUTUBE ↗</a>
      </div>
      <p className="radio-note" role="status" aria-live="polite">
        {note}{status === 'error' && <> <a href={WATCH_URL} target="_blank" rel="noopener noreferrer">Open on YouTube</a></>}
      </p>
    </aside>
  )
}
