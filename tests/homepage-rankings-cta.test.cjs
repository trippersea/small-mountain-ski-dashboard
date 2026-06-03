/**
 * Homepage rankings escape hatch CTA (Direction 3).
 */
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

const appSrc = fs.readFileSync(path.join(__dirname, '..', 'sd-app.js'), 'utf8');

test('[UI] verdict card exposes View all ranked mountains CTA', () => {
  assert.match(appSrc, /verdictViewAllRankingsBtn/);
  assert.match(appSrc, /View all ranked mountains/);
});

test('[UI] rankings CTA is peer to Compare Mountains', () => {
  assert.match(appSrc, /vcard-secondary-actions/);
  assert.match(appSrc, /verdictSeeAllRunnersBtn/);
  assert.match(appSrc, /compareSection/);
  assert.match(appSrc, /tableViewAll = true/);
});
