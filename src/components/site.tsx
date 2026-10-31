import { Link, useLocation } from "@tanstack/react-router";
import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import {
  Music2, CalendarDays, Users, PlayCircle, Menu, X, MessageCircle, Instagram, MapPin, Clock, ArrowRight, Plus, Quote,
} from "lucide-react";
import { events, gallery, nav, partners, photos, videos, whatsappLink, INSTAGRAM_URL } from "@/data/site";
import logoAsset from "@/assets/giovanne-logo.png.asset.json";

export const btnGold = "inline-flex items-center justify-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition duration-300 hover:brightness-110";
export const btnOutline = "inline-flex items-center justify-center gap-2 rounded-md border border-primary/70 px-6 py-3 text-sm font-medium text-foreground transition duration-300 hover:bg-primary/10";

const d = (i: number) => ({ "--d": `${i * 90}ms` }) as CSSProperties;

export function Logo() {
  return (
    <Link to="/" className="block w-[170px] shrink-0 sm:w-[190px]" aria-label="Giovanne Camargo — início">
      <img src={logoAsset.url} alt="Giovanne Camargo" width={1110} height={380} className="block h-auto w-full object-contain" />
    </Link>
  );
}

function NavLink({ to, label, onClick, mobile }: { to: string; label: string; onClick?: () => void; mobile?: boolean }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      activeOptions={{ exact: true }}
      className={mobile ? "nav-link-mobile" : "nav-link"}
      activeProps={{ "data-active": "true" } as any}
    >
      {label}
    </Link>
  );
}

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    const f = () => setScrolled(window.scrollY > 20);
    f(); window.addEventListener("scroll", f, { passive: true });
    return () => window.removeEventListener("scroll", f);
  }, []);
  const solid = scrolled || open || pathname !== "/";
  return (
    <header className={`site-header fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${solid ? "border-b border-border bg-background/90 backdrop-blur" : "border-b border-transparent"}`}>
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
        <Logo />
        <nav className="hidden items-center gap-8 lg:flex">
          {nav.map((n) => <NavLink key={n.to} {...n} />)}
        </nav>
        <div className="flex items-center gap-3">
          <a href={whatsappLink()} target="_blank" rel="noreferrer" className={`${btnOutline} hidden px-5 py-2 sm:inline-flex`}>
            <MessageCircle className="h-4 w-4" /> Contratar
          </a>
          <button className="relative h-6 w-6 lg:hidden" onClick={() => setOpen(!open)} aria-label={open ? "Fechar menu" : "Abrir menu"} aria-expanded={open}>
            <Menu className={`absolute inset-0 transition duration-300 ${open ? "rotate-90 opacity-0" : "opacity-100"}`} />
            <X className={`absolute inset-0 transition duration-300 ${open ? "opacity-100" : "-rotate-90 opacity-0"}`} />
          </button>
        </div>
      </div>
      <div className={`mobile-menu grid lg:hidden ${open ? "grid-rows-[1fr] opacity-100" : "pointer-events-none grid-rows-[0fr] opacity-0"}`} aria-hidden={!open}>
        <nav className="overflow-hidden">
          <div className="border-t border-border bg-background px-5 pb-6">
            {nav.map((n, i) => (
              <div key={n.to} className={`menu-item ${open ? "is-open" : ""}`} style={d(i)}>
                <NavLink {...n} mobile onClick={() => setOpen(false)} />
              </div>
            ))}
            <a href={whatsappLink()} target="_blank" rel="noreferrer" className={`${btnGold} mt-5 w-full`}>
              <MessageCircle className="h-4 w-4" /> Contratar
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
}

export function RouteProgress() {
  const { pathname } = useLocation();
  return <div key={pathname} className="route-line" aria-hidden />;
}

function SectionTitle({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="mb-12">
      <p className="eyebrow reveal text-primary" style={d(0)}>{eyebrow}</p>
      <h1 className="reveal mt-3 text-3xl font-bold sm:text-5xl" style={d(1)}>{title}</h1>
      <div className="gold-rule mt-5 h-px w-16 bg-primary" style={d(2)} />
    </div>
  );
}

function Placeholder({ children }: { children: ReactNode }) {
  return <span className="inline-block rounded-sm border border-dashed border-primary/50 px-2 py-0.5 text-[10px] uppercase tracking-widest text-primary">{children}</span>;
}

export function Lightbox({ src, onClose }: { src: string | null; onClose: () => void }) {
  if (!src) return null;
  return (
    <div className="lightbox fixed inset-0 z-[60] flex items-center justify-center bg-background/95 p-4" onClick={onClose} role="dialog" aria-label="Foto ampliada">
      <button className="absolute right-5 top-5" aria-label="Fechar"><X /></button>
      <img src={src} alt="" className="max-h-[90vh] max-w-full object-contain" />
    </div>
  );
}

