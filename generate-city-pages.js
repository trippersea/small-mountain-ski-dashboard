// ═══════════════════════════════════════════════════════════════════════════
// generate-city-pages.js
// Generates /ski-near/{city}/index.html for major feeder cities
// Run from project root: node generate-city-pages.js
// Links site-wide /styles.css + shared .top-nav (see styles.css)
// ═══════════════════════════════════════════════════════════════════════════

const fs   = require('fs');
const path = require('path');

// ─── Load resort data ────────────────────────────────────────────────────────
function loadResorts() {
  // Preferred: single bundled list (keeps generators consistent)
  try {
    // resorts.js exports { RESORTS } via CommonJS
    // eslint-disable-next-line global-require
    const { RESORTS } = require('./resorts.js');
    if (Array.isArray(RESORTS) && RESORTS.length) return RESORTS;
  } catch (e) { /* fall back */ }

  // Legacy fallback: separate NE + National lists
  const sdData  = fs.readFileSync('./sd-data.js', 'utf8');
  const neScope  = new Function(sdData.replace(/const RESORTS\\s*=[\\s\\S]*$/, '') + '; return RESORTS_NE;');
  const ne = neScope();
  let nat = [];
  try {
    const natData = fs.readFileSync('./resorts-national.js', 'utf8');
    const natScope = new Function(natData + '; return RESORTS_NATIONAL;');
    nat = natScope();
  } catch (e) {
    nat = [];
  }

  return [...ne, ...nat];
}

const RESORTS = loadResorts();

