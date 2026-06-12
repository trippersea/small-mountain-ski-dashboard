/**
 * crowd-structural.js - the weather-independent half of the WTSN crowd model.
 *
 * Single source of truth for: structural demand (Step A), the holiday
 * calendar, day-of-week multipliers (Step B's non-weather part), the capacity
 * amplifier (Step C), the tanh + logistic squash, and the score → label
 * thresholds. Everything here is computable with no live forecast and no user
 * state, which is exactly why it lives in its own file:
 *
 *   1. sd-scoring.js (the live engine) delegates these steps to WTSN_CROWD_STRUCT
 *      and layers weather factors, reasons, and confidence on top. Load order
 *      in index.html: metro_gravity → lift_capacity → THIS FILE → sd-scoring.
 *      This is a hard dependency, same as the METRO_GRAVITY table itself.
 *   2. generate-mountain-pages.mjs loads this file via vm (the same pattern it
 *      uses for resorts.js) to bake a "typical crowd calendar" into every
 *      static mountain page - real model output, no weather needed.
 *
 * Calibration anchors (validated in validate-crowd-model.js - run it after
 * ANY change to this file):
 *   Killington Saturday bluebird          → BUSY (≈75)
 *   Killington holiday Saturday powder    → AVOID (≈83)
 *   Loon Saturday bluebird                → BUSY (≈70)
 *   Bousquet Saturday bluebird            → MODERATE (≈51)
 *
 * OBFUSCATION NOTE: this file is in the TARGETS list of obfuscate-scoring.mjs,
 * so the deployed copy is scrambled at build time like sd-scoring.js. The
 * generator runs locally against this readable source before deploy.
 */
