import { z } from "zod";

export const videoCaptionSchema = z.string().trim().min(1, "Informe a legenda.").max(500, "A legenda deve ter até 500 caracteres.");

export function validateGalleryFile(file: Pick<File, "type" | "size">, kind: "video" | "cover") {
  const allowed = kind === "video" ? ["video/mp4", "video/webm"] : ["image/jpeg", "image/png", "image/webp"];
  if (!allowed.includes(file.type)) throw new Error(kind === "video" ? "Envie um vídeo MP4 ou WebM." : "Envie uma capa JPG, PNG ou WebP.");
  if (file.size === 0) throw new Error("O arquivo está vazio.");
}