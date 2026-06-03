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
  state.localIntent = false;
  h.clearDrive();
  h.sandbox.historyCache.clear();
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

// ─────────────────────────────────────────────────────────────────────────────
// [PROTECT] Recommendation roles — PICK + LOCAL (v1)
// ─────────────────────────────────────────────────────────────────────────────
function bostonExtendedRanked(wx) {
  resetState();
  state.origin = { lat: 42, lon: -71 };
  state.howFar = 1;
  h.setDrive('blue-hills-ski-area', 38);
  h.setDrive('loon-mountain', 140);
  // Recent base keeps Blue Hills out of tier "bad" on a dry bluebird (credible LOCAL).
  h.sandbox.historyCache.set('blue-hills-ski-area', { total: 8, days: [] });
  return [
    rankedEntry('blue-hills-ski-area', wx),
    rankedEntry('loon-mountain', wx),
  ].sort((a, b) => b.breakdown.score - a.breakdown.score);
}

test('[PROTECT] Blue Hills LOCAL on dry bluebird without recent base (skiable, not bad)', () => {
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
  const bhTier = api.verdictFromBreakdown(
    byId['blue-hills-ski-area'], wx, ranked.find(e => e.resort.id === 'blue-hills-ski-area').breakdown,
  ).tier;
  assert.notStrictEqual(bhTier, 'bad', 'dry bluebird should not be bad tier');
  const roles = api.buildRecommendationRolesFromRanked(ranked);
  assert.strictEqual(roles.pick?.resort?.id, 'loon-mountain');
  assert.strictEqual(roles.local?.resort?.id, 'blue-hills-ski-area');
  assert.strictEqual(roles.local.roleVariant, 'nearby');
});

test('[PROTECT] Loon PICK and Blue Hills LOCAL on Boston extended bluebird', () => {
  const ranked = bostonExtendedRanked(h.bluebird());
  const roles = api.buildRecommendationRolesFromRanked(ranked);
  assert.strictEqual(roles.pick?.resort?.id, 'loon-mountain');
  assert.strictEqual(roles.local?.resort?.id, 'blue-hills-ski-area');
  assert.strictEqual(roles.sleeper, null);
  assert.strictEqual(roles.trap, null);
  assert.notStrictEqual(roles.pick.resort.id, roles.local.resort.id);
});

test('[PROTECT] LOCAL null when local intent active and Blue Hills wins PICK', () => {
  resetState();
  state.verticalFilter = 'small';
  state.origin = { lat: 42, lon: -71 };
  h.setDrive('blue-hills-ski-area', 38);
  h.setDrive('loon-mountain', 140);
  const wx = h.bluebird();
  const ranked = [
    rankedEntry('blue-hills-ski-area', wx),
    rankedEntry('loon-mountain', wx),
  ].sort((a, b) => b.breakdown.score - a.breakdown.score);
  const roles = api.buildRecommendationRolesFromRanked(ranked);
  assert.strictEqual(roles.pick?.resort?.id, 'blue-hills-ski-area');
  assert.strictEqual(roles.local, null);
});

test('[PROTECT] LOCAL null when no credible local-class option in pool', () => {
  resetState();
  const wx = h.bluebird();
  h.setDrive('loon-mountain', 140);
  const ranked = [rankedEntry('loon-mountain', wx)];
  const roles = api.buildRecommendationRolesFromRanked(ranked);
  assert.strictEqual(roles.pick?.resort?.id, 'loon-mountain');
  assert.strictEqual(roles.local, null);
});

test('[PROTECT] LOCAL null when local drive exceeds 45 minutes', () => {
  resetState();
  state.origin = { lat: 42, lon: -71 };
  h.setDrive('blue-hills-ski-area', 50);
  h.setDrive('loon-mountain', 140);
  const wx = h.bluebird();
  const ranked = [
    rankedEntry('blue-hills-ski-area', wx),
    rankedEntry('loon-mountain', wx),
  ].sort((a, b) => b.breakdown.score - a.breakdown.score);
  const roles = api.buildRecommendationRolesFromRanked(ranked);
  assert.strictEqual(roles.pick?.resort?.id, 'loon-mountain');
  assert.strictEqual(roles.local, null);
});

