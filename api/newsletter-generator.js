/**
 * /api/newsletter-generator.js
 *
 * Scores resorts in 4 regions, picks one per region + a skip,
 * generates copy via Anthropic, and posts a DRAFT to Beehiiv.
 *
 * Runs Thursday 11pm UTC (7pm ET) via Vercel cron.
 * Can also be triggered manually with the CRON_SECRET header.
 *
 * Required env vars:
 *   BEEHIIV_API_KEY
 *   BEEHIIV_PUBLICATION_ID
 *   ANTHROPIC_API_KEY
 *   CRON_SECRET  (any random string, e.g. from openssl rand -hex 32)
 *
 * Required change to resorts-national.js -- add this line at the bottom:
 *   if (typeof module !== 'undefined') module.exports = { RESORTS_NATIONAL };
 *
 * Required additions to vercel.json (merge into existing, do not replace):
 *   "crons": [{ "path": "/api/newsletter-generator", "schedule": "0 23 * * 4" }]
 *   "functions": { "api/newsletter-generator.js": { "maxDuration": 120 } }
 */


// ============================================================================
// FIELD CONFIG
// Map these to the actual field names in your resorts-national.js objects.
// Check one resort object in the console or in your file and adjust as needed.
// ============================================================================

const FIELD = {
  name:         'name',           // resort display name
  state:        'state',          // 2-letter state code, e.g. 'VT'
  lat:          'lat',            // latitude (decimal degrees)
  lon:          'lon',            // longitude (decimal degrees)
  summit:       'summit',         // summit elevation in feet (preferred for weather accuracy)
  base:         'base',           // base elevation in feet (fallback)
  metroGravity: 'metro_gravity',  // structural crowd demand score 1-1000
                                  // If this lives in a separate lookup table rather than
                                  // on the resort object, see getCrowdScore() below
  capacityTier: 'capacity_tier',  // lift capacity tier 1-5 (1=small, 5=mega)
};


// ============================================================================
// REGIONS
// ============================================================================

const REGIONS = {
  'new-england': {
    label:    'New England',
    emoji:    'NE',
    states:   ['VT', 'NH', 'ME', 'MA', 'CT', 'RI'],
    timezone: 'America/New_York',
  },
  'midwest': {
    label:    'Midwest',
    emoji:    'MW',
    states:   ['MI', 'WI', 'MN', 'OH', 'IN', 'IL', 'MO', 'IA'],
    timezone: 'America/Chicago',
  },
  'colorado': {
    label:    'Colorado',
    emoji:    'CO',
    states:   ['CO'],
    timezone: 'America/Denver',
  },
  'utah': {
    label:    'Utah',
    emoji:    'UT',
    states:   ['UT'],
    timezone: 'America/Denver',
  },
};


// ============================================================================
// NEWSLETTER SCORING
// No drive time. No pass filter. That is the site's job.
// Newsletter scores on snow quality + crowd avoidance only.
// ============================================================================

const WEIGHTS = {
  newSnow72h:   0.30,   // did it just snow?
  forecast48h:  0.25,   // is it about to snow?
  crowd:        0.25,   // inverted -- low crowds score high
  baseDepth:    0.20,   // is there a real base under it?
};

// Score caps for normalization (in cm)
const CAPS = {
  newSnow72h:   40,     // 40cm (~16") = perfect score for this component
  forecast48h:  25,     // 25cm (~10")
  baseDepth:    200,    // 200cm (~79")
};

// Minimum total score to publish a pick. Below this, a warning appears in the draft.
const MIN_PUBLISH_SCORE = 30;


// ============================================================================
// HOLIDAY CALENDAR
// Update each season. These are Friday-Sunday windows of peak demand.
// ============================================================================

