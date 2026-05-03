/**
 * scripts/find-snotel-stations.mjs
 *
 * For western resorts only (CO, UT, WY, MT, ID, NV, CA, OR, WA, AZ, NM, AK),
 * queries the USDA AWDB REST API for all active SNOTEL stations in those states,
 * then matches each resort to its nearest station within acceptable proximity.
 *
 * Run once from repo root:
 *   node scripts/find-snotel-stations.mjs
 *
 * Output: scripts/output/snotel-station-lookup.json
 *
 * Match criteria:
 *   - Station within RADIUS_MILES of resort coordinates
 *   - Station elevation within ELEV_DELTA_FT of resort summit elevation
 *   - If multiple candidates, pick closest by combined distance + elev delta score
 *
 * Tweak RADIUS_MILES and ELEV_DELTA_FT if you're getting too few or too many matches.
 */

import { createRequire } from 'module';
import { writeFileSync, mkdirSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const require  = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const RESORTS   = require('../api/resorts-data.js');
const OUT_DIR   = path.join(__dirname, 'output');
const OUT_FILE  = path.join(OUT_DIR, 'snotel-station-lookup.json');

// States with meaningful SNOTEL coverage
const WESTERN_STATES = new Set(['CO','UT','WY','MT','ID','NV','CA','OR','WA','AZ','NM','AK']);

// Matching thresholds -- adjust if needed
const RADIUS_MILES  = 20;    // maximum horizontal distance
const ELEV_DELTA_FT = 1500;  // maximum elevation difference vs resort summit

// ─── Helpers ──────────────────────────────────────────────────────────────────

function haversineM(lat1, lon1, lat2, lon2) {
  const R = 6371000;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function distanceMiles(lat1, lon1, lat2, lon2) {
  return haversineM(lat1, lon1, lat2, lon2) / 1609.344;
}

// Combined proximity score -- lower is better
// Weights horizontal distance and elevation delta roughly equally
function proximityScore(distMi, elevDelta) {
  return (distMi / RADIUS_MILES) + (elevDelta / ELEV_DELTA_FT);
}

// ─── Fetch all SNOTEL stations for a state ────────────────────────────────────

async function fetchSnotelStations(stateCode) {
  const url = `https://wcc.sc.egov.usda.gov/awdbRestApi/services/v1/stations` +
    `?activeOnly=true&networkCds=SNTL&stateCds=${stateCode}`;

  const res = await fetch(url, {
    headers: { 'Accept': 'application/json', 'User-Agent': 'WhereToSkiNext/1.0' },
  });

  if (!res.ok) {
    console.warn(`  SNOTEL fetch failed for ${stateCode}: HTTP ${res.status}`);
    return [];
  }

  const data = await res.json();
  if (!Array.isArray(data)) return [];

  return data.map(s => ({
    stationTriplet: s.stationTriplet,        // e.g. "1125:UT:SNTL"
    name:           s.name,
    lat:            parseFloat(s.latitude),
    lon:            parseFloat(s.longitude),
    elevationFt:    s.elevation != null ? Math.round(s.elevation) : null,
    stateCode,
  })).filter(s => !isNaN(s.lat) && !isNaN(s.lon));
}

// ─── Match resort to best SNOTEL station ─────────────────────────────────────

function matchResort(resort, stations) {
  const candidates = [];

  for (const st of stations) {
    const distMi   = distanceMiles(resort.lat, resort.lon, st.lat, st.lon);
    const elevDelta = st.elevationFt != null
      ? Math.abs(resort.summitElevation - st.elevationFt)
      : null;

    if (distMi > RADIUS_MILES) continue;
    if (elevDelta != null && elevDelta > ELEV_DELTA_FT) continue;

    candidates.push({
      ...st,
      distanceMiles:    parseFloat(distMi.toFixed(1)),
      elevationDeltaFt: elevDelta != null ? Math.round(elevDelta) : null,
      score:            proximityScore(distMi, elevDelta ?? ELEV_DELTA_FT),
    });
  }

  if (!candidates.length) return null;

  // Pick best by proximity score
  candidates.sort((a, b) => a.score - b.score);
  return candidates[0];
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  mkdirSync(OUT_DIR, { recursive: true });

  const westernResorts = RESORTS.filter(r => WESTERN_STATES.has(r.state));
  console.log(`Processing ${westernResorts.length} western resorts across ${WESTERN_STATES.size} states...`);

  // Fetch all SNOTEL stations per state (one request per state, not per resort)
  const stateSet = new Set(westernResorts.map(r => r.state));
  const allStations = {};

  for (const state of stateSet) {
    process.stdout.write(`  Fetching SNOTEL stations for ${state}...`);
    const stations = await fetchSnotelStations(state);
    allStations[state] = stations;
    console.log(` ${stations.length} stations found`);
    await new Promise(r => setTimeout(r, 300));
  }

  const totalStations = Object.values(allStations).reduce((n, arr) => n + arr.length, 0);
  console.log(`\nTotal SNOTEL stations loaded: ${totalStations}`);
  console.log(`Matching resorts...\n`);

  const results = [];
  let matched = 0;

  for (const resort of westernResorts) {
    const stateStations = allStations[resort.state] ?? [];
    const best = matchResort(resort, stateStations);

    const result = {
      id:            resort.id,
      name:          resort.name,
      state:         resort.state,
      summitElevation: resort.summitElevation,
      snotelTriplet:   best?.stationTriplet  ?? null,
      snotelName:      best?.name            ?? null,
      snotelElevFt:    best?.elevationFt     ?? null,
      distanceMiles:   best?.distanceMiles   ?? null,
      elevationDeltaFt: best?.elevationDeltaFt ?? null,
      matchConfidence: best
        ? (best.distanceMiles <= 8 && (best.elevationDeltaFt ?? 9999) <= 600 ? 'high'
          : best.distanceMiles <= 15 ? 'medium'
          : 'low')
        : null,
    };

    if (best) matched++;

    const status = best
      ? `${best.stationTriplet} "${best.name}" (${best.distanceMiles}mi, ${best.elevationDeltaFt ?? '?'}ft delta) [${result.matchConfidence}]`
      : 'NO MATCH';

    console.log(`  ${resort.name.padEnd(32)} ${status}`);
    results.push(result);
  }

  writeFileSync(OUT_FILE, JSON.stringify(results, null, 2), 'utf8');

  console.log(`\n--- Summary ---`);
  console.log(`Matched:   ${matched} / ${westernResorts.length} western resorts`);
  console.log(`No match:  ${westernResorts.length - matched} (will use Open-Meteo only)`);
  console.log(`\nOutput: ${OUT_FILE}`);
  console.log('\nReview matches flagged "low" -- a station on the wrong drainage or wrong');
  console.log('aspect will give misleading numbers. When in doubt, leave snotelTriplet null.');
}

main().catch(err => { console.error(err); process.exit(1); });