test('[PROTECT] LOCAL null when local drive time is unknown', () => {
  const ranked = bostonExtendedRanked(h.bluebird());
  h.clearDrive();
  h.setDrive('loon-mountain', 140);
  const roles = api.buildRecommendationRolesFromRanked(ranked);
  assert.strictEqual(roles.pick?.resort?.id, 'loon-mountain');
  assert.strictEqual(roles.local, null);
});

test('[PROTECT] LOCAL shows even when local candidate tier is bad', () => {
  resetState();
  state.origin = { lat: 42, lon: -71 };
  state.howFar = 1;
  h.setDrive('blue-hills-ski-area', 38);
  h.setDrive('loon-mountain', 140);
  const ranked = [
    rankedEntry('blue-hills-ski-area', h.wetDay()),
    rankedEntry('loon-mountain', h.bluebird()),
  ].sort((a, b) => b.breakdown.score - a.breakdown.score);
  const bhTier = api.verdictFromBreakdown(
    byId['blue-hills-ski-area'],
    h.wetDay(),
    ranked.find(e => e.resort.id === 'blue-hills-ski-area').breakdown
  ).tier;
  assert.strictEqual(bhTier, 'bad');
  const roles = api.buildRecommendationRolesFromRanked(ranked);
  assert.strictEqual(roles.pick?.resort?.id, 'loon-mountain');
  assert.strictEqual(roles.local?.resort?.id, 'blue-hills-ski-area');
});

test('[PROTECT] LOCAL may render when local candidate tier is marginal', () => {
  resetState();
  state.origin = { lat: 42, lon: -71 };
  state.howFar = 1;
  state.weights.snow = 15;
  h.setDrive('blue-hills-ski-area', 38);
  h.setDrive('loon-mountain', 140);
  const ranked = [
    rankedEntry('blue-hills-ski-area', h.bluebird()),
    rankedEntry('loon-mountain', h.bluebird()),
  ].sort((a, b) => b.breakdown.score - a.breakdown.score);
  const bhTier = api.verdictFromBreakdown(
    byId['blue-hills-ski-area'],
    h.bluebird(),
    ranked.find(e => e.resort.id === 'blue-hills-ski-area').breakdown
  ).tier;
  assert.strictEqual(bhTier, 'marginal');
  const roles = api.buildRecommendationRolesFromRanked(ranked);
  assert.strictEqual(roles.pick?.resort?.id, 'loon-mountain');
  assert.strictEqual(roles.local?.resort?.id, 'blue-hills-ski-area');
  assert.strictEqual(roles.local.tier, 'marginal');
});

test('[PROTECT] LOCAL picks best among all local-class candidates in pool', () => {
  resetState();
  state.origin = { lat: 42, lon: -71 };
  state.howFar = 1;
  h.setDrive('loon-mountain', 140);
  h.setDrive('blue-hills-ski-area', 38);
  h.setDrive('nashoba-valley', 42);
  h.sandbox.historyCache.set('blue-hills-ski-area', { total: 8, days: [] });
  h.sandbox.historyCache.set('nashoba-valley', { total: 8, days: [] });
  const wx = h.bluebird();
  const bh = rankedEntry('blue-hills-ski-area', wx);
  const nv = rankedEntry('nashoba-valley', wx);
  const ln = rankedEntry('loon-mountain', wx);
  // Scores within 5 pts — shorter drive (Blue Hills) should win over Nashoba.
  bh.breakdown = { ...bh.breakdown, score: 50 };
  nv.breakdown = { ...nv.breakdown, score: 52 };
  const ranked = [ln, nv, bh].sort((a, b) => b.breakdown.score - a.breakdown.score);
  const roles = api.buildRecommendationRolesFromRanked(ranked);
  assert.strictEqual(roles.pick?.resort?.id, 'loon-mountain');
  assert.strictEqual(roles.local?.resort?.id, 'blue-hills-ski-area');
});

test('[PROTECT] LOCAL prefers higher score when local candidates differ by more than 5 points', () => {
  resetState();
  state.origin = { lat: 42, lon: -71 };
  state.howFar = 1;
  h.setDrive('loon-mountain', 140);
  h.setDrive('blue-hills-ski-area', 38);
  h.setDrive('nashoba-valley', 42);
  h.sandbox.historyCache.set('blue-hills-ski-area', { total: 8, days: [] });
  h.sandbox.historyCache.set('nashoba-valley', { total: 8, days: [] });
  const wx = h.bluebird();
  const bh = rankedEntry('blue-hills-ski-area', wx);
  const nv = rankedEntry('nashoba-valley', wx);
  const ln = rankedEntry('loon-mountain', wx);
  bh.breakdown = { ...bh.breakdown, score: 48 };
  nv.breakdown = { ...nv.breakdown, score: 55 };
  const ranked = [ln, nv, bh].sort((a, b) => b.breakdown.score - a.breakdown.score);
  const roles = api.buildRecommendationRolesFromRanked(ranked);
  assert.strictEqual(roles.local?.resort?.id, 'nashoba-valley');
});

