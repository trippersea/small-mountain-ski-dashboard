// ─── Resort Data ─────────────────────────────────────────────────────────────
const RESORTS = [
  {
    id: 'black-nh', name: 'Black Mountain', state: 'NH', pass: 'Indy', owner: 'Independent',
    vertical: 1100, trails: 45, lifts: 5, acres: 143, snowfall: 120, snowmaking: 98, night: false,
    longestRun: 2.5, lat: 44.1776, lon: -71.1284,
    difficulty: { beginner: 0.20, intermediate: 0.45, advanced: 0.25, expert: 0.10 },
    liftsBreakdown: [['Double', 3], ['Triple', 1], ['Surface', 1]],
    website: 'https://www.blackmt.com/', webcamPage: '', trailMapPage: 'https://www.blackmt.com/',
    price: 69, terrainPark: false, seasonOpen: 'Dec', seasonClose: 'Mar',
    notes: 'Classic New Hampshire small-mountain feel with strong historic character.',
    tags: ['Historic', 'Classic doubles', 'Indy favorite'], bestFor: ['beginners', 'family']
  },
  {
    id: 'black-me', name: 'Black Mountain of Maine', state: 'ME', pass: 'Indy', owner: 'Community nonprofit',
    vertical: 1380, trails: 50, lifts: 3, acres: 600, snowfall: 110, snowmaking: 75, night: true,
    longestRun: 2.0, lat: 44.5342, lon: -70.5368,
    difficulty: { beginner: 0.24, intermediate: 0.38, advanced: 0.24, expert: 0.14 },
    liftsBreakdown: [['Double', 2], ['T-Bar', 1]],
    website: 'https://skiblackmountain.org/', webcamPage: '', trailMapPage: 'https://skiblackmountain.org/',
    price: 55, terrainPark: false, seasonOpen: 'Dec', seasonClose: 'Mar',
    notes: 'Rumford soul hill with big acreage, meaningful vert, top-to-bottom night skiing, and nonprofit energy.',
    tags: ['Night skiing', 'Maine', 'Community hill'], bestFor: ['night', 'budget', 'family']
  },
  {
    id: 'bolton', name: 'Bolton Valley', state: 'VT', pass: 'Indy', owner: 'Independent',
    vertical: 1634, trails: 71, lifts: 6, acres: 300, snowfall: 300, snowmaking: 62, night: true,
    longestRun: 2.0, lat: 44.4217, lon: -72.8518,
    difficulty: { beginner: 0.18, intermediate: 0.44, advanced: 0.25, expert: 0.13 },
    liftsBreakdown: [['Quad', 2], ['Double', 3], ['Surface', 1]],
    website: 'https://www.boltonvalley.com/', webcamPage: '', trailMapPage: 'https://www.boltonvalley.com/',
    price: 89, terrainPark: true, seasonOpen: 'Nov', seasonClose: 'Apr',
    notes: 'Natural-snow standout with night skiing, backcountry credibility, and one of the strongest local scenes in Vermont.',
    tags: ['Night skiing', 'Natural snow', 'Backcountry'], bestFor: ['night', 'natural-snow', 'steeps']
  },
  {
    id: 'bousquet', name: 'Bousquet', state: 'MA', pass: 'Indy', owner: 'Private',
    vertical: 750, trails: 24, lifts: 5, acres: 100, snowfall: 70, snowmaking: 95, night: true,
    longestRun: 1.0, lat: 42.4138, lon: -73.2820,
    difficulty: { beginner: 0.28, intermediate: 0.44, advanced: 0.22, expert: 0.06 },
    liftsBreakdown: [['Quad', 2], ['Triple', 1], ['Surface', 2]],
    website: 'https://www.bousquetmountain.com/', webcamPage: '', trailMapPage: 'https://www.bousquetmountain.com/',
    price: 65, terrainPark: true, seasonOpen: 'Dec', seasonClose: 'Mar',
    notes: 'Compact but useful mountain with lights, local energy, and easy Berkshires access.',
    tags: ['Night skiing', 'Berkshires', 'Local hill'], bestFor: ['night', 'beginners', 'terrain-park']
  },
  {
    id: 'bradford', name: 'Bradford Ski Area', state: 'MA', pass: 'Independent', owner: 'Independent',
    vertical: 230, trails: 15, lifts: 10, acres: 48, snowfall: 40, snowmaking: 100, night: true,
    longestRun: 0.4, lat: 42.7779, lon: -71.0819,
    difficulty: { beginner: 0.34, intermediate: 0.40, advanced: 0.20, expert: 0.06 },
    liftsBreakdown: [['Triple', 3], ['T-Bar', 1], ['Rope tow', 3], ['Carpet', 3]],
    website: 'https://skibradford.com/', webcamPage: '', trailMapPage: 'https://skibradford.com/',
    price: 49, terrainPark: false, seasonOpen: 'Dec', seasonClose: 'Mar',
    notes: 'Pure local feeder hill near Boston with strong night-skiing utility and learn-to-ride value.',
    tags: ['Boston-area', 'Night skiing', 'Feeder hill'], bestFor: ['beginners', 'night', 'budget', 'family']
  },
  {
    id: 'bromley', name: 'Bromley', state: 'VT', pass: 'Independent', owner: 'Corporate',
    vertical: 1334, trails: 47, lifts: 9, acres: 178, snowfall: 145, snowmaking: 98, night: false,
    longestRun: 2.5, lat: 43.2278, lon: -72.9382,
    difficulty: { beginner: 0.32, intermediate: 0.36, advanced: 0.20, expert: 0.12 },
    liftsBreakdown: [['High-speed quad', 1], ['Fixed quad', 1], ['Double', 4], ['T-Bar', 1], ['Carpet', 2]],
    website: 'https://www.bromley.com/', webcamPage: '', trailMapPage: 'https://www.bromley.com/',
    price: 99, terrainPark: true, seasonOpen: 'Nov', seasonClose: 'Apr',
    notes: 'South-facing family cruiser with a balanced terrain mix.',
    tags: ['Family', 'Southern Vermont', 'Cruisers'], bestFor: ['family', 'beginners', 'terrain-park']
  },
  {
    id: 'burke', name: 'Burke Mountain', state: 'VT', pass: 'Independent', owner: 'Independent',
    vertical: 2057, trails: 55, lifts: 4, acres: 260, snowfall: 217, snowmaking: 70, night: false,
    longestRun: 2.0, lat: 44.5717, lon: -71.8928,
    difficulty: { beginner: 0.18, intermediate: 0.42, advanced: 0.24, expert: 0.16 },
    liftsBreakdown: [['High-speed quad', 2], ['T-Bar', 1], ['J-Bar', 1]],
    website: 'https://skiburke.com/', webcamPage: 'https://skiburke.com/the-mountain/webcams', trailMapPage: 'https://skiburke.com/the-mountain/weather-conditions#map',
    price: 109, terrainPark: false, seasonOpen: 'Nov', seasonClose: 'Apr',
    notes: 'Big vert, race culture, and serious Northeast Kingdom terrain.',
    tags: ['Northeast Kingdom', 'Race culture', 'Big vert'], bestFor: ['steeps', 'natural-snow']
  },
  {
    id: 'catamount', name: 'Catamount', state: 'NY/MA', pass: 'Indy', owner: 'Independent',
    vertical: 1000, trails: 44, lifts: 8, acres: 119, snowfall: 75, snowmaking: 93, night: true,
    longestRun: 1.75, lat: 42.1269, lon: -73.5206,
    difficulty: { beginner: 0.35, intermediate: 0.42, advanced: 0.17, expert: 0.06 },
    liftsBreakdown: [['Quad', 2], ['Triple', 3], ['Carpet', 3]],
    website: 'https://catamountski.com/', webcamPage: '', trailMapPage: 'https://catamountski.com/',
    price: 79, terrainPark: true, seasonOpen: 'Dec', seasonClose: 'Mar',
    notes: 'Broad lit terrain and strong southern New England access.',
    tags: ['Night skiing', 'Indy', 'Hudson Valley access'], bestFor: ['night', 'beginners', 'terrain-park', 'family']
  },
  {
    id: 'gunstock', name: 'Gunstock', state: 'NH', pass: 'Independent', owner: 'County-owned',
    vertical: 1400, trails: 55, lifts: 8, acres: 227, snowfall: 160, snowmaking: 98, night: true,
    longestRun: 1.6, lat: 43.5404, lon: -71.3702,
    difficulty: { beginner: 0.22, intermediate: 0.42, advanced: 0.25, expert: 0.11 },
    liftsBreakdown: [['High-speed quad', 1], ['Fixed quad', 2], ['Triple', 1], ['Double', 2], ['Surface', 2]],
    website: 'https://www.gunstock.com/', webcamPage: '', trailMapPage: 'https://www.gunstock.com/',
    price: 89, terrainPark: true, seasonOpen: 'Nov', seasonClose: 'Apr',
    notes: 'Big-small mountain blend with strong operations and one of the better night products in New England.',
    tags: ['Night skiing', 'Family', 'Strong ops'], bestFor: ['night', 'family', 'terrain-park']
  },
  {
    id: 'magic', name: 'Magic Mountain', state: 'VT', pass: 'Indy', owner: 'Community-backed independent',
    vertical: 1500, trails: 51, lifts: 5, acres: 285, snowfall: 120, snowmaking: 45, night: false,
    longestRun: 3.0, lat: 43.1964, lon: -72.8243,
    difficulty: { beginner: 0.14, intermediate: 0.32, advanced: 0.34, expert: 0.20 },
    liftsBreakdown: [['Quad', 1], ['Double', 3], ['Surface', 1]],
    website: 'https://magicmtn.com/', webcamPage: '', trailMapPage: 'https://magicmtn.com/',
    price: 79, terrainPark: false, seasonOpen: 'Dec', seasonClose: 'Apr',
    notes: 'Cult-favorite Vermont mountain with soul, steeper terrain, and elite vibe scores.',
    tags: ['Soul skiing', 'Steeps', 'Indy legend'], bestFor: ['steeps', 'budget']
  },
  {
    id: 'nashoba', name: 'Nashoba Valley', state: 'MA', pass: 'Independent', owner: 'Independent',
    vertical: 240, trails: 17, lifts: 10, acres: 46, snowfall: 50, snowmaking: 100, night: true,
    longestRun: 0.5, lat: 42.5290, lon: -71.4731,
    difficulty: { beginner: 0.20, intermediate: 0.50, advanced: 0.30, expert: 0.00 },
    liftsBreakdown: [['Triple', 3], ['Double', 1], ['Conveyor', 3], ['Rope tow', 3]],
    website: 'https://skinashoba.com/', webcamPage: '', trailMapPage: 'https://skinashoba.com/',
    price: 49, terrainPark: false, seasonOpen: 'Dec', seasonClose: 'Mar',
    notes: 'Metro-Boston night-ski machine built for quick laps and lessons.',
    tags: ['Night skiing', 'Metro Boston', 'Lessons'], bestFor: ['beginners', 'night', 'budget', 'family']
  },
  {
    id: 'pats-peak', name: 'Pats Peak', state: 'NH', pass: 'Indy', owner: 'Family-owned',
    vertical: 770, trails: 28, lifts: 11, acres: 117, snowfall: 80, snowmaking: 100, night: true,
    longestRun: 1.5, lat: 43.1790, lon: -71.8196,
    difficulty: { beginner: 0.50, intermediate: 0.21, advanced: 0.12, expert: 0.17 },
    liftsBreakdown: [['Quad', 1], ['Triple', 3], ['Double', 2], ['J-Bar', 1], ['Handle tow', 2], ['Carpet', 2]],
    website: 'https://www.patspeak.com/', webcamPage: '', trailMapPage: 'https://www.patspeak.com/',
    price: 75, terrainPark: true, seasonOpen: 'Dec', seasonClose: 'Mar',
    notes: 'One of the strongest night and learn-to-ski operations in New England.',
    tags: ['Night skiing', 'Family-owned', 'Race leagues'], bestFor: ['beginners', 'night', 'family', 'terrain-park']
  },
  {
    id: 'wachusett', name: 'Wachusett', state: 'MA', pass: 'Independent', owner: 'Independent',
    vertical: 1000, trails: 27, lifts: 8, acres: 110, snowfall: 72, snowmaking: 100, night: true,
    longestRun: 2.0, lat: 42.4884, lon: -71.8863,
    difficulty: { beginner: 0.25, intermediate: 0.50, advanced: 0.20, expert: 0.05 },
    liftsBreakdown: [['High-speed quad', 2], ['Triple', 2], ['Surface', 4]],
    website: 'https://www.wachusett.com/', webcamPage: '', trailMapPage: 'https://www.wachusett.com/',
    price: 89, terrainPark: true, seasonOpen: 'Nov', seasonClose: 'Apr',
    notes: 'Massachusetts volume leader with elite convenience and huge after-work appeal.',
    tags: ['Night skiing', 'High volume', 'Near Boston'], bestFor: ['night', 'beginners', 'terrain-park', 'family']
  },
  // ── Maine ─────────────────────────────────────────────────────────────────
  {
    id: 'big-moose', name: 'Big Moose Mountain', state: 'ME', pass: 'Independent', owner: 'Independent',
    vertical: 1150, trails: 30, lifts: 3, acres: 200, snowfall: 130, snowmaking: 80, night: false,
    longestRun: 2.0, lat: 45.6312, lon: -69.7031,
    difficulty: { beginner: 0.20, intermediate: 0.45, advanced: 0.25, expert: 0.10 },
    liftsBreakdown: [['Double', 2], ['Surface', 1]],
    website: 'https://www.bigmooseski.com/', webcamPage: '', trailMapPage: 'https://www.bigmooseski.com/',
    price: 55, terrainPark: false, seasonOpen: 'Dec', seasonClose: 'Mar',
    notes: 'Remote central Maine mountain near Greenville and Moosehead Lake. True north-woods ski experience.',
    tags: ['Remote', 'Maine', 'North woods'], bestFor: ['budget', 'family']
  },
  {
    id: 'big-rock', name: 'Big Rock', state: 'ME', pass: 'Independent', owner: 'Independent',
    vertical: 990, trails: 30, lifts: 4, acres: 170, snowfall: 110, snowmaking: 85, night: true,
    longestRun: 1.5, lat: 46.8756, lon: -68.3384,
    difficulty: { beginner: 0.25, intermediate: 0.40, advanced: 0.25, expert: 0.10 },
    liftsBreakdown: [['Quad', 1], ['Double', 2], ['Surface', 1]],
    website: 'https://bigrockmaine.com/', webcamPage: '', trailMapPage: 'https://bigrockmaine.com/',
    price: 49, terrainPark: true, seasonOpen: 'Dec', seasonClose: 'Mar',
    notes: "The only ski area in Aroostook County — northern Maine's community hill with a genuine local following.",
    tags: ['Aroostook County', 'Night skiing', 'Community hill'], bestFor: ['budget', 'night', 'family', 'terrain-park']
  },
  {
    id: 'camden', name: 'Camden Snow Bowl', state: 'ME', pass: 'Independent', owner: 'City of Camden',
    vertical: 950, trails: 31, lifts: 4, acres: 150, snowfall: 95, snowmaking: 70, night: true,
    longestRun: 1.4, lat: 44.2162, lon: -69.0853,
    difficulty: { beginner: 0.25, intermediate: 0.40, advanced: 0.25, expert: 0.10 },
    liftsBreakdown: [['Triple', 1], ['Double', 2], ['Surface', 1]],
    website: 'https://www.camdensnowbowl.com/', webcamPage: '', trailMapPage: 'https://www.camdensnowbowl.com/',
    price: 50, terrainPark: false, seasonOpen: 'Dec', seasonClose: 'Mar',
    notes: 'Municipally owned coastal Maine gem with ocean views from the summit.',
    tags: ['Ocean views', 'Municipal', 'Coastal Maine'], bestFor: ['budget', 'family', 'beginners']
  },
  {
    id: 'lost-valley', name: 'Lost Valley', state: 'ME', pass: 'Independent', owner: 'Independent',
    vertical: 240, trails: 16, lifts: 4, acres: 50, snowfall: 75, snowmaking: 100, night: true,
    longestRun: 0.5, lat: 44.1201, lon: -70.2648,
    difficulty: { beginner: 0.35, intermediate: 0.40, advanced: 0.20, expert: 0.05 },
    liftsBreakdown: [['Triple', 2], ['Surface', 1], ['Carpet', 1]],
    website: 'https://www.lostvalleyski.com/', webcamPage: '', trailMapPage: 'https://www.lostvalleyski.com/',
    price: 42, terrainPark: true, seasonOpen: 'Dec', seasonClose: 'Mar',
    notes: 'Auburn, Maine feeder hill with full snowmaking, night skiing, and strong junior programs.',
    tags: ['Night skiing', 'Lessons', 'Auburn ME'], bestFor: ['beginners', 'budget', 'night', 'family']
  },
  // ── New Hampshire ─────────────────────────────────────────────────────────
  {
    id: 'cannon', name: 'Cannon Mountain', state: 'NH', pass: 'Independent', owner: 'State of NH',
    vertical: 2180, trails: 97, lifts: 9, acres: 285, snowfall: 180, snowmaking: 96, night: false,
    longestRun: 2.3, lat: 44.1726, lon: -71.6973,
    difficulty: { beginner: 0.20, intermediate: 0.36, advanced: 0.28, expert: 0.16 },
    liftsBreakdown: [['Aerial tram', 1], ['High-speed quad', 2], ['Fixed quad', 1], ['Triple', 1], ['Double', 2], ['Surface', 2]],
    website: 'https://www.cannonmt.com/', webcamPage: 'https://www.cannonmt.com/webcam',
    trailMapImage: 'https://admin.cannonmt.com/publicFiles/documents/2526_Cannon_TrailMap_Digital.jpg',
    trailMapPage: 'https://www.cannonmt.com/trail-map',
    price: 99, terrainPark: false, seasonOpen: 'Nov', seasonClose: 'Apr',
    notes: 'State-owned Franconia Notch classic with the highest vertical in NH, a historic tram, and serious expert terrain.',
    tags: ['State-owned', 'Expert terrain', 'Franconia Notch', 'Tram'], bestFor: ['steeps', 'natural-snow']
  },
  {
    id: 'dartmouth-skiway', name: 'Dartmouth Skiway', state: 'NH', pass: 'Independent', owner: 'Dartmouth College',
    vertical: 968, trails: 33, lifts: 4, acres: 100, snowfall: 140, snowmaking: 60, night: false,
    longestRun: 1.5, lat: 43.8968, lon: -72.0365,
    difficulty: { beginner: 0.20, intermediate: 0.40, advanced: 0.30, expert: 0.10 },
    liftsBreakdown: [['Quad', 2], ['Double', 1], ['Surface', 1]],
    website: 'https://skiway.dartmouth.edu/', webcamPage: '', trailMapPage: 'https://skiway.dartmouth.edu/',
    price: 65, terrainPark: false, seasonOpen: 'Dec', seasonClose: 'Mar',
    notes: 'College-owned hill on the NH/VT border near Hanover. Strong racing heritage and modest pricing.',
    tags: ['College-owned', 'NH/VT border', 'Race heritage'], bestFor: ['budget', 'family', 'natural-snow']
  },
  {
    id: 'king-pine', name: 'King Pine', state: 'NH', pass: 'Independent', owner: 'Purity Spring Resort',
    vertical: 350, trails: 16, lifts: 5, acres: 55, snowfall: 70, snowmaking: 100, night: true,
    longestRun: 0.75, lat: 43.9404, lon: -71.0101,
    difficulty: { beginner: 0.38, intermediate: 0.37, advanced: 0.18, expert: 0.07 },
    liftsBreakdown: [['Triple', 2], ['Double', 1], ['Surface', 1], ['Carpet', 1]],
    website: 'https://www.kingpine.com/', webcamPage: '', trailMapPage: 'https://www.kingpine.com/',
    price: 55, terrainPark: false, seasonOpen: 'Dec', seasonClose: 'Mar',
    notes: 'Family resort in the Lakes Region attached to Purity Spring Resort. Beginner-forward with a warm feel.',
    tags: ['Family resort', 'Lakes Region', 'Learn-to-ski'], bestFor: ['beginners', 'family', 'budget']
  },
  {
    id: 'mcintyre', name: 'McIntyre Ski Area', state: 'NH', pass: 'Independent', owner: 'City of Manchester',
    vertical: 160, trails: 10, lifts: 4, acres: 35, snowfall: 55, snowmaking: 100, night: true,
    longestRun: 0.3, lat: 42.9720, lon: -71.4548,
    difficulty: { beginner: 0.40, intermediate: 0.40, advanced: 0.20, expert: 0.00 },
    liftsBreakdown: [['Triple', 1], ['Double', 1], ['Surface', 1], ['Carpet', 1]],
    website: 'https://mcintyreskiarea.com/', webcamPage: '', trailMapPage: 'https://mcintyreskiarea.com/',
    price: 38, terrainPark: false, seasonOpen: 'Dec', seasonClose: 'Mar',
    notes: 'City-run Manchester hill offering accessible, affordable night skiing for the southern NH metro area.',
    tags: ['City-owned', 'Night skiing', 'Manchester NH', 'Urban hill'], bestFor: ['beginners', 'budget', 'night', 'family']
  },
  {
    id: 'tenney', name: 'Tenney Mountain', state: 'NH', pass: 'Independent', owner: 'Independent',
    vertical: 1430, trails: 50, lifts: 4, acres: 150, snowfall: 130, snowmaking: 75, night: false,
    longestRun: 2.2, lat: 43.7851, lon: -71.8234,
    difficulty: { beginner: 0.22, intermediate: 0.42, advanced: 0.26, expert: 0.10 },
    liftsBreakdown: [['High-speed quad', 1], ['Double', 2], ['Surface', 1]],
    website: 'https://tenneymountain.com/', webcamPage: '', trailMapPage: 'https://tenneymountain.com/',
    price: 69, terrainPark: false, seasonOpen: 'Dec', seasonClose: 'Mar',
    notes: 'Reopened Plymouth-area mountain with solid vertical and a refreshed independent spirit.',
    tags: ['Reopened', 'Plymouth NH', 'Central NH'], bestFor: ['family', 'budget']
  },
  // ── Vermont ───────────────────────────────────────────────────────────────
  {
    id: 'middlebury', name: 'Middlebury Snow Bowl', state: 'VT', pass: 'Independent', owner: 'Middlebury College',
    vertical: 1020, trails: 17, lifts: 3, acres: 110, snowfall: 150, snowmaking: 40, night: false,
    longestRun: 1.5, lat: 43.9443, lon: -72.9637,
    difficulty: { beginner: 0.20, intermediate: 0.40, advanced: 0.30, expert: 0.10 },
    liftsBreakdown: [['Triple', 1], ['Double', 1], ['Surface', 1]],
    website: 'https://www.middlebury.edu/snow-bowl', webcamPage: '', trailMapPage: 'https://www.middlebury.edu/snow-bowl',
    price: 55, terrainPark: false, seasonOpen: 'Dec', seasonClose: 'Mar',
    notes: 'College-owned Bread Loaf Mountain gem with excellent natural snow and a low-key atmosphere.',
    tags: ['College-owned', 'Natural snow', 'VT classic'], bestFor: ['natural-snow', 'budget', 'steeps']
  },
  // ── Massachusetts ─────────────────────────────────────────────────────────
  {
    id: 'berkshire-east', name: 'Berkshire East', state: 'MA', pass: 'Indy', owner: 'Independent',
    vertical: 1180, trails: 45, lifts: 6, acres: 170, snowfall: 90, snowmaking: 90, night: true,
    longestRun: 1.5, lat: 42.6398, lon: -72.7804,
    difficulty: { beginner: 0.25, intermediate: 0.40, advanced: 0.25, expert: 0.10 },
    liftsBreakdown: [['Quad', 2], ['Triple', 1], ['Double', 2], ['Surface', 1]],
    website: 'https://berkshireeast.com/', webcamPage: '', trailMapPage: 'https://berkshireeast.com/',
    price: 79, terrainPark: true, seasonOpen: 'Nov', seasonClose: 'Apr',
    notes: 'Independently owned Charlemont mountain with solid vertical for Massachusetts and strong night skiing.',
    tags: ['Night skiing', 'Indy', 'Charlemont MA', 'Zipline'], bestFor: ['night', 'terrain-park', 'family']
  }
];

