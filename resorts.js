// ─── Resort Data ─────────────────────────────────────────────────────────────
const RESORTS = [
  {
    id: 'black-nh', name: 'Black Mountain', state: 'NH', pass: 'Indy', owner: 'Independent',
    vertical: 1100, trails: 45, lifts: 5, acres: 143, snowfall: 120, snowmaking: 98, night: false,
    longestRun: 2.5, lat: 44.1776, lon: -71.1284,
    difficulty: { beginner: 0.20, intermediate: 0.45, advanced: 0.25, expert: 0.10 },
    liftsBreakdown: [['Double', 3], ['Triple', 1], ['Surface', 1]],
    website: 'https://www.blackmt.com/', webcamImage: '', webcamPage: '',
    trailMapImage: '', trailMapPage: 'https://www.blackmt.com/',
    price: 69, terrainPark: false, seasonOpen: 'Dec', seasonClose: 'Mar',
    notes: 'Classic New Hampshire small-mountain feel with strong historic character.',
    tags: ['Historic', 'Classic doubles', 'Indy favorite'],
    bestFor: ['beginners', 'family']
  },
  {
    id: 'black-me', name: 'Black Mountain of Maine', state: 'ME', pass: 'Indy', owner: 'Community nonprofit',
    vertical: 1380, trails: 50, lifts: 3, acres: 600, snowfall: 110, snowmaking: 75, night: true,
    longestRun: 2.0, lat: 44.5342, lon: -70.5368,
    difficulty: { beginner: 0.24, intermediate: 0.38, advanced: 0.24, expert: 0.14 },
    liftsBreakdown: [['Double', 2], ['T-Bar', 1]],
    website: 'https://skiblackmountain.org/', webcamImage: '', webcamPage: '',
    trailMapImage: '', trailMapPage: 'https://skiblackmountain.org/',
    price: 55, terrainPark: false, seasonOpen: 'Dec', seasonClose: 'Mar',
    notes: 'Rumford soul hill with big acreage, meaningful vert, top-to-bottom night skiing, and nonprofit energy.',
    tags: ['Night skiing', 'Maine', 'Community hill'],
    bestFor: ['night', 'budget', 'family']
  },
  {
    id: 'bolton', name: 'Bolton Valley', state: 'VT', pass: 'Indy', owner: 'Independent',
    vertical: 1634, trails: 71, lifts: 6, acres: 300, snowfall: 300, snowmaking: 62, night: true,
    longestRun: 2.0, lat: 44.4217, lon: -72.8518,
    difficulty: { beginner: 0.18, intermediate: 0.44, advanced: 0.25, expert: 0.13 },
    liftsBreakdown: [['Quad', 2], ['Double', 3], ['Surface', 1]],
    website: 'https://www.boltonvalley.com/', webcamImage: '', webcamPage: '',
    trailMapImage: '', trailMapPage: 'https://www.boltonvalley.com/',
    price: 89, terrainPark: true, seasonOpen: 'Nov', seasonClose: 'Apr',
    notes: 'Natural-snow standout with night skiing, backcountry credibility, and one of the strongest local scenes in Vermont.',
    tags: ['Night skiing', 'Natural snow', 'Backcountry'],
    bestFor: ['night', 'natural-snow', 'steeps']
  },
  {
    id: 'bousquet', name: 'Bousquet', state: 'MA', pass: 'Indy', owner: 'Private',
    vertical: 750, trails: 24, lifts: 5, acres: 100, snowfall: 70, snowmaking: 95, night: true,
    longestRun: 1.0, lat: 42.4138, lon: -73.2820,
    difficulty: { beginner: 0.28, intermediate: 0.44, advanced: 0.22, expert: 0.06 },
    liftsBreakdown: [['Quad', 2], ['Triple', 1], ['Surface', 2]],
    website: 'https://www.bousquetmountain.com/', webcamImage: '', webcamPage: '',
    trailMapImage: '', trailMapPage: 'https://www.bousquetmountain.com/',
    price: 65, terrainPark: true, seasonOpen: 'Dec', seasonClose: 'Mar',
    notes: 'Compact but useful mountain with lights, local energy, and easy access.',
    tags: ['Night skiing', 'Berkshires', 'Local hill'],
    bestFor: ['night', 'beginners', 'terrain-park']
  },
  {
    id: 'bradford', name: 'Bradford Ski Area', state: 'MA', pass: 'Independent', owner: 'Independent',
    vertical: 230, trails: 15, lifts: 10, acres: 48, snowfall: 40, snowmaking: 100, night: true,
    longestRun: 0.4, lat: 42.7779, lon: -71.0819,
    difficulty: { beginner: 0.34, intermediate: 0.40, advanced: 0.20, expert: 0.06 },
    liftsBreakdown: [['Triple', 3], ['T-Bar', 1], ['Rope tow', 3], ['Carpet', 3]],
    website: 'https://skibradford.com/', webcamImage: '', webcamPage: '',
    trailMapImage: '', trailMapPage: 'https://skibradford.com/',
    price: 49, terrainPark: false, seasonOpen: 'Dec', seasonClose: 'Mar',
    notes: 'Pure local feeder hill near Boston with strong night-skiing utility and learn-to-ride value.',
    tags: ['Boston-area', 'Night skiing', 'Feeder hill'],
    bestFor: ['beginners', 'night', 'budget', 'family']
  },
  {
    id: 'bromley', name: 'Bromley', state: 'VT', pass: 'Independent', owner: 'Corporate',
    vertical: 1334, trails: 47, lifts: 9, acres: 178, snowfall: 145, snowmaking: 98, night: false,
    longestRun: 2.5, lat: 43.2278, lon: -72.9382,
    difficulty: { beginner: 0.32, intermediate: 0.36, advanced: 0.20, expert: 0.12 },
    liftsBreakdown: [['High-speed quad', 1], ['Fixed quad', 1], ['Double', 4], ['T-Bar', 1], ['Carpet', 2]],
    website: 'https://www.bromley.com/', webcamImage: '', webcamPage: '',
    trailMapImage: '', trailMapPage: 'https://www.bromley.com/',
    price: 99, terrainPark: true, seasonOpen: 'Nov', seasonClose: 'Apr',
    notes: 'South-facing family cruiser with a balanced terrain mix.',
    tags: ['Family', 'Southern Vermont', 'Cruisers'],
    bestFor: ['family', 'beginners', 'terrain-park']
  },
  {
    id: 'burke', name: 'Burke Mountain', state: 'VT', pass: 'Independent', owner: 'Independent',
    vertical: 2057, trails: 55, lifts: 4, acres: 260, snowfall: 217, snowmaking: 70, night: false,
    longestRun: 2.0, lat: 44.5717, lon: -71.8928,
    difficulty: { beginner: 0.18, intermediate: 0.42, advanced: 0.24, expert: 0.16 },
    liftsBreakdown: [['High-speed quad', 2], ['T-Bar', 1], ['J-Bar', 1]],
    website: 'https://skiburke.com/', webcamImage: '', webcamPage: 'https://skiburke.com/the-mountain/webcams',
    trailMapImage: '', trailMapPage: 'https://skiburke.com/the-mountain/weather-conditions#map',
    price: 109, terrainPark: false, seasonOpen: 'Nov', seasonClose: 'Apr',
    notes: 'Big vert, race culture, and serious Northeast Kingdom terrain.',
    tags: ['Northeast Kingdom', 'Race culture', 'Big vert'],
    bestFor: ['steeps', 'natural-snow']
  },
  {
    id: 'catamount', name: 'Catamount', state: 'NY/MA', pass: 'Indy', owner: 'Independent',
    vertical: 1000, trails: 44, lifts: 8, acres: 119, snowfall: 75, snowmaking: 93, night: true,
    longestRun: 1.75, lat: 42.1269, lon: -73.5206,
    difficulty: { beginner: 0.35, intermediate: 0.42, advanced: 0.17, expert: 0.06 },
    liftsBreakdown: [['Quad', 2], ['Triple', 3], ['Carpet', 3]],
    website: 'https://catamountski.com/', webcamImage: '', webcamPage: '',
    trailMapImage: '', trailMapPage: 'https://catamountski.com/',
    price: 79, terrainPark: true, seasonOpen: 'Dec', seasonClose: 'Mar',
    notes: 'Broad lit terrain and strong southern New England access.',
    tags: ['Night skiing', 'Indy', 'Hudson Valley access'],
    bestFor: ['night', 'beginners', 'terrain-park', 'family']
  },
  {
    id: 'gunstock', name: 'Gunstock', state: 'NH', pass: 'Independent', owner: 'County-owned',
    vertical: 1400, trails: 55, lifts: 8, acres: 227, snowfall: 160, snowmaking: 98, night: true,
    longestRun: 1.6, lat: 43.5404, lon: -71.3702,
    difficulty: { beginner: 0.22, intermediate: 0.42, advanced: 0.25, expert: 0.11 },
    liftsBreakdown: [['High-speed quad', 1], ['Fixed quad', 2], ['Triple', 1], ['Double', 2], ['Surface', 2]],
    website: 'https://www.gunstock.com/', webcamImage: '', webcamPage: '',
    trailMapImage: '', trailMapPage: 'https://www.gunstock.com/',
    price: 89, terrainPark: true, seasonOpen: 'Nov', seasonClose: 'Apr',
    notes: 'Big-small mountain blend with strong operations and one of the better night products in New England.',
    tags: ['Night skiing', 'Family', 'Strong ops'],
    bestFor: ['night', 'family', 'terrain-park']
  },
  {
    id: 'magic', name: 'Magic Mountain', state: 'VT', pass: 'Indy', owner: 'Community-backed independent',
    vertical: 1500, trails: 51, lifts: 5, acres: 285, snowfall: 120, snowmaking: 45, night: false,
    longestRun: 3.0, lat: 43.1964, lon: -72.8243,
    difficulty: { beginner: 0.14, intermediate: 0.32, advanced: 0.34, expert: 0.20 },
    liftsBreakdown: [['Quad', 1], ['Double', 3], ['Surface', 1]],
    website: 'https://magicmtn.com/', webcamImage: '', webcamPage: '',
    trailMapImage: '', trailMapPage: 'https://magicmtn.com/',
    price: 79, terrainPark: false, seasonOpen: 'Dec', seasonClose: 'Apr',
    notes: 'Cult-favorite Vermont mountain with soul, steeper terrain, and elite vibe scores.',
    tags: ['Soul skiing', 'Steeps', 'Indy legend'],
    bestFor: ['steeps', 'budget']
  },
  {
    id: 'nashoba', name: 'Nashoba Valley', state: 'MA', pass: 'Independent', owner: 'Independent',
    vertical: 240, trails: 17, lifts: 10, acres: 46, snowfall: 50, snowmaking: 100, night: true,
    longestRun: 0.5, lat: 42.5290, lon: -71.4731,
    difficulty: { beginner: 0.20, intermediate: 0.50, advanced: 0.30, expert: 0.00 },
    liftsBreakdown: [['Triple', 3], ['Double', 1], ['Conveyor', 3], ['Rope tow', 3]],
    website: 'https://skinashoba.com/', webcamImage: '', webcamPage: '',
    trailMapImage: '', trailMapPage: 'https://skinashoba.com/',
    price: 49, terrainPark: false, seasonOpen: 'Dec', seasonClose: 'Mar',
    notes: 'Metro-Boston night-ski machine built for quick laps and lessons.',
    tags: ['Night skiing', 'Metro Boston', 'Lessons'],
    bestFor: ['beginners', 'night', 'budget', 'family']
  },
  {
    id: 'pats-peak', name: 'Pats Peak', state: 'NH', pass: 'Indy', owner: 'Family-owned',
    vertical: 770, trails: 28, lifts: 11, acres: 117, snowfall: 80, snowmaking: 100, night: true,
    longestRun: 1.5, lat: 43.1790, lon: -71.8196,
    difficulty: { beginner: 0.50, intermediate: 0.21, advanced: 0.12, expert: 0.17 },
    liftsBreakdown: [['Quad', 1], ['Triple', 3], ['Double', 2], ['J-Bar', 1], ['Handle tow', 2], ['Carpet', 2]],
    website: 'https://www.patspeak.com/', webcamImage: '', webcamPage: '',
    trailMapImage: '', trailMapPage: 'https://www.patspeak.com/',
    price: 75, terrainPark: true, seasonOpen: 'Dec', seasonClose: 'Mar',
    notes: 'One of the strongest night and learn-to-ski operations in New England.',
    tags: ['Night skiing', 'Family-owned', 'Race leagues'],
    bestFor: ['beginners', 'night', 'family', 'terrain-park']
  },
  {
    id: 'wachusett', name: 'Wachusett', state: 'MA', pass: 'Independent', owner: 'Independent',
    vertical: 1000, trails: 27, lifts: 8, acres: 110, snowfall: 72, snowmaking: 100, night: true,
    longestRun: 2.0, lat: 42.4884, lon: -71.8863,
    difficulty: { beginner: 0.25, intermediate: 0.50, advanced: 0.20, expert: 0.05 },
    liftsBreakdown: [['High-speed quad', 2], ['Triple', 2], ['Surface', 4]],
    website: 'https://www.wachusett.com/', webcamImage: '', webcamPage: '',
    trailMapImage: '', trailMapPage: 'https://www.wachusett.com/',
    price: 89, terrainPark: true, seasonOpen: 'Nov', seasonClose: 'Apr',
    notes: 'Massachusetts volume leader with elite convenience and huge after-work appeal.',
    tags: ['Night skiing', 'High volume', 'Near Boston'],
    bestFor: ['night', 'beginners', 'terrain-park', 'family']
  },

  // ── Maine ─────────────────────────────────────────────────────────────────
  {
    id: 'big-moose', name: 'Big Moose Mountain', state: 'ME', pass: 'Independent', owner: 'Independent',
    vertical: 1150, trails: 30, lifts: 3, acres: 200, snowfall: 130, snowmaking: 80, night: false,
    longestRun: 2.0, lat: 45.6312, lon: -69.7031,
    difficulty: { beginner: 0.20, intermediate: 0.45, advanced: 0.25, expert: 0.10 },
    liftsBreakdown: [['Double', 2], ['Surface', 1]],
    website: 'https://www.bigmooseski.com/', webcamImage: '', webcamPage: '',
    trailMapImage: '', trailMapPage: 'https://www.bigmooseski.com/',
    price: 55, terrainPark: false, seasonOpen: 'Dec', seasonClose: 'Mar',
    notes: 'Remote central Maine mountain near Greenville and Moosehead Lake. True north-woods ski experience with minimal crowds.',
    tags: ['Remote', 'Maine', 'North woods'],
    bestFor: ['budget', 'family']
  },
  {
    id: 'big-rock', name: 'Big Rock', state: 'ME', pass: 'Independent', owner: 'Independent',
    vertical: 990, trails: 30, lifts: 4, acres: 170, snowfall: 110, snowmaking: 85, night: true,
    longestRun: 1.5, lat: 46.8756, lon: -68.3384,
    difficulty: { beginner: 0.25, intermediate: 0.40, advanced: 0.25, expert: 0.10 },
    liftsBreakdown: [['Quad', 1], ['Double', 2], ['Surface', 1]],
    website: 'https://bigrockmaine.com/', webcamImage: '', webcamPage: '',
    trailMapImage: '', trailMapPage: 'https://bigrockmaine.com/',
    price: 49, terrainPark: true, seasonOpen: 'Dec', seasonClose: 'Mar',
    notes: 'The only ski area in Aroostook County — northern Maine\'s community hill with night skiing and a genuine local following.',
    tags: ['Aroostook County', 'Night skiing', 'Community hill'],
    bestFor: ['budget', 'night', 'family', 'terrain-park']
  },
  {
    id: 'camden', name: 'Camden Snow Bowl', state: 'ME', pass: 'Independent', owner: 'City of Camden',
    vertical: 950, trails: 31, lifts: 4, acres: 150, snowfall: 95, snowmaking: 70, night: true,
    longestRun: 1.4, lat: 44.2162, lon: -69.0853,
    difficulty: { beginner: 0.25, intermediate: 0.40, advanced: 0.25, expert: 0.10 },
    liftsBreakdown: [['Triple', 1], ['Double', 2], ['Surface', 1]],
    website: 'https://www.camdensnowbowl.com/', webcamImage: '', webcamPage: '',
    trailMapImage: '', trailMapPage: 'https://www.camdensnowbowl.com/',
    price: 50, terrainPark: false, seasonOpen: 'Dec', seasonClose: 'Mar',
    notes: 'Municipally owned coastal Maine gem with ocean views from the summit. One of the most scenic small mountains in New England.',
    tags: ['Ocean views', 'Municipal', 'Coastal Maine'],
    bestFor: ['budget', 'family', 'beginners']
  },
  {
    id: 'lost-valley', name: 'Lost Valley', state: 'ME', pass: 'Independent', owner: 'Independent',
    vertical: 240, trails: 16, lifts: 4, acres: 50, snowfall: 75, snowmaking: 100, night: true,
    longestRun: 0.5, lat: 44.1201, lon: -70.2648,
    difficulty: { beginner: 0.35, intermediate: 0.40, advanced: 0.20, expert: 0.05 },
    liftsBreakdown: [['Triple', 2], ['Surface', 1], ['Carpet', 1]],
    website: 'https://www.lostvalleyski.com/', webcamImage: '', webcamPage: '',
    trailMapImage: '', trailMapPage: 'https://www.lostvalleyski.com/',
    price: 42, terrainPark: true, seasonOpen: 'Dec', seasonClose: 'Mar',
    notes: 'Auburn, Maine feeder hill with full snowmaking, night skiing, and an emphasis on lessons and junior programs.',
    tags: ['Night skiing', 'Lessons', 'Auburn ME'],
    bestFor: ['beginners', 'budget', 'night', 'family']
  },

  // ── New Hampshire ─────────────────────────────────────────────────────────
  {
    id: 'cannon', name: 'Cannon Mountain', state: 'NH', pass: 'Independent', owner: 'State of NH',
    vertical: 2180, trails: 97, lifts: 9, acres: 285, snowfall: 180, snowmaking: 96, night: false,
    longestRun: 2.3, lat: 44.1726, lon: -71.6973,
    difficulty: { beginner: 0.20, intermediate: 0.36, advanced: 0.28, expert: 0.16 },
    liftsBreakdown: [['Aerial tram', 1], ['High-speed quad', 2], ['Fixed quad', 1], ['Triple', 1], ['Double', 2], ['Surface', 2]],
    website: 'https://www.cannonmt.com/', webcamImage: '', webcamPage: 'https://www.cannonmt.com/webcam',
    trailMapImage: 'https://admin.cannonmt.com/publicFiles/documents/2526_Cannon_TrailMap_Digital.jpg', trailMapPage: 'https://www.cannonmt.com/trail-map',
    price: 99, terrainPark: false, seasonOpen: 'Nov', seasonClose: 'Apr',
    notes: 'State-owned Franconia Notch classic with the highest vertical in NH, a historic tram, and serious expert terrain on the Front Five.',
    tags: ['State-owned', 'Expert terrain', 'Franconia Notch', 'Tram'],
    bestFor: ['steeps', 'natural-snow']
  },
  {
    id: 'dartmouth-skiway', name: 'Dartmouth Skiway', state: 'NH', pass: 'Independent', owner: 'Dartmouth College',
    vertical: 968, trails: 33, lifts: 4, acres: 100, snowfall: 140, snowmaking: 60, night: false,
    longestRun: 1.5, lat: 43.8968, lon: -72.0365,
    difficulty: { beginner: 0.20, intermediate: 0.40, advanced: 0.30, expert: 0.10 },
    liftsBreakdown: [['Quad', 2], ['Double', 1], ['Surface', 1]],
    website: 'https://skiway.dartmouth.edu/', webcamImage: '', webcamPage: '',
    trailMapImage: '', trailMapPage: 'https://skiway.dartmouth.edu/',
    price: 65, terrainPark: false, seasonOpen: 'Dec', seasonClose: 'Mar',
    notes: 'College-owned hill on the NH/VT border near Hanover. Strong racing heritage, relaxed atmosphere, and modest pricing.',
    tags: ['College-owned', 'NH/VT border', 'Race heritage'],
    bestFor: ['budget', 'family', 'natural-snow']
  },
  {
    id: 'king-pine', name: 'King Pine', state: 'NH', pass: 'Independent', owner: 'Purity Spring Resort',
    vertical: 350, trails: 16, lifts: 5, acres: 55, snowfall: 70, snowmaking: 100, night: true,
    longestRun: 0.75, lat: 43.9404, lon: -71.0101,
    difficulty: { beginner: 0.38, intermediate: 0.37, advanced: 0.18, expert: 0.07 },
    liftsBreakdown: [['Triple', 2], ['Double', 1], ['Surface', 1], ['Carpet', 1]],
    website: 'https://www.kingpine.com/', webcamImage: '', webcamPage: '',
    trailMapImage: '', trailMapPage: 'https://www.kingpine.com/',
    price: 55, terrainPark: false, seasonOpen: 'Dec', seasonClose: 'Mar',
    notes: 'Family resort in the Lakes Region attached to Purity Spring Resort. Beginner-forward with a warm, low-key feel.',
    tags: ['Family resort', 'Lakes Region', 'Learn-to-ski'],
    bestFor: ['beginners', 'family', 'budget']
  },
  {
    id: 'mcintyre', name: 'McIntyre Ski Area', state: 'NH', pass: 'Independent', owner: 'City of Manchester',
    vertical: 160, trails: 10, lifts: 4, acres: 35, snowfall: 55, snowmaking: 100, night: true,
    longestRun: 0.3, lat: 42.9720, lon: -71.4548,
    difficulty: { beginner: 0.40, intermediate: 0.40, advanced: 0.20, expert: 0.00 },
    liftsBreakdown: [['Triple', 1], ['Double', 1], ['Surface', 1], ['Carpet', 1]],
    website: 'https://mcintyreskiarea.com/', webcamImage: '', webcamPage: '',
    trailMapImage: '', trailMapPage: 'https://mcintyreskiarea.com/',
    price: 38, terrainPark: false, seasonOpen: 'Dec', seasonClose: 'Mar',
    notes: 'City-run Manchester hill offering accessible, affordable night skiing for the southern NH metro area. The ultimate urban feeder hill.',
    tags: ['City-owned', 'Night skiing', 'Manchester NH', 'Urban hill'],
    bestFor: ['beginners', 'budget', 'night', 'family']
  },
  {
    id: 'tenney', name: 'Tenney Mountain', state: 'NH', pass: 'Independent', owner: 'Independent',
    vertical: 1430, trails: 50, lifts: 4, acres: 150, snowfall: 130, snowmaking: 75, night: false,
    longestRun: 2.2, lat: 43.7851, lon: -71.8234,
    difficulty: { beginner: 0.22, intermediate: 0.42, advanced: 0.26, expert: 0.10 },
    liftsBreakdown: [['High-speed quad', 1], ['Double', 2], ['Surface', 1]],
    website: 'https://tenneymountain.com/', webcamImage: '', webcamPage: '',
    trailMapImage: '', trailMapPage: 'https://tenneymountain.com/',
    price: 69, terrainPark: false, seasonOpen: 'Dec', seasonClose: 'Mar',
    notes: 'Reopened Plymouth-area mountain with solid vertical and a refreshed independent spirit. Good value for central NH.',
    tags: ['Reopened', 'Plymouth NH', 'Central NH'],
    bestFor: ['family', 'budget']
  },

  // ── Vermont ───────────────────────────────────────────────────────────────
  {
    id: 'middlebury', name: 'Middlebury Snow Bowl', state: 'VT', pass: 'Independent', owner: 'Middlebury College',
    vertical: 1020, trails: 17, lifts: 3, acres: 110, snowfall: 150, snowmaking: 40, night: false,
    longestRun: 1.5, lat: 43.9443, lon: -72.9637,
    difficulty: { beginner: 0.20, intermediate: 0.40, advanced: 0.30, expert: 0.10 },
    liftsBreakdown: [['Triple', 1], ['Double', 1], ['Surface', 1]],
    website: 'https://www.middlebury.edu/snow-bowl', webcamImage: '', webcamPage: '',
    trailMapImage: '', trailMapPage: 'https://www.middlebury.edu/snow-bowl',
    price: 55, terrainPark: false, seasonOpen: 'Dec', seasonClose: 'Mar',
    notes: 'College-owned Bread Loaf Mountain gem with excellent natural snow, a low-key atmosphere, and great value for a Middlebury-adjacent ski day.',
    tags: ['College-owned', 'Natural snow', 'VT classic'],
    bestFor: ['natural-snow', 'budget', 'steeps']
  },

  // ── Massachusetts ─────────────────────────────────────────────────────────
  {
    id: 'berkshire-east', name: 'Berkshire East', state: 'MA', pass: 'Indy', owner: 'Independent',
    vertical: 1180, trails: 45, lifts: 6, acres: 170, snowfall: 90, snowmaking: 90, night: true,
    longestRun: 1.5, lat: 42.6398, lon: -72.7804,
    difficulty: { beginner: 0.25, intermediate: 0.40, advanced: 0.25, expert: 0.10 },
    liftsBreakdown: [['Quad', 2], ['Triple', 1], ['Double', 2], ['Surface', 1]],
    website: 'https://berkshireeast.com/', webcamImage: '', webcamPage: '',
    trailMapImage: '', trailMapPage: 'https://berkshireeast.com/',
    price: 79, terrainPark: true, seasonOpen: 'Nov', seasonClose: 'Apr',
    notes: 'Independently owned Charlemont mountain with solid vertical for Massachusetts, a zipline canopy tour, and strong night skiing product.',
    tags: ['Night skiing', 'Indy', 'Charlemont MA', 'Zipline'],
    bestFor: ['night', 'terrain-park', 'family']
  }
];

