// ═══════════════════════════════════════════════════════════════════════════
// generate-resort-content.js
// Classifies each resort into an archetype and generates rich narrative
// content for the "About" section of each ski-report page.
//
// Run from project root: node generate-resort-content.js
// Output: updates ski-report/{id}/index.html with enriched content
// ═══════════════════════════════════════════════════════════════════════════

const fs   = require('fs');
const path = require('path');

// ─── Load resort data ─────────────────────────────────────────────────────────
function loadResorts() {
  const src = fs.readFileSync('./resorts.js', 'utf8');
  const scope = new Function(src + '; return RESORTS;');
  return scope() || [];
}

const RESORTS = loadResorts();

// Prefer hand-written editorial when available (same file as ski-report reviews)
function loadEditorial() {
  try {
    const code = fs.readFileSync('./mountain-editorial.js', 'utf8');
    return new Function(code + '; return MOUNTAIN_EDITORIAL;')() || {};
  } catch {
    return {};
  }
}
const MOUNTAIN_EDITORIAL = loadEditorial();

// Stable per-resort variant pick (same resort → same phrasing every build)
function seededIndex(id, salt, mod) {
  let h = 0;
  const s = String(id) + salt;
  for (let i = 0; i < s.length; i++) h = (Math.imul(31, h) + s.charCodeAt(i)) >>> 0;
  return h % mod;
}
function pickVariant(id, salt, variants) {
  return variants[seededIndex(id, salt, variants.length)];
}

// ─── Archetype Classification ─────────────────────────────────────────────────
// Each resort gets assigned one of 10 archetypes based on its data profile.
// Order matters. More specific checks run first.

function classifyResort(r) {
  const { vertical, acres, avgSnowfall, price, trails, passGroup,
          terrainBreakdown: tb } = r;
  const begPct = tb?.beginner    || 0;
  const advPct = tb?.advanced    || 0;
  const isIndependent = passGroup === 'Independent';
  const isBig    = vertical >= 2000;
  const isMid    = vertical >= 1000 && vertical < 2000;
  const isSmall  = vertical < 1000;
  const isCheap  = price < 85;
  const isFamily = begPct >= 0.40;
  const isPowder = avgSnowfall >= 250;
  const isExpert = advPct >= 0.35;

  // Large destination resorts
  if (isBig && isFamily)           return 'large-family';
  if (isBig)                       return 'large-destination';

  // Mid-size
  if (isMid && isPowder && isExpert) return 'hidden-gem-powder';
  if (isMid && isIndependent && isCheap) return 'budget-nofrills';
  if (isMid && isFamily)           return 'mid-weekend';
  if (isMid)                       return 'mid-regional';

  // Small hills
  if (isSmall && isCheap && isIndependent) return 'budget-nofrills';
  if (isSmall && isFamily)         return 'local-beginner';
  if (isSmall && isPowder && !isFamily) return 'hidden-gem-underrated';
  if (isSmall)                     return 'local-community';

  return 'mid-regional'; // fallback
}

// ─── Helper functions ─────────────────────────────────────────────────────────

function passLabel(passGroup) {
  const map = { Epic: 'Epic Pass', Ikon: 'Ikon Pass', Indy: 'Indy Pass' };
  return map[passGroup] || null;
}

function snowQuality(r) {
  const avg = r.avgSnowfall;
  const id = r.id;
  if (avg >= 400) {
    return pickVariant(id, 'snow4', [
      'exceptional powder country by eastern standards',
      'legitimate deep-snow territory most winters',
      'the kind of snowfall average that keeps locals loyal',
      'well into powder-destination territory on a good year',
      'heavy enough that natural snow drives the conversation',
    ]);
  }
  if (avg >= 250) {
    return pickVariant(id, 'snow3', [
      'well above average for the region',
      'enough natural snow that you can trust the base',
      'solid enough that storms actually change the day',
      'reliable by regional standards when the pattern sets up',
      'better than most neighbors on pure snowfall',
    ]);
  }
  if (avg >= 150) {
    return pickVariant(id, 'snow2', [
      'respectable most seasons with good coverage potential',
      'enough to matter when storms line up',
      'middle of the pack on snow, but workable',
      'decent when the season cooperates',
      'solid regional average, not a powder mecca',
    ]);
  }
  if (avg >= 100) {
    return pickVariant(id, 'snow1', [
      'moderate natural snow, so snowmaking does real work',
      'light on average snowfall, heavy on grooming and guns',
      'typical of hills where man-made base carries the season',
      'depends on cold nights and consistent snowmaking',
      'not a natural-snow lottery, more a coverage operation',
    ]);
  }
  return pickVariant(id, 'snow0', [
    'light on natural snow, so snowmaking keeps the lights on',
    'built around guns and grooming more than storms',
    'the kind of place that opens because the snowmaking crew shows up',
    'low snowfall average, but they know how to stay open',
    'you ski here for convenience, not because it snowed two feet last night',
  ]);
}

