import vinext from "vinext";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [vinext()],
  // Avoid Vite resolving memoizee → es5-ext quirky paths (breaks dev with 500).
  optimizeDeps: {
    exclude: ["google-play-scraper"],
  },
});
