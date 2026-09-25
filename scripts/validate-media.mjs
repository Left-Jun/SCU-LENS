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

for (const file of await collect("public/images")) {
  const info = await stat(file);
  if (info.size === 0) throw new Error(`Empty media file: ${file}`);
}

console.log("Media validation passed.");
