import { defineConfig } from "vite";

// Relative base so the built site works from any subpath
// (e.g. apps.charliekrug.com/tellsign) without a server rewrite.
export default defineConfig({
  base: "./",
  build: {
    outDir: "dist",
    rollupOptions: {
      input: {
        // The tool itself (unchanged entry point) plus the shareable
        // landing page, built to dist/site/ alongside it.
        app: "index.html",
        site: "site/index.html",
      },
    },
  },
});
