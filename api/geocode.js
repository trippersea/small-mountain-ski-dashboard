/**
 * /api/geocode — server-side geocoding for U.S. ZIP and place search
 *
 * Zippopotam and some Nominatim flows are not usable from the browser (no CORS).
 * This proxy matches the client fallback in sd-app.js so ZIP → lat/lon works on Vercel.
 *
 * GET /api/geocode?q=02139
 * GET /api/geocode?q=Boston%2C%20MA
 * Response: { lat, lon, label } | { error }
 */

const NOMINATIM_HEADERS = {
  'Accept-Language': 'en-US,en;q=0.9',
  'User-Agent': 'WhereToSkiNext-SkiDashboard/1.0 (+https://www.wheretoskinext.com)',
};

/** Mirrors sd-app.js so client and server agree on what counts as a U.S. ZIP. */
function normalizeLocationQuery(query) {
  return String(query || '')
    .replace(/[\uFEFF\u200B-\u200D\u2060]/g, '')
    .replace(/\u00A0/g, ' ')
    .trim();
}

function extractUsZip(query) {
  const t = normalizeLocationQuery(query).replace(/,/g, '');
  const strict = t.match(/^(\d{5})(?:-(\d{4}))?$/);
  if (strict) return strict[1];
  const run9 = t.match(/^(\d{5})(\d{4})$/);
  if (run9) return run9[1];
  const loose = t.match(/\b(\d{5})(?:-\d{4})?\b/);
  return loose ? loose[1] : null;
}

function labelFromNominatimResult(row) {
  const parts = (row.display_name || '').split(', ').map(s => s.trim()).filter(Boolean);
  const us = parts.indexOf('United States');
  if (us >= 2 && /^\d{5}(-\d{4})?$/.test(parts[0].replace(/\s/g, ''))) {
    const town = parts[1];
    const region = parts[us - 1];
    return `${town}, ${region}`;
  }
  if (parts.length >= 2) return `${parts[0]}, ${parts[1]}`;
  return parts[0] || row.name || 'Unknown';
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const q = normalizeLocationQuery(req.query.q);
  if (!q) return res.status(400).json({ error: 'Missing q' });

  const zip = extractUsZip(q);

  const fetchJson = async (url, opts = {}) => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 11000);
    try {
      const r = await fetch(url, { ...opts, signal: controller.signal });
      return r;
    } finally {
      clearTimeout(timer);
    }
  };

  if (zip) {
    try {
      const r = await fetchJson(`https://api.zippopotam.us/us/${zip}`);
      if (r.ok) {
        const d = await r.json();
        const place = d.places?.[0];
        if (place) {
          const st = place.state || place['state abbreviation'] || '';
          const label = `${place['place name']}, ${st}`.replace(/,\s*$/, '').trim();
          return res.status(200).json({
            lat: parseFloat(place.latitude),
            lon: parseFloat(place.longitude),
            label,
          });
        }
      }
    } catch (e) {
      console.warn('[/api/geocode] zippopotam', zip, e.message);
    }

    try {
      const r = await fetchJson(
        `https://nominatim.openstreetmap.org/search?postalcode=${encodeURIComponent(zip)}&country=us&format=json&limit=1`,
        { headers: { ...NOMINATIM_HEADERS } }
      );
      if (r.ok) {
        const data = await r.json();
        if (data.length) {
          const row = data[0];
          return res.status(200).json({
            lat: parseFloat(row.lat),
            lon: parseFloat(row.lon),
            label: labelFromNominatimResult(row),
          });
        }
      }
    } catch (e) {
      console.warn('[/api/geocode] nominatim zip', zip, e.message);
    }
  }

  try {
    const r = await fetchJson(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=1&countrycodes=us`,
      { headers: { ...NOMINATIM_HEADERS } }
    );
    if (!r.ok) return res.status(200).json({ error: `nominatim ${r.status}` });
    const data = await r.json();
    if (!data.length) return res.status(200).json({ error: 'not found' });
    const row = data[0];
    return res.status(200).json({
      lat: parseFloat(row.lat),
      lon: parseFloat(row.lon),
      label: labelFromNominatimResult(row),
    });
  } catch (e) {
    console.warn('[/api/geocode] nominatim q', e.message);
    return res.status(200).json({ error: e.message || 'failed' });
  }
};
