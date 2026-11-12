import { createFileRoute } from "@tanstack/react-router";
import { Contact } from "@/components/contact-section";

export const Route = createFileRoute("/contato")({
  head: () => ({
    meta: [
      { title: "Contato e Contratação — Giovanne Camargo" },
      { name: "description", content: "Contrate um show de Giovanne Camargo para o seu evento. Fale pelo WhatsApp." },
      { property: "og:title", content: "Contato e Contratação — Giovanne Camargo" },
      { property: "og:description", content: "Contrate um show de Giovanne Camargo para o seu evento. Fale pelo WhatsApp." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});

function Page() {
  return <Contact />;
}
