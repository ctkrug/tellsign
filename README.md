# Tellsign

**▶ Live demo — [apps.charliekrug.com/tellsign](https://apps.charliekrug.com/tellsign/)**

See which words make your writing sound like AI. Paste a paragraph and the
specific words and phrasings documented as ChatGPT tells light up in place, live,
each with a plain-language reason and a running "AI-osity" meter.

[![CI](https://github.com/ctkrug/tellsign/actions/workflows/ci.yml/badge.svg)](https://github.com/ctkrug/tellsign/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-b3261e.svg)](LICENSE)

Tellsign is **not** a black-box AI detector. It doesn't claim to know whether a
paragraph was written by a model. It's a transparent style checker: every
highlighted word comes with the reason it's flagged, drawn from a curated,
inspectable corpus. No model call, no probability score pretending to be a fact,
just pattern matching you can read the source for.

## Sample output

Paste marketing copy and it redlines like this (crimson = strong tell, gold =
milder):

> [In today's] fast-paced world, [it's important to note] that we must [delve]
> into this topic. This solution [boasts] a [seamless], [robust], and incredibly
> scalable design.

Every bracketed span is a documented tell. Hover any one in the live tool to see
which category it belongs to and why it stands out.

## Who it's for

Writers, editors, students, and anyone whose draft "sounds like ChatGPT" but
can't say which words are doing it. Black-box detectors give you a scary
percentage with no explanation. Tellsign points at the actual words so you can
cut them, whether or not a model ever touched the text. It is not built for
academic-integrity enforcement or hiring screens, and it won't pretend a word
list can support that kind of decision.

## What it does

- Paste or type text into a live editor; matches highlight inline within a
  single debounce cycle (~120ms), no reload.
- Hovering or tapping a highlighted span pops a tooltip naming the specific tell
  and a plain-language reason it's flagged, drawn from an 80+ entry curated
  corpus across six categories: inflated verbs, hedges, transition crutches,
  rule-of-three padding, disclaimers, and vague intensifiers.
- An "AI-osity" meter fills alongside the text, a transparent tally of matches
  weighted by tell category, never a probabilistic verdict.
- A category legend doubles as a set of toggles: uncheck a category to drop its
  highlights immediately, no re-typing. The choice persists across reloads.
- "Try an example" loads a preset paragraph (AI-styled marketing copy vs. a
  plain status update) to see the contrast at a glance.
- "Copy summary" copies a plain-text tally (overall score plus per-category
  counts) to the clipboard, for sharing or roasting a suspicious post.
- Zero network calls after page load: no model, no login, no usage limits. The
  entire corpus and scoring logic ship in the client and are readable in the
  repo under [`src/data/`](src/data/).

## Run it locally

```
npm install
npm run dev        # local dev server with hot reload
npm test           # run the test suite
npm run build      # static bundle to dist/ (app + landing page)
```

The build emits a static site with relative asset paths, so it can be hosted
from any subpath with no server. `npm run test:coverage` runs the suite behind
an 85% line-coverage floor on the core matching, scoring, and rendering logic.

## How it works

`src/analyze.ts` scans text for every term in the corpus with whole-word,
case-insensitive regex (curly and straight apostrophes both match), scores the
matches by weight per hundred words, and `src/render.ts` wraps each hit in a
`<mark>`, skipping overlaps. The corpus itself lives in
[`src/data/`](src/data/) as plain, reviewable TypeScript. See
[`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) for the full layout and
[`docs/VISION.md`](docs/VISION.md) for the design rationale.

## Stack

Vanilla TypeScript, no framework. Built with [Vite](https://vitejs.dev/) and
tested with [Vitest](https://vitest.dev/). Ships as a static site (`dist/`).

## License

MIT, see [LICENSE](LICENSE).

---

More of Charlie's projects → [apps.charliekrug.com](https://apps.charliekrug.com)
