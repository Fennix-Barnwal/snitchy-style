import { TRENDING } from './data.js'
import { GarmentArt } from './art/Garments.jsx'
import { Reveal } from './ui.jsx'
import { useCart } from './cart.jsx'

// Illustrated style ideas. Not products: no price, no cart. Each pre-fills the re-make form.
export default function Trending() {
  const { notify } = useCart()
  const ask = (t) => {
    window.dispatchEvent(new CustomEvent('stitchy:prefill', { detail: t }))
    document.querySelector('#request')?.scrollIntoView({ behavior: 'smooth' })
    notify(`${t.name} added to your re-make request`)
  }
  return (
    <section id="trending" className="trending">
      <div className="pad trending-head">
        <Reveal>
          <p className="label">TRENDING SILHOUETTES</p>
          <h2 className="big sm">THE LOOKS <em>EVERYONE'S</em> ASKING FOR</h2>
          <p className="lead">Style ideas, not products. Pick one and we'll start your custom re-make request for you.</p>
        </Reveal>
      </div>
      <ul className="trend-row" aria-label="Trending silhouettes">
        {TRENDING.map((t, i) => (
          <li key={t.id} className="trend" style={{ '--tilt': `${i % 2 ? 1.6 : -1.6}deg` }}>
            <div className="trend-art"><GarmentArt type={t.art} tone={t.tone} label={`${t.name} illustration`} delay={`-${i * 0.7}s`} /></div>
            <div className="trend-body">
              <span className="tag static">STYLE IDEA</span>
              <h3>{t.name}</h3>
              <button className="btn black small" onClick={() => ask(t)}>REMAKE IT LIKE THIS</button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
