#!/usr/bin/env node
// ─────────────────────────────────────────────────────────────────────────────
// add-state-ad.js
// Injects a sponsor ad card between the stats summary and the mountain table
// on state listing pages (ski/{state}/index.html).
//
// HOW TO ADD A STATE AD:
//   1. Add an entry to STATE_ADS in featured-partners.js
//   2. Run: node add-state-ad.js
//   3. Commit and push — Vercel auto-deploys
//
// HOW TO REMOVE:
//   1. Delete the entry from STATE_ADS in featured-partners.js
//   2. Run: node add-state-ad.js (cleans up automatically)
//   3. Commit and push
// ─────────────────────────────────────────────────────────────────────────────

import fs   from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import vm from 'vm';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ─── Load STATE_ADS from featured-partners.js ─────────────────────────────────
function loadStateAds() {
  const ctx = {};
  const code = fs.readFileSync(path.join(__dirname, 'featured-partners.js'), 'utf8');
  vm.runInNewContext(code, ctx);
  return ctx.STATE_ADS || {};
}

const STATE_ADS = loadStateAds();

// ─── CSS injected once per patched page ───────────────────────────────────────
const AD_CSS = `
    /* ── State page sponsor ad ── */
    .state-sponsor-ad {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 14px;
      flex-wrap: wrap;
      padding: 14px 18px;
      margin: 0 0 18px;
      border: 1px solid #bfdbfe;
      border-radius: 12px;
      background: #edf4ff;
    }
    .state-sponsor-copy {
      display: flex;
      flex-direction: column;
      gap: 3px;
    }
    .state-sponsor-label {
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: .08em;
      color: #185FA5;
    }
    .state-sponsor-headline {
      font-size: 14px;
      font-weight: 700;
      color: #0C447C;
    }
    .state-sponsor-tagline {
      font-size: 12px;
      color: #185FA5;
    }
    .state-sponsor-btn {
      background: #2b6de9;
      color: #fff !important;
      font-size: 13px;
      font-weight: 700;
      padding: 9px 20px;
      border-radius: 999px;
      text-decoration: none;
      white-space: nowrap;
      transition: background .12s;
      flex-shrink: 0;
    }
    .state-sponsor-btn:hover { background: #1d5fd4; }`;

// ─── Helper: escape HTML special characters ───────────────────────────────────
function escHtml(s) {
  return String(s || '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// ─── Helper: build the ad card HTML ───────────────────────────────────────────
function buildAdHtml(ad) {
  return `
  <!-- State Sponsor Ad -->
  <div class="state-sponsor-ad">
    <div class="state-sponsor-copy">
      <span class="state-sponsor-label">Sponsored</span>
      <div class="state-sponsor-headline">${escHtml(ad.headline)}</div>
      <div class="state-sponsor-tagline">${escHtml(ad.tagline)}</div>
    </div>
    <a href="${escHtml(ad.ctaUrl)}" class="state-sponsor-btn" target="_blank" rel="noopener noreferrer sponsored">${escHtml(ad.ctaText)}</a>
  </div>`;
}

// ─── Main ─────────────────────────────────────────────────────────────────────
const skiDir = path.join(__dirname, 'ski');
if (!fs.existsSync(skiDir)) {
  console.error('❌  ski/ folder not found. Run from your project root.');
  process.exit(1);
}

let patched = 0, cleared = 0, skipped = 0;

const stateDirs = fs.readdirSync(skiDir, { withFileTypes: true })
  .filter(d => d.isDirectory())
  .map(d => d.name);

for (const stateSlug of stateDirs) {
  const filePath = path.join(skiDir, stateSlug, 'index.html');
  if (!fs.existsSync(filePath)) continue;

  let html = fs.readFileSync(filePath, 'utf8');

  // ── Step 1: Always strip any previously injected ad first ─────────────────
  html = html.replace(/\n?\s*\/\* ── State page sponsor ad ──[\s\S]*?\.state-sponsor-btn:hover \{[^}]*\}\s*/m, '');
  html = html.replace(/\s*<!-- State Sponsor Ad -->[\s\S]*?<\/div>\s*(?=\n|<)/gm, '');

  const ad = STATE_ADS[stateSlug];

  if (!ad) {
    const orig = fs.readFileSync(filePath, 'utf8');
    if (orig !== html) {
      fs.writeFileSync(filePath, html, 'utf8');
      console.log(`  ✓ Cleared: ski/${stateSlug}/index.html`);
      cleared++;
    } else {
      skipped++;
    }
    continue;
  }

  // ── Step 2: Inject CSS before </style> ────────────────────────────────────
  if (!html.includes('state-sponsor-ad')) {
    html = html.replace('</style>', AD_CSS + '\n  </style>');
  }

  // ── Step 3: Inject ad card before the mountain table ──────────────────────
  // The table starts with <table — insert the ad block immediately before it
  const tableMarker = '<table';
  if (html.includes(tableMarker)) {
    html = html.replace(tableMarker, buildAdHtml(ad) + '\n  ' + tableMarker);
    console.log(`  ✓ Patched: ski/${stateSlug}/index.html`);
    patched++;
  } else {
    console.warn(`  ⚠️  Could not find <table in: ski/${stateSlug}/index.html`);
    skipped++;
    continue;
  }

  fs.writeFileSync(filePath, html, 'utf8');
}

console.log(`\n─────────────────────────────────────────────`);
if (Object.keys(STATE_ADS).length === 0) {
  console.log(`ℹ️  No state ads configured. Add entries to STATE_ADS in featured-partners.js.`);
} else {
  console.log(`✅  Done! ${patched} state pages patched, ${cleared} cleared, ${skipped} unchanged.`);
}
console.log(`\nTo add a state ad:`);
console.log(`  1. Add entry to STATE_ADS in featured-partners.js`);
console.log(`  2. Run: node add-state-ad.js`);
console.log(`  3. Commit and push`);
console.log(`\nTo remove a state ad:`);
console.log(`  1. Delete entry from STATE_ADS in featured-partners.js`);
console.log(`  2. Run: node add-state-ad.js  (cleans up automatically)`);
console.log(`  3. Commit and push`);
