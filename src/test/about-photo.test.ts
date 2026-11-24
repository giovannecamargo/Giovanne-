import { describe, expect, it } from "vitest";
import { aboutPhotoSource } from "@/lib/about-photo";

describe("foto da página Sobre", () => {
  it("usa a foto mais recente com a etiqueta Sobre", () => {
    expect(aboutPhotoSource([
      { src: "https://example.com/nova.jpg" },
      { src: "https://example.com/antiga.jpg" },
    ], "/images/giovanne-pb.jpg")).toBe("https://example.com/nova.jpg");
  });

  it("mantém a foto branca atual quando não há cadastro", () => {
    expect(aboutPhotoSource([], "/images/giovanne-pb.jpg")).toBe("/images/giovanne-pb.jpg");
  });
});
