import { createFileRoute } from "@tanstack/react-router";
import { SponsorsPage } from "@/components/sponsors";

export const Route = createFileRoute("/patrocinadores")({
  head: () => ({
    meta: [
      { title: "Patrocinadores e Parceiros — Giovanne Camargo" },
      { name: "description", content: "Conheça as empresas e marcas que patrocinam e são parceiras de Giovanne Camargo." },
      { property: "og:title", content: "Patrocinadores e Parceiros — Giovanne Camargo" },
      { property: "og:description", content: "Conheça as empresas e marcas que patrocinam e são parceiras de Giovanne Camargo." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});

function Page() {
  return <SponsorsPage />;
}
