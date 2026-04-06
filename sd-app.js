// ═══════════════════════════════════════════════════════════════════════════════
// SD-APP.JS — State, networking, UI rendering, events, and initialization
// Depends on: sd-data.js, sd-scoring.js, sd-filters.js (loaded before this)
// ═══════════════════════════════════════════════════════════════════════════════

// Weather fetch phases — used only for friendlier verdict/storm loading vs unavailable copy
let weatherFetchPhase1Done = false;
let weatherFetchPhase2Done = false;

// ─── localStorage helpers ─────────────────────────────────────────────────────
function loadSavedWeights() {
  try { localStorage.removeItem('ski-planner-weights'); } catch (e) {}
  return { ...DEFAULT_WEIGHTS };
}
function loadSavedPassPreference() { return 'any'; }
function getSavedOrigin() {
  try { const r = localStorage.getItem('ski-saved-origin'); return r ? JSON.parse(r) : null; } catch (e) { return null; }
}
function saveOrigin(origin) {
  try { localStorage.setItem('ski-saved-origin', JSON.stringify(origin)); } catch (e) {}
}
function clearSavedOrigin() {
  try { localStorage.removeItem('ski-saved-origin'); } catch (e) {}
}
function isRememberChecked() {
  const cb = document.getElementById('rememberLocation');
  return cb ? cb.checked : false;
}


// ─── Sponsor configuration ────────────────────────────────────────────────────
// Single source of truth: featured-partners.js (loaded before this script).
// To add or remove a partner, edit featured-partners.js only — never edit here.
function getSponsor(resortId) {
  return (typeof getFeaturedPartner === 'function') ? getFeaturedPartner(resortId) : null;
}

// ─── Inject sponsor CSS once ──────────────────────────────────────────────────
(function injectSponsorCSS() {
  const style = document.createElement('style');
  style.textContent = `
    /* ── Table sponsored row ── */
    .sponsored-row { outline: 2px solid #2563eb; outline-offset: -1px; background: #eff6ff !important; }
    .sponsored-row .row-name::after {
      content: 'Featured'; margin-left: 8px;
      background: #2563eb; color: #fff;
      font-size: 9px; font-weight: 700; letter-spacing: .05em;
      padding: 2px 7px; border-radius: 999px; vertical-align: middle;
    }
    /* ── Mobile card sponsored ── */
    .mob-card-sponsored { border: 2px solid #2563eb !important; background: #eff6ff !important; }
    .mob-card-sponsored .mob-card-name::after {
      content: 'Featured'; margin-left: 8px;
      background: #2563eb; color: #fff;
      font-size: 9px; font-weight: 700; letter-spacing: .05em;
      padding: 2px 7px; border-radius: 999px; vertical-align: middle;
    }
    /* ── Detail panel header ── */
    .detail-header-rebuilt {
      padding: 14px 18px 10px;
    }
    .detail-header-rebuilt .dhr-eyebrow {
      font-size: 9px; font-weight: 700; text-transform: uppercase;
      letter-spacing: .1em; color: #667a96; margin-bottom: 4px;
    }
    .detail-header-rebuilt .dhr-sub {
      font-size: 12px; color: #667a96;
    }
    .detail-score-ring-new {
      width: 56px; height: 56px; border-radius: 50%;
      background: #22b38a;
      display: flex; flex-direction: column;
      align-items: center; justify-content: center;
      flex-shrink: 0; cursor: pointer;
    }
    .detail-score-ring-new.ring-low { background: #d95b5b; }
    .detail-score-ring-new.ring-mid { background: #f59e0b; }
    .detail-score-ring-new .dsrn-num {
      font-size: 20px; font-weight: 800; color: #fff; line-height: 1;
    }
    .detail-score-ring-new .dsrn-lbl {
      font-size: 7px; font-weight: 600; color: rgba(255,255,255,.8);
      text-transform: uppercase; letter-spacing: .06em;
    }
    .detail-header-rebuilt .dhr-actions {
      display: flex; align-items: center; gap: 10px;
    }
    .dhr-btn-primary {
      background: #2563eb; color: #fff !important;
      font-size: 13px; font-weight: 600;
      padding: 8px 18px; border-radius: 999px;
      text-decoration: none; transition: background .12s;
    }
    .dhr-btn-primary:hover { background: #1d4ed8; }
    .dhr-link-secondary {
      font-size: 12px; font-weight: 500; color: #6b7280;
      text-decoration: none; transition: color .12s;
    }
    .dhr-link-secondary:hover { color: #2563eb; }
    .featured-pill {
      display: inline-flex;
      align-items: center;
      background: #2563eb;
      color: #fff;
      border: 1px solid #2563eb;
      font-size: 11px;
      font-weight: 700;
      padding: 6px 12px;
      border-radius: 999px;
      letter-spacing: .04em;
      box-shadow: 0 4px 12px rgba(43,109,233,.18);
      white-space: nowrap;
    }
    .btn-book {
      background: #22b38a; color: #fff !important;
      font-size: 13px; font-weight: 700;
      padding: 8px 18px; border-radius: 999px;
      text-decoration: none; transition: background .12s;
    }
    .btn-book:hover { background: #1f9e78; }
    /* ── Live SnoCountry conditions chips ── */
    .cond-row { display:flex; flex-wrap:wrap; gap:6px; margin-top:8px; }
    .cond-chip {
      display:inline-flex; align-items:center;
      font-size:11px; font-weight:600;
      padding:3px 9px; border-radius:999px;
      background:rgba(255,255,255,.13); color:rgba(255,255,255,.85);
      border:1px solid rgba(255,255,255,.18);
    }
    .cond-chip--surface { background:rgba(34,179,138,.22); color:#6ee7b7; border-color:rgba(110,231,183,.3); }

    /* ── Verdict lodging card (Booking.com — overnight trigger) ── */
    .vcard-lodging { margin:14px 0 0; border-radius:10px; background:#f0f7ff; border:1px solid #bfdbfe; overflow:hidden; }
    .vcard-lodging-link {
      display:flex; align-items:center; gap:10px;
      padding:12px 16px; text-decoration:none;
      color:#1e40af; font-size:14px; font-weight:600;
      transition:background .12s;
    }
    .vcard-lodging-link:hover { background:#dbeafe; }
    .vcard-lodging-icon { font-size:16px; flex-shrink:0; }
    .vcard-lodging-text { flex:1; }
    .vcard-lodging-arrow { color:#3b82f6; font-weight:700; }
    .vcard-lodging-sub { padding:0 16px 8px; font-size:10px; color:#94a3b8; letter-spacing:.03em; }

    /* ── Table lodging link ── */
    .table-lodging-link { font-size:11px; font-weight:600; color:#2563eb; text-decoration:none; white-space:nowrap; }
    .table-lodging-link:hover { text-decoration:underline; }

    /* ── Verdict action buttons ── */
    .vcard-actions { display:flex; gap:10px; flex-wrap:wrap; align-items:center; margin-top:16px; padding-top:14px; border-top:1px solid #e2e8f0; }
    .vcard-book-btn { display:inline-flex; align-items:center; background:#2563eb; color:#fff !important; font-size:14px; font-weight:600; padding:10px 22px; border-radius:999px; text-decoration:none; border:none; cursor:pointer; font-family:inherit; transition:background .12s; white-space:nowrap; }
    .vcard-book-btn:hover { background:#1d4ed8; }
    .vcard-detail-btn { display:inline-flex; align-items:center; background:#fff; color:#111827; font-size:14px; font-weight:500; padding:10px 18px; border-radius:999px; border:1px solid #e5e7eb; cursor:pointer; font-family:inherit; transition:all .12s; white-space:nowrap; }
    .vcard-detail-btn:hover { background:#f9fafb; border-color:#d1d5db; }

  `;
  document.head.appendChild(style);
})();

// ─── Application state ────────────────────────────────────────────────────────
const state = Object.seal({
  search:         '',
  passFilter:     'All',
  stateFilter:    'All',
  sortBy:         'planner',
  nightOnly:      false,
  howFar:         0,
  priceRange:     0,
  verticalFilter: 'any',
  tempBucket:     'any',
  windBucket:     'any',
  selectedId:     null,
  origin:         null,
  driveCache:     {},
  weatherCache:   {},
  compareSet:     new Set(),
  conditionsCache: {},
  mapMode:        'drive',
  weights:        loadSavedWeights(),
  passPreference: loadSavedPassPreference(),
  tableSearch:    '',
  tableViewAll:   false,
});

// ─── Element cache ────────────────────────────────────────────────────────────
const els = {
  verdictSection:      $('verdictSection'),
  verdictCard:         $('verdictCard'),
  summaryCards:        $('summaryCards'),
  passFilter:          $('passFilter'),
  stateFilter:         $('stateFilter'),
  maxPriceFilter:      $('maxPriceFilter'),
  sortBy:              $('sortBy'),
  toggleNight:         $('toggleNight'),
  resetFilters:        $('resetFilters'),
  plannerDetails:      $('plannerDetails'),
  plannerSection:      $('plannerSection'),
  plannerFromLabel:    $('plannerFromLabel'),
  plannerEditLocation: $('plannerEditLocation'),
  activeFilters:       $('activeFilters'),
  originInput:         $('originInput'),
  setLocation:         $('setLocation'),
  detectLocation:      $('detectLocation'),
  locationStatus:      $('locationStatus'),
  stormGrid:           $('stormGrid'),
  hiddenGemGrid:       $('hiddenGemGrid'),
  tableSearch:         $('tableSearch'),
  tableViewAllBtn:     $('tableViewAllBtn'),
  resultCount:         $('resultCount'),
  comparisonBody:      $('comparisonBody'),
  mobileCardGrid:      $('mobileCardGrid'),
  compareTray:         $('compareTray'),
  comparePills:        $('comparePills'),
  compareBtn:          $('compareBtn'),
  clearCompare:        $('clearCompare'),
  comparePanel:        $('comparePanel'),
  compareContent:      $('compareContent'),
  closeCompare:        $('closeCompare'),
  detailSection:       $('detailSection'),
  detailCard:          $('detailCard'),
  mapLegend:           $('mapLegend'),
  backToTop:           $('backToTop'),
  toast:               $('toast'),
  aiChatInput:         $('aiChatInput'),
  aiChatBtn:           $('aiChatBtn'),
  aiChatResult:        $('aiChatResult'),
  heroPassSelect:      $('heroPassSelect'),
  heroSnowSelect:      $('heroSnowSelect'),
  hnRefineToggle:      $('hnRefineToggle'),
  plannerSeeVerdictBtn: $('plannerSeeVerdictBtn'),
};

let _mapModeBtns = null;
const mapModeBtns = () => _mapModeBtns || (_mapModeBtns = [...document.querySelectorAll('.map-mode-btn')]);

// ─── Utilities ────────────────────────────────────────────────────────────────
let toastTimer = null;
function showToast(message, dur = 2600) {
  els.toast.textContent = message;
  els.toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => els.toast.classList.remove('show'), dur);
}

function debounce(fn, ms) {
  let t;
  return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); };
}

// ─── Analytics helper ─────────────────────────────────────────────────────────
function trackEvent(eventName, params = {}) {
  try {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: eventName, ...params });
  } catch (e) {}
}

// ─── Drive helpers ────────────────────────────────────────────────────────────
function getDriveMins(id) {
  const v = state.driveCache[id];
  if (v == null) return null;
  return typeof v === 'object' ? v.mins : v;
}
function isDriveEstimated(id) {
  const v = state.driveCache[id];
  return v !== null && typeof v === 'object' && v.estimated;
}
function formatDriveMins(mins, estimated = false) {
  if (mins == null) return '—';
  const p = estimated ? '~' : '';
  if (mins >= 60) { const h = Math.floor(mins / 60), m = mins % 60; return m ? `${p}${h}h ${m}m` : `${p}${h}h`; }
  return `${p}${mins}m`;
}
function formatDrive(resortId) {
  return formatDriveMins(getDriveMins(resortId), isDriveEstimated(resortId));
}
function formatDistanceFromOrigin(resortId) {
  const resort = RESORTS.find(r => r.id === resortId);
  if (!resort || !state.origin) return 'Distance: TBD';
  let km = null;
  const cached = state.driveCache[resortId];
  if (cached && typeof cached === 'object' && typeof cached.km === 'number') km = cached.km;
  else if (typeof resort.lat === 'number') km = haversineKm(state.origin.lat, state.origin.lon, resort.lat, resort.lon);
  if (km == null || !Number.isFinite(km)) return 'Distance: TBD';
  return `Distance: ${Math.round(km * 0.621371)} mi`;
}

// ─── Booking.com affiliate URL (Awin) ────────────────────────────────────────
const AWIN_BOOKING_REDIRECT = 'https://www.awin1.com/cread.php?awinmid=6776&awinaffid=2816032';

function awinBookingRedirect(bookingSearchResultsUrl) {
  return `${AWIN_BOOKING_REDIRECT}&ued=${encodeURIComponent(bookingSearchResultsUrl)}`;
}

function bookingUrl(resort) {
  const dest = `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(resort.name + ', ' + resort.state)}`;
  return awinBookingRedirect(dest);
}

function bookingSearchUrl(searchQuery) {
  const dest = `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(searchQuery)}`;
  return awinBookingRedirect(dest);
}

/** Weekend lodging strip: top-pick area search via Awin, or generic ski search if no verdict yet. */
function syncWeekendLodgingStrip(verdict) {
  const strip = document.getElementById('hnBookingStrip');
  const a = strip?.querySelector('a.hn-booking-btn');
  if (!strip) return;
  const weekend = state.howFar >= 1;
  strip.hidden = !weekend;
  strip.style.display = weekend ? '' : 'none';
  if (!a || !weekend) return;
  a.href = verdict?.resort ? bookingUrl(verdict.resort) : bookingSearchUrl('ski resort');
  a.setAttribute('rel', 'noopener sponsored');
}

// ─── Haversine / drive estimates ──────────────────────────────────────────────
function haversineKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
function haversineToDriveMinutes(km) {
  // Ski resorts involve mountain/winding approach roads that add ~15% to straight-line distance.
  // Use conservative speeds and a larger buffer to avoid under-estimating drive times.
  const roadKm = km * 1.15;
  const speed  = roadKm < 40 ? 42 : roadKm < 110 ? 62 : 72;
  return Math.round(roadKm / speed * 60 + 15);
}
function applyHaversineEstimates() {
  if (!state.origin) return;
  RESORTS.forEach(resort => {
    if (state.driveCache[resort.id] !== undefined && !state.driveCache[resort.id]?.estimated) return;
    const km = haversineKm(state.origin.lat, state.origin.lon, resort.lat, resort.lon);
    state.driveCache[resort.id] = { mins: haversineToDriveMinutes(km), estimated: true, km };
  });
}

