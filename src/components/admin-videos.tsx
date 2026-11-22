import { useRef, useState, type FormEvent } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Film, Pencil, Save, Trash2, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { isStoredVideoMedia, useGalleryVideos } from "@/lib/gallery-videos";
import { validateGalleryFile, videoCaptionSchema } from "@/lib/gallery-video-validation";

const inputClass = "mt-2 block w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none";
type EditVideo = { id: string; video_path: string; cover_path: string; source_kind: string; caption: string };

export function AdminVideos() {
  const { data = [], isLoading, isError, refetch } = useGalleryVideos();
  const qc = useQueryClient();
  const [editing, setEditing] = useState<EditVideo | null>(null);
  const [caption, setCaption] = useState("");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [formKey, setFormKey] = useState(0);
  const formSectionRef = useRef<HTMLElement>(null);
  const captionRef = useRef<HTMLTextAreaElement>(null);
  const refresh = () => qc.invalidateQueries({ queryKey: ["gallery-videos"] });
  const reset = () => { setEditing(null); setCaption(""); setVideoFile(null); setCoverFile(null); setFormKey(k => k + 1); };

  function startEdit(video: EditVideo) {
    setEditing(video);
    setCaption(video.caption);
    setVideoFile(null);
    setCoverFile(null);
    setFormKey(k => k + 1);
    setMessage("");
    requestAnimationFrame(() => {
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      formSectionRef.current?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
      captionRef.current?.focus({ preventScroll: true });
    });
  }

  async function upload(file: File, folder: string) {
    const ext: Record<string, string> = { "video/mp4": "mp4", "video/webm": "webm", "image/jpeg": "jpg", "image/png": "png" };
    const path = `${folder}/${crypto.randomUUID()}.${ext[file.type]}`;
    const { error } = await supabase.storage.from("media").upload(path, file, { contentType: file.type });
    if (error) throw error;
    return path;
  }

  async function save(event: FormEvent) {
    event.preventDefault();
    if (busy) return;
    setMessage("");
    const result = videoCaptionSchema.safeParse(caption);
    if (!result.success) { setMessage(result.error.issues[0]?.message ?? "Legenda inválida."); return; }
    if (!editing && (!videoFile || !coverFile)) { setMessage("Selecione o vídeo e a capa."); return; }
    setBusy(true);
    const uploaded: string[] = [];
    let saved = false;
    try {
      if (videoFile) validateGalleryFile(videoFile, "video");
      if (coverFile) validateGalleryFile(coverFile, "cover");
      let videoPath = editing?.video_path ?? "";
      let coverPath = editing?.cover_path ?? "";
      if (videoFile) { videoPath = await upload(videoFile, "videos"); uploaded.push(videoPath); }
      if (coverFile) { coverPath = await upload(coverFile, "video-covers"); uploaded.push(coverPath); }
      const row = { caption: result.data, video_path: videoPath, cover_path: coverPath, source_kind: isStoredVideoMedia(videoPath) ? "storage" : "asset" };
      const query = editing ? supabase.from("gallery_videos").update(row).eq("id", editing.id).select("id") : supabase.from("gallery_videos").insert(row).select("id");
      const { data: written, error } = await query;
      if (error) throw error;
      if (!written?.length) throw new Error("Não foi possível salvar. Verifique seu acesso.");
      saved = true;
      const old = editing ? [editing.video_path !== videoPath ? editing.video_path : "", editing.cover_path !== coverPath ? editing.cover_path : ""].filter(isStoredVideoMedia) : [];
      const cleanup = old.length ? await supabase.storage.from("media").remove(old) : null;
      reset(); await refresh();
      setMessage(cleanup?.error ? "Vídeo salvo; não foi possível apagar o arquivo substituído." : editing ? "Vídeo atualizado." : "Vídeo adicionado à Galeria.");
    } catch (error) {
      if (!saved && uploaded.length) await supabase.storage.from("media").remove(uploaded);
      setMessage(error instanceof Error ? error.message : "Não foi possível enviar. Confira o formato e o tamanho dos arquivos.");
    } finally { setBusy(false); }
  }

  async function remove(video: EditVideo) {
    if (busy || !window.confirm("Remover este vídeo da Galeria?")) return;
    setBusy(true); setMessage("");
    try {
      const { data: deleted, error } = await supabase.from("gallery_videos").delete().eq("id", video.id).select("id");
      if (error) throw error;
      if (!deleted?.length) throw new Error("Não foi possível remover. Verifique seu acesso.");
      const paths = [video.video_path, video.cover_path].filter(isStoredVideoMedia);
      const cleanup = paths.length ? await supabase.storage.from("media").remove(paths) : null;
      if (editing?.id === video.id) reset();
      await refresh();
      setMessage(cleanup?.error ? "Vídeo removido da Galeria; os arquivos não puderam ser apagados." : "Vídeo removido da Galeria.");
    } catch (error) { setMessage(error instanceof Error ? error.message : "Não foi possível remover o vídeo."); }
    finally { setBusy(false); }
  }

  return <div>
    <section ref={formSectionRef} className="scroll-mt-28 border-b border-border pb-8">
      <h2 className="mb-5 text-xl font-semibold">{editing ? "Editar vídeo" : "Adicionar vídeo"}</h2>
      <form key={formKey} onSubmit={save} className="grid gap-5 sm:grid-cols-2">
        <label className="text-sm">{editing ? "Substituir vídeo (opcional)" : "Arquivo do vídeo"}<input className={inputClass} type="file" accept="video/mp4,video/webm" disabled={busy} required={!editing} onChange={e => setVideoFile(e.target.files?.[0] ?? null)} /></label>
        <label className="text-sm">{editing ? "Substituir capa (opcional)" : "Capa"}<input className={inputClass} type="file" accept="image/jpeg,image/png" disabled={busy} required={!editing} onChange={e => setCoverFile(e.target.files?.[0] ?? null)} /></label>
        <label className="text-sm sm:col-span-2">Legenda<textarea ref={captionRef} aria-label="Título do vídeo" className={`${inputClass} min-h-24`} required maxLength={500} disabled={busy} value={caption} onChange={e => setCaption(e.target.value)} /></label>
        <div className="flex flex-wrap gap-3 sm:col-span-2"><Button type="submit" disabled={busy}><Upload />{busy ? "Salvando…" : editing ? "Salvar alterações" : "Adicionar vídeo"}</Button>{editing && <Button variant="outline" type="button" disabled={busy} onClick={reset}><X />Cancelar</Button>}</div>
      </form>
    </section>
    {message && <p role="status" className="mt-5 text-sm text-primary">{message}</p>}
    <section className="pt-8">
      <h2 className="mb-5 text-xl font-semibold">Vídeos cadastrados</h2>
      {isLoading && <p role="status" className="text-muted-foreground">Carregando vídeos…</p>}
      {isError && <div role="alert">Não foi possível carregar os vídeos.<Button variant="outline" onClick={() => refetch()}>Tentar novamente</Button></div>}
      {!isLoading && !isError && !data.length && <p className="text-muted-foreground">Nenhum vídeo cadastrado.</p>}
      <ul className="divide-y divide-border">{data.map(v => <li key={v.id} className="flex flex-wrap items-center gap-4 py-5">
        <div className="flex h-24 w-20 shrink-0 items-center justify-center overflow-hidden rounded-sm bg-card">{v.poster ? <img src={v.poster} alt={`Capa: ${v.caption}`} className="h-full w-full object-cover" /> : <Film className="text-primary" />}</div>
        <p className="min-w-0 flex-1 break-words text-sm">{v.caption}</p>
        <div className="flex gap-2"><Button variant="outline" size="icon" title="Editar vídeo" aria-label={`Editar vídeo: ${v.caption}`} disabled={busy} onClick={() => startEdit(v)}><Pencil /></Button><Button variant="ghost" size="icon" title="Remover vídeo" aria-label={`Remover vídeo: ${v.caption}`} disabled={busy} onClick={() => remove(v)} className="hover:text-destructive"><Trash2 /></Button></div>
      </li>)}</ul>
    </section>
  </div>;
}