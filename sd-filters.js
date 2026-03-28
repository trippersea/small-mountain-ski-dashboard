// ═══════════════════════════════════════════════════════════════════════════════
// SD-FILTERS.JS — Filtering, sorting, and decision-brief logic
// Depends on: sd-data.js, sd-scoring.js, state (in sd-app.js)
// ═══════════════════════════════════════════════════════════════════════════════

// ─── Active filter list (for pills + badge count) ─────────────────────────────
function activeFilters() {
  const filters = [];
  if (state.search.trim())        filters.push(`Search: "${esc(state.search.trim())}"`);
  if (state.howFar > 0)           filters.push(`Drive: ${HOW_FAR_TIERS[state.howFar]?.label ?? ''}${state.origin ? '' : ' (set location)'}`);
  if (state.tempBucket !== 'any') filters.push(`Temp: ${{ideal:'0°–32°', spring:'33°+ Spring', cold:'Below 0°'}[state.tempBucket] || state.tempBucket}`);
  if (state.windBucket !== 'any') filters.push(`Wind: ${{light:'Calm', breezy:'Breezy', holds:'Gusty'}[state.windBucket] || state.windBucket}`);
  if (state.priceRange > 0)       filters.push(`Ticket: ${PRICE_RANGES[state.priceRange]?.label ?? ''}`);
  if (state.passFilter !== 'All') filters.push(`Pass: ${esc(state.passFilter)}`);
  if (state.stateFilter !== 'All') filters.push(`State: ${esc(state.stateFilter)}`);
  if (state.nightOnly)            filters.push('Night only');
  return filters;
}

// ─── Render active filter pills ───────────────────────────────────────────────
function renderActiveFilters() {
  if (!els.activeFilters) return;
  els.activeFilters.innerHTML = activeFilters().map(f => `<span class="filter-pill">${f}</span>`).join('');
}

// ─── Main filter function ─────────────────────────────────────────────────────
function filteredResorts() {
  const q = state.search.toLowerCase();
  return RESORTS.filter(r => {
    // Text search
    if (q && !(`${r.name} ${r.state} ${r.passGroup}`.toLowerCase().includes(q))) return false;

    // Pass filter
    if (state.passFilter !== 'All' && r.passGroup !== state.passFilter) return false;

    // State filter
    if (state.stateFilter !== 'All' && r.state !== state.stateFilter) return false;

    // Night skiing
    if (state.nightOnly && !r.night) return false;

    // Distance band filter (requires origin)
    // Day Trip = 0–3h, Weekend = 3h–6h (exclusive lower band), All = no restriction
    if (state.origin) {
      const tier  = HOW_FAR_TIERS[state.howFar];
      const cap   = tier?.cap   ?? 180;
      const floor = tier?.floor ?? 0;
      const mins  = getDriveMins(r.id);
      if (mins !== null) {
        if (cap < Infinity && mins > cap)   return false;
        if (floor > 0      && mins <= floor) return false;
      }
    }

    // Price range filter (compare section dropdown)
    if (state.priceRange > 0) {
      const pr = PRICE_RANGES[state.priceRange];
      if (pr && (r.price < pr.min || r.price > pr.max)) return false;
    }

    // Planner ticket price filters — hard ceiling applied per button selection.
    // These are separate from state.priceRange (compare dropdown); both can filter simultaneously.
    // If user sets both, only mountains matching BOTH pass through.
    if (state.weights.value === 10 && r.price >= 100)  return false;  // Under $100
    if (state.weights.value === 5  && r.price > 149)   return false;  // $100–$149 ceiling

    // Mountain size filter
    if (state.verticalFilter === 'small' && r.vertical >= 1000) return false;
    if (state.verticalFilter === 'mid'   && (r.vertical < 1000 || r.vertical > 1500)) return false;
    if (state.verticalFilter === 'big'   && r.vertical < 1500) return false;

    // Crowd preference gate
    const crowd = crowdForecast(r);
    if (!crowdPreferenceAllows(crowd)) return false;

    // Weather-based filters (only when weather is available)
    const wx       = state.weatherCache[r.id]?.data;
    const tomorrow = tomorrowForecast(wx);
    if (tomorrow) {
      if (!tempBucketMatches(tomorrow.lo))   return false;
      if (!windBucketMatches(tomorrow.wind)) return false;
      const target = snowPreferenceTarget();
      if (target > 0 && (tomorrow.snow || 0) < target) return false;
    }

    return true;
  });
}

