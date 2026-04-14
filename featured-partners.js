// Shared featured partner configuration for browser + Node patch scripts
(function (root) {

  // ─── Featured resort partners (ski-report pages + homepage detail panel) ──────
  // Key = resort ID (matches the URL slug, e.g. 'bousquet-ski-area')
  // To add: insert an entry below, then run: node generate-mountain-pages.mjs
  // To remove: delete the entry, run the same script
  const FEATURED_PARTNERS = {
    'bousquet-ski-area': {
      bookingUrl: 'https://bousquetmountain.com/season-passes/',
      tagline: 'Next Year Season Passes On Sale',
    },
  };

  function getFeaturedPartner(resortId) {
    return FEATURED_PARTNERS[resortId] || null;
  }

  // ─── State page ads (ski/ state listing pages) ────────────────────────────────
  // Key = state slug (must match the folder name under ski/, e.g. 'massachusetts')
  // To add: insert an entry below, then run: node add-state-ad.js
  // To remove: delete the entry, then run: node add-state-ad.js (cleans up automatically)
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

  // ─── Sponsor click tracker ────────────────────────────────────────────────────
  // Call this on any partner/sponsor link click.
  // sponsorName  = resort or brand name (e.g. 'Bousquet Mountain')
  // placement    = where on the site (e.g. 'runner_card', 'detail_panel', 'mobile_card', 'state_page')
  // resortPage   = resort slug if on a resort page (e.g. 'bousquet-ski-area'), else ''
  // statePage    = state slug if on a state page (e.g. 'massachusetts'), else ''
  function trackSponsorClick(sponsorName, placement, resortPage, statePage) {
    const sessionId = (function () {
      try {
        let id = sessionStorage.getItem('wsn_session');
        if (!id) { id = Math.random().toString(36).slice(2); sessionStorage.setItem('wsn_session', id); }
        return id;
      } catch (e) { return 'unknown'; }
    })();

    fetch('/api/track-click', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sponsor_name: sponsorName || '',
        placement:    placement   || '',
        resort_page:  resortPage  || '',
        state_page:   statePage   || '',
        session_id:   sessionId
      })
    }).catch(function () {}); // silent fail — never block the navigation
  }

  root.FEATURED_PARTNERS  = FEATURED_PARTNERS;
  root.getFeaturedPartner = getFeaturedPartner;
  root.STATE_ADS          = STATE_ADS;
  root.getStateAd         = getStateAd;
  root.trackSponsorClick  = trackSponsorClick;

})(typeof globalThis !== 'undefined' ? globalThis : this);
