const RESORTS = [
  {
    id: 'black-nh',
    name: 'Black Mountain',
    state: 'NH',
    region: 'New England',
    owner: 'Independently operated',
    pass: 'Indy',
    vertical: 1100,
    trails: 45,
    lifts: 5,
    acres: 143,
    snowfall: 120,
    snowmaking: 98,
    night: false,
    longestRun: 2.5,
    lat: 44.1776,
    lon: -71.1284,
    difficulty: { beginner: 0.20, intermediate: 0.45, advanced: 0.25, expert: 0.10 },
    liftsBreakdown: [['Double', 3], ['Triple', 1], ['Surface', 1]],
    charm: 96,
    localVibe: 94,
    webcam: 'https://placehold.co/1200x675/png?text=Black+Mountain+NH+Cam',
    website: 'https://www.blackmt.com/',
    notes: 'Classic New Hampshire small-mountain feel with strong historic character.',
    tags: ['Historic', 'Classic doubles', 'Indy favorite']
  },
  {
    id: 'black-me',
    name: 'Black Mountain of Maine',
    state: 'ME',
    region: 'New England',
    owner: 'Community nonprofit',
    pass: 'Indy',
    vertical: 1380,
    trails: 50,
    lifts: 3,
    acres: 600,
    snowfall: 110,
    snowmaking: 75,
    night: true,
    longestRun: 2.0,
    lat: 44.5342,
    lon: -70.5368,
    difficulty: { beginner: 0.24, intermediate: 0.38, advanced: 0.24, expert: 0.14 },
    liftsBreakdown: [['Double', 2], ['T-Bar', 1]],
    charm: 95,
    localVibe: 96,
    webcam: 'https://placehold.co/1200x675/png?text=Black+Mountain+Maine+Cam',
    website: 'https://skiblackmountain.org/',
    notes: 'Rumford soul hill with big acreage, meaningful vert, top-to-bottom night skiing, and nonprofit energy.',
    tags: ['Night skiing', 'Maine', 'Community hill']
  },
  {
    id: 'bolton',
    name: 'Bolton Valley',
    state: 'VT',
    region: 'New England',
    owner: 'Independently owned',
    pass: 'Indy',
    vertical: 1634,
    trails: 71,
    lifts: 6,
    acres: 300,
    snowfall: 300,
    snowmaking: 62,
    night: true,
    longestRun: 2.0,
    lat: 44.4217,
    lon: -72.8518,
    difficulty: { beginner: 0.18, intermediate: 0.44, advanced: 0.25, expert: 0.13 },
    liftsBreakdown: [['Quad', 2], ['Double', 3], ['Surface', 1]],
    charm: 87,
    localVibe: 92,
    webcam: 'https://placehold.co/1200x675/png?text=Bolton+Valley+Cam',
    website: 'https://www.boltonvalley.com/',
    notes: 'Natural-snow standout with night skiing, backcountry credibility, and one of the strongest local scenes in Vermont.',
    tags: ['Night skiing', 'Natural snow', 'Backcountry']
  },
  {
    id: 'bousquet',
    name: 'Bousquet',
    state: 'MA',
    region: 'New England',
    owner: 'Privately owned',
    pass: 'Indy',
    vertical: 750,
    trails: 24,
    lifts: 5,
    acres: 100,
    snowfall: 70,
    snowmaking: 95,
    night: true,
    longestRun: 1.0,
    lat: 42.4138,
    lon: -73.2820,
    difficulty: { beginner: 0.28, intermediate: 0.44, advanced: 0.22, expert: 0.06 },
    liftsBreakdown: [['Quad', 2], ['Triple', 1], ['Surface', 2]],
    charm: 80,
    localVibe: 83,
    webcam: 'https://placehold.co/1200x675/png?text=Bousquet+Cam',
    website: 'https://www.bousquetmountain.com/',
    notes: 'Compact but useful mountain with lights, local energy, and easy access.',
    tags: ['Night skiing', 'Berkshires', 'Local hill']
  },
  {
    id: 'bradford',
    name: 'Bradford Ski Area',
    state: 'MA',
    region: 'New England',
    owner: 'Independent',
    pass: 'Independent',
    vertical: 230,
    trails: 15,
    lifts: 10,
    acres: 48,
    snowfall: 40,
    snowmaking: 100,
    night: true,
    longestRun: 0.4,
    lat: 42.7779,
    lon: -71.0819,
    difficulty: { beginner: 0.34, intermediate: 0.40, advanced: 0.20, expert: 0.06 },
    liftsBreakdown: [['Triple', 3], ['T-Bar', 1], ['Rope tow', 3], ['Carpet', 3]],
    charm: 82,
    localVibe: 90,
    webcam: 'https://placehold.co/1200x675/png?text=Bradford+Cam',
    website: 'https://skibradford.com/',
    notes: 'Pure local feeder hill near Boston with strong night-skiing utility and learn-to-ride value.',
    tags: ['Boston-area', 'Night skiing', 'Feeder hill']
  },
  {
    id: 'bromley',
    name: 'Bromley',
    state: 'VT',
    region: 'New England',
    owner: 'Corporate',
    pass: 'Independent',
    vertical: 1334,
    trails: 47,
    lifts: 9,
    acres: 178,
    snowfall: 145,
    snowmaking: 98,
    night: false,
    longestRun: 2.5,
    lat: 43.2278,
    lon: -72.9382,
    difficulty: { beginner: 0.32, intermediate: 0.36, advanced: 0.20, expert: 0.12 },
    liftsBreakdown: [['High-speed quad', 1], ['Fixed quad', 1], ['Double', 4], ['T-Bar', 1], ['Carpet', 2]],
    charm: 86,
    localVibe: 80,
    webcam: 'https://placehold.co/1200x675/png?text=Bromley+Cam',
    website: 'https://www.bromley.com/',
    notes: 'South-facing “Sun Mountain” with one of the better family cruising mixes in southern Vermont.',
    tags: ['Family', 'Southern Vermont', 'Cruisers']
  },
  {
    id: 'burke',
    name: 'Burke Mountain',
    state: 'VT',
    region: 'New England',
    owner: 'Independent',
    pass: 'Independent',
    vertical: 2057,
    trails: 55,
    lifts: 4,
    acres: 260,
    snowfall: 217,
    snowmaking: 70,
    night: false,
    longestRun: 2.0,
    lat: 44.5717,
    lon: -71.8928,
    difficulty: { beginner: 0.18, intermediate: 0.42, advanced: 0.24, expert: 0.16 },
    liftsBreakdown: [['High-speed quad', 2], ['T-Bar', 1], ['J-Bar', 1]],
    charm: 84,
    localVibe: 88,
    webcam: 'https://placehold.co/1200x675/png?text=Burke+Cam',
    website: 'https://skiburke.com/',
    notes: 'Not really a “small” hill by vert, but an outstanding Northeast Kingdom independent with serious fall lines.',
    tags: ['Northeast Kingdom', 'Race culture', 'Big vert']
  },
  {
    id: 'butternut',
    name: 'Butternut',
    state: 'MA',
    region: 'New England',
    owner: 'Family-run',
    pass: 'Indy',
    vertical: 1000,
    trails: 22,
    lifts: 11,
    acres: 110,
    snowfall: 50,
    snowmaking: 100,
    night: false,
    longestRun: 1.25,
    lat: 42.1088,
    lon: -73.4054,
    difficulty: { beginner: 0.35, intermediate: 0.40, advanced: 0.20, expert: 0.05 },
    liftsBreakdown: [['Quad', 3], ['Triple', 3], ['Double', 2], ['Surface', 3]],
    charm: 78,
    localVibe: 85,
    webcam: 'https://placehold.co/1200x675/png?text=Butternut+Cam',
    website: 'https://skibutternut.com/',
    notes: 'Reliable southern New England operation with strong learning terrain and snowmaking depth.',
    tags: ['Family', 'Beginner-friendly', 'Reliable snowmaking']
  },
  {
    id: 'catamount',
    name: 'Catamount',
    state: 'NY/MA',
    region: 'New England',
    owner: 'Independent',
    pass: 'Indy',
    vertical: 1000,
    trails: 44,
    lifts: 8,
    acres: 119,
    snowfall: 75,
    snowmaking: 93,
    night: true,
    longestRun: 1.75,
    lat: 42.1269,
    lon: -73.5206,
    difficulty: { beginner: 0.35, intermediate: 0.42, advanced: 0.17, expert: 0.06 },
    liftsBreakdown: [['Quad', 2], ['Triple', 3], ['Carpet', 3]],
    charm: 79,
    localVibe: 81,
    webcam: 'https://placehold.co/1200x675/png?text=Catamount+Cam',
    website: 'https://catamountski.com/',
    notes: 'Border-straddling southern New England mountain with broad lit terrain and strong snowmaking.',
    tags: ['Night skiing', 'Indy', 'Hudson Valley access']
  },
  {
    id: 'gunstock',
    name: 'Gunstock',
    state: 'NH',
    region: 'New England',
    owner: 'County-owned',
    pass: 'Independent',
    vertical: 1400,
    trails: 55,
    lifts: 8,
    acres: 227,
    snowfall: 160,
    snowmaking: 98,
    night: true,
    longestRun: 1.6,
    lat: 43.5404,
    lon: -71.3702,
    difficulty: { beginner: 0.22, intermediate: 0.42, advanced: 0.25, expert: 0.11 },
    liftsBreakdown: [['High-speed quad', 1], ['Fixed quad', 2], ['Triple', 1], ['Double', 2], ['Surface', 2]],
    charm: 84,
    localVibe: 82,
    webcam: 'https://placehold.co/1200x675/png?text=Gunstock+Cam',
    website: 'https://www.gunstock.com/',
    notes: 'Big-small mountain blend with strong snowmaking and one of New England’s better night products.',
    tags: ['Night skiing', 'Family', 'Strong ops']
  },
  {
    id: 'magic',
    name: 'Magic Mountain',
    state: 'VT',
    region: 'New England',
    owner: 'Community-backed independent',
    pass: 'Indy',
    vertical: 1500,
    trails: 51,
    lifts: 5,
    acres: 285,
    snowfall: 120,
    snowmaking: 45,
    night: false,
    longestRun: 3.0,
    lat: 43.1964,
    lon: -72.8243,
    difficulty: { beginner: 0.14, intermediate: 0.32, advanced: 0.34, expert: 0.20 },
    liftsBreakdown: [['Quad', 1], ['Double', 3], ['Surface', 1]],
    charm: 98,
    localVibe: 99,
    webcam: 'https://placehold.co/1200x675/png?text=Magic+Mountain+Cam',
    website: 'https://magicmtn.com/',
    notes: 'Cult-favorite Vermont mountain with soul, steeper terrain, and extremely high vibe scores.',
    tags: ['Soul skiing', 'Steeps', 'Indy legend']
  },
  {
    id: 'nashoba',
    name: 'Nashoba Valley',
    state: 'MA',
    region: 'New England',
    owner: 'Independent',
    pass: 'Independent',
    vertical: 240,
    trails: 17,
    lifts: 10,
    acres: 46,
    snowfall: 50,
    snowmaking: 100,
    night: true,
    longestRun: 0.5,
    lat: 42.5290,
    lon: -71.4731,
    difficulty: { beginner: 0.20, intermediate: 0.50, advanced: 0.30, expert: 0.00 },
    liftsBreakdown: [['Triple', 3], ['Double', 1], ['Conveyor', 3], ['Rope tow', 3]],
    charm: 75,
    localVibe: 88,
    webcam: 'https://placehold.co/1200x675/png?text=Nashoba+Cam',
    website: 'https://skinashoba.com/',
    notes: 'Metro-Boston night-ski machine and pure utility hill for quick laps, lessons, and after-work turns.',
    tags: ['Night skiing', 'Metro Boston', 'Lessons']
  },
  {
    id: 'pats-peak',
    name: 'Pats Peak',
    state: 'NH',
    region: 'New England',
    owner: 'Family-owned',
    pass: 'Indy',
    vertical: 770,
    trails: 28,
    lifts: 11,
    acres: 117,
    snowfall: 80,
    snowmaking: 100,
    night: true,
    longestRun: 1.5,
    lat: 43.1790,
    lon: -71.8196,
    difficulty: { beginner: 0.50, intermediate: 0.21, advanced: 0.12, expert: 0.17 },
    liftsBreakdown: [['Quad', 1], ['Triple', 3], ['Double', 2], ['J-Bar', 1], ['Handle tow', 2], ['Carpet', 2]],
    charm: 83,
    localVibe: 89,
    webcam: 'https://placehold.co/1200x675/png?text=Pats+Peak+Cam',
    website: 'https://www.patspeak.com/',
    notes: 'One of the strongest night-ski and learn-to-ski operations in New England, with exceptional snowmaking depth.',
    tags: ['Night skiing', 'Family-owned', 'Race leagues']
  },
  {
    id: 'ragged',
    name: 'Ragged Mountain',
    state: 'NH',
    region: 'New England',
    owner: 'Corporate',
    pass: 'Indy',
    vertical: 1250,
    trails: 57,
    lifts: 6,
    acres: 250,
    snowfall: 120,
    snowmaking: 90,
    night: false,
    longestRun: 2.0,
    lat: 43.4830,
    lon: -71.8430,
    difficulty: { beginner: 0.20, intermediate: 0.46, advanced: 0.24, expert: 0.10 },
    liftsBreakdown: [['High-speed six', 1], ['Quad', 2], ['Double', 1], ['Surface', 2]],
    charm: 74,
    localVibe: 76,
    webcam: 'https://placehold.co/1200x675/png?text=Ragged+Cam',
    website: 'https://www.raggedmountainresort.com/',
    notes: 'Modern uphill with a small-mountain footprint and good intermediate flow.',
    tags: ['Fast lift', 'Indy', 'Intermediate cruiser']
  },
  {
    id: 'wachusett',
    name: 'Wachusett',
    state: 'MA',
    region: 'New England',
    owner: 'Independent',
    pass: 'Independent',
    vertical: 1000,
    trails: 27,
    lifts: 8,
    acres: 110,
    snowfall: 72,
    snowmaking: 100,
    night: true,
    longestRun: 2.0,
    lat: 42.4884,
    lon: -71.8863,
    difficulty: { beginner: 0.25, intermediate: 0.50, advanced: 0.20, expert: 0.05 },
    liftsBreakdown: [['High-speed quad', 2], ['Triple', 2], ['Surface', 4]],
    charm: 77,
    localVibe: 84,
    webcam: 'https://placehold.co/1200x675/png?text=Wachusett+Cam',
    website: 'https://www.wachusett.com/',
    notes: 'Massachusetts volume leader with elite convenience, dependable snowmaking, and huge after-work appeal.',
    tags: ['Night skiing', 'High volume', 'Near Boston']
  }
];

