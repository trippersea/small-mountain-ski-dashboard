// ═══════════════════════════════════════════════════════════════════════════
// compare-page.js — Hydrates /compare/ with live session data
//
// Written by: sd-app.js → saveCompareSession() → localStorage['wtsn-compare']
// Read here on DOMContentLoaded. Falls back gracefully if no session exists.
//
// Session TTL: 4 hours. Stale sessions show the no-session CTA.
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
    if (howFar === 1) return '🏔 Weekend';
    if (howFar === 2) return '✈ Any distance';
    return '🚗 Day trip';
  }

  function dayLabel(preset) {
    const map = { weekday: 'Weekday', friday: 'Friday', saturday: 'Saturday', sunday: 'Sunday' };
    return map[preset] || 'Today';
  }

  // Builds a readable forecast chip: "4" forecast" or "Dry forecast, 36°F"
  function forecastLine(stormTotal, tomorrowIn, wxForecast) {
    let snow;
    if (tomorrowIn >= 4)      snow = `${tomorrowIn.toFixed(0)}" tomorrow`;
    else if (stormTotal >= 2) snow = `${Math.round(stormTotal)}" in forecast`;
    else if (stormTotal >= 0.5) snow = `${stormTotal.toFixed(1)}" forecast`;
    else                       snow = 'Dry forecast';

    const hi = wxForecast?.[0]?.hi;
    return hi != null ? `${snow}, ${Math.round(hi)}°F` : snow;
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

  // OG title in head (best-effort; won't affect crawlers but fixes share previews on JS)
  const ogTitle = document.querySelector('meta[property="og:title"]');
  if (ogTitle) ogTitle.setAttribute('content', `Compare Near ${city} | WhereToSkiNext.com`);

  // ── Context chips ────────────────────────────────────────────────────────
  const ctxDiv = document.querySelector('.compare-page-context');
  if (ctxDiv) {
    const chips = [
      tripLabel(howFar),
      dayLabel(skiDayPreset),
      (passFilter && passFilter !== 'All') ? `🎫 ${passFilter} Pass` : null,
      `📍 From ${origin.label || city}`,
    ].filter(Boolean);
    const changeLink = '<a href="/">Change</a>';
    ctxDiv.innerHTML = chips.map(c => `<span>${esc(c)}</span>`).join('') + changeLink;
  }

  // ── Top pick card ────────────────────────────────────────────────────────
  const topCard = document.querySelector('.compare-page-card--top');
  if (topCard && topPick) {
    const h2 = topCard.querySelector('h2');
    const headlineP = topCard.querySelector('.compare-page-card__headline');
    const bodyP = topCard.querySelector('.compare-page-card__body');
    const stats = topCard.querySelectorAll('.compare-page-stats > div');

    if (h2) h2.textContent = topPick.name;
    if (headlineP) headlineP.textContent = topPick.headline;
    if (bodyP) bodyP.textContent = topPick.detail;

    // Stat 1 — drive
    if (stats[0]) {
      const strong = stats[0].querySelector('strong');
      const span   = stats[0].querySelector('span');
      if (strong) strong.textContent = topPick.driveText || '—';
      if (span)   span.textContent   = 'drive';
    }
    // Stat 2 — forecast
    if (stats[1]) {
      const strong = stats[1].querySelector('strong');
      const span   = stats[1].querySelector('span');
      if (strong) strong.textContent = forecastLine(topPick.stormTotal, topPick.tomorrowIn, topPick.wxForecast);
      if (span)   span.textContent   = 'forecast';
    }
    // Stat 3 — crowds
    if (stats[2]) {
      const strong = stats[2].querySelector('strong');
      const span   = stats[2].querySelector('span');
      if (strong) strong.textContent = crowdTopLabel(topPick.crowdLabel);
      if (span)   span.textContent   = crowdSubLabel(topPick.crowdLabel);
    }

    // "See full conditions" links to the resort report page
    const condLink = topCard.querySelector('a.compare-page-btn--primary');
    if (condLink) {
      const slug = topPick.id;
      condLink.href = `/ski-report/${slug}/`;
      condLink.textContent = 'See full conditions →';
    }
  }

  // ── Runner-up mini cards ─────────────────────────────────────────────────
  const miniCards = document.querySelectorAll('.compare-page-card--mini');
  miniCards.forEach((card, i) => {
    const r = runners[i];
    if (!r) { card.hidden = true; return; }

    const rankEl = card.querySelector('.compare-page-rank');
    const h3     = card.querySelector('h3');
    const tag    = card.querySelector('.compare-page-tag');
    const dds    = card.querySelectorAll('dd');
    const link   = card.querySelector('a.compare-page-btn');

    if (rankEl) rankEl.textContent = i + 2;
    if (h3)     h3.textContent     = r.name;
    if (tag)    tag.textContent    = r.driveText ? `${r.driveText} away` : r.state;
    if (dds[0]) dds[0].textContent = forecastLine(r.stormTotal, r.tomorrowIn, r.wxForecast);
    if (dds[1]) dds[1].textContent = r.crowdLabel;
    if (link) {
      link.href        = `/ski-report/${r.id}/`;
      link.textContent = 'View conditions →';
    }
  });

  // ── Full rankings table ──────────────────────────────────────────────────
  const tbody = document.getElementById('compareTableBody');
  if (tbody) {
    const allResorts = [topPick, ...runners];
    tbody.innerHTML = allResorts.map((r, i) => {
      const snowText  = r.stormTotal >= 0.5 ? `${r.stormTotal.toFixed(1)}" forecast` : 'Dry forecast';
      const priceText = r.price ? `$${r.price}` : '—';
      const driveText = r.driveText || '—';
      const crowdText = r.crowdLabel || '—';
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
  // Called when localStorage has no valid session — user navigated directly
  // to /compare/ without going through the homepage tool first.
  function showNoSession() {
    const hero = document.querySelector('.compare-page-hero');
    if (!hero) return;

    hero.innerHTML = `
      <div class="compare-page-hero__inner" style="min-height:60vh;display:flex;align-items:center;justify-content:center;text-align:center;">
        <div style="max-width:500px;padding:40px 20px;">
          <div style="font-size:52px;margin-bottom:20px;line-height:1;">⛷</div>
          <h1 class="compare-page-title" style="font-size:clamp(1.6rem,4vw,2.4rem);margin-bottom:14px;">
            Compare your mountain options
          </h1>
          <p style="font-size:1.05rem;color:#fff;font-weight:600;margin:0 auto 32px;line-height:1.6;">
            Run a search on the homepage first. We stash your trip so this page can show your top pick, nearby options, and full table.
          </p>
          <a href="/" class="compare-page-btn compare-page-btn--primary">Find my mountain →</a>
        </div>
      </div>
    `;

    // Hide sections that require session data
    ['#full-rankings', '#hidden-gems', '#powder-alert'].forEach(sel => {
      const el = document.querySelector(sel);
      if (el) el.hidden = true;
    });
  }

})();
