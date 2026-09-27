import galleryData from "../data/gallery.generated.json";

const galleryItems = galleryData.items as any[];
const itemById = new Map(galleryItems.map((item) => [item.id, item]));

export const monthlyNinePhotoIds = {
  yellow2025: {
    sebastian: "efcc48be8ecacb79",
    yiwei: "26b446656fa973bc",
    sanchuan: [
      "fc2adb82fed5ab03",
      "ab00ee95f9ed3f1e",
      "a2608802e1d9bf76",
      "87a7eca7c7e8215b",
      "bc1c3d9bd19ebfb9",
      "5c2b0b28a8fe8df2",
      "8290f3d3c3a74515",
      "f213502a159b8619",
      "efbb392a2fdd50d7",
    ],
  },
  springFestival2026: {
    leftJun: "3e04c11611c9e496",
    azp: "b9665e3c325213cf",
    kaleC: [
      "c3e7160420ca91f7",
      "22b06b2fc2b0b288",
      "a497889da9abb734",
      "02f0c905c2c9d17b",
      "ce5e0b12cef567b9",
    ],
  },
  blossom2026: {
    tiantian: ["de627f704d5462ce", "0e23ee57972403b5"],
    sebastian: "dfbdf5d521053ffd",
    yiwei: "c98439947b3f38d4",
  },
  jianganGreen2026: {
    sebastian: "2d675b696e7323f4",
    ze: "86f78f49a87c91c2",
    donglin: "05ac2c01b7616e48",
  },
} as const;

export function galleryPhoto(id: string) {
  const item = itemById.get(id);
  if (!item) throw new Error(`Missing gallery item for monthly-nine photo: ${id}`);
  return {
    ...item,
    browserSrc: item.viewerSrc || item.src,
    browserSrcset: item.srcset,
    original: item.originalSrc || item.viewerSrc || item.src,
  };
}

export function viewerPhoto<T extends Record<string, unknown> = Record<string, never>>(
  id: string,
  extra: T = {} as T,
) {
  const item = galleryPhoto(id);
  return {
    ...extra,
    galleryId: id,
    src: item.viewerSrc || item.src,
    original: item.original,
    section: item.section,
    date: item.date,
  };
}
