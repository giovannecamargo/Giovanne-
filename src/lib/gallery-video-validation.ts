import { z } from "zod";
import { compatibleImageTypes, validateCompatibleImage } from "@/lib/image-upload";

export const videoCaptionSchema = z.string().trim().min(1, "Informe a legenda.").max(500, "A legenda deve ter até 500 caracteres.");

export function validateGalleryFile(file: Pick<File, "type" | "size">, kind: "video" | "cover") {
  if (kind === "cover") validateCompatibleImage(file);
  const allowed: readonly string[] = kind === "video" ? ["video/mp4", "video/webm"] : compatibleImageTypes;
  if (!allowed.includes(file.type)) throw new Error("Envie um vídeo MP4 ou WebM.");
  if (file.size === 0) throw new Error("O arquivo está vazio.");
}