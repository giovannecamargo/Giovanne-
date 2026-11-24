import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import type { Database } from "@/integrations/supabase/types";
import { browserFacingMediaUrl, normalizeMediaPaths, selectPublishedMediaPaths } from "@/lib/published-media";

const inputSchema = z.object({ paths: z.array(z.string().min(1).max(1024)).min(1).max(100) });

export const getPublishedMediaUrls = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => inputSchema.parse(input))
  .handler(async ({ data }) => {
    const requested = normalizeMediaPaths(data.paths);
    if (!requested.length) return {} as Record<string, string>;

    const url = process.env["SUPABASE_URL"]!;
    const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
    const supabasePublic = createClient<Database>(url, key, {
      auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
      global: {
        fetch: (input, init) => {
          const headers = new Headers(init?.headers);
          if (key.startsWith("sb_") && headers.get("Authorization") === `Bearer ${key}`) headers.delete("Authorization");
          headers.set("apikey", key);
          return fetch(input, { ...init, headers });
        },
      },
    });

    const now = new Date().toISOString();
    const [photos, sponsors, videosByPath, videosByCover] = await Promise.all([
      supabasePublic.from("photos").select("url").in("url", requested).in("section", ["shows", "galeria"]),
      supabasePublic.from("sponsors").select("logo_url").in("logo_url", requested).lte("starts_at", now).gt("ends_at", now),
      supabasePublic.from("gallery_videos").select("video_path,cover_path").in("video_path", requested),
      supabasePublic.from("gallery_videos").select("video_path,cover_path").in("cover_path", requested),
    ]);

    if (photos.error || sponsors.error || videosByPath.error || videosByCover.error) {
      throw new Error("Não foi possível validar as mídias publicadas.");
    }

    const videos = [...(videosByPath.data ?? []), ...(videosByCover.data ?? [])];
    const allowed = selectPublishedMediaPaths(requested, {
      photos: photos.data ?? [],
      sponsors: sponsors.data ?? [],
      videos,
    });
    if (!allowed.length) return {} as Record<string, string>;

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: signed, error } = await supabaseAdmin.storage.from("media").createSignedUrls(allowed, 60 * 60 * 6);
    if (error) throw new Error("Não foi possível preparar as mídias publicadas.");

    const browserBaseUrl = process.env["VITE_SUPABASE_URL"] ?? url;
    const urls: Record<string, string> = {};
    signed.forEach((item) => {
      if (item.path && item.signedUrl) urls[item.path] = browserFacingMediaUrl(item.signedUrl, browserBaseUrl);
    });
    return urls;
  });
