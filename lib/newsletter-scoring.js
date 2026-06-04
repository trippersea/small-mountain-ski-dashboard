/**
 * Newsletter scoring — uses the same sd-scoring.js engine + role logic as the homepage.
 * Editorial regions: state pool + drive anchor origin (matches site trip prefs).
 */
'use strict';

const fs = require('fs');
const vm = require('vm');
const path = require('path');

const ROOT = path.join(__dirname, '..');

/** Five editorial regions. Same pools as the newsletter template, with site-style origins. */
const EDITORIAL_REGIONS = {
  northeast: {
    label: 'Northeast',
    states: ['VT', 'NH', 'ME', 'MA', 'CT', 'RI', 'NY', 'NJ', 'PA'],
    driveAnchor: 'Boston, MA',
    origin: { lat: 42.3601, lon: -71.0589, label: 'Boston, MA' },
    passContextTitle: 'Check Your Pass Logic',
  },
  rockies: {
    label: 'Rockies',
    states: ['CO', 'UT', 'WY', 'MT', 'ID', 'NM'],
    driveAnchor: 'Denver, CO',
    origin: { lat: 39.7392, lon: -104.9903, label: 'Denver, CO' },
    passContextTitle: "Don't Get Stuck on I-70",
  },
  west: {
    label: 'West',
    states: ['CA', 'OR', 'WA', 'NV', 'AZ', 'AK'],
    driveAnchor: 'Los Angeles, CA',
    origin: { lat: 34.0522, lon: -118.2437, label: 'Los Angeles, CA' },
    passContextTitle: 'Pass Holders Take Note',
  },
  southeast: {
    label: 'Southeast',
    states: ['NC', 'TN', 'VA', 'WV', 'MD', 'GA'],
    driveAnchor: 'Charlotte, NC',
    origin: { lat: 35.2271, lon: -80.8431, label: 'Charlotte, NC' },
    passContextTitle: 'Your Starting Point Changes Everything',
  },
  midwest: {
    label: 'Midwest',
    states: ['MI', 'WI', 'MN', 'OH', 'IN', 'IL', 'MO', 'IA', 'SD', 'ND'],
    driveAnchor: 'Milwaukee, WI',
    origin: { lat: 43.0389, lon: -87.9065, label: 'Milwaukee, WI' },
    passContextTitle: 'Not Up for the Drive?',
  },
};

/** Day trip ≤3h, extended 3–6h, any distance. Same caps as sd-data.js HOW_FAR_TIERS. */
const DRIVE_TIER_CAPS = [180, 360, Infinity];

function loadConstFromFile(absPath, exportName) {
  const src = fs.readFileSync(absPath, 'utf8');
  const sandbox = { globalThis: {}, console };
  vm.createContext(sandbox);
  vm.runInContext(`${src}\n;globalThis.__value = (typeof ${exportName} !== 'undefined') ? ${exportName} : null;`, sandbox, { filename: absPath });
  if (!sandbox.globalThis.__value) throw new Error(`Could not load ${exportName} from ${absPath}`);
  return sandbox.globalThis.__value;
}

function loadWeightsFromApi() {
  const absPath = path.join(ROOT, 'api', 'weights.js');
  let src = fs.readFileSync(absPath, 'utf8');
  src = src.replace(/export\s+default\s+function\s+handler/, 'function handler');
  const sandbox = { globalThis: {}, console };
  vm.createContext(sandbox);
  vm.runInContext(`${src}\n;globalThis.__handler = handler;`, sandbox, { filename: absPath });
  const handler = sandbox.globalThis.__handler;
  if (typeof handler !== 'function') throw new Error('weights handler not found');
  let captured = null;
  handler({}, { setHeader: () => {}, json: (obj) => { captured = obj; } });
  if (!captured?.SCORING) throw new Error('weights SCORING payload not captured');
  return captured;
}

