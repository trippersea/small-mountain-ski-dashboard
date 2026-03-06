const RESORTS = [
  {
    id: 'black-nh', name: 'Black Mountain', state: 'NH', pass: 'Indy', owner: 'Independent',
    vertical: 1100, trails: 45, lifts: 5, acres: 143, snowfall: 120, snowmaking: 98, night: false,
    longestRun: 2.5, lat: 44.1776, lon: -71.1284,
    difficulty: { beginner: 0.20, intermediate: 0.45, advanced: 0.25, expert: 0.10 },
    liftsBreakdown: [['Double', 3], ['Triple', 1], ['Surface', 1]],
    charm: 96, localVibe: 94,
    website: 'https://www.blackmt.com/',
    webcamImage: '', webcamPage: '',
    trailMapImage: '', trailMapPage: 'https://www.blackmt.com/',
    notes: 'Classic New Hampshire small-mountain feel with strong historic character.',
    tags: ['Historic', 'Classic doubles', 'Indy favorite']
  },
  {
    id: 'black-me', name: 'Black Mountain of Maine', state: 'ME', pass: 'Indy', owner: 'Community nonprofit',
    vertical: 1380, trails: 50, lifts: 3, acres: 600, snowfall: 110, snowmaking: 75, night: true,
    longestRun: 2.0, lat: 44.5342, lon: -70.5368,
    difficulty: { beginner: 0.24, intermediate: 0.38, advanced: 0.24, expert: 0.14 },
    liftsBreakdown: [['Double', 2], ['T-Bar', 1]], charm: 95, localVibe: 96,
    website: 'https://skiblackmountain.org/', webcamImage: '', webcamPage: '', trailMapImage: '', trailMapPage: 'https://skiblackmountain.org/',
    notes: 'Rumford soul hill with big acreage, meaningful vert, top-to-bottom night skiing, and nonprofit energy.',
    tags: ['Night skiing', 'Maine', 'Community hill']
  },
  {
    id: 'bolton', name: 'Bolton Valley', state: 'VT', pass: 'Indy', owner: 'Independent',
    vertical: 1634, trails: 71, lifts: 6, acres: 300, snowfall: 300, snowmaking: 62, night: true,
    longestRun: 2.0, lat: 44.4217, lon: -72.8518,
    difficulty: { beginner: 0.18, intermediate: 0.44, advanced: 0.25, expert: 0.13 },
    liftsBreakdown: [['Quad', 2], ['Double', 3], ['Surface', 1]], charm: 87, localVibe: 92,
    website: 'https://www.boltonvalley.com/', webcamImage: '', webcamPage: '', trailMapImage: '', trailMapPage: 'https://www.boltonvalley.com/',
    notes: 'Natural-snow standout with night skiing, backcountry credibility, and one of the strongest local scenes in Vermont.',
    tags: ['Night skiing', 'Natural snow', 'Backcountry']
  },
  {
    id: 'bousquet', name: 'Bousquet', state: 'MA', pass: 'Indy', owner: 'Private',
    vertical: 750, trails: 24, lifts: 5, acres: 100, snowfall: 70, snowmaking: 95, night: true,
    longestRun: 1.0, lat: 42.4138, lon: -73.2820,
    difficulty: { beginner: 0.28, intermediate: 0.44, advanced: 0.22, expert: 0.06 },
    liftsBreakdown: [['Quad', 2], ['Triple', 1], ['Surface', 2]], charm: 80, localVibe: 83,
    website: 'https://www.bousquetmountain.com/', webcamImage: '', webcamPage: '', trailMapImage: '', trailMapPage: 'https://www.bousquetmountain.com/',
    notes: 'Compact but useful mountain with lights, local energy, and easy access.', tags: ['Night skiing', 'Berkshires', 'Local hill']
  },
  {
    id: 'bradford', name: 'Bradford Ski Area', state: 'MA', pass: 'Independent', owner: 'Independent',
    vertical: 230, trails: 15, lifts: 10, acres: 48, snowfall: 40, snowmaking: 100, night: true,
    longestRun: 0.4, lat: 42.7779, lon: -71.0819,
    difficulty: { beginner: 0.34, intermediate: 0.40, advanced: 0.20, expert: 0.06 },
    liftsBreakdown: [['Triple', 3], ['T-Bar', 1], ['Rope tow', 3], ['Carpet', 3]], charm: 82, localVibe: 90,
    website: 'https://skibradford.com/', webcamImage: '', webcamPage: '', trailMapImage: '', trailMapPage: 'https://skibradford.com/',
    notes: 'Pure local feeder hill near Boston with strong night-skiing utility and learn-to-ride value.', tags: ['Boston-area', 'Night skiing', 'Feeder hill']
  },
  {
    id: 'bromley', name: 'Bromley', state: 'VT', pass: 'Independent', owner: 'Corporate',
    vertical: 1334, trails: 47, lifts: 9, acres: 178, snowfall: 145, snowmaking: 98, night: false,
    longestRun: 2.5, lat: 43.2278, lon: -72.9382,
    difficulty: { beginner: 0.32, intermediate: 0.36, advanced: 0.20, expert: 0.12 },
    liftsBreakdown: [['High-speed quad', 1], ['Fixed quad', 1], ['Double', 4], ['T-Bar', 1], ['Carpet', 2]], charm: 86, localVibe: 80,
    website: 'https://www.bromley.com/', webcamImage: '', webcamPage: '', trailMapImage: '', trailMapPage: 'https://www.bromley.com/',
    notes: 'South-facing family cruiser with a balanced terrain mix.', tags: ['Family', 'Southern Vermont', 'Cruisers']
  },
  {
    id: 'burke', name: 'Burke Mountain', state: 'VT', pass: 'Independent', owner: 'Independent',
    vertical: 2057, trails: 55, lifts: 4, acres: 260, snowfall: 217, snowmaking: 70, night: false,
    longestRun: 2.0, lat: 44.5717, lon: -71.8928,
    difficulty: { beginner: 0.18, intermediate: 0.42, advanced: 0.24, expert: 0.16 },
    liftsBreakdown: [['High-speed quad', 2], ['T-Bar', 1], ['J-Bar', 1]], charm: 84, localVibe: 88,
    website: 'https://skiburke.com/', webcamImage: '', webcamPage: '', trailMapImage: '', trailMapPage: 'https://skiburke.com/',
    notes: 'Big vert, race culture, and serious Northeast Kingdom terrain.', tags: ['Northeast Kingdom', 'Race culture', 'Big vert']
  },
  {
    id: 'catamount', name: 'Catamount', state: 'NY/MA', pass: 'Indy', owner: 'Independent',
    vertical: 1000, trails: 44, lifts: 8, acres: 119, snowfall: 75, snowmaking: 93, night: true,
    longestRun: 1.75, lat: 42.1269, lon: -73.5206,
    difficulty: { beginner: 0.35, intermediate: 0.42, advanced: 0.17, expert: 0.06 },
    liftsBreakdown: [['Quad', 2], ['Triple', 3], ['Carpet', 3]], charm: 79, localVibe: 81,
    website: 'https://catamountski.com/', webcamImage: '', webcamPage: '', trailMapImage: '', trailMapPage: 'https://catamountski.com/',
    notes: 'Broad lit terrain and strong southern New England access.', tags: ['Night skiing', 'Indy', 'Hudson Valley access']
  },
  {
    id: 'gunstock', name: 'Gunstock', state: 'NH', pass: 'Independent', owner: 'County-owned',
    vertical: 1400, trails: 55, lifts: 8, acres: 227, snowfall: 160, snowmaking: 98, night: true,
    longestRun: 1.6, lat: 43.5404, lon: -71.3702,
    difficulty: { beginner: 0.22, intermediate: 0.42, advanced: 0.25, expert: 0.11 },
    liftsBreakdown: [['High-speed quad', 1], ['Fixed quad', 2], ['Triple', 1], ['Double', 2], ['Surface', 2]], charm: 84, localVibe: 82,
    website: 'https://www.gunstock.com/', webcamImage: '', webcamPage: '', trailMapImage: '', trailMapPage: 'https://www.gunstock.com/',
    notes: 'Big-small mountain blend with strong operations and one of the better night products in New England.', tags: ['Night skiing', 'Family', 'Strong ops']
  },
  {
    id: 'magic', name: 'Magic Mountain', state: 'VT', pass: 'Indy', owner: 'Community-backed independent',
    vertical: 1500, trails: 51, lifts: 5, acres: 285, snowfall: 120, snowmaking: 45, night: false,
    longestRun: 3.0, lat: 43.1964, lon: -72.8243,
    difficulty: { beginner: 0.14, intermediate: 0.32, advanced: 0.34, expert: 0.20 },
    liftsBreakdown: [['Quad', 1], ['Double', 3], ['Surface', 1]], charm: 98, localVibe: 99,
    website: 'https://magicmtn.com/', webcamImage: '', webcamPage: '', trailMapImage: '', trailMapPage: 'https://magicmtn.com/',
    notes: 'Cult-favorite Vermont mountain with soul, steeper terrain, and elite vibe scores.', tags: ['Soul skiing', 'Steeps', 'Indy legend']
  },
  {
    id: 'nashoba', name: 'Nashoba Valley', state: 'MA', pass: 'Independent', owner: 'Independent',
    vertical: 240, trails: 17, lifts: 10, acres: 46, snowfall: 50, snowmaking: 100, night: true,
    longestRun: 0.5, lat: 42.5290, lon: -71.4731,
    difficulty: { beginner: 0.20, intermediate: 0.50, advanced: 0.30, expert: 0.00 },
    liftsBreakdown: [['Triple', 3], ['Double', 1], ['Conveyor', 3], ['Rope tow', 3]], charm: 75, localVibe: 88,
    website: 'https://skinashoba.com/', webcamImage: '', webcamPage: '', trailMapImage: '', trailMapPage: 'https://skinashoba.com/',
    notes: 'Metro-Boston night-ski machine built for quick laps and lessons.', tags: ['Night skiing', 'Metro Boston', 'Lessons']
  },
  {
    id: 'pats-peak', name: 'Pats Peak', state: 'NH', pass: 'Indy', owner: 'Family-owned',
    vertical: 770, trails: 28, lifts: 11, acres: 117, snowfall: 80, snowmaking: 100, night: true,
    longestRun: 1.5, lat: 43.1790, lon: -71.8196,
    difficulty: { beginner: 0.50, intermediate: 0.21, advanced: 0.12, expert: 0.17 },
    liftsBreakdown: [['Quad', 1], ['Triple', 3], ['Double', 2], ['J-Bar', 1], ['Handle tow', 2], ['Carpet', 2]], charm: 83, localVibe: 89,
    website: 'https://www.patspeak.com/', webcamImage: '', webcamPage: '', trailMapImage: '', trailMapPage: 'https://www.patspeak.com/',
    notes: 'One of the strongest night and learn-to-ski operations in New England.', tags: ['Night skiing', 'Family-owned', 'Race leagues']
  },
  {
    id: 'wachusett', name: 'Wachusett', state: 'MA', pass: 'Independent', owner: 'Independent',
    vertical: 1000, trails: 27, lifts: 8, acres: 110, snowfall: 72, snowmaking: 100, night: true,
    longestRun: 2.0, lat: 42.4884, lon: -71.8863,
    difficulty: { beginner: 0.25, intermediate: 0.50, advanced: 0.20, expert: 0.05 },
    liftsBreakdown: [['High-speed quad', 2], ['Triple', 2], ['Surface', 4]], charm: 77, localVibe: 84,
    website: 'https://www.wachusett.com/', webcamImage: '', webcamPage: '', trailMapImage: '', trailMapPage: 'https://www.wachusett.com/',
    notes: 'Massachusetts volume leader with elite convenience and huge after-work appeal.', tags: ['Night skiing', 'High volume', 'Near Boston']
  }
];

