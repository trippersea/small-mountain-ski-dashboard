// ═══════════════════════════════════════════════════════════════════════════════
// WHY-THIS-PICK.JS — Trust layer: explains the existing #1 using real ranking inputs
// Depends on: sd-scoring.js, sd-filters.js, sd-app.js (getDriveMins, state)
// Load after sd-app.js (see index.html).
// ═══════════════════════════════════════════════════════════════════════════════

function _wtpClamp01(x) {
  if (!Number.isFinite(x)) return 0;
  return Math.max(0, Math.min(1, x));
}

/** Open-Meteo WMO codes: fog / precip / snow imply visibility is a real factor. */
function _wtpVisibilityConcern(code) {
  if (code == null || !Number.isFinite(code)) return 0;
  if (code >= 45 && code <= 48) return 1;
  if (code >= 51 && code <= 67) return 0.78;
  if (code >= 71 && code <= 77) return 0.58;
  return 0;
}

/**
 * True when forecast codes show the winner is in a meaningfully clearer / less hazardous
 * visibility regime than the runner (not merely better temp/wind skiability).
 */
function _wtpVisibilitySupported(winnerWx, runnerWx, fi) {
  const w = (winnerWx.forecast || [])[fi];
  const r = (runnerWx.forecast || [])[fi];
  if (!w || !r) return false;
  const wc = _wtpVisibilityConcern(w.code);
  const rc = _wtpVisibilityConcern(r.code);
  return rc - wc >= 0.35 || (rc >= 0.55 && wc + 0.2 < rc);
}

function _wtpRankedCandidates(resorts) {
  const w = normalizedWeights();
  const fi = targetForecastIndex();
  const verdictPool = state.origin ? resorts.filter(r => resortMatchesDriveTier(r.id)) : resorts;
  return verdictPool
    .filter(r => state.weatherCache[r.id]?.data)
    .map(r => {
      const wx = state.weatherCache[r.id].data;
      return { resort: r, wx, breakdown: plannerScoreBreakdown(r, wx, fi, w) };
    })
    .sort((a, b) => b.breakdown.score - a.breakdown.score);
}

function _wtpCondScore(entry) {
  const n = entry.breakdown.normalized;
  return (n.snow + n.skiability) / 2;
}

function _wtpForecastConfidence(resortId) {
  const ts = state.weatherCache[resortId]?.ts;
  if (!ts) return 0.65;
  const ageMin = (Date.now() - ts) / 60000;
  if (ageMin < 120) return 0.9;
  if (ageMin < 360) return 0.75;
  return 0.6;
}

function _wtpDriveConfidence(resortId) {
  if (!state.origin) return 0.7;
  return getDriveMins(resortId) != null ? 1 : 0.7;
}

function _wtpPassMatchesFilter(resort) {
  if (state.passFilter === 'All') return true;
  return resort.passGroup === state.passFilter;
}

function _wtpNextPassRunner(ranked, winnerId) {
  return ranked.find(x => x.resort.id !== winnerId && _wtpPassMatchesFilter(x.resort)) || null;
}

function _wtpTripMode() {
  if (state.howFar === 0) return 'day';
  if (state.howFar === 1) return 'weekend';
  return 'any';
}

/**
 * @param {Array} resorts - filtered resort list used for verdict
 * @param {string} tier - great|good|marginal|bad
 * @returns {string[]} exactly 3 chip labels
 */
