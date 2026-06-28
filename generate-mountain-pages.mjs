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

// ─── Load mountain editorial copy ─────────────────────────────────────────────
function loadMountainEditorial() {
  const editorialPath = path.join(__dirname, 'mountain-editorial.js');
  if (!fs.existsSync(editorialPath)) {
    console.log('Note: mountain-editorial.js not found. All pages will use templated copy.');
    return { entries: {}, author: null, methodology: null };
  }
  try {
    const ctx = {};
    const code = fs.readFileSync(editorialPath, 'utf8');
    vm.runInNewContext(
      code + '\nglobalThis.__editorial = MOUNTAIN_EDITORIAL;' +
             '\nglobalThis.__author = typeof MOUNTAIN_EDITORIAL_AUTHOR !== "undefined" ? MOUNTAIN_EDITORIAL_AUTHOR : null;' +
             '\nglobalThis.__methodology = typeof MOUNTAIN_EDITORIAL_METHODOLOGY !== "undefined" ? MOUNTAIN_EDITORIAL_METHODOLOGY : null;',
      ctx
    );
    return {
      entries:     ctx.__editorial   || {},
      author:      ctx.__author      || null,
      methodology: ctx.__methodology || null
    };
  } catch (e) {
    console.warn('Warning: could not load mountain-editorial.js:', e.message);
    return { entries: {}, author: null, methodology: null };
  }
}
const _EDITORIAL = loadMountainEditorial();
const MOUNTAIN_EDITORIAL = _EDITORIAL.entries;
const EDITORIAL_AUTHOR   = _EDITORIAL.author;
const EDITORIAL_METHODOLOGY = _EDITORIAL.methodology;

// ─── Load resort data ──────────────────────────────────────────────────────────
import { createRequire } from 'module';
const _require = createRequire(import.meta.url);
function loadResorts() {
  const src = fs.readFileSync(path.join(__dirname, 'resorts.js'), 'utf8');
  const ctx = {};
  vm.runInNewContext(src + '\nglobalThis.__out = RESORTS;', ctx);
  const resorts = ctx.__out || [];
  if (!resorts.length) throw new Error('Could not load RESORTS from resorts.js');
  return resorts;
}

// ─── Load crowd model tables + shared structural module ───────────────────────
// crowd-structural.js is the weather-independent half of the live crowd model
// (sd-scoring.js delegates to the same file), so the calendars baked into
// these pages use IDENTICAL math to the homepage tool. validate-crowd-model.js
// asserts parity across all 300 resorts. If any file is missing, pages still
// generate, just without the crowd calendar section.
function loadCrowdStructural() {
  const files = {
    mg: 'metro_gravity_final.js',
    lt: 'lift_capacity_tiers_final.js',
    cs: 'crowd-structural.js',
  };
  for (const f of Object.values(files)) {
    if (!fs.existsSync(path.join(__dirname, f))) {
      console.warn(`Note: ${f} not found. Crowd calendars will be skipped.`);
      return null;
    }
  }
  try {
    const ctx = {};
    vm.runInNewContext(
      fs.readFileSync(path.join(__dirname, files.mg), 'utf8') +
      '\nglobalThis.__MG = METRO_GRAVITY;', ctx);
    vm.runInNewContext(
      fs.readFileSync(path.join(__dirname, files.lt), 'utf8') +
      '\nglobalThis.__LT = LIFT_CAPACITY_TIERS;', ctx);
    vm.runInNewContext(fs.readFileSync(path.join(__dirname, files.cs), 'utf8'), ctx);
    if (!ctx.WTSN_CROWD_STRUCT || !ctx.__MG || !ctx.__LT) throw new Error('module/table missing after eval');
    return {
      struct: ctx.WTSN_CROWD_STRUCT,
      tables: { METRO_GRAVITY: ctx.__MG, LIFT_CAPACITY_TIERS: ctx.__LT },
    };
  } catch (e) {
    console.warn('Warning: could not load crowd model files:', e.message);
    return null;
  }
}
const CROWD = loadCrowdStructural();

// ─── Helpers ──────────────────────────────────────────────────────────────────
function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function passLabel(pg) {
  return { Epic: 'Epic Pass', Ikon: 'Ikon Pass', Indy: 'Indy Pass', Independent: 'Independent' }[pg] || pg;
}

