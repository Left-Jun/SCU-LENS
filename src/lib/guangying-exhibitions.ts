import manifest from "../data/guangying-exhibitions.json";
import data from "../data/guangying-chuanda.generated.json";
import presentation from "../data/guangying-photo-presentation.json";

const embeddedCaptions = new Set(presentation.captionInImageIds);
const photos = new Map(data.items.map(photo => [photo.id, {
  ...photo,
  captionInImage: embeddedCaptions.has(photo.id),
  title: embeddedCaptions.has(photo.id) || / · \d+$/.test(photo.title) ? "" : photo.title,
  author: embeddedCaptions.has(photo.id) ? "" : photo.author,
}]));
const resolve = (id: string) => {
  const photo = photos.get(id);
  if (!photo) throw new Error(`展览引用的照片不存在：${id}`);
  return photo;
};
export const guangyingPhoto = resolve;
export type GuangyingPhoto = ReturnType<typeof resolve>;
export const exhibitions = manifest.map(exhibition => ({
  ...exhibition,
  href: `/guangying-chuanda/${exhibition.slug}`,
  cover: resolve(exhibition.coverId),
  sections: exhibition.sections.map(section => ({ ...section, photos: section.photoIds.map(resolve) })),
  count: exhibition.sections.reduce((sum, section) => sum + section.photoIds.length, 0),
}));

export const themeIssues = exhibitions.flatMap(exhibition => exhibition.slug === "album"
  ? exhibition.sections.map((section, index) => ({
      slug: section.id, href: `/guangying-chuanda/${section.id}`, title: section.title,
      en: ["Historic Landmarks", "Modern Architecture", "Learning at SCU", "Campus Life", "Campus Paths"][index],
      source: exhibition.title, photos: section.photos, cover: section.photos[0],
    }))
  : [{ slug: exhibition.slug, href: exhibition.href, title: exhibition.title, en: "Calendar Selection", source: exhibition.title,
      photos: exhibition.sections.flatMap(section => section.photos), cover: exhibition.cover }]);
