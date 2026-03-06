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

const state = {
  search: '',
  pass: 'All',
  sortBy: 'score',
  nightOnly: false,
  selectedId: 'black-nh',
  weights: { ...DEFAULT_WEIGHTS }
};

const els = {
  summaryCards: document.getElementById('summaryCards'),
  searchInput: document.getElementById('searchInput'),
  passFilter: document.getElementById('passFilter'),
  sortBy: document.getElementById('sortBy'),
  toggleNight: document.getElementById('toggleNight'),
  randomResort: document.getElementById('randomResort'),
  resortList: document.getElementById('resortList'),
  resultCount: document.getElementById('resultCount'),
  selectedResort: document.getElementById('selectedResort'),
  rankings: document.getElementById('rankings'),
  resortMap: document.getElementById('resortMap'),
  weightControls: document.getElementById('weightControls'),
  weightsTotal: document.getElementById('weightsTotal'),
  resetWeights: document.getElementById('resetWeights')
};

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function computeScore(resort) {
  const verticalScore = clamp((Math.min(resort.vertical, 1800) / 1800) * 100, 0, 100);
  const trailsScore = clamp((Math.min(resort.trails, 70) / 70) * 100, 0, 100);
  const snowfallScore = clamp((Math.min(resort.snowfall, 250) / 250) * 100, 0, 100);
  const snowmakingScore = resort.snowmaking;
  const nightScore = resort.night ? 100 : 0;
  const charmScore = resort.charm;
  const vibeScore = resort.localVibe;

  const factors = {
    vertical: verticalScore,
    trails: trailsScore,
    snowfall: snowfallScore,
    snowmaking: snowmakingScore,
    night: nightScore,
    charm: charmScore,
    vibe: vibeScore
  };

  const totalWeight = Object.values(state.weights).reduce((sum, v) => sum + v, 0) || 1;
  const weightedSum = Object.entries(factors).reduce((sum, [key, value]) => sum + value * (state.weights[key] || 0), 0);
  return Math.round(weightedSum / totalWeight);
}

function computeExperienceScore(resort) {
  const vertical = clamp((Math.min(resort.vertical, 1800) / 1800) * 100, 0, 100);
  const trails = clamp((Math.min(resort.trails, 70) / 70) * 100, 0, 100);
  const snowfall = clamp((Math.min(resort.snowfall, 250) / 250) * 100, 0, 100);
  const liftStrength = clamp((Math.min(resort.lifts, 12) / 12) * 100, 0, 100);
  const terrainVariety = 100 - Math.abs(resort.difficulty.beginner - resort.difficulty.intermediate) * 100;
  return Math.round(vertical * 0.28 + trails * 0.20 + snowfall * 0.18 + liftStrength * 0.18 + terrainVariety * 0.16);
}

function decorate(resort) {
  return { ...resort, score: computeScore(resort), experienceScore: computeExperienceScore(resort) };
}

function uniquePasses() {
  return ['All', ...new Set(RESORTS.map(r => r.pass))];
}

function filteredResorts() {
  return RESORTS
    .map(decorate)
    .filter((resort) => {
      const q = state.search.trim().toLowerCase();
      const haystack = [resort.name, resort.state, resort.pass, resort.owner, resort.notes, ...(resort.tags || [])].join(' ').toLowerCase();
      return (!q || haystack.includes(q)) && (state.pass === 'All' || resort.pass === state.pass) && (!state.nightOnly || resort.night);
    })
    .sort((a, b) => (b[state.sortBy] || 0) - (a[state.sortBy] || 0) || a.name.localeCompare(b.name));
}

function percent(x) {
  return `${Math.round(x * 100)}%`;
}

function renderSummaryCards(resorts) {
  const avgScore = resorts.length ? Math.round(resorts.reduce((sum, r) => sum + r.score, 0) / resorts.length) : 0;
  const avgVertical = resorts.length ? Math.round(resorts.reduce((sum, r) => sum + r.vertical, 0) / resorts.length) : 0;
  const nightCount = resorts.filter(r => r.night).length;
  const top = resorts[0]?.name || '—';
  els.summaryCards.innerHTML = [
    ['Resorts', resorts.length],
    ['Avg Score', avgScore],
    ['Avg Vertical', `${avgVertical} ft`],
    ['Night Skiing', nightCount],
    ['Top Ranked', top],
    ['Weight Total', `${Object.values(state.weights).reduce((a, b) => a + b, 0)}%`]
  ].map(([label, value]) => `<div class="stat-card"><div class="stat-label">${label}</div><div class="stat-value">${value}</div></div>`).join('');
}

