'use strict';

const test = require('node:test');
const assert = require('node:assert');
const SDSafeUrl = require('./sd-safe-url.js');

test('sanitizeLocationLabel strips tags and controls', () => {
  assert.strictEqual(
    SDSafeUrl.sanitizeLocationLabel('<img src=x onerror=alert(1)>Denver'),
    'Denver'
  );
  assert.strictEqual(SDSafeUrl.sanitizeLocationLabel('a\u0000b'), 'ab');
  assert.strictEqual(SDSafeUrl.sanitizeLocationLabel('  x  y  '), 'x y');
});

test('sanitizeLocationLabel length cap', () => {
  const long = 'a'.repeat(300);
  assert.ok(SDSafeUrl.sanitizeLocationLabel(long).length <= SDSafeUrl.LOCATION_LABEL_MAX_LEN);
});

test('parseStrictFiniteNumber rejects partial / non-numeric', () => {
  assert.strictEqual(SDSafeUrl.parseStrictFiniteNumber('39.73'), 39.73);
  assert.ok(Number.isNaN(SDSafeUrl.parseStrictFiniteNumber('39.73abc')));
  assert.ok(Number.isNaN(SDSafeUrl.parseStrictFiniteNumber('')));
});

test('parseValidatedLatLon range', () => {
  assert.deepStrictEqual(SDSafeUrl.parseValidatedLatLon('39.73', '-104.98'), { lat: 39.73, lon: -104.98 });
  assert.strictEqual(SDSafeUrl.parseValidatedLatLon('91', '0'), null);
  assert.strictEqual(SDSafeUrl.parseValidatedLatLon('0', '-200'), null);
});

test('parseOriginFromUrlParams requires triple and valid label', () => {
  const ok = new URLSearchParams('lat=39.73&lon=-104.98&loc=Denver%2C+CO');
  assert.deepStrictEqual(SDSafeUrl.parseOriginFromUrlParams(ok), {
    lat: 39.73,
    lon: -104.98,
    label: 'Denver, CO',
  });

  const xss = new URLSearchParams(
    'lat=39.73&lon=-104.98&loc=' +
      encodeURIComponent('<iframe src=evil></iframe>Denver, CO')
  );
  const o = SDSafeUrl.parseOriginFromUrlParams(xss);
  assert.ok(o);
  assert.strictEqual(o.label, 'Denver, CO');
  assert.ok(!o.label.includes('<'));

  const noLoc = new URLSearchParams('lat=1&lon=2');
  assert.strictEqual(SDSafeUrl.parseOriginFromUrlParams(noLoc), null);

  const markupOnly = new URLSearchParams(
    'lat=39.73&lon=-104.98&loc=' + encodeURIComponent('<iframe src=evil></iframe>')
  );
  assert.strictEqual(SDSafeUrl.parseOriginFromUrlParams(markupOnly), null);
});

test('sanitizeSortParam allowlist', () => {
  assert.strictEqual(SDSafeUrl.sanitizeSortParam('planner'), 'planner');
  assert.strictEqual(SDSafeUrl.sanitizeSortParam('javascript:alert(1)'), null);
});

test('parseCompareList only known ids', () => {
  const valid = new Set(['a', 'b', 'c']);
  assert.deepStrictEqual(SDSafeUrl.parseCompareList('a,b', valid), ['a', 'b']);
  assert.strictEqual(SDSafeUrl.parseCompareList('x,y', valid), null);
  assert.deepStrictEqual(SDSafeUrl.parseCompareList('a,b,c', valid), ['a', 'b', 'c']);
});

test('double-encoded loc still neutralized', () => {
  const p = new URLSearchParams(
    'lat=39.73&lon=-104.98&loc=' + encodeURIComponent(encodeURIComponent('<b>x</b>'))
  );
  const o = SDSafeUrl.parseOriginFromUrlParams(p);
  assert.ok(o);
  assert.strictEqual(o.label, 'x');
  assert.ok(!o.label.includes('<'));
});
