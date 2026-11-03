export type ShowAccess = "public" | "private";

/** Anything that is not explicitly "private" (missing, null, unknown value) counts as open to the public. */
export function normalizeShowAccess(value: unknown): ShowAccess {
  return value === "private" ? "private" : "public";
}

export function showAccessLabel(access: ShowAccess) {
  return access === "private" ? "Evento privado" : "Aberto ao público";
}

export function showAccessShortLabel(access: ShowAccess) {
  return access === "private" ? "Privado" : "Aberto ao público";
}
