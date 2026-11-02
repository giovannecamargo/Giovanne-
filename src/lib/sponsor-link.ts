// Turns whatever the admin typed into a safe http(s) destination for a sponsor logo,
// or null when there is nothing usable. Kept free of Supabase imports so it can be
// unit tested without a backend.
export function normalizeSponsorLink(raw: string | null | undefined): string | null {
  const value = (raw ?? "").trim();
  if (!value) return null;
  const candidate = /^[a-z][a-z0-9+.-]*:\/\//i.test(value) ? value : `https://${value}`;
  try {
    const url = new URL(candidate);
    if (url.protocol !== "https:" && url.protocol !== "http:") return null;
    if (!url.hostname.includes(".")) return null;
    return url.toString();
  } catch {
    return null;
  }
}
