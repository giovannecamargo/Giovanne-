import { Link } from "@tanstack/react-router";
import { ArrowRight, Quote } from "lucide-react";
import { photos } from "@/data/site";
import { bio } from "@/data/bio";
import { btnOutline, d, Placeholder, SectionTitle } from "@/components/site-ui";

export function About() {
  return (
    <>
      <section className="mx-auto grid max-w-7xl items-center gap-12 px-5 pb-14 pt-32 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <img src={photos.pb} width={851} height={1849} alt="Giovanne Camargo em apresentação" loading="eager" fetchPriority="high" decoding="async" className="reveal-img aspect-[4/5] w-full rounded-sm object-cover object-top" />
        <div>
          <SectionTitle eyebrow="Biografia" title="Sobre o Artista" />
          <p className="reveal mt-2 text-lg leading-relaxed text-foreground/90 sm:text-xl" style={d(3)}>{bio.lead}</p>
          <dl className="reveal mt-8 grid grid-cols-2 gap-x-6 gap-y-5 border-t border-border pt-6" style={d(4)}>
            {bio.facts.map((fact) => <div key={fact.label}><dt className="eyebrow text-primary">{fact.label}</dt><dd className="mt-1 text-sm font-medium sm:text-base">{fact.value}</dd></div>)}
          </dl>
          <Link to="/contato" className={`${btnOutline} reveal mt-8`} style={d(5)}>Fale com o artista <ArrowRight className="h-4 w-4" /></Link>
        </div>
      </section>
      <section className="mx-auto max-w-4xl px-5 pb-16">
        {bio.sections.map((section, index) => (
          <article key={section.title} className="reveal border-t border-border py-9 first:border-t-0 first:pt-0" style={d(3 + index)}>
            <h2 className="flex items-baseline gap-4 text-xl font-bold sm:text-2xl"><span className="font-display text-xs font-bold tabular-nums tracking-widest text-primary/70">{String(index + 1).padStart(2, "0")}</span>{section.title}</h2>
            <div className="mt-4 space-y-4 sm:pl-9">{section.paragraphs.map((paragraph, paragraphIndex) => <p key={paragraphIndex} className="leading-relaxed text-muted-foreground">{paragraph}</p>)}</div>
          </article>
        ))}
      </section>
      <section className="mx-auto max-w-4xl px-5 pb-24"><blockquote className="reveal border-l-2 border-primary pl-6" style={d(4)}><p className="font-display text-lg font-semibold leading-relaxed sm:text-2xl">{bio.tagline}</p></blockquote></section>
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
        {kinds.map((kind, index) => (
          <figure key={kind} className="reveal rounded-sm border border-border bg-card/50 p-7" style={d(7 + index)}>
            <Quote className="h-6 w-6 text-primary" />
            <blockquote className="mt-4 text-muted-foreground">Espaço reservado para depoimento real.</blockquote>
            <figcaption className="mt-6 text-sm"><div className="font-semibold">Nome do contratante</div><div className="text-muted-foreground">{kind}</div></figcaption>
            <div className="mt-4"><Placeholder>Provisório</Placeholder></div>
          </figure>
        ))}
      </div>
    </section>
  );
}
