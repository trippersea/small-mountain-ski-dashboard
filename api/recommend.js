/**
 * /api/recommend
 *
 * Vercel serverless function — proxies mountain comparison prompts to the
 * Anthropic API. The ANTHROPIC_API_KEY env var lives only on the server;
 * it is never exposed to the browser.
 *
 * Expected request body (POST, JSON):
 *   { resorts: [ { name, state, vertical, trails, price, avgSnowfall,
 *                  crowds, drive, passGroup, plannerScore? }, … ] }
 *
 * Response body (JSON):
 *   { recommendation: "<string>" }   — on success
 *   { error: "<message>" }           — on failure
 */

export const config = { runtime: 'edge' };   // Edge runtime = faster cold starts

export default async function handler(req) {
  // ── 1. Method guard ────────────────────────────────────────────────────────
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // ── 2. Parse body ──────────────────────────────────────────────────────────
  let resorts;
  try {
    const body = await req.json();
    resorts = body.resorts;
    if (!Array.isArray(resorts) || resorts.length < 2) throw new Error('Need ≥2 resorts');
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Invalid request body: ' + err.message }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // ── 3. Check API key ───────────────────────────────────────────────────────
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'ANTHROPIC_API_KEY not configured on server' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // ── 4. Build prompt ────────────────────────────────────────────────────────
  const resortList = resorts.map(r => {
    const parts = [
      r.name + ' (' + r.state + ')',
      r.vertical + 'ft vertical',
      r.trails + ' trails',
      '$' + r.price + ' ticket',
      r.avgSnowfall + '" avg snowfall',
      r.crowds + ' crowds',
      r.drive ? r.drive + ' min drive' : null,
      'Pass: ' + r.passGroup,
      r.plannerScore != null ? 'Planner score: ' + r.plannerScore : null,
    ].filter(Boolean);
    return '• ' + parts.join(' · ');
  }).join('\n');

  const prompt =
    "You're a witty, opinionated New England ski expert helping someone choose where to ski. " +
    "Here are the mountains being compared:\n\n" +
    resortList + "\n\n" +
    "In 3–4 punchy sentences: pick ONE clear winner and explain why using the actual stats. " +
    "Be specific — name the numbers that clinch it. Have personality. Don't be bland. " +
    "End with one sentence on who the runner-up is best suited for. " +
    "Sign off as '— SkiNE AI 🤖'";

  // ── 5. Call Anthropic ──────────────────────────────────────────────────────
  try {
    const anthropicRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type':         'application/json',
        'x-api-key':            apiKey,
        'anthropic-version':    '2023-06-01',
      },
      body: JSON.stringify({
        model:      'claude-sonnet-4-20250514',
        max_tokens: 350,
        messages:   [{ role: 'user', content: prompt }],
      }),
    });

    if (!anthropicRes.ok) {
      const errText = await anthropicRes.text();
      throw new Error('Anthropic ' + anthropicRes.status + ': ' + errText);
    }

    const data = await anthropicRes.json();
    const recommendation = (data.content || []).find(b => b.type === 'text')?.text || '';

    return new Response(JSON.stringify({ recommendation }), {
      status: 200,
      headers: {
        'Content-Type':                'application/json',
        'Cache-Control':               'no-store',
        'Access-Control-Allow-Origin': '*',
      },
    });

  } catch (err) {
    console.error('[/api/recommend]', err);
    return new Response(JSON.stringify({ error: 'AI service unavailable' }), {
      status: 502,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