// ─────────────────────────────────────────────────────────────────────────────
// [PROTECT] Recommendation roles — SLEEPER (v1)
// ─────────────────────────────────────────────────────────────────────────────
function crowdedSaturdayRanked(ids, wx, opts = {}) {
  resetState();
  state.origin = { lat: 42, lon: -71 };
  state.howFar = 1;
  state.skiDayPreset = 'saturday';
  state.targetDate = new Date('2026-01-17T12:00:00');
  (opts.historyIds || []).forEach((id) => {
    h.sandbox.historyCache.set(id, { total: 10, days: [] });
  });
  const drives = {
    'killington-resort': 180,
    'loon-mountain': 140,
    'magic-mountain': 170,
    'tenney-mountain': 165,
  };
  ids.forEach((id) => h.setDrive(id, drives[id] ?? 120));
  return ids
    .map((id) => rankedEntry(id, wx))
    .sort((a, b) => b.breakdown.score - a.breakdown.score);
}

test('[PROTECT] Loon TRAP when Killington is PICK + Magic Smart Play on crowded Saturday', () => {
  const ranked = crowdedSaturdayRanked(
    ['killington-resort', 'loon-mountain', 'magic-mountain'],
    h.bluebird(),
    { historyIds: ['killington-resort', 'loon-mountain', 'magic-mountain'] },
  );
  const roles = api.buildRecommendationRolesFromRanked(ranked);
  assert.strictEqual(roles.pick?.resort?.id, 'killington-resort');
  assert.strictEqual(roles.sleeper?.resort?.id, 'magic-mountain');
  assert.strictEqual(roles.trap?.resort?.id, 'loon-mountain');
  assert.strictEqual(roles.pick.pickCrowdWarning, true);
  assert.ok(roles.pick.pickCrowdWarningCopy);
  assert.notStrictEqual(roles.pick.resort.id, roles.sleeper.resort.id);
  assert.notStrictEqual(roles.pick.resort.id, roles.trap.resort.id);
});

test('[PROTECT] SLEEPER null when pool has only PICK + LOCAL (no contrived sleeper)', () => {
  const ranked = bostonExtendedRanked(h.bluebird());
  const roles = api.buildRecommendationRolesFromRanked(ranked);
  assert.strictEqual(roles.pick?.resort?.id, 'loon-mountain');
  assert.strictEqual(roles.local?.resort?.id, 'blue-hills-ski-area');
  assert.strictEqual(roles.sleeper, null);
});

test('[PROTECT] SLEEPER null when pick is already the quiet smart call', () => {
  const ranked = crowdedSaturdayRanked(
    ['wildcat-mountain', 'loon-mountain'],
    h.bluebird(),
    { historyIds: ['wildcat-mountain'] },
  );
  const wc = ranked.find((e) => e.resort.id === 'wildcat-mountain');
  const ln = ranked.find((e) => e.resort.id === 'loon-mountain');
  if (wc.breakdown.score <= ln.breakdown.score) {
    wc.breakdown = { ...wc.breakdown, score: ln.breakdown.score + 1 };
  }
  ranked.sort((a, b) => b.breakdown.score - a.breakdown.score);
  const roles = api.buildRecommendationRolesFromRanked(ranked);
  assert.strictEqual(roles.pick?.resort?.id, 'wildcat-mountain');
  assert.strictEqual(roles.sleeper, null);
});

