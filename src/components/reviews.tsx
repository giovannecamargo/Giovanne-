import { useState, type FormEvent } from "react";
import { MessageSquareText, Quote, Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { averageRating, reviewSchema, useApprovedReviews } from "@/lib/reviews";
import { btnGold, d } from "@/components/site-ui";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const input = "w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none";

function Stars({ rating, size = "sm" }: { rating: number; size?: "sm" | "lg" }) {
  return (
    <div className="flex gap-0.5 text-primary" aria-label={`${rating} de 5 estrelas`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Star key={star} aria-hidden="true" className={`${size === "lg" ? "h-7 w-7" : "h-4 w-4"} ${star <= rating ? "fill-current" : "opacity-30"}`} />
      ))}
    </div>
  );
}

function ReviewForm({ onSent }: { onSent: () => void }) {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [website, setWebsite] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    if (website) {
      onSent();
      return;
    }
    const parsed = reviewSchema.safeParse({ client_name: name, client_role: role, rating, comment });
    if (!parsed.success) {
      setMessage(parsed.error.issues[0]?.message ?? "Confira os dados informados.");
      return;
    }
    setBusy(true);
    const { error } = await supabase.from("reviews").insert({ ...parsed.data, status: "pending" });
    setBusy(false);
    if (error) {
      setMessage("Não foi possível enviar agora. Tente novamente em instantes.");
      return;
    }
    onSent();
  }

  return (
    <form onSubmit={submit} className="grid gap-4">
      <label className="grid gap-1.5 text-sm">Seu nome
        <input className={input} value={name} onChange={(event) => setName(event.target.value)} maxLength={80} autoComplete="name" required />
      </label>
      <label className="grid gap-1.5 text-sm">Como você contratou o artista? (opcional)
        <select className={input} value={role} onChange={(event) => setRole(event.target.value)}>
          <option value="">Selecione</option>
          <option value="Organizador de eventos">Organizador de eventos</option>
          <option value="Estabelecimento">Estabelecimento</option>
          <option value="Empresa">Empresa</option>
          <option value="Festa particular">Festa particular</option>
          <option value="Outro">Outro</option>
        </select>
      </label>
      <fieldset>
        <legend className="mb-2 text-sm">Sua nota</legend>
        <div className="flex gap-1" role="group" aria-label="Escolha sua nota">
          {[1, 2, 3, 4, 5].map((star) => (
            <button key={star} type="button" onClick={() => setRating(star)} aria-label={`${star} ${star === 1 ? "estrela" : "estrelas"}`} aria-pressed={rating === star} className="rounded-sm p-0.5 text-primary transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
              <Star className={`h-8 w-8 ${star <= rating ? "fill-current" : "opacity-30"}`} />
            </button>
          ))}
        </div>
      </fieldset>
      <label className="grid gap-1.5 text-sm">Seu comentário
        <textarea className={`${input} min-h-28 resize-y`} value={comment} onChange={(event) => setComment(event.target.value)} minLength={10} maxLength={1000} placeholder="Conte como foi a experiência com o show." required />
        <span className="text-right text-xs text-muted-foreground">{comment.length}/1000</span>
      </label>
      <label className="hidden" aria-hidden="true">Site<input tabIndex={-1} autoComplete="off" value={website} onChange={(event) => setWebsite(event.target.value)} /></label>
      {message && <p className="text-sm text-destructive" role="alert">{message}</p>}
      <button className={`${btnGold} w-full`} disabled={busy}>{busy ? "Enviando…" : "Enviar avaliação"}</button>
    </form>
  );
}

export function Testimonials() {
  const { data: reviews = [], isLoading, isError } = useApprovedReviews();
  const [open, setOpen] = useState(false);
  const [sent, setSent] = useState(false);
  const average = averageRating(reviews.map((review) => review.rating));

  return (
    <section className="mx-auto max-w-7xl px-5 pb-24" aria-labelledby="reviews-title">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="eyebrow reveal text-primary" style={d(5)}>Avaliações</p>
          <h2 id="reviews-title" className="reveal mt-3 text-3xl font-bold" style={d(6)}>Quem já contratou</h2>
          {reviews.length > 0 && (
            <div className="mt-4 flex items-center gap-3">
              <Stars rating={Math.round(average)} />
              <p className="text-sm text-muted-foreground"><strong className="text-foreground">{average.toFixed(1).replace(".", ",")}</strong> · {reviews.length} {reviews.length === 1 ? "avaliação" : "avaliações"}</p>
            </div>
          )}
        </div>
        <Dialog open={open} onOpenChange={(value) => { setOpen(value); if (!value) setSent(false); }}>
          <DialogTrigger asChild>
            <button className={btnGold}><MessageSquareText className="h-4 w-4" /> Avaliar agora</button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-y-auto border-border sm:max-w-xl">
            <DialogHeader>
              <DialogTitle className="pr-8 text-2xl">Avalie sua experiência</DialogTitle>
              <DialogDescription>Sua avaliação será publicada depois de aprovada pela administração.</DialogDescription>
            </DialogHeader>
            {sent ? (
              <div className="py-8 text-center" role="status">
                <Star className="mx-auto h-10 w-10 fill-current text-primary" />
                <h3 className="mt-4 text-xl font-semibold">Obrigado pela avaliação!</h3>
                <p className="mt-2 text-sm text-muted-foreground">Ela foi enviada e aparecerá no site após a aprovação.</p>
                <button className={`${btnGold} mt-6`} onClick={() => setOpen(false)}>Fechar</button>
              </div>
            ) : <ReviewForm onSent={() => setSent(true)} />}
          </DialogContent>
        </Dialog>
      </div>

      {isLoading && <p className="mt-10 text-sm text-muted-foreground">Carregando avaliações…</p>}
      {isError && <p className="mt-10 text-sm text-muted-foreground">Não foi possível carregar as avaliações agora.</p>}
      {!isLoading && !isError && !reviews.length && (
        <div className="mt-10 rounded-sm border border-dashed border-border bg-card/30 p-8 text-center">
          <p className="text-muted-foreground">Você contratou um show? Seja o primeiro a compartilhar sua experiência.</p>
        </div>
      )}
      {reviews.length > 0 && (
        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review, index) => (
            <figure key={review.id} className="reveal flex flex-col rounded-sm border border-border bg-card/50 p-7" style={d(7 + (index % 3))}>
              <div className="flex items-center justify-between gap-4"><Quote className="h-6 w-6 text-primary" /><Stars rating={review.rating} /></div>
              <blockquote className="mt-5 flex-1 whitespace-pre-wrap leading-relaxed text-muted-foreground">{review.comment}</blockquote>
              <figcaption className="mt-6 border-t border-border pt-5 text-sm">
                <div className="font-semibold">{review.client_name}</div>
                {review.client_role && <div className="mt-1 text-muted-foreground">{review.client_role}</div>}
              </figcaption>
            </figure>
          ))}
        </div>
      )}
    </section>
  );
}
