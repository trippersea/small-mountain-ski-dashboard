/**
 * /api/conditions  — Vercel serverless function (Node.js)
 *
 * Fetches a ski resort's live snow report page and uses Claude to extract:
 *   - baseDepth (inches)
 *   - newSnow24h (inches)
 *   - newSnow48h (inches)
 *   - trailsOpen (count)
 *   - trailsTotal (count)
 *   - liftsOpen (count)
 *   - liftsTotal (count)
 *   - reportDate (ISO string or human string)
 *   - surface (string, e.g. "packed powder", "groomed")
 *   - notes (1 sentence summary if present)
 *
 * POST body: { resortId: string, name: string, url: string }
 * Response:  { conditions: {...} } or { error: string }
 *
 * Results are meant to be cached client-side for 12 hours.
 */

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST')   return res.status(405).json({ error: 'Method not allowed' });

  // ── Parse body ──────────────────────────────────────────────────────────────
  let body = req.body;
  if (!body || typeof body === 'string') {
    try { body = JSON.parse(typeof body === 'string' ? body : await rawBody(req)); }
    catch (e) { return res.status(400).json({ error: 'Could not parse request body' }); }
  }

  const { resortId, name, url } = body || {};
  if (!resortId || !name || !url) {
    return res.status(400).json({ error: 'resortId, name, and url are required' });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'ANTHROPIC_API_KEY not configured' });

  // ── Fetch the resort's snow report page ────────────────────────────────────
  let pageText = '';
  try {
    const pageRes = await fetchWithTimeout(url, 8000, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; SkiNE-bot/1.0; +https://skine.app)',
        'Accept': 'text/html,application/xhtml+xml',
      },
    });
    if (!pageRes.ok) throw new Error(`HTTP ${pageRes.status}`);
    const html = await pageRes.text();
    // Strip tags, collapse whitespace, truncate to ~12k chars to stay in token budget
    pageText = html
      .replace(/<script[\s\S]*?<\/script>/gi, '')
      .replace(/<style[\s\S]*?<\/style>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s{2,}/g, ' ')
      .trim()
      .slice(0, 12000);
  } catch (err) {
    console.warn(`[/api/conditions] Could not fetch ${url}: ${err.message}`);
    // Return a null conditions object — client degrades gracefully
    return res.status(200).json({ conditions: null, fetchError: err.message });
  }

  // ── Ask Claude to extract structured data ──────────────────────────────────
  const prompt = `You are a data extraction assistant. Extract the current snow conditions from this ski resort page for "${name}".

Return ONLY a valid JSON object — no markdown, no explanation, no preamble. Use null for any field you cannot find.

Required fields:
{
  "baseDepth": <number in inches, convert cm if needed>,
  "newSnow24h": <number in inches>,
  "newSnow48h": <number in inches>,
  "trailsOpen": <number>,
  "trailsTotal": <number>,
  "liftsOpen": <number>,
  "liftsTotal": <number>,
  "surface": <string, e.g. "packed powder", "groomed", "machine groomed", "powder">,
  "reportDate": <string, the date of this report>,
  "notes": <string, one sentence summary of current conditions, or null>
}

Page content:
${pageText}`;

  try {
    const claudeRes = await fetchWithTimeout('https://api.anthropic.com/v1/messages', 6000, {
      method: 'POST',
      headers: {
        'Content-Type':      'application/json',
        'x-api-key':         apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model:      'claude-haiku-4-5-20251001', // fast + cheap for structured extraction
        max_tokens: 400,
        messages:   [{ role: 'user', content: prompt }],
      }),
    });

    if (!claudeRes.ok) {
      const errText = await claudeRes.text();
      console.error('[/api/conditions] Claude error:', claudeRes.status, errText);
      return res.status(200).json({ conditions: null, fetchError: `Claude ${claudeRes.status}` });
    }

    const data     = await claudeRes.json();
    const rawText  = (data.content || []).find(b => b.type === 'text')?.text || '{}';
    // Strip any accidental markdown fences
    const jsonText = rawText.replace(/```json|```/g, '').trim();

    let conditions = null;
    try {
      conditions = JSON.parse(jsonText);
      // Validate expected shape — coerce numerics, null bad values
      const numOrNull = v => (v !== null && v !== undefined && !isNaN(Number(v))) ? Number(v) : null;
      conditions = {
        baseDepth:   numOrNull(conditions.baseDepth),
        newSnow24h:  numOrNull(conditions.newSnow24h),
        newSnow48h:  numOrNull(conditions.newSnow48h),
        trailsOpen:  numOrNull(conditions.trailsOpen),
        trailsTotal: numOrNull(conditions.trailsTotal),
        liftsOpen:   numOrNull(conditions.liftsOpen),
        liftsTotal:  numOrNull(conditions.liftsTotal),
        surface:     typeof conditions.surface  === 'string' ? conditions.surface  : null,
        reportDate:  typeof conditions.reportDate === 'string' ? conditions.reportDate : null,
        notes:       typeof conditions.notes    === 'string' ? conditions.notes    : null,
        fetchedAt:   Date.now(),
      };
    } catch (parseErr) {
      console.warn('[/api/conditions] JSON parse failed:', rawText);
      return res.status(200).json({ conditions: null, fetchError: 'parse error' });
    }

    return res.status(200).json({ conditions });

  } catch (err) {
    console.error('[/api/conditions] Unexpected error:', err.message);
    return res.status(200).json({ conditions: null, fetchError: err.message });
  }
};

// ── Helper: fetch with timeout ─────────────────────────────────────────────
function fetchWithTimeout(url, ms, options = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  return fetch(url, { ...options, signal: controller.signal })
    .finally(() => clearTimeout(timer));
}

// ── Helper: read raw request body ─────────────────────────────────────────
function rawBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', chunk => { data += chunk; });
    req.on('end',  () => resolve(data));
    req.on('error', reject);
  });
}
