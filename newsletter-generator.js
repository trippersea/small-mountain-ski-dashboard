/**
 * /api/newsletter-generator.js
 *
 * Scores resorts in 5 regions, selects Pick + Trap + 3 Also picks per region,
 * generates copy via Anthropic, and posts a DRAFT to Beehiiv.
 *
 * Generates Thursday 11pm UTC (7pm ET) via Vercel cron -- for Friday send.
 * Manual trigger: POST /api/newsletter-generator
 *   with Authorization: Bearer <CRON_SECRET>
 *
 * Cron auth:
 *   Vercel cron and manual triggers: Authorization: Bearer <CRON_SECRET>
 *   Vercel sends that header automatically when CRON_SECRET is set in project env.
 *   x-vercel-cron header is NOT trusted -- it is not a secret and can be spoofed.
 *
 * Required env vars:
 *   BEEHIIV_API_KEY
 *   BEEHIIV_PUBLICATION_ID
 *   ANTHROPIC_API_KEY
 *   CRON_SECRET      (never committed to repo -- set in Vercel dashboard only)
 *
 * One-line change required in resorts-national.js -- add at the very bottom:
 *   if (typeof module !== 'undefined') module.exports = { RESORTS };
 */


// ============================================================================
// REGIONS
// Five editorial regions matching the newsletter template.
// ============================================================================

const REGIONS = {
  'northeast': {
    label:          'Northeast',
    states:         ['VT', 'NH', 'ME', 'MA', 'CT', 'RI', 'NY', 'NJ', 'PA'],
    driveAnchor:    'Boston, MA',
    passContextTitle: 'Check Your Pass Logic',
  },
  'rockies': {
    label:          'Rockies',
    // NM included: Taos, Ski Santa Fe, Angel Fire are Rocky Mountain skiing
    states:         ['CO', 'UT', 'WY', 'MT', 'ID', 'NM'],
    driveAnchor:    'Denver, CO',
    passContextTitle: "Don't Get Stuck on I-70",
  },
  'west': {
    label:          'West',
    // AZ and NV have genuine ski mountains (Snowbowl, Mt. Rose, Lee Canyon)
    states:         ['CA', 'OR', 'WA', 'NV', 'AZ', 'AK'],
    driveAnchor:    'Los Angeles, CA',
    passContextTitle: 'Pass Holders Take Note',
  },
  'southeast': {
    label:          'Southeast',
    // MD included: Wisp Resort is Appalachian skiing, draws DC/Baltimore market
    states:         ['NC', 'TN', 'VA', 'WV', 'MD', 'GA'],
    driveAnchor:    'Charlotte, NC',
    passContextTitle: 'Your Starting Point Changes Everything',
  },
  'midwest': {
    label:          'Midwest',
    // SD and ND have operating ski areas (Terry Peak, Huff Hills)
    states:         ['MI', 'WI', 'MN', 'OH', 'IN', 'IL', 'MO', 'IA', 'SD', 'ND'],
    driveAnchor:    'Milwaukee, WI',
    passContextTitle: 'Not Up for the Drive?',
  },
};


// ============================================================================
// SCORING WEIGHTS
// No drive time. No pass filter. That is the site's job.
// ============================================================================

const WEIGHTS = {
  newSnow72h:   0.30,
  forecast48h:  0.25,
  crowd:        0.25,   // inverted -- low crowd scores high
  baseDepth:    0.20,
};

const CAPS = {
  newSnow72h:   40,   // cm  ~16" = perfect score
  forecast48h:  25,   // cm  ~10" = perfect score
  baseDepth:    200,  // cm  ~79" = perfect score
};

// Picks with score below this are flagged in the reviewer comment only.
// No yellow banners in subscriber-facing HTML.
const MIN_PUBLISH_SCORE = 30;


// ============================================================================
// HOLIDAY CALENDAR
// Fri-Sun windows of peak demand. Update at the start of each season.
// ============================================================================

const HOLIDAY_DATES = [
  // 2025-26 season
  '2026-01-16', '2026-01-17', '2026-01-18',
  '2026-02-13', '2026-02-14', '2026-02-15',
  '2026-02-20', '2026-02-21', '2026-02-22',
  '2026-02-27', '2026-02-28', '2026-03-01',
  '2026-03-06', '2026-03-07', '2026-03-08',
  '2026-03-13', '2026-03-14', '2026-03-15',
  '2026-03-20', '2026-03-21', '2026-03-22',
  // 2026-27 season
  '2026-12-25', '2026-12-26', '2026-12-27',
  '2026-12-31', '2027-01-01', '2027-01-02',
  '2027-01-15', '2027-01-16', '2027-01-17',
  '2027-02-12', '2027-02-13', '2027-02-14',
  '2027-02-19', '2027-02-20', '2027-02-21',
];

function isHolidayWeekend() {
  return HOLIDAY_DATES.includes(new Date().toISOString().slice(0, 10));
}


// ============================================================================
// CROWD SCORING
// ============================================================================

function getCrowdScore(resort) {
  const price = resort.price || 80;
  const lifts = resort.lifts || 5;

  const demandNorm = Math.min(price / 280, 1);

  let capacityMult;
  if      (lifts >= 20) capacityMult = 1.4;
  else if (lifts >= 12) capacityMult = 1.2;
  else if (lifts >= 7)  capacityMult = 1.0;
  else if (lifts >= 4)  capacityMult = 0.85;
  else                  capacityMult = 0.70;

  const holidayMult = isHolidayWeekend() ? 1.3 : 1.0;

  return Math.min(demandNorm * capacityMult * holidayMult, 1);
}

function crowdLabel(score) {
  if (score < 0.30) return 'Light';
  if (score < 0.55) return 'Moderate';
  if (score < 0.75) return 'Heavy';
  return 'Very Heavy';
}

