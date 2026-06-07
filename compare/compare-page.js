// ═══════════════════════════════════════════════════════════════════════════
// compare-page.js — Hydrates /compare/ with live session data
//
// Written by: sd-app.js → saveCompareSession() → localStorage['wtsn-compare']
// Read here on DOMContentLoaded. Falls back gracefully if no session exists.
//
// Session TTL: 4 hours. Stale sessions show the no-session CTA.
//
// Session shape (written by sd-app.js):
// {
//   ts:            <timestamp ms>,
//   origin:        { label: 'Boston, MA', lat, lon },
//   passFilter:    'All' | 'Epic' | 'Ikon' | 'Indy',
//   howFar:        0 | 1 | 2,
//   skiDayPreset:  'weekday' | 'friday' | 'saturday' | 'sunday',
//   forecastIndex: 0 | 1 | 2,  // which forecast[] slot was active (0=today, 1=tomorrow, 2=day after)
//   pick:          { /* same shape as topPick */, role: 'pick' },
//   local:         { /* same shape */, role: 'local', driveSavingsMins?, localExplanation? } | null,
//   sleeper:       null,
//   trap:          { /* same shape */, role: 'trap', trapExplanation? } | null,
//   topPick:       { /* backward-compatible alias for pick */ },
//   runners:       [ /* legacy score-ranked runners; empty in v1 */ ],
//   fullRankings:  [ /* top 25 scored rows, trip-mode snow totals */ ],
//   rankingTotal:  <count with weather in filter pool>,
// }
// ═══════════════════════════════════════════════════════════════════════════

