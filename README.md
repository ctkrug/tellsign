# Tellsign

Paste any text and watch it highlight the specific words and phrasing patterns
documented as LLM writing tells — live, in the browser, with an "AI-osity"
meter that fills as tells accumulate.

Tellsign is **not** a black-box AI detector. It doesn't claim to know whether
a paragraph was written by a model. It's a transparent style checker: every
highlighted word or phrase comes with a plain-language reason it's flagged,
drawn from a curated, inspectable corpus. No model call, no probability
score pretending to be a fact — just pattern matching you can read the source
for.

## Why

"AI detector" tools sell certainty they can't back up — a percentage with no
explanation, trained on data nobody can inspect, wrong often enough to ruin
someone's day. Meanwhile, actual GPT-era prose has real, nameable tells:
"delve," "it's important to note," the rule-of-three cadence, throat-clearing
hedges, em-dash overuse. Tellsign surfaces those directly. You can see
exactly why a word lit up, decide for yourself if it's fair, and use it to
edit your own writing — whether or not a model touched it.

## What it does

- Paste or type text into a live editor; matches highlight inline within a
  single debounce cycle (~120ms), no reload.
- Hovering or tapping a highlighted span pops a tooltip naming the specific
  tell and a plain-language reason it's flagged, drawn from an 80+ entry
  curated corpus across six categories (inflated verbs, hedges, transition
  crutches, rule-of-three padding, disclaimers, vague intensifiers).
- An "AI-osity" meter fills alongside the text — a transparent tally of
  matches weighted by tell category, never a probabilistic verdict.
- A category legend doubles as a set of toggles: uncheck a category to drop
  its highlights immediately, no re-typing required. The choice persists
  across reloads.
- "Try an example" loads a preset paragraph (AI-styled marketing copy vs. a
  plain status update) to see the contrast immediately.
- "Copy summary" copies a plain-text tally (overall score + per-category
  match counts) to the clipboard, for sharing or roasting a suspicious post.
- Zero network calls after page load: no model, no login, no usage limits.
  The entire corpus and scoring logic ship in the client and are readable in
  the repo.

## Planned features

- A landing/share page (`site/`) with the "honest style checker, not a
  detector" pitch, using the same design system as the tool.
- A full accessibility pass (keyboard-operable tooltips, live-region meter
  announcements).

## Stack

Vanilla TypeScript, no framework — built with [Vite](https://vitejs.dev/) for
dev/build tooling, tested with [Vitest](https://vitest.dev/). Ships as a
static site (`dist/`) with relative asset paths so it can be hosted from any
subpath, no server required.

## Status

Core highlighting, corpus, category toggles, sample loader, and sharing are
built and tested. The landing page and a full accessibility pass are next.
See [`docs/VISION.md`](docs/VISION.md) for the full design rationale,
[`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) for how it's built, and
[`docs/BACKLOG.md`](docs/BACKLOG.md) for the build plan.

## License

MIT — see [LICENSE](LICENSE).
