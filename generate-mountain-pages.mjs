#!/usr/bin/env node
// ═══════════════════════════════════════════════════════════════════════════════
// generate-mountain-pages.mjs
// Generates one static HTML page per resort: /ski-report/{resort-id}/index.html
//
// Usage:
//   node generate-mountain-pages.mjs
//
// Output: ./public/ski-report/{resort-id}/index.html  (~256 files)
//
// Each page is fully server-rendered HTML with:
//  - Unique <title> and meta description targeting "{Mountain} ski conditions"
//  - JSON-LD SportsActivityLocation schema with AggregateRating
//  - Full mountain stats card (vertical, trails, pass, price, terrain, snow)
//  - Breadcrumb JSON-LD for rich results
//  - Links back to the state page and nearby mountains
//  - A "See Live Conditions →" CTA that deep-links into the app pre-selecting the mountain
//
// SEO strategy: rank for "{mountain name} ski report", "{mountain name} conditions",
// "{mountain name} snow forecast" queries and funnel users into the live app.
// These pages also give internal link depth to the state pages.
// ═══════════════════════════════════════════════════════════════════════════════

import fs   from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ─── Load resort data ──────────────────────────────────────────────────────────
import { createRequire } from 'module';
const _require = createRequire(import.meta.url);
const vm = _require('vm');