// ─── Fetch with timeout ───────────────────────────────────────────────────────
async function fetchWithTimeout(url, options = {}, ms = 8000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

// ─── Weather cache ────────────────────────────────────────────────────────────
function loadWeatherCache() {
  try {
    const raw = sessionStorage.getItem('ski-wx-cache');
    if (!raw) return;
    const now = Date.now();
    Object.entries(JSON.parse(raw)).forEach(([id, entry]) => {
      if (now - entry.ts < WX_TTL) state.weatherCache[id] = entry;
    });
  } catch (e) {}
}
function saveWeatherCache() {
  try { sessionStorage.setItem('ski-wx-cache', JSON.stringify(state.weatherCache)); } catch (e) {}
}

// ─── History cache ────────────────────────────────────────────────────────────
function historyDateRange() {
  const end = new Date(); end.setDate(end.getDate() - 1);
  const start = new Date(end); start.setDate(end.getDate() - 6);
  const fmt = d => d.toISOString().slice(0, 10);
  return { start: fmt(start), end: fmt(end) };
}

async function fetchHistory(resort) {
  const cached = historyCache.get(resort.id);
  if (cached && Date.now() - cached.ts < HIST_TTL) return cached;
  try {
    const { start, end } = historyDateRange();
    const url = `https://archive-api.open-meteo.com/v1/archive?` +
      `latitude=${resort.lat}&longitude=${resort.lon}` +
      `&start_date=${start}&end_date=${end}` +
      `&daily=snowfall_sum&timezone=America%2FNew_York`;
    const res  = await fetchWithTimeout(url, {}, 10000);
    const data = await res.json();
    const days  = (data.daily?.time || []).map((date, i) => ({
      date, snow: Math.round((data.daily.snowfall_sum?.[i] || 0) * 10) / 10,
    }));
    const total = Math.round(days.reduce((s, d) => s + d.snow, 0) * 10) / 10;
    const entry = { total, days, ts: Date.now() };
    historyCache.set(resort.id, entry);
    return entry;
  } catch (e) { return null; }
}

// PERFORMANCE FIX: Limit history to top 20 mountains, not all 50
async function ensureHistory(resorts) {
  const limited = resorts.slice(0, 20);
  const queue   = limited.filter(r => !historyCache.has(r.id));
  await Promise.all(Array.from({ length: 4 }, async () => {
    while (queue.length) {
      const r = queue.shift();
      if (r) await fetchHistory(r);
    }
  }));
  saveHistoryCache();
}

function loadHistoryCache() {
  try {
    const raw = sessionStorage.getItem('ski-hist-cache');
    if (!raw) return;
    const now = Date.now();
    Object.entries(JSON.parse(raw)).forEach(([id, entry]) => {
      if (now - entry.ts < HIST_TTL) historyCache.set(id, entry);
    });
  } catch (e) {}
}
function saveHistoryCache() {
  try {
    const obj = {};
    historyCache.forEach((v, k) => { obj[k] = v; });
    sessionStorage.setItem('ski-hist-cache', JSON.stringify(obj));
  } catch (e) {}
}

// ─── Weather fetching ─────────────────────────────────────────────────────────
// PERFORMANCE + API FIX: Added models=best_match for higher-res summit forecasts
async function fetchWeather(resort) {
  const cached = state.weatherCache[resort.id];
  if (cached && Date.now() - cached.ts < WX_TTL) return cached.data;
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${resort.lat}&longitude=${resort.lon}` +
      `&current=temperature_2m,weathercode,windspeed_10m` +
      `&daily=weathercode,temperature_2m_max,temperature_2m_min,snowfall_sum,windspeed_10m_max` +
      `&temperature_unit=fahrenheit&wind_speed_unit=mph&forecast_days=4` +
      `&timezone=America%2FNew_York&models=best_match`;
    const res  = await fetchWithTimeout(url);
    if (!res.ok) return null;
    const data = await res.json();
    if (!data?.current || !Array.isArray(data.daily?.time) || data.daily.time.length < 2) return null;
    const wx = {
      temp: Math.round(data.current.temperature_2m),
      code: data.current.weathercode,
      wind: Math.round(data.current.windspeed_10m),
      forecast: data.daily.time.slice(1, 4).map((date, i) => ({
        day:  new Date(date + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'short' }),
        code: data.daily.weathercode[i + 1],
        hi:   Math.round(data.daily.temperature_2m_max[i + 1]),
        lo:   Math.round(data.daily.temperature_2m_min[i + 1]),
        snow: Math.round((data.daily.snowfall_sum?.[i + 1] || 0) * 10) / 10,
        wind: Math.round(data.daily.windspeed_10m_max?.[i + 1] || 0),
      })),
    };
    state.weatherCache[resort.id] = { ts: Date.now(), data: wx };
    return wx;
  } catch (e) { return null; }
}


// ─── SnoCountry live conditions ───────────────────────────────────────────────
// Fetches reported snow, surface condition, trails/lifts open from /api/conditions.
// Results cached in state.conditionsCache keyed by resort.id.
// Fails silently — Open-Meteo forecast is always the scoring source of truth.
const CONDITIONS_TTL = 30 * 60 * 1000; // 30 minutes

async function fetchConditions(resortId) {
  const cached = state.conditionsCache[resortId];
  if (cached && Date.now() - cached.ts < CONDITIONS_TTL) return cached.data;
  try {
    const res = await fetchWithTimeout('/api/conditions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resortSlug: resortId }),
    }, 8000);
    if (!res.ok) return null;
    const json = await res.json();
    if (json.disabled || !json.conditions?.length) return null;
    const data = json.conditions[0];
    state.conditionsCache[resortId] = { ts: Date.now(), data };
    return data;
  } catch (e) { return null; }
}

// Inject live conditions badge into a card slot after async fetch.
async function injectConditionsBadge(resortId, slotId) {
  const slot = document.getElementById(slotId);
  if (!slot) return;
  const c = await fetchConditions(resortId);
  if (!c) return;
  const parts = [];
  if (c.surfaceCondition) parts.push(`<span class="cond-chip cond-chip--surface">${esc(c.surfaceCondition)}</span>`);
  if (c.trailsOpen != null && c.trailsTotal != null) parts.push(`<span class="cond-chip">${c.trailsOpen}/${c.trailsTotal} trails open</span>`);
  if (c.baseDepthMin != null) parts.push(`<span class="cond-chip">${c.baseDepthMin}${c.baseDepthMax ? '–' + c.baseDepthMax : ''}" base</span>`);
  if (c.liftsOpen != null && c.liftsTotal != null) parts.push(`<span class="cond-chip">${c.liftsOpen}/${c.liftsTotal} lifts</span>`);
  if (!parts.length) return;
  slot.innerHTML = `<div class="cond-row">${parts.join('')}</div>`;
  slot.removeAttribute('hidden');
}

// PERFORMANCE FIX: Fetch nearest 20 first → render → then rest in background
async function ensureWeather(resorts) {
  const near = nearestCandidates(resorts, 20);
  const rest  = resorts.filter(r => !near.find(n => n.id === r.id));

  // Phase 1: Nearest 20 — show results fast
  const q1 = [...near.filter(r => !state.weatherCache[r.id]?.data)];
  await Promise.all(Array.from({ length: 8 }, async () => {
    while (q1.length) { const r = q1.shift(); if (r) await fetchWeather(r); }
  }));
  weatherFetchPhase1Done = true;

  // Phase 2: Rest in background — don't block first render
  const q2 = [...rest.filter(r => !state.weatherCache[r.id]?.data)];
  Promise.all(Array.from({ length: 8 }, async () => {
    while (q2.length) { const r = q2.shift(); if (r) await fetchWeather(r); }
  })).then(() => {
    saveWeatherCache();
    weatherFetchPhase2Done = true;
    repaintMainUI(filteredResorts());
  });

  saveWeatherCache();
}

// ─── OSRM drive times ─────────────────────────────────────────────────────────
async function fetchOsrmTime(resort) {
  if (!state.origin) return null;
  const existing = state.driveCache[resort.id];
  if (existing !== undefined && existing !== null && !existing?.estimated) return existing;
  try {
    const url = `https://router.project-osrm.org/route/v1/driving/` +
      `${state.origin.lon},${state.origin.lat};${resort.lon},${resort.lat}?overview=false`;
    const res  = await fetchWithTimeout(url);
    const data = await res.json();
    if (!data.routes?.[0]) throw new Error('No route');
    const mins = Math.round(data.routes[0].duration / 60);
    state.driveCache[resort.id] = mins;
    return mins;
  } catch (e) {
    return state.driveCache[resort.id]?.mins ?? null;
  }
}

async function loadDriveTimes() {
  if (!state.origin) return;
  applyHaversineEstimates();
  render();
  showToast('Refining drive times…', 5000);

  const closest = [...RESORTS]
    .filter(r => state.driveCache[r.id]?.km !== undefined)
    .sort((a, b) => state.driveCache[a.id].km - state.driveCache[b.id].km)
    .slice(0, OSRM_LIMIT);

  const queue = [...closest];
  let fetchCount = 0;
  let osrmSuccessCount = 0;
  await Promise.all(Array.from({ length: OSRM_CONCURRENCY }, async () => {
    while (queue.length) {
      const r = queue.shift();
      if (!r) break;
      await fetchOsrmTime(r);
      if (typeof state.driveCache[r.id] === 'number') osrmSuccessCount++;
      if (++fetchCount % 8 === 0) render();
    }
  }));
  render();
  if (osrmSuccessCount > 0) showToast('Drive times updated with routes', 2200);
  else if (closest.length > 0) {
    showToast('Using estimated drive times — routing service did not return routes', 4500);
  } else showToast('Drive times ready', 1800);
}

// ─── Geocoding ────────────────────────────────────────────────────────────────
// Nominatim requires a valid User-Agent (https://operations.osmfoundation.org/policies/nominatim/).
const NOMINATIM_HEADERS = {
  'Accept-Language': 'en-US,en;q=0.9',
  'User-Agent': 'WhereToSkiNext-SkiDashboard/1.0 (+https://www.wheretoskinext.com)',
};

/** US ZIP: 12345 or 12345-6789; also extracts 5 digits from strings like "near 02138". */
function extractUsZip(query) {
  const t = String(query || '').trim();
  const strict = t.match(/^(\d{5})(?:-\d{4})?$/);
  if (strict) return strict[1];
  const loose = t.match(/\b(\d{5})(?:-\d{4})?\b/);
  return loose ? loose[1] : null;
}

function labelFromNominatimResult(row) {
  const parts = (row.display_name || '').split(', ').map(s => s.trim()).filter(Boolean);
  const us = parts.indexOf('United States');
  if (us >= 2 && /^\d{5}(-\d{4})?$/.test(parts[0].replace(/\s/g, ''))) {
    const town = parts[1];
    const region = parts[us - 1];
    return `${town}, ${region}`;
  }
  if (parts.length >= 2) return `${parts[0]}, ${parts[1]}`;
  return parts[0] || row.name || 'Unknown';
}

async function geocodeOrigin(query) {
  const q = query.trim();
  if (!q) return null;

  const zip = extractUsZip(q);

  // 1) US ZIP → Nominatim structured search (works in-browser; Zippopotam often blocks CORS).
  if (zip) {
    try {
      const res = await fetchWithTimeout(
        `https://nominatim.openstreetmap.org/search?postalcode=${encodeURIComponent(zip)}&country=us&format=json&limit=1`,
        { headers: { ...NOMINATIM_HEADERS } }
      );
      if (res.ok) {
        const data = await res.json();
        if (data.length) {
          const row = data[0];
          return {
            lat: parseFloat(row.lat),
            lon: parseFloat(row.lon),
            label: labelFromNominatimResult(row),
          };
        }
      }
    } catch (e) {}

    try {
      const res = await fetchWithTimeout(`https://api.zippopotam.us/us/${zip}`);
      if (res.ok) {
        const d = await res.json();
        const place = d.places?.[0];
        if (place) {
          return {
            lat: parseFloat(place.latitude),
            lon: parseFloat(place.longitude),
            label: `${place['place name']}, ${place.state || place['state abbreviation'] || ''}`.replace(/,\s*$/, ''),
          };
        }
      }
    } catch (e) {}
  }

  // 2) Free-text (city, address, …) → Nominatim
  try {
    const res = await fetchWithTimeout(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=1&countrycodes=us`,
      { headers: { ...NOMINATIM_HEADERS } }
    );
    if (!res.ok) return null;
    const data = await res.json();
    if (!data.length) return null;
    const row = data[0];
    return {
      lat: parseFloat(row.lat),
      lon: parseFloat(row.lon),
      label: labelFromNominatimResult(row),
    };
  } catch (e) {
    return null;
  }
}

// ─── Shareable URL system ─────────────────────────────────────────────────────
function serializeState() {
  const p = new URLSearchParams();
  const w = state.weights;
  if ([w.snow, w.size, w.value, w.crowd].join(',') !== [DEFAULT_WEIGHTS.snow, DEFAULT_WEIGHTS.size, DEFAULT_WEIGHTS.value, DEFAULT_WEIGHTS.crowd].join(',')) {
    p.set('w', [w.snow, w.size, w.value, w.crowd].join(','));
  }
  if (state.verticalFilter !== 'any')  p.set('vert',  state.verticalFilter);
  if (state.passFilter  !== 'All')     p.set('pass',  state.passFilter);
  if (state.stateFilter !== 'All')     p.set('st',    state.stateFilter);
  if (state.sortBy      !== 'planner') p.set('sort',  state.sortBy);
  if (state.nightOnly)                 p.set('night', '1');
  if (state.howFar > 0)                p.set('howfar', state.howFar);
  if (state.origin) {
    p.set('lat', state.origin.lat.toFixed(4));
    p.set('lon', state.origin.lon.toFixed(4));
    p.set('loc', state.origin.label);
  }
  return p;
}

function applyUrlState() {
  const p = new URLSearchParams(window.location.search);
  if (!p.toString()) return false;
  const wStr = p.get('w');
  if (wStr) {
    const parts = wStr.split(',').map(Number);
    if (parts.length === 4 && parts.every(n => !isNaN(n) && n >= 0)) {
      const [snow, size, value, crowd] = parts;
      state.weights = { ...state.weights, snow, size, value, crowd };
    }
  }
  if (p.has('vert')  && ['any','small','mid','big'].includes(p.get('vert'))) state.verticalFilter = p.get('vert');
  if (p.has('pass')  && UNIQUE_PASSES.includes(p.get('pass')))  state.passFilter  = p.get('pass');
  if (p.has('st')    && UNIQUE_STATES.includes(p.get('st')))    state.stateFilter = p.get('st');
  if (p.has('sort'))   state.sortBy   = p.get('sort');
  if (p.has('night'))  state.nightOnly = true;
  if (p.has('howfar')) state.howFar = Math.min(2, Number(p.get('howfar')) || 0);
  const lat = parseFloat(p.get('lat')), lon = parseFloat(p.get('lon')), loc = p.get('loc');
  if (!isNaN(lat) && !isNaN(lon) && loc) state.origin = { lat, lon, label: loc };
  // Pre-populate compare set from URL e.g. ?compare=stowe-mountain-resort,killington-resort
  if (p.has('compare')) {
    const ids = p.get('compare').split(',').map(s => s.trim()).filter(Boolean);
    if (ids.length >= 2) state.compareSet = new Set(ids);
  }
  return true;
}

function slugify(name) {
  return name.toLowerCase().replace(/['''']/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}
function findResortBySlug(slug) {
  return RESORTS.find(r => slugify(r.name) === slug || r.id === slug) || null;
}
function getReportSlug() {
  const m = window.location.pathname.match(/^\/report\/([^/?#]+)/);
  return m ? m[1] : null;
}
function pushReportUrl(resort) {
  const slug   = slugify(resort.name);
  const params = serializeState();
  const qs     = params.toString() ? '?' + params : '';
  history.pushState({ reportSlug: slug }, resort.name + ' — WhereToSkiNext.com', '/report/' + slug + qs);
  document.title = resort.name + ' — WhereToSkiNext.com';
}
function popToRoot() {
  const params = serializeState();
  const qs     = params.toString() ? '?' + params : '';
  history.replaceState({ reportSlug: null }, 'WhereToSkiNext.com', '/' + qs);
  document.title = 'WhereToSkiNext.com';
}
const pushUrlDebounced = debounce(() => {
  const p    = serializeState();
  const qs   = p.toString() ? '?' + p : '';
  const base = state.selectedId
    ? '/report/' + slugify(RESORTS.find(r => r.id === state.selectedId)?.name || state.selectedId)
    : '/';
  history.replaceState(null, '', base + qs);
}, 600);

function copyShareLink() {
  const p   = serializeState();
  const url = `${location.origin}${location.pathname}${p.toString() ? '?' + p : ''}`;
  const doToast = () => showToast('Link copied — share with your crew!', 3200);
  if (navigator.clipboard?.writeText) {
    navigator.clipboard.writeText(url).then(doToast).catch(() => fallbackCopy(url));
  } else { fallbackCopy(url); }
}
function fallbackCopy(text) {
  const ta = Object.assign(document.createElement('textarea'), { value: text, style: 'position:fixed;opacity:0' });
  document.body.appendChild(ta); ta.select();
  try { document.execCommand('copy'); showToast('Link copied!', 3200); } catch(e) {}
  document.body.removeChild(ta);
}

// ─── Planner state helpers ────────────────────────────────────────────────────
function savePlannerState() {
  try {
    localStorage.setItem('ski-planner-weights', JSON.stringify(state.weights));
    localStorage.setItem('ski-pass-pref',       state.passPreference);
  } catch (e) {}
}

function snapToPriority(v) {
  const n = Number(v) || 1;
  if (n <= 2)  return 1;
  if (n <= 7)  return 5;
  if (n <= 12) return 10;
  return 15;
}

function normalizeWeightsToPriority() {
  state.weights.snow = snapToPriority(state.weights.snow);
  ['value', 'crowd'].forEach(k => {
    const raw = Number(state.weights[k]);
    if (k === 'value' && raw === 0) { state.weights[k] = 0; return; }
    state.weights[k] = snapToPriority(raw);
    if (state.weights[k] === 15) state.weights[k] = 10;
  });
  state.weights.size = 5;
}

function updatePlannerOriginLabel() {
  const el = document.getElementById('plannerFromLabel');
  if (!el) return;
  el.textContent = (state.origin?.label) ? ' — ' + state.origin.label : '';
  if (els.plannerEditLocation) els.plannerEditLocation.hidden = !state.origin;
}

function syncPlannerControls() {
  // Must scope to #plannerDetails only: #filterDrawer sits earlier in the DOM and keeps a clone
  // of the planner after the mobile drawer is opened—document.querySelector would sync the wrong node.
  const plannerRoot = document.getElementById('plannerDetails');

  ['snow', 'value', 'crowd'].forEach(key => {
    const group = plannerRoot?.querySelector(`.priority-btns[data-key="${key}"]`);
    if (!group) return;
    const val = state.weights[key] ?? 1;
    group.querySelectorAll('.priority-btn').forEach(btn => btn.classList.toggle('active', Number(btn.dataset.val) === val));
  });
  const vertGroup = plannerRoot?.querySelector('.priority-btns[data-key="size"]');
  if (vertGroup) vertGroup.querySelectorAll('.priority-btn').forEach(btn => btn.classList.toggle('active', btn.dataset.val === state.verticalFilter));
  const tempGroup = plannerRoot?.querySelector('.priority-btns[data-key="temp"]');
  if (tempGroup) tempGroup.querySelectorAll('.priority-btn').forEach(btn => btn.classList.toggle('active', btn.dataset.val === state.tempBucket));
  const windGroup = plannerRoot?.querySelector('.priority-btns[data-key="wind"]');
  if (windGroup) windGroup.querySelectorAll('.priority-btn').forEach(btn => btn.classList.toggle('active', btn.dataset.val === state.windBucket));
  const howfarGroup = plannerRoot?.querySelector('.priority-btns[data-key="howfar"]');
  if (howfarGroup) howfarGroup.querySelectorAll('.priority-btn').forEach(btn => btn.classList.toggle('active', Number(btn.dataset.val) === state.howFar));

  const plannerPass = state.passFilter === 'All' ? 'any' : state.passFilter;
  document.querySelectorAll('.pass-pref-btn').forEach(btn => btn.classList.toggle('active', btn.dataset.pass === plannerPass));

  const _fromLabel = document.getElementById('plannerFromLabel');
  if (_fromLabel) _fromLabel.textContent = (state.origin?.label) ? ' — ' + state.origin.label : '';

  if (els.passFilter)     els.passFilter.value = state.passFilter;
  if (els.heroPassSelect) els.heroPassSelect.value = state.passFilter;
  if (els.heroSnowSelect) els.heroSnowSelect.value = String(state.weights.snow ?? 1);
  mapModeBtns().forEach(btn => btn.classList.toggle('active', btn.dataset.mapMode === state.mapMode));
  const _hfEl = document.getElementById('howFarFilter');
  if (_hfEl) _hfEl.value = String(state.howFar);
  document.querySelectorAll('.vcard-range-btn[data-tier]').forEach(b => b.classList.toggle('active', Number(b.dataset.tier) === state.howFar));

  // Sync hero pass chips
  document.querySelectorAll('.hn-pchip').forEach(c => c.classList.toggle('hn-chip-on', c.dataset.val === state.passFilter));
  // Sync hero trip type chips
  document.querySelectorAll('.hn-tchip').forEach(c => c.classList.toggle('hn-chip-on', Number(c.dataset.val) === state.howFar));
  // Sync booking strip — use both hidden attr and display style to beat CSS specificity
  syncWeekendLodgingStrip(computeVerdict(filteredResorts()));
}

/** Shared by main #plannerDetails and mobile drawer clone — updates planner-related state from a priority pill. */
function updateStateFromPlannerPriorityButton(key, btn) {
  if (key === 'size') state.verticalFilter = btn.dataset.val;
  else if (key === 'temp') state.tempBucket = btn.dataset.val;
  else if (key === 'wind') state.windBucket = btn.dataset.val;
  else if (key === 'howfar') {
    state.howFar = Number(btn.dataset.val);
    const _hfEl = document.getElementById('howFarFilter');
    if (_hfEl) _hfEl.value = String(state.howFar);
    if (state.howFar < 2 && !state.origin) showToast('Add your starting location to activate distance filtering', 4000);
  } else {
    state.weights[key] = Number(btn.dataset.val);
    normalizeWeightsToPriority();
  }
}

function commitPlannerPriorityChange(key, btn) {
  updateStateFromPlannerPriorityButton(key, btn);
  trackEvent('ski_preference_set', {
    preference_type:  key,
    preference_value: btn.dataset.val,
    preference_label: btn.textContent.trim(),
  });
  savePlannerState();
  syncPlannerControls();
  pushUrlDebounced();
  if (key === 'howfar') { render(); updateFilterBadge(); }
  else { debouncedRender(); updateFilterBadge(); }
}

/** Scroll to Best Match — verdict is above the refine panel, so users need an explicit jump after changing filters. */
function scrollToBestMatchFromFilters(source) {
  trackEvent('refine_see_verdict', { source: String(source || 'unknown') });
  els.verdictSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ─── Verdict engine ───────────────────────────────────────────────────────────
function computeVerdict(resorts) {
  const verdictPool = state.origin ? resorts.filter(r => resortMatchesDriveTier(r.id)) : resorts;
  const withWx = verdictPool.filter(r => state.weatherCache[r.id]?.data);
  if (!withWx.length) return null;

  const w      = normalizedWeights();
  const ranked = withWx.map(r => {
    const wx = state.weatherCache[r.id].data;
    return { resort: r, wx, breakdown: plannerScoreBreakdown(r, wx, 0, w), history: historyCache.get(r.id) || null };
  }).sort((a, b) => b.breakdown.score - a.breakdown.score);

  const { resort, wx, breakdown, history } = ranked[0];
  const forecast   = wx.forecast || [];
  const tomorrowIn = forecast[0]?.snow || 0;
  const stormTotal = forecast.reduce((s, f) => s + (f.snow || 0), 0);
  const histTotal  = history?.total ?? null;
  const histDays   = history?.days ?? null;

  const baseLo      = forecast[0]?.lo ?? 30;
  const sLo         = summitTempF(baseLo, resort.baseElevation, resort.summitElevation);
  const rainLikely  = sLo > 34;
  const warmCaution = sLo > 28 && !rainLikely;
  const coldSnow    = sLo <= 24;

  const drive     = getDriveMins(resort.id);
  const driveText = drive !== null ? formatDrive(resort.id) : '';

  let tier, headline, detail, subPoints = [];

  if (rainLikely) {
    tier = 'bad'; headline = 'Skip this weekend';
    detail = `Temperatures look too warm — rain likely above ${resort.baseElevation.toLocaleString()} ft at ${esc(resort.name)}.`;
  } else if (stormTotal >= 6 || tomorrowIn >= 4) {
    tier = 'great'; headline = 'Go — excellent conditions';
    detail = tomorrowIn >= 4
      ? `${tomorrowIn.toFixed(1)}" expected tomorrow at ${esc(resort.name)}. That's a powder day.`
      : `${stormTotal.toFixed(1)}" forecast over 3 days — this is what you wait all season for.`;
    if (coldSnow) subPoints.push('Ideal temps — light, dry snow expected');
    if (histTotal !== null && histTotal >= 6) subPoints.push(`${histTotal}" already fell this week — base is deep`);
  } else if (stormTotal >= 2 || (histTotal !== null && histTotal >= 6)) {
    tier = 'good'; headline = 'Decent conditions — worth the trip';
    if (stormTotal >= 2) {
      detail = `${stormTotal.toFixed(1)}" in the 3-day forecast at ${esc(resort.name)}. Not a powder day, but fresh snow makes a real difference.`;
    } else {
      detail = `${histTotal}" fell this week at ${esc(resort.name)}. Expect a solid, consolidated base even without new snow.`;
    }
    if (warmCaution) subPoints.push('Snow may be dense/wet — get out early for best runs');
  } else if (stormTotal >= 0.5) {
    tier = 'marginal'; headline = 'Marginal — manage your expectations';
    detail = `Only ${stormTotal.toFixed(1)}" in the forecast. Mostly working with the existing base — groomed runs will be fine.`;
    subPoints.push('Stick to groomed trails, get out early, avoid south-facing terrain');
  } else {
    tier = 'bad'; headline = 'Probably skip this one';
    detail = `Less than half an inch forecast and limited recent snowfall at ${esc(resort.name)}.`;
  }

  return { tier, headline, detail, subPoints, resort, breakdown, drive, driveText, tomorrowIn, stormTotal, histTotal, histDays };
}

/** Next-best mountains after the verdict pick — prefers scored + weather, backfills so the UI always shows 3 when possible. */
function collectRunnerUpItems(filteredResorts, excludeResortId, limit = 3) {
  const w = normalizedWeights();
  const pool = state.origin
    ? filteredResorts.filter(r => resortMatchesDriveTier(r.id))
    : filteredResorts;
  const scored = pool
    .filter(r => r.id !== excludeResortId && state.weatherCache[r.id]?.data)
    .map(r => {
      const wx = state.weatherCache[r.id].data;
      return { resort: r, wx, breakdown: plannerScoreBreakdown(r, wx, 0, w) };
    })
    .sort((a, b) => b.breakdown.score - a.breakdown.score);
  const out = scored.slice(0, limit);
  if (out.length >= limit) return out;
  const used = new Set([excludeResortId, ...out.map(x => x.resort.id)]);
  const rest = pool
    .filter(r => !used.has(r.id))
    .sort((a, b) => {
      const wa = state.weatherCache[a.id]?.data;
      const wb = state.weatherCache[b.id]?.data;
      const sa = wa ? plannerScoreBreakdown(a, wa, 0, w).score : -Infinity;
      const sb = wb ? plannerScoreBreakdown(b, wb, 0, w).score : -Infinity;
      if (sa !== sb) return sb - sa;
      return (getDriveMins(a.id) ?? 9999) - (getDriveMins(b.id) ?? 9999);
    });
  for (const r of rest) {
    if (out.length >= limit) break;
    const wx = state.weatherCache[r.id]?.data;
    out.push({
      resort: r,
      wx,
      breakdown: wx ? plannerScoreBreakdown(r, wx, 0, w) : null,
    });
  }
  return out;
}

function renderVerdict(resorts) {
  if (!els.verdictSection || !els.verdictCard) return;
  const v = computeVerdict(resorts);
  syncWeekendLodgingStrip(v);
  const _hnSectionEarly = document.getElementById('hnRunnerUpSection');
  if (!v) {
    if (_hnSectionEarly) _hnSectionEarly.hidden = true;
    const filtersTightenEmpty = resorts.length === 0 && (
      state.passFilter !== 'All'   ||
      state.stateFilter !== 'All'  ||
      state.nightOnly              ||
      state.verticalFilter !== 'any' ||
      state.tempBucket !== 'any'   ||
      state.windBucket !== 'any'   ||
      state.priceRange > 0         ||
      (state.weights.value === 10 || state.weights.value === 5) ||
      state.howFar < 2
    );
    if (filtersTightenEmpty) {
      const driveHint = state.origin && state.howFar < 2
        ? 'If nothing is within day-trip distance, try <strong>Weekend</strong> or <strong>All distances</strong>, or adjust your starting location.'
        : 'Try expanding your distance range, easing the ticket or snow filters, or choosing a different pass.';
      els.verdictCard.innerHTML = `<div class="vcard-placeholder">
        <div class="vcard-placeholder-icon">🔍</div>
        <div class="vcard-placeholder-title">No mountains match your filters</div>
        <div class="vcard-placeholder-sub">${driveHint}</div>
        <button type="button" class="vcard-placeholder-btn" id="verdictEmptyReset">Clear filters &amp; try again</button>
      </div>`;
      document.getElementById('verdictEmptyReset')?.addEventListener('click', () => { document.getElementById('resetFilters')?.click(); });
    } else if (resorts.length > 0) {
      const pool = state.origin ? resorts.filter(r => resortMatchesDriveTier(r.id)) : resorts;
      const anyWx = pool.some(r => state.weatherCache[r.id]?.data);
      if (pool.length === 0) {
        els.verdictCard.innerHTML = `<div class="vcard-placeholder">
          <div class="vcard-placeholder-icon">🚗</div>
          <div class="vcard-placeholder-title">No mountains in this drive window</div>
          <div class="vcard-placeholder-sub">Your list is empty for the selected range. Widen <strong>Drive time</strong> in Your Ski Preferences or pick a different starting point.</div>
        </div>`;
      } else if (!anyWx && !weatherFetchPhase1Done) {
        els.verdictCard.innerHTML = `<div class="vcard-placeholder vcard-placeholder--loading">
          <div class="vcard-placeholder-icon vcard-loading-pulse">⛷</div>
          <div class="vcard-placeholder-title">Loading live forecasts…</div>
          <div class="vcard-placeholder-sub">Hang on — we are pulling snow and weather for mountains near you. Scores and the top pick appear as soon as data arrives.</div>
        </div>`;
      } else if (!anyWx && weatherFetchPhase1Done && weatherFetchPhase2Done) {
        els.verdictCard.innerHTML = `<div class="vcard-placeholder">
          <div class="vcard-placeholder-icon">☁</div>
          <div class="vcard-placeholder-title">Forecast data unavailable</div>
          <div class="vcard-placeholder-sub">We could not load weather from our data provider. Drive times and the mountain list below still work — try refreshing the page in a minute.</div>
        </div>`;
      } else if (!anyWx) {
        els.verdictCard.innerHTML = `<div class="vcard-placeholder vcard-placeholder--loading">
          <div class="vcard-placeholder-icon vcard-loading-pulse">⛷</div>
          <div class="vcard-placeholder-title">Still loading forecasts…</div>
          <div class="vcard-placeholder-sub">Filling in snow totals for more mountains. The compare table may update first for resorts closest to you.</div>
        </div>`;
      } else {
        els.verdictCard.innerHTML = `<div class="vcard-placeholder">
          <div class="vcard-placeholder-icon">⛷</div>
          <div class="vcard-placeholder-title">Almost ready</div>
          <div class="vcard-placeholder-sub">Pick completes as soon as scores finish computing.</div>
        </div>`;
      }
    } else {
      els.verdictCard.innerHTML = `<div class="vcard-placeholder">
        <div class="vcard-placeholder-icon">⛷</div>
        <div class="vcard-placeholder-title">Loading your top pick…</div>
        <div class="vcard-placeholder-sub">Fetching live forecast data for your mountains.</div>
      </div>`;
    }
    return;
  }

  const { tier, headline, detail, subPoints, resort, driveText, breakdown, stormTotal, tomorrowIn } = v;
  const runningItems = collectRunnerUpItems(resorts, resort.id, 3);

  // ── Eyebrow: "BEST MATCH · IKON PASS · BOSTON" (middle dot, screenshot parity)
  const _passEw   = state.passFilter !== 'All' ? (state.passFilter + ' Pass') : null;
  const _cityEw   = state.origin?.label ? state.origin.label.replace(/,.*$/, '').trim() : null;
  const _eyebrowBase = ['Best match', _passEw, _cityEw].filter(Boolean).join(' · ').toUpperCase();
  const _eyebrow     = !state.origin ? `${_eyebrowBase} · ENTER ZIP OR CITY` : _eyebrowBase;
  // ── Short name for Book button ───────────────────────────────────────────────
  const _bookName = resort.name.replace(/\s+(Resort|Mountain|Ski\s+Area|Ski\s+Resort|Ski|Area)$/i, '').trim();

  const tierConfig = {
    great:    { label: 'Great conditions', pillClass: 'vcard-dash-pill--cond-great', dot: '#22c55e' },
    good:     { label: 'Good conditions',  pillClass: 'vcard-dash-pill--cond-good', dot: '#38bdf8' },
    marginal: { label: 'Fair conditions',    pillClass: 'vcard-dash-pill--cond-warn', dot: '#f59e0b' },
    bad:      { label: 'Rough conditions',   pillClass: 'vcard-dash-pill--cond-bad', dot: '#f87171' },
  };
  const tc = tierConfig[tier] || tierConfig.good;

  const scoreNum = breakdown ? Math.round(breakdown.score) : 0;
  const snowPillText = typeof stormTotal === 'number' && stormTotal >= 0.5
    ? `${stormTotal.toFixed(0)}" forecast`
    : (typeof tomorrowIn === 'number' && tomorrowIn >= 0.5)
    ? `${tomorrowIn.toFixed(0)}" forecast`
    : 'Dry forecast';

  const crowdLbl = crowdForecast(resort).label;
  const crowdPill = crowdLbl === 'Light'
    ? '<span class="vcard-dash-pill vcard-dash-pill--crowd-low">Low crowds</span>'
    : crowdLbl === 'Heavy'
    ? '<span class="vcard-dash-pill vcard-dash-pill--crowd-high">Heavy crowds</span>'
    : '<span class="vcard-dash-pill vcard-dash-pill--crowd-mod">Mod. crowds</span>';

  const zipNudgeHtml = !state.origin
    ? `<p class="vcard-zip-nudge">Enter your <strong>ZIP code</strong> or city above, then <strong>Find My Mountain</strong> — <strong>your</strong> best match (with drive time) replaces this placeholder.</p>`
    : '';

  const verdictBdAttr = breakdown?.components ? (() => {
    const c = breakdown.components;
    const bd = JSON.stringify({
      snow:       +c.snow.toFixed(1),
      skiability: +c.skiability.toFixed(1),
      fit:        +c.fit.toFixed(1),
      drive:      +c.drive.toFixed(1),
      value:      +c.value.toFixed(1),
      crowd:      +c.crowd.toFixed(1),
    });
    return `data-bd="${btoa(bd)}"`;
  })() : '';
  const verdictScoreRingClass = verdictBdAttr ? 'vcard-score-ring-dash score-badge--tip' : 'vcard-score-ring-dash';
  const verdictScoreRingExtra = verdictBdAttr ? ` ${verdictBdAttr} tabindex="0"` : '';
  const verdictScoreAria = verdictBdAttr
    ? `aria-label="Score ${scoreNum} — hover or tap for breakdown"`
    : `aria-label="Ski score ${scoreNum} out of 100"`;

  els.verdictCard.innerHTML = `
    <div class="vcard vcard--dash vcard--tier-${tier}">
      <div class="vcard-hero-dash">
        <div class="vcard-hero-dash-top">
          <div class="vcard-hero-dash-left">
            <div class="vcard-eyebrow-dash">${_eyebrow}</div>
            ${zipNudgeHtml}
            <button type="button" class="vcard-name-dash" id="verdictPickBtn">${esc(resort.name)}</button>
          </div>
          <div class="${verdictScoreRingClass}"${verdictScoreRingExtra} ${verdictScoreAria}>
            <span class="vcard-score-ring-num">${scoreNum}</span>
            <span class="vcard-score-ring-lbl">SCORE</span>
          </div>
        </div>
        <div class="vcard-dash-pills">
          <span class="vcard-dash-pill ${tc.pillClass}">${esc(tc.label)}</span>
          <span class="vcard-dash-pill">${esc(snowPillText)}</span>
          ${driveText ? `<span class="vcard-dash-pill">${esc(driveText)} drive</span>` : ''}
          ${crowdPill}
          <span class="vcard-dash-pill">$${resort.price} window</span>
        </div>
      </div>
      <div class="vcard-body vcard-body-dash">
        <div id="verdictWriteupSlot" class="vcard-writeup vcard-writeup--dash vcard-writeup--loading"></div>
        <p class="vcard-fallback-copy" id="verdictFallbackCopy" hidden></p>
        <div id="verdictConditionsSlot" class="verdict-conditions-slot" hidden></div>
        <div class="vcard-actions vcard-actions-dash">
          ${resort.website
            ? `<a class="vcard-book-btn" href="${resort.website}" target="_blank" rel="noopener">Book ${esc(_bookName)} &#x2192;</a>`
            : `<a class="vcard-book-btn" href="${bookingUrl(resort)}" target="_blank" rel="noopener sponsored">Find lodging &#x2192;</a>`
          }
          <button type="button" class="vcard-detail-btn" id="verdictDetailBtn">Full conditions</button>
        </div>
      </div>
    </div>`;

  const _fb = document.getElementById('verdictFallbackCopy');
  if (_fb) {
    _fb.textContent = [headline, detail, ...subPoints].filter(Boolean).join(' ');
    _fb.setAttribute('hidden', '');
  }

  $('verdictPickBtn')?.addEventListener('click', () => { state.selectedId = resort.id; renderDetail({ scroll: true }); });
  $('verdictDetailBtn')?.addEventListener('click', () => { state.selectedId = resort.id; renderDetail({ scroll: true }); });
  injectVerdictWriteup(v);
  injectConditionsBadge(resort.id, 'verdictConditionsSlot');

  // Track Booking.com clicks from verdict chip
  els.verdictCard.querySelectorAll('a[data-track-placement]').forEach(a => {
    a.addEventListener('click', () => {
      trackEvent('booking_click', { placement: a.dataset.trackPlacement, resort: a.dataset.trackResort });
    });
  });

  // ── Runner-up grid (ranked pool — not only brief.top5, which can be a single row) ──
  const _hnSection = document.getElementById('hnRunnerUpSection');
  const _hnGrid    = document.getElementById('hnRunnersGrid');
  const _hnTitle   = document.getElementById('hnRunnersTitle');
  if (_hnSection && _hnGrid) {
    if (_hnTitle) _hnTitle.textContent = _cityEw ? ('Runner-up options near ' + _cityEw) : 'Runner-up options';
    if (runningItems.length === 0) {
      _hnGrid.innerHTML = '';
      _hnSection.hidden = true;
    } else {
      _hnGrid.innerHTML = runningItems.map((item, idx) => {
        const _rDrive = getDriveMins(item.resort.id) ? formatDrive(item.resort.id) : null;
        const _rWx    = state.weatherCache[item.resort.id]?.data;
        const _rSnow  = _rWx ? (_rWx.forecast || []).reduce((s, f) => s + (f.snow || 0), 0) : null;
        const _rScore = item.breakdown != null ? Math.round(item.breakdown.score) : '—';
        const _rSponsor = getSponsor(item.resort.id);
        const _rCls     = 'hn-runner-card' + (_rSponsor ? ' hn-runner-sponsored' : '');
        const _rSnowHtml = _rSnow !== null ? `<span class="hn-rchip hn-rchip-snow">${_rSnow.toFixed(1)}" snow</span>` : '';
        const cf = crowdForecast(item.resort);
        const _rCrowdHtml = cf.label === 'Light'
          ? (cf.score <= 36
            ? '<span class="hn-rchip hn-rchip-crowd">Very quiet</span>'
            : '<span class="hn-rchip hn-rchip-crowd">Low crowds</span>')
          : cf.label === 'Heavy'
          ? '<span class="hn-rchip hn-rchip-warn">Heavy crowds</span>'
          : (cf.label === 'Moderate' || cf.label === 'Light-Moderate')
          ? '<span class="hn-rchip hn-rchip-crowd-mod">Mod. crowds</span>' : '';
        const _rPassCls = item.resort.passGroup === 'Indy' ? 'hn-rchip hn-rchip-pass hn-rchip-pass-indy' : 'hn-rchip hn-rchip-pass';
        const _rPassHtml = `<span class="${_rPassCls}">${esc(item.resort.passGroup)}</span>`;
        const _rBookHtml = _rSponsor ? `<a class="hn-runner-book" href="${esc(_rSponsor.bookingUrl)}" target="_blank" rel="noopener" onclick="event.stopPropagation()">Book Now</a>` : '';
        const _rSponsorBadge = _rSponsor ? '<span class="hn-runner-sponsor">Featured</span>' : '';
        return `<div class="${_rCls}" data-runner-id="${esc(item.resort.id)}">
          <div class="hn-runner-rank">#${idx + 2} ${_rSponsorBadge}</div>
          <div class="hn-runner-name">${esc(item.resort.name)}</div>
          <div class="hn-runner-chips">${_rSnowHtml}${_rCrowdHtml}${_rPassHtml}</div>
          <div class="hn-runner-bottom">
            <div><div class="hn-runner-score">${_rScore}</div>${_rDrive ? `<div class="hn-runner-drive">${esc(_rDrive)}</div>` : ''}</div>
            ${_rBookHtml}
          </div>
        </div>`;
      }).join('');
      _hnGrid.querySelectorAll('[data-runner-id]').forEach(card => {
        card.addEventListener('click', () => { state.selectedId = card.dataset.runnerId; renderDetail({ scroll: true }); });
      });
      _hnSection.hidden = false;
    }
  }
}