function crowdLevel(r) {
  const passNetworks = ['Epic', 'Ikon'];
  const isNetwork = passNetworks.includes(r.passGroup);
  const id = r.id;
  if (r.vertical >= 2000 && isNetwork) {
    return pickVariant(id, 'crowd3', [
      'gets slammed on peak weekends and holidays, so timing matters',
      'busy enough on Saturdays that an early start helps',
      'draws pass crowds from a wide radius when conditions are good',
      'one of those mountains where MLK Monday is a whole mood',
      'expect lift lines on the busiest days, especially after a storm',
    ]);
  }
  if (r.vertical >= 1500 && isNetwork) {
    return pickVariant(id, 'crowd2', [
      'pulls weekend crowds from nearby metros, especially on pass days',
      'busy on holiday weekends but manageable midweek',
      'enough traffic that you notice it on a bluebird Saturday',
      'weekends can stack up when the forecast looks good',
      'not empty on peak days, but rarely hopeless if you pick your timing',
    ]);
  }
  if (r.vertical >= 1000) {
    return pickVariant(id, 'crowd1', [
      'weekends have a pulse, but you can still ski most of the day',
      'busy enough to feel alive without the destination-resort crush',
      'lines show up on holidays, not every Saturday',
      'moderate weekend traffic if you avoid the obvious peak days',
      'enough people to keep lifts spinning, not enough to ruin a lap',
    ]);
  }
  return pickVariant(id, 'crowd0', [
    'rarely feels crowded, which is half the appeal',
    'short lines even on decent weekends',
    'the kind of hill where you recognize faces by February',
    'quiet enough that a bad forecast keeps most people home',
    'small-mountain pacing: more runs, less waiting',
  ]);
}

function driveWorthIt(r) {
  const id = r.id;
  if (r.vertical >= 2000 && r.avgSnowfall >= 200) {
    return pickVariant(id, 'drive3', [
      'worth the longer haul when the forecast cooperates',
      'the kind of mountain you plan around, not squeeze in',
      'justifies a real road trip on a good snow week',
      'enough scale that the drive pays off on the right day',
      'a destination when conditions line up, not a maybe',
    ]);
  }
  if (r.vertical >= 1500) {
    return pickVariant(id, 'drive2', [
      'worth a dedicated day when snow is in the forecast',
      'a solid target for a longer day trip from the right city',
      'enough terrain that the drive feels earned on a good day',
      'the sort of place you pick when you want a full day out',
      'reasonable as a primary trip when conditions are there',
    ]);
  }
  if (r.vertical >= 1000) {
    return pickVariant(id, 'drive1', [
      'works as a day trip if you live within a couple hours',
      'best when it is close, not when you are stretching the drive',
      'a good regional option without being a cross-state pilgrimage',
      'fine for a long day if the snow report looks decent',
      'makes sense from nearby metros, less so from far away',
    ]);
  }
  return pickVariant(id, 'drive0', [
    'best treated as a local hill, not a road-trip destination',
    'the value is proximity, not cross-state ambition',
    'works when it is in your backyard, not when you are driving past better options',
    'a nearby lap spot more than a planned expedition',
    'save the long drive for somewhere with more vertical',
  ]);
}

function passValue(r) {
  const label = passLabel(r.passGroup);
  if (!label) return null;
  const id = r.id;
  const fiveDay = r.price * 5;
  if (fiveDay > 800) {
    return pickVariant(id, 'pass1', [
      `${label} covers this mountain, and the math works if you are already on the pass. Five window days would run about $${fiveDay}.`,
      `Your ${label} works here. At roughly $${r.price} at the window, a handful of visits pays for itself fast.`,
      `${label} access is included, which is the main reason pass holders show up here instead of buying day tickets.`,
      `If you already ski on ${label}, this is an easy add. Window rates near $${r.price} make that obvious.`,
    ]);
  }
  return pickVariant(id, 'pass0', [
    `${label} gets you in the door, worth weighing if you are deciding on a pass anyway.`,
    `Included on ${label}, so factor that in when you compare ticket price to your pass list.`,
    `${label} holders ski here as part of the pass. Day tickets run about $${r.price} if you are buying walk-up.`,
  ]);
}