const HOLIDAY_DATES = [
  // 2025-26 season
  '2026-01-16', '2026-01-17', '2026-01-18',   // MLK weekend
  '2026-02-13', '2026-02-14', '2026-02-15',   // Valentine's / school break
  '2026-02-20', '2026-02-21', '2026-02-22',   // Presidents Day weekend
  '2026-02-27', '2026-02-28', '2026-03-01',   // Spring break early
  '2026-03-06', '2026-03-07', '2026-03-08',
  '2026-03-13', '2026-03-14', '2026-03-15',
  '2026-03-20', '2026-03-21', '2026-03-22',
  // 2026-27 season -- fill in before next season
  '2026-12-25', '2026-12-26', '2026-12-27',   // Christmas
  '2026-12-31', '2027-01-01', '2027-01-02',   // New Years
  '2027-01-15', '2027-01-16', '2027-01-17',   // MLK weekend
  '2027-02-12', '2027-02-13', '2027-02-14',   // Presidents Day weekend
];

function isHolidayWeekend() {
  const dateStr = new Date().toISOString().slice(0, 10);
  return HOLIDAY_DATES.includes(dateStr);
}


// ============================================================================
// CROWD SCORING
// ============================================================================

// Capacity tier multipliers (tiers 1-5, index off 1)
const CAPACITY_MULTIPLIERS = [null, 0.7, 0.8, 0.9, 1.1, 1.3];

function getCrowdScore(resort) {
  // If metro_gravity is in a separate lookup table (not on the resort object),
  // import your METRO_GRAVITY map here and do:
  //   const gravity = METRO_GRAVITY[resort[FIELD.name]] || 500;
  // Otherwise this reads it directly from the resort object:
  const gravity = resort[FIELD.metroGravity];
  const gravityNorm = gravity != null ? Math.min(gravity / 1000, 1) : 0.5;

  const holidayMult  = isHolidayWeekend() ? 1.3 : 1.0;
  const tier         = resort[FIELD.capacityTier];
  const tierMult     = (tier && CAPACITY_MULTIPLIERS[tier]) ? CAPACITY_MULTIPLIERS[tier] : 1.0;

  return Math.min(gravityNorm * holidayMult * tierMult, 1);
}

function crowdLabel(score) {
  if (score < 0.30)  return 'Light';
  if (score < 0.55)  return 'Moderate';
  if (score < 0.75)  return 'Heavy';
  return 'Very Heavy';
}


// ============================================================================
// WEATHER
// ============================================================================

async function fetchWeather(resort) {
  const summitFt  = resort[FIELD.summit] || resort[FIELD.base] || 5000;
  const elevationM = Math.round(summitFt * 0.3048);

  const url = new URL('https://api.open-meteo.com/v1/forecast');
  url.searchParams.set('latitude',      resort[FIELD.lat]);
  url.searchParams.set('longitude',     resort[FIELD.lon]);
  url.searchParams.set('elevation',     elevationM);
  url.searchParams.set('hourly',        'snowfall,snow_depth');
  url.searchParams.set('past_days',     '3');
  url.searchParams.set('forecast_days', '3');
  url.searchParams.set('timezone',      'UTC');

  const resp = await fetch(url.toString(), { signal: AbortSignal.timeout(8000) });
  if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
  return resp.json();
}

// Fetch in batches to avoid overwhelming Open-Meteo
async function fetchWeatherBatch(resorts, batchSize = 20) {
  const weatherMap = new Map();
  for (let i = 0; i < resorts.length; i += batchSize) {
    const batch = resorts.slice(i, i + batchSize);
    const settled = await Promise.allSettled(
      batch.map(r =>
        fetchWeather(r)
          .then(w => ({ name: r[FIELD.name], weather: w }))
          .catch(err => { throw Object.assign(err, { resortName: r[FIELD.name] }); })
      )
    );
    for (const result of settled) {
      if (result.status === 'fulfilled') {
        weatherMap.set(result.value.name, result.value.weather);
      } else {
        console.warn(`Weather fetch failed for ${result.reason?.resortName}: ${result.reason?.message}`);
      }
    }
  }
  return weatherMap;
}


