import { describe, expect, it } from "vitest";
import { validateCompatibleImage } from "@/lib/image-upload";

describe("Compatible image uploads", () => {
  it("accepts JPEG and PNG images", () => {
    expect(() => validateCompatibleImage({ type: "image/jpeg" })).not.toThrow();
    expect(() => validateCompatibleImage({ type: "image/png" })).not.toThrow();
  });

  it("rejects WebP so a new image cannot disappear on incompatible devices", () => {
    expect(() => validateCompatibleImage({ type: "image/webp" })).toThrow("JPG ou PNG");
  });

  it("rejects other image formats that do not follow the compatibility rule", () => {
    expect(() => validateCompatibleImage({ type: "image/svg+xml" })).toThrow("JPG ou PNG");
    expect(() => validateCompatibleImage({ type: "image/gif" })).toThrow("JPG ou PNG");
  });
});
