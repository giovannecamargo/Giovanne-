import { describe, expect, it } from "vitest";
import { emailLink, instagramLink, normalizeContactInfo, phoneLink, whatsappLink } from "@/lib/contact-info";

describe("Informações de contato", () => {
  it("monta o WhatsApp com números formatados e código do país", () => {
    expect(whatsappLink("+55 (16) 99999-8888", "Olá")).toBe("https://wa.me/5516999998888?text=Ol%C3%A1");
  });

  it("não cria um botão de WhatsApp para um número incompleto", () => {
    expect(whatsappLink("99999-8888")).toBeNull();
  });

  it("monta links de e-mail e telefone válidos", () => {
    expect(emailLink("contato@giovanne.com.br")).toBe("mailto:contato@giovanne.com.br");
    expect(phoneLink("+55 (16) 3333-0000")).toBe("tel:+551633330000");
  });

  it("transforma somente o nome de usuário no endereço do Instagram", () => {
    expect(instagramLink("giovannecamargo")).toBe("https://www.instagram.com/giovannecamargo/");
  });

  it("aceita o nome de usuário com @", () => {
    expect(instagramLink("@giovanne.camargo")).toBe("https://www.instagram.com/giovanne.camargo/");
  });

  it("aceita o link completo do perfil e remove parâmetros de compartilhamento", () => {
    expect(instagramLink("https://instagram.com/giovannecamargo/?igsh=abc123")).toBe("https://www.instagram.com/giovannecamargo/");
  });

  it("descarta endereços inválidos", () => {
    expect(emailLink("contato@incompleto")).toBeNull();
    expect(instagramLink("https://outrosite.com/giovannecamargo")).toBeNull();
    expect(normalizeContactInfo({ email: "", phone: "", whatsapp: "", instagram_url: "javascript:alert(1)" }).instagramUrl).toBe("");
  });
});
