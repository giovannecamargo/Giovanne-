import { describe, expect, it } from "vitest";

import { edgeColor } from "@/lib/logo-bg";

// The sponsor panel keeps a fixed size, so a logo that does not fill it leaves
// side strips. Those strips must take the logo's own background color, never a
// white card and never a color washed out by the artwork itself.
const S = 8;

function bitmap(paint: (x: number, y: number) => [number, number, number]) {
  const d = new Uint8ClampedArray(S * S * 4);
  for (let y = 0; y < S; y++) {
    for (let x = 0; x < S; x++) {
      const [r, g, b] = paint(x, y);
      const i = (y * S + x) * 4;
      d[i] = r;
      d[i + 1] = g;
      d[i + 2] = b;
      d[i + 3] = 255;
    }
  }
  return d;
}

describe("Sponsor panel background color", () => {
  it("is the logo's own dark background so the empty sides blend in", () => {
    const d = bitmap((x, y) => (x > 1 && x < 6 && y > 1 && y < 6 ? [10, 200, 120] : [0, 0, 0]));
    expect(edgeColor(d, S)).toBe("rgb(0, 0, 0)");
  });

  it("is white for a logo painted on white", () => {
    expect(edgeColor(bitmap(() => [255, 255, 255]), S)).toBe("rgb(255, 255, 255)");
  });

  it("is the brand color when the logo background is colored", () => {
    expect(edgeColor(bitmap(() => [12, 90, 60]), S)).toBe("rgb(12, 90, 60)");
  });

  it("ignores a bright badge touching the edge instead of averaging it in", () => {
    const d = bitmap((x) => (x >= 6 ? [30, 40, 255] : [0, 0, 0]));
    expect(edgeColor(d, S)).toBe("rgb(0, 0, 0)");
  });
});
