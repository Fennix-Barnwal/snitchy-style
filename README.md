# SNITCHY STYLE

React + Vite site for the SNITCHY STYLE upcycling brand. Two customer journeys: **Shop** and **Custom Re-make**.

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
| Snitchy Radio (Spotify audio playlist) | `src/Radio.jsx`, `RADIO` in `src/data.js` |
| Custom re-make step graphics + transformation animation | `src/art/ProcessArt.jsx` |
| Cart (demo), toasts, cart drawer | `src/cart.jsx` |
| Shop grid, filtering, product detail modal | `src/Shop.jsx` |
| Custom re-make form + validation + image previews | `src/RemakeForm.jsx` |
| Form submission hook (backend goes here) | `src/services/remake.js` |
| Colours and all animation CSS | `src/styles.css` |

## Things that are intentionally left open

- **Prices:** none were provided, so every product shows `PRICE TBA`. Set `price: 1499` (rupees) on a product in `src/data.js` and it displays and totals in the cart automatically.
- **Email:** no real address exists in the project. Set `CONTACT.email` in `src/data.js` and a mailto link appears in the footer.
- **Social links:** hidden until you add URLs in `CONTACT.social`.
- **Empty categories:** Hoodies, Headwear and Accessories have no product yet and show an empty state pointing to Custom Re-make. Nothing was invented.
- **Product names:** "Patchwork Denim Jacket" and "Embroidered Tote" are your existing names. They are drawn as clean, modern pieces, so consider renaming them.
- **Snitchy Radio:** uses Spotify's official audio playlist embed, not a YouTube video. The selected playlist starts only when the visitor presses play inside Spotify. Visitors can use Spotify's built-in play, pause, volume and previous/next track controls. The playlist can be changed by editing `RADIO.playlistId` and `RADIO.playlistUrl` in `src/data.js`. Full playback and available controls depend on Spotify and the visitor's account/region.
- **Cart:** a demo. Checkout is disabled and labelled "coming soon". It remembers items in the browser only.
- **Re-make form:** a prototype. With no endpoint configured nothing is sent or stored and the UI says so. To connect a backend, set `VITE_REMAKE_ENDPOINT` (a URL accepting a multipart POST) or edit `src/services/remake.js`.

## Accessibility and motion

Animations respect `prefers-reduced-motion` (loops stop, the transformation graphic shows its finished state). Modal and cart close with Escape.
