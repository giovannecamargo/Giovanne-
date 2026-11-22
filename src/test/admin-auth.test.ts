import { describe, expect, it } from "vitest";
import { adminConfirmationUrl, passwordResetUrl, shouldShowAdminSignup } from "@/lib/admin-auth";

describe("admin authentication", () => {
  it("allows an invited client to register even when an admin already exists", () => {
    expect(shouldShowAdminSignup(true, "convite-de-teste")).toBe(true);
  });

  it("keeps regular admin signup closed when no invite is present", () => {
    expect(shouldShowAdminSignup(true, "")).toBe(false);
  });

  it("allows the initial admin signup when no admin exists", () => {
    expect(shouldShowAdminSignup(false, "")).toBe(true);
  });

  it("returns the client to the same invited admin URL after email confirmation", () => {
    expect(adminConfirmationUrl("https://www.giovannecamargo.com.br", "convite 123")).toBe(
      "https://www.giovannecamargo.com.br/admin?convite=convite+123",
    );
  });

  it("sends password recovery to the public reset-password page", () => {
    expect(passwordResetUrl("https://www.giovannecamargo.com.br")).toBe(
      "https://www.giovannecamargo.com.br/reset-password",
    );
  });
});
