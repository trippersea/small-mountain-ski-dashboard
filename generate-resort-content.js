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

// ─── Load resort data from both source files ──────────────────────────────────
function loadResorts() {
  const sdData  = fs.readFileSync('./sd-data.js', 'utf8');
  const natData = fs.readFileSync('./resorts-national.js', 'utf8');

  const neScope  = new Function(sdData.replace(/const RESORTS\s*=[\s\S]*$/, '') + '; return RESORTS_NE;');
  const natScope = new Function(natData + '; return RESORTS_NATIONAL;');

  return [...neScope(), ...natScope()];
}

const RESORTS = loadResorts();

// ─── Archetype Classification ─────────────────────────────────────────────────
// Each resort gets assigned one of 10 archetypes based on its data profile.
// Order matters — more specific checks run first.

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

function snowQuality(avg) {
  if (avg >= 400) return 'exceptional — this is a legitimate powder destination';
  if (avg >= 250) return 'well above average — you can count on real snow here';
  if (avg >= 150) return 'solid — enough to keep things interesting most winters';
  if (avg >= 100) return 'moderate — snowmaking carries a lot of the load';
  return 'limited — snowmaking is the main reason this place stays open';
}

function crowdLevel(r) {
  const passNetworks = ['Epic', 'Ikon'];
  const isNetwork = passNetworks.includes(r.passGroup);
  if (r.vertical >= 2000 && isNetwork) return 'can get very busy on weekends and holidays — plan accordingly';
  if (r.vertical >= 1500 && isNetwork) return 'draws decent crowds on weekends, especially during holiday weeks';
  if (r.vertical >= 1000)              return 'busy enough on weekends but manageable if you pick your days';
  return 'rarely overwhelming — one of the perks of a smaller mountain';
}

function driveWorthIt(r) {
  if (r.vertical >= 2000 && r.avgSnowfall >= 200) return 'absolutely worth a longer drive when conditions are right';
  if (r.vertical >= 1500)                          return 'worth a dedicated trip when the snow is there';
  if (r.vertical >= 1000)                          return 'a solid destination for a day trip from the right location';
  return 'best as a nearby option — not the kind of place you drive hours for';
}

function passValue(r) {
  const label = passLabel(r.passGroup);
  if (!label) return null;
  const savings = Math.round((r.price * 5) - 800); // rough pass savings over 5 days
  if (savings > 0) {
    return `${label} holders get access here, which adds real value — five days at the window rate would run you around $${r.price * 5}, so the pass math works in your favor.`;
  }
  return `${label} access is included, which is worth factoring in if you're already a pass holder.`;
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
  if (r.price >= 150)     items.push('budget-conscious skiers — window rates are steep');
  if (r.avgSnowfall < 100) items.push('natural snow seekers — snowmaking does most of the work');
  if (!r.night)            items.push('evening or twilight sessions');
  if (r.acres < 100)      items.push('explorers who want to cover new terrain all day');

  return items.slice(0, 3);
}

function whenToGo(r) {
  const peak = r.avgSnowfall >= 200 ? 'January through March' : 'January and February';
  const early = r.avgSnowfall >= 150 ? 'December can be good if the season starts early' : 'December is hit or miss — the base needs to build first';
  const days = r.passGroup === 'Independent'
    ? 'Weekdays are noticeably quieter if you can swing it.'
    : `Midweek is almost always better than weekends${r.passGroup !== 'Independent' ? ', especially for pass holders when lift lines stack up' : ''}.`;
  return { peak, early, days };
}

// ─── Narrative Templates ───────────────────────────────────────────────────────
// Each template uses the resort object (r) to inject specific data
// alongside the voice-driven prose.

