import { access, readdir, readFile } from "node:fs/promises";
import { join } from "node:path";

const root = "apps/site/dist";

async function collectHtml(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const result = [];
  for (const entry of entries) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) result.push(...await collectHtml(path));
    else if (entry.name.endsWith(".html")) result.push(path);
  }
  return result;
}

async function exists(path) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

const missing = new Set();
for (const html of await collectHtml(root)) {
  const source = await readFile(html, "utf8");
  for (const match of source.matchAll(/(?:href|src)=["'](\/[^"'?#]*)/g)) {
    const pathname = decodeURI(match[1]);
    if (pathname === "/") continue;
    const relative = pathname.replace(/^\//, "").replace(/\/$/, "");
    const candidates = [
      join(root, relative),
      join(root, relative, "index.html"),
      join(root, `${relative}.html`)
    ];
    let found = false;
    for (const candidate of candidates) {
      if (await exists(candidate)) {
        found = true;
        break;
      }
    }
    if (!found) missing.add(pathname);
  }
}

if (missing.size) {
  throw new Error(`Broken generated links:\n${[...missing].sort().join("\n")}`);
}

console.log("Generated link validation passed.");