// ─── AI verdict write-up ───────────────────────────────────────────────────────
function buildWriteupPrompt(v, origin) {
  const { resort, breakdown, tomorrowIn, stormTotal, histTotal, driveText, tier } = v;
  const originStr  = origin?.label ? `from ${origin.label}` : '';
  const driveStr   = driveText ? `${driveText} away` : 'distance unknown';
  const histStr    = histTotal !== null ? `${histTotal}" of snow in the last 7 days` : null;
  const wx         = state.weatherCache[resort.id]?.data;
  const tomorrow   = tomorrowForecast(wx);
  const weatherStr = tomorrow ? `tomorrow low ${tomorrow.lo}°F, high ${tomorrow.hi}°F, wind ${tomorrow.wind || 0} mph` : null;
  const facts = [
    `${tomorrowIn.toFixed(1)}" forecast tomorrow, ${stormTotal.toFixed(1)}" over 3 days`,
    weatherStr, driveText ? driveStr : null, histStr,
    resort.vertical ? `${resort.vertical.toLocaleString()}ft vertical` : null,
    resort.passGroup !== 'Independent' ? `${resort.passGroup} pass access` : null,
  ].filter(Boolean).join('; ');
  return `You are a ski trip advisor. In 1–2 natural, confident sentences explain why ${resort.name} in ${resort.state} is the top pick for this ski day${originStr ? ' for someone ' + originStr : ''}. Base it only on these facts: ${facts}. Ski score is ${breakdown.baseScore}/100. Verdict tier: ${tier}. Write like a knowledgeable friend — no filler phrases like "Looking at the data". Do not mention the score number.`;
}