const state = {
  search: '',
  region: 'All',
  pass: 'All',
  sortBy: 'score',
  nightOnly: false,
  selectedId: 'black-nh'
};

const els = {
  resortList: document.getElementById('resortList'),
  selectedResort: document.getElementById('selectedResort'),
  resultCount: document.getElementById('resultCount'),
  regionFilter: document.getElementById('regionFilter'),
  passFilter: document.getElementById('passFilter'),
  sortBy: document.getElementById('sortBy'),
  searchInput: document.getElementById('searchInput'),
  toggleNight: document.getElementById('toggleNight'),
  randomResort: document.getElementById('randomResort'),
  summaryCards: document.getElementById('summaryCards'),
  rankings: document.getElementById('rankings')
};

let map;
let markersLayer;
const forecastCache = new Map();

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function computeSmallMountainScore(resort) {
  const verticalTarget = resort.vertical <= 1600 ? 100 - Math.abs(1100 - resort.vertical) / 8 : 58;
  const verticalScore = clamp(verticalTarget, 35, 100);
  const nightScore = resort.night ? 100 : 40;
  const snowmakingScore = resort.snowmaking;
  const charmScore = resort.charm;
  const vibeScore = resort.localVibe;
  const passScore = resort.pass === 'Indy' ? 100 : resort.pass === 'Independent' ? 78 : 68;

  return Math.round(
    verticalScore * 0.20 +
    nightScore * 0.18 +
    snowmakingScore * 0.16 +
    charmScore * 0.18 +
    vibeScore * 0.18 +
    passScore * 0.10
  );
}

