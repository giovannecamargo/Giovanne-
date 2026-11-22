import { createFileRoute } from "@tanstack/react-router";
import { Hero, Highlights } from "@/components/home";
import { photos } from "@/data/site";

export const Route = createFileRoute("/")({
  head: () => ({
    links: [{ rel: "preload", as: "image", href: photos.palco, fetchPriority: "high" }],
    meta: [
      { title: "Giovanne Camargo — Cantor Sertanejo | Shows e Eventos" },
      { name: "description", content: "Site oficial de Giovanne Camargo. Agenda de shows, fotos, vídeos e contratação para eventos." },
      { property: "og:title", content: "Giovanne Camargo — Cantor Sertanejo | Shows e Eventos" },
      { property: "og:description", content: "Site oficial de Giovanne Camargo. Agenda de shows, fotos, vídeos e contratação para eventos." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});

function Page() {
  return (<><Hero /><Highlights /></>);
}