// ─── App State ────────────────────────────────────────────────────────────────
const state = {
  search:      '',
  pass:        'All',
  stateFilter: 'All',
  nightOnly:   false,
  selectedId:  null,
  sortCol:     'vertical',
  sortDir:     'desc',
  activeQF:    new Set(),            // quick filter keys
  origin:      null,                 // { lat, lon, label }
  driveCache:  {},                   // id → minutes
  weatherCache:{},                   // id → { data, ts }
  compareSet:  new Set(),
  userNotes:   JSON.parse(localStorage.getItem('ski-notes')     || '{}'),
  favorites:   new Set(JSON.parse(localStorage.getItem('ski-favorites') || '[]')),
  skiDays:     5,
  drivesLoading: false,
};

const COL_MAX = {
  vertical:2200, trails:100, lifts:12, acres:650,
  longestRun:3.2, snowfall:320, snowmaking:100, price:130
};

const MONTH_IDX = {
  Jan:0, Feb:1, Mar:2, Apr:3, May:4, Jun:5,
  Jul:6, Aug:7, Sep:8, Oct:9, Nov:10, Dec:11
};

// ─── DOM refs ─────────────────────────────────────────────────────────────────
const $ = id => document.getElementById(id);
const els = {
  summaryCards:          $('summaryCards'),
  searchInput:           $('searchInput'),
  stateFilter:           $('stateFilter'),
  passFilter:            $('passFilter'),
  sortBy:                $('sortBy'),
  toggleNight:           $('toggleNight'),
  randomResort:          $('randomResort'),
  activeFilters:         $('activeFilters'),
  resortList:            $('resortList'),
  resultCount:           $('resultCount'),
  comparisonBody:        $('comparisonBody'),
  comparisonTable:       $('comparisonTable'),
  selectedResortSection: $('selectedResortSection'),
  selectedResort:        $('selectedResort'),
  compareTray:           $('compareTray'),
  comparePills:          $('comparePills'),
  compareBtn:            $('compareBtn'),
  clearCompare:          $('clearCompare'),
  comparePanel:          $('comparePanel'),
  compareContent:        $('compareContent'),
  closeCompare:          $('closeCompare'),
  originInput:           $('originInput'),
  detectLocation:        $('detectLocation'),
  setLocation:           $('setLocation'),
  bestTodayGrid:         $('bestTodayGrid'),
  weekendPlannerGrid:    $('weekendPlannerGrid'),
  snowRankings:          $('snowRankings'),
  skiDays:               $('skiDays'),
  passCalcGrid:          $('passCalcGrid'),
  backToTop:             $('backToTop'),
  resortSuggestions:     $('resortSuggestions'),
  toast:                 $('toast'),
};

