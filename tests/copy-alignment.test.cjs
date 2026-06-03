/**
 * Copy alignment — dry/no-snow must not read as a bad ski day.
 * Verdict + compare tooltip copy only; no scoring math assertions here.
 */
const { test } = require('node:test');
const assert = require('node:assert/strict');
const h = require('./harness-env.js');
const { api, byId, state, bluebird, wetDay, wx, dayFc } = h;

require('../compare-decision-summary.js');
require('../compare-score-explain.js');
const C = require('../compare-score-explain.js');

function resetState() {
  state.targetDate = new Date('2026-01-17T12:00:00');
  state.origin = null;
  state.howFar = 0;
  state.passFilter = 'All';
  state.stateFilter = 'All';
  state.verticalFilter = 'any';
  state.nightOnly = false;
  state.tempBucket = 'any';
  state.windBucket = 'any';
  state.skiDayPreset = 'saturday';
  state.weights = { snow: 1, crowd: 1, value: 1, size: 5 };
  state.weatherCache = {};
  h.clearDrive();
  h.sandbox.historyCache.clear();
}

function verdictText(vd) {
  return [vd.label, vd.detail, ...(vd.subPoints || [])].join(' ').toLowerCase();
}

const dryRow = {
  stormTotal: 0,
  tomorrowIn: 0,
  driveText: '2h 15m',
  crowdLabel: 'Moderate',
  passGroup: 'Independent',
  vertical: 1800,
  price: 95,
};

function snowLine(items) {
  return items.find((i) => i.k === 'snow');
}

test('[COPY] dry bluebird verdict is good — not poor/bad solely for no new snow', () => {
  resetState();
  const vd = api.verdictFromBreakdown(
    byId['killington-resort'],
    bluebird(),
    api.plannerScoreBreakdown(byId['killington-resort'], bluebird()),
  );
  assert.strictEqual(vd.tier, 'good');
  const text = verdictText(vd);
  assert.ok(!/poor conditions|skip —|bad day/i.test(text), text);
  assert.ok(/groomer|good conditions|clear and dry/i.test(text), text);
});

test('[COPY] dry bluebird with recent snow history adds groomer-positive subPoint', () => {
  resetState();
  h.sandbox.historyCache.set('killington-resort', { total: 6 });
  const vd = api.verdictFromBreakdown(
    byId['killington-resort'],
    bluebird(),
    api.plannerScoreBreakdown(byId['killington-resort'], bluebird()),
  );
  assert.strictEqual(vd.tier, 'good');
  const joined = (vd.subPoints || []).join(' ').toLowerCase();
  assert.ok(
    /groomer|recent snow supports|solid base/i.test(joined + ' ' + vd.detail.toLowerCase()),
    joined + ' | ' + vd.detail,
  );
});

test('[COPY] compare explainer Any Snow + dry — mixed/neutral, groomer not hurt', () => {
  const items = C.buildCompareScoreExplanation(dryRow, { snowPref: 1 });
  const snow = snowLine(items);
  assert.ok(snow, JSON.stringify(items));
  assert.notStrictEqual(snow.dir, 'hurt');
  assert.match(snow.text.toLowerCase(), /groomer|powder/);
  assert.ok(!/poor conditions|bad day|little new snow/i.test(snow.text));
});

test('[COPY] compare explainer 3"+ pref + dry — below target, not poor conditions', () => {
  const items = C.buildCompareScoreExplanation(dryRow, { snowPref: 5 });
  const snow = snowLine(items);
  assert.strictEqual(snow.dir, 'hurt');
  assert.match(snow.text.toLowerCase(), /below your.*snow target|not the snow day you asked for/);
  assert.ok(!/poor conditions|bad day/i.test(snow.text));
});

test('[COPY] compare explainer Powder pref + dry — target language only', () => {
  const items = C.buildCompareScoreExplanation(dryRow, { snowPref: 15 });
  const snow = snowLine(items);
  assert.strictEqual(snow.dir, 'hurt');
  assert.match(snow.text.toLowerCase(), /below your|snow target/);
  assert.ok(!/poor conditions/i.test(snow.text));
});

test('[COPY] compare explainer fresh snow tiers unchanged', () => {
  const some = C.buildCompareScoreExplanation({ ...dryRow, stormTotal: 1.5 }, { snowPref: 1 });
  assert.strictEqual(snowLine(some).dir, 'mixed');
  const dump = C.buildCompareScoreExplanation({ ...dryRow, tomorrowIn: 5 }, { snowPref: 1 });
  assert.strictEqual(snowLine(dump).dir, 'help');
});

test('[COPY] rain verdict still bad with negative wording', () => {
  resetState();
  const vd = api.verdictFromBreakdown(
    byId['killington-resort'],
    wetDay(),
    api.plannerScoreBreakdown(byId['killington-resort'], wetDay()),
  );
  assert.strictEqual(vd.tier, 'bad');
  assert.match(verdictText(vd), /rain|skip|poor/);
});

test('[COPY] powder preference + dry — marginal below target, not poor conditions', () => {
  resetState();
  state.weights.snow = 15;
  const vd = api.verdictFromBreakdown(
    byId['killington-resort'],
    bluebird(),
    api.plannerScoreBreakdown(byId['killington-resort'], bluebird()),
  );
  assert.strictEqual(vd.tier, 'marginal');
  assert.match(vd.label.toLowerCase(), /below your snow target/);
  assert.ok(!/poor conditions/i.test(verdictText(vd)));
});

test('[COPY] severe wind dry day stays bad — no groomer fluff', () => {
  resetState();
  const windy = wx([dayFc({ code: 0, hi: 28, lo: 18, snow: 0, wind: 40 })]);
  const vd = api.verdictFromBreakdown(
    byId['killington-resort'],
    windy,
    api.plannerScoreBreakdown(byId['killington-resort'], windy),
  );
  assert.strictEqual(vd.tier, 'bad');
  const joined = (vd.subPoints || []).join(' ');
  assert.ok(!/groomer should ski well|good clean day for groomers/i.test(joined));
});
