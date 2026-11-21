import { Link } from "@tanstack/react-router";
import { ArrowRight, ExternalLink, MessageCircle, Plus } from "lucide-react";
import { useActiveSponsors } from "@/lib/content";
import { useLogoBg } from "@/lib/logo-bg";
import { whatsappLink } from "@/lib/contact-info";
import { useContactInfo } from "@/lib/use-contact-info";
import { btnGold, d } from "@/components/site-ui";

export function Partners() {
  const { data: partners = [] } = useActiveSponsors();
  return (
    <section className="border-t border-border bg-card/40 py-24">
      <div className="mx-auto max-w-7xl px-5">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <h2 className="text-3xl font-bold">Parceiros e Patrocinadores</h2>
          <Link to="/patrocinadores" className="inline-flex items-center gap-1.5 text-sm text-primary transition-colors hover:text-foreground">Ver todos os patrocinadores <ArrowRight className="h-3.5 w-3.5" /></Link>
        </div>
        <div className="grid grid-cols-2 gap-px bg-border sm:grid-cols-4">
          {(partners.length ? partners : Array.from({ length: 4 })).map((partner: any, index) => {
            const inner = partner ? <div className="text-center"><img src={partner.logo} alt={partner.name} loading="lazy" decoding="async" className="mx-auto max-h-16 w-auto max-w-full object-contain opacity-85 transition duration-500 group-hover:scale-105 group-hover:opacity-100" /><p className="mt-2 text-xs text-muted-foreground transition duration-300 group-hover:text-primary">{partner.name}</p></div> : <span className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground"><Plus className="h-4 w-4" />Seu logo aqui</span>;
            const shell = `reveal group relative flex h-32 items-center justify-center overflow-hidden bg-background p-5 transition duration-500 ${partner?.link ? "hover:bg-card/60" : ""}`;
            if (partner?.link) return <a key={index} href={partner.link} target="_blank" rel="noopener noreferrer sponsored" title={`Visitar o site de ${partner.name}`} style={d(3 + Math.min(index, 6))} className={shell}>{inner}<ExternalLink className="absolute right-3 top-3 h-3.5 w-3.5 text-primary opacity-0 transition duration-300 group-hover:opacity-100" /><span className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-primary transition-transform duration-500 group-hover:scale-x-100" /></a>;
            return <div key={index} style={d(3 + Math.min(index, 6))} className={shell}>{inner}</div>;
          })}
        </div>
      </div>
    </section>
  );
}

function SponsorCard({ partner, index }: { partner: any; index: number }) {
  const bg = useLogoBg(partner.logo);
  const panel = <div className="relative flex h-48 items-center justify-center overflow-hidden bg-panel p-5 ring-1 ring-border" style={bg ? { backgroundColor: bg } : undefined}><img src={partner.logo} alt={`Logo de ${partner.name}`} loading="lazy" decoding="async" className="h-full w-full object-contain transition duration-500 group-hover:scale-105" /><span className="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-primary transition-transform duration-500 group-hover:scale-x-100" /></div>;
  const inner = <>{panel}<p className="mt-4 min-h-10 text-center text-sm font-semibold leading-snug transition duration-300 group-hover:text-primary">{partner.name}</p><span aria-hidden={partner.link ? undefined : "true"} className={`mt-1.5 flex h-4 items-center justify-center gap-1.5 text-[10px] uppercase tracking-widest ${partner.link ? "text-muted-foreground transition duration-300 group-hover:text-primary" : ""}`}>{partner.link ? <>Visitar site <ExternalLink className="h-3 w-3" /></> : null}</span></>;
  const shell = "reveal group block w-full text-center";
  const style = d(4 + Math.min(index, 6));
  if (partner.link) return <a href={partner.link} target="_blank" rel="noopener noreferrer sponsored" title={`Visitar o site de ${partner.name}`} style={style} className={shell}>{inner}</a>;
  return <div style={style} className={shell}>{inner}</div>;
}

export function SponsorsPage() {
  const { data: partners = [], isLoading } = useActiveSponsors();
  const { data: contact } = useContactInfo();
  const sponsorshipLink = whatsappLink(contact?.whatsapp, "Olá! Gostaria de saber sobre patrocínio e parcerias com Giovanne Camargo.");
  return (
    <section className="mx-auto max-w-7xl px-5 pb-24 pt-32">
      <div className="mb-12"><p className="eyebrow reveal text-primary" style={d(0)}>Parcerias</p><h1 className="reveal mt-3 text-3xl font-bold sm:text-5xl" style={d(1)}>Patrocinadores e Parceiros</h1><div className="gold-rule mt-5 h-px w-16 bg-primary" style={d(2)} /></div>
      <p className="reveal max-w-2xl leading-relaxed text-muted-foreground" style={d(3)}>As empresas e marcas que caminham ao lado de Giovanne Camargo. Clique no logo de um parceiro para conhecer o site ou a plataforma dele.</p>
      {isLoading ? <p className="reveal mt-14 text-muted-foreground" style={d(4)}>Carregando parceiros…</p> : !partners.length ? <p className="reveal mt-14 text-muted-foreground" style={d(4)}>Nenhum patrocinador ativo no momento. Que tal ser o primeiro? Fale com a gente pelo botão abaixo.</p> : <div className="mt-14 grid grid-cols-2 items-start gap-x-8 gap-y-12 md:grid-cols-3 lg:grid-cols-4">{partners.map((partner: any, index) => <SponsorCard key={partner.id ?? index} partner={partner} index={index} />)}</div>}
      <div className="reveal mt-16 flex flex-col items-start gap-6 rounded-sm border border-dashed border-primary/40 bg-card/40 p-8 sm:flex-row sm:items-center sm:justify-between" style={d(5)}>
        <div><h3 className="text-lg font-semibold">Sua marca ao lado de Giovanne Camargo</h3><p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">Patrocínios e parcerias garantem espaço de mídia em shows, redes sociais e no site oficial. Peça uma proposta sem compromisso.</p></div>
        {sponsorshipLink ? <a href={sponsorshipLink} target="_blank" rel="noreferrer" className={`${btnGold} shrink-0`}><MessageCircle className="h-4 w-4" /> Quero patrocinar</a> : <Link to="/contato" className={`${btnGold} shrink-0`}><MessageCircle className="h-4 w-4" /> Quero patrocinar</Link>}
      </div>
    </section>
  );
}
