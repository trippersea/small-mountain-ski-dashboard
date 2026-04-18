#!/usr/bin/env node
// ═══════════════════════════════════════════════════════════════════════════════
// generate-mountain-pages.mjs  — UPDATED v2
//
// Changes from v1:
//  1. Dark navy hero with live OpenMeteo snow fetch above the fold
//  2. Skier Matcher widget (2-question → Yes/No/Maybe verdict + CTA)
//  3. Nearby cards now show avg snowfall delta vs this resort
//  4. Mid-page CTA moved to AFTER editorial (not before)
//  5. Trust signals: freshness date, "No account needed · Free forever"
//
// Usage:  node generate-mountain-pages.mjs
// Output: ./ski-report/{resort-id}/index.html  — uses site-wide /styles.css
// ═══════════════════════════════════════════════════════════════════════════════

import fs   from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import vm   from 'vm';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ─── Load featured partners config ────────────────────────────────────────────
function loadFeaturedPartners() {
  const partnersPath = path.join(__dirname, 'featured-partners.js');
  if (!fs.existsSync(partnersPath)) return {};
  try {
    const ctx = {};
    const code = fs.readFileSync(partnersPath, 'utf8');
    vm.runInNewContext(code, ctx);
    return ctx.FEATURED_PARTNERS || {};
  } catch (e) {
    console.warn('Warning: could not load featured-partners.js:', e.message);
    return {};
  }
}
const FEATURED_PARTNERS = loadFeaturedPartners();

// ─── Load resort data ──────────────────────────────────────────────────────────
import { createRequire } from 'module';
const _require = createRequire(import.meta.url);
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

function distanceMiles(lat1, lon1, lat2, lon2) {
  const R = 3958.8;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2)**2 + Math.cos(lat1 * Math.PI/180) * Math.cos(lat2 * Math.PI/180) * Math.sin(dLon/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

// ── Pass comparison page by state ─────────────────────────────────────────────
function passComparisonPage(state) {
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

function passComparisonLabel(state) {
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
  const canonUrl = `https://www.wheretoskinext.com/ski-report/${resort.id}/`;

  const sportsLocation = {
    '@context': 'https://schema.org',
    '@type': 'SportsActivityLocation',
    name: resort.name,
    description: `${resort.name} ski resort in ${stateName}: ${resort.vertical.toLocaleString()} ft vertical, ${resort.trails} trails, ${resort.acres} acres. ${passLabel(resort.passGroup)} mountain.`,
    url: canonUrl,
    address: { '@type': 'PostalAddress', addressRegion: resort.state, addressCountry: 'US' },
    geo: { '@type': 'GeoCoordinates', latitude: resort.lat, longitude: resort.lon },
    priceRange: `$${resort.price} day ticket`,
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      description: 'Seasonal winter operation. Verify current hours with the resort.',
    },
    sameAs: resort.website ? [resort.website] : [],
  };

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'WhereToSkiNext.com', item: 'https://www.wheretoskinext.com' },
      { '@type': 'ListItem', position: 2, name: `Ski Mountains in ${stateName}`, item: `https://www.wheretoskinext.com/ski/${slugifyState(resort.state)}/` },
      { '@type': 'ListItem', position: 3, name: resort.name, item: canonUrl },
    ],
  };

  return [sportsLocation, breadcrumb];
}

// ─── Terrain bar HTML ─────────────────────────────────────────────────────────
function terrainBar(label, pct, color) {
  const w = Math.round(pct * 100);
  return `
    <div class="sr-bar-row">
      <span class="sr-bar-label">${label}</span>
      <div class="sr-bar-track"><div class="sr-bar-fill" style="width:${w}%;background:${color}"></div></div>
      <span class="sr-bar-pct">${w}%</span>
    </div>`;
}

function mountainHighlights(resort) {
  const h = [];
  const tb = resort.terrainBreakdown || {};
  if (resort.night) h.push("Night skiing");
  if (resort.terrainPark) h.push("Terrain park");
  if (resort.snowmaking > 500) h.push("Strong snowmaking backup");
  if (tb.intermediate >= 0.38) h.push("Strong intermediate mileage");
  if (tb.advanced >= 0.35) h.push("Notable advanced terrain");
  if (tb.beginner >= 0.35) h.push("Beginner-friendly");
  if (resort.trails < 50 && resort.vertical < 2200) h.push("Good day-trip size");
  return [...new Set(h)].slice(0, 4);
}

