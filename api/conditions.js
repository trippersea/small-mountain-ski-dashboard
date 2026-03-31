/**
 * /api/conditions — SnoCountry live resort data
 *
 * ── ON / OFF TOGGLE ──────────────────────────────────────────────────────────
 *  ON  (demo)  : set SNOCOUNTRY_API_KEY = SnoCountry.example  in Vercel env vars
 *  ON  (live)  : set SNOCOUNTRY_API_KEY = <your real key>     in Vercel env vars
 *  OFF         : remove SNOCOUNTRY_API_KEY from Vercel env vars entirely
 *
 *  No code changes ever needed to flip the switch.
 *  When the env var is absent this function returns { disabled: true }.
 *  The frontend reads that flag and keeps all condition slots hidden — nothing breaks.
 *
 * ── GETTING A REAL KEY ───────────────────────────────────────────────────────
 *  Contact: Andrew Davis  andrew.davis@snocountry.org  /  603-443-8823
 *  ~$2,150/year for full US coverage
 *
 * ── ID MAP ───────────────────────────────────────────────────────────────────
 *  Maps your resort slugs (from resorts-national.js) to SnoCountry numeric IDs.
 *  Run  node get-snocountry-ids.mjs  to auto-generate this from SnoCountry's
 *  resort list, then paste the output below to replace the placeholder map.
 *
 * Accepts: POST { resortSlug?, snocountryId?, state?, region?, action? }
 * Returns: { conditions: [...], source, usingDemoKey, fetchedAt } | { disabled, error }
 */

const BASE_URL = 'http://feeds.snocountry.net';

// ── ID map: your resort slug → SnoCountry numeric ID ─────────────────────────
// ⚠️  These are PLACEHOLDERS. Run get-snocountry-ids.mjs to replace with real IDs.
// The demo key (SnoCountry.example) only returns 3 resorts per request, so most
// slug lookups will return no data until you populate this with real IDs.
const ID_MAP = {
  // ── Vermont (confirmed via live demo key fetch) ──────────────────────────
  'bolton-valley':    802002,  // Bolton Valley Resort
  'bromley-mountain': 802003,  // Bromley Mountain Resort
  'burke-mountain':   802004,  // Burke Mountain Resort

  // ── All other resorts: run get-snocountry-ids.mjs to fill in the rest ───
  // Paste the output from snocountry-id-map.js here after running that script.
};

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin',  '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST')   return res.status(405).json({ error: 'Method not allowed' });

  // ── ON/OFF toggle — env var controls everything ───────────────────────────
  const apiKey = process.env.SNOCOUNTRY_API_KEY;
  if (!apiKey) {
    return res.status(200).json({
      conditions: null,
      disabled: true,
      message: 'SnoCountry integration is off. Set SNOCOUNTRY_API_KEY in Vercel env vars to enable.',
    });
  }

  const usingDemoKey = apiKey === 'SnoCountry.example';

  // ── Parse body ─────────────────────────────────────────────────────────────
  let body;
  try {
    const raw = await rawBody(req);
    body = raw ? JSON.parse(raw) : (req.body || {});
  } catch {
    return res.status(400).json({ error: 'Could not parse request body' });
  }

  const { resortSlug, snocountryId, state, region, action } = body || {};

  // ── Build SnoCountry request URL ──────────────────────────────────────────
  let url;

  if (snocountryId) {
    url = `${BASE_URL}/getSnowReport.php?apiKey=${apiKey}&ids=${snocountryId}`;

  } else if (resortSlug) {
    const id = ID_MAP[resortSlug];
    if (!id) {
      return res.status(404).json({
        error: `No SnoCountry ID mapped for: "${resortSlug}". Run get-snocountry-ids.mjs to build the full ID map.`,
        tip: 'Until the ID map is populated, use state or region requests instead.',
      });
    }
    url = `${BASE_URL}/getSnowReport.php?apiKey=${apiKey}&ids=${id}`;

  } else if (state) {
    url = `${BASE_URL}/getSnowReport.php?apiKey=${apiKey}&states=${state}`;

  } else if (region) {
    // Note: region requests should not be made more than once every 10-15 min (SnoCountry guideline)
    url = `${BASE_URL}/getSnowReport.php?apiKey=${apiKey}&regions=${region}`;

  } else {
    return res.status(400).json({
      error: 'Provide one of: resortSlug, snocountryId, state, or region',
      example: { state: 'vt' },
    });
  }

  if (action === 'top20') url += '&action=top20';

  // ── Call SnoCountry ────────────────────────────────────────────────────────
  try {
    const response = await fetch(url, {
      headers: { 'Accept': 'application/json' },
      signal: AbortSignal.timeout(8000),
    });

    if (!response.ok) {
      const text = await response.text();
      console.error('[/api/conditions] SnoCountry error:', response.status, text.slice(0, 200));
      return res.status(502).json({ error: `SnoCountry returned ${response.status}` });
    }

    const raw = await response.json();
    const items = Array.isArray(raw)
      ? raw
      : typeof raw === 'object' && raw !== null
        ? Object.values(raw).filter(v => v && typeof v === 'object' && v.id)
        : [];

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
    return res.status(502).json({ error: 'SnoCountry unavailable — ' + err.message });
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
    snocountryId:     r.id                             || null,
    resortName:       r.resortName                     || null,
    state:            r.state                          || null,
    reportedAt:       r.reportDateTime                 || null,
    resortStatus:     r.resortStatus                   || null,
    isOpen:           [1, 2, 3, 4].includes(parseInt(r.resortStatus)),
    operatingStatus:  r.operatingStatus                || null,
    snow24hMin:       parseFloat(r.newSnowMin)         || null,
    snow24hMax:       parseFloat(r.newSnowMax)         || null,
    snow24hAvg:       snow24Avg,
    snow48h:          r.snowLast48Hours                || null,
    baseDepthMin:     parseFloat(r.avgBaseDepthMin)    || null,
    baseDepthMax:     parseFloat(r.avgBaseDepthMax)    || null,
    surfaceCondition: r.primarySurfaceCondition        || null,
    snowComments:     r.snowComments                   || null,
    trailsOpen:       parseInt(r.openDownHillTrails)   || null,
    trailsTotal:      parseInt(r.maxOpenDownHillTrails)|| null,
    trailsPct,
    liftsOpen:        parseInt(r.openDownHillLifts)    || null,
    liftsTotal:       parseInt(r.maxOpenDownHillLifts) || null,
    acresOpen:        parseInt(r.openDownHillAcres)    || null,
    acresTotal:       parseInt(r.maxOpenDownHillAcres) || null,
    weekdayHours:     r.weekdayHours                   || null,
    weekendHours:     r.weekendHours                   || null,
    nightSkiing:      r.nightSkiing === 'Yes',
    hasPark:          r['Parks-n-Pipes-Available'] === 'Yes',
    parkDetails:      r['Parks-n-Pipes']               || null,
  };
}

// ── Helper: read raw request body ─────────────────────────────────────────────
function rawBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data',  chunk => { data += chunk; });
    req.on('end',   () => resolve(data));
    req.on('error', reject);
  });
}
