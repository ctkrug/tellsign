# Tellsign — vision

## The problem

"AI detector" tools are everywhere now, and almost all of them share the
same flaw: they output a probability with no explanation. A number like
"87% AI-generated" gives someone nothing to act on — they can't tell if it's
right, can't tell what specifically tripped it, and can't use it to improve
their own writing. Worse, these tools are frequently wrong in ways that
matter (false-flagging non-native English speakers, careful writers, or
just unlucky phrasing), and because the reasoning is hidden, nobody can
push back on a specific claim.

At the same time, GPT-era prose really does have a recognizable style: a
short list of words and phrasing patterns ("delve," "it's important to
note," rule-of-three lists, formal transition crutches) that show up in
model output at rates far above ordinary writing. That's real, observable,
and worth surfacing — just not as a verdict.

## Who it's for

Writers, editors, students, and anyone curious about their own prose who
wants a concrete, inspectable style check — not a yes/no verdict on
authorship. It's also for people who want to *roast* a suspiciously
robotic LinkedIn post or press release by pointing at exactly which words
gave it away. It is explicitly **not** built for high-stakes defensive use
(academic integrity enforcement, hiring screens) — the README and product
copy should discourage that use case, because a curated word list cannot
support that kind of decision.

## The core idea

Paste text in, get every documented tell highlighted inline, in real time,
each with a one-line explanation of why it's flagged. Alongside the text, a
meter fills based on the weighted density of matches — visible, honest math
anyone can audit, not a black-box score. There is no model call: the entire
corpus and scoring logic ship to the browser and are readable in this repo.
Trust comes from transparency, not from a claimed accuracy percentage.

## Key design decisions

- **No AI-probability score, ever.** The meter is explicitly framed as a
  density tally ("AI-osity," not "AI probability") to avoid implying
  statistical certainty the tool doesn't have. This is a hard constraint
  on the product, not just a v1 shortcut — see `docs/BACKLOG.md` for how
  build stories are scoped around it.
- **No model, no network calls, no login.** Matching is plain string/regex
  work against a curated corpus (`src/data/`). This keeps the tool free,
  instant, and privacy-preserving (pasted text never leaves the browser),
  and it means every match is explainable because it's just a lookup.
- **The corpus is the product.** Curation quality — precision (few false
  positives like flagging "delved" for "delve") and the plain-language
  explanations — matters more than corpus size. A single well-reasoned
  100-entry list beats a noisy 1000-entry one.
- **Static, zero-backend, subpath-hostable.** Ships as a static site with
  relative asset paths so it can be deployed anywhere, including a
  subpath like `apps.charliekrug.com/tellsign`, with no server component.
- **Editorial, not clinical.** The design direction (`docs/DESIGN.md`)
  reinforces the "honest editor" framing visually — paper and ink, a red
  pen, hand-drawn marks — rather than a scanner/dashboard aesthetic that
  would imply algorithmic certainty the tool doesn't claim to have.

## What "v1 done" looks like

- A curated corpus of at least ~80-100 tells across word- and
  phrase-level entries, spanning several categories (hedges, inflated
  verbs, transition crutches, rule-of-three patterns, disclaimers, vague
  intensifiers), each with a specific, accurate, plain-language
  explanation.
- Live highlighting with per-match tooltips, an AI-osity meter, and a
  category legend, matching `docs/DESIGN.md`'s direction and passing its
  design self-review.
- A landing/share experience good enough to post: a designed page (not
  just the raw tool) that explains the "honest style checker, not a
  detector" pitch before the paste box.
- A category toggle so people can tune which tell types apply to their
  own writing style.
- CI green, tests covering the matcher/scorer, no console errors, works
  on a fresh clone with `npm ci && npm run build`.