// ─── NEW: Nearby card with avg snowfall delta ─────────────────────────────────
function nearbyCard(r, baseResort) {
  const delta = r.avgSnowfall - baseResort.avgSnowfall;
  let deltaHtml = '';
  if (Math.abs(delta) >= 10) {
    if (delta > 0) {
      deltaHtml = `<div class="sr-nc-delta sr-nc-delta--more">❄ ${r.avgSnowfall}" avg snow (+${delta}")</div>`;
    } else {
      deltaHtml = `<div class="sr-nc-delta sr-nc-delta--less">❄ ${r.avgSnowfall}" avg snow (${delta}")</div>`;
    }
  } else {
    deltaHtml = `<div class="sr-nc-delta sr-nc-delta--same">❄ ${r.avgSnowfall}" avg snow</div>`;
  }

  const crowdHint =
    r.trails < 40
      ? '<div class="sr-nc-diff">Compact trail network, often quicker to learn in a day</div>'
      : "";

  return `
    <a href="/ski-report/${r.id}/" class="sr-nearby-card">
      <div class="sr-nc-name">${esc(r.name)}</div>
      <div class="sr-nc-meta">${esc(r.state)} · ${r.vertical.toLocaleString()} ft · ${esc(passLabel(r.passGroup))}</div>
      ${deltaHtml}
      ${crowdHint}
      <div class="sr-nc-arrow">Open ski report →</div>
    </a>`;
}

// ─── NEW: Skier matcher JS (inlined, no dependencies) ────────────────────────
function matcherScript(resort) {
  const tb       = resort.terrainBreakdown;
  const advPct   = Math.round(tb.advanced * 100);
  const begPct   = Math.round(tb.beginner * 100);
  const resortPass = resort.passGroup.toLowerCase(); // 'epic','ikon','indy','independent'
  // JSON.stringify handles all escaping (apostrophes, quotes, unicode) safely
  const nameJS   = JSON.stringify(resort.name);
  const passJS   = JSON.stringify(resortPass);
  const stateJS  = JSON.stringify(resort.state);

  return `
<script>
(function() {
  var sel = { skill: null, pass: null };

  document.querySelectorAll(".mo").forEach(function(btn) {
    btn.addEventListener("click", function() {
      var g = btn.dataset.g;
      document.querySelectorAll(".mo[data-g=" + JSON.stringify(g) + "]").forEach(function(b) { b.classList.remove("selected"); });
      btn.classList.add("selected");
      sel[g] = btn.dataset.v;
      if (sel.skill && sel.pass) evaluate();
    });
  });

  function evaluate() {
    var skill = sel.skill, pass = sel.pass;
    var type, verdict, reason, ctaText;
    var resortPass = ${passJS};
    var advPct = ${advPct};
    var begPct = ${begPct};
    var price = ${resort.price};
    var name = ${nameJS};
    var stateCode = ${stateJS};

    function compareSearchUrl(userPass) {
      var q = [];
      if (userPass === "epic") q.push("pass=Epic");
      else if (userPass === "ikon") q.push("pass=Ikon");
      else if (userPass === "indy") q.push("pass=Indy");
      else if (userPass === "independent") q.push("pass=Independent");
      q.push("st=" + encodeURIComponent(stateCode));
      return "https://www.wheretoskinext.com/?" + q.join("&") + "#compareSection";
    }
    function valueInStateUrl() {
      return "https://www.wheretoskinext.com/?st=" + encodeURIComponent(stateCode) + "&sort=price#compareSection";
    }
    function stateOnlyCompareUrl() {
      return "https://www.wheretoskinext.com/?st=" + encodeURIComponent(stateCode) + "#compareSection";
    }

    var passMatches = (pass === resortPass);
    var ctaUrl;

    if (skill === "advanced") {
      if (passMatches) {
        type = "yes";
        verdict = "Great match. " + name + " is built for advanced skiers on your pass.";
        reason = "Advanced terrain at " + advPct + "% of the mountain, and your pass covers this resort. Go when conditions are right.";
        ctaText = "Compare " + name + " with nearby mountains";
        ctaUrl = compareSearchUrl(pass);
      } else if (pass === "none") {
        type = "maybe";
        verdict = "Great terrain, but window tickets run $" + price + "+.";
        reason = "The mountain suits your skill level well. Budget accordingly: window rates add up fast for a multi-day trip.";
        ctaText = "Find the best value mountain for your level";
        ctaUrl = valueInStateUrl();
      } else {
        type = "maybe";
        verdict = "Great terrain, but your pass does not cover " + name + ".";
        reason = "You would be paying window rate ($" + price + "+). Check if a nearby mountain on your pass offers comparable terrain.";
        ctaText = "Find mountains on your pass nearby";
        ctaUrl = compareSearchUrl(pass);
      }
    } else if (skill === "intermediate") {
      if (passMatches) {
        type = "yes";
        verdict = "A solid choice for intermediates with your pass.";
        reason = "Your pass removes the cost barrier and the mountain has plenty of intermediate terrain to explore. Midweek visits are best for lift lines.";
        ctaText = "See live conditions and compare";
        ctaUrl = compareSearchUrl(pass);
      } else if (pass === "none") {
        type = "maybe";
        verdict = "Good terrain, but check if the price fits your budget.";
        reason = "At $" + price + "+ per day ticket, a few days here adds up. Compare nearby options that might offer similar intermediate terrain at lower cost.";
        ctaText = "Compare by value near here";
        ctaUrl = valueInStateUrl();
      } else {
        type = "maybe";
        verdict = "Worth considering, but there may be better fits on your pass.";
        reason = "Your pass does not cover " + name + ", so you would pay window rate. A nearby mountain on your pass might offer a comparable experience included.";
        ctaText = "Find mountains on your pass";
        ctaUrl = compareSearchUrl(pass);
      }
    } else {
      if (begPct >= 35) {
        type = passMatches ? "yes" : "maybe";
        verdict = passMatches
          ? name + " has a solid beginner setup and your pass covers it."
          : "Decent beginner terrain, but you will pay window rate.";
        reason = begPct + "% of the mountain is beginner terrain. " + (passMatches ? "Your pass makes this a low-risk day out." : "At $" + price + "+, compare nearby options on your pass first.");
        ctaText = passMatches ? "See live conditions" : "Find beginner-friendly mountains on your pass";
        ctaUrl = compareSearchUrl(pass);
      } else {
        type = "no";
        verdict = name + " is probably not the right fit for beginners.";
        reason = "Only " + begPct + "% of the mountain is beginner terrain and it skews toward advanced skiers. A more beginner-focused mountain nearby would be a better day out.";
        ctaText = "Find beginner-friendly mountains near here";
        ctaUrl = stateOnlyCompareUrl();
      }
    }

    var el = document.getElementById("matcherResult");
    el.className = "matcher-result matcher-result--" + type;
    el.style.display = "block";
    document.getElementById("mVerdict").textContent = verdict;
    document.getElementById("mReason").textContent = reason;
    document.getElementById("mCTA").textContent = ctaText;
    document.getElementById("mCTA").href = ctaUrl;
  }
})();
</script>`;
}

