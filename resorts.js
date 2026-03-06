// ─── Resort Data ──────────────────────────────────────────────────────────────
const RESORTS = [
  {
    id:'black-nh', name:'Black Mountain', state:'NH', pass:'Indy', owner:'Independent',
    phone:'(603) 383-4490', town:'Jackson, NH',
    vertical:1100, trails:45, lifts:5, acres:143, snowfall:120, snowmaking:98, night:false,
    longestRun:2.5, lat:44.1776, lon:-71.1284,
    difficulty:{beginner:.20,intermediate:.45,advanced:.25,expert:.10},
    liftsBreakdown:[['Double',3],['Triple',1],['Surface',1]],
    website:'https://www.blackmt.com/', webcamImage:'', webcamPage:'',
    trailMapImage:'', trailMapPage:'https://www.blackmt.com/',
    price:69, terrainPark:false, seasonOpen:'Dec', seasonClose:'Mar',
    hasLodging:false, hasRentals:true, hasLessons:true,
    indyDays:2, ikonDays:0,
    notes:'Classic New Hampshire small-mountain feel with strong historic character.',
    honesttake:'Great classic doubles and a true old-school vibe. Don\'t come expecting grooming — it\'s charmingly rustic.',
    tags:['Historic','Classic doubles','Indy favorite'],
    bestFor:['beginners','family']
  },
  {
    id:'black-me', name:'Black Mountain of Maine', state:'ME', pass:'Indy', owner:'Community nonprofit',
    phone:'(207) 364-8977', town:'Rumford, ME',
    vertical:1380, trails:50, lifts:3, acres:600, snowfall:110, snowmaking:75, night:true,
    longestRun:2.0, lat:44.5342, lon:-70.5368,
    difficulty:{beginner:.24,intermediate:.38,advanced:.24,expert:.14},
    liftsBreakdown:[['Double',2],['T-Bar',1]],
    website:'https://skiblackmountain.org/', webcamImage:'', webcamPage:'',
    trailMapImage:'', trailMapPage:'https://skiblackmountain.org/',
    price:55, terrainPark:false, seasonOpen:'Dec', seasonClose:'Mar',
    hasLodging:false, hasRentals:true, hasLessons:true,
    indyDays:2, ikonDays:0,
    notes:'Rumford soul hill with big acreage, meaningful vert, top-to-bottom night skiing, and nonprofit energy.',
    honesttake:'One of the best-kept secrets in New England. No frills, serious acreage, and the nonprofit owners genuinely love it.',
    tags:['Night skiing','Maine','Community hill'],
    bestFor:['night','budget','family']
  },
  {
    id:'bolton', name:'Bolton Valley', state:'VT', pass:'Indy', owner:'Independent',
    phone:'(802) 434-3444', town:'Bolton, VT',
    vertical:1634, trails:71, lifts:6, acres:300, snowfall:300, snowmaking:62, night:true,
    longestRun:2.0, lat:44.4217, lon:-72.8518,
    difficulty:{beginner:.18,intermediate:.44,advanced:.25,expert:.13},
    liftsBreakdown:[['Quad',2],['Double',3],['Surface',1]],
    website:'https://www.boltonvalley.com/', webcamImage:'', webcamPage:'',
    trailMapImage:'', trailMapPage:'https://www.boltonvalley.com/',
    price:89, terrainPark:true, seasonOpen:'Nov', seasonClose:'Apr',
    hasLodging:true, hasRentals:true, hasLessons:true,
    indyDays:2, ikonDays:0,
    notes:'Natural-snow standout with night skiing, backcountry credibility, and one of the strongest local scenes in Vermont.',
    honesttake:'Best snowfall totals in New England for a small mountain. Snowmaking is limited so pray for a good winter.',
    tags:['Night skiing','Natural snow','Backcountry'],
    bestFor:['night','natural-snow','steeps']
  },
  {
    id:'bousquet', name:'Bousquet', state:'MA', pass:'Indy', owner:'Private',
    phone:'(413) 442-8316', town:'Pittsfield, MA',
    vertical:750, trails:24, lifts:5, acres:100, snowfall:70, snowmaking:95, night:true,
    longestRun:1.0, lat:42.4138, lon:-73.2820,
    difficulty:{beginner:.28,intermediate:.44,advanced:.22,expert:.06},
    liftsBreakdown:[['Quad',2],['Triple',1],['Surface',2]],
    website:'https://www.bousquetmountain.com/', webcamImage:'', webcamPage:'',
    trailMapImage:'', trailMapPage:'https://www.bousquetmountain.com/',
    price:65, terrainPark:true, seasonOpen:'Dec', seasonClose:'Mar',
    hasLodging:false, hasRentals:true, hasLessons:true,
    indyDays:2, ikonDays:0,
    notes:'Compact but useful mountain with lights, local energy, and easy access.',
    honesttake:'Good after-work option for Berkshires locals. Vertical is modest — don\'t drive far for this one.',
    tags:['Night skiing','Berkshires','Local hill'],
    bestFor:['night','beginners','terrain-park']
  },
  {
    id:'bradford', name:'Bradford Ski Area', state:'MA', pass:'Independent', owner:'Independent',
    phone:'(978) 373-0071', town:'Bradford, MA',
    vertical:230, trails:15, lifts:10, acres:48, snowfall:40, snowmaking:100, night:true,
    longestRun:0.4, lat:42.7779, lon:-71.0819,
    difficulty:{beginner:.34,intermediate:.40,advanced:.20,expert:.06},
    liftsBreakdown:[['Triple',3],['T-Bar',1],['Rope tow',3],['Carpet',3]],
    website:'https://skibradford.com/', webcamImage:'', webcamPage:'',
    trailMapImage:'', trailMapPage:'https://skibradford.com/',
    price:49, terrainPark:false, seasonOpen:'Dec', seasonClose:'Mar',
    hasLodging:false, hasRentals:true, hasLessons:true,
    indyDays:0, ikonDays:0,
    notes:'Pure local feeder hill near Boston with strong night-skiing utility and learn-to-ride value.',
    honesttake:'Ideal for learning or quick weeknight laps near Boston. Experienced skiers will lap it in 90 minutes.',
    tags:['Boston-area','Night skiing','Feeder hill'],
    bestFor:['beginners','night','budget','family']
  },
  {
    id:'bromley', name:'Bromley', state:'VT', pass:'Independent', owner:'Corporate',
    phone:'(802) 824-5522', town:'Manchester, VT',
    vertical:1334, trails:47, lifts:9, acres:178, snowfall:145, snowmaking:98, night:false,
    longestRun:2.5, lat:43.2278, lon:-72.9382,
    difficulty:{beginner:.32,intermediate:.36,advanced:.20,expert:.12},
    liftsBreakdown:[['High-speed quad',1],['Fixed quad',1],['Double',4],['T-Bar',1],['Carpet',2]],
    website:'https://www.bromley.com/', webcamImage:'', webcamPage:'',
    trailMapImage:'', trailMapPage:'https://www.bromley.com/',
    price:99, terrainPark:true, seasonOpen:'Nov', seasonClose:'Apr',
    hasLodging:true, hasRentals:true, hasLessons:true,
    indyDays:0, ikonDays:0,
    notes:'South-facing family cruiser with a balanced terrain mix.',
    honesttake:'Sun-facing slopes mean great on a cold bluebird day but get slushy fast in spring. Pure family mountain.',
    tags:['Family','Southern Vermont','Cruisers'],
    bestFor:['family','beginners','terrain-park']
  },
  {
    id:'burke', name:'Burke Mountain', state:'VT', pass:'Independent', owner:'Independent',
    phone:'(802) 626-7300', town:'East Burke, VT',
    vertical:2057, trails:55, lifts:4, acres:260, snowfall:217, snowmaking:70, night:false,
    longestRun:2.0, lat:44.5717, lon:-71.8928,
    difficulty:{beginner:.18,intermediate:.42,advanced:.24,expert:.16},
    liftsBreakdown:[['High-speed quad',2],['T-Bar',1],['J-Bar',1]],
    website:'https://skiburke.com/', webcamImage:'', webcamPage:'https://skiburke.com/the-mountain/webcams',
    trailMapImage:'', trailMapPage:'https://skiburke.com/the-mountain/weather-conditions#map',
    price:109, terrainPark:false, seasonOpen:'Nov', seasonClose:'Apr',
    hasLodging:true, hasRentals:true, hasLessons:true,
    indyDays:0, ikonDays:0,
    notes:'Big vert, race culture, and serious Northeast Kingdom terrain.',
    honesttake:'The drive to East Burke is real — but so is the mountain. Best intermediate-to-expert vertical in small-mountain NE.',
    tags:['Northeast Kingdom','Race culture','Big vert'],
    bestFor:['steeps','natural-snow']
  },
  {
    id:'catamount', name:'Catamount', state:'NY/MA', pass:'Indy', owner:'Independent',
    phone:'(518) 325-3200', town:'Hillsdale, NY',
    vertical:1000, trails:44, lifts:8, acres:119, snowfall:75, snowmaking:93, night:true,
    longestRun:1.75, lat:42.1269, lon:-73.5206,
    difficulty:{beginner:.35,intermediate:.42,advanced:.17,expert:.06},
    liftsBreakdown:[['Quad',2],['Triple',3],['Carpet',3]],
    website:'https://catamountski.com/', webcamImage:'', webcamPage:'',
    trailMapImage:'', trailMapPage:'https://catamountski.com/',
    price:79, terrainPark:true, seasonOpen:'Dec', seasonClose:'Mar',
    hasLodging:false, hasRentals:true, hasLessons:true,
    indyDays:2, ikonDays:0,
    notes:'Broad lit terrain and strong southern New England access.',
    honesttake:'Best option for NYC-area and Hudson Valley skiers. Accessible but snowfall is the weakest in the region.',
    tags:['Night skiing','Indy','Hudson Valley access'],
    bestFor:['night','beginners','terrain-park','family']
  },
  {
    id:'gunstock', name:'Gunstock', state:'NH', pass:'Independent', owner:'County-owned',
    phone:'(603) 293-4341', town:'Gilford, NH',
    vertical:1400, trails:55, lifts:8, acres:227, snowfall:160, snowmaking:98, night:true,
    longestRun:1.6, lat:43.5404, lon:-71.3702,
    difficulty:{beginner:.22,intermediate:.42,advanced:.25,expert:.11},
    liftsBreakdown:[['High-speed quad',1],['Fixed quad',2],['Triple',1],['Double',2],['Surface',2]],
    website:'https://www.gunstock.com/', webcamImage:'', webcamPage:'',
    trailMapImage:'', trailMapPage:'https://www.gunstock.com/',
    price:89, terrainPark:true, seasonOpen:'Nov', seasonClose:'Apr',
    hasLodging:false, hasRentals:true, hasLessons:true,
    indyDays:0, ikonDays:0,
    notes:'Big-small mountain blend with strong operations and one of the better night products in New England.',
    honesttake:'County-owned means prices stay reasonable and profits go back to locals. Underrated value in the Lakes Region.',
    tags:['Night skiing','Family','Strong ops'],
    bestFor:['night','family','terrain-park']
  },
  {
    id:'magic', name:'Magic Mountain', state:'VT', pass:'Indy', owner:'Community-backed independent',
    phone:'(802) 824-5566', town:'Londonderry, VT',
    vertical:1500, trails:51, lifts:5, acres:285, snowfall:120, snowmaking:45, night:false,
    longestRun:3.0, lat:43.1964, lon:-72.8243,
    difficulty:{beginner:.14,intermediate:.32,advanced:.34,expert:.20},
    liftsBreakdown:[['Quad',1],['Double',3],['Surface',1]],
    website:'https://magicmtn.com/', webcamImage:'', webcamPage:'',
    trailMapImage:'', trailMapPage:'https://magicmtn.com/',
    price:79, terrainPark:false, seasonOpen:'Dec', seasonClose:'Apr',
    hasLodging:false, hasRentals:false, hasLessons:true,
    indyDays:2, ikonDays:0,
    notes:'Cult-favorite Vermont mountain with soul, steeper terrain, and no crowds.',
    honesttake:'The skiing community\'s best kept secret. Snowmaking is minimal — check conditions before making the trip.',
    tags:['Soul skiing','Steeps','Indy legend'],
    bestFor:['steeps','budget']
  },
  {
    id:'nashoba', name:'Nashoba Valley', state:'MA', pass:'Independent', owner:'Independent',
    phone:'(978) 897-2101', town:'Westford, MA',
    vertical:240, trails:17, lifts:10, acres:46, snowfall:50, snowmaking:100, night:true,
    longestRun:0.5, lat:42.5290, lon:-71.4731,
    difficulty:{beginner:.20,intermediate:.50,advanced:.30,expert:.00},
    liftsBreakdown:[['Triple',3],['Double',1],['Conveyor',3],['Rope tow',3]],
    website:'https://skinashoba.com/', webcamImage:'', webcamPage:'',
    trailMapImage:'', trailMapPage:'https://skinashoba.com/',
    price:49, terrainPark:false, seasonOpen:'Dec', seasonClose:'Mar',
    hasLodging:false, hasRentals:true, hasLessons:true,
    indyDays:0, ikonDays:0,
    notes:'Metro-Boston night-ski machine built for quick laps and lessons.',
    honesttake:'Not a destination — a utility hill. Perfect for after-work laps or first-timers near Boston. Nothing more.',
    tags:['Night skiing','Metro Boston','Lessons'],
    bestFor:['beginners','night','budget','family']
  },
  {
    id:'pats-peak', name:'Pats Peak', state:'NH', pass:'Indy', owner:'Family-owned',
    phone:'(603) 428-3245', town:'Henniker, NH',
    vertical:770, trails:28, lifts:11, acres:117, snowfall:80, snowmaking:100, night:true,
    longestRun:1.5, lat:43.1790, lon:-71.8196,
    difficulty:{beginner:.50,intermediate:.21,advanced:.12,expert:.17},
    liftsBreakdown:[['Quad',1],['Triple',3],['Double',2],['J-Bar',1],['Handle tow',2],['Carpet',2]],
    website:'https://www.patspeak.com/', webcamImage:'', webcamPage:'',
    trailMapImage:'', trailMapPage:'https://www.patspeak.com/',
    price:75, terrainPark:true, seasonOpen:'Dec', seasonClose:'Mar',
    hasLodging:false, hasRentals:true, hasLessons:true,
    indyDays:2, ikonDays:0,
    notes:'One of the strongest night and learn-to-ski operations in New England.',
    honesttake:'The gold standard for family-friendly NH. Expert terrain is limited, but everything else is done well.',
    tags:['Night skiing','Family-owned','Race leagues'],
    bestFor:['beginners','night','family','terrain-park']
  },
  {
    id:'wachusett', name:'Wachusett', state:'MA', pass:'Independent', owner:'Independent',
    phone:'(978) 464-2300', town:'Princeton, MA',
    vertical:1000, trails:27, lifts:8, acres:110, snowfall:72, snowmaking:100, night:true,
    longestRun:2.0, lat:42.4884, lon:-71.8863,
    difficulty:{beginner:.25,intermediate:.50,advanced:.20,expert:.05},
    liftsBreakdown:[['High-speed quad',2],['Triple',2],['Surface',4]],
    website:'https://www.wachusett.com/', webcamImage:'', webcamPage:'',
    trailMapImage:'', trailMapPage:'https://www.wachusett.com/',
    price:89, terrainPark:true, seasonOpen:'Nov', seasonClose:'Apr',
    hasLodging:false, hasRentals:true, hasLessons:true,
    indyDays:0, ikonDays:0,
    notes:'Massachusetts volume leader with elite convenience and huge after-work appeal.',
    honesttake:'Gets very crowded on weekends. Come on a Tuesday night and it\'s a completely different experience.',
    tags:['Night skiing','High volume','Near Boston'],
    bestFor:['night','beginners','terrain-park','family']
  },
  // ── Maine ─────────────────────────────────────────────────────────────────
  {
    id:'big-moose', name:'Big Moose Mountain', state:'ME', pass:'Independent', owner:'Independent',
    phone:'(207) 695-4850', town:'Greenville, ME',
    vertical:1150, trails:30, lifts:3, acres:200, snowfall:130, snowmaking:80, night:false,
    longestRun:2.0, lat:45.6312, lon:-69.7031,
    difficulty:{beginner:.20,intermediate:.45,advanced:.25,expert:.10},
    liftsBreakdown:[['Double',2],['Surface',1]],
    website:'https://www.bigmooseski.com/', webcamImage:'', webcamPage:'',
    trailMapImage:'', trailMapPage:'https://www.bigmooseski.com/',
    price:55, terrainPark:false, seasonOpen:'Dec', seasonClose:'Mar',
    hasLodging:false, hasRentals:true, hasLessons:false,
    indyDays:0, ikonDays:0,
    notes:'Remote central Maine near Moosehead Lake. True north-woods ski experience with minimal crowds.',
    honesttake:'The most remote ski area in New England. The drive is long — but if you love solitude and moose sightings, it\'s worth it.',
    tags:['Remote','Maine','North woods'],
    bestFor:['budget','family']
  },
  {
    id:'big-rock', name:'Big Rock', state:'ME', pass:'Independent', owner:'Independent',
    phone:'(207) 425-6711', town:'Mars Hill, ME',
    vertical:990, trails:30, lifts:4, acres:170, snowfall:110, snowmaking:85, night:true,
    longestRun:1.5, lat:46.8756, lon:-68.3384,
    difficulty:{beginner:.25,intermediate:.40,advanced:.25,expert:.10},
    liftsBreakdown:[['Quad',1],['Double',2],['Surface',1]],
    website:'https://bigrockmaine.com/', webcamImage:'', webcamPage:'',
    trailMapImage:'', trailMapPage:'https://bigrockmaine.com/',
    price:49, terrainPark:true, seasonOpen:'Dec', seasonClose:'Mar',
    hasLodging:false, hasRentals:true, hasLessons:true,
    indyDays:0, ikonDays:0,
    notes:'The only ski area in Aroostook County — northern Maine\'s community hill.',
    honesttake:'Deep in Aroostook County — it\'s not a destination trip unless you\'re already in northern Maine. Genuinely great local mountain.',
    tags:['Aroostook County','Night skiing','Community hill'],
    bestFor:['budget','night','family','terrain-park']
  },
  {
    id:'camden', name:'Camden Snow Bowl', state:'ME', pass:'Independent', owner:'City of Camden',
    phone:'(207) 236-3438', town:'Camden, ME',
    vertical:950, trails:31, lifts:4, acres:150, snowfall:95, snowmaking:70, night:true,
    longestRun:1.4, lat:44.2162, lon:-69.0853,
    difficulty:{beginner:.25,intermediate:.40,advanced:.25,expert:.10},
    liftsBreakdown:[['Triple',1],['Double',2],['Surface',1]],
    website:'https://www.camdensnowbowl.com/', webcamImage:'', webcamPage:'',
    trailMapImage:'', trailMapPage:'https://www.camdensnowbowl.com/',
    price:50, terrainPark:false, seasonOpen:'Dec', seasonClose:'Mar',
    hasLodging:false, hasRentals:true, hasLessons:true,
    indyDays:0, ikonDays:0,
    notes:'City-owned coastal Maine gem with ocean views from the summit.',
    honesttake:'The views of Penobscot Bay are genuinely stunning. Pair it with a night in Camden village — best ski trip vibe in Maine.',
    tags:['Ocean views','Municipal','Coastal Maine'],
    bestFor:['budget','family','beginners']
  },
  {
    id:'lost-valley', name:'Lost Valley', state:'ME', pass:'Independent', owner:'Independent',
    phone:'(207) 784-1561', town:'Auburn, ME',
    vertical:240, trails:16, lifts:4, acres:50, snowfall:75, snowmaking:100, night:true,
    longestRun:0.5, lat:44.1201, lon:-70.2648,
    difficulty:{beginner:.35,intermediate:.40,advanced:.20,expert:.05},
    liftsBreakdown:[['Triple',2],['Surface',1],['Carpet',1]],
    website:'https://www.lostvalleyski.com/', webcamImage:'', webcamPage:'',
    trailMapImage:'', trailMapPage:'https://www.lostvalleyski.com/',
    price:42, terrainPark:true, seasonOpen:'Dec', seasonClose:'Mar',
    hasLodging:false, hasRentals:true, hasLessons:true,
    indyDays:0, ikonDays:0,
    notes:'Auburn feeder hill with full snowmaking, night skiing, and lesson-focused programs.',
    honesttake:'Pure learn-to-ski hill. Nobody comes here for a destination day — they come because it\'s close and open at night.',
    tags:['Night skiing','Lessons','Auburn ME'],
    bestFor:['beginners','budget','night','family']
  },
  // ── New Hampshire ─────────────────────────────────────────────────────────
  {
    id:'cannon', name:'Cannon Mountain', state:'NH', pass:'Independent', owner:'State of NH',
    phone:'(603) 823-8800', town:'Franconia, NH',
    vertical:2180, trails:97, lifts:9, acres:285, snowfall:180, snowmaking:96, night:false,
    longestRun:2.3, lat:44.1726, lon:-71.6973,
    difficulty:{beginner:.20,intermediate:.36,advanced:.28,expert:.16},
    liftsBreakdown:[['Aerial tram',1],['High-speed quad',2],['Fixed quad',1],['Triple',1],['Double',2],['Surface',2]],
    website:'https://www.cannonmt.com/', webcamImage:'', webcamPage:'https://www.cannonmt.com/webcam',
    trailMapImage:'https://admin.cannonmt.com/publicFiles/documents/2526_Cannon_TrailMap_Digital.jpg',
    trailMapPage:'https://www.cannonmt.com/trail-map',
    price:99, terrainPark:false, seasonOpen:'Nov', seasonClose:'Apr',
    hasLodging:false, hasRentals:true, hasLessons:true,
    indyDays:0, ikonDays:0,
    notes:'State-owned Franconia Notch classic with the highest vertical in NH and a historic tram.',
    honesttake:'The Front Five are genuine expert terrain — don\'t follow someone onto Avalanche if you\'re not ready. The rest is approachable.',
    tags:['State-owned','Expert terrain','Franconia Notch','Tram'],
    bestFor:['steeps','natural-snow']
  },
  {
    id:'dartmouth-skiway', name:'Dartmouth Skiway', state:'NH', pass:'Independent', owner:'Dartmouth College',
    phone:'(603) 795-2143', town:'Lyme, NH',
    vertical:968, trails:33, lifts:4, acres:100, snowfall:140, snowmaking:60, night:false,
    longestRun:1.5, lat:43.8968, lon:-72.0365,
    difficulty:{beginner:.20,intermediate:.40,advanced:.30,expert:.10},
    liftsBreakdown:[['Quad',2],['Double',1],['Surface',1]],
    website:'https://skiway.dartmouth.edu/', webcamImage:'', webcamPage:'',
    trailMapImage:'', trailMapPage:'https://skiway.dartmouth.edu/',
    price:65, terrainPark:false, seasonOpen:'Dec', seasonClose:'Mar',
    hasLodging:false, hasRentals:true, hasLessons:true,
    indyDays:0, ikonDays:0,
    notes:'College-owned hill on the NH/VT border with strong racing heritage and modest pricing.',
    honesttake:'Relaxed Ivy League energy. Low prices, decent natural snow, and almost never crowded. A hidden gem.',
    tags:['College-owned','NH/VT border','Race heritage'],
    bestFor:['budget','family','natural-snow']
  },
  {
    id:'king-pine', name:'King Pine', state:'NH', pass:'Independent', owner:'Purity Spring Resort',
    phone:'(603) 367-8896', town:'East Madison, NH',
    vertical:350, trails:16, lifts:5, acres:55, snowfall:70, snowmaking:100, night:true,
    longestRun:0.75, lat:43.9404, lon:-71.0101,
    difficulty:{beginner:.38,intermediate:.37,advanced:.18,expert:.07},
    liftsBreakdown:[['Triple',2],['Double',1],['Surface',1],['Carpet',1]],
    website:'https://www.kingpine.com/', webcamImage:'', webcamPage:'',
    trailMapImage:'', trailMapPage:'https://www.kingpine.com/',
    price:55, terrainPark:false, seasonOpen:'Dec', seasonClose:'Mar',
    hasLodging:true, hasRentals:true, hasLessons:true,
    indyDays:0, ikonDays:0,
    notes:'Family resort attached to Purity Spring Resort. Beginner-forward with a warm, low-key feel.',
    honesttake:'Perfect for young kids and true beginners. Experienced skiers will want more mountain.',
    tags:['Family resort','Lakes Region','Learn-to-ski'],
    bestFor:['beginners','family','budget']
  },
  {
    id:'mcintyre', name:'McIntyre Ski Area', state:'NH', pass:'Independent', owner:'City of Manchester',
    phone:'(603) 624-6571', town:'Manchester, NH',
    vertical:160, trails:10, lifts:4, acres:35, snowfall:55, snowmaking:100, night:true,
    longestRun:0.3, lat:42.9720, lon:-71.4548,
    difficulty:{beginner:.40,intermediate:.40,advanced:.20,expert:.00},
    liftsBreakdown:[['Triple',1],['Double',1],['Surface',1],['Carpet',1]],
    website:'https://mcintyreskiarea.com/', webcamImage:'', webcamPage:'',
    trailMapImage:'', trailMapPage:'https://mcintyreskiarea.com/',
    price:38, terrainPark:false, seasonOpen:'Dec', seasonClose:'Mar',
    hasLodging:false, hasRentals:true, hasLessons:true,
    indyDays:0, ikonDays:0,
    notes:'City-run Manchester hill offering affordable night skiing for the southern NH metro area.',
    honesttake:'The cheapest skiing in New England. A pure urban utility hill — no one is here for the views.',
    tags:['City-owned','Night skiing','Manchester NH','Urban hill'],
    bestFor:['beginners','budget','night','family']
  },
  {
    id:'tenney', name:'Tenney Mountain', state:'NH', pass:'Independent', owner:'Independent',
    phone:'(603) 536-4125', town:'Plymouth, NH',
    vertical:1430, trails:50, lifts:4, acres:150, snowfall:130, snowmaking:75, night:false,
    longestRun:2.2, lat:43.7851, lon:-71.8234,
    difficulty:{beginner:.22,intermediate:.42,advanced:.26,expert:.10},
    liftsBreakdown:[['High-speed quad',1],['Double',2],['Surface',1]],
    website:'https://tenneymountain.com/', webcamImage:'', webcamPage:'',
    trailMapImage:'', trailMapPage:'https://tenneymountain.com/',
    price:69, terrainPark:false, seasonOpen:'Dec', seasonClose:'Mar',
    hasLodging:false, hasRentals:true, hasLessons:true,
    indyDays:0, ikonDays:0,
    notes:'Reopened Plymouth-area mountain with solid vertical and refreshed independent spirit.',
    honesttake:'Worth watching after its reopening. Good vertical for NH but check current operating status — it\'s still finding its footing.',
    tags:['Reopened','Plymouth NH','Central NH'],
    bestFor:['family','budget']
  },
  // ── Vermont ───────────────────────────────────────────────────────────────
  {
    id:'middlebury', name:'Middlebury Snow Bowl', state:'VT', pass:'Independent', owner:'Middlebury College',
    phone:'(802) 443-5658', town:'Ripton, VT',
    vertical:1020, trails:17, lifts:3, acres:110, snowfall:150, snowmaking:40, night:false,
    longestRun:1.5, lat:43.9443, lon:-72.9637,
    difficulty:{beginner:.20,intermediate:.40,advanced:.30,expert:.10},
    liftsBreakdown:[['Triple',1],['Double',1],['Surface',1]],
    website:'https://www.middlebury.edu/snow-bowl', webcamImage:'', webcamPage:'',
    trailMapImage:'', trailMapPage:'https://www.middlebury.edu/snow-bowl',
    price:55, terrainPark:false, seasonOpen:'Dec', seasonClose:'Mar',
    hasLodging:false, hasRentals:true, hasLessons:true,
    indyDays:0, ikonDays:0,
    notes:'College-owned Bread Loaf Mountain gem with excellent natural snow and great value.',
    honesttake:'Criminally overlooked. Natural snow totals rival Bolton. Trail count is low but the terrain is legit.',
    tags:['College-owned','Natural snow','VT classic'],
    bestFor:['natural-snow','budget','steeps']
  },
  // ── Massachusetts ─────────────────────────────────────────────────────────
  {
    id:'berkshire-east', name:'Berkshire East', state:'MA', pass:'Indy', owner:'Independent',
    phone:'(413) 339-6617', town:'Charlemont, MA',
    vertical:1180, trails:45, lifts:6, acres:170, snowfall:90, snowmaking:90, night:true,
    longestRun:1.5, lat:42.6398, lon:-72.7804,
    difficulty:{beginner:.25,intermediate:.40,advanced:.25,expert:.10},
    liftsBreakdown:[['Quad',2],['Triple',1],['Double',2],['Surface',1]],
    website:'https://berkshireeast.com/', webcamImage:'', webcamPage:'',
    trailMapImage:'', trailMapPage:'https://berkshireeast.com/',
    price:79, terrainPark:true, seasonOpen:'Nov', seasonClose:'Apr',
    hasLodging:false, hasRentals:true, hasLessons:true,
    indyDays:2, ikonDays:0,
    notes:'Independently owned Charlemont mountain with solid vertical for Massachusetts and a zipline canopy tour.',
    honesttake:'Best vertical in Massachusetts. The zipline is a bonus. Don\'t overlook this one if you\'re in western MA.',
    tags:['Night skiing','Indy','Charlemont MA','Zipline'],
    bestFor:['night','terrain-park','family']
  }
];

