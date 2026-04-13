/**
 * Centralized, defensive parsing for URL/search params (lat/lon/loc, sort, compare).
 * Loaded after sd-data.js; exposes global SDSafeUrl for sd-app.js.
 */
(function (global) {
  'use strict';

  var LOCATION_LABEL_MAX_LEN = 200;

  /** Plain-text location label: no markup, bounded length, normalized whitespace. */
  function sanitizeLocationLabel(input) {
    if (input == null) return '';
    var s = String(input);
    try {
      s = s.normalize('NFKC');
    } catch (e) {}
    for (var d = 0; d < 4; d++) {
      var prev = s;
      try {
        s = decodeURIComponent(s.replace(/\+/g, ' '));
      } catch (e) {
        break;
      }
      if (s === prev) break;
    }
    s = s.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '');
    var tagPasses = 0;
    while (/<\/?[a-zA-Z!][^>]*>/.test(s) && tagPasses < 32) {
      s = s.replace(/<\/?[a-zA-Z!][^>]*>/g, '');
      tagPasses++;
    }
    s = s.replace(/[<>]/g, '');
    s = s.replace(/\bon[a-z]{2,}\s*=/gi, '');
    s = s.replace(/javascript:/gi, '');
    s = s.replace(/\s+/g, ' ').trim();
    if (s.length > LOCATION_LABEL_MAX_LEN) s = s.slice(0, LOCATION_LABEL_MAX_LEN).trim();
    return s;
  }

  function parseStrictFiniteNumber(s) {
    if (s == null || typeof s !== 'string') return NaN;
    var t = s.trim();
    if (!/^-?\d+(\.\d+)?([eE][+-]?\d+)?$/.test(t)) return NaN;
    var n = Number(t);
    return Number.isFinite(n) ? n : NaN;
  }

  /**
   * Valid US/world lat/lon ranges for ski trip origin (rejects NaN and non-decimal strings).
   */
  function parseValidatedLatLon(latStr, lonStr) {
    var lat = parseStrictFiniteNumber(latStr);
    var lon = parseStrictFiniteNumber(lonStr);
    if (!Number.isFinite(lat) || !Number.isFinite(lon)) return null;
    if (lat < -90 || lat > 90 || lon < -180 || lon > 180) return null;
    return { lat: lat, lon: lon };
  }

  /**
   * Origin from ?lat=&lon=&loc= only if all three are present and valid after sanitization.
   */
  function parseOriginFromUrlParams(p) {
    if (!p || typeof p.get !== 'function') return null;
    var locRaw = p.get('loc');
    if (locRaw == null || locRaw === '') return null;
    var coords = parseValidatedLatLon(p.get('lat'), p.get('lon'));
    if (!coords) return null;
    var label = sanitizeLocationLabel(locRaw);
    if (!label) return null;
    return { lat: coords.lat, lon: coords.lon, label: label };
  }

  var TABLE_SORT_KEYS = [
    'planner', 'storm', 'hist7day', 'drive', 'price', 'vertical', 'avgSnowfall',
    'trails', 'crowd', 'state', 'pass', 'name',
  ];
  var SORT_SET = Object.freeze(new Set(TABLE_SORT_KEYS));

  function sanitizeSortParam(v) {
    if (v == null || typeof v !== 'string') return null;
    return SORT_SET.has(v) ? v : null;
  }

  var MAX_COMPARE_IDS = 16;

  /**
   * @param {string} raw — comma-separated resort ids
   * @param {Set<string>|string[]} validIds
   */
  function parseCompareList(raw, validIds) {
    if (raw == null || typeof raw !== 'string') return null;
    var set = validIds instanceof Set ? validIds : new Set(validIds);
    var ids = raw.split(',').map(function (s) { return s.trim(); }).filter(Boolean);
    var out = [];
    for (var i = 0; i < ids.length && out.length < MAX_COMPARE_IDS; i++) {
      var id = ids[i];
      if (set.has(id)) out.push(id);
    }
    return out.length >= 2 ? out : null;
  }

  global.SDSafeUrl = {
    LOCATION_LABEL_MAX_LEN: LOCATION_LABEL_MAX_LEN,
    sanitizeLocationLabel: sanitizeLocationLabel,
    parseStrictFiniteNumber: parseStrictFiniteNumber,
    parseValidatedLatLon: parseValidatedLatLon,
    parseOriginFromUrlParams: parseOriginFromUrlParams,
    TABLE_SORT_KEYS: TABLE_SORT_KEYS,
    sanitizeSortParam: sanitizeSortParam,
    parseCompareList: parseCompareList,
  };
})(typeof globalThis !== 'undefined' ? globalThis : this);

if (typeof module !== 'undefined' && module.exports) {
  module.exports = globalThis.SDSafeUrl;
}
