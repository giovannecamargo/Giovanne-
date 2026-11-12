import { Link, useLocation } from "@tanstack/react-router";
import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import {
  Music2, CalendarDays, Users, PlayCircle, Menu, X, MessageCircle, Instagram, MapPin, Clock, ArrowRight, Plus, Quote, ExternalLink, Lock,
} from "lucide-react";
import { gallery, nav, photos, videos, whatsappLink, INSTAGRAM_URL } from "@/data/site";
import type { GalleryVideo } from "@/data/site";
import { useShows, usePhotos, useActiveSponsors, formatShowDate } from "@/lib/content";
import { normalizeShowAccess, showAccessLabel } from "@/lib/show-access";
import { normalizeSponsorLink } from "@/lib/sponsor-link";
import { useLogoBg } from "@/lib/logo-bg";
import { bio } from "@/data/bio";
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
        <nav className="hidden items-center gap-6 lg:flex xl:gap-8">
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
        loading="eager"
        fetchPriority="high"
        decoding="async"
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
    <>
      <section className="mx-auto grid max-w-7xl items-center gap-12 px-5 pb-14 pt-32 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <img src={photos.pb} alt="Giovanne Camargo em apresentação" loading="lazy" decoding="async" className="reveal-img aspect-[4/5] w-full rounded-sm object-cover object-top" />
        <div>
          <SectionTitle eyebrow="Biografia" title="Sobre o Artista" />
          <p className="reveal mt-2 text-lg leading-relaxed text-foreground/90 sm:text-xl" style={d(3)}>{bio.lead}</p>
          <dl className="reveal mt-8 grid grid-cols-2 gap-x-6 gap-y-5 border-t border-border pt-6" style={d(4)}>
            {bio.facts.map((f) => (
              <div key={f.label}>
                <dt className="eyebrow text-primary">{f.label}</dt>
                <dd className="mt-1 text-sm font-medium sm:text-base">{f.value}</dd>
              </div>
            ))}
          </dl>
          <Link to="/contato" className={`${btnOutline} reveal mt-8`} style={d(5)}>Fale com o artista <ArrowRight className="h-4 w-4" /></Link>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-5 pb-16">
        {bio.sections.map((s, i) => (
          <article key={s.title} className="reveal border-t border-border py-9 first:border-t-0 first:pt-0" style={d(3 + i)}>
            <h2 className="flex items-baseline gap-4 text-xl font-bold sm:text-2xl">
              <span className="font-display text-xs font-bold tabular-nums tracking-widest text-primary/70">{String(i + 1).padStart(2, "0")}</span>
              {s.title}
            </h2>
            <div className="mt-4 space-y-4 sm:pl-9">
              {s.paragraphs.map((p, j) => <p key={j} className="leading-relaxed text-muted-foreground">{p}</p>)}
            </div>
          </article>
        ))}
      </section>

      <section className="mx-auto max-w-4xl px-5 pb-24">
        <blockquote className="reveal border-l-2 border-primary pl-6" style={d(4)}>
          <p className="font-display text-lg font-semibold leading-relaxed sm:text-2xl">{bio.tagline}</p>
        </blockquote>
      </section>
    </>
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
  const { data: shows, isLoading } = useShows();
  const [open, setOpen] = useState<number | null>(null);
  const events = (shows ?? []).map((e) => ({ ...formatShowDate(e.event_date), name: e.name, city: e.city, time: e.event_time, access: normalizeShowAccess(e.visibility), details: (e.details ?? "").trim(), ticket: normalizeSponsorLink(e.ticket_url) }));
  return (
    <section className="mx-auto max-w-5xl px-5 pb-24 pt-32">
      <SectionTitle eyebrow="Próximos shows" title="Agenda" />
      {!isLoading && !events.length && <p className="text-muted-foreground">Nenhum show agendado no momento. Fale com a gente para contratar!</p>}
      <div className="mt-6 space-y-4">
        {events.map((e, i) => (
          <article key={i} style={d(4 + i)} className="reveal grid grid-cols-[auto_minmax(0,1fr)] items-center gap-5 rounded-sm border border-border bg-card/40 p-4 transition-colors duration-300 hover:border-primary/50 sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:p-5">
            <div className="w-16 border-r border-primary/40 pr-5 text-center">
              <div className="font-display text-3xl font-bold text-primary">{e.day}</div>
              <div className="text-xs tracking-widest text-muted-foreground">{e.month}</div>
            </div>
            <div className="min-w-0">
              <h3 className="truncate font-semibold">{e.name}</h3>
              <div className="mt-1 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
                <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{e.city}</span>
                <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{e.time}</span>
                <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium tracking-wide ${e.access === "private" ? "border-border text-muted-foreground" : "border-primary/40 text-primary"}`}>
                  {e.access === "private" ? <Lock className="h-3 w-3" /> : <Users className="h-3 w-3" />}
                  {showAccessLabel(e.access)}
                </span>
              </div>
            </div>
            <div className="col-span-2 flex flex-wrap items-center gap-4 sm:col-span-1 sm:justify-end">
              {e.ticket && <a href={e.ticket} target="_blank" rel="noopener noreferrer" className={`${btnGold} px-4 py-2 text-xs`}>Comprar ingresso</a>}
              <button type="button" aria-expanded={open === i} onClick={() => setOpen(open === i ? null : i)} className="text-sm text-primary hover:underline">
                {open === i ? "Fechar" : "Informações"}
              </button>
            </div>
            {open === i && (
              <div className="col-span-full border-t border-border pt-4 text-sm leading-relaxed text-muted-foreground whitespace-pre-line">
                {e.details || "Mais informações sobre este show em breve."}
              </div>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}

export function Partners() {
  const { data: partners = [] } = useActiveSponsors();
  return (
    <section className="border-t border-border bg-card/40 py-24">
      <div className="mx-auto max-w-7xl px-5">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <h2 className="text-3xl font-bold">Parceiros e Patrocinadores</h2>
          <Link to="/patrocinadores" className="inline-flex items-center gap-1.5 text-sm text-primary transition-colors hover:text-foreground">
            Ver todos os patrocinadores <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-px bg-border sm:grid-cols-4">
          {(partners.length ? partners : Array.from({ length: 4 })).map((p: any, i) => {
            const inner = p ? (
              <div className="text-center">
                <img src={p.logo} alt={p.name} loading="lazy" decoding="async" className="mx-auto max-h-16 w-auto max-w-full object-contain opacity-85 transition duration-500 group-hover:scale-105 group-hover:opacity-100" />
                <p className="mt-2 text-xs text-muted-foreground transition duration-300 group-hover:text-primary">{p.name}</p>
              </div>
            ) : (
              <span className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground"><Plus className="h-4 w-4" />Seu logo aqui</span>
            );
            const shell = `reveal group relative flex h-32 items-center justify-center overflow-hidden bg-background p-5 transition duration-500 ${p?.link ? "hover:bg-card/60" : ""}`;

            if (p?.link) {
              return (
                <a key={i} href={p.link} target="_blank" rel="noopener noreferrer sponsored" title={`Visitar o site de ${p.name}`} style={d(3 + Math.min(i, 6))} className={shell}>
                  {inner}
                  <ExternalLink className="absolute right-3 top-3 h-3.5 w-3.5 text-primary opacity-0 transition duration-300 group-hover:opacity-100" />
                  <span className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-primary transition-transform duration-500 group-hover:scale-x-100" />
                </a>
              );
            }
            return <div key={i} style={d(3 + Math.min(i, 6))} className={shell}>{inner}</div>;
          })}
        </div>
      </div>
    </section>
  );
}

function SponsorCard({ p, i }: { p: any; i: number }) {
  const bg = useLogoBg(p.logo);
  const panel = (
    <div
      className="relative flex h-48 items-center justify-center overflow-hidden bg-panel p-5 ring-1 ring-border"
      style={bg ? { backgroundColor: bg } : undefined}
    >
      <img
        src={p.logo}
        alt={`Logo de ${p.name}`}
        loading="lazy"
        decoding="async"
        className="h-full w-full object-contain transition duration-500 group-hover:scale-105"
      />

      <span className="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-primary transition-transform duration-500 group-hover:scale-x-100" />
    </div>
  );
  const inner = (
    <>
      {panel}
      <p className="mt-4 min-h-10 text-center text-sm font-semibold leading-snug transition duration-300 group-hover:text-primary">
        {p.name}
      </p>
      <span
        aria-hidden={p.link ? undefined : "true"}
        className={`mt-1.5 flex h-4 items-center justify-center gap-1.5 text-[10px] uppercase tracking-widest ${p.link ? "text-muted-foreground transition duration-300 group-hover:text-primary" : ""}`}
      >
        {p.link ? <>Visitar site <ExternalLink className="h-3 w-3" /></> : null}
      </span>
    </>
  );

  const shell = "reveal group block w-full text-center";
  const style = d(4 + Math.min(i, 6));
  if (p.link) {
    return (
      <a href={p.link} target="_blank" rel="noopener noreferrer sponsored" title={`Visitar o site de ${p.name}`} style={style} className={shell}>
        {inner}
      </a>
    );
  }
  return <div style={style} className={shell}>{inner}</div>;
}


export function SponsorsPage() {
  const { data: partners = [], isLoading } = useActiveSponsors();
  return (
    <section className="mx-auto max-w-7xl px-5 pb-24 pt-32">
      <SectionTitle eyebrow="Parcerias" title="Patrocinadores e Parceiros" />
      <p className="reveal max-w-2xl leading-relaxed text-muted-foreground" style={d(3)}>
        As empresas e marcas que caminham ao lado de Giovanne Camargo. Clique no logo de um parceiro para conhecer o site ou a plataforma dele.
      </p>
      {isLoading ? (
        <p className="reveal mt-14 text-muted-foreground" style={d(4)}>Carregando parceiros…</p>
      ) : !partners.length ? (
        <p className="reveal mt-14 text-muted-foreground" style={d(4)}>
          Nenhum patrocinador ativo no momento. Que tal ser o primeiro? Fale com a gente pelo botão abaixo.
        </p>
      ) : (
        <div className="mt-14 grid grid-cols-2 items-start gap-x-8 gap-y-12 md:grid-cols-3 lg:grid-cols-4">
          {partners.map((p: any, i) => <SponsorCard key={p.id ?? i} p={p} i={i} />)}
        </div>
      )}
      <div className="reveal mt-16 flex flex-col items-start gap-6 rounded-sm border border-dashed border-primary/40 bg-card/40 p-8 sm:flex-row sm:items-center sm:justify-between" style={d(5)}>
        <div>
          <h3 className="text-lg font-semibold">Sua marca ao lado de Giovanne Camargo</h3>
          <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
            Patrocínios e parcerias garantem espaço de mídia em shows, redes sociais e no site oficial. Peça uma proposta sem compromisso.
          </p>
        </div>
        <a
          href={whatsappLink("Olá! Gostaria de saber sobre patrocínio e parcerias com Giovanne Camargo.")}
          target="_blank"
          rel="noreferrer"
          className={`${btnGold} shrink-0`}
        >
          <MessageCircle className="h-4 w-4" /> Quero patrocinar
        </a>
      </div>
    </section>
  );
}

export function Gallery({ onOpen }: { onOpen: (src: string) => void }) {
  const { data } = usePhotos("galeria");
  const items = [...(data ?? []).map((p) => ({ src: p.src!, alt: p.alt || "Foto de Giovanne Camargo" })), ...gallery];
  return (
    <section className="mx-auto max-w-7xl px-5 pb-24 pt-32">
      <SectionTitle eyebrow="Multimídia" title="Galeria" />
      {videos.length ? (
        <div className="flex flex-wrap justify-center gap-4">
          {videos.map((v, i) => <VideoItem key={v.kind === "youtube" ? v.id : v.src} v={v} i={i} />)}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {[0, 1].map((i) => (
            <div key={i} style={d(3 + i)} className="reveal flex aspect-video flex-col items-center justify-center gap-3 border border-dashed border-border bg-card/40">
              <PlayCircle className="h-12 w-12 text-primary" strokeWidth={1.2} />
              <span className="text-xs uppercase tracking-widest text-muted-foreground">Vídeo em breve</span>
            </div>
          ))}
        </div>
      )}
      <div className="mt-4 flex flex-wrap justify-center gap-3">
        {items.map((g, i) => (
          <button key={i} onClick={() => onOpen(g.src)} style={d(5 + Math.min(i, 6))} className="reveal-img h-24 w-24 overflow-hidden rounded-sm sm:h-28 sm:w-28">
            <img src={g.src} alt={g.alt} loading="lazy" decoding="async" className="h-full w-full object-cover object-top transition duration-500 hover:scale-105" />
          </button>
        ))}
      </div>
    </section>
  );
}

function VideoItem({ v, i }: { v: GalleryVideo; i: number }) {
  if (v.kind === "youtube") {
    return (
      <div style={d(3 + i)} className="reveal aspect-video w-full max-w-[760px] flex-1 basis-[420px] overflow-hidden rounded-sm border border-border bg-card">
        <iframe className="h-full w-full" src={`https://www.youtube.com/embed/${v.id}`} title={v.alt} allowFullScreen loading="lazy" />
      </div>
    );
  }
  // O player toma o formato do arquivo: sem faixas vazias ao redor.
  return (
    <video
      style={d(3 + i)}
      className="reveal h-auto w-auto max-h-[420px] max-w-full rounded-sm border border-border bg-card sm:max-h-[520px] lg:max-h-[560px]"
      src={v.src}
      poster={v.poster}
      controls
      playsInline
      preload="none"
      aria-label={v.alt}
    />
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
