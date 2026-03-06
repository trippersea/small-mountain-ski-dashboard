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
    difficulty: { beginner: 0.20, intermediate: 0.45, advanced: 0.25, expert: 0.10 },
    liftsBreakdown: [['Double', 3], ['Triple', 1], ['Surface', 1]],
    charm: 96,
    localVibe: 94,
    webcam: 'https://placehold.co/1200x675/png?text=Black+Mountain+Cam',
    website: 'https://www.blackmt.com/',
    notes: 'Classic New Hampshire small-mountain feel with strong historic character.',
    tags: ['Historic', 'Classic doubles', 'Indy favorite']
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
    difficulty: { beginner: 0.14, intermediate: 0.32, advanced: 0.34, expert: 0.20 },
    liftsBreakdown: [['Quad', 1], ['Double', 3], ['Surface', 1]],
    charm: 98,
    localVibe: 99,
    webcam: 'https://placehold.co/1200x675/png?text=Magic+Mountain+Cam',
    website: 'https://magicmtn.com/',
    notes: 'Cult-favorite Vermont mountain with soul, steeper terrain, and extremely high vibe scores.',
    tags: ['Soul skiing', 'Steeps', 'Indy legend']
  }
];

const state = {
  search: '',
  region: 'All',
  pass: 'All',
  sortBy: 'score',
  nightOnly: false,
  selectedId: RESORTS[0].id
};

const els = {
  resortList: document.getElementById('resortList'),
  dashboard: document.getElementById('dashboard'),
  resultCount: document.getElementById('resultCount'),
  regionFilter: document.getElementById('regionFilter'),
  passFilter: document.getElementById('passFilter'),
  sortBy: document.getElementById('sortBy'),
  searchInput: document.getElementById('searchInput'),
  toggleNight: document.getElementById('toggleNight'),
  randomResort: document.getElementById('randomResort'),
  summaryCards: document.getElementById('summaryCards')
};

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function computeSmallMountainScore(resort) {
  const verticalScore = clamp((1500 - Math.abs(1100 - resort.vertical)) / 15, 35, 100);
  const nightScore = resort.night ? 100 : 40;
  const snowmakingScore = resort.snowmaking;
  const charmScore = resort.charm;
  const vibeScore = resort.localVibe;
  const passScore = resort.pass === 'Indy' ? 100 : resort.pass === 'Independent' ? 78 : 65;

  return Math.round(
    verticalScore * 0.20 +
    nightScore * 0.18 +
    snowmakingScore * 0.14 +
    charmScore * 0.20 +
    vibeScore * 0.18 +
    passScore * 0.10
  );
}

function computeExperienceScore(resort) {
  const vertical = clamp((resort.vertical / 1500) * 100, 0, 100);
  const trails = clamp((resort.trails / 60) * 100, 0, 100);
  const snowfall = clamp((resort.snowfall / 180) * 100, 0, 100);
  const liftStrength = clamp((resort.lifts / 10) * 100, 0, 100);
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
  const regionOptions = uniqueValues('region');
  const passOptions = uniqueValues('pass');

  els.regionFilter.innerHTML = regionOptions.map(v => `<option value="${v}">${v}</option>`).join('');
  els.passFilter.innerHTML = passOptions.map(v => `<option value="${v}">${v}</option>`).join('');
}

function getFilteredResorts() {
  return RESORTS
    .map(resort => ({
      ...resort,
      score: computeSmallMountainScore(resort),
      experienceScore: computeExperienceScore(resort)
    }))
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
    .sort((a, b) => {
      const key = state.sortBy;
      return (b[key] || 0) - (a[key] || 0) || a.name.localeCompare(b.name);
    });
}

function renderSummaryCards(resorts) {
  const avgScore = resorts.length ? Math.round(resorts.reduce((sum, r) => sum + r.score, 0) / resorts.length) : 0;
  const nightCount = resorts.filter(r => r.night).length;
  const indyCount = resorts.filter(r => r.pass === 'Indy').length;
  const avgVertical = resorts.length ? Math.round(resorts.reduce((sum, r) => sum + r.vertical, 0) / resorts.length) : 0;

  els.summaryCards.innerHTML = [
    ['Resorts', resorts.length],
    ['Avg Score', avgScore],
    ['Night Skiing', nightCount],
    ['Avg Vertical', `${avgVertical} ft`],
    ['Indy Resorts', indyCount],
    ['Data Source', 'Local JSON']
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
    els.resortList.innerHTML = '<div class="empty">No resorts match these filters.</div>';
    els.dashboard.innerHTML = '<div class="card panel empty">Try clearing a filter or search.</div>';
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
        <span class="tag">${resort.snowmaking}% snowmaking</span>
        <span class="tag">${resort.pass}</span>
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
    });
  });

  renderDashboard(resorts.find(r => r.id === state.selectedId));
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

function renderDashboard(resort) {
  if (!resort) return;

  els.dashboard.innerHTML = `
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
        <div class="metric-card"><div class="metric-label">Snowfall</div><div class="metric-value">${resort.snowfall} in</div></div>
        <div class="metric-card"><div class="metric-label">Snowmaking</div><div class="metric-value">${resort.snowmaking}%</div></div>
        <div class="metric-card"><div class="metric-label">Lifts</div><div class="metric-value">${resort.lifts}</div></div>
        <div class="metric-card"><div class="metric-label">Acres</div><div class="metric-value">${resort.acres}</div></div>
        <div class="metric-card"><div class="metric-label">Longest Run</div><div class="metric-value">${resort.longestRun} mi</div></div>
        <div class="metric-card"><div class="metric-label">Night Skiing</div><div class="metric-value">${resort.night ? 'Yes' : 'No'}</div></div>
      </div>
    </div>

    <div class="section-grid">
      <div class="card panel">
        <div class="panel-header">
          <h2>Terrain Mix</h2>
          <div class="muted">Balanced by trail share</div>
        </div>
        ${renderBars(resort.difficulty)}
        <table class="mini-table">
          <tr><th>Skier Experience Score</th><td>${resort.experienceScore}</td></tr>
          <tr><th>Charm Score</th><td>${resort.charm}</td></tr>
          <tr><th>Local Vibe</th><td>${resort.localVibe}</td></tr>
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
        <h2>Webcam Panel</h2>
        <div class="muted">Replace placeholder images with real static webcam URLs</div>
      </div>
      <img class="webcam" src="${resort.webcam}" alt="${resort.name} webcam"
           onerror="this.style.display='none'; this.nextElementSibling.style.display='block';" />
      <div class="empty" style="display:none;">This webcam image could not be loaded.</div>
      <div class="links">
        <a href="${resort.website}" target="_blank" rel="noreferrer">Official Site</a>
      </div>
      <div class="footer-note">${resort.notes}</div>
    </div>
  `;
}

function render() {
  const resorts = getFilteredResorts();
  renderSummaryCards(resorts);
  renderResortList(resorts);
}

function wireEvents() {
  els.searchInput.addEventListener('input', event => {
    state.search = event.target.value;
    render();
  });

  els.regionFilter.addEventListener('change', event => {
    state.region = event.target.value;
    render();
  });

  els.passFilter.addEventListener('change', event => {
    state.pass = event.target.value;
    render();
  });

  els.sortBy.addEventListener('change', event => {
    state.sortBy = event.target.value;
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
  });
}

populateFilters();
wireEvents();
render();
