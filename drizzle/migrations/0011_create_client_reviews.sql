CREATE TABLE public.reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_name text NOT NULL,
  client_role text NOT NULL DEFAULT '',
  rating integer NOT NULL,
  comment text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT reviews_client_name_length CHECK (char_length(btrim(client_name)) BETWEEN 2 AND 80),
  CONSTRAINT reviews_client_role_length CHECK (char_length(client_role) <= 80),
  CONSTRAINT reviews_rating_range CHECK (rating BETWEEN 1 AND 5),
  CONSTRAINT reviews_comment_length CHECK (char_length(btrim(comment)) BETWEEN 10 AND 1000),
  CONSTRAINT reviews_status_valid CHECK (status IN ('pending', 'approved', 'rejected'))
);

GRANT SELECT, INSERT ON public.reviews TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.reviews TO authenticated;
GRANT ALL ON public.reviews TO service_role;

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public reads approved reviews"
ON public.reviews FOR SELECT
TO anon, authenticated
USING (status = 'approved');

CREATE POLICY "Public submits pending reviews"
ON public.reviews FOR INSERT
TO anon, authenticated
WITH CHECK (status = 'pending');

CREATE POLICY "Admins manage all reviews"
ON public.reviews FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::public.app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE INDEX reviews_status_created_at_idx ON public.reviews (status, created_at DESC);