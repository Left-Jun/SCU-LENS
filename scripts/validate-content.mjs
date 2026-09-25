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

for (const file of await collect("content")) {
  const info = await stat(file);
  if (info.size === 0) throw new Error(`Empty content file: ${file}`);
}

console.log("Content validation passed.");
