# STITCHY STYLE

React + Vite site for the STITCHY STYLE upcycling brand. Two customer journeys: **Shop** and **Custom Re-make**.

## Run locally

```bash
npm install
npm run dev      # development
npm run build    # production build (Vercel uses this, no config change needed)
```

## Where to edit things

| What | File |
| --- | --- |
| Products (`art` + `tone` pick the illustration), categories, prices, nav, steps, phone / email / social links | `src/data.js` |
| Garment drawings (tee, crop tee, shirt, hoodie, zip hoodie, jacket, bomber, jeans, cargo, wide-leg, tote, sling, shoulder bag, cap, bucket hat, beanie, bandana, wallet, pouch, full look) + colourways | `src/art/pieces.jsx` |
| Animated wrapper (float, 3D tilt, pause offscreen) | `src/art/Garments.jsx` |
| Trending style ideas (pre-fill the re-make form) | `src/Trending.jsx`, `TRENDING` in `src/data.js` |
| Stitchy Radio (Spotify audio playlist) | `src/Radio.jsx`, `RADIO` in `src/data.js` |
| Custom re-make step graphics + transformation animation | `src/art/ProcessArt.jsx` |
| Cart (demo), toasts, cart drawer | `src/cart.jsx` |
| Shop grid, filtering, product detail modal | `src/Shop.jsx` |
| Custom re-make form + validation + image previews | `src/RemakeForm.jsx` |
| Form submission hook (backend goes here) | `src/services/remake.js` |
| Colours and all animation CSS | `src/styles.css` |
| Fit of the Day outfits + daily picker | `src/fits.js`, `src/FitOfDay.jsx`, `src/art/OutfitArt.jsx` |
| THREADI (UI / browser helpers / server function) | `src/Threadi.jsx`, `src/services/threadi.js`, `api/_threadi-core.js`, `api/threadi.js` |

## Things that are intentionally left open

- **Prices:** none were provided, so every product shows `PRICE TBA`. Set `price: 1499` (rupees) on a product in `src/data.js` and it displays and totals in the cart automatically.
- **Email:** no real address exists in the project. Set `CONTACT.email` in `src/data.js` and a mailto link appears in the footer.
- **Social links:** hidden until you add URLs in `CONTACT.social`.
- **Product names:** "Patchwork Denim Jacket" and "Embroidered Tote" are your existing names. They are drawn as clean, modern pieces, so consider renaming them.
- **Cart:** a demo. Checkout is disabled and labelled "coming soon". It remembers items in the browser only.
- **Re-make form:** a prototype. With no endpoint configured nothing is sent or stored and the UI says so. To connect a backend, set `VITE_REMAKE_ENDPOINT` (a URL accepting a multipart POST) or edit `src/services/remake.js`.

## Accessibility and motion

Animations respect `prefers-reduced-motion` (loops stop, the transformation graphic shows its finished state). Modal and cart close with Escape.


## V4 features

### Branding
The brand is **STITCHY STYLE** everywhere (logo, tab title, footer, art text, radio). Carts saved under the old name are still read.

### Denim Teddy
New Accessories product (`denim-teddy` in `src/data.js`, drawing `Teddy` in `src/art/pieces.jsx`). It uses the normal product card, modal and cart. **Its price is `PRICE TBA` like every other product** because no price was provided: set `price: 1499` (or your number) on it.

### THREADI (AI personal tailor)
Real vision analysis through the Anthropic API, called only from a server function (`api/threadi.js`), so the key is never in browser code.

1. Get an API key at https://console.anthropic.com.
2. Local: copy `.env.example` to `.env`, set `ANTHROPIC_API_KEY=...`, run `npm run dev` (Vite serves `/api/threadi` using the same server code).
3. Vercel: Project Settings > Environment Variables > add `ANTHROPIC_API_KEY` (and optionally `THREADI_MODEL`, default `claude-sonnet-5-5`), then redeploy. `vercel.json` already allows the function 60 seconds.

Without a key, THREADI shows a setup message and a clearly labelled **preview mode** (photos + your own description can still go to Custom Re-Make; no analysis or suggestions are shown). Photos are shrunk in the browser (max 1280px JPEG) to fit Vercel's ~4.5 MB request limit; up to 4 photos. The server validates image types and sizes and sanitises what the AI returns.

**Image generation is not connected.** The "design" step shows the AI's written concept plus an *illustrated reference* drawn with the site's own garment art, labelled as not a render and not a guaranteed result. To add real image generation later, extend `api/_threadi-core.js` with an image model and show its output in `src/Threadi.jsx` (step 05).

"Make this with STITCHY STYLE" fills the Custom Re-Make form (garment type, description, and the first photo). The form has one photo slot, so extra photos are mentioned in the description. There is no rate limiting: add Vercel's firewall/rate limits or an auth check before a public launch to protect your API credit.

### Stitchy Radio
Still compact; the bar now has previous / play-pause / next, and `+` expands a queue list, shuffle and an Open-on-Spotify link. Genuine track-level control works because each track is its own Spotify embed driven by Spotify's official iFrame API (audio only, nothing downloaded). The queue shuffles once per session (reloads keep it, a new session reshuffles and avoids opening with the last opener), never plays the same track twice in a row, and never autoplays; Spotify is not even contacted until the first click.

Limits that come from Spotify:
- Full songs only for visitors logged in to Spotify; others get 30-second previews.
- Spotify gives websites **no volume control**, so volume is the device's. The old playlist embed didn't offer one either.
- While minimised, the Spotify embed stays mounted but clipped to 1px so music keeps playing; expanding shows it.
- Auto-advance at the end of a song is inferred from Spotify's playback events (best effort).

**Before launch:** the track IDs in `RADIO.tracks` were not all verifiable offline. Only "I Feel It Coming" was confirmed; the others are marked `verified: false`. Run `npm run check:radio` (needs internet) to compare each ID with the title Spotify reports, fix any mismatch, and add your hyperpop, electronic, Don Toliver and underground-rap picks the same way.

### Fit of the Day
`src/fits.js` holds 13 outfit recipes. One featured fit per calendar day (visitor's local date) from a seeded rotation: every outfit is used once before repeating, never twice in a row, stable across refreshes. "Generate another fit" picks a random different one; "Back to today's fit" returns. Pieces get a **View in shop** link only if they map to a real product id; others say "Style idea · not in shop". "Recreate this with my old clothes" opens THREADI with the outfit as the goal.

## Deploy
`npm install`, `npm run build`, deploy on Vercel (framework preset Vite; the `api/` folder deploys automatically). Static-only hosts will not run THREADI's function.
