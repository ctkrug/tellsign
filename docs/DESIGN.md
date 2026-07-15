# Tellsign — design direction

## 1. Aesthetic direction

**Editorial redline.** Tellsign looks like a manuscript on a copy editor's
desk: warm cream paper, ink-black type, and a single crimson pen used
sparingly to mark exactly what's wrong and why. It's the opposite of a
sci-fi "AI scanner" UI — no scan lines, no neon, no probability dial. The
personality is *a sharp, honest editor*, not a machine passing judgment.

This is a deliberate departure from the dark-mode/glassy-neon palette common
across recent tool builds in this portfolio — paper-and-ink reads as more
credible for a tool whose whole pitch is "no black box, just receipts."

## 2. Tokens

```css
--bg:              #f3ecdd;  /* warm cream paper */
--surface-1:       #fbf7ee;  /* page/card white, warm */
--surface-2:       #e9dfc8;  /* recessed panel, deeper paper */
--text:             #211c15; /* ink */
--text-muted:       #6f6555; /* faded ink / pencil */
--accent:           #b3261e; /* redline crimson — the pen */
--accent-support:   #9c7a2e; /* aged gold — meter fill, secondary marks */
--success:          #3f6b3f; /* approving green ink */
--danger:           #b3261e; /* same as accent: red pen IS the warning */

--font-display:     "Fraunces", Georgia, "Times New Roman", serif;
--font-ui:          "Inter", -apple-system, "Segoe UI", sans-serif;
--font-mono:        "IBM Plex Mono", ui-monospace, "SFMono-Regular", monospace;

--space-unit:       8px;   /* 4/8 scale: 4 8 12 16 24 32 48 64 */
--radius:           4px;   /* sharp-ish corners, not app-rounded */
--shadow-paper:     0 1px 2px rgba(33,28,21,0.08), 0 4px 16px rgba(33,28,21,0.10);

--motion-ui:        180ms ease-out;   /* buttons, panels, focus rings */
--motion-highlight: 100ms ease-out;   /* a tell lighting up as you type */
```

Type pairing: **Fraunces** (display, a warm quirky serif with real
personality — used for the wordmark, page title, and section heads) paired
with **Inter** (UI text — body copy, labels, controls) and **IBM Plex Mono**
for the meter's numeric readout and tell counts, which should feel like a
tally stamped in a margin, not a dashboard stat.

## 3. Layout intent

The hero is **the manuscript**: a single large text surface where pasted
text renders with inline highlights. It is the primary interactive object
and owns the majority of the viewport.

- **Desktop (1440×900):** two-column working page. Left ~68% is the
  manuscript surface (paper card, generous padding, max text measure ~70ch
  so long paragraphs stay readable). Right ~32% is a fixed margin column:
  the AI-osity meter rendered as a vertical tally/gauge at the top, then a
  legend of tell categories with color keys, updating live as matches
  accumulate. The margin column reads like a copy editor's sidebar notes.
- **Phone (390×844):** single column. Manuscript surface first and full
  width, meter collapses to a horizontal bar pinned under the header (still
  visible while scrolling the text via a small sticky readout), category
  legend moves below the manuscript as a expandable "what got flagged"
  list.
- No dead space: the paper card fills the available column; the page
  background carries a subtle grain/texture treatment so cream doesn't read
  as a flat empty void behind the card.

## 4. Signature detail

The wordmark is stamped: "Tellsign" set in Fraunces with the two Ls sharing
a crimson underline that looks hand-drawn (a single wavering SVG stroke, not
a straight `border-bottom`) — like an editor circled it. The same stroke
motif reappears, smaller, whenever a word in the manuscript gets flagged:
instead of a flat highlight rectangle, flagged text gets a hand-drawn
underline in crimson (or gold for lower-severity tells) drawn as an inline
SVG path, animating in with a quick left-to-right draw-on (`stroke-dashoffset`
transition, ~180ms). That's the one flourish; everything else stays quiet
paper-and-ink so the redline marks are what draws the eye.

## 5. Juice plan

Tellsign is a utility, not a game, but input → feedback still needs to feel
alive:

- Typing/pasting triggers highlight passes debounced at ~120ms — fast enough
  that marks feel live, not laggy.
- Each new flagged span draws its underline in with the ~180ms stroke
  animation described above; the AI-osity meter's fill transitions with
  `--motion-ui` (180ms ease-out), never snapping.
- Hovering or tapping a flagged span pops a small paper-tag tooltip (subtle
  scale + fade, 120ms) naming the tell and category — styled like a sticky
  note, with `--shadow-paper`.
- No sound design: this is a quiet, focused writing tool, not a playful toy.
  A synth SFX layer would fight the "serious editor" personality.
- Respects `prefers-reduced-motion`: underline draw-on and meter fill become
  instant (no transition), tooltip keeps its fade but drops any scale/motion.