test('[PROTECT] bad-tier candidate cannot be Smart Play', () => {
  resetState();
  state.origin = { lat: 42, lon: -71 };
  state.howFar = 1;
  state.skiDayPreset = 'saturday';
  h.setDrive('killington-resort', 180);
  h.setDrive('wildcat-mountain', 155);
  const ranked = [
    rankedEntry('killington-resort', h.bluebird()),
    rankedEntry('wildcat-mountain', h.wetDay()),
  ].sort((a, b) => b.breakdown.score - a.breakdown.score);
  const wcTier = api.verdictFromBreakdown(
    byId['wildcat-mountain'], h.wetDay(),
    ranked.find(e => e.resort.id === 'wildcat-mountain').breakdown,
  ).tier;
  assert.strictEqual(wcTier, 'bad');
  const roles = api.buildRecommendationRolesFromRanked(ranked);
  assert.strictEqual(roles.pick?.resort?.id, 'killington-resort');
  assert.strictEqual(roles.sleeper, null);
});

test('[PROTECT] Smart Play not backfilled from raw score when no credible candidate', () => {
  resetState();
  state.origin = { lat: 42, lon: -71 };
  state.howFar = 1;
  state.skiDayPreset = 'saturday';
  state.targetDate = new Date('2026-01-17T12:00:00');
  h.setDrive('killington-resort', 180);
  h.setDrive('loon-mountain', 140);
  h.sandbox.historyCache.set('killington-resort', { total: 10, days: [] });
  h.sandbox.historyCache.set('loon-mountain', { total: 10, days: [] });
  const wx = h.bluebird();
  const ranked = [
    rankedEntry('killington-resort', wx),
    rankedEntry('loon-mountain', wx),
  ].sort((a, b) => b.breakdown.score - a.breakdown.score);
  const roles = api.buildRecommendationRolesFromRanked(ranked);
  assert.strictEqual(roles.pick?.resort?.id, 'killington-resort');
  assert.strictEqual(roles.sleeper, null, 'no third credible Smart Play — slot stays empty');
});

test('[PROTECT] raw #2 obvious magnet without quieter contrast is not Smart Play', () => {
  resetState();
  state.origin = { lat: 42.3601, lon: -71.0589 };
  state.howFar = 0;
  state.skiDayPreset = 'saturday';
  state.targetDate = new Date('2026-01-17T12:00:00');
  h.setDrive('killington-resort', 180);
  h.setDrive('mount-sunapee', 180);
  h.sandbox.historyCache.set('killington-resort', { total: 10, days: [] });
  h.sandbox.historyCache.set('mount-sunapee', { total: 10, days: [] });
  const wx = h.bluebird();
  const ranked = [
    rankedEntry('killington-resort', wx),
    rankedEntry('mount-sunapee', wx),
  ].sort((a, b) => b.breakdown.score - a.breakdown.score);
  const pick = ranked[0];
  const sunapee = ranked[1];
  const ref = api.obviousBigMountainReference(ranked, pick);
  assert.ok(ref, 'reference magnet should exist');
  assert.strictEqual(
    api.isCredibleSleeperCandidate(sunapee, pick, ref, new Set([pick.resort.id])),
    false,
    'Sunapee should not qualify without crowd/snow/value contrast when drives are equal',
  );
  const roles = api.buildRecommendationRolesFromRanked(ranked);
  assert.strictEqual(roles.sleeper, null);
});

test('[PROTECT] Smart Play requires ref contrast via hasSleeperReason', () => {
  resetState();
  state.origin = { lat: 42, lon: -71 };
  state.howFar = 1;
  state.skiDayPreset = 'saturday';
  state.targetDate = new Date('2026-01-17T12:00:00');
  h.setDrive('killington-resort', 180);
  h.setDrive('magic-mountain', 170);
  h.sandbox.historyCache.set('killington-resort', { total: 10, days: [] });
  h.sandbox.historyCache.set('magic-mountain', { total: 10, days: [] });
  const wx = h.bluebird();
  const ranked = crowdedSaturdayRanked(
    ['killington-resort', 'loon-mountain', 'magic-mountain'],
    wx,
    { historyIds: ['killington-resort', 'loon-mountain', 'magic-mountain'] },
  );
  const pick = ranked.find((e) => e.resort.id === 'killington-resort');
  const magic = ranked.find((e) => e.resort.id === 'magic-mountain');
  const ref = api.smartPlayReference(ranked, pick);
  assert.ok(api.hasSleeperReason(magic, pick, ref), 'Magic should have quieter contrast vs ref');
  assert.ok(api.isLessObviousSmartPlay(magic, ref));
  assert.ok(
    api.isCredibleSleeperCandidate(magic, pick, ref, new Set(['killington-resort', 'loon-mountain'])),
  );
});

