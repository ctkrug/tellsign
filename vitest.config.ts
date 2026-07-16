import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      all: true,
      // Core matching/scoring/rendering logic only — main.ts is DOM wiring
      // and src/data is static content, neither is "logic" to cover.
      include: ["src/analyze.ts", "src/render.ts", "src/dom.ts", "src/a11y.ts", "src/storage.ts", "src/summary.ts"],
    },
  },
});
