// api/track-filter.js
// Logs hero pill filter selections to Supabase → filter_events table
// Handles both single { filter_type, filter_value, session_id }
// and batch { batch: [{ filter_type, filter_value, session_id }, ...] }

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).end();

  const body = req.body || {};

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
      `${process.env.SUPABASE_URL}/rest/v1/filter_events`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': process.env.SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${process.env.SUPABASE_ANON_KEY}`,
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
