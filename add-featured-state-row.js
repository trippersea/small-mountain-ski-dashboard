#!/usr/bin/env node
// ─────────────────────────────────────────────────────────────────────────────
// add-featured-state-row.js
// Adds a "Featured Partner" pinned row to the top of the mountain table
// on the relevant state pages.
//
// HOW TO ADD A NEW PARTNER:
//   Add an entry to the SPONSORS object below with their resort ID as the key.
//   Run: node add-featured-state-row.js
//   Commit and push — Vercel auto-deploys.
//
// HOW TO REMOVE A PARTNER:
//   Delete their entry from SPONSORS, run the script again.
//   The script cleanly removes any previously injected featured rows first.
//
// Usage:
//   node add-featured-state-row.js
// ─────────────────────────────────────────────────────────────────────────────

import fs   from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ─── SPONSOR CONFIGURATION ────────────────────────────────────────────────────
// Shared config is loaded from featured-partners.js
function loadSponsors() {
  const ctx = {};
  const code = fs.readFileSync(path.join(__dirname, 'featured-partners.js'), 'utf8');
  vm.runInNewContext(code, ctx);
  return ctx.FEATURED_PARTNERS || {};
}

const SPONSORS = loadSponsors();

// ─── CSS injected once per patched page ───────────────────────────────────────
const FEATURED_CSS = `
    /* ── Featured partner row ── */
    tr.featured-partner-row td {
      background: #edf4ff;
      border-bottom: 1px solid #bfdbfe;
    }
    tr.featured-partner-row td:first-child {
      border-left: 3px solid #2b6de9;
    }
    .featured-badge {
      display: inline-block;
      background: #2b6de9;
      color: #fff;
      font-size: 10px;
      font-weight: 700;
      letter-spacing: .04em;
      padding: 2px 7px;
      border-radius: 999px;
      margin-left: 7px;
      vertical-align: middle;
    }
    .featured-booking-link {
      display: inline-block;
      background: #2b6de9;
      color: #fff !important;
      font-size: 12px;
      font-weight: 700;
      padding: 5px 12px;
      border-radius: 999px;
      text-decoration: none;
      white-space: nowrap;
      transition: background .12s;
    }
    .featured-booking-link:hover { background: #1d5fd4; }
    .featured-disclosure {
      font-size: 11px;
      color: #94a3b8;
      margin-top: 6px;
      padding: 0 2px;
    }`;

// ─── Helper: build the featured <tr> HTML for one sponsor ─────────────────────
function buildFeaturedRow(resort, sponsor) {
  const { bookingUrl, tagline } = sponsor;
  return `
        <tr class="featured-partner-row" data-featured-id="${resort.id}">
          <td>
            <a href="/ski-report/${resort.id}/" style="font-weight:700;color:#1a2030;text-decoration:none;">${escHtml(resort.name)}</a>
            <span class="featured-badge">Featured</span>
            ${tagline ? `<div style="font-size:11px;color:#64748b;margin-top:3px;">${escHtml(tagline)}</div>` : ''}
          </td>
          <td>${resort.vertical.toLocaleString()} ft</td>
          <td>${resort.trails}</td>
          <td>${resort.avgSnowfall}"</td>
          <td>$${resort.price}</td>
          <td>${escHtml(passLabel(resort.passGroup))}</td>
          <td>${resort.night ? 'Yes' : 'No'}</td>
          <td><a href="${escHtml(bookingUrl)}" class="featured-booking-link" target="_blank" rel="noopener noreferrer">Book →</a></td>
        </tr>`;
}

