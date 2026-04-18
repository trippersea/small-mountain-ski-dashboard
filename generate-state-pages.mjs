#!/usr/bin/env node
// ═══════════════════════════════════════════════════════════════════════════════
// generate-state-pages.mjs
// Generates all state listing pages into ski/{state}/index.html
//
// Replaces both the old generate-state-pages.mjs AND fix-state-pages.mjs.
// This is the ONLY script you need for state pages going forward.
//
// HOW TO USE:
//   Run after any change to featured-partners.js, or any resort data update.
//   node generate-state-pages.mjs
// Links /styles.css, /ski-pass-comparison/pass-comparison-page.css, /ski/state-page.css (dark system + state layout).
//   Commit and push; Vercel auto-deploys.
//
// WHAT IT DOES:
//   1. Loads all resort data from sd-data.js + resorts-national.js
//   2. Loads featured-partners.js for sponsor ads + featured partner rows
//   3. Generates a clean, correctly styled page for every state with resorts
//   4. Injects sponsor ad card if STATE_ADS entry exists for that state
//   5. Injects featured partner row(s) if FEATURED_PARTNERS entry exists
//
// No manual state list needed — it derives states from resort data automatically.
// ═══════════════════════════════════════════════════════════════════════════════

import fs   from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const _require  = createRequire(import.meta.url);
const vm        = _require('vm');

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

