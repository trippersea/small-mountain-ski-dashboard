/**
 * /api/conditions — SnoCountry live resort data
 *
 * ── ON / OFF TOGGLE ──────────────────────────────────────────────────────────
 *  ON  (demo)  : set SNOCOUNTRY_API_KEY = SnoCountry.example  in Vercel env vars
 *  ON  (live)  : set SNOCOUNTRY_API_KEY = <your real key>     in Vercel env vars
 *  OFF         : remove SNOCOUNTRY_API_KEY from Vercel env vars entirely
 *
 * ── DEMO KEY BEHAVIOUR ───────────────────────────────────────────────────────
 *  The demo key (SnoCountry.example) only works with state/region queries —
 *  direct ID lookups return empty. This handler automatically falls back to
 *  a state query + name filter when an ID query returns no results.
 *  With the demo key only 3 VT resorts are returned per state call:
 *  Bolton Valley, Bromley Mountain Resort, Burke Mountain Resort.
 *
 * Accepts: POST { resortSlug?, snocountryId?, state?, region?, action? }
 * Returns: { conditions: [...], source, usingDemoKey, fetchedAt } | { disabled, error }
 */

const BASE_URL_HTTPS = 'https://feeds.snocountry.net';
const BASE_URL_HTTP  = 'http://feeds.snocountry.net';

// ── ID map: slug → SnoCountry numeric ID ─────────────────────────────────────
// Run get-snocountry-ids.mjs to populate this with all 256 resorts.
// The 3 VT entries below are confirmed via live demo key fetch.
const ID_MAP = {
  'bolton-valley':    802002,
  'bromley-mountain': 802003,
  'burke-mountain':   802004,
  // Paste snocountry-id-map.js output here after running get-snocountry-ids.mjs
};

// ── Slug → state (used for demo-key fallback: state query when ID returns empty)
const SLUG_TO_STATE = {
  'attitash':'NH','bear-creek-mountain-resort':'PA','belleayre':'NY',
  'berkshire-east':'MA','big-boulder':'PA','big-squaw-mountain-ski-resort':'ME',
  'black-mountain':'NH','black-mountain-of-maine':'ME','blue-hills-ski-area':'MA',
  'blue-knob':'PA','blue-mountain-ski-area':'PA','bolton-valley':'VT',
  'bousquet-ski-area':'MA','bradford-ski-area':'MA','brantling-ski-slopes':'NY',
  'bretton-woods':'NH','bristol-mountain':'NY','bromley-mountain':'VT',
  'buffalo-ski-club-ski-area':'NY','burke-mountain':'VT','camelback-mountain-resort':'PA',
  'camden-snow-bowl':'ME','campgaw-mountain':'NJ','cannon-mountain':'NH',
  'catamount-ski-ride-area':'NY','cranmore-mountain-resort':'NH','crotched-mountain':'NH',
  'dartmouth-skiway':'NH','dry-hill-ski-area':'NY','eagle-rock':'PA',
  'elk-mountain-ski-resort':'PA','gore-mountain':'NY','granite-gorge':'NH',
  'greek-peak':'NY','gunstock':'NH','holimont-ski-area':'NY','holiday-mountain':'NY',
  'holiday-valley':'NY','hunt-hollow-ski-club':'NY','hunter-mountain':'NY',
  'jack-frost':'PA','jay-peak':'VT','jiminy-peak':'MA','killington-resort':'VT',
  'king-pine':'NH','kissing-bridge':'NY','labrador-mt':'NY','liberty':'PA',
  'loon-mountain':'NH','lost-valley':'ME','mad-river-glen':'VT',
  'magic-mountain':'VT','maple-ski-ridge':'NY','mcintyre-ski-area':'NH',
  'mccauley-mountain-ski-center':'NY','middlebury-snow-bowl':'VT',
  'mohawk-mountain':'CT','montage-mountain':'PA','mount-peter-ski-area':'NY',
  'mount-pleasant-of-edinboro':'PA','mount-snow':'VT','mount-southington-ski-area':'CT',
  'mount-sunapee':'NH','mountain-creek-resort':'NJ','mt-abram-ski-resort':'ME',
  'nashoba-valley':'MA','new-hermon-mountain':'ME','oak-mountain':'NY',
  'okemo-mountain-resort':'VT','otis-ridge-ski-area':'MA','pats-peak':'NH',
  'peekn-peak':'NY','pico-mountain-at-killington':'VT','plattekill-mountain':'NY',
  'powder-ridge-park':'CT','ragged-mountain-resort':'NH','roundtop-mountain-resort':'PA',
  'royal-mountain-ski-area':'NY','saddleback-inc':'ME','seven-springs':'PA',
  'shawnee-mountain-ski-area':'PA','shawnee-peak':'ME','ski-big-bear':'PA',
  'ski-butternut':'MA','ski-sawmill':'PA','ski-sundown':'CT','ski-ward':'MA',
  'smugglers-notch-resort':'VT','snow-ridge':'NY','song-mountain':'NY',
  'spring-mountain-ski-area':'PA','stowe-mountain-resort':'VT','stratton-mountain':'VT',
  'sugarbush':'VT','sugarloaf':'ME','suicide-six':'VT','sunday-river':'ME',
  'swain':'NY','tenney-mountain':'NH','thunder-ridge':'NY','titus-mountain':'NY',
  'toggenburg-mountain':'NY','tussey-mountain':'PA','wachusett-mountain-ski-area':'MA',
  'waterville-valley':'NH','west-mountain':'NY','whaleback-mountain':'NH',
  'whiteface-mountain-resort':'NY','whitetail-resort':'PA','wildcat-mountain':'NH',
  'willard-mountain':'NY','windham-mountain':'NY','woods-valley-ski-area':'NY',
  'yawgoo-valley':'RI',
};