function bestFor(r) {
  const items = [];
  const tb = r.terrainBreakdown || {};

  if (tb.beginner >= 0.40) items.push('beginners and learning skiers');
  if (tb.advanced >= 0.35) items.push('advanced and expert skiers');
  else if (tb.intermediate >= 0.50) items.push('intermediate skiers looking to progress');

  if (r.passGroup !== 'Independent') items.push(`${r.passGroup} pass holders`);
  if (r.price < 85)   items.push('budget-conscious skiers');
  if (r.night)        items.push('after-work or night skiing sessions');
  if (r.avgSnowfall >= 250) items.push('powder chasers');
  if (r.vertical >= 2000)  items.push('skiers who want a full day of exploration');

  return items.slice(0, 4);
}

function notIdealFor(r) {
  const items = [];
  const tb = r.terrainBreakdown || {};

  if (tb.beginner < 0.20 && tb.advanced >= 0.40) items.push('beginners or nervous skiers');
  if (r.vertical < 500)   items.push('skiers who need variety over a full day');
  if (r.price >= 150)     items.push('budget-conscious skiers. Window rates are steep');
  if (r.avgSnowfall < 100) items.push('natural snow seekers. Snowmaking does most of the work');
  if (!r.night)            items.push('evening or twilight sessions');
  if (r.acres < 100)      items.push('explorers who want to cover new terrain all day');

  return items.slice(0, 3);
}

function whenToGo(r) {
  const peak = r.avgSnowfall >= 200 ? 'January through March' : 'January and February';
  const early = r.avgSnowfall >= 150 ? 'December can be good if the season starts early' : 'December is hit or miss. The base needs to build first';
  const days = r.passGroup === 'Independent'
    ? 'Weekdays are noticeably quieter if you can swing it.'
    : `Midweek is almost always better than weekends${r.passGroup !== 'Independent' ? ', especially for pass holders when lift lines stack up' : ''}.`;
  return { peak, early, days };
}

// ─── Narrative Templates ───────────────────────────────────────────────────────

function editorialAboutText(r) {
  const ed = MOUNTAIN_EDITORIAL[r.id];
  if (!ed) return null;
  const chunks = [ed.lede, ...(Array.isArray(ed.body) ? ed.body : [])].filter(Boolean);
  return chunks.length ? chunks.join('\n\n') : null;
}

