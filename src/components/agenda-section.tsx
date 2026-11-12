import { useState } from "react";
import { Clock, Lock, MapPin, Users } from "lucide-react";
import { formatShowDate, useShows } from "@/lib/content";
import { normalizeShowAccess, showAccessLabel } from "@/lib/show-access";
import { normalizeSponsorLink } from "@/lib/sponsor-link";
import { btnGold, d, SectionTitle } from "@/components/site-ui";

export function Agenda() {
  const { data: shows, isLoading } = useShows();
  const [open, setOpen] = useState<number | null>(null);
  const events = (shows ?? []).map((event) => ({ ...formatShowDate(event.event_date), name: event.name, city: event.city, time: event.event_time, access: normalizeShowAccess(event.visibility), details: (event.details ?? "").trim(), ticket: normalizeSponsorLink(event.ticket_url) }));
  return (
    <section className="mx-auto max-w-5xl px-5 pb-24 pt-32">
      <SectionTitle eyebrow="Próximos shows" title="Agenda" />
      {!isLoading && !events.length && <p className="text-muted-foreground">Nenhum show agendado no momento. Fale com a gente para contratar!</p>}
      <div className="mt-6 space-y-4">
        {events.map((event, index) => (
          <article key={index} style={d(4 + index)} className="reveal grid grid-cols-[auto_minmax(0,1fr)] items-center gap-5 rounded-sm border border-border bg-card/40 p-4 transition-colors duration-300 hover:border-primary/50 sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:p-5">
            <div className="w-16 border-r border-primary/40 pr-5 text-center"><div className="font-display text-3xl font-bold text-primary">{event.day}</div><div className="text-xs tracking-widest text-muted-foreground">{event.month}</div></div>
            <div className="min-w-0">
              <h3 className="truncate font-semibold">{event.name}</h3>
              <div className="mt-1 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
                <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{event.city}</span>
                <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{event.time}</span>
                <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium tracking-wide ${event.access === "private" ? "border-border text-muted-foreground" : "border-primary/40 text-primary"}`}>{event.access === "private" ? <Lock className="h-3 w-3" /> : <Users className="h-3 w-3" />}{showAccessLabel(event.access)}</span>
              </div>
            </div>
            <div className="col-span-2 flex flex-wrap items-center gap-4 sm:col-span-1 sm:justify-end">
              {event.ticket && <a href={event.ticket} target="_blank" rel="noopener noreferrer" className={`${btnGold} px-4 py-2 text-xs`}>Comprar ingresso</a>}
              <button type="button" aria-expanded={open === index} onClick={() => setOpen(open === index ? null : index)} className="text-sm text-primary hover:underline">{open === index ? "Fechar" : "Informações"}</button>
            </div>
            {open === index && <div className="col-span-full whitespace-pre-line border-t border-border pt-4 text-sm leading-relaxed text-muted-foreground">{event.details || "Mais informações sobre este show em breve."}</div>}
          </article>
        ))}
      </div>
    </section>
  );
}
