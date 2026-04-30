/**
 * /api/liftie — Vercel serverless function
 *
 * Proxies liftie.info/api/resort/:slug — a free public API for lift status.
 * We proxy server-side because liftie.info doesn't send CORS headers.
 *
 * GET /api/liftie?slug=stowe
 * Response: { liftsOpen, liftsTotal, lifts: [{name, status}], updatedAt } | { error }
 *
 * No auth needed. Results cached client-side for 15 minutes (lifts change often).
 */

module.exports = async function handler(req, res) {
  const { applyCors, rateLimit } = require('./_security');
  const cors = applyCors(req, res, { methods: ['GET', 'OPTIONS'], headers: ['Content-Type'] });

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  if (req.headers.origin && !cors.allowed) return res.status(403).json({ error: 'Origin not allowed' });

  const rl = rateLimit(req, res, { prefix: 'liftie', max: 90, windowMs: 60_000 });
  if (!rl.ok) return res.status(429).json({ error: 'Too many requests' });

  const { slug } = req.query || {};
  if (!slug || !/^[a-z0-9-]+$/.test(slug)) {
    return res.status(400).json({ error: 'Invalid or missing slug' });
  }

  const url = `https://liftie.info/api/resort/${encodeURIComponent(slug)}`;

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 5000);

    const upstream = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'SkiNE/1.0 (+https://skine.app; contact: hello@skine.app)',
        'Accept': 'application/json',
      },
    }).finally(() => clearTimeout(timer));

    if (!upstream.ok) {
      return res.status(200).json({ error: `Liftie returned ${upstream.status}` });
    }

    const raw = await upstream.json();

    // Normalize liftie's response shape:
    // raw.lifts is an object: { "Gondola": "open", "Chair 1": "closed", ... }
    // raw.lifts.stats (if present): { open, hold, scheduled, closed }
    const liftMap = raw.lifts || {};
    const stats   = liftMap.stats || {};
    const details = liftMap.status || {};

    const lifts = Object.entries(details).map(([name, status]) => ({ name, status }));

    const liftsOpen  = typeof stats.open === 'number' ? stats.open : lifts.filter(l => l.status === 'open').length;
    const liftsHold  = typeof stats.hold === 'number' ? stats.hold : lifts.filter(l => l.status === 'hold').length;
    const liftsTotal = lifts.length || (stats.open + stats.hold + stats.scheduled + stats.closed) || null;

    res.setHeader('Cache-Control', 'public, s-maxage=900, stale-while-revalidate=3600');
    return res.status(200).json({
      liftsOpen,
      liftsHold,
      liftsTotal,
      lifts,          // individual lift names + status
      fetchedAt: Date.now(),
    });

  } catch (err) {
    const isTimeout = err.name === 'AbortError';
    console.warn('[/api/liftie]', slug, isTimeout ? 'timeout' : err.message);
    return res.status(200).json({ error: isTimeout ? 'timeout' : 'unavailable' });
  }
};
