ALTER TABLE public.photos DROP CONSTRAINT IF EXISTS photos_section_check;

ALTER TABLE public.photos
ADD CONSTRAINT photos_section_check
CHECK (section = ANY (ARRAY['shows'::text, 'galeria'::text, 'sobre'::text]));

DROP POLICY IF EXISTS "public reads site photos" ON public.photos;

CREATE POLICY "public reads site photos"
ON public.photos
FOR SELECT
TO anon, authenticated
USING (section = ANY (ARRAY['shows'::text, 'galeria'::text, 'sobre'::text]));

INSERT INTO public.photos (url, section, alt)
SELECT 'sobre/giovanne-pb.jpg', 'sobre', 'Giovanne Camargo em apresentação, foto em preto e branco'
WHERE NOT EXISTS (
  SELECT 1 FROM public.photos
  WHERE url = 'sobre/giovanne-pb.jpg' AND section = 'sobre'
);