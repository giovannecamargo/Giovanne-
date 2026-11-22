import { createFileRoute } from "@tanstack/react-router";
import { EditorialGallery } from "@/components/editorial-gallery";
import { photos } from "@/data/site";

export const Route = createFileRoute("/galeria")({
  head: () => ({
    links: [{ rel: "preload", as: "image", href: photos.palco, fetchPriority: "high" }],
    meta: [
      { title: "Galeria — Giovanne Camargo" },
      { name: "description", content: "Vídeos e fotos das apresentações de Giovanne Camargo." },
      { property: "og:title", content: "Galeria — Giovanne Camargo" },
      { property: "og:description", content: "Vídeos e fotos das apresentações de Giovanne Camargo." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});

function Page() {
  return <EditorialGallery />;
}
