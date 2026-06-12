// validate-crowd-model.js — loads the REAL edited files and checks behavior.
// Run: node validate-crowd-model.js
const fs = require('fs');
const vm = require('vm');

// Minimal browser-ish sandbox with the globals sd-scoring.js expects
const sandbox = {
  console, Math, Date, Map, Set, JSON, Number, String, Array, Object, Infinity, NaN,
  module: { exports: {} },
  state: {
    targetDate: null,
    skiDayPreset: null,
    origin: null,
    howFar: 0,
    weights: { snow: 1, crowd: 1, value: 0, drive: 0 },
    verticalFilter: 'any',
    localIntent: false,
    weatherCache: {},
  },
  historyCache: new Map(),
  W: { SCORING: { VERTICAL_CEILING: 3500, ACRES_CEILING: 4500, LONGEST_RUN_CEILING: 5.0, SNOW_SCALE: 8, SNOW_AVG_MAX: 669, DRIVE_DEFAULT: 0.5, PRICE_MAX: 329, PRICE_MIN: 40 } },
  getDriveMins: () => null,
  formatDrive: () => '',
  isDriveEstimated: () => false,
};
sandbox.globalThis = sandbox;
vm.createContext(sandbox);

function load(file) {
  vm.runInContext(fs.readFileSync(file, 'utf8'), sandbox, { filename: file });
}
load('resorts.js');
load('lift_capacity_tiers_final.js');
load('metro_gravity_final.js');
load('crowd-structural.js');
load('sd-scoring.js');

const RESORTS = vm.runInContext('RESORTS', sandbox); // const in vm = lexical, not a sandbox prop
const byId = Object.fromEntries(RESORTS.map(r => [r.id, r]));
let failures = 0;
function check(name, cond, detail = '') {
  const ok = !!cond;
  if (!ok) failures++;
  console.log(`${ok ? '  PASS' : '  FAIL'}  ${name}${detail ? ' — ' + detail : ''}`);
}

// ════════ 1. HOLIDAY CALENDAR ════════
console.log('\n═══ 1. Holiday calendar (floating dates + spring break) ═══');
const hf = d => vm.runInContext(`_holidayFactor(new Date('${d}T12:00:00'))`, sandbox);

// MLK: 2026-01-19 (Mon), 2027-01-18 (Mon)
check('MLK Monday 2026 (Jan 19) = 0.7', hf('2026-01-19') === 0.7, `got ${hf('2026-01-19')}`);
check('MLK Saturday 2026 (Jan 17) = 0.7', hf('2026-01-17') === 0.7);
check('MLK Monday 2027 (Jan 18) = 0.7', hf('2027-01-18') === 0.7);
check('Plain Jan Saturday 2026 (Jan 10) = 0', hf('2026-01-10') === 0);
check('Jan 21 2026 (Wed after MLK) = 0', hf('2026-01-21') === 0, 'old fixed band wrongly hit Jan 13-21');

// Presidents: 2026-02-16, 2027-02-15, 2028-02-21 (3rd Mondays)
check('Presidents Sat-before 2026 (Feb 14) = 1.0', hf('2026-02-14') === 1.0);
check('Presidents vacation Sun-after 2026 (Feb 22) = 1.0', hf('2026-02-22') === 1.0);
check('Presidents week 2028 (Feb 21 Mon) = 1.0', hf('2028-02-21') === 1.0);
check('Feb 26 2028 (Sat after late-Pres week) = 1.0', hf('2028-02-26') === 1.0, 'old Feb 15-23 band MISSED this real vacation Saturday');
check('Feb 7 2026 (pre-break Sat) = 0', hf('2026-02-07') === 0);

// Spring break (NEW)
check('Mid-March Saturday 2026 (Mar 14) = 0.4', hf('2026-03-14') === 0.4, 'was 0 — March was invisible');
check('Mid-March Wednesday 2026 (Mar 11) = 0.4', hf('2026-03-11') === 0.4);
check('Late March 2026 (Mar 29) = 0', hf('2026-03-29') === 0);

