// Shared featured partner configuration for browser + Node patch scripts
(function (root) {
  const FEATURED_PARTNERS = {
    'ragged-mountain-resort': {
      bookingUrl: 'https://www.raggedmountainresort.com/tickets',
      tagline: 'Indy Pass accepted · Book direct for best rates',
    },
    'bousquet-ski-area': {
      bookingUrl: 'https://bousquetmountain.com/season-passes/',
      tagline: 'Next Year Season Passes On Sale',
    },
  };

  function getFeaturedPartner(resortId) {
    return FEATURED_PARTNERS[resortId] || null;
  }

  root.FEATURED_PARTNERS = FEATURED_PARTNERS;
  root.getFeaturedPartner = getFeaturedPartner;
})(typeof globalThis !== 'undefined' ? globalThis : this);