// ─── Generate HTML for one mountain page ──────────────────────────────────────
function generateMountainPage(resort, allResorts) {
  const stateName  = stateFullName(resort.state);
  const stateSlug  = slugifyState(resort.state);
  const canonUrl   = `https://www.wheretoskinext.com/ski-report/${resort.id}/`;
  const liveScoreUrl    = `https://www.wheretoskinext.com/?resort=${resort.id}#searchSection`;
  const compareExploreUrl = `https://www.wheretoskinext.com/?st=${encodeURIComponent(resort.state)}#compareSection`;
  const schemas    = buildSchemas(resort, stateName);
  const nearby     = nearbyResorts(resort, allResorts);
  const tb         = resort.terrainBreakdown;
  const year       = new Date().getFullYear();
  const month      = new Date().toLocaleString('en-US', { month: 'long' });

  const pageTitle  = `${resort.name} Ski Report ${year} | Live Snow, Conditions & Forecast | WhereToSkiNext.com`;
  const metaDesc   = `Live snow forecast, mountain facts, and pass context for ${resort.name} in ${stateName}. ${resort.vertical.toLocaleString()} ft vertical, ${resort.trails} trails. Compare nearby options on WhereToSkiNext.com.`;

  const passColor  = { Epic: '#1a56db', Ikon: '#0e9f6e', Indy: '#c27803', Independent: '#6b7280' }[resort.passGroup] || '#6b7280';

  // Nearby cards with snow delta
  const nearbyCards = nearby.map(r => nearbyCard(r, resort)).join('');

  const highlightItems = mountainHighlights(resort);
  const highlightsBlock =
    highlightItems.length > 0
      ? `
    <section class="sr-highlights" aria-label="Mountain highlights">
      <p class="sr-section-eyebrow">Why skiers choose ${esc(resort.name)}</p>
      <ul class="sr-highlight-chips">
        ${highlightItems.map((t) => `<li>${esc(t)}</li>`).join("")}
      </ul>
    </section>`
      : "";

  // Terrain description for editorial
  const terrainDesc = tb.advanced >= 0.35
    ? `${resort.name} skews toward experienced skiers. About ${Math.round(tb.advanced * 100)}% of the mountain is advanced terrain.`
    : tb.beginner >= 0.35
    ? `${resort.name} is welcoming to all levels with ${Math.round(tb.beginner * 100)}% beginner terrain.`
    : `${resort.name} is well-suited to intermediate skiers, with ${Math.round(tb.intermediate * 100)}% of trails in that range.`;

  const heroTagline = `${resort.name} is a ${passLabel(resort.passGroup)} ski area in ${stateName}: ${resort.trails} trails, ${resort.vertical.toLocaleString()} ft vertical, ${resort.acres.toLocaleString()} acres.`;

  // Build sponsor hero block if this resort is a featured partner
  const _fp = FEATURED_PARTNERS[resort.id];
  const SPONSOR_HERO_PLACEHOLDER = _fp ? `
      <div class="hero-sponsor-card">
        <div class="hero-sponsor-copy">
          <span class="hero-sponsor-badge">Featured Partner</span>
          <div class="hero-sponsor-text-wrap">
            <div class="hero-sponsor-title">${esc(resort.name)} booking</div>
            <div class="hero-sponsor-text">${esc(_fp.tagline || 'Book direct for best rates.')}</div>
          </div>
        </div>
        <a href="${_fp.bookingUrl}" class="hero-sponsor-btn" target="_blank" rel="noopener noreferrer">Book Tickets →</a>
      </div>` : '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <!-- Google Tag Manager -->
  <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
  new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
  j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
  'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
  })(window,document,'script','dataLayer','GTM-MCCDNQGB');</script>
  <!-- End Google Tag Manager -->
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${esc(pageTitle)}</title>
  <meta name="description" content="${esc(metaDesc)}" />
  <link rel="canonical" href="${canonUrl}" />

  <!-- Open Graph -->
  <meta property="og:title" content="${esc(resort.name)} Ski Conditions | WhereToSkiNext.com" />
  <meta property="og:description" content="${esc(metaDesc)}" />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="${canonUrl}" />
  <meta property="og:site_name" content="WhereToSkiNext.com" />
  <meta property="og:image" content="https://www.wheretoskinext.com/og-image.png" />

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${esc(resort.name)} Ski Conditions | WhereToSkiNext.com" />
  <meta name="twitter:description" content="${esc(metaDesc)}" />
  <meta name="twitter:image" content="https://www.wheretoskinext.com/og-image.png" />

  <link rel="icon" href="/ski-decision-logo.svg" type="image/svg+xml" />
  <link rel="preload" href="/hero-bg.jpg" as="image" type="image/jpeg" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Newsreader:ital,opsz,wght@0,8..60,400;0,8..60,600;0,8..60,700&display=swap" rel="stylesheet" media="print" onload="this.media='all'" />
  <noscript><link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Newsreader:ital,opsz,wght@0,8..60,400;0,8..60,600;0,8..60,700&display=swap" rel="stylesheet" /></noscript>
  <link rel="preload" href="/styles.css" as="style" />
  <link rel="stylesheet" href="/styles.css" />
  <link rel="stylesheet" href="/ski-pass-comparison/pass-comparison-page.css" />
  <link rel="stylesheet" href="/ski-report/ski-report-page.css" />

  <script type="application/ld+json">
  ${JSON.stringify(schemas, null, 2)}
  </script>