async function fetchVerdictWriteup(v, origin) {
  const key = `${v.resort.id}:${v.tier}`;
  if (verdictWriteupCache.has(key)) return verdictWriteupCache.get(key);
  verdictWriteupCache.set(key, null);
  try {
    const res = await fetch('/api/recommend', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ _writeup: true, prompt: buildWriteupPrompt(v, origin) }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const text = data.writeup || data.reply || data.text || null;
    if (text) { verdictWriteupCache.set(key, text); return text; }
  } catch (err) {
    verdictWriteupCache.set(key, '__failed__');
    setTimeout(() => { if (verdictWriteupCache.get(key) === '__failed__') verdictWriteupCache.delete(key); }, 30_000);
  }
  return null;
}

async function injectVerdictWriteup(v) {
  const slot   = document.getElementById('verdictWriteupSlot');
  const fb     = document.getElementById('verdictFallbackCopy');
  if (!slot) return;
  const cached = verdictWriteupCache.get(`${v.resort.id}:${v.tier}`);
  if (cached && cached !== '__failed__') {
    slot.textContent = cached;
    slot.classList.remove('vcard-writeup--loading');
    if (fb) fb.setAttribute('hidden', '');
    return;
  }
  slot.textContent = '';
  slot.classList.add('vcard-writeup--loading');
  if (fb) fb.setAttribute('hidden', '');
  const text = await fetchVerdictWriteup(v, state.origin);
  const liveSlot = document.getElementById('verdictWriteupSlot');
  if (!liveSlot) return;
  liveSlot.classList.remove('vcard-writeup--loading');
  if (text) {
    liveSlot.textContent = text;
    liveSlot.classList.remove('vcard-writeup--fallback');
    if (fb) fb.setAttribute('hidden', '');
  } else {
    liveSlot.textContent = 'Tip: Everything above still uses live snow and drive data. This extra blurb could not be loaded right now.';
    liveSlot.classList.add('vcard-writeup--fallback');
    if (fb) fb.removeAttribute('hidden');
  }
}

// ─── Summary cards ────────────────────────────────────────────────────────────
function renderSummaryCards(resorts) {
  els.summaryCards.innerHTML = [
    dbStatHtml('Mountains',   resorts.length,                                           'in the database'),
    dbStatHtml('Epic',        resorts.filter(r => r.passGroup === 'Epic').length,        'resorts'),
    dbStatHtml('Ikon',        resorts.filter(r => r.passGroup === 'Ikon').length,        'resorts'),
    dbStatHtml('Indy',        resorts.filter(r => r.passGroup === 'Indy').length,        'resorts'),
    dbStatHtml('Independent', resorts.filter(r => r.passGroup === 'Independent').length, 'resorts'),
  ].join('');
}
function dbStatHtml(label, value, sub) {
  return `<div class="db-stat"><div class="db-stat-value">${value}</div><div class="db-stat-label">${label}</div>${sub ? `<div class="db-stat-sub">${sub}</div>` : ''}</div>`;
}
function cardBreakdown(b) {
  const c = b.components;
  return `<div class="breakdown">
    <div>Snow quality: <strong>${c.snow.toFixed(1)}</strong></div>
    <div>Skiability: <strong>${c.skiability.toFixed(1)}</strong></div>
    <div>Mountain fit: <strong>${c.fit.toFixed(1)}</strong></div>
    <div>Drive: <strong>${c.drive.toFixed(1)}</strong></div>
    <div>Value: <strong>${c.value.toFixed(1)}</strong></div>
    <div>Crowd outlook: <strong>${c.crowd.toFixed(1)}</strong></div>
  </div>`;
}

// ─── Storm / Hidden gems cards → full conditions (per-card listeners; same pattern as runner-up cards) ──
function bindFeaturePanelResortCards(grid, source) {
  if (!grid) return;
  grid.querySelectorAll('.planner-card--clickable[data-resort-id]').forEach(card => {
    const openDetail = () => {
      const id = card.getAttribute('data-resort-id');
      // #region agent log
      fetch('http://127.0.0.1:7579/ingest/dc49ef5b-6ec4-43ba-8411-0c7c0a9a14ba',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'74ce02'},body:JSON.stringify({sessionId:'74ce02',runId:'post-fix-v2',hypothesisId:'F',location:'sd-app.js:bindFeaturePanelResortCards',message:'openDetail',data:{id:String(id||''),source:String(source)},timestamp:Date.now()})}).catch(()=>{});
      // #endregion
      if (!id) return;
      state.selectedId = id;
      const _r = RESORTS.find(r => r.id === state.selectedId);
      if (_r) trackEvent('mountain_viewed', { mountain_name: _r.name, mountain_state: _r.state, source });
      renderDetail({ scroll: true });
      // #region agent log
      fetch('http://127.0.0.1:7579/ingest/dc49ef5b-6ec4-43ba-8411-0c7c0a9a14ba',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'74ce02'},body:JSON.stringify({sessionId:'74ce02',runId:'post-fix-v2',hypothesisId:'D',location:'sd-app.js:bindFeaturePanelResortCards:postRender',message:'detail visible',data:{detailVisible:!els.detailSection.classList.contains('hidden')},timestamp:Date.now()})}).catch(()=>{});
      // #endregion
    };
    card.addEventListener('click', e => {
      if (e.target.closest('a')) return;
      openDetail();
    });
    card.addEventListener('keydown', e => {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      e.preventDefault();
      openDetail();
    });
  });
}

// ─── Storm section ────────────────────────────────────────────────────────────
function _renderStorm(resorts) {
  if (!els.stormGrid) return;
  const enriched = resorts
    .map(r => { const wx = state.weatherCache[r.id]?.data; const storm = (wx?.forecast || []).reduce((s, f) => s + (f.snow || 0), 0); return { resort: r, wx, storm }; })
    .filter(item => item.wx)
    .sort((a, b) => b.storm - a.storm)
    .slice(0, 4);
  if (!enriched.length) {
    if (!weatherFetchPhase1Done) {
      els.stormGrid.innerHTML = '<div class="planner-card storm-card--loading"><span class="storm-loading-dot"></span> Loading storm outlook…</div>';
    } else if (weatherFetchPhase2Done) {
      els.stormGrid.innerHTML = '<div class="planner-card storm-card--muted">Storm totals will show when forecast data is available. Drive and resort details below still work.</div>';
    } else {
      els.stormGrid.innerHTML = '<div class="planner-card storm-card--loading"><span class="storm-loading-dot"></span> Loading more mountains…</div>';
    }
    return;
  }
  els.stormGrid.innerHTML = enriched.map((item, i) => {
    const days = (item.wx.forecast || []).map(f => `<span class="metric-chip">${f.day}: ${f.snow.toFixed(1)}"</span>`).join('');
    const id = item.resort.id;
    const nm = esc(item.resort.name);
    // #region agent log
    if (i === 0) fetch('http://127.0.0.1:7579/ingest/dc49ef5b-6ec4-43ba-8411-0c7c0a9a14ba',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'74ce02'},body:JSON.stringify({sessionId:'74ce02',runId:'post-fix',hypothesisId:'C',location:'sd-app.js:_renderStorm',message:'storm card id raw vs esc',data:{rawId:String(item.resort.id),attrId:String(id),matchDom:true},timestamp:Date.now()})}).catch(()=>{});
    // #endregion
    return `<div class="planner-card planner-card--clickable ${i === 0 ? 'top' : ''}" data-resort-id="${id}" role="button" tabindex="0" aria-label="Full conditions for ${nm}">
      <div class="planner-title">${nm}</div>
      <div class="planner-meta">${esc(item.resort.state)} · ${esc(item.resort.passGroup)} · <strong>${item.storm.toFixed(1)}"</strong> over 3 days</div>
      ${days}<div class="metric-chip">${formatDrive(item.resort.id)}</div>
    </div>`;
  }).join('');
  bindFeaturePanelResortCards(els.stormGrid, 'storm_chaser');
}

// ─── Hidden Gems — improved human-readable reasons ─────────────────────────
function renderHiddenGems(resorts) {
  if (!els.hiddenGemGrid) return;
  if (!resorts.length) {
    els.hiddenGemGrid.innerHTML = '<div class="planner-card hidden-gems-empty" role="status">No picks here yet — widen your filters to see hidden gems.</div>';
    return;
  }
  const withScore = resorts.map(r => ({ r, score: hiddenGemScore(r) }));
  withScore.sort((a, b) => b.score - a.score);
  const top = withScore.slice(0, 3);
  els.hiddenGemGrid.innerHTML = top.map(({ r }) => {
    const crowd    = crowdForecast(r);
    const drive    = formatDrive(r.id);
    const reasons  = [
      `${crowd.label} crowds`,
      `$${r.price} ticket`,
      `${r.vertical.toLocaleString()} ft vertical`,
      r.avgSnowfall > 150 ? `${r.avgSnowfall}" avg snowfall` : null,
      drive !== '—' ? drive : null,
    ].filter(Boolean).slice(0, 4);
    const rid = r.id;
    const rnm = esc(r.name);
    return `<div class="planner-card planner-card--clickable" data-resort-id="${rid}" role="button" tabindex="0" aria-label="Full conditions for ${rnm}">
      <div class="planner-title">${rnm}</div>
      <div class="planner-meta">${esc(r.state)} · ${esc(r.passGroup)}</div>
      <div class="gem-reasons">${reasons.map(re => `<span class="metric-chip">${esc(re)}</span>`).join('')}</div>
    </div>`;
  }).join('');
  bindFeaturePanelResortCards(els.hiddenGemGrid, 'hidden_gems');
}

