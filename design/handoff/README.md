# WhereToSkiNext — Design Reference for Build-Out

Two working HTML/CSS/JS prototypes that define the look, layout, and behavior of the site.
Use them as the source of truth when building the production version.

## Files
- `Homepage.html` — hero + "find my mountain" input and the top-pick result card.
- `Filters.html` — two-column refine view: sticky filter panel (left) + live, re-ranking results list (right).
- `assets/hero.jpg` — background photo used by both pages (referenced as `assets/hero.jpg`).

## What is REAL vs. PLACEHOLDER
- **Real / keep:** all CSS (colors, type, spacing, layout), the filter UX (hard "Must match" filters vs. soft "Rank by" weights), the live result count, the chip system, and the FLIP re-ranking animation.
- **Placeholder / replace with live data:** the mountain dataset is a hardcoded array (`const MTNS = [...]`) inside `Filters.html`'s `<script>`. In production this should come from your live snow / drive-time / crowd APIs. The scoring logic (`passesHard()`, `scoreDisplay()`) shows exactly how filtering and ranking should work against that data.
- The homepage result card ("Cannon Mountain", drive time, etc.) is likewise sample content.

## Notes for implementation
- Colors are defined as CSS custom properties in the `:root` block at the top of each file (glacial blue accent, cool slate neutrals).
- Type: Helvetica/system sans for all UI and data; Spectral serif is used ONLY for mountain names.
- Both pages are responsive; `Filters.html` collapses from two columns to a stacked layout below ~1040px.
- No build step or dependencies — open either file directly in a browser to see it run.
