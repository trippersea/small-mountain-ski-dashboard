# Scoring behavior spec v2 — Direction 3 (Solid Option + rankings escape hatch)

This document supplements `scoring-behavior-spec-v1.md` with behavior shipped for Direction 3. Top Pick scoring, weights, and filters are unchanged.

**Legacy note:** v2 originally used the label "Smart Play." User-facing copy now uses **Solid Option** (internal role: `sleeper`). Local fallback uses **Worth a Look** (internal: `roleVariant: 'another_smart_play'`).

## Curated roles vs full rankings

The homepage shows up to four curated roles (Top Pick, Best Nearby Option / Worth a Look, Solid Option, Crowd Watch). The **full ranked table** (`#compareSection`) is the escape hatch when curated cards do not fit.

Rankings show raw score order. Top Pick also applies destination suitability and trip-fit gates, so a small local hill may rank high in the table but not win a broad destination search.

**Rankings CTA:** On the verdict card, `Compare Mountains | View all ranked mountains` sits below the primary forecast action. It scrolls to the full rankings table and expands to show all mountains (`tableViewAll = true`). It does not compete with the Top Pick headline.

## Mountain identity (Layer 1)

Three suitability classes drive Top Pick eligibility and Solid Option obviousness (unchanged from v1):

| Class | Suitability score | Role in Solid Option |
|-------|-------------------|----------------------|
| **local** | &lt; 14 | Excluded from Solid Option |
| **regional** | 14–39 | Can qualify if less obvious |
| **destination** | ≥ 40 | Treated as obvious |

## Solid Option (user-facing label)

Internal code uses `sleeper` / `pickSleeperFromRanked`. User-facing label: **Solid Option**.

**Product rule:** Solid Option is not raw #2. It is the credible **less-obvious** alternative when the Top Pick feels like a mountain the user already knows.

**Role fill order:** PICK → LOCAL (Best Nearby or Worth a Look) → SLEEPER (Solid Option) → TRAP (Crowd Watch).

### Obviousness index (pool-relative)

Three signals combined into a 0–1 index:

1. **destinationClass** — destination = high obviousness; regional = mid; local = excluded
2. **passGroup** — Epic/Ikon = high; Indy = mid; Independent = lower
3. **metroGravity** — normalized metro demand (one threshold band, no global `mg < 800` cutoff)

Constants (tuned to anchor tests):

- `SLEEPER_MAX_OBVIOUSNESS = 0.55` — candidates at/above this cannot be Solid Option
- `SLEEPER_OBVIOUSNESS_GAP = 0.15` — must be this much less obvious than reference
- `SLEEPER_OBVIOUS_PICK_THRESHOLD = 0.62` — obvious Top Pick becomes its own reference

**Reference mountain:** Top Pick when it is an obvious magnet; otherwise the busiest obvious eligible mountain in the ranked pool.

When Top Pick is already the quiet or contrarian play (`isPickAlreadyQuietPlay`), Solid Option stays empty.

### Required Solid Option reason

At least one must fire (vs Top Pick or reference):

- Meaningfully quieter crowds
- Meaningfully better recent snow/base
- Meaningfully better value (not when both candidate and reference are obvious magnets)
- Meaningfully shorter drive to a non-local-class mountain

If no reason fires, Solid Option is **null**.

### No fake Solid Option

`fillMissingRoleSlots` does **not** backfill Solid Option from raw score rank. Worth a Look (local fallback) may still appear when no mountain is within 45 minutes, using the same credibility rules as `pickLocalFallbackFromRanked`.

### Anchor mountains (test suite, not hardcoded in model)

**Generally not Solid Option:** Killington, Loon, Cannon, Waterville, Sunapee, Stowe, Sugarbush, Sunday River, Sugarloaf, Stratton, Okemo, Mount Snow, Jay Peak, Wildcat.

**Can be Solid Option when score-competitive:** Magic, Tenney, Bromley, Saddleback, Mad River Glen, Black Mountain NH, Berkshire East, Burke, Pats Peak.

**Edge case:** Smuggs — Independent, well-known; handled by obviousness index, not a pass-only rule.

## Close-call Top Pick

When Top Pick and the next eligible runner-up are within 12 points, the hero card may show close-call copy with a specific edge reason (snow, terrain fit, crowd, drive, value, or skiability).

## Verdict tier — sunny dry groomer days

`verdictFromBreakdown` assigns **good** (not bad) to clear, cold dry days with a reasonable base. **Bad** requires rain, unsafe warmth/refreeze, severe wind, or similar genuinely negative factors. This prevents legitimate Solid Option candidates from being rejected solely on tier.

## Bromley pass note

Bromley is evaluated on actual `passGroup` in resort data (**Independent**), not Epic/Ikon. Its regional class and moderate obviousness index allow Solid Option when anchors and reasons support it.

## Compare page

Compare session and labels remain aligned with roles selected on the homepage. Solid Option column uses label **Solid Option**.
