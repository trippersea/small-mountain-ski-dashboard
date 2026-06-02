// ════════════════════════════════════════════════════════════════════════════
// scoring-behavior.test.cjs — WhereToSkiNext scoring harness (batch 1)
// Run: node --test scoring-behavior.test.cjs
//
// Two kinds of tests, clearly labeled:
//   [PROTECT] — pins behavior that already works. Should PASS now. A red here
//              means a regression: something we had right just broke.
//   [SPEC]    — target behavior from scoring-behavior-spec-v1.md that does NOT
//              exist yet (two-layer model, floor, roles). EXPECTED to fail now.
//              Each red [SPEC] is a feature on the build to-do list, not a bug.
//
// Tests never print weight values — moat stays protected even in output.
// ════════════════════════════════════════════════════════════════════════════

const { test } = require('node:test');
const assert = require('node:assert');
const h = require('./harness-env.js');
const { api, byId, state } = h;

function resetState() {
  state.targetDate = new Date('2026-01-17T12:00:00'); // Saturday
  state.origin = null; state.howFar = 0;
  state.passFilter = 'All'; state.stateFilter = 'All'; state.verticalFilter = 'any';
  state.nightOnly = false; state.tempBucket = 'any'; state.windBucket = 'any';
  state.skiDayPreset = 'saturday';
  state.weights = { snow: 1, crowd: 1, value: 1, size: 5 };
  state.weatherCache = {};
  h.clearDrive();
}

function score(id, wx, fi = 0) {
  return Math.round(api.plannerScoreBreakdown(byId[id], wx, fi, null).score);
}

// ─────────────────────────────────────────────────────────────────────────────
// [PROTECT] Crowd-model calibration anchors — verified by hand all project long.
// ─────────────────────────────────────────────────────────────────────────────
test('[PROTECT] Killington bluebird Saturday reads Busy (~74)', () => {
  resetState();
  const c = api.crowdForecast(byId['killington-resort'], h.bluebird());
  assert.strictEqual(c.label, 'Busy');
  assert.ok(c.score >= 70 && c.score <= 78, `score ${c.score} outside 70-78`);
});

test('[PROTECT] Loon bluebird Saturday reads Busy (~70)', () => {
  resetState();
  const c = api.crowdForecast(byId['loon-mountain'], h.bluebird());
  assert.strictEqual(c.label, 'Busy');
  assert.ok(c.score >= 66 && c.score <= 74, `score ${c.score} outside 66-74`);
});

test('[PROTECT] Bousquet bluebird Saturday reads Moderate (~56)', () => {
  resetState();
  const c = api.crowdForecast(byId['bousquet-ski-area'], h.bluebird());
  assert.strictEqual(c.label, 'Moderate');
  assert.ok(c.score >= 50 && c.score <= 62, `score ${c.score} outside 50-62`);
});

// ─────────────────────────────────────────────────────────────────────────────
// [PROTECT] Bluebird/rain mutual exclusion (the contradiction fix from earlier).
// ─────────────────────────────────────────────────────────────────────────────
test('[PROTECT] wet day never fires a bluebird/clear-day crowd reason', () => {
  resetState();
  const c = api.crowdForecast(byId['pats-peak'], h.wetDay());
  const hasBlue = c.reasons.some(r => /bluebird|clear/i.test(r));
  const hasWet  = c.reasons.some(r => /wet/i.test(r));
  assert.ok(!hasBlue, `wet day wrongly fired clear-day reason: ${c.reasons.join(' | ')}`);
  assert.ok(hasWet, `wet day should note wet forecast: ${c.reasons.join(' | ')}`);
});

test('[PROTECT] genuine clear day uses crowd-demand vocabulary, not the word "bluebird"', () => {
  resetState();
  const c = api.crowdForecast(byId['killington-resort'], h.bluebird());
  assert.ok(!c.reasons.some(r => /bluebird/i.test(r)),
    `should not surface the weather word "bluebird": ${c.reasons.join(' | ')}`);
});

// ─────────────────────────────────────────────────────────────────────────────
// [PROTECT] Snow preference does real work (spec A5.3).
// ─────────────────────────────────────────────────────────────────────────────
test('[PROTECT] raising snow priority lifts a snowy mountain vs a dry one', () => {
  resetState();
  state.origin = { lat: 42, lon: -71 };
  h.setDrive('tenney-mountain', 130); h.setDrive('wachusett-mountain-ski-area', 75);
  // Tenney powder vs Wachusett dry.
  const lowPrefTenney = score('tenney-mountain', h.powder(12));
  const lowPrefWach   = score('wachusett-mountain-ski-area', h.bluebird());
  state.weights.snow = 15; // Powder Day priority
  const hiPrefTenney  = score('tenney-mountain', h.powder(12));
  const hiPrefWach    = score('wachusett-mountain-ski-area', h.bluebird());
  // The snowy mountain's edge over the dry one must widen as snow priority rises.
  const lowGap = lowPrefTenney - lowPrefWach;
  const hiGap  = hiPrefTenney - hiPrefWach;
  assert.ok(hiGap > lowGap, `snow priority did not widen the snowy-vs-dry gap (low ${lowGap}, high ${hiGap})`);
});

