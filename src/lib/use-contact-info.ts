import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { normalizeContactInfo } from "@/lib/contact-info";

export function useContactInfo() {
  return useQuery({
    queryKey: ["contact-info"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("contact_settings")
        .select("email, phone, whatsapp, instagram_url")
        .eq("id", true)
        .maybeSingle();
      if (error) throw error;
      return normalizeContactInfo(data);
    },
  });
}
