# Tellsign — backlog

Epics and stories for the build. All start unchecked. Every story has
concrete, verifiable acceptance criteria — a later run should be able to
confirm each one true or false without judgment calls.

Story 1.1 is the wow moment and must land first.

## Epic 1 — Core highlighting experience

### [ ] 1.1 Wow moment: live paste-and-highlight with the AI-osity meter
- [ ] Pasting a paragraph containing a corpus word (e.g. "delve") highlights
      it inline within one debounce cycle (120ms) with no page reload.
- [ ] Hovering (or tapping, on touch) a highlighted span shows a tooltip
      naming the specific tell and a one-line, non-generic reason.
- [ ] The AI-osity meter fill and numeric readout update to reflect the
      current text any time the matches change.

### [ ] 1.2 Scroll-synced overlay correctness
- [ ] Scrolling the textarea keeps highlighted marks visually aligned with
      the underlying text at the top, middle, and bottom of a long paste.
- [ ] Dragging the textarea's resize handle does not desync the backdrop
      from the input (checked at at least one resized height).

### [ ] 1.3 Non-overlapping match resolution
- [ ] When two tell matches overlap (e.g. a flagged phrase containing a
      separately flagged word), the render shows exactly one mark for that
      span, not a corrupted or duplicated one.
- [ ] The highlighted backdrop's plain-text content (marks stripped) is
      character-for-character identical to the raw textarea value.

### [ ] 1.4 Design polish: manuscript and meter surfaces
- [x] The manuscript card, meter, and legend match `docs/DESIGN.md`'s
      tokens (colors, radius, shadow) — verified by a side-by-side check
      against the token values.
- [x] The wordmark's hand-drawn underline draw-on animation plays once on
      load and is skipped (instant, no animation) when
      `prefers-reduced-motion: reduce` is set.
- [ ] Layout is composed with no horizontal scroll and no dead empty
      margins at 390px, 768px, and 1440px viewport widths. **Not yet
      visually verified in a real browser this run — do in QA.**

## Epic 2 — Corpus depth and accuracy

### [x] 2.1 Expand the tell corpus to 80-100 curated entries
- [x] `src/data/tells-words.ts` and `src/data/tells-phrases.ts` combined
      contain at least 80 entries.
- [x] Every entry has a non-placeholder `explanation` of at least 40
      characters that names the specific pattern, not a generic "AI-sounding
      phrase" filler.

### [x] 2.2 False-positive guardrails for matching
- [x] A regression test confirms `findMatches` does not match "delve"
      inside "delved," "delving," or unrelated words like "shoveled."
- [x] A regression test confirms a multi-word phrase tell does not
      false-positive across unrelated adjacent sentences (e.g. the end of
      one sentence plus the start of the next never concatenates into a
      phrase match).

### [x] 2.3 Category weighting review
- [x] Every `TellCategory` has at least 3 corpus entries.
- [x] A snapshot test asserts a curated "obviously AI-styled" sample
      paragraph scores at least 2x higher than a curated "obviously plain
      human" sample paragraph of similar length.

### [ ] 2.4 Design polish: legend and tooltip readability
- [ ] The tooltip is restyled from the native browser `title` to the
      "paper-tag" treatment described in `docs/DESIGN.md` (sticky-note
      shadow, fade/scale-in), with the same content.
- [ ] Legend swatch colors against `--surface-1` meet 3:1 contrast
      (non-text UI component minimum) and the mark's border color against
      its background meets 4.5:1 for the underlined text.

## Epic 3 — Category controls and sharing

### [x] 3.1 Toggle tell categories on/off
- [x] Unchecking a category checkbox in the sidebar immediately removes
      that category's highlights from the manuscript without requiring
      re-typing or re-pasting.
- [x] Category toggle state persists across a page reload via
      `localStorage`.

### [ ] 3.2 Shareable summary
- [ ] A "copy summary" control copies a plain-text tally (overall score
      plus a per-category match count) to the clipboard.
- [ ] After a successful copy, the control shows a confirmed state (e.g.
      "Copied!") for at least 1.5 seconds before reverting.

### [x] 3.3 Sample text loader
- [x] A "try an example" control offers at least 2 preset sample
      paragraphs and loads the chosen one into the editor on selection.
- [x] Loading a sample immediately triggers highlighting and a meter
      update with no further user action required.

### [ ] 3.4 Design polish: control states
- [ ] Every interactive control added in this epic (checkboxes, copy
      button, sample picker) has themed hover, focus-visible, active, and
      disabled states — none render as an unstyled native widget.
- [ ] All new touch targets are at least 44x44px.

## Epic 4 — Landing page and accessibility

### [ ] 4.1 Landing/share page
- [ ] `site/` contains a static landing page that states the "honest style
      checker, not a black-box detector" pitch before any tool UI, using
      the same tokens and type pairing as `docs/DESIGN.md`.
- [ ] The landing page links to the live tool and includes the favicon and
      wordmark consistent with the app — a reviewer should not be able to
      tell the landing page and the app were built separately.

### [ ] 4.2 Accessibility pass
- [ ] Every interactive control (textarea, category toggles, copy button,
      sample picker) is reachable and operable via keyboard alone, in a
      sane tab order.
- [ ] Icon-only buttons (if any) carry an `aria-label`; the meter readout
      updates are announced via a live region.

### [ ] 4.3 Design polish: brand consistency across app and landing page
- [ ] The landing page and the app pass the D4 ship-gate checklist from
      the shared design standard (no anti-generic bans present, favicon
      present, hero content fills the viewport on both pages).
- [ ] Both light rendering (the only treatment planned) honor
      `prefers-color-scheme: dark` by not producing a jarring pure-white
      flash — verified by toggling OS color scheme and reloading.
