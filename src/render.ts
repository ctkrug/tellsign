import { escapeHtml } from "./dom";
import type { Match } from "./analyze";

function severityClass(weight: 1 | 2 | 3): string {
  if (weight >= 3) return "tell-strong";
  if (weight === 2) return "tell-medium";
  return "tell-mild";
}

/**
 * Renders text as HTML with matched spans wrapped in a <mark>, skipping
 * any match that overlaps one already rendered (matches are expected in
 * document order, e.g. from findMatches).
 */
export function renderHighlights(text: string, matches: Match[]): string {
  let html = "";
  let cursor = 0;

  for (const match of matches) {
    if (match.start < cursor) continue;
    html += escapeHtml(text.slice(cursor, match.start));
    const label = `${match.tell.category}: ${match.tell.explanation}`;
    html += `<mark class="tell ${severityClass(match.tell.weight)}" title="${escapeHtml(label)}">${escapeHtml(
      text.slice(match.start, match.end),
    )}</mark>`;
    cursor = match.end;
  }

  html += escapeHtml(text.slice(cursor));
  // trailing newline keeps the backdrop's scroll height in sync with the textarea
  return `${html}\n`;
}
