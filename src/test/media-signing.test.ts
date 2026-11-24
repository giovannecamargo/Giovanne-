import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({ createClient: vi.fn(), createSignedUrls: vi.fn() }));
vi.mock("@supabase/supabase-js", () => ({ createClient: mocks.createClient }));
vi.mock("@/integrations/supabase/client.server", () => ({
  supabaseAdmin: { storage: { from: () => ({ createSignedUrls: mocks.createSignedUrls }) } },
}));
import { signPublishedMedia } from "@/lib/media-signing.server";

describe("public media verification", () => {
  beforeEach(() => {
    vi.stubEnv("SUPABASE_URL", "https://storage.example");
    vi.stubEnv("SUPABASE_PUBLISHABLE_KEY", "public-test-key");
    vi.stubEnv("VITE_SUPABASE_URL", "https://storage.example");
    mocks.createSignedUrls.mockReset();
    mocks.createClient.mockImplementation(() => ({ from: (table: string) => {
      const query = {
        select: () => query, in: () => query, lte: () => query, gt: () => query,
        then: (resolve: (value: unknown) => unknown) => Promise.resolve(resolve({ error: null, data: table === "sponsors" ? [{ logo_url: "sponsors/live.png" }] : table === "gallery_videos" ? [{ video_path: "videos/live.mp4", cover_path: "video-covers/live.png" }] : [] })),
      };
      return query;
    } }));
    mocks.createSignedUrls.mockImplementation(async (paths: string[]) => ({ error: null, data: paths.map(path => ({ path, signedUrl: `https://storage.example/storage/v1/object/sign/media/${path}?token=test` })) }));
  });

  it("signs published videos and sponsors but never unrelated private files", async () => {
    const result = await signPublishedMedia({ paths: ["sponsors/live.png", "videos/live.mp4", "private/secret.png"] });
    expect(mocks.createSignedUrls).toHaveBeenCalledWith(["sponsors/live.png", "videos/live.mp4"], 21600);
    expect(Object.keys(result)).toEqual(["sponsors/live.png", "videos/live.mp4"]);
  });

  it("signs the published photo tagged Sobre", async () => {
    mocks.createClient.mockImplementation(() => ({ from: (table: string) => {
      const query = {
        select: () => query, in: () => query, lte: () => query, gt: () => query,
        then: (resolve: (value: unknown) => unknown) => Promise.resolve(resolve({ error: null, data: table === "photos" ? [{ url: "sobre/current.jpg" }] : [] })),
      };
      return query;
    } }));

    const result = await signPublishedMedia({ paths: ["sobre/current.jpg"] });

    expect(mocks.createSignedUrls).toHaveBeenCalledWith(["sobre/current.jpg"], 21600);
    expect(Object.keys(result)).toEqual(["sobre/current.jpg"]);
  });

  it("does not access storage for an unpublished file", async () => {
    expect(await signPublishedMedia({ paths: ["private/secret.png"] })).toEqual({});
    expect(mocks.createSignedUrls).not.toHaveBeenCalled();
  });
});