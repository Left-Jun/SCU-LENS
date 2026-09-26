import { readFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";
import { resolve } from "node:path";

const errors = [];
const expectEqual = (actual, expected, label) => {
  if (actual !== expected) errors.push(`${label}: expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
};
const expectIncludes = (text, needle, label) => {
  if (!text.includes(needle)) errors.push(`${label}: missing ${JSON.stringify(needle)}`);
};

const pkg = JSON.parse(await readFile("package.json", "utf8"));
const vercel = JSON.parse(await readFile("vercel.json", "utf8"));
const workflow = await readFile(".github/workflows/astro-pages.yml", "utf8");
const nvmrc = (await readFile(".nvmrc", "utf8")).trim();
const astroModule = await import(pathToFileURL(resolve("astro.config.mjs")).href);
const astro = astroModule.default;

expectEqual(pkg.engines?.node, ">=22.11 <23", "package.json engines.node");
expectEqual(nvmrc, "22.11.0", ".nvmrc");
expectEqual(pkg.scripts?.["build:site"], "astro build", "package.json build:site");
expectEqual(pkg.scripts?.["check:site"], "astro check", "package.json check:site");
expectEqual(vercel.framework, "astro", "vercel framework");
expectEqual(vercel.installCommand, "npm ci", "vercel installCommand");
expectEqual(vercel.buildCommand, "npm run build:site", "vercel buildCommand");
expectEqual(vercel.outputDirectory, "apps/site/dist", "vercel outputDirectory");
expectEqual(astro.output, "static", "Astro output");
expectEqual(astro.outDir, "./apps/site/dist", "Astro outDir");
expectEqual(astro.site, "https://sculens.leftjun.com", "Astro canonical site");

for (const [needle, label] of [
  ['node-version: "22.11.0"', "Pages Node version"],
  ["run: npm ci", "Pages install command"],
  ["run: npm run build:site", "Pages build command"],
  ["path: apps/site/dist", "Pages artifact path"],
  ["run: npm run prepare:pages", "Pages base-path preparation"],
  ["run: npm run check:live", "post-deploy health check"]
]) expectIncludes(workflow, needle, label);

if (errors.length) {
  console.error("Deployment configuration drift detected:\n- " + errors.join("\n- "));
  process.exit(1);
}
console.log("Deployment configuration is aligned across Astro, Vercel, and GitHub Pages.");
