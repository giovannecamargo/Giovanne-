import { whatsappLink } from "@/lib/contact-info";

export type ShowPackage = {
  id: string; order_index: number; code: string; title: string; duration: string; formation: string;
  price: number; sound_included: boolean; description: string; is_highlighted: boolean; is_active: boolean; whatsapp_message: string;
};
export type HiringSettings = { whatsapp_number: string; deposit_percentage: number; valid_cities: string; contract_terms_text: string; general_whatsapp_message: string };

export const emptyHiringSettings: HiringSettings = { whatsapp_number: "", deposit_percentage: 0, valid_cities: "", contract_terms_text: "", general_whatsapp_message: "" };

export function formatBRL(value: number | string): string {
  const n = Number(value);
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 0, maximumFractionDigits: 2 })
    .format(Number.isFinite(n) ? n : 0).replace(/\u00a0/g, " ");
}

export function clampDeposit(value: number | string): number {
  const n = Math.round(Number(value));
  if (!Number.isFinite(n)) return 0;
  return Math.min(100, Math.max(0, n));
}

export function packageWhatsappLink(number: string, pkg?: Pick<ShowPackage, "code" | "title"> & { whatsapp_message?: string }, general = ""): string | null {
  const custom = (pkg ? pkg.whatsapp_message : general)?.trim();
  const msg = custom ? custom : pkg
    ? `Olá! Quero contratar o pacote ${[pkg.code, pkg.title].filter(Boolean).join(" — ")} do Giovanne Camargo.`
    : "Olá! Quero saber sobre a contratação de um show do Giovanne Camargo.";
  return whatsappLink(number, msg);
}
