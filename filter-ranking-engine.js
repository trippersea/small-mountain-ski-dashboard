/**
 * Filter + ranking engine — ported from design/handoff/Filters.html
 * Adapts live RESORTS data instead of hardcoded MTNS.
 */
(function (global) {
  'use strict';

  const DRIVE_CAP = { day: 180, ext: 360, any: Infinity };
  const SIZE_LABEL = { local: 'Local hill', mid: 'Mid-size', big: 'Big mountain' };
  const DEFAULTS = { drive: 'day', pass: 'any', state: 'all', price: 180, snow: 1, quiet: 1, size: 'any' };

  function sizeBucket(vert) {
    return vert <= 1300 ? 'local' : vert <= 2100 ? 'mid' : 'big';
  }

  function passToFilterArray(passGroup) {
    if (!passGroup || passGroup === 'Independent') return [];
    const key = String(passGroup).toLowerCase();
    if (key === 'epic' || key === 'ikon' || key === 'indy') return [key];
    return [];
  }

  /** Normalize a resort into the handoff mountain shape */
  function resortToMountain(resort, ctx) {
    const wx = ctx?.weatherCache?.[resort.id]?.data;
    const fi = typeof targetForecastIndex === 'function' ? targetForecastIndex() : 0;
    let snow = 0;
    if (wx?.forecast?.[fi]) snow = wx.forecast[fi].snow || 0;
    else if (wx?.forecast?.length) {
      snow = wx.forecast.reduce((s, f) => s + (f.snow || 0), 0);
    }

    const crowdObj = typeof crowdForecast === 'function' ? crowdForecast(resort, wx) : { score: 50 };
    const drive = typeof getDriveMins === 'function' ? (getDriveMins(resort.id) ?? 9999) : 9999;

    return {
      id: resort.id,
      name: resort.name,
      st: resort.state,
      drive,
      pass: passToFilterArray(resort.passGroup),
      price: resort.price,
      snow: Math.round(snow * 10) / 10,
      crowd: crowdObj.score ?? 50,
      vert: resort.vertical,
      _resort: resort,
    };
  }

  function buildMountainsFromResorts(resorts, ctx) {
    return (resorts || []).map(r => resortToMountain(r, ctx));
  }

  function passesHard(m, S, opts) {
    const hasOrigin = opts && opts.hasOrigin;
    if (hasOrigin && m.drive > DRIVE_CAP[S.drive]) return false;
    if (S.pass !== 'any' && !m.pass.includes(S.pass)) return false;
    if (S.state !== 'all' && m.st !== S.state) return false;
    if (S.size !== 'any' && sizeBucket(m.vert) !== S.size) return false;
    if (S.price < 180 && m.price > S.price) return false;
    return true;
  }

  function scoreDisplay(m, S, maxSnow, maxDrive) {
    const w = S.snow + S.quiet;
    if (w === 0) return 1 - m.drive / maxDrive;
    const sn = maxSnow > 0 ? m.snow / maxSnow : 0;
    const qu = (100 - m.crowd) / 100;
    return (S.snow * sn + S.quiet * qu) / w;
  }

  function fmtDrive(d) {
    const h = Math.floor(d / 60);
    const m = d % 60;
    return h + 'h ' + (m < 10 ? '0' : '') + m + 'm';
  }

  function crowdInfo(c) {
    if (c <= 30) return { l: 'Quiet', cls: 'q' };
    if (c <= 55) return { l: 'Moderate', cls: '' };
    return { l: 'Busy', cls: 'b' };
  }

  function passBadges(p) {
    if (!p.length) return '<span class="dh-pbadge none">No pass</span>';
    return p.map(x => `<span class="dh-pbadge">${x}</span>`).join('');
  }

  function filterAndRank(mountains, S, opts) {
    const matched = mountains.filter(m => passesHard(m, S, opts));
    const maxSnow = Math.max(...mountains.map(m => m.snow), 0.0001);
    const maxDrive = Math.max(...mountains.map(m => m.drive), 1);
    const sorted = matched.slice().sort((a, b) => {
      const sa = scoreDisplay(a, S, maxSnow, maxDrive);
      const sb = scoreDisplay(b, S, maxSnow, maxDrive);
      return sb - sa || a.drive - b.drive;
    });
    return { matched, sorted, maxSnow, maxDrive };
  }

  function buildChips(S, stateNames) {
    const c = [];
    if (S.drive !== 'any') c.push({ k: 'drive', label: 'Drive: ' + (S.drive === 'day' ? '≤ 3h' : '≤ 6h'), rank: false });
    if (S.pass !== 'any') c.push({ k: 'pass', label: 'Pass: ' + S.pass.charAt(0).toUpperCase() + S.pass.slice(1), rank: false });
    if (S.state !== 'all') c.push({ k: 'state', label: stateNames[S.state] || S.state, rank: false });
    if (S.size !== 'any') c.push({ k: 'size', label: 'Size: ' + SIZE_LABEL[S.size], rank: false });
    if (S.price < 180) c.push({ k: 'price', label: 'Under $' + S.price, rank: false });
    [['snow', 'Snow'], ['quiet', 'Quiet']].forEach(([k, lbl]) => {
      if (S[k] === 2) c.push({ k, label: lbl + ': top priority', rank: true });
    });
    return c;
  }

  /** Map app state → handoff filter state S */
  function appStateToFilterS(appState) {
    const howFar = appState.howFar ?? 0;
    const drive = howFar === 0 ? 'day' : howFar === 1 ? 'ext' : 'any';

    let pass = 'any';
    if (appState.passFilter && appState.passFilter !== 'All') {
      pass = appState.passFilter.toLowerCase();
    }

    let state = 'all';
    if (appState.stateFilter && appState.stateFilter !== 'All') {
      state = appState.stateFilter;
    }

    let size = 'any';
    const vf = appState.verticalFilter;
    if (vf === 'small') size = 'local';
    else if (vf === 'mid') size = 'mid';
    else if (vf === 'big') size = 'big';

    let price = 180;
    if (appState.weights?.value === 10) price = 99;
    else if (appState.weights?.value === 5) price = 149;
    else if (typeof appState.filterPriceMax === 'number') price = appState.filterPriceMax;

    const snowW = appState.rankSnowWeight ?? appStateToSnowWeight(appState.weights?.snow);
    const quietW = appState.rankQuietWeight ?? appStateToQuietWeight(appState.weights?.crowd);

    return { drive, pass, state, price, snow: snowW, quiet: quietW, size };
  }

  function appStateToSnowWeight(snowVal) {
    const v = Number(snowVal ?? 1);
    if (v >= 10) return 2;
    if (v >= 5) return 1;
    return 0;
  }

  function appStateToQuietWeight(crowdVal) {
    const v = Number(crowdVal ?? 1);
    if (v >= 10) return 2;
    if (v >= 5) return 1;
    return 0;
  }

  /** Sync handoff S back into app state */
  function filterSToAppState(S, appState) {
    appState.howFar = S.drive === 'day' ? 0 : S.drive === 'ext' ? 1 : 2;
    appState.passFilter = S.pass === 'any' ? 'All' : S.pass.charAt(0).toUpperCase() + S.pass.slice(1);
    appState.passPreference = S.pass;
    appState.stateFilter = S.state === 'all' ? 'All' : S.state;
    appState.verticalFilter = S.size === 'local' ? 'small' : S.size === 'mid' ? 'mid' : S.size === 'big' ? 'big' : 'any';
    appState.filterPriceMax = S.price;
    if (S.price >= 180) appState.weights.value = 0;
    else if (S.price <= 99) appState.weights.value = 10;
    else appState.weights.value = 5;
    appState.rankSnowWeight = S.snow;
    appState.rankQuietWeight = S.quiet;
    appState.weights.snow = S.snow === 2 ? 10 : S.snow === 1 ? 5 : 1;
    appState.weights.crowd = S.quiet === 2 ? 10 : S.quiet === 1 ? 5 : 1;
  }

  function loosenTightest(S) {
    const next = { ...S };
    if (next.price < 180) next.price = 180;
    else if (next.size !== 'any') next.size = 'any';
    else if (next.state !== 'all') next.state = 'all';
    else if (next.pass !== 'any') next.pass = 'any';
    else if (next.drive !== 'any') next.drive = next.drive === 'day' ? 'ext' : 'any';
    return next;
  }

  global.FilterRankingEngine = {
    DEFAULTS,
    DRIVE_CAP,
    SIZE_LABEL,
    sizeBucket,
    resortToMountain,
    buildMountainsFromResorts,
    passesHard,
    scoreDisplay,
    filterAndRank,
    buildChips,
    fmtDrive,
    crowdInfo,
    passBadges,
    appStateToFilterS,
    filterSToAppState,
    loosenTightest,
  };
})(typeof window !== 'undefined' ? window : globalThis);
