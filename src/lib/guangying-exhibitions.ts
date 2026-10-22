import manifest from "../data/guangying-exhibitions.json";
import data from "../data/guangying-chuanda.generated.json";

const photos = new Map(data.items.map(photo => [photo.id, photo]));
const resolve = (id: string) => {
  const photo = photos.get(id);
  if (!photo) throw new Error(`展览引用的照片不存在：${id}`);
  return photo;
};
export const exhibitions = manifest.map(exhibition => ({
  ...exhibition,
  href: `/guangying-chuanda/${exhibition.slug}`,
  cover: resolve(exhibition.coverId),
  sections: exhibition.sections.map(section => ({ ...section, photos: section.photoIds.map(resolve) })),
  count: exhibition.sections.reduce((sum, section) => sum + section.photoIds.length, 0),
}));
