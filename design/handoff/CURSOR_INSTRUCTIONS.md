# Cursor Implementation Guide — WhereToSkiNext

This document tells you (Cursor) exactly how to implement the homepage and filters/results
views in this project. Two reference files define the finished design **down to the pixel**:

- `Homepage.html` — hero + "find my mountain" form + verdict result card
- `Filters.html` — two-column refine view: sticky filters (left) + live results list (right)

Treat those two files as the **source of truth for look, layout, and behavior**. This guide
explains how to port them into the production stack, what to keep verbatim, and the one place
real data must replace placeholders.

---

## 0. Before you start — tell me / confirm

Fill these in (they change the output):

- **Framework:** [ React+Tailwind / Next.js / Vue / SvelteKit / plain HTML+CSS / other ]
- **Styling system:** [ Tailwind / CSS Modules / styled-components / plain CSS variables ]
- **Where mountain data comes from:** [ REST endpoint / GraphQL / static JSON / TBD ]

If a value is unknown, default to: **plain HTML + a single CSS file using CSS custom properties**,
and keep the mountain data as a local JSON module with a `// TODO: replace with API` marker.

**Match the existing project's conventions** — file structure, component patterns, naming, and
import style. Do not introduce new dependencies beyond what the project already uses (the
reference uses only vanilla JS + one Google Font; no framework lock-in).

---

## 1. Global setup (do this first — it fixes two known bugs)

