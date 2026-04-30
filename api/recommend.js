/**
 * /api/recommend  — Vercel serverless function (Node.js)
 */

module.exports = async function handler(req, res) {
  const { applyCors, applyApiBaselineSecurity, rateLimit, readRawBody, safeJsonParse } = require('./_security');
  const cors = applyCors(req, res, { methods: ['POST', 'OPTIONS'], headers: ['Content-Type'] });
  applyApiBaselineSecurity(res, { cacheControl: 'no-store' });

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  if (req.headers.origin && !cors.allowed) return res.status(403).json({ error: 'Origin not allowed' });

  const rl = rateLimit(req, res, { prefix: 'recommend', max: 10, windowMs: 60_000 });
  if (!rl.ok) return res.status(429).json({ error: 'Too many requests' });

  // ── Parse body — always read raw stream ─────────────────────────────────
  // Vercel sometimes delivers req.body as {} even for JSON POST requests,
  // which causes downstream destructuring to silently miss all fields.
  // Always parse from the raw body to be safe.
  let body;
  try {
    const raw = await readRawBody(req, { limitBytes: 120_000 });
    const parsed = safeJsonParse(raw);
    if (!parsed) return res.status(400).json({ error: 'Could not parse request body' });
    body = parsed;
  } catch (e) {
    return res.status(400).json({ error: 'Could not parse request body' });
  }

  const { resorts, _writeup, prompt: writeupPrompt } = body || {};

  // ── Route: AI verdict write-up (Option B) ─────────────────────────────────
  if (_writeup && writeupPrompt) {
    if (typeof writeupPrompt !== 'string' || writeupPrompt.length > 4000) {
      return res.status(400).json({ error: 'Invalid prompt' });
    }
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) return res.status(500).json({ error: 'ANTHROPIC_API_KEY not set' });
    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type':      'application/json',
          'x-api-key':         apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model:      'claude-haiku-4-5-20251001', // fast + cheap for short copy
          max_tokens: 120,
          messages:   [{ role: 'user', content: writeupPrompt }],
        }),
      });
      if (!response.ok) throw new Error(`Anthropic ${response.status}`);
      const data = await response.json();
      const writeup = (data.content || []).find(b => b.type === 'text')?.text?.trim() || '';
      return res.status(200).json({ writeup });
    } catch (err) {
      console.error('[/api/recommend] writeup error:', err.message);
      return res.status(502).json({ error: 'AI service unavailable' });
    }
  }

  if (!Array.isArray(resorts) || resorts.length < 2) {
    return res.status(400).json({ error: 'Need at least 2 resorts' });
  }
  if (resorts.length > 80) {
    return res.status(400).json({ error: 'Too many resorts' });
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
    r.plannerScore != null ? 'Planner score: ' + r.plannerScore : null,
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
      return res.status(502).json({ error: 'Anthropic API error: ' + response.status });
    }

    const data = await response.json();
    const recommendation = (data.content || []).find(b => b.type === 'text')?.text || '';
    return res.status(200).json({ recommendation });

  } catch (err) {
    console.error('[/api/recommend] Unexpected error:', err.message);
    return res.status(502).json({ error: 'AI service unavailable' });
  }
};

// (raw body helper moved to api/_security.js)
