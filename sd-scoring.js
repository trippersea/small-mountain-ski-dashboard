// ═══════════════════════════════════════════════════════════════════════════════
// SD-SCORING.JS — Pure scoring & math functions
// Depends on: sd-data.js (constants), state (defined in sd-app.js)
// All functions here are stateless math — they read state but never write it.
// ═══════════════════════════════════════════════════════════════════════════════

// ─── Null-safe number helper ──────────────────────────────────────────────────
function safeNum(value, fallback = null) {
  return Number.isFinite(value) ? value : fallback;
}

// ─── Environmental lapse rate ─────────────────────────────────────────────────
function summitTempF(baseTempF, baseElevFt, summitElevFt) {
  return baseTempF - ((summitElevFt - baseElevFt) / 1000) * 3.5;
}

// ─── Snow preference helpers ──────────────────────────────────────────────────
function snowPreferenceTarget() {
  const snow = Number(state.weights?.snow || 1);
  if (snow >= 15) return 12;
  if (snow >= 10) return 6;
  if (snow >= 5)  return 3;
  return 0;
}

function snowPreferenceLabel() {
  return { 1: 'Any Snow', 5: '3"+ Preferred', 10: '6"+ Storm', 15: 'Powder Day' }[Number(state.weights?.snow || 1)] || 'Any Snow';
}

// ─── Forecast accessor ────────────────────────────────────────────────────────
function tomorrowForecast(wx) {
  return wx?.forecast?.[0] || null;
}

// ─── Temperature bucket filter ────────────────────────────────────────────────
function tempBucketMatches(temp) {
  if (state.tempBucket === 'any' || temp == null) return true;
  if (state.tempBucket === 'ideal')  return temp >= 0 && temp <= 32;
  if (state.tempBucket === 'spring') return temp > 32;
  if (state.tempBucket === 'cold')   return temp < 0;
  return true;
}

// ─── Wind bucket filter ───────────────────────────────────────────────────────
function windBucketMatches(wind) {
  if (state.windBucket === 'any' || wind == null) return true;
  if (state.windBucket === 'light')  return wind <= 15;
  if (state.windBucket === 'breezy') return wind > 15 && wind <= 25;
  if (state.windBucket === 'holds')  return wind > 25;
  return true;
}

// ─── Crowd preference gate ────────────────────────────────────────────────────
function crowdPreferenceAllows(crowd) {
  const score = safeNum(crowd?.score, 0);
  if (state.weights.crowd >= 10) return score < 52;
  if (state.weights.crowd >= 5)  return score < 70;
  return true;
}

// ─── Temperature score index ──────────────────────────────────────────────────
function tempScoreIndex(temp) {
  if (temp == null) return 0.55;
  if (temp < 0)   return 0.20;
  if (temp <= 32) return 1.00;
  return 0.65;
}

// ─── Wind score index ─────────────────────────────────────────────────────────
function windScoreIndex(wind) {
  if (wind == null) return 0.55;
  if (wind <= 15)  return 1.00;
  if (wind <= 25)  return 0.45;
  return 0.10;
}

