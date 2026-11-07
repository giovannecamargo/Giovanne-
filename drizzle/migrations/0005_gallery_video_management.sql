CREATE TABLE public.gallery_videos (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 video_path text NOT NULL,
 cover_path text NOT NULL,
 caption text NOT NULL,
 source_kind text NOT NULL DEFAULT 'storage',
 created_at timestamptz NOT NULL DEFAULT now(),
 CONSTRAINT gallery_video_caption_valid CHECK (length(btrim(caption)) BETWEEN 1 AND 500),
 CONSTRAINT gallery_video_source_valid CHECK (source_kind IN ('storage','asset')),
 CONSTRAINT gallery_video_paths_valid CHECK ((source_kind = 'storage' AND video_path ~ '^videos/[a-zA-Z0-9._/-]+$' AND cover_path ~ '^video-covers/[a-zA-Z0-9._/-]+$') OR (source_kind = 'asset' AND video_path ~ '^/__l5e/assets-v1/' AND cover_path ~ '^/__l5e/assets-v1/'))
);
GRANT SELECT ON public.gallery_videos TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.gallery_videos TO authenticated;
GRANT ALL ON public.gallery_videos TO service_role;
ALTER TABLE public.gallery_videos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public reads gallery videos" ON public.gallery_videos FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "admin writes gallery videos" ON public.gallery_videos FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));