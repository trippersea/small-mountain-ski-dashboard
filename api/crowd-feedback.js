/**
 * POST /api/crowd-feedback - receives intent + crowd-reality reports from the
 * feedback loop (crowd-feedback.js) and writes them to Supabase.
 *
 * Body (type 'intent'):       { type, resort_id, resort_name, ski_day,
 *                               predicted_label, predicted_score, intent }
 * Body (type 'crowd_report'): { type, resort_id, resort_name, ski_day,
 *                               predicted_label, predicted_score, intent, report }
 * Plus session_id on both.
 *
 * This is the ground-truth channel for the crowd model. Each crowd_report row
 * pairs what we predicted (label + score) against what a real skier saw, so
 * over a season the aggregate shows where the model is miscalibrated, including
 * regions that were never hand-tuned. Reports are intentionally coarse
 * (three-point); accuracy comes from volume, not precision.
 */

const VALID_INTENT = new Set(['going', 'maybe', 'no']);
const VALID_REPORT = new Set(['quiet', 'about_right', 'packed']);
const ID_RE = /^[a-z0-9][a-z0-9-]{0,79}$/i;

function cleanStr(v, max) {
  return String(v == null ? '' : v).replace(/[\u0000-\u001F\u007F]/g, '').slice(0, max);
}

function parseBody(raw) {
  if (!raw || typeof raw !== 'object') return null;
  const type = raw.type === 'intent' ? 'intent' : raw.type === 'crowd_report' ? 'crowd_report' : null;
  if (!type) return null;

  const resortId = cleanStr(raw.resort_id, 80).trim();
  if (!ID_RE.test(resortId)) return null;

  const skiDay = cleanStr(raw.ski_day, 10).trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(skiDay)) return null;

  const predictedScore = raw.predicted_score == null ? null : Number(raw.predicted_score);
  if (predictedScore != null && (!Number.isFinite(predictedScore) || predictedScore < 0 || predictedScore > 100)) {
    return null;
  }

  const out = {
    type,
    resort_id:       resortId,
    resort_name:     cleanStr(raw.resort_name, 120),
    ski_day:         skiDay,
    predicted_label: cleanStr(raw.predicted_label, 20),
    predicted_score: predictedScore,
    intent:          cleanStr(raw.intent, 10),
    session_id:      cleanStr(raw.session_id, 64),
  };

  if (type === 'intent') {
    if (!VALID_INTENT.has(out.intent)) return null;
  } else {
    const report = cleanStr(raw.report, 20);
    if (!VALID_REPORT.has(report)) return null;
    out.report = report;
    if (out.intent && !VALID_INTENT.has(out.intent)) out.intent = '';
  }
  return out;
}

module.exports = async function handler(req, res) {
  const { applyCors, applyApiBaselineSecurity, rateLimit, readRawBody, safeJsonParse } = require('./_security');
  const cors = applyCors(req, res, { methods: ['POST', 'OPTIONS'], headers: ['Content-Type'] });
  applyApiBaselineSecurity(res, { cacheControl: 'no-store' });

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  if (req.headers.origin && !cors.allowed) return res.status(403).json({ error: 'Origin not allowed' });

  const rl = rateLimit(req, res, { prefix: 'cfb', max: 20, windowMs: 60_000 });
  if (!rl.ok) return res.status(429).json({ error: 'Too many requests' });

  let body;
  try {
    const raw = await readRawBody(req, { limitBytes: 8_000 });
    const parsed = safeJsonParse(raw);
    if (!parsed) return res.status(400).json({ error: 'Could not parse request body' });
    body = parsed;
  } catch (e) {
    if (e?.code === 'BODY_TOO_LARGE') return res.status(413).json({ error: 'Request body too large' });
    return res.status(400).json({ error: 'Could not parse request body' });
  }

  const rec = parseBody(body);
  if (!rec) return res.status(400).json({ error: 'Invalid feedback payload' });

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;
  if (!url || !key) {
    // Storage not configured: accept silently so the client never errors, but
    // signal not-persisted to logs. (Mirrors graceful-degradation elsewhere.)
    console.warn('[/api/crowd-feedback] Supabase env not set; report dropped');
    return res.status(200).json({ ok: true, stored: false });
  }

  try {
    const row = {
      kind:            rec.type,                 // 'intent' | 'crowd_report'
      resort_id:       rec.resort_id,
      resort_name:     rec.resort_name,
      ski_day:         rec.ski_day,
      predicted_label: rec.predicted_label || null,
      predicted_score: rec.predicted_score,
      intent:          rec.intent || null,
      report:          rec.report || null,
      session_id:      rec.session_id || null,
    };
    const resp = await fetch(`${url}/rest/v1/crowd_feedback`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: key,
        Authorization: `Bearer ${key}`,
        Prefer: 'return=minimal',
      },
      body: JSON.stringify(row),
    });
    if (!resp.ok) {
      const txt = await resp.text();
      console.error('[/api/crowd-feedback] Supabase', resp.status, txt.slice(0, 200));
      return res.status(502).json({ error: 'Storage error' });
    }
    return res.status(200).json({ ok: true, stored: true });
  } catch (err) {
    console.error('[/api/crowd-feedback]', err?.message || err);
    return res.status(502).json({ error: 'Storage unavailable' });
  }
};