test('[PROTECT] SLEEPER null when score gap exceeds close band', () => {
  const ranked = crowdedSaturdayRanked(
    ['killington-resort', 'wildcat-mountain'],
    h.bluebird(),
    { historyIds: ['wildcat-mountain'] },
  );
  const wc = ranked.find((e) => e.resort.id === 'wildcat-mountain');
  wc.breakdown = { ...wc.breakdown, score: (ranked[0].breakdown.score - 20) };
  const roles = api.buildRecommendationRolesFromRanked(ranked);
  assert.strictEqual(roles.pick?.resort?.id, 'killington-resort');
  assert.strictEqual(roles.sleeper, null);
});

test('[PROTECT] sub-700 ft regional resort may qualify as SLEEPER when eligible (Midwest)', () => {
  resetState();
  state.origin = { lat: 42, lon: -83 };
  state.howFar = 1;
  state.skiDayPreset = 'saturday';
  state.targetDate = new Date('2026-01-17T12:00:00');
  h.setDrive('boyne-mountain', 180);
  h.setDrive('crystal-mountain-mi', 240);
  h.sandbox.historyCache.set('crystal-mountain-mi', { total: 10, days: [] });
  h.sandbox.historyCache.set('boyne-mountain', { total: 10, days: [] });
  const wx = h.bluebird();
  const ranked = [
    rankedEntry('boyne-mountain', wx),
    rankedEntry('crystal-mountain-mi', wx),
  ].sort((a, b) => b.breakdown.score - a.breakdown.score);
  const crystal = ranked.find((e) => e.resort.id === 'crystal-mountain-mi');
  assert.ok(crystal.resort.vertical < 700, 'Crystal should be sub-700 ft');
  assert.strictEqual(crystal.breakdown.destinationClass, 'regional');
  assert.strictEqual(crystal.breakdown.topPickEligible, true);
  const roles = api.buildRecommendationRolesFromRanked(ranked);
  assert.strictEqual(roles.pick?.resort?.id, 'boyne-mountain');
  assert.strictEqual(roles.sleeper?.resort?.id, 'crystal-mountain-mi');
});

test('[PROTECT] local-class sub-700 ft resort cannot qualify as SLEEPER', () => {
  resetState();
  state.origin = { lat: 42, lon: -87 };
  state.howFar = 0;
  h.setDrive('wilmot-mountain', 45);
  h.setDrive('crystal-mountain-mi', 240);
  h.sandbox.historyCache.set('crystal-mountain-mi', { total: 10, days: [] });
  const wx = h.bluebird();
  const ranked = [
    rankedEntry('crystal-mountain-mi', wx),
    rankedEntry('wilmot-mountain', wx),
  ].sort((a, b) => b.breakdown.score - a.breakdown.score);
  const wilmot = ranked.find((e) => e.resort.id === 'wilmot-mountain');
  assert.strictEqual(wilmot.breakdown.destinationClass, 'local');
  assert.strictEqual(wilmot.breakdown.topPickEligible, false);
  const roles = api.buildRecommendationRolesFromRanked(ranked);
  assert.notStrictEqual(roles.sleeper?.resort?.id, 'wilmot-mountain');
});

// ─────────────────────────────────────────────────────────────────────────────
// [PROTECT] Recommendation roles — TRAP (v1)
// ─────────────────────────────────────────────────────────────────────────────
test('[PROTECT] TRAP null when only one crowd-magnet in pool (Boston extended bluebird)', () => {
  const ranked = bostonExtendedRanked(h.bluebird());
  const roles = api.buildRecommendationRolesFromRanked(ranked);
  assert.strictEqual(roles.pick?.resort?.id, 'loon-mountain');
  assert.strictEqual(roles.trap, null);
});

test('[PROTECT] pickCrowdWarning false when pick is not crowded on a weekday', () => {
  resetState();
  state.origin = { lat: 42, lon: -71 };
  state.howFar = 1;
  state.skiDayPreset = 'weekday';
  state.targetDate = new Date('2026-01-14T12:00:00');
  h.setDrive('blue-hills-ski-area', 38);
  h.setDrive('loon-mountain', 140);
  h.sandbox.historyCache.set('blue-hills-ski-area', { total: 8, days: [] });
  const wx = h.bluebird();
  const ranked = [
    rankedEntry('blue-hills-ski-area', wx),
    rankedEntry('loon-mountain', wx),
  ].sort((a, b) => b.breakdown.score - a.breakdown.score);
  const roles = api.buildRecommendationRolesFromRanked(ranked);
  assert.strictEqual(roles.pick?.resort?.id, 'loon-mountain');
  assert.notStrictEqual(roles.pick?.pickCrowdWarning, true);
});

