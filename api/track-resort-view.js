// api/track-resort-view.js
// Logs resort card clicks and detail panel opens to Supabase → resort_views table

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).end();

  const { resort_id, resort_name, action, pass_group, session_id } = req.body || {};

  try {
    const response = await fetch(
      `${process.env.SUPABASE_URL}/rest/v1/resort_views`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': process.env.SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${process.env.SUPABASE_ANON_KEY}`,
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({
          resort_id:   resort_id   || '',
          resort_name: resort_name || '',
          action:      action      || '',
          pass_group:  pass_group  || '',
          session_id:  session_id  || ''
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
