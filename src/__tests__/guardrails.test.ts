import { describe, expect, it } from "vitest";
import { findMatches } from "../analyze";
import { allTells } from "../data";

function idsOf(text: string): string[] {
  return findMatches(text, allTells).map((m) => m.tell.id);
}

describe("false-positive guardrails", () => {
  it("does not match 'delve' inside 'delved', 'delving', or unrelated words", () => {
    expect(idsOf("The developer delved into legacy code.")).not.toContain("delve");
    expect(idsOf("She spent the afternoon delving through the archive.")).not.toContain("delve");
    expect(idsOf("He shoveled snow off the driveway.")).not.toContain("delve");
  });

  it("still matches a standalone 'delve'", () => {
    expect(idsOf("Let's delve into the details.")).toContain("delve");
  });

  it("does not let a phrase tell span across unrelated adjacent sentences", () => {
    // "in conclusion" ends one sentence with "in" and starts the next with
    // "Conclusion" — the sentence break must prevent a false phrase match.
    const text = "Rainfall usually tapers off by late summer, tailing in. Conclusion: the drought persists regardless.";
    expect(idsOf(text)).not.toContain("in-conclusion");
  });

  it("still matches 'in conclusion' when it actually appears contiguously", () => {
    const text = "In conclusion, the results support the hypothesis.";
    expect(idsOf(text)).toContain("in-conclusion");
  });
});