test('[PROTECT] TRAP prefers higher crowd score among qualifying magnets', () => {
  const ranked = crowdedSaturdayRanked(
    ['killington-resort', 'loon-mountain', 'tenney-mountain'],
    h.bluebird(),
    { historyIds: ['killington-resort', 'loon-mountain', 'tenney-mountain'] },
  );
  const roles = api.buildRecommendationRolesFromRanked(ranked);
  assert.strictEqual(roles.pick?.resort?.id, 'killington-resort');
  assert.strictEqual(roles.trap?.resort?.id, 'loon-mountain');
});

test('[PROTECT] trapRoleExplanation mentions crowd timing', () => {
  const ranked = crowdedSaturdayRanked(
    ['killington-resort', 'loon-mountain', 'wildcat-mountain'],
    h.bluebird(),
    { historyIds: ['killington-resort', 'loon-mountain', 'wildcat-mountain'] },
  );
  const roles = api.buildRecommendationRolesFromRanked(ranked);
  assert.ok(roles.trap?.resort?.id, 'expected a TRAP role');
  const copy = api.trapRoleExplanation(roles.trap);
  assert.match(copy, /bad timing|lift-line/i);
});

// ─────────────────────────────────────────────────────────────────────────────
// [PROTECT] Product v1 — dry bluebird, rain, Boston day trip, Sunapee powder
// ─────────────────────────────────────────────────────────────────────────────
test('[PROTECT] dry bluebird tier is good not bad (no fresh snow)', () => {
  const vd = api.verdictFromBreakdown(byId['killington-resort'], h.bluebird(), api.plannerScoreBreakdown(byId['killington-resort'], h.bluebird()));
  assert.strictEqual(vd.tier, 'good');
});

test('[PROTECT] rainy day tier is bad', () => {
  const vd = api.verdictFromBreakdown(byId['killington-resort'], h.wetDay(), api.plannerScoreBreakdown(byId['killington-resort'], h.wetDay()));
  assert.strictEqual(vd.tier, 'bad');
});

function bostonDayTripBluebirdRanked(ids) {
  resetState();
  state.origin = { lat: 42.3601, lon: -71.0589 };
  state.howFar = 0;
  state.skiDayPreset = 'saturday';
  state.targetDate = new Date('2026-01-17T12:00:00');
  const drives = {
    'killington-resort': 249,
    'loon-mountain': 140,
    'magic-mountain': 170,
    'blue-hills-ski-area': 38,
    'nashoba-valley': 42,
  };
  ids.forEach((id) => h.setDrive(id, drives[id] ?? 120));
  const wx = h.bluebird();
  return ids.map((id) => rankedEntry(id, wx)).sort((a, b) => b.breakdown.score - a.breakdown.score);
}

test('[PROTECT] Boston day trip bluebird fills Pick + Local + Sleeper + Crowd Watch', () => {
  const ranked = bostonDayTripBluebirdRanked([
    'killington-resort', 'loon-mountain', 'magic-mountain', 'blue-hills-ski-area',
  ]);
  const roles = api.buildRecommendationRolesFromRanked(ranked);
  assert.strictEqual(roles.pick?.resort?.id, 'killington-resort');
  assert.strictEqual(roles.local?.resort?.id, 'blue-hills-ski-area');
  assert.ok(roles.sleeper?.resort?.id);
  assert.strictEqual(roles.trap?.resort?.id, 'loon-mountain');
  assert.strictEqual(roles.pick.pickCrowdWarning, true);
  const ids = [roles.pick, roles.local, roles.sleeper, roles.trap].map(r => r?.resort?.id).filter(Boolean);
  assert.strictEqual(new Set(ids).size, ids.length, 'no duplicate roles');
});

