# Scoring behavior spec v2 — Direction 3 (Smart Play + rankings escape hatch)

This document supplements `scoring-behavior-spec-v1.md` with behavior shipped for Direction 3. Top Pick scoring, weights, and filters are unchanged.

## Curated roles vs full rankings

The homepage shows up to four curated roles (Top Pick, Best Nearby Option / Another Smart Play, Smart Play, Crowd Watch). The **full ranked table** (`#compareSection`) is the escape hatch when curated cards do not fit.

**Rankings CTA:** On the verdict card, `Compare Mountains | View all ranked mountains` sits below the primary forecast action. It scrolls to the full rankings table and expands to show all mountains (`tableViewAll = true`). It does not compete with the Top Pick headline.

## Mountain identity (Layer 1)

Three suitability classes drive Top Pick eligibility and Smart Play obviousness (unchanged from v1):

| Class | Suitability score | Role in Smart Play |
|-------|-------------------|--------------------|
| **local** | &lt; 14 | Excluded from Smart Play |
| **regional** | 14–39 | Can qualify if less obvious |
| **destination** | ≥ 40 | Treated as obvious |

## Smart Play (user-facing label)

Internal code may still use `sleeper` / `pickSleeperFromRanked`. User-facing label: **Smart Play**.

**Product rule:** Smart Play is not raw #2. It is the credible **less-obvious** alternative when the Top Pick feels like a mountain the user already knows.

### Obviousness index (pool-relative)

Three signals combined into a 0–1 index:

1. **destinationClass** — destination = high obviousness; regional = mid; local = excluded
2. **passGroup** — Epic/Ikon = high; Indy = mid; Independent = lower
3. **metroGravity** — normalized metro demand (one threshold band, no global `mg < 800` cutoff)

Constants (tuned to anchor tests):

- `SLEEPER_MAX_OBVIOUSNESS = 0.55` — candidates at/above this cannot be Smart Play
- `SLEEPER_OBVIOUSNESS_GAP = 0.15` — must be this much less obvious than reference
- `SLEEPER_OBVIOUS_PICK_THRESHOLD = 0.62` — obvious Top Pick becomes its own reference

**Reference mountain:** Top Pick when it is an obvious magnet; otherwise the busiest obvious eligible mountain in the ranked pool.

### Required Smart Play reason

At least one must fire (vs Top Pick or reference):

- Meaningfully quieter crowds
- Meaningfully better recent snow/base
- Meaningfully better value (not when both candidate and reference are obvious magnets)
- Meaningfully shorter drive to a non-local-class mountain

If no reason fires, Smart Play is **null**.

### No fake Smart Play

`fillMissingRoleSlots` does **not** backfill Smart Play from raw score rank. Local fallback may still use **Another Smart Play** when no mountain is within 45 minutes — a separate role variant.

### Anchor mountains (test suite, not hardcoded in model)

**Generally not Smart Play:** Killington, Loon, Cannon, Waterville, Sunapee, Stowe, Sugarbush, Sunday River, Sugarloaf, Stratton, Okemo, Mount Snow, Jay Peak, Wildcat.

**Can be Smart Play when score-competitive:** Magic, Tenney, Bromley, Saddleback, Mad River Glen, Black Mountain NH, Berkshire East, Burke, Pats Peak.

**Edge case:** Smuggs — Independent, well-known; handled by obviousness index, not a pass-only rule.

## Verdict tier — sunny dry groomer days

`verdictFromBreakdown` assigns **good** (not bad) to clear, cold dry days with a reasonable base. **Bad** requires rain, unsafe warmth/refreeze, severe wind, or similar genuinely negative factors. This prevents legitimate Smart Play candidates from being rejected solely on tier.

## Bromley pass note

Bromley is evaluated on actual `passGroup` in resort data (**Independent**), not Epic/Ikon. Its regional class and moderate obviousness index allow Smart Play when anchors and reasons support it.

## Compare page

Compare session and labels remain aligned with roles selected on the homepage. Smart Play column uses label **Smart Play**.
