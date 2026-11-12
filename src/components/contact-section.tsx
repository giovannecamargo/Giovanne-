import { Instagram, MessageCircle } from "lucide-react";
import { INSTAGRAM_URL, whatsappLink } from "@/data/site";
import { btnGold, btnOutline, d } from "@/components/site-ui";

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