// ─── Load featured-partners.js (single source of truth) ──────────────────────
function loadPartners() {
  const ctx  = {};
  const code = fs.readFileSync(path.join(__dirname, 'featured-partners.js'), 'utf8');
  vm.runInNewContext(code, ctx);
  return {
    STATE_ADS:         ctx.STATE_ADS         || {},
    FEATURED_PARTNERS: ctx.FEATURED_PARTNERS || {},
  };
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
  const m = {
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
  return m[state] || state.toLowerCase().replace(/\s+/g, '-');
}
function stateFullName(abbr) {
  const m = {
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
  return m[abbr] || abbr;
}

// ── Pass comparison page by state ─────────────────────────────────────────────
function passCompPage(state) {
  const map = {
    CT:'epic-vs-ikon-northeast', MA:'epic-vs-ikon-northeast',
    ME:'epic-vs-ikon-northeast', NH:'epic-vs-ikon-northeast',
    NJ:'epic-vs-ikon-northeast', NY:'epic-vs-ikon-northeast',
    PA:'epic-vs-ikon-northeast', RI:'epic-vs-ikon-northeast',
    VT:'epic-vs-ikon-northeast',
    CO:'epic-vs-ikon-rockies',   MT:'epic-vs-ikon-rockies',
    WY:'epic-vs-ikon-rockies',   NM:'epic-vs-ikon-rockies',
    UT:'epic-vs-ikon-rockies',
    CA:'epic-vs-ikon-california',NV:'epic-vs-ikon-california',
    AZ:'epic-vs-ikon-california',
    OR:'epic-vs-ikon-pacific-northwest',
    WA:'epic-vs-ikon-pacific-northwest',
    AK:'epic-vs-ikon-pacific-northwest',
    ID:'epic-vs-ikon-pacific-northwest',
    MI:'epic-vs-ikon-midwest',   WI:'epic-vs-ikon-midwest',
    MN:'epic-vs-ikon-midwest',   OH:'epic-vs-ikon-midwest',
    IN:'epic-vs-ikon-midwest',   IL:'epic-vs-ikon-midwest',
    IA:'epic-vs-ikon-midwest',   MO:'epic-vs-ikon-midwest',
  };
  return map[state] || null;
}
function passCompLabel(state) {
  const map = {
    CT:'Northeast', MA:'Northeast', ME:'Northeast', NH:'Northeast',
    NJ:'Northeast', NY:'Northeast', PA:'Northeast', RI:'Northeast', VT:'Northeast',
    CO:'Rockies', MT:'Rockies', WY:'Rockies', NM:'Rockies', UT:'Rockies',
    CA:'California', NV:'California', AZ:'California',
    OR:'Pacific Northwest', WA:'Pacific Northwest', AK:'Pacific Northwest', ID:'Pacific Northwest',
    MI:'Midwest', WI:'Midwest', MN:'Midwest', OH:'Midwest',
    IN:'Midwest', IL:'Midwest', IA:'Midwest', MO:'Midwest',
  };
  return map[state] || '';
}



// ─── Sponsor ad HTML (styling: /ski/state-page.css) ───────────────────────────

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

// ─── Featured partner row (styling: /ski/state-page.css) ──────────────────────

function buildFeaturedRow(resort, sponsor) {
  return `
        <tr class="sp-featured-row" data-featured-id="${resort.id}">
          <td><a href="/ski-report/${resort.id}/">${esc(resort.name)}</a><span class="sp-featured-badge">Featured</span>${sponsor.tagline ? `<div class="sp-featured-tagline">${esc(sponsor.tagline)}</div>` : ''}</td>
          <td>${resort.vertical.toLocaleString()} ft</td>
          <td>${resort.trails}</td>
          <td>${resort.avgSnowfall}"</td>
          <td>$${resort.price}</td>
          <td>${esc(passLabel(resort.passGroup))}</td>
          <td>${resort.night ? 'Yes' : 'No'}</td>
          <td><a href="${esc(sponsor.bookingUrl)}" class="sp-featured-book" target="_blank" rel="noopener noreferrer">Book &rarr;</a></td>
        </tr>`;
}

// ─── State editorial blurbs (SEO + scanability; fallback is generic) ─────────
const STATE_GUIDE_BLURBS = {
  NH: 'New Hampshire packs strong New England variety across Epic, Ikon, Indy, and independent areas. Cannon, Wildcat, Waterville, Bretton Woods, and Loon are standouts. The state works well for weekend trips and day missions from Boston and southern New England.',
  VT: 'Vermont is dense with classic Northeast skiing, from big-name resorts to smaller Indy favorites. Expect a strong mix of vertical, snow quality, and pass overlap across the spine of the Greens.',
  ME: 'Maine blends coastal proximity with interior snow and serious vertical at a few flagship resorts. Good pick when you want Northeast trips with a different rhythm than southern New England.',
  MA: 'Massachusetts keeps day-trip skiing within reach of Boston and the I-95 corridor. Expect smaller verticals on average, with a few larger hubs anchoring the state.',
  CT: 'Connecticut offers compact ski areas that punch above their size for quick turns. Useful when you want close-to-home laps without a long haul.',
  RI: 'Rhode Island keeps skiing minimal but real: think short drives and small hills when you need snow time without a road trip.',
  NY: 'New York spans true big-mountain destinations and smaller community hills from the Adirondacks to the Catskills. Pass overlap is common, so compare coverage before you commit.',
  NJ: 'New Jersey skiing is about convenience and quick sessions. Use the table to spot vertical, snow, and ticket value before you head out.',
  PA: 'Pennsylvania mixes Poconos favorites with western PA options. Crowds and conditions swing by region, so the full list helps you line up the right trip.',
  CO: 'Colorado sets the bar for variety: destination resorts, big vertical, and strong pass networks. Use this list to compare snow history and ticket pressure, then lean on live rankings for trip week specifics.',
  UT: 'Utah pairs dry snow with a deep bench of resorts along the Wasatch and beyond. Great state to compare pass coverage and drive-time tradeoffs before you lock a trip.',
  CA: 'California runs from Sierra power to smaller coastal and Southern California spots. Snow and access vary wildly by region, so the statewide view keeps comparisons honest.',
  WY: 'Wyoming includes some of the biggest skiing in the country alongside quieter gems. Vertical and exposure can be serious, so match the mountain to your comfort level.',
  MT: 'Montana mixes legendary big-mountain skiing with smaller community favorites. Snow quality and travel time often drive the decision more than trail count alone.',
  ID: 'Idaho rewards skiers who like steeps, snow, and fewer crowds than some neighboring states. Compare pass coverage and night options before you choose a home base.',
  WA: 'Washington delivers PNW snow with a wide spread of sizes and access patterns. Pay attention to elevation and typical snow when you compare areas side by side.',
  OR: 'Oregon blends volcanoes, Cascade snow, and a strong Indy scene depending on where you look. The table helps you line up vertical, passes, and night skiing in one pass.',
  MI: 'Michigan spreads skiing across the Upper Peninsula and Lower Peninsula with a strong Midwest pass mix. Vertical is modest at many areas, but snowmaking and consistency matter.',
  MN: 'Minnesota skiing is about cold-weather reliability and family-friendly pacing. Compare ticket value and night skiing when you plan weeknight laps.',
  WI: 'Wisconsin mixes small and mid-size areas that shine for quick trips. Use the list to spot pass fit and night options without guesswork.',
  AZ: 'Arizona offers high-elevation snow in the northern part of the state with a different rhythm than Rocky Mountain mega-resorts. Great when you want desert proximity with real turns.',
  NV: 'Nevada skiing often means Lake Tahoe access and high Sierra conditions. Compare passes and ticket pressure alongside snow history before you book.',
  NM: 'New Mexico serves dry snow and big-sky days with a smaller resort count. Vertical and exposure can surprise first-time visitors in a good way.',
  AK: 'Alaska delivers serious terrain and snow when you are ready to travel for it. Use the table to anchor facts, then lean on live forecasts when you plan logistics.',
};

function stateGuideBlurb(stateAbbr, stateName, count, topNames) {
  if (STATE_GUIDE_BLURBS[stateAbbr]) return STATE_GUIDE_BLURBS[stateAbbr];
  return `${count} ski areas across ${stateName}, from local hills to larger destinations. Notable names include ${topNames}. Skim vertical, snow history, ticket price, and pass access in the table, then open live rankings for forecast snow, drive time, and crowd context in one place.`;
}

function buildQuickChips(stateAbbr, resorts) {
  if (!resorts.length) return [];
  const byVert = [...resorts].sort((a, b) => b.vertical - a.vertical)[0];
  const indyCount = resorts.filter(r => r.passGroup === 'Indy').length;
  const nightCount = resorts.filter(r => r.night).length;
  const chips = [];
  chips.push(`Biggest vertical: ${byVert.name} (${byVert.vertical.toLocaleString()} ft)`);
  if (indyCount > 0) {
    chips.push(`${indyCount} Indy Pass ${indyCount === 1 ? 'mountain' : 'mountains'}`);
  }
  if (nightCount > 0) {
    chips.push(`Night skiing at ${nightCount} ${nightCount === 1 ? 'area' : 'areas'}`);
  }
  const regional = {
    NH: 'Strong weekend variety from Boston and southern New England',
    VT: 'Tight map of classic Northeast resorts',
    ME: 'Great when you want northern New England trips',
    CO: 'Destination-level depth and pass overlap',
    UT: 'Wasatch access and dry-snow upside',
    CA: 'Regional variety from Sierra to smaller spots',
  };
  if (regional[stateAbbr]) chips.push(regional[stateAbbr]);
  return chips.slice(0, 5);
}

// ─── Generate one state page ───────────────────────────────────────────────────
function generateStatePage(stateAbbr, resorts, otherStatesHtml) {
  const stateName  = stateFullName(stateAbbr);
  const stateSlug  = slugifyState(stateAbbr);
  const rankingsUrl = `https://www.wheretoskinext.com/?st=${stateAbbr}#compareSection`;
  const finderUrl   = `https://www.wheretoskinext.com/?st=${stateAbbr}#searchSection`;
  const canonUrl   = `https://www.wheretoskinext.com/ski/${stateSlug}/`;
  const count      = resorts.length;
  const sorted     = [...resorts].sort((a, b) => b.avgSnowfall - a.avgSnowfall);
  const topNames   = sorted.slice(0, 3).map(r => r.name).join(', ');
  const year       = new Date().getFullYear();

  const epicCount  = resorts.filter(r => r.passGroup === 'Epic').length;
  const ikonCount  = resorts.filter(r => r.passGroup === 'Ikon').length;
  const indyCount  = resorts.filter(r => r.passGroup === 'Indy').length;
  const nightCount = resorts.filter(r => r.night).length;
  const avgSnow    = Math.round(resorts.reduce((s, r) => s + r.avgSnowfall, 0) / count);

  const jsonLdArray = [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'WhereToSkiNext', item: 'https://www.wheretoskinext.com/' },
        { '@type': 'ListItem', position: 2, name: `Ski mountains in ${stateName}`, item: canonUrl },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: `Best Ski Mountains in ${stateName}`,
      description: `${count} ski mountains in ${stateName} ranked by snow, vertical, and value.`,
      url: canonUrl,
      numberOfItems: count,
      itemListElement: sorted.map((r, i) => ({
        '@type': 'ListItem', position: i + 1, name: r.name,
        url: `https://www.wheretoskinext.com/ski-report/${r.id}/`,
      })),
    },
    ...resorts.map(r => ({
      '@context': 'https://schema.org',
      '@type': 'SportsActivityLocation',
      name: r.name,
      address: { '@type': 'PostalAddress', addressRegion: r.state, addressCountry: 'US' },
      geo: { '@type': 'GeoCoordinates', latitude: r.lat, longitude: r.lon },
      url: r.website || `https://www.wheretoskinext.com/ski-report/${r.id}/`,
      priceRange: `$${r.price} day ticket`,
    })),
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
      <td><a href="https://www.wheretoskinext.com/?resort=${r.id}" class="sp-live-link">Open live data &rarr;</a></td>
    </tr>`).join('');

  const compPage = passCompPage(stateAbbr);
  const compLabel = passCompLabel(stateAbbr);
  const passCallout = compPage && (epicCount + ikonCount > 0) ? `
        <div class="sp-pass-guide">
          <div>
            <div class="sp-pass-guide-kicker">Pass guide</div>
            <h2>Epic Pass vs Ikon Pass: ${compLabel}</h2>
            <p>${epicCount} Epic Pass and ${ikonCount} Ikon Pass ${ikonCount !== 1 ? 'mountains' : 'mountain'} in ${stateName}. Compare coverage and side-by-side value before you buy.</p>
          </div>
          <a href="/${compPage}/" class="pp-btn pp-btn--primary">Compare passes &rarr;</a>
        </div>` : '';

  const editorial = stateGuideBlurb(stateAbbr, stateName, count, topNames);
  const quickChips = buildQuickChips(stateAbbr, resorts);
  const quickChipsHtml = quickChips.length
    ? `<section class="sp-quick" aria-label="State snapshot">${quickChips.map(c => `<span class="sp-quick-chip">${esc(c)}</span>`).join('')}</section>`
    : '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <!-- Google Tag Manager -->
  <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-MCCDNQGB');</script>
  <!-- End Google Tag Manager -->
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Best Ski Mountains in ${stateName} (${year}) | WhereToSkiNext</title>
  <meta name="description" content="${count} ski mountains in ${stateName} ranked by snow, vertical, trails, and price. Live forecasts and drive times at WhereToSkiNext.com." />
  <link rel="canonical" href="${canonUrl}" />
  <meta property="og:title" content="Best Ski Mountains in ${stateName} | WhereToSkiNext.com" />
  <meta property="og:description" content="${count} mountains in ${stateName}. Top picks: ${topNames}. Stop guessing. Start skiing." />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="${canonUrl}" />
  <meta property="og:image" content="https://www.wheretoskinext.com/og-image.png" />
  <meta name="twitter:card" content="summary_large_image" />
  <link rel="icon" href="/ski-decision-logo.svg" type="image/svg+xml" />
  <link rel="preload" href="/hero-bg.jpg" as="image" type="image/jpeg" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Newsreader:ital,opsz,wght@0,8..60,400;0,8..60,600;0,8..60,700&display=swap" rel="stylesheet" media="print" onload="this.media='all'" />
  <noscript><link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Newsreader:ital,opsz,wght@0,8..60,400;0,8..60,600;0,8..60,700&display=swap" rel="stylesheet" /></noscript>
  <link rel="preload" href="/styles.css" as="style" />
  <link rel="stylesheet" href="/styles.css" />
  <link rel="stylesheet" href="/ski-pass-comparison/pass-comparison-page.css" />
  <link rel="stylesheet" href="/ski/state-page.css" />
  <script type="application/ld+json">
  ${JSON.stringify(jsonLdArray, null, 2)}
  </script>
</head>
<body class="pass-page-body state-page">
  <!-- GTM noscript -->
  <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-MCCDNQGB" height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>

  <nav class="top-nav" role="navigation" aria-label="Main navigation">
    <div class="top-nav-inner">
      <a href="/" class="nav-brand-link" aria-label="WhereToSkiNext.com home">
        <img src="/ski-decision-logo.svg" alt="WhereToSkiNext.com logo" class="nav-logo" width="30" height="30" />
        <span class="nav-brand">
          <span class="nav-brand-name">WhereToSki<span class="nav-brand-next">Next</span>.com</span>
          <span class="nav-brand-tag">Stop guessing. Start skiing.</span>
        </span>
      </a>
      <div class="nav-divider"></div>
      <a href="/about/" class="nav-primary">About</a>
      <span class="nav-link-sep" aria-hidden="true"></span>
      <a href="/ski-pass-comparison/" class="nav-primary">Pass Guides</a>
      <a href="${esc(finderUrl)}" class="nav-find-cta">Find my mountain &rarr;</a>
    </div>
  </nav>

  <main class="pp-shell sp-page">

    <nav class="sp-breadcrumb" aria-label="Breadcrumb">
      <a href="/">Home</a>
      <span class="sp-breadcrumb-sep">/</span>
      <span>${esc(stateName)} ski mountains</span>
    </nav>

    <header class="sp-hero">
      <div class="sp-hero-inner">
        <div class="sp-hero-grid">
          <div>
            <p class="sp-eyebrow">State ski guide</p>
            <h1 class="sp-title">Best Ski Mountains in ${stateName}</h1>
            <p class="sp-lede">A ranked list of ${count} ski ${count !== 1 ? 'areas' : 'area'} with snow history, vertical, trails, and ticket context. Use this page as your ${stateName} guide, then open the app when you want live forecast, drive time, pass access, and crowd signals in one ranking.</p>
            <div class="sp-hero-cta">
              <a href="${esc(rankingsUrl)}" class="sp-btn sp-btn--primary">Open live rankings</a>
              <a href="${esc(finderUrl)}" class="sp-btn sp-btn--ghost">Find my mountain</a>
            </div>
            <p class="sp-hero-trust">Live forecast, drive time, pass access, and crowds in one ranking. Compare the best mountains in ${stateName}, then find your best fit when you are ready.</p>
          </div>
          <div class="sp-hero-aside">
            <div class="sp-metric-grid">
              <div class="sp-metric"><strong>${count}</strong><span>Mountains</span></div>
              <div class="sp-metric"><strong>${epicCount}</strong><span>Epic Pass</span></div>
              <div class="sp-metric"><strong>${ikonCount}</strong><span>Ikon Pass</span></div>
              <div class="sp-metric"><strong>${indyCount}</strong><span>Indy Pass</span></div>
              <div class="sp-metric"><strong>${nightCount}</strong><span>Night skiing</span></div>
              <div class="sp-metric"><strong>${avgSnow}"</strong><span>Avg annual snow</span></div>
            </div>
            ${passCallout}
          </div>
        </div>
      </div>
    </header>

    <section class="sp-summary">
      <h2>How ${esc(stateName)} stacks up</h2>
      <p>${esc(editorial)}</p>
    </section>

    ${quickChipsHtml}

    <div class="sp-table-wrap">
      <table class="sp-table">
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
    <p class="sp-disclaimer">*Ticket prices vary by date, demand, and age. Verify with the mountain before purchasing.</p>

    <section class="sp-explore">
      <h2>Explore other states</h2>
      <div class="sp-state-grid">${otherStatesHtml}</div>
      <div class="sp-explore-foot">
        <a href="/ski-pass-comparison/">Compare Epic Pass vs Ikon Pass by region &rarr;</a>
      </div>
    </section>

  </main>

  <footer class="site-footer">
    <p>&copy; ${year} WhereToSkiNext.com &middot; <a href="/#searchSection">Find my mountain</a> &middot; <a href="/about/">About</a> &middot; <a href="/privacy/">Privacy Policy</a> &middot; <a href="/partners/">Partners</a></p>
  </footer>

</body>
</html>`;
}

// ─── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  const resorts = loadResorts();
  const { STATE_ADS, FEATURED_PARTNERS } = loadPartners();
  console.log(`Loaded ${resorts.length} resorts`);

  // Group resorts by state — derives all states automatically from data
  const byState = {};
  resorts.forEach(r => {
    if (!byState[r.state]) byState[r.state] = [];
    byState[r.state].push(r);
  });

  let generated = 0;

  const stateKeys = Object.keys(byState)
    .filter(abbr => byState[abbr].length)
    .sort((a, b) => stateFullName(a).localeCompare(stateFullName(b)));

  for (const stateAbbr of stateKeys) {
    const stateResorts = byState[stateAbbr];
    const otherStatesHtml = stateKeys
      .filter(s => s !== stateAbbr)
      .map(s => `<a href="/ski/${slugifyState(s)}/" class="sp-state-chip"><span class="sp-state-chip__abbr">${esc(s)}</span><span class="sp-state-chip__name">${esc(stateFullName(s))}</span></a>`)
      .join('\n      ');

    const stateSlug = slugifyState(stateAbbr);
    const dir       = path.join(__dirname, 'ski', stateSlug);
    fs.mkdirSync(dir, { recursive: true });

    let html = generateStatePage(stateAbbr, stateResorts, otherStatesHtml);

    // ── Inject sponsor ad if configured for this state ────────────────────────
    const ad = STATE_ADS[stateSlug];
    if (ad) {
      html = html.replace('<table class="sp-table">', `${buildAdHtml(ad)}\n    <table class="sp-table">`);
      console.log(`  ✓ Sponsor ad injected: ${stateSlug}`);
    }

    // ── Inject featured partner row(s) for this state ─────────────────────────
    const featuredForState = stateResorts
      .filter(r => FEATURED_PARTNERS[r.id])
      .map(r => ({ resort: r, sponsor: FEATURED_PARTNERS[r.id] }));

    if (featuredForState.length) {
      const rows = featuredForState
        .map(({ resort, sponsor }) => buildFeaturedRow(resort, sponsor))
        .join('');
      html = html.replace('<tbody>', `<tbody>${rows}`);
      const names = featuredForState.map(x => x.resort.name).join(', ');
      console.log(`  ✓ Featured row(s) injected: ${names}`);
    }

    fs.writeFileSync(path.join(dir, 'index.html'), html, 'utf8');
    console.log(`  ✓ ski/${stateSlug}/index.html`);
    generated++;
  }

  console.log(`\n✅  Done! ${generated} state pages generated.`);
  console.log(`\nTo add a sponsor or featured partner:`);
  console.log(`  1. Edit featured-partners.js`);
  console.log(`  2. node generate-state-pages.mjs`);
  console.log(`  3. Commit and push`);
}

main().catch(err => { console.error(err); process.exit(1); });
