#!/usr/bin/env node
// generate-editorial.mjs
// Batch-generates mountain editorial entries grounded in resort + crowd-structural data.
// Writes mountain-editorial-generated.js with reviewed: false until a human flips them.
//
// Usage:
//   node generate-editorial.mjs              # all mountains lacking hand-written entries
//   node generate-editorial.mjs --state=VT   # Vermont pilot (17 mountains, skips hand-written)
//
// Requires: ANTHROPIC_API_KEY in environment. Never imports sd-scoring.js.

import fs from 'fs';
import path from 'path';
import vm from 'vm';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CRLF = '\r\n';

const MODEL = 'claude-sonnet-4-6';
const GOLD_EXAMPLE_IDS = ['killington-resort', 'mad-river-glen', 'jay-peak'];

const SYSTEM_PROMPT = `You write short, opinionated mountain write-ups for WhereToSkiNext.com in a
skier-to-skier voice. You are given verified data about one ski mountain and you
write an editorial entry grounded only in that data.

VOICE
- A skier talking to another skier. Direct, specific, a little opinionated.
- No marketing language, no product-manager language. Ban these: nestled, boasts,
  offers, whether you are, something for everyone, hidden gem, crown jewel.
- Short sentences beat long ones. Say the true thing plainly.
- Never use em dashes. Use periods, commas, and parentheses.

HARD RULES
- Use ONLY the facts in DATA. Do not invent vertical, acreage, snowfall, price,
  pass status, lifts, or anything else. If a fact is not in DATA, do not state it.
- Never claim live or current conditions. Do not say snow fell recently or that
  lifts are open now. Describe how the mountain tends to behave from its structure.
- The crowd take must reason from the CROWD SIGNALS provided (metro pull, pass
  network, destination draw, lift capacity), framed as predicted pressure, never
  as measured lift lines.
- Match the GOLD EXAMPLES in register, length, and shape.

OUTPUT
Return strict JSON only. No markdown, no backticks, no preamble. Shape:
{
  "hook": "one sharp line, under 12 words",
  "lede": "40 to 60 words framing why this mountain is what it is",
  "body": ["paragraph 50 to 80 words", "paragraph 50 to 80 words"],
  "crowdTake": "40 to 60 words grounded in the crowd signals",
  "alternatives": [{ "id": "<id from CANDIDATES only>", "take": "one line on why send them here instead" }]
}
Pick 1 or 2 alternatives, using ids from CANDIDATES only.`;

const BANNED_VOICE = [
  'nestled', 'boasts', 'offers', 'whether you are', 'something for everyone',
  'hidden gem', 'crown jewel',
];
const EM_DASH_RE = /[\u2014\u2013]/;

const PASS_SOURCES = {
  Epic: { label: 'Epic Pass', url: 'https://www.epicpass.com/' },
  Ikon: { label: 'Ikon Pass', url: 'https://www.ikonpass.com/' },
  Indy:   { label: 'Indy Pass', url: 'https://www.indypass.com/' },
};

const STANDARD_SOURCES = [
  { label: 'OnTheSnow', url: 'https://www.onthesnow.com/' },
  { label: 'Skiresort.info', url: 'https://www.skiresort.info/' },
  { label: 'National Ski Areas Association', url: 'https://www.nsaa.org/' },
];

// ─── Loaders (same pattern as generate-mountain-pages.mjs) ─────────────────────

function loadResorts() {
  const src = fs.readFileSync(path.join(__dirname, 'resorts.js'), 'utf8');
  const ctx = {};
  vm.runInNewContext(src + '\nglobalThis.__out = RESORTS;', ctx);
  const resorts = ctx.__out || [];
  if (!resorts.length) throw new Error('Could not load RESORTS from resorts.js');
  return resorts;
}

function loadHandWrittenEditorial() {
  const editorialPath = path.join(__dirname, 'mountain-editorial.js');
  if (!fs.existsSync(editorialPath)) return {};
  const ctx = {};
  const code = fs.readFileSync(editorialPath, 'utf8');
  vm.runInNewContext(code + '\nglobalThis.__editorial = MOUNTAIN_EDITORIAL;', ctx);
  return ctx.__editorial || {};
}

