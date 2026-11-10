import { createFileRoute } from "@tanstack/react-router";
import { About, Testimonials } from "@/components/site";

export const Route = createFileRoute("/sobre")({
  head: () => ({
    meta: [
      { title: "Sobre — Giovanne Camargo" },
      { name: "description", content: "Conheça a trajetória de Giovanne Camargo: as raízes no sertanejo, 12 anos de estrada, referências musicais e a conexão com o público." },
      { property: "og:title", content: "Sobre — Giovanne Camargo" },
      { property: "og:description", content: "Conheça a trajetória de Giovanne Camargo: as raízes no sertanejo, 12 anos de estrada, referências musicais e a conexão com o público." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});

function Page() {
  return (<><About /><Testimonials /></>);
}
