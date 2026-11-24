import { describe, expect, it } from "vitest";
import { browserFacingMediaUrl, normalizeMediaPaths, selectPublishedMediaPaths } from "@/lib/published-media";

describe("published media access", () => {
  it("signs only files referenced by published records", () => {
    const requested = ["photos/live.jpg", "sponsors/active.png", "videos/show.mp4", "video-covers/show.jpg", "private/draft.jpg"];
    expect(selectPublishedMediaPaths(requested, {
      photos: [{ url: "photos/live.jpg" }],
      sponsors: [{ logo_url: "sponsors/active.png" }],
      videos: [{ video_path: "videos/show.mp4", cover_path: "video-covers/show.jpg" }],
    })).toEqual(requested.slice(0, 4));
  });

  it("does not allow unrelated, parent-relative or external paths", () => {
    expect(normalizeMediaPaths([
      "photos/live.jpg",
      "photos/live.jpg",
      "../secret.jpg",
      "photos/../secret.jpg",
      "/__l5e/assets/video.mp4",
      "https://example.com/private.jpg",
    ])).toEqual(["photos/live.jpg"]);
  });

  it("keeps the signed token while using the browser-facing host", () => {
    expect(browserFacingMediaUrl(
      "http://internal.local/storage/v1/object/sign/media/photos/live.jpg?token=abc123",
      "https://public.example",
    )).toBe("https://public.example/storage/v1/object/sign/media/photos/live.jpg?token=abc123");
  });
});
