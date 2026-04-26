/**
 * /api/chat — Natural-language ski resort recommendation
 *
 * Vercel serverless function (Node.js, CommonJS).
 * Accepts: POST { query: string, resorts: Array<ResortSummary> }
 * Returns:  { resortName, resortId, explanation }  |  { error }
 *
 * The client pre-filters and scores resorts before sending, so the AI
 * receives a compact, already-ranked list rather than the full 120-entry
 * dataset. This keeps the prompt small and the response fast.
 */

module.exports = async function handler(req, res) {
  const { applyCors, applyApiBaselineSecurity } = require('./_security');
  const cors = applyCors(req, res, { methods: ['POST', 'OPTIONS'], headers: ['Content-Type'] });
  applyApiBaselineSecurity(res, { cacheControl: 'no-store' });

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST')   return res.status(405).json({ error: 'Method not allowed' });
  if (req.headers.origin && !cors.allowed) return res.status(403).json({ error: 'Origin not allowed' });

  // ── Parse body ─────────────────────────────────────────────────────────────
  let body = req.body;
  if (!body || typeof body === 'string') {
    try {
      body = JSON.parse(typeof body === 'string' ? body : await rawBody(req));
    } catch {
      return res.status(400).json({ error: 'Could not parse request body' });
    }
  }

  const { query, resorts } = body || {};
  if (!query || typeof query !== 'string' || !query.trim()) {
    return res.status(400).json({ error: 'Missing or empty query' });
  }
  if (!Array.isArray(resorts) || !resorts.length) {
    return res.status(400).json({ error: 'Missing resorts array' });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'ANTHROPIC_API_KEY is not configured on the server' });
  }

  // ── Build resort list for the prompt (max 25 resorts) ─────────────────────
  const resortList = resorts.slice(0, 25).map((r, i) => {
    const parts = [
      (i + 1) + '. ' + r.name + ' (' + r.state + ')',
      r.vertical + 'ft vertical',
      r.trails + ' trails',
      '$' + r.price + ' ticket',
      'Pass: ' + r.passGroup,
      r.drive       ? r.drive + ' min drive'           : null,
      r.snow3d != null ? r.snow3d + '" forecast snow'  : null,
      r.crowd       ? r.crowd + ' crowds'               : null,
      r.plannerScore != null ? 'Score: ' + r.plannerScore : null,
      r.beginner    != null ? Math.round(r.beginner * 100) + '% beginner terrain' : null,
    ].filter(Boolean);
    return parts.join(' · ');
  }).join('\n');

  const prompt =
    'You are a witty, opinionated New England ski expert. A skier just said:\n' +
    '"' + query.trim() + '"\n\n' +
    'Here are up to 25 ranked mountains (already sorted by planner score for this person):\n\n' +
    resortList + '\n\n' +
    'Based on exactly what they said, pick the ONE mountain that fits best. ' +
    'Factor in any pass they mentioned, skill level, driving distance, day of week, or companions. ' +
    'Respond with ONLY a valid JSON object — no markdown fences, no extra text, nothing else:\n' +
    '{"resortName":"<exact name from list>","explanation":"<2–3 punchy sentences. Reference their exact words and the actual stats. Be specific and opinionated.>"}';

  // ── Call Anthropic ──────────────────────────────────────────────────────────
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
        max_tokens: 300,
        messages:   [{ role: 'user', content: prompt }],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('[/api/chat] Anthropic error:', response.status, errText);
      return res.status(502).json({ error: 'Anthropic API error: ' + response.status });
    }

    const data   = await response.json();
    const rawText = (data.content || []).find(b => b.type === 'text')?.text || '{}';

    // Strip accidental markdown fences
    const clean = rawText.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```\s*$/i, '').trim();

    let parsed;
    try {
      parsed = JSON.parse(clean);
    } catch {
      console.error('[/api/chat] Failed to parse AI JSON:', clean);
      return res.status(500).json({ error: 'AI returned unexpected format — please try again' });
    }

    return res.status(200).json({
      resortName:  (parsed.resortName  || '').trim(),
      explanation: (parsed.explanation || '').trim(),
    });

  } catch (err) {
    console.error('[/api/chat] Unexpected error:', err.message);
    return res.status(502).json({ error: 'AI service unavailable — ' + err.message });
  }
};

// ── Helper: read raw request body as a string ──────────────────────────────
function rawBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', chunk => { data += chunk; });
    req.on('end',  () => resolve(data));
    req.on('error', reject);
  });
}