// ============================================================================
// SCORING
// Open-Meteo units: snowfall in cm/h, snow_depth in meters
// ============================================================================

function scoreResort(resort, weather) {
  const times     = weather.hourly.time;
  const snowfall  = weather.hourly.snowfall;    // cm per hour
  const snowDepth = weather.hourly.snow_depth;  // meters

  const now    = Date.now();
  const ms72h  = 72  * 3600 * 1000;
  const ms48h  = 48  * 3600 * 1000;

  let newSnow72hCm = 0;
  let forecast48hCm = 0;
  let latestDepthM = 0;

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
  const s_crowd    = 1 - crowdScore;  // invert: low crowd = higher score
  const s_depth    = Math.min(baseDepthCm    / CAPS.baseDepth,   1);

  const total = (
    s_newSnow  * WEIGHTS.newSnow72h  +
    s_forecast * WEIGHTS.forecast48h +
    s_crowd    * WEIGHTS.crowd       +
    s_depth    * WEIGHTS.baseDepth
  ) * 100;

  // Convert cm to inches for display
  const cmToIn = cm => Math.round((cm / 2.54) * 10) / 10;

  return {
    total:          Math.round(total * 10) / 10,
    newSnow72hCm,
    forecast48hCm,
    baseDepthCm,
    crowdScore,
    newSnow72hIn:   cmToIn(newSnow72hCm),
    forecast48hIn:  cmToIn(forecast48hCm),
    baseDepthIn:    Math.round(baseDepthCm / 2.54),
    crowdLabel:     crowdLabel(crowdScore),
  };
}


// ============================================================================
// AI COPY GENERATION
// Calls Anthropic to write pick/skip sentences in skier voice.
// Falls back to a data-driven sentence if the API call fails.
// ============================================================================

async function generateCopy(resort, scores, regionLabel, type) {
  const name    = resort[FIELD.name];
  const state   = resort[FIELD.state];
  const isSkip  = type === 'skip';

  const dataContext = [
    `Mountain: ${name}, ${state}`,
    `Region: ${regionLabel}`,
    `New snow (last 72h): ${scores.newSnow72hIn}"`,
    `Forecast snow (next 48h): ${scores.forecast48hIn}"`,
    `Base depth: ${scores.baseDepthIn}"`,
    `Crowd outlook: ${scores.crowdLabel}`,
    `Score: ${scores.total}/100`,
  ].join('\n');

  const instruction = isSkip
    ? `Write 1-2 short sentences on why ${name} is the mountain to skip this weekend. Be direct. Lead with the actual reason (crowds, no new snow, thin base -- pick the worst factor from the data). Skier talking to skier. No em dashes. No marketing language. No fluff.`
    : `Write exactly 2 sentences on why ${name} is the pick this weekend. First sentence: the snow situation. Second sentence: one specific reason it is worth the drive over the obvious choice. Skier voice. Direct. No em dashes. No marketing language.`;

  try {
    const resp = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type':    'application/json',
        'x-api-key':       process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model:      'claude-sonnet-4-20250514',
        max_tokens: 150,
        system:     'You write for WhereToSkiNext, a ski recommendation newsletter. Short. Opinionated. Skier voice. Never use em dashes.',
        messages:   [{ role: 'user', content: `${instruction}\n\n${dataContext}` }],
      }),
      signal: AbortSignal.timeout(10000),
    });

    if (!resp.ok) throw new Error(`Anthropic ${resp.status}`);
    const data = await resp.json();
    return data.content?.[0]?.text?.trim() || buildFallbackCopy(scores, name, isSkip);
  } catch (err) {
    console.warn(`Copy generation failed for ${name}:`, err.message);
    return buildFallbackCopy(scores, name, isSkip);
  }
}

