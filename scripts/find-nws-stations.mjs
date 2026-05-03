/**
 * scripts/find-nws-stations.mjs
 *
 * Loops every resort, hits the NWS points API to find the nearest
 * observation station, and writes nws-station-lookup.json for review.
 *
 * Run once from repo root:
 *   node scripts/find-nws-stations.mjs
 *
 * Output: scripts/output/nws-station-lookup.json
 *
 * Review notes:
 *   - Check `distanceMiles` -- anything >25mi is probably low confidence
 *   - Check `elevationDeltaFt` -- anything >1500ft is low confidence
 *   - Both flags together = weight Open-Meteo higher in scoring for that resort
 */

import { createRequire } from 'module';
import { writeFileSync, mkdirSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load resort data -- adjust path if your resorts-data.js lives elsewhere
const RESORTS = require('../api/resorts-data.js');

const OUT_DIR  = path.join(__dirname, 'output');
const OUT_FILE = path.join(OUT_DIR, 'nws-station-lookup.json');
const DELAY_MS = 350; // NWS rate limit is generous but be a good citizen

const USER_AGENT = 'WhereToSkiNext/1.0 (contact@wheretoskinext.com)';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const delay = ms => new Promise(r => setTimeout(r, ms));

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

function confidenceLevel(miles, elevDeltaFt) {
  if (miles <= 10 && elevDeltaFt <= 500)  return 'high';
  if (miles <= 25 && elevDeltaFt <= 1200) return 'medium';
  return 'low';
}

async function fetchJson(url) {
  const res = await fetch(url, {
    headers: {
      'User-Agent': USER_AGENT,
      'Accept':     'application/geo+json',
    },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return res.json();
}

// ─── NWS lookup for a single resort ──────────────────────────────────────────

async function lookupResort(resort) {
  const result = {
    id:               resort.id,
    name:             resort.name,
    state:            resort.state,
    summitElevation:  resort.summitElevation,
    nwsStationId:     null,
    nwsStationName:   null,
    stationLat:       null,
    stationLon:       null,
    stationElevationFt: null,
    distanceMiles:    null,
    elevationDeltaFt: null,
    confidence:       null,
    error:            null,
  };

  try {
    // Step 1: NWS /points endpoint -- returns grid info + observation stations URL
    const pointsUrl  = `https://api.weather.gov/points/${resort.lat.toFixed(4)},${resort.lon.toFixed(4)}`;
    const pointsData = await fetchJson(pointsUrl);
    const stationsUrl = pointsData?.properties?.observationStations;

    if (!stationsUrl) {
      result.error = 'No observationStations URL in points response';
      return result;
    }

    await delay(150); // brief pause between the two NWS calls

    // Step 2: Pull the station list, take the first (closest) result
    const stationsData = await fetchJson(stationsUrl);
    const first = stationsData?.features?.[0];

    if (!first) {
      result.error = 'No stations returned from observation stations endpoint';
      return result;
    }

    const props    = first.properties;
    const coords   = first.geometry?.coordinates; // [lon, lat]
    const stLat    = coords?.[1] ?? null;
    const stLon    = coords?.[0] ?? null;
    const stElev   = props?.elevation?.value != null
      ? Math.round(props.elevation.value * 3.28084) // m -> ft
      : null;

    const distMi   = (stLat != null && stLon != null)
      ? parseFloat(distanceMiles(resort.lat, resort.lon, stLat, stLon).toFixed(1))
      : null;

    const elevDelta = (stElev != null)
      ? Math.abs(resort.summitElevation - stElev)
      : null;

    result.nwsStationId     = props?.stationIdentifier ?? null;
    result.nwsStationName   = props?.name ?? null;
    result.stationLat       = stLat;
    result.stationLon       = stLon;
    result.stationElevationFt = stElev;
    result.distanceMiles    = distMi;
    result.elevationDeltaFt = elevDelta;
    result.confidence       = (distMi != null && elevDelta != null)
      ? confidenceLevel(distMi, elevDelta)
      : 'unknown';

  } catch (err) {
    result.error = err.message;
  }

  return result;
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  mkdirSync(OUT_DIR, { recursive: true });

  console.log(`Looking up NWS stations for ${RESORTS.length} resorts...`);
  console.log('This will take roughly', Math.round((RESORTS.length * DELAY_MS) / 60000), 'minutes.\n');

  const results = [];
  let done = 0;

  for (const resort of RESORTS) {
    const result = await lookupResort(resort);
    results.push(result);
    done++;

    const status = result.error
      ? `ERROR: ${result.error}`
      : `${result.nwsStationId ?? 'null'} (${result.distanceMiles ?? '?'}mi, ${result.elevationDeltaFt ?? '?'}ft delta) [${result.confidence}]`;

    process.stdout.write(`[${String(done).padStart(3)}/${RESORTS.length}] ${resort.name.padEnd(32)} ${status}\n`);
    await delay(DELAY_MS);
  }

  writeFileSync(OUT_FILE, JSON.stringify(results, null, 2), 'utf8');

  // Summary
  const byConfidence = { high: 0, medium: 0, low: 0, unknown: 0, error: 0 };
  for (const r of results) {
    if (r.error) byConfidence.error++;
    else byConfidence[r.confidence ?? 'unknown']++;
  }

  console.log('\n--- Summary ---');
  console.log(`High confidence:   ${byConfidence.high}`);
  console.log(`Medium confidence: ${byConfidence.medium}`);
  console.log(`Low confidence:    ${byConfidence.low}`);
  console.log(`Errors:            ${byConfidence.error}`);
  console.log(`\nOutput: ${OUT_FILE}`);
  console.log('\nNext: review low-confidence entries -- those get nwsConfidence:"low" in resort-sources.js');
  console.log('Low confidence means weight Open-Meteo higher for that resort in scoring.');
}

main().catch(err => { console.error(err); process.exit(1); });
