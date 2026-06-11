// METRO_GRAVITY — 250 resorts, scale 1–1000
// v3 base (population × draw factor) + soft shadow penalty
// Shadow penalty discounts hills where a materially stronger resort
// sits in the same drive band from the same metro.

const METRO_GRAVITY = {

  // ── NORTHEAST ──
  'hunter-mountain': 1000,
  'stratton-mountain': 957,
  'mount-snow': 953,
  'killington-resort': 945,
  'stowe-mountain-resort': 923,
  'okemo-mountain-resort': 911,
  'sugarbush': 911,
  'mount-sunapee': 909,
  'bromley-mountain': 902,
  'sunday-river': 900,
  'loon-mountain': 886,
  'gore-mountain': 871,
  'attitash': 868,
  'blue-mountain-ski-area': 859,
  'whiteface-mountain-resort': 853,
  'smugglers-notch-resort': 825,
  'waterville-valley': 784,
  'cannon-mountain': 781,
  'jay-peak': 765,
  'sugarloaf': 763,
  'mountain-creek-resort': 647,
  'camelback-mountain-resort': 636,
  'windham-mountain': 626,
  'jack-frost': 624,
  'big-boulder': 623,
  'plattekill-mountain': 619,
  'ski-butternut': 617,
  'jiminy-peak': 610,
  'belleayre': 609,
  'roundtop-mountain-resort': 604,
  'berkshire-east': 600,
  'liberty': 589,
  'whitetail-resort': 589,
  'greek-peak': 587,
  'wachusett-mountain-ski-area': 586,
  'pico-mountain-at-killington': 585,
  'bristol-mountain': 583,
  'hunt-hollow-ski-club': 581,
  'crotched-mountain': 573,
  'gunstock': 538,
  'wildcat-mountain': 530,
  'shawnee-mountain-ski-area': 522,
  'montage-mountain': 520,
  'shawnee-peak': 513,
  'cranmore-mountain-resort': 512,
  'elk-mountain-ski-resort': 511,
  'mount-peter-ski-area': 507,
  'ski-big-bear': 507,
  'black-mountain': 506,
  'mohawk-mountain': 502,
  'magic-mountain': 501,
  'thunder-ridge': 500,
  'eagle-rock': 500,
  'bear-creek-mountain-resort': 499,
  'campgaw-mountain': 495,
  'snow-ridge': 495,
  'spring-mountain-ski-area': 495,
  'ski-sundown': 493,
  'mt-abram-ski-resort': 491,
  'mad-river-glen': 491,
  'powder-ridge-park': 488,
  'bousquet-ski-area': 488,
  'holiday-mountain': 486,
  'mount-southington-ski-area': 480,
  'blue-knob': 480,
  'bolton-valley': 471,
  'otis-ridge-ski-area': 469,
  'burke-mountain': 465,
  'ragged-mountain-resort': 461,
  'labrador-mt': 459,
  'tenney-mountain': 457,
  'toggenburg-mountain': 456,
  'song-mountain': 455,
  'swain': 453,
  'holiday-valley': 452,
  'titus-mountain': 452,
  'ski-sawmill': 452,
  'maple-ski-ridge': 451,
  'holimont-ski-area': 450,
  'pats-peak': 448,
  'royal-mountain-ski-area': 448,
  'willard-mountain': 448,
  'catamount-ski-ride-area': 445,
  'seven-springs': 445,
  'bretton-woods': 444,
  'oak-mountain': 444,
  'middlebury-snow-bowl': 444,
  'tussey-mountain': 441,
  'dartmouth-skiway': 440,
  'saddleback-inc': 439,
  'granite-gorge': 439,
  'kissing-bridge': 436,
  'west-mountain': 436,
  'mccauley-mountain-ski-center': 434,
  'woods-valley-ski-area': 434,
  'yawgoo-valley': 434,
  'buffalo-ski-club-ski-area': 431,
  'whaleback-mountain': 429,
  'suicide-six': 429,
  'ski-ward': 425,
  'blue-hills-ski-area': 422,
  'black-mountain-of-maine': 422,
  'peekn-peak': 420,
  'nashoba-valley': 418,
  'brantling-ski-slopes': 413,
  'mount-pleasant-of-edinboro': 409,
  'bradford-ski-area': 407,
  'mcintyre-ski-area': 401,
  'dry-hill-ski-area': 396,
  'king-pine': 379,
  'camden-snow-bowl': 351,
  'lost-valley': 337,
  'big-squaw-mountain-ski-resort': 276,
  'new-hermon-mountain': 252,

  // ── SOUTHEAST ──
  'snowshoe-mountain': 813,
  'massanutten-resort': 725,
  'timberline-wv': 716,
  'wisp-resort': 696,
  'wintergreen-resort': 675,
  'canaan-valley-resort': 644,
  'sugar-mountain': 548,
  'beech-mountain': 517,
  'cataloochee-ski-area': 442,
  'winterplace': 438,
  'appalachian-ski-mountain': 423,
  'ober-gatlinburg': 421,
  'bryce-resort': 420,
  'wolf-ridge-ski-resort': 417,
  'the-homestead': 364,

  // ── MIDWEST ──
  'boston-mills-brandywine': 863,
  'alpine-valley-mi': 833,
  'mad-river-mountain': 824,
  'devils-head-resort': 738,
  'boyne-mountain': 688,
  'afton-alps': 679,
  'boyne-highlands': 672,
  'buck-hill-mn': 669,
  'wild-mountain-mn': 616,
  'cascade-mountain-wi': 557,
  'crystal-mountain-mi': 555,
  'snow-trails': 514,
  'pine-knob-ski-resort': 509,
  'granite-peak-wi': 507,
  'hidden-valley-mo': 471,
  'welch-village': 470,
  'paoli-peaks': 456,
  'alpine-valley-oh': 452,
  'chestnut-mountain-il': 433,
  'big-powderhorn': 427,
  'mount-la-crosse': 413,
  'spirit-mountain': 346,
  'shanty-creek': 332,
  'lutsen-mountains': 320,
  'sundown-mountain-ia': 307,
  'mount-holiday-ski-area': 301,
  'nubs-nob': 299,
  'mt-bohemia': 270,
  'trollhaugen': 269,
  'snow-creek-mo': 256,
  'whitecap-mountains': 238,
  'ski-brule': 214,

  // ── MOUNTAIN ──
  // AUDIT FIX · Jun 2026: six tail values (Bridger 22, Red Lodge 1, Snow King 67,
  // Discovery 74, Ski Apache 81, Targhee 121) were within-region normalization
  // artifacts. crowdForecast consumes these values on a single national scale
  // (metroG = raw/1000, 40% of base demand), so near-zero values made real
  // local markets read as permanently Quiet -- e.g. Bridger on a powder Saturday.
  // Re-anchored against in-region comparables; see inline notes on each line.
  'jackson-hole-mountain-resort': 991,
  'breckenridge': 968,
  'vail': 945,
  'park-city-mountain': 945,
  'telluride': 900,
  'big-sky-resort': 877,
  'sun-valley-resort': 854,
  'whitefish-mountain-resort': 763,
  'winter-park-resort': 678,
  'keystone-resort': 661,
  'copper-mountain-co': 655,
  'beaver-creek': 639,
  'aspen-snowmass': 607,
  'aspen-highlands': 603,
  'crested-butte': 598,
  'steamboat-resort': 592,
  'deer-valley-resort': 539,
  'snowbird': 501,
  'snowbasin-resort': 496,
  'alta-ski-area': 494,
  'lee-canyon': 490,
  'arapahoe-basin': 414,
  'diamond-peak': 411,
  'mount-rose-ski-tahoe': 410,
  'eldora-mountain': 395,
  'aspen-mountain': 375,
  'loveland-ski-area': 370,
  'buttermilk-co': 353,
  'arizona-snowbowl': 348,
  'schweitzer-mountain': 319,
  'taos-ski-valley': 310,
  'ski-cooper': 293,
  'solitude-mountain-resort': 292,
  'sunrise-park-resort': 292,
  'bogus-basin': 283,
  'sundance-resort': 282,
  'tamarack-resort': 282,
  'sunlight-mountain-resort': 278,
  'brighton-resort': 270,
  'monarch-mountain': 268,
  'silver-mountain-resort': 257,
  'powderhorn-resort': 253,
  'wolf-creek-ski-area': 249,
  'brundage-mountain': 249,
  'purgatory-resort': 248,
  'brian-head-resort': 229,
  'angel-fire-resort': 219,
  'ski-santa-fe': 212,
  'red-river-ski-area': 200,
  'howelsen-hill': 174,
  'beaver-mountain-ut': 171,
  'grand-targhee-resort': 240,  // FIXED Jun 2026 (was 121): remote Driggs access, but a real destination powder draw + JHMR storm-day overflow. Peer of Brundage/Wolf Creek (249).
  'ski-apache': 300,  // FIXED Jun 2026 (was 81): monopoly on the El Paso (870k) + West Texas + southern NM market. Holiday weeks are mobbed. Sits above Angel Fire (219).
  'discovery-ski-area': 180,  // FIXED Jun 2026 (was 74): Butte/Anaconda local base. Peer of Lost Trail (180), not near-zero.
  'snow-king-mountain': 160,  // FIXED Jun 2026 (was 67): Jackson town hill with night skiing + tourism spillover, deep JHMR shadow. Peer of Arctic Valley (150).
  'bridger-bowl': 290,  // FIXED Jun 2026 (was 22): Bozeman (~230k, fastest-growing MT metro) community hill 20 min from town. Famously packed powder Saturdays. Peer band: Snowbowl 260 / Bogus 283.
  'red-lodge-mountain': 245,  // FIXED Jun 2026 (was 1): Billings' (~190k) closest real mountain at ~1h. Peer of Kelly Canyon (240).

  // ── WEST ──
  'mammoth-mountain': 945,
  'crystal-mountain-wa': 744,
  'palisades-tahoe': 731,
  'heavenly-mountain-resort': 731,
  'northstar-california': 713,
  'mt-hood-meadows': 699,
  'mountain-high-resort': 592,
  'bear-mountain-ca': 589,
  'snow-valley-ca': 584,
  'snow-summit': 581,
  'mt-bachelor': 542,
  'june-mountain': 490,
  'kirkwood-mountain': 487,
  'sierra-at-tahoe': 487,
  'china-peak': 477,
  'summit-at-snoqualmie': 456,
  'stevens-pass': 434,
  'dodge-ridge': 418,
  'homewood-mountain-resort': 416,
  'mt-hood-skibowl': 390,
  'timberline-lodge': 388,
  'white-pass-ski-area': 377,
  'mission-ridge': 374,
  'willamette-pass': 350,
  'mt-shasta-ski-park': 344,
  'mt-baker-ski-area': 322,
  'hoodoo-ski-area': 280,
  '49-degrees-north': 270,
  'anthony-lakes-ski-area': 226,
  'alyeska-resort': 133,

  // ── BACKFILL · June 2026 · 52 resorts previously absent (defaulted to 500) ──
  // PROPOSED values — anchored to regional comparables (population × draw,
  // soft shadow penalty) per the v3 method. Review before treating as final.

  // ── NORTHEAST (backfill) ──
  'cazenovia-ski-club': 410,  // tiny volunteer club SE of Syracuse; peer of Brantling
  'hidden-valley-pa': 470,  // Epic feeder in Seven Springs orbit; Pittsburgh draw, shadowed by 7S
  'laurel-mountain': 455,  // Epic, smaller sibling next to Seven Springs; same metro, deeper shadow
  'cochrans-ski-area': 360,  // community race hill outside Burlington; minimal destination pull

  // ── MIDWEST (backfill) ──
  'snowriver-mountain-resort': 360,  // Ikon UP destination; replaces merged Indianhead (356) + Blackjack (219)
  'caberfae-peaks': 340,  // Cadillac MI regional; peer of Crystal/Shanty band, less metro reach
  'marquette-mountain': 300,  // Marquette local hill; modest UP drive-market
  'mont-ripley': 255,  // Michigan Tech campus hill; Houghton local only
  'norway-mountain': 235,  // Iron Mountain area local; small UP market
  'pine-mountain-mi': 245,  // Iron Mountain local; shares small market with Norway
  'coffee-mill': 295,  // SE Minnesota local; fringe of Twin Cities/Rochester drive range
  'huff-hills': 320,  // Bismarck's only hill; small metro but zero competition
  'terry-peak': 380,  // Black Hills regional magnet; Rapid City + Deadwood tourism draw
  'christie-mountain': 270,  // rural NW Wisconsin local
  'nordic-mountain-wi': 280,  // central Wisconsin local; Fox Valley fringe
  'wilmot-mountain': 650,  // Epic on the Chicago/Milwaukee line; heavy metro funnel like Buck Hill/Afton
  'mt-brighton': 640,  // Epic in metro Detroit; same big-metro/small-hill profile as Wilmot
  'perfect-north-slopes': 600,  // Cincinnati's hill; huge local monopoly draw
  'mount-holly-mi': 560,  // metro Detroit local with strong night business
  'bittersweet-ski-area': 420,  // Kalamazoo/Grand Rapids drive market
  'alpine-valley-wi': 560,  // Milwaukee + N Chicago drive market; high lift count for size
  'porcupine-mountains-ski': 230,  // remote western UP state-park hill

  // ── MOUNTAIN (backfill) ──
  'granby-ranch': 330,  // Front Range adjacent but deep in Winter Park shadow
  'echo-mountain': 380,  // closest hill to Denver but tiny; heavy I-70 shadow
  'kelly-canyon': 240,  // Idaho Falls / Rexburg local
  'magic-mountain-id': 150,  // remote South Hills; Twin Falls weekend hill
  'pebble-creek-ski-area': 230,  // Pocatello local; low capacity, big-acre terrain
  'pomerelle-mountain': 200,  // Burley/Twin Falls local
  'soldier-mountain': 170,  // remote Fairfield ID; light traffic
  'little-ski-hill': 130,  // McCall town hill; fully shadowed by Brundage
  'blacktail-mountain': 200,  // Flathead Valley local; shadowed by Whitefish
  'lost-trail-powder-mountain': 180,  // remote MT/ID border; weekend-only powder draw
  'montana-snowbowl': 260,  // Missoula's hill; solid college-town base
  'antelope-butte': 90,  // remote Bighorns nonprofit; peer of Meadowlark
  'meadowlark': 80,  // remote Bighorns; minimal drive market
  'white-pine-resort': 100,  // Pinedale WY local
  'cherry-peak': 180,  // Logan-adjacent newcomer; splits small market with Beaver Mtn (171)
  'eagle-point': 190,  // remote south-central Utah; SLC/Vegas long-haul only

  // ── WEST (backfill) ──
  'sugar-bowl-resort': 520,  // major I-80 Tahoe resort; strong pull, discounted for Palisades shadow
  'boreal-mountain-ca': 540,  // first resort off I-80 with night skiing; outsized convenience pull
  'donner-ski-ranch': 430,  // Donner Summit value option; budget overflow from the I-80 corridor
  'bear-valley-mountain-resort': 380,  // Hwy 4 destination; sizable mountain, long isolated access road
  'mount-baldy-ski-lifts': 520,  // closest real vertical to LA; big metro, very limited capacity
  'badger-pass': 300,  // Yosemite NP hill; tourism-driven, capped by park access
  'cooper-spur': 220,  // north-side Hood beginner area; deep Meadows/Timberline shadow
  'hurricane-ridge': 200,  // Port Angeles weekend-only NP hill
  'loup-loup': 180,  // Methow Valley local
  'ski-bluewood': 200,  // Walla Walla / Tri-Cities drive market
  'arctic-valley': 150,  // Anchorage volunteer hill; weekend-only, Alyeska shadow
  'eaglecrest': 160,  // Juneau's municipal mountain; isolated market
  'mt-eyak': 60,  // Cordova; tiny roadless-access market
  'moose-mountain-ak': 110,  // Fairbanks local; bus-served, no lifts beyond one

};
