import { Film } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGalleryVideos } from "@/lib/gallery-videos";

export function ShowsVideos() {
  const { data = [], isLoading, isError, refetch } = useGalleryVideos();
  const videos = data.filter((video) => video.src);

  return (
    <section className="mx-auto max-w-7xl px-5 pb-16 pt-28 sm:pb-24 sm:pt-32">
      <header className="mb-8 flex flex-wrap items-end justify-between gap-6 border-b border-border pb-7 sm:mb-10">
        <div>
          <p className="reveal text-xs font-medium uppercase text-primary">Giovanne Camargo / Ao vivo</p>
          <h1 className="reveal mt-3 text-4xl font-bold sm:text-6xl">Shows e Apresentações</h1>
        </div>
        {!!videos.length && <span className="flex items-center gap-2 text-xs text-muted-foreground"><Film className="size-4 text-primary" />{videos.length} {videos.length === 1 ? "vídeo" : "vídeos"}</span>}
      </header>

      {isError && <div role="alert" className="mb-6 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">Não foi possível carregar os vídeos.<Button variant="outline" onClick={() => refetch()}>Tentar novamente</Button></div>}
      {isLoading && <p role="status" className="mb-4 text-sm text-muted-foreground">Carregando vídeos…</p>}

      {!!videos.length && <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {videos.map((video) => (
          <figure key={video.id} className="overflow-hidden rounded-sm border border-border bg-card">
            <video className="block aspect-[9/16] w-full bg-background object-contain" src={video.src} poster={video.poster || undefined} controls playsInline preload="none" aria-label={video.caption} />
            <figcaption className="p-4 text-sm">{video.caption}</figcaption>
          </figure>
        ))}
      </div>}
      {!isLoading && !videos.length && <p className="py-12 text-muted-foreground">Nenhum vídeo cadastrado.</p>}
    </section>
  );
}
