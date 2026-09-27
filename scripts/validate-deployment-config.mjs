import { readFile } from "node:fs/promises";

const errors = [];
const expectEqual = (actual, expected, label) => {
  if (actual !== expected) errors.push(`${label}: expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
};
const expectIncludes = (text, needle, label) => {
  if (!text.includes(needle)) errors.push(`${label}: missing ${JSON.stringify(needle)}`);
};

const pkg = JSON.parse(await readFile("package.json", "utf8"));
const vercel = JSON.parse(await readFile("vercel.json", "utf8"));
const nvmrc = (await readFile(".nvmrc", "utf8")).trim();
const astroConfig = await readFile("astro.config.mjs", "utf8");

expectEqual(pkg.engines?.node, ">=22.19 <23", "package.json engines.node");
expectEqual(nvmrc, "22.21.1", ".nvmrc");
expectEqual(pkg.scripts?.["build:site"], "node scripts/optimize-gallery-media.mjs && astro build", "package.json build:site");
expectEqual(pkg.scripts?.["check:site"], "astro check", "package.json check:site");
expectEqual(vercel.framework, "astro", "vercel framework");
expectEqual(vercel.installCommand, "npm ci", "vercel installCommand");
expectEqual(vercel.buildCommand, "npm run build:site", "vercel buildCommand");
expectEqual(vercel.outputDirectory, "apps/site/dist", "vercel outputDirectory");
for (const [needle, label] of [
  ['site: "https://sculens.leftjun.com"', "Astro canonical site"],
  ['output: "static"', "Astro static output"],
  ['outDir: "./apps/site/dist"', "Astro outDir"]
]) expectIncludes(astroConfig, needle, label);

if (errors.length) {
  console.error("Deployment configuration drift detected:\n- " + errors.join("\n- "));
  process.exit(1);
}
console.log("Deployment configuration is aligned across Astro, EdgeOne-oriented output, and Vercel.");
