-- ====================================================================
-- La Clavija — tracking de vistas y clicks
-- ====================================================================

create table public.guitar_events (
  id bigserial primary key,
  guitar_id uuid not null references public.guitars(id) on delete cascade,
  kind text not null check (kind in ('view','wa_click')),
  session_id text,
  created_at timestamptz not null default now()
);

create index guitar_events_guitar_id_kind_idx
  on public.guitar_events(guitar_id, kind);
create index guitar_events_created_at_idx
  on public.guitar_events(created_at desc);

alter table public.guitar_events enable row level security;

-- Cualquiera (anon o authenticated) puede insertar eventos válidos.
create policy guitar_events_insert_public on public.guitar_events
  for insert with check (kind in ('view','wa_click'));

-- Sólo admins pueden leer / borrar.
create policy guitar_events_select_admin on public.guitar_events
  for select using (public.is_admin());
create policy guitar_events_delete_admin on public.guitar_events
  for delete using (public.is_admin());

-- RPC: stats agregadas por guitarra para los últimos N días.
-- Como guitar_events tiene RLS de SELECT restringida a admins,
-- la función sólo devuelve filas si la llama un admin (sin security definer).
create or replace function public.guitar_stats(days integer default 30)
returns table (
  guitar_id uuid,
  views bigint,
  unique_views bigint,
  wa_clicks bigint
)
language sql
stable
as $$
  select
    guitar_id,
    count(*) filter (where kind = 'view')::bigint as views,
    count(distinct session_id) filter (where kind = 'view')::bigint as unique_views,
    count(*) filter (where kind = 'wa_click')::bigint as wa_clicks
  from public.guitar_events
  where created_at > now() - (greatest(days,1) || ' days')::interval
  group by guitar_id;
$$;

grant execute on function public.guitar_stats(integer) to authenticated;

-- Totales rápidos del sitio para el dashboard.
create or replace function public.site_stats(days integer default 30)
returns table (
  total_views bigint,
  total_unique_views bigint,
  total_wa_clicks bigint
)
language sql
stable
as $$
  select
    count(*) filter (where kind = 'view')::bigint as total_views,
    count(distinct session_id) filter (where kind = 'view')::bigint as total_unique_views,
    count(*) filter (where kind = 'wa_click')::bigint as total_wa_clicks
  from public.guitar_events
  where created_at > now() - (greatest(days,1) || ' days')::interval;
$$;

grant execute on function public.site_stats(integer) to authenticated;
