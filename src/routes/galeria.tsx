import { createFileRoute } from "@tanstack/react-router";
import { EditorialGallery } from "@/components/editorial-gallery";
import galleryAsset from "@/assets/giovanne-palco.webp.asset.json";

export const Route = createFileRoute("/galeria")({
  head: () => ({
    links: [{ rel: "preload", as: "image", href: galleryAsset.url, fetchpriority: "high" }],
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
