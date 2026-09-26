import { readFile, writeFile, readdir } from "node:fs/promises";
import { join } from "node:path";

const root = "apps/site/dist";
const prefix = "/SCU-LENS";

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) files.push(...await walk(path));
    else if (/\.(html|xml|js|css)$/i.test(entry.name)) files.push(path);
  }
  return files;
}

function prefixRootPaths(text) {
  return text
    .replace(/(["'])\/(?!\/|SCU-LENS(?:\/|["']))/g, `$1${prefix}/`)
    .replace(/url\(\/(?!\/|SCU-LENS\/)/g, `url(${prefix}/`);
}

let changed = 0;
for (const file of await walk(root)) {
  const before = await readFile(file, "utf8");
  const after = prefixRootPaths(before);
  if (after !== before) {
    await writeFile(file, after);
    changed++;
  }
}
console.log(`Prepared GitHub Pages artifact with ${prefix} base path; updated ${changed} files.`);
