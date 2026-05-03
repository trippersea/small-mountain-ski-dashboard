/**
 * resort-sources-seed.js
 *
 * Hand-curated source mappings that override automated lookup output.
 * The merge script (scripts/merge-sources.mjs) applies these values
 * with highest priority -- they win over whatever the lookup scripts find.
 *
 * Use this file for:
 *   - Pre-populated entries you're confident about
 *   - Manual corrections after reviewing lookup output
 *   - Resorts where the automated match was wrong
 *
 * Leave a resort out of this file entirely if you want the lookup result.
 * Set a field to null to explicitly clear a lookup result.
 *
 * NWS confidence levels:
 *   high   = station within ~10mi, within ~500ft of summit elevation
 *   medium = station within ~25mi, within ~1200ft of summit elevation
 *   low    = station is far away or at dramatically different elevation
 *            -> collector should weight Open-Meteo more heavily for this resort
 */

const RESORT_SOURCES_SEED = {

  // =========================================================================
  // VERMONT
  // =========================================================================

  'stowe-mountain-resort': {
    nwsStationId:  'KMVL',   // Morrisville-Stowe State Airport -- 6mi, good match
    nwsConfidence: 'medium', // 1,400ft lower than summit but closest quality station
    snotelTriplet: null,
    liftieSlug:    'stowe',
  },

  'killington-resort': {
    nwsStationId:  'KRUT',   // Rutland Southern VT Regional -- 18mi, 2,400ft lower
    nwsConfidence: 'low',    // valley station, poor elevation match for K peak
    snotelTriplet: null,
    liftieSlug:    'killington',
  },

  'sugarbush-resort': {
    nwsStationId:  'KMPV',   // Edward F Knapp State -- central VT, 25mi
    nwsConfidence: 'low',
    snotelTriplet: null,
    liftieSlug:    'sugarbush',
  },

  'mad-river-glen': {
    nwsStationId:  'KMPV',
    nwsConfidence: 'low',
    snotelTriplet: null,
    liftieSlug:    'mad-river-glen',
  },

  'jay-peak-resort': {
    nwsStationId:  'KBTV',   // Burlington -- 45mi, poor match but best available
    nwsConfidence: 'low',
    snotelTriplet: null,
    liftieSlug:    'jay-peak',
  },

  'magic-mountain-vt': {
    nwsStationId:  'KRUT',
    nwsConfidence: 'low',
    snotelTriplet: null,
    liftieSlug:    'magic-mountain',
  },

  'okemo-mountain-resort': {
    nwsStationId:  'KRUT',   // Rutland -- 20mi, closest to Ludlow area
    nwsConfidence: 'low',
    snotelTriplet: null,
    liftieSlug:    'okemo',
  },

  'mount-snow-resort': {
    nwsStationId:  'KASH',   // Nashua NH / Boire Field -- or KBTV backup
    nwsConfidence: 'low',
    snotelTriplet: null,
    liftieSlug:    'mount-snow',
  },

  'stratton-mountain-resort': {
    nwsStationId:  'KRUT',
    nwsConfidence: 'low',
    snotelTriplet: null,
    liftieSlug:    'stratton',
  },

  'bromley-mountain': {
    nwsStationId:  'KRUT',
    nwsConfidence: 'low',
    snotelTriplet: null,
    liftieSlug:    'bromley',
  },

  'pico-mountain': {
    nwsStationId:  'KRUT',   // 12mi -- best VT station for Pico area
    nwsConfidence: 'medium',
    snotelTriplet: null,
    liftieSlug:    'pico',
  },

  'bolton-valley-resort': {
    nwsStationId:  'KBTV',   // Burlington -- 25mi but reasonable for north-central VT
    nwsConfidence: 'low',
    snotelTriplet: null,
    liftieSlug:    'bolton-valley',
  },

  'burke-mountain': {
    nwsStationId:  'KBTV',
    nwsConfidence: 'low',
    snotelTriplet: null,
    liftieSlug:    'burke',
  },

  'smugglers-notch-resort': {
    nwsStationId:  'KBTV',
    nwsConfidence: 'low',
    snotelTriplet: null,
    liftieSlug:    'smugglers-notch',
  },

  'middlebury-snow-bowl': {
    nwsStationId:  'KBTV',
    nwsConfidence: 'low',
    snotelTriplet: null,
    liftieSlug:    null,   // small college ski area, likely not on Liftie
  },

  'bousquet-mountain': {
    nwsStationId:  'KPSF',   // Pittsfield MA -- 8mi, excellent match for Berkshires
    nwsConfidence: 'high',
    snotelTriplet: null,
    liftieSlug:    null,
  },

  // =========================================================================
  // NEW HAMPSHIRE
  // =========================================================================

  'loon-mountain-resort': {
    nwsStationId:  'KLEB',   // Lebanon NH -- 18mi, central NH station
    nwsConfidence: 'medium',
    snotelTriplet: null,
    liftieSlug:    'loon',
  },

  'cannon-mountain': {
    nwsStationId:  'KLEB',
    nwsConfidence: 'medium',
    snotelTriplet: null,
    liftieSlug:    'cannon',
  },

  'waterville-valley-resort': {
    nwsStationId:  'KLEB',
    nwsConfidence: 'medium',
    snotelTriplet: null,
    liftieSlug:    'waterville-valley',
  },

  'bretton-woods-ski-area': {
    nwsStationId:  'KLEB',
    nwsConfidence: 'low',    // Bretton Woods is far north, Lebanon is south-central
    snotelTriplet: null,
    liftieSlug:    'bretton-woods',
  },

  'attitash-mountain-resort': {
    nwsStationId:  'KLEB',
    nwsConfidence: 'low',
    snotelTriplet: null,
    liftieSlug:    'attitash',
  },

  'wildcat-mountain': {
    nwsStationId:  'KLEB',
    nwsConfidence: 'low',
    snotelTriplet: null,
    liftieSlug:    'wildcat',
  },

  'cranmore-mountain-resort': {
    nwsStationId:  'KLEB',
    nwsConfidence: 'medium',
    snotelTriplet: null,
    liftieSlug:    'cranmore',
  },

  'gunstock-mountain-resort': {
    nwsStationId:  'KCON',   // Concord NH -- 30mi, best for south-central NH
    nwsConfidence: 'low',
    snotelTriplet: null,
    liftieSlug:    'gunstock',
  },

  'pats-peak': {
    nwsStationId:  'KCON',
    nwsConfidence: 'medium',
    snotelTriplet: null,
    liftieSlug:    null,
  },

  // =========================================================================
  // MAINE
  // =========================================================================

  'sunday-river': {
    nwsStationId:  'KPWM',   // Portland ME -- 55mi, best available for western ME
    nwsConfidence: 'low',
    snotelTriplet: null,
    liftieSlug:    'sunday-river',
  },

  'sugarloaf-mountain': {
    nwsStationId:  'KBGR',   // Bangor -- 60mi, low confidence but best in state
    nwsConfidence: 'low',
    snotelTriplet: null,
    liftieSlug:    'sugarloaf',
  },

  'saddleback-maine': {
    nwsStationId:  'KBGR',
    nwsConfidence: 'low',
    snotelTriplet: null,
    liftieSlug:    null,
  },

  'lost-valley': {
    nwsStationId:  'KPWM',
    nwsConfidence: 'medium',
    snotelTriplet: null,
    liftieSlug:    null,
  },

  // =========================================================================
  // MASSACHUSETTS
  // =========================================================================

  'wachusett-mountain': {
    nwsStationId:  'KORE',   // Orange MA -- 15mi, good match for central MA
    nwsConfidence: 'high',
    snotelTriplet: null,
    liftieSlug:    'wachusett',
  },

  'jiminy-peak': {
    nwsStationId:  'KPSF',   // Pittsfield MA -- 12mi, excellent for Berkshires
    nwsConfidence: 'high',
    snotelTriplet: null,
    liftieSlug:    'jiminy-peak',
  },

  'berkshire-east': {
    nwsStationId:  'KORE',
    nwsConfidence: 'high',
    snotelTriplet: null,
    liftieSlug:    null,
  },

  'ski-butternut': {
    nwsStationId:  'KPSF',
    nwsConfidence: 'high',
    snotelTriplet: null,
    liftieSlug:    null,
  },

  // =========================================================================
  // CONNECTICUT / RHODE ISLAND
  // =========================================================================

  'mohawk-mountain': {
    nwsStationId:  'KBDL',   // Bradley/Windsor Locks CT -- 25mi
    nwsConfidence: 'medium',
    snotelTriplet: null,
    liftieSlug:    null,
  },

  'ski-sundown': {
    nwsStationId:  'KBDL',
    nwsConfidence: 'medium',
    snotelTriplet: null,
    liftieSlug:    null,
  },

  'mount-southington': {
    nwsStationId:  'KBDL',
    nwsConfidence: 'medium',
    snotelTriplet: null,
    liftieSlug:    null,
  },

  // =========================================================================
  // NEW YORK
  // =========================================================================

  'whiteface-mountain': {
    nwsStationId:  'KSLK',   // Saranac Lake -- 18mi, best Adirondack station
    nwsConfidence: 'medium',
    snotelTriplet: null,
    liftieSlug:    'whiteface',
  },

  'gore-mountain': {
    nwsStationId:  'KSLK',
    nwsConfidence: 'medium',
    snotelTriplet: null,
    liftieSlug:    'gore',
  },

  'mccauley-mountain': {
    nwsStationId:  'KSLK',
    nwsConfidence: 'low',
    snotelTriplet: null,
    liftieSlug:    null,
  },

  'belleayre-mountain': {
    nwsStationId:  'KMGJ',   // Orange County NY -- 30mi, closest to Catskills
    nwsConfidence: 'low',
    snotelTriplet: null,
    liftieSlug:    'belleayre',
  },

  'hunter-mountain': {
    nwsStationId:  'KMGJ',
    nwsConfidence: 'low',
    snotelTriplet: null,
    liftieSlug:    'hunter',
  },

  'windham-mountain': {
    nwsStationId:  'KMGJ',
    nwsConfidence: 'low',
    snotelTriplet: null,
    liftieSlug:    'windham',
  },

  'bristol-mountain': {
    nwsStationId:  'KROC',   // Rochester NY -- 25mi
    nwsConfidence: 'medium',
    snotelTriplet: null,
    liftieSlug:    null,
  },

  'holiday-valley': {
    nwsStationId:  'KJHW',   // Jamestown NY -- 15mi, good match
    nwsConfidence: 'high',
    snotelTriplet: null,
    liftieSlug:    'holiday-valley',
  },

  'greek-peak-mountain-resort': {
    nwsStationId:  'KITH',   // Ithaca Tompkins -- 20mi
    nwsConfidence: 'medium',
    snotelTriplet: null,
    liftieSlug:    'greek-peak',
  },

  // =========================================================================
  // NEW JERSEY / PENNSYLVANIA
  // =========================================================================

  'mountain-creek-resort': {
    nwsStationId:  'KCDW',   // Caldwell NJ -- 20mi, reasonable NJ match
    nwsConfidence: 'medium',
    snotelTriplet: null,
    liftieSlug:    'mountain-creek',
  },

  'camelback-mountain-resort': {
    nwsStationId:  'KAVP',   // Wilkes-Barre/Scranton -- 20mi
    nwsConfidence: 'medium',
    snotelTriplet: null,
    liftieSlug:    'camelback',
  },

  'jack-frost-mountain': {
    nwsStationId:  'KAVP',
    nwsConfidence: 'medium',
    snotelTriplet: null,
    liftieSlug:    'jack-frost',
  },

  'big-boulder-ski-area': {
    nwsStationId:  'KAVP',
    nwsConfidence: 'medium',
    snotelTriplet: null,
    liftieSlug:    'big-boulder',
  },

  'blue-mountain-resort-pa': {
    nwsStationId:  'KABE',   // Allentown PA -- 20mi, good for Blue Mountain
    nwsConfidence: 'medium',
    snotelTriplet: null,
    liftieSlug:    'blue-mountain',
  },

  'elk-mountain-ski-resort': {
    nwsStationId:  'KBFD',   // Bradford PA -- 30mi, best for northeastern PA
    nwsConfidence: 'low',
    snotelTriplet: null,
    liftieSlug:    'elk-mountain',
  },

  'seven-springs-mountain-resort': {
    nwsStationId:  'KPIT',   // Pittsburgh -- 50mi, poor but best available
    nwsConfidence: 'low',
    snotelTriplet: null,
    liftieSlug:    'seven-springs',
  },

  'hidden-valley-resort-pa': {
    nwsStationId:  'KPIT',
    nwsConfidence: 'low',
    snotelTriplet: null,
    liftieSlug:    'hidden-valley',
  },

  // =========================================================================
  // MARYLAND / VIRGINIA / WEST VIRGINIA
  // =========================================================================

  'wisp-resort': {
    nwsStationId:  'KCKB',   // Clarksburg WV -- 40mi, best for western MD
    nwsConfidence: 'low',
    snotelTriplet: null,
    liftieSlug:    'wisp',
  },

  'wintergreen-resort': {
    nwsStationId:  'KCHO',   // Charlottesville VA -- 30mi
    nwsConfidence: 'low',
    snotelTriplet: null,
    liftieSlug:    'wintergreen',
  },

  'massanutten-resort': {
    nwsStationId:  'KSHD',   // Staunton-Waynesboro -- 20mi
    nwsConfidence: 'medium',
    snotelTriplet: null,
    liftieSlug:    'massanutten',
  },

  'bryce-resort': {
    nwsStationId:  'KSHD',
    nwsConfidence: 'low',
    snotelTriplet: null,
    liftieSlug:    null,
  },

  'the-homestead': {
    nwsStationId:  'KHLX',   // Galax-Hillsville VA -- 30mi, better than SHD for hot springs area
    nwsConfidence: 'low',
    snotelTriplet: null,
    liftieSlug:    null,
  },

  'snowshoe-mountain': {
    nwsStationId:  'KLWB',   // Greenbrier Valley WV -- 30mi, best for WV highlands
    nwsConfidence: 'low',    // Snowshoe summit at 4,848ft, LWB at 2,300ft -- big delta
    snotelTriplet: null,
    liftieSlug:    'snowshoe',
  },

  // =========================================================================
  // NORTH CAROLINA / TENNESSEE
  // =========================================================================

  'beech-mountain-resort': {
    nwsStationId:  'KBKV',   // closest NC mountain airport, or use KTRI (Tri-Cities)
    nwsConfidence: 'low',
    snotelTriplet: null,
    liftieSlug:    'beech-mountain',
  },

  'appalachian-ski-mountain': {
    nwsStationId:  'KBKV',
    nwsConfidence: 'low',
    snotelTriplet: null,
    liftieSlug:    null,
  },

  'cataloochee-ski-area': {
    nwsStationId:  'KAVL',   // Asheville -- 40mi, best available western NC
    nwsConfidence: 'low',
    snotelTriplet: null,
    liftieSlug:    null,
  },

  'wolf-ridge-ski-resort': {
    nwsStationId:  'KAVL',
    nwsConfidence: 'low',
    snotelTriplet: null,
    liftieSlug:    null,
  },

  'ober-gatlinburg': {
    nwsStationId:  'KTYS',   // Knoxville -- 40mi
    nwsConfidence: 'low',
    snotelTriplet: null,
    liftieSlug:    null,
  },

  // =========================================================================
  // MICHIGAN
  // =========================================================================

  'boyne-highlands': {
    nwsStationId:  'KPLN',   // Pellston -- 10mi, excellent match for northern MI
    nwsConfidence: 'high',
    snotelTriplet: null,
    liftieSlug:    'boyne-highlands',
  },

  'boyne-mountain': {
    nwsStationId:  'KPLN',
    nwsConfidence: 'high',
    snotelTriplet: null,
    liftieSlug:    'boyne-mountain',
  },

  'nubs-nob': {
    nwsStationId:  'KPLN',
    nwsConfidence: 'high',
    snotelTriplet: null,
    liftieSlug:    'nubs-nob',
  },

  'crystal-mountain-mi': {
    nwsStationId:  'KTVC',   // Traverse City -- 25mi
    nwsConfidence: 'medium',
    snotelTriplet: null,
    liftieSlug:    'crystal-mountain',
  },

  'shanty-creek-resort': {
    nwsStationId:  'KPLN',
    nwsConfidence: 'medium',
    snotelTriplet: null,
    liftieSlug:    'shanty-creek',
  },

  'big-powderhorn-mountain': {
    nwsStationId:  'KIWD',   // Ironwood MI -- 8mi, excellent match for UP
    nwsConfidence: 'high',
    snotelTriplet: null,
    liftieSlug:    'big-powderhorn',
  },

  'indianhead-mountain': {
    nwsStationId:  'KIWD',
    nwsConfidence: 'high',
    snotelTriplet: null,
    liftieSlug:    null,
  },

  'blackjack-ski-resort': {
    nwsStationId:  'KIWD',
    nwsConfidence: 'high',
    snotelTriplet: null,
    liftieSlug:    null,
  },

  'ski-brule': {
    nwsStationId:  'KIWD',
    nwsConfidence: 'medium',
    snotelTriplet: null,
    liftieSlug:    null,
  },

  'pine-knob-ski-resort': {
    nwsStationId:  'KDET',   // Detroit -- 25mi, best for southern MI
    nwsConfidence: 'medium',
    snotelTriplet: null,
    liftieSlug:    'pine-knob',
  },

  'alpine-valley-mi': {
    nwsStationId:  'KDET',
    nwsConfidence: 'medium',
    snotelTriplet: null,
    liftieSlug:    'alpine-valley',
  },

  // =========================================================================
  // WISCONSIN
  // =========================================================================

  'granite-peak-wi': {
    nwsStationId:  'KCWA',   // Mosinee/Wausau -- 10mi, good central WI match
    nwsConfidence: 'high',
    snotelTriplet: null,
    liftieSlug:    'granite-peak',
  },

  'whitecap-mountains': {
    nwsStationId:  'KRHI',   // Rhinelander -- 30mi, best northern WI
    nwsConfidence: 'medium',
    snotelTriplet: null,
    liftieSlug:    null,
  },

  'devils-head-resort': {
    nwsStationId:  'KMSN',   // Madison -- 30mi, central WI
    nwsConfidence: 'medium',
    snotelTriplet: null,
    liftieSlug:    'devils-head',
  },

  'cascade-mountain-wi': {
    nwsStationId:  'KMSN',
    nwsConfidence: 'medium',
    snotelTriplet: null,
    liftieSlug:    'cascade-mountain',
  },

  'mount-la-crosse': {
    nwsStationId:  'KLSE',   // La Crosse -- 5mi, excellent match
    nwsConfidence: 'high',
    snotelTriplet: null,
    liftieSlug:    null,
  },

  // =========================================================================
  // COLORADO
  // =========================================================================

  'vail-ski-resort': {
    nwsStationId:  'KEGE',   // Eagle County Regional -- 12mi, best for Vail Valley
    nwsConfidence: 'medium', // Eagle at 6,547ft, Vail summit at 11,570ft -- significant delta
    snotelTriplet: '1049:CO:SNTL', // Vail Mountain SNOTEL
    liftieSlug:    'vail',
  },

  'beaver-creek-resort': {
    nwsStationId:  'KEGE',
    nwsConfidence: 'medium',
    snotelTriplet: '1049:CO:SNTL',
    liftieSlug:    'beaver-creek',
  },

  'breckenridge-ski-resort': {
    nwsStationId:  'KBKF',   // Buckley/Aurora -- 70mi, or use KDEN as fallback
    nwsConfidence: 'low',    // Summit County has no good nearby NWS station
    snotelTriplet: '384:CO:SNTL',  // Breckenridge SNOTEL at ~11,000ft
    liftieSlug:    'breckenridge',
  },

  'keystone-resort': {
    nwsStationId:  'KBKF',
    nwsConfidence: 'low',
    snotelTriplet: '384:CO:SNTL',  // Breckenridge station is closest quality SNOTEL
    liftieSlug:    'keystone',
  },

  'arapahoe-basin': {
    nwsStationId:  'KBKF',
    nwsConfidence: 'low',
    snotelTriplet: '384:CO:SNTL',
    liftieSlug:    'a-basin',
  },

  'copper-mountain-resort': {
    nwsStationId:  'KEGE',
    nwsConfidence: 'low',
    snotelTriplet: '415:CO:SNTL',  // Fremont Pass SNOTEL
    liftieSlug:    'copper-mountain',
  },

  'loveland-ski-area': {
    nwsStationId:  'KBKF',
    nwsConfidence: 'low',
    snotelTriplet: '415:CO:SNTL',
    liftieSlug:    'loveland',
  },

  'winter-park-resort': {
    nwsStationId:  'KBKF',
    nwsConfidence: 'low',
    snotelTriplet: '551:CO:SNTL',  // Berthoud Summit SNOTEL
    liftieSlug:    'winter-park',
  },

  'steamboat-ski-resort': {
    nwsStationId:  'KSBS',   // Bob Adams Field Steamboat -- 8mi, good match
    nwsConfidence: 'medium', // Airport at 6,882ft, resort base at 6,900ft -- excellent
    snotelTriplet: '680:CO:SNTL',  // Storm Peak SNOTEL at Steamboat
    liftieSlug:    'steamboat',
  },

  'telluride-ski-resort': {
    nwsStationId:  'KTEX',   // Telluride Regional -- 5mi, excellent proximity
    nwsConfidence: 'medium',
    snotelTriplet: '739:CO:SNTL',  // Lizard Head Pass area
    liftieSlug:    'telluride',
  },

  'aspen-snowmass': {
    nwsStationId:  'KASE',   // Aspen/Pitkin County -- 5mi, excellent
    nwsConfidence: 'medium',
    snotelTriplet: '1050:CO:SNTL', // Independence Pass SNOTEL
    liftieSlug:    'aspen',
  },

  'aspen-mountain': {
    nwsStationId:  'KASE',
    nwsConfidence: 'medium',
    snotelTriplet: '1050:CO:SNTL',
    liftieSlug:    'ajax',
  },

  'buttermilk-ski-area': {
    nwsStationId:  'KASE',
    nwsConfidence: 'medium',
    snotelTriplet: '1050:CO:SNTL',
    liftieSlug:    'buttermilk',
  },

  'crested-butte-mountain-resort': {
    nwsStationId:  'KGUC',   // Gunnison/Crested Butte -- 30mi, only reasonable option
    nwsConfidence: 'low',
    snotelTriplet: '433:CO:SNTL',  // Schofield Pass SNOTEL
    liftieSlug:    'crested-butte',
  },

  'purgatory-resort': {
    nwsStationId:  'KDRO',   // Durango La Plata County -- 25mi
    nwsConfidence: 'low',
    snotelTriplet: '589:CO:SNTL',  // Cascade Divide SNOTEL
    liftieSlug:    'purgatory',
  },

  'wolf-creek-ski-area': {
    nwsStationId:  'KALS',   // Alamosa -- 50mi, best available for south-central CO
    nwsConfidence: 'low',
    snotelTriplet: '780:CO:SNTL',  // Wolf Creek Summit SNOTEL
    liftieSlug:    null,
  },

  'monarch-mountain': {
    nwsStationId:  'KGUC',
    nwsConfidence: 'low',
    snotelTriplet: '580:CO:SNTL',  // Monarch Pass SNOTEL
    liftieSlug:    null,
  },

  'eldora-mountain-resort': {
    nwsStationId:  'KBKF',
    nwsConfidence: 'low',
    snotelTriplet: '551:CO:SNTL',
    liftieSlug:    'eldora',
  },

  'ski-cooper': {
    nwsStationId:  'KEGE',
    nwsConfidence: 'low',
    snotelTriplet: '415:CO:SNTL',
    liftieSlug:    null,
  },

  // =========================================================================
  // UTAH
  // =========================================================================

  'snowbird': {
    nwsStationId:  'KSLC',   // Salt Lake City -- 25mi, but 7,500ft lower than summit
    nwsConfidence: 'low',    // SNOTEL is far better signal for Snowbird
    snotelTriplet: '1125:UT:SNTL', // Snowbird SNOTEL at ~9,000ft
    liftieSlug:    'snowbird',
  },

  'alta-ski-area': {
    nwsStationId:  'KSLC',
    nwsConfidence: 'low',
    snotelTriplet: '1025:UT:SNTL', // Alta Collins SNOTEL -- one of the best in the West
    liftieSlug:    'alta',
  },

  'solitude-mountain-resort': {
    nwsStationId:  'KSLC',
    nwsConfidence: 'low',
    snotelTriplet: '1115:UT:SNTL', // Big Cottonwood Canyon area
    liftieSlug:    'solitude',
  },

  'brighton-resort': {
    nwsStationId:  'KSLC',
    nwsConfidence: 'low',
    snotelTriplet: '1115:UT:SNTL',
    liftieSlug:    'brighton',
  },

  'park-city-mountain-resort': {
    nwsStationId:  'KSLC',
    nwsConfidence: 'low',
    snotelTriplet: '1115:UT:SNTL', // closest SNOTEL to Park City
    liftieSlug:    'park-city',
  },

  'deer-valley-resort': {
    nwsStationId:  'KSLC',
    nwsConfidence: 'low',
    snotelTriplet: '1115:UT:SNTL',
    liftieSlug:    'deer-valley',
  },

  'snowbasin-resort': {
    nwsStationId:  'KOGD',   // Ogden -- 15mi, better than SLC for northern UT
    nwsConfidence: 'medium',
    snotelTriplet: '1063:UT:SNTL', // Ben Lomond Peak area
    liftieSlug:    'snowbasin',
  },

  'sundance-resort': {
    nwsStationId:  'KPVU',   // Provo -- 15mi, best for south UT Valley
    nwsConfidence: 'low',
    snotelTriplet: '1023:UT:SNTL', // Timpanogos Divide
    liftieSlug:    null,
  },

  'brian-head-resort': {
    nwsStationId:  'KCDC',   // Cedar City -- 30mi, best available southern UT
    nwsConfidence: 'low',
    snotelTriplet: '1015:UT:SNTL', // Brian Head SNOTEL
    liftieSlug:    null,
  },

  'beaver-mountain-ut': {
    nwsStationId:  'KLGU',   // Logan UT -- 20mi, reasonable for Bear River range
    nwsConfidence: 'medium',
    snotelTriplet: '1008:UT:SNTL', // Garden City area
    liftieSlug:    null,
  },

  // =========================================================================
  // WYOMING
  // =========================================================================

  'jackson-hole-mountain-resort': {
    nwsStationId:  'KJAC',   // Jackson Hole -- 10mi, excellent match
    nwsConfidence: 'medium', // Airport at 6,451ft, resort base at 6,311ft -- very close
    snotelTriplet: '1050:WY:SNTL', // Rendezvous Mountain area
    liftieSlug:    'jackson-hole',
  },

  'grand-targhee-resort': {
    nwsStationId:  'KJAC',   // Jackson -- 25mi west side of Tetons
    nwsConfidence: 'medium',
    snotelTriplet: '1042:WY:SNTL', // Grand Targhee area
    liftieSlug:    'grand-targhee',
  },

  'snow-king-mountain': {
    nwsStationId:  'KJAC',   // Jackson town -- 2mi, excellent proximity
    nwsConfidence: 'high',
    snotelTriplet: null,     // Snow King is a town hill, SNOTEL not needed
    liftieSlug:    'snow-king',
  },

  // =========================================================================
  // MONTANA
  // =========================================================================

  'big-sky-resort': {
    nwsStationId:  'KBZN',   // Bozeman Yellowstone -- 40mi
    nwsConfidence: 'low',    // Big Sky summit at 11,166ft, BZN at 4,473ft -- huge delta
    snotelTriplet: '1016:MT:SNTL', // Lone Mountain SNOTEL
    liftieSlug:    'big-sky',
  },

  'whitefish-mountain-resort': {
    nwsStationId:  'KFCA',   // Glacier Park International -- 10mi, good match
    nwsConfidence: 'medium',
    snotelTriplet: '1024:MT:SNTL', // Whitefish Divide area
    liftieSlug:    'whitefish',
  },

  'bridger-bowl': {
    nwsStationId:  'KBZN',   // Bozeman -- 15mi, reasonable
    nwsConfidence: 'medium',
    snotelTriplet: '1003:MT:SNTL', // Showdown area or Bridger Range
    liftieSlug:    'bridger-bowl',
  },

  // =========================================================================
  // IDAHO
  // =========================================================================

  'sun-valley-resort': {
    nwsStationId:  'KSUN',   // Hailey -- 12mi, excellent match for Wood River Valley
    nwsConfidence: 'medium',
    snotelTriplet: '811:ID:SNTL',  // Galena Summit SNOTEL
    liftieSlug:    'sun-valley',
  },

  'bogus-basin': {
    nwsStationId:  'KBOI',   // Boise -- 16mi, reasonable for south-central ID
    nwsConfidence: 'medium',
    snotelTriplet: '978:ID:SNTL',  // Bogus Basin SNOTEL
    liftieSlug:    'bogus-basin',
  },

  'brundage-mountain': {
    nwsStationId:  'KMUO',   // Mountain Home -- 90mi, poor -- let lookup find better
    nwsConfidence: 'low',
    snotelTriplet: '357:ID:SNTL',  // Goose Creek Summit area
    liftieSlug:    null,
  },

  'tamarack-resort': {
    nwsStationId:  'KBOI',
    nwsConfidence: 'low',
    snotelTriplet: '978:ID:SNTL',
    liftieSlug:    null,
  },

  'silver-mountain-resort': {
    nwsStationId:  'KCOE',   // Coeur d'Alene -- 30mi, best for northern ID
    nwsConfidence: 'low',
    snotelTriplet: '888:ID:SNTL',  // Mullan Pass area
    liftieSlug:    'silver-mountain',
  },

  // =========================================================================
  // NEVADA
  // =========================================================================

  'mount-rose-ski-tahoe': {
    nwsStationId:  'KRNO',   // Reno -- 20mi, valley station but best available
    nwsConfidence: 'low',
    snotelTriplet: '1050:NV:SNTL', // Mt Rose SNOTEL
    liftieSlug:    'mount-rose',
  },

  'diamond-peak': {
    nwsStationId:  'KRNO',
    nwsConfidence: 'low',
    snotelTriplet: '1050:NV:SNTL',
    liftieSlug:    'diamond-peak',
  },

  'lee-canyon': {
    nwsStationId:  'KLAS',   // Las Vegas -- 35mi, only option for southern NV
    nwsConfidence: 'low',
    snotelTriplet: '1183:NV:SNTL', // Lee Canyon SNOTEL
    liftieSlug:    null,
  },

  // =========================================================================
  // CALIFORNIA
  // =========================================================================

  'palisades-tahoe': {
    nwsStationId:  'KTRK',   // Truckee -- 8mi, excellent for North Tahoe
    nwsConfidence: 'medium',
    snotelTriplet: '1050:CA:SNTL', // Tahoe City area SNOTEL
    liftieSlug:    'palisades-tahoe',
  },

  'northstar-california': {
    nwsStationId:  'KTRK',
    nwsConfidence: 'medium',
    snotelTriplet: '1050:CA:SNTL',
    liftieSlug:    'northstar',
  },

  'heavenly-mountain-resort': {
    nwsStationId:  'KTVL',   // South Lake Tahoe -- 5mi, excellent match
    nwsConfidence: 'medium',
    snotelTriplet: '778:CA:SNTL',  // Echo Summit SNOTEL
    liftieSlug:    'heavenly',
  },

  'kirkwood-mountain': {
    nwsStationId:  'KTVL',
    nwsConfidence: 'low',    // Kirkwood is south and higher than SLT
    snotelTriplet: '778:CA:SNTL',  // Echo Summit
    liftieSlug:    'kirkwood',
  },

  'sierra-at-tahoe': {
    nwsStationId:  'KTVL',
    nwsConfidence: 'medium',
    snotelTriplet: '778:CA:SNTL',
    liftieSlug:    'sierra-at-tahoe',
  },

  'mammoth-mountain': {
    nwsStationId:  'KMMH',   // Mammoth Lakes -- 5mi, excellent match
    nwsConfidence: 'medium',
    snotelTriplet: '1243:CA:SNTL', // Mammoth Mountain SNOTEL at 10,500ft
    liftieSlug:    'mammoth',
  },

  'homewood-mountain-resort': {
    nwsStationId:  'KTRK',
    nwsConfidence: 'medium',
    snotelTriplet: '1050:CA:SNTL',
    liftieSlug:    null,
  },

  'mount-shasta-ski-park': {
    nwsStationId:  'KMHS',   // Mt Shasta -- 10mi, good match
    nwsConfidence: 'medium',
    snotelTriplet: '869:CA:SNTL',  // Mt Shasta SNOTEL
    liftieSlug:    null,
  },

  // =========================================================================
  // OREGON
  // =========================================================================

  'mt-hood-meadows': {
    nwsStationId:  'KPDX',   // Portland -- 50mi, valley station
    nwsConfidence: 'low',    // Hood summit at 11,240ft -- huge delta from Portland
    snotelTriplet: '650:OR:SNTL',  // Mt Hood SNOTEL at ~5,900ft
    liftieSlug:    'mt-hood-meadows',
  },

  'timberline-lodge': {
    nwsStationId:  'KPDX',
    nwsConfidence: 'low',
    snotelTriplet: '650:OR:SNTL',
    liftieSlug:    'timberline',
  },

  'mt-bachelor': {
    nwsStationId:  'KRDM',   // Redmond OR -- 25mi, reasonable for Central OR
    nwsConfidence: 'medium',
    snotelTriplet: '548:OR:SNTL',  // Bachelor area SNOTEL
    liftieSlug:    'mt-bachelor',
  },

  'mt-hood-skibowl': {
    nwsStationId:  'KPDX',
    nwsConfidence: 'low',
    snotelTriplet: '650:OR:SNTL',
    liftieSlug:    'skibowl',
  },

  // =========================================================================
  // WASHINGTON
  // =========================================================================

  'summit-at-snoqualmie': {
    nwsStationId:  'KSEA',   // Seattle-Tacoma -- 45mi
    nwsConfidence: 'low',
    snotelTriplet: '1050:WA:SNTL', // Snoqualmie Pass SNOTEL
    liftieSlug:    'the-summit-at-snoqualmie',
  },

  'mt-baker-ski-area': {
    nwsStationId:  'KBLI',   // Bellingham -- 30mi
    nwsConfidence: 'low',
    snotelTriplet: '1024:WA:SNTL', // Mt Baker area
    liftieSlug:    'mt-baker',
  },

  'white-pass-ski-area': {
    nwsStationId:  'KYKM',   // Yakima -- 50mi, best available for south cascades
    nwsConfidence: 'low',
    snotelTriplet: '778:WA:SNTL',  // White Pass SNOTEL
    liftieSlug:    'white-pass',
  },

  'mission-ridge': {
    nwsStationId:  'KEAT',   // Pangborn/Wenatchee -- 15mi, good eastern WA match
    nwsConfidence: 'medium',
    snotelTriplet: '778:WA:SNTL',
    liftieSlug:    'mission-ridge',
  },

  '49-degrees-north': {
    nwsStationId:  'KGEG',   // Spokane -- 40mi
    nwsConfidence: 'low',
    snotelTriplet: '778:WA:SNTL',
    liftieSlug:    '49-degrees-north',
  },

  // =========================================================================
  // NEW MEXICO
  // =========================================================================

  'taos-ski-valley': {
    nwsStationId:  'KTAOS',  // Taos Municipal -- 8mi, good match
    nwsConfidence: 'medium',
    snotelTriplet: '892:NM:SNTL',  // Taos Ski Valley SNOTEL
    liftieSlug:    'taos',
  },

  'ski-santa-fe': {
    nwsStationId:  'KSAF',   // Santa Fe -- 14mi, reasonable
    nwsConfidence: 'medium',
    snotelTriplet: '879:NM:SNTL',  // Tesuque Peak area
    liftieSlug:    'ski-santa-fe',
  },

  'angel-fire-resort': {
    nwsStationId:  'KTAOS',
    nwsConfidence: 'low',
    snotelTriplet: '892:NM:SNTL',
    liftieSlug:    'angel-fire',
  },

  'red-river-ski-area': {
    nwsStationId:  'KTAOS',
    nwsConfidence: 'low',
    snotelTriplet: '892:NM:SNTL',
    liftieSlug:    null,
  },

  'ski-apache': {
    nwsStationId:  'KROW',   // Roswell -- 80mi, best available for southern NM
    nwsConfidence: 'low',
    snotelTriplet: '879:NM:SNTL',
    liftieSlug:    null,
  },

  // =========================================================================
  // ARIZONA
  // =========================================================================

  'arizona-snowbowl': {
    nwsStationId:  'KFLG',   // Flagstaff -- 7mi, excellent match
    nwsConfidence: 'medium', // Flagstaff at 7,014ft, Snowbowl summit at 11,500ft
    snotelTriplet: '1241:AZ:SNTL', // Flagstaff area SNOTEL
    liftieSlug:    'arizona-snowbowl',
  },

  'sunrise-park-resort': {
    nwsStationId:  'KWSL',   // Show Low -- 30mi
    nwsConfidence: 'low',
    snotelTriplet: '1008:AZ:SNTL',
    liftieSlug:    null,
  },

  // =========================================================================
  // ALASKA
  // =========================================================================

  'alyeska-resort': {
    nwsStationId:  'PANC',   // Anchorage -- 35mi, best available
    nwsConfidence: 'low',
    snotelTriplet: '1099:AK:SNTL', // Alyeska area SNOTEL
    liftieSlug:    'alyeska',
  },

};

// CommonJS export for merge script
if (typeof module !== 'undefined') module.exports = RESORT_SOURCES_SEED;
