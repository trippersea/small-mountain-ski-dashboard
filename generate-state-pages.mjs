#!/usr/bin/env node
// ═══════════════════════════════════════════════════════════════════════════════
// generate-state-pages.mjs
// Generates one static HTML page per state: /ski/{state-slug}/index.html
//
// Usage:
//   node generate-state-pages.mjs
//
// Output: ./public/ski/{state-name}/index.html  (34 files)
//
// Each page is fully server-rendered HTML with:
//  - Unique <title> and meta description targeting "ski mountains in [State]"
//  - JSON-LD for each resort (SportsActivityLocation schema)
//  - A sortable resort table seeded with static data
//  - A "View Live Rankings →" CTA that deep-links into the app with state pre-filtered
//
// SEO strategy: these pages rank for high-volume "best ski mountains in [state]"
// queries and funnel users into the live app for personalized results.
// ═══════════════════════════════════════════════════════════════════════════════

import fs   from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ─── Load resort data from sd-data.js ────────────────────────────────────────
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
function slugifyState(state) {
  const stateNames = {
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
  return stateNames[state] || state.toLowerCase().replace(/\s+/g, '-');
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

function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function passLabel(pg) {
  return { Epic:'Epic Pass', Ikon:'Ikon Pass', Indy:'Indy Pass', Independent:'No Major Pass' }[pg] || pg;
}

// ─── JSON-LD for a single resort ──────────────────────────────────────────────
function resortJsonLd(resort, stateName) {
  return {
    '@context': 'https://schema.org',
    '@type': 'SportsActivityLocation',
    name: resort.name,
    description: `${resort.name} is a ski resort in ${stateName} with ${resort.vertical} ft vertical, ${resort.trails} trails, and a ${passLabel(resort.passGroup)}.`,
    address: { '@type': 'PostalAddress', addressRegion: resort.state, addressCountry: 'US' },
    geo: { '@type': 'GeoCoordinates', latitude: resort.lat, longitude: resort.lon },
    url: resort.website || `https://wheretoskinext.com/report/${resort.id}`,
    priceRange: `$${resort.price} day ticket`,
    aggregateRating: resort.ratingCount > 0 ? {
      '@type': 'AggregateRating',
      ratingValue: resort.rating,
      reviewCount: resort.ratingCount,
      bestRating: 5,
    } : undefined,
  };
}

// ─── Generate HTML for one state page ────────────────────────────────────────
function generateStatePage(stateAbbr, resorts) {
  const stateName  = stateFullName(stateAbbr);
  const stateSlug  = slugifyState(stateAbbr);
  const appUrl     = `https://wheretoskinext.com/?st=${stateAbbr}`;
  const canonUrl   = `https://wheretoskinext.com/ski/${stateSlug}/`;
  const count      = resorts.length;
  const topResorts = [...resorts].sort((a, b) => b.avgSnowfall - a.avgSnowfall).slice(0, 3);
  const topNames   = topResorts.map(r => r.name).join(', ');

  // Sort by avgSnowfall descending for the table (best snow first)
  const sorted = [...resorts].sort((a, b) => b.avgSnowfall - a.avgSnowfall);

  const jsonLdArray = [
    {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: `Best Ski Mountains in ${stateName}`,
      description: `${count} ski mountains in ${stateName} ranked by snow, vertical, and value.`,
      url: canonUrl,
      numberOfItems: count,
      itemListElement: sorted.map((r, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: r.name,
        url: `https://wheretoskinext.com/ski-report/${r.id}/`,
      })),
    },
    ...resorts.map(r => resortJsonLd(r, stateName)),
  ];

  const tableRows = sorted.map(r => `
    <tr>
      <td><a href="/ski-report/${r.id}/">${esc(r.name)}</a></td>
      <td>${r.vertical.toLocaleString()} ft</td>
      <td>${r.trails}</td>
      <td>${r.avgSnowfall}"</td>
      <td>$${r.price}</td>
      <td>${esc(passLabel(r.passGroup))}</td>
      <td>${r.night ? 'Yes' : 'No'}</td>
      <td><a href="https://wheretoskinext.com/?resort=${r.id}" class="view-link">Live data →</a></td>
    </tr>`).join('');

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
  <title>Best Ski Mountains in ${stateName} (${new Date().getFullYear()}) — WhereToSkiNext.com</title>
  <meta name="description" content="${count} ski mountains in ${stateName} ranked by snow, vertical, trails, and price. Live forecasts and drive times at WhereToSkiNext.com." />
  <link rel="canonical" href="${canonUrl}" />
  <meta property="og:title" content="Best Ski Mountains in ${stateName} — WhereToSkiNext.com" />
  <meta property="og:description" content="${count} mountains in ${stateName}. Top picks: ${topNames}. Live snow forecasts, drive times, pass access." />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="${canonUrl}" />
  <meta property="og:image" content="https://wheretoskinext.com/ski-decision-logo.png" />
  <meta name="twitter:card" content="summary_large_image" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;600;700;800&display=swap" rel="stylesheet" />
  <script type="application/ld+json">
  ${JSON.stringify(jsonLdArray, null, 2)}
  </script>
  <style>
    *, *::before, *::after { box-sizing: border-box; }
    body { font-family: 'DM Sans', system-ui, sans-serif; background: #f8fafc; color: #1a2030; margin: 0; line-height: 1.5; }
    a { color: #2b6de9; }
    /* ── Nav ─────────────────────────────────────────────────────────── */
    .top-nav {
      position: sticky; top: 0; z-index: 100;
      backdrop-filter: blur(14px);
      background: rgba(255,255,255,.92);
      border-bottom: 1px solid #d6e1f0;
    }
    .top-nav-inner {
      max-width: 1100px; margin: 0 auto;
      padding: 10px 20px;
      display: flex; align-items: center; gap: 6px;
    }
    .nav-brand-link {
      display: flex; align-items: center; gap: 8px;
      text-decoration: none; margin-right: 4px;
    }
    .nav-logo { width: 30px; height: 30px; border-radius: 6px; }
    .nav-brand { font-weight: 800; font-size: 15px; color: #2b6de9; }
    .nav-divider { width: 1px; height: 16px; background: #d6e1f0; margin: 0 4px; flex-shrink: 0; }
    .nav-link {
      padding: 7px 12px; border-radius: 8px; text-decoration: none;
      color: #1b2a3a; font-weight: 600; font-size: 13px;
      border: 1px solid transparent;
      transition: background .12s, color .12s;
    }
    .nav-link:hover { background: #edf4ff; color: #2b6de9; }
    .nav-link-cta {
      background: #2b6de9; color: #fff !important;
      border-radius: 999px; padding: 7px 16px;
    }
    .nav-link-cta:hover { background: #1d5fd4; }
    .container { max-width: 860px; margin: 0 auto; padding: 40px 20px 80px; }
    h1 { font-size: clamp(24px, 4vw, 38px); font-weight: 800; line-height: 1.1; margin: 0 0 12px; }
    .subhead { font-size: 18px; color: #475569; margin: 0 0 28px; line-height: 1.55; }
    .cta-banner { background: linear-gradient(135deg, #eff6ff, #dbeafe); border: 1.5px solid #bfdbfe; border-radius: 16px; padding: 20px 24px; margin-bottom: 32px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px; }
    .cta-banner h2 { font-size: 18px; font-weight: 800; color: #1e40af; margin: 0 0 4px; }
    .cta-banner p  { margin: 0; font-size: 14px; color: #1d4ed8; }
    .cta-btn { display: inline-flex; align-items: center; gap: 6px; background: #2b6de9; color: #fff; border-radius: 999px; padding: 11px 22px; font-weight: 700; font-size: 15px; text-decoration: none; white-space: nowrap; transition: background .12s; }
    .cta-btn:hover { background: #1d4ed8; color: #fff; }
    .stats { display: flex; flex-wrap: wrap; gap: 12px; margin-bottom: 28px; }
    .stat-chip { background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 10px 16px; font-size: 14px; font-weight: 600; }
    .stat-chip strong { display: block; font-size: 22px; font-weight: 800; color: #1a2030; }
    .table-wrap { overflow-x: auto; border-radius: 14px; border: 1px solid #e2e8f0; background: #fff; }
    table { width: 100%; border-collapse: collapse; font-size: 14px; }
    th { background: #f1f5f9; text-align: left; padding: 12px 14px; font-weight: 700; font-size: 12px; text-transform: uppercase; letter-spacing: .06em; color: #64748b; border-bottom: 1px solid #e2e8f0; white-space: nowrap; }
    td { padding: 11px 14px; border-bottom: 1px solid #f1f5f9; vertical-align: middle; }
    tr:last-child td { border-bottom: none; }
    tr:hover td { background: #f8fafc; }
    .view-link { color: #2b6de9; font-weight: 700; text-decoration: none; white-space: nowrap; }
    .view-link:hover { text-decoration: underline; }
    .nearby-links { margin-top: 40px; }
    .nearby-links h2 { font-size: 20px; font-weight: 800; margin-bottom: 12px; }
    .state-grid { display: flex; flex-wrap: wrap; gap: 8px; }
    .state-link { background: #fff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 8px 14px; font-size: 14px; font-weight: 600; text-decoration: none; color: #1a2030; transition: border-color .12s; }
    .state-link:hover { border-color: #2b6de9; color: #2b6de9; }
    /* ── Footer ── */
    .site-footer {
      text-align: center; padding: 28px 16px;
      font-size: 12px; color: #94a3b8;
      border-top: 1px solid #d6e1f0;
      background: #fff; margin-top: 40px;
    }
    .site-footer a { color: #2b6de9; text-decoration: none; }
    .site-footer a:hover { text-decoration: underline; }
    @media (max-width: 600px) { .cta-banner { flex-direction: column; } }
  </style>
</head>
<body>

<nav class="top-nav" role="navigation" aria-label="Main navigation">
    <div class="top-nav-inner">
      <a href="/" class="nav-brand-link" aria-label="WhereToSkiNext.com home">
        <img src="/ski-decision-logo.png" alt="WhereToSkiNext.com logo" class="nav-logo" width="30" height="30" />
        <span class="nav-brand">WhereToSkiNext.com</span>
      </a>
      <div class="nav-divider"></div>
      <a href="/" class="nav-link">Find My Mountain</a>
      <a href="/ski/${slugifyState(stateAbbr)}/" class="nav-link">${stateName} Mountains</a>
      <a href="/about/" class="nav-link">About</a>
      <a href="/partners/" class="nav-link">Partners</a>
      <div class="nav-divider"></div>
      <a href="${esc(appUrl)}" class="nav-link nav-link-cta">Find My Mountain →</a>
    </div>
  </nav>

<div class="container">

  <h1>Best Ski Mountains in ${stateName}</h1>
  <p class="subhead">
    ${count} ski mountain${count !== 1 ? 's' : ''} in ${stateName} — ranked by snow history, vertical drop, and value.
    Get live forecasts and personalized drive-time rankings in the app.
  </p>

  <div class="cta-banner">
    <div>
      <h2>See live snow forecasts for ${stateName} mountains</h2>
      <p>Real-time rankings updated daily with forecast snow, drive times, crowd outlook, and pass access.</p>
    </div>
    <a href="${esc(appUrl)}" class="cta-btn">Open Live Rankings →</a>
  </div>

  <div class="stats">
    <div class="stat-chip"><strong>${count}</strong> Mountains</div>
    <div class="stat-chip"><strong>${resorts.filter(r => r.passGroup === 'Epic').length}</strong> Epic Pass</div>
    <div class="stat-chip"><strong>${resorts.filter(r => r.passGroup === 'Ikon').length}</strong> Ikon Pass</div>
    <div class="stat-chip"><strong>${resorts.filter(r => r.passGroup === 'Indy').length}</strong> Indy Pass</div>
    <div class="stat-chip"><strong>${resorts.filter(r => r.night).length}</strong> Night Skiing</div>
    <div class="stat-chip"><strong>${Math.round(resorts.reduce((s,r) => s + r.avgSnowfall, 0) / count)}"</strong> Avg Annual Snow</div>
  </div>

  <div class="table-wrap">
    <table>
      <thead>
        <tr>
          <th>Mountain</th>
          <th>Vertical</th>
          <th>Trails</th>
          <th>Avg Snow/yr</th>
          <th>Day Ticket*</th>
          <th>Pass</th>
          <th>Night Skiing</th>
          <th>Live Data</th>
        </tr>
      </thead>
      <tbody>
        ${tableRows}
      </tbody>
    </table>
  </div>
  <p style="font-size:12px;color:#94a3b8;margin-top:8px">*Ticket prices vary by date, demand, and age. Verify with the mountain before purchasing.</p>

  <div class="nearby-links">
    <h2>Explore other states</h2>
    <div class="state-grid">
      ${['CT','MA','ME','NH','VT','NY','NJ','PA','RI','CO','UT','WA','OR','CA','ID','MT','WY']
        .filter(s => s !== stateAbbr)
        .map(s => `<a href="/ski/${slugifyState(s)}/" class="state-link">${stateFullName(s)}</a>`)
        .join('')}
    </div>
  </div>

</div>

<footer class="site-footer">
  <p>© 2026 WhereToSkiNext.com &mdash; <a href="/">Find My Mountain</a> &middot; <a href="/about/">About</a> &middot; <a href="/privacy/">Privacy Policy</a> &middot; <a href="/partners/">Partners</a></p>
</footer>

</body>
</html>`;
}

// ─── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  const resorts  = loadResorts();
  console.log(`Loaded ${resorts.length} resorts`);

  // Group by state
  const byState = {};
  resorts.forEach(r => {
    if (!byState[r.state]) byState[r.state] = [];
    byState[r.state].push(r);
  });

  const states   = Object.keys(byState).sort();
  const outDir   = path.join(__dirname, 'public', 'ski');
  let generated  = 0;

  for (const stateAbbr of states) {
    const stateResorts = byState[stateAbbr];
    if (stateResorts.length === 0) continue;

    const stateSlug = slugifyState(stateAbbr);
    const dir       = path.join(outDir, stateSlug);
    fs.mkdirSync(dir, { recursive: true });

    const html = generateStatePage(stateAbbr, stateResorts);
    fs.writeFileSync(path.join(dir, 'index.html'), html, 'utf8');

    console.log(`  ✓ /ski/${stateSlug}/ — ${stateResorts.length} mountains`);
    generated++;
  }

  console.log(`\n✓ Generated ${generated} state pages in ./public/ski/`);
  console.log(`\nNext steps:`);
  console.log(`  1. Add to Vercel: configure "public" as output directory`);
  console.log(`  2. Submit /ski/* to Google Search Console sitemap`);
  console.log(`  3. Add a sitemap.xml listing all /ski/{state}/ URLs`);
  console.log(`  4. Run "node generate-state-pages.mjs" in your build step`);
}

main().catch(err => { console.error(err); process.exit(1); });
