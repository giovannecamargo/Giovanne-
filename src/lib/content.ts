import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { normalizeSponsorLink } from "@/lib/sponsor-link";
import { getPublishedMediaUrls } from "@/lib/media.functions";

export async function signedUrls(paths: string[]) {
  if (!paths.length) return {} as Record<string, string>;
  const { data } = await supabase.storage.from("media").createSignedUrls(paths, 60 * 60 * 6);
  const map: Record<string, string> = {};
  data?.forEach((d) => { if (d.path && d.signedUrl) map[d.path] = d.signedUrl; });
  return map;
}

export function usePhotos(section: "shows" | "galeria") {
  return useQuery({
    queryKey: ["photos", section],
    queryFn: async () => {
      const { data, error } = await supabase.from("photos").select("*").eq("section", section).order("created_at", { ascending: false });
      if (error) throw error;
      const paths = data.map((p) => p.url);
      const urls = paths.length ? await getPublishedMediaUrls({ data: { paths } }) : {};
      return data.map((p) => ({ ...p, src: urls[p.url] })).filter((p) => p.src);
    },
  });
}


export function useActiveSponsors() {
  return useQuery({
    queryKey: ["sponsors", "active"],
    queryFn: async () => {
      const now = new Date().toISOString();
      const { data, error } = await supabase.from("sponsors").select("*").lte("starts_at", now).gt("ends_at", now).order("created_at");
      if (error) throw error;
      const paths = data.map((s) => s.logo_url);
      const urls = paths.length ? await getPublishedMediaUrls({ data: { paths } }) : {};
      return data.map((s) => ({ ...s, logo: urls[s.logo_url], link: normalizeSponsorLink(s.link_url) })).filter((s) => s.logo);
    },
  });
}