export function Hero() {
  return (
    <section className="relative min-h-[100svh] overflow-hidden">
      <div className="absolute inset-0 bg-glow-warm" />
      <img
        src={photos.palco}
        alt="Giovanne Camargo cantando ao vivo com violão"
        className="reveal-img absolute inset-y-0 right-0 h-full w-full object-cover object-top opacity-70 md:w-[65%] md:opacity-100 md:[mask-image:linear-gradient(to_right,transparent,black_35%)]"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-transparent md:via-background/40" />
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-background to-transparent" />
      <div className="relative mx-auto flex min-h-[100svh] max-w-7xl items-end px-5 pb-20 pt-32 md:items-center md:pb-24">
        <div className="max-w-xl">
          <p className="eyebrow reveal" style={d(1)}>Cantor • Shows • Eventos</p>
          <h1 className="reveal mt-5 text-5xl font-extrabold leading-[0.95] sm:text-7xl" style={d(2)}>
            GIOVANNE<br /><span className="text-gold-gradient">CAMARGO</span>
          </h1>
          <p className="reveal mt-6 max-w-sm text-lg text-foreground/85" style={d(3)}>
            Música que conecta pessoas e transforma momentos em boas memórias.
          </p>
          <div className="reveal mt-8 flex flex-wrap gap-3" style={d(4)}>
            <a href={whatsappLink()} target="_blank" rel="noreferrer" className={btnGold}>
              <MessageCircle className="h-4 w-4" /> Contratar Show
            </a>
            <Link to="/agenda" className={btnOutline}>Ver Agenda</Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Highlights() {
  const items = [
    { icon: Music2, t: "Shows e Eventos", d: "Eventos particulares, corporativos e festivais.", to: "/shows" },
    { icon: CalendarDays, t: "Agenda Atualizada", d: "Acompanhe os próximos shows.", to: "/agenda" },
    { icon: Users, t: "Contratação", d: "Fale diretamente pelo WhatsApp.", to: "/contato" },
    { icon: PlayCircle, t: "Vídeos e Fotos", d: "Veja registros das apresentações.", to: "/galeria" },
  ];
  return (
    <section className="border-y border-border bg-card/60">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-y-10 px-5 py-12 lg:grid-cols-4">
        {items.map(({ icon: I, t, d: desc, to }, i) => (
          <Link key={t} to={to} className="reveal group px-3 text-center" style={d(5 + i)}>
            <I className="mx-auto h-8 w-8 text-primary transition duration-300 group-hover:-translate-y-1" strokeWidth={1.4} />
            <h3 className="mt-4 text-sm font-semibold sm:text-base">{t}</h3>
            <p className="mt-1 text-xs text-muted-foreground sm:text-sm">{desc}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}

export function About() {
  return (
    <section className="mx-auto grid max-w-7xl items-center gap-12 px-5 pb-24 pt-32 md:grid-cols-2">
      <img src={photos.pb} alt="Giovanne Camargo em apresentação" className="reveal-img aspect-[4/5] w-full rounded-sm object-cover object-top" />
      <div>
        <SectionTitle eyebrow="Biografia" title="Sobre o Artista" />
        <div className="reveal" style={d(3)}><Placeholder>Aguardando texto oficial</Placeholder></div>
        <p className="reveal mt-5 leading-relaxed text-muted-foreground" style={d(4)}>
          Espaço reservado para a biografia e trajetória musical de Giovanne Camargo. O texto oficial será inserido aqui assim que for enviado pelo artista.
        </p>
        <Link to="/contato" className={`${btnOutline} reveal mt-8`} style={d(5)}>Fale com o artista <ArrowRight className="h-4 w-4" /></Link>
      </div>
    </section>
  );
}

export function Testimonials() {
  const kinds = ["Organizador de eventos", "Estabelecimento", "Empresa"];
  return (
    <section className="mx-auto max-w-7xl px-5 pb-24">
      <p className="eyebrow reveal text-primary" style={d(5)}>Avaliações</p>
      <h2 className="reveal mb-10 mt-3 text-3xl font-bold" style={d(6)}>Quem já contratou</h2>
      <div className="grid gap-5 md:grid-cols-3">
        {kinds.map((k, i) => (
          <figure key={k} className="reveal rounded-sm border border-border bg-card/50 p-7" style={d(7 + i)}>
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

export function Agenda() {
  return (
    <section className="mx-auto max-w-5xl px-5 pb-24 pt-32">
      <SectionTitle eyebrow="Próximos shows" title="Agenda" />
      <div className="reveal" style={d(3)}><Placeholder>Conteúdo demonstrativo</Placeholder></div>
      <div className="mt-6 space-y-4">
        {events.map((e, i) => (
          <article key={i} style={d(4 + i)} className="reveal grid grid-cols-[auto_minmax(0,1fr)] items-center gap-5 rounded-sm border border-border bg-card/40 p-4 transition-colors duration-300 hover:border-primary/50 sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:p-5">
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
    </section>
  );
}

export function Shows({ onOpen }: { onOpen: (src: string) => void }) {
  const spans = ["md:col-span-2 md:row-span-2", "md:row-span-2"];
  return (
    <section className="mx-auto max-w-7xl px-5 pb-24 pt-32">
      <SectionTitle eyebrow="Ao vivo" title="Shows e Apresentações" />
      <div className="grid auto-rows-[220px] grid-cols-2 gap-3 md:grid-cols-3">
        {gallery.map((g, i) => (
          <button key={i} onClick={() => onOpen(g.src)} style={d(3 + i)} className={`reveal-img group relative overflow-hidden rounded-sm ${spans[i % spans.length]} col-span-1 row-span-2`}>
            <img src={g.src} alt={g.alt} className="h-full w-full object-cover object-top transition duration-700 group-hover:scale-105" />
          </button>
        ))}
      </div>
      <p className="reveal mt-6 text-sm text-muted-foreground" style={d(5)}>Mais fotos de palco serão adicionadas em breve.</p>
    </section>
  );
}

export function Partners() {
  return (
    <section className="border-t border-border bg-card/40 py-24">
      <div className="mx-auto max-w-7xl px-5">
        <h2 className="mb-10 text-3xl font-bold">Parceiros e Patrocinadores</h2>
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

export function Gallery({ onOpen }: { onOpen: (src: string) => void }) {
  return (
    <section className="mx-auto max-w-7xl px-5 pb-24 pt-32">
      <SectionTitle eyebrow="Multimídia" title="Galeria" />
      <div className="grid gap-4 md:grid-cols-2">
        {videos.length ? videos.map((id) => (
          <iframe key={id} className="aspect-video w-full" src={`https://www.youtube.com/embed/${id}`} title="Vídeo" allowFullScreen loading="lazy" />
        )) : [0, 1].map((i) => (
          <div key={i} style={d(3 + i)} className="reveal flex aspect-video flex-col items-center justify-center gap-3 border border-dashed border-border bg-card/40">
            <PlayCircle className="h-12 w-12 text-primary" strokeWidth={1.2} />
            <span className="text-xs uppercase tracking-widest text-muted-foreground">Vídeo em breve</span>
          </div>
        ))}
      </div>
      <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-6">
        {gallery.map((g, i) => (
          <button key={i} onClick={() => onOpen(g.src)} style={d(5 + i)} className="reveal-img aspect-square overflow-hidden rounded-sm">
            <img src={g.src} alt={g.alt} className="h-full w-full object-cover object-top transition duration-500 hover:scale-105" />
          </button>
        ))}
      </div>
    </section>
  );
}

export function Contact() {
  return (
    <section className="relative flex min-h-[80svh] items-center overflow-hidden">
      <div className="absolute inset-0 bg-glow-warm opacity-60" />
      <div className="relative mx-auto max-w-4xl px-5 pb-20 pt-36 text-center">
        <p className="eyebrow reveal text-primary" style={d(0)}>Contratação</p>
        <h1 className="reveal mt-4 text-4xl font-extrabold sm:text-6xl" style={d(1)}>VAMOS FAZER<br /><span className="text-gold-gradient">UM EVENTO?</span></h1>
        <p className="reveal mx-auto mt-6 max-w-md text-muted-foreground" style={d(2)}>Entre em contato e conheça as possibilidades de contratação de Giovanne Camargo.</p>
        <div className="reveal mt-10 flex flex-wrap justify-center gap-3" style={d(3)}>
          <a href={whatsappLink()} target="_blank" rel="noreferrer" className={btnGold}><MessageCircle className="h-4 w-4" /> Chamar no WhatsApp</a>
          <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer" className={btnOutline}><Instagram className="h-4 w-4" /> Instagram</a>
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-5 py-10 md:flex-row md:justify-between">
        <Logo />
        <nav className="flex flex-wrap justify-center gap-6">
          {nav.map((n) => <Link key={n.to} to={n.to} className="text-sm text-muted-foreground transition-colors hover:text-primary">{n.label}</Link>)}
        </nav>
        <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} Giovanne Camargo</p>
      </div>
    </footer>
  );
}
