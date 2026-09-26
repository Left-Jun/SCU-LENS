// EdgeOne native push trigger verification
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://sculens.leftjun.com",
  output: "static",
  outDir: "./apps/site/dist",
  integrations: [sitemap()],
  markdown: {
    shikiConfig: { theme: "github-dark" }
  }
});