function computeExperienceScore(resort) {
  const vertical = clamp((Math.min(resort.vertical, 1800) / 1800) * 100, 0, 100);
  const trails = clamp((resort.trails / 60) * 100, 0, 100);
  const snowfall = clamp((Math.min(resort.snowfall, 220) / 220) * 100, 0, 100);
  const liftStrength = clamp((Math.min(resort.lifts, 10) / 10) * 100, 0, 100);
  const terrainVariety = 100 - Math.abs(resort.difficulty.beginner - resort.difficulty.intermediate) * 100;

  return Math.round(
    vertical * 0.28 +
    trails * 0.20 +
    snowfall * 0.18 +
    liftStrength * 0.18 +
    terrainVariety * 0.16
  );
}

function uniqueValues(key) {
  return ['All', ...new Set(RESORTS.map(r => r[key]).filter(Boolean))];
}

function populateFilters() {
  els.regionFilter.innerHTML = uniqueValues('region').map(v => `<option value="${v}">${v}</option>`).join('');
  els.passFilter.innerHTML = uniqueValues('pass').map(v => `<option value="${v}">${v}</option>`).join('');
}

function decorateResort(resort) {
  return {
    ...resort,
    score: computeSmallMountainScore(resort),
    experienceScore: computeExperienceScore(resort)
  };
}

