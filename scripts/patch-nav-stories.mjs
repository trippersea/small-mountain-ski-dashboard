#!/usr/bin/env node
/**
 * Adds Stories to primary nav (between About and Pass Guides) across HTML files.
 * Safe to re-run — skips files that already include /stories
 */
import fs from 'fs';
import path from 'path';

const SKIP_DIRS = new Set(['node_modules', '.git', '.vercel']);

const INSERT_SLASH = `
      <span class="nav-link-sep" aria-hidden="true"></span>
      <a href="/stories/" class="nav-primary">Stories</a>`;

const INSERT_NO_SLASH = `
      <span class="nav-link-sep" aria-hidden="true"></span>
      <a href="/stories" class="nav-primary">Stories</a>`;

const PATTERNS = [
  [
    `<a href="/about/" class="nav-primary">About</a>
      <span class="nav-link-sep" aria-hidden="true"></span>
      <a href="/ski-pass-comparison/" class="nav-primary">Pass Guides</a>`,
    `<a href="/about/" class="nav-primary">About</a>${INSERT_SLASH}
      <span class="nav-link-sep" aria-hidden="true"></span>
      <a href="/ski-pass-comparison/" class="nav-primary">Pass Guides</a>`,
  ],
  [
    `<a href="/about" class="nav-primary">About</a>
      <span class="nav-link-sep" aria-hidden="true"></span>
      <a href="/ski-pass-comparison" class="nav-primary">Pass Guides</a>`,
    `<a href="/about" class="nav-primary">About</a>${INSERT_NO_SLASH}
      <span class="nav-link-sep" aria-hidden="true"></span>
      <a href="/ski-pass-comparison" class="nav-primary">Pass Guides</a>`,
  ],
];

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (SKIP_DIRS.has(e.name)) continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (e.name.endsWith('.html')) out.push(p);
  }
  return out;
}

const root = process.cwd();
let patched = 0;
let skipped = 0;

for (const file of walk(root)) {
  let html = fs.readFileSync(file, 'utf8');
  if (!html.includes('class="nav-primary">About</a>') || html.includes('/stories')) {
    skipped++;
    continue;
  }
  let changed = false;
  for (const [oldBlock, newBlock] of PATTERNS) {
    if (html.includes(oldBlock)) {
      html = html.replace(oldBlock, newBlock);
      changed = true;
      break;
    }
  }
  if (changed) {
    fs.writeFileSync(file, html, 'utf8');
    patched++;
  } else {
    skipped++;
  }
}

console.log(`Nav patch complete: ${patched} updated, ${skipped} skipped.`);