function narrative(r, archetype) {
  const snow = snowQuality(r.avgSnowfall);
  const crowd = crowdLevel(r);
  const drive = driveWorthIt(r);
  const pass  = passValue(r);
  const when  = whenToGo(r);
  const tb    = r.terrainBreakdown || {};
  const beg   = Math.round((tb.beginner || 0) * 100);
  const adv   = Math.round((tb.advanced || 0) * 100);

  const templates = {

    'large-destination': `
${r.name} is the kind of place you plan a trip around. With ${r.vertical.toLocaleString()} feet of vertical drop across ${r.trails} trails and ${r.acres.toLocaleString()} skiable acres, there is enough mountain here to keep you exploring for days without repeating yourself. You will find everything from long groomers that let you open it up to steeps that make you stop and think for a second before committing. The base area has that full resort feel — food, après options, and things to do once the lifts stop spinning.

At ${r.summitElevation.toLocaleString()} feet at the summit, ${r.name} gets an average of ${r.avgSnowfall} inches of snow per year, which is ${snow}. That snowfall average, combined with ${r.snowmaking ? r.snowmaking.toLocaleString() + ' GPM of snowmaking capacity' : 'its natural snowfall base'}, means the mountain can maintain solid coverage through most of the season. Crowds are part of the deal at a resort this size — it ${crowd}. ${driveWorthIt(r) !== 'best as a nearby option — not the kind of place you drive hours for' ? 'That said, the scale of the mountain makes it ' + drive + '.' : ''}${pass ? ' ' + pass : ''}`,

    'large-family': `
${r.name} checks a lot of boxes if you are traveling with a group or mixed-ability skiers. The mountain covers ${r.acres.toLocaleString()} acres across ${r.trails} trails, with ${beg}% of the terrain geared toward beginners and those still building confidence. Stronger skiers in the group will not get bored either — there is enough variety on the upper mountain to keep things interesting all day.

With ${r.vertical.toLocaleString()} feet of vertical and a summit at ${r.summitElevation.toLocaleString()} feet, ${r.name} is ${snow === 'exceptional — this is a legitimate powder destination' ? 'one of the better snow destinations in the region' : 'a reliable option through most of the season'}. Snowfall averages ${r.avgSnowfall} inches per year${r.snowmaking ? `, backed by ${r.snowmaking.toLocaleString()} GPM of snowmaking to fill the gaps` : ''}. Lessons, rentals, and lodging are all available on site, so showing up and just skiing is straightforward. It is not the cheapest day on snow at around $${r.price} for a window ticket, but for a complete experience with a group, it delivers.${pass ? ' ' + pass : ''}`,

    'mid-regional': `
${r.name} sits in that sweet spot a lot of skiers gravitate toward. With ${r.vertical.toLocaleString()} feet of vertical and ${r.trails} trails spread across ${r.acres.toLocaleString()} acres, it is big enough to give you genuine variety without feeling overwhelming. You can get into a rhythm here — lap a favorite chair, work on something specific, and still have new terrain to find by afternoon.

Snow averages ${r.avgSnowfall} inches per season, which is ${snow}${r.snowmaking ? `, and the ${r.snowmaking.toLocaleString()} GPM snowmaking operation helps keep coverage consistent when nature does not fully cooperate` : ''}. Lift lines tend to move here. It is the kind of mountain where you actually ski most of the day instead of standing in queues, though weekends can get busy during the holiday stretch. Window tickets run around $${r.price}. ${pass ? pass : ''}`,

    'mid-weekend': `
If you are looking for a reliable weekend option, ${r.name} fits the bill. It is the kind of mountain that works for most people in the group — ${beg}% of the terrain is beginner-friendly, with enough intermediate and advanced runs that stronger skiers have something to chase. The ${r.vertical.toLocaleString()}-foot vertical gives you a real sense of descent without being so big that a day trip feels rushed.

Snowfall averages ${r.avgSnowfall} inches per year${r.snowmaking ? `, with ${r.snowmaking.toLocaleString()} GPM of snowmaking as backup` : ''}. Coverage is generally ${r.avgSnowfall >= 150 ? 'reliable from mid-December onward' : 'weather-dependent early in the season, but typically consistent by January'}. You will see a mix of locals and regulars here who know exactly where to go depending on conditions. It may not have the flash of a destination resort, but at around $${r.price} for a lift ticket, it is consistent and easy to enjoy.${pass ? ' ' + pass : ''}`,

    'hidden-gem-powder': `
${r.name} is the kind of mountain that people hesitate to talk about too much. When conditions line up — and with ${r.avgSnowfall} inches of average annual snowfall, they line up more often than you might expect — it can be really good. The terrain leans expert-heavy at ${adv}% advanced or above, with pockets of the mountain that hold snow longer than you would find at more trafficked resorts. The ${r.vertical.toLocaleString()}-foot vertical across ${r.acres.toLocaleString()} acres gives you enough to work with on a powder day without feeling like you are burning through it in an hour.

What makes ${r.name} work is the combination of ${snow} snowfall${r.snowmaking === 0 ? ' with no snowmaking to fall back on — which keeps the focus on natural snow quality' : ` and ${r.snowmaking.toLocaleString()} GPM of snowmaking to extend the season`}. Fewer crowds, more space, and a bit of that did-we-just-find-something feeling. Window tickets at around $${r.price} are reasonable for what you get.${pass ? ' ' + pass : ''}`,

    'hidden-gem-underrated': `
${r.name} may not show up on the big resort lists, but it delivers where it counts. The terrain covers ${r.acres.toLocaleString()} acres across ${r.trails} trails with ${r.vertical.toLocaleString()} feet of vertical — enough to explore meaningfully in a day and still find new lines if you look for them. The split leans toward ${adv >= 30 ? 'more technical terrain' : 'intermediate-friendly runs'}, which shapes the kind of skier who keeps coming back.

Snowfall averages ${r.avgSnowfall} inches per season, which is ${snow}. The vibe here is a little more relaxed than what you find at the bigger-name mountains nearby. Lines are shorter, the pace is easier, and the ticket price — around $${r.price} — reflects the no-frills approach. It is the kind of place that surprises people in a good way.${pass ? ' ' + pass : ''}`,

    'local-beginner': `
This is where a lot of people fall in love with skiing. ${r.name} has ${r.vertical.toLocaleString()} feet of vertical across ${r.trails} trails, with ${beg}% of that terrain aimed at beginners or those still getting comfortable on snow. The runs are shorter and the lifts a little slower, which is exactly the point — you get more time to figure things out without feeling rushed or in the way.

You will not find massive vertical or challenging blacks here, but that is not the goal. Snowmaking covers ${r.snowmaking ? r.snowmaking.toLocaleString() + ' GPM' : 'the key runs'} to keep things open when natural snow is light. Lift tickets run around $${r.price}, which makes it an easy decision for a first or second time on snow. ${r.night ? 'Night skiing is available too, which opens up weekday options for people who cannot make a full day work.' : ''}${pass ? ' ' + pass : ''}`,

    'local-community': `
There is a strong local energy at ${r.name} that you feel right away. People know each other, the lift rides are social, and the whole place has a laid-back feel that bigger mountains have trouble replicating. The mountain covers ${r.acres.toLocaleString()} acres with ${r.vertical.toLocaleString()} feet of vertical — not enormous, but enough for quick laps and a proper day if you know where to go.

Snowfall averages ${r.avgSnowfall} inches per year${r.snowmaking ? `, with ${r.snowmaking.toLocaleString()} GPM of snowmaking keeping things open when it is needed` : ''}. Tickets run around $${r.price}. ${r.night ? 'Night skiing adds another dimension — an after-work lap here beats sitting in traffic.' : ''} You are not chasing massive terrain. You are just skiing, and that is what makes this place work.${pass ? ' ' + pass : ''}`,

    'budget-nofrills': `
If you are trying to keep costs down without giving up a day on snow, ${r.name} is worth a look. At around $${r.price} for a lift ticket, it is one of the more affordable options in the region. The mountain has ${r.vertical.toLocaleString()} feet of vertical across ${r.trails} trails — not a destination resort by any measure, but a genuine skiing experience.

${r.snowmaking ? `The ${r.snowmaking.toLocaleString()} GPM snowmaking setup keeps the key runs in shape through most of the season, even when natural snowfall — averaging ${r.avgSnowfall} inches per year — does not fully cooperate.` : `With ${r.avgSnowfall} inches of average annual snowfall, coverage depends more on the season than at resorts with heavy snowmaking.`} There are no resort extras, no unnecessary frills. You show up, grab a ticket, and ski. For a lot of skiers, that is more than enough.${pass ? ' ' + pass : ''}`,

    'budget-nofrills-2': `
${r.name} keeps things straightforward. The terrain covers ${r.acres.toLocaleString()} acres across ${r.trails} trails with ${r.vertical.toLocaleString()} feet of vertical. It is not about luxury here — it is about getting out and making turns without the overhead of a bigger resort experience. Lift tickets at around $${r.price} reflect that philosophy.

Snowfall averages ${r.avgSnowfall} inches per season${r.snowmaking ? `, supplemented by ${r.snowmaking.toLocaleString()} GPM of snowmaking to keep things open` : ''}. The terrain is consistent and easy to lap. A good day skiing does not have to be complicated or expensive, and ${r.name} is proof of that.${pass ? ' ' + pass : ''}`,
  };

  return (templates[archetype] || templates['mid-regional']).trim();
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
      <h2 style="font-size:18px;font-weight:800;margin:0 0 14px">${r.name} — At a Glance</h2>
      <p style="font-size:15px;color:#2e3f54;line-height:1.78;margin:0 0 14px">${narr.replace(/\n\n/g, '</p><p style="font-size:15px;color:#2e3f54;line-height:1.78;margin:0 0 14px">').replace(/\n/g, ' ')}</p>
      ${fit}
    </section>`;
    html = html.replace('</main>', fallback + '</main>');
  }

  return html;
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
