import { describe, expect, it } from "vitest";
import { analyze } from "../analyze";

const AI_STYLED_SAMPLE = `In today's fast-paced world, it's important to note that businesses
must delve into emerging technology. This platform boasts a robust,
seamless design that will elevate your workflow and unlock unparalleled
efficiency. Furthermore, it fosters a comprehensive, holistic approach,
whether you're a startup founder or an enterprise leader. On the other
hand, it's worth noting that the results are truly groundbreaking. In
conclusion, this innovative, game-changing platform will revolutionize
the way your team collaborates, ranging from daily standups to
long-term planning.`;

const PLAIN_HUMAN_SAMPLE = `We shipped the login page yesterday and fixed the bug where the
submit button stayed disabled after a failed password check. Sarah
noticed the error message was cut off on small screens, so I widened
the box and added a scroll fallback. Tests pass locally; I'll open a
pull request once the staging deploy finishes and Marcus has a chance
to look at the CSS change.`;

describe("scoring realism", () => {
  it("scores an obviously AI-styled sample at least 2x a plain human sample of similar length", () => {
    const ai = analyze(AI_STYLED_SAMPLE);
    const human = analyze(PLAIN_HUMAN_SAMPLE);
    expect(ai.wordCount).toBeGreaterThan(50);
    expect(human.wordCount).toBeGreaterThan(50);
    // the plain sample should draw few if any hits, and the AI-styled one
    // should be flagged heavily — not just technically 2x a near-zero score
    expect(human.score).toBeLessThanOrEqual(10);
    expect(ai.score).toBeGreaterThanOrEqual(50);
    expect(ai.score).toBeGreaterThanOrEqual(human.score * 2);
  });
});
