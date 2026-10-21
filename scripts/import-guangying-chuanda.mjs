import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";
import sharp from "sharp";

// Release source/derivative handles between imports, including on Windows.
sharp.cache(false);

export const collections = [
  { id: "awards", folder: "往期获奖作品", title: "往期获奖作品" },
  { id: "submissions", folder: "当前投稿作品", title: "当前投稿作品" },
];

// CSV supports quoted commas, doubled quotes, BOM and multiline descriptions.
export function parseCsv(text) {
  const rows = [];
  let row = [], cell = "", quoted = false;
  text = text.replace(/^\uFEFF/, "");
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (char === '"') {
      if (quoted && text[i + 1] === '"') { cell += '"'; i++; }
      else quoted = !quoted;
    } else if (!quoted && (char === "," || char === "\n")) {
      row.push(cell.replace(/\r$/, "")); cell = "";
      if (char === "\n") { rows.push(row); row = []; }
    } else cell += char;
  }
  if (quoted) throw new Error("光影川大 metadata.csv 存在未闭合的引号。");
  if (cell || row.length) { row.push(cell.replace(/\r$/, "")); rows.push(row); }
  const headers = rows.shift()?.map((value) => value.trim()) || [];
  return rows.filter((values) => values.some((value) => value.trim())).map((values) =>
    Object.fromEntries(headers.map((header, i) => [header, (values[i] || "").trim()]))
  );
}

async function scan(dir) {
  const files = [];
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    const absolute = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...await scan(absolute));
    else if (entry.isFile() && /\.(jpe?g|png|webp|avif|tiff?)$/i.test(entry.name)) files.push(absolute);
  }
  return files.sort((a, b) => a.localeCompare(b, "zh-CN", { numeric: true }));
}

export async function importGuangying({ projectRoot, libraryRoot = path.join(projectRoot, "content/photo-library/光影川大") }) {
  // Do not create/clear an archive from a cloud build with missing local originals.
  await fs.access(libraryRoot);
  const metadataFile = path.join(libraryRoot, "metadata.csv");
  const text = await fs.readFile(metadataFile, "utf8").catch((error) => {
    if (error.code === "ENOENT") return "";
    throw error;
  });
  const metadata = new Map();
  for (const row of parseCsv(text)) {
    const key = (row.filename || "").replaceAll("\\", "/").replace(/^\.\//, "");
    if (!key || key.startsWith("/") || key.split("/").includes("..")) throw new Error("metadata filename 必须为光影川大目录内的相对路径。");
    if (metadata.has(key)) throw new Error(`metadata 中有重复路径：${key}`);
    metadata.set(key, row);
  }
  const items = [];
  for (const collection of collections) {
    for (const absolute of await scan(path.join(libraryRoot, collection.folder))) {
      const filename = path.relative(libraryRoot, absolute).split(path.sep).join("/");
      const row = metadata.get(filename) || {};
      const id = createHash("sha256").update(filename).digest("hex").slice(0, 20);
      const variants = [];
      for (const edge of [960, 1440, 1800]) {
        const stem = `/images/guangying-generated/${collection.id}/${id}-${edge}`;
        const output = path.join(projectRoot, "public", stem.slice(1));
        await fs.mkdir(path.dirname(output), { recursive: true });
        const image = sharp(absolute).rotate().resize({ width: edge, height: edge, fit: "inside", withoutEnlargement: true });
        const dimensions = await image.clone().jpeg({ quality: edge === 960 ? 88 : 91 }).toFile(`${output}.jpg`);
        await image.clone().webp({ quality: 82 }).toFile(`${output}.webp`);
        await image.clone().avif({ quality: 58, effort: 1, chromaSubsampling: "4:4:4" }).toFile(`${output}.avif`);
        variants.push({ src: `${stem}.jpg`, width: dimensions.width, height: dimensions.height });
      }
      const largest = variants.at(-1);
      items.push({
        id, collection: collection.id, filename,
        submissionId: row.submission_id || "",
        title: row.title || path.parse(absolute).name,
        author: row.author || "", date: row.date || "", section: row.section || "",
        description: row.description || "", caption: row.caption || "",
        src: variants[0].src,
        srcset: [...new Map(variants.map((variant) => [variant.width, variant])).values()].map((variant) => `${variant.src} ${variant.width}w`).join(", "),
        viewerSrc: largest.src.replace(/\.jpg$/, ".webp"), originalSrc: largest.src,
        width: largest.width, height: largest.height,
      });
    }
  }
  // Group identities are scoped to each collection; unrelated unlabelled photos stay separate.
  const groups = new Map();
  for (const item of items) {
    if (!item.submissionId) continue;
    const key = `${item.collection}:${item.submissionId}`;
    const previous = groups.get(key);
    if (previous) {
      for (const field of ["author", "date", "section", "description"]) {
        if (previous[field] && item[field] && previous[field] !== item[field]) throw new Error(`同一组图的 ${field} 不一致：${item.filename}`);
        previous[field] ||= item[field];
      }
    } else groups.set(key, { ...item });
  }
  const payload = { total: items.length, items };
  const destination = path.join(projectRoot, "src/data/guangying-chuanda.generated.json");
  await fs.mkdir(path.dirname(destination), { recursive: true });
  await fs.writeFile(destination, `${JSON.stringify(payload, null, 2)}\n`);
  return payload;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const projectRoot = path.resolve(import.meta.dirname, "..");
  const libraryRoot = path.join(projectRoot, "content/photo-library/光影川大");
  for (const collection of collections) await fs.mkdir(path.join(libraryRoot, collection.folder), { recursive: true });
  await fs.writeFile(path.join(libraryRoot, "metadata.csv"), "filename,date,section,author,title,description,caption,submission_id\n", { flag: "wx" }).catch((error) => {
    if (error.code !== "EEXIST") throw error;
  });
  const payload = await importGuangying({ projectRoot });
  console.log(`光影川大：已导入 ${payload.total} 张照片。`);
}