function narrative(r, archetype) {
  const editorial = editorialAboutText(r);
  if (editorial) return editorial.trim();

  const snow = snowQuality(r);
  const crowd = crowdLevel(r);
  const drive = driveWorthIt(r);
  const pass  = passValue(r);
  const tb    = r.terrainBreakdown || {};
  const beg   = Math.round((tb.beginner || 0) * 100);
  const adv   = Math.round((tb.advanced || 0) * 100);
  const id    = r.id;
  const layout = seededIndex(id, 'layout', 3);
  const snowLine = r.snowmaking
    ? pickVariant(id, 'snowmk', [
        `${r.snowmaking.toLocaleString()} GPM of snowmaking backs up the natural average`,
        `snowmaking at ${r.snowmaking.toLocaleString()} GPM fills gaps when storms miss`,
        `${r.snowmaking.toLocaleString()} GPM of snowmaking keeps key runs open through thin weeks`,
      ])
    : pickVariant(id, 'nosnowmk', [
        'natural snow drives the season here',
        'coverage leans on what falls from the sky',
        'no heavy snowmaking crutch, so storm track matters',
      ]);
  const priceLine = pickVariant(id, 'price', [
    `Lift tickets run about $${r.price} at the window.`,
    `Expect roughly $${r.price} for a walk-up day ticket.`,
    `Day tickets land around $${r.price}, depending on date and demand.`,
  ]);
  const passBit = pass ? ` ${pass}` : '';

  const openers = {
    'large-destination': pickVariant(id, 'op-lg', [
      `${r.name} is the kind of mountain you build a weekend around. ${r.vertical.toLocaleString()} feet of vertical, ${r.trails} trails, and ${r.acres.toLocaleString()} acres give you room to spread out.`,
      `If you want scale in ${r.state}, ${r.name} is usually on the short list. ${r.trails} trails across ${r.acres.toLocaleString()} acres is enough terrain to stay busy for a multi-day trip.`,
      `${r.name} plays in the big-resort category: long groomers, real steeps, and enough acreage that you are not lapping the same three runs by noon.`,
    ]),
    'large-family': pickVariant(id, 'op-lf', [
      `${r.name} works well when the group has mixed abilities. About ${beg}% beginner terrain keeps newer skiers busy while the upper mountain still has juice for stronger legs.`,
      `Families and mixed groups tend to land here because ${r.name} spreads ${beg}% of its terrain toward learners without making advanced skiers feel stuck on greens all day.`,
      `Traveling with kids or a spread of skill levels? ${r.name} is built for that kind of weekend, with ${beg}% beginner-friendly terrain and enough upper-mountain options to keep interest.`,
    ]),
    'mid-regional': pickVariant(id, 'op-mr', [
      `${r.name} hits a sweet spot a lot of regional skiers like: ${r.vertical.toLocaleString()} feet of vertical across ${r.trails} trails without the destination-resort overhead.`,
      `Not too big, not too small. ${r.name} gives you ${r.acres.toLocaleString()} acres to explore on a day trip without feeling lost in a resort village.`,
      `${r.name} is the sort of hill you can learn in a season and still find new lines by March. ${r.trails} trails is enough variety for repeat visits.`,
    ]),
    'mid-weekend': pickVariant(id, 'op-mw', [
      `${r.name} is a reliable weekend answer when you do not want to overthink it. ${beg}% beginner terrain plus enough upper-mountain options for the stronger skiers in the car.`,
      `For a straightforward Saturday, ${r.name} usually delivers. The ${r.vertical.toLocaleString()}-foot vertical feels like a real day on snow without needing a vacation week.`,
      `${r.name} is where a lot of locals go when they want a normal good ski day. Familiar lifts, predictable layout, no drama.`,
    ]),
    'hidden-gem-powder': pickVariant(id, 'op-hgp', [
      `${r.name} rewards people who pay attention to the forecast. With ${r.avgSnowfall} inches average snow and ${adv}% advanced terrain, powder days here feel earned.`,
      `Powder chasers whisper about ${r.name} for a reason. ${r.avgSnowfall}" average snowfall and steep pockets that hold longer than the big pass mountains nearby.`,
      `${r.name} is not on every bumper sticker, but ${r.avgSnowfall} inches of snow and ${adv}% advanced terrain make it interesting when storms track right.`,
    ]),
    'hidden-gem-underrated': pickVariant(id, 'op-hgu', [
      `${r.name} will not top the Instagram list, but ${r.vertical.toLocaleString()} feet of vertical across ${r.trails} trails is a real ski day if you know what you are looking for.`,
      `Underrated is the word locals use for ${r.name}. ${r.acres.toLocaleString()} acres, shorter lines, and a vibe that feels more like skiing than managing a crowd.`,
      `${r.name} surprises people who write it off. ${r.trails} trails, ${r.avgSnowfall}" average snow, and a pace that lets you actually ski.`,
    ]),
    'local-beginner': pickVariant(id, 'op-lb', [
      `A lot of skiers get hooked on snow at places like ${r.name}. ${beg}% beginner terrain, shorter runs, and a patient pace that helps first-timers breathe.`,
      `${r.name} is where learning clicks for a lot of people. The vertical is modest on purpose, and ${beg}% of the hill is aimed at building confidence.`,
      `If someone in your group is still finding their edges, ${r.name} is a low-stress place to start. ${beg}% beginner terrain and lift tickets around $${r.price}.`,
    ]),
    'local-community': pickVariant(id, 'op-lc', [
      `${r.name} has the small-hill energy bigger places cannot fake. Regulars on the chair, short conversations in the lot, and ${r.acres.toLocaleString()} acres that feel like yours by February.`,
      `You come to ${r.name} to ski with people you know. ${r.vertical.toLocaleString()} feet of vertical is enough for quick laps and a full afternoon if you pace it right.`,
      `${r.name} is a community hill in the best sense. Not flashy, just consistent turns with people who show up every week.`,
    ]),
    'budget-nofrills': pickVariant(id, 'op-bn', [
      `${r.name} keeps skiing affordable. About $${r.price} at the window, ${r.trails} trails, and no pretense about being a destination resort.`,
      `When the goal is turns without a huge bill, ${r.name} is worth a look. ${r.vertical.toLocaleString()} feet of vertical for roughly $${r.price} per day.`,
      `${r.name} strips it down: ticket, chair, snow. ${r.trails} trails and lift tickets near $${r.price}, which is the whole point.`,
    ]),
  };

  const opener = openers[archetype] || openers['mid-regional'];

  const midBlocks = [
    `Snow averages ${r.avgSnowfall} inches, which is ${snow}. ${snowLine.charAt(0).toUpperCase() + snowLine.slice(1)}. Crowds ${crowd}.`,
    `Annual snowfall sits around ${r.avgSnowfall} inches (${snow}), and ${snowLine}. On weekends it ${crowd}.`,
    `With ${r.avgSnowfall}" average snow, this is ${snow}. ${snowLine.charAt(0).toUpperCase() + snowLine.slice(1)}, and the crowd picture is simple: it ${crowd}.`,
  ];
  const mid = pickVariant(id, 'mid', midBlocks);

  const closers = [
    `${priceLine}${passBit}`,
    `${drive.charAt(0).toUpperCase() + drive.slice(1)}.${passBit}`,
    `${priceLine} ${drive.charAt(0).toUpperCase() + drive.slice(1)}.${passBit}`,
  ];
  const close = pickVariant(id, 'close', closers);

  if (layout === 0) {
    return `${opener} ${mid} ${close}`.trim();
  }
  if (layout === 1) {
    return `${opener}\n\n${mid}\n\n${close}`.trim();
  }
  return `${opener}\n\n${mid}\n\n${close}`.trim();
}