// Returns inline-style values for the crowd stat tile.
// Heavy/Very Heavy = amber. Moderate = neutral. Light = green.
function crowdTileColors(label) {
  if (label === 'Heavy' || label === 'Very Heavy')
    return { bg: '#fef3c7', valColor: '#b45309', borderTop: '#b45309' };
  if (label === 'Moderate')
    return { bg: '#f7fafc', valColor: '#4a6177', borderTop: '#2b6de9' };
  return { bg: '#dcfce7', valColor: '#16a34a', borderTop: '#16a34a' };
}


// ============================================================================
// SIGNAL BADGES (Also strip)
// Picks the most specific data signal for why this mountain is worth a look.
// ============================================================================

function signalBadge(scores) {
  if (scores.newSnow72hIn  >= 12) return 'Big Dump';
  if (scores.forecast48hIn >= 8)  return 'Big Forecast';
  if (scores.newSnow72hIn  >= 6)  return 'Fresh Snow';
  if (scores.crowdLabel === 'Light' || scores.crowdLabel === 'Moderate') return 'No Lines';
  if (scores.baseDepthIn   >= 48) return 'Deep Base';
  if (scores.forecast48hIn >= 4)  return 'Forecast Up';
  return 'Worth a Look';
}


// ============================================================================
// URL SLUG
// resorts.js uses resort.id as the canonical slug (e.g. "killington-resort",
// "mad-river-glen", "mt-bohemia"). Use it directly -- do not derive from name.
// ============================================================================

function toSlug(resort) {
  return resort.id;
}

function resortUrl(resort, utmContent) {
  const slug = toSlug(resort);
  return `https://www.wheretoskinext.com/ski-report/${slug}/?utm_source=newsletter&utm_medium=email&utm_campaign=weekly-pick&utm_content=${utmContent}`;
}


// ============================================================================
// RESORT LOCATION LABEL
// resorts.js has no city field. Use state abbreviation only.
// ============================================================================

function resortLocation(resort) {
  return resort.state;
}


// ============================================================================
// WEATHER
// ============================================================================

async function fetchWeather(resort) {
  // Grid elevation only — elevation= summit returns unrealistic cold on this API.
  const url = new URL('https://api.open-meteo.com/v1/forecast');
  url.searchParams.set('latitude',      resort.lat);
  url.searchParams.set('longitude',     resort.lon);
  url.searchParams.set('hourly',        'snowfall,snow_depth');
  url.searchParams.set('past_days',     '3');
  url.searchParams.set('forecast_days', '3');
  url.searchParams.set('timezone',      'UTC');

  const resp = await fetch(url.toString(), { signal: AbortSignal.timeout(8000) });
  if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
  return resp.json();
}

async function fetchWeatherBatch(resorts, batchSize = 20) {
  const weatherMap = new Map();
  for (let i = 0; i < resorts.length; i += batchSize) {
    const batch   = resorts.slice(i, i + batchSize);
    const settled = await Promise.allSettled(
      batch.map(r =>
        fetchWeather(r)
          .then(w => ({ name: r.name, weather: w }))
          .catch(err => { throw Object.assign(err, { resortName: r.name }); })
      )
    );
    for (const result of settled) {
      if (result.status === 'fulfilled') {
        weatherMap.set(result.value.name, result.value.weather);
      } else {
        console.warn(`Weather failed for ${result.reason?.resortName}: ${result.reason?.message}`);
      }
    }
  }
  return weatherMap;
}


// ============================================================================
// SCORING
// ============================================================================

function scoreResort(resort, weather) {
  const times     = weather.hourly.time;
  const snowfall  = weather.hourly.snowfall;
  const snowDepth = weather.hourly.snow_depth;

  const now   = Date.now();
  const ms72h = 72 * 3600 * 1000;
  const ms48h = 48 * 3600 * 1000;

  let newSnow72hCm  = 0;
  let forecast48hCm = 0;
  let latestDepthM  = 0;

  for (let i = 0; i < times.length; i++) {
    const t  = new Date(times[i]).getTime();
    const sf = snowfall[i]  || 0;
    const sd = snowDepth[i];

    if (t <= now && t > now - ms72h)  newSnow72hCm  += sf;
    if (t > now  && t <= now + ms48h) forecast48hCm += sf;
    if (t <= now && sd != null)       latestDepthM   = sd;
  }

  const baseDepthCm = latestDepthM * 100;
  const crowdScore  = getCrowdScore(resort);

  const s_newSnow  = Math.min(newSnow72hCm   / CAPS.newSnow72h,  1);
  const s_forecast = Math.min(forecast48hCm  / CAPS.forecast48h, 1);
  const s_crowd    = 1 - crowdScore;
  const s_depth    = Math.min(baseDepthCm    / CAPS.baseDepth,   1);

  const total = (
    s_newSnow  * WEIGHTS.newSnow72h  +
    s_forecast * WEIGHTS.forecast48h +
    s_crowd    * WEIGHTS.crowd       +
    s_depth    * WEIGHTS.baseDepth
  ) * 100;

  const cmToIn = cm => Math.round((cm / 2.54) * 10) / 10;

  return {
    total:         Math.round(total * 10) / 10,
    newSnow72hIn:  cmToIn(newSnow72hCm),
    forecast48hIn: cmToIn(forecast48hCm),
    baseDepthIn:   Math.round(baseDepthCm / 2.54),
    crowdScore,
    crowdLabel:    crowdLabel(crowdScore),
  };
}


// ============================================================================
// COPY GENERATION
// Pick: returns { tagline, body, passNote }
// Trap: returns string (body copy only)
// Falls back to data-driven sentences on any API failure.
// ============================================================================

