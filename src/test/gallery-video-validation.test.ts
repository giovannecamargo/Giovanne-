import { describe, it, expect } from "vitest";
import { validateGalleryFile, videoCaptionSchema } from "@/lib/gallery-video-validation";

describe("Gallery video registration", () => {
  it("requires a caption and trims it", () => {
    expect(videoCaptionSchema.safeParse("  ").success).toBe(false);
    expect(videoCaptionSchema.parse("  Show ao vivo  ")).toBe("Show ao vivo");
  });
  it("requires a video file, not an image", () => {
    expect(() => validateGalleryFile({ type: "image/jpeg", size: 100 }, "video")).toThrow();
    expect(() => validateGalleryFile({ type: "video/mp4", size: 100 }, "video")).not.toThrow();
  });
  it("requires an image cover, not a video", () => {
    expect(() => validateGalleryFile({ type: "video/mp4", size: 100 }, "cover")).toThrow();
    expect(() => validateGalleryFile({ type: "image/jpeg", size: 100 }, "cover")).not.toThrow();
  });
});