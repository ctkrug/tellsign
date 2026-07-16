import type { AnalysisResult } from "./analyze";

/**
 * Builds the sentence announced by the meter's aria-live region. Kept
 * separate from the compact numeric readout so screen reader users get
 * the same context sighted users get from the meter + legend at a glance.
 */
export function describeScore(result: AnalysisResult): string {
  const tellWord = result.matches.length === 1 ? "tell" : "tells";
  const wordWord = result.wordCount === 1 ? "word" : "words";
  return `AI-osity ${result.score} out of 100 — ${result.matches.length} ${tellWord} found in ${result.wordCount} ${wordWord}.`;
}