function loadCrowdStructural() {
  const files = {
    mg: 'metro_gravity_final.js',
    lt: 'lift_capacity_tiers_final.js',
    cs: 'crowd-structural.js',
  };
  for (const f of Object.values(files)) {
    if (!fs.existsSync(path.join(__dirname, f))) {
      throw new Error(`${f} not found. Crowd structural tables required.`);
    }
  }
  const ctx = {};
  vm.runInNewContext(
    fs.readFileSync(path.join(__dirname, files.mg), 'utf8') +
    '\nglobalThis.__MG = METRO_GRAVITY;', ctx);
  vm.runInNewContext(
    fs.readFileSync(path.join(__dirname, files.lt), 'utf8') +
    '\nglobalThis.__LT = LIFT_CAPACITY_TIERS;', ctx);
  vm.runInNewContext(fs.readFileSync(path.join(__dirname, files.cs), 'utf8'), ctx);
  if (!ctx.WTSN_CROWD_STRUCT || !ctx.__MG || !ctx.__LT) {
    throw new Error('crowd-structural module or tables missing after eval');
  }
  return {
    struct: ctx.WTSN_CROWD_STRUCT,
    tables: { METRO_GRAVITY: ctx.__MG, LIFT_CAPACITY_TIERS: ctx.__LT },
  };
}

function loadExistingGenerated() {
  const generatedPath = path.join(__dirname, 'mountain-editorial-generated.js');
  if (!fs.existsSync(generatedPath)) return {};
  const ctx = {};
  const code = fs.readFileSync(generatedPath, 'utf8');
  vm.runInNewContext(code + '\nglobalThis.__generated = MOUNTAIN_EDITORIAL_GENERATED;', ctx);
  return ctx.__generated || {};
}

// ─── Helpers ───────────────────────────────────────────────────────────────────

function passLabel(pg) {
  return { Epic: 'Epic Pass', Ikon: 'Ikon Pass', Indy: 'Indy Pass', Independent: 'Independent' }[pg] || pg;
}

