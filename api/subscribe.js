/**
 * /api/subscribe — Vercel serverless function (Node.js)
 *
 * Proxies email signups to the Beehiiv API.
 * Called by the newsletter signup section in index.html.
 *
 * POST /api/subscribe
 * Body: { email: string }
 * Returns: { ok: true } | { error: string }
 *
 * Required Vercel environment variables:
 *   BEEHIIV_API_KEY          — your Beehiiv API key (starts with no fixed prefix)
 *   BEEHIIV_PUBLICATION_ID   — your publication ID (starts with pub_)
 */

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  // ── Parse body ─────────────────────────────────────────────────────────────
  let body;
  try {
    const raw = await rawBody(req);
    body = raw ? JSON.parse(raw) : (req.body || {});
  } catch (e) {
    return res.status(400).json({ error: 'Could not parse request body' });
  }

  const { email } = body || {};

  // Basic server-side email validation
  if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    return res.status(400).json({ error: 'Invalid or missing email address' });
  }

  // ── Check env vars ─────────────────────────────────────────────────────────
  const apiKey        = process.env.BEEHIIV_API_KEY;
  const publicationId = process.env.BEEHIIV_PUBLICATION_ID;

  if (!apiKey || !publicationId) {
    console.error('[/api/subscribe] Missing BEEHIIV_API_KEY or BEEHIIV_PUBLICATION_ID env var');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  // ── Call Beehiiv API ───────────────────────────────────────────────────────
  const url = `https://api.beehiiv.com/v2/publications/${encodeURIComponent(publicationId)}/subscriptions`;

  try {
    const upstream = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type':  'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        email:               email.trim().toLowerCase(),
        reactivate_existing: true,   // re-add anyone who previously unsubscribed
        send_welcome_email:  true,   // send Beehiiv welcome email on first signup
        utm_source:          'wheretoskinext.com',
        utm_medium:          'organic',
        utm_campaign:        'newsletter_signup',
      }),
    });

    // Beehiiv returns 201 on success
    if (upstream.status === 201 || upstream.status === 200) {
      return res.status(200).json({ ok: true });
    }

    // Log upstream error detail for debugging but don't expose to client
    const errorText = await upstream.text();
    console.error('[/api/subscribe] Beehiiv error:', upstream.status, errorText);
    return res.status(502).json({ error: 'Subscription service error' });

  } catch (err) {
    console.error('[/api/subscribe] Fetch error:', err.message);
    return res.status(502).json({ error: 'Could not reach subscription service' });
  }
};

// ── Helper: read raw request body as string ────────────────────────────────
function rawBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', chunk => { data += chunk; });
    req.on('end',  () => resolve(data));
    req.on('error', reject);
  });
}
