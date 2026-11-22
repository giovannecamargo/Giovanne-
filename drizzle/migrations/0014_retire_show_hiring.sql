REVOKE ALL ON public.show_packages FROM anon, authenticated, service_role;
REVOKE ALL ON public.hiring_settings FROM anon, authenticated, service_role;
COMMENT ON TABLE public.show_packages IS 'DEPRECATED: contratação cancelada; tabela vazia e sem acesso, aguardando remoção definitiva.';
COMMENT ON TABLE public.hiring_settings IS 'DEPRECATED: contratação cancelada; tabela vazia e sem acesso, aguardando remoção definitiva.';