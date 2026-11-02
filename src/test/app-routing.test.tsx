import { QueryClient } from "@tanstack/react-query";
import { createRouter, rootRouteId } from "@tanstack/react-router";
import { describe, expect, it } from "vitest";

import { routeTree } from "@/routeTree.gen";
import { nav } from "@/data/site";

// Match routes without running loaders or rendering: loaders may need a server or
// network the test run lacks, and jsdom never loads the stylesheets React waits on.
describe("App routing", () => {
  it("matches a page for / instead of falling back to not found", () => {
    const router = createRouter({ routeTree, context: { queryClient: new QueryClient() } });

    const matches = router.matchRoutes("/");

    expect(matches.at(-1)?.routeId).not.toBe(rootRouteId);
  });

  // Every header menu item must have a real page: a nav entry pointing at a
  // missing route file renders the 404 screen.
  it("has a real page for every header menu item", () => {
    const router = createRouter({ routeTree, context: { queryClient: new QueryClient() } });

    for (const item of nav) {
      const matches = router.matchRoutes(item.to);
      expect(matches.at(-1)?.routeId, `menu item ${item.to} has no page`).not.toBe(rootRouteId);
    }
  });
});
