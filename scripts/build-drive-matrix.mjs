#!/usr/bin/env node
/**
 * scripts/build-drive-matrix.mjs
 *
 * Pre-computes a drive-time matrix from every cluster origin in origins.json
 * to every resort in resorts.js, by calling OSRM's public demo server at a
 * polite 1 request per second. Writes drive-matrix.json at the repo root.
 *
 * Usage (from repo root):
 *   node scripts/build-drive-matrix.mjs
 *
 * Resumability:
 *   Progress is saved to drive-matrix.json.partial every 100 calls. If the
 *   script is interrupted, re-running picks up exactly where it left off
 *   (already-fetched pairs are skipped, no duplicate calls).
 *
 * Runtime:
 *   35 origins x ~300 resorts = ~10,500 calls. At ~1.1 sec/call, plan for
 *   roughly 3 to 3.5 hours. Run it overnight.
 *
 * Re-running:
 *   Regenerate every few months, or whenever resort coordinates change in
 *   resorts.js or origins.json is edited. The output file is meant to be
 *   committed to the repo and served as a static asset.
 */

import { readFileSync, writeFileSync, existsSync, unlinkSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

const RESORTS_PATH = resolve(ROOT, 'resorts.js');
const ORIGINS_PATH = resolve(ROOT, 'origins.json');
const OUTPUT_PATH  = resolve(ROOT, 'drive-matrix.json');
const PARTIAL_PATH = resolve(ROOT, 'drive-matrix.json.partial');

const OSRM_BASE         = 'https://router.project-osrm.org/route/v1/driving';
const RATE_DELAY_MS     = 1100;   // ~1 req/sec, respects OSRM demo policy
const RETRY_DELAY_MS    = 3000;
const SAVE_EVERY_CALLS  = 100;
const LOG_EVERY_CALLS   = 50;

// ─── Loaders ─────────────────────────────────────────────────────────────────

function loadResorts() {
  const code = readFileSync(RESORTS_PATH, 'utf8');
  // resorts.js declares `const RESORTS = [...]` at top level. Wrap in a
  // Function() so the const lives in the function's scope, then return it.
  return (new Function(code + '\nreturn RESORTS;'))();
}

function loadOrigins() {
  return JSON.parse(readFileSync(ORIGINS_PATH, 'utf8'));
}

function loadPartial() {
  if (!existsSync(PARTIAL_PATH)) return null;
  try {
    const raw = readFileSync(PARTIAL_PATH, 'utf8');
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function savePartial(times) {
  writeFileSync(PARTIAL_PATH, JSON.stringify({ times }));
}

// ─── OSRM fetch ──────────────────────────────────────────────────────────────

const sleep = ms => new Promise(r => setTimeout(r, ms));

async function fetchOnce(originLat, originLon, destLat, destLon) {
  const url = `${OSRM_BASE}/${originLon},${originLat};${destLon},${destLat}?overview=false`;
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'WhereToSkiNext-DriveMatrix/1.0 (one-time build script)',
        'Accept': 'application/json',
      },
    });
    if (!res.ok) return null;
    const data = await res.json();
    const dur = data?.routes?.[0]?.duration;
    if (typeof dur !== 'number') return null;
    return Math.round(dur / 60);
  } catch {
    return null;
  }
}

async function fetchDriveMins(originLat, originLon, destLat, destLon) {
  let mins = await fetchOnce(originLat, originLon, destLat, destLon);
  if (mins == null) {
    await sleep(RETRY_DELAY_MS);
    mins = await fetchOnce(originLat, originLon, destLat, destLon);
  }
  return mins;
}

// ─── Validation ──────────────────────────────────────────────────────────────

function validInputs(RESORTS, origins) {
  const errors = [];
  if (!Array.isArray(RESORTS) || !RESORTS.length) {
    errors.push('resorts.js did not produce a RESORTS array');
  } else {
    for (const r of RESORTS) {
      if (!r?.id || typeof r.lat !== 'number' || typeof r.lon !== 'number') {
        errors.push(`Bad resort entry: ${JSON.stringify(r).slice(0, 80)}`);
      }
    }
  }
  if (!Array.isArray(origins) || !origins.length) {
    errors.push('origins.json must be a non-empty array');
  } else {
    for (const o of origins) {
      if (!o?.id || typeof o.lat !== 'number' || typeof o.lon !== 'number' || typeof o.radius !== 'number') {
        errors.push(`Bad origin entry: ${JSON.stringify(o).slice(0, 80)}`);
      }
    }
  }
  return errors;
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main() {
  console.log('Loading resorts and origins...');
  const RESORTS = loadResorts();
  const origins = loadOrigins();

  const errors = validInputs(RESORTS, origins);
  if (errors.length) {
    console.error('Validation failed:');
    errors.forEach(e => console.error('  ' + e));
    process.exit(1);
  }

  const totalPairs = origins.length * RESORTS.length;
  console.log(`Resorts: ${RESORTS.length}`);
  console.log(`Origins: ${origins.length}`);
  console.log(`Total pairs: ${totalPairs}`);
  console.log(`Estimated runtime if starting fresh: ~${Math.round((totalPairs * RATE_DELAY_MS) / 60000)} min\n`);

  const partial = loadPartial();
  const times = partial?.times || {};
  if (partial) {
    const cached = Object.values(times).reduce((sum, t) => sum + Object.keys(t).length, 0);
    console.log(`Resuming from partial: ${cached} of ${totalPairs} pairs already done.\n`);
  }

  let visited = 0;
  let liveCalls = 0;
  let failures = 0;
  const startedAt = Date.now();

  for (const origin of origins) {
    if (!times[origin.id]) times[origin.id] = {};

    for (const resort of RESORTS) {
      visited++;

      // Skip if we already have this pair.
      if (times[origin.id][resort.id] != null) continue;

      liveCalls++;
      const mins = await fetchDriveMins(origin.lat, origin.lon, resort.lat, resort.lon);
      if (mins != null) {
        times[origin.id][resort.id] = mins;
      } else {
        failures++;
      }

      if (liveCalls % SAVE_EVERY_CALLS === 0) {
        savePartial(times);
      }

      if (liveCalls % LOG_EVERY_CALLS === 0) {
        const elapsedSec = (Date.now() - startedAt) / 1000;
        const rate = liveCalls / elapsedSec;
        const remaining = totalPairs - visited;
        const etaMin = remaining > 0 ? remaining / rate / 60 : 0;
        console.log(
          `[${visited}/${totalPairs}] live=${liveCalls} fail=${failures} ` +
          `last=${origin.id}->${resort.id}=${mins ?? 'FAIL'} ` +
          `ETA ${etaMin.toFixed(0)}m`
        );
      }

      await sleep(RATE_DELAY_MS);
    }
  }

  // Final write.
  const output = {
    generatedAt: new Date().toISOString(),
    origins,
    times,
  };
  writeFileSync(OUTPUT_PATH, JSON.stringify(output));
  if (existsSync(PARTIAL_PATH)) unlinkSync(PARTIAL_PATH);

  const elapsedMin = ((Date.now() - startedAt) / 1000 / 60).toFixed(1);
  console.log(`\nDone in ${elapsedMin} min.`);
  console.log(`Live calls: ${liveCalls}, failures: ${failures}`);
  console.log(`Wrote ${OUTPUT_PATH}`);
}

main().catch(err => {
  console.error('Generator crashed:', err);
  process.exit(1);
});