function createScoringApi() {
  const { RESORTS } = require(path.join(ROOT, 'resorts.js'));
  const METRO_GRAVITY = loadConstFromFile(path.join(ROOT, 'metro_gravity_final.js'), 'METRO_GRAVITY');
  const LIFT_CAPACITY_TIERS = loadConstFromFile(path.join(ROOT, 'lift_capacity_tiers_final.js'), 'LIFT_CAPACITY_TIERS');
  const __weights = loadWeightsFromApi();
  const W = { SCORING: __weights.SCORING };

  const state = {
    targetDate: null,
    origin: null,
    howFar: 2,
    passFilter: 'All',
    stateFilter: 'All',
    verticalFilter: 'any',
    nightOnly: false,
    tempBucket: 'any',
    windBucket: 'any',
    skiDayPreset: 'saturday',
    weights: { snow: 1, crowd: 1, value: 1, size: 5 },
    weatherCache: {},
    driveCache: {},
  };

  const historyCache = new Map();
  const sandbox = {
    RESORTS,
    METRO_GRAVITY,
    LIFT_CAPACITY_TIERS,
    state,
    W,
    historyCache,
    HIST_TTL: 24 * 60 * 60 * 1000,
    getDriveMins: (id) => {
      const v = state.driveCache[id];
      if (v == null) return null;
      return typeof v === 'object' ? v.mins : v;
    },
    console,
    Math,
    Number,
    Date,
    Object,
    Array,
    JSON,
    parseInt,
    parseFloat,
    isNaN,
    isFinite,
  };

  vm.createContext(sandbox);
  const scoringSrc = fs.readFileSync(path.join(ROOT, 'sd-scoring.js'), 'utf8');
  vm.runInContext(
    scoringSrc + '\n;globalThis.__exports = { crowdForecast, plannerScoreBreakdown, targetForecastIndex, tripWindowSnow, buildRecommendationRolesFromRanked, pickTopPickFromRanked };',
    sandbox,
  );

  return { api: sandbox.__exports, state, historyCache, RESORTS };
}

const scoringRuntime = createScoringApi();

function upcomingSaturdayDate(from = new Date()) {
  const now = new Date(from);
  const day = now.getDay();
  const daysUntilSat = (6 - day + 7) % 7;
  const sat = new Date(now);
  sat.setDate(now.getDate() + daysUntilSat);
  sat.setHours(12, 0, 0, 0);
  return sat;
}

function sanitizeGridDailyTempsF(hi, lo, resort, targetDate) {
  let h = Math.round(Number(hi));
  let l = Math.round(Number(lo));
  if (!Number.isFinite(h)) h = 32;
  if (!Number.isFinite(l)) l = h;
  const lat = resort?.lat ?? 45;
  const ref = targetDate instanceof Date ? targetDate : new Date();
  const springSummer = ref.getMonth() >= 3 && ref.getMonth() <= 9;
  if (springSummer && lat < 52 && l < -10 && h > l + 25) l = Math.min(l, h - 12);
  if (l < -35) l = Math.max(-25, h - 20);
  if (h > 115) h = 115;
  if (l < -30) l = -30;
  return { hi: h, lo: l };
}

function haversineKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2
    + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function haversineToDriveMinutes(km) {
  const roadKm = km * 1.15;
  const speed = roadKm < 40 ? 42 : roadKm < 110 ? 62 : 72;
  return Math.round(roadKm / speed * 60 + 15);
}

function configureRegionState(region, targetDate) {
  const { state } = scoringRuntime;
  state.origin = { ...region.origin };
  state.howFar = 2;
  state.passFilter = 'All';
  state.stateFilter = 'All';
  state.verticalFilter = 'any';
  state.skiDayPreset = 'saturday';
  state.targetDate = targetDate;
  state.weights = { snow: 1, crowd: 1, value: 1, size: 5 };
  state.localIntent = false;
}

function applyDriveEstimates(resorts, origin) {
  const { state } = scoringRuntime;
  state.driveCache = {};
  for (const resort of resorts) {
    const km = haversineKm(origin.lat, origin.lon, resort.lat, resort.lon);
    state.driveCache[resort.id] = { mins: haversineToDriveMinutes(km), estimated: true, km };
  }
}

