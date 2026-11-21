CREATE TABLE public.contact_settings (
  id boolean PRIMARY KEY DEFAULT true CHECK (id = true),
  email text NOT NULL DEFAULT '',
  phone text NOT NULL DEFAULT '',
  whatsapp text NOT NULL DEFAULT '',
  instagram_url text NOT NULL DEFAULT '',
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.contact_settings TO anon, authenticated;
GRANT INSERT, UPDATE ON public.contact_settings TO authenticated;
GRANT ALL ON public.contact_settings TO service_role;
ALTER TABLE public.contact_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Contact details are publicly readable"
ON public.contact_settings FOR SELECT
TO anon, authenticated
USING (true);
CREATE POLICY "Admins can insert contact details"
ON public.contact_settings FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update contact details"
ON public.contact_settings FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));