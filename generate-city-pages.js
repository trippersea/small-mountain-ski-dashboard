// ═══════════════════════════════════════════════════════════════════════════
// generate-city-pages.js
// Generates /ski-near/{city}/index.html for major feeder cities
// Run from project root: node generate-city-pages.js
// ═══════════════════════════════════════════════════════════════════════════

const fs   = require('fs');
const path = require('path');

// ─── Load resort data ────────────────────────────────────────────────────────
function loadResorts() {
  const sdData  = fs.readFileSync('./sd-data.js', 'utf8');
  const natData = fs.readFileSync('./resorts-national.js', 'utf8');
  const neScope  = new Function(sdData.replace(/const RESORTS\s*=[\s\S]*$/, '') + '; return RESORTS_NE;');
  const natScope = new Function(natData + '; return RESORTS_NATIONAL;');
  return [...neScope(), ...natScope()];
}

const RESORTS = loadResorts();

// ─── City definitions ─────────────────────────────────────────────────────────
const CITIES = [
  {
    name: 'Boston', slug: 'boston', lat: 42.3601, lon: -71.0589,
    state: 'MA', region: 'New England',
    intro: 'Boston sits at the center of one of the best ski corridors in the country. Vermont, New Hampshire, Maine, and western Massachusetts are all within striking distance — and depending on what you\'re looking for, you\'ve got everything from quick after-work hills to serious destination resorts.',
    driveNote: 'Traffic on I-93 and I-89 can add time on Friday afternoons. Plan to leave by 2pm or after 7pm if you want a clean drive north.',
    appUrl: 'https://www.wheretoskinext.com/?loc=Boston%2C+MA&lat=42.3601&lon=-71.0589',
  },
  {
    name: 'New York City', slug: 'nyc', lat: 40.7128, lon: -74.0060,
    state: 'NY', region: 'Northeast',
    intro: 'New York City skiers have more options than most people realize. The Catskills are under two hours from midtown, Vermont is a committed but rewarding drive, and there are solid day-trip mountains in New Jersey and Pennsylvania that most people overlook.',
    driveNote: 'Getting out of the city is the hardest part. The George Washington Bridge and I-87 north can be brutal on Friday evenings — leaving after 8pm or taking the train to Rhinecliff for Catskill resorts can save an hour or more.',
    appUrl: 'https://www.wheretoskinext.com/?loc=New+York%2C+NY&lat=40.7128&lon=-74.0060',
  },
  {
    name: 'Philadelphia', slug: 'philadelphia', lat: 39.9526, lon: -75.1652,
    state: 'PA', region: 'Mid-Atlantic',
    intro: 'Philadelphia is better positioned for skiing than most people think. The Pocono Mountains start less than 90 minutes away, and with the right pass, you can access some legitimately good terrain. Vermont and upstate New York require a full weekend commitment, but it\'s absolutely worth it when the snow lines up.',
    driveNote: 'The Poconos are easy — I-78 west or I-476 north get you there in 90 minutes flat outside of peak times. Budget an extra hour for Vermont trips versus what Google Maps says on a Friday.',
    appUrl: 'https://www.wheretoskinext.com/?loc=Philadelphia%2C+PA&lat=39.9526&lon=-75.1652',
  },
  {
    name: 'Washington DC', slug: 'washington-dc', lat: 38.9072, lon: -77.0369,
    state: 'DC', region: 'Mid-Atlantic',
    intro: 'Washington DC skiers have to work a little harder than their northeast counterparts, but the options are better than most expect. West Virginia is a solid 2.5 hour drive, Pennsylvania resorts are reachable for a long day, and with a full weekend you can reach Vermont or upstate New York.',
    driveNote: 'Getting out of DC on a Friday is the main battle. I-66 west and I-270 north both suffer. Leave before noon or plan for a Saturday morning start — the mountain will still be there.',
    appUrl: 'https://www.wheretoskinext.com/?loc=Washington%2C+DC&lat=38.9072&lon=-77.0369',
  },
  {
    name: 'Denver', slug: 'denver', lat: 39.7392, lon: -104.9903,
    state: 'CO', region: 'Rocky Mountain',
    intro: 'Denver is one of the best-positioned ski cities in the world. World-class resorts start less than an hour away and keep getting better as you head into the mountains. The challenge isn\'t finding somewhere to ski — it\'s deciding which direction to go.',
    driveNote: 'I-70 west is the main artery and it gets congested on weekends. Chain laws apply during storms. Keystone and Arapahoe Basin are the closest serious options if you want to avoid the I-70 crunch.',
    appUrl: 'https://www.wheretoskinext.com/?loc=Denver%2C+CO&lat=39.7392&lon=-104.9903',
  },
  {
    name: 'Salt Lake City', slug: 'salt-lake-city', lat: 40.7608, lon: -111.8910,
    state: 'UT', region: 'Rocky Mountain',
    intro: 'Salt Lake City has arguably the best ski access of any major US city. Alta, Snowbird, Brighton, and Solitude are all within 30 minutes of downtown. The snow quality — the famous Utah light and dry powder — is consistently among the best in North America.',
    driveNote: 'Little Cottonwood Canyon (Alta, Snowbird) closes during avalanche control — check UDOT before heading up on heavy snow days. Big Cottonwood (Brighton, Solitude) is generally more accessible. Both canyons have chain requirements during storms.',
    appUrl: 'https://www.wheretoskinext.com/?loc=Salt+Lake+City%2C+UT&lat=40.7608&lon=-111.8910',
  },
  {
    name: 'Seattle', slug: 'seattle', lat: 47.6062, lon: -122.3321,
    state: 'WA', region: 'Pacific Northwest',
    intro: 'Seattle skiers have excellent options within a short drive. Snoqualmie Pass is the closest, Crystal Mountain is the most serious, and Stevens Pass splits the difference. The Pacific Northwest snowpack is heavy and wet compared to interior powder — but the mountains are dramatic and the season is long.',
    driveNote: 'Mountain passes can close during heavy snowfall. Check WSDOT pass reports before heading out. Snoqualmie is the most reliable for quick access; Stevens and Crystal require more planning on storm days.',
    appUrl: 'https://www.wheretoskinext.com/?loc=Seattle%2C+WA&lat=47.6062&lon=-122.3321',
  },
  {
    name: 'Portland', slug: 'portland', lat: 45.5051, lon: -122.6750,
    state: 'OR', region: 'Pacific Northwest',
    intro: 'Portland sits right at the base of Mt. Hood, which means world-class skiing starts less than an hour away. Mt. Hood Meadows, Timberline, and Skibowl offer genuinely different experiences all on the same mountain. When you want more variety, central Oregon mountains are a few hours east.',
    driveNote: 'US-26 east to Mt. Hood is straightforward but can get congested on weekend mornings. Check ODOT for road conditions — the highway closes during severe weather. Timberline is open year-round including summer skiing on Palmer Snowfield.',
    appUrl: 'https://www.wheretoskinext.com/?loc=Portland%2C+OR&lat=45.5051&lon=-122.6750',
  },
  {
    name: 'Chicago', slug: 'chicago', lat: 41.8781, lon: -87.6298,
    state: 'IL', region: 'Midwest',
    intro: 'Chicago skiers have to be honest with themselves: there are no serious mountains within a short drive. The local hills in Wisconsin and Illinois are great for beginners, night skiing, and staying sharp mid-week. But if you want real vertical — Upper Michigan, Minnesota, or a full weekend trip to Colorado — you need to plan for it.',
    driveNote: 'Midwest skiing is a different mindset than mountain skiing. Embrace the local hills for convenience and budget one or two bigger trips per season to real mountains. Denver is a 2-hour flight — often the smartest play.',
    appUrl: 'https://www.wheretoskinext.com/?loc=Chicago%2C+IL&lat=41.8781&lon=-87.6298',
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

  const title    = `Best Ski Resorts Near ${city.name} — Ranked by Drive Time & Snow`;
  const metaDesc = `${total} ski resorts within 6 hours of ${city.name}. Compare snow forecast, drive time, and pass access to find your best day on the slopes this weekend.`;

  function resortCard(r, showDrive = true) {
    if (!r) return '';
    const tb  = r.terrainBreakdown || {};
    const beg = Math.round((tb.beginner || 0) * 100);
    const adv = Math.round((tb.advanced  || 0) * 100);
    return `<a href="https://www.wheretoskinext.com/ski-report/${r.id}/" class="resort-card">
      <div class="rc-name">${r.name}</div>
      <div class="rc-meta">
        ${r.state}
        ${showDrive ? `· ${formatDrive(r.mins)} drive` : ''}
        · ${r.vertical.toLocaleString()} ft
        · $${r.price}
      </div>
      <div class="rc-chips">
        <span class="rc-chip">${passLabel(r.passGroup)}</span>
        ${r.avgSnowfall >= 200 ? '<span class="rc-chip rc-chip--snow">❅ ' + r.avgSnowfall + '" avg</span>' : ''}
        ${beg >= 40 ? '<span class="rc-chip rc-chip--green">Beginner friendly</span>' : ''}
        ${adv >= 35 ? '<span class="rc-chip rc-chip--blue">Expert terrain</span>' : ''}
      </div>
    </a>`;
  }

  function bandSection(label, bandResorts, desc) {
    if (!bandResorts.length) return '';
    return `
    <div class="band-section">
      <h2 class="band-title">${label}</h2>
      <p class="band-desc">${desc}</p>
      <div class="resort-grid">
        ${bandResorts.slice(0, 8).map(r => resortCard(r)).join('')}
      </div>
      ${bandResorts.length > 8 ? `<p class="band-more">+ ${bandResorts.length - 8} more mountains in this range</p>` : ''}
    </div>`;
  }

  function pickCard(label, r, reason) {
    if (!r) return '';
    return `<div class="pick-card">
      <div class="pick-label">${label}</div>
      <div class="pick-name"><a href="https://www.wheretoskinext.com/ski-report/${r.id}/">${r.name}</a></div>
      <div class="pick-reason">${reason}</div>
      <div class="pick-meta">${r.state} · ${formatDrive(r.mins)} · $${r.price} · ${passLabel(r.passGroup)}</div>
    </div>`;
  }

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
  <meta name="description" content="${metaDesc}" />
  <link rel="canonical" href="https://www.wheretoskinext.com/ski-near/${city.slug}/" />

  <meta property="og:title" content="${title}" />
  <meta property="og:description" content="${metaDesc}" />
  <meta property="og:url" content="https://www.wheretoskinext.com/ski-near/${city.slug}/" />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="WhereToSkiNext.com" />

  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Best Ski Resorts Near ${city.name}",
    "description": "${metaDesc}",
    "url": "https://www.wheretoskinext.com/ski-near/${city.slug}/",
    "numberOfItems": ${total},
    "itemListElement": [
      ${resorts.slice(0, 10).map((r, i) => `{
        "@type": "ListItem",
        "position": ${i + 1},
        "name": "${r.name}",
        "url": "https://www.wheretoskinext.com/ski-report/${r.id}/"
      }`).join(',\n      ')}
    ]
  }
  </script>

  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
  <link rel="icon" href="/ski-decision-logo.png" type="image/png" />

  <style>
    *, *::before, *::after { box-sizing: border-box; }
    html { scroll-behavior: smooth; }
    body { font-family: 'DM Sans', system-ui, sans-serif; background: linear-gradient(180deg,#f7fbff,#eef5fb); color: #1b2a3a; margin: 0; line-height: 1.6; }

    /* Nav */
    .top-nav { position: sticky; top: 0; z-index: 100; backdrop-filter: blur(14px); background: rgba(255,255,255,.92); border-bottom: 1px solid #d6e1f0; }
    .top-nav-inner { max-width: 1100px; margin: 0 auto; padding: 10px 20px; display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
    .nav-brand { font-weight: 800; font-size: 16px; color: #2b6de9; text-decoration: none; margin-right: 8px; }
    .nav-link { padding: 6px 12px; border-radius: 8px; text-decoration: none; color: #1b2a3a; font-weight: 600; font-size: 13px; transition: background .12s; }
    .nav-link:hover { background: #edf4ff; color: #2b6de9; }
    .nav-cta { background: #2b6de9; color: #fff !important; border-radius: 999px; padding: 7px 16px; }
    .nav-cta:hover { background: #1d5fd4; }

    /* Layout */
    .page { max-width: 960px; margin: 0 auto; padding: 40px 20px 80px; }

    /* Breadcrumb */
    .breadcrumb { font-size: 13px; color: #667a96; margin-bottom: 28px; }
    .breadcrumb a { color: #2b6de9; text-decoration: none; font-weight: 500; }

    /* Hero */
    .hero-eyebrow { font-size: 12px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; color: #2b6de9; margin-bottom: 12px; }
    .hero-title { font-size: clamp(26px,5vw,44px); font-weight: 800; letter-spacing: -.02em; line-height: 1.1; margin: 0 0 16px; }
    .hero-intro { font-size: 17px; color: #2e3f54; line-height: 1.75; margin: 0 0 24px; max-width: 720px; }
    .hero-stats { display: flex; gap: 24px; flex-wrap: wrap; margin-bottom: 32px; }
    .hero-stat { }
    .hero-stat-num { font-size: 28px; font-weight: 800; color: #2b6de9; }
    .hero-stat-label { font-size: 13px; color: #667a96; font-weight: 600; }

    /* CTA banner */
    .cta-banner { background: linear-gradient(135deg,#edf4ff,#f7fbff); border: 1.5px solid #bfdbfe; border-radius: 16px; padding: 20px 24px; margin-bottom: 40px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 14px; }
    .cta-banner-text h2 { font-size: 16px; font-weight: 800; color: #1e40af; margin: 0 0 4px; }
    .cta-banner-text p  { font-size: 13px; color: #1d4ed8; margin: 0; }
    .cta-btn { display: inline-flex; align-items: center; gap: 6px; background: #2b6de9; color: #fff; border-radius: 999px; padding: 10px 20px; font-weight: 700; font-size: 14px; text-decoration: none; white-space: nowrap; box-shadow: 0 4px 14px rgba(43,109,233,.3); }
    .cta-btn:hover { background: #1d5fd4; }

    /* Top picks */
    .picks-section { margin-bottom: 48px; }
    .section-title { font-size: 22px; font-weight: 800; margin: 0 0 6px; }
    .section-sub   { font-size: 15px; color: #667a96; margin: 0 0 20px; }
    .picks-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 14px; }
    .pick-card { background: #fff; border: 1px solid #d6e1f0; border-radius: 14px; padding: 16px 18px; box-shadow: 0 2px 8px rgba(30,60,100,.05); }
    .pick-label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .06em; color: #667a96; margin-bottom: 6px; }
    .pick-name { font-size: 17px; font-weight: 800; margin-bottom: 6px; }
    .pick-name a { color: #1b2a3a; text-decoration: none; }
    .pick-name a:hover { color: #2b6de9; }
    .pick-reason { font-size: 13px; color: #2e3f54; margin-bottom: 8px; line-height: 1.5; }
    .pick-meta { font-size: 12px; color: #667a96; }

    /* Drive note */
    .drive-note { background: #fffbeb; border: 1px solid #fde68a; border-radius: 12px; padding: 14px 18px; margin-bottom: 40px; font-size: 14px; color: #92400e; line-height: 1.6; }
    .drive-note strong { font-weight: 700; }

    /* Band sections */
    .band-section { margin-bottom: 48px; }
    .band-title { font-size: 22px; font-weight: 800; margin: 0 0 6px; }
    .band-desc  { font-size: 15px; color: #667a96; margin: 0 0 20px; }
    .band-more  { font-size: 14px; color: #667a96; margin-top: 12px; }
    .resort-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 12px; }

    /* Resort cards */
    .resort-card { display: block; background: #fff; border: 1px solid #d6e1f0; border-radius: 12px; padding: 14px 16px; text-decoration: none; color: #1b2a3a; transition: border-color .12s, box-shadow .12s; }
    .resort-card:hover { border-color: #2b6de9; box-shadow: 0 4px 16px rgba(43,109,233,.1); }
    .rc-name { font-size: 15px; font-weight: 700; margin-bottom: 4px; }
    .rc-meta { font-size: 12px; color: #667a96; margin-bottom: 8px; }
    .rc-chips { display: flex; flex-wrap: wrap; gap: 5px; }
    .rc-chip { font-size: 11px; font-weight: 600; background: #edf4ff; color: #2b6de9; border-radius: 999px; padding: 2px 9px; }
    .rc-chip--snow  { background: #eff6ff; color: #1d4ed8; }
    .rc-chip--green { background: #f0fdf4; color: #16a34a; }
    .rc-chip--blue  { background: #f0f9ff; color: #0369a1; }

    /* Pass section */
    .pass-section { margin-bottom: 48px; }
    .pass-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 12px; margin-top: 16px; }
    .pass-card { background: #fff; border: 1px solid #d6e1f0; border-radius: 12px; padding: 16px; }
    .pass-card-name  { font-size: 15px; font-weight: 800; margin-bottom: 4px; }
    .pass-card-count { font-size: 13px; color: #667a96; margin-bottom: 8px; }
    .pass-card-list  { font-size: 13px; color: #2e3f54; line-height: 1.8; }

    /* Footer */
    footer { text-align: center; padding: 28px 16px; font-size: 12px; color: #94a3b8; border-top: 1px solid #d6e1f0; margin-top: 48px; }
    footer a { color: #2b6de9; text-decoration: none; }

    @media (max-width: 600px) {
      .hero-stats { gap: 16px; }
      .cta-banner { flex-direction: column; }
      .picks-grid, .resort-grid, .pass-grid { grid-template-columns: 1fr; }
    }
  </style>
</head>
<body>

<nav class="top-nav">
  <div class="top-nav-inner">
    <a href="/" class="nav-brand">WhereToSkiNext.com</a>
    <a href="/" class="nav-link">Find My Mountain</a>
    <a href="/about/" class="nav-link">About</a>
    <a href="${city.appUrl}" class="nav-link nav-cta">Live Conditions Near ${city.name} →</a>
  </div>
</nav>

<main class="page">

  <!-- Breadcrumb -->
  <nav class="breadcrumb" aria-label="Breadcrumb">
    <a href="/">Home</a> › <span>Ski Resorts Near ${city.name}</span>
  </nav>

  <!-- Hero -->
  <div class="hero-eyebrow">Skiing Near ${city.name} · ${city.region}</div>
  <h1 class="hero-title">Best Ski Resorts Near ${city.name}</h1>
  <p class="hero-intro">${city.intro}</p>

  <div class="hero-stats">
    ${bands.under2h.length  ? `<div class="hero-stat"><div class="hero-stat-num">${bands.under2h.length}</div><div class="hero-stat-label">resorts under 2 hours</div></div>` : ''}
    ${bands.two3h.length    ? `<div class="hero-stat"><div class="hero-stat-num">${bands.two3h.length}</div><div class="hero-stat-label">resorts 2–3 hours</div></div>` : ''}
    ${bands.three4h.length  ? `<div class="hero-stat"><div class="hero-stat-num">${bands.three4h.length}</div><div class="hero-stat-label">resorts 3–4 hours</div></div>` : ''}
    <div class="hero-stat"><div class="hero-stat-num">${total}</div><div class="hero-stat-label">total within 6 hours</div></div>
  </div>

  <!-- Live CTA -->
  <div class="cta-banner">
    <div class="cta-banner-text">
      <h2>See live snow forecast ranked for ${city.name}</h2>
      <p>Enter your exact starting point for real drive times, pass filters, crowd outlook, and a personalized top pick.</p>
    </div>
    <a href="${city.appUrl}" class="cta-btn">
      Find My Mountain
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
    </a>
  </div>

  <!-- Top Picks -->
  <section class="picks-section">
    <h2 class="section-title">Best picks near ${city.name}</h2>
    <p class="section-sub">Sorted by what matters — not just distance.</p>
    <div class="picks-grid">
      ${pickCard('Closest serious mountain', picks.bestOverall, `The best all-around option at ${formatDrive(picks.bestOverall?.mins || 0)} from ${city.name}, balancing terrain, snow, and drive time.`)}
      ${picks.bestPowder && picks.bestPowder.id !== picks.bestOverall?.id ? pickCard('Best snowfall', picks.bestPowder, `${picks.bestPowder.avgSnowfall}" average annual snowfall — the highest of any resort near ${city.name}.`) : ''}
      ${picks.bestBudget && picks.bestBudget.id !== picks.bestOverall?.id ? pickCard('Best value', picks.bestBudget, `$${picks.bestBudget.price} day ticket — one of the most affordable days on snow within reach of ${city.name}.`) : ''}
      ${picks.bestBeginner && picks.bestBeginner.id !== picks.bestOverall?.id ? pickCard('Best for beginners', picks.bestBeginner, `The most beginner-friendly terrain layout within driving distance of ${city.name}.`) : ''}
    </div>
  </section>

  <!-- Drive note -->
  <div class="drive-note">
    <strong>🚗 Getting there from ${city.name}:</strong> ${city.driveNote}
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

  <!-- Pass breakdown -->
  <section class="pass-section">
    <h2 class="section-title">Pass access near ${city.name}</h2>
    <p class="section-sub">Which passes work within driving distance.</p>
    <div class="pass-grid">
      ${['Epic', 'Ikon', 'Indy', 'Independent'].map(pass => {
        const group = passes[pass] || [];
        if (!group.length) return '';
        return `<div class="pass-card">
          <div class="pass-card-name">${passLabel(pass)}</div>
          <div class="pass-card-count">${group.length} resort${group.length !== 1 ? 's' : ''} within 6 hours</div>
          <div class="pass-card-list">${group.slice(0, 5).map(r => r.name).join(', ')}${group.length > 5 ? ` and ${group.length - 5} more` : ''}</div>
        </div>`;
      }).join('')}
    </div>
  </section>

  <!-- Bottom CTA -->
  <div class="cta-banner">
    <div class="cta-banner-text">
      <h2>Which mountain is best this weekend?</h2>
      <p>Live snow forecast + your drive time + crowds + pass access — one ranking, updated daily.</p>
    </div>
    <a href="${city.appUrl}" class="cta-btn">
      Get My Top Pick →
    </a>
  </div>

</main>

<footer>
  <p>© 2026 WhereToSkiNext.com — <a href="/about/">About</a> · <a href="/privacy/">Privacy Policy</a></p>
  <p style="margin-top:6px"><a href="/">Find the best mountain to ski next →</a></p>
</footer>

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
