/**
 * Compare page decision copy — reads session row fields only (no scoring engine).
 */
(function (root) {
  const CLOSE_CALL_GAP = 5;
  const NAMED_RIVAL_GAP = 8;

  function mountainShortName(name) {
    let s = String(name || 'this mountain').trim();
    for (let i = 0; i < 3; i++) {
      const next = s.replace(/\s+(Resort|Mountain|Ski\s+Area|Ski\s+Resort|Ski|Area)$/i, '').trim();
      if (next === s) break;
      s = next;
    }
    return s || 'this mountain';
  }

  function parseDriveMins(text) {
    if (!text) return null;
    const hm = String(text).match(/(\d+)h\s*(\d+)?m?/);
    if (hm) return parseInt(hm[1], 10) * 60 + (parseInt(hm[2], 10) || 0);
    const m = String(text).match(/^(\d+)m/);
    if (m) return parseInt(m[1], 10);
    return null;
  }

  function crowdRank(label) {
    const l = String(label || '').toLowerCase();
    if (l.includes('quiet')) return 0;
    if (l.includes('moderate')) return 1;
    if (l.includes('busy')) return 2;
    if (l.includes('avoid') || l.includes('packed')) return 3;
    return 1;
  }

  function crowdPlain(label) {
    const l = String(label || '').toLowerCase();
    if (l.includes('quiet')) return 'lighter crowds';
    if (l.includes('busy')) return 'busier slopes';
    if (l.includes('avoid') || l.includes('packed')) return 'heavy crowds';
    if (l.includes('moderate')) return 'moderate crowds';
    return 'crowd outlook';
  }

  function snowMax(row) {
    return Math.max(Number(row?.stormTotal) || 0, Number(row?.tomorrowIn) || 0);
  }

  function roundedScore(row) {
    const s = Number(row?.score);
    return Number.isFinite(s) ? Math.round(s) : null;
  }

  function scoreGap(pick, other) {
    const ps = roundedScore(pick);
    const os = roundedScore(other);
    if (ps == null || os == null) return null;
    return ps - os;
  }

  function isCloseCall(pick, other, gapThreshold) {
    const gap = scoreGap(pick, other);
    if (gap == null) return false;
    const lim = gapThreshold != null ? gapThreshold : CLOSE_CALL_GAP;
    return gap >= 0 && gap <= lim;
  }

  function analyzeRowVsPick(row, pick) {
    const rDrive = parseDriveMins(row.driveText);
    const pDrive = parseDriveMins(pick.driveText);
    const rSnow = snowMax(row);
    const pSnow = snowMax(pick);
    const rPrice = Number(row.price) || 0;
    const pPrice = Number(pick.price) || 0;
    const rVert = Number(row.vertical) || 0;
    const pVert = Number(pick.vertical) || 0;
    const rTrails = Number(row.trails) || 0;
    const pTrails = Number(pick.trails) || 0;

    return {
      rowCloser: rDrive != null && pDrive != null && rDrive + 12 <= pDrive,
      pickCloser: rDrive != null && pDrive != null && pDrive + 12 <= rDrive,
      rowBigger: rVert > 0 && pVert > 0 && rVert >= pVert + 250,
      pickBigger: rVert > 0 && pVert > 0 && pVert >= rVert + 250,
      rowMoreTrails: rTrails > 0 && pTrails > 0 && rTrails >= pTrails + 20,
      pickMoreTrails: rTrails > 0 && pTrails > 0 && pTrails >= rTrails + 20,
      rowCheaper: rPrice > 0 && pPrice > 0 && rPrice + 12 <= pPrice,
      pickCheaper: rPrice > 0 && pPrice > 0 && pPrice + 12 <= rPrice,
      rowQuieter: crowdRank(row.crowdLabel) < crowdRank(pick.crowdLabel),
      pickQuieter: crowdRank(pick.crowdLabel) < crowdRank(row.crowdLabel),
      rowMoreSnow: rSnow >= pSnow + 0.75,
      pickMoreSnow: pSnow >= rSnow + 0.75,
      similarSnow: Math.abs(rSnow - pSnow) < 0.75,
      passMatch: row.passGroup && pick.passGroup && row.passGroup === pick.passGroup,
      passMismatch: row.passGroup && pick.passGroup && row.passGroup !== pick.passGroup,
    };
  }

  /** Strongest challenger the pick still beats (table columns + top of full rankings). */
  function findPrimaryCompetitor(pick, sideRows, fullRankings) {
    const candidates = [];
    (sideRows || []).forEach(function (r) {
      if (r?.id && r.id !== pick.id) candidates.push(r);
    });
    (fullRankings || []).slice(0, 10).forEach(function (r) {
      if (!r?.id || r.id === pick.id) return;
      if (candidates.some(function (c) { return c.id === r.id; })) return;
      const gap = scoreGap(pick, r);
      if (gap != null && gap >= 0 && gap <= NAMED_RIVAL_GAP) candidates.push(r);
    });

    let best = null;
    let bestScore = -Infinity;
    candidates.forEach(function (r) {
      const s = roundedScore(r);
      if (s == null) return;
      const gap = scoreGap(pick, r);
      if (gap != null && gap < 0) return;
      if (s > bestScore) {
        bestScore = s;
        best = r;
      }
    });
    return best;
  }

  function joinList(parts) {
    const p = parts.filter(Boolean);
    if (p.length <= 1) return p[0] || '';
    if (p.length === 2) return p[0] + ' and ' + p[1];
    return p.slice(0, -1).join(', ') + ', and ' + p[p.length - 1];
  }

  function pickWinPhrases(pick, competitor) {
    const t = analyzeRowVsPick(competitor, pick);
    const wins = [];
    if (t.pickQuieter) wins.push('lighter crowds');
    if (t.pickCheaper) wins.push('better ticket value');
    if (t.pickMoreSnow) wins.push('more snow in your forecast window');
    else if (t.similarSnow && !t.pickMoreSnow && !t.rowMoreSnow) wins.push('a similar snow forecast');
    if (t.pickCloser) wins.push('a shorter drive');
    if (t.pickBigger) wins.push('more vertical');
    if (t.pickMoreTrails) wins.push('more trails');
    return wins;
  }

  function competitorStrengthPhrases(pick, competitor) {
    const t = analyzeRowVsPick(competitor, pick);
    const strengths = [];
    if (t.rowCloser) strengths.push('closer');
    if (t.rowBigger) strengths.push('bigger');
    if (t.rowMoreTrails) strengths.push('more trails');
    if (t.rowCheaper) strengths.push('cheaper');
    if (t.rowMoreSnow) strengths.push('more forecast snow');
    if (!t.pickQuieter && crowdRank(competitor.crowdLabel) >= crowdRank(pick.crowdLabel) && crowdRank(competitor.crowdLabel) >= 2) {
      strengths.push('a marquee destination');
    }
    return strengths;
  }

  function buildPickWinsSummary(pick, competitor, passFilter) {
    const pickShort = mountainShortName(pick.name);
    if (!competitor) {
      return {
        body: pickShort + ' leads your search on the overall score. Use the table below to compare drive, snow, crowds, and price before you commit.',
        closeCallNote: null,
        rivalCallout: null,
      };
    }

    const altShort = mountainShortName(competitor.name);
    const gap = scoreGap(pick, competitor);
    const close = gap != null && gap <= CLOSE_CALL_GAP;
    const wins = pickWinPhrases(pick, competitor);
    const altPros = competitorStrengthPhrases(pick, competitor);

    let opener;
    if (gap === 0) {
      opener = pickShort + ' gets the nod over ' + altShort;
    } else if (close) {
      opener = pickShort + ' edges out ' + altShort;
    } else {
      opener = pickShort + ' outscores ' + altShort;
    }

    let body = opener;
    if (wins.length) body += ' on ' + joinList(wins.slice(0, 3));
    body += '.';

    if (altPros.length) {
      const proClause = joinList(altPros.slice(0, 3));
      body += ' ' + altShort + ' is ' + proClause + ', but the top pick still wins on the overall tradeoff for your trip settings';
      if (passFilter && passFilter !== 'All' && competitor.passGroup !== pick.passGroup && pick.passGroup === passFilter) {
        body += ' and ' + passFilter + ' pass fit';
      }
      body += '.';
    }

    if (close) {
      body += ' You may still prefer ' + altShort + ' if convenience or terrain size matters more than today\'s score.';
    }

    const closeCallNote = close
      ? 'Close call: these mountains are in the same score band. The Top Pick reflects the best overall tradeoff, not a runaway winner.'
      : (gap != null && gap > CLOSE_CALL_GAP
        ? null
        : null);

    let rivalCallout = null;
    const obviousRival = altPros.some(function (p) {
      return p === 'closer' || p === 'bigger' || p === 'more trails';
    });
    if (obviousRival && gap != null && gap <= NAMED_RIVAL_GAP) {
      const t = analyzeRowVsPick(competitor, pick);
      const notWins = altPros.includes('bigger') || altPros.includes('more trails')
        ? 'not the bigger or closer mountain'
        : altPros.includes('closer')
          ? 'not the closer option'
          : 'not the obvious convenience pick';
      const extra = [];
      if (t.similarSnow) extra.push('on a similar forecast');
      if (t.pickQuieter) extra.push('with ' + crowdPlain(pick.crowdLabel));
      if (t.pickCheaper) extra.push('at a lower walk-up price');
      if (!extra.length && wins.length) extra.push(joinList(wins.slice(0, 2)));
      const priority = altPros.includes('closer')
        ? 'drive time and convenience'
        : 'terrain size and resort scale';
      rivalCallout = {
        title: 'Why ' + pickShort + ' over ' + altShort + '?',
        body: pickShort + ' is ' + notWins + ', but today it wins '
          + (extra.length ? joinList(extra) : 'on the overall tradeoff')
          + '. ' + altShort + ' remains the stronger play if you prioritize ' + priority + '.',
      };
    }

    return { body, closeCallNote, rivalCallout };
  }

  function buildColumnTradeoffLine(row, pick, kind) {
    if (!row || !pick) return '';
    if (kind === 'trap') {
      const cl = String(row.crowdLabel || '').toLowerCase();
      if (cl.includes('busy') || cl.includes('avoid') || cl.includes('packed')) {
        return 'Great mountain, but timing may mean longer lift lines.';
      }
      return 'Worth watching for crowd timing even when the forecast looks fine.';
    }
    if (kind === 'sleeper') {
      const t = analyzeRowVsPick(row, pick);
      if (t.rowQuieter && t.similarSnow) return 'Quieter option with a similar forecast. The day sets up well here.';
      if (t.rowQuieter) return 'Less obvious pick with enough mountain to be worth considering today.';
      return 'Solid Option in a similar score band. Compare the full breakdown before you commit.';
    }
    if (kind === 'local' || kind === 'local_fallback') {
      const t = analyzeRowVsPick(row, pick);
      const bits = [];
      if (t.rowCloser) bits.push('closer');
      if (t.rowCheaper) bits.push('cheaper');
      const cons = [];
      if (t.pickMoreSnow && !t.similarSnow) cons.push('less snow in the forecast');
      if (t.pickBigger || t.pickMoreTrails) cons.push('smaller hill');
      if (bits.length && cons.length) {
        return bits[0].charAt(0).toUpperCase() + bits[0].slice(1)
          + (bits[1] ? ' and ' + bits[1] : '') + ', but ' + joinList(cons) + '.';
      }
      if (t.rowCloser) return 'Quick local turns if you want to skip the longer drive.';
      return 'Nearby option when convenience matters more than maximizing terrain.';
    }

    const t = analyzeRowVsPick(row, pick);
    const pros = [];
    const cons = [];
    if (t.rowCloser) pros.push('closer');
    if (t.rowBigger) pros.push('bigger');
    if (t.rowMoreTrails) pros.push('more trails');
    if (t.rowCheaper) pros.push('cheaper');
    if (t.rowMoreSnow) pros.push('more snow today');
    if (t.rowQuieter) pros.push('quieter');
    if (t.pickMoreSnow && !t.similarSnow) cons.push('less snow in the forecast');
    if (t.pickQuieter) cons.push('more crowded');
    if (t.pickCheaper) cons.push('pricier');
    if (t.pickCloser) cons.push('farther to drive');
    if (t.pickBigger) cons.push('smaller terrain');

    if (pros.length && cons.length) {
      const p = pros.slice(0, 2).map(function (x, i) {
        return i === 0 ? x.charAt(0).toUpperCase() + x.slice(1) : x;
      });
      return joinList(p) + ', but ' + joinList(cons.slice(0, 2)) + '.';
    }
    if (pros.length === 1) return pros[0].charAt(0).toUpperCase() + pros[0].slice(1) + '. Compare the full breakdown below.';
    if (cons.length) return 'Solid alternative, but ' + joinList(cons.slice(0, 2)) + ' on this day.';
    return 'Solid alternative for your search. See how it compares below.';
  }

  function buildDecisionSummaryBundle(pick, sideCols, fullRankings, passFilter) {
    const sideRows = (sideCols || []).map(function (c) { return c.row; });
    const competitor = findPrimaryCompetitor(pick, sideRows, fullRankings);
    const summary = buildPickWinsSummary(pick, competitor, passFilter);
    const columnTradeoffs = (sideCols || []).map(function (col) {
      const fallback = col.kind === 'local'
        ? null
        : col.kind === 'sleeper'
          ? null
          : col.kind === 'trap'
            ? null
            : null;
      return {
        id: col.row.id,
        kind: col.kind,
        line: buildColumnTradeoffLine(col.row, pick, col.kind) || fallback,
      };
    });
    return {
      heading: 'Why this recommendation?',
      competitorId: competitor?.id || null,
      scoreGap: competitor ? scoreGap(pick, competitor) : null,
      isCloseCall: competitor ? isCloseCall(pick, competitor) : false,
      body: summary.body,
      closeCallNote: summary.closeCallNote,
      rivalCallout: summary.rivalCallout,
      columnTradeoffs,
    };
  }

  const api = {
    CLOSE_CALL_GAP,
    mountainShortName,
    parseDriveMins,
    scoreGap,
    isCloseCall,
    findPrimaryCompetitor,
    buildPickWinsSummary,
    buildColumnTradeoffLine,
    buildDecisionSummaryBundle,
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  }
  root.WTSN_COMPARE_EXPLAIN = api;
})(typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : this);
