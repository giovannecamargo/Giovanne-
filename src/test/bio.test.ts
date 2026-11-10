import { describe, expect, it } from "vitest";

import { bio } from "@/data/bio";

// A página Sobre precisa mostrar a biografia real enviada pelo artista,
// nunca um espaço reservado.
describe("Biografia do artista", () => {
  it("tem as cinco partes da biografia oficial, cada uma com texto", () => {
    expect(bio.sections.map((s) => s.title)).toEqual([
      "Onde tudo começou",
      "Uma trajetória de 12 anos",
      "A identidade musical",
      "Muito além do palco: conexão com o público",
      "Os próximos capítulos",
    ]);
    for (const s of bio.sections) {
      expect(s.paragraphs.length, `${s.title} está sem texto`).toBeGreaterThan(0);
      for (const p of s.paragraphs) expect(p.trim().length).toBeGreaterThan(40);
    }
  });

  it("não deixa nenhum espaço reservado no lugar da biografia", () => {
    const all = [bio.lead, bio.tagline, ...bio.sections.flatMap((s) => [s.title, ...s.paragraphs])].join(" ");
    for (const marker of ["Aguardando", "Espaço reservado", "será inserido", "Provisório", "TODO"]) {
      expect(all.toLowerCase()).not.toContain(marker.toLowerCase());
    }
  });

  it("traz os dados de origem, criação, base e tempo de carreira", () => {
    const facts = Object.fromEntries(bio.facts.map((f) => [f.label, f.value]));
    expect(facts["Origem"]).toContain("Juiz de Fora");
    expect(facts["Criado em"]).toContain("São Pedro da Aldeia");
    expect(facts["Base atual"]).toContain("Cachoeira de Emas");
    expect(facts["Carreira"]).toContain("12");
  });
});
