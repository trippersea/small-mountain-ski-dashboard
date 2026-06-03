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

/** Grid/base forecast temp → estimated summit °F (single lapse-rate pass). */
function resortSummitTempF(resort, gridTempF) {
  const t = Number(gridTempF);
  if (!Number.isFinite(t)) return null;
  const base = resort?.baseElevation;
  const summit = resort?.summitElevation;
  if (base != null && summit != null && summit > base) {
    return summitTempF(t, base, summit);
  }
  return t;
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
  const fi = targetForecastIndex();
  return wx?.forecast?.[fi] ?? wx?.forecast?.[0] ?? null;
}

// ─── Returns which forecast[] index matches state.targetDate ─────────────────
// forecast[0] = today, forecast[1] = tomorrow, forecast[2] = day after.
// If targetDate is unset, returns 0 (today).
// Clamps to 0–2 (the 3 days Open-Meteo returns).
function targetForecastIndex() {
  if (!(state.targetDate instanceof Date)) return 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(state.targetDate);
  target.setHours(0, 0, 0, 0);
  const diffDays = Math.round((target - today) / (1000 * 60 * 60 * 24));
  // diffDays 0 = today → index 0
  // diffDays 1 = tomorrow → index 1
  // diffDays 2 = day after → index 2
  return Math.max(0, Math.min(2, diffDays));
}

// ─── Trip-mode snow window ────────────────────────────────────────────────────
// Returns the snow total that matches what the ranking engine scored on.
// Day trip (howFar=0): only the target forecast day, so rank and story agree.
// Extended drive (howFar=1) or All (howFar=2): full 3-day sum — the whole window matters.
function tripWindowSnow(forecast) {
  if (state.howFar === 0) {
    const fi = targetForecastIndex();
    return forecast[fi]?.snow || 0;
  }
  return forecast.reduce((s, f) => s + (f.snow || 0), 0);
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
  // Wet-day guard: a clear-sky demand spike cannot coexist with rain.
  // Mirrors the rainF condition in crowdForecast so the two are mutually
  // exclusive (a day is never both "bluebird" and "wet/icy").
  if (fc.lo > 32 && (fc.snow || 0) < 1 && (fc.wind || 0) > 10) return 0;
  // WMO weather code is the authoritative signal. Drizzle/rain (51-67) and
  // rain showers (80-82) disqualify bluebird regardless of the numeric
  // temp/wind/snow thresholds above. Open-Meteo codes; see _wtpVisibilityConcern.
  const code = fc.code;
  if (Number.isFinite(code) &&
      ((code >= 51 && code <= 67) || (code >= 80 && code <= 82))) return 0;
  return 1;
}

