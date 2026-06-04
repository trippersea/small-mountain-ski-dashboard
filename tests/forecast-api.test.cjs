const { describe, it, beforeEach } = require('node:test');
const assert = require('node:assert/strict');
const {
  resolveForecasts,
  isValidForecastPayload,
  _resetForTests,
} = require('../lib/open-meteo-forecast-server.js');

const SAMPLE = {
  current: {
    temperature_2m: 28,
    weathercode: 3,
    windspeed_10m: 12,
    relativehumidity_2m: 55,
  },
  daily: {
    time: ['2026-06-01', '2026-06-02', '2026-06-03'],
    weathercode: [3, 61, 3],
    temperature_2m_max: [35, 32, 34],
    temperature_2m_min: [18, 20, 19],
    snowfall_sum: [0, 2.5, 0],
    windspeed_10m_max: [15, 22, 14],
  },
};

describe('open-meteo-forecast-server', () => {
  beforeEach(() => _resetForTests());

  it('validates forecast payload shape', () => {
    assert.equal(isValidForecastPayload(SAMPLE), true);
    assert.equal(isValidForecastPayload({}), false);
  });

  it('caches resolved forecasts on second call', async () => {
    const originalFetch = global.fetch;
    let calls = 0;
    global.fetch = async () => {
      calls += 1;
      return {
        ok: true,
        status: 200,
        headers: { get: () => null },
        json: async () => SAMPLE,
      };
    };

    const resorts = [{ id: 'test-mtn', lat: 42.2, lon: -71.1 }];
    const a = await resolveForecasts(resorts, '2026-06-02');
    assert.ok(a.forecasts['test-mtn']);
    assert.equal(a.cachedIds.length, 0);

    const b = await resolveForecasts(resorts, '2026-06-02');
    assert.equal(b.cachedIds.length, 1);
    assert.equal(calls, 1);

    global.fetch = originalFetch;
  });
});
