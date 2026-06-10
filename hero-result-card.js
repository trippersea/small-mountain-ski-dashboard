/**
 * Hero result card — data-driven component from design/handoff/Homepage.html
 * Spectral serif is used ONLY for the mountain name (.dh-peak).
 */
(function (global) {
  'use strict';

  const esc = typeof global.esc === 'function'
    ? global.esc
    : s => String(s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');

  /**
   * @typedef {Object} HeroStatTile
   * @property {string} label - e.g. "Snow"
   * @property {string} value - e.g. '4" fresh'
   * @property {string} [meta]
   * @property {'good'|''} [valueClass]
   *
   * @typedef {Object} HeroWhyRunner
   * @property {string} name
   * @property {string} descriptionHtml - safe HTML for comparison line
   * @property {string} rightHtml - drive/crowd summary
   *
   * @typedef {Object} HeroResultCardProps
   * @property {string} [badgeLabel] - default "Live · today's pick"
   * @property {string} [updatedAt]
   * @property {string} [rankLine]
   * @property {string} mountainName
   * @property {string} [locationLine]
   * @property {string} [verdictHtml]
   * @property {HeroStatTile[]} [stats]
   * @property {string} [headsUpHtml]
   * @property {string} [ctaLabel]
   * @property {string} [ctaId]
   * @property {HeroWhyRunner[]} [whyRunners]
   * @property {string} [forecastDateLine]
   * @property {boolean} [whyOpen]
   * @property {'live'|'empty'|'loading'} [variant]
   * @property {string} [emptyTitle]
   * @property {string} [emptySubHtml]
   * @property {string} [emptyBtnLabel]
   * @property {string} [emptyBtnId]
   */

  function statTilesHtml(stats) {
    if (!stats || !stats.length) return '';
    return `<div class="dh-stats">${stats.map(s => `
      <div class="dh-stat">
        <div class="k">${esc(s.label)}</div>
        <div class="v${s.valueClass ? ' ' + esc(s.valueClass) : ''}">${esc(s.value)}</div>
        ${s.meta ? `<div class="meta">${esc(s.meta)}</div>` : ''}
      </div>`).join('')}</div>`;
  }

  function whyRunnersHtml(runners) {
    if (!runners || !runners.length) return '';
    return runners.map(r => `
      <div class="dh-runner">
        <div class="rl"><b>${esc(r.name)}</b> — ${r.descriptionHtml}</div>
        <div class="rt">${r.rightHtml}</div>
      </div>`).join('');
  }

  function renderHeroResultCard(props) {
    const p = props || {};
    const variant = p.variant || 'live';

    if (variant === 'empty' || variant === 'loading') {
      return `<div class="dh-card dh-card--${variant}" id="resultCard">
        <div class="dh-card-empty">
          <p class="dh-card-empty-title">${esc(p.emptyTitle || (variant === 'loading' ? 'Loading…' : 'Your top pick appears here'))}</p>
          ${p.emptySubHtml ? `<p class="dh-card-empty-sub">${p.emptySubHtml}</p>` : ''}
          ${p.emptyBtnLabel ? `<button type="button" class="dh-card-empty-btn" id="${esc(p.emptyBtnId || 'verdictEmptyLocateBtn')}">${esc(p.emptyBtnLabel)}</button>` : ''}
        </div>
      </div>`;
    }

    const whyOpen = !!p.whyOpen;
    return `<div class="dh-card" id="resultCard">
      <div class="dh-card-top">
        <span class="dh-badge-live"><span class="dh-live-dot"></span> ${esc(p.badgeLabel || "Live · today's pick")}</span>
        <span class="dh-updated" id="updatedAt">${esc(p.updatedAt || 'Updated just now')}</span>
      </div>
      ${p.rankLine ? `<div class="dh-rank">${esc(p.rankLine)}</div>` : ''}
      <h2 class="dh-peak">${esc(p.mountainName)}</h2>
      ${p.locationLine ? `<div class="dh-peak-loc">${esc(p.locationLine)}</div>` : ''}
      ${p.verdictHtml ? `<p class="dh-verdict">${p.verdictHtml}</p>` : ''}
      ${statTilesHtml(p.stats)}
      ${p.headsUpHtml ? `<div class="dh-heads"><span class="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 9v4M12 17h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z"/></svg></span><span>${p.headsUpHtml}</span></div>` : ''}
      <button type="button" class="dh-cta" id="${esc(p.ctaId || 'verdictDetailBtn')}">
        ${esc(p.ctaLabel || 'See full forecast')}
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
      </button>
      <div class="dh-divider"></div>
      <div class="dh-secondary">
        <button type="button" class="dh-why" id="whyBtn" aria-expanded="${whyOpen ? 'true' : 'false'}">
          Why this beat the alternatives
          <span class="chev"><svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M6 9l6 6 6-6"/></svg></span>
        </button>
        <div class="dh-seclinks">
          <button type="button" id="verdictSeeAllRunnersBtn">Compare</button>
          <button type="button" id="verdictViewAllRankingsBtn">All rankings</button>
        </div>
      </div>
      <div class="dh-why-body${whyOpen ? ' open' : ''}" id="whyBody">
        <div>${whyRunnersHtml(p.whyRunners)}</div>
      </div>
      <div class="dh-card-foot">
        <span class="dh-trust">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3Z"/><path d="M9 12l2 2 4-4"/></svg>
          Rankings never sponsored
        </span>
        <span class="sep"></span>
        ${p.forecastDateLine ? `<span>${esc(p.forecastDateLine)}</span>` : ''}
      </div>
    </div>`;
  }

  function wireHeroResultCard(root) {
    if (!root) return;
    const whyBtn = root.querySelector('#whyBtn');
    const whyBody = root.querySelector('#whyBody');
    if (whyBtn && whyBody) {
      whyBtn.addEventListener('click', () => {
        const open = whyBtn.getAttribute('aria-expanded') === 'true';
        whyBtn.setAttribute('aria-expanded', String(!open));
        whyBody.classList.toggle('open', !open);
      });
    }
  }

  function flashHeroResultCard(cardEl, updatedEl) {
    if (!cardEl) return;
    if (updatedEl) updatedEl.textContent = 'Recalculating…';
    cardEl.classList.add('dh-card--flash');
    clearTimeout(cardEl._flashT);
    cardEl._flashT = setTimeout(() => {
      if (updatedEl) updatedEl.textContent = 'Updated just now';
      cardEl.classList.remove('dh-card--flash');
    }, 700);
  }

  global.renderHeroResultCard = renderHeroResultCard;
  global.wireHeroResultCard = wireHeroResultCard;
  global.flashHeroResultCard = flashHeroResultCard;
})(typeof window !== 'undefined' ? window : globalThis);
