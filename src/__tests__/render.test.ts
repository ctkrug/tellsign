import { describe, expect, it } from "vitest";
import { renderHighlights } from "../render";
import type { Match } from "../analyze";
import type { Tell } from "../data/types";

const delve: Tell = {
  id: "delve",
  term: "delve",
  kind: "word",
  category: "inflated-verb",
  weight: 3,
  explanation: "test reason",
};

describe("renderHighlights", () => {
  it("wraps a match in a mark with its severity class", () => {
    const text = "Let's delve in.";
    const matches: Match[] = [{ tell: delve, start: 6, end: 11, matchedText: "delve" }];
    const html = renderHighlights(text, matches);
    expect(html).toContain('<mark class="tell tell-strong"');
    expect(html).toContain(">delve</mark>");
  });

  it("uses tell-medium for a weight-2 tell", () => {
    const boast: Tell = { ...delve, id: "boast", term: "boast", weight: 2 };
    const text = "It boasts a lot.";
    const matches: Match[] = [{ tell: boast, start: 3, end: 9, matchedText: "boasts" }];
    const html = renderHighlights(text, matches);
    expect(html).toContain('<mark class="tell tell-medium"');
  });

  it("uses tell-mild for a weight-1 tell", () => {
    const robust: Tell = { ...delve, id: "robust", term: "robust", weight: 1 };
    const text = "A robust design.";
    const matches: Match[] = [{ tell: robust, start: 2, end: 8, matchedText: "robust" }];
    const html = renderHighlights(text, matches);
    expect(html).toContain('<mark class="tell tell-mild"');
  });

  it("carries the category and explanation as data attributes for the tooltip", () => {
    const text = "Let's delve in.";
    const matches: Match[] = [{ tell: delve, start: 6, end: 11, matchedText: "delve" }];
    const html = renderHighlights(text, matches);
    expect(html).toContain('data-category="inflated-verb"');
    expect(html).toContain('data-explanation="test reason"');
  });

  it("escapes HTML-significant characters in the surrounding text", () => {
    const text = "<script>delve</script>";
    const matches: Match[] = [{ tell: delve, start: 8, end: 13, matchedText: "delve" }];
    const html = renderHighlights(text, matches);
    expect(html).toContain("&lt;script&gt;");
    expect(html).not.toContain("<script>");
  });

  it("skips a match that overlaps one already rendered", () => {
    const text = "delve delve";
    const matches: Match[] = [
      { tell: delve, start: 0, end: 5, matchedText: "delve" },
      { tell: delve, start: 2, end: 7, matchedText: "lve d" },
    ];
    const html = renderHighlights(text, matches);
    expect(html.match(/<mark/g)?.length).toBe(1);
  });

  it("does not make individual marks keyboard-focusable", () => {
    const text = "Let's delve in.";
    const matches: Match[] = [{ tell: delve, start: 6, end: 11, matchedText: "delve" }];
    const html = renderHighlights(text, matches);
    expect(html).not.toContain("tabindex");
  });

  it("renders plain text unchanged when there are no matches", () => {
    const html = renderHighlights("nothing to see here", []);
    expect(html).toBe("nothing to see here\n");
  });

  it("preserves every character of the original text once marks are stripped", () => {
    const text = "Let's delve into <this> & that, delve again.";
    const matches: Match[] = [
      { tell: delve, start: 6, end: 11, matchedText: "delve" },
      { tell: delve, start: 33, end: 38, matchedText: "delve" },
    ];
    const html = renderHighlights(text, matches);
    const stripped = html
      .replace(/<mark[^>]*>/g, "")
      .replace(/<\/mark>/g, "")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/\n$/, "");
    expect(stripped).toBe(text);
  });
});