// Thanksgiving: 2026-11-26 (4th Thu)
check('Thanksgiving Wed 2026 (Nov 25) = 0.7', hf('2026-11-25') === 0.7);
check('Thanksgiving Sun 2026 (Nov 29) = 0.7', hf('2026-11-29') === 0.7);
check('Nov 22 2026 (Sun before TG week) = 0', hf('2026-11-22') === 0, 'old band wrongly hit Nov 22-30 every year');
check('Christmas week (Dec 26) = 1.0', hf('2026-12-26') === 1.0);

// ════════ 2. METRO_GRAVITY RE-ANCHORING ════════
console.log('\n═══ 2. Crowd scores: re-anchored mountain-region tail ═══');
function crowd(id, dateStr, wx = null, preset = null) {
  sandbox.state.targetDate = new Date(dateStr + 'T12:00:00');
  sandbox.state.skiDayPreset = preset;
  vm.runInContext('resetCrowdForecastMemo()', sandbox);
  sandbox.__r = byId[id]; sandbox.__wx = wx;
  return vm.runInContext('crowdForecast(__r, __wx)', sandbox);
}
// Plain Saturday in Feb (non-holiday): 2026-02-07
const SAT = '2026-02-07';
const pd = { snow: 10, wind: 5, lo: 18, hi: 28, code: 73 };
const powderWx = { forecast: [pd, pd, pd] };
const cd = { snow: 0, wind: 5, lo: 20, hi: 30, code: 1 };
const clearWx  = { forecast: [cd, cd, cd] };

const bridgerSat       = crowd('bridger-bowl', SAT, clearWx);
const bridgerPowderSat = crowd('bridger-bowl', SAT, powderWx);
console.log(`  Bridger Bowl  ·  plain Sat: ${bridgerSat.score} ${bridgerSat.label}  ·  10" powder Sat: ${bridgerPowderSat.score} ${bridgerPowderSat.label}`);
check('Bridger plain Saturday is no longer Quiet', bridgerSat.label !== 'Quiet', `score ${bridgerSat.score}`);
check('Bridger powder Saturday >= 60 (high-Moderate or Busy)', bridgerPowderSat.score >= 60, `score ${bridgerPowderSat.score}`);

const redLodgeSat = crowd('red-lodge-mountain', SAT, clearWx);
console.log(`  Red Lodge     ·  plain Sat: ${redLodgeSat.score} ${redLodgeSat.label}`);
check('Red Lodge Saturday is no longer floor-pinned', redLodgeSat.score > 30, `score ${redLodgeSat.score}`);

const apacheHoliday = crowd('ski-apache', '2026-12-26', clearWx); // Christmas-week Saturday
console.log(`  Ski Apache    ·  Christmas-week Sat: ${apacheHoliday.score} ${apacheHoliday.label}`);
check('Ski Apache Christmas-week Saturday reads Busy-adjacent (>=58)', apacheHoliday.score >= 58, `score ${apacheHoliday.score}`);

// ════════ 3. CALIBRATION ANCHORS UNCHANGED ════════
console.log('\n═══ 3. Regression: original calibration anchors (untouched resorts) ═══');
const bb = { snow: 0, wind: 8, lo: 22, hi: 31, code: 0 };
const bluebirdWx = { forecast: [bb, bb, bb] };
const kSat = crowd('killington-resort', SAT, bluebirdWx);
const lSat = crowd('loon-mountain', SAT, bluebirdWx);
const bSat = crowd('bousquet-ski-area', SAT, bluebirdWx);
console.log(`  Killington Sat bluebird: ${kSat.score} ${kSat.label} (anchor ~75 BUSY)`);
console.log(`  Loon Sat bluebird:       ${lSat.score} ${lSat.label} (anchor ~70 BUSY)`);
console.log(`  Bousquet Sat bluebird:   ${bSat.score} ${bSat.label} (anchor ~51 MODERATE)`);
check('Killington anchor holds (Busy band, 70-82)', kSat.score >= 70 && kSat.score <= 82);
check('Loon anchor holds (Busy band, 65-76)', lSat.score >= 65 && lSat.score <= 76);
check('Bousquet anchor holds (Moderate band, 45-58)', bSat.score >= 45 && bSat.score <= 58);

