// ═══════════════════════════════════════════════════════════════════════════
// SD-APP.JS — State, networking, UI rendering, events, and initialization
// Depends on: sd-data.js, sd-scoring.js, sd-filters.js (loaded before this)
// ═══════════════════════════════════════════════════════════════════════════

let weatherFetchPhase1Done = false;
let weatherFetchPhase2Done = false;
let verdictLockedUntil = 0;
let verdictLockTimer   = null;

// ─── localStorage helpers ─────────────────────────────────────────────────────
function loadSavedWeights() {
  try { localStorage.removeItem('ski-planner-weights'); } catch (e) {}
  return { ...DEFAULT_WEIGHTS };
}
function loadSavedPassPreference() { return 'any'; }
function normalizeOriginForState(o) {
  if (!o || typeof o !== 'object') return null;
  const lat = Number(o.lat);
  const lon = Number(o.lon);
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) return null;
  if (lat < -90 || lat > 90 || lon < -180 || lon > 180) return null;
  const label = SDSafeUrl.sanitizeLocationLabel(o.label);
  if (!label) return null;
  return { lat, lon, label };
}
function getSavedOrigin() {
  try {
    const r = localStorage.getItem('ski-saved-origin');
    if (!r) return null;
    return normalizeOriginForState(JSON.parse(r));
  } catch (e) { return null; }
}
function saveOrigin(origin) {
  try {
    const n = normalizeOriginForState(origin);
    if (!n) return;
    localStorage.setItem('ski-saved-origin', JSON.stringify(n));
  } catch (e) {}
}
function clearSavedOrigin() {
  try { localStorage.removeItem('ski-saved-origin'); } catch (e) {}
}
function isRememberChecked() {
  const cb = document.getElementById('rememberLocation');
  return cb ? cb.checked : false;
}

// ─── Sponsor configuration ────────────────────────────────────────────────────
function getSponsor(resortId) {
  return (typeof getFeaturedPartner === 'function') ? getFeaturedPartner(resortId) : null;
}