// ─── Compare table — with empty state ─────────────────────────────────────────
function renderCompareTable(resorts) {
  const qRaw = (state.tableSearch || '').trim();
  const q = qRaw.toLowerCase();
  const w = normalizedWeights();

  // No location + sorting by planner score = sort by avgSnowfall so table feels alive
  const noOriginDefault = !state.origin && state.sortBy === 'planner' && !q;

  const decorated = resorts
    .filter(resort => !q || `${resort.name} ${resort.state} ${resort.passGroup}`.toLowerCase().includes(q))
    .map(resort => {
      const wx         = state.weatherCache[resort.id]?.data;
      const breakdown  = wx ? plannerScoreBreakdown(resort, wx, 0, w) : null;
      const stormTotal = wx ? (wx.forecast || []).reduce((sum, f) => sum + (f.snow || 0), 0) : null;
      const hist       = historyCache.get(resort.id) || null;
      return { resort, breakdown, stormTotal, hist };
    });

  const dir = tableSort.dir === 'asc' ? 1 : -1;
  if (noOriginDefault) {
    decorated.sort((a, b) => b.resort.avgSnowfall - a.resort.avgSnowfall);
  } else if (state.sortBy === 'planner') {
    decorated.sort((a, b) => dir * ((a.breakdown?.score ?? -Infinity) - (b.breakdown?.score ?? -Infinity)));
  } else if (state.sortBy === 'storm') {
    decorated.sort((a, b) => dir * ((a.stormTotal ?? -1) - (b.stormTotal ?? -1)));
  } else if (state.sortBy === 'hist7day') {
    decorated.sort((a, b) => dir * ((a.hist?.total ?? -1) - (b.hist?.total ?? -1)));
  } else {
    const order = new Map(staticSort(resorts).map((r, i) => [r.id, i]));
    decorated.sort((a, b) => (order.get(a.resort.id) ?? 9999) - (order.get(b.resort.id) ?? 9999));
  }

  const showAll   = state.tableViewAll || q;
  const displayed = showAll ? decorated : decorated.slice(0, 10);
  const total     = resorts.length;

  if (q) {
    els.resultCount.textContent = `${displayed.length} result${displayed.length !== 1 ? 's' : ''} for "${qRaw}"`;
  } else if (noOriginDefault) {
    els.resultCount.textContent = `${total} mountains — sorted by avg snowfall`;
  } else {
    els.resultCount.textContent = state.tableViewAll ? `All ${total} mountains` : `Top 10 of ${total} mountains`;
  }
  if (els.tableViewAllBtn) {
    els.tableViewAllBtn.textContent = (state.tableViewAll && !q) ? 'Show Top 10' : `View All ${total}`;
    els.tableViewAllBtn.style.display = q ? 'none' : '';
  }

  document.querySelectorAll('.sortable-th').forEach(th => {
    const ind = th.querySelector('.sort-indicator');
    if (!ind) return;
    if (th.dataset.sort === state.sortBy) {
      ind.textContent = tableSort.dir === 'asc' ? ' ▲' : ' ▼';
      th.classList.add('sort-active');
    } else {
      ind.textContent = '';
      th.classList.remove('sort-active');
    }
  });

  // FILTERING FIX: empty state when no mountains match
  if (displayed.length === 0) {
    const qActive = !!q;
    const title = qActive
      ? `No mountains match “${esc(qRaw)}”`
      : (resorts.length === 0 ? 'No mountains match your current filters' : 'No rows to show');
    const sub = qActive
      ? 'Try a shorter search, check spelling, or clear the search box. Filters still apply to what you see.'
      : 'Try widening distance, easing snow or price limits, or pick another pass.';
    els.resultCount.textContent = qActive ? `0 results for “${qRaw}”` : (resorts.length === 0 ? '0 mountains' : '0 in this view');
    els.comparisonBody.innerHTML = `
      <tr><td colspan="13" class="compare-empty-state">
        <div class="ces-icon">🎿</div>
        <div class="ces-title">${title}</div>
        <div class="ces-sub">${sub}
          <button type="button" class="ces-reset-link" id="emptyStateReset">${qActive ? 'Clear search' : 'Clear all filters'}</button>
        </div>
      </td></tr>`;
    document.getElementById('emptyStateReset')?.addEventListener('click', () => {
      if (qActive && els.tableSearch) {
        els.tableSearch.value = '';
        state.tableSearch = '';
        renderCompareTable(filteredResorts());
      } else {
        document.getElementById('resetFilters')?.click();
      }
    });
    renderMobileCards([], { mode: 'empty', qActive, resortsLen: resorts.length });
    return;
  }

  els.comparisonBody.innerHTML = (noOriginDefault ? `
    <tr class="table-location-nudge">
      <td colspan="13">
        <div class="tln-inner">
          <span class="tln-icon">📍</span>
          <span class="tln-text">Enter your starting location above to rank by live snow forecast, drive time, and your preferences.</span>
          <button class="tln-btn" onclick="document.getElementById('originInput')?.focus();document.querySelector('.hero-search')?.scrollIntoView({behavior:'smooth',block:'start'})">Set location →</button>
        </div>
      </td>
    </tr>` : '') + displayed.map(({ resort, breakdown, stormTotal, hist }) => {
    const rawScore = breakdown ? breakdown.score : null;
    const planner  = rawScore !== null ? Math.round(rawScore) : '—';
    const scoreCls = scoreBadgeClass(rawScore);
    const storm    = stormTotal !== null ? `${stormTotal.toFixed(1)}"` : '…';
    const histCell = hist !== null && hist !== undefined ? `${hist.total}"` : '…';
    const crowd    = crowdForecast(resort).label;

    const bdAttr = breakdown ? (() => {
      const c = breakdown.components;
      const bd = JSON.stringify({
        snow:       +c.snow.toFixed(1),
        skiability: +c.skiability.toFixed(1),
        fit:        +c.fit.toFixed(1),
        drive:      +c.drive.toFixed(1),
        value:      +c.value.toFixed(1),
        crowd:      +c.crowd.toFixed(1),
      });
      return `data-bd="${btoa(bd)}"`;
    })() : '';

    const _sp = getSponsor(resort.id);
    return `
      <tr class="${resort.id === state.selectedId ? 'active-row' : ''}${_sp ? ' sponsored-row' : ''}" data-id="${resort.id}">
        <td><input type="checkbox" data-compare="${resort.id}" ${state.compareSet.has(resort.id) ? 'checked' : ''} /></td>
        <td><div class="row-name">${esc(resort.name)}</div></td>
        <td>${esc(resort.state)}</td>
        <td>${esc(resort.passGroup)}</td>
        <td><span class="score-badge ${scoreCls} score-badge--tip" ${bdAttr} tabindex="0" aria-label="Score ${planner} — hover for breakdown">${planner}</span></td>
        <td>${storm}</td>
        <td class="hist-cell">${histCell}</td>
        <td>${formatDrive(resort.id)}</td>
        <td>${resort.vertical}</td>
        <td>${resort.trails}</td>
        <td>$${resort.price}</td>
        <td class="${crowdClass(crowd)}">${crowd}</td>
        <td><a class="table-lodging-link" href="${bookingUrl(resort)}" target="_blank" rel="noopener sponsored" data-track-placement="table_row" data-track-resort="${esc(resort.name)}">Stay →</a></td>
      </tr>`;
  }).join('');

  renderMobileCards(displayed);

  // Track Booking.com clicks from table rows
  els.comparisonBody.querySelectorAll('a[data-track-placement="table_row"]').forEach(a => {
    a.addEventListener('click', () => {
      trackEvent('booking_click', { placement: 'table_row', resort: a.dataset.trackResort });
    });
  });
}

function renderCompareTray() {
  if (!state.compareSet.size) { els.compareTray.classList.add('hidden'); return; }
  els.compareTray.classList.remove('hidden');
  els.comparePills.innerHTML = [...state.compareSet].map(id => {
    const resort = RESORTS.find(r => r.id === id);
    return `<span class="compare-pill">${esc(resort?.name || id)}<button data-remove="${id}">×</button></span>`;
  }).join('');
}

function renderComparePanel() {
  const resorts = [...state.compareSet].map(id => RESORTS.find(r => r.id === id)).filter(Boolean);
  if (resorts.length < 2) { showToast('Select at least 2 mountains to compare'); return; }
  els.comparePanel.classList.remove('hidden');
  const w    = normalizedWeights();
  const rows = [
    ['Pass',         r => esc(r.passGroup)],
    ['Vertical',     r => `${r.vertical} ft`],
    ['Trails',       r => r.trails],
    ['Avg snowfall', r => `${r.avgSnowfall}"`],
    ['Day ticket*',  r => `$${r.price}`],
    ['Drive',        r => formatDrive(r.id)],
    ['Ski Score',    r => { const wx = state.weatherCache[r.id]?.data; if (!wx) return '—'; return Math.round(plannerScoreBreakdown(r, wx, 0, w).baseScore); }],
    ['Crowd',        r => crowdForecast(r).label],
    ['Base/summit',  r => `${r.baseElevation} / ${r.summitElevation} ft`],
  ];
  els.compareContent.innerHTML = `
    <div id="compareAiBox" class="compare-ai-box">
      <div class="ai-thinking">Loading AI recommendation…</div>
    </div>
    <div class="table-wrap">
      <table class="comparison-table">
        <thead><tr><th scope="col">Metric</th>${resorts.map(r => `<th scope="col">${esc(r.name)}</th>`).join('')}</tr></thead>
        <tbody>${rows.map(([label, fn]) =>
          `<tr><td><strong>${label}</strong></td>${resorts.map(r => `<td>${fn(r)}</td>`).join('')}</tr>`
        ).join('')}</tbody>
      </table>
    </div>`;

  // SECURITY FIX: Escape AI text before inserting into DOM
  const aiBox = document.getElementById('compareAiBox');
  if (aiBox) {
    aiBox.innerHTML = '<div class="ai-thinking">Analyzing your mountains…</div>';
    const payload = resorts.map(r => ({
      name: r.name, state: r.state, vertical: r.vertical, trails: r.trails,
      price: r.price, avgSnowfall: r.avgSnowfall, crowds: crowdForecast(r).label,
      drive: getDriveMins(r.id), passGroup: r.passGroup,
      plannerScore: (() => { const wx = state.weatherCache[r.id]?.data; return wx ? Math.round(plannerScoreBreakdown(r, wx, 0, w).score) : null; })(),
    }));
    fetch('/api/recommend', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ resorts: payload }) })
      .then(r => r.json())
      .then(data => {
        if (data.error) throw new Error(data.error);
        // SECURITY FIX: esc() all text before inserting — no raw HTML from API
        const safeText = esc(data.recommendation || 'No recommendation returned.');
        aiBox.innerHTML = `<div class="ai-verdict-inner"><div class="ai-verdict-text">${safeText.replace(/\n/g, '<br>')}</div></div>`;
      })
      .catch(err => {
        aiBox.innerHTML = `<div class="ai-thinking muted">AI recommendation unavailable — ${esc(err.message)}</div>`;
      });
  }
  els.comparePanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function renderDetail({ scroll = false } = {}) {
  const resort = RESORTS.find(r => r.id === state.selectedId);
  if (!resort) {
    // #region agent log
    fetch('http://127.0.0.1:7579/ingest/dc49ef5b-6ec4-43ba-8411-0c7c0a9a14ba',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'74ce02'},body:JSON.stringify({sessionId:'74ce02',runId:'pre-fix',hypothesisId:'D',location:'sd-app.js:renderDetail',message:'no resort for selectedId',data:{selectedId:String(state.selectedId)},timestamp:Date.now()})}).catch(()=>{});
    // #endregion
    els.detailSection.classList.add('hidden');
    return;
  }
  els.detailSection.classList.remove('hidden');

  const wx    = state.weatherCache[resort.id]?.data;
  const w    = normalizedWeights();
  const bd   = wx ? plannerScoreBreakdown(resort, wx, 0, w) : null;
  const vd   = (wx && bd) ? verdictFromBreakdown(resort, wx, bd) : null;
  // Build skis-shaped object so all downstream rendering stays the same
  const skis = bd ? {
    ...bd,
    skiScore: Math.round(bd.score),
    factors: {
      snow:       Math.round(bd.components.snow),
      skiability: Math.round(bd.components.skiability),
      fit:        Math.round(bd.components.fit),
      drive:      Math.round(bd.components.drive),
      value:      Math.round(bd.components.value),
      crowd:      Math.round(bd.components.crowd),
    },
  } : null;
  const crowd = crowdForecast(resort);
  const tb    = resort.terrainBreakdown;

  const forecast = wx?.forecast || [];
  const stormTotal = forecast.reduce((s, f) => s + (f.snow || 0), 0);
  const bestDay = forecast.length ? forecast.reduce((best, day) => (day.snow > best.snow ? day : best), forecast[0]) : null;
  const hist  = historyCache.get(resort.id);

  const factorEntries = skis ? [
    ['Snow Quality', skis.factors.snow, skis.factors.snow >= 18 ? 'Strong' : skis.factors.snow >= 12 ? 'Solid' : 'Mixed'],
    ['Skiability', skis.factors.skiability, skis.factors.skiability >= 22 ? 'High' : skis.factors.skiability >= 16 ? 'Good' : 'Limited'],
    ['Mountain Fit', skis.factors.fit, skis.factors.fit >= 18 ? 'Good fit' : skis.factors.fit >= 12 ? 'Balanced' : 'Niche'],
    ['Drive', skis.factors.drive, skis.factors.drive >= 14 ? 'Easy' : skis.factors.drive >= 8 ? 'Manageable' : 'Longer'],
    ['Value', skis.factors.value, skis.factors.value >= 14 ? 'Strong' : skis.factors.value >= 8 ? 'Fair' : 'Premium'],
    ['Crowds', skis.factors.crowd, skis.factors.crowd >= 14 ? 'Favorable' : skis.factors.crowd >= 8 ? 'Moderate' : 'Busy'],
  ] : [];

  const factorGridHtml = skis ? `
    <div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;margin-top:12px;align-content:start;">
      ${factorEntries.map(([label, val, note]) => `
        <div style="padding:12px 13px;border:1px solid var(--border);border-radius:14px;background:#fff;min-height:78px;display:flex;flex-direction:column;justify-content:space-between;">
          <div style="font-size:12px;font-weight:700;color:var(--text);line-height:1.25">${label}</div>
          <div style="display:flex;align-items:flex-end;justify-content:space-between;gap:10px;margin-top:10px">
            <span style="font-size:13px;color:var(--muted)">${note}</span>
            <strong style="font-size:22px;line-height:1;color:var(--text)">${val}</strong>
          </div>
        </div>`).join('')}
    </div>
    <div style="margin-top:12px;padding-top:12px;border-top:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;">
      <span style="font-size:14px;font-weight:700;color:var(--text)">Total Score</span>
      <span style="font-size:30px;font-weight:800;line-height:1;color:var(--text)">${skis.skiScore}</span>
    </div>` : '<div class="muted small" style="margin-top:12px">Weather loading…</div>';

  const snowRowsHtml = wx ? `
    <div style="display:grid;gap:8px;margin-top:12px;">
      ${forecast.map(f => `
        <div style="display:grid;grid-template-columns:48px 72px 1fr auto;align-items:center;gap:12px;padding:10px 12px;border:1px solid var(--border);border-radius:14px;background:${bestDay && f.day === bestDay.day ? 'rgba(43,109,233,.06)' : '#fff'};">
          <div style="font-size:14px;font-weight:700;color:var(--text)">${f.day}</div>
          <div style="font-size:24px;font-weight:800;line-height:1;color:${f.snow >= 1 ? 'var(--accent)' : 'var(--text)'}">${f.snow.toFixed(1)}<span style="font-size:16px">\"</span></div>
          <div style="font-size:13px;color:var(--muted)">${f.lo}° – ${f.hi}°F · ${f.wind || 0} mph</div>
          <div style="font-size:11px;font-weight:700;letter-spacing:.05em;text-transform:uppercase;color:${bestDay && f.day === bestDay.day ? 'var(--accent)' : 'var(--muted)'}">${bestDay && f.day === bestDay.day && f.snow > 0 ? 'Best Day' : ''}</div>
        </div>`).join('')}
    </div>` : '<div class="muted small" style="margin-top:12px">Weather loading…</div>';

  const reportSlug = resort.id;
  const sponsor = getSponsor(resort.id);
  const detailBdAttr = skis ? (() => {
    const f = skis.factors;
    const bd = JSON.stringify({
      snow:       +f.snow.toFixed(1),
      skiability: +f.skiability.toFixed(1),
      fit:        +f.fit.toFixed(1),
      drive:      +f.drive.toFixed(1),
      value:      +f.value.toFixed(1),
      crowd:      +f.crowd.toFixed(1),
    });
    return `data-bd="${btoa(bd)}"`;
  })() : '';

  els.detailCard.innerHTML = `
<div class="detail-card-inner">

<div class="detail-header-rebuilt" style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;align-items:stretch">

  <div class="detail-top-card" style="background:linear-gradient(135deg, rgba(43,109,233,.10), rgba(43,109,233,.18));border:1px solid rgba(43,109,233,.22);border-radius:18px;padding:18px;box-shadow:var(--shadow-sm);display:flex;flex-direction:column;justify-content:space-between;min-height:210px">
    <div>
      <div style="display:flex;align-items:center;justify-content:space-between;gap:10px">
        <div style="font-size:11px;font-weight:700;letter-spacing:.08em;color:var(--accent);text-transform:uppercase">Selected Mountain</div>
        ${sponsor ? `<div class="featured-pill">Featured Partner</div>` : ``}
      </div>
      <div style="font-size:28px;font-weight:800;line-height:1.06;letter-spacing:-.03em;color:var(--text);margin-top:10px">${esc(resort.name)}</div>
      <div style="font-size:13px;color:var(--muted);margin-top:8px">${esc(resort.state)} · ${esc(resort.passGroup)}</div>
      ${sponsor?.tagline ? `<div style="font-size:14px;line-height:1.55;color:var(--accent);font-weight:600;margin-top:12px">${esc(sponsor.tagline)}</div>` : ``}
      <div style="font-size:13px;line-height:1.65;color:var(--muted);margin-top:12px">
        ${wx ? `Forecast-driven pick with terrain, price, and crowds taken into account for this mountain.` : `Mountain details are loading — weather and score will fill in as live data arrives.`}
      </div>
    </div>
    <div class="dhr-actions" style="margin-top:14px;flex-wrap:wrap;gap:8px">
      <a class="dhr-btn-primary" href="/ski-report/${esc(reportSlug)}/">See Full Report →</a>
      ${sponsor ? `<a class="btn-book" href="${esc(sponsor.bookingUrl)}" target="_blank" rel="noopener noreferrer">Book Now →</a>` : ``}
      ${resort.website ? `<a class="dhr-link-secondary" href="${esc(resort.website)}" target="_blank" rel="noopener noreferrer">Visit Website ↗</a>` : ``}
    </div>
  </div>

  <div class="detail-top-card" style="background:var(--panel-2);border:1px solid var(--border);border-radius:18px;padding:18px;box-shadow:var(--shadow-sm);display:flex;flex-direction:column;justify-content:space-between;min-height:210px">
    <div>
      <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:12px">
        <div>
          <div style="font-size:11px;font-weight:700;letter-spacing:.08em;color:var(--accent);text-transform:uppercase">Recommendation</div>
          <div style="font-size:24px;font-weight:800;color:var(--text);margin-top:10px;line-height:1.08">${vd ? vd.label : skis ? 'Loading…' : 'Loading Score'}</div>
        </div>
        ${skis ? `
          <div class="detail-score-ring-new ${vd ? (vd.tier === 'marginal' ? 'ring-mid' : vd.tier === 'bad' ? 'ring-low' : '') : (skis.skiScore >= 70 ? '' : skis.skiScore >= 45 ? 'ring-mid' : 'ring-low')} score-badge--tip" ${detailBdAttr} tabindex="0" aria-label="Score ${skis.skiScore} — hover for breakdown">
            <div class="dsrn-num">${skis.skiScore}</div>
            <div class="dsrn-lbl">Ski Score</div>
          </div>` : ''}
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:14px;">
        <div style="padding:11px 12px;border-radius:14px;background:#fff;border:1px solid var(--border)">
          <div style="font-size:11px;letter-spacing:.06em;text-transform:uppercase;color:var(--muted)">Crowds</div>
          <div style="font-size:15px;font-weight:700;color:var(--text);margin-top:6px">${esc(crowd.label)}</div>
        </div>
        <div style="padding:11px 12px;border-radius:14px;background:#fff;border:1px solid var(--border)">
          <div style="font-size:11px;letter-spacing:.06em;text-transform:uppercase;color:var(--muted)">3-Day Snow</div>
          <div style="font-size:15px;font-weight:700;color:var(--text);margin-top:6px">${wx ? `${stormTotal.toFixed(1)}"` : '—'}</div>
        </div>
      </div>
    </div>

    <div style="font-size:12px;color:var(--muted);margin-top:14px;padding-top:14px;border-top:1px solid rgba(27,42,58,.08)">
      <div style="font-weight:700;margin-bottom:8px;color:var(--text)">Why this scores for you</div>
      ${(wx && bd) ? preferenceReasons(resort, wx, bd).map(r => `<div style="margin-top:6px">• ${esc(r)}</div>`).join('') : '<div>• Conditions are still loading.</div>'}
      ${vd?.detail ? `<div style="margin-top:10px;padding-top:10px;border-top:1px solid rgba(27,42,58,.06);font-size:11px;color:var(--muted);line-height:1.6">${esc(vd.detail)}</div>` : ''}
    </div>
  </div>

  <div class="detail-top-card" style="background:var(--panel);border:1px solid var(--border);border-radius:18px;padding:18px;box-shadow:var(--shadow-sm);display:flex;flex-direction:column;min-height:210px">
    <div style="font-size:11px;font-weight:700;letter-spacing:.08em;color:var(--accent);text-transform:uppercase">Mountain Stats</div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px 16px;margin-top:14px;flex:1">
      <div>
        <div style="font-size:24px;font-weight:800;line-height:1;color:var(--text)">${resort.vertical.toLocaleString()} ft</div>
        <div style="font-size:11px;letter-spacing:.06em;text-transform:uppercase;color:var(--muted);margin-top:6px">Vertical</div>
      </div>
      <div>
        <div style="font-size:24px;font-weight:800;line-height:1;color:var(--text)">${resort.trails}</div>
        <div style="font-size:11px;letter-spacing:.06em;text-transform:uppercase;color:var(--muted);margin-top:6px">Trails</div>
      </div>
      <div>
        <div style="font-size:24px;font-weight:800;line-height:1;color:var(--text)">${resort.avgSnowfall}"</div>
        <div style="font-size:11px;letter-spacing:.06em;text-transform:uppercase;color:var(--muted);margin-top:6px">Avg Snowfall</div>
      </div>
      <div>
        <div style="font-size:24px;font-weight:800;line-height:1;color:var(--text)">$${resort.price}</div>
        <div style="font-size:11px;letter-spacing:.06em;text-transform:uppercase;color:var(--muted);margin-top:6px">Day Ticket*</div>
      </div>
      <div>
        <div style="font-size:24px;font-weight:800;line-height:1;color:var(--text)">${formatDrive(resort.id)}</div>
        <div style="font-size:11px;letter-spacing:.06em;text-transform:uppercase;color:var(--muted);margin-top:6px">Drive</div>
      </div>
      <div>
        <div style="font-size:18px;font-weight:800;line-height:1.15;color:var(--text)">${resort.baseElevation.toLocaleString()} / ${resort.summitElevation.toLocaleString()}</div>
        <div style="font-size:11px;letter-spacing:.06em;text-transform:uppercase;color:var(--muted);margin-top:6px">Base / Summit</div>
      </div>
    </div>
    <div id="detailConditionsSlot" hidden style="margin-top:12px;padding-top:12px;border-top:1px solid var(--border)"></div>
  </div>

