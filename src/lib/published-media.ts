export type PublishedMediaRecords = {
  photos: Array<{ url: string }>;
  sponsors: Array<{ logo_url: string }>;
  videos: Array<{ video_path: string; cover_path: string }>;
};

const STORAGE_PATH = /^[a-z0-9][a-z0-9/_-]*\.[a-z0-9]+$/i;

export function normalizeMediaPaths(paths: string[]) {
  return [...new Set(paths.filter((path) => STORAGE_PATH.test(path) && !path.includes("..")))];
}

export function selectPublishedMediaPaths(requested: string[], records: PublishedMediaRecords) {
  const requestedSet = new Set(requested);
  const published = new Set<string>();

  records.photos.forEach((row) => {
    if (requestedSet.has(row.url)) published.add(row.url);
  });
  records.sponsors.forEach((row) => {
    if (requestedSet.has(row.logo_url)) published.add(row.logo_url);
  });
  records.videos.forEach((row) => {
    if (requestedSet.has(row.video_path)) published.add(row.video_path);
    if (requestedSet.has(row.cover_path)) published.add(row.cover_path);
  });

  return requested.filter((path) => published.has(path));
}

export function browserFacingMediaUrl(signedUrl: string, browserBaseUrl: string) {
  const signed = new URL(signedUrl);
  const browserBase = new URL(browserBaseUrl);
  return new URL(`${signed.pathname}${signed.search}`, browserBase).toString();
}
