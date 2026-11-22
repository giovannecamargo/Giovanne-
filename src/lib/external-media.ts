// Exact local copies for legacy records created before external hosting support.
// This is not a fallback: a deleted database record still removes its video.
const externalMediaCopies: Record<string, string> = {
  "/__l5e/assets-v1/37e7276c-9199-4061-8312-101ac86b1d99/giovanne-galeria-01.mp4": "/media/giovanne-show-royal-lounge.mp4",
  "/__l5e/assets-v1/7414ad50-1980-47f5-9b05-f334af14af8a/giovanne-galeria-01-capa.jpg": "/media/giovanne-show-royal-lounge-capa.jpg",
};

export function resolveExternalMedia(path: string) {
  return externalMediaCopies[path] ?? path;
}
