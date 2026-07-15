import type { Tell } from "./types";

/**
 * Multi-word tells: hedges, disclaimers, and stock transitions that
 * read as generated boilerplate. Seed list — expanded during the
 * build phase per docs/BACKLOG.md.
 */
export const phraseTells: Tell[] = [
  {
    id: "its-important-to-note",
    term: "it's important to note",
    kind: "phrase",
    category: "hedge",
    weight: 3,
    explanation: 'Throat-clearing hedge that delays the actual point — almost always deletable with no loss of meaning.',
  },
  {
    id: "in-todays-world",
    term: "in today's",
    kind: "phrase",
    category: "hedge",
    weight: 2,
    explanation: 'Generic scene-setting opener ("in today\'s fast-paced world") that establishes nothing specific before the real sentence starts.',
  },
  {
    id: "its-worth-noting",
    term: "it's worth noting",
    kind: "phrase",
    category: "hedge",
    weight: 2,
    explanation: 'Another throat-clearing hedge — states that a point is worth making instead of just making it.',
  },
  {
    id: "as-an-ai",
    term: "as an ai",
    kind: "phrase",
    category: "disclaimer",
    weight: 3,
    explanation: 'Direct model self-reference — a strong signal the text is unedited raw model output.',
  },
  {
    id: "i-cannot-provide",
    term: "i cannot provide",
    kind: "phrase",
    category: "disclaimer",
    weight: 3,
    explanation: 'Refusal-style disclaimer language from a model response, left in unedited.',
  },
  {
    id: "on-the-other-hand",
    term: "on the other hand",
    kind: "phrase",
    category: "transition-crutch",
    weight: 1,
    explanation: 'Formal contrast connective that shows up far more densely in model output than in typical writing.',
  },
  {
    id: "in-conclusion",
    term: "in conclusion",
    kind: "phrase",
    category: "transition-crutch",
    weight: 2,
    explanation: 'Essay-structure closer that reads as generated formality outside an actual essay context.',
  },
  {
    id: "not-only-but-also",
    term: "not only",
    kind: "phrase",
    category: "rule-of-three",
    weight: 2,
    explanation: 'Half of the "not only X, but also Y" construction models reach for to inflate a simple point into a balanced-sounding claim.',
  },
  {
    id: "whether-you-are-or",
    term: "whether you're",
    kind: "phrase",
    category: "rule-of-three",
    weight: 2,
    explanation: 'Stock audience-covering opener ("whether you\'re a beginner or an expert") that pads instead of specifying who the text is for.',
  },
];
