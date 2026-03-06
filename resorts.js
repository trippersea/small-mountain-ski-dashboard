const DEFAULT_WEIGHTS = {
  vertical: 20,
  trails: 15,
  snowfall: 15,
  snowmaking: 15,
  night: 15,
  charm: 10,
  vibe: 10
};

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
  sortBy: 'score',
  nightOnly: false,
  selectedId: 'black-nh',
  weights: { ...DEFAULT_WEIGHTS }
};

// ─── DOM refs ─────────────────────────────────────────────────────────────────
const els = {
  summaryCards:   document.getElementById('summaryCards'),
  searchInput:    document.getElementById('searchInput'),
  stateFilter:    document.getElementById('stateFilter'),
  passFilter:     document.getElementById('passFilter'),
  sortBy:         document.getElementById('sortBy'),
  toggleNight:    document.getElementById('toggleNight'),
  randomResort:   document.getElementById('randomResort'),
  activeFilters:  document.getElementById('activeFilters'),
  resortList:     document.getElementById('resortList'),
  resultCount:    document.getElementById('resultCount'),
  selectedResort: document.getElementById('selectedResort'),
  rankings:       document.getElementById('rankings'),
  resortMap:      document.getElementById('resortMap'),
  mapTooltip:     document.getElementById('mapTooltip'),
  weightControls: document.getElementById('weightControls'),
  weightsTotal:   document.getElementById('weightsTotal'),
  weightsWarning: document.getElementById('weightsWarning'),
  resetWeights:   document.getElementById('resetWeights'),
  toast:          document.getElementById('toast'),
};

// ─── Helpers ─────────────────────────────────────────────────────────────────
function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function scoreDescriptor(score) {
  if (score >= 90) return 'Exceptional';
  if (score >= 80) return 'Excellent';
  if (score >= 70) return 'Very Good';
  if (score >= 60) return 'Good';
  if (score >= 50) return 'Decent';
  return 'Below Average';
}

let toastTimer = null;
function showToast(msg) {
  els.toast.textContent = msg;
  els.toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => els.toast.classList.remove('show'), 2600);
}

// ─── Scoring ─────────────────────────────────────────────────────────────────
function computeScore(resort) {
  const factors = {
    vertical:    clamp((Math.min(resort.vertical, 1800) / 1800) * 100, 0, 100),
    trails:      clamp((Math.min(resort.trails, 70) / 70) * 100, 0, 100),
    snowfall:    clamp((Math.min(resort.snowfall, 250) / 250) * 100, 0, 100),
    snowmaking:  resort.snowmaking,
    night:       resort.night ? 100 : 0,
    charm:       resort.charm,
    vibe:        resort.localVibe,
  };
  const totalWeight = Object.values(state.weights).reduce((sum, v) => sum + v, 0) || 1;
  const weightedSum = Object.entries(factors).reduce((sum, [key, val]) => sum + val * (state.weights[key] || 0), 0);
  return Math.round(weightedSum / totalWeight);
}

function computeExperienceScore(resort) {
  const vertical      = clamp((Math.min(resort.vertical, 1800) / 1800) * 100, 0, 100);
  const trails        = clamp((Math.min(resort.trails, 70) / 70) * 100, 0, 100);
  const snowfall      = clamp((Math.min(resort.snowfall, 250) / 250) * 100, 0, 100);
  const liftStrength  = clamp((Math.min(resort.lifts, 12) / 12) * 100, 0, 100);
  const terrainVariety = 100 - Math.abs(resort.difficulty.beginner - resort.difficulty.intermediate) * 100;
  return Math.round(vertical * 0.28 + trails * 0.20 + snowfall * 0.18 + liftStrength * 0.18 + terrainVariety * 0.16);
}

function decorate(resort) {
  return { ...resort, score: computeScore(resort), experienceScore: computeExperienceScore(resort) };
}

