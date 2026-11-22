import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { GarmentArt } from './art/Garments.jsx'
import { Magnetic, Reveal } from './ui.jsx'
import { useCart } from './cart.jsx'
import { MAX_PHOTOS, callThreadi, checkThreadi, mapGarment, prepareImage } from './services/threadi.js'

let uid = 0

function SetupNotice({ state }) {
  const down = state === 'unreachable'
  return (
    <div className="th-setup" role="status">
      <b>{down ? "THREADI'S SERVER ISN'T REACHABLE" : "THREADI'S AI ISN'T CONNECTED YET"}</b>
      <p>
        {down
          ? "The /api/threadi function isn't running on this site, so there is no AI analysis here. If you're the site owner, deploy to Vercel or use `npm run dev`."
          : 'To switch on the AI analysis, the site owner adds an ANTHROPIC_API_KEY environment variable (see the README), then redeploys. Nothing is analysed and no suggestions are invented until then.'}
      </p>
      <p><b>PREVIEW MODE:</b> you can still add photos, describe what you want and send it to Custom Re-Make below. No AI is involved.</p>
    </div>
  )
}

function Field({ label, children }) {
  return <div className="th-fact"><dt>{label}</dt><dd>{children}</dd></div>
}

export default function Threadi() {
  const { notify } = useCart()
  const [service, setService] = useState('checking') // checking | ready | not_configured | unreachable
  const [photos, setPhotos] = useState([])
  const [note, setNote] = useState('')
  const [dropErr, setDropErr] = useState('')
  const [busyPhotos, setBusyPhotos] = useState(false)
  const [drag, setDrag] = useState(false)
  const [goal, setGoal] = useState(null)

  const [run, setRun] = useState({ status: 'idle', error: '' }) // analysis
  const [analysis, setAnalysis] = useState(null)
  const [ideaId, setIdeaId] = useState(null)

  const [vision, setVision] = useState('')
  const [refine, setRefine] = useState({ status: 'idle', error: '' })
  const [chat, setChat] = useState([])
  const [design, setDesign] = useState(null)
  const [followUps, setFollowUps] = useState([])
  const urls = useRef([])
  const root = useRef(null)

  useEffect(() => { checkThreadi().then(setService) }, [])
  useEffect(() => () => urls.current.forEach((u) => URL.revokeObjectURL(u)), [])

  // Fit of the Day → "recreate this with my old clothes"
  useEffect(() => {
    const on = (e) => {
      const g = e.detail
      if (!g?.name) return
      setGoal(g)
      setVision((v) => v.trim() ? v : `I want to recreate the "${g.name}" fit (${g.vibe.toLowerCase()}): ${g.pieces.join('; ')}.`)
      setAnalysis(null); setIdeaId(null); setDesign(null); setChat([]); setFollowUps([])
    }
    window.addEventListener('stitchy:threadi-goal', on)
    return () => window.removeEventListener('stitchy:threadi-goal', on)
  }, [])

  const ai = service === 'ready'
  const idea = analysis?.ideas.find((i) => i.id === ideaId) || null

  const addFiles = useCallback(async (fileList) => {
    const files = [...(fileList || [])]
    if (!files.length) return
    setDropErr('')
    const room = MAX_PHOTOS - photos.length
    if (room <= 0) return setDropErr(`You can add up to ${MAX_PHOTOS} photos. Remove one to add another.`)
    setBusyPhotos(true)
    const added = []
    let problem = ''
    for (const f of files.slice(0, room)) {
      try {
        const p = await prepareImage(f)
        const url = URL.createObjectURL(p.file); urls.current.push(url)
        added.push({ id: ++uid, url, ...p })
      } catch (e) { problem = e.message }
    }
    if (files.length > room) problem = `Only ${MAX_PHOTOS} photos fit, so the extras were skipped.`
    setPhotos((cur) => [...cur, ...added])
    if (added.length) { setAnalysis(null); setIdeaId(null); setDesign(null); setRun({ status: 'idle', error: '' }) }
    setDropErr(problem)
    setBusyPhotos(false)
  }, [photos.length])

  const removePhoto = (id) => {
    setPhotos((cur) => cur.filter((p) => p.id !== id))
    setAnalysis(null); setIdeaId(null); setDesign(null); setRun({ status: 'idle', error: '' })
  }

  const handleErr = (e, set) => {
    if (e.code === 'not_configured') setService('not_configured')
    set({ status: 'error', error: e.message })
  }

  const analyse = async () => {
    if (!photos.length || !ai) return
    setRun({ status: 'loading', error: '' }); setAnalysis(null); setIdeaId(null); setDesign(null); setChat([]); setFollowUps([])
    try {
      const out = await callThreadi({ mode: 'analyse', images: photos.map((p) => ({ mediaType: p.mediaType, data: p.data })), note, goal })
      setAnalysis(out.analysis)
      setRun({ status: 'done', error: '' })
    } catch (e) { handleErr(e, setRun) }
  }

  const sendVision = async (text = vision) => {
    const msg = text.trim()
    if (msg.length < 5) return setRefine({ status: 'error', error: 'Tell THREADI a little more about what you want.' })
    if (!ai) return
    setRefine({ status: 'loading', error: '' })
    try {
      const out = await callThreadi({ mode: 'refine', analysis, idea, vision: msg, goal, history: chat.slice(-6) })
      setChat((c) => [...c, { role: 'user', text: msg }, { role: 'ai', text: out.reply }])
      setDesign(out.design); setFollowUps(out.followUps || []); setVision('')
      setRefine({ status: 'idle', error: '' })
    } catch (e) { handleErr(e, setRefine) }
  }

  const makeWithUs = () => {
    const lastVision = [...chat].reverse().find((m) => m.role === 'user')?.text || vision.trim()
    const first = analysis?.items?.[0]
    const lines = []
    if (design) {
      lines.push(`THREADI concept (AI-generated idea, not a final product): ${design.title}. ${design.summary}`)
      if (design.details.length) lines.push(`Details: ${design.details.join('; ')}.`)
      if (design.fabricPlan) lines.push(`Fabric plan: ${design.fabricPlan}`)
    } else if (idea) lines.push(`THREADI idea (AI-generated, not a final product): ${idea.title}. ${idea.why}`)
    if (lastVision) lines.push(`What I asked for: ${lastVision}`)
    if (goal) lines.push(`Outfit I want to recreate: ${goal.name} (${goal.vibe}): ${goal.pieces.join('; ')}.`)
    if (note.trim()) lines.push(`About my clothes: ${note.trim()}`)
    if (photos.length > 1) lines.push(`I uploaded ${photos.length} photos in THREADI; the first is attached here and I can send the rest.`)
    window.dispatchEvent(new CustomEvent('stitchy:prefill', {
      detail: {
        fromThreadi: true,
        garment: first ? mapGarment(first.type) : (photos.length ? 'Other' : ''),
        description: lines.join('\n\n'),
        existingFile: photos[0]?.file || null,
      },
    }))
    document.querySelector('#request')?.scrollIntoView({ behavior: 'smooth' })
    notify('Sent to your Custom Re-Make request')
  }

  const canMake = photos.length > 0 && (design || idea || vision.trim().length >= 5 || chat.length > 0)
  const items = analysis?.items || []

  return (
    <section id="threadi" ref={root} className="threadi pad">
      <Reveal>
        <p className="label">THREADI</p>
        <h2 className="big">YOUR PERSONAL <em>AI TAILOR.</em></h2>
        <p className="lead">Upload your old clothes. THREADI reads what it can see, suggests what they could become, and helps you shape the design before you send it to us.</p>
      </Reveal>

      {(service === 'not_configured' || service === 'unreachable') && <SetupNotice state={service} />}

      <div className="th-grid">
        {/* ---------- STEP 1 ---------- */}
        <div className="th-panel">
          <h3 className="th-h"><span>01</span> UPLOAD YOUR OLD CLOTHES</h3>
          {goal && (
            <p className="th-goal">GOAL OUTFIT: <b>{goal.name}</b> <button type="button" onClick={() => setGoal(null)} aria-label="Remove goal outfit">✕</button></p>
          )}
          <label className={`drop th-drop ${drag ? 'drag' : ''}`} onDragOver={(e) => { e.preventDefault(); setDrag(true) }} onDragLeave={() => setDrag(false)} onDrop={(e) => { e.preventDefault(); setDrag(false); addFiles(e.dataTransfer.files) }}>
            <input type="file" accept="image/*" multiple aria-label="Choose photos of your old clothes" onChange={(e) => { addFiles(e.target.files); e.target.value = '' }} />
            <b>{busyPhotos ? 'Preparing photos…' : 'Choose photos'}</b>
            <span>Jeans, shirts, hoodies, jackets, tees. Up to {MAX_PHOTOS} photos, one item per photo works best.</span>
          </label>
          {dropErr && <p className="th-err" role="alert">{dropErr}</p>}
          {photos.length > 0 && (
            <ul className="th-thumbs" aria-label="Your photos">
              {photos.map((p, i) => (
                <li key={p.id}>
                  <img src={p.url} alt={`Photo ${i + 1} of your old clothes`} />
                  <button type="button" onClick={() => removePhoto(p.id)} aria-label={`Remove photo ${i + 1}`}>✕</button>
                </li>
              ))}
            </ul>
          )}
          <div className="field">
            <label htmlFor="th-note" className="flabel">TELL THREADI ABOUT THEM (OPTIONAL)</label>
            <textarea id="th-note" rows="3" maxLength={1000} value={note} onChange={(e) => setNote(e.target.value)} placeholder="e.g. two pairs of blue jeans, one is a bit faded, both are too small" />
          </div>
          <Magnetic>
            <button type="button" className="btn black" onClick={analyse} disabled={!photos.length || !ai || run.status === 'loading'}>
              {run.status === 'loading' ? 'THREADI IS LOOKING…' : ai ? 'ANALYSE MY CLOTHES' : service === 'checking' ? 'CHECKING AI…' : 'AI NOT CONNECTED'}
            </button>
          </Magnetic>
          {run.status === 'error' && <p className="th-err" role="alert">{run.error}</p>}
          {ai && !photos.length && <p className="fine">Add at least one photo to start.</p>}
        </div>

        {/* ---------- STEPS 2-5 ---------- */}
        <div className="th-panel th-out" aria-live="polite">
          {run.status === 'loading' && (
            <div className="th-loading" role="status">
              <div className="th-needle" aria-hidden="true"><i /><i /><i /></div>
              <b>THREADI IS READING YOUR PHOTOS…</b>
              <span>This usually takes 10 to 20 seconds.</span>
            </div>
          )}

          {!analysis && run.status !== 'loading' && (
            <div className="th-empty">
              <h3 className="th-h"><span>02</span> WHAT THREADI SEES</h3>
              <p>{ai ? 'Upload your photos and press “Analyse my clothes”. THREADI will describe the garment type, colour, fabric, pattern, visible condition and reusable sections, then suggest remakes.' : 'AI analysis appears here once THREADI is connected. Until then you can use preview mode: describe what you want below and send it to Custom Re-Make.'}</p>
            </div>
          )}

          {analysis && (
            <>
              <h3 className="th-h"><span>02</span> WHAT THREADI SEES</h3>
              <p className="th-lead">{analysis.overall}</p>
              <ul className="th-items">
                {items.map((it, i) => (
                  <li key={i} className="th-item">
                    {photos[(it.photo || i + 1) - 1] && <img src={photos[(it.photo || i + 1) - 1].url} alt={`Photo ${(it.photo || i + 1)}`} />}
                    <dl>
                      <Field label="ITEM">{it.type}</Field>
                      <Field label="COLOUR">{it.colour}</Field>
                      <Field label="FABRIC">{it.fabric}</Field>
                      <Field label="PATTERN">{it.pattern}</Field>
                      <Field label="CONDITION">{it.condition}</Field>
                      {it.reusableSections.length > 0 && <Field label="REUSABLE">{it.reusableSections.join(', ')}</Field>}
                    </dl>
                    <span className={`th-conf ${it.confidence}`}>{it.confidence.toUpperCase()} CONFIDENCE</span>
                  </li>
                ))}
              </ul>
              <p className="fine">AI reads of photos can be wrong, especially fabric and condition. Our team checks your actual clothes.</p>

              <h3 className="th-h"><span>03</span> WHAT THEY COULD BECOME</h3>
              <ul className="th-ideas">
                {analysis.ideas.map((i) => (
                  <li key={i.id}>
                    <button type="button" className={`th-idea ${i.id === ideaId ? 'on' : ''}`} aria-pressed={i.id === ideaId} onClick={() => setIdeaId(i.id === ideaId ? null : i.id)}>
                      <span className="th-idea-art"><GarmentArt type={i.art} tone={i.tone} label={`${i.title} illustration`} /></span>
                      <b>{i.title}</b>
                      <small>{i.why}</small>
                      <em>{i.difficulty.toUpperCase()}{i.watchOut ? ` · ${i.watchOut}` : ''}</em>
                    </button>
                  </li>
                ))}
              </ul>
              {analysis.question && <p className="th-q">THREADI ASKS: {analysis.question}</p>}
            </>
          )}

          {/* ---------- STEP 4 ---------- */}
          {(analysis || !ai) && (
            <div className="th-vision">
              <h3 className="th-h"><span>04</span> TELL THREADI YOUR VISION</h3>
              {chat.length > 0 && (
                <ul className="th-chat" aria-label="Conversation with THREADI">
                  {chat.map((m, i) => <li key={i} className={m.role}><b>{m.role === 'ai' ? 'THREADI' : 'YOU'}</b>{m.text}</li>)}
                </ul>
              )}
              <div className="field">
                <label htmlFor="th-vision" className="flabel">WHAT DO YOU WANT?</label>
                <textarea id="th-vision" rows="3" maxLength={1500} value={vision} onChange={(e) => { setVision(e.target.value); if (refine.status === 'error') setRefine({ status: 'idle', error: '' }) }} placeholder="e.g. I have two old pairs of blue jeans. I want a stylish oversized denim jacket." />
              </div>
              {ai ? (
                <button type="button" className="btn accent small" onClick={() => sendVision()} disabled={refine.status === 'loading' || !analysis}>{refine.status === 'loading' ? 'THREADI IS THINKING…' : design ? 'REFINE THE DESIGN' : 'DESIGN IT WITH THREADI'}</button>
              ) : (
                <p className="fine">Preview mode: your description goes straight to Custom Re-Make. THREADI's AI isn't involved.</p>
              )}
              {followUps.length > 0 && (
                <div className="th-follow">{followUps.map((f) => <button key={f} type="button" className="chip" onClick={() => setVision(f)}>{f}</button>)}</div>
              )}
              {refine.status === 'error' && <p className="th-err" role="alert">{refine.error}</p>}
            </div>
          )}

          {/* ---------- STEP 5 ---------- */}
          <AnimatePresence>
            {design && (
              <motion.div key={design.title + design.summary} className="th-design" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
                <h3 className="th-h"><span>05</span> THE PROPOSED DESIGN</h3>
                <div className="th-compare">
                  <div className="th-yours">
                    <p className="th-cap">YOUR OLD CLOTHES</p>
                    <ul>{photos.map((p, i) => <li key={p.id}><img src={p.url} alt={`Your photo ${i + 1}`} /></li>)}</ul>
                  </div>
                  <span className="th-arrow" aria-hidden="true">→</span>
                  <div className="th-concept">
                    <p className="th-cap">THREADI CONCEPT</p>
                    <div className="th-concept-art"><GarmentArt type={design.art} tone={design.tone} label={`${design.title} illustrated reference`} /></div>
                  </div>
                </div>
                <p className="th-honest"><b>ILLUSTRATED REFERENCE, NOT A RENDER.</b> This picture is a drawing of the kind of piece, not an AI-generated photo of your clothes remade. The written concept is AI-generated and is a starting point, not a guaranteed final product. The result depends on your fabric and our tailors.</p>
                <h4 className="th-title">{design.title}</h4>
                <p>{design.summary}</p>
                {design.details.length > 0 && <ul className="th-details">{design.details.map((d) => <li key={d}>{d}</li>)}</ul>}
                {design.fabricPlan && <p><b>FROM YOUR CLOTHES:</b> {design.fabricPlan}</p>}
                {design.styling.length > 0 && <p><b>STYLE IT:</b> {design.styling.join(' · ')}</p>}
                {design.limits && <p className="th-limit"><b>HEADS UP:</b> {design.limits}</p>}
              </motion.div>
            )}
          </AnimatePresence>

          {/* ---------- STEP 6 ---------- */}
          <div className="th-make">
            <h3 className="th-h"><span>06</span> MAKE IT REAL</h3>
            <p className="fine">Sends your photo, garment type and description into the Custom Re-Make form below, so you don't type it twice. You'll still add your contact details and review everything before sending.</p>
            <Magnetic><button type="button" className="btn accent" onClick={makeWithUs} disabled={!canMake}>MAKE THIS WITH STITCHY STYLE</button></Magnetic>
            {!canMake && <p className="fine">{photos.length ? 'Pick an idea or describe your vision to continue.' : 'Add a photo of your old clothes to continue.'}</p>}
          </div>
        </div>
      </div>
    </section>
  )
}
