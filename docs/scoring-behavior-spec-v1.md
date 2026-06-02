# WhereToSkiNext — Scoring Behavior Spec (v1, agreed)

Status: agreed and stable. Revised only when building the harness teaches us
something (writing a test sometimes exposes an ambiguity prose hid). This is the
source-of-truth document the six-month build references.

================================================================================
MISSION (what the whole engine + card exist to deliver)
================================================================================

It is NOT four rankings. It is ONE recommendation plus THREE useful contrasts:

  PICK    — "This is where I'd ski."
  SLEEPER — "This is the smart quieter play."
  TRAP    — "This is good, but the crowd risk is real."
  LOCAL   — "This is the easiest acceptable option if you don't want the drive."

The full ranked list lives on a separate rankings surface, NOT on the card.
The card decides; the rankings list. A long list on the card = we've become an
aggregator. Resist it.

================================================================================
CORE ARCHITECTURE — THE TWO-LAYER MODEL (this is the foundation)
================================================================================

The engine computes TWO separate things and must never merge them:

LAYER 1 — MOUNTAIN IDENTITY ("what kind of mountain is this?")
  - Computed ONLY from stable attributes: vertical, trail/lift depth, terrain
    variety, regional draw, pass/ticket accessibility, drive-worthiness.
  - Does NOT move with weather, crowds, or date. Tenney is a "regional sleeper"
    in July and January alike. Blue Hills is "local" sunny or snowing.
  - Output: destinationSuitabilityScore (0-100) + destinationClass
    (local / regional / destination).

LAYER 2 — DAILY RECOMMENDATION ("should you ski it today?")
  - Layers live conditions (snow, crowds, wind, temp, drive) ON TOP of identity.
  - This is what produces today's pick/sleeper/trap/local.

WHY THIS MATTERS: the Blue Hills bluebird bug exists because today's engine has
ONE layer — good live conditions can drown out weak terrain. Splitting identity
from daily puts weak terrain in a layer the weather cannot reach. This kills the
bug at the root rather than patching it with weights.

HARD INVARIANT: destinationSuitabilityScore must NOT change when only weather/
crowd/date change. The harness must actively test this — if it ever moves on a
weather-only change, the two layers have bled together and the original bug is back.

================================================================================
PART A — GENERAL RULES
================================================================================

--- A1. Eligibility floor vs. destination suitability (two distinct concepts) ---

A1.1  ELIGIBILITY FLOOR (a hard yes/no gate). On a willing-to-drive search with
      NO local intent, a mountain below the regional floor canNOT be the Top Pick.
      It MAY still appear in the LOCAL slot.

A1.2  Clearing the floor is NECESSARY BUT NOT SUFFICIENT. Clearing 700 ft does not
      make a mountain a destination pick. Destination suitability decides whether
      it can actually win a broad search.

A1.3  DESTINATION SUITABILITY = computed 0-100 score from stable attributes
      (vertical + trail/lift depth + terrain variety + regional draw + pass/ticket
      accessibility + drive-worthiness). Excludes snow/wind/temp/today's crowds —
      those are Layer 2. Derived label: local / regional / destination.

      Reference calibration (Northeast anchors):
        Blue Hills  309 ft  -> very low      -> local
        Bousquet    750 ft  -> low/moderate  -> local/regional
        Pats Peak   770 ft  -> moderate/high -> regional
        Black NH  1,100 ft  -> moderate/high -> regional/destination
        Loon      2,100 ft  -> high          -> destination
        Killington 3,050 ft -> very high     -> destination

A1.4  Above the floor, VERTICAL DOES NOT DOMINATE. A 770 ft Pats Peak can be the
      right call over a larger mountain when conditions/drive/crowds/price/
      skiability line up. No "biggest mountain wins" logic.