function escHtml(s) {
  return String(s || '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function passLabel(pg) {
  return { Epic: 'Epic Pass', Ikon: 'Ikon Pass', Indy: 'Indy Pass', Independent: 'Independent' }[pg] || pg;
}

// ─── Load resort data to look up details by ID ────────────────────────────────
import { createRequire } from 'module';
import vm from 'vm';
const _require = createRequire(import.meta.url);

function loadResorts() {
  const sdData = fs.readFileSync(path.join(__dirname, 'sd-data.js'), 'utf8');
  const neCtx  = {};
  vm.runInNewContext(sdData + '\nglobalThis.__out = RESORTS_NE;', neCtx);
  const resortsNE = neCtx.__out || [];

  let resortsNational = [];
  const nationalPath = path.join(__dirname, 'resorts-national.js');
  if (fs.existsSync(nationalPath)) {
    try {
      const nationalData = fs.readFileSync(nationalPath, 'utf8');
      const natCtx = {};
      vm.runInNewContext(nationalData + '\nglobalThis.__out = RESORTS_NATIONAL;', natCtx);
      resortsNational = natCtx.__out || [];
    } catch (e) {
      console.warn('Warning: could not load resorts-national.js:', e.message);
    }
  }
  return [...resortsNE, ...resortsNational];
}

// ─── Main ─────────────────────────────────────────────────────────────────────
const resorts   = loadResorts();
const resortMap = new Map(resorts.map(r => [r.id, r]));

const skiDir = path.join(__dirname, 'ski');
if (!fs.existsSync(skiDir)) {
  console.error('❌  ski/ folder not found. Run from your project root.');
  process.exit(1);
}

// Build a map of state → sponsor resort(s)
const byState = {};
for (const [resortId, sponsorData] of Object.entries(SPONSORS)) {
  const resort = resortMap.get(resortId);
  if (!resort) {
    console.warn(`  ⚠️  Resort ID not found in data: ${resortId} — skipping`);
    continue;
  }
  if (!byState[resort.state]) byState[resort.state] = [];
  byState[resort.state].push({ resort, sponsor: sponsorData });
}

// Helper to slugify state abbreviations (matches generate-state-pages.mjs)
function slugifyState(abbr) {
  const names = {
    AL:'alabama', AK:'alaska', AZ:'arizona', AR:'arkansas', CA:'california',
    CO:'colorado', CT:'connecticut', DE:'delaware', FL:'florida', GA:'georgia',
    HI:'hawaii', ID:'idaho', IL:'illinois', IN:'indiana', IA:'iowa', KS:'kansas',
    KY:'kentucky', LA:'louisiana', ME:'maine', MD:'maryland', MA:'massachusetts',
    MI:'michigan', MN:'minnesota', MS:'mississippi', MO:'missouri', MT:'montana',
    NE:'nebraska', NV:'nevada', NH:'new-hampshire', NJ:'new-jersey', NM:'new-mexico',
    NY:'new-york', NC:'north-carolina', ND:'north-dakota', OH:'ohio', OK:'oklahoma',
    OR:'oregon', PA:'pennsylvania', RI:'rhode-island', SC:'south-carolina',
    SD:'south-dakota', TN:'tennessee', TX:'texas', UT:'utah', VT:'vermont',
    VA:'virginia', WA:'washington', WV:'west-virginia', WI:'wisconsin', WY:'wyoming',
  };
  return names[abbr] || abbr.toLowerCase().replace(/\s+/g, '-');
}

let patched  = 0;
let cleared  = 0;
let skipped  = 0;

// Process every state folder in ski/
const stateDirs = fs.readdirSync(skiDir, { withFileTypes: true })
  .filter(d => d.isDirectory())
  .map(d => d.name);

for (const stateSlug of stateDirs) {
  const filePath = path.join(skiDir, stateSlug, 'index.html');
  if (!fs.existsSync(filePath)) continue;

  let html = fs.readFileSync(filePath, 'utf8');

  // ── Step 1: Always remove any previously injected featured content ──────────
  // Remove featured CSS block
  html = html.replace(/\n\s*\/\* ── Featured partner row ──[\s\S]*?\.featured-disclosure \{[\s\S]*?\}/m, '');
  // Remove featured rows
  html = html.replace(/<tr class="featured-partner-row"[\s\S]*?<\/tr>/gm, '');
  // Remove disclosure line
  html = html.replace(/<p class="featured-disclosure">[\s\S]*?<\/p>\n?/gm, '');

  // Find which state this folder corresponds to
  const stateAbbr = Object.keys(byState).find(abbr => slugifyState(abbr) === stateSlug);

  if (!stateAbbr || !byState[stateAbbr]?.length) {
    // No active sponsor for this state — save the cleaned version
    const orig = fs.readFileSync(filePath, 'utf8');
    if (orig !== html) {
      fs.writeFileSync(filePath, html, 'utf8');
      console.log(`  ✓ Cleared old featured row: ski/${stateSlug}/index.html`);
      cleared++;
    } else {
      skipped++;
    }
    continue;
  }

  // ── Step 2: Inject CSS before </style> ─────────────────────────────────────
  if (!html.includes('featured-partner-row')) {
    html = html.replace('</style>', FEATURED_CSS + '\n  </style>');
  }

  // ── Step 3: Inject featured row(s) at top of <tbody> ───────────────────────
  const featuredRows = byState[stateAbbr]
    .map(({ resort, sponsor }) => buildFeaturedRow(resort, sponsor))
    .join('');

  html = html.replace('<tbody>', `<tbody>${featuredRows}`);

  // ── Step 4: Add disclosure note below the ticket price disclaimer ───────────
  const disclosure = `<p class="featured-disclosure">Featured mountains are paid partners. Organic rankings are determined by conditions data only. <a href="/partners/" style="color:#94a3b8;">Learn more</a></p>`;
  html = html.replace(
    `*Ticket prices vary by date, demand, and age. Verify with the mountain before purchasing.</p>`,
    `*Ticket prices vary by date, demand, and age. Verify with the mountain before purchasing.</p>\n  ${disclosure}`
  );

  fs.writeFileSync(filePath, html, 'utf8');
  const names = byState[stateAbbr].map(x => x.resort.name).join(', ');
  console.log(`  ✓ Patched: ski/${stateSlug}/index.html  [${names}]`);
  patched++;
}

console.log(`\n─────────────────────────────────────────────`);
if (Object.keys(SPONSORS).length === 0) {
  console.log(`ℹ️  No sponsors configured yet.`);
  console.log(`   Add entries to featured-partners.js,`);
  console.log(`   then run the script again to apply featured rows.`);
} else {
  console.log(`✅  Done! ${patched} state pages patched, ${cleared} cleared, ${skipped} unchanged.`);
}
console.log(`\nTo add a partner:`);
console.log(`  1. Add their resort ID + booking URL to featured-partners.js`);
console.log(`  2. Run: node add-featured-state-row.js`);
console.log(`  3. Commit and push in GitHub Desktop`);
console.log(`\nTo remove a partner:`);
console.log(`  1. Delete their entry from featured-partners.js`);
console.log(`  2. Run: node add-featured-state-row.js  (cleans up automatically)`);
console.log(`  3. Commit and push`);
