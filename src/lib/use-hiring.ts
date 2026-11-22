import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { emptyHiringSettings, type HiringSettings, type ShowPackage } from "@/lib/hiring";

export function usePublicPackages() {
  return useQuery({
    queryKey: ["show-packages"],
    queryFn: async () => {
      const { data, error } = await supabase.from("show_packages").select("*").eq("is_active", true).order("order_index");
      if (error) throw error;
      return (data ?? []).map((p) => ({ ...p, price: Number(p.price) })) as ShowPackage[];
    },
  });
}

export function useHiringSettings() {
  return useQuery({
    queryKey: ["hiring-settings"],
    queryFn: async (): Promise<HiringSettings> => {
      const { data, error } = await supabase.from("hiring_settings").select("whatsapp_number, deposit_percentage, valid_cities, contract_terms_text, general_whatsapp_message").eq("id", true).maybeSingle();
      if (error) throw error;
      return data ?? emptyHiringSettings;
    },
  });
}
