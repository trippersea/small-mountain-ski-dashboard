/**
 * GET /api/geo - Approximate visitor location from Vercel's edge geo headers.
 *
 * Why this exists: the homepage used to fire a browser geolocation permission
 * prompt on first load with no user gesture. Those prompts get denied at very
 * high rates and make a bad first impression. Vercel already attaches
 * IP-derived coordinates to every request for free (x-vercel-ip-latitude /
 * longitude / city / country-region), accurate to roughly city level, which
 * is plenty for "which mountains are within a day trip". The client seeds an
 * approximate origin from this endpoint with zero prompts, and the GPS button
 * remains for anyone who wants street-level precision.
 *
 * Response: { located: true, lat, lon, city, region, country, approx: true }
 *       or: { located: false }
 * Never errors on missing headers - local dev and some proxies won't have them.
 */

module.exports = async function handler(req, res) {
  const { applyCors, applyApiBaselineSecurity, rateLimit } = require('./_security');
  const cors = applyCors(req, res, { methods: ['GET', 'OPTIONS'], headers: ['Content-Type'] });
  // Private cache: the answer is per-visitor (IP-derived). One hour is fine -
  // people do not change cities mid-session.
  applyApiBaselineSecurity(res, { cacheControl: 'private, max-age=3600' });

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  if (req.headers.origin && !cors.allowed) return res.status(403).json({ error: 'Origin not allowed' });

  const rl = rateLimit(req, res, { prefix: 'geo', max: 30, windowMs: 60_000 });
  if (!rl.ok) return res.status(429).json({ error: 'Too many requests' });

  const h = req.headers || {};
  const lat = Number(h['x-vercel-ip-latitude']);
  const lon = Number(h['x-vercel-ip-longitude']);

  if (!Number.isFinite(lat) || !Number.isFinite(lon) ||
      lat < -90 || lat > 90 || lon < -180 || lon > 180) {
    return res.status(200).json({ located: false });
  }

  // Vercel URI-encodes non-ASCII header values (e.g. "S%C3%A3o%20Paulo").
  function decodeHeader(v) {
    const s = String(v || '').slice(0, 120);
    try { return decodeURIComponent(s); } catch { return s; }
  }
  // Plain text only: strip anything that could read as markup downstream.
  function cleanLabel(s) {
    return String(s || '').replace(/[<>"'&]/g, '').replace(/\s+/g, ' ').trim().slice(0, 80);
  }

  const city    = cleanLabel(decodeHeader(h['x-vercel-ip-city']));
  const region  = cleanLabel(decodeHeader(h['x-vercel-ip-country-region']));
  const country = cleanLabel(decodeHeader(h['x-vercel-ip-country']));

  return res.status(200).json({
    located: true,
    lat,
    lon,
    city: city || null,
    region: region || null,
    country: country || null,
    approx: true,
  });
};
