import { useRef, useState } from "react";
import { Film, Play } from "lucide-react";
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

      {!!videos.length && <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
        {videos.map((video) => <VideoCard key={video.id} src={video.src} poster={video.poster || undefined} caption={video.caption} />)}
      </div>}
      {!isLoading && !videos.length && <p className="py-12 text-muted-foreground">Nenhum vídeo cadastrado.</p>}
    </section>
  );
}

function VideoCard({ src, poster, caption }: { src: string; poster?: string; caption: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const start = () => { setPlaying(true); void ref.current?.play(); };
  return (
    <figure className="group min-w-0">
      <div className="relative aspect-video overflow-hidden rounded-xl bg-card ring-1 ring-border transition duration-500 group-hover:-translate-y-1 group-hover:ring-primary/50 motion-reduce:transform-none">
        {poster && !playing && <img src={poster} alt="" aria-hidden loading="lazy" className="absolute inset-0 size-full scale-110 object-cover opacity-40 blur-2xl" />}
        <video ref={ref} className="relative block size-full object-contain" src={src} poster={poster} controls={playing} playsInline preload="none" aria-label={caption} onPlay={() => setPlaying(true)} />
        {!playing && (
          <button type="button" onClick={start} aria-label={`Reproduzir ${caption}`} className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-background/70 via-transparent to-transparent">
            <span className="flex size-16 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition duration-300 group-hover:scale-110 motion-reduce:transform-none sm:size-[4.5rem]">
              <Play className="ml-1 size-7 fill-current" />
            </span>
          </button>
        )}
      </div>
      <figcaption className="mt-4 flex items-start gap-3">
        <span className="mt-2 h-px w-6 shrink-0 bg-primary" />
        <span className="text-base font-semibold leading-snug text-foreground break-words">{caption}</span>
      </figcaption>
    </figure>
  );
}