function resortWithinDriveTier(resortId, howFar) {
  const cap = DRIVE_TIER_CAPS[howFar] ?? Infinity;
  const mins = scoringRuntime.state.driveCache[resortId]?.mins;
  if (mins == null) return true;
  return mins <= cap;
}

function openMeteoDailyToWx(data, resort, targetDate) {
  if (!data?.current || !Array.isArray(data.daily?.time) || data.daily.time.length < 2) return null;
  return {
    temp: Math.round(data.current.temperature_2m),
    code: data.current.weathercode,
    wind: Math.round(data.current.windspeed_10m),
    humidity: data.current.relativehumidity_2m != null
      ? Math.round(data.current.relativehumidity_2m)
      : undefined,
    forecast: data.daily.time.slice(0, 4).map((date, i) => {
      const raw = sanitizeGridDailyTempsF(
        data.daily.temperature_2m_max[i],
        data.daily.temperature_2m_min[i],
        resort,
        targetDate,
      );
      return {
        day: new Date(`${date}T12:00:00`).toLocaleDateString('en-US', { weekday: 'short' }),
        code: data.daily.weathercode[i],
        hi: raw.hi,
        lo: raw.lo,
        snow: Math.round((data.daily.snowfall_sum?.[i] || 0) * 10) / 10,
        wind: Math.round(data.daily.windspeed_10m_max?.[i] || 0),
      };
    }),
  };
}

function displayStatsFromHourly(weather) {
  if (!weather?.hourly?.time) {
    return { newSnow72hIn: 0, forecast48hIn: 0, baseDepthIn: 0 };
  }
  const times = weather.hourly.time;
  const snowfall = weather.hourly.snowfall;
  const snowDepth = weather.hourly.snow_depth;
  const now = Date.now();
  const ms72h = 72 * 3600 * 1000;
  const ms48h = 48 * 3600 * 1000;
  let newSnow72hCm = 0;
  let forecast48hCm = 0;
  let latestDepthM = 0;
  for (let i = 0; i < times.length; i++) {
    const t = new Date(times[i]).getTime();
    const sf = snowfall[i] || 0;
    const sd = snowDepth[i];
    if (t <= now && t > now - ms72h) newSnow72hCm += sf;
    if (t > now && t <= now + ms48h) forecast48hCm += sf;
    if (t <= now && sd != null) latestDepthM = sd;
  }
  const cmToIn = (cm) => Math.round((cm / 2.54) * 10) / 10;
  return {
    newSnow72hIn: cmToIn(newSnow72hCm),
    forecast48hIn: cmToIn(forecast48hCm),
    baseDepthIn: Math.round(latestDepthM * 100 / 2.54),
  };
}

async function fetchResortWeatherBundle(resort, targetDate) {
  const url = new URL('https://api.open-meteo.com/v1/forecast');
  url.searchParams.set('latitude', String(resort.lat));
  url.searchParams.set('longitude', String(resort.lon));
  url.searchParams.set('current', 'temperature_2m,weathercode,windspeed_10m,relativehumidity_2m');
  url.searchParams.set('daily', 'weathercode,temperature_2m_max,temperature_2m_min,snowfall_sum,windspeed_10m_max');
  url.searchParams.set('hourly', 'snowfall,snow_depth');
  url.searchParams.set('past_days', '3');
  url.searchParams.set('forecast_days', '4');
  url.searchParams.set('temperature_unit', 'fahrenheit');
  url.searchParams.set('wind_speed_unit', 'mph');
  url.searchParams.set('timezone', 'auto');
  url.searchParams.set('models', 'best_match');

  const resp = await fetch(url.toString(), { signal: AbortSignal.timeout(8000) });
  if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
  const data = await resp.json();
  const wx = openMeteoDailyToWx(data, resort, targetDate);
  if (!wx) throw new Error('Invalid weather payload');
  return { wx, display: displayStatsFromHourly(data), raw: data };
}

