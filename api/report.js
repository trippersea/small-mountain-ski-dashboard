/**
 * /api/report — Server-side rendered resort pages
 *
 * Handles GET /report/<slug>
 * Returns a full HTML document with resort stats baked into <head> and <body>
 * so Google sees real content on first crawl — no JS execution required.
 *
 * After the HTML loads, the full Where To Ski app hydrates on top, so the
 * page is fully interactive within ~1s (same as the home page).
 */

const RESORTS = require('./resorts-data.js');

// ── Slug helpers (must match client-side slugify in resorts.js) ──────────────
function slugify(name) {
  return name
    .toLowerCase()
    .replace(/['\u2018\u2019]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function findBySlug(slug) {
  return RESORTS.find(r => slugify(r.name) === slug || r.id === slug) || null;
}

// ── Helpers ──────────────────────────────────────────────────────────────────
function esc(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function passColor(group) {
  return { Epic: '#2b6de9', Ikon: '#8a4dff', Indy: '#22b38a' }[group] || '#64748b';
}

// ── Meta description builder ─────────────────────────────────────────────────
function buildMeta(r) {
  const parts = [
    `${r.vertical.toLocaleString()}ft vertical`,
    `${r.trails} trails`,
    `${r.acres ? r.acres.toLocaleString() + ' acres' : ''}`,
    r.avgSnowfall ? `${r.avgSnowfall}" avg annual snowfall` : null,
    r.passGroup !== 'Independent' ? `${r.passGroup} pass access` : null,
    r.price ? `day tickets from $${r.price}` : null,
  ].filter(Boolean);

  return `${r.name} ski report — ${parts.join(' · ')}. Check live conditions, trail counts, snow forecast, and plan your trip.`;
}

// ── Full HTML page ────────────────────────────────────────────────────────────
function buildPage(r) {
  const reportSlug  = r.id || slugify(r.name);
  const canonUrl    = `https://www.wheretoskinext.com/ski-report/${reportSlug}/`;
  const metaDesc    = buildMeta(r);
  const passClr     = passColor(r.passGroup);
  const vertTier    = r.vertical >= 2000 ? 'Big Mountain' : r.vertical >= 1200 ? 'Mid-Size' : 'Local Hill';
  const terrainPct  = pct => (pct * 100).toFixed(0) + '%';
  const tb          = r.terrainBreakdown || {};

  // Structured data (JSON-LD) — Google uses this for rich results
  const jsonLd = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'SkiResort',
    name: r.name,
    description: metaDesc,
    url: r.website || canonUrl,
    address: { '@type': 'PostalAddress', addressRegion: r.state, addressCountry: 'US' },
    geo: r.lat && r.lon ? { '@type': 'GeoCoordinates', latitude: r.lat, longitude: r.lon } : undefined,
  });

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />

  <title>${esc(r.name)} Ski Report — Conditions, Trails & Snow Forecast | WhereToSkiNext.com</title>
  <meta name="description" content="${esc(metaDesc)}" />
  <link rel="canonical" href="${esc(canonUrl)}" />

  <!-- Open Graph -->
  <meta property="og:type"        content="website" />
  <meta property="og:url"         content="${esc(canonUrl)}" />
  <meta property="og:title"       content="${esc(r.name)} Ski Conditions — WhereToSkiNext.com" />
  <meta property="og:description" content="${esc(metaDesc)}" />
  <meta property="og:site_name"   content="WhereToSkiNext.com" />
  <meta property="og:image"       content="https://www.wheretoskinext.com/ski-decision-logo.png" />
  <meta property="og:image:alt"   content="${esc(r.name + ' — WhereToSkiNext.com')}" />

  <!-- Twitter -->
  <meta name="twitter:card"        content="summary_large_image" />
  <meta name="twitter:title"       content="${esc(r.name)} Ski Conditions — WhereToSkiNext.com" />
  <meta name="twitter:description" content="${esc(metaDesc)}" />
  <meta name="twitter:image"      content="https://www.wheretoskinext.com/ski-decision-logo.png" />
  <meta name="twitter:image:alt"   content="${esc(r.name + ' — WhereToSkiNext.com')}" />

  <!-- JSON-LD structured data -->
  <script type="application/ld+json">${jsonLd}</script>

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet" media="print" onload="this.media='all'">
  <noscript><link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet"></noscript>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css" />
  <link rel="stylesheet" href="/styles.css" />

  <!-- Tell the client app which resort to open on load -->
  <script>window.__REPORT_SLUG__ = ${JSON.stringify(reportSlug)};</script>
</head>
<body>
  <!-- ── Pre-rendered resort summary (crawlable, no JS needed) ─────────────── -->
  <div id="ssr-report" class="ssr-report" itemscope itemtype="https://schema.org/SkiResort">
    <div class="ssr-header">
      <div class="ssr-eyebrow">${esc(r.state)} · <span style="color:${passClr};font-weight:700">${esc(r.passGroup)}</span> · ${esc(vertTier)}</div>
      <h1 class="ssr-title" itemprop="name">${esc(r.name)}</h1>
      <p class="ssr-desc" itemprop="description">${esc(metaDesc)}</p>
    </div>

    <div class="ssr-stats">
      <div class="ssr-stat"><div class="ssr-stat-val">${r.vertical.toLocaleString()}<span class="ssr-unit">ft</span></div><div class="ssr-stat-label">Vertical Drop</div></div>
      <div class="ssr-stat"><div class="ssr-stat-val">${r.trails}</div><div class="ssr-stat-label">Trails</div></div>
      <div class="ssr-stat"><div class="ssr-stat-val">${r.acres ? r.acres.toLocaleString() : '—'}</div><div class="ssr-stat-label">Acres</div></div>
      <div class="ssr-stat"><div class="ssr-stat-val">${r.avgSnowfall}<span class="ssr-unit">"</span></div><div class="ssr-stat-label">Avg Snowfall</div></div>
      <div class="ssr-stat"><div class="ssr-stat-val">$${r.price}</div><div class="ssr-stat-label">Day Ticket*</div></div>
      <div class="ssr-stat"><div class="ssr-stat-val">${r.summitElevation.toLocaleString()}<span class="ssr-unit">ft</span></div><div class="ssr-stat-label">Summit</div></div>
    </div>

    <div class="ssr-terrain">
      <div class="ssr-terrain-row"><span class="ssr-run-type ssr-beginner">●</span> Beginner <strong>${terrainPct(tb.beginner || 0)}</strong></div>
      <div class="ssr-terrain-row"><span class="ssr-run-type ssr-intermediate">●</span> Intermediate <strong>${terrainPct(tb.intermediate || 0)}</strong></div>
      <div class="ssr-terrain-row"><span class="ssr-run-type ssr-advanced">●</span> Advanced <strong>${terrainPct(tb.advanced || 0)}</strong></div>
    </div>

    <div class="ssr-loading">
      <div class="ssr-loading-spinner"></div>
      Loading live conditions &amp; snow forecast…
    </div>
  </div>

  <!-- ── Full app shell (same as index.html — hydrates over the SSR content) ── -->
  <div id="toast" class="toast" aria-live="polite" aria-atomic="true"></div>
  <div id="sliderTooltip" class="slider-tooltip" role="tooltip"></div>

  <nav class="top-nav">
    <div class="top-nav-inner">
      <a href="/" class="nav-brand">WhereToSkiNext.com</a>
      <div class="nav-divider"></div>
      <a href="/#verdictSection" class="nav-cta">My Pick</a>
      <a href="/#compareSection" class="nav-cta nav-cta-db">Compare</a>
      <div class="nav-divider"></div>
      <a href="/#stormSection" class="nav-secondary">Storm Chaser</a>
      <a href="/#hiddenGemSection" class="nav-secondary">Hidden Gems</a>
      <a href="/#mapSection" class="nav-secondary">Map</a>
      <button class="btn-ghost nav-share" onclick="copyShareLink()">&#128279; Share</button>
      <button class="btn-ghost nav-share nav-discord" onclick="copyDiscordLink()" title="Copy a link that won't auto-expand in Discord">Discord</button>
    </div>
  </nav>

  <button id="backToTop" class="back-to-top" aria-label="Back to top">&#8593; Top</button>

  <div class="container" id="app-container" style="opacity:0">
    <!-- Full app renders here — hidden until JS loads to avoid flash -->
  </div>

  <script src="/resorts-national.js"></script>
  <script src="/resorts.js"></script>
  <script>
    // Once the app initialises, hide the SSR block and show the real app
    document.addEventListener('DOMContentLoaded', () => {
      const ssr = document.getElementById('ssr-report');
      const app = document.getElementById('app-container');
      // Give the app 800ms to hydrate, then fade SSR out
      setTimeout(() => {
        if (ssr) ssr.style.display = 'none';
        if (app) app.style.opacity = '1';
      }, 800);
    });
  </script>
</body>
</html>`;
}

// ── Handler ───────────────────────────────────────────────────────────────────
module.exports = async function handler(req, res) {
  // Extract slug from path: /report/sunday-river → "sunday-river"
  const slug = (req.url || '').replace(/^\/report\//, '').split('?')[0].split('#')[0];

  if (!slug) {
    return res.redirect(302, '/');
  }

  const resort = findBySlug(slug);

  if (!resort) {
    // Unknown slug — redirect home rather than 404ing
    return res.redirect(302, '/');
  }

  const html = buildPage(resort);

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  // Cache for 5 minutes on CDN — fresh enough for a ski conditions page
  res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');
  res.status(200).send(html);
};
