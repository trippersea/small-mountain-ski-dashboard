/**
 * patch-nav-subscribe.mjs
 *
 * Updates the nav subscribe dropdown copy in every HTML file across the repo.
 * Replaces the old "Next winter / one email" messaging with the current
 * "Weekly during ski season / one top pick per region" copy.
 *
 * Run from the project root:
 *   node patch-nav-subscribe.mjs
 *
 * Safe to re-run -- skips files that already have the new copy.
 */

import fs   from 'fs';
import path from 'path';

// ── Directories to skip entirely ─────────────────────────────────────────────
const SKIP_DIRS = new Set([
  'node_modules', '.git', '.vercel', '.next', 'dist', 'build',
]);

// ── Old nav subscribe block (exact match across all generated pages) ──────────
const OLD_FORM = `          <div id="navSubForm">
            <div class="nav-subscribe-kicker">Next winter</div>
            <p class="nav-subscribe-headline">First powder. First to know.</p>
            <p class="nav-subscribe-sub">One email when the site goes live for next season.</p>
            <div class="nav-subscribe-row">
              <input
                type="email"
                id="navSubEmail"
                class="nav-subscribe-input"
                placeholder="you@email.com"
                autocomplete="email"
                spellcheck="false"
              />
              <button id="navSubSubmit" class="nav-subscribe-submit" type="button">Notify me</button>
            </div>
            <p id="navSubErr" class="nav-subscribe-err" role="alert"></p>
            <p class="nav-subscribe-fine">One email. No spam. Unsubscribe anytime.</p>
          </div>
          <div id="navSubOk" class="nav-subscribe-ok">
            <div class="nav-subscribe-ok-icon">&#10003;</div>
            <p class="nav-subscribe-ok-head">You're on the list</p>
            <p class="nav-subscribe-ok-sub">See you next season.</p>
          </div>`;

// ── New nav subscribe block ───────────────────────────────────────────────────
const NEW_FORM = `          <div id="navSubForm">
            <div class="nav-subscribe-kicker">Weekly during ski season</div>
            <p class="nav-subscribe-headline">One top pick per region.</p>
            <p class="nav-subscribe-sub">Every Friday -- snow totals, crowd outlook, pass coverage. Five regions, one clear call each.</p>
            <div class="nav-subscribe-row">
              <input
                type="email"
                id="navSubEmail"
                class="nav-subscribe-input"
                placeholder="you@email.com"
                autocomplete="email"
                spellcheck="false"
              />
              <button id="navSubSubmit" class="nav-subscribe-submit" type="button">Get the picks</button>
            </div>
            <p id="navSubErr" class="nav-subscribe-err" role="alert"></p>
            <p class="nav-subscribe-fine">Weekly during ski season. No spam. Unsubscribe anytime.</p>
          </div>
          <div id="navSubOk" class="nav-subscribe-ok">
            <div class="nav-subscribe-ok-icon">&#10003;</div>
            <p class="nav-subscribe-ok-head">You're on the list</p>
            <p class="nav-subscribe-ok-sub">First issue hits when the season opens. See you out there.</p>
          </div>`;

// ── Walk the repo ─────────────────────────────────────────────────────────────
function walkDir(dir, results = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (SKIP_DIRS.has(entry.name)) continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkDir(fullPath, results);
    } else if (entry.isFile() && entry.name.endsWith('.html')) {
      results.push(fullPath);
    }
  }
  return results;
}

// ── Main ──────────────────────────────────────────────────────────────────────
const root = process.cwd();
console.log(`\nScanning: ${root}\n${'─'.repeat(50)}`);

const htmlFiles = walkDir(root);
console.log(`Found ${htmlFiles.length} HTML files.\n`);

let patched  = 0;
let skipped  = 0;
let noNav    = 0;

for (const filePath of htmlFiles) {
  const html = fs.readFileSync(filePath, 'utf8');

  // Already updated -- skip
  if (html.includes('Weekly during ski season') && html.includes('One top pick per region')) {
    skipped++;
    continue;
  }

  // No nav subscribe block -- skip
  if (!html.includes('id="navSubForm"')) {
    noNav++;
    continue;
  }

  if (!html.includes(OLD_FORM)) {
    // Has navSubForm but whitespace differs -- flag for manual review
    console.warn(`  ⚠  Whitespace mismatch (manual check needed): ${path.relative(root, filePath)}`);
    skipped++;
    continue;
  }

  const updated = html.replace(OLD_FORM, NEW_FORM);
  fs.writeFileSync(filePath, updated, 'utf8');
  console.log(`  ✓  ${path.relative(root, filePath)}`);
  patched++;
}

console.log(`\n${'─'.repeat(50)}`);
console.log(`✅  Done.`);
console.log(`   Patched : ${patched}`);
console.log(`   Skipped (already updated or no nav): ${skipped + noNav}`);
console.log(`\nNext steps:`);
console.log(`  1. Check GitHub Desktop -- you should see many files changed`);
console.log(`  2. Spot-check one ski-report page and one state page in a browser`);
console.log(`  3. Commit: "Update nav subscribe copy to weekly regional picks"`);
console.log(`  4. Push to main -- Vercel auto-deploys\n`);
