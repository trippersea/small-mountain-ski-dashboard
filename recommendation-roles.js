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

  /** Merge side roles when Top Pick is unchanged (phase-1 stability + phase-2 pool). */
  function mergeRolesPerSlot(current, full) {
    if (!current?.pick?.resort || !full?.pick?.resort) return current || full;
    if (current.pick.resort.id !== full.pick.resort.id) return current;
    return {
      pick: current.pick,
      local: current.local || full.local || null,
      sleeper: current.sleeper || full.sleeper || null,
      trap: current.trap || full.trap || null,
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
    detailBanner,
    isCrowdWatchLabel,
  };
})(typeof globalThis !== 'undefined' ? globalThis : this);