async function generatePickCopy(resort, scores, region) {
  const dataBlock = [
    `Mountain: ${resort.name}`,
    `Location: ${resortLocation(resort)}`,
    `Region: ${region.label}`,
    `New snow (last 72h): ${scores.newSnow72hIn}"`,
    `Forecast (next 48h): ${scores.forecast48hIn}"`,
    `Base depth: ${scores.baseDepthIn}"`,
    `Crowd outlook: ${scores.crowdLabel}`,
  ].join('\n');

  const prompt = `You write for WhereToSkiNext, a weekly ski newsletter. Skier talking to a skier. Short. Direct. Opinionated. No em dashes. No marketing language.

Data for this week's pick:
${dataBlock}

Return ONLY a valid JSON object with exactly these three keys. No preamble, no markdown, no trailing text:
{
  "tagline": "A punchy 5-8 word headline for why to go this weekend. Example: 'Go get your laps' or 'Soft turns without the scene'.",
  "body": "Exactly 2 sentences. First sentence: the snow situation. Second sentence: one specific reason it is worth the drive.",
  "passNote": "1-2 sentences about pass considerations for this specific mountain. If it is independent, say so and tell them to check WTSN for pass-compatible alternatives."
}`;

  try {
    const resp = await fetch('https://api.anthropic.com/v1/messages', {
      method:  'POST',
      headers: {
        'Content-Type':      'application/json',
        'x-api-key':         process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model:      'claude-sonnet-4-20250514',
        max_tokens: 300,
        messages:   [{ role: 'user', content: prompt }],
      }),
      signal: AbortSignal.timeout(12000),
    });
    if (!resp.ok) throw new Error(`Anthropic ${resp.status}`);
    const data = await resp.json();
    const raw  = data.content?.[0]?.text?.trim() || '';
    const clean = raw.replace(/^```json|^```|```$/gm, '').trim();
    const parsed = JSON.parse(clean);
    if (parsed.tagline && parsed.body && parsed.passNote) return parsed;
    throw new Error('Incomplete JSON from Anthropic');
  } catch (err) {
    console.warn(`Pick copy failed for ${resort.name}:`, err.message);
    return fallbackPickCopy(scores, resort.name);
  }
}

async function generateTrapCopy(resort, scores, regionLabel) {
  const dataBlock = [
    `Mountain: ${resort.name}`,
    `Region: ${regionLabel}`,
    `Crowd outlook: ${scores.crowdLabel}`,
    `New snow (last 72h): ${scores.newSnow72hIn}"`,
    `Forecast (next 48h): ${scores.forecast48hIn}"`,
  ].join('\n');

  const prompt = `Write 2 sentences on why ${resort.name} is the mountain to skip this weekend. This is the "Where Everyone's Going" card -- the well-known resort that will be crowded. Focus on the crowd situation and why it is the wrong choice this specific weekend. No em dashes. Direct. Skier voice.

${dataBlock}`;

  try {
    const resp = await fetch('https://api.anthropic.com/v1/messages', {
      method:  'POST',
      headers: {
        'Content-Type':      'application/json',
        'x-api-key':         process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model:      'claude-sonnet-4-20250514',
        max_tokens: 150,
        messages:   [{ role: 'user', content: prompt }],
      }),
      signal: AbortSignal.timeout(12000),
    });
    if (!resp.ok) throw new Error(`Anthropic ${resp.status}`);
    const data = await resp.json();
    return data.content?.[0]?.text?.trim() || fallbackTrapCopy(scores, resort.name);
  } catch (err) {
    console.warn(`Trap copy failed for ${resort.name}:`, err.message);
    return fallbackTrapCopy(scores, resort.name);
  }
}

function fallbackPickCopy(scores, name) {
  const snowLine = scores.newSnow72hIn > 0
    ? `${scores.newSnow72hIn}" fell in the last 72 hours at ${name}.`
    : `${name} has ${scores.forecast48hIn}" forecast for the next 48 hours.`;
  return {
    tagline:  'The engine picked this one.',
    body:     `${snowLine} ${scores.crowdLabel} crowds expected this weekend.`,
    passNote: 'Check your pass coverage on WTSN before you commit to the drive.',
  };
}

function fallbackTrapCopy(scores, name) {
  const crowdReason = scores.crowdLabel === 'Heavy' || scores.crowdLabel === 'Very Heavy'
    ? `${scores.crowdLabel.toLowerCase()} crowds expected`
    : 'likely to be busier than the pick';
  return `${name} will have ${crowdReason} this weekend. The conditions may be fine but the experience will not be.`;
}


// ============================================================================
// RESORT SELECTION PER REGION
// Pick:   top scorer
// Trap:   highest-priced resort that is NOT the pick
//         (price = demand proxy; most recognizable name in the region)
// Also 1: Best for a Full Day -- most lifts among top scorers (excl. pick + trap)
// Also 2: Best Kept Secret -- best scorer among below-median-price resorts
// Also 3: Under the Radar  -- best scorer among lowest-quartile-price resorts
// ============================================================================

function selectResorts(scored) {
  if (scored.length === 0) return { pick: null, trap: null, also: [] };

  const pick = scored[0];
  const usedNames = new Set([pick.resort.name]);

  // Trap: highest-demand (price) resort that is not the pick
  const trap = [...scored]
    .filter(x => !usedNames.has(x.resort.name))
    .sort((a, b) => (b.resort.price || 0) - (a.resort.price || 0))[0] || null;
  if (trap) usedNames.add(trap.resort.name);

  const remaining = scored.filter(x => !usedNames.has(x.resort.name));

  // Also 1: Best for a Full Day -- most lifts
  const also1 = [...remaining]
    .sort((a, b) => (b.resort.lifts || 0) - (a.resort.lifts || 0))[0] || null;
  if (also1) usedNames.add(also1.resort.name);

  const remaining2 = scored.filter(x => !usedNames.has(x.resort.name));
  const allPrices  = scored.map(x => x.resort.price || 80).sort((a, b) => a - b);
  const medianPrice = allPrices[Math.floor(allPrices.length / 2)] || 80;

  // Also 2: Best Kept Secret -- best scorer at below-median price
  const secretPool = remaining2.filter(x => (x.resort.price || 80) < medianPrice);
  const also2 = (secretPool.length > 0 ? secretPool : remaining2)[0] || null;
  if (also2) usedNames.add(also2.resort.name);

  const remaining3 = scored.filter(x => !usedNames.has(x.resort.name));
  const q25Price   = allPrices[Math.floor(allPrices.length * 0.25)] || 60;

  // Also 3: Under the Radar -- lowest-quartile price and decent score
  const radarPool = remaining3.filter(x => (x.resort.price || 80) <= q25Price && x.scores.total > 15);
  const also3 = (radarPool.length > 0 ? radarPool : remaining3)[0] || null;

  return {
    pick,
    trap,
    also: [
      also1 ? { ...also1, role: 'Best for a Full Day',  badge: signalBadge(also1.scores) } : null,
      also2 ? { ...also2, role: 'Best Kept Secret',     badge: signalBadge(also2.scores) } : null,
      also3 ? { ...also3, role: 'Under the Radar',      badge: signalBadge(also3.scores) } : null,
    ].filter(Boolean),
  };
}


