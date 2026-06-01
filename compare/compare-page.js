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
//   forecastIndex: 0 | 1 | 2,  // which forecast[] slot was active (0=tomorrow, 1=day after, 2=third day)
//   topPick:       { id, name, state, passGroup, driveText, stormTotal,
//                    tomorrowIn, wxForecast, crowdLabel, price, vertical,
//                    trails, avgSnowfall, headline, detail,
//                    baseElevation?, summitElevation?, score? },
//   runners:       [ /* same shape, up to 3, may lack headline/detail */ ]
// }
// ═══════════════════════════════════════════════════════════════════════════

(function () {
  'use strict';

  const SESSION_KEY = 'wtsn-compare';
  const SESSION_TTL = 4 * 60 * 60 * 1000; // 4 hours in ms

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
    if (howFar === 1) return '\uD83C\uDFD4 Extended drive';
    if (howFar === 2) return '\u2708 Any distance';
    return '\uD83D\uDE97 Day trip';
  }

  function dayLabel(preset) {
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

  // Generate a short reason for runners that have no headline/detail
  function autoReason(r) {
    const parts = [];
    // Use the session's ski day label so "tomorrow" isn't hardcoded for a Saturday trip.
    const daySnowLabel = skiDayPreset && skiDayPreset !== 'weekday'
      ? (dayLabel(skiDayPreset) + ' forecast')
      : 'forecast';
    if (r.driveText)                         parts.push(r.driveText + ' away');
    if (r.stormTotal >= 4)                   parts.push(`${Math.round(r.stormTotal)}\u2033 of snow ${daySnowLabel}`);
    else if (r.tomorrowIn >= 1)              parts.push(`${r.tomorrowIn.toFixed(1)}\u2033 ${daySnowLabel}`);
    const cl = (r.crowdLabel || '').toLowerCase();
    if (cl.includes('quiet') || cl.includes('light')) parts.push('light crowds expected');
    if (r.passGroup && r.passGroup !== 'Independent') parts.push(`${r.passGroup} pass access`);
    return parts.length ? parts.join(' \u00B7 ') + '.' : 'Solid alternative for your search.';
  }

  // ── Level 1 score explanation: directional, no numbers, no weights ──────────
  // Reads only the plain summary fields present on each compare row (driveText,
  // snow, crowdLabel, passGroup, price, vertical) — never weights or formula —
  // so it explains the score without exposing proprietary scoring logic.
  // Returns a short ordered list of { dir, text } where dir is help|hurt|mixed.
  function buildScoreExplanation(r) {
    if (!r) return [];
    const items = [];

    // Drive — derive minutes from the same driveText shown on the page.
    const dMins = parseDriveMins(r.driveText);
    if (dMins != null) {
      if (dMins <= 90)       items.push({ dir: 'help',  k: 'drive', text: 'Close drive from your start point' });
      else if (dMins >= 180) items.push({ dir: 'hurt',  k: 'drive', text: 'Long drive to get there' });
      else                   items.push({ dir: 'mixed', k: 'drive', text: 'Moderate drive' });
    }

    // Snow — uses the trip-window total / ski-day inches already on the row.
    const snow = Math.max(Number(r.stormTotal) || 0, Number(r.tomorrowIn) || 0);
    if (snow >= 4)        items.push({ dir: 'help',  k: 'snow', text: 'Fresh snow in the forecast' });
    else if (snow >= 1)   items.push({ dir: 'mixed', k: 'snow', text: 'Some new snow, not a big dump' });
    else                  items.push({ dir: 'hurt',  k: 'snow', text: 'Dry forecast, little new snow' });

    // Crowds — directional read of the crowd label.
    const cl = (r.crowdLabel || '').toLowerCase();
    if (cl.includes('quiet') || cl.includes('light'))      items.push({ dir: 'help',  k: 'crowd', text: 'Light crowds expected' });
    else if (cl.includes('busy') || cl.includes('avoid') || cl.includes('packed')) items.push({ dir: 'hurt', k: 'crowd', text: 'Crowds likely to build' });
    else if (cl)                                           items.push({ dir: 'mixed', k: 'crowd', text: 'Moderate crowds expected' });

    // Pass fit — only call it out as a help when it's a major network.
    if (r.passGroup && r.passGroup !== 'Independent') {
      items.push({ dir: 'help', k: 'pass', text: r.passGroup + ' pass access' });
    }

    // Mountain size — vertical as a rough "big mountain" signal.
    const vert = Number(r.vertical) || 0;
    if (vert >= 2000)      items.push({ dir: 'help',  k: 'fit', text: 'Big mountain, lots of terrain' });
    else if (vert > 0 && vert < 1000) items.push({ dir: 'mixed', k: 'fit', text: 'Smaller mountain' });

    // Value — ticket price directional.
    const price = Number(r.price) || 0;
    if (price > 0 && price <= 90)   items.push({ dir: 'help', k: 'value', text: 'Good value on the ticket' });
    else if (price >= 150)          items.push({ dir: 'hurt', k: 'value', text: 'Pricey day ticket' });

    // Order: helpers first (most encouraging), then mixed, then hurts.
    // Cap at 4 so the bubble stays scannable.
    const helps = items.filter(i => i.dir === 'help');
    const hurts = items.filter(i => i.dir === 'hurt');
    const mixed = items.filter(i => i.dir === 'mixed');
    return [...helps.slice(0, 2), ...hurts.slice(0, 2), ...mixed.slice(0, 1)].slice(0, 4);
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
      '<div class="cp-explain-foot">Based on live forecast, drive time, pass fit, and crowd outlook. No resort pays for placement.</div>' +
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
  const { origin, passFilter, howFar, skiDayPreset, forecastIndex = 0, topPick, runners = [] } = session;
  const city = cityName(origin.label);

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
      dayLabel(skiDayPreset),
      (passFilter && passFilter !== 'All') ? `\uD83C\uDFAB ${passFilter} Pass` : null,
      `\uD83D\uDCCD From ${origin.label || city}`,
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
  // Day trip = "forecast", Weekend = "weekend forecast", All = "3-day forecast".
  // Used in both the comparison table and the full rankings table.
  const snowWindowLabel = howFar === 0 ? 'forecast' : howFar === 1 ? 'weekend forecast' : '3-day forecast';

  // ════════════════════════════════════════════════════════════════
  // BUILD AMAZON-STYLE COMPARISON TABLE
  // ════════════════════════════════════════════════════════════════

  function buildCompareTable(pick, runnersArr) {
    const all     = [pick, ...runnersArr.slice(0, 3)];
    const runOnly = runnersArr.slice(0, 3);

    // Which runner wins each metric (lower or higher)
    const bDrive = bestIdx(runOnly, '_driveMins', false); // see below
    const bPrice = bestIdx(runOnly, 'price',       false);
    const bVert  = bestIdx(runOnly, 'vertical',    true);
    const bSnow  = bestIdx(runOnly, 'avgSnowfall', true);

    // Annotate runners with numeric drive minutes
    runOnly.forEach(function (r) {
      r._driveMins = parseDriveMins(r.driveText);
    });
    // Recompute best drive after annotation
    const bDriveFinal = bestIdx(runOnly, '_driveMins', false);

    function badge(i, best) {
      return (runOnly.length > 1 && i === best) ? bestBadge() : '';
    }

    // ── Column group ──
    let cols = '<colgroup><col class="cp-col-label"><col class="cp-col-pick">';
    runOnly.forEach(function () { cols += '<col class="cp-col-runner">'; });
    cols += '</colgroup>';

    // ── Header row ──
    let headCells = '<th class="cp-lbl" scope="col"></th>' +
      '<th class="cp-cgt-hd-pick" scope="col">' +
        '<div class="cp-cgt-pick-badge">Our Pick</div>' +
        '<div class="cp-cgt-mtn-name">' + esc(pick.name) + '</div>' +
        '<div class="cp-cgt-mtn-state">' + esc(pick.state) + '</div>' +
        '<a href="/ski-report/' + esc(pick.id) + '/" class="cp-cgt-head-cta">Full conditions \u2192</a>' +
      '</th>';

    runOnly.forEach(function (r, i) {
      headCells +=
        '<th class="cp-cgt-hd-runner" scope="col">' +
          '<div class="cp-cgt-rank">#' + (i + 2) + '</div>' +
          '<div class="cp-cgt-mtn-name">' + esc(r.name) + '</div>' +
          '<div class="cp-cgt-mtn-state">' + esc(r.state) + '</div>' +
          '<a href="/ski-report/' + esc(r.id) + '/" class="cp-cgt-head-cta">Full conditions \u2192</a>' +
        '</th>';
    });

    const thead = '<thead><tr>' + headCells + '</tr></thead>';

    // ── Helper: build one data row ──
    function row(label, pickCell, runnerCells) {
      let tr = '<tr><td class="cp-lbl">' + label + '</td>' +
               '<td class="cp-td-pick">' + pickCell + '</td>';
      runnerCells.forEach(function (cell) {
        tr += '<td class="cp-td-runner">' + cell + '</td>';
      });
      return tr + '</tr>';
    }

    // ── Row 1: Why it won ──
    // Winner uses the same directional reason builder as the runners (autoReason).
    // Previously fell through to pick.detail, which is the snow-conditions label
    // (e.g. "Poor conditions") — wrong slot, made the winner look self-contradictory.
    const pickReason  = pick.headline || autoReason(pick) || 'Top score for your filters right now.';
    const reasonRow = row(
      'Why it won',
      '<span class="cp-cgt-reason">' + esc(pickReason) + '</span>',
      runOnly.map(function (r) {
        const txt = r.headline || autoReason(r);
        return '<span class="cp-cgt-reason">' + esc(txt) + '</span>';
      })
    );

    // ── Row 2: WTSN Score (show if available) ──
    const hasScore = pick.score != null || runOnly.some(function (r) { return r.score != null; });
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
      const runnerScores = runOnly.map(function (r) {
        const rPct = Math.min(100, Math.max(0, r.score || 0));
        return '<div class="cp-cgt-score-wrap">' +
            '<div class="cp-cgt-score-num">' + (r.score != null ? Math.round(r.score) : '\u2014') + '</div>' +
            '<button type="button" class="cp-explain-trigger" aria-label="Why ' + esc(r.name) + ' scored this">i</button>' +
            scoreExplainHtml(r, r.name) +
          '</div>' +
          '<div class="cp-cgt-score-bar-track" style="margin-top:5px"><div class="cp-cgt-score-bar-fill" style="width:' + rPct + '%"></div></div>' +
          '<div class="cp-cgt-sub">out of 100</div>';
      });
      scoreRow = row('WTSN Score', pickScore, runnerScores);
    }

    // ── Row 3: Drive time ──
    const driveRow = row(
      'Drive time',
      '<div class="cp-cgt-val">' + esc(pick.driveText || '\u2014') + '</div>',
      runOnly.map(function (r, i) {
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
      runOnly.map(function (r) { return forecastCell(r); })
    );

    // ── Row 5: Conditions ──
    const condRow = row(
      'Conditions',
      '<div class="cp-cgt-val">' + esc(conditionLabel(pick.stormTotal || 0, pick.tomorrowIn || 0, pick.wxForecast)) + '</div>',
      runOnly.map(function (r) {
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
      runOnly.map(function (r) {
        const cls = crowdClass(r.crowdLabel);
        return '<span class="cp-cgt-crowd ' + cls + '">' +
          '<span class="cp-cgt-crowd-dot"></span>' + esc(crowdTopLabel(r.crowdLabel)) + '</span>';
      })
    );

    // ── Row 7: Pass ──
    const passRow = row(
      'Pass',
      '<span class="' + passClass(pick.passGroup) + '">' + esc(pick.passGroup || 'Independent') + '</span>',
      runOnly.map(function (r) {
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
      runOnly.map(function (r, i) {
        const p = r.price ? '$' + r.price : '\u2014';
        return '<div class="cp-cgt-val">' + p + badge(i, bPrice) + '</div><div class="cp-cgt-sub">walk-up price</div>';
      })
    );

    // ── Row 9: Vertical drop ──
    const vertRow = row(
      'Vertical',
      '<div class="cp-cgt-val">' + (pick.vertical ? pick.vertical.toLocaleString() + ' ft' : '\u2014') + '</div>',
      runOnly.map(function (r, i) {
        const v = r.vertical ? r.vertical.toLocaleString() + ' ft' : '\u2014';
        return '<div class="cp-cgt-val">' + v + badge(i, bVert) + '</div>';
      })
    );

    // ── Row 10: Trails ──
    const trailsRow = row(
      'Trails',
      '<div class="cp-cgt-val">' + (pick.trails || '\u2014') + '</div>',
      runOnly.map(function (r) {
        return '<div class="cp-cgt-val">' + (r.trails || '\u2014') + '</div>';
      })
    );

    // ── Row 11: Avg annual snow ──
    const avgSnowRow = row(
      'Avg annual snow',
      '<div class="cp-cgt-val">' + (pick.avgSnowfall ? pick.avgSnowfall + '\u2033' : '\u2014') + '</div>' +
        '<div class="cp-cgt-sub">historical average</div>',
      runOnly.map(function (r, i) {
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

  // Inject the table
  const tableContainer = document.getElementById('compareTableContainer');
  if (tableContainer) {
    if (runners.length === 0) {
      // Only a top pick, no runners — still show single-column table
      tableContainer.innerHTML = buildCompareTable(topPick, []);
    } else {
      tableContainer.innerHTML = buildCompareTable(topPick, runners);
    }
  }

  // ── Full rankings table ──────────────────────────────────────────────────
  const tbody = document.getElementById('compareTableBody');
  if (tbody) {
    const allResorts = [topPick, ...runners];
    tbody.innerHTML = allResorts.map(function (r, i) {
      // stormTotal is already trip-mode aware (written by saveCompareSession using tripWindowSnow).
      const snowText  = r.stormTotal >= 0.5 ? `${r.stormTotal.toFixed(1)}\u2033 ${snowWindowLabel}` : 'Dry forecast';
      const priceText = r.price ? `$${r.price}` : '\u2014';
      const driveText = r.driveText || '\u2014';
      const crowdText = crowdTopLabel(r.crowdLabel) || '\u2014';
      return `<tr>
        <td>${i + 1}</td>
        <td><a href="/ski-report/${esc(r.id)}/">${esc(r.name)}</a></td>
        <td>${esc(snowText)}</td>
        <td>${esc(driveText)}</td>
        <td>${esc(r.passGroup)}</td>
        <td>${esc(crowdText)}</td>
        <td>${esc(priceText)}</td>
      </tr>`;
    }).join('');
  }

  // ─── No-session fallback ────────────────────────────────────────────────────
  function showNoSession() {
    const container = document.getElementById('compareTableContainer');
    if (container) {
      container.innerHTML =
        '<div class="cp-cgt-empty">' +
          '<div class="cp-cgt-empty-icon">\u26F7\uFE0F</div>' +
          '<h2>No comparison loaded yet</h2>' +
          '<p>Run a search on the homepage first. We stash your trip so this page can show your top pick, nearby options, and the full score breakdown.</p>' +
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
