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

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).end();

  const base = String(process.env.SUPABASE_URL || '').replace(/\/+$/, '');
  const key = process.env.SUPABASE_ANON_KEY;
  if (!base || !key) {
    return res.status(503).json({ error: 'Tracking unavailable' });
  }

  const { sponsor_name, placement, state_page, resort_page, session_id } = await readJsonBody(req);

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
          sponsor_name: sponsor_name || '',
          placement:    placement    || '',
          state_page:   state_page   || '',
          resort_page:  resort_page  || '',
          session_id:   session_id   || ''
        })
      }
    );

    if (!response.ok) {
      const err = await response.text();
      return res.status(500).json({ error: err });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