// ─── Inject sponsor CSS once ──────────────────────────────────────────────────
(function injectSponsorCSS() {
  const style = document.createElement('style');
  style.textContent = `
    .sponsored-row { outline: 2px solid #2b6de9; outline-offset: -1px; background: linear-gradient(90deg, #e8f4fc 0%, #f0f4f8 100%) !important; }
    .mob-card-sponsored { border: 2px solid #2b6de9 !important; background: linear-gradient(165deg, #e8f4fc 0%, #f7fafc 55%, #ffffff 100%) !important; box-shadow: 0 4px 20px rgba(43, 109, 233, 0.12) !important; }
    .detail-header-rebuilt { padding: 14px 18px 10px; }
    .detail-header-rebuilt .dhr-eyebrow { font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: .1em; color: #7a92a8; margin-bottom: 4px; }
    .detail-header-rebuilt .dhr-sub { font-size: 12px; color: #7a92a8; }
    .detail-score-ring-new { width: 48px; height: 48px; border-radius: 50%; background: #22b38a; display: flex; flex-direction: column; align-items: center; justify-content: center; flex-shrink: 0; cursor: pointer; }
    .detail-score-ring-new.ring-low { background: #d95b5b; }
    .detail-score-ring-new.ring-mid { background: #f59e0b; }
    .detail-score-ring-new .dsrn-num { font-size: 17px; font-weight: 800; color: #f0f6fc; line-height: 1; }
    .detail-score-ring-new .dsrn-lbl { font-size: 6px; font-weight: 600; color: rgba(240,246,252,.85); text-transform: uppercase; letter-spacing: .05em; }
    .detail-header-rebuilt .dhr-actions { display: flex; align-items: center; gap: 10px; }
    .dhr-link-secondary { font-size: 12px; font-weight: 500; color: #7a92a8; text-decoration: none; transition: color .12s; }
    .dhr-link-secondary:hover { color: #2b6de9; }
    .featured-pill { display: inline-flex; align-items: center; background: #2b6de9; color: #f0f6fc; border: 1px solid #2b6de9; font-size: 11px; font-weight: 700; padding: 6px 12px; border-radius: 999px; letter-spacing: .04em; box-shadow: 0 4px 12px rgba(43,109,233,.18); white-space: nowrap; }
    .btn-book { background: #22b38a; color: #f0f6fc !important; font-size: 13px; font-weight: 700; padding: 8px 18px; border-radius: 999px; text-decoration: none; transition: background .12s; }
    .btn-book:hover { background: #1f9e78; }
    .cond-row { display:flex; flex-wrap:wrap; gap:6px; margin-top:8px; }
    .cond-chip { display:inline-flex; align-items:center; font-size:11px; font-weight:600; padding:3px 9px; border-radius:999px; background:rgba(255,255,255,.13); color:rgba(240,246,252,.85); border:1px solid rgba(255,255,255,.18); }
    .cond-chip--surface { background:rgba(34,179,138,.22); color:#6ee7b7; border-color:rgba(110,231,183,.3); }
    .vcard-lodging { margin:14px 0 0; border-radius:10px; background:#e8f4fc; border:1px solid #bfdbfe; overflow:hidden; }
    .vcard-lodging-link { display:flex; align-items:center; gap:10px; padding:12px 16px; text-decoration:none; color:#2b6de9; font-size:14px; font-weight:600; transition:background .12s; }
    .vcard-lodging-link:hover { background:#dbeafe; }
    .vcard-lodging-icon { font-size:16px; flex-shrink:0; }
    .vcard-lodging-text { flex:1; }
    .vcard-lodging-arrow { color:#2b6de9; font-weight:700; }
    .vcard-lodging-sub { padding:0 16px 8px; font-size:10px; color:#7a92a8; letter-spacing:.03em; }
    .table-lodging-link { font-size:12px; font-weight:400; color:#9ca3af; text-decoration:none; white-space:nowrap; }
    .table-lodging-link:hover { text-decoration:underline; }

    /* ── Runner-up mini strip inside verdict card ───────────────────────────── */
    .vcard-runners-strip { margin: 10px -22px -18px; padding: 11px 22px 14px; border-top: 1px solid rgba(255,255,255,.12); background: rgba(255,255,255,.05); border-radius: 0 0 12px 12px; }
    .hn-hero-verdict-dock .vcard--hero-light .vcard-runners-strip { margin: 10px -1.35rem -16px; padding: 11px 1.35rem 14px; border-top: 1px solid rgba(15,23,42,.08); background: #e8eef5; border-radius: 0 0 10px 10px; }
    .vcard-runners-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; }
    .vcard-runners-label { font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: .1em; color: rgba(240,246,252,.5); }
    .hn-hero-verdict-dock .vcard--hero-light .vcard-runners-label { color: #7a92a8; }
    .vcard-runners-mini { display: flex; gap: 6px; overflow-x: auto; -webkit-overflow-scrolling: touch; scrollbar-width: none; padding-bottom: 1px; }
    .vcard-runners-mini::-webkit-scrollbar { display: none; }
    .vcard-mini-runner { display: flex; flex-direction: column; gap: 3px; background: rgba(255,255,255,.09); border: 1px solid rgba(255,255,255,.15); border-radius: 8px; padding: 8px 10px; cursor: pointer; text-align: left; min-width: 100px; max-width: 130px; flex-shrink: 0; transition: background .15s, border-color .15s; }
    .vcard-mini-runner:hover { background: rgba(255,255,255,.17); border-color: rgba(255,255,255,.28); }
    .hn-hero-verdict-dock .vcard--hero-light .vcard-mini-runner { background: #fff; border-color: #dde3ea; box-shadow: 0 1px 3px rgba(0,0,0,.07); }
    .hn-hero-verdict-dock .vcard--hero-light .vcard-mini-runner:hover { background: #eef4ff; border-color: #93c5fd; }
    .vmr-name { font-size: 11px; font-weight: 700; color: #f0f6fc; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .hn-hero-verdict-dock .vcard--hero-light .vmr-name { color: #1a2030; }
    .vmr-drive { font-size: 10px; color: rgba(240,246,252,.55); margin-top: 1px; }
    .hn-hero-verdict-dock .vcard--hero-light .vmr-drive { color: #7a92a8; }
    .vmr-crowd-mini { font-size: 9px; font-weight: 600; padding: 2px 5px; border-radius: 999px; display: inline-flex; align-items: center; gap: 3px; width: fit-content; margin-top: 2px; }
    .vmr-crowd-mini.crowd-quiet-chip { background: rgba(34,179,138,.2); color: #6ee7b7; }
    .vmr-crowd-mini.crowd-busy-chip  { background: rgba(248,113,113,.15); color: #fca5a5; }
    .vmr-crowd-mini.crowd-mod-chip   { background: rgba(245,158,11,.15); color: #fcd34d; }
    .hn-hero-verdict-dock .vcard--hero-light .vmr-crowd-mini.crowd-quiet-chip { background: #dcfce7; color: #15803d; }
    .hn-hero-verdict-dock .vcard--hero-light .vmr-crowd-mini.crowd-busy-chip  { background: #fee2e2; color: #b91c1c; }
    .hn-hero-verdict-dock .vcard--hero-light .vmr-crowd-mini.crowd-mod-chip   { background: #fef9c3; color: #92400e; }
    .vcard-runners-see-all { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 1px; background: rgba(255,255,255,.07); border: 1px solid rgba(255,255,255,.13); border-radius: 8px; padding: 8px 11px; cursor: pointer; font-size: 10px; font-weight: 600; color: rgba(240,246,252,.65); flex-shrink: 0; min-width: 58px; transition: background .15s; line-height: 1.3; }
    .vcard-runners-see-all:hover { background: rgba(255,255,255,.15); color: #f0f6fc; }
    .hn-hero-verdict-dock .vcard--hero-light .vcard-runners-see-all { background: #f0f4f8; border-color: #c8d4e0; color: #5a7080; }
    .hn-hero-verdict-dock .vcard--hero-light .vcard-runners-see-all:hover { background: #dce8f5; border-color: #93c5fd; color: #1a2030; }
    .vcard-runners-see-all-arrow { font-size: 13px; }
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
  weights:        loadSavedWeights(),
  passPreference: loadSavedPassPreference(),
  tableSearch:    '',
  tableViewAll:   false,
  /** Ski day for forecast index (hero); set by initHeroWhenControls / heroSentenceDay */
  targetDate:     null,
  /** One of weekday|friday|saturday|sunday — matches hero sentence day control */
  skiDayPreset:   'weekday',
});

// ─── Hero “When” bar — maps chip value → next occurrence Date (local) ────────
function dayValToDate(val) {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const dow = today.getDay();
  const d = new Date(today);
  if (val === 'weekday') {
    if (dow === 0) d.setDate(d.getDate() + 1);
    else if (dow === 6) d.setDate(d.getDate() + 2);
    return d;
  }
  if (val === 'friday') {
    const du = (5 - dow + 7) % 7 || 7;
    d.setDate(d.getDate() + du);
    return d;
  }
  if (val === 'saturday') {
    const du = (6 - dow + 7) % 7 || 7;
    d.setDate(d.getDate() + du);
    return d;
  }
  if (val === 'sunday') {
    const du = (7 - dow) % 7 || 7;
    d.setDate(d.getDate() + du);
    return d;
  }
  return today;
}

function smartDefaultWhenVal() {
  const dow = new Date().getDay(); // 0=Sun,1=Mon,2=Tue,3=Wed,4=Thu,5=Fri,6=Sat
  if (dow === 5) return 'saturday';  // Friday  → next day is Saturday
  if (dow === 6) return 'sunday';    // Saturday → next day is Sunday
  if (dow === 0) return 'weekday';   // Sunday   → next day is a weekday
  return 'friday';                   // Mon–Thu  → next ski day is Friday
}

/** Baseline “When” chip from first load (for custom segment styling) */
let heroWhenDefaultVal = null;

function fillHeroSentenceDayOptions() {
  const sel = document.getElementById('heroSentenceDay');
  if (!sel) return;
  const vals = [
    ['weekday', 'Weekday'],
    ['friday', 'Friday'],
    ['saturday', 'Saturday'],
    ['sunday', 'Sunday'],
  ];
  sel.innerHTML = vals.map(([v]) => {
    const d = dayValToDate(v);
    const label = d.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
    return `<option value="${v}">${label}</option>`;
  }).join('');
}

/** Default hero ski day + state.targetDate before first render */
function initHeroWhenControls() {
  fillHeroSentenceDayOptions();
  const val = smartDefaultWhenVal();
  heroWhenDefaultVal = val;
  state.skiDayPreset = val;
  const sel = document.getElementById('heroSentenceDay');
  if (sel) sel.value = val;
  state.targetDate = dayValToDate(val);
}

function wireHeroSentenceDay() {
  const sel = document.getElementById('heroSentenceDay');
  if (!sel) return;
  sel.addEventListener('change', () => {
    state.skiDayPreset = sel.value;
    state.targetDate = dayValToDate(sel.value);
    updateHeroFilterSegmentsCustom();
    pushUrlDebounced();
    render();
  });
}

/** Legacy hook; kept for syncPlannerControls callers */
function updateHeroFilterSegmentsCustom() {}

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
  compareLocationHint: $('compareLocationHint'),
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
  backToTop:           $('backToTop'),
  toast:               $('toast'),
  aiChatInput:         $('aiChatInput'),
  aiChatBtn:           $('aiChatBtn'),
  aiChatResult:        $('aiChatResult'),
  heroPassSelect:      $('heroPassSelect'),
  heroSnowSelect:      $('heroSnowSelect'),
  hnRefinePromptBtn:   $('hnRefinePromptBtn'),
  plannerSeeVerdictBtn: $('plannerSeeVerdictBtn'),
};

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

function fitLabel(score) {
  if (score >= 80) return 'Excellent';
  if (score >= 65) return 'Good';
  if (score >= 50) return 'Fair';
  return 'Weak';
}

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

function runnerUpBlurb(snowInches, cf, passGroup) {
  const bits = [];
  if (snowInches !== null) {
    bits.push(snowInches > 0
      ? `about ${snowInches.toFixed(1)} inches showing in the forecast`
      : `not much snow in the forecast`);
  }
  if (cf) {
    if (cf.label === 'Quiet') {
      bits.push(cf.score <= 36 ? `usually stays pretty quiet` : `crowds tend to stay manageable`);
    } else if (cf.label === 'Avoid') {
      bits.push(`expect a very busy day — long lift lines likely`);
    } else if (cf.label === 'Busy') {
      bits.push(`expect a busy day on the hill`);
    } else if (cf.label === 'Moderate') {
      bits.push(`moderate crowds`);
    }
  }
  const passBit = passGroup === 'Epic' ? `Epic pass works here`
    : passGroup === 'Ikon' ? `Ikon pass works here`
    : passGroup === 'Indy' ? `Indy pass works here`
    : '';
  const body = bits.join(' and ');
  let out = '';
  if (body && passBit) out = `${body} — ${passBit}`;
  else if (body) out = body;
  else if (passBit) out = passBit;
  else out = `Solid alternative with your settings`;
  return out.charAt(0).toUpperCase() + out.slice(1) + (out.endsWith('.') ? '' : '.');
}

function runnerDifferentiator(item, allRunners) {
  const resort = item.resort;
  const _rWx   = state.weatherCache[resort.id]?.data;
  const _rSnow = _rWx ? (_rWx.forecast || []).reduce((s, f) => s + (f.snow || 0), 0) : null;
  const drive  = getDriveMins(resort.id);

  const drives = allRunners.map(r => getDriveMins(r.resort.id)).filter(Boolean);
  const isClosest = drive !== null && drives.length > 1 && drive === Math.min(...drives);

  const snows = allRunners
    .map(r => {
      const wx = state.weatherCache[r.resort.id]?.data;
      return wx ? (wx.forecast || []).reduce((s, f) => s + (f.snow || 0), 0) : null;
    })
    .filter(x => x !== null);
  const hasMostSnow = _rSnow !== null && snows.length > 1 && _rSnow === Math.max(...snows);

  const scores = allRunners.map(r => r.breakdown?.score ?? 0);
  const isTopScore = item.breakdown && item.breakdown.score === Math.max(...scores);

  if (_rSnow !== null && _rSnow >= 4) return `${_rSnow.toFixed(0)}" of snow in the forecast`;
  if (isClosest && drive !== null)    return `Closest option — ${formatDriveMins(drive)} away`;
  if (hasMostSnow && _rSnow > 0)     return `Most snow nearby — ${_rSnow.toFixed(0)}" forecast`;
  if (isTopScore)                     return `Highest score of the three`;
  if (typeof resort.price === 'number' && resort.price < 80) return `Best value — $${resort.price} walk-up ticket`;
  return drive ? `${formatDriveMins(drive)} from your location` : 'Solid local option';
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

// ─── PATCH 1: Resort photo helper ────────────────────────────────────────────
// Defaults to Trip's own /hero-bg.jpg for every resort.
// To add a resort-specific photo: add a `photo` field to that resort in
// resorts-national.js, e.g. `"photo": "/photos/stowe.jpg"`
// Unsplash option (free, no key): uncomment the two lines in the function body.
function resortPhotoStyle(resort, gradientCss) {
  // Uncomment below to use Unsplash auto-photos by state (no API key needed):
  // const sig = resort.id.charCodeAt(0) + (resort.id.charCodeAt(1) || 0);
  // const photo = `https://source.unsplash.com/800x450/?ski+mountain+${encodeURIComponent(resort.state)}&sig=${sig}`;
  const photo = (resort && resort.photo) ? resort.photo : '/hero-bg.jpg';
  const grad = gradientCss || 'linear-gradient(180deg, rgba(10,20,35,.48) 0%, rgba(10,20,35,.74) 100%)';
  return `background-image: ${grad}, url('${photo}'); background-size: cover; background-position: center 40%;`;
}

/** Weekend lodging strip: top-pick area search via Awin, or generic ski search if no verdict yet.
 *  When trip is Weekend (howFar === 1) and the verdict card shows the in-card lodging module, hide this strip to avoid duplicate CTAs. */
function syncWeekendLodgingStrip(verdict) {
  const strip = document.getElementById('hnBookingStrip');
  const a = strip?.querySelector('a.hn-booking-btn');
  if (!strip) return;
  const weekend = state.howFar >= 1;
  const lodgingInVerdictCard = state.howFar === 1 && verdict?.resort;
  strip.hidden = !weekend || lodgingInVerdictCard;
  strip.style.display = (!weekend || lodgingInVerdictCard) ? 'none' : '';
  if (!a || !weekend || lodgingInVerdictCard) return;
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

const CONDITIONS_TTL = 30 * 60 * 1000;

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

async function ensureWeather(resorts) {
  const near = nearestCandidates(resorts, 20);
  const rest  = resorts.filter(r => !near.find(n => n.id === r.id));

  const q1 = [...near.filter(r => !state.weatherCache[r.id]?.data)];
  await Promise.all(Array.from({ length: 8 }, async () => {
    while (q1.length) { const r = q1.shift(); if (r) await fetchWeather(r); }
  }));
  weatherFetchPhase1Done = true;

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
const NOMINATIM_HEADERS = {
  'Accept-Language': 'en-US,en;q=0.9',
  'User-Agent': 'WhereToSkiNext-SkiDashboard/1.0 (+https://www.wheretoskinext.com)',
};

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
          return normalizeOriginForState({
            lat: parseFloat(row.lat),
            lon: parseFloat(row.lon),
            label: labelFromNominatimResult(row),
          });
        }
      }
    } catch (e) {}

    try {
      const res = await fetchWithTimeout(`https://api.zippopotam.us/us/${zip}`);
      if (res.ok) {
        const d = await res.json();
        const place = d.places?.[0];
        if (place) {
          return normalizeOriginForState({
            lat: parseFloat(place.latitude),
            lon: parseFloat(place.longitude),
            label: `${place['place name']}, ${place.state || place['state abbreviation'] || ''}`.replace(/,\s*$/, ''),
          });
        }
      }
    } catch (e) {}
  }

  try {
    const res = await fetchWithTimeout(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=1&countrycodes=us`,
      { headers: { ...NOMINATIM_HEADERS } }
    );
    if (!res.ok) return null;
    const data = await res.json();
    if (!data.length) return null;
    const row = data[0];
    return normalizeOriginForState({
      lat: parseFloat(row.lat),
      lon: parseFloat(row.lon),
      label: labelFromNominatimResult(row),
    });
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
  if (p.has('sort')) {
    const s = SDSafeUrl.sanitizeSortParam(p.get('sort'));
    if (s) state.sortBy = s;
  }
  if (p.has('night'))  state.nightOnly = true;
  if (p.has('howfar')) state.howFar = Math.min(2, Number(p.get('howfar')) || 0);
  const originFromUrl = SDSafeUrl.parseOriginFromUrlParams(p);
  if (originFromUrl) state.origin = originFromUrl;
  if (p.has('compare')) {
    const ids = SDSafeUrl.parseCompareList(p.get('compare'), RESORTS.map(r => r.id));
    if (ids && ids.length >= 2) state.compareSet = new Set(ids);
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
  const _hfEl = document.getElementById('howFarFilter');
  if (_hfEl) _hfEl.value = String(state.howFar);
  document.querySelectorAll('.vcard-range-btn[data-tier]').forEach(b => b.classList.toggle('active', Number(b.dataset.tier) === state.howFar));

  const _tripSel = document.getElementById('heroSentenceTrip');
  if (_tripSel) _tripSel.value = String(state.howFar);
  const _daySel = document.getElementById('heroSentenceDay');
  if (_daySel) {
    fillHeroSentenceDayOptions();
    _daySel.value = state.skiDayPreset || smartDefaultWhenVal();
  }
  updateHeroFilterSegmentsCustom();
  syncWeekendLodgingStrip(computeVerdict(filteredResorts()));
  syncHeroPills();
}

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
  trackFilterEvent('planner_' + key, btn.textContent.trim() || btn.dataset.val || '');
  savePlannerState();
  syncPlannerControls();
  pushUrlDebounced();
  if (key === 'howfar') {
    const savedScroll = window.scrollY;
    render();
    requestAnimationFrame(() => window.scrollTo({ top: savedScroll, behavior: 'instant' }));
  }
  else { debouncedRender(); }
}

function scrollToBestMatchFromFilters(source) {
  trackEvent('refine_see_verdict', { source: String(source || 'unknown') });
  if (document.getElementById('searchSection')?.classList.contains('hn-hero-split')) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } else {
    els.verdictSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

// ─── Verdict engine ───────────────────────────────────────────────────────────
function computeVerdict(resorts) {
  const verdictPool = state.origin ? resorts.filter(r => resortMatchesDriveTier(r.id)) : resorts;
  const withWx = verdictPool.filter(r => state.weatherCache[r.id]?.data);
  if (!withWx.length) return null;

  const w      = normalizedWeights();
  const ranked = withWx.map(r => {
    const wx = state.weatherCache[r.id].data;
    return { resort: r, wx, breakdown: plannerScoreBreakdown(r, wx, targetForecastIndex(), w), history: historyCache.get(r.id) || null };
  }).sort((a, b) => b.breakdown.score - a.breakdown.score);

  const { resort, wx, breakdown, history } = ranked[0];
  const forecast   = wx.forecast || [];
  const fi         = targetForecastIndex();
  const tomorrowIn = forecast[fi]?.snow || 0;
  const stormTotal = forecast.reduce((s, f) => s + (f.snow || 0), 0);
  const histTotal  = history?.total ?? null;
  const histDays   = history?.days ?? null;

  const baseLo      = forecast[fi]?.lo ?? 30;
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

function collectRunnerUpItems(filteredResorts, excludeResortId, limit = 3) {
  const w = normalizedWeights();
  const pool = state.origin
    ? filteredResorts.filter(r => resortMatchesDriveTier(r.id))
    : filteredResorts;
  const scored = pool
    .filter(r => r.id !== excludeResortId && state.weatherCache[r.id]?.data)
    .map(r => {
      const wx = state.weatherCache[r.id].data;
      return { resort: r, wx, breakdown: plannerScoreBreakdown(r, wx, targetForecastIndex(), w) };
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
      const sa = wa ? plannerScoreBreakdown(a, wa, targetForecastIndex(), w).score : -Infinity;
      const sb = wb ? plannerScoreBreakdown(b, wb, targetForecastIndex(), w).score : -Infinity;
      if (sa !== sb) return sb - sa;
      return (getDriveMins(a.id) ?? 9999) - (getDriveMins(b.id) ?? 9999);
    });
  for (const r of rest) {
    if (out.length >= limit) break;
    const wx = state.weatherCache[r.id]?.data;
    out.push({
      resort: r,
      wx,
      breakdown: wx ? plannerScoreBreakdown(r, wx, targetForecastIndex(), w) : null,
    });
  }
  return out;
}

function updateHeroVerdictEmptyState() {
  const el = document.getElementById('heroVerdictEmpty');
  if (!el) return;
  el.hidden = !!state.origin;
}

function renderVerdict(resorts) {
  if (!els.verdictSection || !els.verdictCard) return;
  const refinePromptEl = document.getElementById('hnRefinePrompt');
  const splitHero = document.getElementById('searchSection')?.classList.contains('hn-hero-split');
  if (!state.origin) {
    if (refinePromptEl) refinePromptEl.hidden = true;
    els.verdictSection.classList.add('hn-verdict-pre-location');
    if (splitHero) {
      els.verdictSection.classList.remove('hn-verdict-collapsed');
      els.verdictSection.removeAttribute('aria-hidden');
    } else {
      els.verdictSection.classList.add('hn-verdict-collapsed');
      els.verdictSection.setAttribute('aria-hidden', 'true');
    }
    els.verdictCard.innerHTML = '';
    updateHeroVerdictEmptyState();
    const _hn = document.getElementById('hnRunnerUpSection');
    if (_hn) _hn.hidden = true;
    document.getElementById('hnConditionsGuidance')?.remove();
    return;
  }
  els.verdictSection.classList.remove('hn-verdict-pre-location');
  const wasCollapsed = els.verdictSection.classList.contains('hn-verdict-collapsed');
  els.verdictSection.classList.remove('hn-verdict-collapsed');
  els.verdictSection.removeAttribute('aria-hidden');
  if (wasCollapsed) {
    requestAnimationFrame(() => els.verdictSection.classList.add('hn-verdict-reveal'));
    setTimeout(() => els.verdictSection.classList.remove('hn-verdict-reveal'), 450);
  }
  updateHeroVerdictEmptyState();

  if (verdictLockedUntil > Date.now()) {
    els.verdictCard.innerHTML = `<div class="vcard-placeholder vcard-placeholder--loading"><div class="vcard-placeholder-icon vcard-loading-pulse">&#x26F7;</div><div class="vcard-placeholder-title">Finding your best mountain match...</div><div class="vcard-placeholder-sub">Giving the trails one last pass &mdash; your top pick will appear in just a moment.</div></div>`;
    return;
  }

  const v = computeVerdict(resorts);
  syncWeekendLodgingStrip(v);
  const _hnSectionEarly = document.getElementById('hnRunnerUpSection');
  if (!v) {
    if (refinePromptEl) refinePromptEl.hidden = true;
    document.getElementById('hnConditionsGuidance')?.remove();
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
          <div class="vcard-placeholder-sub">Your list is empty for the selected range. Widen <strong>Drive time</strong> under Refine results or pick a different starting point.</div>
        </div>`;
      } else if (!anyWx && !weatherFetchPhase1Done) {
        els.verdictCard.innerHTML = `<div class="vcard-placeholder vcard-placeholder--loading">
          <div class="vcard-placeholder-icon vcard-loading-pulse">⛷</div>
          <div class="vcard-placeholder-title">Loading live forecasts…</div>
          <div class="vcard-placeholder-sub">We're still pulling forecasts and snow totals — your pick will show up as soon as the numbers land.</div>
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
          <div class="vcard-placeholder-sub">Still filling in snow for more mountains — the list below may refresh first for places near you.</div>
        </div>`;
      } else {
        els.verdictCard.innerHTML = `<div class="vcard-placeholder">
          <div class="vcard-placeholder-icon">⛷</div>
          <div class="vcard-placeholder-title">Almost ready</div>
          <div class="vcard-placeholder-sub">Almost there — we're recalculating after the latest forecast.</div>
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
  trackRecommendation(resort.id, resort.name);
  document.getElementById('hnConditionsGuidance')?.remove();

  const _passEw   = state.passFilter !== 'All' ? (state.passFilter + ' Pass') : null;
  const _cityEw   = state.origin?.label ? state.origin.label.replace(/,.*$/, '').trim() : null;
  const _eyebrowBase = ['Top pick', _passEw, _cityEw].filter(Boolean).join(' · ').toUpperCase();
  const _eyebrowRaw  = !state.origin ? `${_eyebrowBase} · ADD YOUR TOWN` : _eyebrowBase;
  const _eyebrow     = esc(_eyebrowRaw);
  const _bookName = resort.name.replace(/\s+(Resort|Mountain|Ski\s+Area|Ski\s+Resort|Ski|Area)$/i, '').trim();

  const tierConfig = {
    great:    { label: 'Great conditions', pillClass: 'vcard-dash-pill--cond-great', dot: '#22c55e' },
    good:     { label: 'Good conditions',  pillClass: 'vcard-dash-pill--cond-good', dot: '#38bdf8' },
    marginal: { label: 'Fair conditions',    pillClass: 'vcard-dash-pill--cond-warn', dot: '#f59e0b' },
    bad:      { label: 'Rough conditions',   pillClass: 'vcard-dash-pill--cond-bad', dot: '#f87171' },
  };
  const tc = tierConfig[tier] || tierConfig.good;

  const scoreNum = breakdown ? Math.round(breakdown.score) : 0;
  const showVerdictGuidance = tier === 'bad'
    || tier === 'marginal'
    || (breakdown && scoreNum < 48 && tier !== 'great');
  const guidanceInsetHtml = showVerdictGuidance
    ? `<div class="vcard-guidance-inset" role="note" aria-label="How to improve your matches">
        <p class="vcard-guidance-inset-title">Conditions are rough right now</p>
        <p class="vcard-guidance-inset-body">Try widening your distance, easing the snow filter, or choosing a different pass.</p>
        <button type="button" class="vcard-guidance-inset-cta" id="verdictRefineGuidanceBtn">Refine results &darr;</button>
      </div>`
    : '';
  const _lodgingUrl = bookingUrl(resort);
  const lodgingModuleHtml = state.howFar === 1
    ? `<div class="vcard-lodging-module" role="region" aria-label="Lodging near ${esc(resort.name)}">
        <span class="vcard-lodging-label">Weekend trip</span>
        <p class="vcard-lodging-headline">Staying the weekend? Find lodging near your top pick</p>
        <p class="vcard-lodging-support">Hotels, condos, and ski-in properties &mdash; updated availability</p>
        <a class="vcard-lodging-cta" href="${_lodgingUrl}" target="_blank" rel="noopener sponsored" data-track-placement="verdict_lodging" data-track-resort="${esc(resort.name)}">Browse lodging &rarr;</a>
        <p class="vcard-lodging-disclosure">Affiliate link &mdash; we may earn a commission</p>
      </div>`
    : '';
  const snowPillText = typeof stormTotal === 'number' && stormTotal >= 0.5
    ? `${stormTotal.toFixed(0)}" forecast`
    : (typeof tomorrowIn === 'number' && tomorrowIn >= 0.5)
    ? `${tomorrowIn.toFixed(0)}" forecast`
    : 'Dry forecast';

  const _wxVerdict = state.weatherCache[resort.id]?.data;
  const crowdLbl = crowdForecast(resort, _wxVerdict).label;
  const crowdPill = crowdLbl === 'Quiet'
    ? '<span class="vcard-dash-pill vcard-dash-pill--crowd-low">Crowd forecast: Light</span>'
    : crowdLbl === 'Avoid'
    ? '<span class="vcard-dash-pill vcard-dash-pill--crowd-high">Crowd forecast: Packed — avoid</span>'
    : crowdLbl === 'Busy'
    ? '<span class="vcard-dash-pill vcard-dash-pill--crowd-high">Crowd forecast: Busy</span>'
    : '<span class="vcard-dash-pill vcard-dash-pill--crowd-mod">Crowd forecast: Moderate</span>';

  const zipNudgeHtml = !state.origin
    ? `<p class="vcard-zip-nudge">Enter your <strong>ZIP code</strong> or city above, then <strong>Find My Mountain</strong> — once we know where you're leaving from, this swaps to a real mountain with drive time.</p>`
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

  const verdictBadgeText = tier === 'great' ? 'Go — great conditions'
    : tier === 'good'    ? 'Go — good conditions'
    : tier === 'marginal'? 'Worth checking'
    : 'Skip this weekend';

  const verdictBadgeCls = tier === 'great' ? 'vb-verdict-badge--go'
    : tier === 'good'   ? 'vb-verdict-badge--go'
    : tier === 'marginal'? 'vb-verdict-badge--maybe'
    : 'vb-verdict-badge--skip';

  const _fitWord = fitLabel(scoreNum);
  let primaryBtn; let secondaryBtn;
  if (tier === 'great' || tier === 'good') {
    primaryBtn = resort.website
      ? `<a class="vcard-book-btn" href="${resort.website}" target="_blank" rel="noopener">Book ${esc(_bookName)} &rarr;</a>`
      : `<a class="vcard-book-btn" href="${bookingUrl(resort)}" target="_blank" rel="noopener sponsored" onclick="trackSponsorClick('${esc(resort.name)}','verdict_book_btn','${esc(resort.id)}','')" >Find lodging &rarr; <span class="affiliate-badge">affiliate</span></a>`;
    secondaryBtn = `<button type="button" class="vcard-detail-btn" id="verdictDetailBtn">Full conditions</button>`;
  } else if (tier === 'marginal') {
    primaryBtn = `<button type="button" class="vcard-book-btn" id="verdictDetailBtn">See full conditions &rarr;</button>`;
    secondaryBtn = resort.website
      ? `<a class="vcard-detail-btn" href="${resort.website}" target="_blank" rel="noopener">Visit ${esc(_bookName)}</a>`
      : '';
  } else {
    primaryBtn = `<button type="button" class="vcard-book-btn" id="verdictDetailBtn">See full conditions &rarr;</button>`;
    secondaryBtn = '';
  }

  const _isHeroDock = !!document.querySelector('.hn-hero-verdict-dock');
  const _dockHeroCls = _isHeroDock ? ' vcard-hero-dash--dock vcard-hero-dash--light' : '';
  const _vcardHeroLightCls = _isHeroDock ? ' vcard--hero-light' : '';
  const _verdictPhotoStyle = _isHeroDock ? '' : resortPhotoStyle(resort);
  const _heroDashStyleAttr = _verdictPhotoStyle ? ` style="${_verdictPhotoStyle}"` : '';

  // ── Runner-up mini strip — always-on teaser inside the verdict card ─────────
  const runnerStripHtml = runningItems.length > 0 ? (() => {
    const miniCards = runningItems.map(item => {
      const _rDrive = getDriveMins(item.resort.id) ? formatDrive(item.resort.id) : null;
      const _rWx    = state.weatherCache[item.resort.id]?.data;
      const cf      = crowdForecast(item.resort, _rWx);
      const _crowdCls = cf.label === 'Quiet' ? 'crowd-quiet-chip'
        : (cf.label === 'Avoid' || cf.label === 'Busy') ? 'crowd-busy-chip'
        : 'crowd-mod-chip';
      return `<button type="button" class="vcard-mini-runner" data-mini-runner-id="${esc(item.resort.id)}">
        <span class="vmr-name">${esc(item.resort.name)}</span>
        ${_rDrive ? `<span class="vmr-drive">${esc(_rDrive)} away</span>` : ''}
        <span class="vmr-crowd-mini ${_crowdCls}">${esc(cf.label)}</span>
      </button>`;
    }).join('');
    return `<div class="vcard-runners-strip">
      <div class="vcard-runners-header">
        <span class="vcard-runners-label">Also consider</span>
      </div>
      <div class="vcard-runners-mini">
        ${miniCards}
        <button type="button" class="vcard-runners-see-all" id="verdictSeeAllRunners">
          <span class="vcard-runners-see-all-arrow">↓</span>
          <span>See all</span>
        </button>
      </div>
    </div>`;
  })() : '';

  els.verdictCard.innerHTML = `
    <div class="vcard vcard--dash vcard--tier-${tier}${_vcardHeroLightCls}">
      <div class="vcard-hero-dash${_dockHeroCls}"${_heroDashStyleAttr}>
        <div class="vb-verdict-badge ${verdictBadgeCls}">${esc(verdictBadgeText)}</div>
        <div class="vcard-eyebrow-dash">${_eyebrow}</div>
        ${zipNudgeHtml}
        <button type="button" class="vcard-name-dash" id="verdictPickBtn">${esc(resort.name)}</button>
        <div id="verdictWriteupSlot" class="vcard-writeup vcard-writeup--dash vcard-writeup--loading"></div>
        <p class="vcard-fallback-copy" id="verdictFallbackCopy" hidden></p>
        <div class="vcard-dash-pills">
          <span class="vcard-dash-pill ${tc.pillClass}">${esc(tc.label)}</span>
          <span class="vcard-dash-pill">${esc(snowPillText)}</span>
          ${driveText ? `<span class="vcard-dash-pill">${esc(driveText)} drive</span>` : ''}
          ${crowdPill}
          <span class="vcard-score-mini-pill score-badge--tip" ${verdictBdAttr} tabindex="0" aria-label="How we ranked this pick: ${scoreNum} ${_fitWord} — tap for breakdown"><span class="vcard-score-mini-dot"></span><span class="vcard-score-mini-lbl">Fit</span><span class="vcard-score-mini-num">${scoreNum}</span><span class="vcard-score-fit-label">${esc(_fitWord)}</span></span>
        </div>
      </div>
      <div class="vcard-body vcard-body-dash">
        <div id="verdictConditionsSlot" class="verdict-conditions-slot" hidden></div>
        <div class="vcard-actions vcard-actions-dash">
          ${primaryBtn}
          ${secondaryBtn}
        </div>
        ${guidanceInsetHtml}
        ${lodgingModuleHtml}
        ${runnerStripHtml}
      </div>
       </div>`;

  if (document.getElementById('searchSection')?.classList.contains('hn-hero-split')) {
    const _dock = document.querySelector('.hn-hero-verdict-dock');
    if (_dock) {
      requestAnimationFrame(() => {
        _dock.classList.add('hn-hero-verdict-dock--pulse');
        setTimeout(() => _dock.classList.remove('hn-hero-verdict-dock--pulse'), 520);
      });
    }
  }

  const _fb = document.getElementById('verdictFallbackCopy');
  if (_fb) {
    _fb.textContent = [headline, detail, ...subPoints].filter(Boolean).join(' ');
    _fb.setAttribute('hidden', '');
  }

  $('verdictPickBtn')?.addEventListener('click', () => { state.selectedId = resort.id; trackResortView(resort.id, resort.name, 'verdict_name_click', resort.passGroup || ''); renderDetail({ scroll: true }); });
  $('verdictDetailBtn')?.addEventListener('click', () => { state.selectedId = resort.id; trackResortView(resort.id, resort.name, 'verdict_conditions_click', resort.passGroup || ''); renderDetail({ scroll: true }); });

  // Mini runner-up cards — open detail panel on click
  els.verdictCard.querySelectorAll('.vcard-mini-runner[data-mini-runner-id]').forEach(btn => {
    btn.addEventListener('click', () => {
      state.selectedId = btn.dataset.miniRunnerId;
      const _miniResort = RESORTS.find(r => r.id === btn.dataset.miniRunnerId);
      if (_miniResort) trackResortView(_miniResort.id, _miniResort.name, 'mini_runner_click', _miniResort.passGroup || '');
      renderDetail({ scroll: true });
    });
  });
  // "See all" scrolls down to the full runner-up section
  document.getElementById('verdictSeeAllRunners')?.addEventListener('click', () => {
    const run = document.getElementById('hnRunnerUpSection');
    if (run && !run.hidden) run.scrollIntoView({ behavior: 'smooth', block: 'start' });
    trackFilterEvent('engagement', 'see_all_runners');
  });
  $('verdictRefineGuidanceBtn')?.addEventListener('click', () => {
    const panel = els.plannerSection;
    if (!panel) return;
    panel.hidden = false;
    syncPlannerControls();
    setTimeout(() => { panel.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 50);
  });
  if (refinePromptEl) {
    if (showVerdictGuidance) {
      refinePromptEl.hidden = true;
    } else {
      refinePromptEl.hidden = false;
      const isUrgent = tier === 'bad' || tier === 'marginal';
      refinePromptEl.classList.toggle('hn-refine-prompt--urgent', isUrgent);
      const titleEl = document.getElementById('hnRefinePromptTitle');
      const subEl   = document.getElementById('hnRefinePromptSub');
      if (isUrgent) {
        if (titleEl) titleEl.textContent = 'Conditions are rough right now.';
        if (subEl)   subEl.textContent   = 'Try widening your distance, easing the snow filter, or picking a different pass.';
      } else {
        if (titleEl) titleEl.textContent = 'Not seeing the right mountain?';
        if (subEl)   subEl.textContent   = 'Adjust snow, crowds, ticket price or distance to find a better match.';
      }
    }
  }
  injectVerdictWriteup(v);
  injectConditionsBadge(resort.id, 'verdictConditionsSlot');

  els.verdictCard.querySelectorAll('a[data-track-placement]').forEach(a => {
    a.addEventListener('click', () => {
      trackEvent('booking_click', { placement: a.dataset.trackPlacement, resort: a.dataset.trackResort });
      trackSponsorClick(a.dataset.trackResort || '', a.dataset.trackPlacement || 'verdict_lodging', '', '');
    });
  });

  // PATCH 5: Runner-up section title — pass + proximity angle
  const _hnSection = document.getElementById('hnRunnerUpSection');
  const _hnGrid    = document.getElementById('hnRunnersGrid');
  const _hnTitle   = document.getElementById('hnRunnersTitle');
  if (_hnSection && _hnGrid) {
    const _passLabel = state.passFilter !== 'All' ? state.passFilter + ' Pass ' : '';
    const _distLabel = state.howFar === 0 ? 'within 3 hours' : state.howFar === 1 ? 'within 6 hours' : 'near';
    if (_hnTitle) {
      if (tier === 'bad') {
        _hnTitle.textContent = _cityEw
          ? `Other options near ${_cityEw} this weekend`
          : 'Other options this weekend';
        const sub = _hnSection.querySelector('.hn-results-sub');
        if (sub) {
          const stormNote = stormTotal > 0
            ? 'A storm is in the forecast — check back mid-week, conditions may improve.'
            : 'No storm systems in the next 3 days. Check back mid-week — forecasts shift fast.';
          sub.textContent = stormNote;
          sub.classList.add('hn-results-sub--expanded');
        }
      } else if (tier === 'marginal') {
        _hnTitle.textContent = _cityEw
          ? `Other options near ${_cityEw}`
          : 'Other options';
        const sub = _hnSection.querySelector('.hn-results-sub');
        if (sub) {
          sub.textContent = 'Conditions are marginal across the board — refine your preferences for a better match.';
          sub.classList.add('hn-results-sub--expanded');
        }
      } else {
        _hnTitle.textContent = (_cityEw && _passLabel)
          ? `Best ${_passLabel}mountains ${_distLabel} of ${_cityEw}`
          : _cityEw
          ? `Runner-up options near ${_cityEw}`
          : 'Runner-up options';
        const sub = _hnSection.querySelector('.hn-results-sub');
        if (sub) {
          sub.textContent = 'Solid alternatives ranked after your top pick';
          sub.classList.remove('hn-results-sub--expanded');
        }
      }
    }
    if (runningItems.length === 0) {
      _hnGrid.innerHTML = '';
      _hnSection.hidden = true;
    } else {
      _hnGrid.innerHTML = runningItems.map((item) => {
        const _rDrive = getDriveMins(item.resort.id) ? formatDrive(item.resort.id) : null;
        const _rWx    = state.weatherCache[item.resort.id]?.data;
        const _rSnow  = _rWx ? (_rWx.forecast || []).reduce((s, f) => s + (f.snow || 0), 0) : null;
        const _rScoreNum = item.breakdown != null ? Math.round(item.breakdown.score) : null;
        const _rScore = _rScoreNum != null ? _rScoreNum : '—';
        const _rFitLbl = _rScoreNum != null ? esc(fitLabel(_rScoreNum)) : '';
        const _rSponsor = getSponsor(item.resort.id);
        const _rCls     = 'hn-runner-card' + (_rSponsor ? ' hn-runner-sponsored' : '');
        const cf = crowdForecast(item.resort, item.wx);
        const _rBlurb = esc(runnerUpBlurb(_rSnow, cf, item.resort.passGroup));
        const _diff = esc(runnerDifferentiator(item, runningItems));
        const _rCtaLabel = _rSponsor?.tagline ? esc(_rSponsor.tagline) : 'Visit partner';
        const _rBookHtml = _rSponsor ? `<a class="hn-runner-book hn-runner-book--cta" href="${esc(_rSponsor.bookingUrl)}" target="_blank" rel="noopener sponsored" onclick="event.stopPropagation();trackSponsorClick('${esc(item.resort.name)}','runner_card','${esc(item.resort.id)}','')">${_rCtaLabel} →</a>` : '';
        const _rCallout = _rSponsor
          ? `<div class="hn-runner-partner-callout" role="note">
              <span class="hn-runner-partner-pill">Featured Partner</span>
              <span class="hn-runner-partner-hint">Labeled partner — your ranked order and scores are unchanged.</span>
            </div>`
          : '';
        const _crowdDotCls = cf.label === 'Quiet' ? 'hn-crowd-dot--quiet' : (cf.label === 'Avoid' || cf.label === 'Busy') ? 'hn-crowd-dot--busy' : 'hn-crowd-dot--mod';
        const _crowdChipCls = cf.label === 'Quiet' ? 'crowd-quiet-chip' : (cf.label === 'Avoid' || cf.label === 'Busy') ? 'crowd-busy-chip' : 'crowd-mod-chip';
        const _crowdChipHtml = `<div class="hn-runner-crowd-chip ${_crowdChipCls} nrc-crowd"><span class="hn-runner-crowd-dot ${_crowdDotCls}"></span>Crowd forecast: ${esc(cf.label)}</div>`;
        return `<div class="${_rCls}" data-runner-id="${esc(item.resort.id)}">
          ${_rCallout}
          <div class="nrc-body">
            <div class="nrc-state">${esc(item.resort.state)}</div>
            <div class="nrc-name hn-runner-name">${esc(item.resort.name)}</div>
            <div class="nrc-differentiator">${_diff}</div>
            <p class="hn-runner-blurb nrc-sub">${_rBlurb}</p>
            ${_crowdChipHtml}
          </div>
          <div class="hn-runner-bottom">
            <div class="hn-runner-meta">
              ${_rDrive ? `<span class="hn-runner-drive">${esc(_rDrive)} away</span>` : ''}
              <span class="hn-runner-score-pill" title="How well this spot matches your settings"><span class="hn-runner-score-dot" aria-hidden="true"></span><span class="hn-runner-score-num">${_rScore}</span>${_rFitLbl ? `<span class="vcard-score-fit-label hn-runner-score-fit-label">${_rFitLbl}</span>` : ''}</span>
            </div>
            ${_rBookHtml}
          </div>
        </div>`;
      }).join('');
      _hnGrid.querySelectorAll('[data-runner-id]').forEach(card => {
        card.addEventListener('click', () => { state.selectedId = card.dataset.runnerId; const _rc = RESORTS.find(r => r.id === card.dataset.runnerId); if (_rc) trackResortView(_rc.id, _rc.name, 'runner_card_click', _rc.passGroup || ''); renderDetail({ scroll: true }); });
      });
      _hnSection.hidden = false;
    }
  }

  // Guidance block removed — storm note is now in the runner-up section subtitle
  document.getElementById('hnConditionsGuidance')?.remove();
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
  return `You're texting a friend who skis. In 1–2 short, confident sentences say why ${resort.name} in ${resort.state} is the right call for this ski day${originStr ? ' for someone ' + originStr : ''}. Use only these facts: ${facts}. Internally the model tiers this as "${tier}" — do not say "tier", "score", or any number out of 100. No corporate filler ("leverage", "insights"). Sound like a human on a lift pass.`;
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
    liveSlot.textContent = 'Short take unavailable right now — the forecast and pick above are still live.';
    liveSlot.classList.add('vcard-writeup--fallback');
    if (fb) fb.removeAttribute('hidden');
  }
}

// ─── Summary cards ────────────────────────────────────────────────────────────
function renderSummaryCards(resorts) {
  els.summaryCards.innerHTML = [
    dbStatHtml('Mountains',   resorts.length,                                           'in the index'),
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
    <div>Snow: <strong>${c.snow.toFixed(1)}</strong></div>
    <div>How it'll ski (temp, wind, size): <strong>${c.skiability.toFixed(1)}</strong></div>
    <div>Size / type match: <strong>${c.fit.toFixed(1)}</strong></div>
    <div>Drive: <strong>${c.drive.toFixed(1)}</strong></div>
    <div>Ticket value: <strong>${c.value.toFixed(1)}</strong></div>
    <div>Crowds: <strong>${c.crowd.toFixed(1)}</strong></div>
  </div>`;
}

function bindFeaturePanelResortCards(grid, source) {
  if (!grid) return;
  grid.querySelectorAll('.planner-card--clickable[data-resort-id]').forEach(card => {
    const openDetail = () => {
      const id = card.getAttribute('data-resort-id');
      if (!id) return;
      state.selectedId = id;
      const _r = RESORTS.find(r => r.id === state.selectedId);
      if (_r) trackEvent('mountain_viewed', { mountain_name: _r.name, mountain_state: _r.state, source });
      renderDetail({ scroll: true });
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

function _renderStorm(resorts) {
  if (!els.stormGrid) return;

  // ── Loading states (no weather data yet) ──────────────────────────────────
  const enriched = resorts
    .map(r => { const wx = state.weatherCache[r.id]?.data; const storm = (wx?.forecast || []).reduce((s, f) => s + (f.snow || 0), 0); return { resort: r, wx, storm }; })
    .filter(item => item.wx)
    .sort((a, b) => b.storm - a.storm)
    .slice(0, 3); // cap at 3 — never allow a 3+1 orphan layout

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

  // ── Powder alert: update section header based on storm intensity ───────────
  const maxStorm = enriched.reduce((m, x) => Math.max(m, x.storm), 0);
  const stormSection = document.getElementById('stormSection');
  const stormTitle   = stormSection?.querySelector('.feature-title');
  const stormDesc    = stormSection?.querySelector('.feature-desc');

  // ── Empty state: no meaningful snow anywhere ───────────────────────────────
  if (maxStorm < 0.5) {
    if (stormTitle) stormTitle.textContent = 'Storm Chaser';
    if (stormDesc)  stormDesc.textContent  = 'No major storms in the next 3 days. Check back mid-week — this updates as new systems develop.';
    stormSection?.classList.remove('storm-alert-active');
    els.stormGrid.innerHTML = `<div class="storm-empty-state storm-empty-state--full">
      <div class="storm-empty-inner">
        <div class="storm-empty-icon">&#9729;</div>
        <div class="storm-empty-body">
          <p class="storm-empty-title">No major storms in the next 3 days.</p>
          <p class="storm-empty-sub">Check back mid-week — forecasts shift quickly and a storm can change the rankings overnight.</p>
        </div>
      </div>
    </div>`;
    return;
  }

  // ── Powder alert mode: real snow incoming ─────────────────────────────────
  if (maxStorm >= 6) {
    if (stormTitle) stormTitle.innerHTML = '&#10052; Powder Alert';
    if (stormDesc)  stormDesc.textContent = `${maxStorm.toFixed(0)}" incoming — these mountains have the most snow in the forecast right now.`;
    stormSection?.classList.add('storm-alert-active');
  } else if (maxStorm >= 2) {
    if (stormTitle) stormTitle.textContent = 'Storm Chaser';
    if (stormDesc)  stormDesc.textContent  = `Snow in the forecast — these are your best bets this week.`;
    stormSection?.classList.remove('storm-alert-active');
  } else {
    if (stormTitle) stormTitle.textContent = 'Storm Chaser';
    if (stormDesc)  stormDesc.textContent  = 'Light snow in the forecast — groomed conditions at best.';
    stormSection?.classList.remove('storm-alert-active');
  }

  // ── Render cards ──────────────────────────────────────────────────────────
  els.stormGrid.innerHTML = enriched.map((item, i) => {
    const id = item.resort.id;
    const nm = esc(item.resort.name);
    const forecast = item.wx.forecast || [];

    // Only show day chips with meaningful snow (> 0) — suppress zero rows
    const hasAnySnow = forecast.some(f => f.snow > 0);
    const dayChips = hasAnySnow
      ? forecast
          .filter(f => f.snow > 0)
          .map(f => `<span class="display-chip">${f.day}: ${f.snow.toFixed(1)}"</span>`)
          .join('')
      : `<span class="storm-no-snow">No new snow forecast</span>`;

    const driveStr = formatDrive(item.resort.id);

    return `<div class="planner-card planner-card--clickable ${i === 0 && maxStorm >= 6 ? 'top storm-card--alert' : i === 0 ? 'top' : ''}" data-resort-id="${id}" role="button" tabindex="0" aria-label="Full conditions for ${nm}">
      <div class="planner-title">${nm}</div>
      <div class="planner-meta">${esc(item.resort.state)} · ${esc(item.resort.passGroup)} · <strong>${item.storm.toFixed(1)}"</strong> over 3 days</div>
      <div class="storm-chip-row">${dayChips}${driveStr !== '—' ? `<span class="display-chip display-chip--drive">${esc(driveStr)}</span>` : ''}</div>
      <div class="feature-card-footer"><span class="feature-card-cta">See conditions &rarr;</span></div>
    </div>`;
  }).join('');
  bindFeaturePanelResortCards(els.stormGrid, 'storm_chaser');
}

function renderHiddenGems(resorts) {
  if (!els.hiddenGemGrid) return;
  if (!resorts.length) {
    els.hiddenGemGrid.innerHTML = '<div class="planner-card hidden-gems-empty" role="status">No picks here yet — widen your filters to see hidden gems.</div>';
    return;
  }
  const withScore = resorts.map(r => ({ r, score: hiddenGemScore(r, state.weatherCache[r.id]?.data) }));
  withScore.sort((a, b) => b.score - a.score);
  const top = withScore.slice(0, 3);
  els.hiddenGemGrid.innerHTML = top.map(({ r }) => {
    const _wxHg = state.weatherCache[r.id]?.data;
    const crowd    = crowdForecast(r, _wxHg);
    const drive    = formatDrive(r.id);
    const reasons  = [
      `${crowd.label} crowds`,
      `$${r.price} ticket`,
      `${r.vertical.toLocaleString()} ft vertical`,
      r.avgSnowfall > 150 ? `${r.avgSnowfall}" avg/yr` : null,
      drive !== '—' ? drive : null,
    ].filter(Boolean).slice(0, 4);
    const rid = r.id;
    const rnm = esc(r.name);
    return `<div class="planner-card planner-card--clickable" data-resort-id="${rid}" role="button" tabindex="0" aria-label="Full conditions for ${rnm}">
      <div class="planner-title">${rnm}</div>
      <div class="planner-meta">${esc(r.state)} · ${esc(r.passGroup)}</div>
      <div class="gem-reasons">${reasons.map(re => `<span class="display-chip">${esc(re)}</span>`).join('')}</div>
      <div class="feature-card-footer"><span class="feature-card-cta">See conditions &rarr;</span></div>
    </div>`;
  }).join('');
  bindFeaturePanelResortCards(els.hiddenGemGrid, 'hidden_gems');
}

// ─── Compare table ────────────────────────────────────────────────────────────
function renderCompareTable(resorts) {
  if (els.comparisonBody?.dataset?.prerendered === 'true') {
    els.comparisonBody.innerHTML = '';
    delete els.comparisonBody.dataset.prerendered;
  }
  const qRaw = (state.tableSearch || '').trim();
  const q = qRaw.toLowerCase();
  const w = normalizedWeights();

  const noOriginDefault = !state.origin && state.sortBy === 'planner' && !q;

  const decorated = resorts
    .filter(resort => !q || `${resort.name} ${resort.state} ${resort.passGroup}`.toLowerCase().includes(q))
    .map(resort => {
      const wx         = state.weatherCache[resort.id]?.data;
      const breakdown  = wx ? plannerScoreBreakdown(resort, wx, targetForecastIndex(), w) : null;
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

  if (displayed.length === 0) {
    const qActive = !!q;
    const title = qActive
      ? `No mountains match "${esc(qRaw)}"`
      : (resorts.length === 0 ? 'No mountains match your current filters' : 'No rows to show');
    const sub = qActive
      ? 'Try a shorter search, check spelling, or clear the search box. Filters still apply to what you see.'
      : 'Try widening distance, easing snow or price limits, or pick another pass.';
    els.resultCount.textContent = qActive ? `0 results for "${qRaw}"` : (resorts.length === 0 ? '0 mountains' : '0 in this view');
    els.comparisonBody.innerHTML = `
      <tr><td colspan="9" class="compare-empty-state">
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
    if (els.compareLocationHint) {
      els.compareLocationHint.innerHTML = '';
      els.compareLocationHint.hidden = true;
    }
    renderMobileCards([], { mode: 'empty', qActive, resortsLen: resorts.length });
    return;
  }

  if (els.compareLocationHint) {
    if (noOriginDefault) {
      els.compareLocationHint.hidden = false;
      els.compareLocationHint.innerHTML = `
        <div class="compare-location-hint-inner">
          <span class="compare-location-icon" aria-hidden="true"><svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 21s7-4.35 7-10a7 7 0 10-14 0c0 5.65 7 10 7 10z" stroke="currentColor" stroke-width="1.75"/><circle cx="12" cy="11" r="2.25" stroke="currentColor" stroke-width="1.75"/></svg></span>
          <p class="compare-location-copy"><strong>Add your start point</strong> — we rank by live snow, drive time, and your pass using your location from the search bar above.</p>
          <button type="button" class="compare-location-btn">Set location</button>
        </div>`;
      const _locBtn = els.compareLocationHint.querySelector('.compare-location-btn');
      _locBtn?.addEventListener('click', () => {
        document.getElementById('originInput')?.focus();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    } else {
      els.compareLocationHint.innerHTML = '';
      els.compareLocationHint.hidden = true;
    }
  }

  els.comparisonBody.innerHTML = displayed.map(({ resort, breakdown, stormTotal, hist }, idx) => {
    const wx = state.weatherCache[resort.id]?.data;
    const crowd    = crowdForecast(resort, wx).label;
    const driveMins = getDriveMins(resort.id);
    const driveCls = driveMins == null ? '' : driveMins <= 90 ? 'compare-drive--near' : driveMins <= 150 ? 'compare-drive--mid' : 'compare-drive--far';

    const vd = (wx && breakdown) ? verdictFromBreakdown(resort, wx, breakdown) : null;
    const weekendLine = vd?.rainLikely
      ? 'Rain likely — not worth the drive'
      : (stormTotal !== null && stormTotal >= 6)
      ? `${stormTotal.toFixed(0)}" incoming`
      : (hist?.total != null && hist.total >= 6)
      ? `Good base, dry forecast`
      : (stormTotal !== null && stormTotal >= 1)
      ? `${stormTotal.toFixed(0)}" coming — mostly groomers`
      : (stormTotal !== null)
      ? `Dry forecast — expect firm`
      : 'Loading forecast…';

    const crowdWord = crowd === 'Quiet' ? 'Quiet'
                    : crowd === 'Busy'  ? 'Busy'
                    : crowd === 'Avoid' ? 'Avoid'
                    : 'Moderate';

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
        <td class="compare-rank-cell"><span class="compare-rank" aria-hidden="true">${idx + 1}</span></td>
        <td class="compare-select-cell"><input type="checkbox" data-compare="${resort.id}" ${state.compareSet.has(resort.id) ? 'checked' : ''} /></td>
        <td>
          <div class="table-mountain-cell">
            <div class="table-mountain-name-row">
              <a class="row-name row-name--report" href="/ski-report/${esc(resort.id)}/" onclick="event.stopPropagation()">${esc(resort.name)}</a>
              ${_sp ? '<span class="table-featured-pill" title="Advertising partner — does not change rank or score">Featured Partner</span>' : ''}
            </div>
            <div class="row-sub">${esc(resort.state)}</div>
          </div>
        </td>
        <td class="compare-weekend">${esc(weekendLine)}</td>
        <td class="compare-drive ${driveCls}">${esc(formatDrive(resort.id))}</td>
        <td>${esc(resort.passGroup)}</td>
        <td class="${crowdClass(crowd)}">${esc(crowdWord)}</td>
        <td>$${resort.price}</td>
        <td>
          <a class="table-lodging-link" href="${bookingUrl(resort)}" target="_blank" rel="noopener sponsored" data-track-placement="table_row" data-track-resort="${esc(resort.name)}" onclick="event.stopPropagation();trackSponsorClick('${esc(resort.name)}','mobile_stay','${esc(resort.id)}','')">Stay nearby <span class="affiliate-badge">affiliate</span></a>
        </td>
      </tr>`;
  }).join('');

  renderMobileCards(displayed);

  els.comparisonBody.querySelectorAll('a[data-track-placement="table_row"]').forEach(a => {
    a.addEventListener('click', () => {
      trackEvent('booking_click', { placement: 'table_row', resort: a.dataset.trackResort });
      trackSponsorClick(a.dataset.trackResort || '', 'table_row', '', '');
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
    ['Fit',          r => { const wx = state.weatherCache[r.id]?.data; if (!wx) return '—'; return Math.round(plannerScoreBreakdown(r, wx, targetForecastIndex(), w).baseScore); }],
    ['Crowd',        r => crowdForecast(r, state.weatherCache[r.id]?.data).label],
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

  const aiBox = document.getElementById('compareAiBox');
  if (aiBox) {
    aiBox.innerHTML = '<div class="ai-thinking">Analyzing your mountains…</div>';
    const payload = resorts.map(r => ({
      name: r.name, state: r.state, vertical: r.vertical, trails: r.trails,
      price: r.price, avgSnowfall: r.avgSnowfall, crowds: crowdForecast(r, state.weatherCache[r.id]?.data).label,
      drive: getDriveMins(r.id), passGroup: r.passGroup,
      plannerScore: (() => { const wx = state.weatherCache[r.id]?.data; return wx ? Math.round(plannerScoreBreakdown(r, wx, targetForecastIndex(), w).score) : null; })(),
    }));
    fetch('/api/recommend', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ resorts: payload }) })
      .then(r => r.json())
      .then(data => {
        if (data.error) throw new Error(data.error);
        const safeText = esc(data.recommendation || 'No recommendation returned.');
        aiBox.innerHTML = `<div class="ai-verdict-inner"><div class="ai-verdict-text">${safeText.replace(/\n/g, '<br>')}</div></div>`;
      })
      .catch(err => {
        aiBox.innerHTML = `<div class="ai-thinking muted">AI recommendation unavailable — ${esc(err.message)}</div>`;
      });
  }
  els.comparePanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ─── Detail card ────────────────────────────────────────────────────────────
function renderDetail({ scroll = false } = {}) {
  const resort = RESORTS.find(r => r.id === state.selectedId);
  if (!resort) {
    els.detailSection.classList.add('hidden');
    return;
  }
  els.detailSection.classList.remove('hidden');
  trackResortView(resort.id, resort.name, 'detail_open', resort.passGroup || '');

  const wx    = state.weatherCache[resort.id]?.data;
  const w    = normalizedWeights();
  const bd   = wx ? plannerScoreBreakdown(resort, wx, targetForecastIndex(), w) : null;
  const vd   = (wx && bd) ? verdictFromBreakdown(resort, wx, bd) : null;
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
  const crowd = crowdForecast(resort, wx);
  const tb    = resort.terrainBreakdown;

  const forecast = wx?.forecast || [];
  const fi       = targetForecastIndex();
  const stormTotal = forecast.reduce((s, f) => s + (f.snow || 0), 0);
  const hist  = historyCache.get(resort.id);
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

  const dhrDrivePart = getDriveMins(resort.id) ? `${formatDrive(resort.id)} away` : null;
  const dhrStatsLine = [
    `${resort.vertical.toLocaleString()} ft vertical`,
    `${resort.trails} trails`,
    `$${resort.price} day ticket*`,
    dhrDrivePart,
  ].filter(Boolean).join(' · ');

  const dhrSnowPillText = typeof stormTotal === 'number' && stormTotal >= 0.5
    ? `${stormTotal.toFixed(0)}" forecast`
    : (forecast[fi] && typeof forecast[fi].snow === 'number' && forecast[fi].snow >= 0.5)
    ? `${forecast[fi].snow.toFixed(0)}" forecast`
    : 'Dry forecast';

  const dhrCrowdPill = crowd.label === 'Quiet'
    ? '<span class="vcard-dash-pill vcard-dash-pill--crowd-low">Crowd forecast: Light</span>'
    : crowd.label === 'Avoid'
    ? '<span class="vcard-dash-pill vcard-dash-pill--crowd-high">Crowd forecast: Packed</span>'
    : crowd.label === 'Busy'
    ? '<span class="vcard-dash-pill vcard-dash-pill--crowd-high">Crowd forecast: Busy</span>'
    : '<span class="vcard-dash-pill vcard-dash-pill--crowd-mod">Crowd forecast: Moderate</span>';

  const dhrTierPillClass = vd
    ? ({ great: 'vcard-dash-pill--cond-great', good: 'vcard-dash-pill--cond-good', marginal: 'vcard-dash-pill--cond-warn', bad: 'vcard-dash-pill--cond-bad' }[vd.tier] || 'vcard-dash-pill--cond-good')
    : '';
  const dhrCondPill = vd ? `<span class="vcard-dash-pill ${dhrTierPillClass}">${esc(vd.label)}</span>` : '';

  const dhrVerdictHtml = vd
    ? esc(vd.detail) + (vd.subPoints && vd.subPoints.length ? ' ' + vd.subPoints.map(p => esc(p)).join(' ') : '')
    : wx
    ? esc('Forecast-driven pick for this mountain.')
    : esc('Loading forecast…');

  const dhrFitPill = skis
    ? `<span class="dhr-fit-pill score-badge--tip" ${detailBdAttr} tabindex="0" aria-label="Fit score ${skis.skiScore} — tap for breakdown"><span class="dhr-fit-pill-dot" aria-hidden="true"></span><span class="dhr-fit-pill-num">${skis.skiScore}</span></span>`
    : '';

  const detailWatchSentence = !vd
    ? 'Forecasts can shift inside 24 hours — peek out the window before you commit.'
    : vd.rainLikely
    ? 'Rain is likely at this elevation — expect wet, sloppy snow.'
    : vd.tier === 'bad' && !vd.rainLikely
    ? 'Very little new snow in the forecast — you are mostly skiing whatever is already on the hill.'
    : resort.price >= 175
    ? 'Ticket is on the steep side — worth it if the day delivers.'
    : 'Forecasts can shift inside 24 hours — peek out the window before you commit.';

  const whyProseHtml = (wx && bd)
    ? preferenceReasons(resort, wx, bd)
      .map(p => {
        const t = String(p).trim();
        return /[.!?…]$/.test(t) ? esc(t) : esc(t) + '.';
      })
      .join(' ')
    : esc('Still pulling forecast data — check back in a moment.');

  const decisionProseHtml = (wx && vd)
    ? esc(vd.detail) + ' Watch: ' + esc(detailWatchSentence)
    : wx
    ? esc('Once the forecast loads, we will spell out the conditions call here.')
    : esc('Loading…');

  const crowdFootText = `${crowd.label} outlook — ${crowd.reasons.length ? crowd.reasons[0] : crowd.confidence}`;
  const crowdFootHtml = esc(crowdFootText);

  // PATCH 4: Use resort-specific photo in detail panel hero
  const _detailPhotoStyle = resortPhotoStyle(resort, 'linear-gradient(180deg, rgba(10, 20, 35, 0.52) 0%, rgba(10, 20, 35, 0.78) 100%)');

  els.detailCard.innerHTML = `
<div class="detail-card-inner">

  <div class="dhr" style="${_detailPhotoStyle}">
    <p class="dhr-eyebrow">${esc(resort.state)} · ${esc(resort.passGroup)}${resort.region ? ' · ' + esc(resort.region) : ''}</p>
    <h2 class="dhr-name">${esc(resort.name)}</h2>
    <p class="dhr-stats">${esc(dhrStatsLine)}</p>
    ${sponsor?.tagline ? `<p class="dhr-tagline">${esc(sponsor.tagline)}</p>` : ''}
    <p class="dhr-verdict">${dhrVerdictHtml}</p>
    <div class="vcard-dash-pills">
      ${dhrCondPill}
      ${wx ? `<span class="vcard-dash-pill">${esc(dhrSnowPillText)}</span>` : ''}
      ${dhrCrowdPill}
      ${dhrFitPill}
    </div>
    <div class="dhr-actions">
      <a class="dhr-btn-primary" href="/ski-report/${esc(reportSlug)}/">See full report →</a>
      ${sponsor ? `<a class="dhr-book" href="${esc(sponsor.bookingUrl)}" target="_blank" rel="noopener noreferrer" onclick="trackSponsorClick('${esc(resort.name)}','detail_panel','${esc(resort.id)}','')">Book now →</a>` : ''}
      ${resort.website ? `<a class="dhr-btn-ghost" href="${esc(resort.website)}" target="_blank" rel="noopener noreferrer">Visit website ↗</a>` : ''}
    </div>
    <div id="detailConditionsSlot" class="dhr-cond-slot" hidden></div>
  </div>

  <div class="detail-body-panel">

    <div class="detail-body-block">
      <p class="detail-why-prose">${whyProseHtml}</p>
    </div>

    <div class="detail-body-block">
      <p class="detail-decision-prose">${decisionProseHtml}</p>
      <p class="detail-crowd-foot">${crowdFootHtml}</p>
    </div>

    <div class="detail-body-block">
      <div style="display:flex;align-items:baseline;justify-content:space-between;margin-bottom:12px">
        <div style="font-size:11px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:var(--muted)">Next 3 days</div>
        ${hist ? `<div style="font-size:12px;color:var(--muted)">7-day base: <strong style="color:var(--text)">${hist.total}"</strong></div>` : ''}
      </div>
      ${wx ? forecast.map(f => {
        const maxSnow = Math.max(...forecast.map(x => x.snow), 1);
        const pct = Math.round((f.snow / maxSnow) * 100);
        return `<div style="display:grid;grid-template-columns:40px 52px 1fr auto;align-items:center;gap:12px;margin-bottom:10px">
          <div style="font-size:14px;font-weight:500;color:var(--text)">${f.day}</div>
          <div style="font-size:15px;font-weight:600;color:${f.snow >= 1 ? 'var(--accent)' : 'var(--muted)'}">${f.snow.toFixed(1)}"</div>
          <div style="height:4px;background:var(--border);border-radius:999px;overflow:hidden"><div style="width:${pct}%;height:100%;background:var(--accent);border-radius:999px"></div></div>
          <div style="font-size:12px;color:var(--muted);white-space:nowrap">${f.lo}°–${f.hi}°F · ${f.wind || 0} mph</div>
        </div>`;
      }).join('') : '<div style="font-size:13px;color:var(--muted)">Loading forecast…</div>'}
    </div>

    <div class="detail-body-block">
      <div style="font-size:11px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:var(--muted);margin-bottom:12px">Mountain</div>
      ${[
        ['Vertical', resort.vertical.toLocaleString() + ' ft'],
        ['Trails', resort.trails + ' trails'],
        ['Terrain', Math.round(tb.beginner*100)+'% beginner · '+Math.round(tb.intermediate*100)+'% intermediate · '+Math.round(tb.advanced*100)+'% advanced'],
        ['Base / Summit', resort.baseElevation.toLocaleString()+' / '+resort.summitElevation.toLocaleString()+' ft'],
        ['Avg snowfall', resort.avgSnowfall+'"'],
        ['Day ticket*', '$'+resort.price + (resort.passGroup !== 'Independent' ? ' · ' + esc(resort.passGroup) + ' pass access' : '')],
        ['Night skiing', resort.night ? 'Yes' : 'No'],
        ['Terrain park', resort.terrainPark ? 'Yes' : 'No'],
      ].map(([k,v]) => `<div style="display:flex;justify-content:space-between;align-items:baseline;padding:9px 0;border-bottom:1px solid var(--border);font-size:14px">
        <span style="color:var(--muted)">${k}</span>
        <span style="font-weight:500;color:var(--text);text-align:right;max-width:60%">${v}</span>
      </div>`).join('')}
      <div style="padding:9px 0;font-size:12px;color:var(--muted)">*Prices vary by date and promotions.</div>
    </div>

    <div class="detail-body-block detail-body-block--last">
      <div style="font-size:11px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:var(--muted);margin-bottom:14px">Terrain breakdown</div>
      ${[['Beginner', tb.beginner], ['Intermediate', tb.intermediate], ['Advanced', tb.advanced]].map(([lbl, pct]) => `
        <div style="display:grid;grid-template-columns:96px 1fr 36px;align-items:center;gap:10px;margin-bottom:10px">
          <div style="font-size:13px;color:var(--muted)">${lbl}</div>
          <div style="height:5px;background:var(--border);border-radius:999px;overflow:hidden"><div style="width:${Math.round(pct*100)}%;height:100%;background:var(--accent);border-radius:999px"></div></div>
          <div style="font-size:12px;color:var(--muted);text-align:right">${Math.round(pct*100)}%</div>
        </div>`).join('')}
    </div>

  </div>

</div>`;

  if (scroll) els.detailSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  if (resort) pushReportUrl(resort);
  injectConditionsBadge(resort.id, 'detailConditionsSlot');
}

// ─── AI Chat ──────────────────────────────────────────────────────────────────
async function askAI(query) {
  if (!query.trim() || aiChatLoading) return;

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
    const fi      = targetForecastIndex();
    const snow3d  = wx ? (wx.forecast || []).reduce((s, f) => s + (f.snow || 0), 0) : null;
    const bd      = wx ? plannerScoreBreakdown(r, wx, fi, w) : null;
    return {
      id: r.id, name: r.name, state: r.state, vertical: r.vertical, trails: r.trails,
      price: r.price, passGroup: r.passGroup, avgSnowfall: r.avgSnowfall,
      drive: getDriveMins(r.id), crowd: crowdForecast(r, wx).label,
      snow3d: snow3d !== null ? Math.round(snow3d * 10) / 10 : null,
      tomorrowSnow: wx?.forecast?.[fi]?.snow ?? null,
      tomorrowLow:  wx?.forecast?.[fi]?.lo   ?? null,
      tomorrowHigh: wx?.forecast?.[fi]?.hi   ?? null,
      tomorrowWind: wx?.forecast?.[fi]?.wind ?? null,
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
      <span aria-hidden="true">📍</span>
      <span>Add your start location to rank by live snow and drive time.</span>
      <button type="button" onclick="document.getElementById('originInput')?.focus();window.scrollTo({top:0,behavior:'smooth'})">Set location</button>
    </div>` : '';
  els.mobileCardGrid.innerHTML = nudgeHtml + items.map(({ resort, breakdown, stormTotal, hist }) => {
    const wx = state.weatherCache[resort.id]?.data;
    const storm     = stormTotal !== null ? stormTotal.toFixed(1) + '"' : '…';
    const drive     = formatDrive(resort.id);
    const crowd     = crowdForecast(resort, wx).label;
    const passColor = passColors[resort.passGroup] || '#90a4be';
    const driveMins = getDriveMins(resort.id);
    const driveCls = driveMins == null ? '' : driveMins <= 90 ? 'compare-drive--near' : driveMins <= 150 ? 'compare-drive--mid' : 'compare-drive--far';

    const vd = (wx && breakdown) ? verdictFromBreakdown(resort, wx, breakdown) : null;
    const weekendLine = vd?.rainLikely
      ? 'Rain likely — not worth the drive'
      : (stormTotal !== null && stormTotal >= 6)
      ? `${stormTotal.toFixed(0)}" incoming`
      : (hist?.total != null && hist.total >= 6)
      ? `Good base, dry forecast`
      : (stormTotal !== null && stormTotal >= 1)
      ? `${stormTotal.toFixed(0)}" coming — mostly groomers`
      : (stormTotal !== null)
      ? `Dry forecast — expect firm`
      : 'Loading forecast…';

    const crowdWord = crowd === 'Quiet' ? 'Quiet' : crowd === 'Busy' ? 'Busy' : crowd === 'Avoid' ? 'Avoid' : 'Moderate';
    const _mobSp = getSponsor(resort.id);
    const _mobPartnerBanner = _mobSp
      ? `<div class="mob-featured-banner" role="note">
          <span class="table-featured-pill">Featured Partner</span>
          <span class="mob-featured-hint">Does not change rank or score</span>
          <a class="mob-partner-cta" href="${esc(_mobSp.bookingUrl)}" target="_blank" rel="noopener sponsored" onclick="event.stopPropagation();trackSponsorClick('${esc(resort.name)}','mobile_card','${esc(resort.id)}','')">${esc(_mobSp.tagline || 'Visit partner')} →</a>
        </div>`
      : '';
    return `<div class="mob-card${resort.id === state.selectedId ? ' mob-card-selected' : ''}${_mobSp ? ' mob-card-sponsored' : ''}" data-mob-id="${resort.id}" role="button" tabindex="0" aria-label="${esc(resort.name)}">
      <div class="mob-card-top">
        <div class="mob-card-name">${esc(resort.name)}</div>
        <span class="mob-chip mob-chip--pass" style="background:${passColor}22;color:${passColor};border-color:${passColor}44">${esc(resort.passGroup)}</span>
      </div>
      ${_mobPartnerBanner}
      <p class="mob-card-conditions">${esc(weekendLine)}</p>
      <p class="mob-card-drive ${driveCls}">${drive !== '—' ? `${esc(drive)} in the car` : 'Add your start location for drive time'}</p>
      <div class="mob-card-meta">
        <span class="mob-meta-state">${esc(resort.state)}</span>
        <span class="mob-meta-divider">·</span>
        <span class="mob-meta-crowd ${crowdClass(crowd)}">${esc(crowdWord)} lift lines</span>
        <span class="mob-meta-divider">·</span>
        <span class="mob-meta-price">$${resort.price} walk-up</span>
        <span class="mob-meta-divider">·</span>
        <span class="mob-meta-snow">${esc(storm)} forecast</span>
      </div>
      <div class="mob-card-footer">
        <label class="mob-compare-label"><input type="checkbox" data-compare="${resort.id}" ${state.compareSet.has(resort.id) ? 'checked' : ''} /> Compare</label>
        <div class="mob-card-actions">
          ${resort.website ? `<a class="mob-website-btn" href="${resort.website}" target="_blank" rel="noopener noreferrer" onclick="event.stopPropagation()">Website</a>` : ''}
          <a class="mob-stay-btn" href="${bookingUrl(resort)}" target="_blank" rel="noopener sponsored" data-track-placement="table_row" data-track-resort="${esc(resort.name)}" onclick="event.stopPropagation()">Stay nearby <span class="affiliate-badge">affiliate</span></a>
          <button type="button" class="mob-card-detail-btn" data-mob-detail="${resort.id}">Details →</button>
        </div>
      </div>
    </div>`;
  }).join('');
}

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
function repaintMainUI(resorts) {
  renderSummaryCards(resorts);
  renderActiveFilters();
  renderHiddenGems(resorts);
  renderCompareTable(resorts);
  renderCompareTray();
  renderDetail();
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
    verdictLockedUntil = Date.now() + 5000;
    if (verdictLockTimer) clearTimeout(verdictLockTimer);
    verdictLockTimer = setTimeout(function () {
      verdictLockTimer = null;
      repaintMainUI(filteredResorts());
    }, 5100);
  }
  repaintMainUI(resorts);
  renderAsyncPanels(resorts);
}

function render() { renderAllCards(filteredResorts()); }
const debouncedRender = debounce(render, 50);

// ─── Resort view tracker ──────────────────────────────────────────────────────
// Call when a resort detail panel opens. action = 'detail_open' | 'card_click'
var _lastResortViewKey = null;

function trackResortView(resortId, resortName, action, passGroup) {
  // Only log when the viewed resort actually changes
  const viewKey = resortId + '|' + action;
  if (viewKey === _lastResortViewKey) return;
  _lastResortViewKey = viewKey;

  const sessionId = (function () {
    try {
      let id = sessionStorage.getItem('wsn_session');
      if (!id) { id = Math.random().toString(36).slice(2); sessionStorage.setItem('wsn_session', id); }
      return id;
    } catch (e) { return 'unknown'; }
  })();

  fetch('/api/track-resort-view', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      resort_id:   resortId   || '',
      resort_name: resortName || '',
      action:      action     || 'detail_open',
      pass_group:  passGroup  || '',
      session_id:  sessionId
    })
  }).catch(function () {});
}

