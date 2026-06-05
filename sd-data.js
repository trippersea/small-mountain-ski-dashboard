// sd-data.js -- App constants, config, and utilities for WhereToSkiNext.com
// Resort data is now in resorts.js (loaded before this file).
// This file provides HOW_FAR_TIERS, PRICE_RANGES, PASS_PRICES, caches, and helpers.

const HOW_FAR_TIERS = Object.freeze([
  { label: 'Day Trip',       shortLabel: 'Day trip',       floor: 0,   cap: 180,      hint: '≤3h drive'      },
  { label: 'Extended drive (3h+)', shortLabel: 'Extended drive (3h+)', floor: 180, cap: 360, hint: '3–6h drive' },
  { label: 'All',            shortLabel: 'Any distance',   floor: 0,   cap: Infinity, hint: 'any distance'   },
]);

/** User-facing trip/distance label for hero chips, analytics, etc. */
function tripModeShortLabel(howFar) {
  const tier = HOW_FAR_TIERS[howFar];
  return tier ? (tier.shortLabel || tier.label) : String(howFar);
}
const PRICE_RANGES = Object.freeze([
  { label: 'Any price',      min: 0,   max: Infinity },
  { label: 'Under $100',     min: 0,   max: 99       },
  { label: '$100 – $150',    min: 100, max: 150       },
  { label: '$150 – $200',    min: 151, max: 200       },
  { label: '$200+',          min: 201, max: Infinity  },
]);

const PASS_PRICES = Object.freeze({ Indy: 349, Epic: 909, Ikon: 799 });


// Table sort state
let tableSort = { col: 'planner', dir: 'desc' };

// Pre-computed index lists
const UNIQUE_STATES = Object.freeze(['All', ...new Set(RESORTS.map(r => r.state))].sort());
const UNIQUE_PASSES = Object.freeze(['All', 'Epic', 'Ikon', 'Indy', 'Independent']);

/** Human labels for state filter dropdowns (uses resort `region` names). */
const STATE_FILTER_LABELS = Object.freeze(
  UNIQUE_STATES.reduce((acc, code) => {
    if (code === 'All') acc[code] = 'All states';
    else {
      const sample = RESORTS.find(r => r.state === code);
      acc[code] = sample?.region || code;
    }
    return acc;
  }, {}),
);

function stateFilterOptionsHtml() {
  return UNIQUE_STATES.map(code =>
    `<option value="${esc(code)}">${esc(STATE_FILTER_LABELS[code] || code)}</option>`,
  ).join('');
}

// ─── DOM helper ───────────────────────────────────────────────────────────────
const $ = id => document.getElementById(id);

// ─── Safe HTML escaper ────────────────────────────────────────────────────────
const esc = s => String(s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;')
  .replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** Allow only http(s) links in user-facing href attributes */
function safeHttpUrl(url) {
  if (url == null || typeof url !== 'string') return null;
  try {
    const u = new URL(url.trim());
    if (u.protocol !== 'https:' && u.protocol !== 'http:') return null;
    return u.href;
  } catch (e) {
    return null;
  }
}

// ─── Cache maps ───────────────────────────────────────────────────────────────
const historyCache      = new Map();
const verdictWriteupCache = new Map();
const HIST_TTL          = 24 * 60 * 60 * 1000;
const WX_TTL            = 30 * 60 * 1000;
const OSRM_LIMIT        = 60;
const OSRM_CONCURRENCY  = 8;
