/**
 * Shared user-facing labels for the four recommendation roles.
 * Loaded before sd-scoring.js (homepage) and compare/compare-page.js.
 */
(function (root) {
  const LABELS = {
    PICK: 'Top Pick',
    LOCAL: 'Best Nearby Option',
    LOCAL_ALT: 'Another Smart Play',
    SLEEPER: 'Smart Play',
    TRAP: 'Crowd Watch',
  };

  function localRoleLabel(localEntry) {
    if (!localEntry) return LABELS.LOCAL;
    return localEntry.roleVariant === 'another_smart_play'
      ? LABELS.LOCAL_ALT
      : LABELS.LOCAL;
  }

  function rankingTagForRole(role, localRow) {
    if (role === 'pick') return LABELS.PICK;
    if (role === 'sleeper') return LABELS.SLEEPER;
    if (role === 'trap') return LABELS.TRAP;
    if (role === 'local' || role === 'local_fallback') {
      return localRow?.localLabel || localRoleLabel(localRow || { roleVariant: role === 'local_fallback' ? 'another_smart_play' : 'nearby' });
    }
    return null;
  }

  /** Crowd pressure for merge tie-breaks (matches trap/sleeper scoring order). */
  function roleCrowdPressure(entry) {
    if (entry?.crowdScore != null && Number.isFinite(entry.crowdScore)) return entry.crowdScore;
    const label = entry?.crowdLabel || '';
    if (label === 'Avoid') return 90;
    if (label === 'Busy') return 75;
    if (label === 'Moderate') return 50;
    if (label === 'Quiet') return 25;
    return 0;
  }

  /** Positive when `b` is the stronger Crowd Watch candidate (busier magnet). */
  function compareTrapRoleEntries(a, b) {
    const ca = roleCrowdPressure(a);
    const cb = roleCrowdPressure(b);
    if (cb !== ca) return cb - ca;
    const sa = a?.breakdown?.score ?? -Infinity;
    const sb = b?.breakdown?.score ?? -Infinity;
    return sb - sa;
  }

  /** Positive when `b` is the stronger Smart Play candidate. */
  function compareSleeperRoleEntries(a, b) {
    const sa = a?.breakdown?.score ?? -Infinity;
    const sb = b?.breakdown?.score ?? -Infinity;
    if (Math.abs(sb - sa) > 2) return sb - sa;
    const ca = roleCrowdPressure(a);
    const cb = roleCrowdPressure(b);
    if (ca !== cb) return ca - cb;
    return sb - sa;
  }

  function pickStrongerSideRole(current, full, compare) {
    if (!current?.resort) return full || null;
    if (!full?.resort) return current;
    return compare(current, full) > 0 ? full : current;
  }

  /**
   * Merge side roles when Top Pick is unchanged (phase-1 stability + phase-2 pool).
   * LOCAL: keep phase-1 once set (convenience slot).
   * SLEEPER / TRAP: prefer the stronger full-pool role when both exist.
   */
  function mergeRolesPerSlot(current, full) {
    if (!current?.pick?.resort || !full?.pick?.resort) return current || full;
    if (current.pick.resort.id !== full.pick.resort.id) return current;
    return {
      pick: current.pick,
      local: current.local || full.local || null,
      sleeper: pickStrongerSideRole(current.sleeper, full.sleeper, compareSleeperRoleEntries),
      trap: pickStrongerSideRole(current.trap, full.trap, compareTrapRoleEntries),
    };
  }

  /** Subtle detail-panel banner after opening a role card from the verdict hero. */
  function isCrowdWatchLabel(label) {
    return label === 'Busy' || label === 'Avoid' || label === 'Moderate';
  }

  function detailBanner(fromRole, localVariant) {
    if (!fromRole) return null;
    if (fromRole === 'trap') {
      return 'Opened from Crowd Watch — this mountain may ski well, but crowds could affect the day.';
    }
    if (fromRole === 'sleeper') {
      return 'Opened from Smart Play — a strong alternative to the Top Pick.';
    }
    if (fromRole === 'local_fallback' || localVariant === 'another_smart_play') {
      return 'Opened from Another Smart Play — another credible option worth considering.';
    }
    if (fromRole === 'local') {
      return 'Opened from Best Nearby Option — the best closer-to-home choice today.';
    }
    return null;
  }

  root.WTSN_ROLE = {
    LABELS,
    localRoleLabel,
    rankingTagForRole,
    mergeRolesPerSlot,
    compareTrapRoleEntries,
    compareSleeperRoleEntries,
    detailBanner,
    isCrowdWatchLabel,
  };
})(typeof globalThis !== 'undefined' ? globalThis : this);
