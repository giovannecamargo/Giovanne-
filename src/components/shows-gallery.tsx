import { useEffect, useState } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { ArrowLeft, ArrowRight, ArrowUpRight, Film, ImageIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePhotos } from "@/lib/content";
import { gallery } from "@/data/site";
import { useGalleryVideos } from "@/lib/gallery-videos";
import { nextGalleryIndex, uniqueGalleryPhotos, type GalleryPhoto } from "@/lib/gallery-media";

export function ShowsGallery() {
  const { data, isLoading, isError, refetch } = usePhotos("shows");
  const { data: videoData = [] } = useGalleryVideos();
  const videos = videoData.filter((video) => video.src);
  const [photoId, setPhotoId] = useState<string | null>(null);
  const photos = uniqueGalleryPhotos([
    ...(data ?? []).flatMap((photo): GalleryPhoto[] => photo.src ? [{ id: photo.id, src: photo.src, alt: photo.alt || "Giovanne Camargo no palco", category: "shows" }] : []),
    ...gallery.map((photo, index): GalleryPhoto => ({ ...photo, id: `show-original-${index}`, category: "shows" })),
  ]);
  const photoIndex = photos.findIndex((photo) => photo.id === photoId);
  const currentPhoto = photos[photoIndex];
  const navigate = (direction: number) => setPhotoId(photos[nextGalleryIndex(photoIndex, direction, photos.length)]?.id ?? null);

  useEffect(() => {
    if (!photoId) return;
    const handleKey = (event: KeyboardEvent) => {
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
      event.preventDefault();
      setPhotoId((id) => {
        const index = photos.findIndex((photo) => photo.id === id);
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
          <p className="reveal text-xs font-medium uppercase text-primary">Giovanne Camargo / Ao vivo</p>
          <h1 className="reveal mt-3 text-4xl font-bold sm:text-6xl">Shows e Apresentações</h1>
        </div>
        <div className="flex items-center gap-5 text-xs text-muted-foreground">
          <span className="flex items-center gap-2"><ImageIcon className="size-4 text-primary" />{photos.length} fotos</span>
          {!!videos.length && <span className="flex items-center gap-2"><Film className="size-4 text-primary" />{videos.length} {videos.length === 1 ? "vídeo" : "vídeos"}</span>}
        </div>
      </header>

      {isError && <div role="alert" className="mb-6 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">Não foi possível carregar todas as fotos.<Button variant="outline" onClick={() => refetch()}>Tentar novamente</Button></div>}
      {isLoading && <p role="status" className="mb-4 text-sm text-muted-foreground">Carregando fotos…</p>}

      {!!photos.length && <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-12">
        {photos.map((photo, index) => <ShowPhotoTile key={photo.id} photo={photo} onOpen={() => setPhotoId(photo.id)} className={index === photos.length - 1 && photos.length % 2 === 1 ? "sm:col-span-2 lg:col-span-12" : index % 4 === 0 || index % 4 === 3 ? "lg:col-span-7" : "lg:col-span-5"} />)}
      </div>}
      {!isLoading && !photos.length && <p className="py-12 text-muted-foreground">Nenhuma foto cadastrada.</p>}

      {!!videos.length && <div className="mt-14">
        <div className="mb-5 flex items-center justify-between border-b border-border pb-4"><h2 className="text-lg font-semibold">Vídeos ao vivo</h2><Film className="size-4 text-primary" /></div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {videos.map((video) => (
            <figure key={video.id} className="overflow-hidden rounded-sm border border-border bg-card">
              <video className="block aspect-[9/16] w-full bg-background object-contain" src={video.src} poster={video.poster || undefined} controls playsInline preload="none" aria-label={video.caption} />
              <figcaption className="p-4 text-sm">{video.caption}</figcaption>
            </figure>
          ))}
        </div>
      </div>}

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

function ShowPhotoTile({ photo, onOpen, className = "" }: { photo: GalleryPhoto; onOpen: () => void; className?: string }) {
  return <Button variant="ghost" onClick={onOpen} aria-label={`Ampliar: ${photo.alt}`} className={`group relative block aspect-[4/5] h-auto w-full overflow-hidden rounded-sm bg-card p-0 hover:bg-card sm:aspect-[5/6] ${className}`}>
    <img src={photo.src} alt={photo.alt} loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover object-top transition duration-700 group-hover:scale-[1.03] group-hover:opacity-90 motion-reduce:transform-none" />
    <span className="absolute bottom-4 right-4 flex size-9 items-center justify-center rounded-full border border-foreground/30 bg-background/65 text-foreground transition-colors group-hover:border-primary group-hover:text-primary"><ArrowUpRight /></span>
  </Button>;
}