// ─── Crowd forecast ───────────────────────────────────────────────────────────
function crowdForecast(resort) {
  let score = 35;
  const reasons = [];

  const day = new Date().getDay();
  if (day === 6)            { score += 20; reasons.push('Saturday — busiest ski day'); }
  else if (day === 0)       { score += 12; reasons.push('Sunday traffic'); }
  else if (day === 5)       { score += 6;  reasons.push('Friday arrivals'); }
  else if (day >= 1 && day <= 4) { score -= 12; reasons.push('Midweek traffic drop'); }

  if (state.nightOnly) { score += 8; reasons.push('After-work night crowd'); }

  const drive = getDriveMins(resort.id);
  if (drive !== null) {
    if (drive <= 90)       { score += 16; reasons.push('Easy day-trip distance'); }
    else if (drive <= 150) { score += 8; }
    else if (drive >= 240) { score -= 8; reasons.push('Long drive filters casual traffic'); }
  }

  if (resort.passGroup === 'Epic' || resort.passGroup === 'Ikon') {
    score += 10; reasons.push('Major pass — large network traffic');
  } else if (resort.passGroup === 'Indy') {
    score += 4;
  }

  if (resort.vertical >= 1800) { score += 6; reasons.push('Big-mountain draw'); }
  if (resort.terrainPark)       { score += 4; reasons.push('Terrain park attracts crowds'); }
  if (resort.night)             { score += 5; reasons.push('Night skiing draws extra traffic'); }
  if (resort.price <= 85)       { score += 4; reasons.push('Value pricing drives volume'); }

  score = Math.max(5, Math.min(SCORING.CROWD_SCALE, score));

  let label;
  if (score >= 70)      label = 'Heavy';
  else if (score >= 52) label = 'Moderate';
  else if (score >= 35) label = 'Light-Moderate';
  else                  label = 'Light';

  return { score, label, confidence: 'Medium', reasons };
}

// ─── Crowd outlook score index ────────────────────────────────────────────────
function crowdOutlookIndex(crowd) {
  const score = safeNum(crowd?.score, 35);
  return Math.max(0, Math.min(1, 1 - (score - 5) / Math.max(1, (SCORING.CROWD_SCALE - 5))));
}

// ─── Skiability index (temp × wind tomorrow) ──────────────────────────────────
function skiabilityIndex(wx = null, forecastIndex = null) {
  const fc = forecastIndex === null ? tomorrowForecast(wx) : (wx?.forecast?.[forecastIndex] || null);
  if (!fc) return 0.55;
  return tempScoreIndex(fc.lo) * 0.55 + windScoreIndex(fc.wind) * 0.45;
}

// ─── Recent snow index (7-day history vs historical avg) ──────────────────────
function recentSnowIndex(resort) {
  const hist = historyCache.get(resort.id);
  if (hist && Number.isFinite(hist.total)) return Math.min(1, hist.total / 16);
  return Math.min(1, safeNum(resort.avgSnowfall, 0) / SCORING.SNOW_AVG_MAX);
}

// ─── Mountain size index ──────────────────────────────────────────────────────
function mountainSizeIndex(resort) {
  const v = Math.min(1, resort.vertical   / SCORING.VERTICAL_CEILING);
  const a = Math.min(1, resort.acres      / SCORING.ACRES_CEILING);
  const l = Math.min(1, resort.longestRun / SCORING.LONGEST_RUN_CEILING);
  return v * 0.50 + a * 0.35 + l * 0.15;
}

// ─── Mountain fit index ───────────────────────────────────────────────────────
function mountainFitIndex(resort) {
  const sizeIdx  = Math.sqrt(Math.max(0, mountainSizeIndex(resort)));
  const vertical = safeNum(resort.vertical, 0);
  const acres    = safeNum(resort.acres, 0);

  if (state.verticalFilter === 'small') {
    return Math.max(0, 1 - Math.abs(vertical - 700) / 700) * 0.75 +
           Math.max(0, 1 - Math.abs(acres - 120) / 180) * 0.25;
  }
  if (state.verticalFilter === 'mid') {
    return Math.max(0, 1 - Math.abs(vertical - 1250) / 600) * 0.75 +
           Math.max(0, 1 - Math.abs(acres - 350) / 350) * 0.25;
  }
  if (state.verticalFilter === 'big') {
    return Math.max(0, Math.min(1, (vertical - 1400) / 1200)) * 0.75 +
           Math.max(0, Math.min(1, (acres - 250) / 900)) * 0.25;
  }
  return 0.65 + sizeIdx * 0.35;
}