// ─── State ───────────────────────────────────────────────────────────────────
const state = {
  search: '',
  pass: 'All',
  stateFilter: 'All',
  nightOnly: false,
  selectedId: null,
  sortCol: 'vertical',
  sortDir: 'desc',
};

// Column max values for inline bar scaling
const COL_MAX = {
  vertical:    2100,
  trails:      75,
  lifts:       12,
  acres:       650,
  longestRun:  3.2,
  snowfall:    320,
  snowmaking:  100,
};

// ─── DOM refs ─────────────────────────────────────────────────────────────────
const els = {
  summaryCards:    document.getElementById('summaryCards'),
  searchInput:     document.getElementById('searchInput'),
  stateFilter:     document.getElementById('stateFilter'),
  passFilter:      document.getElementById('passFilter'),
  toggleNight:     document.getElementById('toggleNight'),
  randomResort:    document.getElementById('randomResort'),
  activeFilters:   document.getElementById('activeFilters'),
  resortList:      document.getElementById('resortList'),
  resultCount:     document.getElementById('resultCount'),
  comparisonBody:  document.getElementById('comparisonBody'),
  comparisonTable: document.getElementById('comparisonTable'),
  selectedResort:  document.getElementById('selectedResort'),
  resortMap:       document.getElementById('resortMap'),
  mapTooltip:      document.getElementById('mapTooltip'),
  toast:           document.getElementById('toast'),
};