</div>

  <div class="detail-grid-new" style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;align-items:stretch;grid-auto-rows:minmax(320px, auto)">

    <div class="sub-card-new" style="display:flex;flex-direction:column;padding:16px;border:1px solid var(--border);border-radius:18px;background:var(--panel);box-shadow:var(--shadow-sm);min-height:320px;">
      <h3 class="sub-card-title-new" style="margin:0 0 12px;font-size:12px;font-weight:700;letter-spacing:.08em;color:var(--accent);text-transform:uppercase">Terrain Mix</h3>
      <div style="display:grid;gap:10px;">
        <div class="bar-row" style="display:grid;grid-template-columns:88px 1fr 40px;align-items:center;gap:10px"><div style="font-size:14px;color:var(--text)">Beginner</div><div class="bar" style="height:8px;background:#e7eef7;border-radius:999px;overflow:hidden"><div class="bar-fill" style="width:${tb.beginner * 100}%;height:100%;background:linear-gradient(90deg,#2b6de9,#22b38a)"></div></div><div style="font-size:14px;color:var(--text);text-align:right">${Math.round(tb.beginner * 100)}%</div></div>
        <div class="bar-row" style="display:grid;grid-template-columns:88px 1fr 40px;align-items:center;gap:10px"><div style="font-size:14px;color:var(--text)">Intermediate</div><div class="bar" style="height:8px;background:#e7eef7;border-radius:999px;overflow:hidden"><div class="bar-fill" style="width:${tb.intermediate * 100}%;height:100%;background:linear-gradient(90deg,#2b6de9,#22b38a)"></div></div><div style="font-size:14px;color:var(--text);text-align:right">${Math.round(tb.intermediate * 100)}%</div></div>
        <div class="bar-row" style="display:grid;grid-template-columns:88px 1fr 40px;align-items:center;gap:10px"><div style="font-size:14px;color:var(--text)">Advanced</div><div class="bar" style="height:8px;background:#e7eef7;border-radius:999px;overflow:hidden"><div class="bar-fill" style="width:${tb.advanced * 100}%;height:100%;background:linear-gradient(90deg,#2b6de9,#22b38a)"></div></div><div style="font-size:14px;color:var(--text);text-align:right">${Math.round(tb.advanced * 100)}%</div></div>
      </div>
      <div style="margin-top:14px;padding-top:14px;border-top:1px solid var(--border);display:grid;gap:10px;">
        <div class="detail-extra-row" style="display:flex;justify-content:space-between;gap:12px;font-size:14px"><span style="color:var(--muted)">Base / Summit</span><strong style="color:var(--text)">${resort.baseElevation.toLocaleString()} / ${resort.summitElevation.toLocaleString()} ft</strong></div>
        <div class="detail-extra-row" style="display:flex;justify-content:space-between;gap:12px;font-size:14px"><span style="color:var(--muted)">Avg Snowfall</span><strong style="color:var(--text)">${resort.avgSnowfall}\"</strong></div>
        <div class="detail-extra-row" style="display:flex;justify-content:space-between;gap:12px;font-size:14px"><span style="color:var(--muted)">Night Skiing</span><strong style="color:var(--text)">${resort.night ? 'Yes' : 'No'}</strong></div>
        <div class="detail-extra-row" style="display:flex;justify-content:space-between;gap:12px;font-size:14px"><span style="color:var(--muted)">Terrain Park</span><strong style="color:var(--text)">${resort.terrainPark ? 'Yes' : 'No'}</strong></div>
      </div>
    </div>

    <div class="sub-card-new" style="display:flex;flex-direction:column;padding:16px;border:1px solid var(--border);border-radius:18px;background:var(--panel);box-shadow:var(--shadow-sm);min-height:320px;">
      <div style="display:flex;justify-content:space-between;align-items:flex-end;gap:10px">
        <h3 class="sub-card-title-new" style="margin:0;font-size:12px;font-weight:700;letter-spacing:.08em;color:var(--accent);text-transform:uppercase">Next 3 Days Snow</h3>
        ${wx && bestDay && bestDay.snow > 0 ? `<div style="font-size:12px;color:var(--muted)">Best day: <strong style="color:var(--text)">${bestDay.day}</strong></div>` : ''}
      </div>
      <div style="margin-top:10px;font-size:13px;color:var(--muted)">${hist ? `Recent 7-day snowfall: <strong style="color:var(--text)">${hist.total}\"</strong>` : 'Loading recent snowfall…'}</div>
      ${snowRowsHtml}
    </div>

    <div class="sub-card-new" style="display:flex;flex-direction:column;padding:16px;border:1px solid var(--border);border-radius:18px;background:var(--panel);box-shadow:var(--shadow-sm);min-height:320px;">
      <div style="display:flex;justify-content:space-between;align-items:flex-end;gap:10px">
        <h3 class="sub-card-title-new" style="margin:0;font-size:12px;font-weight:700;letter-spacing:.08em;color:var(--accent);text-transform:uppercase">Why It Scores Well</h3>
        ${skis ? `<div style="font-size:12px;color:var(--muted)">6-factor view</div>` : ''}
      </div>
      ${factorGridHtml}
    </div>

    <div class="sub-card-new" style="display:flex;flex-direction:column;padding:16px;border:1px solid var(--border);border-radius:18px;background:var(--panel);box-shadow:var(--shadow-sm);min-height:320px;">
      <h3 class="sub-card-title-new" style="margin:0 0 12px;font-size:12px;font-weight:700;letter-spacing:.08em;color:var(--accent);text-transform:uppercase">Decision Summary</h3>
      <div style="display:grid;gap:14px;align-content:start;height:100%">
        <div>
          <div style="font-size:16px;font-weight:800;color:var(--text);margin-bottom:6px">Conditions verdict</div>
          <div style="font-size:13px;line-height:1.7;color:var(--muted)">${vd ? esc(vd.detail) : 'Loading conditions data…'}</div>
          ${vd?.subPoints?.length ? `<div style="margin-top:8px;display:grid;gap:4px">${vd.subPoints.map(p => `<div style="font-size:12px;color:var(--muted)">• ${esc(p)}</div>`).join('')}</div>` : ''}
        </div>
        <div style="padding:14px;border-radius:14px;background:var(--bg);border:1px solid var(--border)">
          <div style="font-size:13px;font-weight:700;color:var(--text);margin-bottom:6px">Watch-out</div>
          <div style="font-size:13px;line-height:1.7;color:var(--muted)">${
            vd?.rainLikely ? 'Rain is likely at this elevation — conditions will be wet and slushy.' :
            vd?.tier === 'bad' && !vd?.rainLikely ? 'Very little new snow in the forecast — base conditions only.' :
            resort.price >= 175 ? 'Higher ticket price than average — factor that into your day.' :
            'Check conditions the morning of — forecasts can shift 24 hours out.'
          }</div>
        </div>
        <div style="margin-top:auto;padding-top:4px">
          <div class="detail-crowd-label ${crowdClass(crowd.label)}" style="margin-bottom:6px;font-size:18px;font-weight:800;color:var(--accent)">${crowd.label} crowds</div>
          <div style="font-size:12px;color:var(--muted)">Confidence: <strong style="color:var(--text)">${crowd.confidence}</strong></div>
          ${crowd.reasons.length
            ? `<div class="detail-crowd-reasons" style="margin-top:10px;display:grid;gap:6px">
                 ${crowd.reasons.map(r => `<div class="detail-crowd-reason" style="font-size:13px;color:var(--muted)">• ${esc(r)}</div>`).join('')}
               </div>`
            : ''}
        </div>
      </div>
    </div>

  </div>

  <p class="price-disclaimer">*Prices vary by date, demand, age, and promotions. Confirm final pricing with the mountain.</p>

</div>`;

  if (scroll) els.detailSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  if (resort) pushReportUrl(resort);
  injectConditionsBadge(resort.id, 'detailConditionsSlot');
}

// ─── Summary cards ────────────────────────────────────────────────────────────

// ─── Map ───────────────────────────────────────────────────────────────────────
let map = null, markers = {};

function passColor(g)   { return { Epic:'#2b6de9', Ikon:'#8a4dff', Indy:'#22b38a', Independent:'#90a4be' }[g] || '#90a4be'; }
function driveColor(m)  { return m <= 90 ? '#22b38a' : m <= 150 ? '#8ccf57' : m <= 210 ? '#f0b44c' : '#e07a5f'; }
function stormColor(t)  { return t >= 8 ? '#1d4ed8' : t >= 5 ? '#3b82f6' : t >= 2 ? '#93c5fd' : '#cbd5e1'; }
function verticalColor(v) {
  if (v >= 2500) return '#1d2d6e';
  if (v >= 1800) return '#2b6de9';
  if (v >= 1200) return '#22b38a';
  if (v >= 700)  return '#f0b44c';
  return '#e07a5f';
}

function renderMapLegend() {
  const html = state.mapMode === 'drive'
    ? `<span class="legend-chip"><i class="legend-dot" style="background:#22b38a"></i> under 90 min</span><span class="legend-chip"><i class="legend-dot" style="background:#8ccf57"></i> 90–150 min</span><span class="legend-chip"><i class="legend-dot" style="background:#f0b44c"></i> 150–210 min</span><span class="legend-chip"><i class="legend-dot" style="background:#e07a5f"></i> 210+ min</span>`
    : state.mapMode === 'storm'
    ? `<span class="legend-chip"><i class="legend-dot" style="background:#1d4ed8"></i> 8"+ forecast</span><span class="legend-chip"><i class="legend-dot" style="background:#3b82f6"></i> 5–8"</span><span class="legend-chip"><i class="legend-dot" style="background:#93c5fd"></i> 2–5"</span><span class="legend-chip"><i class="legend-dot" style="background:#cbd5e1"></i> under 2"</span>`
    : state.mapMode === 'vertical'
    ? `<span class="legend-chip"><i class="legend-dot" style="background:#1d2d6e"></i> 2,500+ ft</span><span class="legend-chip"><i class="legend-dot" style="background:#2b6de9"></i> 1,800–2,499 ft</span><span class="legend-chip"><i class="legend-dot" style="background:#22b38a"></i> 1,200–1,799 ft</span><span class="legend-chip"><i class="legend-dot" style="background:#f0b44c"></i> 700–1,199 ft</span><span class="legend-chip"><i class="legend-dot" style="background:#e07a5f"></i> under 700 ft</span>`
    : `<span class="legend-chip"><i class="legend-dot" style="background:#2b6de9"></i> Epic</span><span class="legend-chip"><i class="legend-dot" style="background:#8a4dff"></i> Ikon</span><span class="legend-chip"><i class="legend-dot" style="background:#22b38a"></i> Indy</span><span class="legend-chip"><i class="legend-dot" style="background:#90a4be"></i> Independent</span>`;
  els.mapLegend.innerHTML = html;
}

function initMap() {
  if (map) return map;
  if (!els.leafletMap || typeof L === 'undefined' || !L?.map) return null;
  try {
    map = L.map('leafletMap', { zoomControl: true, scrollWheelZoom: true }).setView([43.5, -72.2], 7);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '© OpenStreetMap', maxZoom: 18 }).addTo(map);
    return map;
  } catch (err) { map = null; return null; }
}

function updateMap(resorts) {
  if (!els.leafletMap || typeof L === 'undefined' || !L?.divIcon) {
    if (els.mapLegend) els.mapLegend.innerHTML = '';
    return;
  }
  const activeMap = initMap();
  if (!activeMap) return;
  renderMapLegend();
  const filtered = new Set(resorts.map(r => r.id));
  RESORTS.forEach(resort => {
    const inFilter  = filtered.has(resort.id);
    const selected  = resort.id === state.selectedId;
    const wx        = state.weatherCache[resort.id]?.data;
    const storm     = (wx?.forecast || []).reduce((s, f) => s + (f.snow || 0), 0);
    const driveMins = getDriveMins(resort.id);
    let color = passColor(resort.passGroup);
    if (state.mapMode === 'drive' && driveMins !== null) color = driveColor(driveMins);
    if (state.mapMode === 'storm')    color = stormColor(storm);
    if (state.mapMode === 'vertical') color = verticalColor(resort.vertical);
    const size = selected ? 16 : 10;
    const icon = L.divIcon({
      className: '',
      html: `<div style="width:${size}px;height:${size}px;border-radius:50%;background:${color};border:2px solid rgba(0,0,0,.18);opacity:${inFilter ? 1 : 0.22};box-shadow:${selected ? '0 0 0 4px rgba(43,109,233,.18)' : '0 2px 6px rgba(0,0,0,.18)'}"></div>`,
      iconSize: [size, size], iconAnchor: [size / 2, size / 2],
    });
    const existing = markers[resort.id];
    if (existing && typeof existing.setIcon === 'function') { existing.setIcon(icon); return; }
    if (existing && typeof existing.remove === 'function') { try { existing.remove(); } catch (_) {} }
    const marker = L.marker([resort.lat, resort.lon], { icon })
      .addTo(activeMap)
      .bindPopup(`<strong>${esc(resort.name)}</strong><br>${esc(resort.state)} · ${esc(resort.passGroup)}<br>Vertical ${resort.vertical} ft<br>Ticket* $${resort.price}${resort.website ? `<br><a href="${resort.website}" target="_blank" rel="noopener">Visit website</a>` : ''}`);
    if (typeof marker.on === 'function') marker.on('click', () => { state.selectedId = resort.id; renderDetail({ scroll: true }); });
    markers[resort.id] = marker;
  });
}