// ─── Recommendation event tracker ─────────────────────────────────────────────
// Call when the verdict card surfaces a top-pick resort
// Debounce timer and last-logged key for recommendation deduplication
var _recommendDebounceTimer = null;
var _lastRecommendedKey     = null;

function trackRecommendation(resortId, resortName) {
  const passMap     = { All: 'Any', Epic: 'Epic', Ikon: 'Ikon', Indy: 'Indy' };
  const tripMap     = { 0: 'Day trip', 1: 'Weekend', 2: 'Any distance' };
  const priorityMap = { 1: 'Best fit', 5: 'Quiet slopes', 10: 'Fresh snow' };
  const snowVal     = (state.weights && state.weights.snow) ? state.weights.snow : 1;

  // Build a key representing the full recommendation state
  const stateKey = [resortId, state.passFilter, state.howFar, state.skiDayPreset, snowVal, state.origin && state.origin.label].join('|');

  // Skip entirely if nothing changed since last logged row
  if (stateKey === _lastRecommendedKey) return;

  // Debounce: renderVerdict fires on every weather update — wait 2s for things to settle
  if (_recommendDebounceTimer) clearTimeout(_recommendDebounceTimer);

  _recommendDebounceTimer = setTimeout(function () {
    _recommendDebounceTimer = null;

    // Check again after debounce in case state changed while waiting
    const currentKey = [resortId, state.passFilter, state.howFar, state.skiDayPreset, snowVal, state.origin && state.origin.label].join('|');
    if (currentKey === _lastRecommendedKey) return;
    _lastRecommendedKey = currentKey;

    const sessionId = (function () {
      try {
        let id = sessionStorage.getItem('wsn_session');
        if (!id) { id = Math.random().toString(36).slice(2); sessionStorage.setItem('wsn_session', id); }
        return id;
      } catch (e) { return 'unknown'; }
    })();

    fetch('/api/track-recommendation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        top_resort_id:   resortId   || '',
        top_resort_name: resortName || '',
        pass_filter:     passMap[state.passFilter]  || state.passFilter  || 'Any',
        trip_type:       tripMap[state.howFar]      || String(state.howFar),
        ski_day:         state.skiDayPreset         || 'weekday',
        priority:        priorityMap[snowVal]       || String(snowVal),
        origin_label:    (state.origin && state.origin.label) || '',
        session_id:      sessionId
      })
    }).catch(function () {});
  }, 2000); // wait 2s after last render before logging
}