// ─── Filtering & sorting ──────────────────────────────────────────────────────
function uniquePasses() { return ['All', ...new Set(RESORTS.map(r => r.pass))]; }
function uniqueStates()  {
  const raw = [...new Set(RESORTS.map(r => r.state))].sort();
  return ['All', ...raw];
}

function filteredResorts() {
  return RESORTS.filter(resort => {
    const q = state.search.trim().toLowerCase();
    const haystack = [resort.name, resort.state, resort.pass, resort.owner, resort.notes, ...(resort.tags||[])].join(' ').toLowerCase();
    return (!q || haystack.includes(q))
      && (state.pass === 'All' || resort.pass === state.pass)
      && (state.stateFilter === 'All' || resort.state === state.stateFilter)
      && (!state.nightOnly || resort.night);
  }).sort((a, b) => {
    const col = state.sortCol;
    let av = a[col], bv = b[col];
    // night is boolean
    if (typeof av === 'boolean') { av = av ? 1 : 0; bv = bv ? 1 : 0; }
    if (typeof av === 'string')  return state.sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av);
    return state.sortDir === 'asc' ? av - bv : bv - av;
  });
}

// ─── Toast ────────────────────────────────────────────────────────────────────
let toastTimer = null;
function showToast(msg) {
  els.toast.textContent = msg;
  els.toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => els.toast.classList.remove('show'), 2600);
}

