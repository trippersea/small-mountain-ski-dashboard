#!/usr/bin/env node
/**
 * Adds shared newsletter footer assets to all HTML pages.
 * Run: node inject-newsletter-band.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CSS_LINK = '  <link rel="stylesheet" href="/newsletter-band.css" />';
const JS_SCRIPT = '  <script src="/newsletter-band.js"></script>';

function walkHtml(dir, files = []) {
  for (const name of fs.readdirSync(dir)) {
    if (name === 'node_modules' || name.startsWith('.')) continue;
    const full = path.join(dir, name);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) walkHtml(full, files);
    else if (name.endsWith('.html')) files.push(full);
  }
  return files;
}

function inject(file) {
  let html = fs.readFileSync(file, 'utf8');
  if (html.includes('newsletter-band.js')) return false;

  let changed = false;

  if (!html.includes('newsletter-band.css')) {
    if (html.includes('</head>')) {
      html = html.replace('</head>', `${CSS_LINK}\n</head>`);
      changed = true;
    }
  }

  const footerIdx = html.indexOf('<footer class="site-footer"');
  if (footerIdx !== -1) {
    html = html.slice(0, footerIdx) + `${JS_SCRIPT}\n\n` + html.slice(footerIdx);
    changed = true;
  } else if (html.includes('</body>')) {
    html = html.replace('</body>', `${JS_SCRIPT}\n</body>`);
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(file, html, 'utf8');
  }
  return changed;
}

function stripHomepageInline(file) {
  if (!file.endsWith(`${path.sep}index.html`) || path.dirname(file) !== __dirname) return false;
  let html = fs.readFileSync(file, 'utf8');
  const start = html.indexOf('<!-- ═══════════════════════════════════════════════════════════\n     Newsletter signup band');
  if (start === -1) return false;
  const end = html.indexOf('<footer class="site-footer"', start);
  if (end === -1) return false;
  html = html.slice(0, start) + html.slice(end);
  if (!html.includes('newsletter-band.css')) {
    html = html.replace('</head>', `${CSS_LINK}\n</head>`);
  }
  if (!html.includes('newsletter-band.js')) {
    html = html.replace('<footer class="site-footer"', `${JS_SCRIPT}\n\n<footer class="site-footer"`);
  }
  fs.writeFileSync(file, html, 'utf8');
  return true;
}

const root = __dirname;
const files = walkHtml(root);
let count = 0;
for (const file of files) {
  if (inject(file)) count++;
}
if (stripHomepageInline(path.join(root, 'index.html'))) {
  console.log('Stripped inline newsletter block from index.html');
}
console.log(`Updated ${count} HTML file(s) with newsletter footer assets.`);
