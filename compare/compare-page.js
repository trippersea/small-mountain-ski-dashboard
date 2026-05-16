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
//   ts:           <timestamp ms>,
//   origin:       { label: 'Boston, MA', lat, lon },
//   passFilter:   'All' | 'Epic' | 'Ikon' | 'Indy',
//   howFar:       0 | 1 | 2,
//   skiDayPreset: 'weekday' | 'friday' | 'saturday' | 'sunday',
//   topPick:      { id, name, state, passGroup, driveText, stormTotal,
//                   tomorrowIn, wxForecast, crowdLabel, price, vertical,
//                   trails, avgSnowfall, headline, detail,
//                   baseElevation?, summitElevation?, score? },
//   runners:      [ /* same shape, up to 3, may lack headline/detail */ ]
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
    if (howFar === 1) return '\uD83C\uDFD4 Weekend';
    if (howFar === 2) return '\u2708 Any distance';
    return '\uD83D\uDE97 Day trip';
  }

  function dayLabel(preset) {
    const map = { weekday: 'Weekday', friday: 'Friday', saturday: 'Saturday', sunday: 'Sunday' };
    return map[preset] || 'Today';
  }

  // Builds a readable forecast line: "4" tomorrow" or "Dry forecast, 36°F"
  function forecastLine(stormTotal, tomorrowIn, wxForecast) {
    let snow;
    if (tomorrowIn >= 4)        snow = `${tomorrowIn.toFixed(0)}\u2033 tomorrow`;
    else if (stormTotal >= 2)   snow = `${Math.round(stormTotal)}\u2033 in forecast`;
    else if (stormTotal >= 0.5) snow = `${stormTotal.toFixed(1)}\u2033 forecast`;
    else                        snow = 'Dry forecast';

    const hi = wxForecast?.[0]?.hi;
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
    if (r.driveText)                         parts.push(r.driveText + ' away');
    if (r.stormTotal >= 4)                   parts.push(`${Math.round(r.stormTotal)}\u2033 of snow forecast`);
    else if (r.tomorrowIn >= 1)              parts.push(`${r.tomorrowIn.toFixed(1)}\u2033 tomorrow`);
    const cl = (r.crowdLabel || '').toLowerCase();
    if (cl.includes('quiet') || cl.includes('light')) parts.push('light crowds expected');
    if (r.passGroup && r.passGroup !== 'Independent') parts.push(`${r.passGroup} pass access`);
    return parts.length ? parts.join(' \u00B7 ') + '.' : 'Solid alternative for your search.';
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
  const { origin, passFilter, howFar, skiDayPreset, topPick, runners = [] } = session;
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

    // Derive numeric drive minutes from driveText for comparison
    // e.g. "1h 48m" -> 108
    function parseDriveMins(text) {
      if (!text) return null;
      const hm = text.match(/(\d+)h\s*(\d+)?m?/);
      if (hm) return parseInt(hm[1]) * 60 + (parseInt(hm[2]) || 0);
      const m = text.match(/^(\d+)m/);
      if (m) return parseInt(m[1]);
      return null;
    }

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
    const pickReason  = pick.headline || pick.detail || 'Top score for your filters right now.';
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
        '<div class="cp-cgt-score-num">' + (pick.score != null ? Math.round(pick.score) : '\u2014') + '</div>' +
        '<div class="cp-cgt-score-bar-track"><div class="cp-cgt-score-bar-fill" style="width:' + pct + '%"></div></div>' +
        '<div class="cp-cgt-sub">out of 100</div>';
      const runnerScores = runOnly.map(function (r) {
        const rPct = Math.min(100, Math.max(0, r.score || 0));
        return '<div class="cp-cgt-score-num">' + (r.score != null ? Math.round(r.score) : '\u2014') + '</div>' +
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
    function forecastCell(r) {
      const st = r.stormTotal || 0;
      const ti = r.tomorrowIn || 0;
      const hi = r.wxForecast && r.wxForecast[0] ? r.wxForecast[0].hi : null;
      const tempStr = hi != null ? '<div class="cp-cgt-sub">High ' + Math.round(hi) + '\u00b0F</div>' : '';
      if (ti >= 4) {
        return '<div class="cp-cgt-snow-big">' + ti.toFixed(0) + '\u2033</div>' +
               '<div class="cp-cgt-sub">tomorrow' + (hi != null ? ' \u00B7 High ' + Math.round(hi) + '\u00b0F' : '') + '</div>';
      }
      if (st >= 0.5) {
        return '<div class="cp-cgt-snow-big">' + st.toFixed(1) + '\u2033</div>' +
               '<div class="cp-cgt-sub">3-day forecast' + (hi != null ? ' \u00B7 High ' + Math.round(hi) + '\u00b0F' : '') + '</div>';
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
      const snowText  = r.stormTotal >= 0.5 ? `${r.stormTotal.toFixed(1)}\u2033 forecast` : 'Dry forecast';
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

})();
