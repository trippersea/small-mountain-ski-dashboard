// api/track-filter.js
// Logs hero pill filter selections to Supabase → filter_events table
// Handles both single { filter_type, filter_value, session_id }
// and batch { batch: [{ filter_type, filter_value, session_id }, ...] }

async function readJsonBody(req) {
  let body = req.body;
  if (Buffer.isBuffer(body)) {
    try { return JSON.parse(body.toString()); } catch { return {}; }
  }
  if (body && typeof body === 'object') return body;
  if (typeof body === 'string') {
    try { return body ? JSON.parse(body) : {}; } catch { return {}; }
  }
  const raw = await new Promise((resolve, reject) => {
    let data = '';
    req.on('data', chunk => { data += chunk; });
    req.on('end', () => resolve(data));
    req.on('error', reject);
  });
  try { return raw ? JSON.parse(raw) : {}; } catch { return {}; }
}

module.exports = async function handler(req, res) {
  const { applyCors, applyApiBaselineSecurity, rateLimit } = require('./_security');
  const cors = applyCors(req, res, { methods: ['POST', 'OPTIONS'], headers: ['Content-Type'] });
  applyApiBaselineSecurity(res, { cacheControl: 'no-store' });

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).end();
  if (req.headers.origin && !cors.allowed) return res.status(403).json({ error: 'Origin not allowed' });

  const rl = rateLimit(req, res, { prefix: 'track-filter', max: 180, windowMs: 60_000 });
  if (!rl.ok) return res.status(429).json({ error: 'Too many requests' });

  const base = String(process.env.SUPABASE_URL || '').replace(/\/+$/, '');
  const key = process.env.SUPABASE_ANON_KEY;
  if (!base || !key) {
    return res.status(503).json({ error: 'Tracking unavailable' });
  }

  const body = await readJsonBody(req);
  const safe = v => String(v || '').slice(0, 200);

  // Support both single row and batch array
  const rows = Array.isArray(body.batch) && body.batch.length > 0
    ? body.batch.map(f => ({
        filter_type:  safe(f.filter_type),
        filter_value: safe(f.filter_value),
        session_id:   safe(f.session_id),
      }))
    : [{
        filter_type:  safe(body.filter_type),
        filter_value: safe(body.filter_value),
        session_id:   safe(body.session_id),
      }];

  // Skip rows that are completely empty (safety guard)
  const validRows = rows.filter(r => r.filter_type || r.filter_value);
  if (validRows.length === 0) return res.status(200).json({ success: true, inserted: 0 });

  try {
    const response = await fetch(
      `${base}/rest/v1/filter_events`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': key,
          'Authorization': `Bearer ${key}`,
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify(validRows)
      }
    );

    if (!response.ok) {
      const err = await response.text();
      console.error('[/api/track-filter] Supabase error:', response.status, err);
      return res.status(500).json({ error: 'Tracking unavailable' });
    }

    return res.status(200).json({ success: true, inserted: validRows.length });
  } catch (err) {
    console.error('[/api/track-filter] Unexpected error:', err.message);
    return res.status(500).json({ error: 'Tracking unavailable' });
  }
}
