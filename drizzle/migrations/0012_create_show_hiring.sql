CREATE TABLE public.show_packages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_index integer NOT NULL DEFAULT 0,
  code text NOT NULL DEFAULT '',
  title text NOT NULL DEFAULT '',
  duration text NOT NULL DEFAULT '',
  formation text NOT NULL DEFAULT '',
  price numeric(10,2) NOT NULL DEFAULT 0 CHECK (price >= 0),
  sound_included boolean NOT NULL DEFAULT false,
  description text NOT NULL DEFAULT '',
  is_highlighted boolean NOT NULL DEFAULT false,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.show_packages TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.show_packages TO authenticated;
GRANT ALL ON public.show_packages TO service_role;
ALTER TABLE public.show_packages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public reads active packages" ON public.show_packages FOR SELECT TO anon, authenticated USING (is_active);
CREATE POLICY "admin manages packages" ON public.show_packages FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE TABLE public.hiring_settings (
  id boolean PRIMARY KEY DEFAULT true CHECK (id),
  whatsapp_number text NOT NULL DEFAULT '',
  deposit_percentage integer NOT NULL DEFAULT 0 CHECK (deposit_percentage BETWEEN 0 AND 100),
  valid_cities text NOT NULL DEFAULT '',
  contract_terms_text text NOT NULL DEFAULT '',
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.hiring_settings TO anon;
GRANT SELECT, INSERT, UPDATE ON public.hiring_settings TO authenticated;
GRANT ALL ON public.hiring_settings TO service_role;
ALTER TABLE public.hiring_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public reads hiring settings" ON public.hiring_settings FOR SELECT TO anon, authenticated USING (id = true);
CREATE POLICY "admin inserts hiring settings" ON public.hiring_settings FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "admin updates hiring settings" ON public.hiring_settings FOR UPDATE TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

INSERT INTO public.show_packages (order_index, code, title, price) VALUES
  (1,'P01','Pacote P01',700),(2,'P02','Pacote P02',1000),(3,'P03','Pacote P03',1200);
INSERT INTO public.hiring_settings (id) VALUES (true);