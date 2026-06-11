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

console.log(failures === 0 ? '\nALL CHECKS PASSED' : `\n${failures} CHECK(S) FAILED`);
process.exit(failures ? 1 : 0);
