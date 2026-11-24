import { Link } from "@tanstack/react-router";
import { MessageCircle, Music2, PlayCircle, Users } from "lucide-react";
import { photos } from "@/data/site";
import { whatsappLink } from "@/lib/contact-info";
import { useContactInfo } from "@/lib/use-contact-info";
import { btnGold, btnOutline, d } from "@/components/site-ui";

export function Hero() {
  const { data: contact } = useContactInfo();
  const hiringLink = whatsappLink(contact?.whatsapp);
  return (
    <section className="relative min-h-[100svh] overflow-hidden">
      <div className="absolute inset-0 bg-glow-warm" />
      <img src={photos.palco} width={944} height={1666} loading="eager" fetchPriority="high" decoding="async" alt="Giovanne Camargo cantando ao vivo com violão" className="reveal-img absolute inset-y-0 right-0 h-full w-full object-cover object-top opacity-70 md:w-[65%] md:opacity-100 md:[mask-image:linear-gradient(to_right,transparent,black_35%)]" />
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-transparent md:via-background/40" />
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-background to-transparent" />
      <div className="relative mx-auto flex min-h-[100svh] max-w-7xl items-end px-5 pb-20 pt-32 md:items-center md:pb-24">
        <div className="max-w-xl">
          <p className="eyebrow reveal" style={d(1)}>Cantor • Shows • Eventos</p>
          <h1 className="reveal mt-5 text-5xl font-extrabold leading-[0.95] sm:text-7xl" style={d(2)}>GIOVANNE<br /><span className="text-gold-gradient">CAMARGO</span></h1>
          <p className="reveal mt-6 max-w-sm text-lg text-foreground/85" style={d(3)}>Música que conecta pessoas e transforma momentos em boas memórias.</p>
          <div className="reveal mt-8 flex flex-wrap gap-3" style={d(4)}>
            {hiringLink ? <a href={hiringLink} target="_blank" rel="noreferrer" className={btnGold}><MessageCircle className="h-4 w-4" /> Contratar Show</a> : <Link to="/contato" className={btnGold}><MessageCircle className="h-4 w-4" /> Contratar Show</Link>}
            <Link to="/shows" className={btnOutline}>Ver Shows</Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Highlights() {
  const items = [
    { icon: Music2, t: "Shows e Eventos", description: "Eventos particulares, corporativos e festivais.", to: "/shows" },
    { icon: Users, t: "Contratação", description: "Fale diretamente pelo WhatsApp.", to: "/contato" },
    { icon: PlayCircle, t: "Vídeos dos Shows", description: "Assista às apresentações ao vivo.", to: "/shows" },
  ];
  return (
    <section className="border-y border-border bg-card/60">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-y-10 px-5 py-12 lg:grid-cols-3">
        {items.map(({ icon: Icon, t, description, to }, index) => (
          <Link key={t} to={to} className="reveal group px-3 text-center" style={d(5 + index)}>
            <Icon className="mx-auto h-8 w-8 text-primary transition duration-300 group-hover:-translate-y-1" strokeWidth={1.4} />
            <h3 className="mt-4 text-sm font-semibold sm:text-base">{t}</h3>
            <p className="mt-1 text-xs text-muted-foreground sm:text-sm">{description}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