// ─── Constants ────────────────────────────────────────────────────────────────
const INDY_PRICE = 349;
const COL_MAX = {vertical:2200,trails:100,lifts:12,acres:650,longestRun:3.2,snowfall:320,snowmaking:100,price:130,snow7day:30};
const WX_ICONS = {0:'☀️',1:'🌤️',2:'⛅',3:'☁️',45:'🌫️',48:'🌫️',51:'🌦️',53:'🌦️',55:'🌧️',61:'🌧️',63:'🌧️',65:'🌧️',71:'🌨️',73:'🌨️',75:'❄️',77:'🌨️',80:'🌦️',81:'🌦️',82:'⛈️',85:'🌨️',86:'❄️',95:'⛈️',96:'⛈️',99:'⛈️'};
const WX_DESC = {0:'Clear',1:'Mainly clear',2:'Partly cloudy',3:'Overcast',45:'Fog',48:'Fog',51:'Light drizzle',53:'Drizzle',55:'Heavy drizzle',61:'Light rain',63:'Rain',65:'Heavy rain',71:'Light snow',73:'Snow',75:'Heavy snow',77:'Snow grains',80:'Showers',81:'Showers',82:'Heavy showers',85:'Snow showers',86:'Heavy snow',95:'Thunderstorm',96:'Thunderstorm',99:'Thunderstorm'};

