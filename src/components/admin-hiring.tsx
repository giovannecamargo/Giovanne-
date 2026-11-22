import { useEffect, useState, type FormEvent } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowDown, ArrowUp, Pencil, Star, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { clampDeposit, emptyHiringSettings, formatBRL, type HiringSettings, type ShowPackage } from "@/lib/hiring";

const input = "w-full rounded-md border border-border bg-background px-3 py-2 text-sm";
type Draft = Omit<ShowPackage, "id">;
const blank: Draft = { order_index: 0, code: "", title: "", duration: "", formation: "", price: 0, sound_included: false, description: "", is_highlighted: false, is_active: true, whatsapp_message: "" };

export function AdminHiring() {
  return <div className="space-y-12"><Packages /><Settings /></div>;
}

function Packages() {
  const qc = useQueryClient();
  const { data = [] } = useQuery({
    queryKey: ["admin-show-packages"],
    queryFn: async () => {
      const { data, error } = await supabase.from("show_packages").select("*").order("order_index");
      if (error) throw error;
      return (data ?? []).map((p) => ({ ...p, price: Number(p.price) })) as ShowPackage[];
    },
  });
  const [editing, setEditing] = useState<string | null>(null);
  const [draft, setDraft] = useState<Draft>(blank);
  const [msg, setMsg] = useState<string | null>(null);
  const refresh = () => { qc.invalidateQueries({ queryKey: ["admin-show-packages"] }); qc.invalidateQueries({ queryKey: ["show-packages"] }); };
  const set = <K extends keyof Draft>(k: K, v: Draft[K]) => setDraft((d) => ({ ...d, [k]: v }));

  async function save(e: FormEvent) {
    e.preventDefault();
    const row = { ...draft, price: Math.max(0, Number(draft.price) || 0) };
    const res = editing ? await supabase.from("show_packages").update(row).eq("id", editing)
      : await supabase.from("show_packages").insert({ ...row, order_index: (data.at(-1)?.order_index ?? 0) + 1 });
    if (res.error) return setMsg(res.error.message);
    setMsg(editing ? "Pacote atualizado." : "Pacote criado."); setEditing(null); setDraft(blank); refresh();
  }
  async function patch(id: string, values: Partial<Draft>) {
    const { error } = await supabase.from("show_packages").update(values).eq("id", id);
    if (error) setMsg(error.message); else refresh();
  }
  async function remove(p: ShowPackage) {
    if (!window.confirm(`Excluir o pacote ${p.code || p.title}?`)) return;
    const { error } = await supabase.from("show_packages").delete().eq("id", p.id);
    if (error) setMsg(error.message); else refresh();
  }
  async function move(i: number, dir: -1 | 1) {
    const a = data[i], b = data[i + dir]; if (!a || !b) return;
    await patch(a.id, { order_index: b.order_index }); await patch(b.id, { order_index: a.order_index });
  }

  return (
    <section>
      <h2 className="mb-4 text-xl font-semibold">Pacotes de show</h2>
      <form id="package-form" onSubmit={save} className="grid gap-3 rounded-sm border border-border bg-card/40 p-5 sm:grid-cols-2">
        <p className="sm:col-span-2 text-sm font-semibold">{editing ? "Editar pacote" : "Novo pacote"}</p>
        <input className={input} placeholder="Código (ex.: P01)" value={draft.code} onChange={(e) => set("code", e.target.value)} />
        <input className={input} placeholder="Título" value={draft.title} onChange={(e) => set("title", e.target.value)} required />
        <input className={input} type="number" min={0} step="0.01" placeholder="Preço (R$)" value={draft.price} onChange={(e) => set("price", Number(e.target.value))} required aria-label="Preço" />
        <input className={input} placeholder="Duração (ex.: 2 horas)" value={draft.duration} onChange={(e) => set("duration", e.target.value)} />
        <input className={`${input} sm:col-span-2`} placeholder="Formação musical" value={draft.formation} onChange={(e) => set("formation", e.target.value)} />
        <textarea className={`${input} sm:col-span-2`} rows={3} placeholder="Descrição" value={draft.description} onChange={(e) => set("description", e.target.value)} />
        <textarea className={`${input} sm:col-span-2`} rows={2} placeholder="Mensagem de WhatsApp deste pacote" value={draft.whatsapp_message} onChange={(e) => set("whatsapp_message", e.target.value)} />
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={draft.sound_included} onChange={(e) => set("sound_included", e.target.checked)} />Sonorização inclusa</label>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={draft.is_highlighted} onChange={(e) => set("is_highlighted", e.target.checked)} />Destacar</label>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={draft.is_active} onChange={(e) => set("is_active", e.target.checked)} />Ativo no site</label>
        <div className="flex gap-2 sm:col-span-2">
          <Button type="submit">{editing ? "Salvar alterações" : "Adicionar pacote"}</Button>
          {editing && <Button type="button" variant="outline" onClick={() => { setEditing(null); setDraft(blank); }}>Cancelar</Button>}
        </div>
        {msg && <p className="sm:col-span-2 text-sm text-primary" role="status">{msg}</p>}
      </form>
      <ul className="mt-6 space-y-3">
        {data.map((p, i) => (
          <li key={p.id} className={`flex flex-wrap items-center gap-3 rounded-sm border border-border p-4 ${p.is_active ? "" : "opacity-60"}`}>
            <div className="min-w-0 flex-1">
              <p className="font-semibold">{p.code} {p.title} {p.is_highlighted && <Star className="inline h-4 w-4 text-primary" />}</p>
              <p className="text-sm text-muted-foreground">{formatBRL(p.price)}{p.duration && ` • ${p.duration}`} • {p.is_active ? "Ativo" : "Desativado"}</p>
            </div>
            <div className="flex flex-wrap gap-1">
              <Button size="icon" variant="outline" aria-label="Subir" disabled={i === 0} onClick={() => move(i, -1)}><ArrowUp className="h-4 w-4" /></Button>
              <Button size="icon" variant="outline" aria-label="Descer" disabled={i === data.length - 1} onClick={() => move(i, 1)}><ArrowDown className="h-4 w-4" /></Button>
              <Button size="sm" variant="outline" onClick={() => patch(p.id, { is_active: !p.is_active })}>{p.is_active ? "Desativar" : "Ativar"}</Button>
              <Button size="sm" variant="outline" onClick={() => patch(p.id, { is_highlighted: !p.is_highlighted })}>{p.is_highlighted ? "Tirar destaque" : "Destacar"}</Button>
              <Button size="icon" variant="outline" aria-label="Editar pacote" onClick={() => { const { id: _id, ...rest } = p; setEditing(p.id); setDraft(rest); document.getElementById("package-form")?.scrollIntoView({ behavior: "smooth" }); }}><Pencil className="h-4 w-4" /></Button>
              <Button size="icon" variant="outline" aria-label="Excluir pacote" onClick={() => remove(p)}><Trash2 className="h-4 w-4" /></Button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

function Settings() {
  const qc = useQueryClient();
  const { data } = useQuery({
    queryKey: ["hiring-settings"],
    queryFn: async (): Promise<HiringSettings> => {
      const { data, error } = await supabase.from("hiring_settings").select("whatsapp_number, deposit_percentage, valid_cities, contract_terms_text, general_whatsapp_message").eq("id", true).maybeSingle();
      if (error) throw error;
      return data ?? emptyHiringSettings;
    },
  });
  const [form, setForm] = useState<HiringSettings>(emptyHiringSettings);
  const [msg, setMsg] = useState<string | null>(null);
  useEffect(() => { if (data) setForm(data); }, [data]);

  async function save(e: FormEvent) {
    e.preventDefault();
    const { error } = await supabase.from("hiring_settings").upsert({ id: true, ...form, deposit_percentage: clampDeposit(form.deposit_percentage), updated_at: new Date().toISOString() });
    if (error) return setMsg(error.message);
    setMsg("Configurações salvas."); qc.invalidateQueries({ queryKey: ["hiring-settings"] });
  }
  return (
    <section>
      <h2 className="mb-4 text-xl font-semibold">Configurações de contratação</h2>
      <form onSubmit={save} className="grid gap-3 rounded-sm border border-border bg-card/40 p-5">
        <label className="text-sm">WhatsApp de atendimento (com DDD)<input className={`${input} mt-1`} inputMode="tel" value={form.whatsapp_number} onChange={(e) => setForm({ ...form, whatsapp_number: e.target.value })} placeholder="5511999999999" /></label>
        <label className="text-sm">Mensagem geral de WhatsApp<textarea className={`${input} mt-1`} rows={2} value={form.general_whatsapp_message} onChange={(e) => setForm({ ...form, general_whatsapp_message: e.target.value })} /></label>
        <label className="text-sm">Sinal para reserva (%)<input className={`${input} mt-1`} type="number" min={0} max={100} value={form.deposit_percentage} onChange={(e) => setForm({ ...form, deposit_percentage: Number(e.target.value) })} /></label>
        <label className="text-sm">Cidades atendidas (separe por vírgula)<input className={`${input} mt-1`} value={form.valid_cities} onChange={(e) => setForm({ ...form, valid_cities: e.target.value })} /></label>
        <label className="text-sm">Condições de contratação<textarea className={`${input} mt-1`} rows={5} value={form.contract_terms_text} onChange={(e) => setForm({ ...form, contract_terms_text: e.target.value })} /></label>
        <div><Button type="submit">Salvar configurações</Button></div>
        {msg && <p className="text-sm text-primary" role="status">{msg}</p>}
      </form>
    </section>
  );
}