// ─── Crowd forecast ───────────────────────────────────────────────────────────
// Calibrated formula: Killington Saturday bluebird → BUSY (75)
//                     Killington Holiday Saturday powder → AVOID (83)
//                     Loon Saturday bluebird → BUSY (70)
//                     Bousquet Saturday bluebird → MODERATE (51)
// Destination fix: Tier 4-5 Ikon/Epic resorts with metroGravity > 750
// no longer get capacity relief — large lifts attract crowds, not absorb them.
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
  // Midweek trips: powder/bluebird demand spikes are softer when most people are at work.
  let wxPowder = powderF;
  let wxBlue   = blueF;
  if (isWeekdaySkiTrip()) {
    wxPowder *= 0.50;
    wxBlue   *= 0.65;
  }
  const Mweather = 1 + 0.40*wxPowder + 0.15*wxBlue - 0.25*rainF;

  // Soft clamp: tanh preserves differentiation at the top end
  const Draw = Dbase * Mday * Mweather;
  const D    = Math.tanh(Draw / 1.5);

  // ── Step C: Capacity amplifier ────────────────────────────────────────────
  const rawTier  = (typeof LIFT_CAPACITY_TIERS !== 'undefined' ? LIFT_CAPACITY_TIERS[resort.id] : null) ?? 3;
  let   liftInv  = (5 - rawTier) / (5 - 1); // linear: tier5=0, tier1=1

  // Destination resort fix: when a high-gravity resort sits on a major pass
  // network, large capacity acts as a crowd funnel, not a relief valve.
  // Without this, Tier 5 Ikon/Epic destinations (Loon, Stowe, Killington)
  // score Moderate on Saturday bluebirds when they should score Busy.
  if (rawMG > 750 && passScore >= 0.80) {
    if (rawTier === 5)      liftInv = 0.45;
    else if (rawTier === 4) liftInv = 0.55;
  }

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
  // Note on vocabulary: blueF is an internal DEMAND multiplier (clear, calm,
  // ideal-temp days draw more skiers). The user-facing reason describes that
  // demand effect, not the sky, so it can never be misread as a weather verdict.
  // blueF and rainF are already mutually exclusive (see _bluebirdFactor wet
  // guard), but we also gate the reason push so they can never co-display.
  const reasons = [];
  if (dow === 6)                    reasons.push('Saturday — peak ski day');
  else if (dow === 0)               reasons.push('Sunday — still busy');
  else if (dow === 5)               reasons.push('Friday — early arrivals');
  else                              reasons.push('Midweek — lighter traffic');
  if (holidayF >= 1.0)              reasons.push('Holiday week — expect peak crowds');
  else if (holidayF >= 0.7)         reasons.push('Holiday weekend — busy');
  if (powderF >= 0.7)               reasons.push('Fresh snow — high demand');
  else if (powderF >= 0.4)          reasons.push('Recent snow drawing extra traffic');
  if (rainF > 0)                    reasons.push('Wet forecast — lighter crowds');
  else if (blueF)                   reasons.push('Clear, calm day — draws bigger crowds');
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
function skiabilityIndex(resort, wx = null, forecastIndex = null) {
  const fc = forecastIndex === null ? tomorrowForecast(wx) : (wx?.forecast?.[forecastIndex] || null);
  if (!fc) return 0.55;
  const lo = resort ? (resortSummitTempF(resort, fc.lo) ?? fc.lo) : fc.lo;
  return tempScoreIndex(lo) * 0.55 + windScoreIndex(fc.wind) * 0.45;
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

// ─── Layer 1: destination suitability (stable mountain identity only) ─────────
// Weather-invariant: vertical, trails, acres, lifts. No snow/crowd/forecast.
const DEST_SUIT_TRAILS_CEILING = 120;
const DEST_SUIT_LIFTS_CEILING  = 25;

function destinationSuitabilityIndex(resort) {
  const vertical = safeNum(resort.vertical, 0);
  const trails   = safeNum(resort.trails, 0);
  const acres    = safeNum(resort.acres, 0);
  const lifts    = safeNum(resort.lifts, 0);
  const cap = (n, ceiling) => Math.min(1, Math.max(0, n / Math.max(1, ceiling)));
  const vIdx = cap(vertical, W.SCORING.VERTICAL_CEILING);
  const tIdx = cap(trails, DEST_SUIT_TRAILS_CEILING);
  const aIdx = cap(acres, W.SCORING.ACRES_CEILING);
  const lIdx = cap(lifts, DEST_SUIT_LIFTS_CEILING);
  // Acres/trails compensate for low vertical (e.g. Midwest destinations).
  return vIdx * 0.28 + tIdx * 0.27 + aIdx * 0.35 + lIdx * 0.10;
}

function destinationSuitabilityScore(resort) {
  return Math.round(destinationSuitabilityIndex(resort) * 100);
}

function destinationClass(resort) {
  const score = destinationSuitabilityScore(resort);
  if (score < 14) return 'local';
  if (score < 40) return 'regional';
  return 'destination';
}

// ─── Top Pick eligibility floor (Option B: suitability class) ─────────────────
// Floor ON for day trip, extended drive, and any-distance unless local intent.
function hasLocalIntent() {
  if (state.localIntent === true) return true;
  if (state.verticalFilter === 'small') return true;
  const drivePref = Number(state.weights?.drive);
  if (Number.isFinite(drivePref) && drivePref >= 10) return true;
  return false;
}

function isTopPickFloorActive() {
  return !hasLocalIntent();
}

function topPickEligibility(resort) {
  const destClass = destinationClass(resort);
  if (!isTopPickFloorActive()) {
    return { topPickEligible: true, topPickEligibilityReason: 'local_intent_override' };
  }
  if (destClass === 'local') {
    return { topPickEligible: false, topPickEligibilityReason: 'below_destination_floor' };
  }
  return { topPickEligible: true, topPickEligibilityReason: 'eligible' };
}

/**
 * Choose Top Pick from score-sorted verdict entries when the eligibility floor may apply.
 * @param {Array<{resort: object, wx: object, breakdown: object, history?: object}>} ranked
 *   Descending by breakdown.score.
 */
function pickTopPickFromRanked(ranked) {
  if (!ranked?.length) return null;
  const floorActive = isTopPickFloorActive();
  if (!floorActive) {
    return {
      pick: ranked[0],
      topPickIsFallback: false,
      topPickFallbackReason: null,
      topPickFloorActive: false,
    };
  }
  const eligible = ranked.find(e => e.breakdown?.topPickEligible === true);
  if (eligible) {
    return {
      pick: eligible,
      topPickIsFallback: false,
      topPickFallbackReason: null,
      topPickFloorActive: true,
    };
  }
  return {
    pick: ranked[0],
    topPickIsFallback: true,
    topPickFallbackReason: 'no_eligible_destination',
    topPickFloorActive: true,
  };
}

/**
 * Filters the ranked pool before picking SLEEPER/TRAP alternative roles
 * on broad search (drops ineligible locals when the top-pick floor is active).
 * Not wired to hero UI in v1 — LOCAL uses pickLocalFromRanked instead.
 */
function filterRunnerUpCandidates(scored) {
  if (!isTopPickFloorActive()) return scored;
  return scored.filter(e => e.breakdown?.topPickEligible === true);
}

const LOCAL_MAX_DRIVE_MINS = 45;
/** When daily scores are within this band, prefer the shorter drive among local candidates. */
const LOCAL_SCORE_CLOSE_BAND = 5;
/** Score band for "Another Smart Play" when no mountain is within LOCAL_MAX_DRIVE_MINS. */
const LOCAL_FALLBACK_SCORE_BAND = 15;

function isCredibleLocalCandidate(entry, pickEntry) {
  if (!entry?.resort || !entry?.wx || !entry?.breakdown || !pickEntry?.resort) return false;
  if (entry.resort.id === pickEntry.resort.id) return false;
  if (entry.breakdown.destinationClass !== 'local') return false;

  const localDrive = getDriveMins(entry.resort.id);
  if (localDrive == null || localDrive > LOCAL_MAX_DRIVE_MINS) return false;

  return true;
}

/** Compare two credible local candidates: score first, shorter drive when scores are close. */
function compareLocalCandidates(a, b) {
  const sa = a.breakdown?.score ?? -Infinity;
  const sb = b.breakdown?.score ?? -Infinity;
  if (Math.abs(sb - sa) > LOCAL_SCORE_CLOSE_BAND) return sb - sa;
  const da = getDriveMins(a.resort.id) ?? 9999;
  const db = getDriveMins(b.resort.id) ?? 9999;
  return da - db;
}

/**
 * Best credible local-class option for the LOCAL card (not the pick).
 * Evaluates every destinationClass === "local" entry in ranked (not region-specific).
 */
function pickLocalFromRanked(ranked, pickEntry) {
  const candidates = ranked
    .filter(e => isCredibleLocalCandidate(e, pickEntry))
    .sort(compareLocalCandidates);
  if (!candidates.length) return null;

  const entry = candidates[0];
  const vd = verdictFromBreakdown(entry.resort, entry.wx, entry.breakdown);
  const localDrive = getDriveMins(entry.resort.id);
  return {
    ...entry,
    tier: vd.tier,
    roleVariant: 'nearby',
    driveMins: localDrive,
  };
}

function isCredibleLocalFallbackCandidate(entry, pickEntry, usedIds) {
  if (!entry?.resort || !entry?.wx || !entry?.breakdown || !pickEntry?.resort) return false;
  if (usedIds.has(entry.resort.id)) return false;
  if (entry.resort.id === pickEntry.resort.id) return false;
  const cls = entry.breakdown.destinationClass ?? destinationClass(entry.resort);
  if (cls === 'local') return false;
  if (isTopPickFloorActive() && entry.breakdown.topPickEligible !== true) return false;
  const pickScore = pickEntry.breakdown?.score ?? -Infinity;
  const candScore = entry.breakdown?.score ?? -Infinity;
  if (pickScore - candScore > LOCAL_FALLBACK_SCORE_BAND) return false;
  // Reserve obvious crowd magnets for Crowd Watch — fallback is a regional smart play.
  if (_hasHighMountainQuality(entry) && _hasHighDemand(entry) && _hasHighCrowdRisk(entry)) {
    return false;
  }
  return true;
}

/**
 * When no credible mountain is within 45 minutes, fill the local slot with a
 * regional/destination alternative labeled "Another Smart Play" (not nearby).
 */
function pickLocalFallbackFromRanked(ranked, pickEntry, usedIds) {
  const pool = filterRunnerUpCandidates(ranked).filter(e => e.resort?.id && !usedIds.has(e.resort.id));
  const candidates = pool
    .filter(e => isCredibleLocalFallbackCandidate(e, pickEntry, usedIds))
    .sort((a, b) => (b.breakdown?.score ?? -Infinity) - (a.breakdown?.score ?? -Infinity));
  if (!candidates.length) return null;

  const entry = candidates[0];
  const vd = verdictFromBreakdown(entry.resort, entry.wx, entry.breakdown);
  return {
    ...entry,
    tier: vd.tier,
    roleVariant: 'another_smart_play',
  };
}

/** User-facing copy for the LOCAL / Another Smart Play slot. */
function localRoleExplanation(localEntry, pickResort) {
  if (localEntry?.roleVariant === 'another_smart_play') {
    const pickShort = (pickResort?.name || 'the top pick')
      .replace(/\s+(Resort|Mountain|Ski\s+Area|Ski\s+Resort|Ski|Area)$/i, '').trim();
    return `Another credible regional option if ${pickShort} doesn't fit your plan — worth a look for conditions or convenience.`;
  }
  const pickShort = (pickResort?.name || 'the top pick')
    .replace(/\s+(Resort|Mountain|Ski\s+Area|Ski\s+Resort|Ski|Area)$/i, '').trim();
  if (localEntry?.tier === 'marginal') {
    return `Quick local turns if you don't want the drive to ${pickShort} — fair conditions, mostly about convenience.`;
  }
  return `Quick local turns if you don't want the drive to ${pickShort} — a nearby option when convenience matters.`;
}

function localRoleLabel(localEntry) {
  if (typeof WTSN_ROLE !== 'undefined' && WTSN_ROLE.localRoleLabel) {
    return WTSN_ROLE.localRoleLabel(localEntry);
  }
  return localEntry?.roleVariant === 'another_smart_play'
    ? 'Another Smart Play'
    : 'Best Nearby Option';
}

const SLEEPER_SCORE_CLOSE_BAND = 12;
const SLEEPER_CROWD_GAP_MIN = 10;
/** Max pool-relative obviousness for Smart Play (tuned to anchor suite). */
const SLEEPER_MAX_OBVIOUSNESS = 0.55;
/** Min obviousness gap vs reference magnet (tuned to anchor suite). */
const SLEEPER_OBVIOUSNESS_GAP = 0.15;
/** Top Pick at/above this obviousness index uses itself as Smart Play reference. */
const SLEEPER_OBVIOUS_PICK_THRESHOLD = 0.62;

function sleeperObviousnessClassComponent(entry) {
  const cls = entry.breakdown?.destinationClass ?? destinationClass(entry.resort);
  if (cls === 'destination') return 1;
  if (cls === 'regional') return 0.42;
  return 0;
}

function sleeperObviousnessPassComponent(resort) {
  const pg = resort.passGroup;
  if (pg === 'Epic' || pg === 'Ikon') return 1;
  if (pg === 'Indy') return 0.52;
  return 0.28;
}

function sleeperObviousnessMetroComponent(resort) {
  const mg = _metroGravity(resort);
  return Math.min(1, Math.max(0, (mg - 350) / 650));
}

/** 0–1 pool-relative obviousness (destinationClass + passGroup + metroGravity). */
function sleeperObviousnessIndex(entry) {
  if (!entry?.resort) return 1;
  const c = sleeperObviousnessClassComponent(entry);
  const p = sleeperObviousnessPassComponent(entry.resort);
  const m = sleeperObviousnessMetroComponent(entry.resort);
  return Math.min(1, 0.38 * c + 0.32 * p + 0.30 * m);
}

/** Reference for less-obvious contrast: obvious Top Pick, else busiest pool magnet. */
function smartPlayReference(ranked, pickEntry) {
  if (!pickEntry?.resort) return null;
  if (sleeperObviousnessIndex(pickEntry) >= SLEEPER_OBVIOUS_PICK_THRESHOLD) {
    return pickEntry;
  }
  return obviousBigMountainReference(ranked, pickEntry) || pickEntry;
}

function isLessObviousSmartPlay(entry, refEntry) {
  if (!entry?.resort || !refEntry?.resort) return false;
  if (entry.resort.id === refEntry.resort.id) return false;
  const cand = sleeperObviousnessIndex(entry);
  const ref = sleeperObviousnessIndex(refEntry);
  if (cand >= SLEEPER_MAX_OBVIOUSNESS) return false;
  return (ref - cand) >= SLEEPER_OBVIOUSNESS_GAP;
}

function _crowdIsLoud(label) {
  return label === 'Busy' || label === 'Avoid';
}

function _crowdIsQuieter(label) {
  return label === 'Quiet' || label === 'Moderate';
}

function _isMeaningfullyQuieterThan(candCrowd, refCrowd) {
  const gap = refCrowd.score - candCrowd.score;
  if (gap >= SLEEPER_CROWD_GAP_MIN) return true;
  return _crowdIsLoud(refCrowd.label) && _crowdIsQuieter(candCrowd.label) && gap >= 8;
}

/** Contrast vs ref/pick — Smart Play needs a real reason, not raw score rank. */
function hasSleeperReason(entry, pickEntry, refEntry) {
  if (!entry?.resort || !pickEntry?.resort) return false;

  const ref = (refEntry?.resort?.id && refEntry.resort.id !== entry.resort.id)
    ? refEntry
    : pickEntry;

  const candCrowd = crowdForecast(entry.resort, entry.wx);
  const refCrowd = crowdForecast(ref.resort, ref.wx);
  if (_isMeaningfullyQuieterThan(candCrowd, refCrowd)) return true;

  const candSnow = tripWindowSnow(entry.wx?.forecast || []);
  const pickSnow = tripWindowSnow(pickEntry.wx?.forecast || []);
  if (candSnow >= pickSnow + 0.5) return true;

  const candPrice = safeNum(entry.resort.price, 0);
  const pickPrice = safeNum(pickEntry.resort.price, 0);
  if (pickPrice > 0 && candPrice > 0 && pickPrice - candPrice >= 20) {
    const candMagnet = _hasHighMountainQuality(entry) && _hasHighDemand(entry);
    const refMagnet = _hasHighMountainQuality(ref) && _hasHighDemand(ref);
    if (!(candMagnet && refMagnet)) return true;
  }

  const candDrive = getDriveMins(entry.resort.id);
  const pickDrive = getDriveMins(pickEntry.resort.id);
  if (candDrive != null && pickDrive != null && pickDrive - candDrive >= 30) {
    const cls = entry.breakdown?.destinationClass ?? destinationClass(entry.resort);
    if (cls !== 'local') return true;
  }

  return false;
}

function _metroGravity(resort) {
  return (typeof METRO_GRAVITY !== 'undefined' ? METRO_GRAVITY[resort.id] : null) ?? 500;
}

function _isBigMountainEntry(entry) {
  if (!entry?.resort) return false;
  const cls = entry.breakdown?.destinationClass ?? destinationClass(entry.resort);
  if (cls === 'destination') return true;
  return safeNum(entry.resort.vertical, 0) >= 1800;
}

/** Busiest crowd magnet in the pool — destination-class when present, else best eligible regional. */
function obviousBigMountainReference(ranked, pickEntry) {
  const eligible = ranked.filter((e) => {
    if (!e?.resort || !e?.breakdown) return false;
    if (e.breakdown.destinationClass === 'local') return false;
    if (isTopPickFloorActive() && e.breakdown.topPickEligible !== true) return false;
    return true;
  });
  if (!eligible.length) return _isBigMountainEntry(pickEntry) ? pickEntry : null;

  const big = eligible.filter(_isBigMountainEntry);
  const pool = big.length ? big : eligible;

  return pool.reduce((best, e) => {
    const cs = crowdForecast(e.resort, e.wx).score;
    const bs = crowdForecast(best.resort, best.wx).score;
    return cs > bs ? e : best;
  });
}

/** When the pick is already the quiet smart call vs the obvious crowd magnet, skip SLEEPER. */
function isPickAlreadyQuietPlay(pickEntry, refEntry) {
  if (!pickEntry?.resort || !refEntry?.resort) return false;
  if (pickEntry.resort.id === refEntry.resort.id) return false;
  const pickCrowd = crowdForecast(pickEntry.resort, pickEntry.wx);
  const refCrowd = crowdForecast(refEntry.resort, refEntry.wx);
  if (pickCrowd.score < refCrowd.score && _crowdIsQuieter(pickCrowd.label) && _crowdIsLoud(refCrowd.label)) {
    return true;
  }
  return _isMeaningfullyQuieterThan(pickCrowd, refCrowd);
}

function isCredibleSleeperCandidate(entry, pickEntry, refEntry, usedIds) {
  if (!entry?.resort || !entry?.wx || !entry?.breakdown || !pickEntry?.resort) return false;
  if (usedIds.has(entry.resort.id)) return false;
  if (entry.resort.id === pickEntry.resort.id) return false;
  if (entry.breakdown.destinationClass === 'local') return false;
  if (isTopPickFloorActive() && entry.breakdown.topPickEligible !== true) return false;

  const pickScore = pickEntry.breakdown?.score ?? -Infinity;
  const candScore = entry.breakdown?.score ?? -Infinity;
  if (pickScore - candScore > SLEEPER_SCORE_CLOSE_BAND) return false;

  const vd = verdictFromBreakdown(entry.resort, entry.wx, entry.breakdown);
  if (vd.tier === 'bad') return false;

  const refForObvious = (refEntry?.resort?.id && refEntry.resort.id !== entry.resort.id)
    ? refEntry
    : pickEntry;
  if (!isLessObviousSmartPlay(entry, refForObvious)) return false;

  return hasSleeperReason(entry, pickEntry, refEntry);
}

function compareSleeperCandidates(a, b) {
  const sa = a.breakdown?.score ?? -Infinity;
  const sb = b.breakdown?.score ?? -Infinity;
  if (Math.abs(sb - sa) > 2) return sb - sa;
  const oa = sleeperObviousnessIndex(a);
  const ob = sleeperObviousnessIndex(b);
  if (oa !== ob) return oa - ob;
  const ca = crowdForecast(a.resort, a.wx).score;
  const cb = crowdForecast(b.resort, b.wx).score;
  if (ca !== cb) return ca - cb;
  return sb - sa;
}

/**
 * Best credible SLEEPER: quieter overlooked alternative close in score to the pick.
 * Credibility uses topPickEligible + destinationClass (not a national vertical floor).
 * Uses filterRunnerUpCandidates for pool alignment on broad search.
 */
function pickSleeperFromRanked(ranked, pickEntry, localEntry, trapEntry) {
  if (!pickEntry?.resort) return null;

  const usedIds = new Set([pickEntry.resort.id]);
  if (localEntry?.resort?.id) usedIds.add(localEntry.resort.id);
  if (trapEntry?.resort?.id) usedIds.add(trapEntry.resort.id);

  const ref = smartPlayReference(ranked, pickEntry);

  const pool = filterRunnerUpCandidates(ranked).filter(e => e.resort?.id && !usedIds.has(e.resort.id));
  const candidates = pool
    .filter(e => isCredibleSleeperCandidate(e, pickEntry, ref, usedIds))
    .sort(compareSleeperCandidates);
  if (!candidates.length) return null;

  const entry = candidates[0];
  const vd = verdictFromBreakdown(entry.resort, entry.wx, entry.breakdown);
  const refCrowd = ref ? crowdForecast(ref.resort, ref.wx) : null;
  const candCrowd = crowdForecast(entry.resort, entry.wx);
  return {
    ...entry,
    tier: vd.tier,
    refResortId: ref?.resort?.id ?? null,
    refCrowdLabel: refCrowd?.label ?? null,
    crowdLabel: candCrowd.label,
    crowdGap: refCrowd ? refCrowd.score - candCrowd.score : null,
  };
}

function stripResortSuffix(name) {
  const raw = String(name || '').trim();
  const lower = raw.toLowerCase();

  const suffixes = [
    ' ski resort',
    ' ski area',
    ' mountain',
    ' resort',
  ];

  for (const suffix of suffixes) {
    if (lower.endsWith(suffix)) {
      return raw.slice(0, -suffix.length).trim();
    }
  }

  return raw;
}

/** User-facing copy for the SLEEPER role card. */
function sleeperRoleExplanation(sleeperEntry, pickResort, refResort) {
  const refShort = stripResortSuffix(refResort?.name || 'the big-name option');
  if (sleeperEntry?.tier === 'marginal') {
    return `Quieter alternative if ${refShort}'s lift lines worry you — fair conditions, less circus.`;
  }
  if (refResort?.id && refResort.id !== pickResort?.id) {
    return `Smart quieter play vs ${refShort} — similar forecast window, lighter crowds.`;
  }
  return `Overlooked option in the same score band — worth it if you hate busy lift lines.`;
}

const TRAP_QUALITY_MIN_SUIT = 40;
const TRAP_CROWD_SCORE_MIN = 62;
const TRAP_DEMAND_METRO_MIN = 550;

function _hasHighMountainQuality(entry) {
  if (!entry?.resort) return false;
  const cls = entry.breakdown?.destinationClass ?? destinationClass(entry.resort);
  if (cls === 'destination') return true;
  const suit = entry.breakdown?.destinationSuitabilityScore ?? destinationSuitabilityScore(entry.resort);
  if (suit >= TRAP_QUALITY_MIN_SUIT) return true;
  // Regional magnets near major metros (e.g. Wachusett for Boston) — real crowd-trap appeal.
  if (cls === 'regional' && _metroGravity(entry.resort) >= TRAP_DEMAND_METRO_MIN) {
    return safeNum(entry.resort.vertical, 0) >= 700;
  }
  return false;
}

function _hasHighDemand(entry) {
  if (!entry?.resort) return false;
  const cls = entry.breakdown?.destinationClass ?? destinationClass(entry.resort);
  const pass = entry.resort.passGroup === 'Epic' || entry.resort.passGroup === 'Ikon';
  const mg = _metroGravity(entry.resort);
  return cls === 'destination' || pass || mg >= TRAP_DEMAND_METRO_MIN;
}

/** Fri–Sun ski day (peak arrival days for Boston / NE day trips). */
function _isPeakSkiDay() {
  if (!(state.targetDate instanceof Date)) return false;
  const dow = state.targetDate.getDay();
  return dow === 5 || dow === 6 || dow === 0;
}

/**
 * Crowd Watch crowd-risk: Busy/Avoid, or weekend peak-day demand at a magnet
 * (e.g. Wachusett Saturday — close to Boston, scores Moderate but lifts fill up).
 */
function _hasHighCrowdRisk(entry) {
  const crowd = crowdForecast(entry.resort, entry.wx);
  if (_crowdIsLoud(crowd.label)) return true;
  if (!_hasHighDemand(entry)) return false;
  if (!_isPeakSkiDay()) return false;
  return crowd.score >= 50;
}

/** True when a Crowd Watch card may render — never Quiet / "Light crowds". */
function trapQualifiesForCrowdWatch(entry) {
  if (!entry?.resort) return false;
  const label = entry.crowdLabel || crowdForecast(entry.resort, entry.wx)?.label;
  if (label === 'Quiet') return false;
  if (_crowdIsLoud(label)) return true;
  if (label === 'Moderate' && _hasHighCrowdRisk(entry)) return true;
  return false;
}

function isCredibleTrapCandidate(entry, usedIds) {
  if (!entry?.resort || !entry?.wx || !entry?.breakdown) return false;
  if (usedIds.has(entry.resort.id)) return false;
  if (entry.breakdown.destinationClass === 'local') return false;
  if (isTopPickFloorActive() && entry.breakdown.topPickEligible !== true) return false;

  return _hasHighMountainQuality(entry)
    && _hasHighCrowdRisk(entry)
    && _hasHighDemand(entry);
}

function compareTrapCandidates(a, b) {
  const ca = crowdForecast(a.resort, a.wx).score;
  const cb = crowdForecast(b.resort, b.wx).score;
  if (cb !== ca) return cb - ca;
  const sa = a.breakdown?.score ?? -Infinity;
  const sb = b.breakdown?.score ?? -Infinity;
  return sb - sa;
}

function pickQualifiesForCrowdWarning(pickEntry) {
  if (!pickEntry?.resort || !pickEntry?.wx) return false;
  if (!_hasHighMountainQuality(pickEntry) || !_hasHighDemand(pickEntry)) return false;
  const crowd = crowdForecast(pickEntry.resort, pickEntry.wx);
  return _crowdIsLoud(crowd.label);
}

/**
 * Best credible TRAP: crowd magnet with real quality + demand, excluding used roles.
 * When the pick is also an obvious trap, pickCrowdWarning is set and the slot passes
 * to the next qualifying crowd-magnet (spec A4.6).
 */
function pickTrapFromRanked(ranked, pickEntry, localEntry, sleeperEntry) {
  const usedIds = new Set();
  if (pickEntry?.resort?.id) usedIds.add(pickEntry.resort.id);
  if (localEntry?.resort?.id) usedIds.add(localEntry.resort.id);
  if (sleeperEntry?.resort?.id) usedIds.add(sleeperEntry.resort.id);

  const pickCrowdWarning = pickQualifiesForCrowdWarning(pickEntry);

  const pool = filterRunnerUpCandidates(ranked).filter(e => e.resort?.id && !usedIds.has(e.resort.id));
  const candidates = pool
    .filter(e => isCredibleTrapCandidate(e, usedIds))
    .sort(compareTrapCandidates);
  if (!candidates.length) {
    return { trap: null, pickCrowdWarning };
  }

  const entry = candidates[0];
  const vd = verdictFromBreakdown(entry.resort, entry.wx, entry.breakdown);
  const crowd = crowdForecast(entry.resort, entry.wx);
  return {
    trap: {
      ...entry,
      tier: vd.tier,
      crowdLabel: crowd.label,
      crowdScore: crowd.score,
    },
    pickCrowdWarning,
  };
}

/** Copy when the Top Pick is also an obvious crowd trap (spec A4.6). */
function pickCrowdWarningCopy() {
  return 'Best skiing, but expect crowds — lift lines may run long at peak.';
}

/** User-facing copy for the TRAP role card. */
function trapRoleExplanation(trapEntry) {
  const crowdShort = (trapEntry?.crowdLabel || 'busy').toLowerCase();
  if (trapEntry?.tier === 'marginal') {
    return `Great mountain on paper, but ${crowdShort} timing — fair conditions, real lift-line risk.`;
  }
  return `Great mountain, bad timing — ski quality may hold up, but ${crowdShort} crowds may mean long lift lines.`;
}

/**
 * Fill empty LOCAL slot from the next-best ranked resort when the pool allows.
 * TRAP (Crowd Watch) is never generic filler — only isCredibleTrapCandidate qualifies.
 * Smart Play is never backfilled here: if pickSleeperFromRanked found no credible
 * candidate, leave sleeper null rather than promote raw score rank to Smart Play.
 */
function fillMissingRoleSlots(ranked, roles) {
  if (!roles.pick?.resort) return roles;

  const usedIds = new Set([
    roles.pick?.resort?.id,
    roles.local?.resort?.id,
    roles.sleeper?.resort?.id,
    roles.trap?.resort?.id,
  ].filter(Boolean));

  const pool = filterRunnerUpCandidates(ranked)
    .filter(e => e.resort?.id && !usedIds.has(e.resort.id))
    .sort((a, b) => (b.breakdown?.score ?? -Infinity) - (a.breakdown?.score ?? -Infinity));

  let idx = 0;
  const takeNext = () => {
    while (idx < pool.length && usedIds.has(pool[idx].resort.id)) idx++;
    if (idx >= pool.length) return null;
    const entry = pool[idx++];
    usedIds.add(entry.resort.id);
    return entry;
  };

  const toRoleEntry = (entry, extras = {}) => {
    const vd = verdictFromBreakdown(entry.resort, entry.wx, entry.breakdown);
    return { ...entry, tier: vd.tier, ...extras };
  };

  let { local, sleeper, trap } = roles;

  if (!local && !hasLocalIntent() && roles.pick.breakdown?.destinationClass !== 'local') {
    const entry = takeNext();
    if (entry) local = toRoleEntry(entry, { roleVariant: 'another_smart_play' });
  }

  // Smart Play is not generic runner-up filler — slot stays empty when no credible pick exists.

  if (!trap) {
    for (let i = 0; i < pool.length; i++) {
      const entry = pool[i];
      if (!entry?.resort?.id || usedIds.has(entry.resort.id)) continue;
      if (!isCredibleTrapCandidate(entry, usedIds)) continue;
      const crowd = crowdForecast(entry.resort, entry.wx);
      trap = toRoleEntry(entry, {
        crowdLabel: crowd.label,
        crowdScore: crowd.score,
      });
      usedIds.add(entry.resort.id);
      break;
    }
  }

  if (trap && !trapQualifiesForCrowdWatch(trap)) trap = null;

  return { ...roles, local, sleeper, trap };
}

/**
 * PICK + LOCAL + SLEEPER + TRAP recommendation roles from a score-sorted verdict pool.
 * @param {Array<{resort: object, wx: object, breakdown: object, history?: object}>} ranked
 */
function buildRecommendationRolesFromRanked(ranked) {
  const empty = { pick: null, local: null, sleeper: null, trap: null };
  const pickResult = pickTopPickFromRanked(ranked);
  if (!pickResult?.pick) return empty;

  let pick = {
    ...pickResult.pick,
    topPickIsFallback: pickResult.topPickIsFallback,
    topPickFallbackReason: pickResult.topPickFallbackReason,
    topPickFloorActive: pickResult.topPickFloorActive,
  };

  let local = null;
  if (!hasLocalIntent() && pick.breakdown?.destinationClass !== 'local') {
    local = pickLocalFromRanked(ranked, pickResult.pick);
  }

  const trapResult = pickTrapFromRanked(ranked, pickResult.pick, local, null);
  const sleeper = pickSleeperFromRanked(ranked, pickResult.pick, local, trapResult.trap);

  if (!local && !hasLocalIntent() && pick.breakdown?.destinationClass !== 'local') {
    const usedIds = new Set([pickResult.pick.resort.id]);
    if (sleeper?.resort?.id) usedIds.add(sleeper.resort.id);
    if (trapResult.trap?.resort?.id) usedIds.add(trapResult.trap.resort.id);
    local = pickLocalFallbackFromRanked(ranked, pickResult.pick, usedIds);
  }

  if (trapResult.pickCrowdWarning) {
    pick = {
      ...pick,
      pickCrowdWarning: true,
      pickCrowdWarningCopy: pickCrowdWarningCopy(),
    };
  }

  let trap = trapResult.trap;
  if (trap && !trapQualifiesForCrowdWatch(trap)) trap = null;

  return fillMissingRoleSlots(ranked, { pick, local, sleeper, trap });
}

/** Layer-2 fit: identity on broad/willing-to-drive; mountainFit for local intent & size chips. */
function plannerFitIndex(resort) {
  if (state.verticalFilter !== 'any' || hasLocalIntent()) {
    return mountainFitIndex(resort);
  }
  return destinationSuitabilityIndex(resort);
}

/** Target ski day is Mon–Thu (terrain over drive). Default chip uses tomorrow; weekend chips opt out. */
function isWeekdaySkiTrip() {
  const preset = state.skiDayPreset;
  if (preset === 'friday' || preset === 'saturday' || preset === 'sunday') return false;
  if (!(state.targetDate instanceof Date)) return false;
  const dow = state.targetDate.getDay();
  return dow >= 1 && dow <= 4;
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
  if (isWeekdaySkiTrip()) {
    // Weekday: rank for the best ski, not the closest hill — widen terrain spread (~9 pts on 100).
    let fit = 0.68 + sizeIdx * 0.30;
    // Micro hills (<500 ft) should not beat real mountains on a midweek “best mountain” pick.
    if (vertical > 0 && vertical < 500) fit *= 0.88;
    return fit;
  }
  // Weekend / Fri–Sun: gentle size nudge so drive + snow still decide tight calls.
  return 0.80 + sizeIdx * 0.12;
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
    // Meeting the target IS the win the user asked for, so it anchors high (0.8);
    // exceeding it climbs the rest of the way to 1.0 at the cap. Previously this
    // scored (liveSnow-target)/(cap-target), which gave ~0 for merely meeting the
    // target — so a 12" day at "Powder Day" priority scored near nothing.
    const cap   = Math.max(target + 4, target === 12 ? 18 : W.SCORING.SNOW_SCALE + target);
    const over  = Math.min(1, (liveSnow - target) / Math.max(1, cap - target));
    live = 0.8 + 0.2 * over;
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
  const weekday   = isWeekdaySkiTrip();

  return {
    snow:       snowW,
    skiability: remaining * 0.46,
    fit:        remaining * (weekday ? 0.44 : 0.36),
    drive:      remaining * (weekday ? 0.10 : 0.18),
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
    skiability: skiabilityIndex(resort, weather, forecastIndex),
    fit:        plannerFitIndex(resort),
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
  const identity = {
    destinationSuitabilityScore: destinationSuitabilityScore(resort),
    destinationClass:            destinationClass(resort),
  };
  const pickGate = topPickEligibility(resort);

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
    ...identity,
    ...pickGate,
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

// ─── Groomer-day copy (verdict only — no scoring change) ─────────────────────
function _groomerSubPoint(resortId, histTotal, warmCaution) {
  const variants = [];
  if (histTotal != null && histTotal >= 3) {
    variants.push('Recent snow supports the base; expect a strong groomer day.');
  }
  if (!warmCaution) {
    variants.push('Groomers should ski well.');
    variants.push('Good clean day for groomers.');
  }
  variants.push('Clear and dry — more groomer day than powder day.');
  const seed = String(resortId || '') + String(histTotal ?? '') + (warmCaution ? 'w' : 'c');
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = ((h << 5) - h + seed.charCodeAt(i)) | 0;
  return variants[Math.abs(h) % variants.length];
}

function appendGroomerSubPoints(subPoints, ctx) {
  const {
    resort, stormTotal, tomorrowIn, histTotal, tier, warmCaution,
    rainLikely, severeWind, target, snowMet,
  } = ctx;
  if (rainLikely || severeWind) return subPoints;
  if (target >= 6 && !snowMet) return subPoints;
  if (stormTotal >= 6 || tomorrowIn >= 4) return subPoints;
  if (stormTotal >= 2) return subPoints;

  const wind = ctx.wind ?? 0;
  if (wind > 25) return subPoints;

  const lowSnow = stormTotal < 0.5 && tomorrowIn < 0.5;
  if (!lowSnow && stormTotal < 2 && !(histTotal != null && histTotal >= 6)) return subPoints;

  const groomerTier = tier === 'good'
    || (tier === 'marginal' && !rainLikely && stormTotal < 2);
  if (!groomerTier) return subPoints;

  const line = _groomerSubPoint(resort?.id, histTotal, warmCaution);
  if (line && !subPoints.includes(line)) subPoints.push(line);
  return subPoints;
}

// ─── Unified verdict from a pre-computed breakdown ────────────────────────────
// Single source of truth for tier + label + detail used by BOTH the verdict
// card (computeVerdict) and the detail panel (renderDetail).
//
// Snow window: uses tripWindowSnow() so the story matches what the ranking saw.
// Day trip → target day only. Extended drive / All → 3-day sum.
// Copy avoids "3 days" language for day-trippers who only care about their day.
function verdictFromBreakdown(resort, wx, breakdown) {
  const forecast   = wx?.forecast || [];
  const fi         = targetForecastIndex();
  const stormTotal = tripWindowSnow(forecast);   // trip-mode aware — matches ranking
  const tomorrowIn = forecast[fi]?.snow || 0;
  const hist       = historyCache.get(resort.id);
  const histTotal  = hist?.total ?? null;

  const baseLo      = forecast[fi]?.lo ?? 30;
  const sLo         = resortSummitTempF(resort, baseLo) ?? baseLo;
  const fcDay       = forecast[fi] || {};
  const wxCode      = fcDay.code ?? 0;
  const rainCodes   = new Set([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82]);
  const freezingRainCodes = new Set([56, 57, 66, 67]);
  const rainLikely  = freezingRainCodes.has(wxCode)
    || sLo > 34
    || (rainCodes.has(wxCode) && baseLo >= 32);
  const warmCaution = sLo > 28 && !rainLikely;
  const coldSnow    = sLo <= 24;
  const severeWind  = (fcDay.wind ?? 0) > 35;

  const target  = snowPreferenceTarget();
  const snowMet = target === 0 || stormTotal >= target;

  // Copy helpers: day trip vs multi-day window so "3 days" never describes a 1-day trip.
  const multiDayWindow = state.howFar >= 1;
  const inWindow   = multiDayWindow ? 'in your forecast window' : 'in the forecast';
  const overWindow = multiDayWindow ? 'in your window'            : 'forecast';

  let tier, label, detail, subPoints = [];

  if (rainLikely || severeWind) {
    tier  = 'bad';
    label = rainLikely ? 'Skip — rain likely' : 'Poor conditions';
    detail = rainLikely
      ? `Temperatures look too warm — rain likely above ${resort.baseElevation.toLocaleString()} ft.`
      : 'High winds may shut down or hold lifts — check the mountain before you go.';
  } else if (target >= 6 && !snowMet) {
    // User wants storm snow or powder but the window falls short.
    tier  = 'marginal';
    label = 'Below your snow target';
    detail = `You're looking for ${target}"+ of snow — only ${stormTotal.toFixed(1)}" ${inWindow}.`;
    subPoints.push('Try widening your snow filter or checking Storm Chaser for better options');
  } else if (stormTotal >= 6 || tomorrowIn >= 4) {
    tier  = 'great';
    label = 'Go — excellent conditions';
    detail = tomorrowIn >= 4
      ? `${tomorrowIn.toFixed(1)}" ${overWindow}. That's a powder day.`
      : `${stormTotal.toFixed(1)}" ${inWindow} — this is what you wait all season for.`;
    if (coldSnow) subPoints.push('Ideal temps — light, dry snow expected');
    if (histTotal !== null && histTotal >= 6) subPoints.push(`${histTotal}" already fell this week — base is deep`);
  } else if (stormTotal >= 2 || (histTotal !== null && histTotal >= 6)) {
    tier  = 'good';
    label = 'Good conditions';
    detail = stormTotal >= 2
      ? `${stormTotal.toFixed(1)}" ${inWindow} — fresh snow makes a real difference.`
      : `${histTotal}" fell this week — expect a solid, consolidated base.`;
    if (warmCaution) subPoints.push('Snow may be dense/wet — get out early for best runs');
  } else if (stormTotal >= 0.5) {
    tier  = 'marginal';
    label = 'Marginal — manage expectations';
    detail = `Only ${stormTotal.toFixed(1)}" ${inWindow}. Mostly working with the existing base — groomed runs will be fine.`;
    subPoints.push('Stick to groomed trails, get out early, avoid south-facing terrain');
  } else {
    const wind = fcDay.wind ?? 0;
    if (wind > 35) {
      tier  = 'bad';
      label = 'Poor conditions';
      detail = 'High winds may shut down or hold lifts — check the mountain before you go.';
    } else if (warmCaution) {
      tier  = 'marginal';
      label = 'Fair conditions';
      detail = 'Dry and firm — groomed runs will ski best. No fresh snow in the forecast.';
      subPoints.push('Get out early before surfaces soften');
    } else {
      tier  = 'good';
      label = 'Good conditions';
      detail = histTotal != null && histTotal >= 3
        ? `Clear and dry — ${histTotal}" recent snow supports a solid base.`
        : 'Clear and dry — more groomer day than powder day. No fresh snow in the forecast.';
    }
  }

  subPoints = appendGroomerSubPoints(subPoints, {
    resort,
    stormTotal,
    tomorrowIn,
    histTotal,
    tier,
    warmCaution,
    rainLikely,
    severeWind,
    target,
    snowMet,
    wind: fcDay.wind ?? 0,
  });

  return { tier, label, detail, subPoints, rainLikely, stormTotal, tomorrowIn, histTotal };
}

// ─── Personalized "why this works" reasons ────────────────────────────────────
// Generates bullet points based on the user's actual preference settings,
// so the detail panel explains the score in terms the user recognises.
function preferenceReasons(resort, wx, breakdown) {
  const reasons    = [];
  const forecast   = wx?.forecast || [];
  // Use tripWindowSnow so reasons match what the ranking engine actually scored on.
  const stormTotal = tripWindowSnow(forecast);
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
// Uses targetForecastIndex so it stays consistent with whichever day the
// ranking and verdict tier are evaluating. Previously always used forecast[0].
function weatherRiskScore(wx) {
  if (!wx) return 50;
  const fi = targetForecastIndex();
  const fc = wx?.forecast?.[fi] || tomorrowForecast(wx);
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

// ─── Runner card differentiator (plain language, no point values) ─────────────
function diffWordCount(s) {
  return String(s).trim().split(/\s+/).filter(Boolean).length;
}

function combineRunnerPhrases(crowdPhrase, basePhrase, maxWords = 6) {
  if (!crowdPhrase && !basePhrase) return 'Solid local option';
  if (!crowdPhrase) return basePhrase;
  if (!basePhrase) return crowdPhrase;
  const candidates = [
    `${crowdPhrase}, ${basePhrase}`,
    `${basePhrase}, ${crowdPhrase}`,
  ];
  for (const s of candidates) {
    if (diffWordCount(s) <= maxWords) return s;
  }
  if (diffWordCount(basePhrase) <= maxWords) return basePhrase;
  return crowdPhrase;
}

function runnerCrowdPhrase(primary, backup) {
  if (!primary?.crowd || !backup?.crowd) return null;
  const topLabel   = primary.crowd.label;
  const runLabel   = backup.crowd.label;
  const crowdDelta = primary.crowd.score - backup.crowd.score;

  if (runLabel === topLabel) {
    // Same bucket label — only surface the gap when it's meaningful enough to
    // tell a real story (12+ points within the same label range). No raw numbers
    // in copy — just signal direction.
    if (crowdDelta >= 12) return 'Quieter than it looks';
    if (crowdDelta <= -12) return 'Busier than it looks';
    return null;
  }

  if (crowdDelta >= 15) return 'Lighter crowds';
  if (crowdDelta >= 8)  return 'Slightly quieter';
  if (crowdDelta <= -15) return 'More crowded';
  if (crowdDelta <= -8)  return 'Slightly busier';
  return null;
}

function runnerDifferentiator(primary, backup, allRunners) {
  if (!backup?.resort) return 'Solid local option';

  const resort = backup.resort;
  const _rWx   = state.weatherCache[resort.id]?.data;
  const backupCrowd = backup.crowd || crowdForecast(resort, _rWx);
  // Use tripWindowSnow so "Better snow" reflects the same window as the ranking.
  const _rSnow = _rWx ? tripWindowSnow(_rWx.forecast || []) : null;
  const drive  = backup.drive ?? getDriveMins(resort.id);
  const primaryDrive = primary?.drive ?? (primary?.resort ? getDriveMins(primary.resort.id) : null);

  const crowdPhrase = runnerCrowdPhrase(primary, { crowd: backupCrowd });

  const primaryWx = primary?.resort ? state.weatherCache[primary.resort.id]?.data : null;
  const primarySnow = primaryWx ? tripWindowSnow(primaryWx.forecast || []) : null;

  const drives = (allRunners || []).map(r => getDriveMins(r.resort.id)).filter(Boolean);
  const isClosest = drive !== null && drives.length > 1 && drive === Math.min(...drives);

  const snows = (allRunners || [])
    .map(r => {
      const wx = state.weatherCache[r.resort.id]?.data;
      return wx ? (wx.forecast || []).reduce((s, f) => s + (f.snow || 0), 0) : null;
    })
    .filter(x => x !== null);
  const hasMostSnow = _rSnow !== null && snows.length > 1 && _rSnow === Math.max(...snows);

  let basePhrase = null;

  if (_rSnow !== null && _rSnow >= 4 && (hasMostSnow || (primarySnow != null && _rSnow > primarySnow + 1))) {
    basePhrase = 'Better snow';
  } else if (isClosest && drive !== null) {
    basePhrase = 'Closest quick option';
  } else if (hasMostSnow && _rSnow > 0) {
    basePhrase = 'Better snow';
  } else if (drive !== null && primaryDrive !== null && drive >= primaryDrive + 20) {
    basePhrase = 'longer drive';
  } else if (drive !== null && primaryDrive !== null && drive + 20 <= primaryDrive) {
    basePhrase = 'shorter drive';
  } else if (
    typeof resort.price === 'number' &&
    primary?.resort &&
    typeof primary.resort.price === 'number' &&
    resort.price < primary.resort.price - 10
  ) {
    basePhrase = 'Better value';
  }

  return combineRunnerPhrases(crowdPhrase, basePhrase);
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
// Uses live tripWindowSnow when wx is available so gems with actual forecast snow
// bubble ahead of gems that just have a good historical average.
// avgSnowfall / 4 stays as a reliability proxy when live data is absent.
function hiddenGemScore(resort, wx = null) {
  const crowd = crowdForecast(resort, wx).score;
  let score = 0;
  score += Math.max(0, 100 - crowd);
  score += Math.max(0, 120 - resort.price);
  score += Math.min(60, resort.vertical / 25);

  if (wx) {
    // Live snow: up to 25 bonus points, scaled so 8" in the trip window = full bonus.
    const liveSnow = tripWindowSnow(wx.forecast || []);
    score += Math.min(25, liveSnow * 3.125);
    // Historical average still contributes at reduced weight when live data present.
    score += resort.avgSnowfall / 8;
  } else {
    score += resort.avgSnowfall / 4;
  }

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