// ─── Filtering ───────────────────────────────────────────────────────────────
function uniquePasses()  { return ['All', ...new Set(RESORTS.map(r => r.pass))]; }
function uniqueStates()  { return ['All', ...new Set(RESORTS.map(r => r.state)).values()].sort((a,b) => a === 'All' ? -1 : a.localeCompare(b)); }

function filteredResorts() {
  return RESORTS
    .map(decorate)
    .filter(resort => {
      const q = state.search.trim().toLowerCase();
      const haystack = [resort.name, resort.state, resort.pass, resort.owner, resort.notes, ...(resort.tags || [])].join(' ').toLowerCase();
      const matchSearch  = !q || haystack.includes(q);
      const matchPass    = state.pass === 'All' || resort.pass === state.pass;
      const matchState   = state.stateFilter === 'All' || resort.state === state.stateFilter;
      const matchNight   = !state.nightOnly || resort.night;
      return matchSearch && matchPass && matchState && matchNight;
    })
    .sort((a, b) => (b[state.sortBy] || 0) - (a[state.sortBy] || 0) || a.name.localeCompare(b.name));
}

// ─── Active filters display ───────────────────────────────────────────────────
function renderActiveFilters() {
  const tags = [];
  if (state.search.trim())           tags.push({ label: `"${state.search.trim()}"`,    clear: () => { state.search = ''; els.searchInput.value = ''; } });
  if (state.stateFilter !== 'All')   tags.push({ label: `State: ${state.stateFilter}`, clear: () => { state.stateFilter = 'All'; els.stateFilter.value = 'All'; } });
  if (state.pass !== 'All')          tags.push({ label: `Pass: ${state.pass}`,         clear: () => { state.pass = 'All'; els.passFilter.value = 'All'; } });
  if (state.nightOnly)               tags.push({ label: '🌙 Night only',              clear: () => { state.nightOnly = false; els.toggleNight.setAttribute('aria-pressed', 'false'); } });

  els.activeFilters.innerHTML = tags.map((t, i) =>
    `<span class="filter-tag">${t.label}<button data-idx="${i}" aria-label="Remove filter">✕</button></span>`
  ).join('');

  [...els.activeFilters.querySelectorAll('button')].forEach(btn => {
    btn.addEventListener('click', () => {
      tags[+btn.dataset.idx].clear();
      render();
    });
  });
}

// ─── Summary cards ────────────────────────────────────────────────────────────
function renderSummaryCards(resorts) {
  const avgScore   = resorts.length ? Math.round(resorts.reduce((s, r) => s + r.score, 0) / resorts.length) : 0;
  const avgVertical= resorts.length ? Math.round(resorts.reduce((s, r) => s + r.vertical, 0) / resorts.length) : 0;
  const nightCount = resorts.filter(r => r.night).length;
  const top        = resorts[0]?.name || '—';
  const weightTotal= Object.values(state.weights).reduce((a, b) => a + b, 0);
  els.summaryCards.innerHTML = [
    ['Resorts',     resorts.length],
    ['Avg Score',   avgScore],
    ['Avg Vertical',`${avgVertical} ft`],
    ['Night Skiing',nightCount],
    ['Top Ranked',  top],
    ['Weight Total',`${weightTotal}%`],
  ].map(([label, value]) => `<div class="stat-card"><div class="stat-label">${label}</div><div class="stat-value">${value}</div></div>`).join('');
}