// ─── App State ────────────────────────────────────────────────────────────────
const state = {
  search: '', pass: 'All', stateFilter: 'All',
  nightOnly: false, selectedId: null,
  sortCol: 'vertical', sortDir: 'desc',
  activeQF: null,
  origin: null,        // { lat, lon, label }
  driveCache: {},      // id → minutes
  weatherCache: {},    // id → weather data
  compareSet: new Set(),
  userNotes: JSON.parse(localStorage.getItem('ski-notes') || '{}'),
  favorites: new Set(JSON.parse(localStorage.getItem('ski-favorites') || '[]')),
};

const COL_MAX = { vertical:2100, trails:75, lifts:12, acres:650, longestRun:3.2, snowfall:320, snowmaking:100, price:130 };

// ─── DOM refs ─────────────────────────────────────────────────────────────────
const $ = id => document.getElementById(id);
const els = {
  summaryCards: $('summaryCards'), searchInput: $('searchInput'),
  stateFilter: $('stateFilter'), passFilter: $('passFilter'),
  sortBy: $('sortBy'), toggleNight: $('toggleNight'),
  randomResort: $('randomResort'), activeFilters: $('activeFilters'),
  resortList: $('resortList'), resultCount: $('resultCount'),
  comparisonBody: $('comparisonBody'), comparisonTable: $('comparisonTable'),
  selectedResortSection: $('selectedResortSection'), selectedResort: $('selectedResort'),
  compareTray: $('compareTray'), comparePills: $('comparePills'),
  compareBtn: $('compareBtn'), clearCompare: $('clearCompare'),
  comparePanel: $('comparePanel'), compareContent: $('compareContent'),
  closeCompare: $('closeCompare'),
  originInput: $('originInput'), detectLocation: $('detectLocation'),
  toast: $('toast'),
  plannerGrid: $('plannerGrid'),
  passCostInput: $('passCostInput'),
  daysInput: $('daysInput'),
  ticketBasis: $('ticketBasis'),
  passCalcResults: $('passCalcResults'),
  backToTop: $('backToTop'),
};

