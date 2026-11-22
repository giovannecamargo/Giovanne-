import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { btnGold, btnOutline } from "@/components/site-ui";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: "Recuperar senha — Giovanne Camargo" },
      { name: "description", content: "Defina uma nova senha para acessar a administração do site de Giovanne Camargo." },
      { property: "og:title", content: "Recuperar senha — Giovanne Camargo" },
      { property: "og:description", content: "Defina uma nova senha para acessar a administração do site." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ResetPasswordPage,
});

const input = "w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none";

function ResetPasswordPage() {
  const [checking, setChecking] = useState(true);
  const [recovery, setRecovery] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const hash = new URLSearchParams(window.location.hash.slice(1));
    if (hash.get("type") !== "recovery") {
      setChecking(false);
      return;
    }

    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") setRecovery(true);
    });
    void supabase.auth.getSession().then(({ data }) => {
      if (data.session) setRecovery(true);
      setChecking(false);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setMessage(null);
    if (password !== confirmation) {
      setMessage("As senhas não coincidem.");
      return;
    }
    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password });
    setBusy(false);
    if (error) {
      setMessage("Não foi possível atualizar a senha. Solicite um novo link de recuperação.");
      return;
    }
    setSaved(true);
  }

  return (
    <section className="mx-auto max-w-md px-5 pb-24 pt-32">
      <h1 className="text-3xl font-bold">Recuperar senha</h1>
      <div className="mt-2 h-px w-16 bg-primary" />
      <div className="mt-10">
        {checking ? <p className="text-muted-foreground">Validando o link…</p>
          : saved ? (
            <div className="space-y-5">
              <p className="text-sm text-primary" role="status">Senha atualizada com sucesso.</p>
              <Link to="/admin" search={{ convite: "" }} className={`${btnGold} inline-flex`}>Entrar na administração</Link>
            </div>
          ) : recovery ? (
            <form onSubmit={submit} className="space-y-4">
              <p className="text-sm text-muted-foreground">Escolha uma nova senha para sua conta.</p>
              <input className={input} type="password" autoComplete="new-password" placeholder="Nova senha" minLength={6} value={password} onChange={(event) => setPassword(event.target.value)} required />
              <input className={input} type="password" autoComplete="new-password" placeholder="Repita a nova senha" minLength={6} value={confirmation} onChange={(event) => setConfirmation(event.target.value)} required />
              {message && <p className="text-sm text-primary" role="alert">{message}</p>}
              <button className={`${btnGold} w-full`} disabled={busy}>{busy ? "Salvando…" : "Salvar nova senha"}</button>
            </form>
          ) : (
            <div className="space-y-5">
              <p className="text-sm text-muted-foreground">Este link de recuperação é inválido ou expirou. Solicite um novo na página de administração.</p>
              <Link to="/admin" search={{ convite: "" }} className={`${btnOutline} inline-flex`}>Voltar para a administração</Link>
            </div>
          )}
      </div>
    </section>
  );
}