// ─── Summary cards ────────────────────────────────────────────────────────────
function renderSummaryCards(resorts) {
  const n = resorts.length;
  const avg = key => n ? Math.round(resorts.reduce((s,r) => s + r[key], 0) / n) : 0;
  els.summaryCards.innerHTML = [
    ['Resorts',      n],
    ['Avg Vertical', avg('vertical') + ' ft'],
    ['Avg Trails',   avg('trails')],
    ['Night Skiing', resorts.filter(r => r.night).length],
    ['Avg Snowfall', avg('snowfall') + ' in'],
    ['Avg Acres',    avg('acres')],
  ].map(([label, val]) => `
    <div class="stat-card">
      <div class="stat-label">${label}</div>
      <div class="stat-value">${val}</div>
    </div>`).join('');
}

// ─── Active filter pills ──────────────────────────────────────────────────────
function renderActiveFilters() {
  const tags = [];
  if (state.search.trim())         tags.push({ label: `"${state.search.trim()}"`,    clear: () => { state.search = ''; els.searchInput.value = ''; } });
  if (state.stateFilter !== 'All') tags.push({ label: `State: ${state.stateFilter}`, clear: () => { state.stateFilter = 'All'; els.stateFilter.value = 'All'; } });
  if (state.pass !== 'All')        tags.push({ label: `Pass: ${state.pass}`,         clear: () => { state.pass = 'All'; els.passFilter.value = 'All'; } });
  if (state.nightOnly)             tags.push({ label: '🌙 Night only',               clear: () => { state.nightOnly = false; els.toggleNight.setAttribute('aria-pressed','false'); } });
  els.activeFilters.innerHTML = tags.map((t,i) =>
    `<span class="filter-tag">${t.label}<button data-idx="${i}" aria-label="Remove filter">✕</button></span>`
  ).join('');
  [...els.activeFilters.querySelectorAll('button')].forEach(btn => {
    btn.addEventListener('click', () => { tags[+btn.dataset.idx].clear(); render(); });
  });
}