// ─── Toast ────────────────────────────────────────────────────────────────────
let toastTimer = null;
function showToast(msg, dur = 2800) {
  els.toast.textContent = msg;
  els.toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => els.toast.classList.remove('show'), dur);
}

// ─── Quick filter rules ───────────────────────────────────────────────────────
const QF_RULES = {
  beginners:      r => r.difficulty.beginner >= 0.25,
  steeps:         r => (r.difficulty.advanced + r.difficulty.expert) >= 0.35,
  night:          r => r.night,
  'natural-snow': r => r.snowfall >= 150,
  'terrain-park': r => r.terrainPark,
  budget:         r => r.price <= 65,
};

const QF_LABELS = {
  beginners: '🎿 Beginners', steeps: '⚫ Steeps', night: '🌙 Night',
  'natural-snow': '❄️ Natural snow', 'terrain-park': '🛹 Park', budget: '💰 Budget',
};

// ─── Filtering ────────────────────────────────────────────────────────────────
function uniquePasses() { return ['All', ...new Set(RESORTS.map(r => r.pass))]; }
function uniqueStates() { return ['All', ...[...new Set(RESORTS.map(r => r.state))].sort()]; }

function filteredResorts() {
  return RESORTS.filter(r => {
    const q   = state.search.trim().toLowerCase();
    const hay = [r.name, r.state, r.pass, r.owner, r.notes, ...(r.tags || [])].join(' ').toLowerCase();
    const matchesSearch = !q || hay.includes(q);
    const matchesPass   = state.pass === 'All'        || r.pass  === state.pass;
    const matchesState  = state.stateFilter === 'All' || r.state === state.stateFilter;
    const matchesNight  = !state.nightOnly            || r.night;
    // All active quick filters must be satisfied (AND logic)
    const matchesQF     = state.activeQF.size === 0   || [...state.activeQF].every(k => QF_RULES[k]?.(r));
    return matchesSearch && matchesPass && matchesState && matchesNight && matchesQF;
  }).sort((a, b) => {
    const col = state.sortCol;
    if (col === 'drive') {
      const da = state.driveCache[a.id] ?? Infinity;
      const db = state.driveCache[b.id] ?? Infinity;
      return state.sortDir === 'asc' ? da - db : db - da;
    }
    let av = a[col], bv = b[col];
    if (typeof av === 'boolean') { av = av ? 1 : 0; bv = bv ? 1 : 0; }
    if (typeof av === 'string')  return state.sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av);
    return state.sortDir === 'asc' ? av - bv : bv - av;
  });
}

// ─── Season status ────────────────────────────────────────────────────────────
function seasonStatus(resort) {
  const m    = new Date().getMonth();
  const open  = MONTH_IDX[resort.seasonOpen]  ?? 11;
  const close = MONTH_IDX[resort.seasonClose] ?? 3;
  // Handle year-wrap (e.g. Nov–Apr)
  const isOpen = open <= close
    ? (m >= open && m <= close)
    : (m >= open || m <= close);
  if (isOpen) return { label: 'Open', cls: 'season-open' };
  // Within 1 month of opening or closing
  const toOpen = (open - m + 12) % 12;
  const sinceClose = (m - close + 12) % 12;
  if (toOpen <= 1 || sinceClose <= 1) return { label: 'Soon', cls: 'season-soon' };
  return { label: 'Closed', cls: 'season-closed' };
}

// ─── Drive time (OSRM) ────────────────────────────────────────────────────────
async function fetchDriveTime(resort) {
  if (!state.origin) return null;
  if (state.driveCache[resort.id] !== undefined) return state.driveCache[resort.id];
  try {
    const url = `https://router.project-osrm.org/route/v1/driving/${state.origin.lon},${state.origin.lat};${resort.lon},${resort.lat}?overview=false`;
    const res  = await fetch(url);
    const data = await res.json();
    if (!data.routes?.[0]) throw new Error('No route');
    const mins = Math.round(data.routes[0].duration / 60);
    state.driveCache[resort.id] = mins;
    return mins;
  } catch {
    state.driveCache[resort.id] = null;
    return null;
  }
}

