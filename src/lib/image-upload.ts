export const compatibleImageTypes = ["image/jpeg", "image/png"] as const;

export function isCompatibleImageType(type: string) {
  return compatibleImageTypes.includes(type as (typeof compatibleImageTypes)[number]);
}

export function validateCompatibleImage(file: Pick<File, "type">) {
  if (!isCompatibleImageType(file.type)) {
    throw new Error("Use uma imagem JPG ou PNG para que ela apareça em todos os dispositivos.");
  }
}
