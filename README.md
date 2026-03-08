# New England Ski Mountain Guide

A static, GitHub Pages-ready ski planning dashboard for 24 New England ski mountains — no backend, no API keys, no build step. Drop the three files in a repo, enable Pages, done.

## Live data (all free, no keys required)

| Source | Used for |
|---|---|
| Open-Meteo | Current weather, 3-day forecast, **past 48h snowfall** (powder alerts) |
| OSRM | Drive time routing |
| Nominatim | City / address geocoding |
| Zippopotam | ZIP code lookup |
| Leaflet + OpenStreetMap | Interactive map |

Weather is cached for 30 minutes per resort so repeated interactions don't hammer the API.

## Features

- **Powder alerts** — past 48h snowfall badge on every resort (sidebar + detail card)
- **Snow quality label** — translates current temp to skiing conditions (Prime powder / Good groomed / Warm — go early / etc.)
- **Wind warning** — flags when wind may close upper lifts (≥25 mph advisory, ≥35 mph closure warning)
- **Season status** — green / amber / grey dot on every resort showing Open / Soon / Closed
- **Best Mountain Today** — scored ranking across all filtered resorts
- **Weekend Planner** — dynamically finds the correct upcoming Saturday/Sunday forecast (not hardcoded offsets)
- **Snow Outlook** — 6-card ranked forecast view
- **Pass Value Calculator** — Indy Pass break-even math, adjustable ski-day count
- **Quick filters** — Beginners, Steeps, Night, Natural snow, Terrain park, Budget (all wired and working)
- **Compare table** — best value per column highlighted in teal; sticky header inside scrollable container
- **Side-by-side compare** — includes cost-per-vertical-foot row
- **Drive-time map** — colour-coded markers by drive radius; all markers update when filters change
- **URL share / deep-link** — Share button copies `#resort-id` link; opening that URL auto-selects the resort
- **Favorites + notes** — persisted to localStorage
- **Surprise Me** — random resort from current filtered list

## Deploy to GitHub Pages

1. Create a new repo (can be private with Pages enabled on a paid plan, or public)
2. Push `index.html`, `styles.css`, `resorts.js`, and `README.md`
3. Settings → Pages → Source: Deploy from branch → `main` / `root`
4. Done — no build step needed

## Adding or updating resorts

Edit the `RESORTS` array at the top of `resorts.js`. Required fields per resort:

```js
{
  id:           'unique-slug',        // used in URLs and localStorage
  name:         'Resort Name',
  state:        'VT',
  pass:         'Indy',               // or 'Independent', 'Ikon', etc.
  owner:        'Independent',
  vertical:     1500,                 // feet
  trails:       51,
  lifts:        5,
  acres:        285,
  snowfall:     120,                  // avg annual inches
  snowmaking:   45,                   // % coverage
  night:        false,
  longestRun:   3.0,                  // miles
  lat:          43.1964,
  lon:          -72.8243,
  difficulty:   { beginner:0.14, intermediate:0.32, advanced:0.34, expert:0.20 },
  liftsBreakdown: [['Quad',1],['Double',3],['Surface',1]],
  website:      'https://...',
  webcamPage:   '',
  trailMapImage:'',                   // direct image URL or leave empty
  trailMapPage: 'https://...',
  price:        79,                   // directional day ticket estimate
  terrainPark:  false,
  seasonOpen:   'Dec',
  seasonClose:  'Apr',
  notes:        'One-line honest description.',
  tags:         ['Soul skiing','Steeps'],
  bestFor:      ['steeps','budget'],
}
```

## Notes

Ticket prices are directional estimates and vary by date, demand, age, and promotions. Confirm with the mountain before booking.

Drive times are calculated under normal road conditions via OSRM. Winter travel on mountain roads typically adds 20–50% to estimate.
