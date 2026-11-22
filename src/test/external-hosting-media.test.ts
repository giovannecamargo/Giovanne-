import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { brandLogo, photos } from "@/data/site";

const publicFile = (url: string) => join(process.cwd(), "public", url.replace(/^\//, ""));

describe("Fixed media on external hosting", () => {
  it.each([
    ["logo", brandLogo],
    ["foto principal", photos.palco],
    ["foto do Sobre", photos.pb],
  ])("%s usa um arquivo do próprio site", (_label, url) => {
    expect(url.startsWith("/images/")).toBe(true);
    expect(url).not.toContain("/__l5e/");
    expect(existsSync(publicFile(url))).toBe(true);
    expect(readFileSync(publicFile(url)).byteLength).toBeGreaterThan(1000);
  });

  it("oferece os dois formatos de favicon pelo próprio site", () => {
    for (const file of ["favicon.ico", "favicon.png"]) {
      const path = join(process.cwd(), "public", file);
      expect(existsSync(path)).toBe(true);
      expect(readFileSync(path).byteLength).toBeGreaterThan(1000);
    }
  });
});
