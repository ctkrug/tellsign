---
title: "I built a style checker that shows its work instead of guessing 'AI or not'"
published: false
tags: javascript, typescript, webdev, showdev
---

Every "AI detector" I've tried does the same thing: it eats your paragraph and
spits out a number. "87% AI." No explanation, no way to check it, no way to argue
with it. And the numbers are wrong often enough to get real people in real
trouble. A tool that hands you a verdict you can't inspect isn't helping you; it's
asking you to trust it.

So I built the opposite. [Tellsign](https://apps.charliekrug.com/tellsign/) is a
transparent style checker. You paste text, and the specific words and phrasings
that show up disproportionately in LLM output light up in place, each one with a
plain-language reason it's flagged. There's a running "AI-osity" meter, but it's
an honest tally of matches, not a probability of authorship. The whole corpus and
the scoring math ship in the browser and are readable in the repo. Nothing is
hidden, because the entire pitch is that nothing is hidden.

Here are the parts that were more interesting to build than I expected.

## Highlighting inside a textarea

You can't put colored `<mark>` spans inside a `<textarea>`. Contenteditable would
let me, but contenteditable is a swamp of selection bugs and pasted-formatting
surprises, and I wanted the plain, reliable behavior of a real textarea.

The trick is two layers. A transparent textarea sits on top; a `div` backdrop
sits behind it with identical font, padding, and line-height. On every input I
re-render the backdrop with the matched spans wrapped in `<mark>`, and the
textarea's own text is set to `transparent` with a visible caret. You type into
the textarea, but you see the highlights painted behind it, perfectly aligned.

The one gotcha is scrolling. The textarea's native scrollbar can make its content
box a couple of pixels narrower than the backdrop's, so a 1:1 `scrollTop` copy
drifts out of alignment near the bottom of a long paste. Syncing by scroll *ratio*
instead of raw pixels fixed it:

```js
const maxInput = input.scrollHeight - input.clientHeight;
const maxBackdrop = backdrop.scrollHeight - backdrop.clientHeight;
const ratio = maxInput > 0 ? input.scrollTop / maxInput : 0;
backdrop.scrollTop = maxBackdrop > 0 ? ratio * maxBackdrop : 0;
```

## Exact matching, on purpose

My first instinct was to stem: match "delve" and let it also catch "delved" and
"delving." That's wrong for this tool. "Delved into legacy code" is normal
writing; the tell is the bare present-tense "delve" in "let's delve into this."
Stemming also lit up "shoveled" because it contains "hovel"-ish fragments once you
start being clever. So the matcher is deliberately whole-word and literal: a
`\b`-anchored, case-insensitive regex per term.

The cost is that inflected forms need their own corpus entries. When "boasts" and
"fosters" appeared in my own sample copy and *didn't* highlight, that wasn't a bug
in the matcher; it was a missing entry. I added them as first-class tells and
wrote tests that fail if the shipped sample paragraph ever stops matching its own
example words. Exactness you can reason about beats cleverness you can't.

One more small thing that mattered: text pasted from Word, Docs, or a chat UI
carries a curly apostrophe (U+2019), not a straight one. "It's important to note"
wouldn't match text that used "it's" with the typographic quote. The pattern
builder swaps any `'` in a term for a character class that accepts both.

## What I'd do differently

The corpus is hand-curated, which is the honest part but also the limiting part.
A next version could let you paste in a reference sample of your own writing and
weight the tells against your baseline, so a word you legitimately use a lot
counts for less. I'd also like per-sentence density rather than a single
whole-document score, since one dense paragraph can hide in a long clean piece.

It's vanilla TypeScript, built with Vite, tested with Vitest behind an 85%
coverage floor on the matching and scoring logic. No framework, no backend, no
network call after the page loads.

Try it on something you wrote: <https://apps.charliekrug.com/tellsign/>
Source: <https://github.com/ctkrug/tellsign>

I'd genuinely like to know which flagged words you disagree with, because that's
the corpus's next edit.
