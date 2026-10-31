import { createFileRoute } from "@tanstack/react-router";
import { Agenda } from "@/components/site";

export const Route = createFileRoute("/agenda")({
  head: () => ({
    meta: [
      { title: "Agenda de Shows — Giovanne Camargo" },
      { name: "description", content: "Confira os próximos shows e apresentações de Giovanne Camargo." },
      { property: "og:title", content: "Agenda de Shows — Giovanne Camargo" },
      { property: "og:description", content: "Confira os próximos shows e apresentações de Giovanne Camargo." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});

function Page() {
  return <Agenda />;
}
