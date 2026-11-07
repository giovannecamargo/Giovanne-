import { useEffect, useRef, useState } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { ArrowLeft, ArrowRight, ArrowUpRight, Film, Grid2X2, ImageIcon, Play, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePhotos } from "@/lib/content";
import { gallery, type GalleryVideo } from "@/data/site";
import { useGalleryVideos } from "@/lib/gallery-videos";
import { availableGalleryFilters, filterGalleryPhotos, nextGalleryIndex, uniqueGalleryPhotos, type GalleryFilter, type GalleryPhoto } from "@/lib/gallery-media";

const labels: Record<GalleryFilter, string> = { all: "Todas", shows: "Shows", bastidores: "Bastidores", videos: "Vídeos" };

export function EditorialGallery() {
  const { data, isLoading, isError, refetch } = usePhotos("galeria");
  const { data: registeredVideos = [], isLoading: videosLoading, isError: videosError } = useGalleryVideos();
  const videos: GalleryVideo[] = registeredVideos.flatMap(v => v.src ? [{ kind: "file" as const, src: v.src, ...(v.poster ? { poster: v.poster } : {}), alt: v.caption }] : []);
  const [filter, setFilter] = useState<GalleryFilter>("all");
  const [activeVideo, setActiveVideo] = useState(0);
  const [photoId, setPhotoId] = useState<string | null>(null);
  const featureRef = useRef<HTMLDivElement>(null);
  const items = uniqueGalleryPhotos([
    ...(data ?? []).flatMap((p): GalleryPhoto[] => p.src ? [{ id: p.id, src: p.src, alt: p.alt || "Giovanne Camargo em apresentação", category: "shows" }] : []),
    ...gallery.map((p, i): GalleryPhoto => ({ ...p, id: `original-${i}`, category: "shows" })),
  ]);
  const filters = availableGalleryFilters(items, videos.length);
  const photos = filterGalleryPhotos(items, filter);
  const showVideo = (filter === "all" || filter === "videos") && videos.length > 0;
  const selectedVideo = Math.min(activeVideo, Math.max(0, videos.length - 1));
  const video = videos[selectedVideo];
  const featuredPhotos = showVideo ? photos.slice(0, 2) : [];
  const gridPhotos = showVideo ? photos.slice(2) : photos;
  const photoIndex = photos.findIndex((p) => p.id === photoId);
  const currentPhoto = photos[photoIndex];
  const navigate = (direction: number) => setPhotoId(photos[nextGalleryIndex(photoIndex, direction, photos.length)]?.id ?? null);

  useEffect(() => {
    if (!photoId) return;
    const handleKey = (event: KeyboardEvent) => {
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
      event.preventDefault();
      setPhotoId((id) => {
        const index = photos.findIndex((p) => p.id === id);
        return photos[nextGalleryIndex(index, event.key === "ArrowRight" ? 1 : -1, photos.length)]?.id ?? null;
      });
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [photoId, photos]);

  return (
    <section className="mx-auto max-w-7xl px-5 pb-16 pt-28 sm:pb-24 sm:pt-32">
      <header className="mb-8 flex flex-wrap items-end justify-between gap-6 border-b border-border pb-7 sm:mb-10">
        <div>
          <p className="reveal text-xs font-medium uppercase text-primary">Giovanne Camargo / Registros</p>
          <h1 className="reveal mt-3 text-4xl font-bold sm:text-6xl">Galeria</h1>
        </div>
        <div className="flex items-center gap-5 text-xs text-muted-foreground">
          <span className="flex items-center gap-2"><ImageIcon className="size-4 text-primary" />{items.length} fotos</span>
          {!!videos.length && <span className="flex items-center gap-2"><Film className="size-4 text-primary" />{videos.length} {videos.length === 1 ? "vídeo" : "vídeos"}</span>}
        </div>
      </header>
      <nav aria-label="Categorias da galeria" className="mb-7 flex flex-wrap gap-2">
        {filters.map((value) => <Button key={value} variant="ghost" onClick={() => { setFilter(value); setPhotoId(null); }} aria-pressed={filter === value} className={`h-10 rounded-none border-b-2 px-4 ${filter === value ? "border-primary text-primary" : "border-transparent text-muted-foreground"}`}>
          {value === "all" && <Grid2X2 />}{value === "videos" && <Film />}{labels[value]}
        </Button>)}
      </nav>

      {isError && <div role="alert" className="mb-6 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">Não foi possível carregar todas as fotos.<Button variant="outline" onClick={() => refetch()}>Tentar novamente</Button></div>}
      {isLoading && <p role="status" className="mb-4 text-sm text-muted-foreground">Carregando fotos…</p>}
      {videosLoading && <p role="status" className="mb-4 text-sm text-muted-foreground">Carregando vídeos…</p>}
      {videosError && <p role="alert" className="mb-4 text-sm text-muted-foreground">Não foi possível carregar os vídeos.</p>}

      {showVideo && video && <div ref={featureRef} className={`grid items-stretch gap-4 ${featuredPhotos.length ? "lg:grid-cols-[3fr_2fr]" : "mx-auto max-w-3xl"}`}>
        <div className="min-w-0">
          <div className="relative overflow-hidden rounded-sm border border-border bg-card">
            <GalleryPlayer key={video.kind === "file" ? video.src : video.id} video={video} />
          </div>
          <div className="flex items-center justify-between gap-4 border-b border-border py-4">
            <div className="flex min-w-0 items-center gap-3"><Play className="size-4 shrink-0 text-primary" /><span className="text-sm font-medium break-words">{video.alt}</span></div>
            <span className="shrink-0 text-xs text-muted-foreground">{String(selectedVideo + 1).padStart(2, "0")} / {String(videos.length).padStart(2, "0")}</span>
          </div>
        </div>
        {!!featuredPhotos.length && <div className={`grid gap-4 ${featuredPhotos.length === 1 ? "grid-rows-1" : "lg:grid-rows-2"}`}>
          {featuredPhotos.map((photo) => <PhotoTile key={photo.id} photo={photo} onOpen={() => setPhotoId(photo.id)} featured />)}
        </div>}
      </div>}

      {!!gridPhotos.length && <div className={showVideo ? "mt-10" : ""}>
        {showVideo && <div className="mb-5 flex items-center justify-between border-b border-border pb-4"><h2 className="text-lg font-semibold">Em cena</h2><ImageIcon className="size-4 text-primary" /></div>}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-12">
          {gridPhotos.map((photo, i) => <PhotoTile key={photo.id} photo={photo} onOpen={() => setPhotoId(photo.id)} className={i === gridPhotos.length - 1 && gridPhotos.length % 2 === 1 ? "sm:col-span-2 lg:col-span-12" : i % 4 === 0 || i % 4 === 3 ? "lg:col-span-7" : "lg:col-span-5"} />)}
        </div>
      </div>}

      {showVideo && videos.length > 1 && <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {videos.map((v, i) => <Button key={v.kind === "file" ? v.src : v.id} variant="outline" aria-pressed={activeVideo === i} className="h-auto justify-start whitespace-normal p-4 text-left" onClick={() => { setActiveVideo(i); featureRef.current?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth", block: "start" }); }}><Play className="shrink-0 text-primary" />{v.alt}</Button>)}
      </div>}
      {!isLoading && !photos.length && !showVideo && <p className="py-12 text-muted-foreground">Nenhuma mídia nesta categoria.</p>}

      <DialogPrimitive.Root open={!!currentPhoto} onOpenChange={(open) => { if (!open) setPhotoId(null); }}>
        <DialogPrimitive.Portal>
          <DialogPrimitive.Overlay className="fixed inset-0 z-[70] bg-background/95 backdrop-blur-sm" />
          <DialogPrimitive.Content aria-describedby={undefined} className="fixed inset-0 z-[71] flex flex-col items-center justify-center gap-4 p-4 outline-none sm:p-8">
            <DialogPrimitive.Title className="sr-only">Foto ampliada</DialogPrimitive.Title>
            <DialogPrimitive.Close asChild><Button variant="ghost" size="icon" title="Fechar foto" aria-label="Fechar foto" className="absolute right-4 top-4 z-10 bg-background/80"><X /></Button></DialogPrimitive.Close>
            {currentPhoto && <img src={currentPhoto.src} alt={currentPhoto.alt} className="max-h-[76svh] max-w-full object-contain" />}
            <div className="flex w-full max-w-3xl items-center gap-4">
              <Button variant="outline" size="icon" title="Foto anterior" aria-label="Foto anterior" disabled={photos.length < 2} onClick={() => navigate(-1)}><ArrowLeft /></Button>
              <div className="min-w-0 flex-1 text-center"><p className="text-xs text-primary">{photoIndex + 1} / {photos.length}</p><p className="mt-1 text-sm text-muted-foreground">{currentPhoto?.alt}</p></div>
              <Button variant="outline" size="icon" title="Próxima foto" aria-label="Próxima foto" disabled={photos.length < 2} onClick={() => navigate(1)}><ArrowRight /></Button>
            </div>
          </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>
    </section>
  );
}

function PhotoTile({ photo, onOpen, featured, className = "" }: { photo: GalleryPhoto; onOpen: () => void; featured?: boolean; className?: string }) {
  return <Button variant="ghost" onClick={onOpen} aria-label={`Ampliar: ${photo.alt}`} className={`group relative block h-auto w-full overflow-hidden rounded-sm bg-card p-0 hover:bg-card ${featured ? "aspect-[4/5] lg:aspect-auto lg:min-h-0" : "aspect-[4/5] sm:aspect-[5/6]"} ${className}`}>
    <img src={photo.src} alt={photo.alt} loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover object-top transition duration-700 group-hover:scale-[1.03] group-hover:opacity-90 motion-reduce:transform-none" />
    <span className="absolute bottom-4 right-4 flex size-9 items-center justify-center rounded-full border border-foreground/30 bg-background/65 text-foreground transition-colors group-hover:border-primary group-hover:text-primary"><ArrowUpRight /></span>
  </Button>;
}

function GalleryPlayer({ video }: { video: GalleryVideo }) {
  const [error, setError] = useState(false);
  if (video.kind === "youtube") return <iframe className="aspect-video w-full" src={`https://www.youtube.com/embed/${video.id}`} title={video.alt} allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen loading="lazy" />;
  return <>
    <video className="block aspect-[9/16] w-full object-contain" src={video.src} poster={video.poster} controls playsInline preload="none" aria-label={video.alt} onError={() => setError(true)} />
    {error && <p role="alert" className="p-4 text-sm text-muted-foreground">Não foi possível reproduzir o vídeo. Tente recarregar a página.</p>}
  </>;
}