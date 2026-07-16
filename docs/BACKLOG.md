# Tellsign — backlog

Epics and stories for the build. All start unchecked. Every story has
concrete, verifiable acceptance criteria — a later run should be able to
confirm each one true or false without judgment calls.

Story 1.1 is the wow moment and must land first.

## Epic 1 — Core highlighting experience

### [x] 1.1 Wow moment: live paste-and-highlight with the AI-osity meter
- [x] Pasting a paragraph containing a corpus word (e.g. "delve") highlights
      it inline within one debounce cycle (120ms) with no page reload.
- [x] Hovering (or tapping, on touch) a highlighted span shows a tooltip
      naming the specific tell and a one-line, non-generic reason. This was
      actually broken until this run: the textarea painted above the
      highlight backdrop in stacking order and silently ate every hover/tap
      before it reached a mark (see fix commit d0fb44f, found via a
      headless-browser check — `title`-attribute hover never worked either).
- [x] The AI-osity meter fill and numeric readout update to reflect the
      current text any time the matches change.

### [x] 1.2 Scroll-synced overlay correctness
- [x] Scrolling the textarea keeps highlighted marks visually aligned with
      the underlying text at the top, middle, and bottom of a long paste.
      Verified with a headless-browser check driving real scroll events on
      a 40-paragraph paste; fixed a real drift bug (see fix commit
      f878058) where 1:1 pixel-copied scrollTop drifted a few px out of
      sync near the bottom because the textarea and backdrop div have
      slightly different content-box widths (native scrollbar). Switched
      to ratio-based sync so both ends always line up exactly.
- [x] Dragging the textarea's resize handle does not desync the backdrop
      from the input (checked at at least one resized height). Verified
      by resizing the input and re-checking scroll alignment.

### [x] 1.3 Non-overlapping match resolution
- [x] When two tell matches overlap (e.g. a flagged phrase containing a
      separately flagged word), the render shows exactly one mark for that
      span, not a corrupted or duplicated one.
- [x] The highlighted backdrop's plain-text content (marks stripped) is
      character-for-character identical to the raw textarea value.

### [x] 1.4 Design polish: manuscript and meter surfaces
- [x] The manuscript card, meter, and legend match `docs/DESIGN.md`'s
      tokens (colors, radius, shadow) — verified by a side-by-side check
      against the token values.
- [x] The wordmark's hand-drawn underline draw-on animation plays once on
      load and is skipped (instant, no animation) when
      `prefers-reduced-motion: reduce` is set.
- [x] Layout is composed with no horizontal scroll and no dead empty
      margins at 390px, 768px, and 1440px viewport widths. Verified with a
      headless-browser check: `document.documentElement.scrollWidth` equals
      `clientWidth` at all three breakpoints (390/768/1440), no overflow.

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

### [x] 2.4 Design polish: legend and tooltip readability
- [x] The tooltip is restyled from the native browser `title` to the
      "paper-tag" treatment described in `docs/DESIGN.md` (sticky-note
      shadow, fade/scale-in), with the same content.
- [x] Legend swatch colors against `--surface-1` meet 3:1 contrast
      (non-text UI component minimum) and the mark's border color against
      its background meets 4.5:1 for the underlined text. Computed with
      WCAG relative-luminance math: legend swatch (`--accent-support` vs
      `--surface-1`) is 3.75:1; mark borders are 5.43:1 (mild, using the
      new `--accent-support-ink`), 4.54:1 (medium), 5.04:1 (strong) — all
      pass. The mild tier failed at 3.08:1 before the `--accent-support-ink`
      fix in commit 2ced886.

## Epic 3 — Category controls and sharing

### [x] 3.1 Toggle tell categories on/off
- [x] Unchecking a category checkbox in the sidebar immediately removes
      that category's highlights from the manuscript without requiring
      re-typing or re-pasting.
- [x] Category toggle state persists across a page reload via
      `localStorage`.

### [x] 3.2 Shareable summary
- [x] A "copy summary" control copies a plain-text tally (overall score
      plus a per-category match count) to the clipboard.
- [x] After a successful copy, the control shows a confirmed state (e.g.
      "Copied!") for at least 1.5 seconds before reverting.

### [x] 3.3 Sample text loader
- [x] A "try an example" control offers at least 2 preset sample
      paragraphs and loads the chosen one into the editor on selection.
- [x] Loading a sample immediately triggers highlighting and a meter
      update with no further user action required.

### [x] 3.4 Design polish: control states
- [x] Every interactive control added in this epic (checkboxes, copy
      button, sample picker) has themed hover, focus-visible, active, and
      disabled states — none render as an unstyled native widget.
- [x] All new touch targets are at least 44x44px.

## Epic 4 — Landing page and accessibility

### [x] 4.1 Landing/share page
- [x] `site/` contains a static landing page that states the "honest style
      checker, not a black-box detector" pitch before any tool UI, using
      the same tokens and type pairing as `docs/DESIGN.md`. It's a second,
      JS-free Vite entry (`vite.config.ts`) built to `dist/site/` alongside
      the app in one `npm run build`.
- [x] The landing page links to the live tool (hero + final CTA, both
      `../index.html`) and includes the favicon and wordmark consistent
      with the app; the app's header now links back ("What is this?" →
      `./site/`) so the two read as one product, not two builds.

### [x] 4.2 Accessibility pass
- [x] Every interactive control (textarea, category toggles, copy button,
      sample picker) is reachable and operable via keyboard alone, in a
      sane tab order. Verified with a headless-browser check driving 14
      sequential Tab presses at 1440px: header link → textarea → 6
      category checkboxes → 2 sample buttons → copy button → wraps to
      body/header, all native elements so no extra wiring was needed.
      Individual `.tell` marks are deliberately left out of the tab order
      (see `docs/ARCHITECTURE.md` Tooltip section) — making every match in
      a long paste a tab stop would break this same sane-order requirement
      for the controls actually listed above.
- [x] No icon-only buttons exist in this build (every control has visible
      text), so no `aria-label` gap there. The meter readout is announced
      via a new `#meter-live` `aria-live="polite"` region driven by
      `describeScore()` (`src/a11y.ts`, unit-tested) — verified by typing
      into the textarea headlessly and reading the live region's updated
      text. Went further than the letter of this story: the meter also
      carries `role="progressbar"` + `aria-valuenow`, sidebar section
      labels are real `<h2>`s (were styled `div`s, so heading-based
      navigation skipped them), and the copy button's own confirmation
      text change is reliably announced via `aria-live` on the button.

### [x] 4.3 Design polish: brand consistency across app and landing page
- [x] The landing page and the app pass the D4 ship-gate checklist:
      no anti-generic bans (no gray-card-with-emoji rows, no system-font
      or unstyled-control fallback), a generated favicon (not the default
      globe) on both pages, and the hero content fills the viewport on
      both (checked at 390/768/1440 — no horizontal scroll, no dead
      margins, screenshots reviewed at all three).
- [x] Both pages set `color-scheme: light` (`tokens.css`, and a matching
      `<meta name="color-scheme">` on `site/index.html`), so a dark OS
      preference doesn't auto-invert native form controls/scrollbars
      against the paper palette. Verified with a headless browser launched
      with `colorScheme: 'dark'`: computed `body` background stayed the
      cream `--bg` value, no white flash.
