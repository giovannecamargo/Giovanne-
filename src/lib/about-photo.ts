export function aboutPhotoSource(
  photos: readonly { src: string | undefined }[],
  fallback: string,
) {
  return photos[0]?.src || fallback;
}