// ─── State ────────────────────────────────────────────────────────────────────
const S = {
  search:'', pass:'All', stateFilter:'All',
  nightOnly:false, selectedId:null,
  sortCol:'vertical', sortDir:'desc',
  qf:null,
  origin: JSON.parse(localStorage.getItem('ski-origin')||'null'),
  driveCache: JSON.parse(localStorage.getItem('ski-drives')||'{}'),
  weatherCache:{}, // session only
  snow7Cache:{},   // session only — expires after 30min
  snow7Time:{},
  compareSet:new Set(),
  notes:  JSON.parse(localStorage.getItem('ski-notes')||'{}'),
  favorites:  new Set(JSON.parse(localStorage.getItem('ski-fav')||'[]')),
  visited:    new Set(JSON.parse(localStorage.getItem('ski-visited')||'[]')),
  wishlist:   new Set(JSON.parse(localStorage.getItem('ski-wish')||'[]')),
  skiDays:5,
  activeTab:'dashboard',
};

// ─── DOM ──────────────────────────────────────────────────────────────────────
const $ = id => document.getElementById(id);
const el = {
  summaryCards: $('summaryCards'),
  searchInput:  $('searchInput'),
  stateFilter:  $('stateFilter'),
  passFilter:   $('passFilter'),
  sortBy:       $('sortBy'),
  toggleNight:  $('toggleNight'),
  randomResort: $('randomResort'),
  activeFilters:$('activeFilters'),
  resortList:   $('resortList'),
  resultCount:  $('resultCount'),
  compTable:    $('comparisonTable'),
  compBody:     $('comparisonBody'),
  detailSection:$('detailSection'),
  compareTray:  $('compareTray'),
  comparePills: $('comparePills'),
  compareBtn:   $('compareBtn'),
  clearCompare: $('clearCompare'),
  sbsPanel:     $('sideBySidePanel'),
  sbsContent:   $('sideBySideContent'),
  closeCompare: $('closeCompare'),
  originInput:  $('originInput'),
  detectLoc:    $('detectLocation'),
  locStatus:    $('locationStatus'),
  plannerGrid:  $('plannerGrid'),
  plannerDay:   $('plannerDay'),
  skiDays:      $('skiDays'),
  calcGrid:     $('calcGrid'),
  toast:        $('toast'),
  sidebarToggle:$('sidebarToggle'),
  clearQF:      $('clearQF'),
};