// ─── Sidebar resort list ──────────────────────────────────────────────────────
function renderResortList(resorts) {
  els.resultCount.textContent = `${resorts.length} resort${resorts.length === 1 ? '' : 's'}`;
  if (!resorts.length) {
    els.resortList.innerHTML = '<div class="empty-state">No resorts match.</div>';
    return;
  }
  els.resortList.innerHTML = resorts.map(r => `
    <div class="resort-item ${r.id === state.selectedId ? 'active' : ''}" data-id="${r.id}" tabindex="0" role="button">
      <div class="resort-top">
        <div>
          <strong style="font-size:14px">${r.name}</strong>
          <div class="muted small">${r.state} · ${r.owner}</div>
        </div>
      </div>
      <div class="chip-row">
        <span class="chip">${r.vertical} ft</span>
        <span class="chip">${r.trails} trails</span>
        <span class="chip">${r.pass}</span>
        ${r.night ? '<span class="chip good">🌙 Night</span>' : ''}
      </div>
    </div>`).join('');

  [...els.resortList.querySelectorAll('.resort-item')].forEach(item => {
    const select = () => { state.selectedId = item.dataset.id; render(); };
    item.addEventListener('click', select);
    item.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') select(); });
  });

  // Scroll active item into view
  const active = els.resortList.querySelector('.resort-item.active');
  if (active) active.scrollIntoView({ block: 'nearest' });
}

// ─── Comparison table ─────────────────────────────────────────────────────────
function renderComparisonTable(resorts) {
  // Update sort indicators on headers
  [...els.comparisonTable.querySelectorAll('th.sortable')].forEach(th => {
    th.classList.remove('sort-asc', 'sort-desc');
    if (th.dataset.col === state.sortCol) {
      th.classList.add(state.sortDir === 'asc' ? 'sort-asc' : 'sort-desc');
    }
  });

  if (!resorts.length) {
    els.comparisonBody.innerHTML = `<tr><td colspan="10" class="empty-state">No resorts match.</td></tr>`;
    return;
  }

  els.comparisonBody.innerHTML = resorts.map(r => {
    const bar = (val, key) => {
      const pct = Math.min(100, Math.round((val / (COL_MAX[key] || 1)) * 100));
      return `<div class="bar-cell">
        <span style="font-family:'DM Mono',monospace">${val}</span>
        <div class="inline-bar"><div class="inline-bar-fill" style="width:${pct}%"></div></div>
      </div>`;
    };
    return `
      <tr data-id="${r.id}" class="${r.id === state.selectedId ? 'active-row' : ''}">
        <td class="col-name">
          <div class="td-resort-name">${r.name}</div>
        </td>
        <td class="col-state td-resort-state">${r.state}</td>
        <td class="col-num">${bar(r.vertical,    'vertical')}</td>
        <td class="col-num">${bar(r.trails,      'trails')}</td>
        <td class="col-num">${bar(r.lifts,       'lifts')}</td>
        <td class="col-num">${bar(r.acres,       'acres')}</td>
        <td class="col-num">${bar(r.longestRun,  'longestRun')}</td>
        <td class="col-num">${bar(r.snowfall,    'snowfall')}</td>
        <td class="col-num">${bar(r.snowmaking,  'snowmaking')}</td>
        <td class="col-center">${r.night ? '<span class="night-yes" title="Night skiing available">🌙</span>' : '<span class="night-no">—</span>'}</td>
      </tr>`;
  }).join('');

  [...els.comparisonBody.querySelectorAll('tr[data-id]')].forEach(row => {
    row.addEventListener('click', () => {
      state.selectedId = row.dataset.id;
      render();
    });
  });
}