// ─── Toast ────────────────────────────────────────────────────────────────────
let toastTimer = null;
function showToast(msg, dur=2800) {
  els.toast.textContent = msg;
  els.toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => els.toast.classList.remove('show'), dur);
}

// ─── Filtering ────────────────────────────────────────────────────────────────
function uniquePasses()  { return ['All', ...new Set(RESORTS.map(r => r.pass))]; }
function uniqueStates()  { return ['All', ...[...new Set(RESORTS.map(r => r.state))].sort()]; }

const QF_RULES = {
  beginners:     r => r.difficulty.beginner >= 0.25,
  steeps:        r => (r.difficulty.advanced + r.difficulty.expert) >= 0.35,
  night:         r => r.night,
  'natural-snow':r => r.snowfall >= 150,
  'terrain-park':r => r.terrainPark,
  family:        r => r.bestFor?.includes('family'),
  budget:        r => r.price <= 65,
};

function filteredResorts() {
  return RESORTS.filter(r => {
    const q = state.search.trim().toLowerCase();
    const hay = [r.name,r.state,r.pass,r.owner,r.notes,...(r.tags||[])].join(' ').toLowerCase();
    return (!q || hay.includes(q))
      && (state.pass === 'All' || r.pass === state.pass)
      && (state.stateFilter === 'All' || r.state === state.stateFilter)
      && (!state.nightOnly || r.night)
      && (!state.activeQF || QF_RULES[state.activeQF]?.(r));
  }).sort((a, b) => {
    let col = state.sortCol;
    if (col === 'drive') {
      const da = state.driveCache[a.id] ?? Infinity;
      const db = state.driveCache[b.id] ?? Infinity;
      return state.sortDir === 'asc' ? da - db : db - da;
    }
    let av = a[col], bv = b[col];
    if (typeof av === 'boolean') { av = av?1:0; bv = bv?1:0; }
    if (typeof av === 'string') return state.sortDir==='asc' ? av.localeCompare(bv) : bv.localeCompare(av);
    return state.sortDir==='asc' ? av-bv : bv-av;
  });
}

