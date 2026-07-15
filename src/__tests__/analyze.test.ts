import { describe, expect, it } from "vitest";
import { findMatches, scoreMatches, analyze, excludeCategories } from "../analyze";
import type { Tell } from "../data/types";

const sampleTells: Tell[] = [
  {
    id: "delve",
    term: "delve",
    kind: "word",
    category: "inflated-verb",
    weight: 3,
    explanation: "test",
  },
  {
    id: "its-important-to-note",
    term: "it's important to note",
    kind: "phrase",
    category: "hedge",
    weight: 3,
    explanation: "test",
  },
];

describe("findMatches", () => {
  it("finds a whole-word match and reports correct offsets", () => {
    const text = "Let's delve into the details.";
    const matches = findMatches(text, sampleTells);
    expect(matches).toHaveLength(1);
    expect(matches[0].tell.id).toBe("delve");
    expect(text.slice(matches[0].start, matches[0].end)).toBe("delve");
  });

  it("does not match a substring inside a longer word", () => {
    const text = "The developer delved into legacy code."; // "delved", not "delve"
    const matches = findMatches(text, sampleTells);
    expect(matches).toHaveLength(0);
  });

  it("matches multi-word phrases", () => {
    const text = "It's important to note the deadline moved.";
    const matches = findMatches(text, sampleTells);
    expect(matches).toHaveLength(1);
    expect(matches[0].tell.id).toBe("its-important-to-note");
  });

  it("is case-insensitive", () => {
    const text = "Delve into it.";
    const matches = findMatches(text, sampleTells);
    expect(matches).toHaveLength(1);
  });

  it("returns matches in document order", () => {
    const text = "It's important to note that we should delve deeper.";
    const matches = findMatches(text, sampleTells);
    expect(matches.map((m) => m.tell.id)).toEqual(["its-important-to-note", "delve"]);
  });
});

describe("scoreMatches", () => {
  it("returns 0 for no words", () => {
    expect(scoreMatches([], 0)).toBe(0);
  });

  it("returns 0 for no matches", () => {
    expect(scoreMatches([], 100)).toBe(0);
  });

  it("increases with match weight and is capped at 100", () => {
    const heavyMatches = Array.from({ length: 50 }, () => ({
      tell: sampleTells[0],
      start: 0,
      end: 5,
      matchedText: "delve",
    }));
    expect(scoreMatches(heavyMatches, 10)).toBe(100);
  });
});

describe("excludeCategories", () => {
  it("returns the same tells unchanged when nothing is disabled", () => {
    expect(excludeCategories(sampleTells, new Set())).toEqual(sampleTells);
  });

  it("drops tells whose category is disabled", () => {
    const result = excludeCategories(sampleTells, new Set(["hedge"]));
    expect(result.map((t) => t.id)).toEqual(["delve"]);
  });

  it("returns an empty list when every category is disabled", () => {
    const result = excludeCategories(sampleTells, new Set(["hedge", "inflated-verb"]));
    expect(result).toHaveLength(0);
  });
});

describe("analyze", () => {
  it("combines matches, score, and word count for empty input", () => {
    const result = analyze("", sampleTells);
    expect(result.matches).toHaveLength(0);
    expect(result.score).toBe(0);
    expect(result.wordCount).toBe(0);
  });

  it("counts words and produces a nonzero score when tells are present", () => {
    const result = analyze("Let's delve into this.", sampleTells);
    expect(result.wordCount).toBe(4);
    expect(result.matches).toHaveLength(1);
    expect(result.score).toBeGreaterThan(0);
  });
});