// ─── Filter event tracker ─────────────────────────────────────────────────────
function trackFilterEvent(filterType, filterValue) {
  const sessionId = (function () {
    try {
      let id = sessionStorage.getItem('wsn_session');
      if (!id) { id = Math.random().toString(36).slice(2); sessionStorage.setItem('wsn_session', id); }
      return id;
    } catch (e) { return 'unknown'; }
  })();

  fetch('/api/track-filter', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      filter_type:  filterType  || '',
      filter_value: filterValue || '',
      session_id:   sessionId
    })
  }).catch(function () {}); // silent fail — never interrupt the UI
}

// ─── Log all current filter state on Find My Mountain click ──────────────────
function logCurrentFilters() {
  var passMap     = { All: 'Any', Epic: 'Epic', Ikon: 'Ikon', Indy: 'Indy' };
  var tripMap     = { 0: 'Day trip', 1: 'Weekend', 2: 'Any distance' };
  var priorityMap = { 1: 'Best fit', 5: 'Quiet slopes', 10: 'Fresh snow' };
  var snowVal     = (state.weights && state.weights.snow) ? state.weights.snow : 1;

  var filters = [
    { type: 'heroPassSelect',   value: passMap[state.passFilter]  || state.passFilter  || 'Any' },
    { type: 'heroSentenceTrip', value: tripMap[state.howFar]      || String(state.howFar)        },
    { type: 'heroSentenceDay',  value: state.skiDayPreset         || 'weekday'                   },
    { type: 'heroSnowSelect',   value: priorityMap[snowVal]       || String(snowVal)             },
  ];

  filters.forEach(function(f, i) {
    setTimeout(function() { trackFilterEvent(f.type, f.value); }, i * 150);
  });
}