// Simple name normaliser for fallback matching
function normName(s) {
  return String(s).toLowerCase()
    .replace(/resort|mountain|ski area|ski/g, '').replace(/[^a-z0-9]/g, '').trim();
}

module.exports = async function handler(req, res) {
  const { applyCors, applyApiBaselineSecurity, rateLimit, readRawBody, safeJsonParse } = require('./_security');
  const cors = applyCors(req, res, { methods: ['POST', 'OPTIONS'], headers: ['Content-Type'] });
  applyApiBaselineSecurity(res, { cacheControl: 'public, s-maxage=60, stale-while-revalidate=300' });

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST')   return res.status(405).json({ error: 'Method not allowed' });
  if (req.headers.origin && !cors.allowed) return res.status(403).json({ error: 'Origin not allowed' });

  const rl = rateLimit(req, res, { prefix: 'conditions', max: 45, windowMs: 60_000 });
  if (!rl.ok) return res.status(429).json({ error: 'Too many requests' });

  // ── ON/OFF toggle ─────────────────────────────────────────────────────────
  const apiKey = process.env.SNOCOUNTRY_API_KEY;
  if (!apiKey) {
    return res.status(200).json({
      conditions: null,
      disabled: true,
      message: 'SnoCountry off. Set SNOCOUNTRY_API_KEY in Vercel env vars to enable.',
    });
  }

  const usingDemoKey = apiKey === 'SnoCountry.example';

  // ── Parse body ─────────────────────────────────────────────────────────────
  let body;
  try {
    const raw = await readRawBody(req, { limitBytes: 40_000 });
    const parsed = safeJsonParse(raw);
    if (!parsed) return res.status(400).json({ error: 'Could not parse request body' });
    body = parsed;
  } catch {
    return res.status(400).json({ error: 'Could not parse request body' });
  }

  const { resortSlug, snocountryId, state, region, action } = body || {};

  // ── Helper: call SnoCountry and parse (HTTPS first, HTTP fallback) ─────────
  async function callSnoCountry(qs) {
    const urlHttps = `${BASE_URL_HTTPS}/getSnowReport.php?${qs}`;
    const urlHttp  = `${BASE_URL_HTTP}/getSnowReport.php?${qs}`;

    let response;
    try {
      response = await fetch(urlHttps, {
        headers: { 'Accept': 'application/json' },
        signal: AbortSignal.timeout(8000),
      });
    } catch {
      response = await fetch(urlHttp, {
        headers: { 'Accept': 'application/json' },
        signal: AbortSignal.timeout(8000),
      });
    }
    if (!response.ok) throw new Error(`SnoCountry returned ${response.status}`);

    const raw = await response.json();
    const items = Array.isArray(raw)
      ? raw
      : typeof raw === 'object' && raw !== null
        ? Object.values(raw).filter(v => v && typeof v === 'object' && v.id)
        : [];
    return items;
  }

  // ── Build and execute request ──────────────────────────────────────────────
  try {
    let items = [];

    if (snocountryId) {
      // Direct numeric ID — always try this first
      const qs = `apiKey=${encodeURIComponent(apiKey)}&ids=${encodeURIComponent(snocountryId)}`;
      items = await callSnoCountry(qs);

    } else if (resortSlug) {
      const id    = ID_MAP[resortSlug];
      const state = SLUG_TO_STATE[resortSlug];

      if (id) {
        // Try ID lookup first
        const qs = `apiKey=${encodeURIComponent(apiKey)}&ids=${encodeURIComponent(id)}`;
        items = await callSnoCountry(qs);
      }

      // Fallback: if ID returned nothing (demo key limitation) try state query + name filter
      if (items.length === 0 && state) {
        const qs = `apiKey=${encodeURIComponent(apiKey)}&states=${encodeURIComponent(state.toLowerCase())}`;
        const all = await callSnoCountry(qs);
        // Match by normalised name
        const slugNorm = normName(resortSlug.replace(/-/g, ' '));
        const match = all.find(r => normName(r.resortName || '') === slugNorm)
          || all.find(r => {
              const rn = normName(r.resortName || '');
              return rn.includes(slugNorm) || slugNorm.includes(rn);
            });
        if (match) items = [match];
      }

    } else if (state) {
      const qs = `apiKey=${encodeURIComponent(apiKey)}&states=${encodeURIComponent(state)}`;
      items = await callSnoCountry(qs);

    } else if (region) {
      const qs = `apiKey=${encodeURIComponent(apiKey)}&regions=${encodeURIComponent(region)}`;
      items = await callSnoCountry(qs);

    } else {
      return res.status(400).json({
        error: 'Provide one of: resortSlug, snocountryId, state, or region',
        example: { resortSlug: 'bromley-mountain' },
      });
    }

    if (action === 'top20') {
      // top20 must be a separate request — re-request with action param if needed
    }

    const conditions = items.map(normalizeResort);
    return res.status(200).json({
      conditions,
      count:        conditions.length,
      source:       'snocountry',
      usingDemoKey,
      fetchedAt:    new Date().toISOString(),
    });

  } catch (err) {
    console.error('[/api/conditions] Error:', err.message);
    return res.status(502).json({ error: 'SnoCountry unavailable' });
  }
};