function buildFallbackCopy(scores, name, isSkip) {
  if (isSkip) {
    const reason = scores.crowdScore > 0.6
      ? `${scores.crowdLabel.toLowerCase()} crowds`
      : scores.newSnow72hIn < 2
        ? 'no meaningful new snow'
        : 'thin base';
    return `Skip ${name} this weekend -- ${reason}.`;
  }
  const snowLine = scores.newSnow72hIn > 0
    ? `${scores.newSnow72hIn}" in the last 72 hours.`
    : `Forecast shows ${scores.forecast48hIn}" coming.`;
  return `${snowLine} ${scores.crowdLabel} crowds expected this weekend.`;
}


// ============================================================================
// EMAIL HTML
// Generates clean, inline-styled HTML for Beehiiv.
// Includes a reviewer note at the top -- this is a draft, not final copy.
// ============================================================================

function buildEmailHtml(regionResults, generatedAt) {
  const blocks = regionResults.map(r => buildRegionBlock(r)).join('\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>WhereToSkiNext Weekly Draft</title>
</head>
<body style="margin:0;padding:0;background-color:#f0f4f8;font-family:Helvetica,Arial,sans-serif;">

<!-- ================================================================
     REVIEWER NOTE -- remove before sending
     Generated: ${generatedAt}
     This is a draft. Review each pick, edit copy as needed, then send.
     Score scale: 0-100. Anything under 30 gets a warning below.
     Field explanations:
       New snow (72h)  = snowfall in the past 3 days
       Forecast (48h)  = snowfall in the next 2 days
       Base depth      = current snowpack at summit elevation
       Crowd outlook   = Light / Moderate / Heavy / Very Heavy
     ================================================================ -->

<div style="max-width:600px;margin:0 auto;background:#ffffff;">

  <!-- Header -->
  <div style="background:#0f1c2e;padding:24px 32px;text-align:center;">
    <a href="https://www.wheretoskinext.com/?utm_source=newsletter&utm_medium=email&utm_campaign=weekly-pick"
       style="color:#5aaddc;font-size:18px;font-weight:700;text-decoration:none;letter-spacing:0.5px;">
      WhereToSkiNext.com
    </a>
  </div>

  <!-- Intro -->
  <div style="padding:24px 32px 0;border-bottom:1px solid #e8ecef;">
    <p style="color:#4A5B6A;font-size:16px;line-height:1.6;margin:0 0 16px;">
      One pick per region. No drive time, no pass filter. That is what the site is for.
      This week:
    </p>
    <ul style="color:#1a2e45;font-size:15px;line-height:1.8;margin:0 0 24px;padding-left:20px;">
      ${regionResults.map(r =>
        `<li><strong>${r.region.label}:</strong> ${r.pick.resort[FIELD.name]} (${r.pick.scores.newSnow72hIn}" new, ${r.pick.scores.crowdLabel} crowds)</li>`
      ).join('\n      ')}
    </ul>
  </div>

  ${blocks}

  <!-- CTA Footer -->
  <div style="padding:32px;text-align:center;border-top:1px solid #e8ecef;">
    <p style="color:#4A5B6A;font-size:15px;margin:0 0 16px;">
      Not in these regions? Personalize the pick for your location, pass, and drive time.
    </p>
    <a href="https://www.wheretoskinext.com/?utm_source=newsletter&utm_medium=email&utm_campaign=weekly-pick"
       style="display:inline-block;background:#5aaddc;color:#ffffff;font-size:15px;font-weight:700;
              padding:12px 28px;border-radius:6px;text-decoration:none;">
      Find Your Mountain
    </a>
  </div>

  <!-- Footer -->
  <div style="background:#283642;padding:24px 32px;">
    <p style="color:#F3F1EE;font-size:13px;margin:0 0 6px;">
      WhereToSkiNext Weekly
    </p>
    <p style="color:#9aa8b4;font-size:12px;margin:0;">
      Auto-generated ${generatedAt}. One honest pick per region, every week.
    </p>
  </div>

</div>
</body>
</html>`;
}


function buildRegionBlock(r) {
  const pick   = r.pick;
  const skip   = r.skip;
  const runners = r.runners;
  const scores = pick.scores;

  const warningBanner = scores.total < MIN_PUBLISH_SCORE
    ? `<div style="background:#fff8e1;border:1px solid #f0c040;border-radius:6px;
                   padding:12px 16px;margin-bottom:16px;font-size:13px;color:#7a5a00;">
        <strong>Thin conditions in ${r.region.label} this week (score: ${scores.total}/100).</strong>
        Consider skipping this region or flagging it as advisory.
       </div>`
    : '';

  const runnerLine = runners.length > 0
    ? `<p style="font-size:11px;color:#8899aa;margin:16px 0 0;line-height:1.5;">
         Also considered: ${runners.map(x => `${x.resort[FIELD.name]} (${x.scores.total})`).join(', ')}
       </p>`
    : '';

  const skipBlock = skip
    ? `<div style="background:#fdf5f4;border-left:3px solid #c9503a;padding:14px 16px;
                   margin-top:24px;border-radius:0 6px 6px 0;">
         <p style="font-size:10px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;
                   color:#c9503a;margin:0 0 6px;">Skip It</p>
         <p style="font-size:15px;font-weight:700;color:#1a2e45;margin:0 0 6px;">
           ${skip.resort[FIELD.name]}, ${skip.resort[FIELD.state]}
         </p>
         <p style="font-size:14px;color:#4A5B6A;line-height:1.6;margin:0;">
           ${skip.copy}
         </p>
       </div>`
    : '';

  return `
<!-- ── ${r.region.label.toUpperCase()} ─────────────────────────────────── -->
<div style="padding:32px 32px 24px;border-bottom:1px solid #e8ecef;">
  ${warningBanner}

  <p style="font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;
             color:#5aaddc;margin:0 0 12px;">
    ${r.region.label}
  </p>

  <h2 style="font-family:Helvetica,Arial,sans-serif;font-size:26px;font-weight:700;
              color:#0f1c2e;margin:0 0 2px;line-height:1.1;">
    ${pick.resort[FIELD.name]}
  </h2>
  <p style="font-size:13px;color:#8899aa;margin:0 0 20px;">
    ${pick.resort[FIELD.state]} &nbsp;&middot;&nbsp; Score: ${scores.total}/100
  </p>

  <!-- Stats row -->
  <table cellpadding="0" cellspacing="0" border="0" width="100%"
         style="border-collapse:separate;border-spacing:6px 0;margin:0 0 20px;">
    <tr>
      <td width="25%" style="background:#f0f4f8;border-radius:6px;padding:10px 12px;
                              font-size:12px;color:#4A5B6A;text-align:center;vertical-align:top;">
        <strong style="display:block;font-size:22px;font-weight:700;color:#0f1c2e;line-height:1;">
          ${scores.newSnow72hIn}"
        </strong>
        new snow<br/>72h
      </td>
      <td width="25%" style="background:#f0f4f8;border-radius:6px;padding:10px 12px;
                              font-size:12px;color:#4A5B6A;text-align:center;vertical-align:top;">
        <strong style="display:block;font-size:22px;font-weight:700;color:#0f1c2e;line-height:1;">
          ${scores.forecast48hIn}"
        </strong>
        forecast<br/>48h
      </td>
      <td width="25%" style="background:#f0f4f8;border-radius:6px;padding:10px 12px;
                              font-size:12px;color:#4A5B6A;text-align:center;vertical-align:top;">
        <strong style="display:block;font-size:22px;font-weight:700;color:#0f1c2e;line-height:1;">
          ${scores.baseDepthIn}"
        </strong>
        base<br/>depth
      </td>
      <td width="25%" style="background:#f0f4f8;border-radius:6px;padding:10px 12px;
                              font-size:12px;color:#4A5B6A;text-align:center;vertical-align:top;">
        <strong style="display:block;font-size:22px;font-weight:700;color:#0f1c2e;line-height:1;">
          ${scores.crowdLabel}
        </strong>
        crowd<br/>outlook
      </td>
    </tr>
  </table>

  <!-- Pick copy (AI-generated, edit as needed) -->
  <p style="font-size:16px;color:#1a2e45;line-height:1.65;margin:0 0 20px;">
    ${pick.copy}
  </p>

  <a href="https://www.wheretoskinext.com/?utm_source=newsletter&utm_medium=email&utm_campaign=weekly-pick&state=${pick.resort[FIELD.state]}"
     style="display:inline-block;background:#5aaddc;color:#ffffff;font-size:14px;font-weight:700;
            padding:10px 22px;border-radius:6px;text-decoration:none;">
    Find Your Mountain
  </a>

  ${skipBlock}
  ${runnerLine}
</div>`;
}


// ============================================================================
// BEEHIIV DRAFT
// ============================================================================

async function postBeehiivDraft(subject, previewText, htmlContent) {
  const pubId  = process.env.BEEHIIV_PUBLICATION_ID;
  const apiKey = process.env.BEEHIIV_API_KEY;

  if (!pubId || !apiKey) throw new Error('Missing BEEHIIV_PUBLICATION_ID or BEEHIIV_API_KEY');

  const resp = await fetch(`https://api.beehiiv.com/v2/publications/${pubId}/posts`, {
    method: 'POST',
    headers: {
      'Content-Type':  'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      subject,
      preview_text:   previewText,
      status:         'draft',
      content_html:   htmlContent,
      // If Beehiiv rejects content_html, try wrapping it in content_json
      // as a free_email_component block. See: https://developers.beehiiv.com
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

  // Auth: allow Vercel cron (x-vercel-cron header) or manual trigger (Bearer secret)
  const cronSecret  = process.env.CRON_SECRET;
  const isVercelCron = req.headers['x-vercel-cron'] === '1';
  const authHeader   = req.headers['authorization'] || '';
  const isManual     = cronSecret && authHeader === `Bearer ${cronSecret}`;

  if (!isVercelCron && !isManual) {
    return res.status(401).json({ error: 'Unauthorized. Pass Authorization: Bearer <CRON_SECRET> to trigger manually.' });
  }

  const generatedAt = new Date().toLocaleString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
    hour: 'numeric', minute: '2-digit', timeZoneName: 'short',
  });

  // Load resort data
  // resorts-national.js must have at its bottom:
  //   if (typeof module !== 'undefined') module.exports = { RESORTS_NATIONAL };
  let allResorts;
  try {
    const data = require('../resorts-national.js');
    allResorts  = data.RESORTS_NATIONAL
               || data.resorts
               || (Array.isArray(data) ? data : null);
    if (!allResorts) {
      const key = Object.keys(data).find(k => Array.isArray(data[k]));
      allResorts = key ? data[key] : [];
    }
  } catch (err) {
    return res.status(500).json({
      error: 'Could not load resort data.',
      detail: err.message,
      fix: 'Add this line at the bottom of resorts-national.js: if (typeof module !== "undefined") module.exports = { RESORTS_NATIONAL };',
    });
  }

  if (!allResorts || allResorts.length === 0) {
    return res.status(500).json({ error: 'Resort data loaded but is empty.' });
  }

  // Process each region
  const regionResults = [];

  for (const [regionId, region] of Object.entries(REGIONS)) {
    console.log(`Processing region: ${region.label}`);
    try {
      const regionResorts = allResorts.filter(r =>
        r && r[FIELD.state] && region.states.includes(r[FIELD.state])
      );

      if (regionResorts.length === 0) {
        console.warn(`No resorts found for ${region.label}. Check FIELD.state = '${FIELD.state}' against your data.`);
        continue;
      }

      console.log(`  ${regionResorts.length} resorts. Fetching weather...`);
      const weatherMap = await fetchWeatherBatch(regionResorts, 20);

      // Score every resort that returned weather
      const scored = [];
      for (const resort of regionResorts) {
        const weather = weatherMap.get(resort[FIELD.name]);
        if (!weather) continue;
        try {
          const scores = scoreResort(resort, weather);
          scored.push({ resort, scores });
        } catch (err) {
          console.warn(`  Scoring failed for ${resort[FIELD.name]}:`, err.message);
        }
      }

      if (scored.length === 0) {
        console.warn(`  No resorts scored in ${region.label}`);
        continue;
      }

      // Sort descending
      scored.sort((a, b) => b.scores.total - a.scores.total);

      const pick    = scored[0];
      const runners = scored.slice(1, 4);

      // Skip: highest-crowd resort in the bottom third (the one everyone defaults to that is bad this week)
      const bottomThird    = scored.slice(Math.max(1, Math.floor(scored.length * 0.67)));
      const skipCandidate  = [...bottomThird].sort((a, b) => b.scores.crowdScore - a.scores.crowdScore)[0];
      const skip           = (skipCandidate && skipCandidate.resort[FIELD.name] !== pick.resort[FIELD.name])
                             ? skipCandidate
                             : null;

      console.log(`  Pick: ${pick.resort[FIELD.name]} (${pick.scores.total}). Skip: ${skip?.resort[FIELD.name] || 'none'}`);

      // Generate copy for pick + skip in parallel
      const [pickCopy, skipCopy] = await Promise.all([
        generateCopy(pick.resort, pick.scores, region.label, 'pick'),
        skip ? generateCopy(skip.resort, skip.scores, region.label, 'skip') : Promise.resolve(''),
      ]);

      regionResults.push({
        regionId,
        region,
        pick:    { ...pick, copy: pickCopy },
        skip:    skip ? { ...skip, copy: skipCopy } : null,
        runners,
      });

    } catch (err) {
      console.error(`Region ${regionId} failed:`, err.message);
      // Continue with other regions rather than aborting the whole run
    }
  }

  if (regionResults.length === 0) {
    return res.status(500).json({ error: 'No regions produced results. Check weather API and resort data.' });
  }

  // Build subject line
  const pickSummary = regionResults
    .map(r => `${r.region.label}: ${r.pick.resort[FIELD.name]}`)
    .join(', ');
  const subject     = `The pick this weekend -- ${pickSummary}`;
  const previewText = regionResults
    .map(r => `${r.region.label}: ${r.pick.resort[FIELD.name]} (${r.pick.scores.newSnow72hIn}" new)`)
    .join(' | ');

  // Build HTML
  const emailHtml = buildEmailHtml(regionResults, generatedAt);

  // Post draft to Beehiiv
  let beehiivData;
  try {
    beehiivData = await postBeehiivDraft(subject, previewText, emailHtml);
  } catch (err) {
    console.error('Beehiiv draft failed:', err.message);
    // Return the HTML anyway so nothing is lost
    return res.status(207).json({
      warning:  'Beehiiv draft failed -- HTML returned below for manual paste.',
      detail:   err.message,
      subject,
      previewText,
      emailHtml,
      picks:    regionResults.map(r => ({
        region: r.region.label,
        pick:   r.pick.resort[FIELD.name],
        score:  r.pick.scores.total,
      })),
    });
  }

  return res.status(200).json({
    success:      true,
    generatedAt,
    subject,
    previewText,
    regionsRun:   regionResults.length,
    picks: regionResults.map(r => ({
      region:    r.region.label,
      pick:      r.pick.resort[FIELD.name],
      score:     r.pick.scores.total,
      newSnowIn: r.pick.scores.newSnow72hIn,
      crowds:    r.pick.scores.crowdLabel,
      skip:      r.skip?.resort[FIELD.name] || null,
      runners:   r.runners.map(x => x.resort[FIELD.name]),
    })),
    beehiivPostId: beehiivData?.data?.id,
    beehiivUrl:    beehiivData?.data?.web_url || beehiivData?.data?.url,
  });
};

// Vercel function config -- maxDuration also set in vercel.json
module.exports.config = { maxDuration: 120 };
