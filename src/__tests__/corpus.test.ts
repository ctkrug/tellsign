import { describe, expect, it } from "vitest";
import { findMatches } from "../analyze";
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

  it("catches 'boasts', the exact inflected form its own explanation cites as the example", () => {
    // The "boast" entry's explanation literally uses "the phone boasts a
    // large screen" as its example — the corpus's own preset marketing-copy
    // sample and the scoring fixture both use this inflected form too, so
    // the whole-word matcher must recognize it, not just the bare "boast".
    const ids = findMatches("Our platform boasts a robust design.", allTells).map((t) => t.tell.id);
    expect(ids.some((id) => id.includes("boast"))).toBe(true);
  });

  it("catches 'fosters', the exact inflected form used in the shipped marketing-copy sample", () => {
    // Same gap as "boast"/"boasts": the shipped marketing-copy preset
    // ("it fosters a comprehensive, holistic approach") uses this
    // inflected form, but the whole-word matcher only recognizes the
    // bare "foster" it's keyed on.
    const ids = findMatches("It fosters a comprehensive approach.", allTells).map((t) => t.tell.id);
    expect(ids.some((id) => id.includes("foster"))).toBe(true);
  });

  it("never has a word tell whose own explanation cites an inflected form nothing in the corpus matches", () => {
    // Generalizes the boast/boasts and foster/fosters fixes into a
    // standing guard: the matcher is exact whole-word by design, so any
    // future word tell whose explanation demonstrates itself with an
    // inflected example ("...boasts a large screen") needs either that
    // form to be matchable too, or a different example in its prose.
    const gaps: string[] = [];
    for (const tell of allTells) {
      if (tell.kind !== "word") continue;
      for (const suffix of ["s", "ed", "ing", "es"]) {
        const candidate = tell.term + suffix;
        if (!new RegExp(`\\b${candidate}\\b`, "i").test(tell.explanation)) continue;
        if (findMatches(candidate, allTells).length === 0) {
          gaps.push(`${tell.id}: explanation uses "${candidate}" but no corpus entry matches it`);
        }
      }
    }
    expect(gaps).toEqual([]);
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
