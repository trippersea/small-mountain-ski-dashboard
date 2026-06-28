/**
 * wtsn-tiebreaker.js - the shared "why this ranks here" engine.
 *
 * Single source of truth for the reason copy that sits under each mountain's
 * WTSN Score, plus the rain-line read (how much of each mountain stays above
 * freezing on a warm day) that is the real differentiator between two similar
 * hills. Both the homepage hero (sd-scoring.js closeCallEdgeReason) and the
 * full ranking list (sd-app.js) call this, so the same pair can never read one
 * way on one surface and another way on the other. Loaded before sd-scoring.js
 * and sd-app.js, same pattern as recommendation-roles.js.
 *
 * Every reason is mountain-centric and honest: it describes the row mountain,
 * names a real strength, then a real catch, and is gated on actual fields
 * (elevation, forecast temp, drive minutes, snow, crowd, price, vertical). It
 * never invents an edge and never says "quieter" and "busier" in the same line.
 *
 * No scoring math lives here. The ranking order and the WTSN Score are decided
 * in sd-scoring.js and are never touched by this file.
 */
(function (root) {
  'use strict';

  var LAPSE_F_PER_1000 = 3.5; // matched to summitTempF in sd-scoring.js

  // Minimum gap in "fraction of vertical above the rain line" for it to count
  // as the differentiator. 0.08 = one mountain keeps ~8 more points of its vert
  // as snow while the other turns wet. Below this it is noise, not a reason.
  var RAINLINE_MIN = 0.08;

  function num(v) { var n = Number(v); return Number.isFinite(n) ? n : null; }
  function clamp01(x) { return x < 0 ? 0 : x > 1 ? 1 : x; }
  function cap(s) { s = String(s || ''); return s.charAt(0).toUpperCase() + s.slice(1); }
  function joinAnd(a) { return a.length <= 1 ? (a[0] || '') : a.slice(0, -1).join(', ') + ' and ' + a[a.length - 1]; }

  function shortName(name) {
    var s = String(name || 'this mountain').trim();
    for (var i = 0; i < 3; i++) {
      var next = s.replace(/\s+(Resort|Mountain|Ski\s+Area|Ski\s+Resort|Ski|Area)$/i, '').trim();
      if (next === s) break;
      s = next;
    }
    return s || 'this mountain';
  }

  function crowdRankFromLabel(label) {
    var l = String(label || '').toLowerCase();
    if (l.indexOf('quiet') !== -1 || l.indexOf('light') !== -1) return 0;
    if (l.indexOf('avoid') !== -1 || l.indexOf('packed') !== -1) return 3;
    if (l.indexOf('busy') !== -1) return 2;
    if (l.indexOf('moderate') !== -1) return 1;
    return 1;
  }

  /** Fraction of vertical above the rain-snow line. 1 = all snow, 0 = all rain, null = unknown. */
  function aboveFreezingFraction(baseElev, summitElev, baseTempF) {
    var base = num(baseElev), summit = num(summitElev), t = num(baseTempF);
    if (base == null || summit == null || t == null || summit <= base) return null;
    if (t <= 32) return 1;
    var freezeAlt = base + ((t - 32) / LAPSE_F_PER_1000) * 1000;
    return clamp01((summit - freezeAlt) / (summit - base));
  }

  /** Positive when `pick` keeps meaningfully more terrain above the rain line, warm/wet days only. */
  function rainLineEdge(pick, rival) {
    var pf = aboveFreezingFraction(pick.baseElev, pick.summitElev, pick.baseTempF);
    var rf = aboveFreezingFraction(rival.baseElev, rival.summitElev, rival.baseTempF);
    if (pf == null || rf == null) return 0;
    var wet = pick.rainLikely === true || rival.rainLikely === true
      || (num(pick.baseTempF) != null && num(pick.baseTempF) >= 34);
    if (!wet) return 0;
    return pf - rf;
  }

  // Noun phrases for the hero / leader line: read after "edges out X on ___".
  var REASON_TEXT = {
    rainline: 'more terrain above the rain line',
    snow_big: 'more snow in your window',
    snow:     'a better snow forecast',
    crowd:    'a lighter crowd outlook',
    drive:    'a shorter drive',
    ski:      'calmer wind and better temps up top',
    vert:     'more mountain under you',
    value:    'a better ticket price',
    narrow:   'a narrow overall edge',
  };

  /** Strongest honest reason `pick` edges out `rival`. { key, text } or null. */
  function buildEdgeReason(pick, rival) {
    if (!pick || !rival) return null;
    var checks = [];
    if (rainLineEdge(pick, rival) >= RAINLINE_MIN) checks.push({ w: 1, key: 'rainline' });
    var snowGap = (num(pick.snowIn) || 0) - (num(rival.snowIn) || 0);
    if (snowGap >= 2) checks.push({ w: 2, key: 'snow_big' });
    else if (snowGap >= 1) checks.push({ w: 3, key: 'snow' });
    if (num(pick.crowdRank) != null && num(rival.crowdRank) != null && pick.crowdRank < rival.crowdRank) checks.push({ w: 4, key: 'crowd' });
    var driveGap = (num(rival.driveMins) || 0) - (num(pick.driveMins) || 0);
    if (num(pick.driveMins) != null && num(rival.driveMins) != null && driveGap >= 12) checks.push({ w: 5, key: 'drive' });
    var skiGap = ((pick.normalized && num(pick.normalized.skiability)) || 0) - ((rival.normalized && num(rival.normalized.skiability)) || 0);
    if (rainLineEdge(pick, rival) < RAINLINE_MIN && skiGap >= 0.06) checks.push({ w: 6, key: 'ski' });
    var vertGap = (num(pick.vertical) || 0) - (num(rival.vertical) || 0);
    if (vertGap >= 250) checks.push({ w: 7, key: 'vert' });
    var priceGap = (num(rival.price) || 0) - (num(pick.price) || 0);
    if (priceGap >= 12) checks.push({ w: 8, key: 'value' });

    if (checks.length) {
      checks.sort(function (a, b) { return a.w - b.w; });
      return { key: checks[0].key, text: REASON_TEXT[checks[0].key] };
    }
    if (pick.normalized && rival.normalized) {
      // Crowd is intentionally NOT in this fallback. The primary check above
      // already cites crowd using the DISPLAYED crowd label; if it did not
      // fire, the visible crowd reads do not favor the pick, so we must never
      // resurrect a crowd edge from the scoring-time normalized value (that is
      // exactly how "lighter crowd outlook" appeared while both read Quiet).
      var dims = [
        { key: 'snow',  d: (num(pick.normalized.snow) || 0)       - (num(rival.normalized.snow) || 0) },
        { key: 'ski',   d: (num(pick.normalized.skiability) || 0) - (num(rival.normalized.skiability) || 0) },
        { key: 'drive', d: (num(pick.normalized.drive) || 0)      - (num(rival.normalized.drive) || 0) },
        { key: 'value', d: (num(pick.normalized.value) || 0)      - (num(rival.normalized.value) || 0) },
      ].filter(function (x) { return x.d >= 0.02; }).sort(function (a, b) { return b.d - a.d; });
      if (dims.length) return { key: dims[0].key, text: REASON_TEXT[dims[0].key] };
    }
    return { key: 'narrow', text: REASON_TEXT.narrow };
  }

  function scoreGap(leaderScore, rowScore) {
    var l = num(leaderScore), r = num(rowScore);
    if (l == null || r == null) return null;
    var g = Math.round(l - r);
    return g < 0 ? 0 : g;
  }

  // ─── Facts adapter (both surfaces normalize into this shape) ─────────────────
  function factsFromEntry(entry, fi, extra) {
    if (!entry || !entry.resort || !entry.breakdown) return null;
    var r = entry.resort, bd = entry.breakdown, wx = entry.wx || null;
    var idx = (fi == null ? 0 : fi);
    var fc = (wx && wx.forecast && wx.forecast[idx]) ? wx.forecast[idx] : {};
    var snowIn = Math.max(num(bd.snowTotal) || 0, num(fc.snow) || 0, (extra && num(extra.snowIn)) || 0);
    return {
      name: r.name,
      score: num(bd.score),
      driveMins: num(bd.drive) != null ? num(bd.drive) : (extra && num(extra.driveMins)),
      snowIn: snowIn,
      crowdRank: crowdRankFromLabel((extra && extra.crowdLabel) || bd.crowdLabel),
      price: num(r.price),
      vertical: num(r.vertical),
      trails: num(r.trails),
      passGroup: r.passGroup,
      baseElev: num(r.baseElevation),
      summitElev: num(r.summitElevation),
      baseTempF: num(fc.lo),
      rainLikely: extra && typeof extra.rainLikely === 'boolean' ? extra.rainLikely : null,
      normalized: bd.normalized || null,
    };
  }

  function edgeReasonFromEntries(pickEntry, rivalEntry, fi, pickExtra, rivalExtra) {
    var p = factsFromEntry(pickEntry, fi, pickExtra), rv = factsFromEntry(rivalEntry, fi, rivalExtra);
    if (!p || !rv) return null;
    return buildEdgeReason(p, rv);
  }

  // ─── Mountain-centric reason lines for the WTSN Score column ─────────────────
  function rowStrengths(row, leader) {
    var pros = [];
    if (num(row.driveMins) != null && num(leader.driveMins) != null && leader.driveMins - row.driveMins >= 12) pros.push('closer');
    if (num(row.price) != null && num(leader.price) != null && leader.price - row.price >= 12) pros.push('cheaper');
    if (num(row.crowdRank) != null && num(leader.crowdRank) != null && row.crowdRank < leader.crowdRank) pros.push('quieter');
    if (num(row.vertical) != null && num(leader.vertical) != null && row.vertical - leader.vertical >= 250) pros.push('a bigger mountain');
    if ((num(row.snowIn) || 0) - (num(leader.snowIn) || 0) >= 1) pros.push('more snow today');
    return pros;
  }

  // Comparatives that all read after "but ___ than the pick."
  function rowDrawbacks(row, leader) {
    var cons = [];
    if (num(leader.vertical) != null && num(row.vertical) != null && leader.vertical - row.vertical >= 250) cons.push('smaller');
    if (num(row.price) != null && num(leader.price) != null && row.price - leader.price >= 12) cons.push('pricier');
    if (num(row.crowdRank) != null && num(leader.crowdRank) != null && row.crowdRank > leader.crowdRank) cons.push('busier');
    if (num(row.driveMins) != null && num(leader.driveMins) != null && row.driveMins - leader.driveMins >= 12) cons.push('farther');
    if ((num(leader.snowIn) || 0) - (num(row.snowIn) || 0) >= 1) cons.push('drier today');
    if (rainLineEdge(leader, row) >= RAINLINE_MIN) cons.push('wetter up high');
    return cons;
  }

  function identityHook(row) {
    var p = String(row.passGroup || '');
    if (p === 'Epic' || p === 'Ikon') return 'On the ' + p + ' network';
    if (p === 'Indy') return 'An Indy pass pick';
    if (p === 'Independent') return 'An independent mountain';
    return 'A solid option';
  }

  /** Non-leader row line: row's strength, then its honest catch vs the pick. */
  function rowLine(row, leader) {
    if (!row || !leader) return { gap: null, line: '' };
    var gap = scoreGap(leader.score, row.score);
    var pros = rowStrengths(row, leader).slice(0, 2);
    var cons = rowDrawbacks(row, leader).slice(0, 2);
    var head = pros.length ? cap(joinAnd(pros)) : identityHook(row);
    var line;
    if (cons.length) line = head + ', but ' + joinAnd(cons) + ' than the pick.';
    else if (pros.length) line = head + ' than the pick, and a close call on the score.';
    else line = head + ', a close call with the pick on the day.';
    return { gap: gap, line: line };
  }

  /** Leader row line: name the runner-up it beat and why. When the two display
   *  the same rounded score, it is a tie, so we say "dead heat", never "edges out". */
  function leaderLine(leader, rival) {
    if (!leader) return { gap: 0, line: '' };
    if (!rival) return { gap: 0, line: 'Your top match for these settings.' };
    var edge = buildEdgeReason(leader, rival);
    var hasEdge = edge && edge.key !== 'narrow';
    var rivalShort = shortName(rival.name);
    var lr = Math.round(num(leader.score)), rr = Math.round(num(rival.score));
    var tied = Number.isFinite(lr) && Number.isFinite(rr) && lr === rr;
    if (tied) {
      return { gap: 0, line: hasEdge
        ? 'Dead heat with ' + rivalShort + '. Gets the nod on ' + edge.text + '.'
        : 'Dead heat with ' + rivalShort + '. Takes it on the overall tiebreak.' };
    }
    return { gap: scoreGap(leader.score, rival.score), line: hasEdge
      ? 'Top match. Edges out ' + rivalShort + ' on ' + edge.text + '.'
      : 'Top match. A close call over ' + rivalShort + '.' };
  }

  var api = {
    LAPSE_F_PER_1000: LAPSE_F_PER_1000,
    shortName: shortName,
    crowdRankFromLabel: crowdRankFromLabel,
    aboveFreezingFraction: aboveFreezingFraction,
    rainLineEdge: rainLineEdge,
    buildEdgeReason: buildEdgeReason,
    scoreGap: scoreGap,
    factsFromEntry: factsFromEntry,
    edgeReasonFromEntries: edgeReasonFromEntries,
    rowStrengths: rowStrengths,
    rowDrawbacks: rowDrawbacks,
    rowLine: rowLine,
    leaderLine: leaderLine,
    REASON_TEXT: REASON_TEXT,
  };

  root.WTSN_TIEBREAK = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : this);
