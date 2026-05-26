/**
 * /api/newsletter-generator.js
 *
 * Scores resorts in 4 regions, picks one per region + a skip,
 * generates copy via Anthropic, and posts a DRAFT to Beehiiv.
 *
 * Runs Thursday 11pm UTC (7pm ET) via Vercel cron.
 * Manual trigger: GET /api/newsletter-generator with Authorization: Bearer <CRON_SECRET>
 *
 * Required env vars:
 *   BEEHIIV_API_KEY
 *   BEEHIIV_PUBLICATION_ID
 *   ANTHROPIC_API_KEY
 *   CRON_SECRET  (any random string -- openssl rand -hex 32)
 *
 * One-line change required in resorts.js (or resorts-national.js) -- add at the very bottom:
 *   if (typeof module !== 'undefined') module.exports = { RESORTS };
 */


// ============================================================================
// REGIONS
// ============================================================================

const REGIONS = {
  'new-england': {
    label:  'New England',
    states: ['VT', 'NH', 'ME', 'MA', 'CT', 'RI'],
  },
  'midwest': {
    label:  'Midwest',
    states: ['MI', 'WI', 'MN', 'OH', 'IN', 'IL', 'MO', 'IA'],
  },
  'colorado': {
    label:  'Colorado',
    states: ['CO'],
  },
  'utah': {
    label:  'Utah',
    states: ['UT'],
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

// Normalization caps (cm)
const CAPS = {
  newSnow72h:   40,     // ~16" = perfect score
  forecast48h:  25,     // ~10" = perfect score
  baseDepth:    200,    // ~79" = perfect score
};

// A pick with total score below this threshold gets a "thin conditions" warning in the draft.
const MIN_PUBLISH_SCORE = 30;


// ============================================================================
// HOLIDAY CALENDAR
// Update at the start of each season. Fri-Sun windows of peak demand.
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
// No metro_gravity or capacity_tier on resort objects, so we derive from:
//   price  -- demand proxy ($295 Vail = very high, $35 small hill = low)
//   lifts  -- capacity proxy (more lifts = crowds spread out better)
// This produces sensible results: Vail scores ~1.0, Wolf Creek ~0.33.
// ============================================================================

function getCrowdScore(resort) {
  const price = resort.price || 80;
  const lifts = resort.lifts || 5;

  // Demand: normalize price against $280 ceiling
  const demandNorm = Math.min(price / 280, 1);

  // Capacity tier from lift count (more lifts = better crowd absorption)
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


// ============================================================================
// WEATHER
// Open-Meteo units: snowfall in cm/h, snow_depth in meters
// ============================================================================

async function fetchWeather(resort) {
  const elevFt = resort.summitElevation || resort.baseElevation || 5000;
  const elevM  = Math.round(elevFt * 0.3048);

  const url = new URL('https://api.open-meteo.com/v1/forecast');
  url.searchParams.set('latitude',      resort.lat);
  url.searchParams.set('longitude',     resort.lon);
  url.searchParams.set('elevation',     elevM);
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
  const snowfall  = weather.hourly.snowfall;    // cm per hour
  const snowDepth = weather.hourly.snow_depth;  // meters

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
    newSnow72hCm,
    forecast48hCm,
    baseDepthCm,
    crowdScore,
    newSnow72hIn:  cmToIn(newSnow72hCm),
    forecast48hIn: cmToIn(forecast48hCm),
    baseDepthIn:   Math.round(baseDepthCm / 2.54),
    crowdLabel:    crowdLabel(crowdScore),
  };
}


// ============================================================================
// COPY GENERATION
// Calls Anthropic for pick and skip copy. Falls back to data-driven sentences.
// ============================================================================

async function generateCopy(resort, scores, regionLabel, type) {
  const isSkip = type === 'skip';

  const dataBlock = [
    `Mountain: ${resort.name}, ${resort.state}`,
    `Region: ${regionLabel}`,
    `New snow (last 72h): ${scores.newSnow72hIn}"`,
    `Forecast snow (next 48h): ${scores.forecast48hIn}"`,
    `Base depth: ${scores.baseDepthIn}"`,
    `Crowd outlook: ${scores.crowdLabel}`,
    `Score: ${scores.total}/100`,
  ].join('\n');

  const instruction = isSkip
    ? `Write 1-2 sentences on why ${resort.name} is the mountain to skip this weekend. Lead with the actual reason (crowds, no new snow, thin base -- pick the worst factor). Direct. Skier voice. No em dashes. No marketing language.`
    : `Write exactly 2 sentences on why ${resort.name} is the pick this weekend. First sentence: the snow situation. Second sentence: one specific reason it is worth the drive. Direct. Skier voice. No em dashes. No marketing language.`;

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
        system:     'You write for WhereToSkiNext, a ski recommendation newsletter. Short. Opinionated. Skier talking to a skier. Never use em dashes.',
        messages:   [{ role: 'user', content: `${instruction}\n\n${dataBlock}` }],
      }),
      signal: AbortSignal.timeout(12000),
    });
    if (!resp.ok) throw new Error(`Anthropic ${resp.status}`);
    const data = await resp.json();
    return data.content?.[0]?.text?.trim() || fallbackCopy(scores, resort.name, isSkip);
  } catch (err) {
    console.warn(`Copy generation failed for ${resort.name}:`, err.message);
    return fallbackCopy(scores, resort.name, isSkip);
  }
}

