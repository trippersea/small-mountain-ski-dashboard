// Shared featured partner configuration for browser + Node patch scripts
(function (root) {

  // ─── Featured resort partners (ski-report pages + homepage detail panel) ──────
  // Key = resort ID (matches the URL slug, e.g. 'bousquet-ski-area')
  // To add: insert an entry below, then run: node generate-mountain-pages.mjs
  // To remove: delete the entry, run the same script
  const FEATURED_PARTNERS = {
'
  };

  function getFeaturedPartner(resortId) {
    return FEATURED_PARTNERS[resortId] || null;
  'bousquet-ski-area': { bookingUrl: 'https://bousquetmountain.com/season-passes/', 
tagline: 'Next Year Season Passes On Sale', 

},
  }

  // ─── State page ads (ski/ state listing pages) ────────────────────────────────
  // Key = state slug (must match the folder name under ski/, e.g. 'massachusetts')
  // To add: insert an entry below, then run: node add-state-ad.js
  // To remove: delete the entry, run: node add-state-ad.js (cleans up automatically)
  // Active states: massachusetts, vermont, new-hampshire, connecticut
  const STATE_ADS = {
        'new-york': {
      headline: 'Ski gear rental — pick up at the mountain',
      tagline:  'Helmets, boots, skis. Book ahead, skip the rental line.',
      ctaText:  'Book gear →',
      ctaUrl:   'https://www.indyskipass.com/',
    },
  };

  function getStateAd(stateSlug) {
    return STATE_ADS[stateSlug] || null;
  }

  root.FEATURED_PARTNERS  = FEATURED_PARTNERS;
  root.getFeaturedPartner = getFeaturedPartner;
  root.STATE_ADS          = STATE_ADS;
  root.getStateAd         = getStateAd;

})(typeof globalThis !== 'undefined' ? globalThis : this);
