// smoke_test.js — loads the patched modules with stub globals and verifies behavior.
const fs = require('fs');
const assert = require('assert');

// ── stub globals sd-scoring.js reads at call time ──────────────────
global.state = {
  weights: { snow: 10, crowd: 1, value: 0, drive: 0 },
  weatherCache: {}, origin: null, targetDate: null, howFar: 0,
  verticalFilter: 'any', localIntent: false, skiDayPreset: null,
};
global.W = { SCORING: { VERTICAL_CEILING: 3500, ACRES_CEILING: 4500, LONGEST_RUN_CEILING: 5.0,
  SNOW_SCALE: 8, SNOW_AVG_MAX: 669, SNOW_FORECAST_WEIGHT: 0.95, SNOW_RELIABILITY_WEIGHT: 0.05,
  DRIVE_SCALE: 300, DRIVE_DEFAULT: 0.5, PRICE_MAX: 329, PRICE_MIN: 40, CROWD_SCALE: 85 } };
global.historyCache = new Map();
global.getDriveMins = () => null;
global.formatDrive = () => '';

// ── load modules in production order ───────────────────────────────
const ROLE = require('./recommendation-roles.js');            // sets globalThis.WTSN_ROLE
eval(fs.readFileSync('./lift_capacity_tiers_final.js', 'utf8') + '\n; global.LIFT_CAPACITY_TIERS = LIFT_CAPACITY_TIERS;');
eval(fs.readFileSync('./metro_gravity_final.js', 'utf8') + '\n; global.METRO_GRAVITY = METRO_GRAVITY;');
eval(fs.readFileSync('./sd-scoring.js', 'utf8') + '\n; global.TOP_PICK_CLOSE_CALL_BAND = TOP_PICK_CLOSE_CALL_BAND;');
const CDS = require('./compare-decision-summary.js');
const CSE = require('./compare-score-explain.js');
const { RESORTS } = require('./resorts.js');

let pass = 0;
function ok(cond, msg) { assert(cond, msg); pass++; console.log('  PASS', msg); }

console.log('1. Table coverage');
const mgMissing = RESORTS.filter(r => !(r.id in METRO_GRAVITY));
const ltMissing = RESORTS.filter(r => !(r.id in LIFT_CAPACITY_TIERS));
ok(RESORTS.length === 300, '300 resorts in database');
ok(mgMissing.length === 0, 'METRO_GRAVITY covers all 300 (was missing 52)');
ok(ltMissing.length === 0, 'LIFT_CAPACITY_TIERS covers all 300 (was missing 52)');
ok(!('indianhead-mountain' in METRO_GRAVITY) && !('blackjack-ski-resort' in METRO_GRAVITY), 'orphaned IDs removed from gravity');
ok(!('indianhead-mountain' in LIFT_CAPACITY_TIERS) && !('blackjack-ski-resort' in LIFT_CAPACITY_TIERS), 'orphaned IDs removed from tiers');
const mgVals = Object.values(METRO_GRAVITY);
ok(mgVals.every(v => Number.isFinite(v) && v >= 1 && v <= 1000), 'all gravity values in 1..1000');
ok(Object.values(LIFT_CAPACITY_TIERS).every(v => v >= 1 && v <= 5), 'all tiers in 1..5');

console.log('2. Holiday calendar');
// Jan 16 2027 is the Saturday of MLK weekend (MLK = Mon Jan 18 2027)
ok(_holidayFactor(new Date(2027, 0, 16)) === 0.7, 'MLK Saturday now gets holiday factor (was 0)');
ok(_holidayFactor(new Date(2027, 0, 18)) === 0.7, 'MLK Monday still 0.7');
ok(_holidayFactor(new Date(2027, 0, 2)) === 1.0, 'Jan 2 (school break) now 1.0 (was 0)');
ok(_holidayFactor(new Date(2027, 0, 4)) === 1.0, 'Jan 4 now 1.0');
ok(_holidayFactor(new Date(2027, 0, 5)) === 0, 'Jan 5 back to normal');
ok(_holidayFactor(new Date(2026, 11, 26)) === 1.0, 'Christmas week unchanged');

console.log('3. Snow-target ramp (target=6", snow pref=10)');
const fakeResort = { id: 'x', avgSnowfall: 200, vertical: 2000, acres: 600, longestRun: 2 };
function liveOnly(snow) { return snowQualityIndex(fakeResort, snow, null, null); }
const s59 = liveOnly(5.9), s60 = liveOnly(6.0), s30 = liveOnly(3.0);
ok(s60 - s59 < 0.05, `5.9" vs 6.0" gap now ${(s60-s59).toFixed(3)} (was ~0.47 of live component)`);
ok(s59 > s30 + 0.2, '5.9" scores well above 3.0" (ramp is monotonic)');
ok(liveOnly(4.0) < liveOnly(5.0) && liveOnly(5.0) < liveOnly(5.9), 'ramp increases through the band');

console.log('4. tempScoreIndex cold softening');
ok(tempScoreIndex(-2) === 0.50, '-2F scores 0.50 (was 0.20)');
ok(tempScoreIndex(-15) === 0.25, '-15F deep-cold penalty 0.25');
ok(tempScoreIndex(-2) < tempScoreIndex(40) + 0.16 && tempScoreIndex(-2) >= 0.45, 'cold-smoke no longer worse than warm thaw by 3x');
ok(tempScoreIndex(20) === 1.0 && tempScoreIndex(40) === 0.65, 'ideal/warm bands unchanged');

