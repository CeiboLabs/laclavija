-- ====================================================================
-- Simplificación: el rol admin lo da estar en auth.users.
-- Borramos la tabla admin_users y simplificamos is_admin().
-- ====================================================================

drop function if exists public.bootstrap_first_admin();
drop function if exists public.admin_users_exist();

drop policy if exists admin_users_select_admin on public.admin_users;
drop policy if exists admin_users_insert_admin on public.admin_users;
drop policy if exists admin_users_delete_admin on public.admin_users;

drop table if exists public.admin_users;

-- is_admin pasa a chequear simplemente que haya un usuario autenticado.
create or replace function public.is_admin()
returns boolean
language sql
stable
as $$
  select auth.uid() is not null;
$$;

grant execute on function public.is_admin() to anon, authenticated;
