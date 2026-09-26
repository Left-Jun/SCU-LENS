import { readdir, stat } from "node:fs/promises";
import { join } from "node:path";

async function collect(root) {
  const entries = await readdir(root, { withFileTypes: true });
  const result = [];
  for (const entry of entries) {
    const path = join(root, entry.name);
    if (entry.isDirectory()) result.push(...await collect(path));
    else result.push(path);
  }
  return result;
}

const contentRoots = ["src/data", "src/pages"];
const files = [];

for (const root of contentRoots) {
  files.push(...await collect(root));
}

if (files.length === 0) {
  throw new Error(`No site content found under: ${contentRoots.join(", ")}`);
}

for (const file of files) {
  const info = await stat(file);
  if (info.size === 0) throw new Error(`Empty content file: ${file}`);
}

console.log("Content validation passed.");
