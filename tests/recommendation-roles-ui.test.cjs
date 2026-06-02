/**
 * UI/session helpers for recommendation roles — not scoring logic.
 * mergeFullPoolRoles mirrors sd-app.js (phase-1 pick stability + full-pool roles).
 */
const { test } = require('node:test');
const assert = require('node:assert/strict');

function mergeFullPoolRoles(stableVerdict, fullVerdict) {
  if (!stableVerdict || !fullVerdict?.roles) return stableVerdict;
  if (stableVerdict.resort?.id !== fullVerdict.resort?.id) return stableVerdict;
  return { ...stableVerdict, roles: fullVerdict.roles };
}

/** Mirrors compare/compare-page.js buildSideColumns (role column order + dedup). */
function buildSideColumns(pick, localRow, sleeperRow, trapRow, legacyRunners) {
  const cols = [];
  if (localRow && localRow.id && localRow.id !== pick.id) {
    cols.push({ row: localRow, kind: 'local' });
  }
  if (sleeperRow && sleeperRow.id && sleeperRow.id !== pick.id
      && !cols.some((c) => c.row.id === sleeperRow.id)) {
    cols.push({ row: sleeperRow, kind: 'sleeper' });
  }
  if (trapRow && trapRow.id && trapRow.id !== pick.id
      && !cols.some((c) => c.row.id === trapRow.id)) {
    cols.push({ row: trapRow, kind: 'trap' });
  }
  let legacyRank = 2;
  (legacyRunners || []).slice(0, 3).forEach((r) => {
    if (!r?.id || r.id === pick.id) return;
    if (cols.some((c) => c.row.id === r.id)) return;
    cols.push({ row: r, kind: 'runner', rank: legacyRank });
    legacyRank += 1;
  });
  return cols;
}

test('[UI] mergeFullPoolRoles attaches full-pool roles when pick is unchanged', () => {
  const stable = {
    resort: { id: 'killington-resort' },
    breakdown: { score: 58 },
    roles: { pick: { resort: { id: 'killington-resort' } }, local: null, sleeper: null, trap: null },
  };
  const full = {
    resort: { id: 'killington-resort' },
    breakdown: { score: 59 },
    roles: {
      pick: { resort: { id: 'killington-resort' }, pickCrowdWarning: true },
      local: { resort: { id: 'blue-hills-ski-area' } },
      sleeper: { resort: { id: 'wildcat-mountain' } },
      trap: { resort: { id: 'loon-mountain' } },
    },
  };
  const merged = mergeFullPoolRoles(stable, full);
  assert.strictEqual(merged.resort.id, 'killington-resort');
  assert.strictEqual(merged.breakdown.score, 58);
  assert.strictEqual(merged.roles.sleeper?.resort?.id, 'wildcat-mountain');
  assert.strictEqual(merged.roles.trap?.resort?.id, 'loon-mountain');
  assert.strictEqual(merged.roles.pick.pickCrowdWarning, true);
});

test('[UI] mergeFullPoolRoles skips merge when displayed pick differs', () => {
  const stable = { resort: { id: 'loon-mountain' }, roles: { trap: null } };
  const full = { resort: { id: 'killington-resort' }, roles: { trap: { resort: { id: 'loon-mountain' } } } };
  const merged = mergeFullPoolRoles(stable, full);
  assert.strictEqual(merged.roles.trap, null);
});

test('[UI] buildSideColumns orders local, sleeper, trap and dedupes pick', () => {
  const pick = { id: 'killington-resort', name: 'Killington' };
  const local = { id: 'blue-hills-ski-area', name: 'Blue Hills' };
  const sleeper = { id: 'wildcat-mountain', name: 'Wildcat' };
  const trap = { id: 'loon-mountain', name: 'Loon' };
  const cols = buildSideColumns(pick, local, sleeper, trap, []);
  assert.deepStrictEqual(cols.map((c) => c.kind), ['local', 'sleeper', 'trap']);
  assert.deepStrictEqual(cols.map((c) => c.row.id), [
    'blue-hills-ski-area',
    'wildcat-mountain',
    'loon-mountain',
  ]);
});

test('[UI] buildSideColumns legacy topPick-only session yields pick column only', () => {
  const pick = { id: 'loon-mountain', name: 'Loon' };
  const cols = buildSideColumns(pick, null, null, null, [{ id: 'wildcat-mountain' }]);
  assert.deepStrictEqual(cols.map((c) => c.kind), ['runner']);
});

test('[UI] compare session shape includes role rows when present', () => {
  const session = {
    roleSchemaVersion: 1,
    topPick: { id: 'killington-resort', role: 'pick' },
    local: { id: 'blue-hills-ski-area', role: 'local', localExplanation: 'Closer option.' },
    sleeper: { id: 'wildcat-mountain', role: 'sleeper', sleeperExplanation: 'Quieter play.' },
    trap: { id: 'loon-mountain', role: 'trap', trapExplanation: 'Crowd watch.' },
    runners: [],
  };
  const cols = buildSideColumns(
    session.topPick,
    session.local,
    session.sleeper,
    session.trap,
    session.runners,
  );
  assert.strictEqual(cols.length, 3);
  assert.ok(session.local.localExplanation);
  assert.ok(session.trap.trapExplanation);
});
