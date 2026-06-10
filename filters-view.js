/**
 * Filters view UI — live re-filter/re-rank with FLIP animation
 * Visual spec from design/handoff/Filters.html
 */
(function (global) {
  'use strict';

  const ENG = () => global.FilterRankingEngine;
  const esc = typeof global.esc === 'function' ? global.esc : s => String(s);

  let S = { ...ENG().DEFAULTS };
  let rowMap = new Map();
  let wired = false;
  let onChangeCallback = null;

  function $(sel, root) {
    return (root || document).querySelector(sel);
  }

  function getStateNames() {
    const names = { all: 'All states' };
    if (typeof STATE_FILTER_LABELS !== 'undefined') {
      Object.keys(STATE_FILTER_LABELS).forEach(k => {
        if (k !== 'All') names[k] = STATE_FILTER_LABELS[k];
      });
    }
    return names;
  }

  function animateCount(el, to) {
    if (!el) return;
    const from = parseInt(el.textContent, 10) || 0;
    if (from === to) { el.textContent = to; return; }
    const step = from < to ? 1 : -1;
    let cur = from;
    clearInterval(el._t);
    el._t = setInterval(() => {
      cur += step;
      el.textContent = cur;
      if (cur === to) clearInterval(el._t);
    }, 40);
  }

  function buildChipsHtml(chips) {
    const chipsEl = $('#fvChips');
    if (!chipsEl) return;
    if (!chips.length) {
      chipsEl.innerHTML = '<span class="clabel">No filters set</span><span style="font-size:13px;color:var(--dh-ink-3)">— every mountain in range, ranked by best overall.</span>';
      return;
    }
    chipsEl.innerHTML = '';
    const lab = document.createElement('span');
    lab.className = 'clabel';
    lab.textContent = 'Active';
    chipsEl.appendChild(lab);
    chips.forEach(ch => {
      const el = document.createElement('span');
      el.className = 'dh-chip' + (ch.rank ? ' rank' : '');
      el.innerHTML = esc(ch.label) + ' <button type="button" aria-label="Remove"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6"><path d="M5 5l14 14M19 5L5 19"/></svg></button>';
      el.querySelector('button').addEventListener('click', () => {
        S[ch.k] = ENG().DEFAULTS[ch.k];
        render();
        notifyChange();
      });
      chipsEl.appendChild(el);
    });
    const r = document.createElement('button');
    r.type = 'button';
    r.className = 'dh-reset';
    r.textContent = 'Reset all';
    r.addEventListener('click', () => {
      S = { ...ENG().DEFAULTS };
      render();
      notifyChange();
    });
    chipsEl.appendChild(r);
  }

  function reflectControls() {
    document.querySelectorAll('#plannerSection .dh-seg[data-filter]').forEach(g => {
      const f = g.dataset.filter;
      g.querySelectorAll('button').forEach(b => {
        b.setAttribute('aria-pressed', String(b.dataset.value === S[f]));
      });
    });
    document.querySelectorAll('#plannerSection .dh-weight[data-filter]').forEach(g => {
      const f = g.dataset.filter;
      g.querySelectorAll('button').forEach(b => {
        b.setAttribute('aria-pressed', String(+b.dataset.w === S[f]));
      });
    });
    const stateSel = $('#fvStateSel');
    if (stateSel) stateSel.value = S.state;
    const pr = $('#fvPriceRange');
    if (pr) {
      pr.value = S.price;
      pr.style.setProperty('--fill', ((S.price - 70) / (180 - 70) * 100) + '%');
    }
    const priceVal = $('#fvPriceVal');
    if (priceVal) {
      priceVal.innerHTML = S.price >= 180
        ? 'No price limit <span class="nomax">· all rates</span>'
        : 'Up to <span>$' + S.price + '</span> per day';
    }
  }

  function makeRow() {
    const el = document.createElement('div');
    el.className = 'dh-row';
    el.innerHTML =
      '<div class="dh-rk"></div>' +
      '<div class="rmain"><div class="dh-rname"></div><div class="dh-rmeta"></div></div>' +
      '<div class="dh-rstats">' +
        '<div class="c"><div class="k">Snow</div><div class="v vsnow"></div></div>' +
        '<div class="c"><div class="k">Crowds</div><div class="v vcrowd"></div></div>' +
        '<div class="c"><div class="k">Drive</div><div class="v vdrive"></div></div>' +
      '</div>' +
      '<div class="dh-rbar"><i></i></div>';
    return el;
  }

  function updateRow(el, m, i, frac, isTop) {
    const eng = ENG();
    el.classList.toggle('top', isTop);
    el.dataset.id = m.id;
    el.querySelector('.dh-rk').textContent = i + 1;
    el.querySelector('.dh-rname').innerHTML = esc(m.name) + (isTop ? '<span class="dh-rtag">Top pick</span>' : '');
    const ci = eng.crowdInfo(m.crowd);
    el.querySelector('.dh-rmeta').innerHTML = eng.passBadges(m.pass) +
      '<span class="stt">' + esc(m.st) + '</span><span class="stt">·</span><span class="stt">$' + m.price + '/day</span>';
    el.querySelector('.vsnow').textContent = m.snow + '\u2033';
    const vc = el.querySelector('.vcrowd');
    vc.textContent = ci.l;
    vc.className = 'v vcrowd ' + ci.cls;
    el.querySelector('.vdrive').textContent = eng.fmtDrive(m.drive);
    el.querySelector('.dh-rbar i').style.width = Math.max(6, Math.round(frac * 100)) + '%';
  }

  function renderList(sorted, maxSnow, maxDrive) {
    const resultsEl = $('#fvResults');
    if (!resultsEl) return;
    const eng = ENG();
    const present = new Set(sorted.map(m => m.id));
    const old = new Map();
    rowMap.forEach((el, n) => {
      if (present.has(n)) old.set(n, el.getBoundingClientRect().top);
    });

    rowMap.forEach((el, n) => {
      if (!present.has(n)) {
        rowMap.delete(n);
        const r = el.getBoundingClientRect();
        const pr = resultsEl.getBoundingClientRect();
        el.style.position = 'absolute';
        el.style.left = '0';
        el.style.right = '0';
        el.style.top = (r.top - pr.top) + 'px';
        el.classList.add('leave');
        setTimeout(() => el.remove(), 260);
      }
    });

    const maxS = Math.max(...sorted.map(m => eng.scoreDisplay(m, S, maxSnow, maxDrive)), 0.0001);
    sorted.forEach((m, i) => {
      let el = rowMap.get(m.id);
      if (!el) {
        el = makeRow();
        rowMap.set(m.id, el);
        el.classList.add('enter');
        setTimeout(() => el.classList.remove('enter'), 360);
        el.addEventListener('click', () => {
          if (typeof state !== 'undefined' && m._resort) {
            state.selectedId = m.id;
            if (typeof renderDetail === 'function') renderDetail({ scroll: true });
          }
        });
      }
      updateRow(el, m, i, eng.scoreDisplay(m, S, maxSnow, maxDrive) / maxS, i === 0);
      resultsEl.appendChild(el);
    });

    rowMap.forEach((el, n) => {
      const o = old.get(n);
      if (o == null) return;
      const dy = o - el.getBoundingClientRect().top;
      if (Math.abs(dy) > 1) {
        el.style.transition = 'none';
        el.style.transform = 'translateY(' + dy + 'px)';
        requestAnimationFrame(() => {
          el.style.transition = 'transform .42s cubic-bezier(.2,.8,.2,1)';
          el.style.transform = '';
        });
      }
    });
  }

  function notifyChange() {
    if (typeof state !== 'undefined') ENG().filterSToAppState(S, state);
    const sf = document.getElementById('stateFilter');
    if (sf && typeof state !== 'undefined') sf.value = state.stateFilter;
    if (onChangeCallback) onChangeCallback(S);
    if (typeof savePlannerState === 'function') savePlannerState();
    if (typeof pushUrlDebounced === 'function') pushUrlDebounced();
    if (typeof debouncedRender === 'function') debouncedRender();
  }

  function render(mountains) {
    reflectControls();
    const eng = ENG();
    const hasOrigin = !!(typeof state !== 'undefined' && state.origin);
    const { matched, sorted, maxSnow, maxDrive } = eng.filterAndRank(mountains || [], S, { hasOrigin });

    animateCount($('#fvCount'), matched.length);
    const listN = $('#fvListN');
    if (listN) listN.textContent = matched.length;

    const pickEl = $('#fvPick');
    const emptyEl = $('#fvEmpty');
    if (matched.length === 0) {
      if (pickEl) { pickEl.textContent = 'No match'; pickEl.className = 'v none'; }
      emptyEl?.classList.add('show');
    } else {
      const top = sorted[0];
      const h = Math.floor(top.drive / 60);
      const m = top.drive % 60;
      if (pickEl) {
        pickEl.innerHTML = esc(top.name) + ' <span style="font-family:var(--dh-sans);font-size:13px;font-weight:600;color:var(--dh-ink-3)">· ' + h + 'h ' + (m < 10 ? '0' : '') + m + 'm</span>';
        pickEl.className = 'v';
      }
      emptyEl?.classList.remove('show');
    }

    renderList(sorted, maxSnow, maxDrive);
    buildChipsHtml(eng.buildChips(S, getStateNames()));
  }

  function syncFromAppState(appState) {
    S = ENG().appStateToFilterS(appState || (typeof state !== 'undefined' ? state : {}));
  }

  function wire(onChange) {
    if (wired) return;
    wired = true;
    onChangeCallback = onChange;

    const root = $('#plannerSection');
    if (!root) return;

    root.querySelectorAll('.dh-seg[data-filter]').forEach(g => {
      g.addEventListener('click', e => {
        const b = e.target.closest('button');
        if (!b) return;
        S[g.dataset.filter] = b.dataset.value;
        render(getMountains());
        notifyChange();
      });
    });

    root.querySelectorAll('.dh-weight[data-filter]').forEach(g => {
      g.addEventListener('click', e => {
        const b = e.target.closest('button');
        if (!b) return;
        S[g.dataset.filter] = +b.dataset.w;
        render(getMountains());
        notifyChange();
      });
    });

    $('#fvStateSel')?.addEventListener('change', e => {
      S.state = e.target.value;
      render(getMountains());
      notifyChange();
    });

    $('#fvPriceRange')?.addEventListener('input', e => {
      S.price = +e.target.value;
      render(getMountains());
      notifyChange();
    });

    $('#fvRelax')?.addEventListener('click', () => {
      S = ENG().loosenTightest(S);
      render(getMountains());
      notifyChange();
    });

    $('#fvTopBtn')?.addEventListener('click', () => {
      if (typeof scrollToBestMatchFromFilters === 'function') scrollToBestMatchFromFilters('filters_strip');
      else window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  function getMountains() {
    const resorts = global.RESORTS || [];
    const ctx = typeof state !== 'undefined' ? state : {};
    return ENG().buildMountainsFromResorts(resorts, ctx);
  }

  function refresh() {
    syncFromAppState(typeof state !== 'undefined' ? state : {});
    render(getMountains());
  }

  function updateLocationLabel(label) {
    const el = $('#fvLocLabel');
    if (el && label) el.textContent = label;
  }

  global.FiltersView = {
    wire,
    render,
    refresh,
    syncFromAppState,
    updateLocationLabel,
    getFilterState: () => ({ ...S }),
  };
})(typeof window !== 'undefined' ? window : globalThis);