// ─── Best For / Not Ideal For section ─────────────────────────────────────────
function bestForSection(r) {
  const good = bestFor(r);
  const bad  = notIdealFor(r);
  const when = whenToGo(r);

  let html = `<div class="resort-fit-section">`;

  if (good.length) {
    html += `<div class="fit-block">
      <div class="fit-label fit-label--good">Best for</div>
      <ul class="fit-list">${good.map(i => `<li>${i}</li>`).join('')}</ul>
    </div>`;
  }

  if (bad.length) {
    html += `<div class="fit-block">
      <div class="fit-label fit-label--bad">Not ideal for</div>
      <ul class="fit-list">${bad.map(i => `<li>${i}</li>`).join('')}</ul>
    </div>`;
  }

  html += `<div class="fit-block">
    <div class="fit-label">When to go</div>
    <p class="fit-when">${when.peak} is peak season. ${when.early}. ${when.days}</p>
  </div>`;

  html += `</div>`;
  return html;
}

// ─── Inject content into existing HTML ────────────────────────────────────────
function enrichPage(filePath, r) {
  let html = fs.readFileSync(filePath, 'utf8');
  const archetype = classifyResort(r);
  const narr      = narrative(r, archetype);
  const fit       = bestForSection(r);

  // Replace the existing "At a Glance" section content
  // Target the <p> tags inside the about section
  const aboutPattern = /(<section[^>]*>[\s\S]*?<h2[^>]*>[^<]*At a Glance[^<]*<\/h2>)([\s\S]*?)(<\/section>)/i;

  const newAbout = `$1
      <p style="font-size:15px;color:#2e3f54;line-height:1.78;margin:0 0 14px">${narr.replace(/\n\n/g, '</p><p style="font-size:15px;color:#2e3f54;line-height:1.78;margin:0 0 14px">').replace(/\n/g, ' ')}</p>
      ${fit}
    $3`;

  if (aboutPattern.test(html)) {
    html = html.replace(aboutPattern, newAbout);
  } else {
    // Fallback: inject before closing </main>
    const fallback = `
    <section style="background:#fff;border:1px solid #d6e1f0;border-radius:16px;padding:24px 26px;margin-bottom:28px;box-shadow:0 2px 8px rgba(30,60,100,.05)">
      <h2 style="font-size:18px;font-weight:800;margin:0 0 14px">${r.name}. At a Glance</h2>
      <p style="font-size:15px;color:#2e3f54;line-height:1.78;margin:0 0 14px">${narr.replace(/\n\n/g, '</p><p style="font-size:15px;color:#2e3f54;line-height:1.78;margin:0 0 14px">').replace(/\n/g, ' ')}</p>
      ${fit}
    </section>`;
    html = html.replace('</main>', fallback + '</main>');
  }

  return html;
}

