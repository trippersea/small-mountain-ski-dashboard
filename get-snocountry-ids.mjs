/**
 * get-snocountry-ids.mjs
 *
 * Run ONCE to build the SnoCountry ID map for conditions.js.
 * Fetches all US mountain IDs from SnoCountry and matches them to your resorts.
 *
 * ── Usage ────────────────────────────────────────────────────────────────────
 *  1. Open a terminal in your project root folder (same folder as sd-data.js)
 *  2. Run:  node get-snocountry-ids.mjs
 *  3. Wait ~30 seconds for it to fetch all US regions
 *  4. Open snocountry-id-map.json — review the "unmatched" list
 *  5. Copy the ID_MAP block from snocountry-id-map.js into api/conditions.js
 *
 * ── Notes ────────────────────────────────────────────────────────────────────
 *  Uses the free demo key by default (returns real IDs, no cost).
 *  Re-run with your real key once purchased for complete coverage.
 *  About 70-80% of resorts match automatically. Unmatched ones need manual lookup.
 */

import fs   from 'fs';
import path from 'path';
import vm   from 'vm';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const API_KEY   = process.env.SNOCOUNTRY_API_KEY || 'SnoCountry.example';
const BASE_URL_HTTPS = 'https://feeds.snocountry.net';
const BASE_URL_HTTP  = 'http://feeds.snocountry.net';
const REGIONS   = ['northeast', 'southeast', 'rockies', 'midwest', 'northwest', 'southwest'];

// ── Load your resort data (mirrors how generate-mountain-pages.mjs loads it) ──
function loadYourResorts() {
  const resorts = [];

  // Load NE resorts from sd-data.js
  try {
    const sdData = fs.readFileSync(path.join(__dirname, 'sd-data.js'), 'utf8');
    const ctx = {};
    vm.runInNewContext(sdData + '\nglobalThis.__out = RESORTS_NE;', ctx);
    const ne = ctx.__out || [];
    resorts.push(...ne);
    console.log(`  sd-data.js: ${ne.length} NE resorts`);
  } catch (e) {
    console.warn('  Warning: could not load sd-data.js:', e.message);
  }

  // Load national resorts from resorts-national.js
  const nationalPath = path.join(__dirname, 'resorts-national.js');
  if (fs.existsSync(nationalPath)) {
    try {
      const data = fs.readFileSync(nationalPath, 'utf8');
      const ctx  = {};
      vm.runInNewContext(data + '\nglobalThis.__out = RESORTS_NATIONAL;', ctx);
      const nat = ctx.__out || [];
      resorts.push(...nat);
      console.log(`  resorts-national.js: ${nat.length} national resorts`);
    } catch (e) {
      console.warn('  Warning: could not load resorts-national.js:', e.message);
    }
  }

  if (!resorts.length) {
    console.error('ERROR: No resorts loaded. Make sure you run this script from your project root.');
    process.exit(1);
  }

  // Deduplicate by id
  const seen = new Set();
  return resorts.filter(r => { if (seen.has(r.id)) return false; seen.add(r.id); return true; });
}

// ── Fetch resort list for one region ─────────────────────────────────────────
async function fetchRegion(region) {
  try {
    const urlHttps = `${BASE_URL_HTTPS}/getResortList.php?apiKey=${API_KEY}&regions=${region}&output=json`;
    const urlHttp  = `${BASE_URL_HTTP}/getResortList.php?apiKey=${API_KEY}&regions=${region}&output=json`;
    let res;
    try {
      res = await fetch(urlHttps, { signal: AbortSignal.timeout(12000) });
    } catch {
      res = await fetch(urlHttp, { signal: AbortSignal.timeout(12000) });
    }
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const raw  = await res.json();
    const items = Array.isArray(raw)
      ? raw
      : Object.values(raw).filter(v => v && v.id && v.resortName);
    return items.filter(r => r.resortType === 'NA_Alpine' || !r.resortType);
  } catch (err) {
    console.warn(`  Warning: ${region} fetch failed — ${err.message}`);
    return [];
  }
}

