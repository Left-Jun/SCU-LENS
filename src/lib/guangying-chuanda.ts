import data from "../data/guangying-chuanda.generated.json";

interface Photo {
  id: string;
  collection: string;
  filename: string;
  submissionId: string;
  title: string;
  author: string;
  date: string;
  section: string;
  description: string;
  caption: string;
  src: string;
  srcset: string;
  viewerSrc: string;
  originalSrc: string;
  width: number;
  height: number;
}

export const collections = [
  { id: "awards", title: "往期获奖作品", en: "Awarded Works", description: "回看往届获奖影像，收藏镜头里的川大记忆。", empty: "往期获奖作品待展。" },
  { id: "submissions", title: "当前投稿作品", en: "Current Submissions", description: "这里展示本轮协会合作征集的作品，记录你眼中的川大。", empty: "期待你的川大影像。" },
].map((collection) => {
  const photos = (data.items as Photo[]).filter((photo) => photo.collection === collection.id);
  const groups = new Map<string, { key: string; title: string; author: string; date: string; description: string; photos: Photo[] }>();
  for (const photo of photos) {
    const key = photo.submissionId ? `submission:${photo.submissionId}` : `photo:${photo.id}`;
    let group = groups.get(key);
    if (!group) {
      group = { key, title: photo.title, author: photo.author, date: photo.date, description: photo.description, photos: [] };
      groups.set(key, group);
    }
    group.author ||= photo.author;
    group.date ||= photo.date;
    group.description ||= photo.description;
    group.photos.push(photo);
  }
  return { ...collection, photoCount: photos.length, works: [...groups.values()].sort((a, b) => b.date.localeCompare(a.date)) };
});
