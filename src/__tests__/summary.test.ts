import { describe, expect, it } from "vitest";
import { buildSummary } from "../summary";
import { analyze } from "../analyze";
import type { Tell } from "../data/types";

const sampleTells: Tell[] = [
  { id: "delve", term: "delve", kind: "word", category: "inflated-verb", weight: 3, explanation: "test" },
  {
    id: "its-important-to-note",
    term: "it's important to note",
    kind: "phrase",
    category: "hedge",
    weight: 3,
    explanation: "test",
  },
];

const LABELS = { "inflated-verb": "Inflated verb", hedge: "Hedge" } as Record<string, string>;

describe("buildSummary", () => {
  it("reports a zero score and no category lines for empty input", () => {
    const summary = buildSummary(analyze("", sampleTells), LABELS as never);
    expect(summary).toBe("Tellsign AI-osity: 0/100 (0 tells in 0 words)");
  });

  it("tallies one line per matched category with its count", () => {
    const text = "It's important to note that we should delve into this and delve again.";
    const result = analyze(text, sampleTells);
    const summary = buildSummary(result, LABELS as never);
    expect(summary).toContain("Hedge: 1");
    expect(summary).toContain("Inflated verb: 2");
    expect(summary.split("\n")).toHaveLength(3);
  });
});