A1.5  THREE DRIVE REGIMES (not two):
        LOCAL intent     -> floor OFF; sub-floor mountains can WIN.
        DAY TRIP         -> floor ON; sub-floor can appear as LOCAL slot, not win.
        WILLING-TO-DRIVE -> floor ON (Weekend / extended / any-distance).
      Day Trip is a REAL ski day (Loon, Sunapee, Gunstock, Waterville, even VT
      from Boston) — it is NOT "the nearest hill." Day Trip alone does NOT flip
      the floor off.

A1.6  LOCAL INTENT (what flips the floor off) triggers on ANY of:
        - shortest drive tier / short-drive style selected
        - a "local hill" style selected
        - heavy drive-time weighting
        - very small radius
        - the LOCAL card being filled
        - explicit easy / close / cheap / after-work / beginner / family language

--- A2. Quality vs. crowds balance ---

A2.1  Low crowds + short drive must NOT, by themselves, lift a weak-terrain
      mountain to Top Pick over a clearly better in-range mountain. (The Blue
      Hills bluebird-from-02066 bug.)

A2.2  The biggest mountain must NOT auto-win on most-snow + most-trails, because
      it's also the most crowded. A quieter, still-excellent mountain can beat it.
      (Loon doesn't always win.) This is the heart of the product: not "where is
      the biggest resort?" but "where should I ski?"

--- A3. The expectation contract ---

A3.1  When there's significant snow across the week AND good skiability, at least
      one large mountain MUST appear in the top few. Never bury the obvious
      great-skiing option on a powder week.

A3.2  But never show ONLY the obvious big mountains. When the data supports it,
      surface at least one credible non-obvious option. DO NOT manufacture a fake
      sleeper if none legitimately exists.

--- A4. The four card roles ---

A4.1  PICK — honest best call given filters. Not sponsored. Not contrarian for its
      own sake. The best answer for the user's filters.

A4.2  TRAP — requires ALL of: high mountain quality + high crowd risk + high
      demand/name recognition. A mountain people would plausibly flock to (famous,
      major pass, near a metro, fresh snow, strong reputation) where timing may be
      painful. A random crowded hill is NOT automatically a trap. Label voice:
      "Great mountain, bad timing."

A4.3  SLEEPER — quieter, overlooked, legitimately good. Must be meaningfully
      quieter than the obvious BIG-MOUNTAIN alternative, and not materially more
      crowded than the PICK. (NOT a hard "quieter than the pick" — sometimes the
      pick is already the quiet smart call.) Needs: good snow/skiability, lower
      crowd pressure, lower name recognition/pass-driven demand, enough terrain to
      justify it, and a score close enough to the pick to be a real alternative.

A4.4  LOCAL / SHORT-DRIVE — the closest decent option for "I don't want the haul."
      Where a sub-floor mountain (Blue Hills, Nashoba, Ski Ward) legitimately
      appears without corrupting the main rec. Answers "what if I don't want the
      drive?" — NOT "this is the best ski day."

A4.5  No mountain fills two roles in the same result set. No duplicates.

A4.6  ROLE PRIORITY (fill order): PICK -> LOCAL -> SLEEPER -> TRAP.
      If the same mountain is both best PICK and obvious TRAP: it STAYS the PICK,
      the pick card carries a crowd warning ("Best skiing, but expect crowds"),
      and the TRAP slot passes to the next qualifying crowd-magnet. If no
      legitimate trap exists, leave it empty — never duplicate, never fake.

A4.7  Full rankings (separate surface) show the complete scored list 1..N.

--- A5. Filters do real work ---

A5.1  Pass filter: hard filter. Outside the selected pass = cannot win/appear
      (unless "Any").
A5.2  State filter: NH-only means NH-only. No MA/CT scored.
A5.3  Snow preference: raising snow priority must MEASURABLY drop dry mountains and
      lift snowy ones (sub-threshold snow heavily penalized). Must be testable.
A5.4  Drive tier affects: eligible pool, drive penalty, whether sub-floor can win,
      and whether local hills appear only in the LOCAL card (per A1.5).

--- A6. Region-aware behavior ---

A6.1  The floor is REGIONAL, never national. PHASE 1 — fixed floors:
        Northeast / Mid-Atlantic:        700 ft
        Midwest:                          400-500 ft
        Rockies / Interior West:        1,500 ft
        Pacific West / CA / PNW:        1,500-2,000 ft
      Used as broad-search destination guardrails, NOT as quality scores.

A6.2  PHASE 2 (after Phase 1 is stable and tested) — percentile normalization
      behind the scenes: verticalPercentileWithinRegion / ...WithinReachableSet /
      trailCountPercentileWithinRegion. Rule: below 25th percentile of the
      reachable set + no local intent -> cap Top Pick eligibility. Do NOT ship
      percentile first: sparse/uneven reachable sets create weird early bugs.

A6.3  "Big mountain" is relative to region/reachable set. Killington is huge in
      VT, mid-pack in UT. Normalize within the reachable set, not a national scale.

--- A7. Humility / confidence ---

A7.1  The pick is a strong suggestion, never a guaranteed verdict ("best call,"
      not "guaranteed best ski day"). Weather, crowds, wind, lifts, snow quality
      all shift.

A7.2  When the top two are within a small margin, don't imply false certainty.
      Voice options: "Top pick by a small margin," "also strongly worth
      considering," "this is close — choose on drive time vs. terrain."

================================================================================
PART B — NAMED ANCHORS (Northeast, known firsthand)
================================================================================

B1.  Blue Hills (MA, 309) — NOT Top Pick on a willing-to-drive weekday from 02066.
     Wins only on local/short-drive, or appears in LOCAL card. Identity: local.

B2.  Pats Peak (NH, 770) — eligible Top Pick on a drive search; "small but real,"
     not penalized for size. Identity: regional.

B3.  Black Mountain (NH, 1,100) — comfortably eligible; small-feel/culture + enough
     terrain to be a real pick when conditions fit. Identity: regional/destination.

B4.  Killington (VT, 3,050, 99 trails) — OFTEN the TRAP on a bluebird Saturday, but
     CAN be the PICK when conditions truly warrant (with crowd warning on the pick
     card; trap slot then goes to next qualifying crowd-magnet).

B5.  Loon (NH, 2,100) — legitimate frequent Top Pick (esp. from eastern MA / s. NH),
     but MUST be beatable by a quieter strong option (Wildcat, Tenney). Not automatic.

B6.  Magic (VT, 1,500) / Bromley (VT, 1,334) — SLEEPER candidates when snow/
     skiability support. Magic esp. on good natural snow; Bromley as quieter/
     family/sun-facing alternative.

B7.  Tenney (NH, 1,500) — on a real powder Saturday (snow on THAT day) must be able
     to BEAT a closer dry mountain. The result that makes WTSN feel smart.

B8.  Wachusett (MA, 1,000) — clears floor; MA day-trip workhorse, practical pick
     for shorter-drive users, but crowd pressure must matter.

B9.  Bousquet (MA, 750) — clears the 700 floor but classified local/regional by
     destination suitability (NOT a broad destination default). Wins with context:
     Berkshires user, shorter drive, value/family/local pref, good relative
     conditions, or user wants a smaller mountain. Floor stays at 700; suitability
     (not a raised floor) keeps Bousquet in its lane.

================================================================================
BUILD STAGING
================================================================================

1. Test harness encoding these rules (Northeast first) — the safety net.
2. Two-layer model: compute destinationSuitabilityScore + class from stable attrs;
   verify the weather-invariance of Layer 1.
3. Phase-1 fixed regional floors as eligibility guardrails.
4. Role classification (pick/sleeper/trap/local) with priority + anti-contrivance.
5. Daily-score tuning against the anchors, harness catching regressions.
6. Card UX: one recommendation + three labeled contrasts.
7. Phase-2 percentile normalization once Phase 1 is proven.