// ─── Selected resort detail ───────────────────────────────────────────────────
function renderSelectedResort(resort) {
  if (!resort) {
    els.selectedResort.innerHTML = '<div class="empty-state muted">Select a resort to see details.</div>';
    return;
  }

  const terrainBars = [
    ['Beginner',     'beginner',     resort.difficulty.beginner],
    ['Intermediate', 'intermediate', resort.difficulty.intermediate],
    ['Advanced',     'advanced',     resort.difficulty.advanced],
    ['Expert',       'expert',       resort.difficulty.expert],
  ].map(([label, cls, val]) => `
    <div class="bar-row">
      <div class="bar-label"><span class="difficulty-dot ${cls}"></span>${label}</div>
      <div class="bar"><div class="bar-fill ${cls}" style="width:${val*100}%"></div></div>
      <div class="bar-pct">${Math.round(val*100)}%</div>
    </div>`).join('');

  const mediaBox = (title, imgUrl, pageUrl, btnText) => {
    const media = imgUrl
      ? `<img src="${imgUrl}" alt="${title}" onerror="this.style.display='none';this.nextElementSibling.style.display='grid'">
         <div class="placeholder" style="display:none">Image unavailable</div>`
      : `<div class="placeholder">No image — <a href="${pageUrl||'#'}" target="_blank">view page ↗</a></div>`;
    const link = pageUrl ? `<a href="${pageUrl}" target="_blank" rel="noreferrer">${btnText} ↗</a>` : '';
    return `<div class="media-box">${media}<div class="media-caption">${link}</div></div>`;
  };

  els.selectedResort.innerHTML = `
    <div class="section-header">
      <div>
        <div class="eyebrow" style="color:var(--accent-2);font-size:10px;letter-spacing:.14em;font-weight:700;text-transform:uppercase;margin-bottom:4px">Selected Resort</div>
        <div class="resort-detail-name">${resort.name}</div>
        <div class="resort-detail-meta">${resort.state} · ${resort.pass} pass · ${resort.owner}</div>
      </div>
      <a href="${resort.website}" target="_blank" rel="noreferrer" class="detail-link">Website ↗</a>
    </div>

    <div class="metrics-grid">
      <div class="metric-card"><div class="metric-label">Vertical</div><div class="metric-value">${resort.vertical} ft</div></div>
      <div class="metric-card"><div class="metric-label">Trails</div><div class="metric-value">${resort.trails}</div></div>
      <div class="metric-card"><div class="metric-label">Lifts</div><div class="metric-value">${resort.lifts}</div></div>
      <div class="metric-card"><div class="metric-label">Acres</div><div class="metric-value">${resort.acres}</div></div>
      <div class="metric-card"><div class="metric-label">Longest Run</div><div class="metric-value">${resort.longestRun} mi</div></div>
      <div class="metric-card"><div class="metric-label">Snowfall</div><div class="metric-value">${resort.snowfall} in</div></div>
      <div class="metric-card"><div class="metric-label">Snowmaking</div><div class="metric-value">${resort.snowmaking}%</div></div>
      <div class="metric-card"><div class="metric-label">Night Skiing</div><div class="metric-value">${resort.night ? '🌙 Yes' : 'No'}</div></div>
    </div>

    <div style="margin-bottom:12px">
      <div class="metric-label" style="margin-bottom:8px">Terrain Mix</div>
      ${terrainBars}
    </div>

    <div style="margin-bottom:12px">
      <div class="metric-label" style="margin-bottom:8px">Lifts</div>
      ${resort.liftsBreakdown.map(([type, count]) =>
        `<div class="lift-row"><span>${type}</span><span style="font-family:'DM Mono',monospace;font-weight:600">${count}</span></div>`
      ).join('')}
    </div>

    ${resort.tags?.length ? `<div class="chip-row" style="margin-bottom:12px">${resort.tags.map(t=>`<span class="chip">${t}</span>`).join('')}</div>` : ''}
    <div class="footer-note">${resort.notes}</div>

    <div class="media-grid">
      ${mediaBox(resort.name + ' Webcam',    resort.webcamImage,   resort.webcamPage   || resort.website, 'Open webcam')}
      ${mediaBox(resort.name + ' Trail Map', resort.trailMapImage, resort.trailMapPage || resort.website, 'Open trail map')}
    </div>
  `;
}

