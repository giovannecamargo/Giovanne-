import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Music2, CalendarDays, Users, PlayCircle, Menu, X, MessageCircle, Instagram, MapPin, Clock, ArrowRight, Plus, Quote,
} from "lucide-react";
import { events, gallery, nav, partners, photos, videos, whatsappLink, INSTAGRAM_URL } from "@/data/site";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Giovanne Camargo — Cantor Sertanejo | Shows e Eventos" },
      { name: "description", content: "Site oficial de Giovanne Camargo. Agenda de shows, fotos, vídeos e contratação para eventos." },
      { property: "og:title", content: "Giovanne Camargo — Cantor Sertanejo" },
      { property: "og:description", content: "Música que conecta pessoas e transforma momentos em boas memórias." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Logo() {
  return (
    <a href="#inicio" className="flex flex-col leading-none" aria-label="Giovanne Camargo — início">
      <span className="font-display text-[10px] tracking-[0.45em] text-muted-foreground">GIOVANNE</span>
      <span className="font-display text-xl font-extrabold tracking-wide text-foreground">
        CAMARGO<span className="text-primary">★</span>
      </span>
    </a>
  );
}

const btnGold = "inline-flex items-center justify-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:brightness-110";
const btnOutline = "inline-flex items-center justify-center gap-2 rounded-md border border-primary/70 px-6 py-3 text-sm font-medium text-foreground transition hover:bg-primary/10";

function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const f = () => setScrolled(window.scrollY > 20);
    f(); window.addEventListener("scroll", f);
    return () => window.removeEventListener("scroll", f);
  }, []);
  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition ${scrolled ? "border-b border-border bg-background/90 backdrop-blur" : ""}`}>
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
        <Logo />
        <nav className="hidden items-center gap-8 lg:flex">
          {nav.map((n) => (
            <a key={n.href} href={n.href} className="text-sm text-foreground/85 transition hover:text-primary">{n.label}</a>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <a href={whatsappLink()} target="_blank" rel="noreferrer" className={`${btnOutline} hidden px-5 py-2 sm:inline-flex`}>
            <MessageCircle className="h-4 w-4" /> Contratar
          </a>
          <button className="lg:hidden" onClick={() => setOpen(!open)} aria-label="Abrir menu">
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>
      {open && (
        <nav className="border-t border-border bg-background px-5 pb-6 lg:hidden">
          {nav.map((n) => (
            <a key={n.href} href={n.href} onClick={() => setOpen(false)} className="block border-b border-border py-4 text-foreground/90">{n.label}</a>
          ))}
          <a href={whatsappLink()} target="_blank" rel="noreferrer" className={`${btnGold} mt-5 w-full`}>
            <MessageCircle className="h-4 w-4" /> Contratar
          </a>
        </nav>
      )}
    </header>
  );
}

function Hero() {
  return (
    <section id="inicio" className="relative min-h-[100svh] overflow-hidden">
      <div className="absolute inset-0 bg-glow-warm" />
      <img
        src={photos.palco}
        alt="Giovanne Camargo cantando ao vivo com violão"
        className="absolute inset-y-0 right-0 h-full w-full object-cover object-top opacity-70 md:w-[65%] md:opacity-100"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-transparent md:via-background/40" />
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-background to-transparent" />
      <div className="relative mx-auto flex min-h-[100svh] max-w-7xl items-end px-5 pb-20 pt-32 md:items-center md:pb-24">
        <div className="max-w-xl fade-up">
          <p className="eyebrow">Cantor • Shows • Eventos</p>
          <h1 className="mt-5 text-5xl font-extrabold leading-[0.95] sm:text-7xl">
            GIOVANNE<br /><span className="text-gold-gradient">CAMARGO</span>
          </h1>
          <p className="mt-6 max-w-sm text-lg text-foreground/85">
            Música que conecta pessoas e transforma momentos em boas memórias.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href={whatsappLink()} target="_blank" rel="noreferrer" className={btnGold}>
              <MessageCircle className="h-4 w-4" /> Contratar Show
            </a>
            <a href="#agenda" className={btnOutline}>Ver Agenda</a>
          </div>
        </div>
      </div>
    </section>
  );
}

function Highlights() {
  const items = [
    { icon: Music2, t: "Shows e Eventos", d: "Eventos particulares, corporativos e festivais." },
    { icon: CalendarDays, t: "Agenda Atualizada", d: "Acompanhe os próximos shows." },
    { icon: Users, t: "Contratação", d: "Fale diretamente pelo WhatsApp." },
    { icon: PlayCircle, t: "Vídeos e Fotos", d: "Veja registros das apresentações." },
  ];
  return (
    <section className="border-y border-border bg-card/60">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-y-10 px-5 py-12 lg:grid-cols-4">
        {items.map(({ icon: I, t, d }) => (
          <div key={t} className="px-3 text-center">
            <I className="mx-auto h-8 w-8 text-primary" strokeWidth={1.4} />
            <h3 className="mt-4 text-sm font-semibold sm:text-base">{t}</h3>
            <p className="mt-1 text-xs text-muted-foreground sm:text-sm">{d}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function SectionTitle({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="mb-12">
      <p className="eyebrow text-primary">{eyebrow}</p>
      <h2 className="mt-3 text-3xl font-bold sm:text-4xl">{title}</h2>
      <div className="mt-5 h-px w-16 bg-primary" />
    </div>
  );
}

function Placeholder({ children }: { children: React.ReactNode }) {
  return <span className="inline-block rounded-sm border border-dashed border-primary/50 px-2 py-0.5 text-[10px] uppercase tracking-widest text-primary">{children}</span>;
}

function About() {
  return (
    <section id="sobre" className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-24 md:grid-cols-2">
      <img src={photos.pb} alt="Giovanne Camargo em apresentação" loading="lazy" className="aspect-[4/5] w-full rounded-sm object-cover object-top" />
      <div>
        <SectionTitle eyebrow="Biografia" title="Sobre o Artista" />
        <Placeholder>Aguardando texto oficial</Placeholder>
        <p className="mt-5 leading-relaxed text-muted-foreground">
          Espaço reservado para a biografia e trajetória musical de Giovanne Camargo. O texto oficial será inserido aqui assim que for enviado pelo artista.
        </p>
        <a href="#contato" className={`${btnOutline} mt-8`}>Conheça Minha Trajetória <ArrowRight className="h-4 w-4" /></a>
      </div>
    </section>
  );
}

function Agenda() {
  return (
    <section id="agenda" className="bg-card/40 py-24">
      <div className="mx-auto max-w-5xl px-5">
        <SectionTitle eyebrow="Próximos shows" title="Agenda" />
        <Placeholder>Conteúdo demonstrativo</Placeholder>
        <div className="mt-6 space-y-4">
          {events.map((e, i) => (
            <article key={i} className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-5 rounded-sm border border-border bg-background p-4 transition hover:border-primary/50 sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:p-5">
              <div className="w-16 border-r border-primary/40 pr-5 text-center">
                <div className="font-display text-3xl font-bold text-primary">{e.day}</div>
                <div className="text-xs tracking-widest text-muted-foreground">{e.month}</div>
              </div>
              <div className="min-w-0">
                <h3 className="truncate font-semibold">{e.name}</h3>
                <div className="mt-1 flex flex-wrap gap-x-5 gap-y-1 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{e.city}</span>
                  <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{e.time}</span>
                </div>
              </div>
              <a href={whatsappLink()} target="_blank" rel="noreferrer" className="col-span-2 text-sm text-primary hover:underline sm:col-span-1">Informações</a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Shows({ onOpen }: { onOpen: (src: string) => void }) {
  const spans = ["md:col-span-2 md:row-span-2", "md:row-span-2"];
  return (
    <section id="shows" className="mx-auto max-w-7xl px-5 py-24">
      <SectionTitle eyebrow="Ao vivo" title="Shows e Apresentações" />
      <div className="grid auto-rows-[220px] grid-cols-2 gap-3 md:grid-cols-3">
        {gallery.map((g, i) => (
          <button key={i} onClick={() => onOpen(g.src)} className={`group relative overflow-hidden rounded-sm ${spans[i % spans.length]} col-span-1 row-span-2`}>
            <img src={g.src} alt={g.alt} loading="lazy" className="h-full w-full object-cover object-top transition duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-background/0 transition group-hover:bg-background/20" />
          </button>
        ))}
      </div>
      <p className="mt-6 text-sm text-muted-foreground">Mais fotos de palco serão adicionadas em breve.</p>
    </section>
  );
}

function Partners() {
  return (
    <section className="border-y border-border bg-card/40 py-24">
      <div className="mx-auto max-w-7xl px-5">
        <SectionTitle eyebrow="Quem caminha junto" title="Parceiros e Patrocinadores" />
        <div className="grid grid-cols-2 gap-px bg-border sm:grid-cols-4">
          {(partners.length ? partners : Array.from({ length: 4 })).map((p: any, i) => (
            <div key={i} className="flex h-28 items-center justify-center bg-background p-6">
              {p ? <img src={p.logo} alt={p.name} className="max-h-12 opacity-80" /> : <span className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground"><Plus className="h-4 w-4" />Seu logo aqui</span>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  const kinds = ["Organizador de eventos", "Estabelecimento", "Empresa"];
  return (
    <section className="mx-auto max-w-7xl px-5 py-24">
      <SectionTitle eyebrow="Avaliações" title="Quem já contratou" />
      <div className="grid gap-5 md:grid-cols-3">
        {kinds.map((k) => (
          <figure key={k} className="rounded-sm border border-border bg-card/50 p-7">
            <Quote className="h-6 w-6 text-primary" />
            <blockquote className="mt-4 text-muted-foreground">Espaço reservado para depoimento real.</blockquote>
            <figcaption className="mt-6 text-sm"><div className="font-semibold">Nome do contratante</div><div className="text-muted-foreground">{k}</div></figcaption>
            <div className="mt-4"><Placeholder>Provisório</Placeholder></div>
          </figure>
        ))}
      </div>
    </section>
  );
}

function Gallery({ onOpen }: { onOpen: (src: string) => void }) {
  return (
    <section id="galeria" className="bg-card/40 py-24">
      <div className="mx-auto max-w-7xl px-5">
        <SectionTitle eyebrow="Multimídia" title="Galeria" />
        <div className="grid gap-4 md:grid-cols-2">
          {videos.length ? videos.map((id) => (
            <iframe key={id} className="aspect-video w-full" src={`https://www.youtube.com/embed/${id}`} title="Vídeo" allowFullScreen />
          )) : [0, 1].map((i) => (
            <div key={i} className="flex aspect-video flex-col items-center justify-center gap-3 border border-dashed border-border bg-background">
              <PlayCircle className="h-12 w-12 text-primary" strokeWidth={1.2} />
              <span className="text-xs uppercase tracking-widest text-muted-foreground">Vídeo em breve</span>
            </div>
          ))}
        </div>
        <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-6">
          {gallery.map((g, i) => (
            <button key={i} onClick={() => onOpen(g.src)} className="aspect-square overflow-hidden rounded-sm">
              <img src={g.src} alt={g.alt} loading="lazy" className="h-full w-full object-cover object-top transition hover:scale-105" />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

function Contact() {
  return (
    <footer id="contato" className="relative overflow-hidden">
      <div className="absolute inset-0 bg-glow-warm opacity-60" />
      <div className="relative mx-auto max-w-4xl px-5 py-28 text-center">
        <p className="eyebrow text-primary">Contratação</p>
        <h2 className="mt-4 text-4xl font-extrabold sm:text-6xl">VAMOS FAZER<br /><span className="text-gold-gradient">UM EVENTO?</span></h2>
        <p className="mx-auto mt-6 max-w-md text-muted-foreground">Entre em contato e conheça as possibilidades de contratação de Giovanne Camargo.</p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <a href={whatsappLink()} target="_blank" rel="noreferrer" className={btnGold}><MessageCircle className="h-4 w-4" /> Chamar no WhatsApp</a>
          <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer" className={btnOutline}><Instagram className="h-4 w-4" /> Instagram</a>
        </div>
      </div>
      <div className="relative border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-5 py-10 md:flex-row md:justify-between">
          <Logo />
          <nav className="flex flex-wrap justify-center gap-6">
            {nav.map((n) => <a key={n.href} href={n.href} className="text-sm text-muted-foreground hover:text-primary">{n.label}</a>)}
          </nav>
          <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} Giovanne Camargo</p>
        </div>
      </div>
    </footer>
  );
}

function Index() {
  const [img, setImg] = useState<string | null>(null);
  return (
    <main>
      <Header />
      <Hero />
      <Highlights />
      <About />
      <Agenda />
      <Shows onOpen={setImg} />
      <Partners />
      <Testimonials />
      <Gallery onOpen={setImg} />
      <Contact />
      {img && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-background/95 p-4" onClick={() => setImg(null)} role="dialog" aria-label="Foto ampliada">
          <button className="absolute right-5 top-5" aria-label="Fechar"><X /></button>
          <img src={img} alt="" className="max-h-[90vh] max-w-full object-contain" />
        </div>
      )}
    </main>
  );
}
