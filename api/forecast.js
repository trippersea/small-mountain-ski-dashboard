/**
 * POST /api/forecast — Cached Open-Meteo proxy for homepage weather.
 *
 * Body: { skiDay?: "YYYY-MM-DD", resorts: [{ id, lat, lon }] }
 * Response: { forecasts: { [id]: OpenMeteoPayload|null }, cachedIds, missedIds }
 */

const { resolveForecasts } = require('../lib/open-meteo-forecast-server');

const MAX_RESORTS = 55;
const ID_RE = /^[a-z0-9][a-z0-9-]{0,79}$/i;

function parseSkiDay(raw) {
  const s = String(raw || '').trim().slice(0, 10);
  if (!s) return 'default';
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return 'default';
  return s;
}

function parseResorts(list) {
  if (!Array.isArray(list)) return null;
  if (list.length > MAX_RESORTS) return null;
  const out = [];
  for (const item of list) {
    if (!item || typeof item !== 'object') return null;
    const id = String(item.id || '').trim().slice(0, 80);
    const lat = Number(item.lat);
    const lon = Number(item.lon);
    if (!ID_RE.test(id)) return null;
    if (!Number.isFinite(lat) || lat < -90 || lat > 90) return null;
    if (!Number.isFinite(lon) || lon < -180 || lon > 180) return null;
    out.push({ id, lat, lon });
  }
  return out;
}

module.exports = async function handler(req, res) {
  const { applyCors, applyApiBaselineSecurity, rateLimit, readRawBody, safeJsonParse } = require('./_security');
  const cors = applyCors(req, res, { methods: ['POST', 'OPTIONS'], headers: ['Content-Type'] });
  applyApiBaselineSecurity(res, { cacheControl: 'private, max-age=0' });

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  if (req.headers.origin && !cors.allowed) return res.status(403).json({ error: 'Origin not allowed' });

  const rl = rateLimit(req, res, { prefix: 'forecast', max: 24, windowMs: 60_000 });
  if (!rl.ok) return res.status(429).json({ error: 'Too many requests' });

  let body;
  try {
    const raw = await readRawBody(req, { limitBytes: 80_000 });
    const parsed = safeJsonParse(raw);
    if (!parsed) return res.status(400).json({ error: 'Could not parse request body' });
    body = parsed;
  } catch (e) {
    if (e?.code === 'BODY_TOO_LARGE') return res.status(413).json({ error: 'Request body too large' });
    return res.status(400).json({ error: 'Could not parse request body' });
  }

  const resorts = parseResorts(body.resorts);
  if (!resorts || !resorts.length) {
    return res.status(400).json({ error: 'Invalid or empty resorts list' });
  }

  const skiDay = parseSkiDay(body.skiDay);

  try {
    const { forecasts, cachedIds, missedIds } = await resolveForecasts(resorts, skiDay);
    const hitCount = cachedIds.length;
    res.setHeader('X-Forecast-Cache-Hits', String(hitCount));
    res.setHeader('X-Forecast-Requested', String(resorts.length));
    if (hitCount > 0) {
      res.setHeader('Cache-Control', 'private, max-age=60');
    }
    return res.status(200).json({
      skiDay,
      forecasts,
      cachedIds,
      missedIds,
      partial: missedIds.length > 0 && Object.keys(forecasts).some(k => forecasts[k]),
    });
  } catch (err) {
    console.error('[/api/forecast]', err?.message || err);
    return res.status(502).json({ error: 'Forecast service unavailable' });
  }
};