// ── Normalize a single SnoCountry resort record ───────────────────────────────
function normalizeResort(r) {
  const snow24Avg = (r.newSnowMin != null && r.newSnowMax != null)
    ? Math.round((parseFloat(r.newSnowMin) + parseFloat(r.newSnowMax)) / 2)
    : parseFloat(r.newSnowMin) || null;

  const trailsPct = r.openDownHillPercent != null
    ? Math.round(parseFloat(r.openDownHillPercent))
    : (r.openDownHillTrails && r.maxOpenDownHillTrails)
      ? Math.round((r.openDownHillTrails / r.maxOpenDownHillTrails) * 100)
      : null;

  return {
    snocountryId:     r.id                              || null,
    resortName:       r.resortName                      || null,
    state:            r.state                           || null,
    reportedAt:       r.reportDateTime                  || null,
    resortStatus:     r.resortStatus                    || null,
    isOpen:           [1,2,3,4].includes(parseInt(r.resortStatus)),
    operatingStatus:  r.operatingStatus                 || null,
    snow24hMin:       parseFloat(r.newSnowMin)          || null,
    snow24hMax:       parseFloat(r.newSnowMax)          || null,
    snow24hAvg:       snow24Avg,
    snow48h:          r.snowLast48Hours                 || null,
    baseDepthMin:     parseFloat(r.avgBaseDepthMin)     || null,
    baseDepthMax:     parseFloat(r.avgBaseDepthMax)     || null,
    surfaceCondition: r.primarySurfaceCondition         || null,
    snowComments:     r.snowComments                    || null,
    trailsOpen:       parseInt(r.openDownHillTrails)    || null,
    trailsTotal:      parseInt(r.maxOpenDownHillTrails) || null,
    trailsPct,
    liftsOpen:        parseInt(r.openDownHillLifts)     || null,
    liftsTotal:       parseInt(r.maxOpenDownHillLifts)  || null,
    acresOpen:        parseInt(r.openDownHillAcres)     || null,
    acresTotal:       parseInt(r.maxOpenDownHillAcres)  || null,
    weekdayHours:     r.weekdayHours                    || null,
    weekendHours:     r.weekendHours                    || null,
    nightSkiing:      r.nightSkiing === 'Yes',
    hasPark:          r['Parks-n-Pipes-Available'] === 'Yes',
    parkDetails:      r['Parks-n-Pipes']                || null,
  };
}

// (raw body helper moved to api/_security.js)
