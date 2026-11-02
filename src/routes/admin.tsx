import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Trash2, LogOut, Upload, Pencil, Check, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { btnGold, btnOutline } from "@/components/site";
import { formatShowDate, signedUrls } from "@/lib/content";
import { normalizeSponsorLink } from "@/lib/sponsor-link";
import type { Session } from "@supabase/supabase-js";

export const Route = createFileRoute("/admin")({
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
  const ext = file.name.split(".").pop() || "jpg";
  const path = `${folder}/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from("media").upload(path, file, { contentType: file.type });
  if (error) throw error;
  return path;
}

function AdminPage() {
  const [session, setSession] = useState<Session | null | undefined>(undefined);
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, []);

  const { data: isAdmin, isLoading } = useQuery({
    queryKey: ["is-admin", session?.user.id],
    enabled: !!session,
    queryFn: async () => {
      const { data } = await supabase.rpc("has_role", { _user_id: session!.user.id, _role: "admin" });
      return !!data;
    },
  });

  return (
    <section className="mx-auto max-w-5xl px-5 pb-24 pt-32">
      <h1 className="text-3xl font-bold">Administração</h1>
      <div className="mt-2 h-px w-16 bg-primary" />
      <div className="mt-10">
        {session === undefined || (session && isLoading) ? <p className="text-muted-foreground">Carregando…</p>
          : !session ? <Login />
          : !isAdmin ? <NoAccess />
          : <Dashboard />}
      </div>
    </section>
  );
}

function NoAccess() {
  return (
    <div>
      <p className="text-muted-foreground">Esta conta não tem acesso de administrador.</p>
      <button className={`${btnOutline} mt-4`} onClick={() => supabase.auth.signOut()}>Sair</button>
    </div>
  );
}

function Login() {
  const { data: hasAdmin } = useQuery({
    queryKey: ["admin-exists"],
    queryFn: async () => (await supabase.rpc("admin_exists")).data ?? true,
  });
  const signup = hasAdmin === false;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault(); setBusy(true); setMsg(null);
    if (signup) {
      const { data, error } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: `${window.location.origin}/admin` } });
      if (error) setMsg(error.message);
      else if (!data.session) setMsg("Conta criada! Confirme pelo link enviado ao seu e-mail e depois entre aqui.");
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setMsg("E-mail ou senha incorretos.");
    }
    setBusy(false);
  }

  return (
    <form onSubmit={submit} className="max-w-sm space-y-4">
      <p className="text-sm text-muted-foreground">{signup ? "Crie a conta do administrador (só pode existir uma)." : "Entre com sua conta de administrador."}</p>
      <input className={input} type="email" placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} required />
      <input className={input} type="password" placeholder="Senha" minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} required />
      {msg && <p className="text-sm text-primary">{msg}</p>}
      <button className={`${btnGold} w-full`} disabled={busy}>{signup ? "Criar conta" : "Entrar"}</button>
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
  const [tab, setTab] = useState<"sponsors" | "agenda" | "shows" | "galeria">("sponsors");
  const tabs = [["sponsors", "Patrocinadores"], ["agenda", "Agenda"], ["shows", "Fotos de Shows"], ["galeria", "Fotos da Galeria"]] as const;
  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center gap-2">
        {tabs.map(([k, l]) => (
          <button key={k} onClick={() => setTab(k)} className={tab === k ? `${btnGold} px-4 py-2` : `${btnOutline} px-4 py-2`}>{l}</button>
        ))}
        <button onClick={() => supabase.auth.signOut()} className="ml-auto inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"><LogOut className="h-4 w-4" />Sair</button>
      </div>
      {tab === "sponsors" && <Sponsors />}
      {tab === "agenda" && <AgendaAdmin />}
      {tab === "shows" && <PhotosAdmin section="shows" />}
      {tab === "galeria" && <PhotosAdmin section="galeria" />}
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
      return data.map((s) => ({ ...s, logo: urls[s.logo_url] }));
    },
  });
  const [name, setName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [start, setStart] = useState(today());
  const [end, setEnd] = useState(plusDays(30));
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const refresh = () => { qc.invalidateQueries({ queryKey: ["admin-sponsors"] }); qc.invalidateQueries({ queryKey: ["sponsors"] }); };

  async function add(e: FormEvent) {
    e.preventDefault(); if (!file) return; setBusy(true); setMsg(null);
    try {
      if (end <= start) throw new Error("A data final precisa ser depois da inicial.");
      const path = await uploadFile(file, "sponsors");
      const { error } = await supabase.from("sponsors").insert({
        name, logo_url: path,
        starts_at: new Date(`${start}T00:00:00`).toISOString(),
        ends_at: new Date(`${end}T23:59:59`).toISOString(),
      });
      if (error) throw error;
      setName(""); setFile(null); (e.target as HTMLFormElement).reset(); refresh(); setMsg("Patrocinador adicionado.");
    } catch (err: any) { setMsg(err.message ?? "Erro ao salvar."); }
    setBusy(false);
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
          <label className="text-sm sm:col-span-2">Logo<input className={`${input} mt-1`} type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] ?? null)} required /></label>
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
            return (
              <li key={s.id} className="flex items-center gap-4 py-3">
                <div className="flex h-12 w-20 items-center justify-center bg-background">{s.logo && <img src={s.logo} alt={s.name} className="max-h-10 max-w-full" />}</div>
                <div className="min-w-0 flex-1">
                  <div className="font-medium">{s.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(s.starts_at).toLocaleDateString("pt-BR")} até {new Date(s.ends_at).toLocaleDateString("pt-BR")} ·{" "}
                    <span className={active ? "text-primary" : ""}>{active ? "No site" : future ? "Agendado" : "Expirado (fora do site)"}</span>
                  </div>
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

function AgendaAdmin() {
  const qc = useQueryClient();
  const { data = [] } = useQuery({
    queryKey: ["admin-shows"],
    queryFn: async () => {
      const { data, error } = await supabase.from("shows").select("*").order("event_date");
      if (error) throw error;
      return data;
    },
  });
  const empty = { id: "", name: "", city: "", event_date: today(), event_time: "" };
  const [form, setForm] = useState(empty);
  const [msg, setMsg] = useState<string | null>(null);
  const refresh = () => { qc.invalidateQueries({ queryKey: ["admin-shows"] }); qc.invalidateQueries({ queryKey: ["shows"] }); };

  async function save(e: FormEvent) {
    e.preventDefault(); setMsg(null);
    const { id, ...row } = form;
    const { error } = id ? await supabase.from("shows").update(row).eq("id", id) : await supabase.from("shows").insert(row);
    if (error) return setMsg(error.message);
    setForm(empty); refresh(); setMsg(id ? "Show atualizado." : "Show adicionado.");
  }
  async function remove(id: string) {
    if (!confirm("Remover este show?")) return;
    await supabase.from("shows").delete().eq("id", id); refresh();
  }

  return (
    <div className="space-y-6">
      <Panel title={form.id ? "Editar show" : "Adicionar show"}>
        <form onSubmit={save} className="grid gap-4 sm:grid-cols-2">
          <label className="text-sm sm:col-span-2">Nome do evento<input className={`${input} mt-1`} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></label>
          <label className="text-sm sm:col-span-2">Cidade — UF<input className={`${input} mt-1`} value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} required /></label>
          <label className="text-sm">Data<input className={`${input} mt-1`} type="date" value={form.event_date} onChange={(e) => setForm({ ...form, event_date: e.target.value })} required /></label>
          <label className="text-sm">Horário<input className={`${input} mt-1`} type="time" value={form.event_time} onChange={(e) => setForm({ ...form, event_time: e.target.value })} required /></label>
          {msg && <p className="text-sm text-primary sm:col-span-2">{msg}</p>}
          <div className="flex gap-3 sm:col-span-2">
            <button className={`${btnGold} flex-1`}>{form.id ? "Salvar alterações" : "Adicionar"}</button>
            {form.id && <button type="button" className={btnOutline} onClick={() => setForm(empty)}>Cancelar</button>}
          </div>
        </form>
      </Panel>
      <Panel title="Shows cadastrados">
        {!data.length && <p className="text-sm text-muted-foreground">Nenhum show cadastrado.</p>}
        <ul className="divide-y divide-border">
          {data.map((s) => {
            const { day, month } = formatShowDate(s.event_date);
            const past = s.event_date < today();
            return (
              <li key={s.id} className={`flex items-center gap-4 py-3 ${past ? "opacity-50" : ""}`}>
                <div className="w-14 text-center"><div className="font-display text-xl font-bold text-primary">{day}</div><div className="text-xs text-muted-foreground">{month}</div></div>
                <div className="min-w-0 flex-1"><div className="font-medium">{s.name}</div><div className="text-xs text-muted-foreground">{s.city} · {s.event_time}{past ? " · já passou" : ""}</div></div>
                <button onClick={() => setForm({ id: s.id, name: s.name, city: s.city, event_date: s.event_date, event_time: s.event_time })} className="text-sm text-primary hover:underline">Editar</button>
                <button onClick={() => remove(s.id)} aria-label="Remover" className="text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
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

  async function onFiles(files: FileList | null) {
    if (!files?.length) return; setBusy(true); setMsg(null);
    try {
      for (const f of Array.from(files)) {
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
        <input type="file" accept="image/*" multiple className="hidden" disabled={busy} onChange={(e) => { onFiles(e.target.files); e.target.value = ""; }} />
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
