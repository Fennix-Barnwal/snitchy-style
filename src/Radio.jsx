import { useState } from 'react'
import { RADIO } from './data.js'

/*
 * SNITCHY RADIO
 * Compact by default so it never dominates the page.
 * Expands on demand to reveal Spotify's official audio playlist embed.
 */
export default function Radio() {
  const [expanded, setExpanded] = useState(false)

  return (
    <aside className={`radio ${expanded ? 'radio-expanded' : 'radio-collapsed'}`} aria-label="Snitchy Radio">
      <div className="radio-bar">
        <div className="radio-disc" aria-hidden="true">
          <svg viewBox="0 0 48 48">
            <circle cx="24" cy="24" r="22" fill="#0b0b10" stroke="#d6ff3f" strokeWidth="2" />
            <circle cx="24" cy="24" r="15" fill="none" stroke="#fff" strokeOpacity=".12" />
            <circle cx="24" cy="24" r="9" fill="none" stroke="#fff" strokeOpacity=".12" />
            <path d="M24 14 L27 21 L34 24 L27 27 L24 34 L21 27 L14 24 L21 21 Z" fill="#ff4fa3" />
          </svg>
        </div>
        <div className="radio-meta">
          <span className="radio-kicker">SNITCHY RADIO</span>
          <b className="radio-title">AFTER HOURS ROTATION</b>
          <span className="radio-artist">THE WEEKND • DARK POP • SYNTH</span>
        </div>
        <div className="eq on" aria-hidden="true">{[0, 1, 2, 3, 4].map((i) => <i key={i} style={{ '--i': i }} />)}</div>
        <button
          type="button"
          className="radio-toggle"
          onClick={() => setExpanded((value) => !value)}
          aria-expanded={expanded}
          aria-label={expanded ? 'Minimise music player' : 'Expand music player'}
          title={expanded ? 'Minimise player' : 'Open player'}
        >
          {expanded ? '−' : '+'}
        </button>
      </div>

      {expanded && (
        <>
          <div className="radio-player-wrap">
            <iframe
              title="Snitchy Radio: The Weeknd and dark synth-pop playlist"
              src={`https://open.spotify.com/embed/playlist/${RADIO.playlistId}?utm_source=generator&theme=0`}
              width="100%"
              height="152"
              frameBorder="0"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
            />
          </div>
          <div className="radio-foot">
            <span>PLAY / PAUSE / SKIP</span>
            <a href={RADIO.playlistUrl} target="_blank" rel="noopener noreferrer" className="radio-spotify">SPOTIFY ↗</a>
          </div>
        </>
      )}
    </aside>
  )
}