// ─── AI Chat — with rate limiting (SECURITY FIX) ─────────────────────────────
async function askAI(query) {
  if (!query.trim() || aiChatLoading) return;

  // SECURITY FIX: rate limit — 10 second minimum between calls
  const now = Date.now();
  if (now - aiLastCallTime < 10000) {
    showToast('Please wait a moment before asking again', 2000);
    return;
  }
  aiLastCallTime = now;
  aiChatLoading  = true;

  if (els.aiChatBtn)    els.aiChatBtn.disabled = true;
  if (els.aiChatResult) {
    els.aiChatResult.className = 'ai-chat-result ai-chat-loading';
    els.aiChatResult.removeAttribute('hidden');
    els.aiChatResult.innerHTML = `<span class="ai-spinner"></span> Analyzing mountains that match your filters…`;
  }

  const current = filteredResorts();
  if (current.length === 0) {
    aiChatLoading = false;
    if (els.aiChatBtn) els.aiChatBtn.disabled = false;
    if (els.aiChatResult) {
      els.aiChatResult.className = 'ai-chat-result ai-chat-error';
      els.aiChatResult.removeAttribute('hidden');
      els.aiChatResult.innerHTML = '<span>No mountains match your current filters. Widen distance, pass, or snow settings — or reset filters — then ask again.</span>';
    }
    return;
  }
  const w       = normalizedWeights();
  const payload = current.slice(0, 25).map(r => {
    const wx      = state.weatherCache[r.id]?.data;
    const snow3d  = wx ? (wx.forecast || []).reduce((s, f) => s + (f.snow || 0), 0) : null;
    const bd      = wx ? plannerScoreBreakdown(r, wx, 0, w) : null;
    return {
      id: r.id, name: r.name, state: r.state, vertical: r.vertical, trails: r.trails,
      price: r.price, passGroup: r.passGroup, avgSnowfall: r.avgSnowfall,
      drive: getDriveMins(r.id), crowd: crowdForecast(r).label,
      snow3d: snow3d !== null ? Math.round(snow3d * 10) / 10 : null,
      tomorrowSnow: wx?.forecast?.[0]?.snow ?? null,
      tomorrowLow:  wx?.forecast?.[0]?.lo   ?? null,
      tomorrowHigh: wx?.forecast?.[0]?.hi   ?? null,
      tomorrowWind: wx?.forecast?.[0]?.wind ?? null,
      plannerScore: bd ? bd.score : null,
      beginner: r.terrainBreakdown?.beginner ?? null,
    };
  });

  try {
    const res  = await fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ query, resorts: payload }) });
    let data = null;
    try {
      data = await res.json();
    } catch (_) {
      throw new Error(res.ok ? 'Bad response from server' : `Server error (${res.status})`);
    }
    if (!res.ok) throw new Error(data?.error || `Request failed (${res.status})`);
    if (!data || data.error || !data.resortName) throw new Error(data?.error || 'No recommendation returned. Try a simpler question or check back shortly.');
    const nameLower = data.resortName.toLowerCase();
    const matched   = RESORTS.find(r => r.name.toLowerCase() === nameLower || r.name.toLowerCase().includes(nameLower) || nameLower.includes(r.name.toLowerCase()));
    const resortLink = matched ? `<button class="ai-result-jump-btn" data-resort-id="${matched.id}">View ${esc(data.resortName)} in table</button>` : '';
    if (els.aiChatResult) {
      els.aiChatResult.className = 'ai-chat-result ai-chat-success';
      els.aiChatResult.removeAttribute('hidden');
      // SECURITY FIX: escape explanation text
      els.aiChatResult.innerHTML =
        `<div class="ai-result-header"><strong>AI Pick: ${esc(data.resortName)}</strong></div>` +
        `<div class="ai-result-text">${esc(data.explanation)}</div>` +
        (resortLink ? `<div class="ai-result-actions">${resortLink}</div>` : '');
    }
    if (matched) {
      state.selectedId = matched.id;
      renderDetail();
      setTimeout(() => {
        const row = document.querySelector(`tr[data-id="${matched.id}"]`);
        if (row) { row.classList.add('ai-highlight'); setTimeout(() => row.classList.remove('ai-highlight'), 2500); }
      }, 300);
    }
  } catch (err) {
    if (els.aiChatResult) {
      els.aiChatResult.className = 'ai-chat-result ai-chat-error';
      els.aiChatResult.removeAttribute('hidden');
      els.aiChatResult.innerHTML = `<span>${esc(err.message || 'AI unavailable — try again shortly')}</span>`;
    }
  } finally {
    aiChatLoading = false;
    if (els.aiChatBtn) els.aiChatBtn.disabled = false;
  }
}

// ─── Mobile card grid ─────────────────────────────────────────────────────────
function renderMobileCards(decorated, emptyOpts) {
  if (!els.mobileCardGrid) return;
  const items = decorated.slice(0, state.tableViewAll ? decorated.length : 10);
  if (items.length === 0) {
    if (emptyOpts?.mode === 'empty') {
      const qActive = emptyOpts.qActive;
      const longMsg = qActive
        ? 'No mountains match your search. Try different words or clear search.'
        : (emptyOpts.resortsLen === 0
          ? 'Nothing matches your filters. Loosen a preference or reset filters below.'
          : 'Nothing to show in this view.');
      els.mobileCardGrid.innerHTML = `<div class="mob-grid-empty" role="status"><div class="mob-grid-empty-icon">🎿</div><p class="mob-grid-empty-title">${qActive ? 'No search results' : 'No mountains here'}</p><p class="mob-grid-empty-sub">${longMsg}</p></div>`;
    } else els.mobileCardGrid.innerHTML = '';
    return;
  }
  const passColors = { Epic:'#1a4fa8', Ikon:'#c8a84b', Indy:'#2d7a3a', Independent:'#6b5e7a' };
  const noOriginMobile = !state.origin && state.sortBy === 'planner';
  const nudgeHtml = noOriginMobile ? `
    <div class="mob-location-nudge">
      <span>📍</span>
      <span>Enter your location to rank by live snow + drive time</span>
      <button onclick="document.getElementById('originInput')?.focus();window.scrollTo({top:0,behavior:'smooth'})">Set location →</button>
    </div>` : '';
  els.mobileCardGrid.innerHTML = nudgeHtml + items.map(({ resort, breakdown, stormTotal }) => {
    const score     = breakdown ? Math.round(breakdown.score) : null;
    const storm     = stormTotal !== null ? stormTotal.toFixed(1) + '"' : '…';
    const drive     = formatDrive(resort.id);
    const crowd     = crowdForecast(resort).label;
    const passColor = passColors[resort.passGroup] || '#90a4be';
    const _mobSp = getSponsor(resort.id);
    return `<div class="mob-card${resort.id === state.selectedId ? ' mob-card-selected' : ''}${_mobSp ? ' mob-card-sponsored' : ''}" data-mob-id="${resort.id}" role="button" tabindex="0" aria-label="${esc(resort.name)}">
      <div class="mob-card-top">
        <div class="mob-card-name">${esc(resort.name)}</div>
        ${score !== null ? `<div class="mob-card-score" title="Ski Score">${score}</div>` : ''}
      </div>
      <div class="mob-card-chips">
        <span class="mob-chip" style="background:${passColor}22;color:${passColor};border-color:${passColor}44">${esc(resort.passGroup)}</span>
        <span class="mob-chip">${esc(resort.state)}</span>
        ${drive !== '—' ? `<span class="mob-chip">${drive}</span>` : ''}
        <span class="mob-chip">${storm}</span>
      </div>
      <div class="mob-card-stats">
        <div><span class="mob-stat-label">Vertical</span><span class="mob-stat-val">${resort.vertical} ft</span></div>
        <div><span class="mob-stat-label">Trails</span><span class="mob-stat-val">${resort.trails}</span></div>
        <div><span class="mob-stat-label">Ticket</span><span class="mob-stat-val">$${resort.price}</span></div>
        <div><span class="mob-stat-label">Crowd</span><span class="mob-stat-val ${crowdClass(crowd)}">${crowd}</span></div>
      </div>
      <div class="mob-card-footer">
        <label class="mob-compare-label"><input type="checkbox" data-compare="${resort.id}" ${state.compareSet.has(resort.id) ? 'checked' : ''} /> Compare</label>
        <div class="mob-card-actions">
          ${resort.website ? `<a class="mob-website-btn" href="${resort.website}" target="_blank" rel="noopener noreferrer">Website</a>` : ''}
          <button type="button" class="mob-card-detail-btn" data-mob-detail="${resort.id}">Details →</button>
        </div>
      </div>
    </div>`;
  }).join('');
}

// ─── Share verdict ────────────────────────────────────────────────────────────
function shareVerdict(resort, verdictData) {
  const { stormTotal, driveText } = verdictData;
  const snowText  = stormTotal > 0 ? `${stormTotal.toFixed(1)}" forecast` : 'solid groomed conditions';
  const driveInfo = driveText ? ` · ${driveText} drive` : '';
  const shareText = `I'm skiing ${resort.name} (${resort.state}) this weekend — ${snowText}${driveInfo}. Pass: ${resort.passGroup}. Find your mountain.`;
  const p   = serializeState();
  const url = `${location.origin}${location.pathname}${p.toString() ? '?' + p : ''}`;
  if (navigator.share) {
    navigator.share({ title: `Ski day at ${resort.name} — WhereToSkiNext.com`, text: shareText, url }).catch(() => {});
  } else {
    const full = `${shareText} ${url}`;
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(full).then(() => showToast('Plan copied — share with your crew!', 3200)).catch(() => fallbackCopy(full));
    } else { fallbackCopy(full); }
  }
}

// ─── Render pipeline ──────────────────────────────────────────────────────────
/** Full UI paint for current `resorts` (already filtered). Does not fetch data or call renderAsyncPanels — safe from background callbacks. */
function repaintMainUI(resorts) {
  renderSummaryCards(resorts);
  renderActiveFilters();
  renderHiddenGems(resorts);
  renderCompareTable(resorts);
  renderCompareTray();
  renderDetail();
  updateMap(resorts);
  mapModeBtns().forEach(btn => btn.classList.toggle('active', btn.dataset.mapMode === state.mapMode));
  renderVerdict(resorts);
  _renderStorm(resorts);
}

async function renderAsyncPanels(resorts) {
  const candidates = plannerCandidates(resorts);
  await ensureWeather(candidates);
  repaintMainUI(resorts);
  ensureHistory(candidates.slice(0, 20)).then(() => {
    repaintMainUI(filteredResorts());
  });
}

function renderAllCards(resorts) {
  const needWx = plannerCandidates(resorts).some(r => !state.weatherCache[r.id]?.data);
  if (needWx) {
    weatherFetchPhase1Done = false;
    weatherFetchPhase2Done = false;
  }
  repaintMainUI(resorts);
  renderAsyncPanels(resorts);
}

function render() { renderAllCards(filteredResorts()); }

// ─── Filter badge ─────────────────────────────────────────────────────────────
function updateFilterBadge() {
  const badge = document.getElementById('filterBadge');
  if (!badge) return;
  const count = activeFilters().length;
  badge.textContent = count;
  badge.classList.toggle('hidden', count === 0);
}

// ─── Leaflet lazy loader ──────────────────────────────────────────────────────
let leafletLoaded = false;
function lazyLoadLeaflet(callback) {
  if (leafletLoaded) { if (callback) callback(); return; }
  const cssEl = document.getElementById('leafletCss');
  if (cssEl) cssEl.href = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css';
  const script = document.createElement('script');
  script.src = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js';
  script.onload = () => { leafletLoaded = true; if (callback) callback(); };
  document.head.appendChild(script);
}

// ─── Sync active button states inside the mobile drawer clone ────────────────
function syncDrawerControls(root) {
  const keyMap = {
    snow:   () => String(state.weights.snow),
    value:  () => String(state.weights.value),
    crowd:  () => String(state.weights.crowd),
    size:   () => state.verticalFilter,
    temp:   () => state.tempBucket,
    wind:   () => state.windBucket,
    howfar: () => String(state.howFar),
  };
  Object.entries(keyMap).forEach(([key, getVal]) => {
    const group = root.querySelector(`.priority-btns[data-key="${key}"]`);
    if (!group) return;
    const val = getVal();
    group.querySelectorAll('.priority-btn').forEach(btn =>
      btn.classList.toggle('active', btn.dataset.val === val)
    );
  });
}