// ─── Drive score index ────────────────────────────────────────────────────────
function driveScoreIndex(driveMins) {
  const drive = safeNum(driveMins, null);
  if (drive === null) return SCORING.DRIVE_DEFAULT;
  if (drive <= 75)  return 1.0;
  if (drive <= 120) return 0.85 - ((drive - 75)  / 45) * 0.20;
  if (drive <= 180) return 0.65 - ((drive - 120) / 60) * 0.25;
  if (drive <= 240) return 0.40 - ((drive - 180) / 60) * 0.20;
  return Math.max(0, 0.20 - ((drive - 240) / 60) * 0.10);
}

// ─── Price index (pure price inversion — separated from mountain size) ─────────
// AUDIT FIX: valueIndex was blending price 80% + mountain size 20%.
// That diluted both signals. Now it's pure price, and mountain size
// contributes separately through the 'fit' component of plannerScoreBreakdown.
function priceIndex(resort) {
  const price = safeNum(resort?.price, null);
  if (price === null) return 0.50;
  return Math.max(0, Math.min(1,
    (SCORING.PRICE_MAX - price) / (SCORING.PRICE_MAX - SCORING.PRICE_MIN)
  ));
}

function valueIndex(resort) {
  return priceIndex(resort);
}

// ─── Snow quality index ───────────────────────────────────────────────────────
function snowQualityIndex(resort, snowTotal, wx = null, forecastIndex = null) {
  const target     = snowPreferenceTarget();
  const liveSnow   = safeNum(snowTotal, 0);
  const reliability = Math.min(1, safeNum(resort.avgSnowfall, 0) / SCORING.SNOW_AVG_MAX);
  const recent     = recentSnowIndex(resort);

  let live;
  if (target === 0) {
    live = Math.min(1, liveSnow / SCORING.SNOW_SCALE);
  } else if (liveSnow < target) {
    live = 0.15 * Math.min(1, liveSnow / Math.max(1, target));
  } else {
    const cap = Math.max(target + 4, target === 12 ? 18 : SCORING.SNOW_SCALE + target);
    live = Math.min(1, (liveSnow - target) / Math.max(1, cap - target));
  }

  return live * 0.72 + recent * 0.18 + reliability * 0.10;
}

// ─── FIXED: normalizedWeights — now uses user preferences ────────────────────
// CRITICAL BUG FIX: previously always returned fixed SCORE_WEIGHTS regardless
// of what the user selected. Now preference buttons actually change the ranking.
function normalizedWeights() {
  const snowPref  = state.weights.snow  || 1;  // 1, 5, 10, or 15
  const crowdPref = state.weights.crowd || 1;  // 1, 5, or 10
  const valuePref = state.weights.value || 0;  // 0, 1, 5, or 10

  const snowW  = { 1: 0.22, 5: 0.30, 10: 0.38, 15: 0.45 }[snowPref]  ?? 0.30;
  const crowdW = { 1: 0.07, 5: 0.11, 10: 0.17 }[crowdPref]            ?? 0.10;
  const valueW = { 0: 0.05, 1: 0.06, 5: 0.11, 10: 0.17 }[valuePref]  ?? 0.10;

  const remaining = Math.max(0.1, 1 - snowW - crowdW - valueW);

  return {
    snow:       snowW,
    skiability: remaining * 0.38,
    fit:        remaining * 0.32,
    drive:      remaining * 0.30,
    value:      valueW,
    crowd:      crowdW,
  };
}