// Pick "a" or "an" based on whether the next word starts with a vowel sound.
// Used so pass labels like "Epic Pass", "Ikon Pass", "Indy Pass", "Independent"
// all render correctly ("an Epic Pass mountain", not "a Epic Pass mountain").
function aOrAn(word) {
  return /^[aeiouAEIOU]/.test(String(word || '').trim()) ? 'an' : 'a';
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

// ─── FAQ schema ───────────────────────────────────────────────────────────────
function buildFAQSchema(resort, stateName) {
  const tb       = resort.terrainBreakdown || {};
  const begPct   = Math.round((tb.beginner || 0) * 100);
  const advPct   = Math.round((tb.advanced || 0) * 100);
  const intPct   = Math.round((tb.intermediate || 0) * 100);
  const passName = { Epic: 'Epic Pass', Ikon: 'Ikon Pass', Indy: 'Indy Pass', Independent: 'no major pass' }[resort.passGroup] || 'no major pass';
  const isPass   = resort.passGroup !== 'Independent';

  const skillFit = advPct >= 35
    ? `${resort.name} skews toward experienced skiers — about ${advPct}% of the terrain is advanced or expert. Beginners will find some options but the mountain is best suited to intermediates and above.`
    : begPct >= 35
    ? `${resort.name} is beginner-friendly, with about ${begPct}% of trails suited to newer skiers. There is also plenty for intermediates, though advanced skiers may find the challenge limited.`
    : `${resort.name} is well-suited to intermediate skiers — about ${intPct}% of the terrain falls in that range. There is something for most skill levels here.`;

  const peakMonths = resort.avgSnowfall >= 200 ? 'January through early March' : 'January and February';
  // "January and February" is plural, "January through early March" is a single range.
  // Use "are" vs "is" accordingly so the FAQ doesn't read awkwardly.
  const peakVerb   = peakMonths.includes(' and ') ? 'are' : 'is';

  const questions = [
    {
      q: `Is ${resort.name} on the ${isPass ? passName : 'Epic, Ikon, or Indy Pass'}?`,
      a: isPass
        ? `Yes. ${resort.name} is ${aOrAn(passName)} ${passName} mountain. Pass holders can ski here as part of their pass benefits — check the current pass terms for any blackout dates or restrictions.`
        : `${resort.name} is an independent mountain and is not on the Epic Pass, Ikon Pass, or Indy Pass. Day tickets are available directly through the resort at approximately $${resort.price}.`,
    },
    {
      q: `How many trails does ${resort.name} have?`,
      a: `${resort.name} has ${resort.trails} trails covering ${resort.acres.toLocaleString()} skiable acres with ${resort.vertical.toLocaleString()} feet of vertical drop. The terrain breakdown is roughly ${begPct}% beginner, ${intPct}% intermediate, and ${advPct}% advanced or expert.`,
    },
    {
      q: `Is ${resort.name} good for beginners?`,
      a: begPct >= 35
        ? `Yes. About ${begPct}% of the terrain at ${resort.name} is rated for beginners, making it a solid choice for newer skiers and families with kids just learning.`
        : begPct >= 20
        ? `${resort.name} has some beginner terrain — about ${begPct}% of trails — but the mountain generally skews toward intermediate and advanced skiers. Beginners will find options but may feel more comfortable at a mountain with a stronger beginner focus.`
        : `${resort.name} is not an ideal mountain for beginners. Only about ${begPct}% of the terrain is beginner-rated, and the mountain skews toward more experienced skiers.`,
    },
    {
      q: `How much does a lift ticket cost at ${resort.name}?`,
      a: `Day ticket prices at ${resort.name} start at approximately $${resort.price}, though window rates vary by date and demand. ${isPass ? `${passName} holders ski here as part of their pass.` : 'Booking in advance is typically cheaper than buying at the window.'}`,
    },
    {
      q: `What is the average annual snowfall at ${resort.name}?`,
      a: `${resort.name} averages approximately ${resort.avgSnowfall} inches of snowfall per season.${resort.snowmaking ? ` The resort also operates ${resort.snowmaking.toLocaleString()} GPM of snowmaking to supplement natural snow and extend the season.` : ''} ${resort.avgSnowfall >= 200 ? 'This is well above average and makes it a reliable snow destination.' : resort.avgSnowfall >= 100 ? 'Snowmaking plays an important role in maintaining coverage during lighter snow years.' : 'Snowmaking is essential for keeping the mountain open across the full season.'}`,
    },
    {
      q: `When is the best time to ski ${resort.name}?`,
      a: `${peakMonths} ${peakVerb} typically peak season at ${resort.name} when snowpack is deepest and conditions are most consistent. ${resort.avgSnowfall >= 150 ? 'December can be good if the season starts early.' : 'December is hit or miss — the base needs time to build.'} Midweek visits are almost always less crowded than weekends${isPass ? ', especially when pass holders fill the mountain on Saturdays and holidays' : ''}.`,
    },
  ];

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: questions.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  };
}