// ─── Toast ────────────────────────────────────────────────────────────────────
let toastT = null;
function toast(msg, dur=2600) {
  el.toast.textContent = msg;
  el.toast.classList.add('show');
  clearTimeout(toastT);
  toastT = setTimeout(() => el.toast.classList.remove('show'), dur);
}

// ─── Persist helpers ──────────────────────────────────────────────────────────
function saveLS(key, val) { try { localStorage.setItem(key, JSON.stringify(val)); } catch{} }
function persist() {
  saveLS('ski-fav',     [...S.favorites]);
  saveLS('ski-visited', [...S.visited]);
  saveLS('ski-wish',    [...S.wishlist]);
  saveLS('ski-notes',   S.notes);
  if (S.origin)  saveLS('ski-origin', S.origin);
  if (Object.keys(S.driveCache).length) saveLS('ski-drives', S.driveCache);
}

// ─── Filtering ────────────────────────────────────────────────────────────────
function uniquePasses() { return ['All',...new Set(RESORTS.map(r=>r.pass))]; }
function uniqueStates()  { return ['All',...[...new Set(RESORTS.map(r=>r.state))].sort()]; }

const QF = {
  beginners:     r => r.difficulty.beginner >= .25,
  steeps:        r => r.difficulty.advanced + r.difficulty.expert >= .35,
  night:         r => r.night,
  'natural-snow':r => r.snowfall >= 150,
  'terrain-park':r => r.terrainPark,
  family:        r => r.bestFor?.includes('family'),
  budget:        r => r.price <= 65,
  favorites:     r => S.favorites.has(r.id),
  wishlist:      r => S.wishlist.has(r.id),
};

function filteredResorts() {
  return RESORTS.filter(r => {
    const q = S.search.trim().toLowerCase();
    const hay = [r.name,r.state,r.pass,r.owner,r.notes,...(r.tags||[])].join(' ').toLowerCase();
    return (!q || hay.includes(q))
      && (S.pass==='All' || r.pass===S.pass)
      && (S.stateFilter==='All' || r.state===S.stateFilter)
      && (!S.nightOnly || r.night)
      && (!S.qf || QF[S.qf]?.(r));
  }).sort((a,b) => {
    if (S.sortCol==='drive') {
      const da=S.driveCache[a.id]??Infinity, db=S.driveCache[b.id]??Infinity;
      return S.sortDir==='asc' ? da-db : db-da;
    }
    if (S.sortCol==='snow7day') {
      const da=S.snow7Cache[a.id]??-1, db=S.snow7Cache[b.id]??-1;
      return S.sortDir==='asc' ? da-db : db-da;
    }
    let av=a[S.sortCol], bv=b[S.sortCol];
    if (typeof av==='boolean'){av=av?1:0;bv=bv?1:0;}
    if (typeof av==='string') return S.sortDir==='asc' ? av.localeCompare(bv) : bv.localeCompare(av);
    return S.sortDir==='asc' ? av-bv : bv-av;
  });
}

// ─── Drive Times ──────────────────────────────────────────────────────────────
async function fetchDrive(resort) {
  if (!S.origin) return null;
  if (S.driveCache[resort.id] !== undefined) return S.driveCache[resort.id];
  try {
    const r = await fetch(`https://router.project-osrm.org/route/v1/driving/${S.origin.lon},${S.origin.lat};${resort.lon},${resort.lat}?overview=false`);
    const d = await r.json();
    const mins = Math.round(d.routes[0].duration/60);
    S.driveCache[resort.id] = mins;
    return mins;
  } catch { S.driveCache[resort.id]=null; return null; }
}
function fmtDrive(m) {
  if (m==null) return null;
  if (m>=60) { const h=Math.floor(m/60),mn=m%60; return mn>0?`${h}h ${mn}m`:`${h}h`; }
  return `${m}m`;
}
async function loadAllDrives() {
  if (!S.origin) return;
  toast('⏱ Calculating drive times…',4000);
  await Promise.all(RESORTS.map(r=>fetchDrive(r)));
  persist();
  render();
  toast('✓ Drive times updated');
}

// ─── Geocode (Nominatim) ──────────────────────────────────────────────────────
async function geocode(q) {
  try {
    const r = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=1`,{headers:{'Accept-Language':'en'}});
    const d = await r.json();
    if (!d.length) return null;
    return {lat:parseFloat(d[0].lat),lon:parseFloat(d[0].lon),label:d[0].display_name.split(',')[0]};
  } catch { return null; }
}

// ─── Weather (Open-Meteo) — with 30-min cache ─────────────────────────────────
async function fetchWeather(resort) {
  const now = Date.now();
  const cache = S.weatherCache[resort.id];
  if (cache && now - cache.ts < 30*60*1000) return cache.data;
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${resort.lat}&longitude=${resort.lon}&current=temperature_2m,weathercode,windspeed_10m&daily=weathercode,temperature_2m_max,temperature_2m_min,snowfall_sum&temperature_unit=fahrenheit&wind_speed_unit=mph&forecast_days=4&timezone=America%2FNew_York`;
    const res = await fetch(url);
    const d = await res.json();
    const data = {
      temp: Math.round(d.current.temperature_2m),
      code: d.current.weathercode,
      wind: Math.round(d.current.windspeed_10m),
      forecast: d.daily.time.slice(1,4).map((date,i)=>({
        day:new Date(date+'T12:00').toLocaleDateString('en-US',{weekday:'short'}),
        code:d.daily.weathercode[i+1],
        hi:Math.round(d.daily.temperature_2m_max[i+1]),
        lo:Math.round(d.daily.temperature_2m_min[i+1]),
        snow:d.daily.snowfall_sum[i+1]||0,
      }))
    };
    S.weatherCache[resort.id] = {data, ts:now};
    return data;
  } catch { return null; }
}

