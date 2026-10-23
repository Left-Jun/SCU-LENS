import selection from "../data/guangying-featured.json";
import { guangyingPhoto } from "./guangying-exhibitions";

if (new Set(selection.photoIds).size !== selection.photoIds.length) {
  throw new Error("光影川大精选清单存在重复照片 ID。");
}
export const featuredPhotos = selection.photoIds.map(id => guangyingPhoto(id));
export const featuredPreview = selection.preview;
