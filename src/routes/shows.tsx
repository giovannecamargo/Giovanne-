import { createFileRoute } from "@tanstack/react-router";
import { Partners } from "@/components/sponsors";
import { ShowsVideos } from "@/components/shows-videos";

export const Route = createFileRoute("/shows")({
  head: () => ({
    meta: [
      { title: "Shows e Apresentações — Giovanne Camargo" },
      { name: "description", content: "Vídeos de shows e apresentações ao vivo de Giovanne Camargo." },
      { property: "og:title", content: "Shows e Apresentações — Giovanne Camargo" },
      { property: "og:description", content: "Vídeos de shows e apresentações ao vivo de Giovanne Camargo." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});

function Page() {
  return <><ShowsVideos /><Partners /></>;
}
