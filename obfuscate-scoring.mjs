// obfuscate-scoring.mjs — Runs during Vercel build (before prerender-homepage.mjs).
// Replaces sd-scoring.js and sd-app.js in-place with obfuscated versions so the
// deployed JS is unreadable. Your local source files are never touched — this only
// runs in Vercel's ephemeral build container.
//
// Usage:  node obfuscate-scoring.mjs
// Requires:  npm install --save-dev javascript-obfuscator
//
// WARNING: do not run this locally unless you want to overwrite your source files.
// The Vercel build command is the only place this should execute.

import { readFileSync, writeFileSync } from 'fs';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
let JavaScriptObfuscator;

try {
  JavaScriptObfuscator = require('javascript-obfuscator');
} catch (e) {
  console.warn('[obfuscate] javascript-obfuscator not installed — skipping obfuscation.');
  console.warn('[obfuscate] Run: npm install --save-dev javascript-obfuscator');
  process.exit(0); // non-fatal: build continues without obfuscation
}

const TARGETS = ['sd-scoring.js', 'sd-app.js'];

const OPTIONS = {
  compact: true,
  controlFlowFlattening: false,   // keep false — breaks scoring math
  deadCodeInjection: false,
  debugProtection: false,
  disableConsoleOutput: false,
  identifierNamesGenerator: 'hexadecimal',
  renameGlobals: false,           // keep false — globals like W, state, RESORTS must survive
  rotateStringArray: true,
  selfDefending: false,
  shuffleStringArray: true,
  splitStrings: false,
  stringArray: true,
  stringArrayEncoding: ['base64'],
  stringArrayThreshold: 0.75,
  transformObjectKeys: false,
  unicodeEscapeSequence: false,
};

let anyFailed = false;

for (const file of TARGETS) {
  try {
    const src    = readFileSync(file, 'utf8');
    const result = JavaScriptObfuscator.obfuscate(src, OPTIONS);
    writeFileSync(file, result.getObfuscatedCode(), 'utf8');
    console.log(`[obfuscate] OK: ${file}`);
  } catch (err) {
    console.error(`[obfuscate] FAILED: ${file} — ${err.message}`);
    anyFailed = true;
  }
}

if (anyFailed) process.exit(1);