// ─── Static sort (for non-score sorts) ───────────────────────────────────────
function staticSort(resorts) {
  const sorted = [...resorts];
  const dir    = tableSort.dir === 'asc' ? 1 : -1;
  sorted.sort((a, b) => {
    let cmp;
    switch (state.sortBy) {
      case 'drive':       { const da = getDriveMins(a.id) ?? 9999, db = getDriveMins(b.id) ?? 9999; cmp = da - db; break; }
      case 'price':       cmp = a.price       - b.price;       break;
      case 'vertical':    cmp = b.vertical    - a.vertical;    break;
      case 'trails':      cmp = b.trails      - a.trails;      break;
      case 'avgSnowfall': cmp = b.avgSnowfall - a.avgSnowfall; break;
      case 'crowd':       cmp = crowdForecast(b).score - crowdForecast(a).score; break;
      case 'state':       cmp = a.state.localeCompare(b.state);     break;
      case 'pass':        cmp = a.passGroup.localeCompare(b.passGroup); break;
      case 'name':
      default:            cmp = a.name.localeCompare(b.name);  break;
    }
    return cmp * dir;
  });
  return sorted;
}

// ─── Planner candidates (limits weather fetch scope) ─────────────────────────
// PERFORMANCE FIX: fetch nearest 20 first, then remaining in background.
function plannerCandidates(resorts) {
  const MAX = 80;
  const qualityScore = r => (r.avgSnowfall / 300) * 55 + (r.vertical / 3500) * 45;

  if (state.origin) {
    const byDistance = [...resorts]
      .filter(r => getDriveMins(r.id) !== null)
      .sort((a, b) => (getDriveMins(a.id) ?? 9999) - (getDriveMins(b.id) ?? 9999));
    const closestIds = new Set(byDistance.slice(0, 40).map(r => r.id));
    const extras     = [...resorts]
      .filter(r => !closestIds.has(r.id))
      .sort((a, b) => qualityScore(b) - qualityScore(a))
      .slice(0, MAX - Math.min(40, byDistance.length));
    return [...byDistance.slice(0, 40), ...extras];
  }
  return [...resorts].sort((a, b) => qualityScore(b) - qualityScore(a)).slice(0, MAX);
}

// ─── Nearest N candidates (for fast first render) ────────────────────────────
function nearestCandidates(resorts, n = 20) {
  if (!state.origin) {
    const qualityScore = r => (r.avgSnowfall / 300) * 55 + (r.vertical / 3500) * 45;
    return [...resorts].sort((a, b) => qualityScore(b) - qualityScore(a)).slice(0, n);
  }
  return [...resorts]
    .filter(r => getDriveMins(r.id) !== null)
    .sort((a, b) => (getDriveMins(a.id) ?? 9999) - (getDriveMins(b.id) ?? 9999))
    .slice(0, n);
}

// ─── Decision brief (context + scored top5) ────────────────────────────────
function buildDecisionBrief(resorts) {
  const context = getDecisionContext();

  const verdictTier  = HOW_FAR_TIERS[state.howFar];
  const verdictCap   = verdictTier?.cap   ?? 180;
  const verdictFloor = verdictTier?.floor ?? 0;
  const pool = (state.origin)
    ? resorts.filter(r => {
        const m = getDriveMins(r.id);
        if (m === null) return true;
        if (verdictCap < Infinity && m > verdictCap)    return false;
        if (verdictFloor > 0      && m <= verdictFloor) return false;
        return true;
      })
    : resorts;

  const scored = pool
    .map(resort => {
      const wx    = state.weatherCache[resort.id]?.data;
      if (!wx) return null;
      const ski   = skiScoreBreakdown(resort, wx, 0);
      const crowd = crowdForecast(resort);
      const drive = getDriveMins(resort.id) ?? null;
      const risk  = weatherRiskScore(wx);
      const storm = (wx.forecast || []).reduce((s, f) => s + (f.snow || 0), 0);
      return { resort, wx, ski, crowd, drive, risk, storm };
    })
    .filter(Boolean)
    .sort((a, b) => (b.ski.skiScore - a.ski.skiScore) || ((a.drive ?? 9999) - (b.drive ?? 9999)));

  if (!scored.length) return { context, primary: null, backup: null, top5: [] };

  const primary = scored[0];
  const backup  = scored.slice(1).find(x =>
    x.crowd.score     <= primary.crowd.score      ||
    (x.drive ?? 999)  <= (primary.drive ?? 999)   ||
    x.risk            <  primary.risk
  ) || scored[1] || null;

  return { context, primary, backup, top5: scored.slice(0, 5) };
}