// ─── Map ─────────────────────────────────────────────────────────────────────
const STATE_LABELS = [
  { name: 'ME', lat: 45.1, lon: -69.2 },
  { name: 'NH', lat: 43.9, lon: -71.5 },
  { name: 'VT', lat: 44.1, lon: -72.7 },
  { name: 'MA', lat: 42.35,lon: -71.9 },
  { name: 'NY', lat: 42.7, lon: -74.5 },
];

function renderMap(resorts) {
  const latMin=41.8, latMax=45.6, lonMin=-74.8, lonMax=-69.8;
  const W=700, H=430, pad=38;
  const px = lon => pad + ((lon-lonMin)/(lonMax-lonMin))*(W-pad*2);
  const py = lat => H - pad - ((lat-latMin)/(latMax-latMin))*(H-pad*2);
  const filteredIds = new Set(resorts.map(r=>r.id));

  const svg = `
    <svg viewBox="0 0 ${W} ${H}" role="img" aria-label="New England ski resort map">
      <rect x="0" y="0" width="${W}" height="${H}" rx="12" fill="rgba(255,255,255,0.01)"/>
      <text x="${W-24}" y="24" class="map-label" text-anchor="end" style="font-size:11px;fill:rgba(159,176,211,0.5)">N ↑</text>
      ${STATE_LABELS.map(s=>`<text x="${px(s.lon)}" y="${py(s.lat)}" class="map-state-label" text-anchor="middle">${s.name}</text>`).join('')}
      ${RESORTS.map(base => {
        const inFilter = filteredIds.has(base.id);
        const isSel    = base.id === state.selectedId;
        const x = px(base.lon), y = py(base.lat);
        const r    = isSel ? 9 : 6;
        const fill = !inFilter ? 'rgba(159,176,211,0.15)' : isSel ? '#84e1c6' : '#7fb6ff';
        const sw   = isSel ? 3 : 2;
        const sc   = isSel ? 'rgba(132,225,198,0.5)' : 'rgba(11,18,32,0.9)';
        return `
          <g class="map-point" data-id="${base.id}" tabindex="${inFilter?0:-1}" role="button" aria-label="${base.name}" style="opacity:${inFilter?1:0.3}">
            ${isSel?`<circle cx="${x}" cy="${y}" r="15" fill="rgba(132,225,198,0.1)"/>`:''}
            <circle cx="${x}" cy="${y}" r="${r}" fill="${fill}" stroke="${sc}" stroke-width="${sw}"/>
            ${isSel?`<text x="${x}" y="${y-14}" class="map-label" text-anchor="middle" style="fill:#84e1c6;font-weight:700;font-size:11px">${base.name}</text>`:''}
          </g>`;
      }).join('')}
    </svg>`;

  els.resortMap.innerHTML = svg;

  [...els.resortMap.querySelectorAll('.map-point[tabindex="0"]')].forEach(point => {
    const selectIt = () => { state.selectedId = point.dataset.id; render(); };
    point.addEventListener('click', selectIt);
    point.addEventListener('keydown', e => { if(e.key==='Enter'||e.key===' ') selectIt(); });

    const resort = resorts.find(r => r.id === point.dataset.id);
    if (!resort) return;

    point.addEventListener('mouseenter', e => {
      els.mapTooltip.innerHTML = `
        <div class="map-tooltip-name">${resort.name}</div>
        <div class="map-tooltip-meta">${resort.state} · ${resort.vertical} ft · ${resort.trails} trails · ${resort.acres} acres</div>`;
      els.mapTooltip.classList.add('visible');
      positionTooltip(e);
    });
    point.addEventListener('mousemove', positionTooltip);
    point.addEventListener('mouseleave', () => els.mapTooltip.classList.remove('visible'));
  });
}

