#!/usr/bin/env node
// ─────────────────────────────────────────────────────────────────────────────
// fix-snowfall-display.js
// Fixes the "Also Considering" cards on ski-report pages to show actual
// snowfall numbers instead of just a confusing negative delta.
//
// Before: ❄ -191" avg snow  (red, looks alarming)
// After:  ❄ 450" avg snow (-191")  (context-aware)
//
// Usage (run from your project root):
//   node fix-snowfall-display.js
// ─────────────────────────────────────────────────────────────────────────────

import fs   from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';
import vm from 'vm';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const _require = createRequire(import.meta.url);

// ─── Load resort data to get actual snowfall numbers ──────────────────────────
function loadResorts() {
  const sdData = fs.readFileSync(path.join(__dirname, 'sd-data.js'), 'utf8');
  const neCtx = {};
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

const resorts = loadResorts();
const resortMap = new Map(resorts.map(r => [r.id, r]));
console.log(`Loaded ${resorts.length} resorts`);

const reportDir = path.join(__dirname, 'ski-report');
if (!fs.existsSync(reportDir)) {
  console.error('❌ ski-report/ folder not found. Run from project root.');
  process.exit(1);
}

let patched = 0;
let skipped = 0;

const subDirs = fs.readdirSync(reportDir, { withFileTypes: true })
  .filter(d => d.isDirectory())
  .map(d => d.name);

for (const resortId of subDirs) {
  const filePath = path.join(reportDir, resortId, 'index.html');
  if (!fs.existsSync(filePath)) continue;

  let html = fs.readFileSync(filePath, 'utf8');

  // Find all nearby-delta--less divs with just a raw negative delta (old format)
  // Pattern: ❄ -NUMBER" avg snow  (no actual snowfall shown before the delta)
  const oldPattern = /❄ (-\d+)" avg snow(?!\s*\()/g;

  if (!oldPattern.test(html)) {
    skipped++;
    continue;
  }

  // Reset regex
  const pattern = /❄ (-\d+)" avg snow(?!\s*\()/g;
  let match;
  let newHtml = html;
  let changed = false;

  // We need to find the nearby resort's actual snowfall
  // The nearby cards link to /ski-report/{id}/ so we can extract the id
  // Strategy: parse each nearby card block and fix the delta display
  
  // Simpler approach: find all cards and for each one, look up the resort by href
  const cardPattern = /<a[^>]*href="\/ski-report\/([^/"]+)\/"[^>]*class="nearby-card"[\s\S]*?<\/a>/g;
  
  newHtml = html.replace(cardPattern, (cardHtml, linkedId) => {
    const linkedResort = resortMap.get(linkedId);
    if (!linkedResort) return cardHtml;

    // Fix negative delta display: ❄ -NUMBER" avg snow → ❄ ACTUAL" avg snow (-NUMBER")
    return cardHtml.replace(/❄ (-\d+)" avg snow(?!\s*\()/, (match, delta) => {
      return `❄ ${linkedResort.avgSnowfall}" avg snow (${delta}")`;
    });
  });

  if (newHtml !== html) {
    fs.writeFileSync(filePath, newHtml, 'utf8');
    console.log(`  ✓ Fixed: ski-report/${resortId}/index.html`);
    patched++;
    changed = true;
  }

  if (!changed) skipped++;
}

console.log(`\n─────────────────────────────────────`);
console.log(`✅ Done! ${patched} files fixed, ${skipped} already correct or skipped.`);
console.log(`\nNext steps:`);
console.log(`  1. Commit the changes in GitHub Desktop`);
console.log(`  2. Push to main — Vercel will auto-deploy`);
console.log(`  3. Verify: visit wheretoskinext.com/ski-report/mt-baker-ski-area and check the "Also Considering" cards`);
