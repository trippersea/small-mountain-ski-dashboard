// ═══════════════════════════════════════════════════════════════════════════
// fix-ski-report-urls.js
// Fixes non-www canonical, OG, and structured data URLs in all ski-report pages
// Run from your project root: node fix-ski-report-urls.js
// ═══════════════════════════════════════════════════════════════════════════

const fs   = require('fs');
const path = require('path');

const SKI_REPORT_DIR = path.join(__dirname, 'ski-report');

// All non-www patterns to replace with www versions
const REPLACEMENTS = [
  // Canonical, OG, Twitter, structured data URLs
  {
    from: /https:\/\/wheretoskinext\.com\//g,
    to:   'https://www.wheretoskinext.com/'
  },
  // href/src attributes that start with just the domain (no protocol) — safety catch
  {
    from: /http:\/\/wheretoskinext\.com\//g,
    to:   'https://www.wheretoskinext.com/'
  }
];

// Walk all ski-report subdirectories
const dirs = fs.readdirSync(SKI_REPORT_DIR, { withFileTypes: true })
  .filter(d => d.isDirectory())
  .map(d => d.name);

let fixed = 0;
let skipped = 0;

for (const dir of dirs) {
  const filePath = path.join(SKI_REPORT_DIR, dir, 'index.html');
  if (!fs.existsSync(filePath)) { skipped++; continue; }

  let html = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  for (const { from, to } of REPLACEMENTS) {
    const updated = html.replace(from, to);
    if (updated !== html) { html = updated; changed = true; }
  }

  if (changed) {
    fs.writeFileSync(filePath, html, 'utf8');
    fixed++;
  } else {
    skipped++;
  }
}

console.log(`✅ Fixed www. URLs in ${fixed} pages`);
console.log(`⏭  Skipped ${skipped} pages (already correct or no index.html)`);
