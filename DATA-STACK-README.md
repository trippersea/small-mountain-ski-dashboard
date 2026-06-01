# Data Stack Setup

Builds `resort-sources.js` — the authoritative mapping of every resort to its NWS weather station, SNOTEL station, and Liftie slug.

Run this once. Re-run if you add resorts or want to refresh station data.

---

## Prerequisites

Node 18+ with internet access. No npm installs required for the lookup scripts — all built-in.

---

## Step 1: Open-Meteo weather (already configured)

**Do not** pass `elevation=` to Open-Meteo forecast or history URLs. Summit elevation in the API produced unrealistic cold (e.g. late-season absurd lows at 9,000+ ft).

Current approach in `sd-app.js`:

- Fetch grid-level forecast/history (`timezone=auto`, no elevation param).
- Apply a single lapse-rate adjustment in scoring via `resortSummitTempF()` in `sd-scoring.js` when needed for narrative/scoring copy.

No change required unless you are debugging a specific resort’s temperature display.

---

## Step 2: Run the three lookup scripts

Run these from the repo root. Each takes a few minutes.

```bash
node scripts/find-nws-stations.mjs
node scripts/find-snotel-stations.mjs
node scripts/match-liftie-slugs.mjs
```

Output files land in `scripts/output/`:

- `nws-station-lookup.json`
- `snotel-station-lookup.json`
- `liftie-slug-lookup.json`

---

## Step 3: Review the output

Open each JSON file and look for:

**NWS (`nws-station-lookup.json`)**

- Filter by `"confidence": "low"` — stations far away or at wrong elevation.
- Eastern valley airport stations are often low confidence; scoring may lean more on Open-Meteo for those resorts.

**SNOTEL (`snotel-station-lookup.json`)**

- Review `"matchConfidence": "low"` or `null`.
- A bad SNOTEL match is worse than no SNOTEL — mark as `null` in the seed file.

**Liftie (`liftie-slug-lookup.json`)**

- Review `"needsReview": true` entries.
- Set `liftieSlug: null` when the resort is not on Liftie.

---

## Step 4: Apply manual corrections

Open `resort-sources-seed.js`. Seed values override lookup values.

```js
'resort-id': {
  nwsStationId:  'KXXX',
  nwsConfidence: 'high' | 'medium' | 'low',
  snotelTriplet: '1125:UT:SNTL' | null,
  liftieSlug:    'resort-name' | null,
},
```

---

## Step 5: Merge into resort-sources.js

```bash
node scripts/merge-sources.mjs
```

This writes `resort-sources.js` to the repo root. Review and commit.

---

## Step 6: Wire into the app (when ready)

`resort-sources.js` is used by server-side condition fetches and future scoring enhancements. The live homepage ranking already uses Open-Meteo + `metro_gravity_final.js` + `lift_capacity_tiers_final.js` loaded before `sd-scoring.js`.