function formatDrive(mins) {
  if (mins === null || mins === undefined) return null;
  const h = Math.floor(mins / 60), m = mins % 60;
  return h > 0 ? (m > 0 ? `${h}h ${m}m` : `${h}h`) : `${mins}m`;
}

// Request ID guards against stale responses if location is changed mid-load
let driveRequestId = 0;

async function loadAllDriveTimes() {
  if (!state.origin) return;
  const myId = ++driveRequestId;
  state.drivesLoading = true;
  render();
  showToast('⏱ Calculating drive times…', 4000);

  const queue   = [...RESORTS];
  const workers = Array.from({ length: 4 }, async () => {
    while (queue.length) {
      const resort = queue.shift();
      if (!resort || myId !== driveRequestId) break;
      await fetchDriveTime(resort);
    }
  });
  await Promise.all(workers);

  if (myId !== driveRequestId) return; // superseded
  state.drivesLoading = false;
  render();
  showToast('✓ Drive times updated');
}

// ─── Geocode origin ───────────────────────────────────────────────────────────
async function geocodeOrigin(query) {
  const q = query.trim();
  if (!q) return null;

  const nominatim = async candidate => {
    try {
      const url  = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(candidate)}&format=json&limit=1&countrycodes=us`;
      const res  = await fetch(url, { headers: { 'Accept-Language': 'en' } });
      const data = await res.json();
      if (!data.length) return null;
      return { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon), label: data[0].display_name.split(',')[0] };
    } catch { return null; }
  };

  if (/^\d{5}$/.test(q)) {
    try {
      const res = await fetch(`https://api.zippopotam.us/us/${q}`);
      if (res.ok) {
        const d     = await res.json();
        const place = d.places?.[0];
        if (place) return {
          lat:   parseFloat(place.latitude),
          lon:   parseFloat(place.longitude),
          label: `${place['place name']}, ${place.state || place['state abbreviation'] || ''}`.replace(/,\s*$/, '')
        };
      }
    } catch { /* fall through */ }
  }

  return await nominatim(q) || await nominatim(`${q}, USA`);
}

// ─── Weather (Open-Meteo) ─────────────────────────────────────────────────────
const WX_CACHE_TTL = 30 * 60 * 1000; // 30 minutes

const WX_CODES = {
  0:'☀️',1:'🌤️',2:'⛅',3:'☁️',45:'🌫️',48:'🌫️',
  51:'🌦️',53:'🌦️',55:'🌧️',61:'🌧️',63:'🌧️',65:'🌧️',
  71:'🌨️',73:'🌨️',75:'❄️',77:'🌨️',80:'🌦️',81:'🌦️',82:'⛈️',
  85:'🌨️',86:'❄️',95:'⛈️',96:'⛈️',99:'⛈️'
};
const WX_DESC = {
  0:'Clear',1:'Mainly clear',2:'Partly cloudy',3:'Overcast',45:'Fog',48:'Fog',
  51:'Light drizzle',53:'Drizzle',55:'Heavy drizzle',61:'Light rain',63:'Rain',65:'Heavy rain',
  71:'Light snow',73:'Snow',75:'Heavy snow',77:'Snow grains',
  80:'Showers',81:'Showers',82:'Heavy showers',85:'Snow showers',86:'Heavy snow',
  95:'Thunderstorm',96:'Thunderstorm',99:'Thunderstorm'
};

async function fetchWeather(resort) {
  const cached = state.weatherCache[resort.id];
  if (cached && (Date.now() - cached.ts) < WX_CACHE_TTL) return cached.data;
  try {
    // past_days=2 gives us 48h of actual snowfall; forecast_days=4 gives today + 3 ahead
    const url = `https://api.open-meteo.com/v1/forecast`
      + `?latitude=${resort.lat}&longitude=${resort.lon}`
      + `&current=temperature_2m,weathercode,windspeed_10m`
      + `&daily=weathercode,temperature_2m_max,temperature_2m_min,snowfall_sum`
      + `&temperature_unit=fahrenheit&wind_speed_unit=mph`
      + `&forecast_days=4&past_days=2&timezone=America%2FNew_York`;
    const res = await fetch(url);
    const d   = await res.json();

    // With past_days=2: index 0,1 = past; index 2 = today; index 3,4,5 = next 3 days
    const fresh48h = (d.daily.snowfall_sum?.[0] || 0) + (d.daily.snowfall_sum?.[1] || 0);

    const wx = {
      temp:  Math.round(d.current.temperature_2m),
      code:  d.current.weathercode,
      wind:  Math.round(d.current.windspeed_10m),
      fresh: Math.round(fresh48h * 10) / 10, // inches past 48h
      forecast: d.daily.time.slice(3, 6).map((date, i) => ({
        day:  new Date(date + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'short' }),
        code: d.daily.weathercode[i + 3],
        hi:   Math.round(d.daily.temperature_2m_max[i + 3]),
        lo:   Math.round(d.daily.temperature_2m_min[i + 3]),
        snow: Math.round((d.daily.snowfall_sum?.[i + 3] || 0) * 10) / 10,
      }))
    };
    state.weatherCache[resort.id] = { data: wx, ts: Date.now() };
    return wx;
  } catch { return null; }
}

// ─── Snow / condition helpers ─────────────────────────────────────────────────
function snowQualityLabel(tempF) {
  if (tempF <= 20) return { label: '🧊 Cold & dry',      cls: 'sq-cold'  };
  if (tempF <= 30) return { label: '✅ Prime powder',     cls: 'sq-prime' };
  if (tempF <= 36) return { label: '👍 Good groomed',     cls: 'sq-good'  };
  if (tempF <= 42) return { label: '⚠️ Warm — go early', cls: 'sq-warm'  };
  return              { label: '🌡 Spring skiing',        cls: 'sq-hot'   };
}

function windWarning(windMph) {
  if (windMph >= 35) return '🚫 High wind — lifts may close';
  if (windMph >= 25) return '💨 Gusty — upper chairs may close';
  return null;
}

function sparkline(values = []) {
  const ticks = '▁▂▃▄▅▆▇█';
  const nums  = values.map(v => Number(v) || 0);
  const max   = Math.max(1, ...nums);
  return nums.map(v => ticks[Math.max(0, Math.min(ticks.length - 1, Math.round((v / max) * (ticks.length - 1))))]).join(' ');
}

function crowdForecast(resort) {
  let score = 20;
  if (resort.price < 70)             score += 15;
  if (resort.night)                  score += 8;
  if (resort.terrainPark)            score += 6;
  if (resort.vertical > 1400)        score += 10;
  if ((resort.pass || '').includes('Indy')) score += 10;
  const d = state.driveCache[resort.id];
  if (d !== undefined && d !== null) {
    if (d < 120)      score += 20;
    else if (d < 180) score += 12;
    else if (d < 240) score += 6;
  }
  if (score < 35) return { label: 'Low',      cls: 'crowd-low',    score };
  if (score < 60) return { label: 'Moderate', cls: 'crowd-medium', score };
  return                  { label: 'High',     cls: 'crowd-high',   score };
}

function operationsOutlook(resort, wx) {
  if ((wx?.temp >= 38) || resort.snowmaking < 70)
    return { label: 'Ops outlook: Watch conditions', warn: true };
  return { label: 'Ops outlook: Strong snowmaking setup', warn: false };
}

function driveColor(minutes, isSelected = false) {
  if (isSelected)    return '#22b38a';
  if (minutes <= 90)  return '#22b38a';
  if (minutes <= 150) return '#8ccf57';
  if (minutes <= 210) return '#f0b44c';
  return '#e07a5f';
}

// ─── URL hash (share / deep-link) ─────────────────────────────────────────────
function readHash() {
  const id = window.location.hash.replace('#', '');
  if (id && RESORTS.find(r => r.id === id)) state.selectedId = id;
}

function copyShareLink(resort) {
  const url = `${location.origin}${location.pathname}#${resort.id}`;
  navigator.clipboard.writeText(url)
    .then(() => showToast('🔗 Link copied!'))
    .catch(() => showToast('Share: ' + url));
}

// ─── Summary cards ────────────────────────────────────────────────────────────
function renderSummaryCards(resorts) {
  const n     = resorts.length;
  const avg   = key => n ? Math.round(resorts.reduce((s, r) => s + r[key], 0) / n) : 0;
  const topDrive = n && Object.keys(state.driveCache).length
    ? resorts.filter(r => state.driveCache[r.id] != null)
             .sort((a, b) => state.driveCache[a.id] - state.driveCache[b.id])[0]
    : null;
  els.summaryCards.innerHTML = [
    ['Resorts',     n,                       ''],
    ['Avg Vertical',avg('vertical') + ' ft', ''],
    ['Avg Trails',  avg('trails'),            ''],
    ['Night Skiing',resorts.filter(r => r.night).length, 'of ' + n],
    ['From',        '$' + Math.min(...resorts.map(r => r.price)), 'day ticket'],
    ['Closest',     topDrive?.name || 'Set location', topDrive ? formatDrive(state.driveCache[topDrive.id]) : ''],
  ].map(([label, val, sub]) => `
    <div class="stat-card">
      <div class="stat-label">${label}</div>
      <div class="stat-value">${val}</div>
      ${sub ? `<div class="stat-sub">${sub}</div>` : ''}
    </div>`).join('');
}

// ─── Active filters ───────────────────────────────────────────────────────────
function renderActiveFilters() {
  const tags = [];
  if (state.search.trim())
    tags.push({ label: `"${state.search.trim()}"`,    clear: () => { state.search = ''; els.searchInput.value = ''; } });
  if (state.stateFilter !== 'All')
    tags.push({ label: `State: ${state.stateFilter}`, clear: () => { state.stateFilter = 'All'; els.stateFilter.value = 'All'; } });
  if (state.pass !== 'All')
    tags.push({ label: `Pass: ${state.pass}`,          clear: () => { state.pass = 'All'; els.passFilter.value = 'All'; } });
  if (state.nightOnly)
    tags.push({ label: '🌙 Night only', clear: () => { state.nightOnly = false; els.toggleNight.setAttribute('aria-pressed', 'false'); } });
  [...state.activeQF].forEach(qf => {
    tags.push({ label: QF_LABELS[qf] || qf, clear: () => {
      state.activeQF.delete(qf);
      document.querySelector(`.qf-btn[data-qf="${qf}"]`)?.classList.remove('active');
    }});
  });

  els.activeFilters.innerHTML = tags.map((t, i) =>
    `<span class="filter-tag">${t.label}<button type="button" data-idx="${i}" aria-label="Remove filter">✕</button></span>`
  ).join('');
  [...els.activeFilters.querySelectorAll('button')].forEach(btn => {
    btn.addEventListener('click', () => { tags[+btn.dataset.idx].clear(); render(); });
  });
}

