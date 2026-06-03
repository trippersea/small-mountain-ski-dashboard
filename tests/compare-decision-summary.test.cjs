/**
 * Compare page decision summary — explanation layer only.
 */
const { test } = require('node:test');
const assert = require('node:assert/strict');
require('../compare-decision-summary.js');

const E = globalThis.WTSN_COMPARE_EXPLAIN;

const pick = {
  id: 'grand-targhee-resort',
  name: 'Grand Targhee Resort',
  score: 72,
  driveText: '4h 10m',
  crowdLabel: 'Moderate',
  price: 89,
  vertical: 2270,
  trails: 72,
  stormTotal: 0,
  tomorrowIn: 0,
  passGroup: 'Independent',
};

const jackson = {
  id: 'jackson-hole-mountain-resort',
  name: 'Jackson Hole Mountain Resort',
  score: 70,
  driveText: '3h 45m',
  crowdLabel: 'Busy',
  price: 189,
  vertical: 4139,
  trails: 133,
  stormTotal: 0,
  tomorrowIn: 0,
  passGroup: 'Ikon',
};

test('[COMPARE] close-call note when scores within 5 points', () => {
  assert.strictEqual(E.isCloseCall(pick, jackson), true);
  const s = E.buildPickWinsSummary(pick, jackson, 'All');
  assert.ok(s.closeCallNote);
  assert.match(s.closeCallNote, /Close call/i);
});

test('[COMPARE] no close-call note when score gap is large', () => {
  const far = { ...jackson, score: 55 };
  assert.strictEqual(E.isCloseCall(pick, far), false);
  const s = E.buildPickWinsSummary(pick, far, 'All');
  assert.strictEqual(s.closeCallNote, null);
});

test('[COMPARE] summary mentions a key tradeoff for Targhee vs Jackson', () => {
  const s = E.buildPickWinsSummary(pick, jackson, 'All');
  const body = s.body.toLowerCase();
  assert.ok(
    body.includes('crowd') || body.includes('value') || body.includes('ticket') || body.includes('price'),
    'expected crowd or value language: ' + s.body,
  );
  assert.match(body, /targhee/i);
  assert.match(body, /jackson/i);
});

test('[COMPARE] tied scores use honest nod language', () => {
  const tied = { ...jackson, score: 72 };
  const s = E.buildPickWinsSummary(pick, tied, 'All');
  assert.match(s.body.toLowerCase(), /gets the nod|edges out/);
  assert.ok(!/crushed|runaway|dominat/i.test(s.body));
});

test('[COMPARE] findPrimaryCompetitor uses full rankings when close', () => {
  const comp = E.findPrimaryCompetitor(pick, [], [pick, jackson, { id: 'x', score: 40 }]);
  assert.strictEqual(comp.id, 'jackson-hole-mountain-resort');
});

test('[COMPARE] legacy session shape still builds summary without roles', () => {
  const legacyPick = { id: 'loon-mountain', name: 'Loon Mountain', score: 68, driveText: '2h', crowdLabel: 'Busy', price: 120, vertical: 2100, trails: 60, stormTotal: 1, tomorrowIn: 0 };
  const legacyRunner = { id: 'wildcat-mountain', name: 'Wildcat Mountain', score: 65, driveText: '2h 30m', crowdLabel: 'Moderate', price: 95, vertical: 1800, trails: 45, stormTotal: 0.5, tomorrowIn: 0 };
  const bundle = E.buildDecisionSummaryBundle(legacyPick, [{ row: legacyRunner, kind: 'runner' }], [], 'All');
  assert.strictEqual(bundle.heading, 'Why this recommendation?');
  assert.ok(bundle.body.length > 20);
});

test('[COMPARE] column tradeoff line for trap role', () => {
  const trap = { ...jackson, crowdLabel: 'Busy' };
  const line = E.buildColumnTradeoffLine(trap, pick, 'trap');
  assert.match(line, /lift lines|crowd/i);
});
