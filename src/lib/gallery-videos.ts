import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { signedUrls } from "@/lib/content";
import { resolveExternalMedia } from "@/lib/external-media";

export const isStoredVideoMedia = (path: string) => path.startsWith("videos/") || path.startsWith("video-covers/");

export function useGalleryVideos() {
  return useQuery({
    queryKey: ["gallery-videos"],
    queryFn: async () => {
      const { data, error } = await supabase.from("gallery_videos").select("*").order("created_at");
      if (error) throw error;
      const urls = await signedUrls(data.flatMap((v) => [v.video_path, v.cover_path]).filter(isStoredVideoMedia));
      return data.map((v) => ({ ...v, src: isStoredVideoMedia(v.video_path) ? urls[v.video_path] : resolveExternalMedia(v.video_path), poster: isStoredVideoMedia(v.cover_path) ? urls[v.cover_path] : resolveExternalMedia(v.cover_path) }));
    },
    refetchInterval: 4 * 60 * 60 * 1000,
  });
}