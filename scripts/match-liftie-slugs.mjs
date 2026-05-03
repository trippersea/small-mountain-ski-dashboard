/**
 * scripts/match-liftie-slugs.mjs
 *
 * Pulls the full Liftie resort list from liftie.info/api/resorts,
 * then fuzzy-matches each of your resorts to a Liftie slug.
 *
 * Run once from repo root:
 *   node scripts/match-liftie-slugs.mjs
 *
 * Output: scripts/output/liftie-slug-lookup.json
 *
 * If Liftie blocks the API request (403), the script writes a fallback
 * file and prints instructions for the manual workaround.
 */

import { createRequire } from 'module';
import { writeFileSync, mkdirSync, existsSync, readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const require   = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const RESORTS   = require('../api/resorts-data.js');
const OUT_DIR   = path.join(__dirname, 'output');
const OUT_FILE  = path.join(OUT_DIR, 'liftie-slug-lookup.json');
const LOCAL_RAW = path.join(OUT_DIR, 'liftie-raw.json');

// ─── Text normalization ───────────────────────────────────────────────────────

function normalize(str) {
  return String(str)
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\b(ski|resort|mountain|mountain resort|ski area|ski resort|ski valley|the)\b/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function tokenOverlap(a, b) {
  const tokA = new Set(a.split(' ').filter(Boolean));
  const tokB = new Set(b.split(' ').filter(Boolean));
  if (!tokA.size) return 0;
  let shared = 0;
  for (const t of tokA) { if (tokB.has(t)) shared++; }
  return shared / tokA.size;
}

// ─── Match a single resort ────────────────────────────────────────────────────

function matchResort(resort, liftieResorts) {
  const normName = normalize(resort.name);

  const exactId = liftieResorts.find(l => l.slug === resort.id);
  if (exactId) return { slug: exactId.slug, liftieName: exactId.name, matchType: 'exact_id', score: 1 };

  const exactName = liftieResorts.find(l => normalize(l.name) === normName);
  if (exactName) return { slug: exactName.slug, liftieName: exactName.name, matchType: 'exact_name', score: 1 };

  const candidates = liftieResorts
    .map(l => ({ ...l, overlap: tokenOverlap(normName, normalize(l.name)) }))
    .filter(l => l.overlap >= 0.5)
    .sort((a, b) => b.overlap - a.overlap);

  if (candidates.length) {
    const best = candidates[0];
    return {
      slug:       best.slug,
      liftieName: best.name,
      matchType:  best.overlap >= 0.8 ? 'fuzzy_strong' : 'fuzzy_weak',
      score:      best.overlap,
    };
  }

  return null;
}

// ─── Try fetching Liftie with multiple header sets ────────────────────────────

async function fetchLiftieResorts() {
  const headerSets = [
    {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'application/json, text/plain, */*',
      'Accept-Language': 'en-US,en;q=0.9',
      'Referer': 'https://liftie.info/',
    },
    {
      'User-Agent': 'WhereToSkiNext/1.0 (contact@wheretoskinext.com)',
      'Accept': 'application/json',
    },
    {
      'User-Agent': 'curl/7.88.1',
      'Accept': '*/*',
    },
  ];

  for (const headers of headerSets) {
    try {
      console.log(`  Trying: ${headers['User-Agent'].substring(0, 55)}...`);
      const res = await fetch('https://liftie.info/api/resorts', { headers });
      if (res.ok) {
        const raw = await res.json();
        const list = Object.entries(raw).map(([slug, data]) => ({
          slug,
          name: data.name ?? slug,
        }));
        console.log(`  Success -- ${list.length} resorts\n`);
        return list;
      }
      console.log(`  HTTP ${res.status}`);
    } catch (err) {
      console.log(`  Failed: ${err.message}`);
    }
    await new Promise(r => setTimeout(r, 500));
  }

  return null;
}

// ─── Parse a raw JSON file saved from the browser ────────────────────────────

function parseLocalRaw(filePath) {
  try {
    const raw = JSON.parse(readFileSync(filePath, 'utf8'));
    if (Array.isArray(raw)) return raw;
    return Object.entries(raw).map(([slug, data]) => ({
      slug,
      name: data.name ?? slug,
    }));
  } catch (err) {
    console.warn(`  Could not parse ${filePath}: ${err.message}`);
    return null;
  }
}

// ─── Write fallback output and print manual instructions ─────────────────────

function writeFallback() {
  console.log('\n--- Liftie API blocked (403) ---\n');
  console.log('The seed file (resort-sources-seed.js) already has Liftie slugs for ~100');
  console.log('major resorts. You can skip this script and run merge-sources.mjs now.');
  console.log('The only resorts that will be missing lift status data are smaller mountains');
  console.log('not already in the seed.\n');
  console.log('To get full coverage, use Option B:\n');
  console.log('  1. Open this URL in your browser:');
  console.log('     https://liftie.info/api/resorts');
  console.log('  2. The browser will show a JSON page (Liftie allows browser requests)');
  console.log('  3. Save it as: scripts/output/liftie-raw.json');
  console.log('  4. Re-run this script -- it will detect and use the local file\n');

  const fallback = RESORTS.map(r => ({
    id:          r.id,
    name:        r.name,
    state:       r.state,
    liftieSlug:  null,
    liftieName:  null,
    matchType:   'not_fetched',
    matchScore:  0,
    needsReview: false,
    note:        'Liftie API returned 403 -- use Option B or rely on seed file',
  }));

  mkdirSync(OUT_DIR, { recursive: true });
  writeFileSync(OUT_FILE, JSON.stringify(fallback, null, 2), 'utf8');
  console.log(`Fallback output written to: ${OUT_FILE}`);
  console.log('You can run merge-sources.mjs now -- seed slugs will be used.');
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  mkdirSync(OUT_DIR, { recursive: true });

  let liftieResorts = null;

  // Check for browser-saved local file first
  if (existsSync(LOCAL_RAW)) {
    console.log('Found scripts/output/liftie-raw.json -- using local file\n');
    liftieResorts = parseLocalRaw(LOCAL_RAW);
  }

  // If no local file, try the API
  if (!liftieResorts) {
    console.log('Fetching Liftie resort list...');
    liftieResorts = await fetchLiftieResorts();
  }

  // If still nothing, write fallback and exit cleanly
  if (!liftieResorts) {
    writeFallback();
    return;
  }

  console.log(`Matching ${RESORTS.length} resorts against ${liftieResorts.length} Liftie entries...\n`);

  const results = [];
  const counts  = { exact_id: 0, exact_name: 0, fuzzy_strong: 0, fuzzy_weak: 0, no_match: 0 };

  for (const resort of RESORTS) {
    const match = matchResort(resort, liftieResorts);

    const result = {
      id:          resort.id,
      name:        resort.name,
      state:       resort.state,
      liftieSlug:  match?.slug       ?? null,
      liftieName:  match?.liftieName ?? null,
      matchType:   match?.matchType  ?? 'no_match',
      matchScore:  match?.score      ?? 0,
      needsReview: !match || match.matchType === 'fuzzy_weak',
    };

    counts[match?.matchType ?? 'no_match']++;

    const flag   = result.needsReview ? ' <-- REVIEW' : '';
    const status = match
      ? `${match.slug} ("${match.liftieName}") [${match.matchType}]`
      : 'NO MATCH';

    console.log(`  ${resort.name.padEnd(34)} ${status}${flag}`);
    results.push(result);
  }

  writeFileSync(OUT_FILE, JSON.stringify(results, null, 2), 'utf8');

  const reviewNeeded = results.filter(r => r.needsReview).length;

  console.log('\n--- Summary ---');
  console.log(`Exact ID match:    ${counts.exact_id}`);
  console.log(`Exact name match:  ${counts.exact_name}`);
  console.log(`Fuzzy strong:      ${counts.fuzzy_strong}`);
  console.log(`Fuzzy weak:        ${counts.fuzzy_weak}  <-- review these`);
  console.log(`No match:          ${counts.no_match}   <-- not on Liftie`);
  console.log(`\nTotal needing review: ${reviewNeeded}`);
  console.log(`\nOutput: ${OUT_FILE}`);
}

// avoid process.exit() -- causes Windows Node.js assertion error in async context
main().catch(err => console.error('Script error:', err.message));
