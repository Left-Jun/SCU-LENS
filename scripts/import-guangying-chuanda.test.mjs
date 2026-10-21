import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import sharp from "sharp";
import { importGuangying, parseCsv, collections } from "./import-guangying-chuanda.mjs";

test("metadata preserves Chinese, quoted commas, multiline captions and BOM", () => {
  assert.deepEqual(parseCsv('\uFEFFfilename,title,description\r\n往期获奖作品/a.jpg,"川大,光影","第一行\n第二行"\r\n'), [
    { filename: "往期获奖作品/a.jpg", title: "川大,光影", description: "第一行\n第二行" },
  ]);
  assert.throws(() => parseCsv('filename\n"unfinished'), /未闭合/);
});

test("imports both collections, preserves groups and proportions, keeps stable distinct IDs", async (t) => {
  const projectRoot = await fs.mkdtemp(path.join(os.tmpdir(), "scu-guangying-test-"));
  t.after(() => fs.rm(projectRoot, { recursive: true, force: true }));
  const libraryRoot = path.join(projectRoot, "content/photo-library/光影川大");
  for (const collection of collections) await fs.mkdir(path.join(libraryRoot, collection.folder), { recursive: true });
  const image = await sharp({ create: { width: 60, height: 90, channels: 3, background: "#c8c8c8" } }).jpeg().toBuffer();
  for (const name of ["往期获奖作品/01.jpg", "往期获奖作品/02.jpg", "当前投稿作品/01.jpg"]) await fs.writeFile(path.join(libraryRoot, name), image);
  await fs.writeFile(path.join(libraryRoot, "metadata.csv"), 'filename,author,title,submission_id\n往期获奖作品/01.jpg,甲,校园一刻,series-a\n往期获奖作品/02.jpg,甲,校园一刻,series-a\n');
  const first = await importGuangying({ projectRoot });
  assert.equal(first.total, 3);
  assert.equal(new Set(first.items.map((item) => item.id)).size, 3);
  const awards = first.items.filter((item) => item.collection === "awards");
  assert.equal(awards.length, 2);
  assert.equal(awards[0].submissionId, awards[1].submissionId);
  const submission = first.items.find((item) => item.collection === "submissions");
  assert.equal(submission.author, "");
  assert.equal(submission.date, "");
  assert.equal(submission.title, "01");
  assert.equal(submission.submissionId, "");
  assert.equal(submission.width, 60);
  assert.equal(submission.height, 90);
  assert.equal(submission.srcset.split(",").length, 1, "small images must not repeat identical srcset widths");
  for (const item of first.items) {
    for (const extension of ["jpg", "webp", "avif"]) {
      const file = path.join(projectRoot, "public", item.originalSrc.slice(1).replace(/\.jpg$/, `.${extension}`));
      const actual = await sharp(file).metadata();
      assert.equal(actual.width, 60);
      assert.equal(actual.height, 90);
    }
  }
  assert.deepEqual((await importGuangying({ projectRoot })).items, first.items);
  await fs.writeFile(path.join(libraryRoot, "metadata.csv"), "filename\n往期获奖作品/01.jpg\n往期获奖作品/01.jpg\n");
  await assert.rejects(importGuangying({ projectRoot }), /重复路径/);
  const saved = JSON.parse(await fs.readFile(path.join(projectRoot, "src/data/guangying-chuanda.generated.json"), "utf8"));
  assert.deepEqual(saved, first, "invalid metadata must not replace the published manifest");
});

test("empty folders yield an empty page dataset, missing originals do not clear a published dataset", async (t) => {
  const projectRoot = await fs.mkdtemp(path.join(os.tmpdir(), "scu-guangying-empty-"));
  t.after(() => fs.rm(projectRoot, { recursive: true, force: true }));
  const libraryRoot = path.join(projectRoot, "archive");
  for (const collection of collections) await fs.mkdir(path.join(libraryRoot, collection.folder), { recursive: true });
  assert.deepEqual(await importGuangying({ projectRoot, libraryRoot }), { total: 0, items: [] });
  const manifest = path.join(projectRoot, "src/data/guangying-chuanda.generated.json");
  const published = { total: 1, items: [{ id: "previously-published" }] };
  await fs.writeFile(manifest, JSON.stringify(published));
  await assert.rejects(importGuangying({ projectRoot, libraryRoot: path.join(projectRoot, "missing") }), { code: "ENOENT" });
  const saved = JSON.parse(await fs.readFile(manifest, "utf8"));
  assert.deepEqual(saved, published);
});
