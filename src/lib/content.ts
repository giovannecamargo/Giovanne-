import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const MONTHS = ["JAN", "FEV", "MAR", "ABR", "MAI", "JUN", "JUL", "AGO", "SET", "OUT", "NOV", "DEZ"];

export async function signedUrls(paths: string[]) {
  if (!paths.length) return {} as Record<string, string>;
  const { data } = await supabase.storage.from("media").createSignedUrls(paths, 60 * 60 * 6);
  const map: Record<string, string> = {};
  data?.forEach((d) => { if (d.path && d.signedUrl) map[d.path] = d.signedUrl; });
  return map;
}

export function formatShowDate(date: string) {
  const [, m, d] = date.split("-");
  return { day: d, month: MONTHS[Number(m) - 1] ?? "" };
}

export function useShows() {
  return useQuery({
    queryKey: ["shows"],
    queryFn: async () => {
      const today = new Date().toISOString().slice(0, 10);
      const { data, error } = await supabase.from("shows").select("*").gte("event_date", today).order("event_date");
      if (error) throw error;
      return data;
    },
  });
}

export function usePhotos(section: "shows" | "galeria") {
  return useQuery({
    queryKey: ["photos", section],
    queryFn: async () => {
      const { data, error } = await supabase.from("photos").select("*").eq("section", section).order("created_at", { ascending: false });
      if (error) throw error;
      const urls = await signedUrls(data.map((p) => p.url));
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
      const urls = await signedUrls(data.map((s) => s.logo_url));
      return data.map((s) => ({ ...s, logo: urls[s.logo_url] })).filter((s) => s.logo);
    },
  });
}