// ─── Hero pill filters ────────────────────────────────────────────────────────
function wireHeroPills() {
  document.querySelectorAll('.hn-hero-pills[data-pill-target]').forEach(group => {
    const targetEl = document.getElementById(group.dataset.pillTarget);
    if (!targetEl) return;
    group.querySelectorAll('.hn-hero-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        group.querySelectorAll('.hn-hero-pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        targetEl.value = pill.dataset.value;
        targetEl.dispatchEvent(new Event('change', { bubbles: true }));
        // Map raw data-values to human-readable labels before logging
        const _pillLabelMap = {
          heroSentenceTrip: { '0': 'Day trip', '1': 'Weekend', '2': 'Any distance' },
          heroSnowSelect:   { '1': 'Best fit', '5': 'Quiet slopes', '10': 'Fresh snow' },
          heroSentenceDay:  { 'weekday': 'Weekday', 'friday': 'Friday', 'saturday': 'Saturday', 'sunday': 'Sunday' },
          heroPassSelect:   { 'All': 'Any', 'Epic': 'Epic', 'Ikon': 'Ikon', 'Indy': 'Indy' },
        };
        const _rawVal = pill.dataset.value;
        const _mappedVal = (_pillLabelMap[group.dataset.pillTarget] || {})[_rawVal] || _rawVal;
        trackFilterEvent(group.dataset.pillTarget, _mappedVal);
      });
    });
  });
}

