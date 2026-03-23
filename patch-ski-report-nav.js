#!/usr/bin/env node
// ─────────────────────────────────────────────────────────────────────────────
// patch-ski-report-nav.js
// Updates nav and footer on all existing /ski-report/ pages to match the
// standard brand nav: logo, Find My Mountain, [State] Mountains, About,
// Partners, Find My Mountain CTA → and standard footer with Partners link.
//
// Usage: node patch-ski-report-nav.js
// ─────────────────────────────────────────────────────────────────────────────

import fs   from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const NAV_CSS = `
    /* ── Nav ─────────────────────────────────────────────────────────── */
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

const FOOTER_CSS = `
    /* ── Footer ── */
    .site-footer {
      text-align: center; padding: 28px 16px;
      font-size: 12px; color: #94a3b8;
      border-top: 1px solid #d6e1f0;
      background: #fff; margin-top: 40px;
    }
    .site-footer a { color: #2b6de9; text-decoration: none; }
    .site-footer a:hover { text-decoration: underline; }`;

const reportDir = path.join(__dirname, 'ski-report');
if (!fs.existsSync(reportDir)) {
  console.error('❌ ski-report/ folder not found. Run from your project root.');
  process.exit(1);
}

let patched = 0, skipped = 0;

const subDirs = fs.readdirSync(reportDir, { withFileTypes: true })
  .filter(d => d.isDirectory()).map(d => d.name);

for (const resortId of subDirs) {
  const filePath = path.join(reportDir, resortId, 'index.html');
  if (!fs.existsSync(filePath)) continue;

  let html = fs.readFileSync(filePath, 'utf8');

  // Skip if already fully patched
  if (html.includes('/partners/') && html.includes('nav-brand-link') && html.includes('site-footer')) {
    skipped++;
    continue;
  }

  // ── 1. Replace nav CSS ───────────────────────────────────────────────────
  html = html.replace(
    /\/\* ── Nav ──.*?\.nav-link-cta:hover \{ background: #1d5fd4; \}/s,
    NAV_CSS.trim()
  );

  // ── 2. Replace footer CSS ────────────────────────────────────────────────
  if (!html.includes('site-footer {')) {
    html = html.replace(
      /\/\* ── Footer ── \*\/\s*footer \{[^}]*\}\s*footer a \{[^}]*\}/s,
      FOOTER_CSS.trim()
    );
  }

  // ── 3. Replace nav HTML ──────────────────────────────────────────────────
  // Extract state slug and state name from existing nav for contextual link
  const stateMatch = html.match(/href="\/ski\/([^/]+)\/"[^>]*>([^<]+)\s*Mountains/);
  const stateSlug  = stateMatch ? stateMatch[1] : '';
  const stateName  = stateMatch ? stateMatch[2].trim() : '';
  const stateLink  = stateSlug
    ? `\n      <a href="/ski/${stateSlug}/" class="nav-link">${stateName} Mountains</a>`
    : '';

  // Extract appUrl from existing CTA
  const appUrlMatch = html.match(/href="(https:\/\/wheretoskinext\.com\/\?resort=[^"]+)"/);
  const appUrl = appUrlMatch ? appUrlMatch[1] : 'https://wheretoskinext.com/';

  const newNav = `  <!-- Nav -->
  <nav class="top-nav" role="navigation" aria-label="Main navigation">
    <div class="top-nav-inner">
      <a href="/" class="nav-brand-link" aria-label="WhereToSkiNext.com home">
        <img src="/ski-decision-logo.png" alt="WhereToSkiNext.com logo" class="nav-logo" width="30" height="30" />
        <span class="nav-brand">WhereToSkiNext.com</span>
      </a>
      <div class="nav-divider"></div>
      <a href="/" class="nav-link">Find My Mountain</a>${stateLink}
      <a href="/about/" class="nav-link">About</a>
      <a href="/partners/" class="nav-link">Partners</a>
      <div class="nav-divider"></div>
      <a href="${appUrl}" class="nav-link nav-link-cta">Find My Mountain →</a>
    </div>
  </nav>`;

  html = html.replace(
    /  <!-- Nav -->\s*<nav class="top-nav".*?<\/nav>/s,
    newNav
  );

  // ── 4. Replace footer HTML ───────────────────────────────────────────────
  const year = new Date().getFullYear();
  const newFooter = `  <footer class="site-footer">
    <p>© ${year} WhereToSkiNext.com &mdash; <a href="/">Find My Mountain</a> &middot; <a href="/about/">About</a> &middot; <a href="/privacy/">Privacy Policy</a> &middot; <a href="/partners/">Partners</a></p>
  </footer>`;

  html = html.replace(/<footer>[\s\S]*?<\/footer>/, newFooter);

  fs.writeFileSync(filePath, html, 'utf8');
  patched++;
  if (patched % 25 === 0) console.log(`  Patched ${patched}...`);
}

console.log(`\n✅ Done! ${patched} ski-report pages patched, ${skipped} already up to date.`);
console.log('\nNext: commit and push in GitHub Desktop.');