// ─── Sidebar list ─────────────────────────────────────────────────────────────
function renderResortList(resorts) {
  els.resultCount.textContent = `${resorts.length} resort${resorts.length === 1 ? '' : 's'}`;
  if (!resorts.length) { els.resortList.innerHTML = '<div class="empty-state">No resorts match.</div>'; return; }

  els.resortList.innerHTML = resorts.map(r => {
    const drive  = state.driveCache[r.id];
    const driveChip = drive != null ? `<span class="chip">${formatDrive(drive)}</span>` : '';
    const isFav  = state.favorites.has(r.id);
    const ss     = seasonStatus(r);
    const wxData = state.weatherCache[r.id]?.data;
    const freshChip = wxData?.fresh > 0 ? `<span class="chip fresh">❄️ ${wxData.fresh}"</span>` : '';
    return `
    <div class="resort-item ${r.id === state.selectedId ? 'active' : ''} ${state.compareSet.has(r.id) ? 'compare-queued' : ''}"
         data-id="${r.id}" tabindex="0" role="button" aria-label="${r.name}">
      <div class="resort-top">
        <div>
          <div class="resort-name">
            <span class="season-dot ${ss.cls}" title="${ss.label}"></span>
            ${r.name}${isFav ? ' ⭐' : ''}
          </div>
          <div class="resort-meta">${r.state} · $${r.price}</div>
        </div>
      </div>
      <div class="chip-row">
        <span class="chip">${r.vertical}ft</span>
        <span class="chip">${r.trails} trails</span>
        ${r.night       ? '<span class="chip good">🌙</span>' : ''}
        ${r.terrainPark ? '<span class="chip warn">🛹</span>' : ''}
        ${freshChip}
        ${driveChip}
      </div>
      <label class="compare-check">
        <input type="checkbox" data-compare="${r.id}" ${state.compareSet.has(r.id) ? 'checked' : ''} />
        Add to compare
      </label>
    </div>`;
  }).join('');

  [...els.resortList.querySelectorAll('.resort-item')].forEach(item => {
    const sel = () => { state.selectedId = item.dataset.id; render(); };
    item.addEventListener('click',   e => { if (!e.target.closest('input')) sel(); });
    item.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') sel(); });
  });
  [...els.resortList.querySelectorAll('[data-compare]')].forEach(cb => {
    cb.addEventListener('change', () => {
      const id = cb.dataset.compare;
      cb.checked ? state.compareSet.add(id) : state.compareSet.delete(id);
      renderCompareTray();
      els.resortList.querySelector(`[data-id="${id}"]`)?.classList.toggle('compare-queued', cb.checked);
    });
  });
  els.resortList.querySelector('.resort-item.active')?.scrollIntoView({ block: 'nearest' });
}

// ─── Comparison table ─────────────────────────────────────────────────────────
function renderComparisonTable(resorts) {
  [...els.comparisonTable.querySelectorAll('th.sortable')].forEach(th => {
    th.classList.remove('sort-asc', 'sort-desc');
    if (th.dataset.col === state.sortCol) th.classList.add(state.sortDir === 'asc' ? 'sort-asc' : 'sort-desc');
  });
  if (!resorts.length) {
    els.comparisonBody.innerHTML = `<tr><td colspan="13" class="empty-state">No resorts match.</td></tr>`;
    return;
  }

  // Pre-compute best values per numeric column for highlighting
  const numCols = ['vertical','trails','lifts','acres','longestRun','snowfall','snowmaking'];
  const bestVal = {};
  numCols.forEach(k => { bestVal[k] = Math.max(...resorts.map(r => r[k])); });
  const bestPrice = Math.min(...resorts.map(r => r.price));
  const driveTimes = resorts.map(r => state.driveCache[r.id]).filter(v => v != null);
  const bestDrive  = driveTimes.length ? Math.min(...driveTimes) : null;

  const bar = (val, key) => {
    const pct = Math.min(100, Math.round((val / (COL_MAX[key] || 1)) * 100));
    return `<div class="bar-cell"><span>${val}</span><div class="inline-bar"><div class="inline-bar-fill" style="width:${pct}%"></div></div></div>`;
  };

  els.comparisonBody.innerHTML = resorts.map(r => {
    const drive = state.driveCache[r.id];
    const driveCell = drive === null
      ? `<span class="drive-na">N/A</span>`
      : drive !== undefined
        ? `<span class="drive-cell">${formatDrive(drive)}</span>`
        : `<span class="drive-na">${state.origin ? (state.drivesLoading ? '…' : '—') : 'Set'}</span>`;

    const bc = (key, v) => numCols.includes(key) && v === bestVal[key] ? 'best-col' : '';

    return `
      <tr data-id="${r.id}" class="${r.id === state.selectedId ? 'active-row' : ''}">
        <td class="col-name">
          <div class="td-resort-name">${r.name}${state.favorites.has(r.id) ? ' ⭐' : ''}</div>
          <div class="td-resort-state">${r.seasonOpen}–${r.seasonClose}</div>
        </td>
        <td class="col-state td-resort-state">${r.state}</td>
        <td class="col-num ${bc('vertical',   r.vertical)}">${bar(r.vertical,   'vertical')}</td>
        <td class="col-num ${bc('trails',     r.trails)}">${bar(r.trails,       'trails')}</td>
        <td class="col-num ${bc('lifts',      r.lifts)}">${bar(r.lifts,         'lifts')}</td>
        <td class="col-num ${bc('acres',      r.acres)}">${bar(r.acres,         'acres')}</td>
        <td class="col-num ${bc('longestRun', r.longestRun)}">${bar(r.longestRun,'longestRun')}</td>
        <td class="col-num ${bc('snowfall',   r.snowfall)}">${bar(r.snowfall,   'snowfall')}</td>
        <td class="col-num ${bc('snowmaking', r.snowmaking)}">${bar(r.snowmaking,'snowmaking')}</td>
        <td class="col-num price-cell ${r.price === bestPrice ? 'best-col' : ''}">$${r.price}</td>
        <td class="col-num ${drive != null && drive === bestDrive ? 'best-col' : ''}">${driveCell}</td>
        <td class="col-center">${r.night       ? '<span class="night-yes" title="Night skiing">🌙</span>' : '<span class="night-no">—</span>'}</td>
        <td class="col-center">${r.terrainPark ? '<span class="park-yes"  title="Terrain park">🛹</span>' : '<span class="night-no">—</span>'}</td>
      </tr>`;
  }).join('');

  [...els.comparisonBody.querySelectorAll('tr[data-id]')].forEach(row => {
    row.addEventListener('click', () => { state.selectedId = row.dataset.id; render(); });
  });
}

