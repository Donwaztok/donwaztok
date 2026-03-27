import path from "node:path";
import { fileURLToPath } from "node:url";
import { nitro } from "nitro/vite";
import vinext from "vinext";
import { defineConfig } from "vite";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [vinext(), nitro()],
  resolve: {
    // postcss-import (Vite CSS) resolves bare imports as filesystem paths; HeroUI CSS uses
    // @import "tailwindcss" / "tw-animate-css" which must map to real files.
    alias: {
      tailwindcss: path.resolve(__dirname, "node_modules/tailwindcss/index.css"),
      "tw-animate-css": path.resolve(
        __dirname,
        "node_modules/tw-animate-css/dist/tw-animate.css",
      ),
    },
  },
  // Avoid Vite resolving memoizee → es5-ext quirky paths (breaks dev with 500).
  optimizeDeps: {
    exclude: ["google-play-scraper"],
  },
});
