#!/usr/bin/env node
// ─────────────────────────────────────────────────────────────────────────────
// patch-nearby-delta.js
// Fixes the alarming red color on negative snowfall delta cards in the
// "Also Considering" section of all ski-report pages.
// Changes red (#fee2e2 / #b91c1c) to neutral slate (#f1f5f9 / #64748b)
//
// Usage: node patch-nearby-delta.js
// ─────────────────────────────────────────────────────────────────────────────

import fs   from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

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

  if (!html.includes('#fee2e2') && !html.includes('#b91c1c')) {
    skipped++;
    continue;
  }

  html = html.replace(/background: #fee2e2; color: #b91c1c/g,
                       'background: #f1f5f9; color: #64748b');
  html = html.replace(/.nearby-delta--less \{ background: #fee2e2; color: #b91c1c; \}/g,
                       '.nearby-delta--less { background: #f1f5f9; color: #64748b; }');

  fs.writeFileSync(filePath, html, 'utf8');
  patched++;
  if (patched % 25 === 0) console.log(`  Patched ${patched}...`);
}

console.log(`\n✅ Done! ${patched} pages fixed, ${skipped} already clean.`);
console.log('Commit and push in GitHub Desktop.');