(function () {
  'use strict';

  const SESSION_KEY = 'wtsn-compare';
  const SESSION_TTL = 4 * 60 * 60 * 1000; // 4 hours in ms
  const COMPARE_FULL_RANKING_LIMIT = 25;

  // ─── Tiny helpers ──────────────────────────────────────────────────────────
  function esc(s) {
    return String(s ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function cityName(label) {
    return (label || '').replace(/,.*$/, '').trim() || 'Your area';
  }

  function tripLabel(howFar) {
    if (howFar === 1) return 'Extended drive (3h+)';
    if (howFar === 2) return 'Any distance';
    return 'Day trip';
  }

  function dayLabel(preset, targetDateIso) {
    if (preset === 'weekday' && targetDateIso) {
      const d = new Date(targetDateIso + 'T12:00:00');
      if (!Number.isNaN(d.getTime())) {
        return d.toLocaleDateString('en-US', { weekday: 'long' });
      }
    }
    const map = { weekday: 'Weekday', friday: 'Friday', saturday: 'Saturday', sunday: 'Sunday' };
    return map[preset] || 'Today';
  }

  // Derive numeric drive minutes from driveText, e.g. "1h 48m" -> 108, "45m" -> 45.
  // IIFE-scoped so both buildScoreExplanation and buildCompareTable can use it.
  function parseDriveMins(text) {
    if (!text) return null;
    const hm = text.match(/(\d+)h\s*(\d+)?m?/);
    if (hm) return parseInt(hm[1]) * 60 + (parseInt(hm[2]) || 0);
    const m = text.match(/^(\d+)m/);
    if (m) return parseInt(m[1]);
    return null;
  }

  // Builds a readable forecast line: "4" tomorrow" or "Dry forecast, 36°F"
  // Uses forecastIndex (from session) so the temperature matches whichever day
  // the ranking engine was evaluating — not always forecast[0].
  function forecastLine(stormTotal, tomorrowIn, wxForecast) {
    let snow;
    if (tomorrowIn >= 4)        snow = `${tomorrowIn.toFixed(0)}\u2033 forecast`;
    else if (stormTotal >= 2)   snow = `${Math.round(stormTotal)}\u2033 in forecast`;
    else if (stormTotal >= 0.5) snow = `${stormTotal.toFixed(1)}\u2033 forecast`;
    else                        snow = 'Dry forecast';

    const fc = wxForecast?.[forecastIndex] || wxForecast?.[0];
    const hi = fc?.hi;
    return hi != null ? `${snow}, ${Math.round(hi)}\u00b0F` : snow;
  }

  // Derive a snow conditions label from storm totals + temp
  function conditionLabel(stormTotal, tomorrowIn, wxForecast) {
    const hi = wxForecast && wxForecast[0] ? wxForecast[0].hi : null;
    if (tomorrowIn >= 4 || stormTotal >= 6) return 'Powder inbound';
    if (tomorrowIn >= 1 || stormTotal >= 1) return 'Fresh snow possible';
    if (hi === null) return 'Check conditions';
    if (hi <= 28) return 'Cold and fast';
    if (hi <= 36) return 'Prime groomed';
    if (hi <= 44) return 'Soft and grippy';
    return 'Warm \u2014 go early';
  }

  function crowdTopLabel(label) {
    return label === 'Quiet'  ? 'Light crowds'
      : label === 'Avoid'     ? 'Packed'
      : label === 'Busy'      ? 'Busy'
      : 'Moderate crowds';
  }

  function crowdSubLabel(label) {
    return label === 'Quiet'  ? 'great choice'
      : label === 'Avoid'     ? 'avoid if you can'
      : label === 'Busy'      ? 'plan ahead'
      : 'plan ahead';
  }

  function crowdClass(label) {
    if (!label) return 'cp-crowd-light';
    const l = label.toLowerCase();
    if (l.includes('light') || l.includes('quiet') || l.includes('low')) return 'cp-crowd-light';
    if (l.includes('moderate') || l.includes('average') || l.includes('medium')) return 'cp-crowd-moderate';
    return 'cp-crowd-busy';
  }

  function passClass(p) {
    if (!p) return 'cp-pass-ind';
    const l = p.toLowerCase();
    if (l.includes('epic')) return 'cp-pass-epic';
    if (l.includes('ikon')) return 'cp-pass-ikon';
    if (l.includes('indy')) return 'cp-pass-indy';
    return 'cp-pass-ind';
  }

  // Generate a short reason for legacy runner columns (pre. Role-layer sessions).
  function autoReason(r) {
    const parts = [];
    // Use the session's ski day label so "tomorrow" isn't hardcoded for a Saturday trip.
    const daySnowLabel = skiDayPreset && skiDayPreset !== 'weekday'
      ? (dayLabel(skiDayPreset, targetDateIso) + ' forecast')
      : 'forecast';
    if (r.driveText)                         parts.push(r.driveText + ' away');
    if (r.stormTotal >= 4)                   parts.push(`${Math.round(r.stormTotal)}\u2033 of snow ${daySnowLabel}`);
    else if (r.tomorrowIn >= 1)              parts.push(`${r.tomorrowIn.toFixed(1)}\u2033 ${daySnowLabel}`);
    const cl = (r.crowdLabel || '').toLowerCase();
    if (cl.includes('quiet') || cl.includes('light')) parts.push('light crowds expected');
    if (r.passGroup && r.passGroup !== 'Independent') parts.push(`${r.passGroup} pass access`);
    return parts.length ? parts.join(' \u00B7 ') + '.' : 'Solid Option for your search.';
  }

  const ROLE_LABELS = (typeof WTSN_ROLE !== 'undefined' && WTSN_ROLE.LABELS)
    ? WTSN_ROLE.LABELS
    : {
        PICK: 'Top Pick',
        LOCAL: 'Best Nearby Option',
        LOCAL_ALT: 'Worth a Look',
        SLEEPER: 'Solid Option',
        TRAP: 'Crowd Watch',
      };

  /** Label for the LOCAL / Worth a Look column header. */
  function localCompareLabel(localR) {
    if (localR.localLabel) return localR.localLabel;
    if (typeof WTSN_ROLE !== 'undefined' && WTSN_ROLE.localRoleLabel) {
      return WTSN_ROLE.localRoleLabel(localR);
    }
    if (localR.roleVariant === 'another_smart_play') return ROLE_LABELS.LOCAL_ALT;
    return ROLE_LABELS.LOCAL;
  }

  /** Copy for the LOCAL role column. Matches homepage when localExplanation is persisted. */
  function localCompareReason(localR, pickR) {
    if (localR.localExplanation) return localR.localExplanation;
    if (localR.roleVariant === 'another_smart_play') {
      return 'No true nearby option in range. A credible mountain worth considering if the top pick does not fit your plan.';
    }
    const pickShort = (pickR?.name || 'your top pick')
      .replace(/\s+(Resort|Mountain|Ski\s+Area|Ski\s+Resort|Ski|Area)$/i, '').trim();
    if (localR.tier === 'marginal') {
      return `Quick local turns if you don't want the drive to ${pickShort}. Fair conditions, mostly about convenience.`;
    }
    return `Quick local turns if you don't want the drive to ${pickShort}. A nearby option when convenience matters.`;
  }

  /** Copy for the SLEEPER role column. Matches homepage when sleeperExplanation is persisted. */
  function sleeperCompareReason(sleeperR) {
    if (sleeperR.sleeperExplanation) return sleeperR.sleeperExplanation;
    return 'A credible mountain with a real reason to be on your radar. Close in the score band to the Top Pick.';
  }

  /** Copy for the TRAP role column. Matches homepage when trapExplanation is persisted. */
  function trapCompareReason(trapR) {
    if (trapR.trapExplanation) return trapR.trapExplanation;
    return 'Great mountain, bad timing. Conditions may hold, but crowds may mean long lift lines.';
  }

  /** Side columns: Solid Option, local slot, Crowd Watch. Then legacy runners (old sessions). */
  function buildSideColumns(pick, localRow, sleeperRow, trapRow, legacyRunners) {
    const cols = [];
    if (sleeperRow && sleeperRow.id && sleeperRow.id !== pick.id) {
      cols.push({ row: sleeperRow, kind: 'sleeper' });
    }
    if (localRow && localRow.id && localRow.id !== pick.id
        && !cols.some(function (c) { return c.row.id === localRow.id; })) {
      cols.push({ row: localRow, kind: 'local' });
    }
    if (trapRow && trapRow.id && trapRow.id !== pick.id
        && !cols.some(function (c) { return c.row.id === trapRow.id; })) {
      cols.push({ row: trapRow, kind: 'trap' });
    }
    let legacyRank = 2;
    (legacyRunners || []).slice(0, 3).forEach(function (r) {
      if (!r?.id || r.id === pick.id) return;
      if (cols.some(function (c) { return c.row.id === r.id; })) return;
      cols.push({ row: r, kind: 'runner', rank: legacyRank });
      legacyRank += 1;
    });
    return cols;
  }

  // ── Level 1 score explanation: directional, no numbers, no weights ──────────
  function buildScoreExplanation(r) {
    const snowPref = (session && session.weights && session.weights.snow != null)
      ? session.weights.snow
      : 1;
    if (typeof WTSN_COMPARE_EXPLAIN !== 'undefined'
        && WTSN_COMPARE_EXPLAIN.buildCompareScoreExplanation) {
      return WTSN_COMPARE_EXPLAIN.buildCompareScoreExplanation(r, { snowPref });
    }
    if (!r) return [];
    const snow = Math.max(Number(r.stormTotal) || 0, Number(r.tomorrowIn) || 0);
    if (snow >= 4) return [{ dir: 'help', k: 'snow', text: 'Fresh snow in the forecast' }];
    if (snow >= 1) return [{ dir: 'mixed', k: 'snow', text: 'Some new snow, not a big dump' }];
    return [{ dir: 'mixed', k: 'snow', text: 'Dry forecast. Better for groomers than powder chasing' }];
  }

  function scoreExplainHtml(r, name) {
    const items = buildScoreExplanation(r);
    if (!items.length) return '';
    const icon = { help: '+', hurt: '\u2212', mixed: '~' };
    const rows = items.map(function (it) {
      return '<div class="cp-explain-row cp-explain-' + it.dir + '">' +
        '<span class="cp-explain-ic" aria-hidden="true">' + icon[it.dir] + '</span>' +
        '<span class="cp-explain-txt">' + esc(it.text) + '</span>' +
      '</div>';
    }).join('');
    return '<div class="cp-explain-bubble" role="tooltip">' +
      '<div class="cp-explain-h">Why <b>' + esc(name) + '</b> scored here</div>' +
      rows +
      '<div class="cp-explain-foot">Based on live forecast, drive time, whether your pass covers it, and crowd outlook. No resort pays for placement.</div>' +
    '</div>';
  }

  // Find index of the best numeric value among an array of resort objects
  function bestIdx(arr, key, highIsGood) {
    let best = highIsGood ? -Infinity : Infinity;
    let idx  = -1;
    arr.forEach(function (r, i) {
      const v = parseFloat(r[key]);
      if (isNaN(v)) return;
      if (highIsGood  && v > best) { best = v; idx = i; }
      if (!highIsGood && v < best) { best = v; idx = i; }
    });
    return idx;
  }

  function bestBadge() {
    return '<span class="cp-cgt-best">Best</span>';
  }

  // ─── Read & validate session ────────────────────────────────────────────────
  let session = null;
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.ts && (Date.now() - parsed.ts) < SESSION_TTL) {
        session = parsed;
      }
    }
  } catch (e) {
    // localStorage blocked or parse error — show fallback
  }

  if (!session || !session.topPick || !session.origin) {
    showNoSession();
    return;
  }

  // ─── Hydrate page ──────────────────────────────────────────────────────────
  const {
    origin, passFilter, howFar, skiDayPreset, targetDate: targetDateIso = null,
    forecastIndex = 0,
    topPick, local: localRow = null, sleeper: sleeperRow = null, trap: trapRow = null, runners = [], fullRankings = [], rankingTotal = 0,
  } = session;
  const city = cityName(origin.label);
  const sideCols = buildSideColumns(topPick, localRow, sleeperRow, trapRow, runners);

  // Page title
  document.title = `Compare Near ${city} | WhereToSkiNext.com`;

  // H1 city span
  const citySpan = document.querySelector('.compare-page-title span');
  if (citySpan) citySpan.textContent = city;

  // Breadcrumb
  const breadcrumb = document.querySelector('.compare-page-breadcrumb');
  if (breadcrumb) breadcrumb.textContent = `Home / Compare Near ${city}`;

  // OG title (best-effort for share previews on JS navigation)
  const ogTitle = document.querySelector('meta[property="og:title"]');
  if (ogTitle) ogTitle.setAttribute('content', `Compare Near ${city} | WhereToSkiNext.com`);

  // ── Context chips ────────────────────────────────────────────────────────
  const ctxDiv = document.querySelector('.compare-page-context');
  if (ctxDiv) {
    const chips = [
      tripLabel(howFar),
      dayLabel(skiDayPreset, targetDateIso),
      (passFilter && passFilter !== 'All') ? `${passFilter} pass` : null,
      `From ${origin.label || city}`,
    ].filter(Boolean);
    const changeLink = '<a href="/">Change</a>';
    ctxDiv.innerHTML = chips.map(c => `<span>${esc(c)}</span>`).join('') + changeLink;
  }

  // ── Share button ─────────────────────────────────────────────────────────
  const shareBtn = document.getElementById('shareBtn');
  if (shareBtn) {
    shareBtn.addEventListener('click', function () {
      const url = window.location.href;
      if (navigator.share) {
        navigator.share({ title: document.title, url }).catch(function () {});
      } else if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url).then(function () {
          shareBtn.textContent = 'Copied!';
          setTimeout(function () { shareBtn.textContent = 'Share comparison'; }, 2400);
        });
      }
    });
  }

  // ── snowWindowLabel: trip-mode aware sub-label for snow forecast cells ───────
  // Day trip = "forecast", Extended drive / All = "3-day forecast".
  const snowWindowLabel = howFar === 0 ? 'forecast' : '3-day forecast';

  // ════════════════════════════════════════════════════════════════
  // BUILD AMAZON-STYLE COMPARISON TABLE
  // ════════════════════════════════════════════════════════════════

  function renderDecisionSummaryHtml(bundle) {
    if (!bundle) return '';
    let html = '<div class="cp-decision-summary" role="region" aria-labelledby="cpDecisionSummaryHeading">';
    html += '<h2 class="cp-decision-summary__title" id="cpDecisionSummaryHeading">'
      + esc(bundle.heading) + '</h2>';
    html += '<p class="cp-decision-summary__body">' + esc(bundle.body) + '</p>';
    if (bundle.closeCallNote) {
      html += '<p class="cp-decision-summary__close-call" role="note">'
        + esc(bundle.closeCallNote) + '</p>';
    }
    if (bundle.rivalCallout) {
      html += '<div class="cp-decision-summary__rival">';
      html += '<h3 class="cp-decision-summary__rival-title">' + esc(bundle.rivalCallout.title) + '</h3>';
      html += '<p class="cp-decision-summary__rival-body">' + esc(bundle.rivalCallout.body) + '</p>';
      html += '</div>';
    }
    html += '</div>';
    return html;
  }

  function tradeoffLineForColumn(col, pick, tradeoffById) {
    if (tradeoffById && col.row?.id && tradeoffById[col.row.id]) {
      return tradeoffById[col.row.id];
    }
    if (col.kind === 'local') return localCompareReason(col.row, pick);
    if (col.kind === 'sleeper') return sleeperCompareReason(col.row);
    if (col.kind === 'trap') return trapCompareReason(col.row);
    if (typeof WTSN_COMPARE_EXPLAIN !== 'undefined') {
      return WTSN_COMPARE_EXPLAIN.buildColumnTradeoffLine(col.row, pick, col.kind);
    }
    return col.row.headline || autoReason(col.row);
  }

  function buildCompareTable(pick, sideColsArr, tradeoffById) {
    const altRows = sideColsArr.map(function (c) { return c.row; });

    // Which alternative wins each metric (legacy "Best" badges among side columns).
    altRows.forEach(function (r) {
      r._driveMins = parseDriveMins(r.driveText);
    });
    const bDriveFinal = bestIdx(altRows, '_driveMins', false);
    const bPrice = bestIdx(altRows, 'price', false);
    const bVert  = bestIdx(altRows, 'vertical', true);
    const bSnow  = bestIdx(altRows, 'avgSnowfall', true);

    function badge(i, best) {
      return (altRows.length > 1 && i === best) ? bestBadge() : '';
    }

    // ── Column group ──
    let cols = '<colgroup><col class="cp-col-label"><col class="cp-col-pick">';
    sideColsArr.forEach(function (c) {
      cols += c.kind === 'local' ? '<col class="cp-col-local">'
        : c.kind === 'sleeper' ? '<col class="cp-col-sleeper">'
        : c.kind === 'trap' ? '<col class="cp-col-trap">'
        : '<col class="cp-col-runner">';
    });
    cols += '</colgroup>';

    // ── Header row ──
    let headCells = '<th class="cp-lbl" scope="col"></th>' +
      '<th class="cp-cgt-hd-pick" scope="col" data-compare-role="pick">' +
        '<div class="cp-cgt-pick-badge">' + esc(ROLE_LABELS.PICK) + '</div>' +
        '<div class="cp-cgt-mtn-name">' + esc(pick.name) + '</div>' +
        '<div class="cp-cgt-mtn-state">' + esc(pick.state) + '</div>' +
        '<a href="/ski-report/' + esc(pick.id) + '/" class="cp-cgt-head-cta">Full conditions \u2192</a>' +
      '</th>';

    sideColsArr.forEach(function (col) {
      const r = col.row;
      if (col.kind === 'local') {
        headCells +=
          '<th class="cp-cgt-hd-local" scope="col" data-compare-role="local">' +
            '<div class="cp-cgt-local-badge">' + esc(localCompareLabel(r)) + '</div>' +
            '<div class="cp-cgt-mtn-name">' + esc(r.name) + '</div>' +
            '<div class="cp-cgt-mtn-state">' + esc(r.state) + '</div>' +
            '<a href="/ski-report/' + esc(r.id) + '/" class="cp-cgt-head-cta">Full conditions \u2192</a>' +
          '</th>';
      } else if (col.kind === 'sleeper') {
        headCells +=
          '<th class="cp-cgt-hd-sleeper" scope="col" data-compare-role="sleeper">' +
            '<div class="cp-cgt-sleeper-badge">' + esc(ROLE_LABELS.SLEEPER) + '</div>' +
            '<div class="cp-cgt-mtn-name">' + esc(r.name) + '</div>' +
            '<div class="cp-cgt-mtn-state">' + esc(r.state) + '</div>' +
            '<a href="/ski-report/' + esc(r.id) + '/" class="cp-cgt-head-cta">Full conditions \u2192</a>' +
          '</th>';
      } else if (col.kind === 'trap') {
        headCells +=
          '<th class="cp-cgt-hd-trap" scope="col" data-compare-role="trap">' +
            '<div class="cp-cgt-trap-badge">' + esc(ROLE_LABELS.TRAP) + '</div>' +
            '<div class="cp-cgt-mtn-name">' + esc(r.name) + '</div>' +
            '<div class="cp-cgt-mtn-state">' + esc(r.state) + '</div>' +
            '<a href="/ski-report/' + esc(r.id) + '/" class="cp-cgt-head-cta">Full conditions \u2192</a>' +
          '</th>';
      } else {
        headCells +=
          '<th class="cp-cgt-hd-runner" scope="col">' +
            '<div class="cp-cgt-rank">#' + col.rank + '</div>' +
            '<div class="cp-cgt-mtn-name">' + esc(r.name) + '</div>' +
            '<div class="cp-cgt-mtn-state">' + esc(r.state) + '</div>' +
            '<a href="/ski-report/' + esc(r.id) + '/" class="cp-cgt-head-cta">Full conditions \u2192</a>' +
          '</th>';
      }
    });

    const thead = '<thead><tr>' + headCells + '</tr></thead>';

    // ── Helper: build one data row ──
    function row(label, pickCell, sideCells) {
      let tr = '<tr><td class="cp-lbl">' + label + '</td>' +
               '<td class="cp-td-pick">' + pickCell + '</td>';
      sideCells.forEach(function (cell, i) {
        const kind = sideColsArr[i]?.kind || 'runner';
        const tdCls = kind === 'local' ? 'cp-td-local'
          : kind === 'sleeper' ? 'cp-td-sleeper'
          : kind === 'trap' ? 'cp-td-trap'
          : 'cp-td-runner';
        tr += '<td class="' + tdCls + '">' + cell + '</td>';
      });
      return tr + '</tr>';
    }

    // ── Row 1: Why it fits ──
    const pickReason  = pick.headline || autoReason(pick) || 'Top score for your filters right now.';
    const reasonRow = row(
      'Tradeoff',
      '<span class="cp-cgt-reason cp-cgt-tradeoff">' + esc(pickReason) + '</span>',
      sideColsArr.map(function (col) {
        const txt = tradeoffLineForColumn(col, pick, tradeoffById);
        return '<span class="cp-cgt-reason cp-cgt-tradeoff">' + esc(txt) + '</span>';
      })
    );

    // ── Row 2: WTSN Score (show if available) ──
    const hasScore = pick.score != null || altRows.some(function (r) { return r.score != null; });
    let scoreRow = '';
    if (hasScore) {
      const pct = Math.min(100, Math.max(0, pick.score || 0));
      const pickScore =
        '<div class="cp-cgt-score-wrap">' +
          '<div class="cp-cgt-score-num">' + (pick.score != null ? Math.round(pick.score) : '\u2014') + '</div>' +
          '<button type="button" class="cp-explain-trigger" aria-label="Why ' + esc(pick.name) + ' scored this">i</button>' +
          scoreExplainHtml(pick, pick.name) +
        '</div>' +
        '<div class="cp-cgt-score-bar-track"><div class="cp-cgt-score-bar-fill" style="width:' + pct + '%"></div></div>' +
        '<div class="cp-cgt-sub">out of 100</div>';
      const sideScores = altRows.map(function (r) {
        const rPct = Math.min(100, Math.max(0, r.score || 0));
        return '<div class="cp-cgt-score-wrap">' +
            '<div class="cp-cgt-score-num">' + (r.score != null ? Math.round(r.score) : '\u2014') + '</div>' +
            '<button type="button" class="cp-explain-trigger" aria-label="Why ' + esc(r.name) + ' scored this">i</button>' +
            scoreExplainHtml(r, r.name) +
          '</div>' +
          '<div class="cp-cgt-score-bar-track" style="margin-top:5px"><div class="cp-cgt-score-bar-fill" style="width:' + rPct + '%"></div></div>' +
          '<div class="cp-cgt-sub">out of 100</div>';
      });
      scoreRow = row('WTSN Score', pickScore, sideScores);
    }

    // ── Row 3: Drive time ──
    const driveRow = row(
      'Drive time',
      '<div class="cp-cgt-val">' + esc(pick.driveText || '\u2014') + '</div>',
      altRows.map(function (r, i) {
        return '<div class="cp-cgt-val">' + esc(r.driveText || '\u2014') + badge(i, bDriveFinal) + '</div>';
      })
    );

    // ── Row 4: Snow forecast ──
    // Uses forecastIndex so temperature matches the day the ranking engine evaluated.
    // snowWindowLabel is defined at IIFE scope (above) for use here and in the rankings tbody.
    function forecastCell(r) {
      const st = r.stormTotal || 0;
      const ti = r.tomorrowIn || 0;
      const fc = r.wxForecast && r.wxForecast[forecastIndex] ? r.wxForecast[forecastIndex] : (r.wxForecast && r.wxForecast[0]);
      const hi = fc?.hi != null ? fc.hi : null;
      const tempStr = hi != null ? '<div class="cp-cgt-sub">High ' + Math.round(hi) + '\u00b0F</div>' : '';
      if (ti >= 4) {
        return '<div class="cp-cgt-snow-big">' + ti.toFixed(0) + '\u2033</div>' +
               '<div class="cp-cgt-sub">' + snowWindowLabel + (hi != null ? ' \u00B7 High ' + Math.round(hi) + '\u00b0F' : '') + '</div>';
      }
      if (st >= 0.5) {
        return '<div class="cp-cgt-snow-big">' + st.toFixed(1) + '\u2033</div>' +
               '<div class="cp-cgt-sub">' + snowWindowLabel + (hi != null ? ' \u00B7 High ' + Math.round(hi) + '\u00b0F' : '') + '</div>';
      }
      return '<div class="cp-cgt-snow-dry">Dry forecast</div>' + tempStr;
    }
    const forecastRow = row(
      'Snow forecast',
      forecastCell(pick),
      altRows.map(function (r) { return forecastCell(r); })
    );

    // ── Row 5: Conditions ──
    const condRow = row(
      'Conditions',
      '<div class="cp-cgt-val">' + esc(conditionLabel(pick.stormTotal || 0, pick.tomorrowIn || 0, pick.wxForecast)) + '</div>',
      altRows.map(function (r) {
        return '<div class="cp-cgt-val">' + esc(conditionLabel(r.stormTotal || 0, r.tomorrowIn || 0, r.wxForecast)) + '</div>';
      })
    );

    // ── Row 6: Crowd level ──
    const crowdRow = row(
      'Crowd level',
      (function () {
        const cls = crowdClass(pick.crowdLabel);
        return '<span class="cp-cgt-crowd ' + cls + '">' +
          '<span class="cp-cgt-crowd-dot"></span>' + esc(crowdTopLabel(pick.crowdLabel)) + '</span>' +
          '<div class="cp-cgt-sub">' + esc(crowdSubLabel(pick.crowdLabel)) + '</div>';
      })(),
      altRows.map(function (r) {
        const cls = crowdClass(r.crowdLabel);
        return '<span class="cp-cgt-crowd ' + cls + '">' +
          '<span class="cp-cgt-crowd-dot"></span>' + esc(crowdTopLabel(r.crowdLabel)) + '</span>';
      })
    );

    // ── Row 7: Pass ──
    const passRow = row(
      'Pass',
      '<span class="' + passClass(pick.passGroup) + '">' + esc(pick.passGroup || 'Independent') + '</span>',
      altRows.map(function (r) {
        return '<span class="' + passClass(r.passGroup) + '">' + esc(r.passGroup || 'Independent') + '</span>';
      })
    );

    // ── Row 8: Day ticket ──
    const priceRow = row(
      'Day ticket',
      (function () {
        const p = pick.price ? '$' + pick.price : '\u2014';
        return '<div class="cp-cgt-val">' + p + '</div><div class="cp-cgt-sub">walk-up price</div>';
      })(),
      altRows.map(function (r, i) {
        const p = r.price ? '$' + r.price : '\u2014';
        return '<div class="cp-cgt-val">' + p + badge(i, bPrice) + '</div><div class="cp-cgt-sub">walk-up price</div>';
      })
    );

    // ── Row 9: Vertical drop ──
    const vertRow = row(
      'Vertical',
      '<div class="cp-cgt-val">' + (pick.vertical ? pick.vertical.toLocaleString() + ' ft' : '\u2014') + '</div>',
      altRows.map(function (r, i) {
        const v = r.vertical ? r.vertical.toLocaleString() + ' ft' : '\u2014';
        return '<div class="cp-cgt-val">' + v + badge(i, bVert) + '</div>';
      })
    );

    // ── Row 10: Trails ──
    const trailsRow = row(
      'Trails',
      '<div class="cp-cgt-val">' + (pick.trails || '\u2014') + '</div>',
      altRows.map(function (r) {
        return '<div class="cp-cgt-val">' + (r.trails || '\u2014') + '</div>';
      })
    );

    // ── Row 11: Avg annual snow ──
    const avgSnowRow = row(
      'Avg annual snow',
      '<div class="cp-cgt-val">' + (pick.avgSnowfall ? pick.avgSnowfall + '\u2033' : '\u2014') + '</div>' +
        '<div class="cp-cgt-sub">historical average</div>',
      altRows.map(function (r, i) {
        const v = r.avgSnowfall ? r.avgSnowfall + '\u2033' : '\u2014';
        return '<div class="cp-cgt-val">' + v + badge(i, bSnow) + '</div>' +
          '<div class="cp-cgt-sub">historical average</div>';
      })
    );

    const tbody = '<tbody>' +
      reasonRow + scoreRow + driveRow + forecastRow +
      condRow + crowdRow + passRow + priceRow + vertRow + trailsRow + avgSnowRow +
      '</tbody>';

    return '<table class="cp-cgt">' + cols + thead + tbody + '</table>';
  }

  let decisionBundle = null;
  const tradeoffById = {};
  if (typeof WTSN_COMPARE_EXPLAIN !== 'undefined') {
    decisionBundle = WTSN_COMPARE_EXPLAIN.buildDecisionSummaryBundle(
      topPick,
      sideCols,
      fullRankings,
      passFilter,
    );
    (decisionBundle.columnTradeoffs || []).forEach(function (t) {
      if (t.id && t.line) tradeoffById[t.id] = t.line;
    });
  }

  const summaryHost = document.getElementById('compareDecisionSummary');
  if (summaryHost) {
    if (decisionBundle) {
      summaryHost.innerHTML = renderDecisionSummaryHtml(decisionBundle);
      summaryHost.hidden = false;
    } else {
      summaryHost.innerHTML = '';
      summaryHost.hidden = true;
    }
  }

  // Inject the table
  const tableContainer = document.getElementById('compareTableContainer');
  if (tableContainer) {
    tableContainer.innerHTML = buildCompareTable(topPick, sideCols, tradeoffById);
  }

  // ── Full rankings table (top 25 from homepage scoring; same filters) ───────
  const tbody = document.getElementById('compareTableBody');
  const rankingsHead = document.querySelector('#full-rankings .compare-page-section__head div > p:not(.compare-page-eyebrow)');
  const rankingRows = (fullRankings && fullRankings.length)
    ? fullRankings
    : [topPick, ...runners];

  if (rankingsHead && rankingTotal > COMPARE_FULL_RANKING_LIMIT) {
    rankingsHead.textContent =
      `Top ${rankingRows.length} of ${rankingTotal} mountains with live forecast. Same scoring as the homepage.`;
  } else if (rankingsHead && rankingRows.length) {
    rankingsHead.textContent =
      `${rankingRows.length} mountain${rankingRows.length !== 1 ? 's' : ''} ranked for your search. Same scoring as the homepage.`;
  }

  const snowColLabel = howFar === 0 ? 'Forecast' : '3-day snow';
  const snowTh = document.querySelector('#full-rankings .compare-page-table thead th:nth-child(3)');
  if (snowTh) snowTh.textContent = snowColLabel;

  if (tbody) {
    tbody.innerHTML = rankingRows.map(function (r, i) {
      const snowText  = r.stormTotal >= 0.5 ? `${r.stormTotal.toFixed(1)}\u2033 ${snowWindowLabel}` : 'Dry forecast';
      const priceText = r.price ? `$${r.price}` : '\u2014';
      const driveText = r.driveText || '\u2014';
      const crowdText = crowdTopLabel(r.crowdLabel) || '\u2014';
      const scoreText = r.score != null ? String(Math.round(r.score)) : '\u2014';
      const isPick = r.id === topPick.id;
      const isLocal = localRow && r.id === localRow.id;
      const isSleeper = sleeperRow && r.id === sleeperRow.id;
      const isTrap = trapRow && r.id === trapRow.id;
      let nameCell;
      if (isPick) {
        nameCell = `<strong>${esc(r.name)}</strong> <span class="cp-rank-pick-tag">${esc(ROLE_LABELS.PICK)}</span>`;
      } else if (isLocal) {
        nameCell = `<strong>${esc(r.name)}</strong> <span class="cp-rank-local-tag">${esc(localCompareLabel(localRow))}</span>`;
      } else if (isSleeper) {
        nameCell = `<strong>${esc(r.name)}</strong> <span class="cp-rank-sleeper-tag">${esc(ROLE_LABELS.SLEEPER)}</span>`;
      } else if (isTrap) {
        nameCell = `<strong>${esc(r.name)}</strong> <span class="cp-rank-trap-tag">${esc(ROLE_LABELS.TRAP)}</span>`;
      } else {
        nameCell = esc(r.name);
      }
      const rowCls = isPick ? 'cp-rank-row--pick'
        : isLocal ? 'cp-rank-row--local'
        : isSleeper ? 'cp-rank-row--sleeper'
        : isTrap ? 'cp-rank-row--trap'
        : '';
      return `<tr class="${rowCls}">
        <td>${i + 1}</td>
        <td><a href="/ski-report/${esc(r.id)}/">${nameCell}</a></td>
        <td>${esc(snowText)}</td>
        <td>${esc(driveText)}</td>
        <td>${esc(r.passGroup)}</td>
        <td>${esc(crowdText)}</td>
        <td>${esc(priceText)}</td>
        <td>${esc(scoreText)}</td>
      </tr>`;
    }).join('');
  }

  // ─── No-session fallback ────────────────────────────────────────────────────
  function showNoSession() {
    const container = document.getElementById('compareTableContainer');
    if (container) {
      container.innerHTML =
        '<div class="cp-cgt-empty">' +
          '<h2>No comparison loaded yet</h2>' +
          '<p>Run a search on the homepage first. We stash your trip so this page can show your top pick, optional best nearby option, and the full score breakdown.</p>' +
          '<a href="/" class="compare-page-btn compare-page-btn--primary">Find my mountain \u2192</a>' +
        '</div>';
    }

    // Also hide data-dependent sections
    const hero = document.querySelector('.compare-page-hero');
    if (hero) {
      const subtitle = hero.querySelector('.compare-page-subtitle');
      if (subtitle) subtitle.textContent = 'Compare your mountain options side by side.';
    }
  }

  // ─── Score-explanation bubble: tap to toggle (mobile); CSS handles hover ─────
  // Desktop opens on hover/focus via :focus-within; this adds tap-toggle for touch
  // and closes any open bubble when tapping elsewhere.
  document.addEventListener('click', function (e) {
    const trigger = e.target.closest('.cp-explain-trigger');
    const openWraps = document.querySelectorAll('.cp-cgt-score-wrap.cp-explain-open');
    if (trigger) {
      const wrap = trigger.closest('.cp-cgt-score-wrap');
      const wasOpen = wrap && wrap.classList.contains('cp-explain-open');
      openWraps.forEach(function (w) { w.classList.remove('cp-explain-open'); });
      if (wrap && !wasOpen) wrap.classList.add('cp-explain-open');
      e.stopPropagation();
      return;
    }
    // Tap outside any trigger closes open bubbles.
    if (!e.target.closest('.cp-explain-bubble')) {
      openWraps.forEach(function (w) { w.classList.remove('cp-explain-open'); });
    }
  });

})();
