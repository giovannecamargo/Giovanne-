import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Trash2, LogOut, Upload, Pencil, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { btnGold, btnOutline } from "@/components/site-ui";
import { signedUrls } from "@/lib/content";
import { normalizeSponsorLink } from "@/lib/sponsor-link";
import type { Session } from "@supabase/supabase-js";
import { AdminVideos } from "@/components/admin-videos";
import { AdminContact } from "@/components/admin-contact";
import { AdminReviews } from "@/components/admin-reviews";
import { Button } from "@/components/ui/button";
import { validateCompatibleImage } from "@/lib/image-upload";
import { adminConfirmationUrl, passwordResetUrl, shouldShowAdminSignup } from "@/lib/admin-auth";

export const Route = createFileRoute("/admin")({
  validateSearch: (search): { convite: string } => ({
    convite: typeof search["convite"] === "string" ? search["convite"] : "",
  }),
  head: () => ({
    meta: [
      { title: "Administração — Giovanne Camargo" },
      { name: "description", content: "Painel de administração do site de Giovanne Camargo." },
      { property: "og:title", content: "Administração — Giovanne Camargo" },
      { property: "og:description", content: "Painel de administração do site." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminPage,
});

const input = "w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none";

async function uploadFile(file: File, folder: string) {
  validateCompatibleImage(file);
  const ext = file.type === "image/png" ? "png" : "jpg";
  const path = `${folder}/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from("media").upload(path, file, { contentType: file.type });
  if (error) throw error;
  return path;
}

function AdminPage() {
  const { convite } = Route.useSearch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [session, setSession] = useState<Session | null | undefined>(undefined);
  const [inviteError, setInviteError] = useState<string | null>(null);
  const userId = session?.user.id;

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, []);

  const { data: isAdmin, isLoading } = useQuery({
    queryKey: ["is-admin", userId],
    enabled: !!userId,
    queryFn: async () => {
      const { data } = await supabase.rpc("has_role", { _user_id: userId!, _role: "admin" });
      return !!data;
    },
  });

  useEffect(() => {
    if (!userId || !convite || isAdmin !== false) return;
    let active = true;
    setInviteError(null);
    void supabase.rpc("consume_admin_invite", { invite_token: convite, invited_user_id: userId }).then(({ error }) => {
      if (!active) return;
      if (error) {
        setInviteError("Este convite é inválido, expirou ou já foi utilizado.");
        return;
      }
      void queryClient.invalidateQueries({ queryKey: ["is-admin", userId] });
      void navigate({ to: "/admin", search: { convite: "" }, replace: true });
    });
    return () => { active = false; };
  }, [convite, isAdmin, navigate, queryClient, userId]);

  return (
    <section className="mx-auto max-w-5xl px-5 pb-24 pt-32">
      <h1 className="text-3xl font-bold">Administração</h1>
      <div className="mt-2 h-px w-16 bg-primary" />
      <div className="mt-10">
        {session === undefined || (session && isLoading) ? <p className="text-muted-foreground">Carregando…</p>
          : !session ? <Login invite={convite} />
          : !isAdmin ? <NoAccess message={inviteError} />
          : <Dashboard />}
      </div>
    </section>
  );
}

function NoAccess({ message }: { message: string | null }) {
  return (
    <div>
      <p className="text-muted-foreground">{message ?? "Esta conta não tem acesso de administrador."}</p>
      <button className={`${btnOutline} mt-4`} onClick={() => supabase.auth.signOut()}>Sair</button>
    </div>
  );
}

function Login({ invite }: { invite: string }) {
  const { data: hasAdmin } = useQuery({
    queryKey: ["admin-exists"],
    queryFn: async () => (await supabase.rpc("admin_exists")).data ?? true,
  });
  const signup = shouldShowAdminSignup(hasAdmin, invite);
  const [forgot, setForgot] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault(); setBusy(true); setMsg(null);
    if (forgot) {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: passwordResetUrl(window.location.origin),
      });
      setMsg(error ? "Não foi possível enviar a recuperação. Tente novamente." : "Se o e-mail estiver cadastrado, você receberá o link para criar uma nova senha.");
    } else if (signup) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: adminConfirmationUrl(window.location.origin, invite) },
      });
      if (error) setMsg("Não foi possível criar a conta. Confira os dados e tente novamente.");
      else if (!data.session) setMsg("Conta criada! Confirme pelo link enviado ao seu e-mail para liberar o acesso.");
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setMsg("E-mail ou senha incorretos.");
    }
    setBusy(false);
  }

  const title = forgot ? "Informe seu e-mail para receber o link de recuperação."
    : signup ? invite ? "Use o convite recebido para criar sua conta de administrador." : "Crie a primeira conta de administrador."
    : "Entre com sua conta de administrador.";

  return (
    <form onSubmit={submit} className="max-w-sm space-y-4">
      <p className="text-sm text-muted-foreground">{title}</p>
      <input className={input} type="email" autoComplete="email" placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} required />
      {!forgot && <input className={input} type="password" autoComplete={signup ? "new-password" : "current-password"} placeholder="Senha" minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} required />}
      {msg && <p className="text-sm text-primary" role="status">{msg}</p>}
      <button className={`${btnGold} w-full`} disabled={busy}>{busy ? "Aguarde…" : forgot ? "Enviar recuperação" : signup ? "Criar conta" : "Entrar"}</button>
      {!signup && <button type="button" className="text-sm text-muted-foreground underline underline-offset-4 hover:text-primary" onClick={() => { setForgot(!forgot); setMsg(null); }}>
        {forgot ? "Voltar para o login" : "Esqueci minha senha"}
      </button>}
    </form>
  );
}

function Panel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-sm border border-border bg-card/40 p-6">
      <h2 className="mb-5 text-xl font-semibold">{title}</h2>
      {children}
    </div>
  );
}

function Dashboard() {
  const [tab, setTab] = useState<"sponsors" | "shows" | "galeria" | "reviews" | "contact">("sponsors");
  const tabs = [["sponsors", "Patrocinadores"], ["shows", "Página Shows"], ["galeria", "Fotos da Galeria"], ["reviews", "Avaliações"], ["contact", "Contato"]] as const;
  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center gap-2">
        {tabs.map(([k, l]) => (
          <Button key={k} onClick={() => setTab(k)} variant={tab === k ? "default" : "outline"} aria-pressed={tab === k}>{l}</Button>
        ))}
        <button onClick={() => supabase.auth.signOut()} className="ml-auto inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"><LogOut className="h-4 w-4" />Sair</button>
      </div>
      {tab === "sponsors" && <Sponsors />}
      {tab === "shows" && <div className="space-y-12"><section><h2 className="mb-4 text-xl font-semibold">Fotos da página Shows</h2><PhotosAdmin section="shows" /></section><section><h2 className="mb-4 text-xl font-semibold">Vídeos da página Shows</h2><AdminVideos /></section></div>}
      {tab === "galeria" && <PhotosAdmin section="galeria" />}
      {tab === "reviews" && <AdminReviews />}
      {tab === "contact" && <AdminContact />}
    </div>
  );
}

const today = () => new Date().toISOString().slice(0, 10);
const plusDays = (n: number) => new Date(Date.now() + n * 864e5).toISOString().slice(0, 10);

function Sponsors() {
  const qc = useQueryClient();
  const { data = [] } = useQuery({
    queryKey: ["admin-sponsors"],
    queryFn: async () => {
      const { data, error } = await supabase.from("sponsors").select("*").order("ends_at", { ascending: false });
      if (error) throw error;
      const urls = await signedUrls(data.map((s) => s.logo_url));
      return data.map((s) => ({ ...s, logo: urls[s.logo_url], link: normalizeSponsorLink(s.link_url) }));
    },
  });
  const [name, setName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [link, setLink] = useState("");
  const [start, setStart] = useState(today());
  const [end, setEnd] = useState(plusDays(30));
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [editLink, setEditLink] = useState("");
  const [editEnd, setEditEnd] = useState(plusDays(30));
  const refresh = () => { qc.invalidateQueries({ queryKey: ["admin-sponsors"] }); qc.invalidateQueries({ queryKey: ["sponsors"] }); };

  async function add(e: FormEvent) {
    e.preventDefault(); if (!file) return; setBusy(true); setMsg(null);
    try {
      if (end <= start) throw new Error("A data final precisa ser depois da inicial.");
      const url = normalizeSponsorLink(link);
      if (link.trim() && !url) throw new Error("Link inválido. Use algo como https://www.exemplo.com.br");
      const path = await uploadFile(file, "sponsors");
      const { error } = await supabase.from("sponsors").insert({
        name, logo_url: path, link_url: url,
        starts_at: new Date(`${start}T00:00:00`).toISOString(),
        ends_at: new Date(`${end}T23:59:59`).toISOString(),
      });
      if (error) throw error;
      setName(""); setFile(null); setLink(""); (e.target as HTMLFormElement).reset(); refresh(); setMsg("Patrocinador adicionado.");
    } catch (err: any) { setMsg(err.message ?? "Erro ao salvar."); }
    setBusy(false);
  }

  function openEdit(s: { id: string; link: string | null; ends_at: string }) {
    setEditId(s.id); setEditLink(s.link ?? "");
    setEditEnd(new Date(s.ends_at).toLocaleDateString("sv-SE"));
  }

  async function saveEdit(id: string, currentEnd: string) {
    const url = normalizeSponsorLink(editLink);
    if (editLink.trim() && !url) return setMsg("Link inválido. Use algo como https://www.exemplo.com.br");
    const patch: { link_url: string | null; ends_at?: string } = { link_url: url };
    const changedDate = editEnd !== new Date(currentEnd).toLocaleDateString("sv-SE");
    if (changedDate) {
      const ends = new Date(`${editEnd}T23:59:59`);
      if (Number.isNaN(ends.getTime()) || ends.getTime() <= Date.now()) return setMsg("Escolha uma data final futura.");
      patch.ends_at = ends.toISOString();
    }
    const { error } = await supabase.from("sponsors").update(patch).eq("id", id);
    if (error) return setMsg("Não foi possível salvar.");
    setEditId(null); refresh();
    setMsg(changedDate ? `Salvo. Fica no site até ${new Date(`${editEnd}T12:00:00`).toLocaleDateString("pt-BR")}.` : "Alterações salvas.");
  }

  const [dates, setDates] = useState<Record<string, string>>({});
  const [renewId, setRenewId] = useState<string | null>(null);
  const plusDaysFrom = (iso: string, n: number) => {
    const base = Math.max(Date.now(), +new Date(iso));
    return new Date(base + n * 86400000).toLocaleDateString("sv-SE");
  };
  async function saveDate(id: string) {
    const value = dates[id]; if (!value) return;
    const ends = new Date(`${value}T23:59:59`);
    if (Number.isNaN(ends.getTime()) || ends.getTime() <= Date.now()) return setMsg("Escolha uma data final futura.");
    const { error } = await supabase.from("sponsors").update({ ends_at: ends.toISOString() }).eq("id", id);
    if (error) return setMsg("Não foi possível salvar a data.");
    setDates(({ [id]: _, ...rest }) => rest); setRenewId(null); refresh();
    setMsg(`Data salva. Fica no site até ${new Date(`${value}T12:00:00`).toLocaleDateString("pt-BR")}.`);
  }

  async function remove(id: string, path: string) {
    if (!confirm("Remover este patrocinador?")) return;
    await supabase.from("sponsors").delete().eq("id", id);
    await supabase.storage.from("media").remove([path]);
    refresh();
  }

  const now = Date.now();
  return (
    <div className="space-y-6">
      <Panel title="Adicionar patrocinador">
        <form onSubmit={add} className="grid gap-4 sm:grid-cols-2">
          <label className="text-sm sm:col-span-2">Nome<input className={`${input} mt-1`} value={name} onChange={(e) => setName(e.target.value)} required /></label>
          <label className="text-sm sm:col-span-2">Logo<input className={`${input} mt-1`} type="file" accept="image/jpeg,image/png" onChange={(e) => setFile(e.target.files?.[0] ?? null)} required /></label>
          <label className="text-sm sm:col-span-2">
            Site do patrocinador (opcional)
            <input className={`${input} mt-1`} type="text" inputMode="url" placeholder="https://www.instagram.com/patrocinador" value={link} onChange={(e) => setLink(e.target.value)} />
            <span className="mt-1 block text-xs text-muted-foreground">Quem clicar no logo abre esse site. Deixe em branco para o logo não ser clicável.</span>
          </label>
          <label className="text-sm">Ativo a partir de<input className={`${input} mt-1`} type="date" value={start} onChange={(e) => setStart(e.target.value)} required /></label>
          <label className="text-sm">Ativo até<input className={`${input} mt-1`} type="date" value={end} onChange={(e) => setEnd(e.target.value)} required /></label>
          {msg && <p className="text-sm text-primary sm:col-span-2">{msg}</p>}
          <button className={`${btnGold} sm:col-span-2`} disabled={busy}>{busy ? "Salvando…" : "Adicionar"}</button>
        </form>
      </Panel>
      <Panel title="Patrocinadores cadastrados">
        {!data.length && <p className="text-sm text-muted-foreground">Nenhum patrocinador ainda.</p>}
        <ul className="divide-y divide-border">
          {data.map((s) => {
            const active = now >= +new Date(s.starts_at) && now < +new Date(s.ends_at);
            const future = now < +new Date(s.starts_at);
            const editing = editId === s.id;
            return (
              <li key={s.id} className="flex flex-wrap items-center gap-4 py-3">
                <div className="flex h-12 w-20 items-center justify-center bg-background">{s.logo && <img src={s.logo} alt={s.name} className="max-h-10 max-w-full" />}</div>
                <div className="min-w-0 flex-1">
                  <div className="font-medium">{s.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(s.starts_at).toLocaleDateString("pt-BR")} até {new Date(s.ends_at).toLocaleDateString("pt-BR")} ·{" "}
                    <span className={active ? "text-primary" : ""}>{active ? "No site" : future ? "Agendado" : "Expirado (fora do site)"}</span>
                    {renewId !== s.id && (
                      <button onClick={() => { setRenewId(s.id); setDates({ ...dates, [s.id]: plusDaysFrom(s.ends_at, 30) }); }} className={`${btnGold} ml-2 inline-flex items-center gap-1 px-3 py-1 text-xs`}>
                        <RefreshCw className="h-3.5 w-3.5" /> Renovar
                      </button>
                    )}
                  </div>
                  {renewId === s.id && (
                    <div className="mt-2 flex flex-wrap items-end gap-2 border border-primary/40 bg-background/40 p-2">
                      <label className="grid gap-1 text-xs">
                        <span className="font-semibold text-primary">Nova data final</span>
                        <input className={`${input} py-1`} type="date" aria-label={`Nova data final de ${s.name}`}
                          value={dates[s.id] ?? ""} onChange={(e) => setDates({ ...dates, [s.id]: e.target.value })} />
                      </label>
                      <button onClick={() => saveDate(s.id)} className={`${btnGold} px-3 py-2 text-xs`}>Salvar</button>
                      <button onClick={() => setRenewId(null)} className="px-3 py-2 text-xs text-muted-foreground hover:text-foreground">Cancelar</button>
                    </div>
                  )}
                  {editing ? (
                    <div className="mt-3 grid max-w-md gap-3 border border-primary/40 bg-background/40 p-3">
                      <label className="grid gap-1 text-xs">
                        <span className="text-muted-foreground">Site do patrocinador (opcional)</span>
                        <input className={input} placeholder="https://www.exemplo.com.br" value={editLink} onChange={(e) => setEditLink(e.target.value)} />
                      </label>
                      <div className="flex gap-2">
                        <button onClick={() => saveEdit(s.id, s.ends_at)} className={`${btnGold} px-4 py-2 text-xs`}>Salvar</button>
                        <button onClick={() => setEditId(null)} className="px-3 py-2 text-xs text-muted-foreground hover:text-foreground">Cancelar</button>
                      </div>
                    </div>
                  ) : (
                    <>
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      {s.link
                        ? <a href={s.link} target="_blank" rel="noopener noreferrer" className="truncate text-xs text-primary hover:underline">{s.link}</a>
                        : <span className="text-xs text-muted-foreground">Sem site — logo não clicável</span>}
                      <button onClick={() => openEdit(s)} className="inline-flex items-center gap-1 border border-primary/50 px-2 py-1 text-xs font-semibold text-primary hover:bg-primary/10"><Pencil className="h-3.5 w-3.5" /> Editar link</button>
                    </div>
                    </>
                  )}
                </div>
                <button onClick={() => remove(s.id, s.logo_url)} aria-label="Remover" className="text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
              </li>
            );
          })}
        </ul>
      </Panel>
    </div>
  );
}

function PhotosAdmin({ section }: { section: "shows" | "galeria" }) {
  const qc = useQueryClient();
  const key = ["admin-photos", section];
  const { data = [] } = useQuery({
    queryKey: key,
    queryFn: async () => {
      const { data, error } = await supabase.from("photos").select("*").eq("section", section).order("created_at", { ascending: false });
      if (error) throw error;
      const urls = await signedUrls(data.map((p) => p.url));
      return data.map((p) => ({ ...p, src: urls[p.url] }));
    },
  });
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const refresh = () => { qc.invalidateQueries({ queryKey: key }); qc.invalidateQueries({ queryKey: ["photos", section] }); };

  async function onFiles(fileList: FileList | null) {
    const files = fileList ? Array.from(fileList) : [];
    if (!files.length) return; setBusy(true); setMsg(null);
    try {
      for (const f of files) {
        const path = await uploadFile(f, section);
        const { error } = await supabase.from("photos").insert({ url: path, section });
        if (error) throw error;
      }
      refresh(); setMsg(`${files.length} foto(s) adicionada(s).`);
    } catch (err: any) { setMsg(err.message ?? "Erro ao enviar."); }
    setBusy(false);
  }
  async function remove(id: string, path: string) {
    if (!confirm("Remover esta foto?")) return;
    await supabase.from("photos").delete().eq("id", id);
    await supabase.storage.from("media").remove([path]); refresh();
  }

  return (
    <Panel title={section === "shows" ? "Fotos da página Shows" : "Fotos da página Galeria"}>
      <label className={`${btnGold} cursor-pointer`}>
        <Upload className="h-4 w-4" />{busy ? "Enviando…" : "Adicionar fotos"}
        <input type="file" accept="image/jpeg,image/png" multiple className="hidden" disabled={busy} onChange={(e) => { onFiles(e.target.files); e.target.value = ""; }} />
      </label>
      {msg && <p className="mt-3 text-sm text-primary">{msg}</p>}
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {data.map((p) => (
          <div key={p.id} className="group relative aspect-square overflow-hidden rounded-sm bg-background">
            {p.src && <img src={p.src} alt="" className="h-full w-full object-cover" />}
            <button onClick={() => remove(p.id, p.url)} aria-label="Remover foto" className="absolute right-2 top-2 rounded-md bg-background/80 p-2 hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
          </div>
        ))}
      </div>
      {!data.length && <p className="mt-4 text-sm text-muted-foreground">Nenhuma foto enviada ainda.</p>}
    </Panel>
  );
}