async function fetchWeatherBatch(resorts, targetDate, batchSize = 20) {
  const weatherMap = new Map();
  for (let i = 0; i < resorts.length; i += batchSize) {
    const batch = resorts.slice(i, i + batchSize);
    const settled = await Promise.allSettled(
      batch.map((r) =>
        fetchResortWeatherBundle(r, targetDate)
          .then((bundle) => ({ id: r.id, bundle }))
          .catch((err) => { throw Object.assign(err, { resortName: r.name }); }),
      ),
    );
    for (const result of settled) {
      if (result.status === 'fulfilled') {
        weatherMap.set(result.value.id, result.value.bundle);
      } else {
        console.warn(`Weather failed for ${result.reason?.resortName}: ${result.reason?.message}`);
      }
    }
  }
  return weatherMap;
}

async function fetchHistory(resort) {
  const { historyCache } = scoringRuntime;
  const cached = historyCache.get(resort.id);
  if (cached && Date.now() - cached.ts < 24 * 60 * 60 * 1000) return cached;
  try {
    const end = new Date();
    end.setDate(end.getDate() - 1);
    const start = new Date(end);
    start.setDate(end.getDate() - 6);
    const fmt = (d) => d.toISOString().slice(0, 10);
    const url = `https://archive-api.open-meteo.com/v1/archive?latitude=${resort.lat}&longitude=${resort.lon}`
      + `&start_date=${fmt(start)}&end_date=${fmt(end)}`
      + `&daily=snowfall_sum&timezone=auto`;
    const resp = await fetch(url, { signal: AbortSignal.timeout(10000) });
    if (!resp.ok) return null;
    const data = await resp.json();
    const days = (data.daily?.time || []).map((date, i) => ({
      date,
      snow: Math.round((data.daily.snowfall_sum?.[i] || 0) * 10) / 10,
    }));
    const total = Math.round(days.reduce((s, d) => s + d.snow, 0) * 10) / 10;
    const entry = { total, days, ts: Date.now() };
    historyCache.set(resort.id, entry);
    return entry;
  } catch {
    return null;
  }
}

async function fetchHistoryBatch(resorts, batchSize = 15) {
  for (let i = 0; i < resorts.length; i += batchSize) {
    const batch = resorts.slice(i, i + batchSize);
    await Promise.allSettled(batch.map((r) => fetchHistory(r)));
  }
}

function buildRankedPool(regionResorts, weatherMap) {
  const { api, state, historyCache } = scoringRuntime;
  const fi = api.targetForecastIndex();
  const ranked = [];

  for (const resort of regionResorts) {
    if (!resortWithinDriveTier(resort.id, state.howFar)) continue;
    const bundle = weatherMap.get(resort.id);
    if (!bundle?.wx) continue;
    const history = historyCache.get(resort.id) || null;
    const breakdown = api.plannerScoreBreakdown(resort, bundle.wx, fi);
    ranked.push({
      resort,
      wx: bundle.wx,
      breakdown,
      history,
      display: bundle.display,
    });
  }

  ranked.sort((a, b) => b.breakdown.score - a.breakdown.score);
  return ranked;
}

function buildDisplayScores(entry) {
  const bd = entry.breakdown;
  const display = entry.display || {};
  return {
    total: bd.score,
    newSnow72hIn: display.newSnow72hIn ?? 0,
    forecast48hIn: display.forecast48hIn ?? 0,
    baseDepthIn: display.baseDepthIn ?? 0,
    crowdScore: 0,
    crowdLabel: bd.crowdLabel || 'Moderate',
  };
}

