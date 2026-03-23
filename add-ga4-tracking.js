#!/usr/bin/env node
// ─────────────────────────────────────────────────────────────────────────────
// add-ga4-tracking.js
// Patches existing HTML files in /ski and /ski-near by inserting the GA4
// tracking snippet. Does NOT regenerate pages — only edits what's already there.
//
// Usage (run from your project root):
//   node add-ga4-tracking.js
// ─────────────────────────────────────────────────────────────────────────────

import fs   from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const GA4_SNIPPET = `  <!-- Google tag (gtag.js) -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-VK2Q3TTFEW"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-VK2Q3TTFEW');
  </script>`;

// Folders to patch (relative to project root)
const TARGET_DIRS = ['ski', 'ski-near'];

let patched = 0;
let skipped = 0;
let notFound = 0;

for (const folder of TARGET_DIRS) {
  const folderPath = path.join(__dirname, folder);

  if (!fs.existsSync(folderPath)) {
    console.warn(`⚠️  Folder not found, skipping: ${folder}/`);
    notFound++;
    continue;
  }

  // Find all index.html files one level deep (e.g. ski/massachusetts/index.html)
  const subDirs = fs.readdirSync(folderPath, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name);

  for (const sub of subDirs) {
    const filePath = path.join(folderPath, sub, 'index.html');

    if (!fs.existsSync(filePath)) continue;

    const html = fs.readFileSync(filePath, 'utf8');

    // Skip if GA4 already present
    if (html.includes('G-VK2Q3TTFEW')) {
      skipped++;
      continue;
    }

    // Insert after <meta charset="UTF-8" />
    const anchor = '<meta charset="UTF-8" />';
    if (!html.includes(anchor)) {
      console.warn(`  ⚠️  Could not find insertion point in: ${folder}/${sub}/index.html`);
      skipped++;
      continue;
    }

    const updated = html.replace(anchor, `${anchor}\n${GA4_SNIPPET}`);
    fs.writeFileSync(filePath, updated, 'utf8');
    console.log(`  ✓ Patched: ${folder}/${sub}/index.html`);
    patched++;
  }
}

console.log(`\n─────────────────────────────────────`);
console.log(`✅ Done! ${patched} files patched, ${skipped} already had tracking or skipped, ${notFound} folders missing.`);
console.log(`\nNext steps:`);
console.log(`  1. Commit the changes in GitHub Desktop`);
console.log(`  2. Push to main — Vercel will auto-deploy`);
console.log(`  3. Verify by visiting a state or city page and doing View Source, search for G-VK2Q3TTFEW`);