// ─── 7-day snowfall ───────────────────────────────────────────────────────────
async function fetch7DaySnow(resort) {
  const now = Date.now();
  if (S.snow7Cache[resort.id] !== undefined && now - (S.snow7Time[resort.id]||0) < 30*60*1000) return S.snow7Cache[resort.id];
  try {
    const today = new Date(); today.setDate(today.getDate()-1);
    const end   = today.toISOString().split('T')[0];
    const start = new Date(today); start.setDate(start.getDate()-6);
    const startStr = start.toISOString().split('T')[0];
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${resort.lat}&longitude=${resort.lon}&daily=snowfall_sum&timezone=America%2FNew_York&start_date=${startStr}&end_date=${end}`;
    const res = await fetch(url);
    const d = await res.json();
    const total = (d.daily?.snowfall_sum||[]).reduce((s,v)=>s+(v||0),0);
    const inches = Math.round(total / 2.54 * 10) / 10;
    S.snow7Cache[resort.id]  = inches;
    S.snow7Time[resort.id]   = now;
    return inches;
  } catch { return null; }
}

// ─── Load all 7-day snow in background ───────────────────────────────────────
function loadAllSnow() {
  RESORTS.forEach(r => {
    fetch7DaySnow(r).then(v => {
      if (v !== null) {
        S.snow7Cache[r.id] = v;
        // Refresh cell in table if present
        const cell = document.querySelector(`[data-snow7="${r.id}"]`);
        if (cell) {
          const resorts = filteredResorts();
          const maxSnow = Math.max(...resorts.map(x=>S.snow7Cache[x.id]||0),1);
          const isBest = resorts.filter(x=>S.snow7Cache[x.id]!=null).sort((a,b)=>(S.snow7Cache[b.id]||0)-(S.snow7Cache[a.id]||0))[0]?.id === r.id;
          cell.className = `td-num ${isBest?'best-cell':''}`;
          cell.innerHTML = barCell(v,v,maxSnow,'❄️');
        }
      }
    });
  });
}

// ─── Summary cards ────────────────────────────────────────────────────────────
function renderSummary(resorts) {
  const n = resorts.length;
  const avg = k => n ? Math.round(resorts.reduce((s,r)=>s+r[k],0)/n) : 0;
  const minP = n ? Math.min(...resorts.map(r=>r.price)) : '—';
  const closest = n && Object.keys(S.driveCache).length
    ? [...resorts].filter(r=>S.driveCache[r.id]!=null).sort((a,b)=>S.driveCache[a.id]-S.driveCache[b.id])[0]
    : null;
  const snow7vals = resorts.map(r=>S.snow7Cache[r.id]).filter(v=>v!=null);
  const avgSnow7 = snow7vals.length ? (snow7vals.reduce((s,v)=>s+v,0)/snow7vals.length).toFixed(1) : '—';
  el.summaryCards.innerHTML = [
    ['Resorts',     n,          ''],
    ['Avg Vertical',avg('vertical')+' ft',''],
    ['Avg Trails',  avg('trails'),  ''],
    ['Night Skiing',resorts.filter(r=>r.night).length, 'of '+n],
    ['From',        '$'+minP,       'lowest day ticket'],
    ['7-Day Snow',  avgSnow7+(avgSnow7!=='—'?'"':''), 'avg across filtered'],
    ['Closest',     closest?.name||'Set location', closest?fmtDrive(S.driveCache[closest.id]):''],
    ['Terrain Parks',resorts.filter(r=>r.terrainPark).length,'of '+n],
    ['On-Mountain Lodging',resorts.filter(r=>r.hasLodging).length,'with lodging'],
  ].map(([lbl,val,sub])=>`
    <div class="stat-card">
      <div class="stat-lbl">${lbl}</div>
      <div class="stat-val">${val}</div>
      ${sub?`<div class="stat-sub">${sub}</div>`:''}
    </div>`).join('');
}

// ─── Active filter pills ──────────────────────────────────────────────────────
function renderFilters() {
  const tags = [];
  if (S.search.trim())         tags.push({lbl:`"${S.search.trim()}"`,  clr:()=>{S.search='';el.searchInput.value='';}});
  if (S.stateFilter!=='All')   tags.push({lbl:`State: ${S.stateFilter}`,clr:()=>{S.stateFilter='All';el.stateFilter.value='All';}});
  if (S.pass!=='All')          tags.push({lbl:`Pass: ${S.pass}`,        clr:()=>{S.pass='All';el.passFilter.value='All';}});
  if (S.nightOnly)             tags.push({lbl:'🌙 Night only',           clr:()=>{S.nightOnly=false;el.toggleNight.setAttribute('aria-pressed','false');}});
  if (S.qf)                    tags.push({lbl:`✦ ${S.qf}`,              clr:()=>clearQF()});
  el.activeFilters.innerHTML = tags.map((t,i)=>
    `<span class="filter-tag">${t.lbl}<button data-i="${i}">✕</button></span>`
  ).join('');
  [...el.activeFilters.querySelectorAll('button')].forEach(btn=>{
    btn.addEventListener('click',()=>{tags[+btn.dataset.i].clr();render();});
  });
}
function clearQF(){
  S.qf=null;
  document.querySelectorAll('.qf-btn').forEach(b=>b.classList.remove('active'));
  el.clearQF.style.display='none';
}

// ─── Sidebar list ─────────────────────────────────────────────────────────────
function renderList(resorts) {
  el.resultCount.textContent = resorts.length;
  if (!resorts.length){el.resortList.innerHTML='<div class="empty-hint">No resorts match.</div>';return;}
  el.resortList.innerHTML = resorts.map(r=>{
    const drive = S.driveCache[r.id];
    const snow7 = S.snow7Cache[r.id];
    return `
    <div class="resort-item ${r.id===S.selectedId?'selected':''} ${S.compareSet.has(r.id)?'in-compare':''}" data-id="${r.id}" tabindex="0" role="button" aria-label="${r.name}">
      <div class="r-name">${r.name}${S.favorites.has(r.id)?' ⭐':''}</div>
      <div class="r-meta">${r.state} · ${r.town} · $${r.price}</div>
      <div class="chip-row">
        <span class="chip">${r.vertical}ft</span>
        <span class="chip">${r.trails} trails</span>
        ${drive!=null?`<span class="chip b">${fmtDrive(drive)}</span>`:''}
        ${snow7!=null?`<span class="chip g">❄️${snow7}"</span>`:''}
        ${r.night?'<span class="chip g">🌙</span>':''}
        ${r.terrainPark?'<span class="chip w">🛹</span>':''}
      </div>
      <label class="cmp-check"><input type="checkbox" data-cmp="${r.id}" ${S.compareSet.has(r.id)?'checked':''}/> Add to compare</label>
    </div>`}).join('');

  [...el.resortList.querySelectorAll('.resort-item')].forEach(item=>{
    const sel=()=>{S.selectedId=item.dataset.id;render();};
    item.addEventListener('click',e=>{if(!e.target.closest('input'))sel();});
    item.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' ')sel();});
  });
  [...el.resortList.querySelectorAll('[data-cmp]')].forEach(cb=>{
    cb.addEventListener('change',()=>{
      cb.checked?S.compareSet.add(cb.dataset.cmp):S.compareSet.delete(cb.dataset.cmp);
      renderCompareTray();
      const item=el.resortList.querySelector(`[data-id="${cb.dataset.cmp}"]`);
      if(item) item.classList.toggle('in-compare',cb.checked);
    });
  });
  const active=el.resortList.querySelector('.selected');
  if(active) active.scrollIntoView({block:'nearest'});
}

// ─── Comparison table ─────────────────────────────────────────────────────────
function barCell(val, rawVal, max, suffix='') {
  const pct = Math.min(100,Math.round((rawVal/(max||1))*100));
  const disp = suffix ? val+suffix : val;
  return `<div class="bar-cell"><span>${disp}</span><div class="ibar"><div class="ibar-fill" style="width:${pct}%"></div></div></div>`;
}

function renderTable(resorts) {
  // update sort indicators
  [...el.compTable.querySelectorAll('th.sortable')].forEach(th=>{
    th.classList.remove('sort-asc','sort-desc');
    if(th.dataset.col===S.sortCol) th.classList.add(S.sortDir==='asc'?'sort-asc':'sort-desc');
  });
  if(!resorts.length){el.compBody.innerHTML=`<tr><td colspan="15" class="empty-hint">No resorts match.</td></tr>`;return;}

  // Compute best values per column for highlighting
  const best = {};
  ['vertical','trails','lifts','acres','longestRun','snowfall','snowmaking'].forEach(k=>{
    best[k]=resorts.reduce((m,r)=>r[k]>m?r[k]:m,0);
  });
  best.price   = Math.min(...resorts.map(r=>r.price));
  best.snow7   = Math.max(...resorts.map(r=>S.snow7Cache[r.id]||0));
  const hasDrive=resorts.some(r=>S.driveCache[r.id]!=null);
  if(hasDrive) best.drive = Math.min(...resorts.filter(r=>S.driveCache[r.id]!=null).map(r=>S.driveCache[r.id]));

  el.compBody.innerHTML = resorts.map(r=>{
    const drive=S.driveCache[r.id];
    const snow7=S.snow7Cache[r.id];
    const bc=(col,val,max,suf='')=>{
      const isB=(col==='price'||col==='drive')?val===best[col]:val===best[col];
      return `<td class="td-num ${isB?'best-cell':''}">${barCell(val,val,max,suf)}</td>`;
    };
    const driveCell=drive==null
      ? `<td class="td-num"><span class="shimmer">—</span></td>`
      : `<td class="td-num ${drive===best.drive?'best-cell':''}">${barCell(fmtDrive(drive),drive,best.drive||1)}</td>`;
    const snow7Cell=snow7==null
      ? `<td class="td-num" data-snow7="${r.id}"><span class="shimmer">…</span></td>`
      : `<td class="td-num ${snow7===best.snow7?'best-cell':''}" data-snow7="${r.id}">${barCell(snow7+'″',snow7,best.snow7||1)}</td>`;

    return `<tr data-id="${r.id}" class="${r.id===S.selectedId?'row-selected':''}">
      <td class="td-check"><input type="checkbox" data-cmp="${r.id}" ${S.compareSet.has(r.id)?'checked':''} aria-label="Compare ${r.name}"/></td>
      <td>
        <div class="td-name">${r.name}${S.favorites.has(r.id)?' ⭐':''}</div>
        <div class="td-season">${r.seasonOpen}–${r.seasonClose}</div>
      </td>
      <td class="td-state td-num">${r.state}</td>
      ${bc('vertical',   r.vertical,   COL_MAX.vertical,   ' ft')}
      ${bc('trails',     r.trails,     COL_MAX.trails      )}
      ${bc('lifts',      r.lifts,      COL_MAX.lifts       )}
      ${bc('acres',      r.acres,      COL_MAX.acres       )}
      ${bc('longestRun', r.longestRun, COL_MAX.longestRun, ' mi')}
      ${bc('snowfall',   r.snowfall,   COL_MAX.snowfall,   '"')}
      ${snow7Cell}
      ${bc('snowmaking', r.snowmaking, COL_MAX.snowmaking,  '%')}
      <td class="td-num ${r.price===best.price?'best-cell':''}">${barCell('$'+r.price,r.price,COL_MAX.price)}</td>
      ${driveCell}
      <td class="td-ctr">${r.night?'<span class="td-night-y" title="Night skiing">🌙</span>':'<span class="td-night-n">—</span>'}</td>
      <td class="td-ctr">${r.terrainPark?'<span class="td-park-y" title="Terrain park">🛹</span>':'<span class="td-night-n">—</span>'}</td>
    </tr>`;
  }).join('');

  [...el.compBody.querySelectorAll('tr[data-id]')].forEach(row=>{
    row.addEventListener('click',e=>{if(!e.target.closest('input')){S.selectedId=row.dataset.id;render();}});
  });
  [...el.compBody.querySelectorAll('[data-cmp]')].forEach(cb=>{
    cb.addEventListener('change',()=>{
      cb.checked?S.compareSet.add(cb.dataset.cmp):S.compareSet.delete(cb.dataset.cmp);
      renderCompareTray();
    });
  });
}

// ─── Resort detail ────────────────────────────────────────────────────────────
async function renderDetail(resort) {
  if (!resort) { el.detailSection.style.display='none'; return; }
  el.detailSection.style.display='';

  const wxP = fetchWeather(resort);
  const drive = S.driveCache[resort.id];
  const snow7 = S.snow7Cache[resort.id];
  const isFav  = S.favorites.has(resort.id);
  const isVis  = S.visited.has(resort.id);
  const isWish = S.wishlist.has(resort.id);

  const tbars = [
    ['Beginner','bg',resort.difficulty.beginner],
    ['Intermediate','im',resort.difficulty.intermediate],
    ['Advanced','av',resort.difficulty.advanced],
    ['Expert','ex',resort.difficulty.expert],
  ].map(([l,c,v])=>`
    <div class="t-row">
      <div class="t-label"><span class="dot ${c}"></span>${l}</div>
      <div class="tbar"><div class="tbar-fill ${c}" style="width:${v*100}%"></div></div>
      <div class="t-pct">${Math.round(v*100)}%</div>
    </div>`).join('');

  const mbox=(title,img,pg,btn)=>{
    const media=img
      ?`<img src="${img}" alt="${title}" onerror="this.style.display='none';this.nextSibling.style.display='grid'">`
       +`<div class="ph" style="display:none">No image — <a href="${pg||'#'}" target="_blank">open ↗</a></div>`
      :`<div class="ph">${pg?`<a href="${pg}" target="_blank">No live image — open ${btn} ↗</a>`:'No webcam data'}</div>`;
    return `<div class="media-box">${media}<div class="media-cap">${pg?`<a href="${pg}" target="_blank" rel="noreferrer">${btn} ↗</a>`:''}</div></div>`;
  };

  const qiPills=[
    resort.hasLodging && '🏨 On-mountain lodging',
    resort.hasRentals && '🎿 Rentals available',
    resort.hasLessons && '🏫 Lessons available',
    resort.phone      && `📞 ${resort.phone}`,
  ].filter(Boolean).map(t=>`<span class="qi-pill">${t}</span>`).join('');

  el.detailSection.innerHTML = `<div class="card panel detail-wrap">
    <div class="detail-topbar">
      <div>
        <div class="eyebrow">Selected Resort</div>
        <div class="detail-name">${resort.name}</div>
        <div class="detail-meta">${resort.state} · ${resort.town} · ${resort.owner} · ${resort.seasonOpen}–${resort.seasonClose}</div>
        <div class="status-row">
          <button class="status-btn ${isFav?'is-fav':''}"  id="btnFav">  ${isFav ?'★ Saved':'☆ Save'}</button>
          <button class="status-btn ${isVis?'is-visited':''}" id="btnVis">${isVis ?'✓ Visited':'+ Mark Visited'}</button>
          <button class="status-btn ${isWish?'is-wishlist':''}" id="btnWish">${isWish?'🔖 On Wishlist':'🔖 Add to Wishlist'}</button>
          <button class="share-btn" id="btnShare">🔗 Share</button>
        </div>
      </div>
      <a href="${resort.website}" target="_blank" rel="noreferrer" class="btn btn-ghost btn-sm" style="text-decoration:none">Website ↗</a>
    </div>

    <div class="quick-info">${qiPills}</div>

    <div class="detail-metrics">
      <div class="m-card hl"><div class="m-lbl">Vertical</div><div class="m-val">${resort.vertical} ft</div></div>
      <div class="m-card"><div class="m-lbl">Trails / Lifts</div><div class="m-val">${resort.trails} / ${resort.lifts}</div></div>
      <div class="m-card"><div class="m-lbl">Acres</div><div class="m-val">${resort.acres}</div><div class="m-sub">Longest: ${resort.longestRun} mi</div></div>
      <div class="m-card"><div class="m-lbl">Day Ticket</div><div class="m-val">$${resort.price}</div><div class="m-sub">${resort.pass} pass</div></div>
      <div class="m-card"><div class="m-lbl">Avg Snowfall</div><div class="m-val">${resort.snowfall}"</div><div class="m-sub">Snowmaking: ${resort.snowmaking}%</div></div>
      <div class="m-card"><div class="m-lbl">7-Day Snow</div><div class="m-val" id="d7snow">${snow7!=null?snow7+'"':'Loading…'}</div></div>
      <div class="m-card"><div class="m-lbl">Drive Time</div><div class="m-val" style="font-size:16px">${drive!=null?fmtDrive(drive):S.origin?'Calculating…':'Set location'}</div><div class="m-sub">${S.origin?.label||''}</div></div>
      <div class="m-card"><div class="m-lbl">Night / Park</div><div class="m-val">${resort.night?'🌙 Yes':'No'} / ${resort.terrainPark?'🛹 Yes':'No'}</div></div>
    </div>

    <div class="detail-mid">
      <div class="sub-card">
        <h3>Terrain Mix</h3>${tbars}
      </div>
      <div class="sub-card">
        <h3>Lifts</h3>
        ${resort.liftsBreakdown.map(([t,c])=>`<div class="lift-row"><span>${t}</span><strong class="mono">${c}</strong></div>`).join('')}
        <div class="divider"></div>
        <div class="tag-row">${(resort.tags||[]).map(t=>`<span class="tag">${t}</span>`).join('')}</div>
        <p class="footer-note" style="margin-top:10px">${resort.notes}</p>
      </div>
      <div class="sub-card" id="wxCard">
        <h3>Weather at ${resort.name}</h3>
        <p class="shimmer">Loading weather…</p>
      </div>
    </div>

    <div class="honest-take">
      <div class="honest-label">⚡ Honest Take</div>
      <p>${resort.honesttake}</p>
    </div>

    <div class="detail-bot" style="margin-top:13px">
      <div class="media-grid">
        ${mbox(resort.name+' Webcam',   resort.webcamImage,   resort.webcamPage||resort.website,   'Webcam')}
        ${mbox(resort.name+' Trail Map',resort.trailMapImage, resort.trailMapPage||resort.website, 'Trail Map')}
      </div>
      <div class="sub-card">
        <div class="m-lbl">📝 Your Notes <span style="font-weight:300;opacity:.6">(private, device only)</span></div>
        <textarea id="notesTA" class="notes-area" placeholder="Log conditions, trip notes, tips…">${S.notes[resort.id]||''}</textarea>
        <div class="notes-disclaimer">Notes are saved to this browser only and never shared.</div>
        <div id="notesSaved" class="notes-saved" style="display:none">✓ Saved</div>
      </div>
    </div>
  </div>`;

  // Wire buttons
  $('btnFav').addEventListener('click',()=>{
    S.favorites.has(resort.id)?S.favorites.delete(resort.id):S.favorites.add(resort.id);
    persist(); render(); toast(S.favorites.has(resort.id)?`⭐ ${resort.name} saved`:`Removed from favorites`);
  });
  $('btnVis').addEventListener('click',()=>{
    S.visited.has(resort.id)?S.visited.delete(resort.id):S.visited.add(resort.id);
    persist(); render();
  });
  $('btnWish').addEventListener('click',()=>{
    S.wishlist.has(resort.id)?S.wishlist.delete(resort.id):S.wishlist.add(resort.id);
    persist(); render();
  });
  $('btnShare').addEventListener('click',()=>{
    const url=`${location.origin}${location.pathname}#resort=${resort.id}`;
    navigator.clipboard?.writeText(url).then(()=>toast('🔗 Link copied!')).catch(()=>toast('URL: '+url,5000));
  });

  // Notes autosave
  let ntT; $('notesTA').addEventListener('input',e=>{
    clearTimeout(ntT);
    ntT=setTimeout(()=>{
      S.notes[resort.id]=e.target.value; persist();
      const m=$('notesSaved'); if(m){m.style.display='block';setTimeout(()=>{if(m)m.style.display='none';},1800);}
    },700);
  });

  el.detailSection.scrollIntoView({behavior:'smooth',block:'nearest'});

  // Weather async fill
  wxP.then(wx=>{
    const card=$('wxCard'); if(!card) return;
    if(!wx){card.querySelector('p').textContent='Weather unavailable.';return;}
    card.innerHTML=`<h3>Weather at ${resort.name}</h3>
      <div class="wx-current">
        <div class="wx-icon">${WX_ICONS[wx.code]||'❓'}</div>
        <div><div class="wx-temp">${wx.temp}°F</div><div class="wx-desc">${WX_DESC[wx.code]||'Unknown'}</div><div class="wx-wind">Wind: ${wx.wind} mph</div></div>
      </div>
      <div class="wx-fcst">${wx.forecast.map(f=>`
        <div class="fcst-day">
          <div class="f-day">${f.day}</div>
          <div class="f-icon">${WX_ICONS[f.code]||'❓'}</div>
          <div class="f-temp">${f.hi}°/${f.lo}°</div>
          ${f.snow>0?`<div style="font-size:10px;color:#84c8ff">❄️ ${f.snow.toFixed(1)}"</div>`:''}
        </div>`).join('')}
      </div>`;
  });

  // Fill 7-day if now available
  fetch7DaySnow(resort).then(v=>{
    if(v!=null){S.snow7Cache[resort.id]=v;const c=$('d7snow');if(c)c.textContent=v+'"';}
  });
}

