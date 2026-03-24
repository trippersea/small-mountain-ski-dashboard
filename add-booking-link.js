#!/usr/bin/env node
// ─────────────────────────────────────────────────────────────────────────────
// add-booking-link.js
// Adds the Featured Partner sidebar (with booking link) to /ski-report/ pages.
//
// HOW TO ADD A PARTNER:
//   Add their resort ID + booking URL to SPONSORS below.
//   Run: node add-booking-link.js
//   Commit and push — Vercel auto-deploys.
//
// HOW TO REMOVE:
//   Delete their entry from SPONSORS, run again — cleans up automatically.
//
// Usage: node add-booking-link.js
// ─────────────────────────────────────────────────────────────────────────────

import fs   from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ─── SPONSOR CONFIGURATION ────────────────────────────────────────────────────
// Must match the SPONSORS object in sd-app.js
const SPONSORS = {
  'ragged-mountain-resort': {
    bookingUrl: 'https://www.raggedmountainresort.com/tickets',
    tagline:    'Indy Pass accepted · Book direct for best rates',
  },
};

// ─── CSS injected once per patched page ───────────────────────────────────────
const SIDEBAR_CSS = `
    /* ── Featured Partner sidebar ── */
    .sponsor-sidebar-block {
      background: #edf4ff;
      border: 1.5px solid #bfdbfe;
      border-radius: 14px;
      padding: 18px 20px;
      margin-bottom: 20px;
    }
    .sponsor-sidebar-lbl {
      font-size: 9px; font-weight: 700; text-transform: uppercase;
      letter-spacing: .1em; color: #2b6de9; margin-bottom: 8px;
    }
    .sponsor-sidebar-name {
      font-size: 15px; font-weight: 800; color: #1b2a3a; margin-bottom: 4px;
    }
    .sponsor-sidebar-tagline {
      font-size: 12px; color: #667a96; margin-bottom: 14px; line-height: 1.55;
    }
    .sponsor-sidebar-btn {
      display: block; text-align: center;
      background: #2b6de9; color: #fff !important;
      font-size: 13px; font-weight: 700;
      padding: 11px; border-radius: 8px;
      text-decoration: none; transition: background .12s;
    }
    .sponsor-sidebar-btn:hover { background: #1d5fd4; }`;

function escHtml(s) {
  return String(s || '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function buildSidebarHtml(resortName, sponsor) {
  return `
      <!-- Featured Partner Sidebar -->
      <div class="sponsor-sidebar-block" data-sponsor-id="${escHtml(resortName)}">
        <div class="sponsor-sidebar-lbl">Featured Partner</div>
        <div class="sponsor-sidebar-name">${escHtml(resortName)}</div>
        <div class="sponsor-sidebar-tagline">${escHtml(sponsor.tagline)}</div>
        <a href="${escHtml(sponsor.bookingUrl)}" class="sponsor-sidebar-btn" target="_blank" rel="noopener noreferrer">Book at ${escHtml(resortName)} →</a>
      </div>`;
}

const reportDir = path.join(__dirname, 'ski-report');
if (!fs.existsSync(reportDir)) {
  console.error('❌ ski-report/ folder not found. Run from your project root.');
  process.exit(1);
}

let patched = 0, cleared = 0, skipped = 0;

const subDirs = fs.readdirSync(reportDir, { withFileTypes: true })
  .filter(d => d.isDirectory()).map(d => d.name);

for (const resortId of subDirs) {
  const filePath = path.join(reportDir, resortId, 'index.html');
  if (!fs.existsSync(filePath)) continue;

  let html = fs.readFileSync(filePath, 'utf8');

  // ── Always remove previously injected sponsor blocks first ──────────────────
  html = html.replace(/\n\s*\/\* ── Featured Partner sidebar ──[\s\S]*?\.sponsor-sidebar-btn:hover \{[^}]*\}/m, '');
  html = html.replace(/\s*<!-- Featured Partner Sidebar -->[\s\S]*?<\/div>\s*(?=\n)/gm, '');

  const sponsor = SPONSORS[resortId];

  if (!sponsor) {
    // No sponsor — save cleaned version if changed
    const orig = fs.readFileSync(filePath, 'utf8');
    if (orig !== html) {
      fs.writeFileSync(filePath, html, 'utf8');
      console.log(`  ✓ Cleared: ski-report/${resortId}/index.html`);
      cleared++;
    } else {
      skipped++;
    }
    continue;
  }

  // ── Inject CSS before </style> ───────────────────────────────────────────────
  if (!html.includes('sponsor-sidebar-block')) {
    html = html.replace('</style>', SIDEBAR_CSS + '\n  </style>');
  }

  // ── Extract resort name from <h1> ────────────────────────────────────────────
  const nameMatch = html.match(/<h1[^>]*class="resort-name"[^>]*>([^<]+)<\/h1>/);
  const resortName = nameMatch ? nameMatch[1].trim() : resortId;

  // ── Inject sidebar before the stats strip ───────────────────────────────────
  // Insert right after the hero section closing div, before the stats grid
  const insertAnchor = '<div class="stats-grid">';
  if (html.includes(insertAnchor)) {
    const sidebarHtml = buildSidebarHtml(resortName, sponsor);
    html = html.replace(insertAnchor, sidebarHtml + '\n    <div class="stats-grid">');
    console.log(`  ✓ Patched: ski-report/${resortId}/index.html`);
    patched++;
  } else {
    // Fallback: insert after the hero section
    const heroEnd = '</header>';
    if (html.includes(heroEnd)) {
      const sidebarHtml = buildSidebarHtml(resortName, sponsor);
      html = html.replace(heroEnd, heroEnd + '\n' + sidebarHtml);
      console.log(`  ✓ Patched (fallback): ski-report/${resortId}/index.html`);
      patched++;
    } else {
      console.warn(`  ⚠️  Could not find insertion point: ski-report/${resortId}/index.html`);
      skipped++;
      continue;
    }
  }

  fs.writeFileSync(filePath, html, 'utf8');
}

console.log(`\n─────────────────────────────────────────────`);
if (Object.keys(SPONSORS).length === 0) {
  console.log(`ℹ️  No sponsors configured. Add entries to SPONSORS at the top of this file.`);
} else {
  console.log(`✅ Done! ${patched} pages patched, ${cleared} cleared, ${skipped} unchanged.`);
}
console.log(`\nTo add a partner:`);
console.log(`  1. Add to SPONSORS in this file AND in sd-app.js SPONSORS object`);
console.log(`  2. node add-booking-link.js`);
console.log(`  3. Commit and push`);