// Holiday-powder anchor: Killington holiday Saturday powder → AVOID (~83)
const kHolidayPow = crowd('killington-resort', '2026-12-26', powderWx);
console.log(`  Killington holiday-Sat powder: ${kHolidayPow.score} ${kHolidayPow.label} (anchor ~83 AVOID)`);
check('Killington holiday powder anchor holds (Avoid, >=80)', kHolidayPow.score >= 80);

// ════════ 4. SPRING BREAK BEHAVIOR ════════
console.log('\n═══ 4. Spring break: March Saturday sits between plain Sat and holiday Sat ═══');
const vailPlainSat  = crowd('vail', '2026-02-07', bluebirdWx);
const vailMarchSat  = crowd('vail', '2026-03-14', bluebirdWx);
const vailXmasSat   = crowd('vail', '2026-12-26', bluebirdWx);
const vailMarchWed  = crowd('vail', '2026-03-11', bluebirdWx);
const vailPlainWed  = crowd('vail', '2026-02-11', bluebirdWx);
console.log(`  Vail plain Sat: ${vailPlainSat.score} · March Sat: ${vailMarchSat.score} · Xmas Sat: ${vailXmasSat.score}`);
console.log(`  Vail plain Wed: ${vailPlainWed.score} · March Wed: ${vailMarchWed.score}`);
check('March Sat > plain Sat', vailMarchSat.score > vailPlainSat.score);
check('March Sat < Christmas Sat', vailMarchSat.score < vailXmasSat.score);
check('March Wed > plain Wed (midweek vacation traffic)', vailMarchWed.score > vailPlainWed.score);
check('Spring break reason surfaces', crowd('vail', '2026-03-14', bluebirdWx).reasons.some(r => r.startsWith('Spring break')));

// ════════ 5. MEMOIZATION ════════
console.log('\n═══ 5. Memoization: identity within a paint, reset + key correctness ═══');
sandbox.state.targetDate = new Date('2026-02-07T12:00:00');
vm.runInContext('resetCrowdForecastMemo()', sandbox);
sandbox.__r = byId['killington-resort']; sandbox.__wx = bluebirdWx;
const same = vm.runInContext('crowdForecast(__r, __wx) === crowdForecast(__r, __wx)', sandbox);
check('Same object returned within one paint cycle', same === true);
const afterReset = vm.runInContext('(() => { const a = crowdForecast(__r, __wx); resetCrowdForecastMemo(); return a !== crowdForecast(__r, __wx); })()', sandbox);
check('Reset produces a fresh object', afterReset === true);
const dayKeyed = vm.runInContext(`(() => {
  resetCrowdForecastMemo();
  const sat = crowdForecast(__r, __wx);
  state.targetDate = new Date('2026-02-11T12:00:00'); // Wednesday — NO reset on purpose
  const wed = crowdForecast(__r, __wx);
  return sat.score !== wed.score; // key must include the ski day
})()`, sandbox);
check('Memo key responds to targetDate change without reset (stale-gate guard)', dayKeyed === true);