// ─── Find nearby resorts by same state + similar vertical ─────────────────────
function findNearby(resort, allResorts, count = 3) {
  return allResorts
    .filter(r => r.id !== resort.id && r.state === resort.state)
    .sort((a, b) => Math.abs(a.vertical - resort.vertical) - Math.abs(b.vertical - resort.vertical))
    .slice(0, count);
}

// ─── Build smart compare CTA HTML ─────────────────────────────────────────────
function buildCompareCTA(resort, nearby) {
  const ids     = [resort.id, ...nearby.map(r => r.id)].join(',');
  const url     = `https://www.wheretoskinext.com/?compare=${ids}`;
  const names   = nearby.map(r => r.name).join(', ');
  return `
    <div style="background:linear-gradient(135deg,#edf4ff,#f7fbff);border:1.5px solid #bfdbfe;border-radius:16px;padding:20px 24px;margin-bottom:28px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:14px;">
      <div>
        <div style="font-size:16px;font-weight:800;color:#1e40af;margin-bottom:4px;">How does ${resort.name} stack up?</div>
        <div style="font-size:13px;color:#1d4ed8;">Compare side-by-side with ${names}. Snow, drive time, crowds, and more.</div>
      </div>
      <a href="${url}" style="display:inline-flex;align-items:center;gap:6px;background:#2b6de9;color:#fff;border-radius:999px;padding:10px 20px;font-weight:700;font-size:14px;text-decoration:none;white-space:nowrap;box-shadow:0 4px 14px rgba(43,109,233,.3);">
        Compare Mountains
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </a>
    </div>`;
}

// ─── CSS to add for Best For section ─────────────────────────────────────────
const FIT_CSS = `
  <style>
    .resort-fit-section { display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-top:20px; padding-top:20px; border-top:1px solid #edf4ff; }
    @media(max-width:600px){ .resort-fit-section { grid-template-columns:1fr; } }
    .fit-block { }
    .fit-label { font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:.06em; margin-bottom:8px; color:#667a96; }
    .fit-label--good { color:#16a34a; }
    .fit-label--bad  { color:#d95b5b; }
    .fit-list { margin:0; padding-left:16px; font-size:14px; color:#2e3f54; line-height:1.9; }
    .fit-when { font-size:14px; color:#2e3f54; line-height:1.7; margin:0; }
  </style>`;

// ─── Run ──────────────────────────────────────────────────────────────────────
let updated = 0;
let skipped = 0;

for (const resort of RESORTS) {
  const filePath = path.join('ski-report', resort.id, 'index.html');
  if (!fs.existsSync(filePath)) { skipped++; continue; }

  try {
    let html = enrichPage(filePath, resort);

    // Inject CSS once per page if not already there
    if (!html.includes('resort-fit-section')) {
      html = html.replace('</head>', FIT_CSS + '\n</head>');
    }

    // Replace the existing live-banner CTA with the smart compare CTA
    const nearby   = findNearby(resort, RESORTS, 3);
    const compareCTA = buildCompareCTA(resort, nearby);

    // Replace existing live-banner div if present
    html = html.replace(/<div class="live-banner">[\s\S]*?<\/div>\s*<\/div>/m, compareCTA);

    // If no live-banner found, inject before the stats grid
    if (!html.includes('Compare Mountains') && html.includes('class="stats-grid"')) {
      html = html.replace('<div class="stats-grid"', compareCTA + '<div class="stats-grid"');
    }

    fs.writeFileSync(filePath, html, 'utf8');
    updated++;
  } catch (e) {
    console.error(`Error on ${resort.id}:`, e.message);
    skipped++;
  }
}

console.log(`✅ Enriched ${updated} resort pages`);
console.log(`⏭  Skipped ${skipped} pages`);

// Print archetype distribution for review
const dist = {};
for (const r of RESORTS) {
  const a = classifyResort(r);
  dist[a] = (dist[a] || 0) + 1;
}
console.log('\nArchetype distribution:');
Object.entries(dist).sort((a,b) => b[1]-a[1]).forEach(([k,v]) => console.log(`  ${k}: ${v}`));