// ─────────────────────────────────────────────────────────────────────────────
// [SPEC] Two-layer model — destination suitability (does NOT exist yet).
// Spec: CORE ARCHITECTURE + A1.3. Expected RED until built.
// ─────────────────────────────────────────────────────────────────────────────
test('[SPEC] engine exposes a destinationSuitabilityScore per resort', () => {
  resetState();
  const b = api.plannerScoreBreakdown(byId['killington-resort'], h.bluebird(), 0, null);
  assert.ok(typeof b.destinationSuitabilityScore === 'number',
    'no destinationSuitabilityScore yet — build the identity layer');
});

test('[SPEC] destination suitability does NOT move when only weather changes (Layer-1 invariant)', () => {
  resetState();
  const dry = api.plannerScoreBreakdown(byId['tenney-mountain'], h.bluebird(), 0, null);
  const wet = api.plannerScoreBreakdown(byId['tenney-mountain'], h.powder(15), 0, null);
  assert.ok(typeof dry.destinationSuitabilityScore === 'number', 'no suitability score yet');
  assert.strictEqual(dry.destinationSuitabilityScore, wet.destinationSuitabilityScore,
    'identity changed with weather — two layers have bled together');
});

test('[SPEC] destination class ordering: Blue Hills < Pats Peak < Loon', () => {
  resetState();
  const bh = api.plannerScoreBreakdown(byId['blue-hills-ski-area'], h.bluebird(), 0, null).destinationSuitabilityScore;
  const pp = api.plannerScoreBreakdown(byId['pats-peak'], h.bluebird(), 0, null).destinationSuitabilityScore;
  const ln = api.plannerScoreBreakdown(byId['loon-mountain'], h.bluebird(), 0, null).destinationSuitabilityScore;
  assert.ok(bh < pp && pp < ln, `suitability not ordered: BlueHills ${bh}, Pats ${pp}, Loon ${ln}`);
});

// ─────────────────────────────────────────────────────────────────────────────
// [SPEC] The Blue Hills bug — the headline behavior. Expected RED now.
// Spec A2.1 + A1.1. Currently Blue Hills (69) OUTSCORES Loon (65) on bluebird.
// ─────────────────────────────────────────────────────────────────────────────
test('[SPEC] Blue Hills must NOT outscore Loon on a willing-to-drive bluebird weekday', () => {
  resetState();
  state.origin = { lat: 42, lon: -71 }; // Scituate-ish
  state.howFar = 1;                      // willing to drive (extended)
  h.setDrive('blue-hills-ski-area', 38);
  h.setDrive('loon-mountain', 140);
  const bh = score('blue-hills-ski-area', h.bluebird());
  const ln = score('loon-mountain', h.bluebird());
  assert.ok(ln > bh, `Blue Hills (${bh}) should not beat Loon (${ln}) on a willing-to-drive bluebird day`);
});

// ─────────────────────────────────────────────────────────────────────────────
// [SPEC] 700-ft eligibility floor on willing-to-drive (A1.1). Expected RED now.
// ─────────────────────────────────────────────────────────────────────────────
test('[SPEC] sub-700ft mountain cannot be flagged Top-Pick-eligible on willing-to-drive', () => {
  resetState();
  state.origin = { lat: 42, lon: -71 };
  state.howFar = 1;
  h.setDrive('blue-hills-ski-area', 38);
  const b = api.plannerScoreBreakdown(byId['blue-hills-ski-area'], h.bluebird(), 0, null);
  assert.strictEqual(b.topPickEligible, false,
    'no topPickEligible flag / floor not enforced yet — build the eligibility gate');
});

// ─────────────────────────────────────────────────────────────────────────────
// [SPEC] Powder-day expectation contract (A3.1) + the Tenney-beats-close-dry case (B7).
// ─────────────────────────────────────────────────────────────────────────────
test('[SPEC] Tenney on a real powder Saturday beats a closer dry mountain', () => {
  resetState();
  state.origin = { lat: 42, lon: -71 };
  state.howFar = 1;
  h.setDrive('tenney-mountain', 130);
  h.setDrive('wachusett-mountain-ski-area', 75);
  // Tenney gets the powder on the target day; Wachusett dry.
  const tenney = score('tenney-mountain', h.powder(14));
  const wach   = score('wachusett-mountain-ski-area', h.bluebird());
  assert.ok(tenney > wach,
    `Tenney powder (${tenney}) should beat closer dry Wachusett (${wach})`);
});

