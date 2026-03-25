// Shared featured partner configuration for browser + Node patch scripts
(function (root) {
  const FEATURED_PARTNERS = {
   
  };

  function getFeaturedPartner(resortId) {
    return FEATURED_PARTNERS[resortId] || null;
  }

  root.FEATURED_PARTNERS = FEATURED_PARTNERS;
  root.getFeaturedPartner = getFeaturedPartner;
})(typeof globalThis !== 'undefined' ? globalThis : this);
