/**
 * UI/session helpers for recommendation roles — not scoring logic.
 */
const { test } = require('node:test');
const assert = require('node:assert/strict');
require('../recommendation-roles.js');

const { mergeRolesPerSlot, LABELS, localRoleLabel } = globalThis.WTSN_ROLE;

/** Mirrors sd-app.js mergeFullPoolRoles after per-slot merge. */
function mergeFullPoolRoles(stableVerdict, fullVerdict) {
  if (!stableVerdict || !fullVerdict?.roles) return stableVerdict;
  if (stableVerdict.resort?.id !== fullVerdict.resort?.id) return stableVerdict;
  const roles = mergeRolesPerSlot(stableVerdict.roles, fullVerdict.roles);
  return { ...stableVerdict, roles };
}

/** Mirrors compare/compare-page.js buildSideColumns (Smart Play → local → Crowd Watch). */
function buildSideColumns(pick, localRow, sleeperRow, trapRow, legacyRunners) {
  const cols = [];
  if (sleeperRow && sleeperRow.id && sleeperRow.id !== pick.id) {
    cols.push({ row: sleeperRow, kind: 'sleeper' });
  }
  if (localRow && localRow.id && localRow.id !== pick.id
      && !cols.some((c) => c.row.id === localRow.id)) {
    cols.push({ row: localRow, kind: 'local' });
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

test('[UI] mergeRolesPerSlot fills only missing side roles', () => {
  const cur = {
    pick: { resort: { id: 'killington-resort' } },
    local: { resort: { id: 'blue-hills-ski-area' } },
    sleeper: null,
    trap: null,
  };
  const full = {
    pick: { resort: { id: 'killington-resort' } },
    local: { resort: { id: 'tenney-mountain' } },
    sleeper: { resort: { id: 'wildcat-mountain' } },
    trap: { resort: { id: 'loon-mountain' } },
  };
  const m = mergeRolesPerSlot(cur, full);
  assert.strictEqual(m.pick.resort.id, 'killington-resort');
  assert.strictEqual(m.local.resort.id, 'blue-hills-ski-area');
  assert.strictEqual(m.sleeper.resort.id, 'wildcat-mountain');
  assert.strictEqual(m.trap.resort.id, 'loon-mountain');
});

test('[UI] mergeRolesPerSlot upgrades Crowd Watch when full pool is busier', () => {
  const cur = {
    pick: { resort: { id: 'waterville-valley' } },
    local: { resort: { id: 'blue-hills-ski-area' } },
    sleeper: { resort: { id: 'gunstock' }, breakdown: { score: 41.6 }, crowdLabel: 'Quiet', crowdScore: 25 },
    trap: { resort: { id: 'mount-sunapee' }, breakdown: { score: 39.7 }, crowdLabel: 'Moderate', crowdScore: 50 },
  };
  const full = {
    pick: { resort: { id: 'waterville-valley' } },
    local: { resort: { id: 'blue-hills-ski-area' } },
    sleeper: { resort: { id: 'gunstock' }, breakdown: { score: 41.6 }, crowdLabel: 'Quiet', crowdScore: 25 },
    trap: { resort: { id: 'loon-mountain' }, breakdown: { score: 40.8 }, crowdLabel: 'Busy', crowdScore: 75 },
  };
  const m = mergeRolesPerSlot(cur, full);
  assert.strictEqual(m.trap.resort.id, 'loon-mountain');
  assert.strictEqual(m.sleeper.resort.id, 'gunstock');
});

test('[UI] mergeRolesPerSlot keeps stronger phase-1 Crowd Watch over weaker full-pool trap', () => {
  const cur = {
    pick: { resort: { id: 'waterville-valley' } },
    local: null,
    sleeper: null,
    trap: { resort: { id: 'loon-mountain' }, crowdLabel: 'Busy', crowdScore: 75 },
  };
  const full = {
    pick: { resort: { id: 'waterville-valley' } },
    trap: { resort: { id: 'mount-sunapee' }, crowdLabel: 'Moderate', crowdScore: 50 },
  };
  const m = mergeRolesPerSlot(cur, full);
  assert.strictEqual(m.trap.resort.id, 'loon-mountain');
});

test('[UI] mergeRolesPerSlot does not merge when Top Pick differs', () => {
  const cur = { pick: { resort: { id: 'loon-mountain' } }, local: null, sleeper: null, trap: null };
  const full = { pick: { resort: { id: 'killington-resort' } }, trap: { resort: { id: 'loon-mountain' } } };
  const m = mergeRolesPerSlot(cur, full);
  assert.strictEqual(m.pick.resort.id, 'loon-mountain');
  assert.strictEqual(m.trap, null);
});

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
});

test('[UI] mergeFullPoolRoles skips merge when displayed pick differs', () => {
  const stable = { resort: { id: 'loon-mountain' }, roles: { pick: { resort: { id: 'loon-mountain' } }, trap: null } };
  const full = { resort: { id: 'killington-resort' }, roles: { pick: { resort: { id: 'killington-resort' } }, trap: { resort: { id: 'loon-mountain' } } } };
  const merged = mergeFullPoolRoles(stable, full);
  assert.strictEqual(merged.roles.trap, null);
});

test('[UI] role labels match canonical copy', () => {
  assert.strictEqual(LABELS.PICK, 'Top Pick');
  assert.strictEqual(LABELS.SLEEPER, 'Smart Play');
  assert.strictEqual(LABELS.TRAP, 'Crowd Watch');
  assert.strictEqual(localRoleLabel({ roleVariant: 'nearby' }), 'Best Nearby Option');
  assert.strictEqual(localRoleLabel({ roleVariant: 'another_smart_play' }), 'Another Smart Play');
});

test('[UI] buildSideColumns orders sleeper, local, trap and dedupes pick', () => {
  const pick = { id: 'killington-resort', name: 'Killington' };
  const local = { id: 'blue-hills-ski-area', name: 'Blue Hills' };
  const sleeper = { id: 'wildcat-mountain', name: 'Wildcat' };
  const trap = { id: 'loon-mountain', name: 'Loon' };
  const cols = buildSideColumns(pick, local, sleeper, trap, []);
  assert.deepStrictEqual(cols.map((c) => c.kind), ['sleeper', 'local', 'trap']);
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
