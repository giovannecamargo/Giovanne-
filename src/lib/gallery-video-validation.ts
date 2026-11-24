import { z } from "zod";
import { validateCompatibleImage } from "@/lib/image-upload";

export const videoCaptionSchema = z.string().trim().min(1, "Informe a legenda.").max(500, "A legenda deve ter até 500 caracteres.");
export const maxGalleryVideoSize = 500 * 1024 * 1024;

type GalleryFile = Pick<File, "type" | "size"> & Partial<Pick<File, "name">>;

export function videoFileExtension(file: Pick<File, "type"> & Partial<Pick<File, "name">>) {
  const byType: Record<string, string> = { "video/mp4": "mp4", "video/webm": "webm", "video/quicktime": "mov" };
  if (byType[file.type]) return byType[file.type];
  const extension = file.name?.toLowerCase().split(".").pop();
  return extension && ["mp4", "webm", "mov"].includes(extension) ? extension : undefined;
}

export function validateGalleryFile(file: GalleryFile, kind: "video" | "cover") {
  if (kind === "cover") validateCompatibleImage(file);
  if (kind === "video" && !videoFileExtension(file)) throw new Error("Envie um vídeo MP4, WebM ou MOV.");
  if (file.size === 0) throw new Error("O arquivo está vazio.");
  if (kind === "video" && file.size > maxGalleryVideoSize) throw new Error("O vídeo deve ter no máximo 500 MB.");
}