function syncHeroPills() {
  document.querySelectorAll('.hn-hero-pills[data-pill-target="heroPassSelect"] .hn-hero-pill').forEach(p => {
    p.classList.toggle('active', p.dataset.value === (state.passFilter || 'All'));
  });
  document.querySelectorAll('.hn-hero-pills[data-pill-target="heroSentenceTrip"] .hn-hero-pill').forEach(p => {
    p.classList.toggle('active', p.dataset.value === String(state.howFar));
  });
  document.querySelectorAll('.hn-hero-pills[data-pill-target="heroSnowSelect"] .hn-hero-pill').forEach(p => {
    p.classList.toggle('active', p.dataset.value === String(state.weights?.snow ?? 1));
  });
  document.querySelectorAll('.hn-hero-pills[data-pill-target="heroSentenceDay"] .hn-hero-pill').forEach(p => {
    p.classList.toggle('active', p.dataset.value === (state.skiDayPreset || 'weekday'));
  });
}

// ─── Event wiring ─────────────────────────────────────────────────────────────
function wireEvents() {
  wireHeroPills();
  // Weekend lodging strip affiliate tracking
  document.addEventListener('click', function(e) {
    const btn = e.target.closest('a.hn-booking-btn');
    if (!btn) return;
    const verdict = computeVerdict(filteredResorts());
    const resortName = verdict && verdict.resort ? verdict.resort.name : '';
    const resortId   = verdict && verdict.resort ? verdict.resort.id   : '';
    trackSponsorClick(resortName, 'weekend_lodging_strip', resortId, '');
  });
  if (els.aiChatBtn) els.aiChatBtn.addEventListener('click', () => { const q = els.aiChatInput?.value?.trim(); if (q) { trackEvent('ai_chat_used', { query: q }); trackFilterEvent('ai_chat_query', q); askAI(q); } });
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
    if (els.heroPassSelect) els.heroPassSelect.value = state.passFilter;
    trackEvent('pass_selected', { pass_type: String(state.passFilter), source: 'compare_filter' });
    savePlannerState(); syncPlannerControls(); pushUrlDebounced(); render();
  });
  els.stateFilter.addEventListener('change', e => {
    state.stateFilter = e.target.value;
    trackEvent('filter_applied', { filter_type: 'state', filter_value: String(e.target.value) });
    trackFilterEvent('planner_state', String(e.target.value));
    pushUrlDebounced(); render();
  });

  const _howFarEl = document.getElementById('howFarFilter');
  if (_howFarEl) _howFarEl.addEventListener('change', e => {
    state.howFar = Number(e.target.value);
    const _distLabel = Number(e.target.value) === 0 ? 'Day trip' : Number(e.target.value) === 1 ? 'Weekend' : 'Any distance';
    trackEvent('filter_applied', { filter_type: 'distance', filter_value: String(e.target.value) });
    trackFilterEvent('planner_distance', _distLabel);
    if (state.howFar < 2 && !state.origin) showToast('Add your starting location to activate distance filtering', 4000);
    pushUrlDebounced(); syncPlannerControls(); render();
  });

  if (els.maxPriceFilter) els.maxPriceFilter.addEventListener('change', e => {
    state.priceRange = Number(e.target.value);
    pushUrlDebounced(); render();
  });
  els.sortBy.addEventListener('change', e => {
    state.sortBy = e.target.value;
    pushUrlDebounced(); render();
  });
  els.toggleNight.addEventListener('click', () => {
    state.nightOnly = !state.nightOnly;
    els.toggleNight.setAttribute('aria-pressed', String(state.nightOnly));
    els.toggleNight.textContent = state.nightOnly ? '✓ On' : 'Off';
    pushUrlDebounced(); render();
  });

  if (els.plannerDetails) els.plannerDetails.hidden = false;

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

  els.resetFilters.addEventListener('click', () => {
    state.search = ''; state.passFilter = 'All'; state.stateFilter = 'All';
    state.sortBy = 'planner'; state.tempBucket = 'any'; state.windBucket = 'any';
    state.nightOnly = false; state.priceRange = 0;
    state.howFar = 0; state.verticalFilter = 'any';
    state.weights = { ...DEFAULT_WEIGHTS };
    state.passPreference = 'any'; state.tableSearch = ''; state.tableViewAll = false;
    state.skiDayPreset = smartDefaultWhenVal();
    state.targetDate = dayValToDate(state.skiDayPreset);
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

  els.plannerDetails?.addEventListener('click', e => {
    const btn = e.target.closest('.priority-btn');
    if (!btn || !els.plannerDetails.contains(btn)) return;
    const key = btn.closest('.priority-btns')?.dataset.key;
    if (!key) return;
    commitPlannerPriorityChange(key, btn);
  });

  els.hnRefinePromptBtn?.addEventListener('click', () => {
    const panel = els.plannerSection;
    if (!panel) return;
    panel.hidden = false;
    syncPlannerControls();
    setTimeout(() => { panel.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 50);
  });

  els.plannerSeeVerdictBtn?.addEventListener('click', () => scrollToBestMatchFromFilters('refine_footer'));

  document.querySelectorAll('.pass-pref-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      state.passPreference = btn.dataset.pass;
      state.passFilter = btn.dataset.pass === 'any' ? 'All' : btn.dataset.pass;
      trackFilterEvent('planner_pass', btn.textContent.trim() || btn.dataset.pass || '');
      savePlannerState(); syncPlannerControls(); pushUrlDebounced(); debouncedRender();
    });
  });

  if (els.heroPassSelect) {
    els.heroPassSelect.addEventListener('change', () => {
      state.passFilter = els.heroPassSelect.value || 'All';
      state.passPreference = state.passFilter === 'All' ? 'any' : state.passFilter;
      if (els.passFilter) els.passFilter.value = state.passFilter;
      savePlannerState(); syncPlannerControls(); pushUrlDebounced(); debouncedRender();
    });
  }
  const _heroTrip = document.getElementById('heroSentenceTrip');
  if (_heroTrip) {
    _heroTrip.addEventListener('change', e => {
      const v = e.target.value;
      const hf = document.getElementById('howFarFilter');
      if (hf) {
        hf.value = v;
        hf.dispatchEvent(new Event('change', { bubbles: true }));
      }
    });
  }
  if (els.heroSnowSelect) {
    els.heroSnowSelect.addEventListener('change', () => {
      state.weights.snow = Number(els.heroSnowSelect.value || 1);
      savePlannerState(); syncPlannerControls(); pushUrlDebounced(); debouncedRender();
    });
  }

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

  // Score breakdown tooltip
  (function initScoreTooltip() {
    const tip = document.getElementById('scoreTooltip');
    if (!tip) return;

    const ROWS = [
      { key: 'snow',       label: 'Snow',              color: '#2b6de9' },
      { key: 'skiability', label: 'How it\'ll ski',    color: '#16a34a' },
      { key: 'fit',        label: 'Size match',        color: '#7c3aed' },
      { key: 'drive',      label: 'Drive',             color: '#0891b2' },
      { key: 'value',      label: 'Ticket value',      color: '#d97706' },
      { key: 'crowd',      label: 'Crowds',            color: '#db2777' },
    ];

    function buildHtml(bd) {
      const max = 25;
      return `<div class="stip-title">How the fit breaks down</div>` +
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

    document.addEventListener('mouseover', e => {
      const b = e.target.closest('.score-badge--tip');
      if (b) show(b);
    });
    document.addEventListener('mouseout', e => {
      if (!e.target.closest('.score-badge--tip')) return;
      if (!e.relatedTarget?.closest('.score-badge--tip, #scoreTooltip')) hide();
    });
    tip.addEventListener('mouseleave', hide);

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
function syncVerdictVisibility() {
  const section = els.verdictSection;
  if (!section) return;
  if (state.origin) {
    section.classList.remove('hn-verdict-pre-location');
  } else {
    section.classList.add('hn-verdict-pre-location');
  }
}

function initialize() {
  if (els.passFilter) els.passFilter.innerHTML = UNIQUE_PASSES.map(v => `<option value="${v}">${v === 'All' ? 'All' : v}</option>`).join('');
  if (els.heroPassSelect) {
    els.heroPassSelect.innerHTML = UNIQUE_PASSES.map(v => {
      const lab = v === 'All' ? 'any pass' : v === 'Independent' ? 'Independent / other' : `${v} Pass`;
      return `<option value="${v}">${lab}</option>`;
    }).join('');
  }
  els.stateFilter.innerHTML = UNIQUE_STATES.map(v => `<option value="${v}">${v}</option>`).join('');

  loadWeatherCache();
  loadHistoryCache();

  const hadUrlState = applyUrlState();
  normalizeWeightsToPriority();
  initHeroWhenControls();
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
  syncVerdictVisibility();
  wireEvents();
  wireHeroSentenceDay();
  updateHeroHeadline();
  render();

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

  // Location geocoding
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
      syncVerdictVisibility();
      window.scrollTo({ top: 0, behavior: 'smooth' });
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

  els.setLocation.addEventListener('click', async () => {
    const originalText = els.setLocation.textContent;
    els.setLocation.textContent = 'Finding…';
    els.setLocation.disabled = true;
    logCurrentFilters();
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
      window.scrollTo({ top: 0, behavior: 'smooth' });
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
      syncVerdictVisibility();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, () => {
      els.locationStatus.textContent = 'Location blocked or unavailable — allow access in your browser, or type a ZIP or city.';
      els.locationStatus.classList.add('hero-location-status--error');
      showToast('Location permission needed — use search instead');
    });
  });
}

function updateHeroHeadline() {
  const el = document.getElementById('heroHeadline');
  if (!el) return;
  if (el.querySelector('.hn-editorial-headline-brand')) return;
  el.innerHTML = 'Find the best mountain<br /><span class="hn-editorial-headline-sub">for your next <span class="hn-editorial-headline-brand">ski day</span>.</span>';
}

initialize();
