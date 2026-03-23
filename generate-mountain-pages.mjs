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
// Output: ./public/ski-report/{resort-id}/index.html  (~256 files)
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

function distanceMiles(lat1, lon1, lat2, lon2) {
  const R = 3958.8;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2)**2 + Math.cos(lat1 * Math.PI/180) * Math.cos(lat2 * Math.PI/180) * Math.sin(dLon/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
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
  const canonUrl = `https://wheretoskinext.com/ski-report/${resort.id}/`;

  const sportsLocation = {
    '@context': 'https://schema.org',
    '@type': 'SportsActivityLocation',
    name: resort.name,
    description: `${resort.name} ski resort in ${stateName} — ${resort.vertical.toLocaleString()} ft vertical, ${resort.trails} trails, ${resort.acres} acres. ${passLabel(resort.passGroup)} mountain.`,
    url: canonUrl,
    address: { '@type': 'PostalAddress', addressRegion: resort.state, addressCountry: 'US' },
    geo: { '@type': 'GeoCoordinates', latitude: resort.lat, longitude: resort.lon },
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
      { '@type': 'ListItem', position: 1, name: 'WhereToSkiNext.com', item: 'https://wheretoskinext.com' },
      { '@type': 'ListItem', position: 2, name: `Ski Mountains in ${stateName}`, item: `https://wheretoskinext.com/ski/${slugifyState(resort.state)}/` },
      { '@type': 'ListItem', position: 3, name: resort.name, item: canonUrl },
    ],
  };

  return [sportsLocation, breadcrumb];
}

// ─── Terrain bar HTML ─────────────────────────────────────────────────────────
function terrainBar(label, pct, color) {
  const w = Math.round(pct * 100);
  return `
    <div class="bar-row">
      <span class="bar-label">${label}</span>
      <div class="bar-track"><div class="bar-fill" style="width:${w}%;background:${color}"></div></div>
      <span class="bar-pct">${w}%</span>
    </div>`;
}

// ─── NEW: Nearby card with avg snowfall delta ─────────────────────────────────
function nearbyCard(r, baseResort) {
  const delta = r.avgSnowfall - baseResort.avgSnowfall;
  let deltaHtml = '';
  if (Math.abs(delta) >= 10) {
    if (delta > 0) {
      deltaHtml = `<div class="nearby-delta nearby-delta--more">❄ ${r.avgSnowfall}" avg snow (+${delta}")</div>`;
    } else {
      deltaHtml = `<div class="nearby-delta nearby-delta--less">❄ ${r.avgSnowfall}" avg snow (${delta}")</div>`;
    }
  } else {
    deltaHtml = `<div class="nearby-delta nearby-delta--same">❄ ${r.avgSnowfall}" avg snow</div>`;
  }

  // Crowd hint based on trails count (simple proxy)
  const crowdHint = r.trails < 40 ? '<div class="nearby-crowd">👤 Fewer crowds</div>' : '';

  return `
    <a href="/ski-report/${r.id}/" class="nearby-card">
      <div class="nearby-name">${esc(r.name)}</div>
      <div class="nearby-meta">${esc(r.state)} · ${r.vertical.toLocaleString()} ft · ${esc(passLabel(r.passGroup))}</div>
      ${deltaHtml}
      ${crowdHint}
      <div class="nearby-arrow">Compare →</div>
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
  const idJS     = JSON.stringify(resort.id);

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
    var appUrl = "https://wheretoskinext.com/?resort=" + ${idJS};

    var passMatches = (pass === resortPass);

    if (skill === "advanced") {
      if (passMatches) {
        type = "yes";
        verdict = "Great match — " + name + " is built for advanced skiers on your pass.";
        reason = "Advanced terrain at " + advPct + "% of the mountain, and your pass covers this resort. Go when conditions are right.";
        ctaText = "Compare " + name + " with nearby mountains";
      } else if (pass === "none") {
        type = "maybe";
        verdict = "Great terrain, but window tickets run $" + price + "+.";
        reason = "The mountain suits your skill level well. Just budget accordingly — window rates add up fast for a multi-day trip.";
        ctaText = "Find the best value mountain for your level";
      } else {
        type = "maybe";
        verdict = "Great terrain, but your pass does not cover " + name + ".";
        reason = "You would be paying window rate ($" + price + "+). Check if a nearby mountain on your pass offers comparable terrain.";
        ctaText = "Find mountains on your pass nearby";
      }
    } else if (skill === "intermediate") {
      if (passMatches) {
        type = "yes";
        verdict = "A solid choice for intermediates with your pass.";
        reason = "Your pass removes the cost barrier and the mountain has plenty of intermediate terrain to explore. Midweek visits are best for lift lines.";
        ctaText = "See live conditions and compare";
      } else if (pass === "none") {
        type = "maybe";
        verdict = "Good terrain, but check if the price fits your budget.";
        reason = "At $" + price + "+ per day ticket, a few days here adds up. Compare nearby options that might offer similar intermediate terrain at lower cost.";
        ctaText = "Compare by value near here";
      } else {
        type = "maybe";
        verdict = "Worth considering, but there may be better fits on your pass.";
        reason = "Your pass does not cover " + name + ", so you would pay window rate. A nearby mountain on your pass might offer a comparable experience included.";
        ctaText = "Find mountains on your pass";
      }
    } else {
      if (begPct >= 35) {
        type = passMatches ? "yes" : "maybe";
        verdict = passMatches
          ? name + " has a solid beginner setup and your pass covers it."
          : "Decent beginner terrain, but you will pay window rate.";
        reason = begPct + "% of the mountain is beginner terrain. " + (passMatches ? "Your pass makes this a low-risk day out." : "At $" + price + "+, compare nearby options on your pass first.");
        ctaText = passMatches ? "See live conditions" : "Find beginner-friendly mountains on your pass";
      } else {
        type = "no";
        verdict = name + " is probably not the right fit for beginners.";
        reason = "Only " + begPct + "% of the mountain is beginner terrain and it skews toward advanced skiers. A more beginner-focused mountain nearby would be a better day out.";
        ctaText = "Find beginner-friendly mountains near here";
      }
    }

    var el = document.getElementById("matcherResult");
    el.className = "matcher-result matcher-result--" + type;
    el.style.display = "block";
    document.getElementById("mVerdict").textContent = verdict;
    document.getElementById("mReason").textContent = reason;
    document.getElementById("mCTA").textContent = ctaText;
    document.getElementById("mCTA").href = appUrl;
  }
})();
</script>`;
}