// ─── Resort list ─────────────────────────────────────────────────────────────
function renderResortList(resorts) {
  els.resultCount.textContent = `${resorts.length} resort${resorts.length === 1 ? '' : 's'}`;

  if (!resorts.length) {
    els.resortList.innerHTML     = '<div class="empty-state">No resorts match these filters.</div>';
    els.selectedResort.innerHTML = '<div class="card panel empty-state">Try changing your search or filters.</div>';
    els.rankings.innerHTML       = '';
    els.resortMap.innerHTML      = '<div class="empty-state">No map points to show.</div>';
    return;
  }

  if (!resorts.find(r => r.id === state.selectedId)) state.selectedId = resorts[0].id;

  els.resortList.innerHTML = resorts.map(resort => `
    <div class="resort-item ${resort.id === state.selectedId ? 'active' : ''}" data-id="${resort.id}" tabindex="0" role="button" aria-pressed="${resort.id === state.selectedId}">
      <div class="resort-top">
        <div><strong>${resort.name}</strong><div class="muted small">${resort.state} · ${resort.owner}</div></div>
        <span class="score-pill">${resort.score}</span>
      </div>
      <div class="chip-row">
        <span class="chip">${resort.vertical} ft</span>
        <span class="chip">${resort.trails} trails</span>
        <span class="chip">${resort.pass}</span>
        ${resort.night ? '<span class="chip good">🌙 Night</span>' : ''}
      </div>
    </div>`).join('');

  [...els.resortList.querySelectorAll('.resort-item')].forEach(item => {
    const select = () => {
      state.selectedId = item.dataset.id;
      render();
      // Scroll to selected resort detail (works on mobile too)
      document.getElementById('selectedResort').scrollIntoView({ behavior: 'smooth', block: 'start' });
    };
    item.addEventListener('click', select);
    item.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') select(); });
  });

  const selected = resorts.find(r => r.id === state.selectedId);
  renderSelectedResort(selected);
  renderRankings(resorts);
  renderMap(resorts);
}

// ─── Terrain bars with difficulty colors ─────────────────────────────────────
function renderTerrainBars(difficulty) {
  return [
    ['Beginner',     'beginner',     difficulty.beginner],
    ['Intermediate', 'intermediate', difficulty.intermediate],
    ['Advanced',     'advanced',     difficulty.advanced],
    ['Expert',       'expert',       difficulty.expert],
  ].map(([label, cls, value]) => `
    <div class="bar-row">
      <div class="bar-label"><span class="difficulty-dot ${cls}"></span>${label}</div>
      <div class="bar"><div class="bar-fill ${cls}" style="width:${value * 100}%"></div></div>
      <div class="bar-pct">${Math.round(value * 100)}%</div>
    </div>`).join('');
}

// ─── Media box ────────────────────────────────────────────────────────────────
function renderMediaBox(title, imageUrl, pageUrl, buttonText) {
  const media = imageUrl
    ? `<img src="${imageUrl}" alt="${title}" onerror="this.style.display='none'; this.parentElement.querySelector('.placeholder').style.display='grid';" />
       <div class="placeholder" style="display:none;">Image could not be loaded.</div>`
    : `<div class="placeholder">No direct image URL yet.<br>Add one in <code>resorts.js</code>.</div>`;
  const link = pageUrl ? `<div class="link-row"><a href="${pageUrl}" target="_blank" rel="noreferrer">${buttonText} ↗</a></div>` : '';
  return `<div class="media-box">${media}<div class="media-caption"><div class="stat-label">${title}</div>${link}</div></div>`;
}

