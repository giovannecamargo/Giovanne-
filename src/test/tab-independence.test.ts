import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { describe, expect, it } from "vitest";

// Tabs must never influence each other: nothing the interface remembers may be
// written to storage the browser shares between tabs. Per-tab state lives in
// React state, the URL, or the router's own per-tab scroll cache.
const SHARED_STATE = /\b(localStorage|sessionStorage|indexedDB|BroadcastChannel|document\.cookie)\b/;

function sourceFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) return sourceFiles(full);
    if (!/\.(ts|tsx)$/.test(entry)) return [];
    if (entry === "routeTree.gen.ts") return [];
    if (full.includes("/test/")) return [];
    return [full];
  });
}

describe("Tab independence", () => {
  const files = sourceFiles(join(process.cwd(), "src"));

  it("scans the app source", () => {
    expect(files.length).toBeGreaterThan(5);
  });

  it("keeps no interface state in storage shared between tabs", () => {
    const offenders = files
      .map((file) => {
        const line = readFileSync(file, "utf8").split("\n").findIndex((l) => SHARED_STATE.test(l));
        return line === -1 ? null : `${relative(process.cwd(), file)}:${line + 1}`;
      })
      .filter(Boolean);

    expect(offenders).toEqual([]);
  });
});
