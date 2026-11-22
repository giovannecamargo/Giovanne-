import { useEffect, useState, type FormEvent } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { emailLink, instagramLink, phoneLink, whatsappLink } from "@/lib/contact-info";
import { btnGold } from "@/components/site-ui";

const input = "w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none";
const emptyForm = { email: "", phone: "", whatsapp: "", instagram_url: "" };

export function AdminContact() {
  const queryClient = useQueryClient();
  const [form, setForm] = useState(emptyForm);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const { data, isLoading } = useQuery({
    queryKey: ["admin-contact-info"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("contact_settings")
        .select("email, phone, whatsapp, instagram_url")
        .eq("id", true)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    if (data) setForm({ email: data.email, phone: data.phone, whatsapp: data.whatsapp, instagram_url: data.instagram_url });
  }, [data]);

  async function save(event: FormEvent) {
    event.preventDefault();
    setMessage(null);
    const row = {
      email: form.email.trim(),
      phone: form.phone.trim(),
      whatsapp: form.whatsapp.trim(),
      instagram_url: instagramLink(form.instagram_url) ?? "",
    };
    if (row.email && !emailLink(row.email)) return setMessage("Digite um e-mail válido.");
    if (row.phone && !phoneLink(row.phone)) return setMessage("Digite um telefone válido, com DDD.");
    if (row.whatsapp && !whatsappLink(row.whatsapp)) return setMessage("Digite o WhatsApp com código do país e DDD.");
    if (form.instagram_url.trim() && !row.instagram_url) return setMessage("Digite um @usuário ou link de perfil do Instagram válido.");

    setBusy(true);
    const { error } = await supabase.from("contact_settings").upsert({ id: true, ...row, updated_at: new Date().toISOString() });
    setBusy(false);
    if (error) return setMessage("Não foi possível salvar os contatos. Tente novamente.");
    setForm(row);
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ["admin-contact-info"] }),
      queryClient.invalidateQueries({ queryKey: ["contact-info"] }),
    ]);
    setMessage("Contatos atualizados no site.");
  }

  return (
    <section className="rounded-sm border border-border bg-card/40 p-6" aria-labelledby="contact-admin-title">
      <h2 id="contact-admin-title" className="text-xl font-semibold">Informações de contato</h2>
      <p className="mt-2 max-w-2xl text-sm text-muted-foreground">Esses dados aparecem na página Contato. O WhatsApp também é usado nos botões de contratação e patrocínio do site.</p>
      {isLoading ? <p className="mt-6 text-sm text-muted-foreground">Carregando contatos…</p> : (
        <form onSubmit={save} className="mt-6 grid gap-4 sm:grid-cols-2">
          <label className="text-sm">E-mail (opcional)
            <input className={`${input} mt-1`} type="email" autoComplete="email" placeholder="contato@exemplo.com.br" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
          </label>
          <label className="text-sm">Telefone (opcional)
            <input className={`${input} mt-1`} type="tel" autoComplete="tel" placeholder="(16) 3333-0000" value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} />
          </label>
          <label className="text-sm">WhatsApp (opcional)
            <input className={`${input} mt-1`} type="tel" inputMode="tel" placeholder="55 16 99999-9999" value={form.whatsapp} onChange={(event) => setForm({ ...form, whatsapp: event.target.value })} />
            <span className="mt-1 block text-xs text-muted-foreground">Inclua o código do país (55) e o DDD.</span>
          </label>
          <label className="text-sm">Instagram (opcional)
            <input className={`${input} mt-1`} type="text" inputMode="url" placeholder="@giovannecamargo ou link do perfil" value={form.instagram_url} onChange={(event) => setForm({ ...form, instagram_url: event.target.value })} />
          </label>
          {message && <p role="status" className="text-sm text-primary sm:col-span-2">{message}</p>}
          <button className={`${btnGold} sm:col-span-2`} disabled={busy}>{busy ? "Salvando…" : "Salvar contatos"}</button>
        </form>
      )}
    </section>
  );
}