// ─── Planner score breakdown ───────────────────────────────────────────────────
function plannerScoreBreakdown(resort, weather, forecastIndex = null, w = null) {
  if (!w) w = normalizedWeights();
  const forecast  = weather?.forecast || [];
  const picks     = forecastIndex === null ? forecast : (forecast[forecastIndex] ? [forecast[forecastIndex]] : []);
  const snowTotal = picks.reduce((sum, f) => sum + safeNum(f?.snow, 0), 0);
  const crowd     = crowdForecast(resort);

  const normalized = {
    snow:       snowQualityIndex(resort, snowTotal, weather, forecastIndex),
    skiability: skiabilityIndex(weather, forecastIndex),
    fit:        mountainFitIndex(resort),
    value:      valueIndex(resort),
    crowd:      crowdOutlookIndex(crowd),
    drive:      driveScoreIndex(getDriveMins(resort.id)),
  };

  const components = {
    snow:       normalized.snow       * (w.snow       || 0) * 100,
    skiability: normalized.skiability * (w.skiability || 0) * 100,
    fit:        normalized.fit        * (w.fit        || 0) * 100,
    value:      normalized.value      * (w.value      || 0) * 100,
    crowd:      normalized.crowd      * (w.crowd      || 0) * 100,
    drive:      normalized.drive      * (w.drive      || 0) * 100,
  };

  const score     = components.snow + components.skiability + components.fit +
                    components.value + components.crowd + components.drive;
  const baseScore = Math.round(score * 10) / 10;

  return {
    score: baseScore,
    baseScore,
    passBonus: 0,
    snowTotal,
    drive:     getDriveMins(resort.id),
    resortId:  resort.id,
    crowdLabel: crowd.label,
    normalized,
    components,
    condIdx:   null,
    condBonus: 0,
  };
}

// ─── Ski score breakdown (public-facing wrapper) ───────────────────────────────
function skiScoreBreakdown(resort, weather, forecastIndex = null) {
  const w    = normalizedWeights();
  const base = plannerScoreBreakdown(resort, weather, forecastIndex, w);
  return {
    ...base,
    skiScore:        Math.round(base.baseScore),
    skiScoreRanking: Math.round(base.score),
    passBonus: 0,
    factors: {
      snow:       Math.round(base.components.snow),
      skiability: Math.round(base.components.skiability),
      fit:        Math.round(base.components.fit),
      value:      Math.round(base.components.value),
      crowd:      Math.round(base.components.crowd),
      drive:      Math.round(base.components.drive),
    },
  };
}

// ─── Pass break-even calculator ───────────────────────────────────────────────
// Returns: { savings, daysToBreakEven, recommendPass } for a given pass type
function passBreakEven(passGroup, skiDays, avgTicketPrice) {
  const passCost = PASS_PRICES[passGroup];
  if (!passCost || !skiDays || !avgTicketPrice) return null;
  const ticketTotal   = skiDays * avgTicketPrice;
  const savings       = ticketTotal - passCost;
  const breakEvenDays = Math.ceil(passCost / avgTicketPrice);
  return {
    passCost,
    ticketTotal: Math.round(ticketTotal),
    savings:     Math.round(savings),
    breakEvenDays,
    worthIt:     savings > 0,
  };
}

// ─── Weather risk score (0–100) ───────────────────────────────────────────────
function weatherRiskScore(wx) {
  if (!wx) return 50;
  const fc = tomorrowForecast(wx);
  if (!fc) return 50;
  let risk = 0;
  if (fc.wind > 25) risk += 35;
  else if (fc.wind > 15) risk += 12;
  if (fc.lo < 0)   risk += 20;
  else if (fc.lo > 32) risk += 8;
  if ((fc.snow || 0) < 1) risk += 4;
  return Math.max(0, Math.min(100, risk));
}

// ─── Decision context (time/day aware) ────────────────────────────────────────
function getDecisionContext() {
  const now  = new Date();
  const day  = now.getDay();
  const hour = now.getHours();

  const hasNight  = state.nightOnly === true;
  const hasOrigin = !!state.origin;

  let timeframe;
  if (hasNight)              timeframe = 'tonight';
  else if (day >= 1 && day <= 4) timeframe = hour < 15 ? 'today' : 'tomorrow';
  else if (day === 5)        timeframe = hour < 15 ? 'today' : 'this weekend';
  else                       timeframe = 'today';

  const tripType = hasNight ? 'night ski' : 'ski';
  const audience = hasOrigin && state.origin.label ? state.origin.label : null;

  return {
    timeframe,
    tripType,
    audience,
    headline: `Best places to ${tripType} ${timeframe}`,
    subhead:  audience
      ? `Ranked from ${audience} using forecast, drive time, crowds, and your score settings.`
      : `Ranked using forecast, crowds, and your score settings. Add your location for drive-based picks.`,
  };
}

