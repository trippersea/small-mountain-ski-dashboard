function parseAllowedOrigins() {
  const raw = (process.env.ALLOWED_ORIGINS || '').trim();
  if (!raw) return [];
  return raw
    .split(',')
    .map(s => s.trim())
    .filter(Boolean);
}

function getClientIp(req) {
  // Prefer platform-set headers. Vercel writes x-vercel-forwarded-for and
  // x-real-ip itself; a client-supplied x-forwarded-for chain can carry
  // attacker-chosen leading entries on some platforms, which would let a
  // caller rotate rate-limit buckets at will. Fall back through the chain.
  const vff = req?.headers?.['x-vercel-forwarded-for'];
  if (typeof vff === 'string' && vff.trim()) return vff.split(',')[0].trim();
  const realIp = req?.headers?.['x-real-ip'];
  if (typeof realIp === 'string' && realIp.trim()) return realIp.trim();
  const xff = req?.headers?.['x-forwarded-for'];
  if (typeof xff === 'string' && xff.trim()) return xff.split(',')[0].trim();
  if (Array.isArray(xff) && xff.length) return String(xff[0]).trim();
  return (
    req?.socket?.remoteAddress ||
    req?.connection?.remoteAddress ||
    'unknown'
  );
}

function isAllowedOrigin(origin, req) {
  if (!origin) return false;

  const allowed = parseAllowedOrigins();
  if (allowed.includes(origin)) return true;

  // Allow same-host origins by default (helps if ALLOWED_ORIGINS isn't set yet).
  const host = req?.headers?.host;
  if (host) {
    if (origin === `https://${host}` || origin === `http://${host}`) return true;
  }

  // Optional: allow Vercel preview deployments (e.g. https://foo-bar.vercel.app)
  if (process.env.ALLOW_VERCEL_PREVIEWS === 'true') {
    try {
      const { hostname, protocol } = new URL(origin);
      if (protocol === 'https:' && hostname.endsWith('.vercel.app')) return true;
    } catch {
      // ignore
    }
  }

  return false;
}

function applyCors(req, res, { methods = ['POST', 'OPTIONS'], headers = ['Content-Type'] } = {}) {
  const origin = req.headers.origin;

  if (origin && isAllowedOrigin(origin, req)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
  }

  res.setHeader('Access-Control-Allow-Methods', methods.join(', '));
  res.setHeader('Access-Control-Allow-Headers', headers.join(', '));
  res.setHeader('Access-Control-Max-Age', '86400');

  return { origin, allowed: !!(origin && isAllowedOrigin(origin, req)) };
}

function applyApiBaselineSecurity(res, { cacheControl = 'no-store' } = {}) {
  // Most baseline headers are set globally in vercel.json, but API routes often
  // need explicit caching rules to avoid unintended CDN/browser storage.
  if (cacheControl) res.setHeader('Cache-Control', cacheControl);
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
}

// ── Minimal in-memory rate limiting (best-effort) ────────────────────────────
// Note: Vercel serverless may run multiple instances; this is a per-instance
// guard (still useful vs bursts / accidental loops).
const _rateBuckets = new Map();
const _RATE_BUCKET_SWEEP_AT = 1000; // bound per-instance memory

function _sweepRateBuckets(now, windowMs) {
  if (_rateBuckets.size < _RATE_BUCKET_SWEEP_AT) return;
  for (const [k, b] of _rateBuckets) {
    if (now - b.resetAt > windowMs) _rateBuckets.delete(k);
  }
}

function rateLimit(req, res, { max = 30, windowMs = 60_000, prefix = 'rl' } = {}) {
  const ip = getClientIp(req);
  const now = Date.now();
  const key = `${prefix}:${ip}`;
  _sweepRateBuckets(now, windowMs);

  const b = _rateBuckets.get(key);
  if (!b || now - b.resetAt > windowMs) {
    _rateBuckets.set(key, { count: 1, resetAt: now });
    return { ok: true, ip, remaining: max - 1 };
  }

  b.count += 1;
  if (b.count > max) {
    const retryAfterSec = Math.max(1, Math.ceil((windowMs - (now - b.resetAt)) / 1000));
    res.setHeader('Retry-After', String(retryAfterSec));
    return { ok: false, ip, remaining: 0 };
  }

  return { ok: true, ip, remaining: Math.max(0, max - b.count) };
}

async function readRawBody(req, { limitBytes = 100_000 } = {}) {
  return new Promise((resolve, reject) => {
    let data = '';
    let size = 0;
    req.on('data', chunk => {
      size += chunk.length || 0;
      if (size > limitBytes) {
        reject(Object.assign(new Error('Request body too large'), { code: 'BODY_TOO_LARGE' }));
        try { req.destroy(); } catch {}
        return;
      }
      data += chunk;
    });
    req.on('end', () => resolve(data));
    req.on('error', reject);
  });
}

function safeJsonParse(raw) {
  try { return raw ? JSON.parse(raw) : {}; } catch { return null; }
}

// ── Timing-safe secret comparison ────────────────────────────────────────────
// For bearer tokens / cron secrets. Plain === comparison leaks match length
// through response timing; crypto.timingSafeEqual requires equal lengths, so
// hash both sides first to normalize.
const crypto = require('crypto');

function safeEqual(a, b) {
  const ah = crypto.createHash('sha256').update(String(a ?? '')).digest();
  const bh = crypto.createHash('sha256').update(String(b ?? '')).digest();
  return crypto.timingSafeEqual(ah, bh);
}

module.exports = {
  applyCors,
  applyApiBaselineSecurity,
  getClientIp,
  rateLimit,
  readRawBody,
  safeJsonParse,
  safeEqual,
};