// ════════ 6. SCORING FIXES (pass-aware value, drive curve, drive-tier gate) ════════
console.log('\n═══ 6. Pass-aware value scoring ═══');
function vIdx(id, passFilter) {
  sandbox.state.passFilter = passFilter;
  sandbox.__r = byId[id];
  return vm.runInContext('valueIndex(__r)', sandbox);
}
const stoweEpic   = vIdx('stowe-mountain-resort', 'Epic');   // Epic resort, Epic filter
const stoweAll    = vIdx('stowe-mountain-resort', 'All');    // no filter -> price curve
const bromleyEpic = vIdx('bromley-mountain', 'Epic');        // Independent resort, Epic filter
const jayIndy     = vIdx('jay-peak', 'Indy');                // Indy resort, Indy filter
const wachIndep   = vIdx('wachusett-mountain-ski-area', 'Independent'); // Independent is NOT a pass
console.log(`  Stowe/Epic filter: ${stoweEpic} · Stowe/no filter: ${stoweAll.toFixed(3)} · Bromley/Epic filter: ${bromleyEpic.toFixed(3)}`);
console.log(`  Jay Peak/Indy filter: ${jayIndy} · Wachusett/Independent filter: ${wachIndep.toFixed(3)}`);
check('Epic match = full credit (1.0)', stoweEpic === 1.0);
check('Indy match = partial credit (0.85)', jayIndy === 0.85);
check('No filter = price curve unchanged', Math.abs(stoweAll - (329 - 189) / (329 - 40)) < 1e-9);
check('Non-covered resort under a pass filter stays on price curve', Math.abs(bromleyEpic - (329 - 104) / (329 - 40)) < 1e-9);
check("'Independent' filter is not coverage (price curve applies)", wachIndep < 1.0 && Math.abs(wachIndep - (329 - 86) / (329 - 40)) < 1e-9);
sandbox.state.passFilter = 'All';

// preferenceReasons: no walk-up price take on covered mountains
sandbox.state.passFilter = 'Epic';
sandbox.state.weights = { snow: 1, crowd: 1, value: 10, drive: 0 };
sandbox.state.targetDate = null;
vm.runInContext('resetCrowdForecastMemo()', sandbox);
sandbox.__r = byId['stowe-mountain-resort'];
sandbox.__wx = bluebirdWx;
const stoweReasons = vm.runInContext('preferenceReasons(__r, __wx, null)', sandbox);
console.log('  Stowe reasons (Epic filter, value=10): ' + JSON.stringify(stoweReasons));
check('Covered mountain: no "$X walk-up" value line', !stoweReasons.some(r => /walk-up\./.test(r) && r.startsWith('$')));
check('Covered mountain: "Covered on your Epic pass" present', stoweReasons.some(r => r.includes('Covered on your Epic pass')));
sandbox.state.passFilter = 'All';
sandbox.state.weights = { snow: 1, crowd: 1, value: 0, drive: 0 };

console.log('\n═══ 7. Drive score curve continuity ═══');
const d = m => vm.runInContext(`driveScoreIndex(${m})`, sandbox);
console.log(`  d(0)=${d(0)} d(59)=${d(59).toFixed(4)} d(60)=${d(60)} d(61)=${d(61).toFixed(4)} d(120)=${d(120)} d(180)=${d(180).toFixed(3)} d(240)=${d(240).toFixed(3)}`);
check('No cliff at 60 min (gap < 0.005)', Math.abs(d(60) - d(61)) < 0.005, `gap ${(d(60) - d(61)).toFixed(4)}`);
check('Boundary joins: 120/180/240 continuous', Math.abs(d(120) - d(121)) < 0.005 && Math.abs(d(180) - d(181)) < 0.005 && Math.abs(d(240) - d(241)) < 0.005);
let mono = true;
for (let m = 0; m < 400; m++) if (d(m + 1) > d(m) + 1e-9) mono = false;
check('Monotonically decreasing 0–400 min', mono);
check('Anchor values: 60min=0.85, 120min=0.70', d(60) === 0.85 && Math.abs(d(120) - 0.70) < 1e-9);

