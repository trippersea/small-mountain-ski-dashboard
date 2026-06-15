/**
 * /api/recommend  — Vercel serverless function (Node.js)
 */

function buildWriteupPromptFromVerdict(v) {
  const originStr = v.originLabel ? `from ${v.originLabel}` : '';
  const driveStr  = v.driveText ? `${v.driveText} away` : 'distance unknown';
  const histStr   = v.histTotal != null ? `${v.histTotal}" of snow in the last 7 days` : null;
  const facts = [
    `${Number(v.tomorrowIn).toFixed(1)}" forecast for your ski day, ${Number(v.stormTotal).toFixed(1)}" in the window`,
    driveStr !== 'distance unknown' ? driveStr : null,
    histStr,
    v.vertical ? `${Number(v.vertical).toLocaleString()}ft vertical` : null,
    v.passGroup && v.passGroup !== 'Independent' ? `${v.passGroup} pass access` : null,
  ].filter(Boolean).join('; ');
  const name  = String(v.resortName || 'this mountain').slice(0, 120);
  const state = String(v.state || '').slice(0, 40);
  const tier  = String(v.tier || 'good').slice(0, 20);
  return `You're texting a friend who skis. In 1 to 2 short, confident sentences say why ${name} in ${state} is the right call for this ski day${originStr ? ' for someone ' + originStr : ''}. Use only these facts: ${facts}. Internally the model tiers this as "${tier}" · do not say "tier", "score", or any number out of 100. Never use em dashes (—) or en dashes (–) as punctuation. Use periods or commas only. No corporate filler ("leverage", "insights"). Sound like a human on a lift pass.`;
}

function parseVerdictPayload(raw) {
  if (!raw || typeof raw !== 'object') return null;
  const resortId = String(raw.resortId || '').trim().slice(0, 80);
  const resortName = String(raw.resortName || '').trim().slice(0, 120);
  if (!resortId || !resortName) return null;
  const tomorrowIn = Number(raw.tomorrowIn);
  const stormTotal = Number(raw.stormTotal);
  if (!Number.isFinite(tomorrowIn) || !Number.isFinite(stormTotal)) return null;
  const histTotal = raw.histTotal == null ? null : Number(raw.histTotal);
  if (histTotal != null && !Number.isFinite(histTotal)) return null;
  return {
    resortId,
    resortName,
    state: String(raw.state || '').slice(0, 40),
    tier: String(raw.tier || 'good').slice(0, 20),
    tomorrowIn,
    stormTotal,
    histTotal,
    driveText: String(raw.driveText || '').slice(0, 80),
    originLabel: String(raw.originLabel || '').slice(0, 200),
    vertical: Number(raw.vertical) || 0,
    passGroup: String(raw.passGroup || '').slice(0, 40),
  };
}

module.exports = async function handler(req, res) {
  const { applyCors, applyApiBaselineSecurity, rateLimit, readRawBody, safeJsonParse } = require('./_security');
  const cors = applyCors(req, res, { methods: ['POST', 'OPTIONS'], headers: ['Content-Type'] });
  applyApiBaselineSecurity(res, { cacheControl: 'no-store' });

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  if (req.headers.origin && !cors.allowed) return res.status(403).json({ error: 'Origin not allowed' });

  const rl = rateLimit(req, res, { prefix: 'recommend', max: 10, windowMs: 60_000 });
  if (!rl.ok) return res.status(429).json({ error: 'Too many requests' });

  let body;
  try {
    const raw = await readRawBody(req, { limitBytes: 120_000 });
    const parsed = safeJsonParse(raw);
    if (!parsed) return res.status(400).json({ error: 'Could not parse request body' });
    body = parsed;
  } catch (e) {
    return res.status(400).json({ error: 'Could not parse request body' });
  }

  const { resorts, _writeup, verdict } = body || {};

  // ── Route: AI verdict write-up (server-built prompt only) ─────────────────
  if (_writeup) {
    const v = parseVerdictPayload(verdict);
    if (!v) return res.status(400).json({ error: 'Invalid verdict payload' });
    const writeupPrompt = buildWriteupPromptFromVerdict(v);
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
          model:      'claude-haiku-4-5-20251001',
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
    "You're a witty, opinionated ski trip advisor helping someone choose where to ski among US mountains. " +
    "Here are the mountains being compared:\n\n" + resortList + "\n\n" +
    "In 3-4 punchy sentences: pick ONE clear winner and explain why using the actual stats. " +
    "Be specific. Name the numbers that clinch it. Have personality, don't be bland. " +
    "Never use em dashes (—) or en dashes (–) as punctuation. Use periods or commas only. " +
    "End with one sentence on who the runner-up is best suited for. " +
    "Do not use emoji. Do not mention New England, SkiNE, or any regional brand. " +
    "If you sign off, use only: — WhereToSkiNext";

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
