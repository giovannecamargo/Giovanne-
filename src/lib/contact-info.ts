import { normalizeSponsorLink } from "@/lib/sponsor-link";

export type ContactInfo = {
  email: string;
  phone: string;
  whatsapp: string;
  instagramUrl: string;
};

export type ContactInfoRecord = {
  email: string;
  phone: string;
  whatsapp: string;
  instagram_url: string;
};

export const emptyContactInfo: ContactInfo = { email: "", phone: "", whatsapp: "", instagramUrl: "" };

export function normalizeContactInfo(record: ContactInfoRecord | null | undefined): ContactInfo {
  return {
    email: record?.email.trim() ?? "",
    phone: record?.phone.trim() ?? "",
    whatsapp: record?.whatsapp.trim() ?? "",
    instagramUrl: normalizeSponsorLink(record?.instagram_url) ?? "",
  };
}

export function whatsappLink(raw: string | null | undefined, message = "Olá! Gostaria de saber sobre a contratação de um show do Giovanne Camargo."): string | null {
  const digits = (raw ?? "").replace(/\D/g, "");
  if (digits.length < 10 || digits.length > 15) return null;
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

export function emailLink(raw: string | null | undefined): string | null {
  const email = (raw ?? "").trim();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? `mailto:${email}` : null;
}

export function phoneLink(raw: string | null | undefined): string | null {
  const value = (raw ?? "").trim();
  const digits = value.replace(/\D/g, "");
  if (digits.length < 8 || digits.length > 15) return null;
  return `tel:${value.startsWith("+") ? "+" : ""}${digits}`;
}
