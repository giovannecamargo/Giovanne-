import { createFileRoute } from "@tanstack/react-router";
import { HiringLanding } from "@/components/hiring/landing";

const title = "Contratar Show — Giovanne Camargo | Pacotes e valores";
const description = "Pacotes de show de Giovanne Camargo com valores, duração e formação. Reserve sua data pelo WhatsApp.";

export const Route = createFileRoute("/contratar-show")({
  head: () => ({
    meta: [
      { title }, { name: "description", content: description },
      { property: "og:title", content: title }, { property: "og:description", content: description },
      { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HiringLanding,
});
