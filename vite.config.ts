import { defineConfig } from "vite";

// Relative base so the built site works from any subpath
// (e.g. apps.charliekrug.com/tellsign) without a server rewrite.
export default defineConfig({
  base: "./",
  build: {
    outDir: "dist",
  },
});