// ─── Drive time (OpenRouteService free API) ───────────────────────────────────
async function fetchDriveTime(resort) {
  if (!state.origin) return null;
  if (state.driveCache[resort.id] !== undefined) return state.driveCache[resort.id];
  try {
    const url = `https://router.project-osrm.org/route/v1/driving/${state.origin.lon},${state.origin.lat};${resort.lon},${resort.lat}?overview=false`;
    const res = await fetch(url);
    const data = await res.json();
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
  if (mins >= 60) {
    const h = Math.floor(mins/60), m = mins%60;
    return m > 0 ? `${h}h ${m}m` : `${h}h`;
  }
  return `${mins}m`;
}

async function loadAllDriveTimes() {
  if (!state.origin) return;
  showToast('⏱ Calculating drive times…', 4000);
  await Promise.all(RESORTS.map(r => fetchDriveTime(r)));
  render();
  showToast('✓ Drive times updated');
}

// ─── Geocode origin (nominatim) ───────────────────────────────────────────────
async function geocodeOrigin(query) {
  try {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`;
    const res = await fetch(url, { headers: { 'Accept-Language': 'en' } });
    const data = await res.json();
    if (!data.length) return null;
    return { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon), label: data[0].display_name.split(',')[0] };
  } catch { return null; }
}

// ─── Weather (Open-Meteo, free, no key) ──────────────────────────────────────
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
  if (state.weatherCache[resort.id]) return state.weatherCache[resort.id];
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${resort.lat}&longitude=${resort.lon}&current=temperature_2m,weathercode,windspeed_10m&daily=weathercode,temperature_2m_max,temperature_2m_min&temperature_unit=fahrenheit&wind_speed_unit=mph&forecast_days=4&timezone=America%2FNew_York`;
    const res = await fetch(url);
    const d = await res.json();
    const wx = {
      temp: Math.round(d.current.temperature_2m),
      code: d.current.weathercode,
      wind: Math.round(d.current.windspeed_10m),
      forecast: d.daily.time.slice(1,4).map((date,i) => ({
        day: new Date(date+'T12:00:00').toLocaleDateString('en-US',{weekday:'short'}),
        code: d.daily.weathercode[i+1],
        hi: Math.round(d.daily.temperature_2m_max[i+1]),
        lo: Math.round(d.daily.temperature_2m_min[i+1]),
      }))
    };
    state.weatherCache[resort.id] = wx;
    return wx;
  } catch { return null; }
}

// ─── Summary cards ────────────────────────────────────────────────────────────
function renderSummaryCards(resorts) {
  const n = resorts.length;
  const avg = key => n ? Math.round(resorts.reduce((s,r)=>s+r[key],0)/n) : 0;
  const minPrice = n ? Math.min(...resorts.map(r=>r.price)) : '—';
  const topDrive = n && Object.keys(state.driveCache).length
    ? resorts.filter(r => state.driveCache[r.id] !== null && state.driveCache[r.id] !== undefined).sort((a,b)=>state.driveCache[a.id]-state.driveCache[b.id])[0]
    : null;
  els.summaryCards.innerHTML = [
    ['Resorts', n, ''],
    ['Avg Vertical', avg('vertical')+' ft', ''],
    ['Avg Trails', avg('trails'), ''],
    ['Night Skiing', resorts.filter(r=>r.night).length, 'of '+n],
    ['Lowest Ticket', '$'+minPrice, 'lowest listed'],
    ['Closest', topDrive?.name||'Set location', topDrive ? formatDrive(state.driveCache[topDrive.id]) : ''],
  ].map(([label,val,sub]) => `
    <div class="stat-card">
      <div class="stat-label">${label}</div>
      <div class="stat-value">${val}</div>
      ${sub ? `<div class="stat-sub">${sub}</div>` : ''}
    </div>`).join('');
}

// ─── Active filters ───────────────────────────────────────────────────────────
function renderActiveFilters() {
  const tags = [];
  if (state.search.trim())         tags.push({ label:`"${state.search.trim()}"`,     clear:()=>{ state.search=''; els.searchInput.value=''; }});
  if (state.stateFilter !== 'All') tags.push({ label:`State: ${state.stateFilter}`, clear:()=>{ state.stateFilter='All'; els.stateFilter.value='All'; }});
  if (state.pass !== 'All')        tags.push({ label:`Pass: ${state.pass}`,          clear:()=>{ state.pass='All'; els.passFilter.value='All'; }});
  if (state.nightOnly)             tags.push({ label:'🌙 Night only',                clear:()=>{ state.nightOnly=false; els.toggleNight.setAttribute('aria-pressed','false'); }});
  if (state.activeQF)              tags.push({ label:`✦ ${state.activeQF}`,          clear:()=>{ state.activeQF=null; document.querySelectorAll('.qf-btn').forEach(b=>b.classList.remove('active')); $('clearQF').style.display='none'; }});
  els.activeFilters.innerHTML = tags.map((t,i)=>
    `<span class="filter-tag">${t.label}<button data-idx="${i}" aria-label="Remove filter">✕</button></span>`
  ).join('');
  [...els.activeFilters.querySelectorAll('button')].forEach(btn=>{
    btn.addEventListener('click', ()=>{ tags[+btn.dataset.idx].clear(); render(); });
  });
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────
function renderResortList(resorts) {
  els.resultCount.textContent = `${resorts.length} resort${resorts.length===1?'':'s'}`;
  if (!resorts.length) { els.resortList.innerHTML = '<div class="empty-state">No resorts match.</div>'; return; }
  els.resortList.innerHTML = resorts.map(r => {
    const drive = state.driveCache[r.id];
    const driveChip = drive !== null && drive !== undefined ? `<span class="chip">${formatDrive(drive)}</span>` : '';
    const qfMatch = state.activeQF && r.bestFor?.includes(state.activeQF) ? `<span class="chip good">Best for ${state.activeQF}</span>` : '';
    const isFav = state.favorites.has(r.id);
    return `
    <div class="resort-item ${r.id===state.selectedId?'active':''} ${state.compareSet.has(r.id)?'compare-queued':''}" data-id="${r.id}" tabindex="0" role="button">
      <div class="resort-top">
        <div>
          <div class="resort-name">${r.name} ${isFav?'⭐':''}</div>
          <div class="resort-meta">${r.state} · $${r.price}</div>
        </div>
      </div>
      <div class="chip-row">
        <span class="chip">${r.vertical}ft</span>
        <span class="chip">${r.trails} trails</span>
        ${r.night ? '<span class="chip good">🌙</span>' : ''}
        ${r.terrainPark ? '<span class="chip warn">🛹</span>' : ''}
        ${qfMatch}
        ${driveChip}
      </div>
      <label class="compare-check">
        <input type="checkbox" data-compare="${r.id}" ${state.compareSet.has(r.id)?'checked':''} /> Add to compare
      </label>
    </div>`}).join('');

  [...els.resortList.querySelectorAll('.resort-item')].forEach(item => {
    const sel = () => { state.selectedId = item.dataset.id; render(); };
    item.addEventListener('click', e => { if (!e.target.closest('input')) sel(); });
    item.addEventListener('keydown', e => { if(e.key==='Enter'||e.key===' ') sel(); });
  });
  [...els.resortList.querySelectorAll('[data-compare]')].forEach(cb => {
    cb.addEventListener('change', () => {
      const id = cb.dataset.compare;
      cb.checked ? state.compareSet.add(id) : state.compareSet.delete(id);
      renderCompareTray();
      // Re-render sidebar to update highlight
      const item = els.resortList.querySelector(`[data-id="${id}"]`);
      if (item) item.classList.toggle('compare-queued', cb.checked);
    });
  });
  const active = els.resortList.querySelector('.resort-item.active');
  if (active) active.scrollIntoView({ block:'nearest' });
}

// ─── Comparison table ─────────────────────────────────────────────────────────
function renderComparisonTable(resorts) {
  [...els.comparisonTable.querySelectorAll('th.sortable')].forEach(th => {
    th.classList.remove('sort-asc','sort-desc');
    if (th.dataset.col === state.sortCol) th.classList.add(state.sortDir==='asc'?'sort-asc':'sort-desc');
  });
  if (!resorts.length) { els.comparisonBody.innerHTML = `<tr><td colspan="13" class="empty-state">No resorts match.</td></tr>`; return; }
  els.comparisonBody.innerHTML = resorts.map(r => {
    const bar = (val, key) => {
      const pct = Math.min(100, Math.round((val/(COL_MAX[key]||1))*100));
      return `<div class="bar-cell"><span>${val}</span><div class="inline-bar"><div class="inline-bar-fill" style="width:${pct}%"></div></div></div>`;
    };
    const drive = state.driveCache[r.id];
    const driveCell = drive === null ? `<span class="drive-na">N/A</span>`
      : drive !== undefined ? `<span class="drive-cell">${formatDrive(drive)}</span>`
      : `<span class="drive-na">—</span>`;
    return `
      <tr data-id="${r.id}" class="${r.id===state.selectedId?'active-row':''}">
        <td class="col-name">
          <div class="td-resort-name">${r.name}${state.favorites.has(r.id)?' ⭐':''}</div>
          <div class="td-resort-state">${r.seasonOpen}–${r.seasonClose}</div>
        </td>
        <td class="col-state td-resort-state">${r.state}</td>
        <td class="col-num">${bar(r.vertical,'vertical')}</td>
        <td class="col-num">${bar(r.trails,'trails')}</td>
        <td class="col-num">${bar(r.lifts,'lifts')}</td>
        <td class="col-num">${bar(r.acres,'acres')}</td>
        <td class="col-num">${bar(r.longestRun,'longestRun')}</td>
        <td class="col-num">${bar(r.snowfall,'snowfall')}</td>
        <td class="col-num">${bar(r.snowmaking,'snowmaking')}</td>
        <td class="col-num price-cell">$${r.price}</td>
        <td class="col-num">${driveCell}</td>
        <td class="col-center">${r.night?'<span class="night-yes" title="Night skiing">🌙</span>':'<span class="night-no">—</span>'}</td>
        <td class="col-center">${r.terrainPark?'<span class="park-yes" title="Terrain park">🛹</span>':'<span class="night-no">—</span>'}</td>
      </tr>`;
  }).join('');
  [...els.comparisonBody.querySelectorAll('tr[data-id]')].forEach(row => {
    row.addEventListener('click', () => { state.selectedId = row.dataset.id; render(); });
  });
}

// ─── Selected resort detail ───────────────────────────────────────────────────
async function renderSelectedResort(resort) {
  if (!resort) {
    els.selectedResortSection.style.display = 'none';
    return;
  }
  els.selectedResortSection.style.display = '';

  // Kick off weather fetch in background
  const wxPromise = fetchWeather(resort);

  const drive = state.driveCache[resort.id];
  const driveStr = drive !== null && drive !== undefined ? formatDrive(drive) : state.origin ? 'Calculating…' : 'Set location above';
  const isFav = state.favorites.has(resort.id);

  const terrainBars = [
    ['Beginner','beginner',resort.difficulty.beginner],
    ['Intermediate','intermediate',resort.difficulty.intermediate],
    ['Advanced','advanced',resort.difficulty.advanced],
    ['Expert','expert',resort.difficulty.expert],
  ].map(([l,c,v]) => `
    <div class="bar-row">
      <div class="bar-label"><span class="difficulty-dot ${c}"></span>${l}</div>
      <div class="bar"><div class="bar-fill ${c}" style="width:${v*100}%"></div></div>
      <div class="bar-pct">${Math.round(v*100)}%</div>
    </div>`).join('');

  const mediaBox = (title, img, page, btn) => {
    const media = img
      ? `<img src="${img}" alt="${title}" onerror="this.style.display='none';this.nextElementSibling.style.display='grid'">`
        +`<div class="placeholder" style="display:none">Image unavailable</div>`
      : `<div class="placeholder">No image — <a href="${page||'#'}" target="_blank">view page ↗</a></div>`;
    const link = page ? `<a href="${page}" target="_blank" rel="noreferrer">${btn} ↗</a>` : '';
    return `<div class="media-box">${media}<div class="media-caption">${link}</div></div>`;
  };

  const savedNote = state.userNotes[resort.id] || '';

  els.selectedResort.innerHTML = `
    <div class="resort-detail-header">
      <div>
        <div class="eyebrow">Selected Resort</div>
        <div class="resort-detail-name">${resort.name}</div>
        <div class="resort-detail-meta">${resort.state} · ${resort.pass} pass · ${resort.owner} · Season: ${resort.seasonOpen}–${resort.seasonClose}</div>
        <div class="bestfor-row">${(resort.bestFor||[]).map(tag => `<span class="bestfor-pill ${state.activeQF===tag?'match':''}">${tag.replace('-', ' ')}</span>`).join('')}</div>
      </div>
      <div class="resort-detail-actions">
        <button id="favBtn" class="btn btn-secondary btn-sm">${isFav?'★ Saved':'☆ Save'}</button>
        <a href="${resort.website}" target="_blank" rel="noreferrer" class="btn btn-secondary btn-sm" style="text-decoration:none;display:inline-flex;align-items:center">Website ↗</a>
      </div>
    </div>

    <div class="detail-grid-top">
      <div class="metric-card highlight">
        <div class="metric-label">Vertical</div>
        <div class="metric-value">${resort.vertical} ft</div>
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
        <div class="metric-sub">${state.origin?.label||'from your location'}</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">Night Skiing</div>
        <div class="metric-value">${resort.night?'🌙 Yes':'No'}</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">Terrain Park</div>
        <div class="metric-value">${resort.terrainPark?'🛹 Yes':'No'}</div>
      </div>
    </div>

    <div class="detail-grid-mid">
      <div class="sub-card">
        <h3>Terrain Mix</h3>
        ${terrainBars}
      </div>
      <div class="sub-card">
        <h3>Lifts</h3>
        ${resort.liftsBreakdown.map(([type,count])=>
          `<div class="lift-row"><span>${type}</span><span style="font-family:'DM Mono',monospace;font-weight:600">${count}</span></div>`
        ).join('')}
        <div class="divider"></div>
        <div class="tag-row" style="margin-top:8px">
          ${(resort.tags||[]).map(t=>`<span class="tag">${t}</span>`).join('')}
        </div>
        <p class="footer-note">${resort.notes}</p>
      </div>
      <div class="sub-card" id="weatherCard-${resort.id}">
        <h3>Current Weather</h3>
        <div class="loading-text">Loading weather…</div>
      </div>
    </div>

    <div class="detail-grid-bot single-col">
      <div class="media-grid">
        ${mediaBox(resort.name+' Trail Map', resort.trailMapImage, resort.trailMapPage||resort.website, 'Open trail map')}
      </div>
      <div class="notes-card">
        <div class="notes-label">📝 Your Notes</div>
        <textarea id="userNotesInput" class="user-notes-input" placeholder="Add your own notes about this mountain… (saved automatically)">${savedNote}</textarea>
        <div id="notesSavedMsg" class="notes-saved" style="display:none">✓ Saved</div>
      </div>
    </div>
  `;

  // Fav button
  $('favBtn').addEventListener('click', () => {
    if (state.favorites.has(resort.id)) { state.favorites.delete(resort.id); }
    else { state.favorites.add(resort.id); showToast(`⭐ ${resort.name} saved`); }
    localStorage.setItem('ski-favorites', JSON.stringify([...state.favorites]));
    render();
  });

  // Notes autosave
  const notesInput = $('userNotesInput');
  let notesTimer;
  notesInput.addEventListener('input', () => {
    clearTimeout(notesTimer);
    notesTimer = setTimeout(() => {
      state.userNotes[resort.id] = notesInput.value;
      localStorage.setItem('ski-notes', JSON.stringify(state.userNotes));
      const msg = $('notesSavedMsg');
      if (msg) { msg.style.display='block'; setTimeout(()=>{ if(msg) msg.style.display='none'; }, 1800); }
    }, 700);
  });

  // Scroll into view smoothly
  els.selectedResortSection.scrollIntoView({ behavior:'smooth', block:'nearest' });

  // Populate weather when ready
  wxPromise.then(wx => {
    const card = $(`weatherCard-${resort.id}`);
    if (!card) return;
    if (!wx) { card.querySelector('.loading-text').textContent = 'Weather unavailable.'; return; }
    card.innerHTML = `
      <h3>Current Weather at ${resort.name}</h3>
      <div class="weather-current">
        <div style="font-size:36px">${WX_CODES[wx.code]||'❓'}</div>
        <div>
          <div class="weather-temp">${wx.temp}°F</div>
          <div class="weather-desc">${WX_DESC[wx.code]||'Unknown'}</div>
          <div class="weather-wind">Wind: ${wx.wind} mph</div>
        </div>
      </div>
      <div class="weather-forecast">
        ${wx.forecast.map(f=>`
          <div class="forecast-day">
            <div class="fday">${f.day}</div>
            <div class="ficon">${WX_CODES[f.code]||'❓'}</div>
            <div class="ftemp">${f.hi}° / ${f.lo}°</div>
          </div>`).join('')}
      </div>`;
  });
}

// ─── Compare tray & panel ─────────────────────────────────────────────────────
function renderCompareTray() {
  if (state.compareSet.size === 0) {
    els.compareTray.style.display = 'none';
    return;
  }
  els.compareTray.style.display = '';
  const names = [...state.compareSet].map(id => RESORTS.find(r=>r.id===id)?.name||id);
  els.comparePills.innerHTML = names.map((name,i) => {
    const id = [...state.compareSet][i];
    return `<span class="compare-pill">${name}<button data-remove="${id}">✕</button></span>`;
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
  const resorts = [...state.compareSet].map(id => RESORTS.find(r=>r.id===id)).filter(Boolean);
  if (resorts.length < 2) { showToast('Select at least 2 resorts to compare'); return; }
  els.comparePanel.style.display = '';
  els.comparePanel.scrollIntoView({ behavior:'smooth', block:'start' });

  const ROWS = [
    ['State', r=>r.state, null],
    ['Vertical', r=>`${r.vertical} ft`, 'vertical'],
    ['Trails', r=>r.trails, 'trails'],
    ['Lifts', r=>r.lifts, 'lifts'],
    ['Acres', r=>r.acres, 'acres'],
    ['Longest Run', r=>`${r.longestRun} mi`, 'longestRun'],
    ['Avg Snowfall', r=>`${r.snowfall}"`, 'snowfall'],
    ['Snowmaking', r=>`${r.snowmaking}%`, 'snowmaking'],
    ['Day Ticket', r=>`$${r.price}`, null, (a,b)=>a.price-b.price],
    ['Night Skiing', r=>r.night?'🌙 Yes':'No', null],
    ['Terrain Park', r=>r.terrainPark?'🛹 Yes':'No', null],
    ['Season', r=>`${r.seasonOpen}–${r.seasonClose}`, null],
    ['Drive', r=>{ const d=state.driveCache[r.id]; return d !== null && d !== undefined ? formatDrive(d) : '—'; }, null, (a,b)=>(state.driveCache[a.id]??999999)-(state.driveCache[b.id]??999999)],
  ];

  els.compareContent.innerHTML = `
    <table class="compare-table">
      <thead><tr>
        <th>Stat</th>
        ${resorts.map(r=>`<th style="color:var(--text)">${r.name}</th>`).join('')}
      </tr></thead>
      <tbody>
        ${ROWS.map(([label, fn, numKey, sortFn]) => {
          let bestIdx = -1;
          if (numKey) {
            const vals = resorts.map(r=>r[numKey]);
            bestIdx = vals.indexOf(Math.max(...vals));
          } else if (sortFn) {
            const sorted = [...resorts].sort(sortFn);
            bestIdx = resorts.indexOf(sorted[0]);
          }
          return `<tr>
            <td style="color:var(--muted);font-size:12px;font-family:'DM Mono',monospace;text-transform:uppercase;letter-spacing:.06em">${label}</td>
            ${resorts.map((r,i)=>`<td class="${i===bestIdx?'best':''}">${fn(r)}</td>`).join('')}
          </tr>`;
        }).join('')}
      </tbody>
    </table>`;
}

// ─── Leaflet Map ──────────────────────────────────────────────────────────────
let leafletMap = null;
let leafletMarkers = {};

function initLeafletMap() {
  if (leafletMap) return;
  leafletMap = L.map('leafletMap', { zoomControl: true, scrollWheelZoom: true })
    .setView([43.5, -71.8], 7);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© <a href="https://openstreetmap.org/copyright">OpenStreetMap</a>',
    maxZoom: 18,
  }).addTo(leafletMap);
}

function updateLeafletMap(resorts) {
  if (!leafletMap) initLeafletMap();
  const filteredIds = new Set(resorts.map(r=>r.id));

  RESORTS.forEach(base => {
    const inFilter = filteredIds.has(base.id);
    const isSelected = base.id === state.selectedId;

    const color = isSelected ? '#3dd9a4' : inFilter ? '#5b9cf6' : '#374f6e';
    const size  = isSelected ? 14 : 10;
    const opacity = inFilter ? 1 : 0.35;

    const icon = L.divIcon({
      className: '',
      html: `<div style="
        width:${size}px;height:${size}px;border-radius:50%;
        background:${color};border:2px solid rgba(7,16,29,0.8);
        box-shadow:${isSelected?'0 0 0 4px rgba(61,217,164,0.25)':'0 2px 6px rgba(0,0,0,0.4)'};
        opacity:${opacity};transition:all .2s;
      "></div>`,
      iconSize: [size, size],
      iconAnchor: [size/2, size/2],
    });

    if (leafletMarkers[base.id]) {
      leafletMarkers[base.id].setIcon(icon);
      return;
    }

    const resort = RESORTS.find(r=>r.id===base.id);
    const marker = L.marker([base.lat, base.lon], { icon })
      .addTo(leafletMap)
      .bindPopup(`
        <div class="map-popup-name">${resort.name}</div>
        <div class="map-popup-meta">${resort.state} · ${resort.pass} pass</div>
        <div class="map-popup-stats">
          <div class="map-popup-stat"><span>Vertical</span><span>${resort.vertical} ft</span></div>
          <div class="map-popup-stat"><span>Trails</span><span>${resort.trails}</span></div>
          <div class="map-popup-stat"><span>Day Ticket</span><span>$${resort.price}</span></div>
          <div class="map-popup-stat"><span>Night</span><span>${resort.night?'🌙 Yes':'No'}</span></div>
        </div>
        <button class="map-popup-btn" onclick="selectResortFromMap('${resort.id}')">View Details</button>
      `, { maxWidth: 220 });

    marker.on('click', () => {
      state.selectedId = resort.id;
      render();
    });

    leafletMarkers[base.id] = marker;
  });
}

window.selectResortFromMap = function(id) {
  state.selectedId = id;
  render();
  document.querySelector('.main-content').scrollIntoView({ behavior:'smooth', block:'start' });
};

// ─── Sort header wiring ───────────────────────────────────────────────────────
function wireSortHeaders() {
  [...els.comparisonTable.querySelectorAll('th.sortable')].forEach(th => {
    th.addEventListener('click', () => {
      const col = th.dataset.col;
      state.sortDir = (state.sortCol === col && state.sortDir === 'desc') ? 'asc' : 'desc';
      if (state.sortCol !== col) {
        state.sortCol = col;
        state.sortDir = (col==='name'||col==='state'||col==='drive'||col==='price') ? 'asc' : 'desc';
      }
      els.sortBy.value = col;
      render();
    });
  });
}

// ─── Quick filter wiring ──────────────────────────────────────────────────────
function wireQuickFilters() {
  document.querySelectorAll('.qf-btn[data-qf]').forEach(btn => {
    btn.addEventListener('click', () => {
      const qf = btn.dataset.qf;
      if (state.activeQF === qf) {
        state.activeQF = null;
        btn.classList.remove('active');
        $('clearQF').style.display = 'none';
      } else {
        state.activeQF = qf;
        document.querySelectorAll('.qf-btn[data-qf]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        $('clearQF').style.display = '';
      }
      render();
    });
  });
  $('clearQF').addEventListener('click', () => {
    state.activeQF = null;
    document.querySelectorAll('.qf-btn').forEach(b => b.classList.remove('active'));
    $('clearQF').style.display = 'none';
    render();
  });
}

// ─── Location wiring ──────────────────────────────────────────────────────────
function wireLocation() {
  let locationTimer;
  const runLookup = async () => {
    const q = els.originInput.value.trim();
    if (!q) { state.origin = null; state.driveCache = {}; render(); return; }
    showToast('🔍 Finding location…', 3000);
    const loc = await geocodeOrigin(q);
    if (loc) {
      state.origin = loc;
      state.driveCache = {};
      showToast(`📍 Origin set to ${loc.label}`);
      await loadAllDriveTimes();
    } else {
      showToast('Could not find that location');
    }
  };

  els.originInput.addEventListener('input', () => {
    clearTimeout(locationTimer);
    locationTimer = setTimeout(runLookup, 900);
  });

  els.originInput.addEventListener('keydown', async e => {
    if (e.key !== 'Enter') return;
    e.preventDefault();
    clearTimeout(locationTimer);
    await runLookup();
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
  els.searchInput.addEventListener('input', e => { state.search = e.target.value; render(); });
  els.stateFilter.addEventListener('change', e => { state.stateFilter = e.target.value; render(); });
  els.passFilter.addEventListener('change', e => { state.pass = e.target.value; render(); });
  els.sortBy.addEventListener('change', e => { state.sortCol = e.target.value; state.sortDir = (e.target.value==='drive' || e.target.value==='price' || e.target.value==='name' || e.target.value==='state') ? 'asc' : 'desc'; render(); });
  els.toggleNight.addEventListener('click', () => {
    state.nightOnly = !state.nightOnly;
    els.toggleNight.setAttribute('aria-pressed', state.nightOnly?'true':'false');
    render();
  });
  els.randomResort.addEventListener('click', () => {
    const resorts = filteredResorts();
    if (!resorts.length) return;
    const pick = resorts[Math.floor(Math.random()*resorts.length)];
    state.selectedId = pick.id;
    render();
    showToast(`✦ Showing: ${pick.name}`);
  });
  els.compareBtn.addEventListener('click', renderComparePanel);
  els.clearCompare.addEventListener('click', () => {
    state.compareSet.clear();
    renderCompareTray();
    els.comparePanel.style.display = 'none';
    render();
  });
  els.closeCompare.addEventListener('click', () => { els.comparePanel.style.display = 'none'; });

  wireSortHeaders();
  wireQuickFilters();
  wireLocation();
}


function renderPlanner(resorts) {
  if (!els.plannerGrid) return;
  if (!resorts.length) {
    els.plannerGrid.innerHTML = `<div class="planner-card"><div class="planner-main">No matching resorts</div><div class="planner-sub">Adjust filters to populate the planner.</div></div>`;
    return;
  }
  const closest = resorts.filter(r => state.driveCache[r.id] !== null && state.driveCache[r.id] !== undefined).sort((a,b)=>state.driveCache[a.id]-state.driveCache[b.id])[0];
  const cheapest = [...resorts].sort((a,b)=>a.price-b.price)[0];
  const snowiest = [...resorts].sort((a,b)=>b.snowfall-a.snowfall)[0];
  const night = resorts.filter(r=>r.night).sort((a,b)=>a.price-b.price)[0];
  const cards = [
    ['Closest Option', closest ? closest.name : 'Set your location', closest ? formatDrive(state.driveCache[closest.id]) : 'Drive times appear after location lookup'],
    ['Lowest Ticket', cheapest.name, `$${cheapest.price} day ticket`],
    ['Most Snowfall', snowiest.name, `${snowiest.snowfall}" average annual snowfall`],
    ['Night Skiing Pick', night ? night.name : 'No night skiing match', night ? `$${night.price} · ${night.trails} trails` : 'Try clearing a filter'],
  ];
  els.plannerGrid.innerHTML = cards.map(([title,main,sub]) => `<div class="planner-card"><div class="planner-title">${title}</div><div class="planner-main">${main}</div><div class="planner-sub">${sub}</div></div>`).join('');
}

function renderPassCalculator(resorts) {
  if (!els.passCalcResults) return;
  const passCost = Number(els.passCostInput?.value || 0);
  const days = Math.max(1, Number(els.daysInput?.value || 1));
  const selected = RESORTS.find(r => r.id === state.selectedId);
  const avgTicket = resorts.length ? Math.round(resorts.reduce((sum, r) => sum + r.price, 0) / resorts.length) : 0;
  const minTicket = resorts.length ? Math.min(...resorts.map(r => r.price)) : 0;
  const basis = els.ticketBasis?.value || 'avg';
  const ticketValue = basis === 'selected' ? (selected?.price || avgTicket) : basis === 'min' ? minTicket : avgTicket;
  const breakEvenDays = ticketValue ? Math.ceil(passCost / ticketValue) : 0;
  const seasonValue = ticketValue * days;
  const net = seasonValue - passCost;
  const perDay = days ? (passCost / days).toFixed(2) : '0.00';
  els.passCalcResults.innerHTML = [
    ['Ticket basis', basis === 'selected' ? (selected ? `${selected.name} ticket` : 'Select a resort') : basis === 'min' ? 'Lowest filtered ticket' : 'Average filtered ticket', ticketValue ? `$${ticketValue}` : '—'],
    ['Break-even point', breakEvenDays ? `${breakEvenDays} day${breakEvenDays===1?'':'s'}` : '—', ticketValue ? `Pass pays off after about ${breakEvenDays} visits` : 'Enter a pass cost'],
    ['Season value', `$${seasonValue.toLocaleString()}`, `${days} planned day${days===1?'':'s'} at $${ticketValue || 0}/day`],
    ['Effective pass day rate', `$${perDay}`, net >= 0 ? `$${net.toLocaleString()} vs buying day tickets` : `$${Math.abs(net).toLocaleString()} short of break-even`],
  ].map(([title,main,sub]) => `<div class="planner-card"><div class="planner-title">${title}</div><div class="planner-main">${main}</div><div class="planner-sub">${sub}</div></div>`).join('');
}

function wireUtilityUI() {
  if (els.passCostInput) {
    ['input','change'].forEach(evt => {
      els.passCostInput.addEventListener(evt, render);
      els.daysInput.addEventListener(evt, render);
      els.ticketBasis.addEventListener(evt, render);
    });
  }
  if (els.backToTop) {
    const onScroll = () => els.backToTop.classList.toggle('show', window.scrollY > 500);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    els.backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }
}

// ─── Main render ──────────────────────────────────────────────────────────────
function render() {
  const resorts = filteredResorts();
  renderSummaryCards(resorts);
  renderPlanner(resorts);
  renderPassCalculator(resorts);
  renderActiveFilters();
  renderResortList(resorts);
  renderComparisonTable(resorts);
  updateLeafletMap(resorts);
  const selected = resorts.find(r=>r.id===state.selectedId) || null;
  renderSelectedResort(selected);
  renderCompareTray();
}

// ─── Initialize ───────────────────────────────────────────────────────────────
function initialize() {
  els.stateFilter.innerHTML = uniqueStates().map(s=>`<option value="${s}">${s}</option>`).join('');
  els.passFilter.innerHTML  = uniquePasses().map(p=>`<option value="${p}">${p}</option>`).join('');
  wireEvents();
  wireUtilityUI();
  render();
  // Init map after layout paint
  setTimeout(() => initLeafletMap(), 100);
}

initialize();
