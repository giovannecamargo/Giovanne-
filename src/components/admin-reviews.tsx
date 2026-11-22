import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Check, Star, Trash2, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { normalizeReviewStatus, reviewStatusLabel, type ReviewStatus } from "@/lib/reviews";
import { Button } from "@/components/ui/button";

const filters: Array<[ReviewStatus | "all", string]> = [
  ["pending", "Pendentes"],
  ["approved", "Publicadas"],
  ["rejected", "Recusadas"],
  ["all", "Todas"],
];

function AdminStars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5 text-primary" aria-label={`${rating} de 5 estrelas`}>
      {[1, 2, 3, 4, 5].map((star) => <Star key={star} className={`h-4 w-4 ${star <= rating ? "fill-current" : "opacity-30"}`} />)}
    </div>
  );
}

export function AdminReviews() {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<ReviewStatus | "all">("pending");
  const [message, setMessage] = useState<string | null>(null);
  const { data = [], isLoading, isError } = useQuery({
    queryKey: ["admin-reviews"],
    queryFn: async () => {
      const { data, error } = await supabase.from("reviews").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const visible = filter === "all" ? data : data.filter((review) => normalizeReviewStatus(review.status) === filter);
  const pendingCount = data.filter((review) => normalizeReviewStatus(review.status) === "pending").length;

  function refresh() {
    void queryClient.invalidateQueries({ queryKey: ["admin-reviews"] });
    void queryClient.invalidateQueries({ queryKey: ["reviews", "approved"] });
  }

  async function moderate(id: string, status: Exclude<ReviewStatus, "pending">) {
    setMessage(null);
    const { error } = await supabase.from("reviews").update({ status, updated_at: new Date().toISOString() }).eq("id", id);
    if (error) return setMessage("Não foi possível alterar a avaliação. Tente novamente.");
    refresh();
    setMessage(status === "approved" ? "Avaliação aprovada e publicada no site." : "Avaliação recusada e mantida fora do site.");
  }

  async function remove(id: string) {
    if (!window.confirm("Excluir esta avaliação definitivamente?")) return;
    const { error } = await supabase.from("reviews").delete().eq("id", id);
    if (error) return setMessage("Não foi possível excluir a avaliação.");
    refresh();
    setMessage("Avaliação excluída.");
  }

  return (
    <div className="space-y-6">
      <section className="rounded-sm border border-border bg-card/40 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold">Moderação de avaliações</h2>
            <p className="mt-1 text-sm text-muted-foreground">Somente avaliações aprovadas aparecem no menu Sobre.</p>
          </div>
          {pendingCount > 0 && <span className="rounded-full border border-primary/50 px-3 py-1 text-xs font-semibold text-primary">{pendingCount} aguardando</span>}
        </div>
        <div className="mt-5 flex flex-wrap gap-2" aria-label="Filtrar avaliações">
          {filters.map(([value, label]) => (
            <Button key={value} variant={filter === value ? "default" : "outline"} size="sm" onClick={() => setFilter(value)} aria-pressed={filter === value}>{label}</Button>
          ))}
        </div>
        {message && <p className="mt-4 text-sm text-primary" role="status">{message}</p>}
      </section>

      <section className="rounded-sm border border-border bg-card/40 p-6">
        {isLoading && <p className="text-sm text-muted-foreground">Carregando avaliações…</p>}
        {isError && <p className="text-sm text-destructive">Não foi possível carregar as avaliações.</p>}
        {!isLoading && !isError && !visible.length && <p className="text-sm text-muted-foreground">Nenhuma avaliação nesta situação.</p>}
        <ul className="divide-y divide-border">
          {visible.map((review) => {
            const status = normalizeReviewStatus(review.status);
            return (
              <li key={review.id} className="py-6 first:pt-0 last:pb-0">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="font-semibold">{review.client_name}</h3>
                    {review.client_role && <p className="mt-0.5 text-xs text-muted-foreground">{review.client_role}</p>}
                  </div>
                  <span className={`rounded-full border px-2.5 py-1 text-[11px] ${status === "approved" ? "border-primary/50 text-primary" : "border-border text-muted-foreground"}`}>{reviewStatusLabel[status]}</span>
                </div>
                <div className="mt-3"><AdminStars rating={review.rating} /></div>
                <blockquote className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">{review.comment}</blockquote>
                <p className="mt-3 text-xs text-muted-foreground">Enviada em {new Date(review.created_at).toLocaleDateString("pt-BR")}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {status !== "approved" && <Button size="sm" onClick={() => moderate(review.id, "approved")}><Check /> Aprovar e publicar</Button>}
                  {status !== "rejected" && <Button size="sm" variant="outline" onClick={() => moderate(review.id, "rejected")}><X /> Recusar</Button>}
                  <Button size="sm" variant="ghost" className="text-muted-foreground hover:text-destructive" onClick={() => remove(review.id)} aria-label={`Excluir avaliação de ${review.client_name}`}><Trash2 /> Excluir</Button>
                </div>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
