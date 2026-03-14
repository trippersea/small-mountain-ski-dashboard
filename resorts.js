// resorts.js – national version, fixed DOM references & filter generation

// ─── Use national dataset ────────────────────────────────────────────────────
const RESORTS = resortsNational;   // ← comes from resorts-data.js

// ─── Filter options ──────────────────────────────────────────────────────────
const UNIQUE_PASSES = ['All', ...new Set(RESORTS.map(r => r.passGroup || 'Independent'))].sort();
const UNIQUE_STATES = ['All', ...new Set(RESORTS.map(r => r.state))].sort();

// ─── DOM cache (critical – prevents null errors) ─────────────────────────────
const els = {
  originInput:          document.getElementById('originInput'),
  setLocation:          document.getElementById('setLocation'),
  detectLocation:       document.getElementById('detectLocation'),
  rememberLocation:     document.getElementById('rememberLocation'),
  locationStatus:       document.getElementById('locationStatus'),
  plannerFromLabel:     document.getElementById('plannerFromLabel'),
  plannerEditLocation:  document.getElementById('plannerEditLocation'),
  aiChatInput:          document.getElementById('aiChatInput'),
  aiChatBtn:            document.getElementById('aiChatBtn'),
  aiChatResult:         document.getElementById('aiChatResult'),
  passFilter:           document.getElementById('passFilter'),
  stateFilter:          document.getElementById('stateFilter'),
  howFarFilter:         document.getElementById('howFarFilter'),
  maxPriceFilter:       document.getElementById('maxPriceFilter'),
  sortBy:               document.getElementById('sortBy'),
  toggleNight:          document.getElementById('toggleNight'),
  resetFilters:         document.getElementById('resetFilters'),
  comparisonBody:       document.getElementById('comparisonBody'),
  mobileCardGrid:       document.getElementById('mobileCardGrid'),
  stormGrid:            document.getElementById('stormGrid'),
  hiddenGemGrid:        document.getElementById('hiddenGemGrid'),
  verdictCard:          document.getElementById('verdictCard'),
  detailSection:        document.getElementById('detailSection'),
  detailCard:           document.getElementById('detailCard'),
  mapLegend:            document.getElementById('mapLegend'),
  backToTop:            document.getElementById('backToTop'),
  tableSearch:          document.getElementById('tableSearch'),
  tableViewAllBtn:      document.getElementById('tableViewAllBtn'),
  compareTray:          document.getElementById('compareTray'),
  comparePills:         document.getElementById('comparePills'),
  comparePanel:         document.getElementById('comparePanel'),
  compareContent:       document.getElementById('compareContent'),
};

// ─── State object ────────────────────────────────────────────────────────────
const state = {
  origin: null,
  weights: { snow: 8, vertical: 6, crowd: 5, price: 4, drive: 7 /* add others */ },
  passFilter: 'All',
  stateFilter: 'All',
  howFar: 240,
  priceRange: 150,
  nightOnly: false,
  sortBy: 'planner',
  selectedId: null,
  compareList: [],
  // ... extend as needed by your full logic
};

// ─── Your helper functions go here ───────────────────────────────────────────
// (getSavedOrigin, saveOrigin, loadDriveTimes, render, renderDetail, initMap, etc.)

// Example: safer location apply function
async function applyLocation() {
  const val = els.originInput?.value.trim();
  if (!val) return;

  // ... your geocoding / validation logic ...

  if (els.locationStatus) {
    els.locationStatus.textContent = 'Location set!';
  }
  if (els.rememberLocation?.checked) {
    // save to localStorage
  }
}

// Back-to-top (using els)
let scrollTicking = false;
window.addEventListener('scroll', () => {
  if (!scrollTicking) {
    requestAnimationFrame(() => {
      els.backToTop?.classList.toggle('show', window.scrollY > 500);
      scrollTicking = false;
    });
    scrollTicking = true;
  }
});
els.backToTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// ─── Initialize ──────────────────────────────────────────────────────────────
function initialize() {
  // Populate dropdowns
  if (els.passFilter) {
    els.passFilter.innerHTML = UNIQUE_PASSES.map(v => `<option value="${v}">${v}</option>`).join('');
  }
  if (els.stateFilter) {
    els.stateFilter.innerHTML = UNIQUE_STATES.map(v => `<option value="${v}">${v}</option>`).join('');
  }

  // Restore from URL / localStorage / defaults
  applyUrlState();
  normalizeWeightsToPriority?.();
  updatePlannerOriginLabel?.();

  // ... rest of your init logic: sync controls, wire events, render(), map init ...

  setTimeout(() => {
    if (typeof initMap === 'function') initMap();
  }, 200);
}

initialize();
