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

- Paste or type text into a live editor.
- Matching words and phrases highlight inline as you type, each with a
  tooltip naming the specific tell ("hedging opener," "corporate rule of
  three," "delve-class verb," ...) and why it's on the list.
- An "AI-osity" meter fills alongside the text — a transparent tally of
  matches weighted by tell category, never a probabilistic verdict.
- Zero network calls after page load: no model, no login, no usage limits.
  The entire corpus and scoring logic ship in the client and are readable in
  the repo.

## Planned features

- A curated, categorized corpus of lexical tells (individual words/phrases)
  and structural tells (patterns like rule-of-three lists or hedge-heavy
  openers).
- Per-category weighting so the meter reflects severity, not just count.
- Hover/tap tooltips explaining each match in plain language.
- Shareable results (copy a summary, or a permalink-style state) so people
  can compare their own writing or roast a suspicious email.
- A settings panel to toggle tell categories on/off, for people who want to
  tune it to their own voice.

## Stack

Vanilla TypeScript, no framework — built with [Vite](https://vitejs.dev/) for
dev/build tooling, tested with [Vitest](https://vitest.dev/). Ships as a
static site (`dist/`) with relative asset paths so it can be hosted from any
subpath, no server required.

## Status

Early scaffold. See [`docs/VISION.md`](docs/VISION.md) for the full design
rationale and [`docs/BACKLOG.md`](docs/BACKLOG.md) for the build plan.

## License

MIT — see [LICENSE](LICENSE).