// ─── Weekend Planner ──────────────────────────────────────────────────────────
async function renderPlanner() {
  const dayOffset = parseInt(el.plannerDay.value); // 1=Sat, 2=Sun
  const today = new Date();
  const day = today.getDay(); // 0=Sun
  const daysUntil = day===6 ? dayOffset : (6-day+dayOffset)%7 || 7;
  const targetDate = new Date(today);
  targetDate.setDate(today.getDate() + daysUntil);
  const targetStr = targetDate.toLocaleDateString('en-US',{weekday:'long',month:'short',day:'numeric'});

  el.plannerGrid.innerHTML = `<p class="empty-hint" style="grid-column:1/-1">⏳ Loading weekend forecasts for ${targetStr}…</p>`;

  // Score each resort: snowfall + nice weather + drive penalty
  const scores = await Promise.all(RESORTS.map(async r=>{
    const wx = await fetchWeather(r);
    const snow7 = await fetch7DaySnow(r);
    const forecast = wx?.forecast?.[dayOffset-1];
    const fcTemp = forecast?.hi ?? 32;
    const fcSnow = forecast?.snow ?? 0;
    const fcCode = forecast?.code ?? 3;
    const drive  = S.driveCache[r.id] ?? null;

    // Score out of 100
    let sc = 0;
    sc += Math.min(30, (snow7||0)*3);          // recent snow weight
    sc += Math.min(20, fcSnow*10);              // forecast snow
    sc += (fcTemp >= 20 && fcTemp <= 36) ? 20 : fcTemp > 36 ? Math.max(0,20-(fcTemp-36)*2) : 10;
    sc += [0,1,2,71,73,75,77,85,86].includes(fcCode) ? 15 : 5;  // good wx code
    sc += (r.snowmaking >= 90) ? 10 : 5;
    if (drive != null) sc -= Math.min(15, drive/60);  // drive penalty

    return {r, sc, wx, snow7, forecast, drive};
  }));

  scores.sort((a,b)=>b.sc-a.sc);
  const top = scores.slice(0,8);

  el.plannerGrid.innerHTML = top.map((item,i)=>{
    const {r,sc,forecast,snow7,drive} = item;
    const f = forecast;
    return `<div class="plan-card ${i===0?'top-pick':''}" data-id="${r.id}">
      <div class="plan-name">${r.name}</div>
      <div class="plan-meta">${r.state} · $${r.price} · ${r.pass} pass</div>
      <div class="plan-stats">
        <div class="plan-stat">
          <span class="plan-stat-val">${f?`${WX_ICONS[f.code]||'❓'} ${f.hi}°`:'—'}</span>
          <span class="plan-stat-lbl">${targetDate.toLocaleDateString('en-US',{weekday:'short'})}</span>
        </div>
        <div class="plan-stat">
          <span class="plan-stat-val">${snow7!=null?snow7+'"':'—'}</span>
          <span class="plan-stat-lbl">7-day snow</span>
        </div>
        <div class="plan-stat">
          <span class="plan-stat-val">${drive!=null?fmtDrive(drive):'—'}</span>
          <span class="plan-stat-lbl">drive</span>
        </div>
      </div>
      <div class="plan-bar"><div class="plan-bar-fill" style="width:${sc}%"></div></div>
    </div>`;
  }).join('');

  [...el.plannerGrid.querySelectorAll('.plan-card')].forEach(c=>{
    c.addEventListener('click',()=>{S.selectedId=c.dataset.id;render();
      document.querySelector('.layout').scrollIntoView({behavior:'smooth',block:'start'});
    });
  });
}