// ─── Selected resort detail ───────────────────────────────────────────────────
async function renderSelectedResort(resort) {
  if (!resort) { els.selectedResortSection.style.display = 'none'; return; }
  els.selectedResortSection.style.display = '';

  const wxPromise = fetchWeather(resort);
  const drive     = state.driveCache[resort.id];
  const driveStr  = drive != null ? formatDrive(drive) : state.origin ? (state.drivesLoading ? 'Calculating…' : '—') : 'Set location above';
  const isFav     = state.favorites.has(resort.id);
  const ss        = seasonStatus(resort);
  const cpvf      = (resort.price / resort.vertical * 100).toFixed(1); // cents per vertical foot

  const terrainBars = [
    ['Beginner',     'beginner',     resort.difficulty.beginner],
    ['Intermediate', 'intermediate', resort.difficulty.intermediate],
    ['Advanced',     'advanced',     resort.difficulty.advanced],
    ['Expert',       'expert',       resort.difficulty.expert],
  ].map(([l, c, v]) => `
    <div class="bar-row">
      <div class="bar-label"><span class="difficulty-dot ${c}"></span>${l}</div>
      <div class="bar"><div class="bar-fill ${c}" style="width:${v * 100}%"></div></div>
      <div class="bar-pct">${Math.round(v * 100)}%</div>
    </div>`).join('');

  const mediaBox = (title, img, page, btn) => {
    const media = img
      ? `<img src="${img}" alt="${title}" loading="lazy" onerror="this.style.display='none';this.nextElementSibling.style.display='grid'">`
        + `<div class="placeholder" style="display:none">Image unavailable</div>`
      : `<div class="placeholder">No image — <a href="${page || '#'}" target="_blank">view page ↗</a></div>`;
    const link = page ? `<a href="${page}" target="_blank" rel="noreferrer">${btn} ↗</a>` : '';
    return `<div class="media-box">${media}<div class="media-caption">${link}</div></div>`;
  };

  els.selectedResort.innerHTML = `
    <div class="resort-detail-header">
      <div>
        <div class="eyebrow">Selected Resort</div>
        <div class="resort-detail-name">${resort.name}</div>
        <div class="resort-detail-meta">
          ${resort.state} · ${resort.pass} pass · ${resort.owner}
          · Season: ${resort.seasonOpen}–${resort.seasonClose}
          · <span class="season-dot ${ss.cls}" style="vertical-align:middle" title="${ss.label}"></span> ${ss.label}
        </div>
      </div>
      <div class="resort-detail-actions">
        <button id="favBtn" type="button" class="btn btn-secondary btn-sm">${isFav ? '★ Saved' : '☆ Save'}</button>
        <button id="shareBtn" type="button" class="btn btn-secondary btn-sm">🔗 Share</button>
        <a href="${resort.website}" target="_blank" rel="noreferrer" class="btn btn-secondary btn-sm" style="text-decoration:none;display:inline-flex;align-items:center">Website ↗</a>
      </div>
    </div>

    <div class="detail-grid-top">
      <div class="metric-card highlight">
        <div class="metric-label">Vertical</div>
        <div class="metric-value">${resort.vertical} ft</div>
        <div class="metric-sub">${cpvf}¢ / vert ft</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">Trails</div>
        <div class="metric-value">${resort.trails}</div>
        <div class="metric-sub">${resort.lifts} lifts</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">Acres</div>
        <div class="metric-value">${resort.acres}</div>
        <div class="metric-sub">Longest: ${resort.longestRun} mi</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">Day Ticket</div>
        <div class="metric-value">$${resort.price}</div>
        <div class="metric-sub">${resort.pass} pass</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">Avg Snowfall</div>
        <div class="metric-value">${resort.snowfall}"</div>
        <div class="metric-sub">Snowmaking: ${resort.snowmaking}%</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">Drive Time</div>
        <div class="metric-value" style="font-size:18px">${driveStr}</div>
        <div class="metric-sub">${state.origin?.label || 'from your location'}</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">Night Skiing</div>
        <div class="metric-value">${resort.night ? '🌙 Yes' : 'No'}</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">Terrain Park</div>
        <div class="metric-value">${resort.terrainPark ? '🛹 Yes' : 'No'}</div>
      </div>
    </div>

    <div class="detail-grid-mid">
      <div class="sub-card">
        <h3>Terrain Mix</h3>
        ${terrainBars}
      </div>
      <div class="sub-card">
        <h3>Lifts</h3>
        ${resort.liftsBreakdown.map(([type, count]) =>
          `<div class="lift-row"><span>${type}</span><span style="font-family:'DM Mono',monospace;font-weight:600">${count}</span></div>`
        ).join('')}
        <div class="divider"></div>
        <div class="tag-row" style="margin-top:8px">
          ${(resort.tags || []).map(t => `<span class="tag">${t}</span>`).join('')}
        </div>
        <p class="footer-note">${resort.notes}</p>
      </div>
      <div class="sub-card" id="weatherCard-${resort.id}">
        <h3>Current Weather</h3>
        <div class="loading-text">Loading weather…</div>
      </div>
    </div>

    <div class="detail-grid-bot">
      <div class="media-grid">
        ${mediaBox(resort.name + ' Trail Map', resort.trailMapImage || '', resort.trailMapPage || resort.website, 'Open trail map')}
      </div>
      <div class="notes-card">
        <div class="notes-label">📝 Your Notes</div>
        <textarea id="userNotesInput" class="user-notes-input"
          placeholder="Add your own notes… (saved automatically)">${state.userNotes[resort.id] || ''}</textarea>
        <div id="notesSavedMsg" class="notes-saved" style="display:none">✓ Saved</div>
      </div>
    </div>
  `;

  // Fav button
  $('favBtn').addEventListener('click', () => {
    if (state.favorites.has(resort.id)) state.favorites.delete(resort.id);
    else { state.favorites.add(resort.id); showToast(`⭐ ${resort.name} saved`); }
    localStorage.setItem('ski-favorites', JSON.stringify([...state.favorites]));
    render();
  });

  // Share button
  $('shareBtn').addEventListener('click', () => copyShareLink(resort));

  // Notes autosave
  const notesInput = $('userNotesInput');
  let notesTimer;
  notesInput.addEventListener('input', () => {
    clearTimeout(notesTimer);
    notesTimer = setTimeout(() => {
      state.userNotes[resort.id] = notesInput.value;
      localStorage.setItem('ski-notes', JSON.stringify(state.userNotes));
      const msg = $('notesSavedMsg');
      if (msg) { msg.style.display = 'block'; setTimeout(() => { if (msg) msg.style.display = 'none'; }, 1800); }
    }, 700);
  });

  els.selectedResortSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

  // Populate weather card when fetch resolves
  wxPromise.then(wx => {
    const card = $(`weatherCard-${resort.id}`);
    if (!card) return;
    if (!wx) { card.querySelector('.loading-text').textContent = 'Weather unavailable.'; return; }
    const crowd    = crowdForecast(resort);
    const sq       = snowQualityLabel(wx.temp);
    const windWarn = windWarning(wx.wind);
    const snowVals = wx.forecast.map(f => f.snow || 0);
    card.innerHTML = `
      <h3>Current Weather at ${resort.name}</h3>
      <div class="weather-current">
        <div style="font-size:36px">${WX_CODES[wx.code] || '❓'}</div>
        <div>
          <div class="weather-temp">${wx.temp}°F</div>
          <div class="weather-desc">${WX_DESC[wx.code] || 'Unknown'}</div>
          <div class="weather-wind">Wind: ${wx.wind} mph</div>
        </div>
      </div>
      <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:10px">
        <span class="sq-badge ${sq.cls}">${sq.label}</span>
        ${wx.fresh > 0 ? `<span class="powder-badge">❄️ ${wx.fresh}" in past 48h</span>` : ''}
        ${windWarn ? `<span class="wind-warning">${windWarn}</span>` : ''}
      </div>
      <div class="weather-forecast">
        ${wx.forecast.map(f => `
          <div class="forecast-day">
            <div class="fday">${f.day}</div>
            <div class="ficon">${WX_CODES[f.code] || '❓'}</div>
            <div class="ftemp">${f.hi}° / ${f.lo}°</div>
            <div class="fsnow">${f.snow ? `❄️ ${f.snow}"` : 'no snow'}</div>
          </div>`).join('')}
      </div>
      <div style="display:flex;justify-content:space-between;gap:10px;align-items:center;margin-top:12px;flex-wrap:wrap">
        <span class="badge-soft">Crowd pressure: <strong class="${crowd.cls}">${crowd.label}</strong></span>
        <span class="ops-chip ${operationsOutlook(resort, wx).warn ? 'warn' : ''}">${operationsOutlook(resort, wx).label}</span>
      </div>
      <div style="margin-top:10px">
        <div style="font-size:11px;color:var(--muted);margin-bottom:3px">3-day snow sparkline</div>
        <div class="sparkline">${sparkline(snowVals)}</div>
      </div>
      <p style="font-size:11px;color:var(--muted);margin-top:8px">
        Drive times are estimates under normal conditions. Winter roads add time.
      </p>`;
  });
}

// ─── Mountain scoring ──────────────────────────────────────────────────────────
function mountainTodayScore(resort, wx) {
  const snow3 = wx ? wx.forecast.reduce((s, f) => s + (f.snow || 0), 0) : 0;
  const drive = state.driveCache[resort.id];
  let score   = 0;
  score += snow3 * 12;
  score += Math.max(0, 40 - ((drive ?? 240) / 10));
  score += resort.snowmaking / 8;
  score += resort.vertical / 250;
  score += Math.max(0, 80 - resort.price) / 3;
  return Math.round(score * 10) / 10;
}

// ─── Best Today ───────────────────────────────────────────────────────────────
async function renderBestToday(resorts) {
  if (!els.bestTodayGrid) return;
  els.bestTodayGrid.innerHTML = '<div class="feature-card"><div class="feature-title">Loading today\'s picks…</div></div>';
  const enriched = await Promise.all(resorts.map(async resort => {
    const wx    = await fetchWeather(resort);
    const score = mountainTodayScore(resort, wx);
    const crowd = crowdForecast(resort);
    const snow3 = wx ? wx.forecast.reduce((s, f) => s + (f.snow || 0), 0) : 0;
    return { resort, wx, score, crowd, snow3, drive: state.driveCache[resort.id] };
  }));
  enriched.sort((a, b) => b.score - a.score);
  els.bestTodayGrid.innerHTML = enriched.slice(0, 3).map((item, idx) => {
    const { resort, wx, score, crowd, snow3, drive } = item;
    const fresh = wx?.fresh > 0 ? `<div class="feature-row"><span>Fresh snow (48h)</span><strong>❄️ ${wx.fresh}"</strong></div>` : '';
    return `<div class="feature-card ${idx === 0 ? 'primary-pick' : ''}">
      <div class="feature-kicker">${idx === 0 ? 'Best Mountain Today' : 'Strong option'}</div>
      <div class="feature-title">${resort.name}</div>
      <div class="feature-meta">${resort.state} · ${resort.pass} pass</div>
      <div class="feature-row"><span>Objective score</span><strong>${score}</strong></div>
      <div class="feature-row"><span>Forecast snow (3 days)</span><strong>${snow3 ? `${snow3.toFixed(1)}"` : '0"'}</strong></div>
      ${fresh}
      <div class="feature-row"><span>Drive</span><strong>${drive != null ? formatDrive(drive) : 'Set location'}</strong></div>
      <div class="feature-row"><span>Day ticket*</span><strong>$${resort.price}</strong></div>
      <div class="feature-row"><span>Crowd pressure</span><strong class="${crowd.cls}">${crowd.label}</strong></div>
      <div class="feature-subnote">${wx ? wx.forecast.map(f => `${f.day} ${f.hi}°`).join(' · ') : 'Loading forecast…'}</div>
    </div>`;
  }).join('');
}

// ─── Weekend Planner ──────────────────────────────────────────────────────────
function getWeekendIndices() {
  const today     = new Date().getDay(); // 0=Sun, 6=Sat
  // Days until next Saturday / Sunday from today (0 means today is that day)
  const daysToSat = today === 6 ? 0 : (6 - today);
  const daysToSun = today === 0 ? 0 : (7 - today);
  // With past_days=2, forecast_days=4: indices 0,1=past; 2=today; 3,4,5=next3
  // Map "days from today" to array index: today=2, +1=3, +2=4, +3=5
  const toIdx = d => d + 2;
  return {
    satIdx: daysToSat <= 3 ? toIdx(daysToSat) : null,
    sunIdx: daysToSun <= 3 ? toIdx(daysToSun) : null,
  };
}

async function renderWeekendPlanner(resorts) {
  if (!els.weekendPlannerGrid) return;
  els.weekendPlannerGrid.innerHTML = '<div class="feature-card"><div class="feature-title">Loading weekend planner…</div></div>';

  const { satIdx, sunIdx } = getWeekendIndices();

  const enriched = await Promise.all(resorts.map(async resort => {
    const wx    = await fetchWeather(resort);
    const drive = state.driveCache[resort.id];
    const crowd = crowdForecast(resort).score;
    // wx.forecast is already sliced to [tomorrow, +2, +3] (indices 3,4,5 in raw data)
    // satIdx/sunIdx are raw data indices; subtract 3 to get forecast[] index
    const getForecastDay = rawIdx => rawIdx !== null ? wx?.forecast?.[rawIdx - 3] ?? null : null;
    const sat = getForecastDay(satIdx);
    const sun = getForecastDay(sunIdx);
    const score = (day) => day
      ? ((day.snow || 0) * 12) + (resort.snowmaking / 8) + (resort.vertical / 250)
        + Math.max(0, 40 - ((drive ?? 240) / 10)) - crowd / 8
      : -Infinity;
    return { resort, wx, sat, sun, satScore: score(sat), sunScore: score(sun), drive };
  }));

  const bestSat  = satIdx !== null ? [...enriched].sort((a, b) => b.satScore - a.satScore)[0] : null;
  const bestSun  = sunIdx !== null ? [...enriched].sort((a, b) => b.sunScore - a.sunScore)[0] : null;
  const cheapest = [...resorts].sort((a, b) => a.price - b.price)[0];
  const closest  = [...resorts].filter(r => state.driveCache[r.id] != null)
                               .sort((a, b) => state.driveCache[a.id] - state.driveCache[b.id])[0];

  const DAY_NAMES = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  const today = new Date().getDay();
  const satLabel = satIdx !== null ? `Saturday (${DAY_NAMES[(today + (satIdx - 2)) % 7]})` : 'Saturday';
  const sunLabel = sunIdx !== null ? `Sunday (${DAY_NAMES[(today + (sunIdx - 2)) % 7]})`   : 'Sunday';

  const cards = [];
  if (bestSat) cards.push(`<div class="feature-card weekend-pick">
    <div class="feature-kicker">${satLabel} pick</div>
    <div class="feature-title">${bestSat.resort.name}</div>
    <div class="feature-meta">${bestSat.resort.state} · ${bestSat.drive != null ? formatDrive(bestSat.drive) : 'Set location'}</div>
    <div class="feature-row"><span>Forecast</span><strong>${bestSat.sat ? `${bestSat.sat.hi}° / ${bestSat.sat.lo}°` : '—'}</strong></div>
    <div class="feature-row"><span>Forecast snow</span><strong>${bestSat.sat?.snow ? `${bestSat.sat.snow}"` : '0"'}</strong></div>
    <div class="feature-row"><span>Day ticket*</span><strong>$${bestSat.resort.price}</strong></div>
  </div>`);
  if (bestSun) cards.push(`<div class="feature-card weekend-pick">
    <div class="feature-kicker">${sunLabel} pick</div>
    <div class="feature-title">${bestSun.resort.name}</div>
    <div class="feature-meta">${bestSun.resort.state} · ${bestSun.drive != null ? formatDrive(bestSun.drive) : 'Set location'}</div>
    <div class="feature-row"><span>Forecast</span><strong>${bestSun.sun ? `${bestSun.sun.hi}° / ${bestSun.sun.lo}°` : '—'}</strong></div>
    <div class="feature-row"><span>Forecast snow</span><strong>${bestSun.sun?.snow ? `${bestSun.sun.snow}"` : '0"'}</strong></div>
    <div class="feature-row"><span>Day ticket*</span><strong>$${bestSun.resort.price}</strong></div>
  </div>`);
  if (!bestSat && !bestSun) cards.push(`<div class="feature-card">
    <div class="feature-title">Weekend not in forecast window</div>
    <div class="feature-meta">The upcoming weekend is beyond the 3-day forecast range.</div>
  </div>`);
  if (closest) cards.push(`<div class="feature-card">
    <div class="feature-kicker">Closest option</div>
    <div class="feature-title">${closest.name}</div>
    <div class="feature-meta">${closest.state} · ${formatDrive(state.driveCache[closest.id])}</div>
    <div class="feature-row"><span>Ticket*</span><strong>$${closest.price}</strong></div>
    <div class="feature-row"><span>Vertical</span><strong>${closest.vertical} ft</strong></div>
    <div class="feature-row"><span>Night skiing</span><strong>${closest.night ? 'Yes' : 'No'}</strong></div>
  </div>`);
  if (cheapest) cards.push(`<div class="feature-card">
    <div class="feature-kicker">Budget pick</div>
    <div class="feature-title">${cheapest.name}</div>
    <div class="feature-meta">${cheapest.state} · lowest listed day ticket</div>
    <div class="feature-row"><span>Ticket*</span><strong>$${cheapest.price}</strong></div>
    <div class="feature-row"><span>Trails</span><strong>${cheapest.trails}</strong></div>
    <div class="feature-row"><span>Snowmaking</span><strong>${cheapest.snowmaking}%</strong></div>
  </div>`);

  els.weekendPlannerGrid.innerHTML = cards.join('');
}

// ─── Snow Rankings ────────────────────────────────────────────────────────────
async function renderSnowRankings(resorts) {
  if (!els.snowRankings) return;
  els.snowRankings.innerHTML = '<div class="feature-card"><div class="feature-title">Loading forecast cards…</div></div>';
  const enriched = await Promise.all(resorts.map(async resort => {
    const wx        = await fetchWeather(resort);
    const nextSnow  = wx ? wx.forecast.reduce((s, f) => s + (f.snow || 0), 0) : 0;
    const crowd     = crowdForecast(resort);
    const drive     = state.driveCache[resort.id];
    const objScore  = (nextSnow * 12) + Math.max(0, 40 - ((drive ?? 220) / 10)) + (resort.snowmaking / 8) + (resort.vertical / 250);
    return { resort, wx, nextSnow, crowd, drive, objScore };
  }));
  enriched.sort((a, b) => b.objScore - a.objScore);
  els.snowRankings.innerHTML = enriched.slice(0, 6).map((item, idx) => {
    const { resort, wx, nextSnow, crowd, drive } = item;
    const snowVals = wx?.forecast?.map(f => f.snow || 0) || [0, 0, 0];
    const fresh    = wx?.fresh > 0 ? `<div class="feature-row"><span>Fresh (48h)</span><strong>❄️ ${wx.fresh}"</strong></div>` : '';
    return `<div class="feature-card">
      <div class="feature-kicker">${idx === 0 ? 'Top weather setup' : 'Snow outlook'}</div>
      <div class="feature-title">${resort.name}</div>
      <div class="feature-meta">${resort.state} · ${resort.pass} pass · ${drive != null ? formatDrive(drive) : 'set location for drive'}</div>
      <div class="badge-soft" style="margin-bottom:8px">${nextSnow ? `❄️ ${nextSnow.toFixed(1)}" next 3 days` : 'No forecast snow'}</div>
      ${fresh}
      <div style="margin:8px 0 12px">
        <div style="font-size:11px;color:var(--muted);margin-bottom:3px">Snow sparkline</div>
        <div class="sparkline">${sparkline(snowVals)}</div>
      </div>
      <div class="feature-row"><span>Crowd pressure</span><strong class="${crowd.cls}">${crowd.label}</strong></div>
      <div class="feature-row"><span>Snowmaking</span><strong>${resort.snowmaking}%</strong></div>
      <div class="feature-row"><span>Vertical</span><strong>${resort.vertical} ft</strong></div>
      <div class="feature-row"><span>3-day forecast</span><strong>${wx?.forecast?.map(f => `${f.day} ${f.hi}°`).join(' · ') || 'Loading'}</strong></div>
    </div>`;
  }).join('');
}

// ─── Pass Calculator ──────────────────────────────────────────────────────────
function renderPassCalculator(resorts) {
  if (!els.passCalcGrid) return;
  const days        = Math.max(1, Number(els.skiDays?.value || state.skiDays || 5));
  state.skiDays     = days;
  const INDY_PRICE  = 349;

  els.passCalcGrid.innerHTML = resorts.map(resort => {
    const dayTotal      = resort.price * days;
    const indyEligible  = resort.pass === 'Indy';
    const breakEven     = indyEligible ? Math.ceil(INDY_PRICE / resort.price) : null;
    let verdict         = 'Day tickets likely best';
    let extraRow        = '';
    if (indyEligible) {
      if (days >= breakEven) verdict = `Indy saves ~$${Math.max(0, dayTotal - INDY_PRICE)}`;
      else                   verdict = `${breakEven - days} more day(s) to break even`;
      extraRow = `<div class="feature-row"><span>Indy break-even</span><strong>${breakEven} days</strong></div>`;
    }
    return `<div class="feature-card">
      <div class="feature-kicker">${indyEligible ? 'Indy math' : 'Day-ticket math'}</div>
      <div class="feature-title">${resort.name}</div>
      <div class="feature-meta">${resort.state} · ${resort.pass}</div>
      <div class="feature-row"><span>Ticket price</span><strong>$${resort.price}</strong></div>
      <div class="feature-row"><span>${days} day total</span><strong>$${dayTotal}</strong></div>
      ${indyEligible ? `<div class="feature-row"><span>Indy Pass price</span><strong>$${INDY_PRICE}</strong></div>` : ''}
      ${extraRow}
      <div class="feature-row"><span>Verdict</span><strong>${verdict}</strong></div>
    </div>`;
  }).join('');
}

// ─── Async render debounce ────────────────────────────────────────────────────
// These sections make many API calls — only re-fire when the filtered list changes
let _lastFilterKey = '';
let _asyncTimer    = null;

function scheduleAsyncRenders(resorts) {
  const key     = resorts.map(r => r.id).join(',');
  const isFirst = _lastFilterKey === '';
  if (key === _lastFilterKey) return;
  _lastFilterKey = key;
  clearTimeout(_asyncTimer);
  _asyncTimer = setTimeout(() => {
    renderBestToday(resorts);
    renderWeekendPlanner(resorts);
    renderSnowRankings(resorts);
  }, isFirst ? 0 : 400);
}

// ─── Compare tray & panel ─────────────────────────────────────────────────────
function renderCompareTray() {
  if (state.compareSet.size === 0) { els.compareTray.style.display = 'none'; return; }
  els.compareTray.style.display = '';
  const ids = [...state.compareSet];
  els.comparePills.innerHTML = ids.map(id => {
    const name = RESORTS.find(r => r.id === id)?.name || id;
    return `<span class="compare-pill">${name}<button type="button" data-remove="${id}">✕</button></span>`;
  }).join('');
  [...els.comparePills.querySelectorAll('[data-remove]')].forEach(btn => {
    btn.addEventListener('click', () => {
      state.compareSet.delete(btn.dataset.remove);
      renderCompareTray();
      render();
    });
  });
}

function renderComparePanel() {
  const resorts = [...state.compareSet].map(id => RESORTS.find(r => r.id === id)).filter(Boolean);
  if (resorts.length < 2) { showToast('Select at least 2 resorts to compare'); return; }
  els.comparePanel.style.display = '';
  els.comparePanel.scrollIntoView({ behavior: 'smooth', block: 'start' });

  const ROWS = [
    ['State',         r => r.state,                                  null],
    ['Vertical',      r => `${r.vertical} ft`,                       'vertical'],
    ['Trails',        r => r.trails,                                  'trails'],
    ['Lifts',         r => r.lifts,                                   'lifts'],
    ['Acres',         r => r.acres,                                   'acres'],
    ['Longest Run',   r => `${r.longestRun} mi`,                     'longestRun'],
    ['Avg Snowfall',  r => `${r.snowfall}"`,                          'snowfall'],
    ['Snowmaking',    r => `${r.snowmaking}%`,                        'snowmaking'],
    ['Day Ticket',    r => `$${r.price}`,   null, (a,b) => a.price - b.price],
    ['¢ / vert ft',   r => `${(r.price / r.vertical * 100).toFixed(1)}¢`, null, (a,b) => (a.price/a.vertical) - (b.price/b.vertical)],
    ['Night Skiing',  r => r.night        ? '🌙 Yes' : 'No',         null],
    ['Terrain Park',  r => r.terrainPark  ? '🛹 Yes' : 'No',         null],
    ['Season',        r => `${r.seasonOpen}–${r.seasonClose}`,        null],
    ['Drive',         r => { const d = state.driveCache[r.id]; return d ? formatDrive(d) : '—'; },
                      null, (a,b) => (state.driveCache[a.id] ?? 9999) - (state.driveCache[b.id] ?? 9999)],
  ];

  els.compareContent.innerHTML = `
    <table class="compare-table">
      <thead><tr>
        <th>Stat</th>
        ${resorts.map(r => `<th style="color:var(--text)">${r.name}</th>`).join('')}
      </tr></thead>
      <tbody>
        ${ROWS.map(([label, fn, numKey, sortFn]) => {
          let bestIdx = -1;
          if (numKey) {
            const vals = resorts.map(r => r[numKey]);
            bestIdx = vals.indexOf(Math.max(...vals));
          } else if (sortFn) {
            const sorted = [...resorts].sort(sortFn);
            bestIdx = resorts.indexOf(sorted[0]);
          }
          return `<tr>
            <td style="color:var(--muted);font-size:12px;font-family:'DM Mono',monospace;text-transform:uppercase;letter-spacing:.06em">${label}</td>
            ${resorts.map((r, i) => `<td class="${i === bestIdx ? 'best' : ''}">${fn(r)}</td>`).join('')}
          </tr>`;
        }).join('')}
      </tbody>
    </table>`;
}

// ─── Leaflet Map ──────────────────────────────────────────────────────────────
let leafletMap     = null;
let leafletMarkers = {};

function initLeafletMap() {
  if (leafletMap || typeof L === 'undefined') return;
  leafletMap = L.map('leafletMap', { zoomControl: true, scrollWheelZoom: true })
               .setView([43.5, -71.8], 7);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© <a href="https://openstreetmap.org/copyright">OpenStreetMap</a>',
    maxZoom: 18,
  }).addTo(leafletMap);
}

function updateLeafletMap(resorts) {
  if (!leafletMap) return;
  const filteredIds = new Set(resorts.map(r => r.id));

  RESORTS.forEach(base => {
    const inFilter  = filteredIds.has(base.id);
    const isSelected= base.id === state.selectedId;
    let color = isSelected ? '#22b38a' : inFilter ? '#2b6de9' : '#9fb6d3';
    if (state.origin && state.driveCache[base.id] != null)
      color = driveColor(state.driveCache[base.id], isSelected);
    const size    = isSelected ? 14 : 10;
    const opacity = inFilter ? 1 : 0.35;

    const icon = L.divIcon({
      className: '',
      html: `<div style="width:${size}px;height:${size}px;border-radius:50%;background:${color};border:2px solid rgba(27,42,58,.7);box-shadow:${isSelected ? '0 0 0 4px rgba(34,179,138,.3)' : '0 2px 6px rgba(0,0,0,.25)'};opacity:${opacity};transition:all .2s"></div>`,
      iconSize:   [size, size],
      iconAnchor: [size / 2, size / 2],
    });

    if (leafletMarkers[base.id]) { leafletMarkers[base.id].setIcon(icon); return; }

    const resort = RESORTS.find(r => r.id === base.id);
    const marker = L.marker([base.lat, base.lon], { icon })
      .addTo(leafletMap)
      .bindPopup(`
        <div class="map-popup-name">${resort.name}</div>
        <div class="map-popup-meta">${resort.state} · ${resort.pass} pass</div>
        <div class="map-popup-stats">
          <div class="map-popup-stat"><span>Vertical</span><span>${resort.vertical} ft</span></div>
          <div class="map-popup-stat"><span>Trails</span><span>${resort.trails}</span></div>
          <div class="map-popup-stat"><span>Day Ticket</span><span>$${resort.price}</span></div>
          <div class="map-popup-stat"><span>Night</span><span>${resort.night ? '🌙 Yes' : 'No'}</span></div>
        </div>
        <button class="map-popup-btn" type="button" onclick="selectResortFromMap('${resort.id}')">View Details</button>
      `, { maxWidth: 220 });

    marker.on('click', () => { state.selectedId = resort.id; render(); });
    leafletMarkers[base.id] = marker;
  });
}

window.selectResortFromMap = function(id) {
  state.selectedId = id;
  render();
  document.querySelector('.main-content')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

// ─── Sort headers ─────────────────────────────────────────────────────────────
function wireSortHeaders() {
  [...els.comparisonTable.querySelectorAll('th.sortable')].forEach(th => {
    th.addEventListener('click', () => {
      const col = th.dataset.col;
      if (state.sortCol === col) {
        state.sortDir = state.sortDir === 'desc' ? 'asc' : 'desc';
      } else {
        state.sortCol = col;
        state.sortDir = (col === 'name' || col === 'state') ? 'asc' : 'desc';
      }
      els.sortBy.value = col;
      render();
    });
  });
}

// ─── Location wiring ──────────────────────────────────────────────────────────
function wireLocation() {
  const applyLocation = async () => {
    const q = els.originInput.value.trim();
    if (!q) {
      state.origin = null;
      state.driveCache = {};
      state.drivesLoading = false;
      render();
      return;
    }
    showToast('🔍 Finding location…', 3000);
    const loc = await geocodeOrigin(q);
    if (loc) {
      state.origin = loc;
      state.driveCache = {};
      showToast(`📍 Origin set to ${loc.label}`);
      await loadAllDriveTimes();
    } else {
      showToast('Could not find that ZIP or location');
    }
  };

  els.originInput.addEventListener('keydown', async e => {
    if (e.key !== 'Enter') return;
    e.preventDefault();
    await applyLocation();
  });
  els.setLocation?.addEventListener('click', applyLocation);

  let locationTimer;
  els.originInput.addEventListener('input', () => {
    clearTimeout(locationTimer);
    locationTimer = setTimeout(() => {
      if (!els.originInput.value.trim()) {
        state.origin = null;
        state.driveCache = {};
        state.drivesLoading = false;
        render();
      }
    }, 600);
  });

  els.detectLocation.addEventListener('click', () => {
    if (!navigator.geolocation) { showToast('Geolocation not supported'); return; }
    showToast('📍 Detecting location…', 3000);
    navigator.geolocation.getCurrentPosition(async pos => {
      state.origin = { lat: pos.coords.latitude, lon: pos.coords.longitude, label: 'Your location' };
      els.originInput.value = 'Your location';
      state.driveCache = {};
      await loadAllDriveTimes();
    }, () => showToast('Could not get location'));
  });
}

// ─── Main event wiring ────────────────────────────────────────────────────────
function wireEvents() {
  // Search — filter only, no auto-select
  els.searchInput.addEventListener('input', e => {
    state.search = e.target.value;
    render();
  });

  els.stateFilter.addEventListener('change', e => { state.stateFilter = e.target.value; render(); });
  els.passFilter.addEventListener('change',  e => { state.pass        = e.target.value; render(); });
  els.sortBy.addEventListener('change', e => {
    state.sortCol = e.target.value;
    state.sortDir = (['drive', 'price', 'name', 'state'].includes(state.sortCol)) ? 'asc' : 'desc';
    render();
  });

  els.toggleNight.addEventListener('click', () => {
    state.nightOnly = !state.nightOnly;
    els.toggleNight.setAttribute('aria-pressed', String(state.nightOnly));
    render();
  });

  els.randomResort.addEventListener('click', () => {
    const resorts = filteredResorts();
    if (!resorts.length) return;
    const pick = resorts[Math.floor(Math.random() * resorts.length)];
    state.selectedId = pick.id;
    render();
    showToast(`✦ Showing: ${pick.name}`);
  });

  // Quick filters
  document.querySelectorAll('.qf-btn[data-qf]').forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.dataset.qf;
      if (state.activeQF.has(key)) {
        state.activeQF.delete(key);
        btn.classList.remove('active');
      } else {
        state.activeQF.add(key);
        btn.classList.add('active');
      }
      render();
    });
  });

  els.compareBtn.addEventListener('click', renderComparePanel);
  els.clearCompare.addEventListener('click', () => {
    state.compareSet.clear();
    renderCompareTray();
    els.comparePanel.style.display = 'none';
    render();
  });
  els.closeCompare.addEventListener('click', () => { els.comparePanel.style.display = 'none'; });

  // Pass calculator days input
  els.skiDays?.addEventListener('input', () => renderPassCalculator(filteredResorts()));

  // Top nav smooth scroll
  document.querySelectorAll('.top-nav a').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  // Back to top
  if (els.backToTop) {
    window.addEventListener('scroll', () => {
      els.backToTop.classList.toggle('show', window.scrollY > 500);
    });
    els.backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  wireSortHeaders();
  wireLocation();
}

