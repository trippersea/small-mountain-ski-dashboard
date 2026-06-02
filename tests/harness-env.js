// ════════════════════════════════════════════════════════════════════════════
// harness-env.js — test environment for the scoring harness.
//
// ⚠️  PROVISIONAL DOUBLES — AUDIT BEFORE TRUSTING:
//   W.SCORING constants and LIFT_CAPACITY_TIERS below are PLACEHOLDER values
//   supplied because the real sources weren't on hand when this was built.
//   The crowd anchors pass with them (Killington 74 / Loon 70 / Bousquet 56),
//   so they're close — but for this harness to be authoritative, wire these to
//   the REAL sources:
//     - W.SCORING: from the real weights source (api/weights.js or sd-app.js fallback)
//     - LIFT_CAPACITY_TIERS: from the real table in the repo
//     - METRO_GRAVITY: confirm full table matches metro_gravity_final.js
//   Until then, treat green tests that depend on absolute score thresholds as
//   indicative, not gospel. (Relative/ordering tests are robust regardless.)
// ════════════════════════════════════════════════════════════════════════════

// Test environment: loads the REAL sd-scoring.js with controllable state + real data.
const fs = require('fs');
const vm = require('vm');
const path = require('path');

const { RESORTS } = require('../resorts.js');

function loadConstFromFile(absPath, exportName) {
  const src = fs.readFileSync(absPath, 'utf8');
  const sandbox = { globalThis: {}, console };
  vm.createContext(sandbox);
  vm.runInContext(`${src}\n;globalThis.__value = (typeof ${exportName} !== 'undefined') ? ${exportName} : null;`, sandbox, { filename: absPath });
  if (!sandbox.globalThis.__value) {
    throw new Error(`Could not load ${exportName} from ${absPath}`);
  }
  return sandbox.globalThis.__value;
}

function loadWeightsFromApi() {
  const absPath = path.join(__dirname, '..', 'api', 'weights.js');
  let src = fs.readFileSync(absPath, 'utf8');
  // Transform ESM default export into a plain function we can invoke in a VM.
  src = src.replace(/export\s+default\s+function\s+handler/, 'function handler');
  const sandbox = { globalThis: {}, console };
  vm.createContext(sandbox);
  vm.runInContext(`${src}\n;globalThis.__handler = handler;`, sandbox, { filename: absPath });
  const handler = sandbox.globalThis.__handler;
  if (typeof handler !== 'function') throw new Error('weights handler not found');

  let captured = null;
  handler({}, {
    setHeader: () => {},
    json: (obj) => { captured = obj; },
  });
  if (!captured?.SCORING) throw new Error('weights SCORING payload not captured');
  return captured;
}

// Real constants, wired to repo sources.
const METRO_GRAVITY = loadConstFromFile(path.join(__dirname, '..', 'metro_gravity_final.js'), 'METRO_GRAVITY');
const LIFT_CAPACITY_TIERS = loadConstFromFile(path.join(__dirname, '..', 'lift_capacity_tiers_final.js'), 'LIFT_CAPACITY_TIERS');

// Mutable test state — tests set fields before calling scoring fns.
const state = {
  targetDate: new Date('2026-01-17T12:00:00'), // a Saturday by default
  origin: null, howFar: 0, passFilter: 'All', stateFilter: 'All',
  verticalFilter: 'any', nightOnly: false,
  tempBucket: 'any', windBucket: 'any', skiDayPreset: 'saturday',
  weights: { snow: 1, crowd: 1, value: 1, size: 5 },
  weatherCache: {},
};

const __weights = loadWeightsFromApi();
const W = { SCORING: __weights.SCORING };
const sandbox = {
  RESORTS, METRO_GRAVITY, LIFT_CAPACITY_TIERS, state, W,
  historyCache: new Map(), HIST_TTL: 24*60*60*1000,
  // sd-app.js helpers the scoring file calls — provide test doubles:
  getDriveMins: (id) => sandbox.__driveMins?.[id] ?? null,
  console, Math, Number, Date, Object, Array, JSON, parseInt, parseFloat, isNaN, isFinite,
};
sandbox.__driveMins = {};
vm.createContext(sandbox);

// Load the real scoring code into the sandbox.
const scoringSrc = fs.readFileSync(path.join(__dirname, '..', 'sd-scoring.js'), 'utf8');
vm.runInContext(scoringSrc + '\n;globalThis.__exports = { crowdForecast, plannerScoreBreakdown, skiScoreBreakdown, verdictFromBreakdown, tripWindowSnow, targetForecastIndex, _bluebirdFactor, pickTopPickFromRanked, filterRunnerUpCandidates, isTopPickFloorActive, hasLocalIntent, buildRecommendationRolesFromRanked, pickLocalFromRanked, pickSleeperFromRanked, pickTrapFromRanked, localRoleExplanation, sleeperRoleExplanation, trapRoleExplanation, isCredibleLocalCandidate, isCredibleSleeperCandidate, isCredibleTrapCandidate, pickCrowdWarningCopy, compareLocalCandidates, LOCAL_SCORE_CLOSE_BAND, SLEEPER_SCORE_CLOSE_BAND, SLEEPER_CROWD_GAP_MIN, TRAP_QUALITY_MIN_SUIT, TRAP_CROWD_SCORE_MIN, TRAP_DEMAND_METRO_MIN };', sandbox);

// Weather builders for precise scenarios.
function dayFc({ code=0, hi=28, lo=18, snow=0, wind=8 }={}) { return { code, hi, lo, snow, wind }; }
function wx(forecastDays) { return { forecast: forecastDays }; }
function bluebird()  { return wx([dayFc({ code:0, hi:30, lo:20, snow:0, wind:6 })]); }
function powder(inches=10) { return wx([dayFc({ code:75, hi:24, lo:12, snow:inches, wind:8 })]); }
function wetDay()    { return wx([dayFc({ code:61, hi:40, lo:35, snow:0, wind:12 })]); }

module.exports = {
  api: sandbox.__exports, state, sandbox, RESORTS,
  byId: Object.fromEntries(RESORTS.map(r=>[r.id,r])),
  setDrive: (id,mins)=>{ sandbox.__driveMins[id]=mins; },
  clearDrive: ()=>{ sandbox.__driveMins={}; },
  dayFc, wx, bluebird, powder, wetDay,
};
