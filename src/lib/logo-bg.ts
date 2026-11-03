import { useEffect, useState } from "react";

const cache = new Map<string, string>();

/** Painel claro é o padrão quando não dá para ler a cor da própria logo. */
function fallback() {
  if (typeof document === "undefined") return "#ffffff";
  const v = getComputedStyle(document.documentElement).getPropertyValue("--panel").trim();
  return v || "#ffffff";
}

function median(nums: number[]) {
  if (!nums.length) return 0;
  const s = [...nums].sort((a, b) => a - b);
  return s[Math.floor(s.length / 2)] ?? 0;
}

/**
 * Cor dominante da borda de um bitmap. A borda é exatamente o que sobra ao lado
 * do logo quando ele não preenche o painel, então são essas faixas que ela deve
 * pintar. Mediana, e não média: um selo claro encostado na borda não desloca a cor.
 */
export function edgeColor(d: Uint8ClampedArray | number[], S: number): string {
  const r: number[] = [];
  const g: number[] = [];
  const b: number[] = [];
  const push = (i: number) => {
    r.push(d[i] ?? 0);
    g.push(d[i + 1] ?? 0);
    b.push(d[i + 2] ?? 0);
  };
  for (let x = 0; x < S; x++) {
    push(x * 4);
    push(((S - 1) * S + x) * 4);
  }
  for (let y = 0; y < S; y++) {
    push(y * S * 4);
    push((y * S + S - 1) * 4);
  }
  return `rgb(${median(r)}, ${median(g)}, ${median(b)})`;
}

async function sample(src: string): Promise<string> {
  const img = new Image();
  img.crossOrigin = "anonymous";
  await new Promise<void>((ok, no) => {
    img.onload = () => ok();
    img.onerror = () => no(new Error("logo nao carregou"));
    img.src = src;
  });

  const S = 48;
  const c = document.createElement("canvas");
  c.width = S;
  c.height = S;
  const ctx = c.getContext("2d", { willReadFrequently: true });
  if (!ctx) throw new Error("sem canvas");

  // Composa sobre o fundo padrão: logos transparentes continuam claras.
  ctx.fillStyle = fallback();
  ctx.fillRect(0, 0, S, S);
  ctx.drawImage(img, 0, 0, S, S);

  return edgeColor(ctx.getImageData(0, 0, S, S).data, S);
}

export async function readLogoBg(src: string): Promise<string> {
  const hit = cache.get(src);
  if (hit) return hit;
  try {
    const color = await sample(src);
    cache.set(src, color);
    return color;
  } catch {
    return fallback();
  }
}

/** Cor de fundo da própria logo, lida da borda do arquivo. undefined até saber. */
export function useLogoBg(src?: string) {
  const [bg, setBg] = useState<string | undefined>(() => (src ? cache.get(src) : undefined));
  useEffect(() => {
    if (!src) return;
    let alive = true;
    readLogoBg(src).then((c) => {
      if (alive) setBg(c);
    });
    return () => {
      alive = false;
    };
  }, [src]);
  return bg;
}