test('[PROTECT] Sunapee 18 inches can beat Loon 0 as Top Pick on powder day', () => {
  resetState();
  state.origin = { lat: 42.3601, lon: -71.0589 };
  state.howFar = 0;
  h.setDrive('mount-sunapee', 110);
  h.setDrive('loon-mountain', 140);
  const sunWx = h.powder(18);
  const loonWx = h.bluebird();
  const ranked = [
    rankedEntry('mount-sunapee', sunWx),
    rankedEntry('loon-mountain', loonWx),
  ].sort((a, b) => b.breakdown.score - a.breakdown.score);
  const roles = api.buildRecommendationRolesFromRanked(ranked);
  assert.strictEqual(roles.pick?.resort?.id, 'mount-sunapee');
});

test('[PROTECT] no local within 45 min uses Another Smart Play fallback', () => {
  resetState();
  state.origin = { lat: 44.5, lon: -72.5 };
  state.howFar = 1;
  state.skiDayPreset = 'saturday';
  h.setDrive('killington-resort', 90);
  h.setDrive('wildcat-mountain', 120);
  h.setDrive('loon-mountain', 100);
  h.setDrive('tenney-mountain', 165);
  const wx = h.bluebird();
  const ranked = ['killington-resort', 'wildcat-mountain', 'loon-mountain', 'tenney-mountain']
    .map((id) => rankedEntry(id, wx))
    .sort((a, b) => b.breakdown.score - a.breakdown.score);
  const roles = api.buildRecommendationRolesFromRanked(ranked);
  assert.strictEqual(roles.pick?.resort?.id, 'killington-resort');
  assert.ok(roles.local?.resort?.id);
  assert.strictEqual(roles.local.roleVariant, 'another_smart_play');
  assert.strictEqual(api.localRoleLabel(roles.local), 'Worth a Look');
  assert.notStrictEqual(roles.local.resort.id, roles.sleeper?.resort?.id);
  assert.notStrictEqual(roles.local.resort.id, roles.trap?.resort?.id);
});

test('[PROTECT] rain does not assign generic Crowd Watch filler', () => {
  resetState();
  state.origin = { lat: 42, lon: -71 };
  state.howFar = 1;
  state.skiDayPreset = 'weekday';
  state.targetDate = new Date('2026-01-14T12:00:00');
  h.setDrive('killington-resort', 180);
  h.setDrive('wildcat-mountain', 155);
  h.setDrive('loon-mountain', 140);
  h.setDrive('tenney-mountain', 120);
  const ranked = [
    rankedEntry('killington-resort', h.wetDay()),
    rankedEntry('loon-mountain', h.wetDay()),
    rankedEntry('wildcat-mountain', h.wetDay()),
    rankedEntry('tenney-mountain', h.wetDay()),
  ].sort((a, b) => b.breakdown.score - a.breakdown.score);
  const roles = api.buildRecommendationRolesFromRanked(ranked);
  assert.ok(roles.pick?.resort?.id);
  assert.strictEqual(roles.sleeper, null, 'bad-tier pool must not produce Smart Play');
  assert.strictEqual(roles.trap, null, 'wet low-crowd pool must not get a generic Crowd Watch');
});

test('[PROTECT] credible crowd magnet still fills Crowd Watch on bluebird Saturday', () => {
  const ranked = crowdedSaturdayRanked(
    ['killington-resort', 'loon-mountain', 'wildcat-mountain'],
    h.bluebird(),
    { historyIds: ['killington-resort', 'loon-mountain', 'wildcat-mountain'] },
  );
  const roles = api.buildRecommendationRolesFromRanked(ranked);
  assert.strictEqual(roles.pick?.resort?.id, 'killington-resort');
  assert.ok(roles.trap?.resort?.id, 'expected credible Crowd Watch among busy magnets');
  assert.notStrictEqual(roles.trap.resort.id, roles.pick.resort.id);
  assert.ok(api.trapQualifiesForCrowdWatch(roles.trap));
});

