import type { CSSProperties, ReactNode } from "react";

export const btnGold = "inline-flex items-center justify-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition duration-300 hover:brightness-110";
export const btnOutline = "inline-flex items-center justify-center gap-2 rounded-md border border-primary/70 px-6 py-3 text-sm font-medium text-foreground transition duration-300 hover:bg-primary/10";

export const d = (i: number) => ({ "--d": `${i * 90}ms` }) as CSSProperties;

export function SectionTitle({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="mb-12">
      <p className="eyebrow reveal text-primary" style={d(0)}>{eyebrow}</p>
      <h1 className="reveal mt-3 text-3xl font-bold sm:text-5xl" style={d(1)}>{title}</h1>
      <div className="gold-rule mt-5 h-px w-16 bg-primary" style={d(2)} />
    </div>
  );
}

export function Placeholder({ children }: { children: ReactNode }) {
  return <span className="inline-block rounded-sm border border-dashed border-primary/50 px-2 py-0.5 text-[10px] uppercase tracking-widest text-primary">{children}</span>;
}
