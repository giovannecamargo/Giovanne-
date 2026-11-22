import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";

export const reviewSchema = z.object({
  client_name: z.string().trim().min(2, "Informe seu nome.").max(80, "Use no máximo 80 caracteres no nome."),
  client_role: z.string().trim().max(80, "Use no máximo 80 caracteres."),
  rating: z.number().int().min(1, "Escolha uma nota de 1 a 5 estrelas.").max(5, "Escolha uma nota de 1 a 5 estrelas."),
  comment: z.string().trim().min(10, "Conte um pouco mais: use pelo menos 10 caracteres.").max(1000, "Use no máximo 1000 caracteres no comentário."),
});

export type ReviewInput = z.infer<typeof reviewSchema>;
export type ReviewStatus = "pending" | "approved" | "rejected";

export function normalizeReviewStatus(status: string): ReviewStatus {
  return status === "approved" || status === "rejected" ? status : "pending";
}

export function isReviewPublic(status: string) {
  return normalizeReviewStatus(status) === "approved";
}

export const reviewStatusLabel: Record<ReviewStatus, string> = {
  pending: "Pendente",
  approved: "Publicada",
  rejected: "Recusada",
};

export function averageRating(ratings: number[]) {
  if (!ratings.length) return 0;
  return ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length;
}

export function useApprovedReviews() {
  return useQuery({
    queryKey: ["reviews", "approved"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reviews")
        .select("id, client_name, client_role, rating, comment, created_at, status")
        .eq("status", "approved")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}