function getFilteredResorts() {
  return RESORTS
    .map(decorateResort)
    .filter(resort => {
      const q = state.search.trim().toLowerCase();
      const haystack = [
        resort.name,
        resort.state,
        resort.region,
        resort.owner,
        resort.pass,
        resort.notes,
        ...(resort.tags || [])
      ].join(' ').toLowerCase();

      return (!q || haystack.includes(q)) &&
        (state.region === 'All' || resort.region === state.region) &&
        (state.pass === 'All' || resort.pass === state.pass) &&
        (!state.nightOnly || resort.night);
    })
    .sort((a, b) => (b[state.sortBy] || 0) - (a[state.sortBy] || 0) || a.name.localeCompare(b.name));
}

function renderSummaryCards(resorts) {
  const avgScore = resorts.length ? Math.round(resorts.reduce((sum, r) => sum + r.score, 0) / resorts.length) : 0;
  const nightCount = resorts.filter(r => r.night).length;
  const indyCount = resorts.filter(r => r.pass === 'Indy').length;
  const avgVertical = resorts.length ? Math.round(resorts.reduce((sum, r) => sum + r.vertical, 0) / resorts.length) : 0;
  const highestSnow = resorts.length ? resorts.reduce((max, r) => r.snowfall > max.snowfall ? r : max, resorts[0]) : null;

  els.summaryCards.innerHTML = [
    ['Resorts', resorts.length],
    ['Avg Score', avgScore],
    ['Night Skiing', nightCount],
    ['Avg Vertical', `${avgVertical} ft`],
    ['Indy Resorts', indyCount],
    ['Snow Leader', highestSnow ? highestSnow.name : '—']
  ].map(([label, value]) => `
    <div class="stat">
      <div class="stat-label">${label}</div>
      <div class="stat-value">${value}</div>
    </div>
  `).join('');
}