function renderResortList(resorts) {
  els.resultCount.textContent = `${resorts.length} resort${resorts.length === 1 ? '' : 's'}`;
  if (!resorts.length) {
    els.resortList.innerHTML = '<div class="empty-state">No resorts match these filters.</div>';
    els.selectedResort.innerHTML = '<div class="card panel empty-state">Try changing your search or filters.</div>';
    els.rankings.innerHTML = '';
    els.resortMap.innerHTML = '<div class="empty-state">No map points to show.</div>';
    return;
  }
  if (!resorts.find(r => r.id === state.selectedId)) state.selectedId = resorts[0].id;
  els.resortList.innerHTML = resorts.map((resort) => `
    <div class="resort-item ${resort.id === state.selectedId ? 'active' : ''}" data-id="${resort.id}">
      <div class="resort-top">
        <div><strong>${resort.name}</strong><div class="muted small">${resort.state} · ${resort.owner}</div></div>
        <span class="score-pill">${resort.score}</span>
      </div>
      <div class="chip-row">
        <span class="chip">${resort.vertical} ft</span>
        <span class="chip">${resort.trails} trails</span>
        <span class="chip">${resort.pass}</span>
        ${resort.night ? '<span class="chip good">Night</span>' : ''}
      </div>
    </div>`).join('');

  [...els.resortList.querySelectorAll('.resort-item')].forEach((item) => {
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

function renderTerrainBars(difficulty) {
  return [
    ['Beginner', difficulty.beginner],
    ['Intermediate', difficulty.intermediate],
    ['Advanced', difficulty.advanced],
    ['Expert', difficulty.expert]
  ].map(([label, value]) => `
    <div class="bar-row">
      <div>${label}</div>
      <div class="bar"><div class="bar-fill" style="width:${value * 100}%"></div></div>
      <div class="muted small">${percent(value)}</div>
    </div>`).join('');
}

function renderMediaBox(title, imageUrl, pageUrl, buttonText) {
  const media = imageUrl
    ? `<img src="${imageUrl}" alt="${title}" onerror="this.style.display='none'; this.parentElement.querySelector('.placeholder').style.display='grid';" /><div class="placeholder" style="display:none;">Image could not be loaded.</div>`
    : `<div class="placeholder">No direct image URL yet.<br>Add one in <code>resorts.js</code>.</div>`;
  const link = pageUrl ? `<div class="link-row"><a href="${pageUrl}" target="_blank" rel="noreferrer">${buttonText}</a></div>` : '';
  return `<div class="media-box">${media}<div class="media-caption"><div class="stat-label">${title}</div>${link}</div></div>`;
}

function renderSelectedResort(resort) {
  els.selectedResort.innerHTML = `
    <section class="card headline-card">
      <div class="headline-top">
        <div class="headline">
          <div class="eyebrow">Selected Resort</div>
          <h2>${resort.name}</h2>
          <p class="muted">${resort.state} · ${resort.pass} pass · ${resort.owner}</p>
        </div>
        <div class="score-pill">Custom Score ${resort.score}</div>
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
            <tr><td>Night Skiing</td><td>${resort.night ? 'Yes' : 'No'}</td></tr>
            <tr><td>Charm</td><td>${resort.charm}</td></tr>
            <tr><td>Local Vibe</td><td>${resort.localVibe}</td></tr>
          </tbody>
        </table>
        <div class="footer-note">${resort.notes}</div>
      </div>

      <div class="media-grid">
        ${renderMediaBox(`${resort.name} Webcam`, resort.webcamImage, resort.webcamPage || resort.website, 'Open webcam page')}
        ${renderMediaBox(`${resort.name} Trail Map`, resort.trailMapImage, resort.trailMapPage || resort.website, 'Open trail map page')}
      </div>
    </section>
  `;
}

function renderRankings(resorts) {
  els.rankings.innerHTML = `
    <table class="mini-table">
      <thead><tr><th>#</th><th>Resort</th><th>Score</th><th>Night</th></tr></thead>
      <tbody>
        ${resorts.slice(0, 10).map((resort, index) => `
          <tr>
            <td>${index + 1}</td>
            <td><button class="ranking-button" data-id="${resort.id}">${resort.name}</button></td>
            <td>${resort.score}</td>
            <td>${resort.night ? 'Yes' : 'No'}</td>
          </tr>`).join('')}
      </tbody>
    </table>`;
  [...document.querySelectorAll('.ranking-button')].forEach((btn) => {
    btn.addEventListener('click', () => {
      state.selectedId = btn.dataset.id;
      render();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });
}

function renderMap(resorts) {
  if (!resorts.length) return;
  const latMin = Math.min(...resorts.map(r => r.lat));
  const latMax = Math.max(...resorts.map(r => r.lat));
  const lonMin = Math.min(...resorts.map(r => r.lon));
  const lonMax = Math.max(...resorts.map(r => r.lon));
  const width = 760;
  const height = 470;
  const pad = 40;
  const projectX = (lon) => pad + ((lon - lonMin) / (lonMax - lonMin || 1)) * (width - pad * 2);
  const projectY = (lat) => height - pad - ((lat - latMin) / (latMax - latMin || 1)) * (height - pad * 2);

  const svg = `
    <svg viewBox="0 0 ${width} ${height}" role="img" aria-label="New England ski resort map">
      <rect x="0" y="0" width="${width}" height="${height}" rx="18" fill="rgba(255,255,255,0.02)"></rect>
      <text x="28" y="36" class="map-label">North</text>
      <text x="28" y="${height - 18}" class="map-label">Approximate New England / Northeast view</text>
      ${resorts.map((resort) => {
        const x = projectX(resort.lon);
        const y = projectY(resort.lat);
        const r = resort.id === state.selectedId ? 9 : 6;
        const fill = resort.id === state.selectedId ? '#84e1c6' : '#7fb6ff';
        return `
          <g class="map-point" data-id="${resort.id}">
            <circle cx="${x}" cy="${y}" r="${r}" fill="${fill}" stroke="#0b1220" stroke-width="2"></circle>
            <text x="${x + 10}" y="${y - 10}" class="map-label">${resort.name}</text>
          </g>`;
      }).join('')}
    </svg>`;
  els.resortMap.innerHTML = svg;
  [...els.resortMap.querySelectorAll('.map-point')].forEach((point) => {
    point.addEventListener('click', () => {
      state.selectedId = point.dataset.id;
      render();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });
}

function renderWeightControls() {
  const labels = {
    vertical: 'Vertical', trails: 'Trails', snowfall: 'Snowfall', snowmaking: 'Snowmaking', night: 'Night Skiing', charm: 'Charm', vibe: 'Local Vibe'
  };
  els.weightControls.innerHTML = Object.entries(labels).map(([key, label]) => `
    <div class="sub-card weight-card">
      <label for="weight-${key}"><span>${label}</span><span id="value-${key}" class="weight-value">${state.weights[key]}%</span></label>
      <input id="weight-${key}" type="range" min="0" max="40" step="1" value="${state.weights[key]}" data-weight-key="${key}" />
    </div>`).join('');
  els.weightsTotal.textContent = `${Object.values(state.weights).reduce((a, b) => a + b, 0)}%`;

  [...document.querySelectorAll('[data-weight-key]')].forEach((slider) => {
    slider.addEventListener('input', () => {
      const key = slider.dataset.weightKey;
      state.weights[key] = Number(slider.value);
      document.getElementById(`value-${key}`).textContent = `${slider.value}%`;
      els.weightsTotal.textContent = `${Object.values(state.weights).reduce((a, b) => a + b, 0)}%`;
      render();
    });
  });
}

function wireEvents() {
  els.searchInput.addEventListener('input', (e) => { state.search = e.target.value; render(); });
  els.passFilter.addEventListener('change', (e) => { state.pass = e.target.value; render(); });
  els.sortBy.addEventListener('change', (e) => { state.sortBy = e.target.value; render(); });
  els.toggleNight.addEventListener('click', () => {
    state.nightOnly = !state.nightOnly;
    els.toggleNight.textContent = state.nightOnly ? 'Showing Night Skiing Only' : 'Night Skiing Only';
    render();
  });
  els.randomResort.addEventListener('click', () => {
    const resorts = filteredResorts();
    if (!resorts.length) return;
    state.selectedId = resorts[Math.floor(Math.random() * resorts.length)].id;
    render();
  });
  els.resetWeights.addEventListener('click', () => {
    state.weights = { ...DEFAULT_WEIGHTS };
    render();
  });
}

function initialize() {
  els.passFilter.innerHTML = uniquePasses().map((pass) => `<option value="${pass}">${pass}</option>`).join('');
  wireEvents();
  render();
}

function render() {
  const resorts = filteredResorts();
  renderSummaryCards(resorts);
  renderWeightControls();
  renderResortList(resorts);
}

initialize();
