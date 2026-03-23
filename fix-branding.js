#!/usr/bin/env node
// ─────────────────────────────────────────────────────────────────────────────
// fix-branding.js
// Replaces "SkiDecision" with "WhereToSkiNext" across all ski/ state pages.
// Safe to run multiple times — skips files that don't contain SkiDecision.
//
// Usage (run from your project root):
//   node fix-branding.js
// ─────────────────────────────────────────────────────────────────────────────

import fs   from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// All the replacements to make
const REPLACEMENTS = [
  { from: 'SkiDecision',          to: 'WhereToSkiNext'         },
  { from: 'ski-decision',         to: 'wheretoskinext'         },
  { from: 'Ski Decision',         to: 'WhereToSkiNext'         },
];

const TARGET_DIRS = ['ski', 'ski-near'];

let patched = 0;
let skipped = 0;

for (const folder of TARGET_DIRS) {
  const folderPath = path.join(__dirname, folder);

  if (!fs.existsSync(folderPath)) {
    console.warn(`⚠️  Folder not found, skipping: ${folder}/`);
    continue;
  }

  const subDirs = fs.readdirSync(folderPath, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name);

  for (const sub of subDirs) {
    const filePath = path.join(folderPath, sub, 'index.html');
    if (!fs.existsSync(filePath)) continue;

    let html = fs.readFileSync(filePath, 'utf8');

    // Check if any replacements are needed
    const needsPatch = REPLACEMENTS.some(r => html.includes(r.from));
    if (!needsPatch) {
      skipped++;
      continue;
    }

    // Apply all replacements
    for (const { from, to } of REPLACEMENTS) {
      html = html.replaceAll(from, to);
    }

    fs.writeFileSync(filePath, html, 'utf8');
    console.log(`  ✓ Fixed: ${folder}/${sub}/index.html`);
    patched++;
  }
}

console.log(`\n─────────────────────────────────────`);
console.log(`✅ Done! ${patched} files fixed, ${skipped} already correct or skipped.`);
console.log(`\nNext steps:`);
console.log(`  1. Commit the changes in GitHub Desktop`);
console.log(`  2. Push to main — Vercel will auto-deploy`);
console.log(`  3. Verify: visit wheretoskinext.com/ski/massachusetts → View Source → search SkiDecision (should be gone)`);