// ============================================================================
// HTML HELPERS
// ============================================================================

// Single stat tile used in both Pick and Trap cards.
function statTile({ value, label1, label2, accentColor, bgColor, textColor }) {
  const bg     = bgColor     || '#ffffff';
  const accent = accentColor || '#2b6de9';
  const color  = textColor   || '#2a4158';
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"><tr>
    <td align="center" style="background:${bg};border:1px solid #dde5ee;border-top:3px solid ${accent};border-radius:10px;padding:9px 4px;">
      <strong style="display:block;font-size:24px;font-weight:800;color:${color};line-height:1.05;letter-spacing:-0.02em;">${value}</strong>
      <span class="mono" style="font-size:10px;color:#7f96a9;line-height:1.25;text-transform:uppercase;letter-spacing:0.06em;display:block;margin-top:3px;">${label1}<br>${label2}</span>
    </td>
  </tr></table>`;
}

function statRow(scores, cardType) {
  // cardType: 'pick' (blue accent) or 'trap' (amber accent on first 3 tiles)
  const accentColor = cardType === 'trap' ? '#b45309' : '#2b6de9';
  const borderColor = cardType === 'trap' ? '#fde68a' : '#dde5ee';
  const crowd = crowdTileColors(scores.crowdLabel);

  const tile = (value, l1, l2, opts = {}) => {
    const bg     = opts.bg     || '#ffffff';
    const accent = opts.accent || accentColor;
    const vc     = opts.vc     || (cardType === 'pick' ? '#2a4158' : '#2a4158');
    const border = opts.border || borderColor;
    return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"><tr>
      <td align="center" style="background:${bg};border:1px solid ${border};border-top:3px solid ${accent};border-radius:10px;padding:9px 4px;">
        <strong style="display:block;font-size:24px;font-weight:800;color:${vc};line-height:1.05;letter-spacing:-0.02em;">${value}</strong>
        <span class="mono" style="font-size:10px;color:#7f96a9;line-height:1.25;text-transform:uppercase;letter-spacing:0.06em;display:block;margin-top:3px;">${l1}<br>${l2}</span>
      </td>
    </tr></table>`;
  };

  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin:0 0 12px;">
    <tr>
      <td class="stat-tile" width="25%" style="padding-right:6px;padding-bottom:6px;" valign="top">
        ${tile(scores.newSnow72hIn + '"', 'new', '72h')}
      </td>
      <td class="stat-tile" width="25%" style="padding-right:6px;padding-bottom:6px;" valign="top">
        ${tile(scores.forecast48hIn + '"', 'fcast', '48h')}
      </td>
      <td class="stat-tile" width="25%" style="padding-right:6px;padding-bottom:6px;" valign="top">
        ${tile(scores.baseDepthIn + '"', 'base', 'depth')}
      </td>
      <td class="stat-tile" width="25%" style="padding-right:0;padding-bottom:6px;" valign="top">
        ${tile(scores.crowdLabel, 'crowd', 'outlook', {
          bg: crowd.bg, accent: crowd.borderTop, vc: crowd.valColor, border: '#dde5ee',
        })}
      </td>
    </tr>
  </table>`;
}


// ============================================================================
// REGION BLOCK BUILDER
// Outputs: region band + Pick card + Trap card + Also strip + spacer
// ============================================================================

function buildRegionBlock(r) {
  const { region, pick, trap, also } = r;
  const pickScores = pick.scores;
  const regionId   = r.regionId;
  const conditionFlag = pickScores.total < MIN_PUBLISH_SCORE
    ? `<!-- REVIEWER: thin conditions in ${region.label} (score: ${pickScores.total}/100). Review before sending. -->`
    : '';

  // ---- PICK CARD ----
  const pickCard = `
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
    <tr>
      <td style="padding:8px 28px 16px;" class="section-pad">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
          <tr>
            <td style="background:#0f1c2e;border:1px solid #233b56;border-radius:16px;overflow:hidden;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                <tr>
                  <td style="padding:18px 20px 20px;background:#0f1c2e;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td valign="top">
                          <p class="mono" style="font-size:11px;font-weight:800;letter-spacing:0.13em;text-transform:uppercase;color:#8fb6ff;margin:0 0 5px;">Where You Should Go</p>
                          <p style="font-size:32px;font-weight:800;color:#f0f6fc;margin:0 0 1px;line-height:1.05;letter-spacing:-0.03em;">${pick.resort.name}</p>
                          <p style="font-size:14px;color:rgba(240,246,252,0.68);margin:0 0 12px;">${resortLocation(pick.resort)}</p>
                        </td>
                        <td align="right" valign="top" style="padding-left:12px;">
                          <span class="mono" style="display:inline-block;background:#2b6de9;color:#ffffff;border-radius:999px;padding:6px 12px;font-size:11px;font-weight:500;letter-spacing:0.05em;text-transform:uppercase;white-space:nowrap;">Top Pick</span>
                        </td>
                      </tr>
                    </table>
                    <p style="font-size:21px;font-weight:800;color:#ffffff;margin:0 0 6px;line-height:1.3;letter-spacing:-0.01em;">${pick.copy.tagline}</p>
                    <p class="serif" style="font-size:17px;color:rgba(240,246,252,0.9);line-height:1.55;margin:0 0 14px;">${pick.copy.body}</p>
                    ${statRow(pickScores, 'pick')}
                    <p class="mono" style="font-size:11px;color:rgba(240,246,252,0.46);margin:0 0 16px;">Drive time mapped from ${region.driveAnchor}.</p>
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin:0 0 16px;">
                      <tr>
                        <td style="background:#162537;border:1px solid rgba(255,255,255,0.09);border-radius:10px;padding:14px 16px;">
                          <p class="mono" style="font-size:11px;font-weight:800;color:#8fb6ff;letter-spacing:0.1em;text-transform:uppercase;margin:0 0 6px;">${region.passContextTitle}</p>
                          <p class="serif" style="font-size:15px;color:rgba(240,246,252,0.86);line-height:1.5;margin:0;">${pick.copy.passNote}</p>
                        </td>
                      </tr>
                    </table>
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                      <tr>
                        <td align="center">
                          <a href="${resortUrl(pick.resort, regionId + '-pick')}" style="display:block;width:100%;box-sizing:border-box;text-align:center;background-color:#2b6de9;border-radius:999px;color:#ffffff;font-size:16px;font-weight:800;padding:14px 20px;text-decoration:none;letter-spacing:0.01em;">See ${pick.resort.name} on WTSN</a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>`;

  // ---- TRAP CARD ----
  const trapCard = trap ? `
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
    <tr>
      <td style="padding:0 28px 16px;" class="section-pad">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
          <tr>
            <td style="background:#fffbf4;border:1px solid #fde68a;border-left:4px solid #b45309;border-radius:12px;padding:16px 20px;">
              <p class="mono" style="font-size:11px;font-weight:800;letter-spacing:0.13em;text-transform:uppercase;color:#b45309;margin:0 0 6px;">Where Everyone&#x27;s Going</p>
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                <tr>
                  <td valign="top">
                    <p style="font-size:24px;font-weight:800;color:#2a4158;margin:0 0 4px;line-height:1.1;letter-spacing:-0.02em;">${trap.resort.name}</p>
                    <p style="font-size:13px;color:#7f96a9;margin:0 0 16px;">${resortLocation(trap.resort)}</p>
                  </td>
                  <td align="right" valign="top" style="padding-left:12px;">
                    <span class="mono" style="display:inline-block;background:#fef3c7;color:#b45309;border:1px solid #fde68a;border-radius:999px;padding:6px 10px;font-size:10px;font-weight:500;letter-spacing:0.05em;text-transform:uppercase;white-space:nowrap;">Crowd Magnet</span>
                  </td>
                </tr>
              </table>
              ${statRow(trap.scores, 'trap')}
              <p class="serif" style="font-size:16px;color:#4a6177;line-height:1.55;margin:0 0 10px;">${trap.copy}</p>
              <a href="${resortUrl(trap.resort, regionId + '-trap')}" style="font-size:13px;font-weight:800;color:#2b6de9;text-decoration:none;">View weekend crowd data on WTSN &rarr;</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>` : '';

  // ---- ALSO STRIP ----
  // Each column is a 3-row stack: a fixed-height top zone (role + note + name +
  // location), then the signal badge, then the link. Fixing the top zone height
  // keeps the badges and links aligned across columns even when a resort name
  // wraps to two lines, so nothing floats out of line.
  const ALSO_NOTES = {
    'Best for a Full Day': 'Most lifts spinning',
    'Best Kept Secret':    'Quiet and cheaper',
    'Under the Radar':     'Lowest ticket price',
  };
  const alsoColumns = also.map((item, idx) => {
    const isFirst = idx === 0;
    const isLast  = idx === also.length - 1;
    const width   = isLast ? '34%' : '33%';
    const pl      = isFirst ? '0' : '14px';
    const pr      = isLast  ? '0' : '14px';
    const border  = isFirst ? '' : 'border-left:1px solid rgba(255,255,255,0.08);';
    const note    = ALSO_NOTES[item.role] || '';
    return `<td class="also-stack" width="${width}" style="padding-right:${pr};padding-left:${pl};${border}" valign="top">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
        <tr>
          <td class="also-zone" height="104" valign="top" style="height:104px;">
            <p class="mono" style="font-size:10px;font-weight:800;letter-spacing:0.12em;text-transform:uppercase;color:#8fb6ff;margin:0 0 4px;">${item.role}</p>
            <p style="font-size:11px;color:rgba(240,246,252,0.46);margin:0 0 10px;line-height:1.3;">${note}</p>
            <p style="font-size:18px;font-weight:800;color:#f0f6fc;margin:0 0 2px;line-height:1.2;">${item.resort.name}</p>
            <p style="font-size:12px;color:rgba(240,246,252,0.52);margin:0;">${resortLocation(item.resort)}</p>
          </td>
        </tr>
        <tr>
          <td valign="top" style="padding-top:12px;">
            <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"><tr>
              <td align="center" style="background:#162537;border:1px solid rgba(255,255,255,0.08);border-top:2px solid #2b6de9;border-radius:8px;padding:8px 4px;">
                <strong class="mono" style="font-size:13px;font-weight:800;color:#8fb6ff;display:block;line-height:1;text-transform:uppercase;letter-spacing:0.05em;">${item.badge}</strong>
              </td>
            </tr></table>
          </td>
        </tr>
        <tr>
          <td valign="top" style="padding-top:12px;">
            <a href="${resortUrl(item.resort, regionId + '-also-' + (idx + 1))}" style="font-size:13px;font-weight:800;color:#8fb6ff;text-decoration:none;">View on WTSN &rarr;</a>
          </td>
        </tr>
      </table>
    </td>`;
  }).join('\n');

  const alsoStrip = also.length > 0 ? `
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" bgcolor="#1e3448">
    <tr>
      <td style="padding:22px 28px 22px;background:#1e3448;" class="section-pad">
        <p class="mono" style="font-size:11px;font-weight:800;letter-spacing:0.14em;text-transform:uppercase;color:rgba(240,246,252,0.46);margin:0 0 4px;">Also This Week in the ${region.label}</p>
        <p style="font-size:13px;color:rgba(240,246,252,0.5);line-height:1.45;margin:0 0 20px;">Three more worth a look. Same scoring, different angle.</p>
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
          <tr valign="top">
            ${alsoColumns}
          </tr>
        </table>
      </td>
    </tr>
  </table>` : '';

  // ---- REGION BAND ----
  // Named anchor target for the "Jump to your region" nav. Anchor links work in
  // Apple Mail and most desktop clients; Gmail and some webmail ignore them, so
  // the nav above doubles as an at-a-glance summary that degrades gracefully.
  const regionBand = `
  <a name="region-${regionId}" id="region-${regionId}"></a>
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" bgcolor="#d4e8f8">
    <tr>
      <td style="padding:12px 28px 12px;background:#d4e8f8;border-top:1px solid #c4d0de;" class="section-pad">
        <p class="mono" style="font-size:13px;font-weight:800;letter-spacing:0.14em;text-transform:uppercase;color:#2b6de9;margin:0 0 2px;">${region.label}</p>
        <p style="font-size:13px;color:#4a6177;margin:0;">Updated Friday mornings.</p>
      </td>
    </tr>
  </table>`;

  // Quiet jump back to the region list at the top. Uses the same in-email anchor
  // system as the nav, so it degrades to a harmless no-op where anchors are ignored.
  const backToTop = `
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" bgcolor="#f7fafc">
    <tr>
      <td align="right" style="padding:10px 28px 4px;background:#f7fafc;" class="section-pad">
        <a href="#top" class="mono" style="font-size:10px;font-weight:500;letter-spacing:0.1em;text-transform:uppercase;color:#7f96a9;text-decoration:none;">&uarr;&nbsp;All regions</a>
      </td>
    </tr>
  </table>`;

  const spacer = `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"><tr><td height="16" style="font-size:0;line-height:0;background:#f7fafc;"></td></tr></table>`;

  return `\n  ${conditionFlag}\n  ${regionBand}\n  ${pickCard}\n  ${trapCard}\n  ${alsoStrip}\n  ${backToTop}\n  ${spacer}`;
}