function distanceMiles(lat1, lon1, lat2, lon2) {
  const R = 3958.8;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function nearbyResorts(resort, allResorts, limit = 6) {
  return allResorts
    .filter(r => r.id !== resort.id)
    .map(r => ({ r, dist: distanceMiles(resort.lat, resort.lon, r.lat, r.lon) }))
    .sort((a, b) => a.dist - b.dist)
    .slice(0, limit)
    .map(x => x.r);
}

function metroGravityTier(rawMG) {
  if (rawMG >= 850) return 'very high';
  if (rawMG >= 650) return 'high';
  if (rawMG >= 450) return 'moderate';
  if (rawMG >= 250) return 'low';
  return 'minimal';
}

function liftCapacityLabel(tier) {
  const labels = {
    1: 'tier 1 (smallest regional capacity)',
    2: 'tier 2 (small)',
    3: 'tier 3 (mid)',
    4: 'tier 4 (large)',
    5: 'tier 5 (largest regional capacity)',
  };
  return labels[tier] || `tier ${tier}`;
}

function buildFactsPayload(resort) {
  return {
    id: resort.id,
    name: resort.name,
    state: resort.state,
    region: resort.region,
    vertical: resort.vertical,
    trails: resort.trails,
    lifts: resort.lifts,
    acres: resort.acres,
    longestRun: resort.longestRun,
    snowmaking: resort.snowmaking,
    price: resort.price,
    night: resort.night,
    terrainPark: resort.terrainPark,
    baseElevation: resort.baseElevation,
    summitElevation: resort.summitElevation,
    avgSnowfall: resort.avgSnowfall,
    terrainBreakdown: resort.terrainBreakdown,
    passGroup: resort.passGroup,
    ownerGroup: resort.ownerGroup,
    website: resort.website,
  };
}

function buildCrowdSignals(resort, crowd) {
  const demand = crowd.struct.structuralDemand(resort, crowd.tables);
  const rawTier = crowd.tables.LIFT_CAPACITY_TIERS[resort.id] ?? 3;
  return {
    metroGravityScore: demand.rawMG,
    metroGravityTier: metroGravityTier(demand.rawMG),
    passNetwork: resort.passGroup,
    passNetworkScore: demand.passScore,
    destinationDraw: demand.destPull,
    resortAttractors: demand.resortAttr,
    structuralDemandBase: demand.Dbase,
    liftCapacityTier: rawTier,
    liftCapacityLabel: liftCapacityLabel(rawTier),
  };
}

function buildCandidates(resort, allResorts) {
  return nearbyResorts(resort, allResorts, 6).map(r => ({
    id: r.id,
    name: r.name,
    summary: `${r.vertical.toLocaleString()} ft vert, ${r.acres} acres, ${passLabel(r.passGroup)}, ~$${r.price}`,
  }));
}

function attachSources(resort) {
  const sources = [];
  if (resort.website) {
    sources.push({ label: `${resort.name} (official site)`, url: resort.website });
  }
  sources.push(...STANDARD_SOURCES);
  const passSrc = PASS_SOURCES[resort.passGroup];
  if (passSrc) sources.push(passSrc);
  return sources;
}

function collectStrings(obj, out = []) {
  if (typeof obj === 'string') out.push(obj);
  else if (Array.isArray(obj)) obj.forEach(v => collectStrings(v, out));
  else if (obj && typeof obj === 'object') Object.values(obj).forEach(v => collectStrings(v, out));
  return out;
}

function validateEntry(entry, candidateIds, validResortIds) {
  const errors = [];
  if (!entry.hook || typeof entry.hook !== 'string') errors.push('missing hook');
  if (!entry.lede || typeof entry.lede !== 'string') errors.push('missing lede');
  if (!Array.isArray(entry.body) || entry.body.length === 0) errors.push('empty body');
  if (!entry.crowdTake || typeof entry.crowdTake !== 'string') errors.push('missing crowdTake');
  if (!Array.isArray(entry.alternatives) || entry.alternatives.length === 0) {
    errors.push('alternatives required');
  } else if (entry.alternatives.length > 2) {
    errors.push('too many alternatives');
  }

  for (const s of collectStrings(entry)) {
    if (EM_DASH_RE.test(s)) errors.push('em dash in copy');
    const lower = s.toLowerCase();
    for (const banned of BANNED_VOICE) {
      if (lower.includes(banned)) errors.push(`banned phrase: ${banned}`);
    }
  }

  for (const alt of entry.alternatives || []) {
    if (!alt.id || !candidateIds.has(alt.id)) {
      errors.push(`alternative id not in candidates: ${alt.id}`);
    }
    if (!validResortIds.has(alt.id)) {
      errors.push(`alternative id not in resorts: ${alt.id}`);
    }
  }

  return errors;
}

function parseStateArg() {
  const arg = process.argv.find(a => a.startsWith('--state='));
  return arg ? arg.split('=')[1].toUpperCase() : null;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function callAnthropic(apiKey, userMessage, retries = 2) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 2048,
        system: SYSTEM_PROMPT,
        messages: [{ role: 'user', content: userMessage }],
      }),
    });

    if (res.status === 429 && attempt < retries) {
      const wait = 2000 * (attempt + 1);
      console.warn(`  Rate limited, waiting ${wait}ms...`);
      await sleep(wait);
      continue;
    }

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Anthropic API ${res.status}: ${errText.slice(0, 300)}`);
    }

    const data = await res.json();
    const text = data.content?.find(c => c.type === 'text')?.text || '';
    return text.trim();
  }
  throw new Error('Anthropic API retries exhausted');
}

function parseModelJson(raw) {
  let text = raw.trim();
  if (text.startsWith('```')) {
    text = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');
  }
  return JSON.parse(text);
}

function buildGoldExamples(handWritten) {
  const examples = [];
  for (const id of GOLD_EXAMPLE_IDS) {
    const entry = handWritten[id];
    if (entry) examples.push({ id, ...entry });
  }
  return examples;
}

