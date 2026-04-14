// api/track-recommendation.js
// Logs top recommendation results to Supabase → recommendation_events table

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).end();

  const {
    top_resort_id, top_resort_name,
    pass_filter, trip_type, ski_day,
    priority, origin_label, session_id
  } = req.body || {};

  try {
    const response = await fetch(
      `${process.env.SUPABASE_URL}/rest/v1/recommendation_events`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': process.env.SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${process.env.SUPABASE_ANON_KEY}`,
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({
          top_resort_id:   top_resort_id   || '',
          top_resort_name: top_resort_name || '',
          pass_filter:     pass_filter     || '',
          trip_type:       trip_type       || '',
          ski_day:         ski_day         || '',
          priority:        priority        || '',
          origin_label:    origin_label    || '',
          session_id:      session_id      || ''
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
