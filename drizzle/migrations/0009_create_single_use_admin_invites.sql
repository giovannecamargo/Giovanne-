create table public.admin_invites (
  id uuid primary key default gen_random_uuid(),
  token_hash text not null unique,
  expires_at timestamp with time zone not null,
  used_at timestamp with time zone,
  used_by uuid,
  created_at timestamp with time zone not null default now()
);

grant all on public.admin_invites to service_role;

alter table public.admin_invites enable row level security;

create or replace function public.consume_admin_invite(invite_token text, invited_user_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  invite_id uuid;
begin
  if auth.uid() is null or auth.uid() <> invited_user_id then
    raise exception 'Acesso não autorizado para utilizar este convite.';
  end if;

  update public.admin_invites
  set used_at = now(), used_by = invited_user_id
  where token_hash = encode(sha256(invite_token::bytea), 'hex')
    and used_at is null
    and expires_at > now()
  returning id into invite_id;

  if invite_id is null then
    raise exception 'Convite inválido, expirado ou já utilizado.';
  end if;

  insert into public.user_roles (user_id, role)
  values (invited_user_id, 'admin')
  on conflict (user_id, role) do nothing;
end;
$$;

revoke all on function public.consume_admin_invite(text, uuid) from public;
grant execute on function public.consume_admin_invite(text, uuid) to authenticated;
grant execute on function public.consume_admin_invite(text, uuid) to service_role;