// ─── JSON-LD schemas ──────────────────────────────────────────────────────────
function buildSchemas(resort, stateName, editorial) {
  const canonUrl = `https://wheretoskinext.com/ski-report/${resort.id}`;

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
      { '@type': 'ListItem', position: 1, name: 'WhereToSkiNext.com', item: 'https://wheretoskinext.com/' },
      { '@type': 'ListItem', position: 2, name: `Ski Mountains in ${stateName}`, item: `https://wheretoskinext.com/ski/${slugifyState(resort.state)}` },
      { '@type': 'ListItem', position: 3, name: resort.name, item: canonUrl },
    ],
  };

  const faq = buildFAQSchema(resort, stateName);

  const out = [sportsLocation, breadcrumb, faq];

  // Article schema is the strongest signal we can send Google that this page
  // is substantive original content, not a templated database printout. Only
  // emit it when there's actual editorial to back it up.
  if (editorial) {
    const articleBody = [
      editorial.lede || '',
      ...(Array.isArray(editorial.body) ? editorial.body : []),
      editorial.crowdTake || ''
    ].filter(Boolean).join('\n\n');

    const article = {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: `${resort.name}: ${editorial.hook || ''}`.trim().replace(/:\s*$/, ''),
      description: editorial.hook || '',
      articleBody,
      mainEntityOfPage: { '@type': 'WebPage', '@id': canonUrl },
      url: canonUrl,
      image: 'https://wheretoskinext.com/wtsn-og.png',
      datePublished: editorial.lastUpdated || undefined,
      dateModified:  editorial.lastUpdated || undefined,
      publisher: {
        '@type': 'Organization',
        name: 'WhereToSkiNext.com',
        url: 'https://wheretoskinext.com/',
        logo: {
          '@type': 'ImageObject',
          url: 'https://wheretoskinext.com/wtsn-icon.svg'
        }
      },
      about: { '@type': 'SportsActivityLocation', name: resort.name, url: canonUrl }
    };

    if (EDITORIAL_AUTHOR) {
      article.author = {
        '@type': 'Person',
        name: EDITORIAL_AUTHOR.name,
        ...(EDITORIAL_AUTHOR.title ? { jobTitle: EDITORIAL_AUTHOR.title } : {}),
        ...(EDITORIAL_AUTHOR.bio   ? { description: EDITORIAL_AUTHOR.bio } : {})
      };
      // accountablePerson is a separate E-E-A-T signal — it tells Google a
      // named human is responsible for this content, not a content farm.
      article.accountablePerson = article.author;
    }

    // citation: per-mountain sources elevated into structured data. Each entry
    // becomes a CreativeWork. This is the strongest "research-based" signal
    // we can emit in schema. Only present when the editorial entry defined it.
    if (Array.isArray(editorial.sources) && editorial.sources.length > 0) {
      article.citation = editorial.sources.map(s => {
        if (typeof s === 'string') {
          return { '@type': 'CreativeWork', name: s };
        }
        const cw = { '@type': 'CreativeWork' };
        if (s.label) cw.name = s.label;
        if (s.url)   cw.url  = s.url;
        return cw;
      });
    }

    out.push(article);
  }

  return out;
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
  if (resort.snowmaking > 500) h.push("Solid snowmaking coverage");
  if (tb.intermediate >= 0.38) h.push("Strong intermediate mileage");
  if (tb.advanced >= 0.35) h.push("Notable advanced terrain");
  if (tb.beginner >= 0.35) h.push("Beginner-friendly");
  if (resort.trails < 50 && resort.vertical < 2200) h.push("Right-sized for a day");
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
    <a href="/ski-report/${r.id}" class="sr-nearby-card">
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
      return "https://wheretoskinext.com/?" + q.join("&") + "#compareSection";
    }
    function valueInStateUrl() {
      return "https://wheretoskinext.com/?st=" + encodeURIComponent(stateCode) + "&sort=price#compareSection";
    }
    function stateOnlyCompareUrl() {
      return "https://wheretoskinext.com/?st=" + encodeURIComponent(stateCode) + "#compareSection";
    }

    var passMatches = (pass === resortPass);
    var ctaUrl;

    if (skill === "advanced") {
      if (passMatches) {
        type = "yes";
        verdict = "Great match. " + name + " is built for advanced skiers on your pass.";
        reason = "Advanced terrain at " + advPct + "% of the mountain, and your pass covers this resort. Go when the forecast looks right.";
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
        reason = "Your pass works here and the mountain has plenty of intermediate terrain to explore. Midweek is noticeably quieter.";
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
        verdict = "Worth a look, but check whether your pass covers it first.";
        reason = "Your pass does not cover " + name + ", so you would pay window rate. A nearby mountain on your pass might offer similar terrain included.";
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

// ─── Editorial render helpers ─────────────────────────────────────────────────
function renderEditorial(resort, editorial, allResorts) {
  if (!editorial) return '';

  const ledePara = `<p class="sr-ed-lede">${esc(editorial.lede || '')}</p>`;
  const bodyParas = Array.isArray(editorial.body)
    ? editorial.body.map(p => `<p>${esc(p)}</p>`).join('\n      ')
    : '';

  const crowdBlock = editorial.crowdTake
    ? `
      <aside class="sr-ed-crowd" aria-label="Crowd take">
        <span class="sr-ed-crowd-label">The crowd take</span>
        <p>${esc(editorial.crowdTake)}</p>
      </aside>`
    : '';

  // Alternatives: cross-link to other mountain pages with editor's commentary.
  let altsBlock = '';
  if (Array.isArray(editorial.alternatives) && editorial.alternatives.length > 0) {
    const cards = editorial.alternatives.map(alt => {
      const target = allResorts.find(r => r.id === alt.id);
      if (!target) {
        console.warn(`  ↳ editorial alternative "${alt.id}" referenced from "${resort.id}" not found in resorts.`);
        return '';
      }
      return `
        <a class="sr-ed-alt-card" href="/ski-report/${target.id}">
          <div class="sr-ed-alt-name">${esc(target.name)}<span class="sr-ed-alt-arrow">&rarr;</span></div>
          <div class="sr-ed-alt-take">${esc(alt.take || '')}</div>
        </a>`;
    }).filter(Boolean).join('');
    if (cards) {
      altsBlock = `
      <div class="sr-ed-alts" aria-label="Smarter alternatives">
        <div class="sr-ed-alts-label">If not ${esc(resort.name)}, then</div>
        <div class="sr-ed-alts-grid">${cards}
        </div>
      </div>`;
    }
  }

  const byline = EDITORIAL_AUTHOR
    ? `
      <div class="sr-ed-byline">
        <span class="sr-ed-byline-by">By ${esc(EDITORIAL_AUTHOR.name)}</span>
        ${EDITORIAL_AUTHOR.title ? `<span class="sr-ed-byline-title">${esc(EDITORIAL_AUTHOR.title)}</span>` : ''}
        ${editorial.lastUpdated ? `<span class="sr-ed-byline-date">Updated ${esc(formatEditorialDate(editorial.lastUpdated))}</span>` : ''}
      </div>`
    : '';

  // Methodology / sources disclosure. Appended to every editorial article.
  // The duplicate boilerplate across pages is fine — it's a small fraction of
  // each page's prose, and the transparency signal (named sources, honest
  // experience disclosure) is real E-E-A-T value Google rewards.
  const methodologyBlock = renderMethodology(editorial);

  return `
    <article class="sr-editorial" itemscope itemtype="https://schema.org/Article">
      <meta itemprop="headline" content="${esc(resort.name)}: ${esc(editorial.hook || '')}" />
      ${editorial.lastUpdated ? `<meta itemprop="dateModified" content="${esc(editorial.lastUpdated)}" />` : ''}
      <span class="sr-ed-kicker">Editor's take</span>
      <p class="sr-ed-hook">${esc(editorial.hook || '')}</p>
      ${byline}
      <div class="sr-ed-body" itemprop="articleBody">
        ${ledePara}
        ${bodyParas}
      </div>
      ${crowdBlock}
      ${altsBlock}
      ${methodologyBlock}
    </article>`;
}

function renderMethodology(editorial) {
  if (!EDITORIAL_METHODOLOGY) return '';

  const m = EDITORIAL_METHODOLOGY;
  const heading = esc(m.heading || 'How this review was put together');
  const paras = (Array.isArray(m.paragraphs) ? m.paragraphs : [])
    .map(p => `<p>${esc(p)}</p>`).join('\n        ');

  // Per-mountain sources, if the editorial entry provided any. Strings render
  // as a bulleted list; objects with {label, url} render as links.
  let perMountain = '';
  if (Array.isArray(editorial.sources) && editorial.sources.length > 0) {
    const items = editorial.sources.map(s => {
      if (typeof s === 'string') return `<li>${esc(s)}</li>`;
      if (s && s.url && s.label) {
        return `<li><a href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">${esc(s.label)}</a></li>`;
      }
      if (s && s.label) return `<li>${esc(s.label)}</li>`;
      return '';
    }).filter(Boolean).join('\n          ');
    if (items) {
      perMountain = `
      <div class="sr-ed-sources-list">
        <div class="sr-ed-sources-label">${esc(m.sourcesLabel || 'Additional sources for this mountain')}</div>
        <ul>
          ${items}
        </ul>
      </div>`;
    }
  }

  const stamp = m.integrityStamp
    ? `<p class="sr-ed-method-stamp">${esc(m.integrityStamp)}</p>`
    : '';

  return `
      <section class="sr-ed-method" aria-label="Methodology and sources">
        <div class="sr-ed-method-head">${heading}</div>
        <div class="sr-ed-method-body">
          ${paras}
        </div>
        ${perMountain}
        ${stamp}
      </section>`;
}

function formatEditorialDate(iso) {
  // "2026-05-31" -> "May 2026"
  if (!iso || typeof iso !== 'string') return '';
  const m = iso.match(/^(\d{4})-(\d{2})-/);
  if (!m) return iso;
  const months = ['Jan','Feb','Mar','Apr','May','June','July','Aug','Sept','Oct','Nov','Dec'];
  return `${months[parseInt(m[2], 10) - 1]} ${m[1]}`;
}

// CSS scoped to editorial sections. Emitted in <head> only on pages with
// editorial, so non-editorial pages are byte-identical to their old output.
const EDITORIAL_CSS = `
    <style>
      /* Editorial block. Uses site CSS variables so it inherits the design
         system (Inter, navy palette, brand accent #2b6de9, --radius 16px,
         --shadow-card). Sits naturally next to .sr-snapshot rather than
         floating as a separate card. */
      .sr-editorial {
        background: var(--surface-white, #fff);
        border: 1px solid var(--border-light, #dde5ee);
        border-left: 4px solid var(--accent, #2b6de9);
        border-radius: var(--radius, 16px);
        box-shadow: var(--shadow-card, 0 4px 24px rgba(26, 46, 69, 0.07));
        padding: 28px 32px;
        margin: 24px 0 28px;
        font-family: 'Inter', 'DM Sans', system-ui, sans-serif;
      }
      .sr-ed-kicker {
        display: inline-block;
        font-size: 11px;
        font-weight: 700;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        color: var(--accent, #2b6de9);
        margin-bottom: 10px;
      }
      .sr-ed-hook {
        font-size: 24px;
        line-height: 1.3;
        font-weight: 700;
        color: var(--text-primary, #2a4158);
        margin: 0 0 14px;
        letter-spacing: -0.01em;
      }
      .sr-ed-byline {
        font-size: 13px;
        color: var(--text-muted, #7f96a9);
        margin-bottom: 18px;
        padding-bottom: 14px;
        border-bottom: 1px solid var(--border-light, #dde5ee);
      }
      .sr-ed-byline-by { font-weight: 600; color: var(--text-primary, #2a4158); }
      .sr-ed-byline-title { margin-left: 10px; }
      .sr-ed-byline-date { margin-left: 10px; }
      .sr-ed-body {
        font-size: 16px;
        line-height: 1.65;
        color: var(--text-body, #4a6177);
      }
      .sr-ed-body p { margin: 0 0 14px; }
      .sr-ed-body p:last-child { margin-bottom: 0; }
      .sr-ed-lede {
        font-size: 17px;
        line-height: 1.6;
        color: var(--text-primary, #2a4158);
      }
      .sr-ed-crowd {
        margin-top: 22px;
        background: var(--accent-blue-dim, rgba(43, 109, 233, 0.08));
        border-left: 3px solid var(--accent, #2b6de9);
        border-radius: 0 var(--radius-sm, 10px) var(--radius-sm, 10px) 0;
        padding: 16px 20px;
      }
      .sr-ed-crowd-label {
        display: block;
        font-size: 11px;
        font-weight: 700;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        color: var(--accent, #2b6de9);
        margin-bottom: 6px;
      }
      .sr-ed-crowd p {
        font-size: 16px;
        line-height: 1.55;
        color: var(--text-primary, #2a4158);
        margin: 0;
        font-weight: 500;
      }
      .sr-ed-alts {
        margin-top: 22px;
        padding-top: 20px;
        border-top: 1px solid var(--border-light, #dde5ee);
      }
      .sr-ed-alts-label {
        font-size: 12px;
        font-weight: 700;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        color: var(--text-muted, #7f96a9);
        margin-bottom: 12px;
      }
      .sr-ed-alts-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
        gap: 12px;
      }
      .sr-ed-alt-card {
        display: block;
        background: var(--surface-subtle, #f7fafc);
        border: 1px solid var(--border-light, #dde5ee);
        border-radius: var(--radius-sm, 10px);
        padding: 14px 16px;
        text-decoration: none;
        color: inherit;
        transition: border-color .15s, background .15s, transform .15s;
      }
      .sr-ed-alt-card:hover {
        border-color: var(--accent, #2b6de9);
        background: var(--surface-white, #fff);
        transform: translateY(-1px);
      }
      .sr-ed-alt-name {
        font-size: 15px;
        font-weight: 700;
        color: var(--text-primary, #2a4158);
        display: flex;
        justify-content: space-between;
        align-items: baseline;
        margin-bottom: 4px;
      }
      .sr-ed-alt-arrow { color: var(--accent, #2b6de9); }
      .sr-ed-alt-take {
        font-size: 14px;
        line-height: 1.5;
        color: var(--text-body, #4a6177);
      }
      @media (max-width: 640px) {
        .sr-editorial { padding: 22px 20px; }
        .sr-ed-hook { font-size: 20px; }
        .sr-ed-body { font-size: 15px; }
        .sr-ed-byline { font-size: 12px; }
        .sr-ed-byline-title { display: block; margin-left: 0; margin-top: 2px; }
        .sr-ed-byline-date  { display: block; margin-left: 0; margin-top: 2px; }
      }
      /* Methodology / sources block */
      .sr-ed-method {
        margin-top: 28px;
        padding-top: 22px;
        border-top: 1px solid var(--border-light, #dde5ee);
      }
      .sr-ed-method-head {
        font-size: 11px;
        font-weight: 700;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        color: var(--text-muted, #7f96a9);
        margin-bottom: 12px;
      }
      .sr-ed-method-body {
        font-size: 13.5px;
        line-height: 1.6;
        color: var(--text-muted, #7f96a9);
      }
      .sr-ed-method-body p { margin: 0 0 10px; }
      .sr-ed-method-body p:last-child { margin-bottom: 0; }
      .sr-ed-sources-list {
        margin-top: 14px;
        padding-top: 12px;
        border-top: 1px dashed var(--border-light, #dde5ee);
      }
      .sr-ed-sources-label {
        font-size: 11px;
        font-weight: 700;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        color: var(--text-muted, #7f96a9);
        margin-bottom: 8px;
      }
      .sr-ed-sources-list ul {
        list-style: none;
        padding: 0;
        margin: 0;
        font-size: 13px;
        color: var(--text-muted, #7f96a9);
        line-height: 1.55;
      }
      .sr-ed-sources-list li {
        padding: 2px 0;
      }
      .sr-ed-sources-list a {
        color: var(--accent, #2b6de9);
        text-decoration: none;
        border-bottom: 1px solid var(--accent-blue-dim, rgba(43, 109, 233, 0.18));
      }
      .sr-ed-sources-list a:hover {
        color: var(--accent-hover, #1a56c4);
        border-bottom-color: var(--accent, #2b6de9);
      }
      .sr-ed-method-stamp {
        margin: 14px 0 0;
        font-size: 12px;
        font-style: italic;
        color: var(--text-muted, #7f96a9);
      }
      @media (max-width: 640px) {
        .sr-ed-method-body { font-size: 13px; }
      }
    </style>`;

// ─── Generate HTML for one mountain page ──────────────────────────────────────
// ─── Typical crowd calendar (from the shared structural model) ────────────────
// Five day profiles with neutral weather. The takeaway sentence is assembled
// from the actual labels, with phrasing variants picked deterministically per
// resort id so 300 pages do not read like one template.

function crowdCellClass(label) {
  return { Quiet: 'quiet', Moderate: 'moderate', Busy: 'busy', Avoid: 'avoid' }[label] || 'moderate';
}

function pickVariant(resortId, variants) {
  let h = 0;
  const s = String(resortId);
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return variants[h % variants.length];
}

function crowdTakeaway(resort, cal) {
  const by = Object.fromEntries(cal.map(c => [c.key, c]));
  const sat = by.saturday, mid = by.midweek, hol = by.holiday;
  const short = resort.name.replace(/\s+(Resort|Mountain Resort|Ski Area|Ski Resort)$/i, '');

  let core;
  if ((sat.label === 'Busy' || sat.label === 'Avoid') && mid.label === 'Quiet') {
    core = pickVariant(resort.id, [
      `Saturdays load up here. Midweek is a different mountain, same snow.`,
      `${short} is a busy-Saturday hill. Ski it on a Tuesday and you will wonder where everyone went.`,
      `Weekends draw a real crowd. The midweek skier gets the place mostly to themselves.`,
    ]);
  } else if ((sat.label === 'Busy' || sat.label === 'Avoid') && mid.label !== 'Quiet') {
    core = pickVariant(resort.id, [
      `There is no secret quiet day at a mountain this popular, but midweek still beats any Saturday.`,
      `${short} draws people every day of the week. Midweek just softens it.`,
      `Expect company whenever you come. Midweek trims the lines without erasing them.`,
    ]);
  } else if (sat.label === 'Moderate' && mid.label === 'Quiet') {
    core = pickVariant(resort.id, [
      `Saturdays stay manageable here, and midweek is properly quiet.`,
      `Even peak Saturdays rarely get out of hand. Midweek you can lap without thinking about it.`,
      `Weekend crowds exist but behave. Midweek is close to private.`,
    ]);
  } else {
    core = pickVariant(resort.id, [
      `Crowds are rarely the story here, even on a Saturday.`,
      `Lift lines are not the thing that will decide your day at ${short}.`,
      `This is one of the easier mountains to ski on a whim. Most days are uncrowded.`,
    ]);
  }

  let holNote = '';
  if (hol.label === 'Avoid') {
    holNote = ' ' + pickVariant(resort.id + 'h', [
      `Holiday weeks are the exception. Plan around Christmas and Presidents week if you can.`,
      `The one caveat is holiday weeks, which push this place to its limits.`,
    ]);
  } else if (hol.label === 'Busy' && sat.label !== 'Busy' && sat.label !== 'Avoid') {
    holNote = ' ' + pickVariant(resort.id + 'h', [
      `Holiday weeks are the busiest it gets.`,
      `Christmas and Presidents weeks are the only times it really fills in.`,
    ]);
  }
  return core + holNote;
}

function crowdCalendarSection(resort, liveScoreUrl) {
  if (!CROWD) return '';
  let cal;
  try {
    cal = CROWD.struct.typicalCrowdCalendar(resort, CROWD.tables);
  } catch (e) {
    return '';
  }
  if (!Array.isArray(cal) || cal.some(c => !c || !Number.isFinite(c.score))) return '';

  const cells = cal.map(c => `
        <div class="sr-crowdcal-cell sr-crowdcal-cell--${crowdCellClass(c.label)}">
          <span class="sr-crowdcal-day">${esc(c.kind)}</span>
          <span class="sr-crowdcal-bar" aria-hidden="true"><span class="sr-crowdcal-fill" style="width:${Math.max(8, Math.min(100, c.score))}%"></span></span>
          <span class="sr-crowdcal-label">${esc(c.label)}</span>
        </div>`).join('');

  return `
    <section class="sr-crowdcal" aria-labelledby="crowdcal-h">
      <h2 class="sr-crowdcal-title" id="crowdcal-h">When ${esc(resort.name)} gets crowded</h2>
      <p class="sr-crowdcal-sub">Our model predicts crowd pressure for a typical week here: who this mountain draws, how its lifts absorb a rush, and how each day loads it. It is a prediction, not a turnstile count. Snow in the forecast pushes any of these days up.</p>
      <div class="sr-crowdcal-grid">${cells}
      </div>
      <p class="sr-crowdcal-take">${esc(crowdTakeaway(resort, cal))}</p>
      <a class="sr-crowdcal-cta" href="${esc(liveScoreUrl)}">Get the crowd forecast for your exact ski day</a>
    </section>
`;
}

function generateMountainPage(resort, allResorts) {
  const stateName  = stateFullName(resort.state);
  const stateSlug  = slugifyState(resort.state);
  const editorial  = MOUNTAIN_EDITORIAL[resort.id] || null;
  const canonUrl   = `https://wheretoskinext.com/ski-report/${resort.id}`;
  const liveScoreUrl    = `https://wheretoskinext.com/?resort=${resort.id}#searchSection`;
  const compareExploreUrl = `https://wheretoskinext.com/?st=${encodeURIComponent(resort.state)}#compareSection`;
  const schemas    = buildSchemas(resort, stateName, editorial);
  const nearby     = nearbyResorts(resort, allResorts);
  const tb         = resort.terrainBreakdown;
  const year       = new Date().getFullYear();
  const month      = new Date().toLocaleString('en-US', { month: 'long' });

  // Title kept under ~60 chars so it doesn't get truncated in Google SERPs.
  // No year (avoids dating every page), no full brand string (Google appends
  // the site name automatically when it wants to show it).
  const pageTitle  = `${resort.name} Ski Report | Live Snow & Forecast`;
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

  const heroTagline = `${resort.name} is ${aOrAn(passLabel(resort.passGroup))} ${passLabel(resort.passGroup)} ski area in ${stateName}: ${resort.trails} trails, ${resort.vertical.toLocaleString()} ft vertical, ${resort.acres.toLocaleString()} acres.`;

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
  <meta property="og:image" content="https://wheretoskinext.com/wtsn-og.png" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${esc(resort.name)} Ski Conditions | WhereToSkiNext.com" />
  <meta name="twitter:description" content="${esc(metaDesc)}" />
  <meta name="twitter:image" content="https://wheretoskinext.com/wtsn-og.png" />

  <link rel="icon" href="/wtsn-favicon.svg" type="image/svg+xml" />
  <link rel="preload" href="/hero-bg.jpg" as="image" type="image/jpeg" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Newsreader:ital,opsz,wght@0,8..60,400;0,8..60,600;0,8..60,700&display=swap" rel="stylesheet" media="print" onload="this.media='all'" />
  <noscript><link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Newsreader:ital,opsz,wght@0,8..60,400;0,8..60,600;0,8..60,700&display=swap" rel="stylesheet" /></noscript>
  <link rel="preload" href="/styles.css" as="style" />
  <link rel="stylesheet" href="/styles.css" />
  <link rel="stylesheet" href="/ski-pass-comparison/pass-comparison-page.css" />
  <link rel="stylesheet" href="/ski-report/ski-report-page.css" />
  <link rel="stylesheet" href="/newsletter-band.css" />
  <link rel="stylesheet" href="/site-tokens-bridge.css" />
${editorial ? EDITORIAL_CSS : ''}
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
        <img src="/wtsn-icon.svg" alt="WhereToSkiNext.com logo" class="nav-logo" width="30" height="30" />
        <span class="nav-brand">
          <span class="nav-brand-name">WhereToSki<span class="nav-brand-next">Next</span>.com</span>
          <span class="nav-brand-tag">Stop guessing. Start skiing.</span>
        </span>
      </a>
      <div class="nav-divider"></div>
      <div class="nav-browse-wrap">
        <button class="nav-primary nav-browse-btn" aria-expanded="false" aria-haspopup="true">Browse &#9662;</button>
        <div class="nav-browse-dropdown" role="menu">
          <div class="nav-browse-col">
            <div class="nav-browse-region">Northeast</div>
            <a href="/ski/connecticut" role="menuitem">Connecticut</a>
            <a href="/ski/maine" role="menuitem">Maine</a>
            <a href="/ski/massachusetts" role="menuitem">Massachusetts</a>
            <a href="/ski/new-hampshire" role="menuitem">New Hampshire</a>
            <a href="/ski/new-jersey" role="menuitem">New Jersey</a>
            <a href="/ski/new-york" role="menuitem">New York</a>
            <a href="/ski/pennsylvania" role="menuitem">Pennsylvania</a>
            <a href="/ski/rhode-island" role="menuitem">Rhode Island</a>
            <a href="/ski/vermont" role="menuitem">Vermont</a>
          </div>
          <div class="nav-browse-col">
            <div class="nav-browse-region">Southeast</div>
            <a href="/ski/maryland" role="menuitem">Maryland</a>
            <a href="/ski/north-carolina" role="menuitem">North Carolina</a>
            <a href="/ski/tennessee" role="menuitem">Tennessee</a>
            <a href="/ski/virginia" role="menuitem">Virginia</a>
            <a href="/ski/west-virginia" role="menuitem">West Virginia</a>
            <div class="nav-browse-region" style="margin-top:10px;">Midwest</div>
            <a href="/ski/illinois" role="menuitem">Illinois</a>
            <a href="/ski/indiana" role="menuitem">Indiana</a>
            <a href="/ski/iowa" role="menuitem">Iowa</a>
            <a href="/ski/michigan" role="menuitem">Michigan</a>
            <a href="/ski/minnesota" role="menuitem">Minnesota</a>
            <a href="/ski/missouri" role="menuitem">Missouri</a>
            <a href="/ski/ohio" role="menuitem">Ohio</a>
            <a href="/ski/wisconsin" role="menuitem">Wisconsin</a>
          </div>
          <div class="nav-browse-col">
            <div class="nav-browse-region">Rockies</div>
            <a href="/ski/colorado" role="menuitem">Colorado</a>
            <a href="/ski/idaho" role="menuitem">Idaho</a>
            <a href="/ski/montana" role="menuitem">Montana</a>
            <a href="/ski/new-mexico" role="menuitem">New Mexico</a>
            <a href="/ski/utah" role="menuitem">Utah</a>
            <a href="/ski/wyoming" role="menuitem">Wyoming</a>
            <div class="nav-browse-region" style="margin-top:10px;">West</div>
            <a href="/ski/alaska" role="menuitem">Alaska</a>
            <a href="/ski/arizona" role="menuitem">Arizona</a>
            <a href="/ski/california" role="menuitem">California</a>
            <a href="/ski/nevada" role="menuitem">Nevada</a>
            <a href="/ski/oregon" role="menuitem">Oregon</a>
            <a href="/ski/washington" role="menuitem">Washington</a>
          </div>
        </div>
      </div>
      <span class="nav-link-sep" aria-hidden="true"></span>
      <a href="/about" class="nav-primary">About</a>
      <span class="nav-link-sep" aria-hidden="true"></span>
      <a href="/stories" class="nav-primary">Stories</a>
      <span class="nav-link-sep" aria-hidden="true"></span>
      <a href="/ski-pass-comparison" class="nav-primary">Pass Guides</a>
      <a href="https://wheretoskinext.com/#searchSection" class="nav-find-cta">Find my mountain &rarr;</a>
    </div>
  </nav>

  <main class="pp-shell sr-page">

    <nav class="sr-breadcrumb" aria-label="Breadcrumb">
      <a href="/">Home</a>
      <span class="sr-breadcrumb-sep">/</span>
      <a href="/ski/${stateSlug}">${esc(stateName)} ski mountains</a>
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
            <p class="sr-hero-trust">Live snow forecast for the next 72 hours. Use the main tool to see how it stacks up against other mountains on your drive. No account needed.</p>
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

    ${editorial ? renderEditorial(resort, editorial, allResorts) : `
    <article class="sr-snapshot">
      <h2>${esc(resort.name)} at a glance</h2>
      <p>
        ${esc(resort.name)} sits in ${esc(stateName)} with ${resort.vertical.toLocaleString()} ft of vertical drop, ${resort.trails} trails, and ${resort.acres.toLocaleString()} skiable acres.
        ${terrainDesc}${resort.night ? " Night skiing available." : ""}${resort.terrainPark ? " Terrain park on site." : ""}
      </p>
      <p>
        The mountain averages ${resort.avgSnowfall}" of snowfall per season${resort.snowmaking > 0 ? ` with ${resort.snowmaking.toLocaleString()} GPM of snowmaking capacity` : ""}.
        Lift tickets start around $${resort.price}; day-of pricing varies. ${esc(resort.name)} is ${aOrAn(passLabel(resort.passGroup))} <strong>${esc(passLabel(resort.passGroup))}</strong> mountain.
      </p>
      <p>
        Snow conditions update often. Check back before you go. A fresh forecast can change everything.
      </p>
    </article>`}

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

    ${crowdCalendarSection(resort, liveScoreUrl)}
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
      <a href="https://wheretoskinext.com/#searchSection" class="pp-btn pp-btn--primary">Find my best mountain &rarr;</a>
    </section>

    ${nearby.length
      ? `
    <section class="sr-nearby-section" aria-label="Nearby mountains">
      <div class="sr-nearby-head">
        <h2>Also considering</h2>
        <a href="/ski/${stateSlug}">Browse all ${esc(stateName)} mountains</a>
      </div>
      <div class="sr-nearby-grid">
        ${nearbyCards}
      </div>
    </section>`
      : ""}

    <p class="sr-state-link">
      See all <a href="/ski/${stateSlug}">${esc(stateName)} ski mountains</a> ranked by snow, vertical, and value in our state hub.
    </p>

    <p class="sr-disclaimer">
      *Day ticket prices are approximate and vary by date, demand, age, and promotions. Always confirm pricing directly with ${esc(resort.name)} before purchasing.
    </p>

  </main>

  <script src="/newsletter-band.js"></script>

  <footer class="site-footer">
    <p>&copy; ${year} WhereToSkiNext.com &middot; <a href="/#searchSection">Find my mountain</a> &middot; <a href="/about/">About</a> &middot; <a href="/privacy/">Privacy Policy</a> &middot; <a href="/partners/">Partners</a> &middot; <a href="/ski-pass-comparison/">Pass Guides</a></p>
    <p class="site-footer-affiliate">Some links on this site are affiliate links. If you book lodging through them we may earn a small commission at no extra cost to you. This never influences mountain scores or rankings.</p>
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
  <script src="/nav.js"></script>

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
    { loc: 'https://wheretoskinext.com/ski-pass-comparison',            changefreq: 'monthly', priority: '0.9' },
    { loc: 'https://wheretoskinext.com/epic-vs-ikon-northeast',         changefreq: 'monthly', priority: '0.8' },
    { loc: 'https://wheretoskinext.com/epic-vs-ikon-rockies',           changefreq: 'monthly', priority: '0.8' },
    { loc: 'https://wheretoskinext.com/epic-vs-ikon-california',        changefreq: 'monthly', priority: '0.8' },
    { loc: 'https://wheretoskinext.com/epic-vs-ikon-pacific-northwest', changefreq: 'monthly', priority: '0.8' },
    { loc: 'https://wheretoskinext.com/epic-vs-ikon-midwest',           changefreq: 'monthly', priority: '0.8' },
  ];

  const urls = [
    `  <url><loc>https://wheretoskinext.com/</loc><changefreq>daily</changefreq><priority>1.0</priority><lastmod>${today}</lastmod></url>`,
    `  <url><loc>https://wheretoskinext.com/about</loc><changefreq>monthly</changefreq><priority>0.6</priority><lastmod>${today}</lastmod></url>`,
    `  <url><loc>https://wheretoskinext.com/stories</loc><changefreq>monthly</changefreq><priority>0.65</priority><lastmod>${today}</lastmod></url>`,
    `  <url><loc>https://wheretoskinext.com/stories/heres-to-the-two-seaters</loc><changefreq>monthly</changefreq><priority>0.65</priority><lastmod>${today}</lastmod></url>`,
    ...STATIC_PAGES.map(p =>
      `  <url><loc>${p.loc}</loc><changefreq>${p.changefreq}</changefreq><priority>${p.priority}</priority><lastmod>${today}</lastmod></url>`
    ),
    ...skiNearSlugs.map(slug =>
      `  <url><loc>https://wheretoskinext.com/ski-near/${slug}</loc><changefreq>weekly</changefreq><priority>0.85</priority><lastmod>${today}</lastmod></url>`
    ),
    ...states.map(s =>
      `  <url><loc>https://wheretoskinext.com/ski/${slugifyState(s)}</loc><changefreq>weekly</changefreq><priority>0.8</priority><lastmod>${today}</lastmod></url>`
    ),
    ...resorts.map(r =>
      `  <url><loc>https://wheretoskinext.com/ski-report/${r.id}</loc><changefreq>daily</changefreq><priority>0.9</priority><lastmod>${today}</lastmod></url>`
    ),
  ];
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>`;
}

// ─── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  const resorts = loadResorts();
  console.log(`Loaded ${resorts.length} resorts`);

  // Validate editorial entries against actual resort IDs. A typo here would
  // silently fail (page falls back to template), so we warn loudly at build.
  const editorialIds = Object.keys(MOUNTAIN_EDITORIAL);
  if (editorialIds.length > 0) {
    const validIds = new Set(resorts.map(r => r.id));
    const unmatched = editorialIds.filter(id => !validIds.has(id));
    const matched   = editorialIds.length - unmatched.length;
    console.log(`Loaded editorial for ${matched}/${editorialIds.length} mountains`);
    if (unmatched.length > 0) {
      console.warn('  ⚠ Editorial entries with no matching resort.id (rename in mountain-editorial.js):');
      for (const id of unmatched) console.warn(`     - "${id}"`);
    }
  }

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
