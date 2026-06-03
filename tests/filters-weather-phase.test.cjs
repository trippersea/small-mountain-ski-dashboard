// filters-weather-phase.test.cjs — phase-1 weather pool matches drive tier (verdict/table alignment)
const { test } = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const vm = require('vm');
const path = require('path');
const { RESORTS } = require('../resorts.js');

const HOW_FAR_TIERS = Object.freeze([
  { label: 'Day Trip', floor: 0, cap: 180 },
  { label: 'Extended drive (3h+)', floor: 180, cap: 360 },
  { label: 'All', floor: 0, cap: Infinity },
]);

function loadFiltersApi() {
  const state = { origin: null, howFar: 0 };
  const driveMins = {};
  const sandbox = {
    state,
    HOW_FAR_TIERS,
    RESORTS,
    getDriveMins: (id) => driveMins[id] ?? null,
    console,
  };
  vm.createContext(sandbox);
  const src = fs.readFileSync(path.join(__dirname, '..', 'sd-filters.js'), 'utf8');
  vm.runInContext(
    src + '\n;globalThis.__api = { phase1WeatherCandidates, plannerCandidates, resortMatchesDriveTier, filteredResorts };',
    sandbox,
    { filename: 'sd-filters.js' }
  );
  return { api: sandbox.__api, state, setDrive: (id, mins) => { driveMins[id] = mins; }, clearDrive: () => { Object.keys(driveMins).forEach(k => delete driveMins[k]); } };
}

function bostonDayTripDrives(h) {
  // Default everything outside day trip, then set the Boston-relevant set.
  RESORTS.forEach(r => h.setDrive(r.id, 600));
  const drives = {
    'blue-hills-ski-area': 26,
    'wachusett-mountain': 62,
    'pats-peak': 134,
    'gunstock': 133,
    'mount-sunapee': 134,
    'ragged-mountain-resort': 141,
    'waterville-valley': 155,
    'cannon-mountain': 167,
    'loon-mountain': 176,
    'bromley-mountain': 185,
    'killington-resort': 220,
  };
  Object.entries(drives).forEach(([id, mins]) => h.setDrive(id, mins));
}

test('[PROTECT] day-trip phase-1 includes full drive tier, not nearest 20 only', () => {
  const h = loadFiltersApi();
  h.clearDrive();
  h.state.origin = { lat: 42.3601, lon: -71.0589, label: 'Boston, MA' };
  h.state.howFar = 0;
  bostonDayTripDrives(h);

  const filtered = RESORTS.filter(r => h.api.resortMatchesDriveTier(r.id));
  const phase1 = h.api.phase1WeatherCandidates(filtered);

  assert.ok(phase1.some(r => r.id === 'cannon-mountain'), 'Cannon should be in phase-1 weather batch');
  assert.ok(phase1.some(r => r.id === 'loon-mountain'), 'Loon should be in phase-1 weather batch');
  assert.ok(phase1.some(r => r.id === 'waterville-valley'), 'Waterville should be in phase-1 weather batch');
  assert.ok(!phase1.some(r => r.id === 'bromley-mountain'), 'Bromley outside tier should not be in phase-1');
  assert.strictEqual(phase1.length, filtered.length, 'phase-1 should cover every in-tier resort');
});

test('[PROTECT] plannerCandidates includes all drive-tier resorts for origin searches', () => {
  const h = loadFiltersApi();
  h.clearDrive();
  h.state.origin = { lat: 42.3601, lon: -71.0589, label: 'Boston, MA' };
  h.state.howFar = 0;
  bostonDayTripDrives(h);

  const filtered = RESORTS.filter(r => h.api.resortMatchesDriveTier(r.id));
  const candidates = h.api.plannerCandidates(filtered);
  const tierIds = new Set(filtered.map(r => r.id));

  for (const id of ['cannon-mountain', 'loon-mountain', 'waterville-valley']) {
    assert.ok(candidates.some(r => r.id === id), `${id} should be in planner weather candidates`);
    assert.ok(tierIds.has(id), `${id} should be in drive tier`);
  }
});
