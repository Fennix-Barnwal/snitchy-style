import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { GARMENTS } from './data.js'
import { submitRemakeRequest, REMAKE_ENDPOINT } from './services/remake.js'
import { useCart } from './cart.jsx'
import { Magnetic } from './ui.jsx'

const MAX = 5 * 1024 * 1024
const EMPTY = { name: '', email: '', phone: '', garment: '', description: '' }

function validate(f, files) {
  const e = {}
  if (f.name.trim().length < 2) e.name = 'Tell us your name.'
  if (!/^\S+@\S+\.\S+$/.test(f.email.trim())) e.email = 'Enter a valid email address.'
  const digits = f.phone.replace(/[\s\-()+]/g, '')
  if (!/^\d{10,13}$/.test(digits)) e.phone = 'Enter a valid phone number (10 to 13 digits).'
  if (!f.garment) e.garment = 'Pick the type of clothing you are sending.'
  if (f.description.trim().length < 10) e.description = 'Describe the design you want (at least a short sentence).'
  if (!files.existing) e.existing = 'Add a photo of the clothing you are sending.'
  if (!files.reference) e.reference = 'Add a reference image of the outfit you want.'
  return e
}

function Upload({ id, label, hint, file, preview, error, onPick, onClear }) {
  const [drag, setDrag] = useState(false)
  const drop = (e) => { e.preventDefault(); setDrag(false); onPick(e.dataTransfer.files[0]) }
  return (
    <div className={`field ${error ? 'err' : ''}`}>
      <span className="flabel" id={`${id}-l`}>{label}</span>
      {preview ? (
        <div className="preview-box">
          <img src={preview} alt={`Preview of ${file.name}`} />
          <div><b>{file.name}</b><small>{(file.size / 1024).toFixed(0)} KB</small>
            <button type="button" className="link-btn" onClick={onClear}>Remove</button></div>
        </div>
      ) : (
        <label className={`drop ${drag ? 'drag' : ''}`} onDragOver={(e) => { e.preventDefault(); setDrag(true) }} onDragLeave={() => setDrag(false)} onDrop={drop}>
          <input id={id} type="file" accept="image/*" aria-labelledby={`${id}-l`} aria-describedby={error ? `${id}-e` : undefined} onChange={(e) => onPick(e.target.files[0])} />
          <b>Choose image</b><span>{hint}</span>
        </label>
      )}
      {error && <em id={`${id}-e`} role="alert">{error}</em>}
    </div>
  )
}