// ── Name normaliser for fuzzy matching ────────────────────────────────────────
function norm(name) {
  return String(name)
    .toLowerCase()
    .replace(/['''`]/g, '')
    .replace(/\bmount\b/g, 'mt')
    .replace(/\bmountain\b/g, 'mtn')
    .replace(/\bresort\b/g, '')
    .replace(/[^a-z0-9]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  console.log('=== SnoCountry ID Map Builder ===\n');
  console.log(`API key: ${API_KEY === 'SnoCountry.example' ? 'SnoCountry.example (demo — real IDs, limited results)' : 'Custom key'}`);
  console.log('');

  // 1. Load your resorts
  console.log('Loading your resort data...');
  const yourResorts = loadYourResorts();
  console.log(`  Total: ${yourResorts.length} unique resorts\n`);

  // 2. Fetch all SnoCountry US alpine resorts
  console.log('Fetching SnoCountry resort list (6 regions, ~2s between each)...');
  const all = [];
  for (const region of REGIONS) {
    process.stdout.write(`  ${region}... `);
    const results = await fetchRegion(region);
    all.push(...results);
    console.log(`${results.length} resorts`);
    await sleep(2200);
  }

  // Deduplicate by SnoCountry ID
  const unique = [...new Map(all.map(r => [r.id, r])).values()];
  console.log(`\nTotal unique SnoCountry alpine resorts: ${unique.length}\n`);

  // 3. Build match index from SnoCountry
  const scIndex = unique.map(r => ({
    id:         r.id,
    name:       r.resortName,
    state:      (r.state || '').toUpperCase(),
    norm:       norm(r.resortName || ''),
  }));

  // 4. Match your resorts to SnoCountry IDs
  const matched   = [];
  const unmatched = [];

  for (const yours of yourResorts) {
    const yourNorm  = norm(yours.name);
    const yourState = (yours.state || '').toUpperCase();

    // Try 1: exact normalised name + same state
    let hit = scIndex.find(sc => sc.norm === yourNorm && sc.state === yourState);

    // Try 2: exact normalised name any state
    if (!hit) hit = scIndex.find(sc => sc.norm === yourNorm);

    // Try 3: one contains the other, same state
    if (!hit) hit = scIndex.find(sc =>
      sc.state === yourState &&
      (sc.norm.includes(yourNorm) || yourNorm.includes(sc.norm)) &&
      Math.abs(sc.norm.length - yourNorm.length) < 10
    );

    if (hit) {
      matched.push({
        slug:         yours.id,
        name:         yours.name,
        state:        yours.state,
        snocountryId: hit.id,
        scName:       hit.name,
      });
    } else {
      unmatched.push({ slug: yours.id, name: yours.name, state: yours.state });
    }
  }

  console.log(`Matched:   ${matched.length} resorts  ✓`);
  console.log(`Unmatched: ${unmatched.length} resorts  — needs manual review\n`);

  // 5. Write full JSON results file
  fs.writeFileSync(
    'snocountry-id-map.json',
    JSON.stringify({ matched, unmatched, snocountryTotal: unique.length }, null, 2)
  );
  console.log('Written: snocountry-id-map.json  (full results + unmatched list)');

  // 6. Write ready-to-paste JS map
  const lines = matched.map(m =>
    `  '${m.slug}': ${m.snocountryId},  // ${m.name} (${m.state})`
  ).join('\n');

  const jsOut =
    `// Auto-generated by get-snocountry-ids.mjs — ${new Date().toISOString().slice(0,10)}\n` +
    `// ${unmatched.length} resorts unmatched — see snocountry-id-map.json for the manual review list\n` +
    `// Paste this block into api/conditions.js replacing the existing ID_MAP\n\n` +
    `const ID_MAP = {\n${lines}\n};\n`;

  fs.writeFileSync('snocountry-id-map.js', jsOut);
  console.log('Written: snocountry-id-map.js   (paste into api/conditions.js)');

  // 7. Print unmatched for immediate review
  if (unmatched.length) {
    console.log('\n── Unmatched resorts (manual lookup needed) ─────────────────────────────');
    console.log('For each one below, find its ID in snocountry-id-map.json under "unmatched"');
    console.log('then search feeds.snocountry.net for the resort by name to confirm the ID.\n');
    unmatched.forEach(r => console.log(`  ${r.name.padEnd(40)} (${r.state})  slug: ${r.slug}`));
  }

  console.log('\n── Next step ────────────────────────────────────────────────────────────');
  console.log('1. Open snocountry-id-map.js');
  console.log('2. Copy the entire ID_MAP block');
  console.log('3. Open api/conditions.js');
  console.log('4. Replace the existing ID_MAP block with the copied one');
  console.log('5. Commit and push\n');
}

main().catch(err => { console.error('Fatal:', err.message); process.exit(1); });
