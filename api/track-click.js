// api/track-click.js
// Logs sponsor/partner link clicks to Supabase → Sponsor_Clicks table

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

  const rl = rateLimit(req, res, { prefix: 'track-click', max: 120, windowMs: 60_000 });
  if (!rl.ok) return res.status(429).json({ error: 'Too many requests' });

  const base = String(process.env.SUPABASE_URL || '').replace(/\/+$/, '');
  const key = process.env.SUPABASE_ANON_KEY;
  if (!base || !key) {
    return res.status(503).json({ error: 'Tracking unavailable' });
  }

  const { sponsor_name, placement, state_page, resort_page, session_id } = await readJsonBody(req);
  const safe = v => String(v || '').slice(0, 200);

  try {
    const response = await fetch(
      `${base}/rest/v1/Sponsor_Clicks`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': key,
          'Authorization': `Bearer ${key}`,
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({
          sponsor_name: safe(sponsor_name),
          placement:    safe(placement),
          state_page:   safe(state_page),
          resort_page:  safe(resort_page),
          session_id:   safe(session_id),
        }),
      }
    );

    if (!response.ok) {
      const err = await response.text();
      console.error('[/api/track-click] Supabase error:', response.status, err);
      return res.status(500).json({ error: 'Tracking unavailable' });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('[/api/track-click] Unexpected error:', err.message);
    return res.status(500).json({ error: 'Tracking unavailable' });
  }
}
