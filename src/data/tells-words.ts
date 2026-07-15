import type { Tell } from "./types";

/**
 * Single-word tells: verbs and intensifiers that show up in GPT-era
 * prose far more often than in typical human writing. Seed list —
 * expanded and re-weighted during the build phase per docs/BACKLOG.md.
 */
export const wordTells: Tell[] = [
  {
    id: "delve",
    term: "delve",
    kind: "word",
    category: "inflated-verb",
    weight: 3,
    explanation: '"Delve" is one of the most over-represented verbs in LLM output relative to everyday writing — reach for "look into" or "dig into" instead.',
  },
  {
    id: "boast",
    term: "boast",
    kind: "word",
    category: "inflated-verb",
    weight: 2,
    explanation: 'Used as a fancy stand-in for "has" or "includes" ("the phone boasts a large screen") — a marketing-copy tic models lean on heavily.',
  },
  {
    id: "underscore",
    term: "underscore",
    kind: "word",
    category: "inflated-verb",
    weight: 2,
    explanation: '"Underscore" as a verb for "emphasize" or "highlight" is disproportionately common in model output.',
  },
  {
    id: "elevate",
    term: "elevate",
    kind: "word",
    category: "inflated-verb",
    weight: 1,
    explanation: 'Vague uplift verb ("elevate your experience") common in AI-generated marketing-style copy.',
  },
  {
    id: "unleash",
    term: "unleash",
    kind: "word",
    category: "inflated-verb",
    weight: 1,
    explanation: 'High-energy verb ("unleash your potential") that reads as generated hype rather than specific claims.',
  },
  {
    id: "tapestry",
    term: "tapestry",
    kind: "word",
    category: "inflated-verb",
    weight: 3,
    explanation: '"Rich tapestry" is a stock metaphor models reach for when describing culture, history, or diversity in the abstract.',
  },
  {
    id: "robust",
    term: "robust",
    kind: "word",
    category: "vague-intensifier",
    weight: 1,
    explanation: 'Filler adjective applied broadly ("robust solution") without a concrete measure of what makes it robust.',
  },
  {
    id: "seamless",
    term: "seamless",
    kind: "word",
    category: "vague-intensifier",
    weight: 1,
    explanation: 'Overused claim of frictionlessness ("seamless integration") rarely backed by specifics.',
  },
  {
    id: "meticulous",
    term: "meticulous",
    kind: "word",
    category: "vague-intensifier",
    weight: 1,
    explanation: 'Praise-adjective ("meticulous attention to detail") that adds tone without adding information.',
  },
  {
    id: "furthermore",
    term: "furthermore",
    kind: "word",
    category: "transition-crutch",
    weight: 1,
    explanation: 'Formal connective used to open sentences at a rate far above typical human writing — most of the time a period would do.',
  },
  {
    id: "moreover",
    term: "moreover",
    kind: "word",
    category: "transition-crutch",
    weight: 1,
    explanation: 'Another over-formal connective models default to for adding a point, even in casual contexts.',
  },
];
