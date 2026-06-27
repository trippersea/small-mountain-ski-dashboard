/**
 * wtsn-tiebreaker.js - the shared "why this ranks here" engine.
 *
 * Single source of truth for two things the rankings were missing:
 *   1. The score gap between any mountain and the leader (so a 3 point squeaker
 *      and a 40 point rout stop looking identically confident).
 *   2. The one concrete, honest reason one mountain edges out another - including
 *      the rain-line read (how much of each mountain stays above freezing on a
 *      warm day), which is the real differentiator between two similar hills.
 *
 * Both the homepage hero (sd-scoring.js closeCallEdgeReason) and the full
 * ranking list (sd-app.js row + mobile card) call this, so the same pair can
 * never read as a nail-biter on one surface and a blowout on another. Same
 * pattern as recommendation-roles.js: loaded before sd-scoring.js and sd-app.js.
 *
 * Nothing here invents an edge. Every reason is gated on the pick actually
 * leading on that axis, computed from real fields (elevation, forecast temp,
 * drive minutes, snow, crowd, price, vertical). If two mountains are genuinely
 * indistinguishable, the engine says so honestly instead of faking a reason.
 *
 * No scoring math lives here. This is copy and comparison only. The ranking
 * order is decided in sd-scoring.js and is never touched by this file.
 */
