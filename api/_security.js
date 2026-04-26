function parseAllowedOrigins() {
  const raw = (process.env.ALLOWED_ORIGINS || '').trim();
  if (!raw) return [];
  return raw
    .split(',')
    .map(s => s.trim())
    .filter(Boolean);
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

module.exports = {
  applyCors,
  applyApiBaselineSecurity,
};