function positionTooltip(e) {
  const rect = els.resortMap.getBoundingClientRect();
  let x = e.clientX - rect.left + 14;
  let y = e.clientY - rect.top - 10;
  if (x + 200 > rect.width) x = e.clientX - rect.left - 214;
  els.mapTooltip.style.left = x + 'px';
  els.mapTooltip.style.top  = y + 'px';
}

// ─── Table sort headers ───────────────────────────────────────────────────────
function wireSortHeaders() {
  [...els.comparisonTable.querySelectorAll('th.sortable')].forEach(th => {
    th.addEventListener('click', () => {
      const col = th.dataset.col;
      if (state.sortCol === col) {
        state.sortDir = state.sortDir === 'desc' ? 'asc' : 'desc';
      } else {
        state.sortCol = col;
        // Default direction: desc for numbers, asc for text
        state.sortDir = (col === 'name' || col === 'state') ? 'asc' : 'desc';
      }
      render();
    });
  });
}

// ─── Event wiring ─────────────────────────────────────────────────────────────
function wireEvents() {
  els.searchInput.addEventListener('input', e => { state.search = e.target.value; render(); });
  els.stateFilter.addEventListener('change', e => { state.stateFilter = e.target.value; render(); });
  els.passFilter.addEventListener('change',  e => { state.pass = e.target.value; render(); });

  els.toggleNight.addEventListener('click', () => {
    state.nightOnly = !state.nightOnly;
    els.toggleNight.setAttribute('aria-pressed', state.nightOnly ? 'true' : 'false');
    render();
  });

  els.randomResort.addEventListener('click', () => {
    const resorts = filteredResorts();
    if (!resorts.length) return;
    const pick = resorts[Math.floor(Math.random() * resorts.length)];
    state.selectedId = pick.id;
    render();
    showToast(`✦ Showing: ${pick.name}`);
  });

  wireSortHeaders();
}

// ─── Main render ──────────────────────────────────────────────────────────────
function render() {
  const resorts = filteredResorts();
  renderSummaryCards(resorts);
  renderActiveFilters();
  renderResortList(resorts);
  renderComparisonTable(resorts);
  renderMap(resorts);
  renderSelectedResort(resorts.find(r => r.id === state.selectedId) || null);
}

// ─── Initialize ───────────────────────────────────────────────────────────────
function initialize() {
  els.stateFilter.innerHTML = uniqueStates().map(s => `<option value="${s}">${s}</option>`).join('');
  els.passFilter.innerHTML  = uniquePasses().map(p => `<option value="${p}">${p}</option>`).join('');
  wireEvents();
  render();
}

initialize();
