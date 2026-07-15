import { allTells, type Tell, type TellCategory } from "./data";

export interface Match {
  tell: Tell;
  start: number;
  end: number;
  matchedText: string;
}

export interface AnalysisResult {
  matches: Match[];
  /** 0-100, a transparent tally — not a probability. */
  score: number;
  wordCount: number;
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function buildPattern(term: string): RegExp {
  return new RegExp(`\\b${escapeRegExp(term)}\\b`, "gi");
}

/** Finds every occurrence of every tell in `text`, in document order. */
export function findMatches(text: string, tells: Tell[] = allTells): Match[] {
  const matches: Match[] = [];

  for (const tell of tells) {
    const pattern = buildPattern(tell.term);
    let result: RegExpExecArray | null;
    while ((result = pattern.exec(text)) !== null) {
      matches.push({
        tell,
        start: result.index,
        end: result.index + result[0].length,
        matchedText: result[0],
      });
      // avoid infinite loop on zero-length matches
      if (result[0].length === 0) pattern.lastIndex++;
    }
  }

  return matches.sort((a, b) => a.start - b.start);
}

function countWords(text: string): number {
  const trimmed = text.trim();
  if (trimmed.length === 0) return 0;
  return trimmed.split(/\s+/).length;
}

/**
 * A transparent density score, not a probability of AI authorship:
 * weighted tell matches per hundred words, capped at 100.
 */
export function scoreMatches(matches: Match[], wordCount: number): number {
  if (wordCount === 0) return 0;
  const totalWeight = matches.reduce((sum, m) => sum + m.tell.weight, 0);
  const perHundredWords = (totalWeight / wordCount) * 100;
  return Math.min(100, Math.round(perHundredWords * 10));
}

/** Returns only the tells whose category is not in `disabled`. */
export function excludeCategories(tells: Tell[], disabled: ReadonlySet<TellCategory>): Tell[] {
  if (disabled.size === 0) return tells;
  return tells.filter((tell) => !disabled.has(tell.category));
}

export function analyze(text: string, tells: Tell[] = allTells): AnalysisResult {
  const wordCount = countWords(text);
  const matches = findMatches(text, tells);
  return {
    matches,
    score: scoreMatches(matches, wordCount),
    wordCount,
  };
}