// ─── City definitions ─────────────────────────────────────────────────────────
const CITIES = [
  {
    name: 'Boston', slug: 'boston', lat: 42.3601, lon: -71.0589,
    state: 'MA', region: 'New England',
    intro: 'Boston sits at the center of one of the best ski corridors in the country. Vermont, New Hampshire, Maine, and western Massachusetts are all within striking distance — and depending on what you\'re looking for, you\'ve got everything from quick after-work hills to serious destination resorts.',
    driveNote: 'Traffic on I-93 and I-89 can add time on Friday afternoons. Plan to leave by 2pm or after 7pm if you want a clean drive north.',
    appUrl: 'https://wheretoskinext.com/?loc=Boston%2C+MA&lat=42.3601&lon=-71.0589',
  },
  {
    name: 'New York City', slug: 'nyc', lat: 40.7128, lon: -74.0060,
    state: 'NY', region: 'Northeast',
    intro: 'New York City skiers have more options than most people realize. The Catskills are under two hours from midtown, Vermont is a committed but rewarding drive, and there are solid day-trip mountains in New Jersey and Pennsylvania that most people overlook.',
    driveNote: 'Getting out of the city is the hardest part. The George Washington Bridge and I-87 north can be brutal on Friday evenings — leaving after 8pm or taking the train to Rhinecliff for Catskill resorts can save an hour or more.',
    appUrl: 'https://wheretoskinext.com/?loc=New+York%2C+NY&lat=40.7128&lon=-74.0060',
  },
  {
    name: 'Philadelphia', slug: 'philadelphia', lat: 39.9526, lon: -75.1652,
    state: 'PA', region: 'Mid-Atlantic',
    intro: 'Philadelphia is better positioned for skiing than most people think. The Pocono Mountains start less than 90 minutes away, and with the right pass, you can access some legitimately good terrain. Vermont and upstate New York require a full weekend commitment, but it\'s absolutely worth it when the snow lines up.',
    driveNote: 'The Poconos are easy — I-78 west or I-476 north get you there in 90 minutes flat outside of peak times. Budget an extra hour for Vermont trips versus what Google Maps says on a Friday.',
    appUrl: 'https://wheretoskinext.com/?loc=Philadelphia%2C+PA&lat=39.9526&lon=-75.1652',
  },
  {
    name: 'Washington DC', slug: 'washington-dc', lat: 38.9072, lon: -77.0369,
    state: 'DC', region: 'Mid-Atlantic',
    intro: 'Washington DC skiers have to work a little harder than their northeast counterparts, but the options are better than most expect. West Virginia is a solid 2.5 hour drive, Pennsylvania resorts are reachable for a long day, and with a full weekend you can reach Vermont or upstate New York.',
    driveNote: 'Getting out of DC on a Friday is the main battle. I-66 west and I-270 north both suffer. Leave before noon or plan for a Saturday morning start — the mountain will still be there.',
    appUrl: 'https://wheretoskinext.com/?loc=Washington%2C+DC&lat=38.9072&lon=-77.0369',
  },
  {
    name: 'Denver', slug: 'denver', lat: 39.7392, lon: -104.9903,
    state: 'CO', region: 'Rocky Mountain',
    intro: 'Denver is one of the best-positioned ski cities in the world. World-class resorts start less than an hour away and keep getting better as you head into the mountains. The challenge isn\'t finding somewhere to ski — it\'s deciding which direction to go.',
    driveNote: 'I-70 west is the main artery and it gets congested on weekends. Chain laws apply during storms. Keystone and Arapahoe Basin are the closest serious options if you want to avoid the I-70 crunch.',
    appUrl: 'https://wheretoskinext.com/?loc=Denver%2C+CO&lat=39.7392&lon=-104.9903',
  },
  {
    name: 'Salt Lake City', slug: 'salt-lake-city', lat: 40.7608, lon: -111.8910,
    state: 'UT', region: 'Rocky Mountain',
    intro: 'Salt Lake City has arguably the best ski access of any major US city. Alta, Snowbird, Brighton, and Solitude are all within 30 minutes of downtown. The snow quality — the famous Utah light and dry powder — is consistently among the best in North America.',
    driveNote: 'Little Cottonwood Canyon (Alta, Snowbird) closes during avalanche control — check UDOT before heading up on heavy snow days. Big Cottonwood (Brighton, Solitude) is generally more accessible. Both canyons have chain requirements during storms.',
    appUrl: 'https://wheretoskinext.com/?loc=Salt+Lake+City%2C+UT&lat=40.7608&lon=-111.8910',
  },
  {
    name: 'Seattle', slug: 'seattle', lat: 47.6062, lon: -122.3321,
    state: 'WA', region: 'Pacific Northwest',
    intro: 'Seattle skiers have excellent options within a short drive. Snoqualmie Pass is the closest, Crystal Mountain is the most serious, and Stevens Pass splits the difference. The Pacific Northwest snowpack is heavy and wet compared to interior powder — but the mountains are dramatic and the season is long.',
    driveNote: 'Mountain passes can close during heavy snowfall. Check WSDOT pass reports before heading out. Snoqualmie is the most reliable for quick access; Stevens and Crystal require more planning on storm days.',
    appUrl: 'https://wheretoskinext.com/?loc=Seattle%2C+WA&lat=47.6062&lon=-122.3321',
  },
  {
    name: 'Portland', slug: 'portland', lat: 45.5051, lon: -122.6750,
    state: 'OR', region: 'Pacific Northwest',
    intro: 'Portland sits right at the base of Mt. Hood, which means world-class skiing starts less than an hour away. Mt. Hood Meadows, Timberline, and Skibowl offer genuinely different experiences all on the same mountain. When you want more variety, central Oregon mountains are a few hours east.',
    driveNote: 'US-26 east to Mt. Hood is straightforward but can get congested on weekend mornings. Check ODOT for road conditions — the highway closes during severe weather. Timberline is open year-round including summer skiing on Palmer Snowfield.',
    appUrl: 'https://wheretoskinext.com/?loc=Portland%2C+OR&lat=45.5051&lon=-122.6750',
  },
  {
    name: 'Chicago', slug: 'chicago', lat: 41.8781, lon: -87.6298,
    state: 'IL', region: 'Midwest',
    intro: 'Chicago skiers have to be honest with themselves: there are no serious mountains within a short drive. The local hills in Wisconsin and Illinois are great for beginners, night skiing, and staying sharp mid-week. But if you want real vertical — Upper Michigan, Minnesota, or a full weekend trip to Colorado — you need to plan for it.',
    driveNote: 'Midwest skiing is a different mindset than mountain skiing. Embrace the local hills for convenience and budget one or two bigger trips per season to real mountains. Denver is a 2-hour flight — often the smartest play.',
    appUrl: 'https://wheretoskinext.com/?loc=Chicago%2C+IL&lat=41.8781&lon=-87.6298',
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function haversineKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLon/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

function kmToMiles(km)  { return Math.round(km * 0.621371); }
function kmToDriveMins(km) { return Math.round(km * 1.15 / 65 * 60 + 15); }
function formatDrive(mins) {
  const h = Math.floor(mins / 60), m = mins % 60;
  return m ? `${h}h ${m}m` : `${h}h`;
}

function getResortsByDistance(city) {
  return RESORTS
    .map(r => {
      const km   = haversineKm(city.lat, city.lon, r.lat, r.lon);
      const mins = kmToDriveMins(km);
      return { ...r, km, mins, miles: kmToMiles(km) };
    })
    .filter(r => r.mins <= 360) // 6 hour max
    .sort((a, b) => a.mins - b.mins);
}

function getBands(resorts) {
  return {
    under2h:  resorts.filter(r => r.mins <= 120),
    two3h:    resorts.filter(r => r.mins > 120 && r.mins <= 180),
    three4h:  resorts.filter(r => r.mins > 180 && r.mins <= 240),
    four6h:   resorts.filter(r => r.mins > 240 && r.mins <= 360),
  };
}

function passLabel(p) {
  return { Epic: 'Epic Pass', Ikon: 'Ikon Pass', Indy: 'Indy Pass', Independent: 'Independent' }[p] || p;
}

function bestPicks(resorts, city) {
  const picks = {
    bestOverall:   resorts.slice(0, 1)[0],
    bestBudget:    [...resorts].filter(r => r.price < 85).sort((a,b) => a.price - b.price)[0],
    bestPowder:    [...resorts].sort((a,b) => b.avgSnowfall - a.avgSnowfall)[0],
    bestBeginner:  [...resorts].sort((a,b) => (b.terrainBreakdown?.beginner||0) - (a.terrainBreakdown?.beginner||0))[0],
    bestExpert:    [...resorts].filter(r => r.vertical >= 1500).sort((a,b) => (b.terrainBreakdown?.advanced||0) - (a.terrainBreakdown?.advanced||0))[0],
    bestFamily:    [...resorts].filter(r => r.price < 120).sort((a,b) => (b.terrainBreakdown?.beginner||0) - (a.terrainBreakdown?.beginner||0))[0],
  };
  return picks;
}

// ─── Pass breakdown ───────────────────────────────────────────────────────────
function passBreakdown(resorts) {
  const groups = { Epic: [], Ikon: [], Indy: [], Independent: [] };
  for (const r of resorts) {
    if (groups[r.passGroup]) groups[r.passGroup].push(r);
  }
  return groups;
}

// ─── HTML Generator ──────────────────────────────────────────────────────────
function generatePage(city) {
  const resorts = getResortsByDistance(city);
  const bands   = getBands(resorts);
  const picks   = bestPicks(resorts, city);
  const passes  = passBreakdown(resorts);
  const total   = resorts.length;

  const title    = `Ski Resorts Near ${city.name} — Find Your Best Mountain This Weekend`;
  const metaDesc = `${total} ski resorts near ${city.name} scored by live snow forecast, real drive time, and crowd outlook. Enter your location for one personalized pick — free, no account needed.`;

  function resortCard(r, showDrive = true) {
    if (!r) return '';
    const tb  = r.terrainBreakdown || {};
    const beg = Math.round((tb.beginner || 0) * 100);
    const adv = Math.round((tb.advanced  || 0) * 100);
    return `<a href="https://wheretoskinext.com/ski-report/${r.id}" class="sn-resort-card">
      <div class="sn-rc-name">${r.name}</div>
      <div class="sn-rc-meta">
        ${r.state}
        ${showDrive ? `· ${formatDrive(r.mins)} drive` : ''}
        · ${r.vertical.toLocaleString()} ft
        · $${r.price}
      </div>
      <div class="sn-rc-chips">
        <span class="sn-rc-chip">${passLabel(r.passGroup)}</span>
        ${r.avgSnowfall >= 200 ? '<span class="sn-rc-chip sn-rc-chip--snow">' + r.avgSnowfall + '" avg snow</span>' : ''}
        ${beg >= 40 ? '<span class="sn-rc-chip sn-rc-chip--green">Beginner friendly</span>' : ''}
        ${adv >= 35 ? '<span class="sn-rc-chip sn-rc-chip--blue">Expert terrain</span>' : ''}
      </div>
    </a>`;
  }

  function bandSection(label, bandResorts, desc) {
    if (!bandResorts.length) return '';
    return `
    <section class="sn-band">
      <h2 class="sn-band-title">${label}</h2>
      <p class="sn-band-desc">${desc}</p>
      <div class="sn-resort-grid">
        ${bandResorts.slice(0, 8).map(r => resortCard(r)).join('')}
      </div>
      ${bandResorts.length > 8 ? `<p class="sn-band-more">+ ${bandResorts.length - 8} more mountains in this range</p>` : ''}
    </section>`;
  }

  function pickCard(label, r, reason) {
    if (!r) return '';
    return `<article class="sn-pick-card">
      <div class="sn-pick-label">${label}</div>
      <h3 class="sn-pick-name"><a href="https://wheretoskinext.com/ski-report/${r.id}">${r.name}</a></h3>
      <p class="sn-pick-reason">${reason}</p>
      <p class="sn-pick-meta">${r.state} · ${formatDrive(r.mins)} · $${r.price} · ${passLabel(r.passGroup)}</p>
    </article>`;
  }

  const topNav = `<nav class="top-nav" role="navigation" aria-label="Main navigation">
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
      <a href="/ski-pass-comparison" class="nav-primary">Pass Guides</a>
      <span class="nav-link-sep" aria-hidden="true"></span>
      <div class="nav-subscribe-wrap">
        <button class="nav-subscribe-btn" id="navSubBtn" aria-expanded="false" aria-haspopup="true">Subscribe &#9662;</button>
        <div class="nav-subscribe-dropdown" id="navSubDropdown">
          <div id="navSubForm">
            <div class="nav-subscribe-kicker">Next winter</div>
            <p class="nav-subscribe-headline">First powder. First to know.</p>
            <p class="nav-subscribe-sub">One email when the site goes live for next season.</p>
            <div class="nav-subscribe-row">
              <input
                type="email"
                id="navSubEmail"
                class="nav-subscribe-input"
                placeholder="you@email.com"
                autocomplete="email"
                spellcheck="false"
              />
              <button id="navSubSubmit" class="nav-subscribe-submit" type="button">Notify me</button>
            </div>
            <p id="navSubErr" class="nav-subscribe-err" role="alert"></p>
            <p class="nav-subscribe-fine">One email. No spam. Unsubscribe anytime.</p>
          </div>
          <div id="navSubOk" class="nav-subscribe-ok">
            <div class="nav-subscribe-ok-icon">&#10003;</div>
            <p class="nav-subscribe-ok-head">You're on the list</p>
            <p class="nav-subscribe-ok-sub">See you next season.</p>
          </div>
        </div>
      </div>
      <a href="${city.appUrl}" class="nav-find-cta">Find My Mountain →</a>
    </div>
  </nav>`;

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
  <title>${title}</title>
  <meta name="description" content="${metaDesc}" />
  <link rel="canonical" href="https://wheretoskinext.com/ski-near/${city.slug}" />

  <meta property="og:title" content="${title}" />
  <meta property="og:description" content="${metaDesc}" />
  <meta property="og:url" content="https://wheretoskinext.com/ski-near/${city.slug}" />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="WhereToSkiNext.com" />
  <meta property="og:image" content="https://wheretoskinext.com/wtsn-og.png" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${title}" />
  <meta name="twitter:description" content="${metaDesc}" />
  <meta name="twitter:image" content="https://wheretoskinext.com/wtsn-og.png" />

  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Best Ski Resorts Near ${city.name}",
    "description": "${metaDesc}",
    "url": "https://wheretoskinext.com/ski-near/${city.slug}",
    "numberOfItems": ${total},
    "itemListElement": [
      ${resorts.slice(0, 10).map((r, i) => `{
        "@type": "ListItem",
        "position": ${i + 1},
        "name": "${r.name}",
        "url": "https://wheretoskinext.com/ski-report/${r.id}"
      }`).join(',\n      ')}
    ]
  }
  </script>

  <link rel="preload" href="/hero-bg.jpg" as="image" type="image/jpeg" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Newsreader:ital,opsz,wght@0,8..60,400;0,8..60,600;0,8..60,700&display=swap" rel="stylesheet" media="print" onload="this.media='all'" />
  <noscript><link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Newsreader:ital,opsz,wght@0,8..60,400;0,8..60,600;0,8..60,700&display=swap" rel="stylesheet" /></noscript>
  <link rel="preload" href="/styles.css" as="style" />
  <link rel="stylesheet" href="/styles.css" />
  <link rel="stylesheet" href="/ski-pass-comparison/pass-comparison-page.css" />
  <link rel="stylesheet" href="/ski/state-page.css" />
  <link rel="stylesheet" href="/ski-near/city-page.css" />
  <link rel="stylesheet" href="/newsletter-band.css" />
  <link rel="stylesheet" href="/site-tokens-bridge.css" />
  <link rel="icon" href="/wtsn-favicon.svg" type="image/svg+xml" />
</head>
<body class="pass-page-body state-page city-page">

${topNav}

<main class="pp-shell sp-page">

  <nav class="sp-breadcrumb" aria-label="Breadcrumb">
    <a href="/">Home</a>
    <span class="sp-breadcrumb-sep">/</span>
    <span>Ski resorts near ${city.name}</span>
  </nav>

  <header class="sp-hero">
    <div class="sp-hero-inner">
      <div class="sp-hero-grid">
        <div>
          <p class="sp-eyebrow">Skiing near ${city.name} · ${city.region}</p>
          <h1 class="sp-title">Best Ski Resorts Near ${city.name} This Weekend</h1>
          <p class="sp-lede">${city.intro}</p>
          <div class="sp-hero-cta">
            <a href="${city.appUrl}" class="sp-btn sp-btn--primary">Find my mountain</a>
          </div>
          <p class="sp-hero-trust">Current snow, drive time, pass access, and crowd outlook. Pick your weekend and we'll rank the options.</p>
        </div>
        <aside class="sp-hero-aside">
          <div class="sp-metric-grid">
            ${bands.under2h.length  ? `<div class="sp-metric"><strong>${bands.under2h.length}</strong><span>Under 2 hours</span></div>` : ''}
            ${bands.two3h.length    ? `<div class="sp-metric"><strong>${bands.two3h.length}</strong><span>2–3 hours</span></div>` : ''}
            ${bands.three4h.length  ? `<div class="sp-metric"><strong>${bands.three4h.length}</strong><span>3–4 hours</span></div>` : ''}
            <div class="sp-metric"><strong>${total}</strong><span>Within 6 hours</span></div>
          </div>
        </aside>
      </div>
    </div>
  </header>

  <div class="sn-cta-band">
    <div>
      <h2>Get your personalized pick for this weekend</h2>
      <p>Enter your exact starting point — we score every mountain by live snow, real drive time, pass access, and crowd outlook, and give you one clear answer.</p>
      <p class="sn-cta-fine">Scores are independent — resort sponsors never influence rankings.</p>
    </div>
    <a href="${city.appUrl}" class="sp-btn sp-btn--primary">Find my mountain &rarr;</a>
  </div>

  <section class="sn-section">
    <div class="sn-section-head">
      <h2 class="sn-section-title">Best picks near ${city.name}</h2>
      <p class="sn-section-sub">Sorted by what matters — not just distance.</p>
    </div>
    <div class="sn-pick-grid">
      ${pickCard('Closest serious mountain', picks.bestOverall, `The best all-around option at ${formatDrive(picks.bestOverall?.mins || 0)} from ${city.name}, balancing terrain, snow, and drive time.`)}
      ${picks.bestPowder && picks.bestPowder.id !== picks.bestOverall?.id ? pickCard('Best snowfall', picks.bestPowder, `${picks.bestPowder.avgSnowfall}" average annual snowfall — the highest of any resort near ${city.name}.`) : ''}
      ${picks.bestBudget && picks.bestBudget.id !== picks.bestOverall?.id ? pickCard('Best value', picks.bestBudget, `$${picks.bestBudget.price} day ticket — one of the most affordable days on snow within reach of ${city.name}.`) : ''}
      ${picks.bestBeginner && picks.bestBeginner.id !== picks.bestOverall?.id ? pickCard('Best for beginners', picks.bestBeginner, `The most beginner-friendly terrain layout within driving distance of ${city.name}.`) : ''}
    </div>
  </section>

  <div class="sn-callout">
    <strong>Getting there from ${city.name}:</strong> ${city.driveNote}
  </div>

  <!-- By Distance -->
  ${bandSection(
    `Under 2 hours from ${city.name}`,
    bands.under2h,
    `Quick day trips — you can be on the slopes by morning and home for dinner.`
  )}
  ${bandSection(
    `2–3 hours from ${city.name}`,
    bands.two3h,
    `Worth a dedicated day. Leave early, get full laps in, head back the same night.`
  )}
  ${bandSection(
    `3–4 hours from ${city.name}`,
    bands.three4h,
    `Weekend territory — better as a two-day trip to make the drive worthwhile.`
  )}
  ${bands.four6h.length ? bandSection(
    `4–6 hours from ${city.name}`,
    bands.four6h,
    `Destination trips only. Plan a long weekend — these mountains earn the drive.`
  ) : ''}

  <section class="sn-section">
    <div class="sn-section-head">
      <h2 class="sn-section-title">Pass access near ${city.name}</h2>
      <p class="sn-section-sub">Which passes work within driving distance.</p>
    </div>
    <div class="sn-pass-grid">
      ${['Epic', 'Ikon', 'Indy', 'Independent'].map(pass => {
        const group = passes[pass] || [];
        if (!group.length) return '';
        return `<article class="sn-pass-card">
          <div class="sn-pass-card-name">${passLabel(pass)}</div>
          <div class="sn-pass-card-count">${group.length} resort${group.length !== 1 ? 's' : ''} within 6 hours</div>
          <div class="sn-pass-card-list">${group.slice(0, 5).map(r => r.name).join(', ')}${group.length > 5 ? ` and ${group.length - 5} more` : ''}</div>
        </article>`;
      }).join('')}
    </div>
  </section>

  <div class="sn-cta-band">
    <div>
      <h2>Which mountain is best this weekend?</h2>
      <p>Live snow + your drive time + pass + crowds — one answer, updated daily. Stop researching. Start skiing.</p>
    </div>
    <a href="${city.appUrl}" class="sp-btn sp-btn--primary">Get my top pick &rarr;</a>
  </div>

</main>

<script src="/newsletter-band.js"></script>

<footer class="site-footer">
  <p>&copy; 2026 WhereToSkiNext.com &middot; <a href="/#searchSection">Find my mountain</a> &middot; <a href="/about">About</a> &middot; <a href="/privacy">Privacy Policy</a> &middot; <a href="/partners">Partners</a> &middot; <a href="/ski-pass-comparison">Pass Guides</a></p>
</footer>

<script src="/nav.js"></script>
</body>
</html>`;
}

// ─── Run ──────────────────────────────────────────────────────────────────────
let count = 0;
for (const city of CITIES) {
  const dir = path.join('ski-near', city.slug);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), generatePage(city), 'utf8');
  console.log(`✅ ${city.name} — ${getResortsByDistance(city).length} resorts`);
  count++;
}
console.log(`\n✅ Generated ${count} city pages in ./ski-near/`);