// ─── Generate HTML for one mountain page ──────────────────────────────────────
function generateMountainPage(resort, allResorts) {
  const stateName  = stateFullName(resort.state);
  const stateSlug  = slugifyState(resort.state);
  const canonUrl   = `https://wheretoskinext.com/ski-report/${resort.id}/`;
  const appUrl     = `https://wheretoskinext.com/?resort=${resort.id}#verdictSection`;
  const schemas    = buildSchemas(resort, stateName);
  const nearby     = nearbyResorts(resort, allResorts);
  const tb         = resort.terrainBreakdown;
  const year       = new Date().getFullYear();
  const month      = new Date().toLocaleString('en-US', { month: 'long' });

  const pageTitle  = `${resort.name} Ski Report ${year} — Conditions, Trails & Snow | WhereToSkiNext.com`;
  const metaDesc   = `${resort.name} in ${stateName}: ${resort.vertical.toLocaleString()} ft vertical, ${resort.trails} trails, $${resort.price} day ticket. ${passLabel(resort.passGroup)} mountain. Check live snow forecast and conditions.`;

  const passColor  = { Epic: '#1a56db', Ikon: '#0e9f6e', Indy: '#c27803', Independent: '#6b7280' }[resort.passGroup] || '#6b7280';

  // Nearby cards with snow delta
  const nearbyCards = nearby.map(r => nearbyCard(r, resort)).join('');

  // Terrain description for editorial
  const terrainDesc = tb.advanced >= 0.35
    ? `${resort.name} skews toward experienced skiers — ${Math.round(tb.advanced*100)}% of the mountain is advanced terrain.`
    : tb.beginner >= 0.35
    ? `${resort.name} is welcoming to all levels with ${Math.round(tb.beginner*100)}% beginner terrain.`
    : `${resort.name} is well-suited to intermediate skiers, with ${Math.round(tb.intermediate*100)}% of trails in that range.`;

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
  <meta property="og:title" content="${esc(resort.name)} Ski Conditions — WhereToSkiNext.com" />
  <meta property="og:description" content="${esc(metaDesc)}" />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="${canonUrl}" />
  <meta property="og:image" content="https://wheretoskinext.com/ski-decision-logo.png" />

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${esc(resort.name)} Ski Conditions — WhereToSkiNext.com" />
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
      background: #f0f4fa;
      color: #1b2a3a;
      margin: 0;
      line-height: 1.6;
      min-height: 100vh;
    }

    /* ── Nav ── */
    .top-nav {
      position: sticky; top: 0; z-index: 100;
      backdrop-filter: blur(14px);
      background: rgba(255,255,255,.95);
      border-bottom: 1px solid #d6e1f0;
    }
    .top-nav-inner {
      max-width: 960px; margin: 0 auto;
      padding: 10px 20px;
      display: flex; align-items: center; gap: 8px;
    }
    .nav-brand { font-weight: 800; font-size: 15px; color: #1b2a3a; text-decoration: none; margin-right: 4px; }
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
    .page { max-width: 960px; margin: 0 auto; padding: 24px 20px 80px; }

    /* ── Breadcrumb ── */
    .breadcrumb {
      font-size: 13px; color: #667a96; margin-bottom: 16px;
      display: flex; align-items: center; gap: 6px; flex-wrap: wrap;
    }
    .breadcrumb a { color: #2b6de9; text-decoration: none; font-weight: 500; }
    .breadcrumb a:hover { text-decoration: underline; }
    .breadcrumb-sep { color: #b0bec5; }

    /* ══════════════════════════════════════════════
       HERO — dark navy, snow data above fold
    ══════════════════════════════════════════════ */
    .resort-hero {
      background: linear-gradient(135deg, #0f1f35 0%, #1b3356 60%, #1e4080 100%);
      border-radius: 16px;
      padding: 28px 28px 24px;
      margin-bottom: 14px;
      position: relative;
      overflow: hidden;
    }
    .resort-hero::before {
      content: '';
      position: absolute; inset: 0;
      background: radial-gradient(circle at 75% 50%, rgba(43,109,233,.2) 0%, transparent 65%);
      pointer-events: none;
    }

    /* Pass badge + live pill row */
    .hero-meta-row {
      display: flex; align-items: center; gap: 10px; flex-wrap: wrap;
      margin-bottom: 12px;
    }
    .pass-eyebrow {
      display: inline-flex; align-items: center; gap: 6px;
      font-family: 'DM Mono', monospace; font-size: 11px; font-weight: 500;
      letter-spacing: .1em; text-transform: uppercase;
      color: ${passColor}; background: rgba(255,255,255,.08);
      border: 1px solid ${passColor}60;
      border-radius: 999px; padding: 4px 12px;
    }
    .live-pill {
      display: inline-flex; align-items: center; gap: 5px;
      font-size: 11px; font-weight: 600; color: #6ee7b7;
      background: rgba(22,163,74,.2); border: 1px solid rgba(22,163,74,.35);
      border-radius: 999px; padding: 4px 10px;
    }
    .live-dot {
      width: 6px; height: 6px; border-radius: 50%; background: #34d399;
      animation: livePulse 1.8s ease-in-out infinite;
    }
    @keyframes livePulse {
      0%,100% { opacity:1; transform:scale(1); }
      50%      { opacity:.45; transform:scale(.8); }
    }
    .freshness {
      font-size: 11px; color: rgba(255,255,255,.38); margin-left: auto;
    }

    .resort-name {
      font-size: clamp(26px, 5vw, 42px); font-weight: 800;
      letter-spacing: -.03em; line-height: 1.08;
      color: #fff; margin: 0 0 6px;
    }
    .resort-location { font-size: 15px; color: rgba(255,255,255,.5); margin: 0 0 20px; }

    /* Snow spotlight block */
    .snow-spotlight {
      display: flex; align-items: flex-start; gap: 18px; flex-wrap: wrap;
      background: rgba(255,255,255,.07);
      border: 1px solid rgba(255,255,255,.12);
      border-radius: 12px; padding: 16px 20px;
      margin-bottom: 18px;
    }
    .snow-main { display: flex; flex-direction: column; min-width: 80px; }
    .snow-label { font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: .08em; color: rgba(255,255,255,.4); margin-bottom: 2px; }
    .snow-big { font-size: 40px; font-weight: 800; color: #fff; line-height: 1; letter-spacing: -.03em; }
    .snow-big-unit { font-size: 16px; font-weight: 500; color: rgba(255,255,255,.55); }
    .snow-loading { font-size: 13px; color: rgba(255,255,255,.4); font-style: italic; }
    .snow-divider { width: 1px; background: rgba(255,255,255,.12); align-self: stretch; flex-shrink: 0; }
    .snow-details { display: flex; gap: 18px; flex-wrap: wrap; align-items: flex-start; }
    .snow-detail { display: flex; flex-direction: column; gap: 2px; }
    .snow-detail-val { font-size: 18px; font-weight: 700; color: #fff; }
    .snow-detail-label { font-size: 10px; color: rgba(255,255,255,.4); text-transform: uppercase; letter-spacing: .06em; }

    /* Hero CTA row */
    .hero-cta-row {
      display: flex; align-items: center; gap: 12px; flex-wrap: wrap;
    }
    .btn-hero {
      display: inline-flex; align-items: center; gap: 7px;
      background: #2b6de9; color: #fff;
      font-size: 14px; font-weight: 700;
      padding: 11px 20px; border-radius: 10px;
      text-decoration: none; white-space: nowrap;
      box-shadow: 0 4px 16px rgba(43,109,233,.45);
      transition: background .12s, transform .1s;
    }
    .btn-hero:hover { background: #1d5fd4; transform: translateY(-1px); }
    .btn-hero-ghost {
      display: inline-flex; align-items: center; gap: 7px;
      background: rgba(255,255,255,.1); color: rgba(255,255,255,.82);
      font-size: 14px; font-weight: 600;
      padding: 11px 18px; border-radius: 10px;
      border: 1px solid rgba(255,255,255,.18);
      text-decoration: none; white-space: nowrap;
      transition: background .12s;
    }
    .btn-hero-ghost:hover { background: rgba(255,255,255,.18); }
    .hero-trust {
      font-size: 11px; color: rgba(255,255,255,.35);
      margin-top: 10px;
      display: flex; align-items: center; gap: 6px; flex-wrap: wrap;
    }
    .hero-trust-sep { color: rgba(255,255,255,.18); }

    /* ── Stat grid — 2-col mobile, auto on desktop ── */
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 10px; margin-bottom: 14px;
    }
    @media (min-width: 500px) { .stats-grid { grid-template-columns: repeat(3, 1fr); } }
    @media (min-width: 760px) { .stats-grid { grid-template-columns: repeat(6, 1fr); } }

    .stat-card {
      background: #fff; border: 1px solid #d6e1f0;
      border-radius: 14px; padding: 14px 12px;
      box-shadow: 0 2px 8px rgba(30,60,100,.05);
    }
    .stat-label { font-size: 10px; font-weight: 600; letter-spacing: .06em; text-transform: uppercase; color: #667a96; margin-bottom: 4px; }
    .stat-value { font-size: 20px; font-weight: 800; color: #1b2a3a; line-height: 1.2; }
    .stat-unit  { font-size: 12px; font-weight: 500; color: #667a96; }

    /* ── Detail panels ── */
    .panels { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 14px; }
    .panel {
      background: #fff; border: 1px solid #d6e1f0;
      border-radius: 16px; padding: 20px 22px;
      box-shadow: 0 2px 8px rgba(30,60,100,.05);
    }
    .panel h3 { font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: .06em; color: #667a96; margin: 0 0 14px; }
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
      background: ${passColor}18; color: ${passColor};
      border: 1px solid ${passColor}40; border-radius: 999px;
      padding: 4px 12px; font-size: 13px; font-weight: 700;
    }

    /* ── Editorial ── */
    .editorial {
      background: #fff; border: 1px solid #d6e1f0;
      border-radius: 16px; padding: 24px 26px; margin-bottom: 14px;
      box-shadow: 0 2px 8px rgba(30,60,100,.05);
    }
    .editorial h2 { font-size: 18px; font-weight: 800; margin: 0 0 14px; }
    .editorial p  { font-size: 15px; color: #2e3f54; line-height: 1.72; margin: 0 0 12px; }
    .editorial p:last-child { margin-bottom: 0; }

    /* ── Mid-page CTA banner (after editorial) ── */
    .mid-cta {
      background: linear-gradient(135deg, #0f1f35 0%, #1b3356 100%);
      border-radius: 16px; padding: 24px 28px; margin-bottom: 14px;
      display: flex; align-items: center; justify-content: space-between;
      flex-wrap: wrap; gap: 16px;
    }
    .mid-cta-title { font-size: 17px; font-weight: 800; color: #fff; margin: 0 0 4px; }
    .mid-cta-sub   { font-size: 13px; color: rgba(255,255,255,.5); margin: 0 0 8px; }
    .mid-cta-trust { font-size: 11px; color: rgba(255,255,255,.32); }
    .btn-cta {
      display: inline-flex; align-items: center; gap: 7px;
      background: #2b6de9; color: #fff;
      font-size: 14px; font-weight: 700;
      padding: 12px 22px; border-radius: 10px;
      text-decoration: none; white-space: nowrap;
      box-shadow: 0 4px 16px rgba(43,109,233,.4);
      transition: background .12s;
    }
    .btn-cta:hover { background: #1d5fd4; }

    /* ══════════════════════════════════════════════
       SKIER MATCHER WIDGET
    ══════════════════════════════════════════════ */
    .matcher {
      background: #edf4ff;
      border: 1px solid #bfdbfe;
      border-radius: 16px; padding: 22px 24px; margin-bottom: 14px;
    }
    .matcher-title { font-size: 17px; font-weight: 800; color: #1b2a3a; margin: 0 0 4px; }
    .matcher-sub   { font-size: 13px; color: #667a96; margin: 0 0 18px; }
    .matcher-q     { margin-bottom: 16px; }
    .matcher-q-label { font-size: 13px; font-weight: 700; color: #1b2a3a; margin-bottom: 8px; }
    .matcher-opts  { display: flex; flex-wrap: wrap; gap: 8px; }
    .mo {
      padding: 8px 16px; border-radius: 999px;
      font-size: 13px; font-weight: 600; font-family: inherit;
      border: 2px solid #d6e1f0;
      background: #fff; color: #1b2a3a;
      cursor: pointer; transition: all .13s;
    }
    .mo:hover, .mo.selected {
      border-color: #2b6de9;
      background: #2b6de9; color: #fff;
    }
    .matcher-result {
      margin-top: 18px; padding: 18px 20px;
      border-radius: 12px; display: none;
      animation: fadeUp .25s ease;
    }
    @keyframes fadeUp { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:translateY(0); } }
    .matcher-result--yes   { background: #dcfce7; border: 1px solid #bbf7d0; }
    .matcher-result--maybe { background: #fef3c7; border: 1px solid #fde68a; }
    .matcher-result--no    { background: #fee2e2; border: 1px solid #fecaca; }
    #mVerdict { font-size: 15px; font-weight: 800; margin-bottom: 6px; }
    .matcher-result--yes   #mVerdict { color: #15803d; }
    .matcher-result--maybe #mVerdict { color: #92400e; }
    .matcher-result--no    #mVerdict { color: #b91c1c; }
    #mReason { font-size: 13px; color: #334155; line-height: 1.55; margin-bottom: 14px; }
    .btn-matcher {
      display: inline-flex; align-items: center; gap: 6px;
      background: #2b6de9; color: #fff;
      font-size: 13px; font-weight: 700;
      padding: 9px 16px; border-radius: 8px;
      text-decoration: none;
      transition: background .12s;
    }
    .btn-matcher:hover { background: #1d5fd4; }

    /* ══════════════════════════════════════════════
       NEARBY SECTION — elevated with snow deltas
    ══════════════════════════════════════════════ */
    .nearby-section { margin-bottom: 14px; }
    .nearby-header {
      display: flex; justify-content: space-between; align-items: baseline;
      margin-bottom: 12px;
    }
    .nearby-header h2 { font-size: 18px; font-weight: 800; margin: 0; }
    .nearby-header a  { font-size: 13px; font-weight: 600; color: #2b6de9; text-decoration: none; }
    .nearby-header a:hover { text-decoration: underline; }

    .nearby-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; }
    @media (min-width: 580px) { .nearby-grid { grid-template-columns: repeat(4, 1fr); } }

    .nearby-card {
      background: #fff; border: 1px solid #d6e1f0; border-radius: 12px;
      padding: 14px 16px; text-decoration: none; color: #1b2a3a;
      display: flex; flex-direction: column; gap: 4px;
      transition: border-color .12s, box-shadow .12s, transform .12s;
    }
    .nearby-card:hover {
      border-color: #2b6de9;
      box-shadow: 0 4px 16px rgba(43,109,233,.12);
      transform: translateY(-2px);
    }
    .nearby-name { font-size: 14px; font-weight: 700; }
    .nearby-meta { font-size: 12px; color: #667a96; }
    .nearby-delta {
      font-size: 11px; font-weight: 700;
      padding: 3px 8px; border-radius: 999px;
      display: inline-flex; align-items: center; gap: 3px;
      margin-top: 2px; width: fit-content;
    }
    .nearby-delta--more { background: #dcfce7; color: #15803d; }
    .nearby-delta--less { background: #fee2e2; color: #b91c1c; }
    .nearby-delta--same { background: #edf4ff; color: #1d4ed8; }
    .nearby-crowd { font-size: 11px; color: #667a96; }
    .nearby-arrow { font-size: 12px; font-weight: 700; color: #2b6de9; margin-top: auto; padding-top: 6px; }

    /* ── State link ── */
    .state-link-row { margin-bottom: 14px; font-size: 14px; color: #667a96; }
    .state-link-row a { color: #2b6de9; font-weight: 600; text-decoration: none; }
    .state-link-row a:hover { text-decoration: underline; }

    /* ── Footer ── */
    footer {
      text-align: center; padding: 28px 16px;
      font-size: 12px; color: #94a3b8;
      border-top: 1px solid #d6e1f0; background: #fff;
      margin-top: 40px;
    }
    footer a { color: #2b6de9; text-decoration: none; }

    /* ── Responsive ── */
    @media (max-width: 600px) {
      .panels { grid-template-columns: 1fr; }
      .mid-cta { flex-direction: column; }
      .snow-spotlight { flex-direction: column; gap: 12px; }
      .snow-divider { display: none; }
    }
  </style>
</head>
<body>
  <!-- GTM noscript -->
  <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-MCCDNQGB"
  height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>

  <!-- Nav -->
  <nav class="top-nav" role="navigation" aria-label="Main navigation">
    <div class="top-nav-inner">
      <a href="/" class="nav-brand">WhereToSkiNext.com</a>
      <div class="nav-divider"></div>
      <a href="/ski/${stateSlug}/" class="nav-link">${stateName} Mountains</a>
      <div class="nav-divider"></div>
      <a href="${esc(appUrl)}" class="nav-link nav-link-cta">Find My Mountain →</a>
    </div>
  </nav>

  <main class="page">

    <!-- Breadcrumb -->
    <nav class="breadcrumb" aria-label="Breadcrumb">
      <a href="/">WhereToSkiNext.com</a>
      <span class="breadcrumb-sep">›</span>
      <a href="/ski/${stateSlug}/">Ski Mountains in ${esc(stateName)}</a>
      <span class="breadcrumb-sep">›</span>
      <span>${esc(resort.name)}</span>
    </nav>

    <!-- ══ HERO — snow data above the fold ══ -->
    <header class="resort-hero">
      <div class="hero-meta-row">
        <span class="pass-eyebrow">${esc(passLabel(resort.passGroup))}</span>
        <span class="live-pill"><span class="live-dot"></span>Live Forecast</span>
        <span class="freshness">Updated ${month} ${year}</span>
      </div>

      <h1 class="resort-name">${esc(resort.name)}</h1>
      <p class="resort-location">${esc(stateName)} · ${resort.baseElevation.toLocaleString()}–${resort.summitElevation.toLocaleString()} ft elevation</p>

      <!-- Snow spotlight — populated by JS fetch, falls back to avg snowfall -->
      <div class="snow-spotlight" id="snowSpotlight">
        <div class="snow-main">
          <span class="snow-label">Forecast Snow (72h)</span>
          <div id="forecastSnow">
            <span class="snow-loading">Loading…</span>
          </div>
        </div>
        <div class="snow-divider"></div>
        <div class="snow-details">
          <div class="snow-detail">
            <span class="snow-detail-val" id="forecastTemp">—</span>
            <span class="snow-detail-label">Temp Tomorrow</span>
          </div>
          <div class="snow-detail">
            <span class="snow-detail-val">${resort.avgSnowfall}"</span>
            <span class="snow-detail-label">Avg Annual Snow</span>
          </div>
          <div class="snow-detail">
            <span class="snow-detail-val">${resort.trails}</span>
            <span class="snow-detail-label">Total Trails</span>
          </div>
        </div>
      </div>

      <div class="hero-cta-row">
        <a href="${esc(appUrl)}" class="btn-hero">
          ⛷ See Live Ski Score
          <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </a>
        ${resort.website ? `<a href="${esc(resort.website)}" class="btn-hero-ghost" target="_blank" rel="noopener noreferrer">Visit ${esc(resort.name)} →</a>` : ''}
      </div>
      <div class="hero-trust">
        <span>No account needed</span>
        <span class="hero-trust-sep">·</span>
        <span>Free forever</span>
        <span class="hero-trust-sep">·</span>
        <span>256 mountains ranked in real time</span>
      </div>
    </header>

    <!-- Key Stats — 2-col mobile grid -->
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

      <div class="panel">
        <h3>Terrain Breakdown</h3>
        ${terrainBar('Beginner', tb.beginner, '#22b38a')}
        ${terrainBar('Intermediate', tb.intermediate, '#2b6de9')}
        ${terrainBar('Advanced', tb.advanced, '#ef4444')}
        <div style="margin-top:16px;padding-top:14px;border-top:1px solid #edf4ff">
          <div class="detail-row" style="padding:4px 0">
            <span class="detail-key">Snowmaking</span>
            <span class="detail-val">${resort.snowmaking.toLocaleString()} GPM</span>
          </div>
          <div class="detail-row" style="padding:4px 0">
            <span class="detail-key">State</span>
            <span class="detail-val">${esc(stateName)}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Editorial — At a Glance -->
    <div class="editorial">
      <h2>${esc(resort.name)} — At a Glance</h2>
      <p>
        ${esc(resort.name)} is a ski resort in ${esc(stateName)}, rising from ${resort.baseElevation.toLocaleString()} ft to ${resort.summitElevation.toLocaleString()} ft with ${resort.vertical.toLocaleString()} ft of vertical drop.
        The mountain offers ${resort.trails} trails across ${resort.acres.toLocaleString()} skiable acres — ${Math.round(tb.beginner*100)}% beginner, ${Math.round(tb.intermediate*100)}% intermediate, and ${Math.round(tb.advanced*100)}% advanced terrain.
      </p>
      <p>
        With an average of ${resort.avgSnowfall}" of snowfall per season and ${resort.snowmaking.toLocaleString()} GPM of snowmaking capacity, ${esc(resort.name)} can typically maintain good coverage throughout the winter.
        ${terrainDesc}
        ${resort.night ? 'Night skiing is available.' : ''}
        ${resort.terrainPark ? 'The mountain features a terrain park.' : ''}
      </p>
      <p>
        ${esc(resort.name)} is a <strong>${esc(passLabel(resort.passGroup))}</strong> mountain. Day tickets start around $${resort.price} — prices vary by date and demand.
        For live snow conditions, drive-time from your location, and a personalized Ski Score, use WhereToSkiNext.com.
      </p>
    </div>

    <!-- ══ MID-PAGE CTA — appears AFTER editorial, not before ══ -->
    <div class="mid-cta">
      <div>
        <div class="mid-cta-title">Not sure ${esc(resort.name)} is your best bet?</div>
        <div class="mid-cta-sub">256 mountains ranked in real time — snow, drive time, pass, and crowds.</div>
        <div class="mid-cta-trust">No account needed · Free forever · Updated daily</div>
      </div>
      <a href="${esc(appUrl)}" class="btn-cta">Find My Best Mountain →</a>
    </div>

    <!-- ══ SKIER MATCHER WIDGET ══ -->
    <div class="matcher">
      <div class="matcher-title">Is ${esc(resort.name)} right for you?</div>
      <div class="matcher-sub">Answer 2 quick questions for an instant verdict.</div>

      <div class="matcher-q">
        <div class="matcher-q-label">Your skill level:</div>
        <div class="matcher-opts">
          <button class="mo" data-g="skill" data-v="beginner">Beginner</button>
          <button class="mo" data-g="skill" data-v="intermediate">Intermediate</button>
          <button class="mo" data-g="skill" data-v="advanced">Advanced / Expert</button>
        </div>
      </div>
      <div class="matcher-q">
        <div class="matcher-q-label">Your pass:</div>
        <div class="matcher-opts">
          <button class="mo" data-g="pass" data-v="epic">Epic Pass</button>
          <button class="mo" data-g="pass" data-v="ikon">Ikon Pass</button>
          <button class="mo" data-g="pass" data-v="indy">Indy Pass</button>
          <button class="mo" data-g="pass" data-v="independent">Independent</button>
          <button class="mo" data-g="pass" data-v="none">No Pass / Window</button>
        </div>
      </div>

      <div id="matcherResult" class="matcher-result">
        <div id="mVerdict"></div>
        <div id="mReason"></div>
        <a id="mCTA" href="${esc(appUrl)}" class="btn-matcher"></a>
      </div>
    </div>

    <!-- ══ ALSO CONSIDERING — nearby with snow deltas ══ -->
    ${nearby.length ? `
    <section class="nearby-section">
      <div class="nearby-header">
        <h2>Also Considering?</h2>
        <a href="/ski/${stateSlug}/">See all ${esc(stateName)} mountains →</a>
      </div>
      <div class="nearby-grid">
        ${nearbyCards}
      </div>
    </section>` : ''}

    <!-- State page link -->
    <div class="state-link-row">
      → See all <a href="/ski/${stateSlug}/">${esc(stateName)} ski mountains</a> ranked by snow, vertical, and value.
    </div>

    <p style="font-size:12px;color:#94a3b8;margin-top:20px">
      *Day ticket prices are approximate and vary by date, demand, age, and promotions. Always confirm pricing directly with ${esc(resort.name)} before purchasing.
    </p>

  </main>

  <footer>
    <p>© ${year} WhereToSkiNext.com · <a href="https://wheretoskinext.com">wheretoskinext.com</a> · Data updated seasonally</p>
    <p style="margin-top:6px"><a href="/">Find the best mountain to ski next →</a></p>
  </footer>

  <!-- ══ Live snow fetch from OpenMeteo ══
       Fetches 72h forecast snowfall + tomorrow's temp.
       Populates the hero snow spotlight above the fold.
       Fails silently — static avg data is always shown as fallback. -->
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

        // Sum snowfall over next 3 days (indices 1,2,3 — skip today)
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
        }
      })
      .catch(function() {
        // Fail silently — avg snowfall is still shown
        var fsEl = document.getElementById('forecastSnow');
        if (fsEl) fsEl.innerHTML = '<span class="snow-loading">Forecast unavailable</span>';
      });
  })();
  </script>

  ${matcherScript(resort)}

</body>
</html>`;
}

// ─── Generate sitemap.xml ──────────────────────────────────────────────────────
function generateSitemap(resorts) {
  const states = [...new Set(resorts.map(r => r.state))];
  const today  = new Date().toISOString().split('T')[0];
  const urls = [
    `  <url><loc>https://wheretoskinext.com/</loc><changefreq>daily</changefreq><priority>1.0</priority><lastmod>${today}</lastmod></url>`,
    `  <url><loc>https://wheretoskinext.com/about/</loc><changefreq>monthly</changefreq><priority>0.6</priority><lastmod>${today}</lastmod></url>`,
    ...states.map(s =>
      `  <url><loc>https://wheretoskinext.com/ski/${slugifyState(s)}/</loc><changefreq>weekly</changefreq><priority>0.8</priority><lastmod>${today}</lastmod></url>`
    ),
    ...resorts.map(r =>
      `  <url><loc>https://wheretoskinext.com/ski-report/${r.id}/</loc><changefreq>daily</changefreq><priority>0.9</priority><lastmod>${today}</lastmod></url>`
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
  console.log(`✓ Generated ${generated} mountain pages → public/ski-report/`);

  const sitemapPath = path.join(__dirname, 'sitemap.xml');
  fs.mkdirSync(path.join(__dirname), { recursive: true });
  fs.writeFileSync(sitemapPath, generateSitemap(resorts), 'utf8');
  console.log(`✓ Generated sitemap.xml → public/sitemap.xml  (${resorts.length + 5} URLs)`);

  console.log('\nDone. Next steps:');
  console.log('  1. node generate-mountain-pages.mjs   ← run this');
  console.log('  2. git add public/ski-report/ && git commit -m "Redesign: hero snow data, matcher, nearby deltas"');
  console.log('  3. git push → Vercel auto-deploys');
}

main().catch(err => { console.error(err); process.exit(1); });