function renderResortList(resorts) {
  els.resultCount.textContent = `${resorts.length} resort${resorts.length === 1 ? '' : 's'}`;

  if (!resorts.length) {
    els.resortList.innerHTML = `<div class="empty">No resorts match these filters.</div>`;
    els.selectedResort.innerHTML = `<div class="card panel empty">Try clearing a filter or search.</div>`;
    els.rankings.innerHTML = '';
    renderMap([]);
    return;
  }

  if (!resorts.find(r => r.id === state.selectedId)) {
    state.selectedId = resorts[0].id;
  }

  els.resortList.innerHTML = resorts.map(resort => `
    <div class="resort-item ${resort.id === state.selectedId ? 'active' : ''}" data-id="${resort.id}">
      <div class="resort-top">
        <div>
          <strong>${resort.name}</strong>
          <div class="muted">${resort.state} · ${resort.region}</div>
        </div>
        <div class="badge">${resort.score}</div>
      </div>
      <div class="meta-row">
        <span class="tag">${resort.vertical} ft</span>
        <span class="tag">${resort.trails} trails</span>
        <span class="tag">${resort.pass}</span>
        ${resort.night ? '<span class="tag">Night</span>' : ''}
      </div>
      <div class="badge-row" style="margin-top:10px;">
        ${(resort.tags || []).slice(0, 3).map(tag => `<span class="badge">${tag}</span>`).join('')}
      </div>
    </div>
  `).join('');

  [...els.resortList.querySelectorAll('.resort-item')].forEach(item => {
    item.addEventListener('click', () => {
      state.selectedId = item.dataset.id;
      render();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });

  const selected = resorts.find(r => r.id === state.selectedId);
  renderSelectedResort(selected);
  renderRankings(resorts);
  renderMap(resorts);
}

function percentage(value) {
  return `${Math.round(value * 100)}%`;
}

function renderBars(difficulty) {
  return [
    ['Beginner', difficulty.beginner],
    ['Intermediate', difficulty.intermediate],
    ['Advanced', difficulty.advanced],
    ['Expert', difficulty.expert]
  ].map(([label, value]) => `
    <div class="bar-row">
      <div>${label}</div>
      <div class="bar"><div class="bar-fill" style="width:${value * 100}%"></div></div>
      <div class="muted">${percentage(value)}</div>
    </div>
  `).join('');
}

function renderSelectedResort(resort) {
  if (!resort) return;

  els.selectedResort.innerHTML = `
    <div class="card headline-card">
      <div class="headline-top">
        <div>
          <div class="eyebrow">Selected Resort</div>
          <h3>${resort.name}</h3>
          <div class="muted">${resort.state} · ${resort.owner} · ${resort.pass} pass</div>
        </div>
        <div class="score-pill">Score ${resort.score}</div>
      </div>
      <div class="metrics-grid">
        <div class="metric-card"><div class="metric-label">Vertical</div><div class="metric-value">${resort.vertical} ft</div></div>
        <div class="metric-card"><div class="metric-label">Trails</div><div class="metric-value">${resort.trails}</div></div>
        <div class="metric-card"><div class="metric-label">Avg Snowfall</div><div class="metric-value">${resort.snowfall} in</div></div>
        <div class="metric-card"><div class="metric-label">Snowmaking</div><div class="metric-value">${resort.snowmaking}%</div></div>
        <div class="metric-card"><div class="metric-label">Lifts</div><div class="metric-value">${resort.lifts}</div></div>
        <div class="metric-card"><div class="metric-label">Acres</div><div class="metric-value">${resort.acres}</div></div>
        <div class="metric-card"><div class="metric-label">Longest Run</div><div class="metric-value">${resort.longestRun} mi</div></div>
        <div class="metric-card"><div class="metric-label">Experience</div><div class="metric-value">${resort.experienceScore}</div></div>
      </div>
    </div>

    <div class="section-grid">
      <div class="terrain-grid">
        <div class="card panel">
          <div class="panel-header">
            <h2>Terrain Mix</h2>
            <div class="muted">By trail share</div>
          </div>
          ${renderBars(resort.difficulty)}
          <table class="mini-table">
            <tr><th>Charm Score</th><td>${resort.charm}</td></tr>
            <tr><th>Local Vibe</th><td>${resort.localVibe}</td></tr>
            <tr><th>Night Skiing</th><td>${resort.night ? 'Yes' : 'No'}</td></tr>
          </table>
        </div>

        <div class="card panel">
          <div class="panel-header">
            <h2>Lift Infrastructure</h2>
            <div class="muted">Simple breakdown</div>
          </div>
          <table class="mini-table">
            <thead><tr><th>Lift Type</th><th>Count</th></tr></thead>
            <tbody>
              ${resort.liftsBreakdown.map(([label, count]) => `<tr><td>${label}</td><td>${count}</td></tr>`).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <div class="card panel">
        <div class="panel-header">
          <h2>Webcam + Resort Notes</h2>
          <div class="muted">Swap placeholder URLs for real cams</div>
        </div>
        <img class="webcam" src="${resort.webcam}" alt="${resort.name} webcam" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';" />
        <div class="empty" style="display:none;">This webcam image could not be loaded.</div>
        <div class="links" style="margin-top:14px;">
          <a href="${resort.website}" target="_blank" rel="noreferrer">Official Site</a>
        </div>
        <div class="footer-note">${resort.notes}</div>
      </div>

      <div class="card panel">
        <div class="panel-header">
          <h2>Snowfall Tracker</h2>
          <div class="status-chip"><span class="status-dot"></span><span id="forecastStatus">Fetching 3-day snow forecast</span></div>
        </div>
        <div class="forecast-grid" id="forecastGrid">
          <div class="forecast-card"><div class="stat-label">Forecast</div><div class="forecast-value">—</div><div class="forecast-sub">Loading...</div></div>
          <div class="forecast-card"><div class="stat-label">Forecast</div><div class="forecast-value">—</div><div class="forecast-sub">Loading...</div></div>
          <div class="forecast-card"><div class="stat-label">Forecast</div><div class="forecast-value">—</div><div class="forecast-sub">Loading...</div></div>
        </div>
        <div class="footer-note">This panel uses the resort latitude/longitude and fetches a client-side snowfall forecast when the page loads on GitHub Pages.</div>
      </div>
    </div>
  `;

  renderForecast(resort);
}

function renderRankings(resorts) {
  const top = resorts.slice(0, 10);
  els.rankings.innerHTML = `
    <div class="rankings-wrap">
      <table class="mini-table">
        <thead>
          <tr><th>#</th><th>Resort</th><th>Score</th><th>Night</th></tr>
        </thead>
        <tbody>
          ${top.map((resort, index) => `
            <tr>
              <td><span class="ranking-badge">${index + 1}</span></td>
              <td><button class="link-button" data-rank-id="${resort.id}">${resort.name}</button></td>
              <td>${resort.score}</td>
              <td>${resort.night ? 'Yes' : 'No'}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;

  [...document.querySelectorAll('[data-rank-id]')].forEach(btn => {
    btn.style.background = 'none';
    btn.style.border = 'none';
    btn.style.color = 'var(--text)';
    btn.style.padding = '0';
    btn.style.font = 'inherit';
    btn.style.cursor = 'pointer';
    btn.addEventListener('click', () => {
      state.selectedId = btn.dataset.rankId;
      render();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });
}

function initMap() {
  if (map) return;
  map = L.map('map', { scrollWheelZoom: false }).setView([43.25, -72.0], 6);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);
  markersLayer = L.layerGroup().addTo(map);
}

function renderMap(resorts) {
  initMap();
  markersLayer.clearLayers();

  if (!resorts.length) return;

  const bounds = [];
  resorts.forEach(resort => {
    const marker = L.circleMarker([resort.lat, resort.lon], {
      radius: resort.id === state.selectedId ? 9 : 6,
      weight: 2,
      color: resort.id === state.selectedId ? '#82e0c5' : '#79b8ff',
      fillColor: resort.id === state.selectedId ? '#82e0c5' : '#79b8ff',
      fillOpacity: 0.7
    }).addTo(markersLayer);

    marker.bindPopup(`<strong>${resort.name}</strong><br>${resort.state}<br>Score ${resort.score}`);
    marker.on('click', () => {
      state.selectedId = resort.id;
      render();
    });
    bounds.push([resort.lat, resort.lon]);
  });

  if (bounds.length === 1) {
    map.setView(bounds[0], 8);
  } else {
    map.fitBounds(bounds, { padding: [20, 20] });
  }
}

async function fetchForecast(resort) {
  if (forecastCache.has(resort.id)) return forecastCache.get(resort.id);

  const today = new Date();
  const end = new Date(today);
  end.setDate(today.getDate() + 2);
  const fmt = d => d.toISOString().slice(0, 10);
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${resort.lat}&longitude=${resort.lon}&daily=snowfall_sum,temperature_2m_max,temperature_2m_min&temperature_unit=fahrenheit&precipitation_unit=inch&timezone=auto&start_date=${fmt(today)}&end_date=${fmt(end)}`;

  const response = await fetch(url);
  if (!response.ok) throw new Error('Forecast request failed');
  const data = await response.json();
  forecastCache.set(resort.id, data);
  return data;
}

async function renderForecast(resort) {
  const grid = document.getElementById('forecastGrid');
  const status = document.getElementById('forecastStatus');
  if (!grid || !status) return;

  try {
    status.textContent = `Fetching forecast for ${resort.name}`;
    const data = await fetchForecast(resort);
    const daily = data.daily;
    grid.innerHTML = daily.time.map((date, index) => {
      const d = new Date(`${date}T12:00:00`);
      const label = d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
      const snow = Number(daily.snowfall_sum[index] || 0).toFixed(1);
      const hi = Math.round(daily.temperature_2m_max[index]);
      const lo = Math.round(daily.temperature_2m_min[index]);
      return `
        <div class="forecast-card">
          <div class="stat-label">${label}</div>
          <div class="forecast-value">${snow}\"</div>
          <div class="forecast-sub">Snow forecast</div>
          <div class="forecast-sub">${hi}° / ${lo}° F</div>
        </div>
      `;
    }).join('');
    status.textContent = `3-day forecast loaded via Open-Meteo`;
  } catch (error) {
    grid.innerHTML = `
      <div class="empty" style="grid-column:1 / -1;">Could not load forecast. The rest of the dashboard still works.</div>
    `;
    status.textContent = `Forecast unavailable right now`;
  }
}

function render() {
  const resorts = getFilteredResorts();
  renderSummaryCards(resorts);
  renderResortList(resorts);
}

function wireEvents() {
  els.searchInput.addEventListener('input', e => {
    state.search = e.target.value;
    render();
  });
  els.regionFilter.addEventListener('change', e => {
    state.region = e.target.value;
    render();
  });
  els.passFilter.addEventListener('change', e => {
    state.pass = e.target.value;
    render();
  });
  els.sortBy.addEventListener('change', e => {
    state.sortBy = e.target.value;
    render();
  });
  els.toggleNight.addEventListener('click', () => {
    state.nightOnly = !state.nightOnly;
    els.toggleNight.textContent = state.nightOnly ? 'Showing Night Skiing Only' : 'Night Skiing Only';
    render();
  });
  els.randomResort.addEventListener('click', () => {
    const resorts = getFilteredResorts();
    if (!resorts.length) return;
    const random = resorts[Math.floor(Math.random() * resorts.length)];
    state.selectedId = random.id;
    render();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

populateFilters();
wireEvents();
render();
