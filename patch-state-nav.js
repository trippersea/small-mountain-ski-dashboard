#!/usr/bin/env node
// ─────────────────────────────────────────────────────────────────────────────
// patch-state-nav.js
// Updates nav and footer on all existing /ski/ state pages to match the
// standard brand nav. Replaces the old dark navy nav with the white sticky
// nav consistent with the homepage and all other pages.
//
// Usage: node patch-state-nav.js
// ─────────────────────────────────────────────────────────────────────────────

import fs   from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const NAV_CSS = `    /* ── Nav ─────────────────────────────────────────────────────────── */
    .top-nav {
      position: sticky; top: 0; z-index: 100;
      backdrop-filter: blur(14px);
      background: rgba(255,255,255,.92);
      border-bottom: 1px solid #d6e1f0;
    }
    .top-nav-inner {
      max-width: 1100px; margin: 0 auto;
      padding: 10px 20px;
      display: flex; align-items: center; gap: 6px;
    }
    .nav-brand-link {
      display: flex; align-items: center; gap: 8px;
      text-decoration: none; margin-right: 4px;
    }
    .nav-logo { width: 30px; height: 30px; border-radius: 6px; }
    .nav-brand { font-weight: 800; font-size: 15px; color: #2b6de9; }
    .nav-divider { width: 1px; height: 16px; background: #d6e1f0; margin: 0 4px; flex-shrink: 0; }
    .nav-link {
      padding: 7px 12px; border-radius: 8px; text-decoration: none;
      color: #1b2a3a; font-weight: 600; font-size: 13px;
      border: 1px solid transparent;
      transition: background .12s, color .12s;
    }
    .nav-link:hover { background: #edf4ff; color: #2b6de9; }
    .nav-link-cta {
      background: #2b6de9; color: #fff !important;
      border-radius: 999px; padding: 7px 16px;
    }
    .nav-link-cta:hover { background: #1d5fd4; }`;

const skiDir = path.join(__dirname, 'ski');
if (!fs.existsSync(skiDir)) {
  console.error('❌ ski/ folder not found. Run from your project root.');
  process.exit(1);
}

let patched = 0, skipped = 0;

const subDirs = fs.readdirSync(skiDir, { withFileTypes: true })
  .filter(d => d.isDirectory()).map(d => d.name);

for (const stateSlug of subDirs) {
  const filePath = path.join(skiDir, stateSlug, 'index.html');
  if (!fs.existsSync(filePath)) continue;

  let html = fs.readFileSync(filePath, 'utf8');

  // Skip if already patched
  if (html.includes('/partners/') && html.includes('nav-brand-link')) {
    skipped++;
    continue;
  }

  // ── 1. Replace old dark nav CSS ──────────────────────────────────────────
  // Remove old bare nav styles
  html = html.replace(
    /nav \{ background: #1a2030;[^}]*\}\s*nav a \{[^}]*\}\s*nav \.nav-sub \{[^}]*\}/s,
    NAV_CSS
  );

  // ── 2. Fix container width: keep .container but update width ─────────────
  html = html.replace(
    '.container { max-width: 1100px; margin: 0 auto; padding: 32px 16px 64px; }',
    '.container { max-width: 860px; margin: 0 auto; padding: 40px 20px 80px; }'
  );

  // ── 3. Extract state name from page for nav link ─────────────────────────
  const h1Match   = html.match(/<h1[^>]*>Best Ski Mountains in ([^<]+)<\/h1>/);
  const stateName = h1Match ? h1Match[1].trim() : '';
  const appUrlMatch = html.match(/href="(https:\/\/wheretoskinext\.com\/\?st=[^"]+)"/);
  const appUrl    = appUrlMatch ? appUrlMatch[1] : 'https://wheretoskinext.com/';

  // ── 4. Replace old dark nav HTML ─────────────────────────────────────────
  const newNav = `<nav class="top-nav" role="navigation" aria-label="Main navigation">
    <div class="top-nav-inner">
      <a href="/" class="nav-brand-link" aria-label="WhereToSkiNext.com home">
        <img src="/ski-decision-logo.png" alt="WhereToSkiNext.com logo" class="nav-logo" width="30" height="30" />
        <span class="nav-brand">WhereToSkiNext.com</span>
      </a>
      <div class="nav-divider"></div>
      <a href="/" class="nav-link">Find My Mountain</a>
      ${stateName ? `<a href="/ski/${stateSlug}/" class="nav-link">${stateName} Mountains</a>` : ''}
      <a href="/about/" class="nav-link">About</a>
      <a href="/partners/" class="nav-link">Partners</a>
      <div class="nav-divider"></div>
      <a href="${appUrl}" class="nav-link nav-link-cta">Find My Mountain →</a>
    </div>
  </nav>`;

  html = html.replace(/<nav>\s*[\s\S]*?<\/nav>/, newNav);

  // ── 5. Replace footer ────────────────────────────────────────────────────
  const year = new Date().getFullYear();
  const newFooter = `<footer class="site-footer">
  <p>© ${year} WhereToSkiNext.com &mdash; <a href="/">Find My Mountain</a> &middot; <a href="/about/">About</a> &middot; <a href="/privacy/">Privacy Policy</a> &middot; <a href="/partners/">Partners</a></p>
</footer>`;

  html = html.replace(/<footer>[\s\S]*?<\/footer>/, newFooter);

  // ── 6. Add site-footer CSS if not present ────────────────────────────────
  if (!html.includes('site-footer {')) {
    html = html.replace('</style>', `
    .site-footer {
      text-align: center; padding: 28px 16px;
      font-size: 12px; color: #94a3b8;
      border-top: 1px solid #d6e1f0;
      background: #fff; margin-top: 40px;
    }
    .site-footer a { color: #2b6de9; text-decoration: none; }
    .site-footer a:hover { text-decoration: underline; }
  </style>`);
  }

  fs.writeFileSync(filePath, html, 'utf8');
  console.log(`  ✓ Patched: ski/${stateSlug}/index.html`);
  patched++;
}

console.log(`\n✅ Done! ${patched} state pages patched, ${skipped} already up to date.`);
console.log('\nNext: commit and push in GitHub Desktop.');
