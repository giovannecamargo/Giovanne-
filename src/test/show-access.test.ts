import { describe, expect, it } from "vitest";
import { normalizeShowAccess, showAccessLabel, showAccessShortLabel } from "@/lib/show-access";

describe("show access (agenda)", () => {
  it("keeps a show marked as open to the public", () => {
    expect(normalizeShowAccess("public")).toBe("public");
    expect(showAccessLabel("public")).toBe("Aberto ao público");
    expect(showAccessShortLabel("public")).toBe("Aberto ao público");
  });

  it("keeps a show marked as private", () => {
    expect(normalizeShowAccess("private")).toBe("private");
    expect(showAccessLabel("private")).toBe("Evento privado");
    expect(showAccessShortLabel("private")).toBe("Privado");
  });

  it("treats missing or unknown values as open to the public", () => {
    expect(normalizeShowAccess(null)).toBe("public");
    expect(normalizeShowAccess(undefined)).toBe("public");
    expect(normalizeShowAccess("")).toBe("public");
    expect(normalizeShowAccess("fechado")).toBe("public");
  });

  it("never returns a label outside the two states", () => {
    const labels = new Set(["Aberto ao público", "Evento privado", "Privado"]);
    for (const raw of ["public", "private", null, undefined, "junk"]) {
      expect(labels.has(showAccessLabel(normalizeShowAccess(raw)))).toBe(true);
      expect(labels.has(showAccessShortLabel(normalizeShowAccess(raw)))).toBe(true);
    }
  });
});