### 1a. Fonts — REQUIRED (fixes "the font isn't showing")
The serif used for mountain names is **Spectral** (Google Fonts). If you omit this, mountain
names silently fall back to Times/Georgia and look wrong. Add to the document `<head>` (or the
framework's head/layout equivalent):

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Spectral:ital,wght@0,400;0,500;0,600;1,400&display=swap" rel="stylesheet">
```

Font stacks:
- **Sans (ALL UI + data):** `"Helvetica Neue", Helvetica, "Segoe UI", system-ui, sans-serif`
- **Serif (mountain names ONLY):** `"Spectral", Georgia, "Times New Roman", serif`

### 1b. Design tokens — define once, use everywhere
Copy these into `:root` (or map into the Tailwind theme). Colors are **oklch** with sRGB hex
fallbacks in comments. Do not approximate — use these exact values.

```css
:root{
  /* surfaces */
  --bg-0: oklch(0.16 0.025 248);          /* #15191f page base */
  --bg-1: oklch(0.21 0.030 250);          /* #1e242d */
  --panel: oklch(0.215 0.028 250);        /* card/panel solid */
  --panel-2: oklch(0.235 0.026 250);      /* pill/chip surface */
  --line: oklch(0.50 0.03 250 / 0.28);    /* borders */
  --line-soft: oklch(0.58 0.03 250 / 0.15); /* hairlines */
  /* text */
  --ink:  oklch(0.98 0.004 250);          /* #f7f8f9 primary */
  --ink-2: oklch(0.86 0.012 250);         /* #d4d8dd body */
  --ink-3: oklch(0.74 0.030 240);         /* #a3acb8 labels */
  /* glacial accent */
  --ice: oklch(0.80 0.085 225);           /* #7cc3e8 accent / CTA bg */
  --ice-deep: oklch(0.66 0.115 232);      /* #2f8fd1 accent border / pressed */
  --ice-deep-h: oklch(0.71 0.115 232);    /* pressed pill border */
  --ice-ghost: oklch(0.66 0.115 232 / 0.16);
  /* ranking zone accent (filters page only) */
  --rank: oklch(0.82 0.105 200);
  --rank-deep: oklch(0.70 0.105 200);
  --rank-ghost: oklch(0.70 0.105 200 / 0.16);
  /* status */
  --good: oklch(0.82 0.13 158);           /* #4fc98a quiet / success */
  --warn: oklch(0.83 0.11 78);            /* #e0b13e caution */
  --bad:  oklch(0.70 0.15 28);            /* busy / negative */
  /* fonts + radii */
  --sans: "Helvetica Neue", Helvetica, "Segoe UI", system-ui, sans-serif;
  --serif: "Spectral", Georgia, "Times New Roman", serif;
  --r: 14px; --r-sm: 10px;
}
```

### 1c. Background image
Both pages use `assets/hero.jpg` as a fixed, full-bleed background. Keep the file at a path the
pages can reach (the reference uses `assets/hero.jpg` relative to each HTML file). Treatment:
- **Homepage:** photo prominent; veil weighted to the LEFT so hero text stays readable.
- **Filters:** same photo under a HEAVIER veil so dense data cards stay legible.

---

## 2. Homepage (`Homepage.html`)

### Structure
```
<header class="nav">                  flex; justify-content: space-between; padding: 20px 40px
  <div class="brand"> logo + "WhereToSkiNext.com" </div>
  <div class="nav-right">             flex; gap: 30px   (links + Subscribe grouped on the RIGHT)
    <nav class="links"> Browse ▾ · About · Stories · Pass Guides </nav>
    <button class="btn-sub" type="button">Subscribe</button>
  </div>
</header>

<main>                                grid; columns: minmax(0,1fr) minmax(0,0.92fr); gap 64px;
                                      max-width 1340px; align-items center
  <section class="ask"> … left: the form … </section>
  <section class="card"> … right: the verdict card … </section>
</main>
```

### Left column ("ask")
- Eyebrow label ("Live snow · drive · crowd forecast") — uppercase, `--ink-3`.
- `<h1>`: "Stop guessing where to **ski**." — `clamp(44px,5.6vw,78px)`, weight 800,
  letter-spacing −0.025em, line-height 0.98. The word "ski" is `--ice`.
- Subhead: `--ink-2`, **max-width 46ch** (NOT 30ch — wider so it doesn't bunch up).
- "Starting from" location field.
- Three single-select **pill groups**: Pass / Trip / Day. Pressed state = `--ice-deep` bg +
  `--ice-deep-h` border + soft glow; track via `aria-pressed="true"`.
- Footer row: secondary "Update results" button + "Use my location" link.

### Right column — the verdict card (USE OPTION A LAYOUT)
This is the approved design. Build it as a **data-driven component** — do not hardcode "Cannon
Mountain". Order, top to bottom:

1. Card top: a green pulsing "Live · today's pick" badge + an "Updated …" timestamp.
2. Rank line: "Top pick · {driveTime} from {origin}" — uppercase, `--ice`.
3. Mountain name `<h2>` — **serif (Spectral)**, 40px, weight 600.
4. Location/pass line — `--ink-3`.
5. **One** verdict sentence ("Best mix of fresh snow and low crowds within range today.").
6. **The read** — three labeled rows, NO ICONS:

```html
<div class="read">
  <div class="rrow">
    <span class="rname">Snow</span>
    <div class="rbody">
      <div class="rverdict good">4" fresh, groomers holding</div>
      <div class="rdetail">Wind-buffed up top — soft edges, fast lines all morning.</div>
    </div>
  </div>
  <div class="rrow">
    <span class="rname">Crowds</span>
    <div class="rbody">
      <div class="rverdict good">Quiet — wide open</div>
      <div class="rdetail">Midweek and off the Epic/Ikon network. Walk-on lifts.</div>
    </div>
  </div>
  <div class="rrow">
    <span class="rname">Game plan</span>
    <div class="rbody">
      <div class="rverdict warn">Rain late — keep it short</div>
      <div class="rdetail">Snow stays fast but turns wet by mid-afternoon. Ski the morning.</div>
    </div>
  </div>
</div>
```
Row CSS: `.rrow { display:grid; grid-template-columns:108px 1fr; gap:18px; align-items:baseline; padding:15px 0 }`,
`.rrow + .rrow { border-top:1px solid var(--line-soft) }`. `.rname` = 12px/700, uppercase,
`.08em` tracking, `--ink-3`. `.rverdict` = 16px/700; modifier classes `.good`/`.warn`/`.bad`
set the color. `.rdetail` = 13.5px, `--ink-2`.

   **Color rule:** each row's verdict color encodes sentiment — `good` (green) positive,
   `warn` (amber) caution, `bad` (red) negative. Each dimension (snow, crowds, plan) appears
   **once**. Do not re-list the same condition in multiple places.

7. Primary CTA button "See full forecast" — `--ice` bg, dark text, full width.
8. Divider, then a collapsible **"Why this beat the alternatives"** (expand/collapse, animated
   `grid-template-rows: 0fr → 1fr`) listing 1–2 runner-up mountains with reason + drive/crowd.
9. Card footer: a green **"Rankings never sponsored"** trust badge + the forecast date.

### Nav — fixes for the two bugs you reported
- **"Subscribe pushed too far right":** use `justify-content: space-between` on `<header>` and
  group links + Subscribe inside one `.nav-right` flex container. Do NOT use a loose flex-spacer
  element to push Subscribe over.
- **"Subscribe no longer works":** it must be a real `<button type="button">` (or an `<a>` with
  a click handler) wired to your subscribe flow — not an inert `<a href="#">`. In the reference
  it toggles to "Subscribed ✓" and turns green as click feedback; replace with the real action.
- Below 980px: hide `.links` (Subscribe stays, pinned right); `<main>` collapses to one column
  with the card below the form.

---

## 3. Filters + results (`Filters.html`)

### The core concept — DO NOT FLATTEN THIS
Filters are split into **two visually distinct zones** because they do different things:

- **"Must match" (hard filters — REMOVE mountains):** Max drive time · Pass · Mountain size ·
  State · Max ticket price (slider). Blue accent (`--ice`). Failing one drops a mountain out.
- **"Rank by what matters" (soft weights — REORDER, never hide):** Fresh snow · Quiet slopes.
  Each is a Skip / Nice / Top weight control. Teal accent (`--rank`). These change sort order
  only; nothing is removed.

Keep the two zones styled differently (blue vs teal) — that distinction is the whole point of
the redesign. Filter chips inherit the same colors (blue chip = hard filter, teal chip = ranking).

### Layout
- Desktop: two columns — **sticky filter panel left** (`position:sticky; top:24px`), **results
  right**. `grid-template-columns: 380px minmax(0,1fr)` with named grid-areas.
- Below ~1040px: stack to one column (results first, with the result strip pinned to top).

### Results region (right column)
1. **Result strip:** live match count (animated) + current top pick + "See top pick" button.
2. **Active-filter chips:** removable (✕) summary chips + "Reset all". Blue = hard, teal = rank.
3. **Ranked list:** one row per mountain — rank number, name (serif), pass + state + price,
   Snow / Crowds / Drive stats, and a **match-strength bar**. #1 row gets the `--ice` "Top pick"
   treatment.
4. **Empty state** ("No mountains match" + "Loosen the tightest one" button) when hard filters
   exclude everything.

### Behavior — must stay live
- Changing ANY filter instantly re-filters and re-ranks. No submit button. Count, chips, and
  list all update together.
- When ranking weights change, rows **animate to new positions** (the reference uses a FLIP
  transition — measure old rects, reorder DOM, invert with a transform, then transition to 0).
  Replicate this. Filtered-out rows fade/scale out.
- Logic lives in the reference script and should be ported almost verbatim:
  - `passesHard(m)` — returns true if a mountain clears every hard filter (drive cap, pass,
    size bucket, state, price ceiling).
  - `scoreDisplay(m)` — weighted average of normalized snow + quiet (0..1); with zero weights,
    falls back to nearest-first by drive time.
  - `sizeBucket(vert)` — `≤1300 → local`, `≤2100 → mid`, else `big`.

### The ONE data swap
The reference contains a hardcoded array:
```js
const MTNS = [ { name, st, drive, pass:[...], price, snow, crowd, vert }, … ]; // 18 entries
```
**Replace this array with live data from [your source].** Keep the field shape (or adapt
`passesHard`/`scoreDisplay` to your field names). Everything else — filtering, ranking,
animation, chips — works unchanged once real data flows in. `snow` is inches, `crowd` is a
0–100 busyness score (higher = busier), `vert` is vertical drop in feet, `drive` is minutes.

---

## 4. Acceptance checklist (verify before calling it done)
- [ ] Spectral font loads; mountain names render in serif (not Times).
- [ ] Nav: brand left, links + Subscribe grouped right; Subscribe is a working button.
- [ ] Homepage subhead is wide (≈46ch), not a narrow bunched column.
- [ ] Verdict card uses the 3-row "read" (Snow / Crowds / Game plan), no icons, color-coded.
- [ ] Filters page: two zones visually distinct (blue hard / teal ranking).
- [ ] Changing a hard filter removes rows; changing a weight reorders rows with animation.
- [ ] Result count, top pick, and chips update live with no submit.
- [ ] Both pages: fixed photo background with the readability veil; text stays legible.
- [ ] Responsive: homepage stacks <980px; filters stack <1040px.
- [ ] All colors use the tokens in §1b — no approximated hex values.

## 5. Don'ts
- Don't drop the Spectral `<link>`.
- Don't use a loose flex-spacer for the nav; group the right side and use space-between.
- Don't leave Subscribe as a dead `href="#"`.
- Don't merge the two filter zones into one undifferentiated list.
- Don't add a submit button to the filters — it's live.
- Don't re-list the same condition multiple times in the verdict card.
- Don't approximate the palette — use the oklch tokens.
