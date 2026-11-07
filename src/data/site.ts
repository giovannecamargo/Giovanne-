import palco from "@/assets/giovanne-palco.png.asset.json";
import pb from "@/assets/giovanne-pb.png.asset.json";
import videoGaleria01 from "@/assets/giovanne-galeria-01.mp4.asset.json";
import videoGaleria01Capa from "@/assets/giovanne-galeria-01-capa.jpg.asset.json";

// Número oficial ainda não fornecido — substituir quando recebido.
export const WHATSAPP_NUMBER = "";
export const INSTAGRAM_URL = "https://instagram.com/";

export const whatsappLink = (msg = "Olá! Gostaria de saber sobre a contratação de um show do Giovanne Camargo.") =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;

export const photos = { palco: palco.url, pb: pb.url };

export type ShowEvent = {
  day: string;
  month: string;
  name: string;
  city: string;
  time: string;
  image?: string;
};

// Conteúdo demonstrativo — substituir pela agenda oficial.
export const events: ShowEvent[] = [
  { day: "00", month: "MÊS", name: "Nome do evento", city: "Cidade — UF", time: "00h00" },
  { day: "00", month: "MÊS", name: "Nome do evento", city: "Cidade — UF", time: "00h00" },
  { day: "00", month: "MÊS", name: "Nome do evento", city: "Cidade — UF", time: "00h00" },
];

export const gallery = [
  { src: palco.url, alt: "Giovanne Camargo cantando com violão no palco" },
  { src: pb.url, alt: "Giovanne Camargo em apresentação, foto em preto e branco" },
];

// Adicione parceiros confirmados aqui: { name, logo }
export const partners: { name: string; logo: string }[] = [];

// Vídeos da galeria: "file" = arquivo publicado na CDN, "youtube" = ID do vídeo.
export type GalleryVideo =
  | { kind: "file"; src: string; poster?: string; alt: string }
  | { kind: "youtube"; id: string; alt: string };

export const videos: GalleryVideo[] = [
  {
    kind: "file",
    src: videoGaleria01.url,
    poster: videoGaleria01Capa.url,
    alt: "Giovanne Camargo cantando ao vivo no Royal Lounge, de chapéu e violão",
  },
];

export const nav = [
  { to: "/", label: "Início" },
  { to: "/sobre", label: "Sobre" },
  { to: "/agenda", label: "Agenda" },
  { to: "/shows", label: "Shows" },
  { to: "/galeria", label: "Galeria" },
  { to: "/patrocinadores", label: "Patrocinadores" },
  { to: "/contato", label: "Contato" },
] as const;

