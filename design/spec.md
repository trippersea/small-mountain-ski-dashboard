# Homepage — Build Spec

Exact values for rebuilding `Homepage.html`. All colors are in **oklch**; sRGB hex fallbacks are given in parentheses for tools that need them.

---

## 1. Fonts (THIS IS THE "font not showing" FIX)

The serif used for mountain names is **Spectral** (Google Fonts). If you omit this import, mountain names silently fall back to Times/Georgia. Add to `<head>`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Spectral:ital,wght@0,400;0,500;0,600;1,400&display=swap" rel="stylesheet">
```

- **Sans (all UI + data):** `"Helvetica Neue", Helvetica, "Segoe UI", system-ui, sans-serif`
- **Serif (mountain names ONLY):** `"Spectral", Georgia, "Times New Roman", serif`

---

## 2. Color tokens (`:root`)

| Token | oklch | ~hex | Use |
|---|---|---|---|
| `--bg-0` | `oklch(0.16 0.025 248)` | `#15191f` | page base |
| `--bg-1` | `oklch(0.21 0.030 250)` | `#1e242d` | gradient top |
| `--panel` | `oklch(0.20 0.028 250 / .72)` | — | translucent panels |
| `--line` | `oklch(0.45 0.03 250 / .30)` | — | borders |
| `--line-soft` | `oklch(0.55 0.03 250 / .16)` | — | hairlines |
| `--ink` | `oklch(0.98 0.004 250)` | `#f7f8f9` | primary text |
| `--ink-2` | `oklch(0.86 0.012 250)` | `#d4d8dd` | body text |
| `--ink-3` | `oklch(0.74 0.030 240)` | `#a3acb8` | labels/eyebrows |
| `--ice` | `oklch(0.80 0.085 225)` | `#7cc3e8` | accent (the "ski" word, CTA) |
| `--ice-deep` | `oklch(0.66 0.115 232)` | `#2f8fd1` | accent borders, pressed pills |
| `--ice-deep-h` | `oklch(0.71 0.115 232)` | `#4ca0db` | pressed pill border |
| `--ice-ghost` | `oklch(0.66 0.115 232 / .16)` | — | accent tint fill |
| `--good` | `oklch(0.82 0.13 158)` | `#4fc98a` | "Quiet" / success |
| `--warn` | `oklch(0.83 0.11 78)` | `#e0b13e` | "Heads up" |

Radii: `--r: 14px`, `--r-sm: 10px`.

---

## 3. Type scale

| Element | size | weight | tracking | notes |
|---|---|---|---|---|
| Eyebrow | `12.5px` | 700 | `.14em` | uppercase, `--ink-3` |
| H1 hero | `clamp(44px, 5.6vw, 78px)` | 800 | `-0.025em` | line-height `.98`; "ski" in `--ice` |
| Subhead | `clamp(16px, 1.3vw, 19px)` | 400 | — | line-height `1.5`, `--ink-2`, **max-width 46ch** |
| Field label | `11.5px` | 700 | `.12em` | uppercase, `--ink-3` |
| Location field | `17px` | 600 | — | — |
| Pills | `14px` | 600 | — | — |
| Card: "Live · today's pick" | `12px` | 700 | `.1em` | uppercase |
| Card: mountain name | `40px` | 600 | `-0.01em` | **serif (Spectral)** |
| Stat value | `22px` | 700 | `-0.01em` | — |
| CTA | `16px` | 700 | — | dark text on `--ice` |

---

## 4. Nav (THIS IS THE "Subscribe too far right / broken" FIX)

Structure — brand on the left, a **single right-side group** holding the links + Subscribe. Do NOT use a stray flex-spacer; use `justify-content: space-between` on the header and group the right side:

```html
<header class="nav">           <!-- display:flex; align-items:center; justify-content:space-between; gap:40px; padding:20px 40px -->
  <div class="brand"> … WhereToSkiNext.com … </div>
  <div class="nav-right">      <!-- display:flex; align-items:center; gap:30px -->
    <nav class="links"> Browse · About · Stories · Pass Guides </nav>
    <button class="btn-sub" type="button">Subscribe</button>
  </div>
</header>
```

- **Subscribe must be a real `<button type="button">`** (or `<a>` with a click handler), not an inert `<a href="#">`. Wire it to your subscribe flow. In the reference it toggles label to "Subscribed ✓" and swaps to the green (`--good`) tinted style as click feedback.
- `.btn-sub`: `padding:9px 18px; border-radius:999px; border:1px solid var(--ice-deep); background:var(--ice-ghost); color:var(--ink); white-space:nowrap; cursor:pointer`. Hover → `background: oklch(0.66 0.115 232 / .28)`.
- The `.links` nav is `display:none` below 980px (Subscribe stays, pinned right by `space-between`).

---

## 5. Layout

- `<main>`: CSS grid, `grid-template-columns: minmax(0,1fr) minmax(0,0.92fr)`, `gap:64px`, `align-items:center`, `max-width:1340px`, `margin:0 auto`, `padding: clamp(40px,6vh,88px) 40px 64px`, `min-height: calc(100vh - 72px)`.
- Collapses to a single column below **980px** (card moves below the form; nav links hide).

## 6. Background

- Fixed, full-bleed photo `assets/hero.jpg`, `background-size:cover; background-position:62% 38%`.
- Readability veil over it (left-weighted so hero text stays legible):
  ```css
  linear-gradient(90deg, oklch(0.13 0.02 250 / 0.92) 0%, oklch(0.13 0.02 250 / 0.74) 30%,
                         oklch(0.13 0.02 250 / 0.30) 56%, oklch(0.13 0.02 250 / 0.12) 100%),
  linear-gradient(180deg, oklch(0.13 0.02 250 / 0.55) 0%, transparent 22%,
                          transparent 64%, oklch(0.11 0.02 250 / 0.55) 100%);
  ```

## 7. Components & behavior

- **Pill groups** (Pass / Trip / Day): single-select; pressed state uses `--ice-deep` bg + `--ice-deep-h` border + soft glow. Track state via `aria-pressed`.
- **Result card** (right): translucent (`backdrop-filter: blur(18px)`), `border-radius:22px`. Contains: live badge + "Updated" time, rank line, serif mountain name, location/pass line, one verdict sentence, a 3-up stat strip (Snow / Drive / Crowds), one "Heads up" caveat line, the primary CTA, a divider, a collapsible "Why this beat the alternatives", and a "Rankings never sponsored" trust badge.
- **Card data is placeholder** — make it a data-driven component; don't hardcode "Cannon Mountain".

---

## 8. Don'ts
- Don't drop the Spectral `<link>` (mountain names lose their serif).
- Don't position Subscribe with a loose spacer element — group it on the right.
- Don't leave Subscribe as a dead `href="#"`.
- Don't approximate colors — use the oklch tokens above.