function buildWhyThisPickReasons(resorts, tier) {
  const ranked = _wtpRankedCandidates(resorts);
  if (!ranked.length) {
    return ['Best fit for your filters', 'Closest decent option', 'Manageable crowds'];
  }

  const winner = ranked[0];
  const runner = ranked[1] || null;
  const top5 = ranked.slice(0, 5);
  const w = normalizedWeights();
  const tripMode = _wtpTripMode();

  const avgTop5Cond = top5.reduce((s, x) => s + _wtpCondScore(x), 0) / Math.max(1, top5.length);
  const winnerCond = _wtpCondScore(winner);
  const weakWeather = avgTop5Cond < 0.45 || winnerCond < 0.5;
  const tierRough = tier === 'bad' || tier === 'marginal';
  const weakMode = weakWeather || tierRough;

  const W = winner.breakdown;
  const R = runner ? runner.breakdown : null;
  const totalW = W.score || 1e-6;
  const comp = k => _wtpClamp01((W.components[k] || 0) / totalW);

  const nW = W.normalized;
  const nR = R ? R.normalized : null;

  const gapOn = key => {
    if (!nR) return 0.5;
    return _wtpClamp01(0.5 + (nW[key] - nR[key]) / 2);
  };

  const dmW = getDriveMins(winner.resort.id);
  const dmR = runner ? getDriveMins(runner.resort.id) : null;
  const driveMinGap = dmW != null && dmR != null ? _wtpClamp01((dmR - dmW) / 45) : 0.45;

  const fi = targetForecastIndex();
  const snowInW = (winner.wx.forecast || [])[fi]?.snow || 0;
  const snowInR = runner ? ((runner.wx.forecast || [])[fi]?.snow || 0) : 0;
  const snowInchGap = _wtpClamp01((snowInW - snowInR) / 4);

  const scoreGap = runner ? _wtpClamp01((W.score - R.score) / 12) : 0.5;

  const winnerFarther = dmW != null && dmR != null && dmW > dmR + 5;
  const weekendPayoffGap = winnerFarther
    ? _wtpClamp01(scoreGap * 0.65 + gapOn('fit') * 0.35)
    : scoreGap;

  const prefSnow = w.snow >= 5 ? 1.0 : 0.6;
  const prefCrowd = w.crowd >= 5 ? 1.0 : 0.6;
  const prefValue = w.value >= 5 ? 1.0 : 0.4;
  const prefPass = state.passFilter !== 'All' ? 1.0 : 0;
  const prefVertical = state.verticalFilter && state.verticalFilter !== 'any' ? 1.0 : 0.5;

  const roughWeatherSignal = weakWeather || tierRough;
  const prefWeatherStory = roughWeatherSignal ? 1.0 : 0.8;

  const crowdConf = (() => {
    const diff = runner ? Math.abs(nW.crowd - nR.crowd) : 0;
    if (diff > 0.12) return 0.8;
    if (diff > 0.05) return 0.7;
    return 0.55;
  })();

  const priceConf = Number.isFinite(winner.resort.price) ? 0.8 : 0.55;

  const wxConf = _wtpForecastConfidence(winner.resort.id);
  const dConf = _wtpDriveConfidence(winner.resort.id);

  const visibilitySupported = runner ? _wtpVisibilitySupported(winner.wx, runner.wx, fi) : false;

  const resolvedSki = (() => {
    const contrib = comp('skiability');
    const gapSki = gapOn('skiability');
    if (visibilitySupported) {
      return {
        id: 'better_vis',
        bucket: 'visibility',
        label: 'Better visibility',
        contribution: contrib,
        gap: gapSki,
        confidence: wxConf * 0.95,
        preferenceMatch: prefWeatherStory,
      };
    }
    if (weakMode) {
      return {
        id: 'better_groomer',
        bucket: 'groomer',
        label: 'Better groomer setup',
        contribution: contrib,
        gap: gapSki,
        confidence: wxConf * 0.85,
        preferenceMatch: 1.0,
      };
    }
    if (snowInW >= 0.3 || snowInchGap > 0.2) {
      return {
        id: 'better_surface',
        bucket: 'surface',
        label: 'Better surface setup',
        contribution: contrib,
        gap: gapSki,
        confidence: wxConf * 0.92,
        preferenceMatch: prefWeatherStory,
      };
    }
    return {
      id: 'better_weather',
      bucket: 'weather',
      label: 'Better weather setup',
      contribution: contrib,
      gap: gapSki,
      confidence: wxConf,
      preferenceMatch: prefWeatherStory,
    };
  })();

  const resolvedSkiLabel = resolvedSki.label;

  const candidates = [];
  const push = (id, bucket, label, contribution, gap, confidence, preferenceMatch) => {
    const reasonScore = 0.45 * contribution + 0.3 * gap + 0.15 * confidence + 0.1 * preferenceMatch;
    candidates.push({ id, bucket, label, reasonScore, contribution, gap, confidence, preferenceMatch });
  };

  // Travel / drive — explicit trip modes: day | weekend | any distance
  if (tripMode === 'day') {
    push('day_trip_fit', 'travel', 'Best day-trip fit', comp('drive'), driveMinGap, dConf, 1.0);
    push('closest_decent', 'travel', 'Closest decent option', comp('drive'), driveMinGap, dConf, weakMode ? 1.0 : 0.35);
  } else if (tripMode === 'weekend') {
    push('weekend_fit', 'travel_wknd', 'Best weekend fit',
      _wtpClamp01((comp('drive') + comp('fit')) / 2), weekendPayoffGap, dConf, 1.0);
    push('worth_drive', 'travel_payoff', 'Worth the extra drive',
      _wtpClamp01((comp('snow') + comp('fit')) / 2),
      weekendPayoffGap,
      dConf,
      winnerFarther ? 1.0 : 0.35);
    push('wknd_nearby', 'travel_near', 'Best nearby weekend option',
      comp('drive'), _wtpClamp01(1 - driveMinGap + 0.15), dConf, weakMode ? 1.0 : 0.45);
  } else {
    push('any_fit', 'travel', 'Best fit for your setup',
      _wtpClamp01((comp('drive') + comp('fit')) / 2), weekendPayoffGap, dConf, 1.0);
    push('any_nearby', 'travel_near', 'Best nearby option',
      comp('drive'), _wtpClamp01(1 - driveMinGap + 0.15), dConf, weakMode ? 1.0 : 0.45);
  }

  // Snow
  const snowConf = wxConf;
  if (tripMode === 'day') {
    push('best_snow_day', 'snow', 'Best snow nearby',
      comp('snow'), Math.max(gapOn('snow'), snowInchGap), snowConf, prefSnow);
  } else if (tripMode === 'weekend') {
    push('best_snow_weekend', 'snow', 'Best snow in weekend range',
      comp('snow'), Math.max(gapOn('snow'), snowInchGap), snowConf, prefSnow);
    push('better_snow_drive', 'snow_drive', 'Better snow for the drive',
      comp('snow'), _wtpClamp01(snowInchGap * 0.85 + scoreGap * 0.15), snowConf, prefSnow);
  } else {
    push('best_snow_neutral', 'snow', 'Better snow nearby',
      comp('snow'), Math.max(gapOn('snow'), snowInchGap), snowConf, prefSnow);
  }

  push(resolvedSki.id, resolvedSki.bucket, resolvedSki.label,
    resolvedSki.contribution, resolvedSki.gap, resolvedSki.confidence, resolvedSki.preferenceMatch);

  // Crowds — "Lighter crowds" only when the lighter candidate wins; moderate chip stays "Manageable crowds"
  const crL = crowdForecast(winner.resort, winner.wx).label;
  push('lighter_crowds', 'crowds', 'Lighter crowds', comp('crowd'), gapOn('crowd'), crowdConf, prefCrowd);
  push('moderate_crowds', 'crowds_mod', 'Manageable crowds', comp('crowd'), 0.42, crowdConf, crL === 'Moderate' ? 0.9 : 0.35);

  // Pass
  if (state.passFilter !== 'All') {
    const pr = _wtpNextPassRunner(ranked, winner.resort.id);
    const passGap = pr ? _wtpClamp01((W.score - pr.breakdown.score) / 15) : 0.45;
    const passContrib = ranked.filter(_wtpPassMatchesFilter).length > 1
      ? _wtpClamp01(comp('snow') * 0.35 + comp('fit') * 0.35 + comp('drive') * 0.3)
      : 0.25;
    push('best_pass', 'pass', 'Best on your pass', passContrib, passGap, 1.0, prefPass);
  }

  push('better_value', 'value', 'Better value today', comp('value'), gapOn('value'), priceConf, prefValue);

  if (tripMode === 'weekend') {
    push('more_mountain', 'fit_size', 'More mountain for the trip', comp('fit'), gapOn('fit'), 0.72, prefVertical);
  }

  push('best_filters', 'fit_overall', 'Best fit for your filters', _wtpClamp01(W.score / 100), scoreGap, 0.8, 0.8);

  // Weak mode: demote only hype-style candidates (softer ×0.55)
  const hypeOnly = new Set(['worth_drive', 'best_snow_weekend']);
  const WEAK_HYPE_MULT = 0.55;
  const adjusted = candidates.map(c => {
    let s = c.reasonScore;
    if (weakMode && hypeOnly.has(c.id)) s *= WEAK_HYPE_MULT;
    return { ...c, reasonScore: s };
  });

  const modeAllow = c => {
    if (tripMode === 'day') {
      if (['weekend_fit', 'worth_drive', 'wknd_nearby', 'better_snow_drive', 'more_mountain', 'best_snow_weekend', 'best_snow_neutral', 'any_fit', 'any_nearby'].includes(c.id)) return false;
    } else if (tripMode === 'weekend') {
      if (['day_trip_fit', 'closest_decent', 'any_fit', 'any_nearby', 'best_snow_day', 'best_snow_neutral'].includes(c.id)) return false;
    } else {
      if (['day_trip_fit', 'closest_decent', 'weekend_fit', 'worth_drive', 'wknd_nearby', 'better_snow_drive', 'more_mountain', 'best_snow_day', 'best_snow_weekend'].includes(c.id)) return false;
    }
    return true;
  };

  const sorted = adjusted.filter(modeAllow).sort((a, b) => b.reasonScore - a.reasonScore);

  // Diversity: one label per bucket
  const usedBuckets = new Set();
  const picked = [];
  for (const c of sorted) {
    if (picked.length >= 3) break;
    if (usedBuckets.has(c.bucket)) continue;
    usedBuckets.add(c.bucket);
    picked.push(c);
  }

  let labels = picked.map(p => p.label);

  // Weak + day trip: prefer honest trio when factors support it
  if (weakMode && tripMode === 'day') {
    const hasClosest = sorted.some(s => s.id === 'closest_decent');
    if (hasClosest) {
      labels = ['Closest decent option', resolvedSkiLabel, 'Manageable crowds'];
    }
  }

  if (weakMode && tripMode === 'weekend') {
    const hasNear = sorted.some(s => s.id === 'wknd_nearby');
    const hasGroom = sorted.some(s => s.id === 'better_groomer');
    const hasCrowd = sorted.some(s => s.id === 'lighter_crowds');
    if (hasNear && hasGroom && hasCrowd) {
      labels = ['Best nearby weekend option', 'Better groomer setup', 'Lighter crowds'];
    }
  }

  const fallbacks = tripMode === 'day'
    ? ['Best fit for your filters', 'Closest decent option', 'Manageable crowds']
    : tripMode === 'weekend'
      ? ['Best fit for your filters', 'Best nearby weekend option', 'Lighter crowds']
      : ['Best fit for your setup', 'Best nearby option', 'Better snow nearby'];

  let fb = 0;
  while (labels.length < 3 && fb < fallbacks.length) {
    const f = fallbacks[fb++];
    if (!labels.includes(f)) labels.push(f);
  }
  return labels.slice(0, 3);
}