// ─── Selected resort detail ───────────────────────────────────────────────────
function renderSelectedResort(resort) {
  els.selectedResort.innerHTML = `
    <section class="card headline-card">
      <div class="headline-top">
        <div class="headline">
          <div class="eyebrow">Selected Resort</div>
          <h2>${resort.name}</h2>
          <p class="muted">${resort.state} · ${resort.pass} pass · ${resort.owner}</p>
        </div>
        <div>
          <div class="score-pill">Score ${resort.score}</div>
        </div>
      </div>
      <div class="metrics-grid">
        <div class="metric-card"><div class="metric-label">Vertical</div><div class="metric-value">${resort.vertical} ft</div></div>
        <div class="metric-card"><div class="metric-label">Trails</div><div class="metric-value">${resort.trails}</div></div>
        <div class="metric-card"><div class="metric-label">Snowfall</div><div class="metric-value">${resort.snowfall} in</div></div>
        <div class="metric-card"><div class="metric-label">Snowmaking</div><div class="metric-value">${resort.snowmaking}%</div></div>
        <div class="metric-card"><div class="metric-label">Lifts</div><div class="metric-value">${resort.lifts}</div></div>
        <div class="metric-card"><div class="metric-label">Acres</div><div class="metric-value">${resort.acres}</div></div>
        <div class="metric-card"><div class="metric-label">Longest Run</div><div class="metric-value">${resort.longestRun} mi</div></div>
        <div class="metric-card"><div class="metric-label">Experience</div><div class="metric-value">${resort.experienceScore}</div></div>
      </div>
    </section>

    <section class="detail-grid">
      <div class="card panel">
        <div class="section-header"><h2>Terrain + Lift Breakdown</h2></div>
        ${renderTerrainBars(resort.difficulty)}
        <table class="mini-table" style="margin-top: 12px;">
          <tbody>
            ${resort.liftsBreakdown.map(([label, count]) => `<tr><td>${label}</td><td>${count}</td></tr>`).join('')}
            <tr><td>Night Skiing</td><td>${resort.night ? '✓ Yes' : 'No'}</td></tr>
            <tr>
              <td>Charm</td>
              <td>
                <span style="font-family:'DM Mono',monospace;font-weight:700">${resort.charm}/100</span>
                <span class="score-descriptor">${scoreDescriptor(resort.charm)}</span>
              </td>
            </tr>
            <tr>
              <td>Local Vibe</td>
              <td>
                <span style="font-family:'DM Mono',monospace;font-weight:700">${resort.localVibe}/100</span>
                <span class="score-descriptor">${scoreDescriptor(resort.localVibe)}</span>
              </td>
            </tr>
          </tbody>
        </table>
        <div class="footer-note">${resort.notes}</div>
        ${resort.tags && resort.tags.length ? `<div class="chip-row" style="margin-top:12px">${resort.tags.map(t => `<span class="chip">${t}</span>`).join('')}</div>` : ''}
        <div style="margin-top:16px"><a href="${resort.website}" target="_blank" rel="noreferrer" style="color:var(--accent);font-size:13px;text-decoration:none;">Visit website ↗</a></div>
      </div>

      <div class="media-grid">
        ${renderMediaBox(`${resort.name} Webcam`, resort.webcamImage, resort.webcamPage || resort.website, 'Open webcam page')}
        ${renderMediaBox(`${resort.name} Trail Map`, resort.trailMapImage, resort.trailMapPage || resort.website, 'Open trail map page')}
      </div>
    </section>
  `;
}

