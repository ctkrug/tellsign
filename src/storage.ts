import type { TellCategory } from "./data/types";

const CATEGORY_KEY = "tellsign:disabled-categories";

/** Minimal Storage surface so this can be unit-tested without a DOM. */
export interface KeyValueStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

/** Categories the user has explicitly turned off, persisted across reloads. */
export function loadDisabledCategories(storage: KeyValueStorage): Set<TellCategory> {
  const raw = storage.getItem(CATEGORY_KEY);
  if (!raw) return new Set();
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return new Set();
    return new Set(parsed.filter((value): value is TellCategory => typeof value === "string"));
  } catch {
    return new Set();
  }
}

export function saveDisabledCategories(storage: KeyValueStorage, disabled: Set<TellCategory>): void {
  storage.setItem(CATEGORY_KEY, JSON.stringify(Array.from(disabled)));
}
