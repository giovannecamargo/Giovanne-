import { describe, expect, it } from "vitest";
import { clampDeposit, formatBRL, packageWhatsappLink } from "@/lib/hiring";
import { usesInstitutionalChrome } from "@/lib/site-chrome";

describe("contratação de shows", () => {
  it("formata preços oficiais em reais", () => {
    expect(formatBRL(700)).toBe("R$ 700");
    expect(formatBRL(1000)).toBe("R$ 1.000");
    expect(formatBRL(1200)).toBe("R$ 1.200");
  });
  it("limita o sinal entre 0 e 100%", () => {
    expect(clampDeposit(150)).toBe(100);
    expect(clampDeposit(-5)).toBe(0);
    expect(clampDeposit(50)).toBe(50);
  });
  it("monta link de WhatsApp com o pacote escolhido", () => {
    const link = packageWhatsappLink("(11) 99999-9999", { code: "P02", title: "Pacote P02" });
    expect(link).toContain("https://wa.me/11999999999");
    expect(decodeURIComponent(link ?? "")).toContain("P02");
    expect(packageWhatsappLink("", { code: "P01", title: "" })).toBeNull();
  });
  it("esconde o menu institucional só na landing e no painel", () => {
    expect(usesInstitutionalChrome("/contratar-show")).toBe(false);
    expect(usesInstitutionalChrome("/admin")).toBe(false);
    expect(usesInstitutionalChrome("/")).toBe(true);
    expect(usesInstitutionalChrome("/sobre")).toBe(true);
  });
});

describe("mensagens de WhatsApp cadastradas", () => {
  it("usa a mensagem própria do pacote quando existe", () => {
    const link = packageWhatsappLink("5519988887777", { code: "P01", title: "Ambiente + Show", whatsapp_message: "Tenho interesse no Pacote 01" });
    expect(decodeURIComponent(link ?? "")).toContain("Tenho interesse no Pacote 01");
  });
  it("usa a mensagem geral nos botões gerais", () => {
    const link = packageWhatsappLink("5519988887777", undefined, "Consultar disponibilidade");
    expect(decodeURIComponent(link ?? "")).toContain("Consultar disponibilidade");
  });
});