console.log('5. normalizedWeights drive preference + share sums');
function sumW(w) { return w.snow + w.skiability + w.fit + w.drive + w.value + w.crowd; }
state.weights = { snow: 1, crowd: 1, value: 0, drive: 0 };
const w0 = normalizedWeights();
state.weights = { snow: 1, crowd: 1, value: 0, drive: 10 };
const w10 = normalizedWeights();
ok(Math.abs(sumW(w0) - 1) < 1e-9, 'weights sum to 1 (drive pref 0): ' + sumW(w0).toFixed(4));
ok(Math.abs(sumW(w10) - 1) < 1e-9, 'weights sum to 1 (drive pref 10): ' + sumW(w10).toFixed(4));
ok(w10.drive > w0.drive * 1.5, `drive pref 10 raises drive weight ${w0.drive.toFixed(3)} -> ${w10.drive.toFixed(3)}`);
ok(w10.snow === w0.snow && w10.crowd === w0.crowd, 'snow/crowd weights untouched by drive boost');

console.log('6. Shared close-call band');
ok(WTSN_ROLE.SCORE_BANDS.TOP_PICK_CLOSE_CALL === 12, 'canonical band = 12');
ok(TOP_PICK_CLOSE_CALL_BAND === 12, 'sd-scoring reads shared band');
ok(CDS.CLOSE_CALL_GAP === 12, 'compare page reads shared band (was 5)');
ok(CDS.isCloseCall({score: 70}, {score: 60}), 'gap of 10 is now a close call on compare');
ok(!CDS.isCloseCall({score: 70}, {score: 57}), 'gap of 13 is not');

console.log('7. Shared helpers');
ok(WTSN_ROLE.parseDriveMins('2h 15m') === 135 && WTSN_ROLE.parseDriveMins('45m') === 45, 'canonical parseDriveMins');
ok(CDS.parseDriveMins('1h 5m') === 65, 'compare-decision-summary delegates');
ok(CSE.parseDriveMins('90m') === 90, 'compare-score-explain delegates');
ok(WTSN_ROLE.snowPrefTarget(15) === 12 && WTSN_ROLE.snowPrefTarget(10) === 6 && WTSN_ROLE.snowPrefTarget(5) === 3 && WTSN_ROLE.snowPrefTarget(1) === 0, 'canonical snowPrefTarget mapping');
state.weights = { snow: 10, crowd: 1, value: 0, drive: 0 };
ok(snowPreferenceTarget() === 6, 'sd-scoring snowPreferenceTarget delegates');
ok(CSE.snowPrefTarget(10) === 6, 'compare explainer delegates');

console.log('8. Export merge (no clobber)');
// Both compare modules export into WTSN_COMPARE_EXPLAIN; both APIs must survive.
ok(typeof CDS.buildDecisionSummaryBundle === 'function' && typeof CSE.buildCompareScoreExplanation === 'function', 'both compare APIs intact');
ok(globalThis.WTSN_COMPARE_EXPLAIN.buildDecisionSummaryBundle && globalThis.WTSN_COMPARE_EXPLAIN.buildCompareScoreExplanation, 'merged namespace holds both modules');

console.log('9. Crowd model spot checks with backfilled tables');
state.targetDate = new Date(2027, 0, 16); // MLK Saturday
// Like-for-like pair: both tier 1 after backfill, but Mt. Baldy sits on the LA
// metro (gravity 520) while Soldier Mountain is remote Idaho (170). Before the
// backfill both defaulted to gravity 500 / tier 3 and scored identically.
const baldy   = RESORTS.find(r => r.id === 'mount-baldy-ski-lifts');
const soldier = RESORTS.find(r => r.id === 'soldier-mountain');
const cfBA = crowdForecast(baldy, null);
const cfSO = crowdForecast(soldier, null);
ok(cfBA.score > cfSO.score + 8, `Mt. Baldy (${cfBA.score} ${cfBA.label}) > Soldier Mtn (${cfSO.score} ${cfSO.label}) on MLK Saturday`);
const wilmot   = RESORTS.find(r => r.id === 'wilmot-mountain');
const christie = RESORTS.find(r => r.id === 'christie-mountain');
const cfW = crowdForecast(wilmot, null), cfC = crowdForecast(christie, null);
ok(cfW.score > cfC.score + 8, `Wilmot/Chicago (${cfW.score} ${cfW.label}) > rural Christie Mtn (${cfC.score} ${cfC.label})`);
const killington = RESORTS.find(r => r.id === 'killington-resort');
const cfK = crowdForecast(killington, null);
ok(cfK.label === 'Busy' || cfK.label === 'Avoid', `Killington MLK Saturday: ${cfK.score} ${cfK.label} (calibration anchor holds)`);

console.log('10. Verdict rain-line null guard');
state.targetDate = null; // reset so targetForecastIndex() reads forecast[0]
const vd = verdictFromBreakdown({ id: 'x', name: 'X', baseElevation: null },
  { forecast: [{ snow: 0, lo: 40, hi: 45, wind: 15, code: 61 }] },
  {});
ok(vd.tier === 'bad' && !vd.detail.includes('undefined') && !vd.detail.includes('NaN'), 'rain verdict survives null baseElevation: "' + vd.detail + '"');

console.log('11. Data fixes landed');
const cat = RESORTS.find(r => r.id === 'catamount-ski-ride-area');
const bsc = RESORTS.find(r => r.id === 'buffalo-ski-club-ski-area');
const slv = RESORTS.find(r => r.id === 'silver-mountain-resort');
ok(Math.abs(cat.lat - 42.17) < 0.05, 'Catamount relocated to MA/NY line');
ok(bsc.summitElevation - bsc.baseElevation === bsc.vertical, 'Buffalo Ski Club elevations now match its vertical');
ok(slv.summitElevation - slv.baseElevation === slv.vertical, 'Silver Mountain base = skiable base');

console.log('\n' + pass + ' checks passed.');
