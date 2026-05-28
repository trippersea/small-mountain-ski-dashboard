/**
 * patch-nav-subscribe.mjs
 *
 * Updates the nav subscribe dropdown copy in every HTML file across the repo.
 * Uses individual string replacements -- no whitespace-sensitive block matching.
 *
 * Run from the project root:
 *   node patch-nav-subscribe.mjs
 *
 * Safe to re-run -- only changes files that still have old copy.
 */

import fs   from 'fs';
import path from 'path';

const SKIP_DIRS = new Set([
  'node_modules', '.git', '.vercel', '.next', 'dist', 'build',
]);

// Individual replacements. Each pair is [oldString, newString].
// Matched on the unique class+text combination so whitespace between
// tags doesn't affect matching.
const REPLACEMENTS = [
  [
    'class="nav-subscribe-kicker">Next winter<',
    'class="nav-subscribe-kicker">Weekly during ski season<',
  ],
  [
    'class="nav-subscribe-headline">First powder. First to know.<',
    'class="nav-subscribe-headline">One top pick per region.<',
  ],
  [
    'class="nav-subscribe-sub">One email when the site goes live for next season.<',
    'class="nav-subscribe-sub">Every Friday -- snow totals, crowd outlook, pass coverage. Five regions, one clear call each.<',
  ],
  [
    'class="nav-subscribe-submit" type="button">Notify me<',
    'class="nav-subscribe-submit" type="button">Get the picks<',
  ],
  [
    'class="nav-subscribe-fine">One email. No spam. Unsubscribe anytime.<',
    'class="nav-subscribe-fine">Weekly during ski season. No spam. Unsubscribe anytime.<',
  ],
  [
    'class="nav-subscribe-ok-sub">See you next season.<',
    'class="nav-subscribe-ok-sub">First issue hits when the season opens. See you out there.<',
  ],
];

// Signal that the file is already fully up to date
const ALREADY_DONE_SIGNAL = 'class="nav-subscribe-kicker">Weekly during ski season<';

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

const root = process.cwd();
console.log(`\nScanning: ${root}\n${'─'.repeat(50)}`);

const htmlFiles = walkDir(root);
console.log(`Found ${htmlFiles.length} HTML files.\n`);

let patched  = 0;
let skipped  = 0;
let noNav    = 0;

for (const filePath of htmlFiles) {
  let html = fs.readFileSync(filePath, 'utf8');

  if (!html.includes('id="navSubForm"')) {
    noNav++;
    continue;
  }

  if (html.includes(ALREADY_DONE_SIGNAL)) {
    skipped++;
    continue;
  }

  let changed = false;
  for (const [oldStr, newStr] of REPLACEMENTS) {
    if (html.includes(oldStr)) {
      html = html.split(oldStr).join(newStr);
      changed = true;
    }
  }

  if (changed) {
    fs.writeFileSync(filePath, html, 'utf8');
    console.log(`  ✓  ${path.relative(root, filePath)}`);
    patched++;
  } else {
    // Has navSubForm but no old strings -- log for awareness
    console.warn(`  ?  No matches found (check manually): ${path.relative(root, filePath)}`);
    skipped++;
  }
}

console.log(`\n${'─'.repeat(50)}`);
console.log(`✅  Done.`);
console.log(`   Patched : ${patched}`);
console.log(`   No nav  : ${noNav}`);
console.log(`   Skipped : ${skipped}`);
console.log(`\nNext steps:`);
console.log(`  1. Check GitHub Desktop -- many files should show as changed`);
console.log(`  2. Spot-check one ski-report page and one state page`);
console.log(`  3. Commit: "Update nav subscribe copy to weekly regional picks"`);
console.log(`  4. Push to main\n`);