function loadResorts() {
  const sdData = fs.readFileSync(path.join(__dirname, 'sd-data.js'), 'utf8');
  const neCtx = {};
  vm.runInNewContext(sdData + '\nglobalThis.__out = RESORTS_NE;', neCtx);
  const resortsNE = neCtx.__out || [];
  if (!resortsNE.length) throw new Error('Could not load RESORTS_NE from sd-data.js');

  let resortsNational = [];
  const nationalPath = path.join(__dirname, 'resorts-national.js');
  if (fs.existsSync(nationalPath)) {
    try {
      const nationalData = fs.readFileSync(nationalPath, 'utf8');
      const natCtx = {};
      vm.runInNewContext(nationalData + '\nglobalThis.__out = RESORTS_NATIONAL;', natCtx);
      resortsNational = natCtx.__out || [];
    } catch (e) {
      console.warn('Warning: could not load resorts-national.js:', e.message);
    }
  }

  return [...resortsNE, ...resortsNational];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function passLabel(pg) {
  return { Epic: 'Epic Pass', Ikon: 'Ikon Pass', Indy: 'Indy Pass', Independent: 'Independent' }[pg] || pg;
}

function stateFullName(abbr) {
  const names = {
    AL:'Alabama', AK:'Alaska', AZ:'Arizona', AR:'Arkansas', CA:'California',
    CO:'Colorado', CT:'Connecticut', DE:'Delaware', FL:'Florida', GA:'Georgia',
    HI:'Hawaii', ID:'Idaho', IL:'Illinois', IN:'Indiana', IA:'Iowa', KS:'Kansas',
    KY:'Kentucky', LA:'Louisiana', ME:'Maine', MD:'Maryland', MA:'Massachusetts',
    MI:'Michigan', MN:'Minnesota', MS:'Mississippi', MO:'Missouri', MT:'Montana',
    NE:'Nebraska', NV:'Nevada', NH:'New Hampshire', NJ:'New Jersey', NM:'New Mexico',
    NY:'New York', NC:'North Carolina', ND:'North Dakota', OH:'Ohio', OK:'Oklahoma',
    OR:'Oregon', PA:'Pennsylvania', RI:'Rhode Island', SC:'South Carolina',
    SD:'South Dakota', TN:'Tennessee', TX:'Texas', UT:'Utah', VT:'Vermont',
    VA:'Virginia', WA:'Washington', WV:'West Virginia', WI:'Wisconsin', WY:'Wyoming',
  };
  return names[abbr] || abbr;
}

function slugifyState(abbr) {
  const names = {
    AL:'alabama', AK:'alaska', AZ:'arizona', AR:'arkansas', CA:'california',
    CO:'colorado', CT:'connecticut', DE:'delaware', FL:'florida', GA:'georgia',
    HI:'hawaii', ID:'idaho', IL:'illinois', IN:'indiana', IA:'iowa', KS:'kansas',
    KY:'kentucky', LA:'louisiana', ME:'maine', MD:'maryland', MA:'massachusetts',
    MI:'michigan', MN:'minnesota', MS:'mississippi', MO:'missouri', MT:'montana',
    NE:'nebraska', NV:'nevada', NH:'new-hampshire', NJ:'new-jersey', NM:'new-mexico',
    NY:'new-york', NC:'north-carolina', ND:'north-dakota', OH:'ohio', OK:'oklahoma',
    OR:'oregon', PA:'pennsylvania', RI:'rhode-island', SC:'south-carolina',
    SD:'south-dakota', TN:'tennessee', TX:'texas', UT:'utah', VT:'vermont',
    VA:'virginia', WA:'washington', WV:'west-virginia', WI:'wisconsin', WY:'wyoming',
  };
  return names[abbr] || abbr.toLowerCase().replace(/\s+/g, '-');
}

// Terrain summary string used in meta description
function terrainSummary(r) {
  const pct = p => Math.round(p * 100) + '%';
  return `${pct(r.terrainBreakdown.beginner)} beginner, ${pct(r.terrainBreakdown.intermediate)} intermediate, ${pct(r.terrainBreakdown.advanced)} advanced`;
}

// Distance in miles between two lat/lon points (Haversine)
function distanceMiles(lat1, lon1, lat2, lon2) {
  const R = 3958.8;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2)**2 + Math.cos(lat1 * Math.PI/180) * Math.cos(lat2 * Math.PI/180) * Math.sin(dLon/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

// Find up to 4 nearby mountains in the same or adjacent states
function nearbyResorts(resort, allResorts, limit = 4) {
  return allResorts
    .filter(r => r.id !== resort.id)
    .map(r => ({ r, dist: distanceMiles(resort.lat, resort.lon, r.lat, r.lon) }))
    .sort((a, b) => a.dist - b.dist)
    .slice(0, limit)
    .map(x => x.r);
}

// ─── JSON-LD schemas ──────────────────────────────────────────────────────────
function buildSchemas(resort, stateName) {
  const canonUrl = `https://wheretoskinext.com/ski-report/${resort.id}/`;

  const sportsLocation = {
    '@context': 'https://schema.org',
    '@type': 'SportsActivityLocation',
    name: resort.name,
    description: `${resort.name} ski resort in ${stateName} — ${resort.vertical.toLocaleString()} ft vertical, ${resort.trails} trails, ${resort.acres} acres. ${passLabel(resort.passGroup)} mountain.`,
    url: canonUrl,
    address: {
      '@type': 'PostalAddress',
      addressRegion: resort.state,
      addressCountry: 'US',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: resort.lat,
      longitude: resort.lon,
    },
    priceRange: `$${resort.price} day ticket`,
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      description: 'Seasonal winter operation — verify current hours with the resort.',
    },
    ...(resort.ratingCount > 0 && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: resort.rating,
        reviewCount: resort.ratingCount,
        bestRating: 5,
        worstRating: 1,
      },
    }),
    sameAs: resort.website ? [resort.website] : [],
  };

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'SkiDecision', item: 'https://wheretoskinext.com' },
      { '@type': 'ListItem', position: 2, name: `Ski Mountains in ${stateName}`, item: `https://wheretoskinext.com/ski/${slugifyState(resort.state)}/` },
      { '@type': 'ListItem', position: 3, name: resort.name, item: canonUrl },
    ],
  };

  return [sportsLocation, breadcrumb];
}

// ─── Terrain bar HTML ──────────────────────────────────────────────────────────
function terrainBar(label, pct, color) {
  const w = Math.round(pct * 100);
  return `
    <div class="bar-row">
      <span class="bar-label">${label}</span>
      <div class="bar-track"><div class="bar-fill" style="width:${w}%;background:${color}"></div></div>
      <span class="bar-pct">${w}%</span>
    </div>`;
}