// ─── Compare tray ─────────────────────────────────────────────────────────────
function renderCompareTray() {
  if(!S.compareSet.size){el.compareTray.style.display='none';return;}
  el.compareTray.style.display='';
  el.comparePills.innerHTML=[...S.compareSet].map(id=>{
    const r=RESORTS.find(x=>x.id===id);
    return `<span class="tray-pill">${r?.name||id}<button data-rm="${id}">✕</button></span>`;
  }).join('');
  [...el.comparePills.querySelectorAll('[data-rm]')].forEach(btn=>{
    btn.addEventListener('click',()=>{S.compareSet.delete(btn.dataset.rm);renderCompareTray();render();});
  });
}

function renderSBS() {
  const resorts=[...S.compareSet].map(id=>RESORTS.find(r=>r.id===id)).filter(Boolean);
  if(resorts.length<2){toast('Select at least 2 resorts to compare');return;}
  el.sbsPanel.style.display='';
  el.sbsPanel.scrollIntoView({behavior:'smooth',block:'start'});
  const ROWS=[
    ['State',          r=>r.state,          null],
    ['Town',           r=>r.town,           null],
    ['Vertical',       r=>`${r.vertical}ft`,  'vertical'],
    ['Trails',         r=>r.trails,          'trails'],
    ['Lifts',          r=>r.lifts,           'lifts'],
    ['Acres',          r=>r.acres,           'acres'],
    ['Longest Run',    r=>`${r.longestRun}mi`,'longestRun'],
    ['Avg Snowfall',   r=>`${r.snowfall}"`,   'snowfall'],
    ['7-Day Snow',     r=>{const v=S.snow7Cache[r.id];return v!=null?v+'"':'—';},null,(a,b)=>(S.snow7Cache[a.id]||0)-(S.snow7Cache[b.id]||0)],
    ['Snowmaking',     r=>`${r.snowmaking}%`, 'snowmaking'],
    ['Day Ticket',     r=>`$${r.price}`,      null,(a,b)=>a.price-b.price],
    ['Drive',          r=>{const d=S.driveCache[r.id];return d!=null?fmtDrive(d):'—';},null,(a,b)=>(S.driveCache[a.id]??999)-(S.driveCache[b.id]??999)],
    ['Night Skiing',   r=>r.night?'🌙 Yes':'No', null],
    ['Terrain Park',   r=>r.terrainPark?'🛹 Yes':'No',null],
    ['Season',         r=>`${r.seasonOpen}–${r.seasonClose}`,null],
    ['On-Site Lodging',r=>r.hasLodging?'Yes':'No',null],
    ['Rentals',        r=>r.hasRentals?'Yes':'No',null],
    ['Pass',           r=>r.pass,           null],
  ];
  el.sbsContent.innerHTML=`<table class="sbs-table">
    <thead><tr>
      <th>Stat</th>
      ${resorts.map(r=>`<th style="color:var(--text)">${r.name}</th>`).join('')}
    </tr></thead>
    <tbody>${ROWS.map(([lbl,fn,numKey,sortFn])=>{
      let bestIdx=-1;
      if(numKey){const vals=resorts.map(r=>r[numKey]);bestIdx=vals.indexOf(Math.max(...vals));}
      else if(sortFn){const sorted=[...resorts].sort(sortFn);bestIdx=resorts.indexOf(sorted[0]);}
      return `<tr>
        <td style="color:var(--muted);font-family:'DM Mono',monospace;font-size:11px;text-transform:uppercase;letter-spacing:.05em">${lbl}</td>
        ${resorts.map((r,i)=>`<td class="${i===bestIdx?'best':''}">${fn(r)}</td>`).join('')}
      </tr>`;
    }).join('')}</tbody>
  </table>`;
}

// ─── Pass Calculator ──────────────────────────────────────────────────────────
function renderPassCalc(resorts) {
  const days = S.skiDays;
  el.calcGrid.innerHTML = resorts.map(r=>{
    const total = r.price * days;
    const indySave  = r.indyDays>0 ? total - INDY_PRICE : null;
    const daysDiff  = r.indyDays>0 ? Math.ceil(INDY_PRICE/r.price) : null;
    const breakeven = daysDiff != null;
    let verdict='', vClass='';
    if(r.indyDays>0){
      if(days>=daysDiff){verdict=`Save $${indySave} with Indy Pass`;vClass='v-save';}
      else if(days===daysDiff-1){verdict=`One more day = breakeven`;vClass='v-even';}
      else{verdict=`Buy day tickets (${daysDiff-days} more days needed)`;vClass='v-pay';}
    } else {
      verdict='No discounted pass available'; vClass='v-even';
    }
    return `<div class="calc-card ${breakeven&&days>=daysDiff?'breakeven':''}">
      <div class="cc-name">${r.name}</div>
      <div class="cc-row"><span>Day ticket</span><strong>$${r.price}</strong></div>
      <div class="cc-row"><span>${days} days × $${r.price}</span><strong>$${total}</strong></div>
      ${r.indyDays>0?`<div class="cc-row"><span>Indy Pass (${r.indyDays} days)</span><strong>~$349</strong></div>`:''}
      ${daysDiff?`<div class="cc-row"><span>Breakeven at</span><strong>${daysDiff} days</strong></div>`:''}
      <span class="verdict ${vClass}">${verdict}</span>
    </div>`;
  }).join('');
}