// ─── Mobile filter drawer — FIX: event delegation to avoid listener leak ──────
function wireMobileFilterDrawer() {
  const triggerBtn = document.getElementById('mobileFilterBtn');
  const drawer     = document.getElementById('filterDrawer');
  const overlay    = document.getElementById('filterDrawerOverlay');
  const closeBtn   = document.getElementById('filterDrawerClose');
  const doneBtn    = document.getElementById('filterDrawerDone');
  const resetBtn   = document.getElementById('filterDrawerReset');
  const drawerBody = document.getElementById('filterDrawerBody');
  if (!triggerBtn || !drawer) return;

  function openDrawer() {
    const plannerDetails = document.getElementById('plannerDetails');
    if (drawerBody && plannerDetails) {
      // FIX: innerHTML clears old clone + all its listeners before appending new clone
      drawerBody.innerHTML = '';
      const clone = plannerDetails.cloneNode(true);
      clone.id = 'plannerDetails-drawer';
      drawerBody.appendChild(clone);
      // Sync active button states onto the cloned nodes so selections show immediately
      syncDrawerControls(clone);
      // Remove any previous listener before adding fresh one (prevents stacking)
      drawerBody.removeEventListener('click', handleDrawerClick);
      drawerBody.addEventListener('click', handleDrawerClick);
    }
    drawer.hidden = false;
    requestAnimationFrame(() => drawer.classList.add('open'));
    triggerBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function handleDrawerClick(e) {
    const btn = e.target.closest('.priority-btn');
    if (!btn) return;
    const key = btn.closest('.priority-btns')?.dataset.key;
    if (!key) return;
    commitPlannerPriorityChange(key, btn);
    if (key === 'howfar') requestAnimationFrame(() => closeDrawer());
    if (drawerBody) syncDrawerControls(drawerBody);
  }

  function closeDrawer() {
    drawer.classList.remove('open');
    triggerBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    setTimeout(() => { drawer.hidden = true; }, 300);
  }

  triggerBtn.addEventListener('click', openDrawer);
  if (closeBtn)  closeBtn.addEventListener('click', closeDrawer);
  if (overlay)   overlay.addEventListener('click', closeDrawer);
  if (doneBtn) {
    doneBtn.addEventListener('click', () => {
      closeDrawer();
      setTimeout(() => scrollToBestMatchFromFilters('drawer_done'), 280);
    });
  }
  if (resetBtn)  resetBtn.addEventListener('click', () => { document.getElementById('resetFilters')?.click(); closeDrawer(); updateFilterBadge(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !drawer.hidden) closeDrawer(); });
}

// ─── Event wiring ─────────────────────────────────────────────────────────────
/** Debounced full render. Prefer immediate `render()` for drive tier and location so results snap in. */
const debouncedRender = debounce(render, 50);

function wireEvents() {
  // Leaflet lazy load
  const mapSection = document.getElementById('mapSection');
  if (mapSection && typeof IntersectionObserver !== 'undefined') {
    const obs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) { lazyLoadLeaflet(() => updateMap(filteredResorts())); obs.disconnect(); }
    }, { threshold: 0.1 });
    obs.observe(mapSection);
  } else { setTimeout(() => lazyLoadLeaflet(), 2000); }

  wireMobileFilterDrawer();

  // AI chat
  if (els.aiChatBtn) els.aiChatBtn.addEventListener('click', () => { const q = els.aiChatInput?.value?.trim(); if (q) { trackEvent('ai_chat_used', { query: q }); askAI(q); } });
  if (els.aiChatInput) els.aiChatInput.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); const q = els.aiChatInput.value?.trim(); if (q) askAI(q); } });
  if (els.aiChatResult) {
    els.aiChatResult.addEventListener('click', e => {
      const btn = e.target.closest('[data-resort-id]');
      if (!btn) return;
      const id = btn.dataset.resortId;
      state.selectedId = id;
      renderDetail();
      const row = document.querySelector(`tr[data-id="${id}"]`);
      if (row) row.scrollIntoView({ behavior: 'smooth', block: 'center' });
      else document.getElementById('compareSection')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  // Mobile card grid delegation
  if (els.mobileCardGrid) {
    els.mobileCardGrid.addEventListener('click', e => {
      const detailBtn = e.target.closest('[data-mob-detail]');
      if (detailBtn) { state.selectedId = detailBtn.dataset.mobDetail; renderDetail({ scroll: true }); return; }
      const card = e.target.closest('.mob-card[data-mob-id]');
      if (!card || e.target.closest('input') || e.target.closest('button') || e.target.closest('a[href]')) return;
      state.selectedId = card.dataset.mobId;
      renderDetail({ scroll: true });
    });
    els.mobileCardGrid.addEventListener('change', e => {
      const box = e.target.closest('input[data-compare]');
      if (!box) return;
      if (box.checked) state.compareSet.add(box.dataset.compare);
      else             state.compareSet.delete(box.dataset.compare);
      renderCompareTray();
    });
  }

  // Sortable column headers
  document.querySelectorAll('.sortable-th').forEach(th => {
    th.addEventListener('click', () => {
      const col = th.dataset.sort;
      if (state.sortBy === col) {
        tableSort.dir = tableSort.dir === 'desc' ? 'asc' : 'desc';
      } else {
        state.sortBy = col; tableSort.col = col;
        tableSort.dir = ['price','drive','name','state','pass'].includes(col) ? 'asc' : 'desc';
        if (els.sortBy && [...els.sortBy.options].some(o => o.value === col)) els.sortBy.value = col;
      }
      pushUrlDebounced(); render();
    });
  });

  if (els.passFilter) els.passFilter.addEventListener('change', e => {
    state.passFilter = e.target.value;
    state.passPreference = state.passFilter === 'All' ? 'any' : state.passFilter;
    trackEvent('pass_selected', { pass_type: String(state.passFilter), source: 'compare_filter' });
    savePlannerState(); syncPlannerControls(); pushUrlDebounced(); render();
  });
  els.stateFilter.addEventListener('change', e => {
    state.stateFilter = e.target.value;
    trackEvent('filter_applied', { filter_type: 'state', filter_value: String(e.target.value) });
    pushUrlDebounced(); render();
  });

  const _howFarEl = document.getElementById('howFarFilter');
  if (_howFarEl) _howFarEl.addEventListener('change', e => {
    state.howFar = Number(e.target.value);
    trackEvent('filter_applied', { filter_type: 'distance', filter_value: String(e.target.value), filter_label: _howFarEl.options[_howFarEl.selectedIndex]?.text || '' });
    if (state.howFar < 2 && !state.origin) showToast('Add your starting location to activate distance filtering', 4000);
    pushUrlDebounced(); syncPlannerControls(); render(); updateFilterBadge();
  });

  if (els.maxPriceFilter) els.maxPriceFilter.addEventListener('change', e => {
    state.priceRange = Number(e.target.value);
    trackEvent('filter_applied', { filter_type: 'price', filter_value: String(e.target.value), filter_label: els.maxPriceFilter.options[els.maxPriceFilter.selectedIndex]?.text || '' });
    pushUrlDebounced(); render();
  });
  els.sortBy.addEventListener('change', e => {
    state.sortBy = e.target.value;
    trackEvent('filter_applied', { filter_type: 'sort', filter_value: String(e.target.value) });
    pushUrlDebounced(); render();
  });
  els.toggleNight.addEventListener('click', () => {
    state.nightOnly = !state.nightOnly;
    els.toggleNight.setAttribute('aria-pressed', String(state.nightOnly));
    els.toggleNight.textContent = state.nightOnly ? '✓ On' : 'Off';
    trackEvent('filter_applied', { filter_type: 'night_skiing', filter_value: String(state.nightOnly) });
    pushUrlDebounced(); render();
  });

  if (els.plannerDetails) els.plannerDetails.hidden = false;

  // Sticky nav highlight
  // Nav highlight removed — anchor links no longer in primary nav

  // Compare section filter panel toggle
  const _filterToggleBtn = document.getElementById('filterToggleBtn');
  const _filterPanel     = document.getElementById('filterPanel');
  if (_filterToggleBtn && _filterPanel) {
    _filterToggleBtn.addEventListener('click', () => {
      const isOpen = !_filterPanel.hidden;
      _filterPanel.hidden = isOpen;
      _filterToggleBtn.setAttribute('aria-expanded', String(!isOpen));
      _filterToggleBtn.classList.toggle('filter-toggle-btn--open', !isOpen);
    });
  }

  // Reset all filters — site-wide, syncs planner + compare
  els.resetFilters.addEventListener('click', () => {
    state.search = ''; state.passFilter = 'All'; state.stateFilter = 'All';
    state.sortBy = 'planner'; state.tempBucket = 'any'; state.windBucket = 'any';
    state.nightOnly = false; state.priceRange = 0;
    state.howFar = 0; state.verticalFilter = 'any';
    state.weights = { ...DEFAULT_WEIGHTS };
    state.passPreference = 'any'; state.tableSearch = ''; state.tableViewAll = false;
    tableSort = { col: 'planner', dir: 'desc' };
    if (els.passFilter)     els.passFilter.value = 'All';
    els.stateFilter.value = 'All';
    const _hff = document.getElementById('howFarFilter'); if (_hff) _hff.value = '0';
    if (els.maxPriceFilter) els.maxPriceFilter.value = '0';
    if (els.heroPassSelect) els.heroPassSelect.value = 'All';
    if (els.heroSnowSelect) els.heroSnowSelect.value = '1';
    els.sortBy.value = 'planner';
    els.toggleNight.setAttribute('aria-pressed', 'false'); els.toggleNight.textContent = 'Off';
    if (els.tableSearch) els.tableSearch.value = '';
    syncPlannerControls();
    updateFilterBadge();
    pushUrlDebounced(); render();
  });

  if (els.tableSearch) {
    els.tableSearch.addEventListener('input', e => { state.tableSearch = e.target.value; state.tableViewAll = false; renderCompareTable(filteredResorts()); });
  }
  if (els.tableViewAllBtn) {
    els.tableViewAllBtn.addEventListener('click', () => { state.tableViewAll = !state.tableViewAll; renderCompareTable(filteredResorts()); });
  }

  els.compareBtn.addEventListener('click', renderComparePanel);
  els.clearCompare.addEventListener('click', () => { state.compareSet.clear(); els.comparePanel.classList.add('hidden'); renderCompareTray(); render(); });
  els.closeCompare.addEventListener('click', () => els.comparePanel.classList.add('hidden'));

  // Refine panel (#plannerDetails): instant apply (same model as mobile drawer).
  els.plannerDetails?.addEventListener('click', e => {
    const btn = e.target.closest('.priority-btn');
    if (!btn || !els.plannerDetails.contains(btn)) return;
    const key = btn.closest('.priority-btns')?.dataset.key;
    if (!key) return;
    commitPlannerPriorityChange(key, btn);
  });

  els.hnRefineToggle?.addEventListener('click', () => {
    const panel = els.plannerSection;
    if (!panel) return;
    const opening = panel.hidden;
    panel.hidden = !opening;
    const t = els.hnRefineToggle;
    if (t) {
      t.textContent = opening ? '✕ Close filters' : '⚙ Refine results';
      t.setAttribute('aria-expanded', String(opening));
    }
    if (opening) {
      syncPlannerControls();
      setTimeout(() => { panel.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 50);
    }
  });

  els.plannerSeeVerdictBtn?.addEventListener('click', () => scrollToBestMatchFromFilters('refine_footer'));

  document.querySelectorAll('.pass-pref-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      state.passPreference = btn.dataset.pass;
      state.passFilter = btn.dataset.pass === 'any' ? 'All' : btn.dataset.pass;
      trackEvent('pass_selected', { pass_type: String(btn.dataset.pass), source: 'planner_btn' });
      savePlannerState(); syncPlannerControls(); pushUrlDebounced(); debouncedRender();
    });
  });

  if (els.heroPassSelect) {
    els.heroPassSelect.addEventListener('change', () => {
      state.passFilter = els.heroPassSelect.value || 'All';
      state.passPreference = state.passFilter === 'All' ? 'any' : state.passFilter;
      trackEvent('pass_selected', { pass_type: String(state.passFilter), source: 'hero' });
      savePlannerState(); syncPlannerControls(); pushUrlDebounced(); debouncedRender();
    });
  }
  if (els.heroSnowSelect) {
    els.heroSnowSelect.addEventListener('change', () => {
      state.weights.snow = Number(els.heroSnowSelect.value || 1);
      trackEvent('ski_preference_set', { preference_type: 'snow', preference_value: String(els.heroSnowSelect.value), preference_label: els.heroSnowSelect.options[els.heroSnowSelect.selectedIndex]?.text || '', source: 'hero' });
      savePlannerState(); syncPlannerControls(); pushUrlDebounced(); debouncedRender();
    });
  }

  mapModeBtns().forEach(btn => btn.addEventListener('click', () => {
    state.mapMode = btn.dataset.mapMode;
    updateMap(filteredResorts());
    mapModeBtns().forEach(b => b.classList.toggle('active', b.dataset.mapMode === state.mapMode));
  }));

  // Table event delegation
  els.comparisonBody.addEventListener('click', e => {
    const row = e.target.closest('tr[data-id]');
    if (!row || e.target.closest('input, a, button, label')) return;
    state.selectedId = row.dataset.id;
    const _clickedResort = RESORTS.find(r => r.id === state.selectedId);
    if (_clickedResort) trackEvent('mountain_viewed', { mountain_name: _clickedResort.name, mountain_state: _clickedResort.state });
    renderDetail({ scroll: true });
    [...els.comparisonBody.querySelectorAll('tr')].forEach(r => r.classList.toggle('active-row', r.dataset.id === state.selectedId));
  });
  els.comparisonBody.addEventListener('change', e => {
    const box = e.target.closest('input[data-compare]');
    if (!box) return;
    if (box.checked) state.compareSet.add(box.dataset.compare);
    else             state.compareSet.delete(box.dataset.compare);
    renderCompareTray();
  });
  els.comparePills.addEventListener('click', e => {
    const btn = e.target.closest('[data-remove]');
    if (!btn) return;
    state.compareSet.delete(btn.dataset.remove);
    renderCompareTray(); render();
  });

  // UX FIX: loading feedback on Find My Mountain
  const applyLocation = async () => {
    const q = els.originInput.value.trim();
    if (!q) {
      state.origin = null; state.driveCache = {}; clearSavedOrigin();
      els.locationStatus.textContent = '';
      els.locationStatus.classList.remove('hero-location-status--error');
      render(); return;
    }
    els.locationStatus.textContent = 'Finding location…';
    els.locationStatus.classList.remove('hero-location-status--error');
    const loc = await geocodeOrigin(q);
    if (loc) {
      state.origin = loc; state.driveCache = {};
      els.locationStatus.textContent = `✓ Location set to ${loc.label}`;
      els.locationStatus.classList.remove('hero-location-status--error');
      trackEvent('location_set', { location_label: loc.label, method: 'search' });
      updatePlannerOriginLabel();
      if (els.verdictSection) setTimeout(() => els.verdictSection.scrollIntoView({ behavior: 'smooth', block: 'start' }), 120);
      if (isRememberChecked()) saveOrigin(loc); else clearSavedOrigin();
      pushUrlDebounced();
      await loadDriveTimes();
    } else {
      const raw = els.originInput.value.trim();
      const zipOnly = extractUsZip(raw) !== null;
      els.locationStatus.textContent = zipOnly
        ? 'No match for that ZIP — try city & state (e.g. Denver, CO) or a street address.'
        : 'Location not found — try a U.S. ZIP, city, or landmark.';
      els.locationStatus.classList.add('hero-location-status--error');
      showToast(zipOnly ? 'Invalid or unsupported ZIP — try a city name' : 'Could not find that place');
    }
  };

  // UX FIX: Button shows loading state while geocoding
  els.setLocation.addEventListener('click', async () => {
    const originalText = els.setLocation.textContent;
    els.setLocation.textContent = 'Finding…';
    els.setLocation.disabled = true;
    await applyLocation();
    els.setLocation.textContent = originalText;
    els.setLocation.disabled = false;
  });

  const _rememberCb = document.getElementById('rememberLocation');
  if (_rememberCb) {
    _rememberCb.checked = !!getSavedOrigin();
    _rememberCb.addEventListener('change', () => {
      if (_rememberCb.checked && state.origin) saveOrigin(state.origin);
      else clearSavedOrigin();
    });
  }

  if (els.plannerEditLocation) {
    els.plannerEditLocation.addEventListener('click', () => {
      document.getElementById('searchSection')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setTimeout(() => { if (els.originInput) { els.originInput.focus(); els.originInput.select(); } }, 350);
    });
  }
  els.originInput.addEventListener('keydown', async e => { if (e.key === 'Enter') { e.preventDefault(); await applyLocation(); } });
  els.detectLocation.addEventListener('click', () => {
    if (!navigator.geolocation) { showToast('Geolocation not supported'); return; }
    els.locationStatus.textContent = 'Detecting your location…';
    navigator.geolocation.getCurrentPosition(async pos => {
      state.origin = { lat: pos.coords.latitude, lon: pos.coords.longitude, label: 'Your location' };
      els.originInput.value = 'Your location';
      trackEvent('location_set', { location_label: 'GPS', method: 'gps' });
      if (isRememberChecked()) saveOrigin(state.origin); else clearSavedOrigin();
      pushUrlDebounced();
      await loadDriveTimes();
      els.locationStatus.textContent = '✓ Using your location';
      els.locationStatus.classList.remove('hero-location-status--error');
      updatePlannerOriginLabel();
      if (els.verdictSection) setTimeout(() => els.verdictSection.scrollIntoView({ behavior: 'smooth', block: 'start' }), 120);
    }, () => {
      els.locationStatus.textContent = 'Location blocked or unavailable — allow access in your browser, or type a ZIP or city.';
      els.locationStatus.classList.add('hero-location-status--error');
      showToast('Location permission needed — use search instead');
    });
  });

  // ── Score breakdown tooltip ─────────────────────────────────────────────────
  (function initScoreTooltip() {
    const tip = document.getElementById('scoreTooltip');
    if (!tip) return;

    const ROWS = [
      { key: 'snow',       label: 'Snow',         color: '#2b6de9' },
      { key: 'skiability', label: 'Skiability',   color: '#16a34a' },
      { key: 'fit',        label: 'Mountain Fit', color: '#7c3aed' },
      { key: 'drive',      label: 'Drive',        color: '#0891b2' },
      { key: 'value',      label: 'Value',        color: '#d97706' },
      { key: 'crowd',      label: 'Crowds',       color: '#db2777' },
    ];

    function buildHtml(bd) {
      const max = 25;
      return `<div class="stip-title">Score Breakdown</div>` +
        ROWS.map(({ key, label, color }) => {
          const val = bd[key] ?? 0;
          const pct = Math.min(100, Math.round((val / max) * 100));
          return `<div class="stip-row">
            <span class="stip-label">${label}</span>
            <div class="stip-bar-track"><div class="stip-bar-fill" style="width:${pct}%;background:${color}"></div></div>
            <span class="stip-val">${val}</span>
          </div>`;
        }).join('') +
        `<div class="stip-note">Each component out of ~25 pts</div>`;
    }

    function position(badge) {
      const rect  = badge.getBoundingClientRect();
      const tipW  = tip.offsetWidth  || 230;
      const tipH  = tip.offsetHeight || 180;
      const topAbove = rect.top  + window.scrollY - tipH - 8;
      const topBelow = rect.bottom + window.scrollY + 8;
      const top  = topAbove >= window.scrollY + 4 ? topAbove : topBelow;
      let   left = rect.left + window.scrollX + rect.width / 2 - tipW / 2;
      left = Math.max(window.scrollX + 4, Math.min(left, window.scrollX + window.innerWidth - tipW - 4));
      tip.style.top  = `${top}px`;
      tip.style.left = `${left}px`;
    }

    function show(badge) {
      const raw = badge.getAttribute('data-bd');
      if (!raw) return;
      let bd;
      try { bd = JSON.parse(atob(raw)); } catch (e) { return; }
      tip.innerHTML = buildHtml(bd);
      tip.style.visibility = 'hidden';
      tip.removeAttribute('hidden');
      requestAnimationFrame(() => { position(badge); tip.style.visibility = ''; });
      tip._badge = badge;
    }

    function hide() { tip.setAttribute('hidden', ''); tip._badge = null; }

    // Hover (desktop)
    document.addEventListener('mouseover', e => {
      const b = e.target.closest('.score-badge--tip');
      if (b) show(b);
    });
    document.addEventListener('mouseout', e => {
      if (!e.target.closest('.score-badge--tip')) return;
      if (!e.relatedTarget?.closest('.score-badge--tip, #scoreTooltip')) hide();
    });
    tip.addEventListener('mouseleave', hide);

    // Tap/click (mobile)
    document.addEventListener('click', e => {
      const b = e.target.closest('.score-badge--tip');
      if (b) {
        e.stopPropagation();
        if (tip._badge === b && !tip.hasAttribute('hidden')) { hide(); return; }
        show(b);
        return;
      }
      if (!e.target.closest('#scoreTooltip')) hide();
    });

    document.addEventListener('keydown', e => { if (e.key === 'Escape') hide(); });
    window.addEventListener('scroll', () => {
      if (tip._badge && !tip.hasAttribute('hidden')) position(tip._badge);
    }, { passive: true });
  })();

  // Back to top
  let scrollTicking = false;
  window.addEventListener('scroll', () => {
    if (!scrollTicking) {
      requestAnimationFrame(() => { els.backToTop.classList.toggle('show', window.scrollY > 500); scrollTicking = false; });
      scrollTicking = true;
    }
  });
  els.backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

// ─── Initialize ───────────────────────────────────────────────────────────────
function initialize() {
  if (els.passFilter) els.passFilter.innerHTML = UNIQUE_PASSES.map(v => `<option value="${v}">${v === 'All' ? 'All' : v}</option>`).join('');
  els.stateFilter.innerHTML = UNIQUE_STATES.map(v => `<option value="${v}">${v}</option>`).join('');

  loadWeatherCache();
  loadHistoryCache();

  const hadUrlState = applyUrlState();
  normalizeWeightsToPriority();
  updatePlannerOriginLabel();

  if (hadUrlState && state.origin) {
    els.originInput.value = state.origin.label;
    els.locationStatus.textContent = `Location set to ${state.origin.label}`;
  } else if (!state.origin) {
    const _saved = getSavedOrigin();
    if (_saved) {
      state.origin = _saved;
      els.originInput.value = _saved.label;
      els.locationStatus.textContent = `Location restored: ${_saved.label}`;
      const _cb = document.getElementById('rememberLocation');
      if (_cb) _cb.checked = true;
    }
  }

  if (hadUrlState) {
    if (els.passFilter)     els.passFilter.value = state.passFilter;
    els.stateFilter.value   = state.stateFilter;
    els.sortBy.value        = state.sortBy;
    const _hfSync = document.getElementById('howFarFilter'); if (_hfSync) _hfSync.value = String(state.howFar);
    if (els.maxPriceFilter) els.maxPriceFilter.value = String(state.priceRange);
    els.toggleNight.setAttribute('aria-pressed', String(state.nightOnly));
    els.toggleNight.textContent = state.nightOnly ? '✓ On' : 'Off';
  }

  syncPlannerControls();
  wireEvents();
  updateHeroHeadline();
  render();
  updateFilterBadge();

  if (state.origin) { applyHaversineEstimates(); loadDriveTimes(); }

  const _mc = document.getElementById('heroMountainCount');
  if (_mc && typeof RESORTS !== 'undefined' && RESORTS.length) _mc.textContent = String(RESORTS.length);

  document.getElementById('scrollMoreFab')?.addEventListener('click', () => {
    const run = document.getElementById('hnRunnerUpSection');
    if (run && !run.hidden) {
      run.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
    document.getElementById('compareSection')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  // Support ?resort=resort-id from static page CTA banners, as well as path-based slugs
  const resortParam = new URLSearchParams(window.location.search).get('resort');
  const reportSlug  = window.__REPORT_SLUG__ || getReportSlug() || resortParam;
  if (reportSlug) {
    const found = findResortBySlug(reportSlug);
    if (found) {
      state.selectedId = found.id;
      document.title = found.name + ' — WhereToSkiNext.com';
      setTimeout(() => {
        renderDetail();
        document.getElementById('detailSection')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 600);
    }
  }

  // Auto-open compare panel if compare IDs were passed via URL
  if (state.compareSet.size >= 2) {
    setTimeout(() => {
      renderCompareTray();
      renderCompareTable(filteredResorts());
      renderComparePanel();
    }, 1200);
  }

  window.addEventListener('popstate', () => {
    const slug = getReportSlug();
    if (slug) {
      const found = findResortBySlug(slug);
      if (found) { state.selectedId = found.id; document.title = found.name + ' — WhereToSkiNext.com'; renderDetail({ scroll: true }); return; }
    }
    state.selectedId = null;
    if (els.detailSection) els.detailSection.classList.add('hidden');
    document.title = 'WhereToSkiNext.com';
    render();
  });
}

// ─── Day-aware hero headline ──────────────────────────────────────────────────
function updateHeroHeadline() {
  const el = document.getElementById('heroHeadline');
  if (!el) return;
  const now  = new Date();
  const day  = now.getDay(); // 0=Sun, 1=Mon ... 6=Sat
  const hour = now.getHours();
  let timeframe;
  if      (day === 5 && hour >= 15) timeframe = 'this weekend';
  else if (day === 6)               timeframe = 'this weekend';
  else if (day === 0)               timeframe = 'today';
  else if (hour >= 15)              timeframe = 'tomorrow';
  else                              timeframe = 'today';
  el.innerHTML = `Where should you ski <em>${timeframe}?</em>`;
}

initialize();