(function (root) {
  'use strict';

  // Environmental lapse rate, matched to summitTempF in sd-scoring.js.
  var LAPSE_F_PER_1000 = 3.5;

  // Minimum gap in "fraction of vertical above the rain line" for it to count as
  // the differentiator. 0.08 = one mountain keeps ~8 more points of its vert as
  // snow while the other turns wet. Below this it is noise, not a reason.
  var RAINLINE_MIN = 0.08;

  function num(v) {
    var n = Number(v);
    return Number.isFinite(n) ? n : null;
  }

  function clamp01(x) {
    return x < 0 ? 0 : x > 1 ? 1 : x;
  }

  function cap(s) {
    s = String(s || '');
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

  /** Strip "Resort / Mountain / Ski Area" tails for tight copy. */
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

  /**
   * Fraction of a mountain's vertical that sits above the rain-snow line today.
   * 1 = whole hill is below freezing (all snow). 0 = freezing level is above the
   * summit (all rain). Returns null when elevation data is missing, so callers
   * skip the rain-line reason gracefully rather than guessing.
   */
  function aboveFreezingFraction(baseElev, summitElev, baseTempF) {
    var base = num(baseElev);
    var summit = num(summitElev);
    var t = num(baseTempF);
    if (base == null || summit == null || t == null || summit <= base) return null;
    if (t <= 32) return 1; // freezing at the base, snow top to bottom
    var freezeAlt = base + ((t - 32) / LAPSE_F_PER_1000) * 1000;
    return clamp01((summit - freezeAlt) / (summit - base));
  }

  /** Positive when `pick` keeps meaningfully more terrain above the rain line, and only on a warm/wet day. */
  function rainLineEdge(pick, rival) {
    var pf = aboveFreezingFraction(pick.baseElev, pick.summitElev, pick.baseTempF);
    var rf = aboveFreezingFraction(rival.baseElev, rival.summitElev, rival.baseTempF);
    if (pf == null || rf == null) return 0;
    var wet = pick.rainLikely === true || rival.rainLikely === true
      || (num(pick.baseTempF) != null && num(pick.baseTempF) >= 34);
    if (!wet) return 0; // on a cold day both hold snow, so this is not the differentiator
    return pf - rf;
  }

  // Reason phrasing. Noun phrases read after "edges out X because of ___".
  var REASON_TEXT = {
    rainline: 'more terrain above the rain line',
    snow_big: 'more snow in your window',
    snow:     'a slightly better snow forecast',
    crowd:    'a lighter crowd outlook',
    drive:    'a shorter drive',
    ski:      'calmer wind and better temps up top',
    vert:     'more mountain under you',
    value:    'a better ticket price',
    narrow:   'a narrow overall edge',
  };

  // Short verb clauses for list rows: "..., but the pick ___."
  var REASON_SHORT = {
    rainline: 'keeps more snow up high',
    snow_big: 'has the better snow today',
    snow:     'has the better snow today',
    crowd:    'should be quieter',
    drive:    'is the shorter drive',
    ski:      'skis better up top',
    vert:     'is the bigger mountain',
    value:    'is the better deal',
    narrow:   'takes it on the overall day',
  };

  /**
   * The single strongest honest reason `pick` edges out `rival`.
   * Checks run in decision-relevance order. Returns { key, text } or null when
   * the pick has no measurable advantage on any axis (a true dead heat).
   */
  function buildEdgeReason(pick, rival) {
    if (!pick || !rival) return null;
    var checks = [];

    if (rainLineEdge(pick, rival) >= RAINLINE_MIN) checks.push({ w: 1, key: 'rainline' });

    var snowGap = (num(pick.snowIn) || 0) - (num(rival.snowIn) || 0);
    if (snowGap >= 2) checks.push({ w: 2, key: 'snow_big' });
    else if (snowGap >= 1) checks.push({ w: 3, key: 'snow' });

    if (num(pick.crowdRank) != null && num(rival.crowdRank) != null
      && pick.crowdRank < rival.crowdRank) checks.push({ w: 4, key: 'crowd' });

    var driveGap = (num(rival.driveMins) || 0) - (num(pick.driveMins) || 0);
    if (num(pick.driveMins) != null && num(rival.driveMins) != null && driveGap >= 12) {
      checks.push({ w: 5, key: 'drive' });
    }

    // Wind/temp edge only when the rain-line read is not already the story.
    var skiGap = ((pick.normalized && num(pick.normalized.skiability)) || 0)
      - ((rival.normalized && num(rival.normalized.skiability)) || 0);
    if (rainLineEdge(pick, rival) < RAINLINE_MIN && skiGap >= 0.06) checks.push({ w: 6, key: 'ski' });

    var vertGap = (num(pick.vertical) || 0) - (num(rival.vertical) || 0);
    if (vertGap >= 250) checks.push({ w: 7, key: 'vert' });

    var priceGap = (num(rival.price) || 0) - (num(pick.price) || 0);
    if (priceGap >= 12) checks.push({ w: 8, key: 'value' });

    if (checks.length) {
      checks.sort(function (a, b) { return a.w - b.w; });
      var k = checks[0].key;
      return { key: k, text: REASON_TEXT[k] };
    }

    // Fallback: never claim "the overall edge" with nothing behind it. Surface
    // the largest sub-score the pick actually leads on, if there is one.
    if (pick.normalized && rival.normalized) {
      var dims = [
        { key: 'snow',  d: (num(pick.normalized.snow) || 0)       - (num(rival.normalized.snow) || 0) },
        { key: 'ski',   d: (num(pick.normalized.skiability) || 0) - (num(rival.normalized.skiability) || 0) },
        { key: 'crowd', d: (num(pick.normalized.crowd) || 0)      - (num(rival.normalized.crowd) || 0) },
        { key: 'drive', d: (num(pick.normalized.drive) || 0)      - (num(rival.normalized.drive) || 0) },
        { key: 'value', d: (num(pick.normalized.value) || 0)      - (num(rival.normalized.value) || 0) },
      ].filter(function (x) { return x.d >= 0.02; })
        .sort(function (a, b) { return b.d - a.d; });
      if (dims.length) return { key: dims[0].key, text: REASON_TEXT[dims[0].key] };
    }

    // Genuinely too close to call on every measured axis. Say so honestly.
    return { key: 'narrow', text: REASON_TEXT.narrow };
  }

  /** Integer score gap (>= 0). null when either score is missing. */
  function scoreGap(leaderScore, rowScore) {
    var l = num(leaderScore);
    var r = num(rowScore);
    if (l == null || r == null) return null;
    var g = Math.round(l - r);
    return g < 0 ? 0 : g;
  }

  /** Short rank-gap label for the list. */
  function gapLabel(gap, isLeader) {
    if (isLeader) return 'Top pick';
    if (gap == null) return '';
    if (gap <= 0) return '<1 back';
    return gap + ' back';
  }

  // ─── Facts adapter ───────────────────────────────────────────────────────────
  // Both surfaces normalize into the same shape so one engine serves both.
  function factsFromEntry(entry, fi, extra) {
    if (!entry || !entry.resort || !entry.breakdown) return null;
    var r = entry.resort;
    var bd = entry.breakdown;
    var wx = entry.wx || null;
    var idx = (fi == null ? 0 : fi);
    var fc = (wx && wx.forecast && wx.forecast[idx]) ? wx.forecast[idx] : {};
    var snowIn = Math.max(
      num(bd.snowTotal) || 0,
      num(fc.snow) || 0,
      (extra && num(extra.snowIn)) || 0
    );
    return {
      name: r.name,
      score: num(bd.score),
      driveMins: num(bd.drive) != null ? num(bd.drive) : (extra && num(extra.driveMins)),
      snowIn: snowIn,
      crowdRank: crowdRankFromLabel(bd.crowdLabel || (extra && extra.crowdLabel)),
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

  /** Hero adapter: reason the pick edges out the runner-up, from raw entries. */
  function edgeReasonFromEntries(pickEntry, rivalEntry, fi) {
    var p = factsFromEntry(pickEntry, fi);
    var rv = factsFromEntry(rivalEntry, fi);
    if (!p || !rv) return null;
    return buildEdgeReason(p, rv);
  }

  // ─── List line builders ──────────────────────────────────────────────────────
  function rowStrengths(row, leader) {
    var pros = [];
    if (num(row.driveMins) != null && num(leader.driveMins) != null
      && leader.driveMins - row.driveMins >= 12) pros.push('closer');
    if (num(row.price) != null && num(leader.price) != null
      && leader.price - row.price >= 12) pros.push('cheaper');
    if (num(row.crowdRank) != null && num(leader.crowdRank) != null
      && row.crowdRank < leader.crowdRank) pros.push('quieter');
    if (num(row.vertical) != null && num(leader.vertical) != null
      && row.vertical - leader.vertical >= 250) pros.push('a bigger mountain');
    if ((num(row.snowIn) || 0) - (num(leader.snowIn) || 0) >= 1) pros.push('more snow today');
    return pros;
  }

  /** Non-leader row: what it offers, and the reason the pick still beats it. */
  function rowLine(row, leader) {
    if (!row || !leader) return { gap: null, line: '' };
    var gap = scoreGap(leader.score, row.score);
    var pros = rowStrengths(row, leader);
    var edge = buildEdgeReason(leader, row);
    var edgeShort = edge ? REASON_SHORT[edge.key] : REASON_SHORT.narrow;

    var line;
    if (pros.length) {
      var head = cap(pros[0]) + (pros[1] ? ' and ' + pros[1] : '');
      line = head + ', but the pick ' + edgeShort + '.';
    } else if (edge && edge.key !== 'narrow') {
      line = 'The pick ' + edgeShort + '.';
    } else {
      line = 'A near tie. The pick takes it on the overall day.';
    }
    return { gap: gap, line: line };
  }

  /** The leader row: name the runner-up it beat and why. */
  function leaderLine(leader, rival) {
    if (!leader) return { gap: 0, line: '' };
    if (!rival) return { gap: 0, line: 'Your top pick for these settings.' };
    var edge = buildEdgeReason(leader, rival);
    var rivalShort = shortName(rival.name);
    if (edge && edge.key !== 'narrow') {
      return { gap: 0, line: 'Edges out ' + rivalShort + '. It ' + REASON_SHORT[edge.key] + '.' };
    }
    return { gap: 0, line: 'A close call over ' + rivalShort + ', but it takes the overall day.' };
  }

  var api = {
    LAPSE_F_PER_1000: LAPSE_F_PER_1000,
    shortName: shortName,
    crowdRankFromLabel: crowdRankFromLabel,
    aboveFreezingFraction: aboveFreezingFraction,
    rainLineEdge: rainLineEdge,
    buildEdgeReason: buildEdgeReason,
    scoreGap: scoreGap,
    gapLabel: gapLabel,
    factsFromEntry: factsFromEntry,
    edgeReasonFromEntries: edgeReasonFromEntries,
    rowLine: rowLine,
    leaderLine: leaderLine,
    REASON_TEXT: REASON_TEXT,
    REASON_SHORT: REASON_SHORT,
  };

  root.WTSN_TIEBREAK = api;
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  }
})(typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : this);