(function (root) {
  'use strict';

  // ─── Calendar ───────────────────────────────────────────────────────────────

  /** Day-of-month for the nth `dow` (0=Sun..6=Sat) of a month (1-12). */
  function nthWeekdayOfMonth(year, month, dow, n) {
    const firstDow = new Date(year, month - 1, 1).getDay();
    return 1 + ((dow - firstDow + 7) % 7) + (n - 1) * 7;
  }

  /**
   * Holiday factor 0-1 for a Date.
   * 1.0 = peak holiday week, 0.7 = major holiday weekend, 0.4 = sustained minor.
   * MLK / Presidents / Thanksgiving computed from their actual floating dates.
   * Spring break (~Mar 1-28, 0.4) covers staggered school vacations: a
   * mid-March Saturday lands between a plain Saturday and a Christmas-week
   * Saturday, which matches observed lift-line behavior.
   */
  function holidayFactor(date) {
    const year  = date.getFullYear();
    const month = date.getMonth() + 1;
    const day   = date.getDate();
    const dow   = date.getDay();

    // Christmas + New Year's school break
    if (month === 12 && day >= 23) return 1.0;
    if (month === 1  && day <= 4)  return 1.0;

    // MLK weekend: Sat-Mon ending on the 3rd Monday of January
    if (month === 1) {
      const mlk = nthWeekdayOfMonth(year, 1, 1, 3);
      if (day >= mlk - 2 && day <= mlk) return 0.7;
    }

    // Presidents / February vacation week: Saturday before the 3rd Monday of
    // February through the following Sunday (NE school break week drives this).
    if (month === 2) {
      const pres = nthWeekdayOfMonth(year, 2, 1, 3);
      if (day >= pres - 2 && day <= pres + 6) return 1.0;
    }

    // Spring break: staggered school vacations, ~Mar 1-28. Persistent demand
    // bump on top of the normal day-of-week pattern (incl. midweek families).
    if (month === 3 && day <= 28) return 0.4;

    // Thanksgiving: Wednesday before through Sunday after the 4th Thursday
    if (month === 11) {
      const tg = nthWeekdayOfMonth(year, 11, 4, 4);
      if (day >= tg - 1 && day <= tg + 3) return 0.7;
      if (day >= 10 && day <= 12) return 0.4; // Veterans Day (fixed Nov 11)
    }

    // Columbus Day weekend: Sat-Mon ending on the 2nd Monday of October
    if (month === 10) {
      const col = nthWeekdayOfMonth(year, 10, 1, 2);
      if (day >= col - 2 && day <= col && (dow === 6 || dow <= 1)) return 0.4;
    }

    return 0;
  }

  // ─── Day multipliers ─────────────────────────────────────────────────────────

  /** Weekend demand factor by day of week: Sat 1.0, Sun 0.7, Fri 0.3, else 0. */
  function weekendFactorForDow(dow) {
    return dow === 6 ? 1.0 : dow === 0 ? 0.7 : dow === 5 ? 0.3 : 0;
  }

  /** Mday = 1 + 0.35·weekendF + 0.45·holidayF */
  function dayMultiplier(weekendF, holidayF) {
    return 1 + 0.35 * weekendF + 0.45 * holidayF;
  }

  // ─── Step A: structural demand base ─────────────────────────────────────────

  /**
   * Weather-independent demand for a resort.
   * `tables` may supply { METRO_GRAVITY, LIFT_CAPACITY_TIERS } explicitly
   * (Node / generator use); in the browser they default to the globals loaded
   * by metro_gravity_final.js and lift_capacity_tiers_final.js.
   * Weights: metroGravity 40%, passScore 25%, destPull 20%, resortAttractors 15%.
   */
  function structuralDemand(resort, tables) {
    const MG = (tables && tables.METRO_GRAVITY)
      || (typeof METRO_GRAVITY !== 'undefined' ? METRO_GRAVITY : null);
    const rawMG  = (MG ? MG[resort.id] : null) ?? 500;
    const metroG = rawMG / 1000;

    const passScore = (resort.passGroup === 'Epic' || resort.passGroup === 'Ikon') ? 0.85
                    : resort.passGroup === 'Indy' ? 0.45
                    : 0.30;

    const destPull = Math.min(1, (resort.vertical / 3000) * 0.6 + (resort.acres / 1500) * 0.4);

    const resortAttr = Math.min(1,
      Math.min(1, resort.vertical / 3000) * 0.50 +
      (resort.terrainPark ? 0.20 : 0) +
      (resort.night       ? 0.15 : 0) +
      0.15
    );

    const Dbase = 0.40 * metroG + 0.25 * passScore + 0.20 * destPull + 0.15 * resortAttr;
    return { rawMG, metroG, passScore, destPull, resortAttr, Dbase };
  }

  // ─── Step C: capacity amplifier ──────────────────────────────────────────────

  /**
   * How hard demand translates into felt crowding.
   * Destination fix: when a high-gravity resort sits on a major pass network,
   * large capacity acts as a crowd funnel, not a relief valve - without this,
   * Tier 5 Ikon/Epic destinations score Moderate on Saturday bluebirds when
   * they should score Busy.
   */
  function capacityAmplifier(resort, demand, tables) {
    const LT = (tables && tables.LIFT_CAPACITY_TIERS)
      || (typeof LIFT_CAPACITY_TIERS !== 'undefined' ? LIFT_CAPACITY_TIERS : null);
    const rawTier = (LT ? LT[resort.id] : null) ?? 3;
    let   liftInv = (5 - rawTier) / (5 - 1); // linear: tier5=0, tier1=1

    if (demand.rawMG > 750 && demand.passScore >= 0.80) {
      if (rawTier === 5)      liftInv = 0.45;
      else if (rawTier === 4) liftInv = 0.55;
    }

    const parkingC = resort.acres < 100 ? 0.75 : resort.acres < 300 ? 0.55 : 0.40;
    const terrainC = rawTier <= 2 ? 0.65 : rawTier <= 3 ? 0.50 : 0.35;
    const A        = 0.45 * liftInv + 0.35 * parkingC + 0.20 * terrainC;
    return { rawTier, liftInv, parkingC, terrainC, A };
  }

  // ─── Final squash + labels ───────────────────────────────────────────────────

  /** tanh soft clamp + logistic (alpha=3.5, beta=1.5, center=0.40) → 5-100. */
  function crowdScoreFrom(Draw, A) {
    const D = Math.tanh(Draw / 1.5);
    const logitIn = 3.5 * (D - 0.40) + 1.5 * (A - 0.5);
    return Math.max(5, Math.min(100, Math.round(100 / (1 + Math.exp(-logitIn)))));
  }

  /** Score → user-facing label. Thresholds shared with crowdPreferenceAllows. */
  function crowdLabel(score) {
    return score >= 80 ? 'Avoid'
         : score >= 65 ? 'Busy'
         : score >= 45 ? 'Moderate'
         :               'Quiet';
  }

  // ─── Typical day profiles (for static crowd calendars) ──────────────────────

  /**
   * Day kinds for the static calendar. `holiday` is the peak case: a Saturday
   * inside a 1.0 holiday week (Christmas week, Presidents week) - the same
   * Mday the live model computes for those dates.
   */
  const DAY_KINDS = Object.freeze({
    midweek:  { weekendF: 0,   holidayF: 0,   label: 'Midweek' },
    friday:   { weekendF: 0.3, holidayF: 0,   label: 'Friday' },
    saturday: { weekendF: 1.0, holidayF: 0,   label: 'Saturday' },
    sunday:   { weekendF: 0.7, holidayF: 0,   label: 'Sunday' },
    holiday:  { weekendF: 1.0, holidayF: 1.0, label: 'Holiday weeks' },
  });

  /**
   * Structural crowd score for a typical day of the given kind, with neutral
   * weather (Mweather = 1). This is exactly what the live model returns for
   * that day when no forecast is loaded - the validation harness asserts
   * parity, so the static calendars and the live tool can never disagree
   * about the baseline.
   */
  function typicalCrowdScore(resort, dayKind, tables) {
    const kind = DAY_KINDS[dayKind];
    if (!kind) return null;
    const demand = structuralDemand(resort, tables);
    const Mday   = dayMultiplier(kind.weekendF, kind.holidayF);
    const cap    = capacityAmplifier(resort, demand, tables);
    const score  = crowdScoreFrom(demand.Dbase * Mday, cap.A);
    return { score, label: crowdLabel(score), kind: kind.label };
  }

  /** Full five-column calendar for a resort. Order: midweek → holiday. */
  function typicalCrowdCalendar(resort, tables) {
    return ['midweek', 'friday', 'saturday', 'sunday', 'holiday']
      .map(k => Object.assign({ key: k }, typicalCrowdScore(resort, k, tables)));
  }

  const api = {
    nthWeekdayOfMonth,
    holidayFactor,
    weekendFactorForDow,
    dayMultiplier,
    structuralDemand,
    capacityAmplifier,
    crowdScoreFrom,
    crowdLabel,
    DAY_KINDS,
    typicalCrowdScore,
    typicalCrowdCalendar,
  };

  root.WTSN_CROWD_STRUCT = api;
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  }
})(typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : this);