// ============================================================================
// REGION NAV (Jump to your region)
// At-a-glance list of every region and its pick, linked to in-email anchors.
// The anchors jump where the client supports them (Apple Mail, most desktop);
// where they do not (Gmail, some webmail) the list still reads as a contents
// overview, so it never looks broken.
// ============================================================================

function buildRegionNav(regionResults) {
  if (regionResults.length <= 1) return '';

  const items = regionResults.map(r => `<tr>
        <td style="padding:11px 0;border-bottom:1px solid #e2e9f1;">
          <a href="#region-${r.regionId}" style="font-size:15px;font-weight:800;color:#2b6de9;text-decoration:none;">${r.region.label}</a>
          <span style="font-size:14px;color:#7f96a9;">&nbsp;&middot;&nbsp;${r.pick.resort.name}</span>
          <span class="mono" style="font-size:12px;color:#16a34a;font-weight:500;">&nbsp;&nbsp;${r.pick.scores.newSnow72hIn}&Prime; new</span>
        </td>
      </tr>`).join('\n');

  return `
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" bgcolor="#ffffff">
    <tr>
      <td style="padding:22px 28px 24px;border-bottom:1px solid #dde5ee;" class="section-pad">
        <p class="mono" style="font-size:11px;font-weight:800;letter-spacing:0.14em;text-transform:uppercase;color:#7f96a9;margin:0 0 4px;">Jump to your region</p>
        <p style="font-size:13px;color:#7f96a9;line-height:1.45;margin:0 0 12px;">Every pick is scored on fresh snow, the next 48 hours, crowd outlook, and base depth. Tap a region to drop straight to it.</p>
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
${items}
        </table>
      </td>
    </tr>
  </table>`;
}


