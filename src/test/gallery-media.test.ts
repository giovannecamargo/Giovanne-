import { describe, expect, it } from "vitest";
import { availableGalleryFilters, filterGalleryPhotos, nextGalleryIndex, uniqueGalleryPhotos, type GalleryPhoto } from "@/lib/gallery-media";

const photos: GalleryPhoto[] = [
  { id: "1", src: "show.jpg", alt: "", category: "shows" },
  { id: "2", src: "backstage.jpg", alt: "", category: "bastidores" },
];
describe("Gallery media rules", () => {
  it("shows only categories with registered content", () => {
    expect(availableGalleryFilters([photos[0] as GalleryPhoto], 1)).toEqual(["all", "shows", "videos"]);
    expect(availableGalleryFilters([], 0)).toEqual(["all"]);
  });
  it("filters photos by the selected category and excludes them from videos", () => {
    expect(filterGalleryPhotos(photos, "shows").map(p => p.id)).toEqual(["1"]);
    expect(filterGalleryPhotos(photos, "bastidores").map(p => p.id)).toEqual(["2"]);
    expect(filterGalleryPhotos(photos, "videos")).toEqual([]);
    expect(filterGalleryPhotos(photos, "all")).toHaveLength(2);
  });
  it("does not duplicate media", () => {
    expect(uniqueGalleryPhotos([...photos, ...photos])).toEqual(photos);
  });
  it("navigates both ways through the entire photo collection", () => {
    expect(nextGalleryIndex(3, 1, 4)).toBe(0);
    expect(nextGalleryIndex(0, -1, 4)).toBe(3);
  });
});