# WhereToSkiNext.com

A ski trip planner that ranks **~300 U.S. ski areas** from your location, pass, drive window, and preferences — with live forecast snow, drive times, and a crowd outlook model.

**Production:** [wheretoskinext.com](https://wheretoskinext.com) (Vercel)

---

## Stack

| Layer | Technology |
|--------|------------|
| Frontend | Static HTML/CSS + vanilla JS (`sd-app.js`, `sd-scoring.js`, `sd-filters.js`, `resorts.js`) |
| Deploy | Vercel — build runs `obfuscate-scoring.mjs` + `prerender-homepage.mjs` |
| Weather | [Open-Meteo](https://open-meteo.com/) (grid temps; no summit `elevation=` param) |
| Drive times | [OSRM](https://router.project-osrm.org/) + haversine fallback |
| Geocoding | Nominatim, Zippopotam.us |
| APIs | Vercel serverless (`api/chat.js`, newsletter, subscribe, analytics) |

---

## Local development

```bash
npm install          # devDeps: sharp, javascript-obfuscator
npm test             # sd-safe-url.test.cjs
npx serve .          # or any static server at repo root
```

Open `/` for the planner. `/compare/` reads `localStorage['wtsn-compare']` written after you set a location and get a top pick on the homepage.

**Do not run `node obfuscate-scoring.mjs` locally** unless you intend to overwrite `sd-app.js` / `sd-scoring.js` in place (Vercel build only).

---

## Environment variables (Vercel)

| Variable | Purpose |
|----------|---------|
| `ANTHROPIC_API_KEY` | Optional — powers “Describe your ideal day” (`/api/chat`) |
| `CRON_SECRET` | Newsletter cron (`api/newsletter-generator.js`) — Vercel sends `Authorization: Bearer` automatically |
| `ALLOWED_ORIGINS` | CORS allowlist for API routes (comma-separated) |

See `vercel.json` for security headers and rewrites.

---

## Key product flows

1. **Homepage** — ZIP/city → ranked table (top 10, expandable), verdict card, refine filters.
2. **Compare** (`/compare/`) — Side-by-side top pick + 3 runners; **full rankings table** (top 25 from same scoring session).
3. **SEO** — `/ski/:state/`, `/ski-near/:city/`, `/ski-report/:slug/` static pages.

### Trip / drive modes

| `howFar` | Label | Drive band |
|----------|--------|------------|
| `0` | Day trip | ≤3 hours |
| `1` | Extended drive (3h+) | 3–6 hours |
| `2` | Any distance | No cap |

---

## Adding or updating resorts

Edit `resorts.js` (master `RESORTS` array). Required fields include `id`, `name`, `state`, `passGroup`, `lat`, `lon`, `vertical`, `price`, etc. Regenerate SEO/report pages with the project’s generator scripts when adding many resorts.

Optional station mapping: see `DATA-STACK-README.md` and `scripts/` for NWS / SNOTEL / Liftie merges into `resort-sources.js`.

---

## Tests

```bash
npm test
```

Covers URL param sanitization (`sd-safe-url.js`). Scoring is not unit-tested in CI (logic lives in `sd-scoring.js`).

---

## Disclaimers

Ticket prices and drive times are estimates. Crowd scores are modeled, not live lift-line data. Confirm conditions and pricing with the mountain before you go.