test('[PROTECT] Wachusett can be Crowd Watch on Saturday near Boston', () => {
  resetState();
  state.origin = { lat: 42.36, lon: -71.06 };
  state.howFar = 0;
  state.targetDate = new Date('2026-01-17T12:00:00');
  state.skiDayPreset = 'saturday';
  h.setDrive('wachusett-mountain-ski-area', 125);
  h.setDrive('killington-resort', 200);
  h.setDrive('loon-mountain', 140);
  const wx = h.bluebird();
  const wachCrowd = api.crowdForecast(h.byId['wachusett-mountain-ski-area'], wx);
  assert.ok(wachCrowd.score >= 50, `Saturday Wachusett should read elevated crowds (${wachCrowd.score} ${wachCrowd.label})`);
  const wachEntry = {
    resort: h.byId['wachusett-mountain-ski-area'],
    wx,
    breakdown: api.plannerScoreBreakdown(h.byId['wachusett-mountain-ski-area'], wx, 0, null),
  };
  assert.ok(api.isCredibleTrapCandidate(wachEntry, new Set()));
  const ranked = ['killington-resort', 'loon-mountain', 'wachusett-mountain-ski-area', 'nashoba-valley']
    .map((id) => {
      const resort = h.byId[id];
      return { resort, wx, breakdown: api.plannerScoreBreakdown(resort, wx, 0, null) };
    })
    .sort((a, b) => b.breakdown.score - a.breakdown.score);
  const roles = api.buildRecommendationRolesFromRanked(ranked);
  const trapIds = [roles.trap?.resort?.id, roles.pick?.resort?.id].filter(Boolean);
  assert.ok(
    roles.trap?.resort?.id === 'wachusett-mountain-ski-area'
      || roles.trap?.resort?.id === 'loon-mountain',
    'expected a weekend crowd magnet as Crowd Watch',
  );
  if (roles.trap?.resort?.id === 'wachusett-mountain-ski-area') {
    assert.strictEqual(roles.trap.crowdLabel, 'Moderate');
    assert.ok(api.trapQualifiesForCrowdWatch(roles.trap));
    assert.notStrictEqual(roles.trap.crowdLabel, 'Quiet');
  }
});

test('[PROTECT] Crowd Watch never displays with Quiet / light crowds', () => {
  resetState();
  state.targetDate = new Date('2026-01-14T12:00:00');
  state.skiDayPreset = 'weekday';
  const wx = h.bluebird();
  const wach = {
    resort: h.byId['wachusett-mountain-ski-area'],
    wx,
    breakdown: api.plannerScoreBreakdown(h.byId['wachusett-mountain-ski-area'], wx, 0, null),
    crowdLabel: 'Quiet',
    crowdScore: 40,
  };
  assert.strictEqual(api.trapQualifiesForCrowdWatch(wach), false);
});

test('[PROTECT] local labels use Best Nearby Option vs Another Smart Play', () => {
  resetState();
  state.origin = { lat: 42, lon: -71 };
  state.howFar = 1;
  h.setDrive('blue-hills-ski-area', 38);
  h.setDrive('loon-mountain', 140);
  const ranked = [
    rankedEntry('blue-hills-ski-area', h.bluebird()),
    rankedEntry('loon-mountain', h.bluebird()),
  ].sort((a, b) => b.breakdown.score - a.breakdown.score);
  const roles = api.buildRecommendationRolesFromRanked(ranked);
  assert.strictEqual(roles.local?.resort?.id, 'blue-hills-ski-area');
  assert.strictEqual(api.localRoleLabel(roles.local), 'Best Nearby Option');
  assert.strictEqual(roles.local.roleVariant, 'nearby');
});

test('[PROTECT] ski today uses forecast[0] — weather and crowd stay on same day', () => {
  resetState();
  state.howFar = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  state.targetDate = new Date(today);

  const forecast = [
    h.dayFc({ snow: 2, code: 61, lo: 35, hi: 42 }),
    h.dayFc({ snow: 10, code: 75, lo: 12, hi: 24 }),
  ];
  const w = h.wx(forecast);

  assert.strictEqual(api.targetForecastIndex(), 0);
  assert.strictEqual(api.tripWindowSnow(forecast), 2);

  const todayTier = api.verdictFromBreakdown(
    byId['killington-resort'],
    w,
    api.plannerScoreBreakdown(byId['killington-resort'], w, 0, null),
  );
  assert.strictEqual(todayTier.tier, 'bad');

  state.targetDate = new Date(today);
  state.targetDate.setDate(state.targetDate.getDate() + 1);
  assert.strictEqual(api.targetForecastIndex(), 1);
  assert.strictEqual(api.tripWindowSnow(forecast), 10);

  const tomorrowTier = api.verdictFromBreakdown(
    byId['killington-resort'],
    w,
    api.plannerScoreBreakdown(byId['killington-resort'], w, 1, null),
  );
  assert.notStrictEqual(tomorrowTier.tier, 'bad');
});
