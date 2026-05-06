// api/weights.js — Serves scoring constants so they never ship in client-side JS.
// Called once per session by loadWeights() in sd-app.js before initialize() runs.
// NOTE: These constants are still visible in DevTools → Network for any determined
// developer. This is a deterrent, not a lock — see obfuscate-scoring.mjs for the
// other half of the protection.

export default function handler(req, res) {
  res.setHeader('Cache-Control', 'public, max-age=3600');
  res.json({
    SCORING: {
      VERTICAL_CEILING:          3500,
      ACRES_CEILING:             4500,
      LONGEST_RUN_CEILING:        5.0,
      SNOW_SCALE:                   8,
      SNOW_AVG_MAX:               669,
      SNOW_FORECAST_WEIGHT:      0.95,
      SNOW_RELIABILITY_WEIGHT:   0.05,
      DRIVE_SCALE:                300,
      DRIVE_DEFAULT:              0.5,
      PRICE_MAX:                  329,
      PRICE_MIN:                   40,
      CROWD_SCALE:                 85,
    },
    SCORE_WEIGHTS: {
      snow:        0.30,
      skiability:  0.20,
      fit:         0.15,
      value:       0.10,
      crowd:       0.10,
      drive:       0.15,
    },
    DEFAULT_WEIGHTS: {
      snow:  1,
      drive: 0,
      size:  0,
      value: 0,
      crowd: 1,
    },
  });
}
