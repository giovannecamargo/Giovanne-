import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const inputSchema = z.object({ paths: z.array(z.string().min(1).max(1024)).min(1).max(100) });

export const getPublishedMediaUrls = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => inputSchema.parse(input))
  .handler(async ({ data }) => {
    if (process.env["SUPABASE_SERVICE_ROLE_KEY"]) {
      const { signPublishedMedia } = await import("@/lib/media-signing.server");
      return signPublishedMedia(data);
    }
    // External hosts do not have Cloud's private key. Delegate only to the
    // immutable production endpoint; never accept a caller-supplied destination.
    const response = await fetch("https://project--8040149d-1934-4703-9e60-4c93c8e859fd.lovable.app/api/public/media", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      redirect: "error",
      signal: AbortSignal.timeout(20000),
    });
    if (!response.ok) throw new Error("Não foi possível carregar as mídias publicadas.");
    return z.record(z.string(), z.string().url()).parse(await response.json());
  });
