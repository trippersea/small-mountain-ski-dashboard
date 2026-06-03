/**
 * Direction 3 — Smart Play anchor suite.
 * These tests define expected obviousness behavior; tune the model to satisfy them.
 */
const { test } = require('node:test');
const assert = require('node:assert/strict');
const h = require('./harness-env.js');
const { api, byId, state } = h;

const NOT_SMART_PLAY = [
  'killington-resort', 'loon-mountain', 'cannon-mountain', 'waterville-valley',
  'mount-sunapee', 'stowe-mountain-resort', 'sugarbush', 'sunday-river',
  'sugarloaf', 'stratton-mountain', 'okemo-mountain-resort', 'mount-snow',
  'jay-peak', 'wildcat-mountain',
];

const CAN_SMART_PLAY = [
  'magic-mountain', 'tenney-mountain', 'bromley-mountain', 'saddleback-inc',
  'mad-river-glen', 'black-mountain', 'berkshire-east', 'burke-mountain',
  'pats-peak',
];

const NON_NE_OBVIOUS = ['whiteface-mountain-resort', 'gore-mountain', 'mt-bachelor'];

function resetBostonSaturday() {
  state.targetDate = new Date('2026-01-17T12:00:00');
  state.origin = { lat: 42.3601, lon: -71.0589 };
  state.howFar = 0;
  state.passFilter = 'All';
  state.skiDayPreset = 'saturday';
  state.weights = { snow: 1, crowd: 1, value: 1, size: 5 };
  state.weatherCache = {};
  h.clearDrive();
  h.sandbox.historyCache.clear();
}

function rankedEntry(id, wx) {
  const resort = byId[id];
  return { resort, wx, breakdown: api.plannerScoreBreakdown(resort, wx, 0, null) };
}

/** Build pool with pick forced to lead score; optional score overrides by id. */
function buildRanked(ids, wx, { pickId, scores = {}, drives = {}, historyIds = [] } = {}) {
  resetBostonSaturday();
  (historyIds.length ? historyIds : ids).forEach((id) => {
    h.sandbox.historyCache.set(id, { total: 8, days: [] });
  });
  ids.forEach((id) => h.setDrive(id, drives[id] ?? 150));
  const entries = ids.map((id) => {
    const e = rankedEntry(id, wx);
    if (scores[id] != null) {
      e.breakdown = { ...e.breakdown, score: scores[id] };
    }
    return e;
  });
  if (pickId) {
    const pick = entries.find((e) => e.resort.id === pickId);
    const maxOther = Math.max(...entries.filter((e) => e.resort.id !== pickId).map((e) => e.breakdown.score), 0);
    if (pick) pick.breakdown = { ...pick.breakdown, score: maxOther + 3 };
  }
  return entries.sort((a, b) => b.breakdown.score - a.breakdown.score);
}

function rolesFor(ranked) {
  return api.buildRecommendationRolesFromRanked(ranked);
}

const wx = h.bluebird();

// ── Obvious mountains must not be Smart Play when Killington is Top Pick ───────
for (const id of NOT_SMART_PLAY) {
  if (!byId[id]) continue;
  test(`[ANCHOR] ${id} is not Smart Play when Killington is Top Pick`, () => {
    const ranked = buildRanked(
      ['killington-resort', id, 'blue-hills-ski-area', 'loon-mountain'],
      wx,
      { pickId: 'killington-resort', drives: { 'blue-hills-ski-area': 38, 'wildcat-mountain': 155 } },
    );
    const roles = rolesFor(ranked);
    assert.strictEqual(roles.pick?.resort?.id, 'killington-resort');
    assert.notStrictEqual(roles.sleeper?.resort?.id, id, `${id} must not be Smart Play`);
  });
}

// ── Less-obvious mountains can be Smart Play when score-competitive ───────────
for (const id of CAN_SMART_PLAY) {
  if (!byId[id]) continue;
  test(`[ANCHOR] ${id} can be Smart Play vs obvious Top Pick`, () => {
    const ranked = buildRanked(
      ['killington-resort', id, 'loon-mountain', 'blue-hills-ski-area'],
      wx,
      {
        pickId: 'killington-resort',
        drives: {
          'killington-resort': 180,
          [id]: 160,
          'loon-mountain': 140,
          'blue-hills-ski-area': 38,
        },
      },
    );
    const roles = rolesFor(ranked);
    assert.strictEqual(roles.sleeper?.resort?.id, id, `${id} should qualify as Smart Play`);
  });
}

test('[ANCHOR] Smuggs edge — Independent magnet not auto Smart Play vs Killington pick', () => {
  const ranked = buildRanked(
    ['killington-resort', 'smugglers-notch-resort', 'magic-mountain', 'loon-mountain'],
    wx,
    { pickId: 'killington-resort' },
  );
  const roles = rolesFor(ranked);
  assert.notStrictEqual(roles.sleeper?.resort?.id, 'smugglers-notch-resort');
});

test('[ANCHOR] non-NE famous mountains not auto Smart Play vs regional pick', () => {
  resetBostonSaturday();
  state.origin = { lat: 44.26, lon: -73.97 };
  state.howFar = 1;
  h.setDrive('whiteface-mountain-resort', 120);
  h.setDrive('gore-mountain', 130);
  h.setDrive('magic-mountain', 200);
  h.sandbox.historyCache.set('whiteface-mountain-resort', { total: 8 });
  h.sandbox.historyCache.set('gore-mountain', { total: 8 });
  h.sandbox.historyCache.set('magic-mountain', { total: 8 });
  const ranked = [
    rankedEntry('whiteface-mountain-resort', wx),
    rankedEntry('gore-mountain', wx),
    rankedEntry('magic-mountain', wx),
  ].sort((a, b) => b.breakdown.score - a.breakdown.score);
  const roles = rolesFor(ranked);
  for (const id of NON_NE_OBVIOUS) {
    assert.notStrictEqual(roles.sleeper?.resort?.id, id);
  }
});

test('[ANCHOR] all-obvious Epic/Ikon pool returns null Smart Play', () => {
  const ranked = buildRanked(
    ['killington-resort', 'loon-mountain', 'stowe-mountain-resort', 'okemo-mountain-resort'],
    wx,
    { pickId: 'killington-resort' },
  );
  const roles = rolesFor(ranked);
  assert.strictEqual(roles.sleeper, null);
});

test('[ANCHOR] no Smart Play backfill from raw score rank', () => {
  const ranked = buildRanked(['killington-resort', 'loon-mountain'], wx, { pickId: 'killington-resort' });
  const roles = rolesFor(ranked);
  assert.strictEqual(roles.sleeper, null);
});

test('[ANCHOR] bluebird Saturday with base is not bad tier', () => {
  resetBostonSaturday();
  h.sandbox.historyCache.set('magic-mountain', { total: 8 });
  const vd = api.verdictFromBreakdown(
    byId['magic-mountain'],
    wx,
    api.plannerScoreBreakdown(byId['magic-mountain'], wx),
  );
  assert.notStrictEqual(vd.tier, 'bad');
});

test('[ANCHOR] bad-tier resort cannot be Smart Play', () => {
  resetBostonSaturday();
  state.howFar = 1;
  h.setDrive('killington-resort', 180);
  h.setDrive('magic-mountain', 165);
  const ranked = [
    rankedEntry('killington-resort', wx),
    rankedEntry('magic-mountain', h.wetDay()),
  ].sort((a, b) => b.breakdown.score - a.breakdown.score);
  const roles = rolesFor(ranked);
  assert.notStrictEqual(roles.sleeper?.resort?.id, 'magic-mountain');
});
