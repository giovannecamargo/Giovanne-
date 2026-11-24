import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { signedUrls } from "@/lib/content";
import { getPublishedMediaUrls } from "@/lib/media.functions";
import { resolveExternalMedia } from "@/lib/external-media";

export const isStoredVideoMedia = (path: string) => path.startsWith("videos/") || path.startsWith("video-covers/");

export function useGalleryVideos(admin = false) {
  return useQuery({
    queryKey: ["gallery-videos", admin ? "admin" : "public"],
    queryFn: async () => {
      const { data, error } = await supabase.from("gallery_videos").select("*").order("created_at");
      if (error) throw error;
      const paths = data.flatMap((v) => [v.video_path, v.cover_path]).filter(isStoredVideoMedia);
      const urls = admin ? await signedUrls(paths) : paths.length ? await getPublishedMediaUrls({ data: { paths } }) : {};
      return data.map((v) => ({ ...v, src: isStoredVideoMedia(v.video_path) ? urls[v.video_path] : resolveExternalMedia(v.video_path), poster: isStoredVideoMedia(v.cover_path) ? urls[v.cover_path] : resolveExternalMedia(v.cover_path) }));
    },
    refetchInterval: 4 * 60 * 60 * 1000,
  });
}