import type { AnalysisResult } from "./analyze";
import type { TellCategory } from "./data/types";

/**
 * Builds a plain-text tally of an analysis: the overall AI-osity score plus
 * a per-category match count, in the order categories first appear.
 */
export function buildSummary(result: AnalysisResult, categoryLabels: Record<TellCategory, string>): string {
  const counts = new Map<TellCategory, number>();
  for (const match of result.matches) {
    counts.set(match.tell.category, (counts.get(match.tell.category) ?? 0) + 1);
  }

  const lines = [`Tellsign AI-osity: ${result.score}/100 (${result.matches.length} tells in ${result.wordCount} words)`];
  for (const [category, count] of counts) {
    lines.push(`${categoryLabels[category]}: ${count}`);
  }
  return lines.join("\n");
}
