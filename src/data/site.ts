// Fixed media is served from public/ so it also works on external hosts.
export const brandLogo = "/images/giovanne-logo.png";
export const photos = { palco: "/images/giovanne-palco.jpg", pb: "/images/giovanne-pb.jpg" };

// Adicione parceiros confirmados aqui: { name, logo }
export const partners: { name: string; logo: string }[] = [];

export const nav = [
  { to: "/", label: "Início" },
  { to: "/sobre", label: "Sobre" },
  { to: "/shows", label: "Shows" },
  { to: "/patrocinadores", label: "Patrocinadores" },
  { to: "/contato", label: "Contato" },
] as const;

