#!/usr/bin/env node
// ─────────────────────────────────────────────────────────────────────────────
// patch-nav-fix.js
// Fixes the "Find My Mountain" duplication in nav across all existing
// ski-report/ and ski/ pages. Removes the plain "Find My Mountain" link,
// keeping only the CTA pill "Find My Mountain →".
//
// Usage: node patch-nav-fix.js
// ─────────────────────────────────────────────────────────────────────────────

import fs   from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

let patched = 0, skipped = 0;

function fixNav(html) {
  // Remove the plain "Find My Mountain" nav link — keep only the CTA pill
  const before = html;
  html = html.replace(
    /\s*<a href="\/" class="nav-link">Find My Mountain<\/a>\n/g, '\n'
  );
  return { html, changed: html !== before };
}

function processDir(dirName) {
  const dir = path.join(__dirname, dirName);
  if (!fs.existsSync(dir)) {
    console.warn(`⚠️  ${dirName}/ not found, skipping`);
    return;
  }

  const subDirs = fs.readdirSync(dir, { withFileTypes: true })
    .filter(d => d.isDirectory()).map(d => d.name);

  for (const sub of subDirs) {
    const filePath = path.join(dir, sub, 'index.html');
    if (!fs.existsSync(filePath)) continue;

    const html = fs.readFileSync(filePath, 'utf8');
    const { html: fixed, changed } = fixNav(html);

    if (changed) {
      fs.writeFileSync(filePath, fixed, 'utf8');
      patched++;
      if (patched % 25 === 0) console.log(`  Patched ${patched}...`);
    } else {
      skipped++;
    }
  }
}

processDir('ski-report');
processDir('ski');

console.log(`\n✅ Done! ${patched} pages fixed, ${skipped} already clean.`);
console.log('Commit and push in GitHub Desktop.');