function serializeGeneratedFile(entries) {
  const header = [
    '/* ─────────────────────────────────────────────────────────────────────────────',
    ' *  mountain-editorial-generated.js',
    ' *  AI-drafted entries from generate-editorial.mjs. Flip reviewed: true after human read.',
    ' *  Hand-written entries in mountain-editorial.js always win at build time.',
    ' * ───────────────────────────────────────────────────────────────────────── */',
    '',
    'const MOUNTAIN_EDITORIAL_GENERATED = {',
  ].join(CRLF);

  const ids = Object.keys(entries).sort();
  const blocks = ids.map(id => {
    const json = JSON.stringify(entries[id], null, 2);
    const indented = json.split('\n').map(line => '  ' + line).join(CRLF);
    return `  '${id}': ${indented.slice(2)}`;
  });

  const footer = [
    '};',
    '',
    'if (typeof module !== \'undefined\') {',
    '  module.exports = { MOUNTAIN_EDITORIAL_GENERATED };',
    '}',
    '',
  ].join(CRLF);

  return header + CRLF + blocks.join(',' + CRLF) + CRLF + footer;
}

function writeGeneratedFile(entries) {
  const outPath = path.join(__dirname, 'mountain-editorial-generated.js');
  fs.writeFileSync(outPath, serializeGeneratedFile(entries), 'utf8');
}

// ─── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.error('ANTHROPIC_API_KEY is not set. Export it and re-run.');
    process.exit(1);
  }

  const stateFilter = parseStateArg();
  const resorts = loadResorts();
  const handWritten = loadHandWrittenEditorial();
  const crowd = loadCrowdStructural();
  const existingGenerated = loadExistingGenerated();
  const validResortIds = new Set(resorts.map(r => r.id));

  const goldExamples = buildGoldExamples(handWritten);
  if (goldExamples.length < 2) {
    console.error(`Need at least 2 gold hand-written entries. Found ${goldExamples.length}.`);
    process.exit(1);
  }

  let targets = resorts.filter(r => !handWritten[r.id]);
  if (stateFilter) {
    targets = targets.filter(r => r.state === stateFilter);
    console.log(`State filter: ${stateFilter} (${targets.length} mountains without hand-written editorial)`);
  } else {
    console.log(`${targets.length} mountains without hand-written editorial`);
  }

  if (targets.length === 0) {
    console.log('Nothing to generate.');
    return;
  }

  const goldBlock = JSON.stringify(goldExamples, null, 2);
  const output = { ...existingGenerated };
  const today = new Date().toISOString().slice(0, 10);
  let ok = 0;
  let skipped = 0;

  for (const resort of targets) {
    console.log(`\n→ ${resort.name} (${resort.id})`);

    const facts = buildFactsPayload(resort);
    const crowdSignals = buildCrowdSignals(resort, crowd);
    const candidates = buildCandidates(resort, resorts);
    const candidateIds = new Set(candidates.map(c => c.id));

    const userMessage = [
      'GOLD EXAMPLES',
      goldBlock,
      '',
      'DATA',
      JSON.stringify({ facts, crowdSignals }, null, 2),
      '',
      'CANDIDATES',
      JSON.stringify(candidates, null, 2),
    ].join('\n');

    let parsed = null;
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const raw = await callAnthropic(apiKey, userMessage);
        parsed = parseModelJson(raw);
        break;
      } catch (e) {
        console.warn(`  Parse/API attempt ${attempt + 1} failed: ${e.message}`);
        if (attempt === 1) {
          console.warn('  Skipping this mountain.');
          skipped++;
        }
      }
    }

    if (!parsed) continue;

    const errors = validateEntry(parsed, candidateIds, validResortIds);
    if (errors.length) {
      console.warn(`  Validation failed: ${errors.join('; ')}`);
      skipped++;
      continue;
    }

    output[resort.id] = {
      hook: parsed.hook.trim(),
      lede: parsed.lede.trim(),
      body: parsed.body.map(p => p.trim()),
      crowdTake: parsed.crowdTake.trim(),
      alternatives: parsed.alternatives.map(a => ({
        id: a.id,
        take: (a.take || '').trim(),
      })),
      sources: attachSources(resort),
      lastUpdated: today,
      reviewed: false,
      generated: true,
    };

    ok++;
    console.log(`  OK ${parsed.hook}`);

    await sleep(500);
  }

  writeGeneratedFile(output);
  console.log(`\nDone. Generated ${ok}, skipped ${skipped}.`);
  console.log(`Wrote mountain-editorial-generated.js (${Object.keys(output).length} total entries).`);
  console.log('Flip reviewed: true on approved entries, then run node generate-mountain-pages.mjs');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