console.log('\n═══ 8. Drive-tier gate for unknown drive times ═══');
// Load sd-filters with minimal shims; getDriveMins returns null via sandbox override
vm.runInContext(`
  var HOW_FAR_TIERS = [
    { label: 'Day Trip', floor: 0, cap: 180 },
    { label: 'Extended', floor: 180, cap: 360 },
    { label: 'All', floor: 0, cap: Infinity },
  ];
  var els = {}; var esc = s => String(s); var PRICE_RANGES = [];
  var STATE_FILTER_LABELS = {}; var tableSort = { col: 'planner', dir: 'desc' };
  var crowdPreferenceAllows = () => true; var tomorrowForecast = () => null;
  var getDriveMins_real = getDriveMins;
  getDriveMins = id => null; // simulate: estimates not yet landed
`, sandbox);
vm.runInContext(fs.readFileSync('sd-filters.js', 'utf8'), sandbox, { filename: 'sd-filters.js' });
sandbox.state.origin = { lat: 42.0, lon: -71.0, label: 'Taunton, MA' };
sandbox.state.howFar = 0;
const dayTrip = vm.runInContext(`resortMatchesDriveTier('alyeska-resort')`, sandbox);
sandbox.state.howFar = 2;
const anyDist = vm.runInContext(`resortMatchesDriveTier('alyeska-resort')`, sandbox);
console.log(`  unknown drive · Day Trip: ${dayTrip} · Any distance: ${anyDist}`);
check('Unknown drive excluded from Day Trip', dayTrip === false);
check('Unknown drive still passes Any distance', anyDist === true);
sandbox.state.origin = null; sandbox.state.howFar = 0;

// ════════ 9. STRUCTURAL MODULE PARITY + STATIC CALENDARS ════════
console.log('\n═══ 9. Shared module parity: static calendar == live model (neutral wx) ═══');
// A non-holiday Saturday with no weather loaded must produce the IDENTICAL
// score from the live engine and from typicalCrowdScore('saturday').
let parityOk = true; let parityChecked = 0;
for (const r of RESORTS) {
  sandbox.state.targetDate = new Date('2026-02-07T12:00:00'); // plain Saturday
  sandbox.state.skiDayPreset = null;
  vm.runInContext('resetCrowdForecastMemo()', sandbox);
  sandbox.__r = r;
  const live = vm.runInContext('crowdForecast(__r, null)', sandbox);
  const stat = vm.runInContext("WTSN_CROWD_STRUCT.typicalCrowdScore(__r, 'saturday')", sandbox);
  parityChecked++;
  if (live.score !== stat.score || live.label !== stat.label) {
    parityOk = false;
    console.log('  MISMATCH ' + r.id + ': live ' + live.score + ' vs static ' + stat.score);
    if (parityChecked > 5) break;
  }
}
check('Live engine == static calendar for ALL ' + parityChecked + ' resorts (Saturday, neutral wx)', parityOk);

const kCal = vm.runInContext("(() => { __r = RESORTS.find(r => r.id === 'killington-resort'); return WTSN_CROWD_STRUCT.typicalCrowdCalendar(__r); })()", sandbox);
console.log('  Killington calendar: ' + kCal.map(c => c.kind + ' ' + c.score + ' ' + c.label).join(' · '));
check('Killington calendar is monotonic midweek→holiday', kCal[0].score < kCal[1].score && kCal[1].score < kCal[3].score && kCal[3].score < kCal[2].score && kCal[2].score < kCal[4].score);
check('Killington Saturday reads Busy, holiday weeks Avoid-adjacent', kCal[2].label === 'Busy' && kCal[4].score >= 75);
const bCal = vm.runInContext("(() => { __r = RESORTS.find(r => r.id === 'bousquet-ski-area'); return WTSN_CROWD_STRUCT.typicalCrowdCalendar(__r); })()", sandbox);
console.log('  Bousquet calendar:   ' + bCal.map(c => c.kind + ' ' + c.score + ' ' + c.label).join(' · '));
check('Bousquet midweek reads Quiet', bCal[0].label === 'Quiet');

console.log(failures === 0 ? '\nALL CHECKS PASSED' : `\n${failures} CHECK(S) FAILED`);
process.exit(failures ? 1 : 0);
