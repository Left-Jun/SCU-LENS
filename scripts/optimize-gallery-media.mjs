import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const repoRoot = path.resolve(import.meta.dirname, "..");
const outputRoot = path.join(repoRoot, "public", "images", "gallery-generated");
const libraryRoot = path.join(repoRoot, "content", "photo-library");
const dataPath = path.join(repoRoot, "src", "data", "gallery.generated.json");

const payload = JSON.parse(await fs.readFile(dataPath, "utf8"));
const itemById = new Map(payload.items.map((item) => [item.id, item]));

async function exists(file) {
  try { await fs.access(file); return true; } catch { return false; }
}

async function collectJpegs(dir) {
  const out = [];
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    const absolute = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...await collectJpegs(absolute));
    else if (/-(960|1440|1800)\.jpg$/i.test(entry.name)) out.push(absolute);
  }
  return out;
}

async function encode(jpegPath, format) {
  const match = path.basename(jpegPath).match(/^([0-9a-f]+)-(960|1440|1800)\.jpg$/i);
  if (!match) return false;
  const [, id, edgeText] = match;
  const edge = Number(edgeText);
  const item = itemById.get(id);
  const rawPath = item ? path.join(libraryRoot, item.categoryTitle, item.filename) : "";
  const useRaw = Boolean(rawPath) && await exists(rawPath);
  const source = useRaw ? rawPath : jpegPath;
  const output = jpegPath.replace(/\.jpg$/i, `.${format}`);

  const sourceStat = await fs.stat(source);
  if (await exists(output)) {
    const outputStat = await fs.stat(output);
    if (outputStat.mtimeMs >= sourceStat.mtimeMs) return false;
  }

  let pipeline = sharp(source);
  if (useRaw) {
    pipeline = pipeline.rotate().resize({ width: edge, height: edge, fit: "inside", withoutEnlargement: true });
  }

  if (format === "avif") {
    await pipeline.avif({ quality: 58, effort: 1, chromaSubsampling: "4:4:4" }).toFile(output);
  } else {
    await pipeline.webp({ quality: 82, effort: 2, smartSubsample: true }).toFile(output);
  }
  return true;
}

sharp.cache(false);
const jpegs = await collectJpegs(outputRoot);
let generated = 0;

for (let start = 0; start < jpegs.length; start += 4) {
  const batch = jpegs.slice(start, start + 4);
  const results = await Promise.all(batch.flatMap((jpeg) => [
    encode(jpeg, "avif"),
    encode(jpeg, "webp"),
  ]));
  generated += results.filter(Boolean).length;
  process.stdout.write(`\rGallery media ${Math.min(start + 4, jpegs.length)}/${jpegs.length}`);
}
process.stdout.write("\n");
console.log(`Gallery modern formats ready: ${jpegs.length} JPEG masters, ${generated} files generated/updated.`);
