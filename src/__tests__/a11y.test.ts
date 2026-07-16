import { describe, expect, it } from "vitest";
import { describeScore } from "../a11y";
import { analyze } from "../analyze";
import type { Tell } from "../data/types";

const delve: Tell = {
  id: "delve",
  term: "delve",
  kind: "word",
  category: "inflated-verb",
  weight: 3,
  explanation: "test",
};

describe("describeScore", () => {
  it("describes empty input with singular word/tell forms", () => {
    expect(describeScore(analyze("", [delve]))).toBe("AI-osity 0 out of 100 — 0 tells found in 0 words.");
  });

  it("uses singular 'tell' and 'word' for a one-word, one-match result", () => {
    expect(describeScore(analyze("delve", [delve]))).toBe("AI-osity 100 out of 100 — 1 tell found in 1 word.");
  });

  it("uses plural forms once counts exceed one", () => {
    const result = analyze("delve delve", [delve]);
    expect(describeScore(result)).toBe(`AI-osity ${result.score} out of 100 — 2 tells found in 2 words.`);
  });
});
