#!/usr/bin/env node
// ─────────────────────────────────────────────────────────────────────────────
// fix-state-pages.mjs
// Regenerates specific state pages cleanly into ski/{state}/index.html
// then re-applies any active sponsor ads from featured-partners.js.
//
// Usage: node fix-state-pages.mjs
// ─────────────────────────────────────────────────────────────────────────────

import fs   from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const _require  = createRequire(import.meta.url);
const vm        = _require('vm');

// ─── States to fix — add or remove as needed ──────────────────────────────────
const STATES_TO_FIX = ['MA', 'NH'];

// ─── Load resort data ─────────────────────────────────────────────────────────
function loadResorts() {
  const sdData = fs.readFileSync(path.join(__dirname, 'sd-data.js'), 'utf8');
  const neCtx  = {};
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

// ─── Load featured-partners.js ────────────────────────────────────────────────
function loadPartners() {
  const ctx  = {};
  const code = fs.readFileSync(path.join(__dirname, 'featured-partners.js'), 'utf8');
  vm.runInNewContext(code, ctx);
  return { STATE_ADS: ctx.STATE_ADS || {}, FEATURED_PARTNERS: ctx.FEATURED_PARTNERS || {} };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
function passLabel(pg) {
  return { Epic:'Epic Pass', Ikon:'Ikon Pass', Indy:'Indy Pass', Independent:'No Major Pass' }[pg] || pg;
}
function slugifyState(state) {
  const m = { AL:'alabama',AK:'alaska',AZ:'arizona',AR:'arkansas',CA:'california',CO:'colorado',CT:'connecticut',DE:'delaware',FL:'florida',GA:'georgia',HI:'hawaii',ID:'idaho',IL:'illinois',IN:'indiana',IA:'iowa',KS:'kansas',KY:'kentucky',LA:'louisiana',ME:'maine',MD:'maryland',MA:'massachusetts',MI:'michigan',MN:'minnesota',MS:'mississippi',MO:'missouri',MT:'montana',NE:'nebraska',NV:'nevada',NH:'new-hampshire',NJ:'new-jersey',NM:'new-mexico',NY:'new-york',NC:'north-carolina',ND:'north-dakota',OH:'ohio',OK:'oklahoma',OR:'oregon',PA:'pennsylvania',RI:'rhode-island',SC:'south-carolina',SD:'south-dakota',TN:'tennessee',TX:'texas',UT:'utah',VT:'vermont',VA:'virginia',WA:'washington',WV:'west-virginia',WI:'wisconsin',WY:'wyoming' };
  return m[state] || state.toLowerCase().replace(/\s+/g,'-');
}
function stateFullName(abbr) {
  const m = { AL:'Alabama',AK:'Alaska',AZ:'Arizona',AR:'Arkansas',CA:'California',CO:'Colorado',CT:'Connecticut',DE:'Delaware',FL:'Florida',GA:'Georgia',HI:'Hawaii',ID:'Idaho',IL:'Illinois',IN:'Indiana',IA:'Iowa',KS:'Kansas',KY:'Kentucky',LA:'Louisiana',ME:'Maine',MD:'Maryland',MA:'Massachusetts',MI:'Michigan',MN:'Minnesota',MS:'Mississippi',MO:'Missouri',MT:'Montana',NE:'Nebraska',NV:'Nevada',NH:'New Hampshire',NJ:'New Jersey',NM:'New Mexico',NY:'New York',NC:'North Carolina',ND:'North Dakota',OH:'Ohio',OK:'Oklahoma',OR:'Oregon',PA:'Pennsylvania',RI:'Rhode Island',SC:'South Carolina',SD:'South Dakota',TN:'Tennessee',TX:'Texas',UT:'Utah',VT:'Vermont',VA:'Virginia',WA:'Washington',WV:'West Virginia',WI:'Wisconsin',WY:'Wyoming' };
  return m[abbr] || abbr;
}

// ─── Sponsor ad HTML ──────────────────────────────────────────────────────────
const AD_CSS = `
    /* ── State page sponsor ad ── */
    .state-sponsor-ad { display:flex; align-items:center; justify-content:space-between; gap:14px; flex-wrap:wrap; padding:14px 18px; margin:0 0 18px; border:1px solid #bfdbfe; border-radius:12px; background:#edf4ff; }
    .state-sponsor-copy { display:flex; flex-direction:column; gap:3px; }
    .state-sponsor-label { font-size:10px; font-weight:700; text-transform:uppercase; letter-spacing:.08em; color:#185FA5; }
    .state-sponsor-headline { font-size:14px; font-weight:700; color:#0C447C; }
    .state-sponsor-tagline { font-size:12px; color:#185FA5; }
    .state-sponsor-btn { background:#2b6de9; color:#fff !important; font-size:13px; font-weight:700; padding:9px 20px; border-radius:999px; text-decoration:none; white-space:nowrap; transition:background .12s; flex-shrink:0; }
    .state-sponsor-btn:hover { background:#1d5fd4; }`;

function buildAdHtml(ad) {
  return `
  <!-- State Sponsor Ad -->
  <div class="state-sponsor-ad">
    <div class="state-sponsor-copy">
      <span class="state-sponsor-label">Sponsored</span>
      <div class="state-sponsor-headline">${esc(ad.headline)}</div>
      <div class="state-sponsor-tagline">${esc(ad.tagline)}</div>
    </div>
    <a href="${esc(ad.ctaUrl)}" class="state-sponsor-btn" target="_blank" rel="noopener noreferrer sponsored">${esc(ad.ctaText)}</a>
  </div>`;
}

// ─── Featured partner row CSS + HTML ─────────────────────────────────────────
const FEATURED_CSS = `
    /* ── Featured partner row ── */
    tr.featured-partner-row td { background:#edf4ff; border-bottom:1px solid #bfdbfe; }
    tr.featured-partner-row td:first-child { border-left:3px solid #2b6de9; }
    .featured-badge { display:inline-block; background:#2b6de9; color:#fff; font-size:10px; font-weight:700; letter-spacing:.04em; padding:2px 7px; border-radius:999px; margin-left:7px; vertical-align:middle; }
    .featured-booking-link { display:inline-block; background:#2b6de9; color:#fff !important; font-size:12px; font-weight:700; padding:5px 12px; border-radius:999px; text-decoration:none; white-space:nowrap; transition:background .12s; }
    .featured-booking-link:hover { background:#1d5fd4; }`;

function buildFeaturedRow(resort, sponsor) {
  return `
        <tr class="featured-partner-row" data-featured-id="${resort.id}">
          <td><a href="/ski-report/${resort.id}/" style="font-weight:700;color:#1a2030;text-decoration:none">${esc(resort.name)}</a><span class="featured-badge">Featured</span>${sponsor.tagline ? `<div style="font-size:11px;color:#64748b;margin-top:3px">${esc(sponsor.tagline)}</div>` : ''}</td>
          <td>${resort.vertical.toLocaleString()} ft</td>
          <td>${resort.trails}</td>
          <td>${resort.avgSnowfall}"</td>
          <td>$${resort.price}</td>
          <td>${esc(passLabel(resort.passGroup))}</td>
          <td>${resort.night ? 'Yes' : 'No'}</td>
          <td><a href="${esc(sponsor.bookingUrl)}" class="featured-booking-link" target="_blank" rel="noopener noreferrer">Book →</a></td>
        </tr>`;
}

// ─── Generate clean state page HTML ───────────────────────────────────────────
function generateStatePage(stateAbbr, resorts) {
  const stateName = stateFullName(stateAbbr);
  const stateSlug = slugifyState(stateAbbr);
  const appUrl    = `https://wheretoskinext.com/?st=${stateAbbr}`;
  const canonUrl  = `https://wheretoskinext.com/ski/${stateSlug}/`;
  const count     = resorts.length;
  const sorted    = [...resorts].sort((a, b) => b.avgSnowfall - a.avgSnowfall);
  const topNames  = sorted.slice(0, 3).map(r => r.name).join(', ');

  const jsonLdArray = [
    { '@context':'https://schema.org', '@type':'ItemList', name:`Best Ski Mountains in ${stateName}`, description:`${count} ski mountains in ${stateName} ranked by snow, vertical, and value.`, url:canonUrl, numberOfItems:count, itemListElement:sorted.map((r,i) => ({ '@type':'ListItem', position:i+1, name:r.name, url:`https://wheretoskinext.com/ski-report/${r.id}/` })) },
    ...resorts.map(r => ({ '@context':'https://schema.org', '@type':'SportsActivityLocation', name:r.name, address:{ '@type':'PostalAddress', addressRegion:r.state, addressCountry:'US' }, geo:{ '@type':'GeoCoordinates', latitude:r.lat, longitude:r.lon }, url:r.website || `https://wheretoskinext.com/ski-report/${r.id}/`, priceRange:`$${r.price} day ticket` })),
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

  const otherStates = ['CT','MA','ME','NH','VT','NY','NJ','PA','RI','CO','UT','WA','OR','CA','ID','MT','WY']
    .filter(s => s !== stateAbbr)
    .map(s => `<a href="/ski/${slugifyState(s)}/" class="state-link">${stateFullName(s)}</a>`)
    .join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <!-- Google Tag Manager -->
  <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-MCCDNQGB');</script>
  <!-- End Google Tag Manager -->
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Best Ski Mountains in ${stateName} (${new Date().getFullYear()}) — WhereToSkiNext</title>
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
    nav { background: #1a2030; padding: 12px 24px; display: flex; align-items: center; gap: 16px; }
    nav a { color: #fff; text-decoration: none; font-weight: 700; font-size: 18px; }
    nav .nav-sub { color: #94a3b8; font-size: 14px; }
    .nav-links { display: flex; align-items: center; gap: 16px; margin-left: auto; }
    .nav-links a { font-size: 14px; font-weight: 600; color: #94a3b8; }
    .nav-links a:hover { color: #fff; }
    .nav-links .nav-cta { background: #2b6de9; color: #fff !important; padding: 6px 14px; border-radius: 999px; font-size: 13px; }
    .container { max-width: 1100px; margin: 0 auto; padding: 32px 16px 64px; }
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
    footer { text-align: center; padding: 32px 16px; font-size: 13px; color: #94a3b8; }
    footer a { color: #2b6de9; }
    @media (max-width: 600px) { .cta-banner { flex-direction: column; } .nav-links { display: none; } }
  </style>
</head>
<body>
  <!-- GTM noscript -->
  <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-MCCDNQGB" height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>

  <nav>
    <a href="/">
      <img src="/ski-decision-logo.png" alt="WhereToSkiNext.com logo" width="28" height="28" style="vertical-align:middle;margin-right:8px" />
      WhereToSkiNext.com
    </a>
    <span class="nav-sub">/ ${stateName} Mountains</span>
    <div class="nav-links">
      <a href="/about/">About</a>
      <a href="/partners/">Partners</a>
      <a href="${esc(appUrl)}" class="nav-cta">Find My Mountain →</a>
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
      <div class="state-grid">${otherStates}</div>
    </div>

  </div>

  <footer>
    <p>© ${new Date().getFullYear()} WhereToSkiNext.com — <a href="/">Find My Mountain</a> · <a href="/about/">About</a> · <a href="/privacy/">Privacy Policy</a> · <a href="/partners/">Partners</a></p>
  </footer>

</body>
</html>`;
}

// ─── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  const resorts  = loadResorts();
  const { STATE_ADS, FEATURED_PARTNERS } = loadPartners();
  console.log(`Loaded ${resorts.length} resorts`);

  const byState = {};
  resorts.forEach(r => {
    if (!byState[r.state]) byState[r.state] = [];
    byState[r.state].push(r);
  });

  const resortMap = new Map(resorts.map(r => [r.id, r]));

  for (const stateAbbr of STATES_TO_FIX) {
    const stateResorts = byState[stateAbbr];
    if (!stateResorts?.length) {
      console.warn(`  ⚠️  No resorts found for ${stateAbbr} — skipping`);
      continue;
    }

    const stateSlug = slugifyState(stateAbbr);
    const dir       = path.join(__dirname, 'ski', stateSlug);
    fs.mkdirSync(dir, { recursive: true });

    let html = generateStatePage(stateAbbr, stateResorts);

    // ── Apply sponsor ad if configured ────────────────────────────────────────
    const ad = STATE_ADS[stateSlug];
    if (ad) {
      html = html.replace('</style>', AD_CSS + '\n  </style>');
      html = html.replace('<table', buildAdHtml(ad) + '\n  <table');
      console.log(`  ✓ Ad injected for ${stateSlug}`);
    }

    // ── Apply featured partner rows if any resort in this state is a partner ──
    const featuredForState = stateResorts
      .filter(r => FEATURED_PARTNERS[r.id])
      .map(r => ({ resort: r, sponsor: FEATURED_PARTNERS[r.id] }));

    if (featuredForState.length) {
      html = html.replace('</style>', FEATURED_CSS + '\n  </style>');
      const featuredRows = featuredForState.map(({ resort, sponsor }) => buildFeaturedRow(resort, sponsor)).join('');
      html = html.replace('<tbody>', `<tbody>${featuredRows}`);
      const names = featuredForState.map(x => x.resort.name).join(', ');
      console.log(`  ✓ Featured row(s) injected: ${names}`);
    }

    fs.writeFileSync(path.join(dir, 'index.html'), html, 'utf8');
    console.log(`  ✓ Regenerated: ski/${stateSlug}/index.html`);
  }

  console.log(`\n✅ Done. Commit and push to deploy.`);
}

main().catch(err => { console.error(err); process.exit(1); });
