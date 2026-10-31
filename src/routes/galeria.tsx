import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Gallery, Lightbox } from "@/components/site";

export const Route = createFileRoute("/galeria")({
  head: () => ({
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
  const [img, setImg] = useState<string | null>(null);
  return (<><Gallery onOpen={setImg} /><Lightbox src={img} onClose={() => setImg(null)} /></>);
}