// ============================================================================
// FULL EMAIL HTML
// ============================================================================

function buildEmailHtml(regionResults, generatedAt) {
  const blocks = regionResults.map(r => buildRegionBlock(r)).join('\n');
  const regionNav = buildRegionNav(regionResults);

  // Best preheader hook: pick with the most new snow
  const bestPick = regionResults.reduce((top, r) =>
    r.pick.scores.newSnow72hIn > top.pick.scores.newSnow72hIn ? r : top,
    regionResults[0]
  );
  const preheader = `${bestPick.pick.scores.newSnow72hIn}" at ${bestPick.pick.resort.name} this weekend.`
    + ` ${regionResults.filter(r => r !== bestPick).map(r => r.region.label + ': ' + r.pick.resort.name).join(', ')}.`;

  return `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>WhereToSkiNext Weekly</title>
  <!-- Web fonts match the site: Inter (body/headings), DM Mono (labels), Newsreader (editorial copy).
       Clients that support web fonts (Apple Mail, iOS Mail, Outlook for Mac) load them; the rest
       fall back to the system stacks below, so the email never looks broken. -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=DM+Mono:wght@400;500&family=Newsreader:opsz,wght@6..72,400;6..72,500;6..72,600&display=swap" rel="stylesheet">
  <style type="text/css">
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=DM+Mono:wght@400;500&family=Newsreader:opsz,wght@6..72,400;6..72,500;6..72,600&display=swap');
    body, table, td, p, a, span, strong { font-family: 'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif !important; }
    .mono, .mono strong, .mono span, .mono a { font-family: 'DM Mono', ui-monospace, 'SFMono-Regular', Menlo, Consolas, monospace !important; }
    .serif, .serif strong, .serif span, .serif a { font-family: 'Newsreader', ui-serif, Georgia, 'Times New Roman', serif !important; }
    body { margin:0; padding:0; background-color:#d4e8f8; -webkit-text-size-adjust:100%; -ms-text-size-adjust:100%; }
    table { border-collapse:separate; }
    a { text-decoration:none; }
    img { border:0; outline:none; text-decoration:none; }
    @media only screen and (max-width: 600px) {
      .email-container { width:100% !important; max-width:100% !important; }
      .section-pad { padding-left:16px !important; padding-right:16px !important; }
      .stat-tile { display:inline-block !important; width:50% !important; padding-right:6px !important; padding-bottom:8px !important; box-sizing:border-box !important; }
      .also-stack { display:block !important; width:100% !important; padding-left:0 !important; padding-right:0 !important; border-left:none !important; padding-bottom:16px !important; }
      .also-zone { height:auto !important; }
    }
  </style>
</head>
<body style="margin:0;padding:0;background-color:#d4e8f8;">

<!-- ================================================================
REVIEWER NOTES -- delete before sending
Generated: ${generatedAt}
Scoring: new snow 30% / forecast 25% / crowds 25% / base depth 20%
Picks below ${MIN_PUBLISH_SCORE}/100 are flagged inline above their region.
Review copy, then send.
================================================================ -->

<div style="display:none;max-height:0;overflow:hidden;font-size:1px;color:#ffffff;line-height:1px;mso-hide:all;">
  ${preheader}&nbsp;&#8203;&nbsp;&#8203;&nbsp;&#8203;&nbsp;&#8203;&nbsp;&#8203;&nbsp;&#8203;&nbsp;&#8203;&nbsp;&#8203;&nbsp;&#8203;
</div>

<div class="email-container" style="max-width:600px;margin:0 auto;background:#f7fafc;">
  <a name="top" id="top"></a>

  <!-- HEADER -->
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" bgcolor="#0f1c2e">
    <tr>
      <td align="center" style="padding:16px 28px 14px;background:#0f1c2e;" class="section-pad">
        <a href="https://www.wheretoskinext.com/?utm_source=newsletter&amp;utm_medium=email&amp;utm_campaign=weekly-pick&amp;utm_content=header-logo" style="display:inline-block;font-size:24px;font-weight:800;color:#f0f6fc;margin:0;line-height:1.15;letter-spacing:-0.02em;text-decoration:none;">
          WhereToSki<span style="color:#2b6de9;">Next</span>.com
        </a>
        <p class="mono" style="font-size:11px;font-weight:500;letter-spacing:0.14em;text-transform:uppercase;color:rgba(240,246,252,0.62);margin:6px 0 0;">Week of [DATE]</p>
      </td>
    </tr>
  </table>
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
    <tr><td height="4" bgcolor="#2b6de9" style="background:#2b6de9;font-size:0;line-height:0;"></td></tr>
  </table>

  <!-- HERO INTRO -->
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" bgcolor="#ffffff">
    <tr>
      <td style="padding:28px 28px 32px;border-bottom:1px solid #dde5ee;text-align:center;" class="section-pad">
        <p style="font-size:24px;color:#2a4158;line-height:1.25;margin:0 0 12px;letter-spacing:-0.02em;">
          <strong style="font-weight:800;color:#2a4158;">Everyone loves fresh snow.</strong><br>
          <span class="serif" style="color:#4a6177;font-size:21px;font-weight:500;">Nobody loves chasing it with everyone else.</span>
        </p>
        <p style="font-size:16px;color:#4a6177;line-height:1.5;margin:0 0 24px;padding:0 10px;">
          Dial in your exact starting point, pass type, and drive limit. We'll run the numbers and map the best turns for your weekend.
        </p>
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
          <tr>
            <td align="center">
              <a href="https://www.wheretoskinext.com/?utm_source=newsletter&amp;utm_medium=email&amp;utm_campaign=weekly-pick&amp;utm_content=hero-cta" style="display:inline-block;background:#2b6de9;color:#ffffff;border-radius:999px;padding:16px 32px;font-size:16px;font-weight:800;line-height:1;text-decoration:none;white-space:nowrap;">
                Find My Mountain
              </a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>

  ${regionNav}

  ${blocks}

  <!-- SIGN OFF -->
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
    <tr>
      <td style="padding:40px 28px 40px;text-align:center;" class="section-pad">
        <p style="font-size:18px;color:#4a6177;margin:0;line-height:1.5;">
          See you out there,<br>
          <strong style="color:#2a4158;font-size:20px;">Trip</strong>
        </p>
      </td>
    </tr>
  </table>

</div>
</body>
</html>`;
}


