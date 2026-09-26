import { createHash } from "node:crypto";

export const categoryMeta = {
  campus: { title: "校园", en: "Campus", intro: "校园空间、日常、植物、建筑与季节变化中的影像。" },
  humanity: { title: "人文", en: "Humanity", intro: "人与环境、生活方式、事件、习俗与文化场景中的真实片段。" },
  urban: { title: "城市", en: "Urban", intro: "街道、建筑、夜色、交通与城市生活留下的切片。" },
  nature: { title: "自然", en: "Nature", intro: "风景、植物、山水、季节与自然环境中的光线和变化。" },
  portrait: { title: "人像", en: "Portrait", intro: "人物、姿态、表情，以及人与镜头之间的关系。" },
  animals: { title: "动物", en: "Animals", intro: "鸟类、昆虫、校园动物、宠物与其他生命的瞬间。" },
} as const;

const fallbackTitles: Record<string, string> = {
  campus: "校园一隅",
  humanity: "人间片刻",
  urban: "城市切片",
  nature: "自然一隅",
  portrait: "人物一刻",
  animals: "生灵一刻",
};

export const normalizeText = (value = "") => String(value).replace(/\r\n/g, "\n").trim();

export function authorId(author: string) {
  return createHash("sha1").update(author.trim(), "utf8").digest("hex").slice(0, 12);
}

export function authorHref(author: string) {
  return `/authors/${authorId(author)}`;
}

function isOnlySymbols(value: string) {
  return !/[\p{L}\p{N}]/u.test(value);
}

export function splitTitleAndDescription(raw: unknown, item: any) {
  const text = normalizeText(raw == null ? "" : String(raw));
  if (!text) return { title: fallbackTitles[item.category] || "摄影作品", description: "", titleSource: "editorial" };
  const lines = text.split("\n").map((line) => line.trim()).filter(Boolean);
  if (lines.length > 1 && lines[0].length <= 18 && !isOnlySymbols(lines[0])) {
    return { title: lines[0].replace(/[”"。；;：:]$/, ""), description: lines.slice(1).join("\n"), titleSource: "author" };
  }
  const compact = text.replace(/\s+/g, " ");
  if (compact.length <= 18 && !isOnlySymbols(compact)) return { title: compact, description: "", titleSource: "author" };
  const firstClause = compact.split(/[，。！？；;：:]/)[0]?.trim();
  if (firstClause && firstClause.length >= 2 && firstClause.length <= 14 && !isOnlySymbols(firstClause)) {
    return { title: firstClause, description: text, titleSource: "editorial" };
  }
  return { title: fallbackTitles[item.category] || "摄影作品", description: text, titleSource: "editorial" };
}

export function submissionKey(item: any) {
  if (item.submissionId) return item.submissionId;
  const description = normalizeText(item.description).replace(/\s+/g, " ");
  const issue = item.monthlyNine?.issue || "";
  return [item.date, item.section, item.author, description || "__empty__", issue].join("|");
}

export function groupSubmissions(items: any[]) {
  const groupMap = new Map<string, any>();
  for (const work of items) {
    const key = submissionKey(work);
    if (!groupMap.has(key)) {
      const text = splitTitleAndDescription(work.description, work);
      groupMap.set(key, {
        key,
        date: work.date,
        section: work.section,
        author: work.author,
        monthlyNine: work.monthlyNine,
        title: work.title || text.title,
        description: text.description,
        titleSource: work.titleSource || text.titleSource,
        photos: [],
        categories: [],
      });
    }
    const group = groupMap.get(key);
    group.photos.push(work);
    if (!group.categories.includes(work.category)) group.categories.push(work.category);
    if (!group.monthlyNine && work.monthlyNine) group.monthlyNine = work.monthlyNine;
  }

  return [...groupMap.values()].sort(
    (a, b) => b.date.localeCompare(a.date) || a.photos[0].filename.localeCompare(b.photos[0].filename)
  );
}
