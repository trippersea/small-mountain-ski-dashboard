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

  const body = await readJsonBody(req);

  // Support both single row and batch array
  const rows = Array.isArray(body.batch) && body.batch.length > 0
    ? body.batch.map(f => ({
        filter_type:  f.filter_type  || '',
        filter_value: f.filter_value || '',
        session_id:   f.session_id   || ''
      }))
    : [{
        filter_type:  body.filter_type  || '',
        filter_value: body.filter_value || '',
        session_id:   body.session_id   || ''
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
      return res.status(500).json({ error: err });
    }

    return res.status(200).json({ success: true, inserted: validRows.length });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
