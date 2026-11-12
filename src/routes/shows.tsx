import { createFileRoute } from "@tanstack/react-router";
import { Partners } from "@/components/site";
import { ShowsGallery } from "@/components/shows-gallery";

export const Route = createFileRoute("/shows")({
  head: () => ({
    meta: [
      { title: "Shows e Apresentações — Giovanne Camargo" },
      { name: "description", content: "Fotos de palco e apresentações ao vivo de Giovanne Camargo." },
      { property: "og:title", content: "Shows e Apresentações — Giovanne Camargo" },
      { property: "og:description", content: "Fotos de palco e apresentações ao vivo de Giovanne Camargo." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});

function Page() {
  return <><ShowsGallery /><Partners /></>;
}
