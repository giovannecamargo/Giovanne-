import { Instagram, Mail, MessageCircle, Phone } from "lucide-react";
import { emailLink, emptyContactInfo, phoneLink, whatsappLink } from "@/lib/contact-info";
import { useContactInfo } from "@/lib/use-contact-info";
import { btnGold, btnOutline, d } from "@/components/site-ui";
import { Button } from "@/components/ui/button";

export function Contact() {
  const { data: contact = emptyContactInfo, isLoading, isError, refetch } = useContactInfo();
  const whatsapp = whatsappLink(contact.whatsapp);
  const email = emailLink(contact.email);
  const phone = phoneLink(contact.phone);
  return (
    <section className="relative flex min-h-[80svh] items-center overflow-hidden">
      <div className="absolute inset-0 bg-glow-warm opacity-60" />
      <div className="relative mx-auto w-full max-w-4xl px-5 pb-20 pt-36 text-center">
        <p className="eyebrow reveal text-primary" style={d(0)}>Contratação</p>
        <h1 className="reveal mt-4 text-4xl font-extrabold sm:text-6xl">VAMOS FAZER<br /><span className="text-gold-gradient">UM EVENTO?</span></h1>
        <p className="reveal mx-auto mt-6 max-w-md text-muted-foreground" style={d(2)}>Entre em contato e conheça as possibilidades de contratação de Giovanne Camargo.</p>
        <div className="reveal mt-10 flex flex-wrap justify-center gap-3" style={d(3)}>
          {whatsapp && <a href={whatsapp} target="_blank" rel="noreferrer" className={btnGold}><MessageCircle className="h-4 w-4" /> Chamar no WhatsApp</a>}
          {contact.instagramUrl && <a href={contact.instagramUrl} target="_blank" rel="noreferrer" className={btnOutline}><Instagram className="h-4 w-4" /> Instagram</a>}
        </div>
        {(email || phone) && <address className="reveal mx-auto mt-8 grid max-w-xl gap-3 not-italic sm:grid-cols-2" style={d(4)}>
          {phone && <a href={phone} className="flex items-center justify-center gap-3 rounded-sm border border-border bg-card/40 p-4 text-left transition-colors hover:border-primary/50"><Phone className="size-5 shrink-0 text-primary" /><span><span className="block text-xs text-muted-foreground">Telefone</span><strong className="text-sm font-medium">{contact.phone}</strong></span></a>}
          {email && <a href={email} className="flex items-center justify-center gap-3 rounded-sm border border-border bg-card/40 p-4 text-left transition-colors hover:border-primary/50"><Mail className="size-5 shrink-0 text-primary" /><span className="min-w-0"><span className="block text-xs text-muted-foreground">E-mail</span><strong className="block break-all text-sm font-medium">{contact.email}</strong></span></a>}
        </address>}
        {isLoading && <p role="status" className="mt-8 text-sm text-muted-foreground">Carregando contatos…</p>}
        {isError && <div role="alert" className="mt-8 flex flex-wrap items-center justify-center gap-3 text-sm text-muted-foreground">Não foi possível carregar os contatos.<Button variant="outline" onClick={() => refetch()}>Tentar novamente</Button></div>}
        {!isLoading && !isError && !whatsapp && !contact.instagramUrl && !email && !phone && <p className="mt-8 text-sm text-muted-foreground">Novos canais de contato em breve.</p>}
      </div>
    </section>
  );
}
