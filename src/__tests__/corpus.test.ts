import { describe, expect, it } from "vitest";
import { allTells } from "../data";
import type { TellCategory } from "../data/types";

const ALL_CATEGORIES: TellCategory[] = [
  "inflated-verb",
  "hedge",
  "transition-crutch",
  "rule-of-three",
  "disclaimer",
  "vague-intensifier",
];

describe("tell corpus", () => {
  it("has at least 80 curated entries", () => {
    expect(allTells.length).toBeGreaterThanOrEqual(80);
  });

  it("has unique ids", () => {
    const ids = allTells.map((t) => t.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("has unique terms per kind (no duplicate matcher for the same text)", () => {
    const keys = allTells.map((t) => `${t.kind}:${t.term.toLowerCase()}`);
    expect(new Set(keys).size).toBe(keys.length);
  });

  it("gives every entry a specific, non-placeholder explanation", () => {
    for (const tell of allTells) {
      expect(tell.explanation.length).toBeGreaterThanOrEqual(40);
      expect(tell.explanation.toLowerCase()).not.toBe("ai-sounding phrase");
    }
  });

  it("has at least 3 entries in every tell category", () => {
    for (const category of ALL_CATEGORIES) {
      const count = allTells.filter((t) => t.category === category).length;
      expect(count).toBeGreaterThanOrEqual(3);
    }
  });

  it("never has a blank or whitespace-only term", () => {
    // An empty term compiles to a zero-width /\b\b/ pattern in
    // analyze.ts's buildPattern — findMatches guards against the
    // resulting infinite loop, but the corpus should never rely on it.
    for (const tell of allTells) {
      expect(tell.term.trim().length).toBeGreaterThan(0);
    }
  });
});