// ─── Rankings ────────────────────────────────────────────────────────────────
function renderRankings(resorts) {
  const badgeClass = i => i === 0 ? 'gold' : i === 1 ? 'silver' : i === 2 ? 'bronze' : '';
  const total = resorts.length;

  els.rankings.innerHTML = `
    <table class="mini-table">
      <thead><tr><th>#</th><th>Resort</th><th>Score</th><th>Night</th></tr></thead>
      <tbody>
        ${resorts.map((resort, i) => `
          <tr>
            <td><span class="rank-badge ${badgeClass(i)}">${i + 1}</span></td>
            <td><button class="ranking-button" data-id="${resort.id}">${resort.name}</button></td>
            <td style="font-family:'DM Mono',monospace;font-weight:700">${resort.score}</td>
            <td>${resort.night ? '🌙' : '—'}</td>
          </tr>`).join('')}
      </tbody>
    </table>
    ${total > 10 ? `<p class="rankings-count-note">Showing all ${total} resorts</p>` : ''}`;

  [...document.querySelectorAll('.ranking-button')].forEach(btn => {
    btn.addEventListener('click', () => {
      state.selectedId = btn.dataset.id;
      render();
      document.getElementById('selectedResort').scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

// ─── Map ─────────────────────────────────────────────────────────────────────
// State label positions (approx center of each state in our projection space)
const STATE_LABELS = [
  { name: 'ME',  lat: 45.2,  lon: -69.0 },
  { name: 'NH',  lat: 43.9,  lon: -71.5 },
  { name: 'VT',  lat: 44.0,  lon: -72.7 },
  { name: 'MA',  lat: 42.35, lon: -71.8 },
  { name: 'NY',  lat: 42.7,  lon: -74.5 },
];

function renderMap(resorts) {
  if (!resorts.length) return;

  // Use fixed bounds so the map doesn't jump around when filtering
  const latMin = 41.8, latMax = 45.6;
  const lonMin = -74.8, lonMax = -69.8;
  const width = 760, height = 470, pad = 40;

  const px = lon => pad + ((lon - lonMin) / (lonMax - lonMin)) * (width - pad * 2);
  const py = lat => height - pad - ((lat - latMin) / (latMax - latMin)) * (height - pad * 2);

  const decoratedMap = resorts.reduce((m, r) => { m[r.id] = r; return m; }, {});

  const svg = `
    <svg viewBox="0 0 ${width} ${height}" role="img" aria-label="New England ski resort map" tabindex="-1">
      <rect x="0" y="0" width="${width}" height="${height}" rx="14" fill="rgba(255,255,255,0.015)"></rect>

      <!-- Compass north indicator -->
      <text x="${width - 28}" y="28" class="map-label" text-anchor="middle" style="font-size:12px;fill:rgba(159,176,211,0.6)">N ↑</text>

      <!-- State labels -->
      ${STATE_LABELS.map(s => `<text x="${px(s.lon)}" y="${py(s.lat)}" class="map-state-label" text-anchor="middle">${s.name}</text>`).join('')}

      <!-- Resort dots -->
      ${RESORTS.map(base => {
        const resort = decoratedMap[base.id] || base;
        const filtered = !!decoratedMap[base.id];
        const x = px(base.lon);
        const y = py(base.lat);
        const isSelected = base.id === state.selectedId;
        const r = isSelected ? 9 : 6;
        const fill = !filtered ? 'rgba(159,176,211,0.2)' : isSelected ? '#84e1c6' : '#7fb6ff';
        const stroke = isSelected ? 'rgba(132,225,198,0.5)' : 'rgba(11,18,32,0.9)';
        const strokeW = isSelected ? 3 : 2;
        const opacity = filtered ? 1 : 0.35;
        return `
          <g class="map-point" data-id="${base.id}" tabindex="${filtered ? 0 : -1}" role="button" aria-label="${base.name}" style="opacity:${opacity}">
            ${isSelected ? `<circle cx="${x}" cy="${y}" r="14" fill="rgba(132,225,198,0.12)" />` : ''}
            <circle cx="${x}" cy="${y}" r="${r}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeW}" />
            ${isSelected ? `<text x="${x}" y="${y - 14}" class="map-label" text-anchor="middle" style="fill:#84e1c6;font-weight:700">${base.name}</text>` : ''}
          </g>`;
      }).join('')}
    </svg>`;

  els.resortMap.innerHTML = svg;

  // Click handlers
  [...els.resortMap.querySelectorAll('.map-point[tabindex="0"]')].forEach(point => {
    const selectIt = () => {
      state.selectedId = point.dataset.id;
      render();
      document.getElementById('selectedResort').scrollIntoView({ behavior: 'smooth', block: 'start' });
    };
    point.addEventListener('click', selectIt);
    point.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') selectIt(); });

    // Hover tooltip
    point.addEventListener('mouseenter', e => {
      const id = point.dataset.id;
      const resort = decoratedMap[id];
      if (!resort) return;
      els.mapTooltip.innerHTML = `
        <div class="map-tooltip-name">${resort.name}</div>
        <div class="map-tooltip-meta">${resort.state} · ${resort.vertical} ft · ${resort.trails} trails</div>
        <div class="map-tooltip-score">Score: ${resort.score}</div>`;
      els.mapTooltip.classList.add('visible');
      els.mapTooltip.setAttribute('aria-hidden', 'false');
      positionTooltip(e);
    });
    point.addEventListener('mousemove', positionTooltip);
    point.addEventListener('mouseleave', () => {
      els.mapTooltip.classList.remove('visible');
      els.mapTooltip.setAttribute('aria-hidden', 'true');
    });
  });
}

function positionTooltip(e) {
  const mapRect = els.resortMap.getBoundingClientRect();
  let x = e.clientX - mapRect.left + 14;
  let y = e.clientY - mapRect.top - 10;
  // Prevent overflow right
  if (x + 180 > mapRect.width) x = e.clientX - mapRect.left - 174;
  els.mapTooltip.style.left = x + 'px';
  els.mapTooltip.style.top  = y + 'px';
}

// ─── Weight controls ─────────────────────────────────────────────────────────
let renderWeightsDebounceTimer = null;

function renderWeightControls() {
  const labels = {
    vertical: 'Vertical', trails: 'Trails', snowfall: 'Snowfall',
    snowmaking: 'Snowmaking', night: 'Night Skiing', charm: 'Charm', vibe: 'Local Vibe'
  };
  els.weightControls.innerHTML = Object.entries(labels).map(([key, label]) => `
    <div class="sub-card weight-card">
      <label for="weight-${key}">
        <span>${label}</span>
        <span id="value-${key}" class="weight-value">${state.weights[key]}%</span>
      </label>
      <input id="weight-${key}" type="range" min="0" max="40" step="1" value="${state.weights[key]}" data-weight-key="${key}" />
    </div>`).join('');

  updateWeightsTotal();

  [...document.querySelectorAll('[data-weight-key]')].forEach(slider => {
    slider.addEventListener('input', () => {
      const key = slider.dataset.weightKey;
      state.weights[key] = Number(slider.value);
      document.getElementById(`value-${key}`).textContent = `${slider.value}%`;
      updateWeightsTotal();
      // Debounce the full re-render while dragging
      clearTimeout(renderWeightsDebounceTimer);
      renderWeightsDebounceTimer = setTimeout(render, 80);
    });
  });
}

function updateWeightsTotal() {
  const total = Object.values(state.weights).reduce((a, b) => a + b, 0);
  els.weightsTotal.textContent = `${total}%`;
  if (total !== 100) {
    els.weightsWarning.textContent = `(scores are normalized — total doesn't need to be 100)`;
  } else {
    els.weightsWarning.textContent = '';
  }
}

// ─── Event wiring ─────────────────────────────────────────────────────────────
function wireEvents() {
  els.searchInput.addEventListener('input', e => { state.search = e.target.value; render(); });
  els.stateFilter.addEventListener('change', e => { state.stateFilter = e.target.value; render(); });
  els.passFilter.addEventListener('change',  e => { state.pass = e.target.value; render(); });
  els.sortBy.addEventListener('change',      e => { state.sortBy = e.target.value; render(); });

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
    document.getElementById('selectedResort').scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  els.resetWeights.addEventListener('click', () => {
    state.weights = { ...DEFAULT_WEIGHTS };
    render();
    showToast('Weights reset to defaults');
  });
}

// ─── Main render ─────────────────────────────────────────────────────────────
function render() {
  const resorts = filteredResorts();
  renderSummaryCards(resorts);
  renderWeightControls();
  renderResortList(resorts);
  renderActiveFilters();

  // Sync sidebar scroll to selected item
  const activeItem = els.resortList.querySelector('.resort-item.active');
  if (activeItem) {
    activeItem.scrollIntoView({ block: 'nearest' });
  }
}

// ─── Initialize ───────────────────────────────────────────────────────────────
function initialize() {
  els.stateFilter.innerHTML = uniqueStates().map(s => `<option value="${s}">${s}</option>`).join('');
  els.passFilter.innerHTML  = uniquePasses().map(p => `<option value="${p}">${p}</option>`).join('');
  wireEvents();
  render();
}

initialize();
