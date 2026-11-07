export type GalleryPhoto = { id: string; src: string; alt: string; category: "shows" | "bastidores" | "photos" };
export type GalleryFilter = "all" | "shows" | "bastidores" | "videos";

export function uniqueGalleryPhotos(items: GalleryPhoto[]) {
  const seen = new Set<string>();
  return items.filter((item) => {
    if (!item.src || seen.has(item.src)) return false;
    seen.add(item.src);
    return true;
  });
}

export function availableGalleryFilters(photos: GalleryPhoto[], videoCount: number): GalleryFilter[] {
  const filters: GalleryFilter[] = ["all"];
  if (photos.some((p) => p.category === "shows")) filters.push("shows");
  if (photos.some((p) => p.category === "bastidores")) filters.push("bastidores");
  if (videoCount > 0) filters.push("videos");
  return filters;
}

export function filterGalleryPhotos(photos: GalleryPhoto[], filter: GalleryFilter) {
  if (filter === "videos") return [];
  if (filter === "all") return photos;
  return photos.filter((p) => p.category === filter);
}

export function nextGalleryIndex(index: number, direction: number, count: number) {
  return count > 0 ? (index + direction + count) % count : 0;
}