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
| Products, categories, prices, nav, steps, phone / email / social links | `src/data.js` |
| Clothing illustrations (tee, shirt, hoodie, jacket, jeans, tote, full look) | `src/art/Garments.jsx` |
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
- **Hoodies:** the category exists but has no product yet (shows an empty state pointing to Custom Re-make).
- **Cart:** a demo. Checkout is disabled and labelled "coming soon". It remembers items in the browser only.
- **Re-make form:** a prototype. With no endpoint configured nothing is sent or stored and the UI says so. To connect a backend, set `VITE_REMAKE_ENDPOINT` (a URL accepting a multipart POST) or edit `src/services/remake.js`.

## Accessibility and motion

Animations respect `prefers-reduced-motion` (loops stop, the transformation graphic shows its finished state). Modal and cart close with Escape.