// ─── Leaflet map ──────────────────────────────────────────────────────────────
let lmap=null, lmarkers={};
function initMap() {
  if(lmap) return;
  lmap = L.map('leafletMap',{zoomControl:true,scrollWheelZoom:true}).setView([43.6,-71.8],7);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{attribution:'© <a href="https://openstreetmap.org/copyright">OpenStreetMap</a>',maxZoom:18}).addTo(lmap);
}
function updateMap(resorts) {
  if(!lmap) initMap();
  const filtIds=new Set(resorts.map(r=>r.id));
  RESORTS.forEach(base=>{
    const inF=filtIds.has(base.id), isSel=base.id===S.selectedId;
    const color=isSel?'#35cfa0':inF?'#4f91f5':'#2d4a6e';
    const sz=isSel?14:inF?10:8;
    const op=inF?1:.3;
    const icon=L.divIcon({className:'',html:`<div style="width:${sz}px;height:${sz}px;border-radius:50%;background:${color};border:2px solid rgba(7,16,29,.8);box-shadow:${isSel?'0 0 0 4px rgba(53,207,160,.25)':'0 2px 6px rgba(0,0,0,.4)'};opacity:${op};transition:all .2s"></div>`,iconSize:[sz,sz],iconAnchor:[sz/2,sz/2]});
    if(lmarkers[base.id]){lmarkers[base.id].setIcon(icon);return;}
    const r=RESORTS.find(x=>x.id===base.id);
    const m=L.marker([base.lat,base.lon],{icon}).addTo(lmap).bindPopup(`
      <div class="pop-name">${r.name}</div>
      <div class="pop-meta">${r.state} · ${r.town} · ${r.pass} pass</div>
      <div class="pop-stats">
        <span>Vertical</span><span>${r.vertical} ft</span>
        <span>Ticket</span><span>$${r.price}</span>
        <span>Trails</span><span>${r.trails}</span>
        <span>Night</span><span>${r.night?'🌙 Yes':'No'}</span>
      </div>
      <button class="pop-btn" onclick="selectFromMap('${r.id}')">View Details</button>
    `,{maxWidth:230});
    m.on('click',()=>{S.selectedId=r.id;render();});
    lmarkers[base.id]=m;
  });
}
window.selectFromMap=function(id){
  S.selectedId=id; render();
  document.querySelector('.layout')?.scrollIntoView({behavior:'smooth',block:'start'});
};

// ─── Mobile tabs ──────────────────────────────────────────────────────────────
function applyMobileTab(tab) {
  if(window.innerWidth>768) return;
  // Show/hide top-level sections based on tab
  const sections={
    dashboard: ['[data-section=dashboard]','.layout[data-section=dashboard]'],
    weekend:   ['#weekendSection'],
    map:       ['#mapSection'],
    compare:   ['#compareSection','#detailSection','#sideBySidePanel','#passCalcSection'],
  };
  // Hide all managed sections
  document.querySelectorAll('[data-section]').forEach(el=>el.style.display='none');
  document.querySelectorAll('#weekendSection,#mapSection,#compareSection,#detailSection,#sideBySidePanel,#passCalcSection').forEach(e=>e.style.display='none');

  if(tab==='dashboard'){
    document.querySelectorAll('[data-section=dashboard]').forEach(e=>e.style.display='');
    document.querySelector('.layout')?.style.setProperty('display','grid');
  } else if(tab==='weekend'){
    $('weekendSection').style.display='';
  } else if(tab==='map'){
    $('mapSection').style.display='';
    setTimeout(()=>{if(lmap)lmap.invalidateSize();else initMap();},100);
  } else if(tab==='compare'){
    $('compareSection').style.display='';
    if(S.selectedId) $('detailSection').style.display='';
    if(el.sbsPanel.style.display!=='none') el.sbsPanel.style.display='';
    $('passCalcSection').style.display='';
  }
  S.activeTab=tab;
}
function wireMobileNav(){
  document.querySelectorAll('.mnav-btn').forEach(btn=>{
    btn.addEventListener('click',()=>{
      document.querySelectorAll('.mnav-btn').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      applyMobileTab(btn.dataset.section);
    });
  });
}

// ─── URL hash for sharing ─────────────────────────────────────────────────────
function readHash() {
  const hash=location.hash.slice(1);
  const params=Object.fromEntries(hash.split('&').map(p=>p.split('=')));
  if(params.resort){
    const r=RESORTS.find(x=>x.id===params.resort);
    if(r){S.selectedId=r.id;toast(`🔗 Loaded: ${r.name}`);}
  }
}

// ─── Sort headers ─────────────────────────────────────────────────────────────
function wireSortHeaders(){
  [...el.compTable.querySelectorAll('th.sortable')].forEach(th=>{
    th.addEventListener('click',()=>{
      const col=th.dataset.col;
      S.sortDir=(S.sortCol===col&&S.sortDir==='desc')?'asc':'desc';
      if(S.sortCol!==col){S.sortCol=col;S.sortDir=(col==='name'||col==='state')?'asc':'desc';}
      el.sortBy.value=col;
      render();
    });
  });
}

// ─── Main render ──────────────────────────────────────────────────────────────
function render() {
  const resorts=filteredResorts();
  renderSummary(resorts);
  renderFilters();
  renderList(resorts);
  renderTable(resorts);
  updateMap(resorts);
  const sel=RESORTS.find(r=>r.id===S.selectedId)||null;
  renderDetail(sel);
  renderCompareTray();
  renderPassCalc(resorts);
  if(window.innerWidth<=768) applyMobileTab(S.activeTab);
}

// ─── Wire events ──────────────────────────────────────────────────────────────
function wire(){
  el.searchInput.addEventListener('input',e=>{S.search=e.target.value;render();});
  el.stateFilter.addEventListener('change',e=>{S.stateFilter=e.target.value;render();});
  el.passFilter .addEventListener('change',e=>{S.pass=e.target.value;render();});
  el.sortBy     .addEventListener('change',e=>{S.sortCol=e.target.value;S.sortDir='desc';render();});
  el.toggleNight.addEventListener('click',()=>{
    S.nightOnly=!S.nightOnly;
    el.toggleNight.setAttribute('aria-pressed',S.nightOnly?'true':'false');
    render();
  });
  el.randomResort.addEventListener('click',()=>{
    const rs=filteredResorts();if(!rs.length)return;
    const p=rs[Math.floor(Math.random()*rs.length)];
    S.selectedId=p.id;render();toast(`✦ ${p.name}`);
  });
  el.compareBtn  .addEventListener('click',renderSBS);
  el.clearCompare.addEventListener('click',()=>{S.compareSet.clear();renderCompareTray();el.sbsPanel.style.display='none';render();});
  el.closeCompare.addEventListener('click',()=>{el.sbsPanel.style.display='none';});
  el.plannerDay  .addEventListener('change',renderPlanner);
  el.skiDays     .addEventListener('input',()=>{S.skiDays=parseInt(el.skiDays.value)||5;renderPassCalc(filteredResorts());});

  // Quick filters
  document.querySelectorAll('.qf-btn[data-qf]').forEach(btn=>{
    btn.addEventListener('click',()=>{
      const qf=btn.dataset.qf;
      if(S.qf===qf){clearQF();}
      else{S.qf=qf;document.querySelectorAll('.qf-btn[data-qf]').forEach(b=>b.classList.remove('active'));btn.classList.add('active');el.clearQF.style.display='';}
      render();
    });
  });
  el.clearQF.addEventListener('click',()=>{clearQF();render();});

  // Sidebar toggle
  el.sidebarToggle.addEventListener('click',()=>{
    const list=el.resortList;
    const collapsed=list.classList.toggle('collapsed');
    el.sidebarToggle.setAttribute('aria-expanded',String(!collapsed));
    el.sidebarToggle.textContent=collapsed?'▼':'▲';
  });

  // Location input
  let locT;
  el.originInput.addEventListener('input',()=>{
    clearTimeout(locT);
    locT=setTimeout(async()=>{
      const q=el.originInput.value.trim();
      if(!q){S.origin=null;S.driveCache={};el.locStatus.textContent='';render();return;}
      el.locStatus.textContent='🔍 Finding location…';
      const loc=await geocode(q);
      if(loc){
        S.origin=loc;S.driveCache={};
        el.locStatus.textContent=`📍 Set to ${loc.label}`;
        persist();
        await loadAllDrives();
      } else {
        el.locStatus.textContent='⚠️ Location not found';
      }
    },900);
  });
  el.detectLoc.addEventListener('click',()=>{
    if(!navigator.geolocation){toast('Geolocation not supported');return;}
    el.locStatus.textContent='📍 Detecting…';
    navigator.geolocation.getCurrentPosition(async pos=>{
      S.origin={lat:pos.coords.latitude,lon:pos.coords.longitude,label:'Your location'};
      el.originInput.value='Your location';
      el.locStatus.textContent='📍 Location set';
      S.driveCache={};persist();
      await loadAllDrives();
    },()=>{el.locStatus.textContent='⚠️ Could not get location';});
  });

  wireSortHeaders();
  wireMobileNav();
}

// ─── Init ─────────────────────────────────────────────────────────────────────
function init(){
  el.stateFilter.innerHTML=uniqueStates().map(s=>`<option value="${s}">${s}</option>`).join('');
  el.passFilter .innerHTML=uniquePasses().map(p=>`<option value="${p}">${p}</option>`).join('');
  // Restore saved location
  if(S.origin){
    el.originInput.value=S.origin.label||'';
    el.locStatus.textContent=`📍 ${S.origin.label}`;
  }
  readHash();
  wire();
  render();
  // Init map after paint, load snow data in background
  setTimeout(()=>{initMap();loadAllSnow();},150);
  // Weekend planner — load after snow data starts
  setTimeout(()=>renderPlanner(),500);
}

init();