function pickLegacyAlsoSlots(remaining) {
  if (remaining.length === 0) return [];
  const usedNames = new Set();
  const scored = remaining.map((entry) => ({
    resort: entry.resort,
    scores: buildDisplayScores(entry),
  }));

  const also1 = [...scored]
    .sort((a, b) => (b.resort.lifts || 0) - (a.resort.lifts || 0))[0] || null;
  if (also1) usedNames.add(also1.resort.name);

  const remaining2 = scored.filter((x) => !usedNames.has(x.resort.name));
  const allPrices = scored.map((x) => x.resort.price || 80).sort((a, b) => a - b);
  const medianPrice = allPrices[Math.floor(allPrices.length / 2)] || 80;

  const secretPool = remaining2.filter((x) => (x.resort.price || 80) < medianPrice);
  const also2 = (secretPool.length > 0 ? secretPool : remaining2)[0] || null;
  if (also2) usedNames.add(also2.resort.name);

  const remaining3 = scored.filter((x) => !usedNames.has(x.resort.name));
  const q25Price = allPrices[Math.floor(allPrices.length * 0.25)] || 60;
  const radarPool = remaining3.filter((x) => (x.resort.price || 80) <= q25Price && x.scores.total > 15);
  const also3 = (radarPool.length > 0 ? radarPool : remaining3)[0] || null;

  return [
    also1 ? { ...also1, role: 'Best for a Full Day' } : null,
    also2 ? { ...also2, role: 'Best Kept Secret' } : null,
    also3 ? { ...also3, role: 'Under the Radar' } : null,
  ].filter(Boolean);
}

/**
 * Pick + Trap from shared role engine; Also strip fills Smart Play / Local then legacy slots.
 */
function selectNewsletterResorts(ranked, roles) {
  if (!roles?.pick) return { pick: null, trap: null, also: [] };

  const used = new Set();
  const pick = { resort: roles.pick.resort, scores: buildDisplayScores(roles.pick), entry: roles.pick };
  used.add(pick.resort.id);

  let trap = null;
  if (roles.trap && !used.has(roles.trap.resort.id)) {
    trap = { resort: roles.trap.resort, scores: buildDisplayScores(roles.trap), entry: roles.trap };
    used.add(trap.resort.id);
  }

  const also = [];
  const roleAlso = [
    { role: 'Solid Option', entry: roles.sleeper },
    {
      role: roles.local?.roleVariant === 'another_smart_play' ? 'Worth a Look' : 'Best Nearby Option',
      entry: roles.local,
    },
  ];
  for (const slot of roleAlso) {
    if (slot.entry && !used.has(slot.entry.resort.id)) {
      also.push({
        resort: slot.entry.resort,
        scores: buildDisplayScores(slot.entry),
        role: slot.role,
        entry: slot.entry,
      });
      used.add(slot.entry.resort.id);
    }
  }

  const remaining = ranked.filter((e) => !used.has(e.resort.id));
  for (const legacy of pickLegacyAlsoSlots(remaining)) {
    if (also.length >= 3) break;
    if (used.has(legacy.resort.id)) continue;
    also.push(legacy);
    used.add(legacy.resort.id);
  }

  return { pick, trap, also };
}

/**
 * Score one editorial region using homepage engine + role logic.
 */
async function scoreEditorialRegion(region, regionResorts, targetDate = upcomingSaturdayDate()) {
  configureRegionState(region, targetDate);
  applyDriveEstimates(regionResorts, region.origin);

  const pool = regionResorts.filter((r) => r && region.states.includes(r.state));
  const weatherMap = await fetchWeatherBatch(pool, targetDate, 20);
  await fetchHistoryBatch(pool, 15);

  const ranked = buildRankedPool(pool, weatherMap);
  if (ranked.length === 0) return null;

  const roles = scoringRuntime.api.buildRecommendationRolesFromRanked(ranked);
  const selection = selectNewsletterResorts(ranked, roles);

  return {
    ranked,
    roles,
    ...selection,
    engine: 'sd-scoring',
    targetDate: targetDate.toISOString().slice(0, 10),
    origin: region.origin.label,
  };
}

module.exports = {
  EDITORIAL_REGIONS,
  upcomingSaturdayDate,
  scoreEditorialRegion,
  selectNewsletterResorts,
  buildDisplayScores,
  fetchWeatherBatch,
  buildRankedPool,
  /** Exposed for tests. Same runtime as production newsletter. */
  scoringRuntime,
};