export default function RemakeForm() {
  const { notify } = useCart()
  const [f, setF] = useState(EMPTY)
  const [files, setFiles] = useState({ existing: null, reference: null })
  const [previews, setPreviews] = useState({ existing: null, reference: null })
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | sending | done | failed
  const [sent, setSent] = useState(false)
  const formRef = useRef(null)
  const urls = useRef({})

  // "Trending" cards and THREADI can pre-fill the form (see Trending.jsx and Threadi.jsx).
  // THREADI may also hand over the customer's photo and a full description.
  const pickExisting = useRef(null)
  useEffect(() => {
    const on = (e) => {
      const { garment, ask, description, existingFile, fromThreadi } = e.detail || {}
      setF((cur) => ({
        ...cur,
        garment: garment || cur.garment,
        description: fromThreadi && description ? description : (cur.description.trim() ? cur.description : ask || ''),
      }))
      setErrors((er) => ({ ...er, garment: undefined, description: undefined, existing: existingFile ? undefined : er.existing }))
      if (fromThreadi) setStatus('idle')
      if (existingFile) pickExisting.current?.(existingFile)
    }
    window.addEventListener('stitchy:prefill', on)
    return () => window.removeEventListener('stitchy:prefill', on)
  }, [])

  useEffect(() => () => Object.values(urls.current).forEach((u) => u && URL.revokeObjectURL(u)), [])

  const set = (k) => (e) => { setF({ ...f, [k]: e.target.value }); if (errors[k]) setErrors({ ...errors, [k]: undefined }) }

  const pick = (k) => (file) => {
    if (!file) return
    if (!file.type.startsWith('image/')) return setErrors((er) => ({ ...er, [k]: 'That file is not an image.' }))
    if (file.size > MAX) return setErrors((er) => ({ ...er, [k]: 'Image is too large. Please keep it under 5 MB.' }))
    if (urls.current[k]) URL.revokeObjectURL(urls.current[k])
    const url = URL.createObjectURL(file)
    urls.current[k] = url
    setFiles((s) => ({ ...s, [k]: file })); setPreviews((s) => ({ ...s, [k]: url })); setErrors((er) => ({ ...er, [k]: undefined }))
  }
  pickExisting.current = pick('existing')
  const clear = (k) => () => {
    if (urls.current[k]) URL.revokeObjectURL(urls.current[k])
    urls.current[k] = null
    setFiles((s) => ({ ...s, [k]: null })); setPreviews((s) => ({ ...s, [k]: null }))
  }

  const submit = async (e) => {
    e.preventDefault()
    const er = validate(f, files)
    setErrors(er)
    if (Object.keys(er).length) {
      notify('Please fix the highlighted fields.')
      const first = formRef.current?.querySelector('.err input, .err select, .err textarea, .err .drop input')
      first?.focus()
      return
    }
    setStatus('sending')
    try {
      const res = await submitRemakeRequest(f, files)
      setSent(res.sent)
      setStatus('done')
      notify(res.sent ? 'Request sent.' : 'Prototype form: nothing was sent.')
    } catch {
      setStatus('failed')
      notify('Something went wrong. Please try again.')
    }
  }

  const reset = () => {
    Object.values(urls.current).forEach((u) => u && URL.revokeObjectURL(u))
    urls.current = {}
    setF(EMPTY); setFiles({ existing: null, reference: null }); setPreviews({ existing: null, reference: null }); setErrors({}); setStatus('idle')
  }

  if (status === 'done') {
    return (
      <motion.div className="done" initial={{ scale: 0.96, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} role="status">
        <h3>{sent ? 'REQUEST SENT' : 'FORM CHECKED. NOTHING SENT.'}</h3>
        <p>
          {sent
            ? `Thanks, ${f.name.trim().split(' ')[0]}. We have your request.`
            : `Thanks, ${f.name.trim().split(' ')[0]}. This form is still a prototype, so your details and images were not sent or stored. Please contact us directly using the details in the footer.`}
        </p>
        <button className="btn black small" onClick={reset}>START ANOTHER</button>
      </motion.div>
    )
  }

  const text = (k, label, props = {}) => (
    <div className={`field ${errors[k] ? 'err' : ''}`}>
      <label htmlFor={`rm-${k}`} className="flabel">{label}</label>
      <input id={`rm-${k}`} value={f[k]} onChange={set(k)} aria-invalid={!!errors[k]} aria-describedby={errors[k] ? `rm-${k}-e` : undefined} {...props} />
      {errors[k] && <em id={`rm-${k}-e`} role="alert">{errors[k]}</em>}
    </div>
  )

  return (
    <form ref={formRef} onSubmit={submit} noValidate aria-label="Custom re-make request">
      {text('name', 'CUSTOMER NAME', { autoComplete: 'name' })}
      <div className="two">
        {text('email', 'EMAIL ADDRESS', { type: 'email', autoComplete: 'email', inputMode: 'email' })}
        {text('phone', 'PHONE NUMBER', { type: 'tel', autoComplete: 'tel', inputMode: 'tel' })}
      </div>
      <div className={`field ${errors.garment ? 'err' : ''}`}>
        <label htmlFor="rm-garment" className="flabel">TYPE OF CLOTHING YOU ARE SENDING</label>
        <select id="rm-garment" value={f.garment} onChange={set('garment')} aria-invalid={!!errors.garment}>
          <option value="">Select…</option>
          {GARMENTS.map((g) => <option key={g}>{g}</option>)}
        </select>
        {errors.garment && <em role="alert">{errors.garment}</em>}
      </div>
      <div className={`field ${errors.description ? 'err' : ''}`}>
        <label htmlFor="rm-description" className="flabel">DESIRED DESIGN</label>
        <textarea id="rm-description" rows="4" value={f.description} onChange={set('description')} placeholder="e.g. Turn my old tee into a boxy cropped top with a big heart graphic" aria-invalid={!!errors.description} />
        {errors.description && <em role="alert">{errors.description}</em>}
      </div>
      <div className="two">
        <Upload id="rm-existing" label="PHOTO OF YOUR EXISTING CLOTHING" hint="JPG or PNG, up to 5 MB" file={files.existing} preview={previews.existing} error={errors.existing} onPick={pick('existing')} onClear={clear('existing')} />
        <Upload id="rm-reference" label="REFERENCE IMAGE OF DESIRED OUTFIT" hint="JPG or PNG, up to 5 MB" file={files.reference} preview={previews.reference} error={errors.reference} onPick={pick('reference')} onClear={clear('reference')} />
      </div>
      <Magnetic><button className="btn black" type="submit" disabled={status === 'sending'}>{status === 'sending' ? 'SENDING…' : 'SUBMIT REQUEST'}</button></Magnetic>
      {status === 'failed' && <em className="form-err" role="alert">We could not send your request. Please try again or contact us using the footer details.</em>}
      {!REMAKE_ENDPOINT && <small className="fine">Prototype: this form is not connected to a backend yet, so nothing is sent or stored.</small>}
    </form>
  )
}
