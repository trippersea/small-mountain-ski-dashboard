# Data Stack Setup

Builds `resort-sources.js` -- the authoritative mapping of every resort to its
NWS weather station, SNOTEL station, and Liftie slug.

Run this once. Re-run if you add resorts or want to refresh station data.

---

## Prerequisites

Node 18+ with internet access. No npm installs required -- all built-in.

---

## Step 1: Fix Open-Meteo elevation now (no scripts required)

In `sd-app.js`, find your Open-Meteo forecast fetch and add the elevation param:

```
// Before
`...forecast?latitude=${r.lat}&longitude=${r.lon}&...`

// After
`...forecast?latitude=${r.lat}&longitude=${r.lon}&elevation=${r.summitElevation}&...`
```

Do the same for your historical archive fetch. Deploy. Done.

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
- Filter by `"confidence": "low"` -- these are the stations far away or at wrong elevation
- Note which resorts they are -- the scoring engine should weight Open-Meteo
  more heavily for these (implementation note for later)
- Eastern mountain valley airport stations are expected to be low confidence --
  that's the reality of NWS coverage in New England

**SNOTEL (`snotel-station-lookup.json`)**
- Review anything flagged `"matchConfidence": "low"` or `"matchConfidence": null`
- A SNOTEL station matched across a major ridge or drainage is worse than no
  SNOTEL at all -- mark those as null manually in the seed file
- Concentrate review on Colorado, Utah, Wyoming where SNOTEL matters most

**Liftie (`liftie-slug-lookup.json`)**
- Review everything flagged `"needsReview": true`
- For `fuzzy_weak` matches: visit liftie.info, search the resort name, confirm
  or correct the slug
- For `no_match`: the resort is not on Liftie -- set `liftieSlug: null` and
  accept that you won't have lift status data for it (usually small local hills)

---

## Step 4: Apply manual corrections

Open `resort-sources-seed.js`. This file has pre-populated entries for most
resorts. If a lookup result was wrong for a specific resort, add or update
its entry in the seed -- seed values override lookup values.

Format:
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

This reads the three JSON outputs plus the seed file and writes `resort-sources.js`
to the repo root. Review the output, then commit.

---

## Full run sequence

```bash
node scripts/find-nws-stations.mjs      # ~3-4 minutes
node scripts/find-snotel-stations.mjs   # ~2-3 minutes
node scripts/match-liftie-slugs.mjs     # ~1 minute
# Review output files and update resort-sources-seed.js as needed
node scripts/merge-sources.mjs          # ~5 seconds
# Review resort-sources.js
git add resort-sources.js resort-sources-seed.js
git commit -m "feat: add resort data source mapping"
```

---

## Files produced

| File | Purpose |
|---|---|
| `resort-sources.js` | Final mapping -- used by the data collector in v2 |
| `resort-sources-seed.js` | Your hand-curated overrides -- commit and maintain |
| `scripts/output/*.json` | Lookup output -- commit for reference, re-run to refresh |

---

## Re-running

The scripts are safe to re-run any time. The merge script is non-destructive.
If you add new resorts to `resorts-data.js`, just re-run the full sequence.
