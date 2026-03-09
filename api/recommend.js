/**
 * /api/recommend  — Vercel serverless function (Node.js)
 */

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  // ── Manually parse body if needed (Vercel doesn't always auto-parse) ───────
  let body = req.body;
  if (!body || typeof body === 'string') {
    try {
      body = JSON.parse(typeof body === 'string' ? body : await rawBody(req));
    } catch (e) {
      return res.status(400).json({ error: 'Could not parse request body' });
    }
  }

  const { resorts } = body || {};
  if (!Array.isArray(resorts) || resorts.length < 2) {
    return res.status(400).json({ error: 'Need at least 2 resorts' });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'ANTHROPIC_API_KEY is not set on the server' });

  // ── Build prompt ───────────────────────────────────────────────────────────
  const resortList = resorts.map(r => [
    '• ' + r.name + ' (' + r.state + ')',
    r.vertical + 'ft vertical',
    r.trails + ' trails',
    '$' + r.price + ' ticket',
    r.avgSnowfall + '" avg snowfall',
    r.crowds + ' crowds',
    r.drive ? r.drive + ' min drive' : null,
    'Pass: ' + r.passGroup,
    r.skiScore != null ? 'Ski Score: ' + r.skiScore : null,
  ].filter(Boolean).join(' · ')).join('\n');

  const prompt =
    "You're a witty, opinionated New England ski expert helping someone choose where to ski. " +
    "Here are the mountains being compared:\n\n" + resortList + "\n\n" +
    "In 3-4 punchy sentences: pick ONE clear winner and explain why using the actual stats. " +
    "Be specific — name the numbers that clinch it. Have personality, don't be bland. " +
    "End with one sentence on who the runner-up is best suited for. " +
    "Sign off as '— SkiNE AI 🤖'";

  // ── Call Anthropic ─────────────────────────────────────────────────────────
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type':      'application/json',
        'x-api-key':         apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model:      'claude-sonnet-4-6',
        max_tokens: 350,
        messages:   [{ role: 'user', content: prompt }],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('[/api/recommend] Anthropic error:', response.status, errText);
      return res.status(502).json({ error: 'Anthropic API error: ' + response.status + ' — ' + errText });
    }

    const data = await response.json();
    const recommendation = (data.content || []).find(b => b.type === 'text')?.text || '';
    return res.status(200).json({ recommendation });

  } catch (err) {
    console.error('[/api/recommend] Unexpected error:', err.message);
    return res.status(502).json({ error: 'AI service unavailable — ' + err.message });
  }
};

// ── Helper: read raw request body as string ────────────────────────────────
function rawBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', chunk => { data += chunk; });
    req.on('end', () => resolve(data));
    req.on('error', reject);
  });
}
