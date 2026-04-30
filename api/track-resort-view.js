// api/track-resort-view.js
// Logs resort card clicks and detail panel opens to Supabase → resort_views table

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

  const rl = rateLimit(req, res, { prefix: 'track-view', max: 120, windowMs: 60_000 });
  if (!rl.ok) return res.status(429).json({ error: 'Too many requests' });

  const base = String(process.env.SUPABASE_URL || '').replace(/\/+$/, '');
  const key = process.env.SUPABASE_ANON_KEY;
  if (!base || !key) {
    return res.status(503).json({ error: 'Tracking unavailable' });
  }

  const { resort_id, resort_name, action, pass_group, session_id } = await readJsonBody(req);
  const safe = v => String(v || '').slice(0, 200);

  try {
    const response = await fetch(
      `${base}/rest/v1/resort_views`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': key,
          'Authorization': `Bearer ${key}`,
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({
          resort_id:   safe(resort_id),
          resort_name: safe(resort_name),
          action:      safe(action),
          pass_group:  safe(pass_group),
          session_id:  safe(session_id),
        }),
      }
    );

    if (!response.ok) {
      const err = await response.text();
      console.error('[/api/track-resort-view] Supabase error:', response.status, err);
      return res.status(500).json({ error: 'Tracking unavailable' });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('[/api/track-resort-view] Unexpected error:', err.message);
    return res.status(500).json({ error: 'Tracking unavailable' });
  }
}
