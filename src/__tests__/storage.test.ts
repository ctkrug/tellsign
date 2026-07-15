import { describe, expect, it } from "vitest";
import { loadDisabledCategories, saveDisabledCategories, type KeyValueStorage } from "../storage";

function fakeStorage(initial: Record<string, string> = {}): KeyValueStorage {
  const store = new Map(Object.entries(initial));
  return {
    getItem: (key) => store.get(key) ?? null,
    setItem: (key, value) => {
      store.set(key, value);
    },
  };
}

describe("loadDisabledCategories", () => {
  it("returns an empty set when nothing has been saved", () => {
    expect(loadDisabledCategories(fakeStorage())).toEqual(new Set());
  });

  it("returns an empty set for malformed JSON instead of throwing", () => {
    const storage = fakeStorage({ "tellsign:disabled-categories": "{not json" });
    expect(loadDisabledCategories(storage)).toEqual(new Set());
  });

  it("returns an empty set when the stored value isn't an array", () => {
    const storage = fakeStorage({ "tellsign:disabled-categories": '"hedge"' });
    expect(loadDisabledCategories(storage)).toEqual(new Set());
  });

  it("round-trips a saved set of categories", () => {
    const storage = fakeStorage();
    saveDisabledCategories(storage, new Set(["hedge", "disclaimer"]));
    expect(loadDisabledCategories(storage)).toEqual(new Set(["hedge", "disclaimer"]));
  });
});
