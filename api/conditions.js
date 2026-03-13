/**
 * /api/conditions  — Vercel serverless function (Node.js)
 *
 * Fetches a ski resort's live snow report page and returns structured conditions.
 * Fast path:
 *   1) fetch page
 *   2) try lightweight rule-based extraction from HTML/text
 *   3) fall back to Claude only when needed
 *
 * POST body: { resortId: string, name: string, url: string }
 * Response:  { conditions: {...}, source?: string, stale?: boolean } or { error: string }
 *
 * Caching strategy:
 *   - CDN/server cache headers for Vercel
 *   - client cache allowed
 *   - stale-while-revalidate friendly
 */

const PAGE_TIMEOUT_MS = 6000;
const CLAUDE_TIMEOUT_MS = 4500;
const MAX_PAGE_TEXT_CHARS = 8000;
const CACHE_CONTROL = 'public, s-maxage=1800, stale-while-revalidate=21600, max-age=900';

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cache-Control', CACHE_CONTROL);

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  let body = req.body;
  if (!body || typeof body === 'string') {
    try {
      body = JSON.parse(typeof body === 'string' ? body : await rawBody(req));
    } catch (e) {
      return res.status(400).json({ error: 'Could not parse request body' });
    }
  }

  const { resortId, name, url } = body || {};
  if (!resortId || !name || !url) {
    return res.status(400).json({ error: 'resortId, name, and url are required' });
  }

  // Some pages can be handled without an LLM if we preserve the HTML long enough
  let html = '';
  let pageText = '';
  try {
    const pageRes = await fetchWithTimeout(url, PAGE_TIMEOUT_MS, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; SkiNE-bot/1.0; +https://skine.app)',
        'Accept': 'text/html,application/xhtml+xml',
      },
    });

    if (!pageRes.ok) throw new Error(`HTTP ${pageRes.status}`);

    html = await pageRes.text();
    pageText = normalizePageText(html).slice(0, MAX_PAGE_TEXT_CHARS);
  } catch (err) {
    console.warn(`[/api/conditions] Could not fetch ${url}: ${err.message}`);
    return res.status(200).json({ conditions: null, fetchError: err.message, source: 'fetch' });
  }

  // Fast path: try deterministic extraction before LLM fallback.
  const direct = extractDirectConditions(html, pageText);
  if (hasEnoughSignal(direct)) {
    return res.status(200).json({
      conditions: finalizeConditions(direct),
      source: 'direct',
    });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(200).json({
      conditions: finalizeConditions(direct),
      source: 'direct-partial',
      fetchError: 'ANTHROPIC_API_KEY not configured',
    });
  }

  const focusedText = extractRelevantTextWindow(pageText);
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
${focusedText}`;

  try {
    const claudeRes = await fetchWithTimeout('https://api.anthropic.com/v1/messages', CLAUDE_TIMEOUT_MS, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 300,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    if (!claudeRes.ok) {
      const errText = await claudeRes.text();
      console.error('[/api/conditions] Claude error:', claudeRes.status, errText);
      return res.status(200).json({
        conditions: finalizeConditions(direct),
        source: 'direct-partial',
        fetchError: `Claude ${claudeRes.status}`,
      });
    }

    const data = await claudeRes.json();
    const rawText = (data.content || []).find(block => block.type === 'text')?.text || '{}';
    const jsonText = rawText.replace(/```json|```/g, '').trim();

    let llmConditions;
    try {
      llmConditions = JSON.parse(jsonText);
    } catch (parseErr) {
      console.warn('[/api/conditions] JSON parse failed:', rawText);
      return res.status(200).json({
        conditions: finalizeConditions(direct),
        source: 'direct-partial',
        fetchError: 'parse error',
      });
    }

    return res.status(200).json({
      conditions: finalizeConditions({ ...llmConditions, ...fillMissingFromDirect(llmConditions, direct) }),
      source: 'claude',
    });
  } catch (err) {
    console.error('[/api/conditions] Unexpected error:', err.message);
    return res.status(200).json({
      conditions: finalizeConditions(direct),
      source: 'direct-partial',
      fetchError: err.message,
    });
  }
};

function fetchWithTimeout(url, ms, options = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  return fetch(url, { ...options, signal: controller.signal }).finally(() => clearTimeout(timer));
}

function rawBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', chunk => {
      data += chunk;
    });
    req.on('end', () => resolve(data));
    req.on('error', reject);
  });
}

function normalizePageText(html) {
  return String(html || '')
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

function extractRelevantTextWindow(pageText) {
  const keywords = [
    'snow report',
    'conditions',
    'trail',
    'lift',
    'base depth',
    'new snow',
    'surface',
    'groom',
    'powder',
  ];

  const lower = pageText.toLowerCase();
  let idx = -1;
  for (const keyword of keywords) {
    idx = lower.indexOf(keyword);
    if (idx >= 0) break;
  }

  if (idx < 0) return pageText.slice(0, MAX_PAGE_TEXT_CHARS);

  const start = Math.max(0, idx - 1200);
  const end = Math.min(pageText.length, idx + 4200);
  return pageText.slice(start, end);
}

function extractDirectConditions(html, pageText) {
  const combined = `${html || ''}\n${pageText || ''}`;

  const baseDepth = findMeasurement(combined, [
    /base\s*depth[^\d]{0,20}(\d+(?:\.\d+)?)\s*(in|inch|inches|cm)/i,
    /snow\s*depth[^\d]{0,20}(\d+(?:\.\d+)?)\s*(in|inch|inches|cm)/i,
  ]);

  const newSnow24h = findMeasurement(combined, [
    /(?:24\s*h(?:our)?|overnight|last\s*24\s*hours?)[^\d]{0,20}(\d+(?:\.\d+)?)\s*(in|inch|inches|cm)/i,
    /new\s*snow[^\d]{0,20}(\d+(?:\.\d+)?)\s*(in|inch|inches|cm)/i,
  ]);

  const newSnow48h = findMeasurement(combined, [
    /(?:48\s*h(?:our)?|last\s*48\s*hours?)[^\d]{0,20}(\d+(?:\.\d+)?)\s*(in|inch|inches|cm)/i,
  ]);

  const trailsPair = findOpenTotalPair(combined, [
    /trails?\s*(?:open)?[^\d]{0,20}(\d{1,3})\s*(?:\/|of)\s*(\d{1,3})/i,
    /(\d{1,3})\s*(?:of|\/)\s*(\d{1,3})\s*trails?\s*open/i,
  ]);

  const liftsPair = findOpenTotalPair(combined, [
    /lifts?\s*(?:open)?[^\d]{0,20}(\d{1,3})\s*(?:\/|of)\s*(\d{1,3})/i,
    /(\d{1,3})\s*(?:of|\/)\s*(\d{1,3})\s*lifts?\s*open/i,
  ]);

  const surface = findSurface(combined);
  const reportDate = findReportDate(combined);
  const notes = findNotes(pageText, surface);

  return {
    baseDepth,
    newSnow24h,
    newSnow48h,
    trailsOpen: trailsPair?.open ?? null,
    trailsTotal: trailsPair?.total ?? null,
    liftsOpen: liftsPair?.open ?? null,
    liftsTotal: liftsPair?.total ?? null,
    surface,
    reportDate,
    notes,
  };
}

function fillMissingFromDirect(primary, fallback) {
  const merged = {};
  for (const key of [
    'baseDepth',
    'newSnow24h',
    'newSnow48h',
    'trailsOpen',
    'trailsTotal',
    'liftsOpen',
    'liftsTotal',
    'surface',
    'reportDate',
    'notes',
  ]) {
    const value = primary?.[key];
    merged[key] = value === null || value === undefined || value === '' ? fallback?.[key] ?? null : value;
  }
  return merged;
}

function finalizeConditions(raw) {
  const numOrNull = value => (value !== null && value !== undefined && !Number.isNaN(Number(value)) ? Number(value) : null);

  return {
    baseDepth: numOrNull(raw?.baseDepth),
    newSnow24h: numOrNull(raw?.newSnow24h),
    newSnow48h: numOrNull(raw?.newSnow48h),
    trailsOpen: numOrNull(raw?.trailsOpen),
    trailsTotal: numOrNull(raw?.trailsTotal),
    liftsOpen: numOrNull(raw?.liftsOpen),
    liftsTotal: numOrNull(raw?.liftsTotal),
    surface: typeof raw?.surface === 'string' && raw.surface.trim() ? raw.surface.trim() : null,
    reportDate: typeof raw?.reportDate === 'string' && raw.reportDate.trim() ? raw.reportDate.trim() : null,
    notes: typeof raw?.notes === 'string' && raw.notes.trim() ? raw.notes.trim() : null,
    fetchedAt: Date.now(),
  };
}

function hasEnoughSignal(conditions) {
  const populated = [
    conditions?.baseDepth,
    conditions?.newSnow24h,
    conditions?.newSnow48h,
    conditions?.trailsOpen,
    conditions?.liftsOpen,
    conditions?.surface,
    conditions?.reportDate,
  ].filter(value => value !== null && value !== undefined && value !== '').length;

  return populated >= 3;
}

function findMeasurement(text, patterns) {
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (!match) continue;
    const value = Number(match[1]);
    if (Number.isNaN(value)) continue;
    const unit = (match[2] || '').toLowerCase();
    return unit === 'cm' ? roundToTenth(value / 2.54) : value;
  }
  return null;
}

function findOpenTotalPair(text, patterns) {
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (!match) continue;
    const open = Number(match[1]);
    const total = Number(match[2]);
    if (!Number.isNaN(open) && !Number.isNaN(total) && total >= open) {
      return { open, total };
    }
  }
  return null;
}

function findSurface(text) {
  const surfaces = [
    'packed powder',
    'machine groomed',
    'groomed',
    'powder',
    'granular',
    'wet packed',
    'hard pack',
    'spring conditions',
    'variable',
  ];

  const lower = text.toLowerCase();
  for (const surface of surfaces) {
    if (lower.includes(surface)) return surface;
  }
  return null;
}

function findReportDate(text) {
  const patterns = [
    /updated\s*[:\-]?\s*([A-Z][a-z]{2,9}\s+\d{1,2},\s+\d{4})/,
    /report\s*date\s*[:\-]?\s*([A-Z][a-z]{2,9}\s+\d{1,2},\s+\d{4})/,
    /([A-Z][a-z]{2,9}\s+\d{1,2},\s+\d{4})/,
    /(\d{1,2}\/\d{1,2}\/\d{2,4})/,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) return match[1];
  }
  return null;
}

function findNotes(text, surface) {
  const lower = text.toLowerCase();
  if (surface && lower.includes(surface.toLowerCase())) {
    return `Surface reported as ${surface}.`;
  }
  if (lower.includes('powder')) return 'Fresh or powder conditions are mentioned on the report page.';
  if (lower.includes('groom')) return 'Groomed conditions are mentioned on the report page.';
  return null;
}

function roundToTenth(value) {
  return Math.round(value * 10) / 10;
}
