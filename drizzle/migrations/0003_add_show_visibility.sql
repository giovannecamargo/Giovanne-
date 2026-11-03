ALTER TABLE public.shows
  ADD COLUMN visibility text NOT NULL DEFAULT 'public'
  CHECK (visibility IN ('public','private'));

COMMENT ON COLUMN public.shows.visibility IS
  'public = show aberto ao público; private = evento fechado (particular ou corporativo).';