// ─────────────────────────────────────────────────────────────────────────────
// [PROTECT] Verdict pick gate (pickTopPickFromRanked — same logic as computeVerdict)
// Manual UI check: Boston origin, extended/any drive, bluebird; ?debug=1 on detail.
// ─────────────────────────────────────────────────────────────────────────────
function rankedEntry(id, wx) {
  const resort = byId[id];
  const breakdown = api.plannerScoreBreakdown(resort, wx, 0, null);
  return { resort, wx, breakdown };
}

test('[PROTECT] pickTopPickFromRanked chooses Loon over Blue Hills when floor active', () => {
  resetState();
  state.origin = { lat: 42, lon: -71 };
  state.howFar = 1;
  h.setDrive('blue-hills-ski-area', 38);
  h.setDrive('loon-mountain', 140);
  const wx = h.bluebird();
  const ranked = [
    rankedEntry('blue-hills-ski-area', wx),
    rankedEntry('loon-mountain', wx),
  ].sort((a, b) => b.breakdown.score - a.breakdown.score);
  assert.strictEqual(ranked[0].resort.id, 'loon-mountain',
    `expected Loon to outscore Blue Hills before pick gate; got ${ranked[0].resort.id}`);
  const result = api.pickTopPickFromRanked(ranked);
  assert.ok(result);
  assert.strictEqual(result.pick.resort.id, 'loon-mountain');
  assert.strictEqual(result.topPickIsFallback, false);
  assert.strictEqual(ranked.find(e => e.resort.id === 'blue-hills-ski-area').breakdown.topPickEligible, false);
});

test('[PROTECT] pickTopPickFromRanked skips ineligible leader when BH scores highest', () => {
  resetState();
  const wx = h.bluebird();
  const bh = rankedEntry('blue-hills-ski-area', wx);
  const ln = rankedEntry('loon-mountain', wx);
  bh.breakdown = { ...bh.breakdown, score: 99, topPickEligible: false, topPickEligibilityReason: 'below_destination_floor' };
  ln.breakdown = { ...ln.breakdown, score: 55, topPickEligible: true, topPickEligibilityReason: 'eligible' };
  const ranked = [bh, ln];
  const result = api.pickTopPickFromRanked(ranked);
  assert.strictEqual(result.pick.resort.id, 'loon-mountain');
  assert.strictEqual(result.topPickIsFallback, false);
});

test('[PROTECT] pickTopPickFromRanked uses raw leader when local intent disables floor', () => {
  resetState();
  state.verticalFilter = 'small';
  const wx = h.bluebird();
  const bh = rankedEntry('blue-hills-ski-area', wx);
  const ln = rankedEntry('loon-mountain', wx);
  bh.breakdown = { ...bh.breakdown, score: 70, topPickEligible: true, topPickEligibilityReason: 'local_intent_override' };
  ln.breakdown = { ...ln.breakdown, score: 55, topPickEligible: true, topPickEligibilityReason: 'local_intent_override' };
  const ranked = [bh, ln];
  const result = api.pickTopPickFromRanked(ranked);
  assert.strictEqual(result.pick.resort.id, 'blue-hills-ski-area');
  assert.strictEqual(result.topPickFloorActive, false);
});

test('[PROTECT] filterRunnerUpCandidates drops ineligible locals on broad search', () => {
  resetState();
  const wx = h.bluebird();
  const scored = [
    rankedEntry('blue-hills-ski-area', wx),
    rankedEntry('loon-mountain', wx),
    rankedEntry('pats-peak', wx),
  ].sort((a, b) => b.breakdown.score - a.breakdown.score);
  const runners = api.filterRunnerUpCandidates(scored);
  assert.ok(!runners.some(e => e.resort.id === 'blue-hills-ski-area'));
  assert.ok(runners.some(e => e.resort.id === 'loon-mountain'));
});

test('[PROTECT] pickTopPickFromRanked fallback when no eligible destination', () => {
  resetState();
  const wx = h.bluebird();
  const bh = rankedEntry('blue-hills-ski-area', wx);
  const ranked = [bh];
  const result = api.pickTopPickFromRanked(ranked);
  assert.strictEqual(result.pick.resort.id, 'blue-hills-ski-area');
  assert.strictEqual(result.topPickIsFallback, true);
  assert.strictEqual(result.topPickFallbackReason, 'no_eligible_destination');
});
