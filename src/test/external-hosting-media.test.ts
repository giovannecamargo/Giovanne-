import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { brandLogo, photos } from "@/data/site";
import { resolveExternalMedia } from "@/lib/external-media";

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

  it.each([
    ["/__l5e/assets-v1/37e7276c-9199-4061-8312-101ac86b1d99/giovanne-galeria-01.mp4", "/media/giovanne-show-royal-lounge.mp4"],
    ["/__l5e/assets-v1/7414ad50-1980-47f5-9b05-f334af14af8a/giovanne-galeria-01-capa.jpg", "/media/giovanne-show-royal-lounge-capa.jpg"],
  ])("serve a mídia legado %s pelo próprio site", (legacyPath, localPath) => {
    expect(resolveExternalMedia(legacyPath)).toBe(localPath);
    expect(existsSync(publicFile(localPath))).toBe(true);
    expect(readFileSync(publicFile(localPath)).byteLength).toBeGreaterThan(1000);
  });

  it("não cria substitutos para registros removidos ou desconhecidos", () => {
    expect(resolveExternalMedia("/__l5e/registro-removido.mp4")).toBe("/__l5e/registro-removido.mp4");
  });
});
