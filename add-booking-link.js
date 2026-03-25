#!/usr/bin/env node
// ─────────────────────────────────────────────────────────────────────────────
// add-booking-link.js
// Adds the Featured Partner sidebar (with booking link) to /ski-report/ pages.
//
// HOW TO ADD A PARTNER:
//   Add their resort ID + booking URL to featured-partners.js
//   Run: node add-booking-link.js
//   Commit and push — Vercel auto-deploys.
//
// HOW TO REMOVE:
//   Delete their entry from featured-partners.js, run again — cleans up automatically.
//
// Usage: node add-booking-link.js
// ─────────────────────────────────────────────────────────────────────────────

import fs   from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import vm from 'vm';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ─── SPONSOR CONFIGURATION ────────────────────────────────────────────────────
// Single source of truth: featured-partners.js
function loadSponsors() {
  const ctx = {};
  const code = fs.readFileSync(path.join(__dirname, 'featured-partners.js'), 'utf8');
  vm.runInNewContext(code, ctx);
  return ctx.FEATURED_PARTNERS || {};
}

const SPONSORS = loadSponsors();

// ─── CSS injected once per patched page ───────────────────────────────────────
const SIDEBAR_CSS = `
    /* ── Featured Partner hero strip ── */
    .hero-sponsor-block {
      background: rgba(0,0,0,.25);
      border-top: 1px solid rgba(255,255,255,.12);
      padding: 13px 28px;
      margin: 16px -28px 0;
      display: flex; align-items: center;
      justify-content: space-between; gap: 14px;
      flex-wrap: wrap;
    }
    .hero-sponsor-badge {
      font-size: 9px; font-weight: 700; text-transform: uppercase;
      letter-spacing: .1em; color: #6ee7b7;
    }
    .hero-sponsor-btn {
      background: #2b6de9; color: #fff !important;
      font-size: 13px; font-weight: 700;
      padding: 9px 20px; border-radius: 999px;
      text-decoration: none; white-space: nowrap;
      transition: background .12s; flex-shrink: 0;
    }
    .hero-sponsor-btn:hover { background: #1d5fd4; }`;

function escHtml(s) {
  return String(s || '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function buildSidebarHtml(resortName, sponsor) {
  return `
      <!-- Featured Partner Hero Block -->
      <div class="hero-sponsor-block" data-sponsor-id="${escHtml(resortName)}">
        <span class="hero-sponsor-badge">Featured Partner</span>
        <a href="${escHtml(sponsor.bookingUrl)}" class="hero-sponsor-btn" target="_blank" rel="noopener noreferrer">Book Tickets →</a>
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
  // FIXED: regex now matches the actual injected label "Featured Partner hero strip"
  html = html.replace(/\n?\s*\/\* ── Featured Partner hero strip ──[\s\S]*?\.hero-sponsor-btn:hover \{[^}]*\}\s*/m, '');
  html = html.replace(/\s*<!-- Featured Partner Hero Block -->[\s\S]*?<\/div>\s*(?=\n)/gm, '');

  const sponsor = SPONSORS[resortId];

  if (!sponsor) {
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
  // FIXED: guard check now uses the correct class name "hero-sponsor-block"
  if (!html.includes('hero-sponsor-block')) {
    html = html.replace('</style>', SIDEBAR_CSS + '\n  </style>');
  }

  // ── Extract resort name from <h1> ────────────────────────────────────────────
  const nameMatch = html.match(/<h1[^>]*class="resort-name"[^>]*>([^<]+)<\/h1>/);
  const resortName = nameMatch ? nameMatch[1].trim() : resortId;

  // ── Inject sponsor block inside hero, before </header> ─────────────────────
  const heroEnd = '</header>';
  if (html.includes(heroEnd)) {
    const sidebarHtml = buildSidebarHtml(resortName, sponsor);
    html = html.replace(heroEnd, sidebarHtml + '\n    </header>');
    console.log(`  ✓ Patched: ski-report/${resortId}/index.html`);
    patched++;
  } else {
    console.warn(`  ⚠️  Could not find </header> in: ski-report/${resortId}/index.html`);
    skipped++;
    continue;
  }

  fs.writeFileSync(filePath, html, 'utf8');
}

console.log(`\n─────────────────────────────────────────────`);
if (Object.keys(SPONSORS).length === 0) {
  console.log(`ℹ️  No sponsors configured. Add entries to featured-partners.js to get started.`);
} else {
  console.log(`✅ Done! ${patched} pages patched, ${cleared} cleared, ${skipped} unchanged.`);
}
console.log(`\nTo add a partner:`);
console.log(`  1. Add to featured-partners.js`);
console.log(`  2. node add-booking-link.js`);
console.log(`  3. Commit and push`);
