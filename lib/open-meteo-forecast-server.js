/**
 * Server-side Open-Meteo forecast fetch + in-memory cache (per serverless instance).
 * Used by /api/forecast — not bundled to the browser.
 */

const OPEN_METEO_FORECAST = 'https://api.open-meteo.com/v1/forecast';
const CACHE_TTL_MS = 30 * 60 * 1000;
const CACHE_MAX_ENTRIES = 4000;
const UPSTREAM_GAP_MS = 280;
const UPSTREAM_RETRY_MS = [600, 1200, 2400, 5000];
const UPSTREAM_TIMEOUT_MS = 14_000;

/** @type {Map<string, { ts: number, data: object }>} */
const _cache = new Map();

/** Serialize upstream calls per instance (Open-Meteo free tier dislikes parallel bursts). */
let _upstreamChain = Promise.resolve();

function forecastQueryString() {
  return [
    'current=temperature_2m,weathercode,windspeed_10m,relativehumidity_2m',
    'daily=weathercode,temperature_2m_max,temperature_2m_min,snowfall_sum,windspeed_10m_max',
    'temperature_unit=fahrenheit',
    'wind_speed_unit=mph',
    'forecast_days=4',
    'timezone=auto',
    'models=best_match',
  ].join('&');
}

function cacheKey(resortId, skiDay) {
  return `${String(skiDay || 'default')}:${String(resortId)}`;
}

function pruneCache() {
  if (_cache.size <= CACHE_MAX_ENTRIES) return;
  const now = Date.now();
  for (const [k, v] of _cache) {
    if (now - v.ts > CACHE_TTL_MS) _cache.delete(k);
  }
  if (_cache.size <= CACHE_MAX_ENTRIES) return;
  const drop = _cache.size - CACHE_MAX_ENTRIES;
  let i = 0;
  for (const k of _cache.keys()) {
    _cache.delete(k);
    if (++i >= drop) break;
  }
}

function getCached(resortId, skiDay) {
  const entry = _cache.get(cacheKey(resortId, skiDay));
  if (!entry || Date.now() - entry.ts > CACHE_TTL_MS) return null;
  return entry.data;
}

function setCached(resortId, skiDay, data) {
  _cache.set(cacheKey(resortId, skiDay), { ts: Date.now(), data });
  pruneCache();
}

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

function isValidForecastPayload(data) {
  return !!data?.current && Array.isArray(data.daily?.time) && data.daily.time.length >= 2;
}

async function fetchOpenMeteoUrl(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), UPSTREAM_TIMEOUT_MS);
  try {
    for (let attempt = 0; attempt <= UPSTREAM_RETRY_MS.length; attempt++) {
      const res = await fetch(url, {
        signal: controller.signal,
        headers: { Accept: 'application/json' },
      });
      if (res.status === 429 || res.status === 502 || res.status === 503) {
        const retryHdr = Number(res.headers.get('retry-after'));
        const wait = Number.isFinite(retryHdr) && retryHdr > 0
          ? retryHdr * 1000
          : (UPSTREAM_RETRY_MS[attempt] ?? 6000);
        if (attempt < UPSTREAM_RETRY_MS.length) {
          await sleep(wait);
          continue;
        }
        return null;
      }
      if (!res.ok) return null;
      const json = await res.json();
      return json;
    }
    return null;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

function buildSingleUrl(lat, lon) {
  return `${OPEN_METEO_FORECAST}?latitude=${lat}&longitude=${lon}&${forecastQueryString()}`;
}

function buildMultiUrl(resorts) {
  const lats = resorts.map(r => r.lat).join(',');
  const lons = resorts.map(r => r.lon).join(',');
  return `${OPEN_METEO_FORECAST}?latitude=${lats}&longitude=${lons}&${forecastQueryString()}`;
}

/**
 * Fetch one resort from Open-Meteo (single-location URL — most reliable).
 * @param {{ id: string, lat: number, lon: number }} resort
 */
async function fetchOneUpstream(resort) {
  const url = buildSingleUrl(resort.lat, resort.lon);
  const json = await fetchOpenMeteoUrl(url);
  if (!json || !isValidForecastPayload(json)) return null;
  return json;
}

/**
 * Try a small multi-location batch; fall back to singles on failure.
 * @param {Array<{ id: string, lat: number, lon: number }>} chunk
 */
async function fetchChunkUpstream(chunk) {
  if (chunk.length === 1) {
    const data = await fetchOneUpstream(chunk[0]);
    return data ? [[chunk[0].id, data]] : [];
  }

  const url = buildMultiUrl(chunk);
  const json = await fetchOpenMeteoUrl(url);
  if (json) {
    const items = Array.isArray(json) ? json : [json];
    if (items.length === chunk.length) {
      const out = [];
      for (let i = 0; i < chunk.length; i++) {
        if (isValidForecastPayload(items[i])) out.push([chunk[i].id, items[i]]);
      }
      if (out.length) return out;
    }
  }

  const out = [];
  for (const r of chunk) {
    const data = await fetchOneUpstream(r);
    if (data) out.push([r.id, data]);
    await sleep(UPSTREAM_GAP_MS);
  }
  return out;
}

function enqueueUpstream(fn) {
  const run = _upstreamChain.then(() => fn());
  _upstreamChain = run.catch(() => {});
  return run;
}

/**
 * Resolve forecasts for resorts (cache + upstream).
 * @param {Array<{ id: string, lat: number, lon: number }>} resorts
 * @param {string} skiDay
 * @param {{ multiBatchSize?: number }} opts
 * @returns {Promise<{ forecasts: Record<string, object|null>, cachedIds: string[], missedIds: string[] }>}
 */
async function resolveForecasts(resorts, skiDay, opts = {}) {
  const multiBatchSize = Math.max(1, Math.min(3, opts.multiBatchSize ?? 2));
  const forecasts = {};
  const cachedIds = [];
  const toFetch = [];

  for (const r of resorts) {
    const hit = getCached(r.id, skiDay);
    if (hit) {
      forecasts[r.id] = hit;
      cachedIds.push(r.id);
    } else {
      toFetch.push(r);
    }
  }

  if (!toFetch.length) {
    return { forecasts, cachedIds, missedIds: [] };
  }

  await enqueueUpstream(async () => {
    for (let i = 0; i < toFetch.length; i += multiBatchSize) {
      const chunk = toFetch.slice(i, i + multiBatchSize);
      const pairs = await fetchChunkUpstream(chunk);
      for (const [id, data] of pairs) {
        setCached(id, skiDay, data);
        forecasts[id] = data;
      }
      if (i + multiBatchSize < toFetch.length) await sleep(UPSTREAM_GAP_MS);
    }
  });

  const missedIds = toFetch.filter(r => !forecasts[r.id]).map(r => r.id);
  for (const id of missedIds) forecasts[id] = null;

  return { forecasts, cachedIds, missedIds };
}

/** Test-only: reset module state. */
function _resetForTests() {
  _cache.clear();
  _upstreamChain = Promise.resolve();
}

module.exports = {
  resolveForecasts,
  isValidForecastPayload,
  forecastQueryString,
  _resetForTests,
  CACHE_TTL_MS,
};
