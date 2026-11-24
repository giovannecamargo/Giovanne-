import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/public/media")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        if (Number(request.headers.get("content-length")) > 110000) {
          return Response.json({ error: "Pedido muito grande." }, { status: 413 });
        }
        const { publishedMediaInputSchema, signPublishedMedia } = await import("@/lib/media-signing.server");
        const input = publishedMediaInputSchema.safeParse(await request.json().catch(() => null));
        if (!input.success) return Response.json({ error: "Mídias inválidas." }, { status: 400 });
        try {
          // Public access is restricted to files referenced by public, active records.
          return Response.json(await signPublishedMedia(input.data), {
            headers: { "Cache-Control": "no-store" },
          });
        } catch {
          return Response.json({ error: "Não foi possível carregar as mídias." }, { status: 503 });
        }
      },
    },
  },
});