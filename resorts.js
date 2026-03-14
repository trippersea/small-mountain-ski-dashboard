// resorts.js — updated national version (March 2025 fix)

const RESORTS = typeof resortsNational !== 'undefined' ? resortsNational : [];
// fallback in case script load order is wrong or resorts-data.js failed

// Generate filter dropdown values
const UNIQUE_PASSES = ['All', ...new Set(RESORTS.map(r => r.passGroup || 'Independent'))].sort();
const UNIQUE_STATES = ['All', ...new Set(RESORTS.map(r => r.state))].sort();

// ─── DOM references (this was missing → caused most null errors) ─────────────
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

// ─── State (minimal version — extend as needed) ──────────────────────────────
let state = {
  origin: null,
  weights: { snow: 8, vertical: 6, crowd: 5, price: 4, drive: 7 },
  passFilter: 'All',
  stateFilter: 'All',
  howFar: 240,
  priceRange: 150,
  nightOnly: false,
  sortBy: 'planner',
  selectedId: null,
  compareList: []
};

// ─── Quick debug log so you see it loaded correctly ──────────────────────────
console.log(`resorts.js loaded — ${RESORTS.length} mountains available`);
console.log('Passes:', UNIQUE_PASSES);
console.log('States:', UNIQUE_STATES);

// ─── Back to top button (example of safe usage) ──────────────────────────────
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

els.backToTop?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ─── Example: safer location button handler ─────────────────────────────────
function applyLocation() {
  if (!els.originInput) return;
  const val = els.originInput.value.trim();
  if (!val) {
    if (els.locationStatus) els.locationStatus.textContent = 'Please enter a location';
    return;
  }

  // Here would go your actual geocoding / haversine logic
  console.log('Trying to set location:', val);

  if (els.locationStatus) {
    els.locationStatus.textContent = 'Searching...';
  }

  // Placeholder success
  setTimeout(() => {
    if (els.locationStatus) {
      els.locationStatus.textContent = 'Location set to: ' + val;
    }
    // state.origin = ... real coordinates
  }, 800);
}

els.setLocation?.addEventListener('click', applyLocation);
els.originInput?.addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    e.preventDefault();
    applyLocation();
  }
});

// ─── Initialize function (expand this with your real logic) ──────────────────
function initialize() {
  // Fill pass and state dropdowns
  if (els.passFilter) {
    els.passFilter.innerHTML = UNIQUE_PASSES
      .map(v => `<option value="${v}">${v}</option>`)
      .join('');
  }
  if (els.stateFilter) {
    els.stateFilter.innerHTML = UNIQUE_STATES
      .map(v => `<option value="${v}">${v}</option>`)
      .join('');
  }

  // Add your other init code here:
  // loadWeatherCache(), applyUrlState(), syncPlannerControls(), wireEvents(), render(), initMap() etc.

  console.log('Initialization complete');
}

initialize();