function fallbackCopy(scores, name, isSkip) {
  if (isSkip) {
    const reason = scores.crowdScore > 0.6
      ? `${scores.crowdLabel.toLowerCase()} crowds expected`
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
REVIEWER NOTES -- delete before sending
Generated: ${generatedAt}
One pick per region, scored on: new snow (30%), forecast (25%), crowds (25%), base depth (20%).
Score < ${MIN_PUBLISH_SCORE}/100 = thin conditions warning. Edit copy freely before sending.
================================================================ -->

<div style="max-width:600px;margin:0 auto;background:#ffffff;">

  <div style="background:#0f1c2e;padding:24px 32px;text-align:center;">
    <a href="https://www.wheretoskinext.com/?utm_source=newsletter&utm_medium=email&utm_campaign=weekly-pick"
       style="color:#5aaddc;font-size:18px;font-weight:700;text-decoration:none;letter-spacing:0.5px;">
      WhereToSkiNext.com
    </a>
  </div>

  <div style="padding:24px 32px 0;border-bottom:1px solid #e8ecef;">
    <p style="color:#4A5B6A;font-size:16px;line-height:1.6;margin:0 0 12px;">
      One pick per region. No drive time, no pass filter -- that is what the site is for.
    </p>
    <ul style="color:#1a2e45;font-size:15px;line-height:1.9;margin:0 0 24px;padding-left:20px;">
      ${regionResults.map(r =>
        `<li><strong>${r.region.label}:</strong> ${r.pick.resort.name} &mdash; ${r.pick.scores.newSnow72hIn}" new, ${r.pick.scores.crowdLabel} crowds</li>`
      ).join('\n      ')}
    </ul>
  </div>

  ${blocks}

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

  <div style="background:#283642;padding:24px 32px;">
    <p style="color:#F3F1EE;font-size:13px;margin:0 0 6px;font-weight:700;">WhereToSkiNext Weekly</p>
    <p style="color:#9aa8b4;font-size:12px;margin:0;">Auto-generated ${generatedAt}.</p>
  </div>

</div>
</body>
</html>`;
}


function buildRegionBlock(r) {
  const scores  = r.pick.scores;

  const warning = scores.total < MIN_PUBLISH_SCORE
    ? `<div style="background:#fff8e1;border:1px solid #f0c040;border-radius:6px;
                   padding:12px 16px;margin-bottom:16px;font-size:13px;color:#7a5a00;">
        <strong>Thin conditions in ${r.region.label} (score: ${scores.total}/100).</strong>
        Consider skipping this region or flagging it as advisory.
       </div>`
    : '';

  const runners = r.runners.length > 0
    ? `<p style="font-size:11px;color:#8899aa;margin:16px 0 0;line-height:1.5;">
         Also considered: ${r.runners.map(x => `${x.resort.name} (${x.scores.total})`).join(', ')}
       </p>`
    : '';

  const skipBlock = r.skip
    ? `<div style="background:#fdf5f4;border-left:3px solid #c9503a;padding:14px 16px;
                   margin-top:24px;border-radius:0 6px 6px 0;">
         <p style="font-size:10px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;
                   color:#c9503a;margin:0 0 6px;">Skip It</p>
         <p style="font-size:15px;font-weight:700;color:#1a2e45;margin:0 0 6px;">
           ${r.skip.resort.name}, ${r.skip.resort.state}
         </p>
         <p style="font-size:14px;color:#4A5B6A;line-height:1.6;margin:0;">
           ${r.skip.copy}
         </p>
       </div>`
    : '';

  return `
<!-- ${r.region.label.toUpperCase()} -->
<div style="padding:32px 32px 24px;border-bottom:1px solid #e8ecef;">
  ${warning}

  <p style="font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;
             color:#5aaddc;margin:0 0 12px;">
    ${r.region.label}
  </p>

  <h2 style="font-family:Helvetica,Arial,sans-serif;font-size:26px;font-weight:700;
              color:#0f1c2e;margin:0 0 2px;line-height:1.1;">
    ${r.pick.resort.name}
  </h2>
  <p style="font-size:13px;color:#8899aa;margin:0 0 20px;">
    ${r.pick.resort.state} &nbsp;&middot;&nbsp; Score: ${scores.total}/100
  </p>

  <table cellpadding="0" cellspacing="0" border="0" width="100%"
         style="border-collapse:separate;border-spacing:6px 0;margin:0 0 20px;">
    <tr>
      <td width="25%" style="background:#f0f4f8;border-radius:6px;padding:10px 12px;
                              font-size:12px;color:#4A5B6A;text-align:center;vertical-align:top;">
        <strong style="display:block;font-size:22px;font-weight:700;color:#0f1c2e;line-height:1.1;">
          ${scores.newSnow72hIn}"
        </strong>
        new snow<br/>72h
      </td>
      <td width="25%" style="background:#f0f4f8;border-radius:6px;padding:10px 12px;
                              font-size:12px;color:#4A5B6A;text-align:center;vertical-align:top;">
        <strong style="display:block;font-size:22px;font-weight:700;color:#0f1c2e;line-height:1.1;">
          ${scores.forecast48hIn}"
        </strong>
        forecast<br/>48h
      </td>
      <td width="25%" style="background:#f0f4f8;border-radius:6px;padding:10px 12px;
                              font-size:12px;color:#4A5B6A;text-align:center;vertical-align:top;">
        <strong style="display:block;font-size:22px;font-weight:700;color:#0f1c2e;line-height:1.1;">
          ${scores.baseDepthIn}"
        </strong>
        base<br/>depth
      </td>
      <td width="25%" style="background:#f0f4f8;border-radius:6px;padding:10px 12px;
                              font-size:12px;color:#4A5B6A;text-align:center;vertical-align:top;">
        <strong style="display:block;font-size:22px;font-weight:700;color:#0f1c2e;line-height:1.1;">
          ${scores.crowdLabel}
        </strong>
        crowd<br/>outlook
      </td>
    </tr>
  </table>

  <p style="font-size:16px;color:#1a2e45;line-height:1.65;margin:0 0 20px;">
    ${r.pick.copy}
  </p>

  <a href="https://www.wheretoskinext.com/?utm_source=newsletter&utm_medium=email&utm_campaign=weekly-pick&state=${r.pick.resort.state}"
     style="display:inline-block;background:#5aaddc;color:#ffffff;font-size:14px;font-weight:700;
            padding:10px 22px;border-radius:6px;text-decoration:none;">
    Find Your Mountain
  </a>

  ${skipBlock}
  ${runners}
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
    method:  'POST',
    headers: {
      'Content-Type':  'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      title:         subject,
      subject,
      preview_text:  previewText,
      status:        'draft',
      content_html:  htmlContent,
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

  // Auth: Vercel cron sends x-vercel-cron; manual trigger uses CRON_SECRET
  const isVercelCron = req.headers['x-vercel-cron'] === '1';
  const cronSecret   = process.env.CRON_SECRET;
  const authHeader   = req.headers['authorization'] || '';
  const isManual     = cronSecret && authHeader === `Bearer ${cronSecret}`;

  if (!isVercelCron && !isManual) {
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
  // The file should have at its bottom:
  //   if (typeof module !== 'undefined') module.exports = { RESORTS };
  let allResorts;
  try {
    let data;
    try {
      data = require('../resorts-national.js');
    } catch {
      data = require('../resorts.js');
    }
    allResorts = data.RESORTS || data.RESORTS_NATIONAL || (Array.isArray(data) ? data : null);
    if (!allResorts) {
      const key = Object.keys(data).find(k => Array.isArray(data[k]) && data[k].length > 50);
      allResorts = key ? data[key] : [];
    }
  } catch (err) {
    return res.status(500).json({
      error:  'Could not load resort data.',
      detail: err.message,
      fix:    'Add this line at the bottom of resorts.js (or resorts-national.js): if (typeof module !== "undefined") module.exports = { RESORTS };',
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
          const scores = scoreResort(resort, weather);
          scored.push({ resort, scores });
        } catch (err) {
          console.warn(`  Score failed for ${resort.name}:`, err.message);
        }
      }

      if (scored.length === 0) {
        console.warn(`  No scored resorts in ${region.label}`);
        continue;
      }

      scored.sort((a, b) => b.scores.total - a.scores.total);

      const pick    = scored[0];
      const runners = scored.slice(1, 4);

      // Skip: most expensive resort (highest demand) that scores in the bottom third
      // This surfaces the well-known mountain that is a bad choice this specific weekend.
      const bottomThird   = scored.slice(Math.max(1, Math.floor(scored.length * 0.67)));
      const skipCandidate = [...bottomThird].sort((a, b) => b.resort.price - a.resort.price)[0];
      const skip          = (skipCandidate && skipCandidate.resort.name !== pick.resort.name)
                            ? skipCandidate
                            : null;

      console.log(`  Pick: ${pick.resort.name} (${pick.scores.total}). Skip: ${skip?.resort.name || 'none'}`);

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
    }
  }

  if (regionResults.length === 0) {
    return res.status(500).json({ error: 'No regions produced results. Check weather API and resort data.' });
  }

  const pickList    = regionResults.map(r => `${r.region.label}: ${r.pick.resort.name}`).join(', ');
  const subject     = `The pick this weekend -- ${pickList}`;
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
      region:    r.region.label,
      pick:      r.pick.resort.name,
      score:     r.pick.scores.total,
      newSnowIn: r.pick.scores.newSnow72hIn,
      crowds:    r.pick.scores.crowdLabel,
      skip:      r.skip?.resort.name || null,
      runners:   r.runners.map(x => x.resort.name),
    })),
    beehiivPostId: beehiivData?.data?.id,
    beehiivUrl:    beehiivData?.data?.web_url || beehiivData?.data?.url,
  });
};

module.exports.config = { maxDuration: 120 };
