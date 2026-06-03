'use strict';

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');

const h = require('./harness-env.js');
const {
  selectNewsletterResorts,
  buildDisplayScores,
  scoringRuntime,
} = require('../lib/newsletter-scoring.js');

function rankedEntry(id, wx) {
  const resort = h.byId[id];
  const breakdown = h.api.plannerScoreBreakdown(resort, wx, h.api.targetForecastIndex());
  return { resort, wx, breakdown, history: null, display: { newSnow72hIn: 0, forecast48hIn: 0, baseDepthIn: 0 } };
}

describe('newsletter-scoring alignment', () => {
  it('selectNewsletterResorts uses shared pick and trap roles', () => {
    const { state } = h;
    state.origin = { lat: 42.3601, lon: -71.0589, label: 'Boston, MA' };
    state.howFar = 2;
    state.passFilter = 'All';
    state.skiDayPreset = 'saturday';
    state.targetDate = new Date('2026-01-17T12:00:00');
    state.verticalFilter = 'any';
    state.weights = { snow: 1, crowd: 1, value: 1, size: 5 };
    h.clearDrive();
    h.setDrive('loon-mountain', 140);
    h.setDrive('killington-resort', 180);
    h.setDrive('magic-mountain', 200);
    h.setDrive('blue-hills-ski-area', 38);

    const wx = h.bluebird();
    const ranked = [
      rankedEntry('killington-resort', wx),
      rankedEntry('loon-mountain', wx),
      rankedEntry('magic-mountain', wx),
      rankedEntry('blue-hills-ski-area', wx),
    ].sort((a, b) => b.breakdown.score - a.breakdown.score);

    const roles = h.api.buildRecommendationRolesFromRanked(ranked);
    const selection = selectNewsletterResorts(ranked, roles);

    assert.ok(selection.pick);
    assert.strictEqual(selection.pick.resort.id, roles.pick.resort.id);
    assert.strictEqual(selection.pick.scores.total, roles.pick.breakdown.score);

    if (roles.trap) {
      assert.strictEqual(selection.trap.resort.id, roles.trap.resort.id);
    }

    const alsoIds = new Set(selection.also.map((a) => a.resort.id));
    assert.ok(!alsoIds.has(selection.pick.resort.id));
    if (selection.trap) assert.ok(!alsoIds.has(selection.trap.resort.id));
  });

  it('buildDisplayScores exposes planner score as total', () => {
    const entry = rankedEntry('loon-mountain', h.bluebird());
    const scores = buildDisplayScores(entry);
    assert.strictEqual(scores.total, entry.breakdown.score);
    assert.ok(scores.crowdLabel);
  });

  it('newsletter runtime loads sd-scoring buildRecommendationRolesFromRanked', () => {
    assert.equal(typeof scoringRuntime.api.buildRecommendationRolesFromRanked, 'function');
    assert.equal(typeof scoringRuntime.api.plannerScoreBreakdown, 'function');
  });
});