</head>
<body class="pass-page-body ski-report-page" style="--sr-pass: ${passColor}">
  <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-MCCDNQGB"
  height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>

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
      <a href="https://www.wheretoskinext.com/#searchSection" class="nav-find-cta">Find my mountain &rarr;</a>
    </div>
  </nav>

  <main class="pp-shell sr-page">

    <nav class="sr-breadcrumb" aria-label="Breadcrumb">
      <a href="/">Home</a>
      <span class="sr-breadcrumb-sep">/</span>
      <a href="/ski/${stateSlug}/">${esc(stateName)} ski mountains</a>
      <span class="sr-breadcrumb-sep">/</span>
      <span>${esc(resort.name)}</span>
    </nav>

    <header class="sr-hero">
      <div class="sr-hero-inner">
        <div class="sr-hero-grid">
          <div class="sr-hero-primary">
            <div class="sr-eyebrow-row">
              <span class="sr-pass-pill">${esc(passLabel(resort.passGroup))}</span>
              <span class="sr-live-pill"><span class="sr-live-dot" aria-hidden="true"></span>Live forecast</span>
              <span class="sr-freshness">Updated ${month} ${year}</span>
            </div>
            <h1 class="sr-title">${esc(resort.name)} <span class="sr-title-state">${esc(resort.state)}</span></h1>
            <p class="sr-tagline">${esc(heroTagline)}</p>
            <p class="sr-location-line">Base to summit ${resort.baseElevation.toLocaleString()}–${resort.summitElevation.toLocaleString()} ft · ${resort.vertical.toLocaleString()} ft vertical</p>
            <div class="sr-hero-cta">
              <a href="${esc(liveScoreUrl)}" class="sr-btn sr-btn--primary">See if this is your best pick</a>
              ${resort.website ? `<a href="${esc(resort.website)}" class="sr-btn sr-btn--ghost" target="_blank" rel="noopener noreferrer">Official ${esc(resort.name)} site</a>` : ``}
            </div>
            <p class="sr-hero-trust">Live forecast plus mountain facts in one place. Use the main tool to compare snow, drive time, pass fit, and crowds. No account needed.</p>
            ${SPONSOR_HERO_PLACEHOLDER}
          </div>
          <div class="sr-conditions-card">
            <p class="sr-conditions-label">Current snapshot</p>
            <div class="sr-snow-row">
              <div class="sr-snow-main">
                <div class="sr-snow-label">Forecast snow (72h)</div>
                <div class="sr-snow-value" id="forecastSnow"><span class="sr-skeleton" aria-hidden="true"></span><span class="visually-hidden">Forecast loading</span></div>
              </div>
            </div>
            <div class="sr-stat-micro">
              <div class="sr-stat-micro-item">
                <span class="sr-stat-micro-val sr-data-placeholder" id="forecastTemp">…</span>
                <span class="sr-stat-micro-label">Temp tomorrow</span>
              </div>
              <div class="sr-stat-micro-item">
                <span class="sr-stat-micro-val">${resort.avgSnowfall}"</span>
                <span class="sr-stat-micro-label">Avg annual snow</span>
              </div>
              <div class="sr-stat-micro-item">
                <span class="sr-stat-micro-val">${resort.trails}</span>
                <span class="sr-stat-micro-label">Trails</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>

    ${highlightsBlock}

    <article class="sr-snapshot">
      <h2>${esc(resort.name)} at a glance</h2>
      <p>
        ${esc(resort.name)} sits in ${esc(stateName)} with ${resort.vertical.toLocaleString()} ft of vertical drop, ${resort.trails} trails, and ${resort.acres.toLocaleString()} skiable acres.
        ${terrainDesc}${resort.night ? " Night skiing available." : ""}${resort.terrainPark ? " Terrain park on site." : ""}
      </p>
      <p>
        The mountain averages ${resort.avgSnowfall}" of snowfall per season${resort.snowmaking > 0 ? ` with ${resort.snowmaking.toLocaleString()} GPM of snowmaking capacity` : ""}.
        Lift tickets start around $${resort.price}; day-of pricing varies. ${esc(resort.name)} is a <strong>${esc(passLabel(resort.passGroup))}</strong> mountain.
      </p>
      <p>
        Snow conditions update often. Check back before you go. A fresh forecast can change everything.
      </p>
    </article>

    ${(resort.passGroup === "Epic" || resort.passGroup === "Ikon") && passComparisonPage(resort.state)
      ? `
    <div class="sr-pass-callout">
      <div>
        <div class="sr-pass-callout-kicker">Pass guide</div>
        <h3>Comparing ${esc(resort.passGroup)} Pass mountains in the ${passComparisonLabel(resort.state)}?</h3>
        <p>See every ${esc(resort.passGroup)} and Ikon mountain in this region side by side.</p>
      </div>
      <a href="/${passComparisonPage(resort.state)}/" class="pp-btn pp-btn--primary">View pass comparison &rarr;</a>
    </div>`
      : ""}

    <div class="sr-stats-grid" aria-label="Mountain statistics">
      <div class="sr-stat-card">
        <div class="stat-label">Vertical Drop</div>
        <div class="stat-value">${resort.vertical.toLocaleString()}<span class="stat-unit"> ft</span></div>
      </div>
      <div class="sr-stat-card">
        <div class="stat-label">Trails</div>
        <div class="stat-value">${resort.trails}<span class="stat-unit"> runs</span></div>
      </div>
      <div class="sr-stat-card">
        <div class="stat-label">Skiable Acres</div>
        <div class="stat-value">${resort.acres.toLocaleString()}<span class="stat-unit"> ac</span></div>
      </div>
      <div class="sr-stat-card">
        <div class="stat-label">Avg Annual Snow</div>
        <div class="stat-value">${resort.avgSnowfall}<span class="stat-unit">"</span></div>
      </div>
      <div class="sr-stat-card">
        <div class="stat-label">Day Ticket*</div>
        <div class="stat-value">$${resort.price}</div>
      </div>
      <div class="sr-stat-card">
        <div class="stat-label">Lifts</div>
        <div class="stat-value">${resort.lifts}</div>
      </div>
    </div>

    <div class="sr-panels">
      <div class="sr-panel">
        <h3>Mountain details</h3>
        <div class="sr-detail-row">
          <span class="sr-detail-key">Pass</span>
          <span class="sr-detail-val"><span class="sr-pass-badge">${esc(passLabel(resort.passGroup))}</span></span>
        </div>
        <div class="sr-detail-row">
          <span class="sr-detail-key">Base / Summit</span>
          <span class="sr-detail-val">${resort.baseElevation.toLocaleString()} / ${resort.summitElevation.toLocaleString()} ft</span>
        </div>
        <div class="sr-detail-row">
          <span class="sr-detail-key">Longest Run</span>
          <span class="sr-detail-val">${resort.longestRun} mi</span>
        </div>
        <div class="sr-detail-row">
          <span class="sr-detail-key">Night Skiing</span>
          <span class="sr-detail-val">${resort.night ? "Yes" : "No"}</span>
        </div>
        <div class="sr-detail-row">
          <span class="sr-detail-key">Terrain Park</span>
          <span class="sr-detail-val">${resort.terrainPark ? "Yes" : "No"}</span>
        </div>
        ${resort.website
          ? `
        <div class="sr-detail-row">
          <span class="sr-detail-key">Resort website</span>
          <span class="sr-detail-val"><a href="${esc(resort.website)}" target="_blank" rel="noopener noreferrer">Visit official site</a></span>
        </div>`
          : ""}
      </div>

      <div class="sr-panel">
        <h3>Terrain breakdown</h3>
        ${terrainBar("Beginner", tb.beginner, "#22b38a")}
        ${terrainBar("Intermediate", tb.intermediate, "#2b6de9")}
        ${terrainBar("Advanced", tb.advanced, "#ef4444")}
        <div class="sr-panel-extra">
          <div class="sr-detail-row">
            <span class="sr-detail-key">Snowmaking</span>
            <span class="sr-detail-val">${resort.snowmaking.toLocaleString()} GPM</span>
          </div>
          <div class="sr-detail-row">
            <span class="sr-detail-key">State</span>
            <span class="sr-detail-val">${esc(stateName)}</span>
          </div>
        </div>
      </div>
    </div>

    <section class="sr-matcher" aria-labelledby="matcher-h">
      <h2 class="sr-matcher-title" id="matcher-h">Is ${esc(resort.name)} right for you?</h2>
      <p class="sr-matcher-sub">Tap your level and pass. We will give a straight answer and a next step in the main ranking tool.</p>

      <div class="matcher-q">
        <div class="matcher-q-label">Your skill level</div>
        <div class="matcher-opts">
          <button type="button" class="mo" data-g="skill" data-v="beginner">Beginner</button>
          <button type="button" class="mo" data-g="skill" data-v="intermediate">Intermediate</button>
          <button type="button" class="mo" data-g="skill" data-v="advanced">Advanced / Expert</button>
        </div>
      </div>
      <div class="matcher-q">
        <div class="matcher-q-label">Your pass</div>
        <div class="matcher-opts">
          <button type="button" class="mo" data-g="pass" data-v="epic">Epic Pass</button>
          <button type="button" class="mo" data-g="pass" data-v="ikon">Ikon Pass</button>
          <button type="button" class="mo" data-g="pass" data-v="indy">Indy Pass</button>
          <button type="button" class="mo" data-g="pass" data-v="independent">Independent</button>
          <button type="button" class="mo" data-g="pass" data-v="none">No pass / window</button>
        </div>
      </div>

      <div id="matcherResult" class="matcher-result" style="display:none">
        <div id="mVerdict"></div>
        <div id="mReason"></div>
        <a id="mCTA" href="${esc(compareExploreUrl)}" class="btn-matcher"></a>
      </div>
    </section>

    <section class="pp-cta-band" aria-labelledby="sr-product-cta">
      <div>
        <h2 id="sr-product-cta">Compare this mountain with the full list</h2>
        <p>Snow, drive time, pass, and crowds scored together. See if another resort in ${esc(stateName)} or beyond is a better fit today.</p>
      </div>
      <a href="https://www.wheretoskinext.com/#searchSection" class="pp-btn pp-btn--primary">Find my best mountain &rarr;</a>
    </section>

    ${nearby.length
      ? `
    <section class="sr-nearby-section" aria-label="Nearby mountains">
      <div class="sr-nearby-head">
        <h2>Also considering</h2>
        <a href="/ski/${stateSlug}/">Browse all ${esc(stateName)} mountains</a>
      </div>
      <div class="sr-nearby-grid">
        ${nearbyCards}
      </div>
    </section>`
      : ""}

    <p class="sr-state-link">
      See all <a href="/ski/${stateSlug}/">${esc(stateName)} ski mountains</a> ranked by snow, vertical, and value in our state hub.
    </p>

    <p class="sr-disclaimer">
      *Day ticket prices are approximate and vary by date, demand, age, and promotions. Always confirm pricing directly with ${esc(resort.name)} before purchasing.
    </p>

  </main>

  <footer class="site-footer">
    <p>© ${year} WhereToSkiNext.com · <a href="/#searchSection">Find my mountain</a> · <a href="/about/">About</a> · <a href="/partners/">Partners</a></p>
  </footer>

  <!-- Live snow fetch from OpenMeteo: 72h snowfall + tomorrow temp for hero snapshot -->
  <script>
  (function() {
    var lat = ${resort.lat};
    var lon = ${resort.lon};
    var url = 'https://api.open-meteo.com/v1/forecast'
      + '?latitude=' + lat
      + '&longitude=' + lon
      + '&daily=snowfall_sum,temperature_2m_max'
      + '&temperature_unit=fahrenheit'
      + '&precipitation_unit=inch'
      + '&timezone=auto'
      + '&forecast_days=4';

    fetch(url)
      .then(function(r) { return r.json(); })
      .then(function(data) {
        var daily = data.daily;
        if (!daily) return;

        // Sum snowfall over next 3 days (indices 1,2,3; skip today)
        var snow72 = 0;
        for (var i = 1; i <= 3; i++) {
          snow72 += (daily.snowfall_sum[i] || 0);
        }
        // Convert cm → inches (OpenMeteo returns inches when unit set, but double-check)
        var snowIn = Math.round(snow72 * 10) / 10;

        // Tomorrow's high temp
        var tempF = daily.temperature_2m_max[1];

        // Update DOM
        var fsEl = document.getElementById('forecastSnow');
        if (fsEl) {
          fsEl.innerHTML = '<span class="snow-big">' + snowIn.toFixed(1) + '</span><span class="snow-big-unit">"</span>';
        }
        var tempEl = document.getElementById('forecastTemp');
        if (tempEl && tempF !== null) {
          tempEl.textContent = Math.round(tempF) + '°F';
          tempEl.classList.remove('sr-data-placeholder');
        }
      })
      .catch(function() {
        var fsEl = document.getElementById('forecastSnow');
        if (fsEl) fsEl.innerHTML = '<span class="sr-forecast-fallback">Forecast unavailable</span>';
      });
  })();
  </script>

  <script src="/featured-partners.js"></script>
  ${matcherScript(resort)}

