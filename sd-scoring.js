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

// ─── Returns which forecast[] index matches state.targetDate ─────────────────
// forecast[0] = tomorrow, forecast[1] = day after, forecast[2] = third day.
// If targetDate is today or unset, returns 0.
// Clamps to 0–2 (the 3 days Open-Meteo returns).
function targetForecastIndex() {
  if (!(state.targetDate instanceof Date)) return 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(state.targetDate);
  target.setHours(0, 0, 0, 0);
  const diffDays = Math.round((target - today) / (1000 * 60 * 60 * 24));
  // diffDays 1 = tomorrow → index 0
  // diffDays 2 = day after → index 1
  // diffDays 3+ = three days out → index 2
  return Math.max(0, Math.min(2, diffDays - 1));
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
  if (state.weights.crowd >= 10) return score < 45;  // Avoid crowds: filter Moderate+
  if (state.weights.crowd >= 5)  return score < 65;  // Prefer quiet: filter Busy+
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

// ─── Holiday calendar ─────────────────────────────────────────────────────────
// Returns 0–1 holiday factor for a given Date object.
// 1.0 = peak holiday week, 0.7 = major holiday weekend, 0.4 = minor
function _holidayFactor(date) {
  const month = date.getMonth() + 1;
  const day   = date.getDate();
  const dow   = date.getDay();
  if (month === 12 && day >= 23)             return 1.0; // Christmas week
  if (month === 1  && day <= 1)              return 1.0; // New Year's Day
  if (month === 2  && day >= 15 && day <= 23) return 1.0; // Presidents Week
  if (month === 1  && day >= 13 && day <= 21 && dow <= 1) return 0.7; // MLK weekend
  if (month === 11 && day >= 22 && day <= 30) return 0.7; // Thanksgiving
  if (month === 10 && day >= 7  && day <= 14 && dow <= 1) return 0.4; // Columbus Day
  if (month === 11 && day >= 10 && day <= 12) return 0.4; // Veterans Day
  return 0;
}

// ─── Powder carry-forward factor ─────────────────────────────────────────────
// Blends forecast snow with recent history so day-after-storm crowds count.
function _powderFactor(resort, wx) {
  const idx        = targetForecastIndex();
  const fc         = wx?.forecast?.[idx] || null;
  const forecastIn = fc?.snow || 0;
  const hist       = historyCache.get(resort.id);
  const recentIn   = hist?.total ?? 0;
  const forecastF  = forecastIn >= 8 ? 1.0 : forecastIn >= 4 ? 0.5 : 0;
  const recentF    = recentIn  >= 12 ? 0.7 : recentIn  >= 6  ? 0.4 : 0;
  return Math.min(1.0, Math.max(forecastF, recentF));
}

// ─── Bluebird factor ──────────────────────────────────────────────────────────
// Clear, calm, ideal-temp day = demand spike. Mutually exclusive with heavy snow.
function _bluebirdFactor(wx) {
  const idx = targetForecastIndex();
  const fc  = wx?.forecast?.[idx] || null;
  if (!fc) return 0;
  if ((fc.snow || 0) > 3) return 0; // snowing = not bluebird
  if ((fc.wind || 0) > 20) return 0;
  if (fc.lo == null || fc.lo < 0 || fc.lo > 38) return 0;
  return 1;
}

// ─── Crowd forecast ───────────────────────────────────────────────────────────
// Calibrated formula: Killington Saturday bluebird → BUSY (69)
//                     Killington Holiday Saturday powder → AVOID (81)
//                     Bousquet Saturday bluebird → MODERATE (51)
// Depends on: METRO_GRAVITY and LIFT_CAPACITY_TIERS lookup tables loaded before
// this file in HTML via metro_gravity_final.js and lift_capacity_tiers_final.js
function crowdForecast(resort, wx = null) {

  // ── Step A: Base structural demand ────────────────────────────────────────
  const rawMG  = (typeof METRO_GRAVITY !== 'undefined' ? METRO_GRAVITY[resort.id] : null) ?? 500;
  const metroG = rawMG / 1000;

  const passScore = (resort.passGroup === 'Epic' || resort.passGroup === 'Ikon') ? 0.85
                  : resort.passGroup === 'Indy' ? 0.45
                  : 0.30;

  const destPull = Math.min(1, (resort.vertical / 3000) * 0.6 + (resort.acres / 1500) * 0.4);

  const resortAttr = Math.min(1,
    Math.min(1, resort.vertical / 3000) * 0.50 +
    (resort.terrainPark ? 0.20 : 0) +
    (resort.night       ? 0.15 : 0) +
    0.15
  );

  // Weights: metroGravity 40%, passScore 25%, destPull 20%, resortAttractors 15%
  const Dbase = 0.40*metroG + 0.25*passScore + 0.20*destPull + 0.15*resortAttr;

  // ── Step B: Day-specific multipliers ──────────────────────────────────────
  // Use target ski date (state.targetDate) if set, else today
  const targetDate = (state.targetDate instanceof Date) ? state.targetDate : new Date();
  const dow        = targetDate.getDay();
  const weekendF   = dow === 6 ? 1.0 : dow === 0 ? 0.7 : dow === 5 ? 0.3 : 0;
  const holidayF   = _holidayFactor(targetDate);
  const Mday       = 1 + 0.35*weekendF + 0.45*holidayF;

  const wxAvail  = !!wx;
  const powderF  = wxAvail ? _powderFactor(resort, wx) : 0;
  const blueF    = wxAvail ? _bluebirdFactor(wx)       : 0;
  const fc       = wx?.forecast?.[targetForecastIndex()] || null;
  const rainF    = (fc && fc.lo > 32 && (fc.snow || 0) < 1 && (fc.wind || 0) > 10) ? 0.6 : 0;
  const Mweather = 1 + 0.40*powderF + 0.15*blueF - 0.25*rainF;

  // Soft clamp: tanh preserves differentiation at the top end
  const Draw = Dbase * Mday * Mweather;
  const D    = Math.tanh(Draw / 1.5);

  // ── Step C: Capacity amplifier ────────────────────────────────────────────
  const rawTier  = (typeof LIFT_CAPACITY_TIERS !== 'undefined' ? LIFT_CAPACITY_TIERS[resort.id] : null) ?? 3;
  const liftInv  = (5 - rawTier) / (5 - 1); // linear: tier5=0, tier1=1
  const parkingC = resort.acres < 100 ? 0.75 : resort.acres < 300 ? 0.55 : 0.40;
  const terrainC = rawTier <= 2 ? 0.65 : rawTier <= 3 ? 0.50 : 0.35;
  const A        = 0.45*liftInv + 0.35*parkingC + 0.20*terrainC;

  // ── Final score: logistic squash (alpha=3.5, beta=1.5, center=0.40) ───────
  const logitIn = 3.5*(D - 0.40) + 1.5*(A - 0.5);
  const score   = Math.max(5, Math.min(100, Math.round(100 / (1 + Math.exp(-logitIn)))));

  // ── Labels ────────────────────────────────────────────────────────────────
  const label = score >= 80 ? 'Avoid'
              : score >= 65 ? 'Busy'
              : score >= 45 ? 'Moderate'
              :               'Quiet';

  // ── Confidence ────────────────────────────────────────────────────────────
  const confidence = (wxAvail && state.origin) ? 'High'
                   : (wxAvail || state.origin)  ? 'Medium'
                   :                              'Low';

  // ── Reasons ───────────────────────────────────────────────────────────────
  const reasons = [];
  if (dow === 6)                    reasons.push('Saturday — peak ski day');
  else if (dow === 0)               reasons.push('Sunday — still busy');
  else if (dow === 5)               reasons.push('Friday — early arrivals');
  else                              reasons.push('Midweek — lighter traffic');
  if (holidayF >= 1.0)              reasons.push('Holiday week — expect peak crowds');
  else if (holidayF >= 0.7)         reasons.push('Holiday weekend — busy');
  if (powderF >= 0.7)               reasons.push('Fresh snow — high demand');
  else if (powderF >= 0.4)          reasons.push('Recent snow drawing extra traffic');
  if (blueF)                        reasons.push('Bluebird day — peak demand conditions');
  if (rainF > 0)                    reasons.push('Wet/icy forecast — lighter crowds');
  if (resort.passGroup === 'Epic' || resort.passGroup === 'Ikon')
                                    reasons.push(`${resort.passGroup} pass — large network demand`);
  if (rawTier <= 2)                 reasons.push('Small hill — crowds build quickly');

  return { score, label, confidence, reasons };
}

// ─── Crowd outlook score index ────────────────────────────────────────────────
function crowdOutlookIndex(crowd) {
  const score = safeNum(crowd?.score, 35);
  return Math.max(0, Math.min(1, 1 - (score - 5) / 95));
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
  return Math.min(1, safeNum(resort.avgSnowfall, 0) / W.SCORING.SNOW_AVG_MAX);
}

// ─── Mountain size index ──────────────────────────────────────────────────────
function mountainSizeIndex(resort) {
  const v = Math.min(1, resort.vertical   / W.SCORING.VERTICAL_CEILING);
  const a = Math.min(1, resort.acres      / W.SCORING.ACRES_CEILING);
  const l = Math.min(1, resort.longestRun / W.SCORING.LONGEST_RUN_CEILING);
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
  if (drive === null) return W.SCORING.DRIVE_DEFAULT;
  if (drive <= 60)  return 0.85;
  if (drive <= 120) return 0.80 - ((drive - 60)  / 60) * 0.10;
  if (drive <= 180) return 0.70 - ((drive - 120) / 60) * 0.15;
  if (drive <= 240) return 0.55 - ((drive - 180) / 60) * 0.15;
  return Math.max(0.25, 0.40 - ((drive - 240) / 60) * 0.05);
}

// ─── Price index (pure price inversion — separated from mountain size) ─────────
// AUDIT FIX: valueIndex was blending price 80% + mountain size 20%.
// That diluted both signals. Now it's pure price, and mountain size
// contributes separately through the 'fit' component of plannerScoreBreakdown.
function priceIndex(resort) {
  const price = safeNum(resort?.price, null);
  if (price === null) return 0.50;
  return Math.max(0, Math.min(1,
    (W.SCORING.PRICE_MAX - price) / (W.SCORING.PRICE_MAX - W.SCORING.PRICE_MIN)
  ));
}

function valueIndex(resort) {
  return priceIndex(resort);
}

// ─── Snow quality index ───────────────────────────────────────────────────────
function snowQualityIndex(resort, snowTotal, wx = null, forecastIndex = null) {
  const target     = snowPreferenceTarget();
  const liveSnow   = safeNum(snowTotal, 0);
  const reliability = Math.min(1, safeNum(resort.avgSnowfall, 0) / W.SCORING.SNOW_AVG_MAX);
  const recent     = recentSnowIndex(resort);

  let live;
  if (target === 0) {
    live = Math.min(1, liveSnow / W.SCORING.SNOW_SCALE);
  } else if (liveSnow < target) {
    live = 0.15 * Math.min(1, liveSnow / Math.max(1, target));
  } else {
    const cap = Math.max(target + 4, target === 12 ? 18 : W.SCORING.SNOW_SCALE + target);
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
    skiability: remaining * 0.46,
    fit:        remaining * 0.36,
    drive:      remaining * 0.18,
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
  const crowd     = crowdForecast(resort, weather);

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

// ─── Unified verdict from a pre-computed breakdown ────────────────────────────
// Single source of truth for tier + label + detail used by BOTH the verdict
// card (computeVerdict) and the detail panel (renderDetail). Replaces the
// static score threshold labels that previously caused contradictory results.
function verdictFromBreakdown(resort, wx, breakdown) {
  const forecast   = wx?.forecast || [];
  const fi         = targetForecastIndex();
  const stormTotal = forecast.reduce((s, f) => s + (f.snow || 0), 0);
  const tomorrowIn = forecast[fi]?.snow || 0;
  const hist       = historyCache.get(resort.id);
  const histTotal  = hist?.total ?? null;

  const baseLo      = forecast[fi]?.lo ?? 30;
  const sLo         = summitTempF(baseLo, resort.baseElevation, resort.summitElevation);
  const rainLikely  = sLo > 34;
  const warmCaution = sLo > 28 && !rainLikely;
  const coldSnow    = sLo <= 24;

  const target  = snowPreferenceTarget();
  const snowMet = target === 0 || stormTotal >= target;

  let tier, label, detail, subPoints = [];

  if (rainLikely) {
    tier  = 'bad';
    label = 'Skip — rain likely';
    detail = `Temperatures look too warm — rain likely above ${resort.baseElevation.toLocaleString()} ft.`;
  } else if (target >= 6 && !snowMet) {
    // User wants storm snow or powder but forecast falls short
    tier  = 'marginal';
    label = 'Below your snow target';
    detail = `You're looking for ${target}"+ of snow — only ${stormTotal.toFixed(1)}" in the forecast here.`;
    subPoints.push('Try widening your snow filter or checking Storm Chaser for better options');
  } else if (stormTotal >= 6 || tomorrowIn >= 4) {
    tier  = 'great';
    label = 'Go — excellent conditions';
    detail = tomorrowIn >= 4
      ? `${tomorrowIn.toFixed(1)}" expected tomorrow. That's a powder day.`
      : `${stormTotal.toFixed(1)}" forecast over 3 days — this is what you wait all season for.`;
    if (coldSnow) subPoints.push('Ideal temps — light, dry snow expected');
    if (histTotal !== null && histTotal >= 6) subPoints.push(`${histTotal}" already fell this week — base is deep`);
  } else if (stormTotal >= 2 || (histTotal !== null && histTotal >= 6)) {
    tier  = 'good';
    label = 'Good conditions';
    detail = stormTotal >= 2
      ? `${stormTotal.toFixed(1)}" in the 3-day forecast — fresh snow makes a real difference.`
      : `${histTotal}" fell this week — expect a solid, consolidated base.`;
    if (warmCaution) subPoints.push('Snow may be dense/wet — get out early for best runs');
  } else if (stormTotal >= 0.5) {
    tier  = 'marginal';
    label = 'Marginal — manage expectations';
    detail = `Only ${stormTotal.toFixed(1)}" in the forecast. Mostly working with the existing base — groomed runs will be fine.`;
    subPoints.push('Stick to groomed trails, get out early, avoid south-facing terrain');
  } else {
    tier  = 'bad';
    label = 'Poor conditions';
    detail = 'Less than half an inch forecast and limited recent snowfall.';
  }

  return { tier, label, detail, subPoints, rainLikely, stormTotal, tomorrowIn, histTotal };
}

// ─── Personalized "why this works" reasons ────────────────────────────────────
// Generates bullet points based on the user's actual preference settings,
// so the detail panel explains the score in terms the user recognises.
function preferenceReasons(resort, wx, breakdown) {
  const reasons    = [];
  const forecast   = wx?.forecast || [];
  const stormTotal = forecast.reduce((s, f) => s + (f.snow || 0), 0);
  const snowPref   = state.weights.snow  || 1;
  const crowdPref  = state.weights.crowd || 1;
  const valuePref  = state.weights.value || 0;
  const target     = snowPreferenceTarget();

  // ── Snow ──────────────────────────────────────────────────────────────────
  if (snowPref >= 15) {
    if (stormTotal >= 12) reasons.push(`${stormTotal.toFixed(1)}" in the forecast — enough fresh snow for how picky you said you are`);
    else if (stormTotal >= 6) reasons.push(`${stormTotal.toFixed(1)}" coming — interesting, but not a full-on powder day`);
    else reasons.push(`Only ${stormTotal.toFixed(1)}" on tap — light for someone hunting powder`);
  } else if (snowPref >= 10) {
    if (stormTotal >= 6) reasons.push(`${stormTotal.toFixed(1)}" — lines up with wanting a storm day`);
    else reasons.push(`${stormTotal.toFixed(1)}" — a bit light vs “6+ inches matters”`);
  } else if (snowPref >= 5) {
    if (stormTotal >= 3) reasons.push(`${stormTotal.toFixed(1)}" — matches your “a few inches helps” bar`);
    else reasons.push(`${stormTotal.toFixed(1)}" — under your 3"+ threshold`);
  } else {
    if (stormTotal > 0) reasons.push(`${stormTotal.toFixed(1)}" in the next few days`);
    else reasons.push('No new snow in the forecast — expect firm or groomed');
  }

  // ── Mountain size fit ──────────────────────────────────────────────────────
  const vert = resort.vertical;
  if (state.verticalFilter === 'small') {
    if (vert <= 900) reasons.push(`${vert.toLocaleString()} ft — right-sized if you wanted a local hill`);
    else reasons.push(`${vert.toLocaleString()} ft — bigger than a “small hill” day for you`);
  } else if (state.verticalFilter === 'mid') {
    if (vert >= 800 && vert <= 1800) reasons.push(`${vert.toLocaleString()} ft — squarely mid-size, what you asked for`);
    else reasons.push(`${vert.toLocaleString()} ft vertical`);
  } else if (state.verticalFilter === 'big') {
    if (vert >= 1400) reasons.push(`${vert.toLocaleString()} ft — plenty of vert if you wanted a big hill`);
    else reasons.push(`${vert.toLocaleString()} ft — on the smaller side for a “big mountain” day`);
  }

  // ── Pass match ────────────────────────────────────────────────────────────
  if (state.passFilter !== 'All') {
    if (resort.passGroup === state.passFilter) {
      reasons.push(`Covered on your ${resort.passGroup} pass — no window ticket`);
    } else {
      reasons.push(`No ${state.passFilter} pass here — walk-up around $${resort.price}`);
    }
  }

  // ── Crowd preference ──────────────────────────────────────────────────────
  const crowd = crowdForecast(resort, wx);
  if (crowdPref >= 10) {
    if (crowd.label === 'Quiet') {
      reasons.push('Quiet crowds — what you asked for');
    } else if (crowd.label === 'Moderate') {
      reasons.push('Moderate crowds — manageable but not empty');
    } else {
      reasons.push(`${crowd.label} crowds — busier than you said you like`);
    }
  } else if (crowd.label === 'Quiet') {
    reasons.push('Should be pretty quiet');
  } else {
    reasons.push(`${crowd.label} crowds expected`);
  }

  // ── Value ─────────────────────────────────────────────────────────────────
  if (valuePref >= 5) {
    if (resort.price <= 85)       reasons.push(`$${resort.price} walk-up — easy on the wallet`);
    else if (resort.price <= 125) reasons.push(`$${resort.price} walk-up — reasonable`);
    else                          reasons.push(`$${resort.price} walk-up — pricey for how you filtered`);
  }

  // ── Drive ─────────────────────────────────────────────────────────────────
  const drive = getDriveMins(resort.id);
  if (drive !== null) {
    if (drive <= 90)       reasons.push(`${formatDrive(resort.id)} — easy day-trip range`);
    else if (drive <= 150) reasons.push(`${formatDrive(resort.id)} in the car`);
    else if (drive > 240)  reasons.push(`${formatDrive(resort.id)} — long haul, pack snacks`);
  }

  return reasons.slice(0, 4);
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
  if (cLabel === 'Quiet' || cLabel === 'Moderate')
    reasons.push('Lighter crowd outlook');
  if (state.nightOnly && item.resort.night)
    reasons.push('Night skiing available');
  if (state.passFilter && state.passFilter !== 'All' && item.resort.passGroup === state.passFilter)
    reasons.push(`${item.resort.passGroup} pass access`);
  return reasons.slice(0, 3);
}

// ─── Hidden gem score ─────────────────────────────────────────────────────────
function hiddenGemScore(resort, wx = null) {
  const crowd = crowdForecast(resort, wx).score;
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
