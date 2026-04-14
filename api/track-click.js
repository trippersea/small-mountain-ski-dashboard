// api/track-click.js
// Logs sponsor/partner link clicks to Supabase → Sponsor_Clicks table

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).end();

  const { sponsor_name, placement, state_page, resort_page, session_id } = req.body || {};

  try {
    const response = await fetch(
      `${process.env.SUPABASE_URL}/rest/v1/Sponsor_Clicks`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': process.env.SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${process.env.SUPABASE_ANON_KEY}`,
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