// ============================================================================
// BEEHIIV DRAFT
// ============================================================================

async function postBeehiivDraft(subject, previewText, htmlContent) {
  const pubId  = process.env.BEEHIIV_PUBLICATION_ID;
  const apiKey = process.env.BEEHIIV_API_KEY;
  if (!pubId || !apiKey) throw new Error('Missing BEEHIIV_PUBLICATION_ID or BEEHIIV_API_KEY');

  const resp = await fetch(`https://api.beehiiv.com/v2/publications/${pubId}/posts`, {
    method:  'POST',
    headers: {
      'Content-Type':  'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      title:        subject,
      subject,
      preview_text: previewText,
      status:       'draft',
      content_html: htmlContent,
    }),
    signal: AbortSignal.timeout(15000),
  });

  if (!resp.ok) {
    const body = await resp.text().catch(() => '');
    throw new Error(`Beehiiv ${resp.status}: ${body}`);
  }
  return resp.json();
}


// ============================================================================
// MAIN HANDLER
// ============================================================================

module.exports = async function handler(req, res) {

  // Auth: Bearer CRON_SECRET only (Vercel cron sends it when CRON_SECRET is set in project env).
  // x-vercel-cron is NOT trusted.
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret) {
    console.error('[newsletter-generator] CRON_SECRET is not set.');
    return res.status(500).json({ error: 'Server misconfiguration: auth tokens not set.' });
  }

  const authHeader = req.headers['authorization'] || '';
  const isAuthorized = authHeader === `Bearer ${cronSecret}`;

  if (!isAuthorized) {
    return res.status(401).json({
      error: 'Unauthorized',
      hint:  'Pass Authorization: Bearer <CRON_SECRET> to trigger manually.',
    });
  }

  const generatedAt = new Date().toLocaleString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
    hour: 'numeric', minute: '2-digit', timeZoneName: 'short',
  });

  // Load resort data
  let allResorts;
  try {
    // resorts.js already has: if (typeof module !== 'undefined') module.exports = { RESORTS };
    const data = require('../resorts.js');
    allResorts = data.RESORTS || (Array.isArray(data) ? data : null);
    if (!allResorts) {
      const key = Object.keys(data).find(k => Array.isArray(data[k]) && data[k].length > 50);
      allResorts = key ? data[key] : [];
    }
  } catch (err) {
    return res.status(500).json({
      error:  'Could not load resort data.',
      detail: err.message,
      fix:    'Add this line at the bottom of resorts.js: if (typeof module !== "undefined") module.exports = { RESORTS }; (it may already be there)',
    });
  }

  if (!allResorts || allResorts.length === 0) {
    return res.status(500).json({ error: 'Resort data loaded but is empty.' });
  }

  // Process each region
  const regionResults = [];

  for (const [regionId, region] of Object.entries(REGIONS)) {
    console.log(`Processing ${region.label}...`);
    try {
      const regionResorts = allResorts.filter(r => r && region.states.includes(r.state));
      if (regionResorts.length === 0) {
        console.warn(`  No resorts found for ${region.label}`);
        continue;
      }
      console.log(`  ${regionResorts.length} resorts. Fetching weather...`);

      const weatherMap = await fetchWeatherBatch(regionResorts, 20);

      const scored = [];
      for (const resort of regionResorts) {
        const weather = weatherMap.get(resort.name);
        if (!weather) continue;
        try {
          scored.push({ resort, scores: scoreResort(resort, weather) });
        } catch (err) {
          console.warn(`  Score failed for ${resort.name}:`, err.message);
        }
      }

      if (scored.length === 0) {
        console.warn(`  No scored resorts in ${region.label}`);
        continue;
      }

      scored.sort((a, b) => b.scores.total - a.scores.total);

      const { pick, trap, also } = selectResorts(scored);

      console.log(
        `  Pick: ${pick.resort.name} (${pick.scores.total})`,
        `| Trap: ${trap?.resort.name || 'none'}`,
        `| Also: ${also.map(a => a.resort.name).join(', ')}`
      );

      // Generate copy (2 API calls per region)
      const [pickCopy, trapCopy] = await Promise.all([
        generatePickCopy(pick.resort, pick.scores, region),
        trap ? generateTrapCopy(trap.resort, trap.scores, region.label) : Promise.resolve(''),
      ]);

      regionResults.push({
        regionId,
        region,
        pick:  { ...pick, copy: pickCopy },
        trap:  trap ? { ...trap, copy: trapCopy } : null,
        also,
      });

    } catch (err) {
      console.error(`Region ${regionId} failed:`, err.message);
    }
  }

  if (regionResults.length === 0) {
    return res.status(500).json({ error: 'No regions produced results. Check weather API and resort data.' });
  }

  // Subject: lead with the top snow event of the week
  const topSnow = regionResults.reduce((top, r) =>
    r.pick.scores.newSnow72hIn > top.pick.scores.newSnow72hIn ? r : top,
    regionResults[0]
  );
  const subject = `Where to ski this weekend -- ${topSnow.pick.scores.newSnow72hIn}" at ${topSnow.pick.resort.name} leads the ${topSnow.region.label}`;

  const previewText = regionResults
    .map(r => `${r.region.label}: ${r.pick.resort.name} (${r.pick.scores.newSnow72hIn}" new)`)
    .join(' | ');

  const emailHtml = buildEmailHtml(regionResults, generatedAt);

  let beehiivData;
  try {
    beehiivData = await postBeehiivDraft(subject, previewText, emailHtml);
  } catch (err) {
    console.error('Beehiiv draft failed:', err.message);
    return res.status(207).json({
      warning:    'Beehiiv draft creation failed. Email HTML returned below for manual paste.',
      detail:     err.message,
      subject,
      previewText,
      emailHtml,
      picks: regionResults.map(r => ({
        region: r.region.label,
        pick:   r.pick.resort.name,
        trap:   r.trap?.resort.name || null,
        score:  r.pick.scores.total,
      })),
    });
  }

  return res.status(200).json({
    success:       true,
    generatedAt,
    subject,
    previewText,
    regionsRun:    regionResults.length,
    picks: regionResults.map(r => ({
      region:     r.region.label,
      pick:       r.pick.resort.name,
      score:      r.pick.scores.total,
      newSnowIn:  r.pick.scores.newSnow72hIn,
      crowds:     r.pick.scores.crowdLabel,
      trap:       r.trap?.resort.name || null,
      also:       r.also.map(a => `${a.role}: ${a.resort.name}`),
    })),
    beehiivPostId: beehiivData?.data?.id,
    beehiivUrl:    beehiivData?.data?.web_url || beehiivData?.data?.url,
  });
};

module.exports.config = { maxDuration: 120 };
