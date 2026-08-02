-- ====================================================================
-- 0009 — Blog posts
--
-- Nueva seccion editorial para SEO. Los posts son creados desde el admin,
-- con editor Tiptap (HTML). Cover image en bucket separado `blog-covers`
-- (los admin no deberian mezclar covers con fotos de guitarras).
-- ====================================================================

create table public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  subtitle text,
  content text not null default '',
  cover_image_path text,
  published boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index blog_posts_published_idx on public.blog_posts(published, published_at desc);
create index blog_posts_created_at_idx on public.blog_posts(created_at desc);

-- Auto-actualizar updated_at reusando la funcion existente
create trigger set_blog_posts_updated_at
  before update on public.blog_posts
  for each row execute function public.set_updated_at();

-- ====================================================================
-- RLS
-- ====================================================================
alter table public.blog_posts enable row level security;

-- Lectura publica solo si esta publicado
create policy blog_posts_select_public on public.blog_posts
  for select using (published = true);

-- Admins ven todo (incluye borradores)
create policy blog_posts_select_admin on public.blog_posts
  for select using (public.is_admin());

create policy blog_posts_insert_admin on public.blog_posts
  for insert with check (public.is_admin());

create policy blog_posts_update_admin on public.blog_posts
  for update using (public.is_admin()) with check (public.is_admin());

create policy blog_posts_delete_admin on public.blog_posts
  for delete using (public.is_admin());

-- ====================================================================
-- Storage bucket "blog-covers"
-- ====================================================================
insert into storage.buckets (id, name, public)
values ('blog-covers', 'blog-covers', true)
on conflict (id) do nothing;

create policy blog_covers_bucket_select_public on storage.objects
  for select using (bucket_id = 'blog-covers');

create policy blog_covers_bucket_insert_admin on storage.objects
  for insert with check (bucket_id = 'blog-covers' and public.is_admin());

create policy blog_covers_bucket_update_admin on storage.objects
  for update using (bucket_id = 'blog-covers' and public.is_admin())
  with check (bucket_id = 'blog-covers' and public.is_admin());

create policy blog_covers_bucket_delete_admin on storage.objects
  for delete using (bucket_id = 'blog-covers' and public.is_admin());
