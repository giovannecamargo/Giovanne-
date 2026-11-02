import { describe, expect, it } from "vitest";

import { normalizeSponsorLink } from "@/lib/sponsor-link";

// A sponsor tile only becomes a clickable exit when the admin supplied a real website,
// and it must never open an address that runs code instead of loading a page.
describe("Sponsor destination link", () => {
  it("keeps a full website address as typed", () => {
    expect(normalizeSponsorLink("https://www.patrocinador.com.br/promo")).toBe("https://www.patrocinador.com.br/promo");
  });

  it("adds https:// to a bare domain typed by the admin", () => {
    expect(normalizeSponsorLink("instagram.com/patrocinador")).toBe("https://instagram.com/patrocinador");
  });

  it("leaves the logo non-clickable when no address was given", () => {
    expect(normalizeSponsorLink("")).toBeNull();
    expect(normalizeSponsorLink("   ")).toBeNull();
    expect(normalizeSponsorLink(null)).toBeNull();
  });

  it("refuses addresses that would run a script instead of opening a site", () => {
    expect(normalizeSponsorLink("javascript:alert(1)")).toBeNull();
    expect(normalizeSponsorLink("data:text/html,<h1>oi</h1>")).toBeNull();
    expect(normalizeSponsorLink("nada de link")).toBeNull();
  });
});
