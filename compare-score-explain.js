/**
 * Compare-page score explainer — copy only, no scoring math.
 */
(function (root) {
  'use strict';

  /** Map hero snow slider to snowPreferenceTarget-style threshold (0 = Any Snow).
   *  Canonical mapping lives in recommendation-roles.js; the fallback mirrors it
   *  so this module still works standalone (e.g. Node tests). Change thresholds
   *  in recommendation-roles.js, not here. */
  const snowPrefTarget = (root.WTSN_ROLE && root.WTSN_ROLE.snowPrefTarget) || function (snowPref) {
    const snow = Number(snowPref) || 1;
    if (snow >= 15) return 12;
    if (snow >= 10) return 6;
    if (snow >= 5) return 3;
    return 0;
  };

  /**
   * Directional score explanation lines for compare "i" tooltip.
   * @param {object} row - compare session row (stormTotal, tomorrowIn, crowdLabel, …)
   * @param {{ snowPref?: number }} [opts]
   * @returns {Array<{ dir: 'help'|'hurt'|'mixed', k: string, text: string }>}
   */
  function buildCompareScoreExplanation(row, opts) {
    if (!row) return [];
    const items = [];
    const snowPref = opts?.snowPref != null ? opts.snowPref : 1;
    const target = snowPrefTarget(snowPref);

    const dMins = parseDriveMins(row.driveText);
    if (dMins != null) {
      if (dMins <= 90) items.push({ dir: 'help', k: 'drive', text: 'Close drive from your start point' });
      else if (dMins >= 180) items.push({ dir: 'hurt', k: 'drive', text: 'Long drive to get there' });
      else items.push({ dir: 'mixed', k: 'drive', text: 'Moderate drive' });
    }

    const snow = Math.max(Number(row.stormTotal) || 0, Number(row.tomorrowIn) || 0);
    if (snow >= 4) {
      items.push({ dir: 'help', k: 'snow', text: 'Fresh snow in the forecast' });
    } else if (snow >= 1) {
      items.push({ dir: 'mixed', k: 'snow', text: 'Some new snow, not a big dump' });
    } else if (target >= 3) {
      items.push({
        dir: 'hurt',
        k: 'snow',
        text: `Below your ${target}"+ snow target. Still skiable if temps and base hold, but not the snow day you asked for`,
      });
    } else {
      items.push({
        dir: 'mixed',
        k: 'snow',
        text: 'Dry forecast. Better for groomers than powder chasing',
      });
    }

    const cl = String(row.crowdLabel || '').toLowerCase();
    if (cl.includes('quiet') || cl.includes('light')) {
      items.push({ dir: 'help', k: 'crowd', text: 'Light crowds expected' });
    } else if (cl.includes('busy') || cl.includes('avoid')) {
      items.push({ dir: 'hurt', k: 'crowd', text: 'Crowds likely to build' });
    } else if (cl) {
      items.push({ dir: 'mixed', k: 'crowd', text: 'Moderate crowds expected' });
    }

    if (row.passGroup && row.passGroup !== 'Independent') {
      items.push({ dir: 'help', k: 'pass', text: row.passGroup + ' pass access' });
    }

    const vert = Number(row.vertical) || 0;
    if (vert >= 2000) {
      items.push({ dir: 'help', k: 'fit', text: 'Big mountain, lots of terrain' });
    } else if (vert > 0 && vert < 1000) {
      items.push({ dir: 'mixed', k: 'fit', text: 'Smaller mountain' });
    }

    const price = Number(row.price) || 0;
    if (price > 0 && price <= 90) {
      items.push({ dir: 'help', k: 'value', text: 'Good value on the ticket' });
    } else if (price >= 150) {
      items.push({ dir: 'hurt', k: 'value', text: 'Pricey day ticket' });
    }

    const helps = items.filter(function (i) { return i.dir === 'help'; });
    const hurts = items.filter(function (i) { return i.dir === 'hurt'; });
    const mixed = items.filter(function (i) { return i.dir === 'mixed'; });
    const snowItem = items.find(function (i) { return i.k === 'snow'; });
    const capped = helps.slice(0, 2)
      .concat(hurts.slice(0, 2), mixed.filter(function (i) { return i.k !== 'snow'; }).slice(0, 1))
      .slice(0, 4);
    if (snowItem && !capped.some(function (i) { return i.k === 'snow'; })) {
      return [snowItem].concat(capped).slice(0, 4);
    }
    return capped;
  }

  /** Parse drive minutes from driveText. Canonical copy lives in
   *  recommendation-roles.js; inline fallback guards a script-order regression. */
  const parseDriveMins = (root.WTSN_ROLE && root.WTSN_ROLE.parseDriveMins) || function (text) {
    const hm = String(text || '').match(/(\d+)h\s*(\d+)?m?/);
    if (hm) return parseInt(hm[1], 10) * 60 + (parseInt(hm[2], 10) || 0);
    const m = String(text || '').match(/^(\d+)m/);
    return m ? parseInt(m[1], 10) : null;
  };

  const api = { buildCompareScoreExplanation, snowPrefTarget, parseDriveMins };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  }
  root.WTSN_COMPARE_EXPLAIN = Object.assign(root.WTSN_COMPARE_EXPLAIN || {}, api);
})(typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : this);
