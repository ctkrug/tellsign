import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      // Core matching/scoring/rendering logic only — main.ts is DOM wiring
      // and src/data is static content, neither is "logic" to cover. (No
      // `all` option in Vitest 4's CoverageOptions; `include` alone is what
      // determines the reported file set.)
      include: ["src/analyze.ts", "src/render.ts", "src/dom.ts", "src/a11y.ts", "src/storage.ts", "src/summary.ts"],
      // QA's documented floor for core logic; `npm run test:coverage` fails
      // the run if a future change lets coverage drop below it, rather than
      // relying on a human to notice next time someone eyeballs the report.
      thresholds: { lines: 85, statements: 85, functions: 85, branches: 85 },
    },
  },
});
