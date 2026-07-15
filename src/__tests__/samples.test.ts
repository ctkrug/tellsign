import { describe, expect, it } from "vitest";
import { samples } from "../data/samples";

describe("samples", () => {
  it("offers at least 2 presets", () => {
    expect(samples.length).toBeGreaterThanOrEqual(2);
  });

  it("has a unique id, non-empty label, and non-empty text for every sample", () => {
    const ids = samples.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const sample of samples) {
      expect(sample.label.length).toBeGreaterThan(0);
      expect(sample.text.trim().length).toBeGreaterThan(0);
    }
  });
});
