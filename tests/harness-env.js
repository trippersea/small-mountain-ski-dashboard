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

const { RESORTS } = require('./resorts.js');

// Real METRO_GRAVITY (anchor subset sufficient for NE calibration; others default to 500).
// Sourced from metro_gravity_final.js uploaded earlier this project.
const METRO_GRAVITY = {
  'killington-resort': 945, 'stowe-mountain-resort': 923, 'okemo-mountain-resort': 911,
  'sugarbush': 911, 'mount-sunapee': 909, 'loon-mountain': 886, 'attitash': 868,
  'whiteface-mountain-resort': 853, 'cannon-mountain': 781, 'jay-peak': 765,
  'sugarloaf': 763, 'jiminy-peak': 610, 'berkshire-east': 600,
  'wachusett-mountain-ski-area': 586, 'pico-mountain-at-killington': 585,
  'wildcat-mountain': 530, 'cranmore-mountain-resort': 512, 'black-mountain': 506,
  'magic-mountain': 501, 'bromley-mountain': 902, 'bousquet-ski-area': 488,
  'ragged-mountain-resort': 461, 'pats-peak': 448, 'bretton-woods': 444,
  'tenney-mountain': 457, 'gunstock': 538, 'waterville-valley': 784,
  'blue-hills-ski-area': 422, 'nashoba-valley': 418, 'wachusett': 586,
};
// LIFT_CAPACITY_TIERS not in uploaded files; scoring defaults to tier 3. Provide
// rough anchor tiers so big/small mountains differ (1=small ... 5=huge).
const LIFT_CAPACITY_TIERS = {
  'killington-resort': 5, 'loon-mountain': 5, 'wildcat-mountain': 4, 'cannon-mountain': 4,
  'waterville-valley': 4, 'mount-sunapee': 4, 'magic-mountain': 2, 'bromley-mountain': 3,
  'tenney-mountain': 2, 'pats-peak': 3, 'black-mountain': 2, 'bousquet-ski-area': 2,
  'wachusett-mountain-ski-area': 3, 'blue-hills-ski-area': 1, 'nashoba-valley': 1,
};

// Mutable test state — tests set fields before calling scoring fns.
const state = {
  targetDate: new Date('2026-01-17T12:00:00'), // a Saturday by default
  origin: null, howFar: 0, passFilter: 'All', stateFilter: 'All',
  verticalFilter: 'any', nightOnly: false,
  tempBucket: 'any', windBucket: 'any', skiDayPreset: 'saturday',
  weights: { snow: 1, crowd: 1, value: 1, size: 5 },
  weatherCache: {},
};

const W = { SCORING: {
  VERTICAL_CEILING: 3500, ACRES_CEILING: 3000, LONGEST_RUN_CEILING: 5,
  SNOW_AVG_MAX: 400, SNOW_SCALE: 8, DRIVE_DEFAULT: 0.5,
  PRICE_MAX: 200, PRICE_MIN: 40,
} };
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
const scoringSrc = fs.readFileSync(path.join(__dirname, 'sd-scoring.js'), 'utf8');
vm.runInContext(scoringSrc + '\n;globalThis.__exports = { crowdForecast, plannerScoreBreakdown, skiScoreBreakdown, verdictFromBreakdown, tripWindowSnow, targetForecastIndex, _bluebirdFactor };', sandbox);

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