// ─── Generate HTML for one mountain page ──────────────────────────────────────
function generateMountainPage(resort, allResorts) {
  const stateName  = stateFullName(resort.state);
  const stateSlug  = slugifyState(resort.state);
  const canonUrl   = `https://wheretoskinext.com/ski-report/${resort.id}/`;
  const appUrl     = `https://wheretoskinext.com/?resort=${resort.id}`;
  const schemas    = buildSchemas(resort, stateName);
  const nearby     = nearbyResorts(resort, allResorts);
  const tb         = resort.terrainBreakdown;
  const year       = new Date().getFullYear();

  // Page title variants for natural keyword targeting
  const pageTitle  = `${resort.name} Ski Report ${year} — Conditions, Trails & Snow | SkiDecision`;
  const metaDesc   = `${resort.name} in ${stateName}: ${resort.vertical.toLocaleString()} ft vertical, ${resort.trails} trails, $${resort.price} day ticket. ${passLabel(resort.passGroup)} mountain. Check live snow forecast and conditions.`;

  const passColor  = { Epic: '#1a56db', Ikon: '#0e9f6e', Indy: '#c27803', Independent: '#6b7280' }[resort.passGroup] || '#6b7280';

  const nearbyCards = nearby.map(r => `
    <a href="/ski-report/${r.id}/" class="nearby-card">
      <div class="nearby-name">${esc(r.name)}</div>
      <div class="nearby-meta">${esc(r.state)} · ${r.vertical.toLocaleString()} ft · ${esc(passLabel(r.passGroup))}</div>
    </a>`).join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <!-- Google tag (gtag.js) -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-VK2Q3TTFEW"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-VK2Q3TTFEW');
  </script>
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${esc(pageTitle)}</title>
  <meta name="description" content="${esc(metaDesc)}" />
  <link rel="canonical" href="${canonUrl}" />

  <!-- Open Graph -->
  <meta property="og:title" content="${esc(resort.name)} Ski Conditions — SkiDecision" />
  <meta property="og:description" content="${esc(metaDesc)}" />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="${canonUrl}" />
  <meta property="og:image" content="https://wheretoskinext.com/ski-decision-logo.png" />

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${esc(resort.name)} Ski Conditions — SkiDecision" />
  <meta name="twitter:description" content="${esc(metaDesc)}" />

  <link rel="icon" href="/ski-decision-logo.png" type="image/png" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet" />

  <script type="application/ld+json">
  ${JSON.stringify(schemas, null, 2)}
  </script>

  <style>
    *, *::before, *::after { box-sizing: border-box; }
    html { scroll-behavior: smooth; }
    body {
      font-family: 'DM Sans', system-ui, sans-serif;
      background: linear-gradient(180deg, #f7fbff 0%, #eef5fb 100%);
      color: #1b2a3a;
      margin: 0;
      line-height: 1.6;
      min-height: 100vh;
    }

    /* ── Nav ── */
    .top-nav {
      position: sticky; top: 0; z-index: 100;
      backdrop-filter: blur(14px);
      background: rgba(255,255,255,.92);
      border-bottom: 1px solid #d6e1f0;
    }
    .top-nav-inner {
      max-width: 1100px; margin: 0 auto;
      padding: 10px 20px;
      display: flex; align-items: center; gap: 8px;
    }
    .nav-brand { font-weight: 800; font-size: 16px; color: #1b2a3a; text-decoration: none; margin-right: 6px; }
    .nav-divider { width: 1px; height: 16px; background: #d6e1f0; margin: 0 4px; flex-shrink: 0; }
    .nav-link {
      padding: 6px 12px; border-radius: 8px; text-decoration: none;
      color: #1b2a3a; font-weight: 600; font-size: 13px;
      transition: background .12s, color .12s;
    }
    .nav-link:hover { background: #edf4ff; color: #2b6de9; }
    .nav-link-cta {
      background: #2b6de9; color: #fff !important;
      border-radius: 999px; padding: 7px 16px;
    }
    .nav-link-cta:hover { background: #1d5fd4; }

    /* ── Page layout ── */
    .page { max-width: 900px; margin: 0 auto; padding: 40px 20px 80px; }

    /* ── Breadcrumb ── */
    .breadcrumb {
      font-size: 13px; color: #667a96; margin-bottom: 24px;
      display: flex; align-items: center; gap: 6px; flex-wrap: wrap;
    }
    .breadcrumb a { color: #2b6de9; text-decoration: none; font-weight: 500; }
    .breadcrumb a:hover { text-decoration: underline; }
    .breadcrumb-sep { color: #b0bec5; }

    /* ── Hero ── */
    .resort-hero { margin-bottom: 32px; }
    .resort-eyebrow {
      display: inline-flex; align-items: center; gap: 7px;
      font-family: 'DM Mono', monospace; font-size: 11px; font-weight: 500;
      letter-spacing: .1em; text-transform: uppercase;
      color: ${passColor}; background: #f0f7ff;
      border: 1px solid rgba(43,109,233,.2);
      border-radius: 999px; padding: 4px 12px; margin-bottom: 14px;
    }
    .resort-eyebrow::before {
      content: ''; width: 6px; height: 6px; border-radius: 50%; background: ${passColor};
    }
    .resort-name {
      font-size: clamp(28px, 5vw, 46px); font-weight: 800;
      letter-spacing: -.03em; line-height: 1.08; margin: 0 0 10px;
    }
    .resort-location {
      font-size: 17px; color: #667a96; margin: 0 0 20px;
    }

    /* ── Live CTA banner ── */
    .live-banner {
      background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
      border: 1.5px solid #bfdbfe; border-radius: 16px;
      padding: 18px 22px; margin-bottom: 32px;
      display: flex; align-items: center; justify-content: space-between;
      flex-wrap: wrap; gap: 12px;
    }
    .live-banner-text h2 { font-size: 16px; font-weight: 800; color: #1e40af; margin: 0 0 3px; }
    .live-banner-text p  { font-size: 13px; color: #1d4ed8; margin: 0; }
    .live-btn {
      display: inline-flex; align-items: center; gap: 6px;
      background: #2b6de9; color: #fff; border-radius: 999px;
      padding: 10px 20px; font-weight: 700; font-size: 14px;
      text-decoration: none; white-space: nowrap;
      box-shadow: 0 4px 14px rgba(43,109,233,.3);
      transition: background .12s, transform .1s;
    }
    .live-btn:hover { background: #1d5fd4; transform: translateY(-1px); }

    /* ── Stats grid ── */
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
      gap: 12px; margin-bottom: 28px;
    }
    .stat-card {
      background: #fff; border: 1px solid #d6e1f0;
      border-radius: 14px; padding: 16px 14px;
      box-shadow: 0 2px 8px rgba(30,60,100,.05);
    }
    .stat-label { font-size: 11px; font-weight: 600; letter-spacing: .06em; text-transform: uppercase; color: #667a96; margin-bottom: 4px; }
    .stat-value { font-size: 22px; font-weight: 800; color: #1b2a3a; line-height: 1.2; }
    .stat-unit  { font-size: 13px; font-weight: 500; color: #667a96; }

    /* ── Detail panels ── */
    .panels { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 28px; }
    .panel {
      background: #fff; border: 1px solid #d6e1f0;
      border-radius: 16px; padding: 20px 22px;
      box-shadow: 0 2px 8px rgba(30,60,100,.05);
    }
    .panel h3 { font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: .06em; color: #667a96; margin: 0 0 14px; }
    .detail-row { display: flex; justify-content: space-between; align-items: center; padding: 7px 0; border-bottom: 1px solid #f0f6fd; font-size: 14px; }
    .detail-row:last-child { border-bottom: none; }
    .detail-key { color: #667a96; }
    .detail-val { font-weight: 700; color: #1b2a3a; text-align: right; }

    /* ── Terrain bars ── */
    .bar-row { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; font-size: 13px; }
    .bar-row:last-child { margin-bottom: 0; }
    .bar-label { width: 90px; color: #667a96; flex-shrink: 0; }
    .bar-track  { flex: 1; height: 8px; background: #edf4ff; border-radius: 99px; overflow: hidden; }
    .bar-fill   { height: 100%; border-radius: 99px; transition: width .4s; }
    .bar-pct    { width: 36px; text-align: right; font-weight: 700; color: #1b2a3a; }

    /* ── Pass badge ── */
    .pass-badge {
      display: inline-flex; align-items: center; gap: 6px;
      background: ${passColor}1a; color: ${passColor};
      border: 1px solid ${passColor}40; border-radius: 999px;
      padding: 4px 12px; font-size: 13px; font-weight: 700;
    }

    /* ── Nearby section ── */
    .nearby-section { margin-top: 40px; }
    .nearby-section h2 { font-size: 18px; font-weight: 800; margin: 0 0 16px; }
    .nearby-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(190px, 1fr)); gap: 10px; }
    .nearby-card {
      background: #fff; border: 1px solid #d6e1f0; border-radius: 12px;
      padding: 14px 16px; text-decoration: none; color: #1b2a3a;
      transition: border-color .12s, box-shadow .12s;
    }
    .nearby-card:hover { border-color: #2b6de9; box-shadow: 0 4px 16px rgba(43,109,233,.1); }
    .nearby-name { font-size: 14px; font-weight: 700; margin-bottom: 4px; }
    .nearby-meta { font-size: 12px; color: #667a96; }

    /* ── State link ── */
    .state-link-row { margin-top: 28px; font-size: 14px; color: #667a96; }
    .state-link-row a { color: #2b6de9; font-weight: 600; text-decoration: none; }
    .state-link-row a:hover { text-decoration: underline; }

    /* ── Footer ── */
    footer {
      text-align: center; padding: 28px 16px;
      font-size: 12px; color: #94a3b8;
      border-top: 1px solid #d6e1f0; background: #fff;
      margin-top: 48px;
    }
    footer a { color: #2b6de9; text-decoration: none; }

    /* ── Responsive ── */
    @media (max-width: 620px) {
      .panels { grid-template-columns: 1fr; }
      .live-banner { flex-direction: column; }
      .stats-grid { grid-template-columns: repeat(2, 1fr); }
    }
  </style>
</head>
<body>

  <!-- Nav -->
  <nav class="top-nav" role="navigation" aria-label="Main navigation">
    <div class="top-nav-inner">
      <a href="/" class="nav-brand">SkiDecision</a>
      <div class="nav-divider"></div>
      <a href="/ski/${stateSlug}/" class="nav-link">${stateName} Mountains</a>
      <div class="nav-divider"></div>
      <a href="${esc(appUrl)}" class="nav-link nav-link-cta">Live Conditions →</a>
    </div>
  </nav>

  <main class="page">

    <!-- Breadcrumb -->
    <nav class="breadcrumb" aria-label="Breadcrumb">
      <a href="/">SkiDecision</a>
      <span class="breadcrumb-sep">›</span>
      <a href="/ski/${stateSlug}/">Ski Mountains in ${esc(stateName)}</a>
      <span class="breadcrumb-sep">›</span>
      <span>${esc(resort.name)}</span>
    </nav>

    <!-- Hero -->
    <header class="resort-hero">
      <div class="resort-eyebrow">${esc(passLabel(resort.passGroup))}</div>
      <h1 class="resort-name">${esc(resort.name)}</h1>
      <p class="resort-location">${esc(stateName)} · ${resort.baseElevation.toLocaleString()}–${resort.summitElevation.toLocaleString()} ft elevation</p>
    </header>

    <!-- Live CTA -->
    <div class="live-banner">
      <div class="live-banner-text">
        <h2>See today's live snow forecast &amp; Ski Score</h2>
        <p>Updated daily — includes drive time from your location, crowd outlook, and real-time rankings.</p>
      </div>
      <a href="${esc(appUrl)}" class="live-btn">
        See Live Conditions
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </a>
    </div>

    <!-- Key Stats -->
    <div class="stats-grid" aria-label="Mountain statistics">
      <div class="stat-card">
        <div class="stat-label">Vertical Drop</div>
        <div class="stat-value">${resort.vertical.toLocaleString()}<span class="stat-unit"> ft</span></div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Trails</div>
        <div class="stat-value">${resort.trails}<span class="stat-unit"> runs</span></div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Skiable Acres</div>
        <div class="stat-value">${resort.acres.toLocaleString()}<span class="stat-unit"> ac</span></div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Avg Annual Snow</div>
        <div class="stat-value">${resort.avgSnowfall}<span class="stat-unit">"</span></div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Day Ticket*</div>
        <div class="stat-value">$${resort.price}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Lifts</div>
        <div class="stat-value">${resort.lifts}</div>
      </div>
    </div>

    <!-- Detail panels -->
    <div class="panels">

      <!-- Mountain details -->
      <div class="panel">
        <h3>Mountain Details</h3>
        <div class="detail-row">
          <span class="detail-key">Pass</span>
          <span class="detail-val"><span class="pass-badge">${esc(passLabel(resort.passGroup))}</span></span>
        </div>
        <div class="detail-row">
          <span class="detail-key">Base / Summit</span>
          <span class="detail-val">${resort.baseElevation.toLocaleString()} / ${resort.summitElevation.toLocaleString()} ft</span>
        </div>
        <div class="detail-row">
          <span class="detail-key">Longest Run</span>
          <span class="detail-val">${resort.longestRun} mi</span>
        </div>
        <div class="detail-row">
          <span class="detail-key">Night Skiing</span>
          <span class="detail-val">${resort.night ? '✓ Yes' : 'No'}</span>
        </div>
        <div class="detail-row">
          <span class="detail-key">Terrain Park</span>
          <span class="detail-val">${resort.terrainPark ? '✓ Yes' : 'No'}</span>
        </div>
        ${resort.website ? `
        <div class="detail-row">
          <span class="detail-key">Resort Website</span>
          <span class="detail-val"><a href="${esc(resort.website)}" target="_blank" rel="noopener noreferrer" style="color:#2b6de9;font-weight:700;text-decoration:none">Visit →</a></span>
        </div>` : ''}
      </div>

      <!-- Terrain breakdown -->
      <div class="panel">
        <h3>Terrain Breakdown</h3>
        ${terrainBar('Beginner', tb.beginner, '#22b38a')}
        ${terrainBar('Intermediate', tb.intermediate, '#2b6de9')}
        ${terrainBar('Advanced', tb.advanced, '#ef4444')}
        <div style="margin-top:16px;padding-top:14px;border-top:1px solid #edf4ff">
          <div class="detail-row" style="padding:4px 0">
            <span class="detail-key">Snowmaking capacity</span>
            <span class="detail-val">${resort.snowmaking.toLocaleString()} GPM</span>
          </div>
          <div class="detail-row" style="padding:4px 0">
            <span class="detail-key">State</span>
            <span class="detail-val">${esc(stateName)}</span>
          </div>
        </div>
      </div>

    </div>

    <!-- About section for content depth -->
    <section style="background:#fff;border:1px solid #d6e1f0;border-radius:16px;padding:24px 26px;margin-bottom:28px;box-shadow:0 2px 8px rgba(30,60,100,.05)">
      <h2 style="font-size:18px;font-weight:800;margin:0 0 12px">${esc(resort.name)} — At a Glance</h2>
      <p style="font-size:15px;color:#2e3f54;line-height:1.72;margin:0 0 10px">
        ${esc(resort.name)} is a ski resort located in ${esc(stateName)}, rising from ${resort.baseElevation.toLocaleString()} ft to ${resort.summitElevation.toLocaleString()} ft with ${resort.vertical.toLocaleString()} ft of vertical drop.
        The mountain offers ${resort.trails} trails across ${resort.acres.toLocaleString()} skiable acres — ${Math.round(tb.beginner*100)}% beginner, ${Math.round(tb.intermediate*100)}% intermediate, and ${Math.round(tb.advanced*100)}% advanced terrain.
      </p>
      <p style="font-size:15px;color:#2e3f54;line-height:1.72;margin:0 0 10px">
        With an average of ${resort.avgSnowfall}" of snowfall per season and ${resort.snowmaking.toLocaleString()} GPM of snowmaking capacity, ${esc(resort.name)} can typically maintain good coverage throughout the winter.
        ${resort.night ? 'Night skiing is available.' : ''} ${resort.terrainPark ? 'The mountain features a terrain park.' : ''}
      </p>
      <p style="font-size:15px;color:#2e3f54;line-height:1.72;margin:0">
        ${esc(resort.name)} is a <strong>${esc(passLabel(resort.passGroup))}</strong> mountain. Day tickets start around $${resort.price} — prices vary by date and demand.
        For live snow conditions, drive-time estimates from your location, and a personalized Ski Score, use the SkiDecision app.
      </p>
    </section>

    <!-- Nearby mountains -->
    ${nearby.length ? `
    <section class="nearby-section">
      <h2>Nearby Ski Mountains</h2>
      <div class="nearby-grid">
        ${nearbyCards}
      </div>
    </section>` : ''}

    <!-- State page link -->
    <div class="state-link-row">
      → See all <a href="/ski/${stateSlug}/">${esc(stateName)} ski mountains</a> ranked by snow, vertical, and value.
    </div>

    <p style="font-size:12px;color:#94a3b8;margin-top:28px">
      *Day ticket prices are approximate and vary by date, demand, age, and promotions. Always confirm pricing directly with ${esc(resort.name)} before purchasing.
    </p>

  </main>

  <footer>
    <p>© ${year} SkiDecision · <a href="https://wheretoskinext.com">wheretoskinext.com</a> · Data updated seasonally</p>
    <p style="margin-top:6px"><a href="/">Find the best mountain to ski next →</a></p>
  </footer>

</body>
</html>`;
}

// ─── Generate sitemap.xml ──────────────────────────────────────────────────────
function generateSitemap(resorts) {
  const states = [...new Set(resorts.map(r => r.state))];
  const today  = new Date().toISOString().split('T')[0];

  const urls = [
    // Homepage
    `  <url><loc>https://wheretoskinext.com/</loc><changefreq>daily</changefreq><priority>1.0</priority><lastmod>${today}</lastmod></url>`,
    // About page
    `  <url><loc>https://wheretoskinext.com/about/</loc><changefreq>monthly</changefreq><priority>0.6</priority><lastmod>${today}</lastmod></url>`,
    // State pages
    ...states.map(s =>
      `  <url><loc>https://wheretoskinext.com/ski/${slugifyState(s)}/</loc><changefreq>weekly</changefreq><priority>0.8</priority><lastmod>${today}</lastmod></url>`
    ),
    // Mountain pages
    ...resorts.map(r =>
      `  <url><loc>https://wheretoskinext.com/ski-report/${r.id}/</loc><changefreq>daily</changefreq><priority>0.9</priority><lastmod>${today}</lastmod></url>`
    ),
  ];

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`;
}

// ─── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  const resorts = loadResorts();
  console.log(`Loaded ${resorts.length} resorts`);

  // Create output directory
  const outBase = path.join(__dirname, 'public', 'ski-report');
  fs.mkdirSync(outBase, { recursive: true });

  let generated = 0;
  for (const resort of resorts) {
    const dir  = path.join(outBase, resort.id);
    fs.mkdirSync(dir, { recursive: true });
    const html = generateMountainPage(resort, resorts);
    fs.writeFileSync(path.join(dir, 'index.html'), html, 'utf8');
    generated++;
    if (generated % 25 === 0) console.log(`  Generated ${generated}/${resorts.length}...`);
  }
  console.log(`✓ Generated ${generated} mountain pages → public/ski-report/`);

  // Write sitemap
  const sitemapPath = path.join(__dirname, 'public', 'sitemap.xml');
  fs.mkdirSync(path.join(__dirname, 'public'), { recursive: true });
  fs.writeFileSync(sitemapPath, generateSitemap(resorts), 'utf8');
  console.log(`✓ Generated sitemap.xml → public/sitemap.xml  (${resorts.length + 5} URLs)`);

  console.log('\nNext steps:');
  console.log('  1. Deploy public/ski-report/ to your server');
  console.log('  2. Submit sitemap to Google Search Console: https://wheretoskinext.com/sitemap.xml');
  console.log('  3. Add <link rel="sitemap"> to index.html <head>');
  console.log('  4. Update generate-state-pages.mjs to link to /ski-report/{id}/ instead of resort websites');
}

main().catch(err => { console.error(err); process.exit(1); });
