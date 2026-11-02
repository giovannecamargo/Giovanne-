create type public.app_role as enum ('admin');
create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role app_role not null,
  unique (user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;
create policy "own roles" on public.user_roles for select to authenticated using (user_id = auth.uid());

create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

-- First account ever created becomes the single admin
create or replace function public.assign_first_admin()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if not exists (select 1 from public.user_roles where role = 'admin') then
    insert into public.user_roles (user_id, role) values (new.id, 'admin');
  end if;
  return new;
end $$;
create trigger on_auth_user_created_admin after insert on auth.users
for each row execute function public.assign_first_admin();

create or replace function public.admin_exists()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where role = 'admin')
$$;
grant execute on function public.admin_exists() to anon, authenticated;

create table public.sponsors (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  logo_url text not null,
  starts_at timestamptz not null default now(),
  ends_at timestamptz not null,
  created_at timestamptz not null default now()
);
grant select on public.sponsors to anon, authenticated;
grant insert, update, delete on public.sponsors to authenticated;
grant all on public.sponsors to service_role;
alter table public.sponsors enable row level security;
create policy "public sees active sponsors" on public.sponsors for select to anon, authenticated
  using (now() >= starts_at and now() < ends_at);
create policy "admin reads all sponsors" on public.sponsors for select to authenticated using (public.has_role(auth.uid(), 'admin'));
create policy "admin writes sponsors" on public.sponsors for all to authenticated
  using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));

create table public.shows (
  id uuid primary key default gen_random_uuid(),
  event_date date not null,
  event_time text not null default '',
  name text not null,
  city text not null default '',
  created_at timestamptz not null default now()
);
grant select on public.shows to anon, authenticated;
grant insert, update, delete on public.shows to authenticated;
grant all on public.shows to service_role;
alter table public.shows enable row level security;
create policy "public reads shows" on public.shows for select to anon, authenticated using (true);
create policy "admin writes shows" on public.shows for all to authenticated
  using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));

create table public.photos (
  id uuid primary key default gen_random_uuid(),
  url text not null,
  section text not null check (section in ('shows','galeria')),
  alt text not null default '',
  created_at timestamptz not null default now()
);
grant select on public.photos to anon, authenticated;
grant insert, update, delete on public.photos to authenticated;
grant all on public.photos to service_role;
alter table public.photos enable row level security;
create policy "public reads photos" on public.photos for select to anon, authenticated using (true);
create policy "admin writes photos" on public.photos for all to authenticated
  using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));