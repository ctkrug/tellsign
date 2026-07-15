# Tellsign — architecture

A static, client-only Vite/TypeScript app. No backend, no build-time
network calls; the entire corpus and matching/scoring logic ship to the
browser and run there.

## Data flow

```
textarea input
      │  (120ms debounce)
      ▼
excludeCategories(allTells, disabled)   // src/analyze.ts — drop toggled-off categories
      │
      ▼
analyze(text, tells)                    // src/analyze.ts
      │  ├─ findMatches   → Match[] (tell, start, end, matchedText), sorted by start
      │  └─ scoreMatches  → 0-100 density score (not a probability)
      ▼
renderHighlights(text, matches)         // src/render.ts
      │  escapes HTML, wraps each non-overlapping match in <mark data-category
      │  data-explanation>, appends a trailing "\n" so the backdrop's
      │  scrollHeight tracks the textarea's
      ▼
#backdrop.innerHTML                     // src/main.ts — positioned behind/under
                                         // the transparent textarea (see below)
```

Meter fill/readout and the legend/category checkboxes re-render from the
same `analyze()` result on every update.

## Modules

- `src/analyze.ts` — pure matching/scoring. `findMatches` runs one
  case-insensitive, whole-word/phrase regex pass per tell over the raw
  text; `scoreMatches` sums weighted matches per 100 words, capped at 100.
  `excludeCategories` filters the tells array before matching (how
  category toggles work — no change to the matcher itself).
- `src/render.ts` — turns `(text, matches)` into highlighted HTML. Matches
  are expected pre-sorted by start; a match starting before the current
  cursor is skipped, so overlapping tells never produce nested/duplicated
  marks. Stripping the `<mark>` tags and un-escaping entities always
  reconstructs the original text exactly (see the round-trip test).
- `src/dom.ts` — `escapeHtml`, used by render.ts.
- `src/summary.ts` — `buildSummary` turns an `AnalysisResult` into the
  plain-text tally copied by the "Copy summary" control.
- `src/storage.ts` — `loadDisabledCategories`/`saveDisabledCategories`
  persist category-toggle state through a minimal `KeyValueStorage`
  interface (so it's unit-testable without a DOM); `main.ts` wraps real
  `localStorage` with a probe/fallback in case it's unavailable.
- `src/data/` — the corpus. `tells-words.ts` (single-word tells) and
  `tells-phrases.ts` (multi-word tells) export arrays merged into
  `allTells` by `data/index.ts`. `data/samples.ts` holds the "try an
  example" presets. `data/types.ts` defines `Tell`/`TellCategory`/`TellKind`.
- `src/main.ts` — the only stateful module. Builds the DOM once, wires
  input/legend/sample/copy events, and owns the debounce timer, the
  disabled-categories set, and the last `AnalysisResult` (for the copy
  button).
- `src/styles/tokens.css` — design tokens (colors, type, spacing, motion)
  from `docs/DESIGN.md`. `src/styles/app.css` — component styles.

## The overlay trick (and its gotcha)

The manuscript is a transparent `<textarea>` stacked over a `<div
id="backdrop">` that renders the same text with highlight `<mark>`s. Both
share identical font/line-height/padding so they line up character-for-
character. The backdrop must sit **above** the textarea in stacking order
(`z-index`) with `pointer-events: none` everywhere except `.tell` marks
(`pointer-events: auto`) — otherwise the textarea silently intercepts every
hover/tap before it reaches a mark and tooltips never fire (this was an
actual bug fixed during BUILD; see the fix commit for `app.css`).

Scroll is synced by **ratio**, not raw pixel copy: the textarea's native
scrollbar can make its content box a few px narrower than the backdrop
div's, giving each a slightly different `scrollHeight`. Copying `scrollTop`
1:1 drifts a few px out of alignment near the bottom of a long paste;
scaling by `scrollTop / maxScroll` keeps both ends exactly aligned
regardless of that difference.

## Tooltip

Hover, focus-within, or `touchstart` on a `.tell` mark (delegated on
`#backdrop`) reads `data-category`/`data-explanation` and positions a
single `#tooltip` element (`position: fixed`, built from `getBoundingClientRect`)
near it — a themed replacement for the native `title` attribute.

## Running it

- `npm run dev` — Vite dev server.
- `npm test` — Vitest (all logic in `analyze.ts`/`render.ts`/`summary.ts`/
  `storage.ts`/`data/` is pure and unit-tested; `main.ts`'s DOM wiring is
  not covered by the automated suite — verify interactively in a browser).
- `npm run typecheck` — `tsc -b --noEmit`.
- `npm run build` — outputs a static, relative-path bundle to `dist/`,
  deployable at any subpath (`base: "./"` in `vite.config.ts`).