// ─── Main render ──────────────────────────────────────────────────────────────
function render() {
  const resorts = filteredResorts();
  renderSummaryCards(resorts);
  renderActiveFilters();
  renderResortList(resorts);
  renderComparisonTable(resorts);
  updateLeafletMap(resorts);
  renderPassCalculator(resorts);
  const selected = resorts.find(r => r.id === state.selectedId) || null;
  renderSelectedResort(selected);
  renderCompareTray();
  scheduleAsyncRenders(resorts);
}

// ─── Initialize ───────────────────────────────────────────────────────────────
function initialize() {
  els.stateFilter.innerHTML = uniqueStates().map(s => `<option value="${s}">${s}</option>`).join('');
  els.passFilter.innerHTML  = uniquePasses().map(p => `<option value="${p}">${p}</option>`).join('');
  // Datalist: value = resort name, no extra text node (keeps it clean)
  if (els.resortSuggestions) {
    els.resortSuggestions.innerHTML = RESORTS.map(r => `<option value="${r.name}">`).join('');
  }
  if (els.skiDays) els.skiDays.value = String(state.skiDays);

  readHash();  // deep-link support
  wireEvents();
  render();

  // Leaflet loads via defer — init after DOM is ready and script has executed
  setTimeout(() => initLeafletMap(), 100);
}

initialize();