</body>
</html>`;
}

// ─── ski-near/* hubs (must match directories under ./ski-near/) ───────────────
function listSkiNearSlugs() {
  const dir = path.join(__dirname, 'ski-near');
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir)
    .filter(name => {
      const p = path.join(dir, name);
      return fs.statSync(p).isDirectory() && fs.existsSync(path.join(p, 'index.html'));
    })
    .sort();
}

// ─── Generate sitemap.xml ──────────────────────────────────────────────────────
function generateSitemap(resorts) {
  const states = [...new Set(resorts.map(r => r.state))];
  const today  = new Date().toISOString().split('T')[0];
  const skiNearSlugs = listSkiNearSlugs();
  // ── Static content pages — add new pages here as you build them ──────────
  const STATIC_PAGES = [
    { loc: 'https://www.wheretoskinext.com/ski-pass-comparison/',            changefreq: 'monthly', priority: '0.9' },
    { loc: 'https://www.wheretoskinext.com/epic-vs-ikon-northeast/',         changefreq: 'monthly', priority: '0.8' },
    { loc: 'https://www.wheretoskinext.com/epic-vs-ikon-rockies/',           changefreq: 'monthly', priority: '0.8' },
    { loc: 'https://www.wheretoskinext.com/epic-vs-ikon-california/',        changefreq: 'monthly', priority: '0.8' },
    { loc: 'https://www.wheretoskinext.com/epic-vs-ikon-pacific-northwest/', changefreq: 'monthly', priority: '0.8' },
    { loc: 'https://www.wheretoskinext.com/epic-vs-ikon-midwest/',           changefreq: 'monthly', priority: '0.8' },
  ];

  const urls = [
    `  <url><loc>https://www.wheretoskinext.com/</loc><changefreq>daily</changefreq><priority>1.0</priority><lastmod>${today}</lastmod></url>`,
    `  <url><loc>https://www.wheretoskinext.com/about/</loc><changefreq>monthly</changefreq><priority>0.6</priority><lastmod>${today}</lastmod></url>`,
    ...STATIC_PAGES.map(p =>
      `  <url><loc>${p.loc}</loc><changefreq>${p.changefreq}</changefreq><priority>${p.priority}</priority><lastmod>${today}</lastmod></url>`
    ),
    ...skiNearSlugs.map(slug =>
      `  <url><loc>https://www.wheretoskinext.com/ski-near/${slug}/</loc><changefreq>weekly</changefreq><priority>0.85</priority><lastmod>${today}</lastmod></url>`
    ),
    ...states.map(s =>
      `  <url><loc>https://www.wheretoskinext.com/ski/${slugifyState(s)}/</loc><changefreq>weekly</changefreq><priority>0.8</priority><lastmod>${today}</lastmod></url>`
    ),
    ...resorts.map(r =>
      `  <url><loc>https://www.wheretoskinext.com/ski-report/${r.id}/</loc><changefreq>daily</changefreq><priority>0.9</priority><lastmod>${today}</lastmod></url>`
    ),
  ];
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>`;
}

// ─── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  const resorts = loadResorts();
  console.log(`Loaded ${resorts.length} resorts`);

  const outBase = path.join(__dirname, 'ski-report');
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
  console.log(`✓ Generated ${generated} mountain pages → ski-report/`);

  const validIds = new Set(resorts.map(r => r.id));
  for (const name of fs.readdirSync(outBase)) {
    const dirPath = path.join(outBase, name);
    if (!fs.statSync(dirPath).isDirectory() || validIds.has(name)) continue;
    fs.rmSync(dirPath, { recursive: true, force: true });
    console.log(`  Removed stale ski-report/${name}/ (not in current resort list)`);
  }

  const sitemapPath = path.join(__dirname, 'sitemap.xml');
  fs.mkdirSync(path.join(__dirname), { recursive: true });
  fs.writeFileSync(sitemapPath, generateSitemap(resorts), 'utf8');
  const skiNearN = listSkiNearSlugs().length;
  const urlTotal = 2 + 6 + skiNearN + [...new Set(resorts.map(r => r.state))].length + resorts.length;
  console.log(`✓ Generated sitemap.xml (${urlTotal} URLs, ${skiNearN} ski-near hubs)`);

  console.log('\nDone. Next steps:');
  console.log('  1. node generate-mountain-pages.mjs');
  console.log('  2. git add ski-report/ sitemap.xml && git commit -m "Regenerate ski-report pages"');
  console.log('  3. git push');
}

main().catch(err => { console.error(err); process.exit(1); });
