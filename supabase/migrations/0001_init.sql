-- ====================================================================
-- La Clavija — schema inicial
-- ====================================================================

create extension if not exists "pgcrypto";

-- ====================================================================
-- 1) admin_users
-- ====================================================================
create table public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  created_at timestamptz not null default now(),
  invited_by uuid references auth.users(id) on delete set null
);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admin_users
    where user_id = auth.uid()
  );
$$;

grant execute on function public.is_admin() to anon, authenticated;

create or replace function public.admin_users_exist()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.admin_users);
$$;

grant execute on function public.admin_users_exist() to anon, authenticated;

-- Bootstrap: el primer usuario autenticado puede auto-elevarse a admin.
-- Bloquea cualquier llamada posterior si ya hay admins.
create or replace function public.bootstrap_first_admin()
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_email text;
begin
  if v_uid is null then
    raise exception 'Not authenticated';
  end if;

  if exists (select 1 from public.admin_users) then
    raise exception 'Bootstrap already completed';
  end if;

  select email into v_email from auth.users where id = v_uid;

  insert into public.admin_users (user_id, email)
  values (v_uid, v_email);
end;
$$;

grant execute on function public.bootstrap_first_admin() to authenticated;

-- ====================================================================
-- 2) guitars
-- ====================================================================
create table public.guitars (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  brand text not null,
  model text not null,
  year integer not null,
  type text not null check (type in ('electric','acoustic','classical','bass')),
  price_usd integer not null check (price_usd >= 0),
  status text not null default 'available' check (status in ('available','reserved','sold')),
  featured boolean not null default false,
  short_description text not null default '',
  long_description text not null default '',
  specs jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index guitars_status_idx on public.guitars(status);
create index guitars_type_idx on public.guitars(type);
create index guitars_brand_idx on public.guitars(brand);
create index guitars_featured_idx on public.guitars(featured) where featured;
create index guitars_created_at_idx on public.guitars(created_at desc);

-- ====================================================================
-- 3) guitar_images
-- ====================================================================
create table public.guitar_images (
  id uuid primary key default gen_random_uuid(),
  guitar_id uuid not null references public.guitars(id) on delete cascade,
  storage_path text not null,
  position integer not null default 0,
  created_at timestamptz not null default now()
);

create index guitar_images_guitar_id_idx on public.guitar_images(guitar_id, position);

-- ====================================================================
-- 4) promo_config (single-row pattern, id = 1)
-- ====================================================================
create table public.promo_config (
  id integer primary key default 1 check (id = 1),
  active boolean not null default false,
  title text not null default '',
  message text not null default '',
  cta_label text,
  cta_url text,
  expires_at timestamptz,
  updated_at timestamptz not null default now()
);

insert into public.promo_config (id) values (1);

-- ====================================================================
-- 5) Triggers de updated_at
-- ====================================================================
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create trigger set_guitars_updated_at
  before update on public.guitars
  for each row execute function public.set_updated_at();

create trigger set_promo_config_updated_at
  before update on public.promo_config
  for each row execute function public.set_updated_at();

-- ====================================================================
-- 6) RLS
-- ====================================================================
alter table public.admin_users enable row level security;
alter table public.guitars enable row level security;
alter table public.guitar_images enable row level security;
alter table public.promo_config enable row level security;

-- admin_users: sólo admins (lectura/escritura)
create policy admin_users_select_admin on public.admin_users
  for select using (public.is_admin());
create policy admin_users_insert_admin on public.admin_users
  for insert with check (public.is_admin());
create policy admin_users_delete_admin on public.admin_users
  for delete using (public.is_admin());

-- guitars: lectura pública, escritura admin
create policy guitars_select_public on public.guitars
  for select using (true);
create policy guitars_insert_admin on public.guitars
  for insert with check (public.is_admin());
create policy guitars_update_admin on public.guitars
  for update using (public.is_admin()) with check (public.is_admin());
create policy guitars_delete_admin on public.guitars
  for delete using (public.is_admin());

-- guitar_images: lectura pública, escritura admin
create policy guitar_images_select_public on public.guitar_images
  for select using (true);
create policy guitar_images_insert_admin on public.guitar_images
  for insert with check (public.is_admin());
create policy guitar_images_update_admin on public.guitar_images
  for update using (public.is_admin()) with check (public.is_admin());
create policy guitar_images_delete_admin on public.guitar_images
  for delete using (public.is_admin());

-- promo_config: lectura pública (front decide si mostrar según active), escritura admin
create policy promo_config_select_public on public.promo_config
  for select using (true);
create policy promo_config_update_admin on public.promo_config
  for update using (public.is_admin()) with check (public.is_admin());

-- ====================================================================
-- 7) Storage bucket "guitars" (público para read, admin para write)
-- ====================================================================
insert into storage.buckets (id, name, public)
values ('guitars', 'guitars', true)
on conflict (id) do nothing;

create policy guitars_bucket_select_public on storage.objects
  for select using (bucket_id = 'guitars');

create policy guitars_bucket_insert_admin on storage.objects
  for insert with check (bucket_id = 'guitars' and public.is_admin());

create policy guitars_bucket_update_admin on storage.objects
  for update using (bucket_id = 'guitars' and public.is_admin())
  with check (bucket_id = 'guitars' and public.is_admin());

create policy guitars_bucket_delete_admin on storage.objects
  for delete using (bucket_id = 'guitars' and public.is_admin());
