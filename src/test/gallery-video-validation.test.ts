import { describe, it, expect } from "vitest";
import { maxGalleryVideoSize, validateGalleryFile, videoCaptionSchema, videoFileExtension } from "@/lib/gallery-video-validation";

describe("Gallery video registration", () => {
  it("requires a caption and trims it", () => {
    expect(videoCaptionSchema.safeParse("  ").success).toBe(false);
    expect(videoCaptionSchema.parse("  Show ao vivo  ")).toBe("Show ao vivo");
  });
  it("requires a video file, not an image", () => {
    expect(() => validateGalleryFile({ type: "image/jpeg", size: 100 }, "video")).toThrow();
    expect(() => validateGalleryFile({ type: "video/mp4", size: 100 }, "video")).not.toThrow();
  });
  it("accepts MOV videos, including files identified by their extension", () => {
    expect(() => validateGalleryFile({ type: "video/quicktime", size: 100, name: "show.MOV" }, "video")).not.toThrow();
    expect(() => validateGalleryFile({ type: "", size: 100, name: "show.mov" }, "video")).not.toThrow();
    expect(videoFileExtension({ type: "video/quicktime", name: "show.MOV" })).toBe("mov");
  });
  it("accepts videos up to 1 GB and rejects larger files", () => {
    expect(maxGalleryVideoSize).toBe(1073741824);
    expect(() => validateGalleryFile({ type: "video/mp4", size: 1073741824 }, "video")).not.toThrow();
    expect(() => validateGalleryFile({ type: "video/mp4", size: 1073741825 }, "video")).toThrow("1 GB");
  });
  it("requires an image cover, not a video", () => {
    expect(() => validateGalleryFile({ type: "video/mp4", size: 100 }, "cover")).toThrow();
    expect(() => validateGalleryFile({ type: "image/jpeg", size: 100 }, "cover")).not.toThrow();
  });
  it("rejects a WebP cover so it remains visible on incompatible devices", () => {
    expect(() => validateGalleryFile({ type: "image/webp", size: 100 }, "cover")).toThrow("JPG ou PNG");
    expect(() => validateGalleryFile({ type: "image/png", size: 100 }, "cover")).not.toThrow();
  });
});