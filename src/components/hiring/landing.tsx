import { Check, Clock, MessageCircle, Music, Speaker, Star } from "lucide-react";
import { brandLogo, photos } from "@/data/site";
import { btnGold, btnOutline } from "@/components/site-ui";
import { formatBRL, packageWhatsappLink, type ShowPackage } from "@/lib/hiring";
import { useHiringSettings, usePublicPackages } from "@/lib/use-hiring";

function WhatsButton({ href, label, gold = true }: { href: string | null; label: string; gold?: boolean }) {
  if (!href) return null;
  return <a href={href} target="_blank" rel="noreferrer" className={gold ? btnGold : btnOutline}><MessageCircle className="h-4 w-4" />{label}</a>;
}

function PackageCard({ pkg, whats }: { pkg: ShowPackage; whats: string }) {
  const hl = pkg.is_highlighted;
  return (
    <article className={`relative flex flex-col rounded-lg border p-7 ${hl ? "border-primary bg-primary/10 shadow-lg" : "border-border bg-card/60"}`}>
      {hl && <span className="absolute -top-3 left-7 inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground"><Star className="h-3 w-3" />Mais escolhido</span>}
      <p className="text-xs font-semibold tracking-[0.3em] text-primary">{pkg.code}</p>
      {pkg.title && <h3 className="mt-2 text-2xl font-bold">{pkg.title}</h3>}
      <p className="mt-4 text-4xl font-extrabold text-gold-gradient">{formatBRL(pkg.price)}</p>
      <ul className="mt-6 space-y-2 text-sm text-foreground/85">
        {pkg.duration && <li className="flex gap-2"><Clock className="h-4 w-4 shrink-0 text-primary" />{pkg.duration}</li>}
        {pkg.formation && <li className="flex gap-2"><Music className="h-4 w-4 shrink-0 text-primary" />{pkg.formation}</li>}
        <li className="flex gap-2"><Speaker className="h-4 w-4 shrink-0 text-primary" />{pkg.sound_included ? "Sonorização inclusa" : "Sonorização não inclusa"}</li>
      </ul>
      {pkg.description && <p className="mt-5 whitespace-pre-line text-sm text-muted-foreground">{pkg.description}</p>}
      <div className="mt-auto pt-7"><WhatsButton href={packageWhatsappLink(whats, pkg)} label="Quero este pacote" gold={hl} /></div>
    </article>
  );
}

export function HiringLanding() {
  const { data: packages = [] } = usePublicPackages();
  const { data: settings } = useHiringSettings();
  const whats = settings?.whatsapp_number ?? "";
  const general = packageWhatsappLink(whats, undefined, settings?.general_whatsapp_message);
  const cities = (settings?.valid_cities ?? "").split(/[\n,;]+/).map((c) => c.trim()).filter(Boolean);
  const deposit = settings?.deposit_percentage ?? 0;
  const terms = settings?.contract_terms_text?.trim() ?? "";

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3">
          <a href="#topo" className="w-[140px] shrink-0"><img src={brandLogo} alt="Giovanne Camargo" width={1110} height={380} className="h-auto w-full" /></a>
          <nav className="hidden gap-6 text-sm text-muted-foreground md:flex">
            <a href="#pacotes" className="hover:text-primary">Pacotes</a><a href="#condicoes" className="hover:text-primary">Condições</a><a href="#contato" className="hover:text-primary">Contato</a>
          </nav>
          {general && <a href={general} target="_blank" rel="noreferrer" className={`${btnGold} px-4 py-2`}><MessageCircle className="h-4 w-4" />WhatsApp</a>}
        </div>
      </header>

      <section id="topo" className="relative overflow-hidden border-b border-border">
        <img src={photos.palco} alt="Giovanne Camargo ao vivo" width={944} height={1666} className="absolute inset-0 h-full w-full object-cover object-top opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 to-background" />
        <div className="relative mx-auto max-w-6xl px-5 py-24 text-center md:py-32">
          <p className="eyebrow text-primary">Contratação de shows</p>
          <h1 className="mx-auto mt-4 max-w-3xl text-4xl font-extrabold leading-tight sm:text-6xl">Leve <span className="text-gold-gradient">Giovanne Camargo</span> para o seu evento</h1>
          <p className="mx-auto mt-5 max-w-xl text-lg text-foreground/80">Escolha o formato ideal e reserve sua data direto pelo WhatsApp.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3"><a href="#pacotes" className={btnGold}>Ver pacotes</a><WhatsButton href={general} label="Falar agora" gold={false} /></div>
        </div>
      </section>

      <section id="pacotes" className="mx-auto max-w-6xl scroll-mt-20 px-5 py-20">
        <h2 className="text-center text-3xl font-bold sm:text-4xl">Pacotes de show</h2>
        {packages.length === 0 ? <p className="mt-8 text-center text-muted-foreground">Fale conosco para conhecer os formatos disponíveis.</p> :
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">{packages.map((p) => <PackageCard key={p.id} pkg={p} whats={whats} />)}</div>}
      </section>

      {(deposit > 0 || terms || cities.length > 0) && (
        <section id="condicoes" className="scroll-mt-20 border-y border-border bg-card/40">
          <div className="mx-auto grid max-w-6xl gap-10 px-5 py-20 md:grid-cols-2">
            <div>
              <h2 className="text-3xl font-bold">Condições de contratação</h2>
              {deposit > 0 && <p className="mt-5 flex gap-2 text-foreground/85"><Check className="h-5 w-5 shrink-0 text-primary" />Reserva da data mediante sinal de {deposit}% do valor.</p>}
              {terms && <p className="mt-4 whitespace-pre-line text-muted-foreground">{terms}</p>}
            </div>
            {cities.length > 0 && <div><h3 className="text-xl font-semibold">Cidades atendidas</h3><ul className="mt-4 flex flex-wrap gap-2">{cities.map((c) => <li key={c} className="rounded-full border border-primary/50 px-3 py-1 text-sm">{c}</li>)}</ul></div>}
          </div>
        </section>
      )}

      <section id="contato" className="mx-auto max-w-3xl scroll-mt-20 px-5 py-20 text-center">
        <h2 className="text-3xl font-bold">Garanta sua data</h2>
        <p className="mt-4 text-muted-foreground">Envie a data, cidade e tipo de evento e receba o atendimento direto.</p>
        <div className="mt-8 flex justify-center"><WhatsButton href={general} label="Reservar pelo WhatsApp" /></div>
      </section>

      <footer className="border-t border-border py-8 text-center text-xs text-muted-foreground">© {new Date().getFullYear()} Giovanne Camargo — Contratação de shows</footer>
    </div>
  );
}