// ─── Backup pick reason ───────────────────────────────────────────────────────
function backupReason(primary, backup) {
  if (!primary || !backup) return 'solid fallback';
  if (backup.crowd.score     < primary.crowd.score - 8)   return 'lighter crowds';
  if ((backup.drive ?? 999)  < (primary.drive ?? 999) - 20) return 'shorter drive';
  if (backup.risk            < primary.risk - 10)          return 'lower weather risk';
  if (backup.resort.price    < primary.resort.price - 10)  return 'better value';
  return 'strong alternate if plans change';
}

// ─── Primary pick editorial reasons ──────────────────────────────────────────
function primaryReasons(item) {
  if (!item) return [];
  const reasons = [];
  const storm = item.storm || 0;
  if (storm >= 6) reasons.push(`${storm.toFixed(1)}" forecast over 3 days`);
  const liveDrive = getDriveMins(item.resort.id);
  if (liveDrive !== null && liveDrive <= 120 && !isDriveEstimated(item.resort.id))
    reasons.push(`Easy drive at ${formatDrive(item.resort.id)}`);
  else if (liveDrive !== null && liveDrive <= 120)
    reasons.push(`Close by at ${formatDrive(item.resort.id)}`);
  const cLabel = item.crowd?.label || '';
  if (cLabel === 'Light' || cLabel === 'Light-Moderate')
    reasons.push('Lighter crowd outlook');
  if (state.nightOnly && item.resort.night)
    reasons.push('Night skiing available');
  if (state.passFilter && state.passFilter !== 'All' && item.resort.passGroup === state.passFilter)
    reasons.push(`${item.resort.passGroup} pass access`);
  return reasons.slice(0, 3);
}

// ─── Hidden gem score ─────────────────────────────────────────────────────────
function hiddenGemScore(resort) {
  const crowd = crowdForecast(resort).score;
  let score = 0;
  score += Math.max(0, 100 - crowd);
  score += Math.max(0, 120 - resort.price);
  score += Math.min(60, resort.vertical / 25);
  score += resort.avgSnowfall / 4;
  if (resort.passGroup === 'Independent' || resort.passGroup === 'Indy') score += 15;
  return Math.round(score);
}

// ─── Inline SVG sparkline ─────────────────────────────────────────────────────
function snowSparkline(days) {
  if (!days?.length) return '';
  const maxVal = Math.max(...days.map(d => d.snow), 0.5);
  const W = 7, GAP = 3, H = 22;
  const bars = days.map((d, i) => {
    const barH = d.snow > 0 ? Math.max(3, Math.round(d.snow / maxVal * H)) : 2;
    const fill = d.snow >= 4 ? '#1d4ed8' : d.snow >= 1 ? '#2b6de9' : d.snow > 0 ? '#93c5fd' : '#dde5f0';
    return `<rect x="${i*(W+GAP)}" y="${H-barH}" width="${W}" height="${barH}" rx="1" fill="${fill}"><title>${d.date}: ${d.snow}"</title></rect>`;
  });
  const svgW = days.length * (W + GAP) - GAP;
  return `<svg width="${svgW}" height="${H}" viewBox="0 0 ${svgW} ${H}" class="snow-sparkline" aria-label="7-day snowfall chart">${bars.join('')}</svg>`;
}

// ─── Crowd CSS class ──────────────────────────────────────────────────────────
function crowdClass(label) {
  return `crowd-${label.toLowerCase().replace(/\s+/g, '-')}`;
}

// ─── Score badge CSS class ────────────────────────────────────────────────────
function scoreBadgeClass(rawScore) {
  if (rawScore === null) return '';
  if (rawScore >= 70) return 'score-great';
  if (rawScore >= 50) return 'score-good';
  return 'score-low';
}
